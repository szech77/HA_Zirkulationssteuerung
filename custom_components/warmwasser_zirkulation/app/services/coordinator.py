"""Serialize settings, bounded demand runs and persistence at the HA boundary."""
from __future__ import annotations

import asyncio
from copy import deepcopy
from dataclasses import replace
from datetime import datetime, timezone
import logging

from .detection import DetectionEngine
from ..models.detection import DetectorConfig, LearningModel, PumpState, Sample
from ..schemas.control import validate_control_settings
from .planning import permitted_until
from ..core.const import (
    CONF_MAX_STARTS,
    CONF_PUMP_ENTITY,
    CONF_RUNTIME_SECONDS,
    DEFAULT_MAX_STARTS,
    DEFAULT_RUNTIME_SECONDS,
)
from ..core.config import entry_configuration
from ..models.contracts import PumpGateway, PumpStartRefused, StateStore
from ..models.runtime import RuntimeState

_LOGGER = logging.getLogger(__name__)


class CirculationCoordinator:
    def __init__(self, pump: PumpGateway, store: StateStore, pump_entity: str, runtime_seconds: int = 120, max_starts: int = 6):
        self.pump, self.store, self.pump_entity = pump, store, pump_entity
        self._configured_runtime_seconds, self._configured_max_starts = runtime_seconds, max_starts
        self.runtime = RuntimeState()
        self.model = LearningModel()
        self.detector = DetectionEngine(DetectorConfig(), self.model)
        self.lock = asyncio.Lock()
        self._last_reported_reason = None
        self._stopping = False

    @property
    def runtime_seconds(self):
        return self.runtime.runtime_seconds if self.runtime.runtime_seconds is not None else self._configured_runtime_seconds

    @property
    def max_starts(self):
        return self.runtime.max_starts if self.runtime.max_starts is not None else self._configured_max_starts

    async def async_update_limits(self, runtime_seconds, max_starts):
        # The native options flow and panel share one revisioned persistence path.
        while True:
            revision = self.runtime.settings_revision
            values = {**self.settings(), "runtime_seconds": runtime_seconds, "max_starts": max_starts}
            try:
                await self.async_configure(values, revision)
                return
            except ValueError as error:
                if str(error) != "settings_conflict":
                    raise

    @classmethod
    def from_home_assistant(cls, hass, entry):
        from ..adapters.pump import HomeAssistantPumpGateway
        from ..db.runtime import HomeAssistantStateStore

        configuration = entry_configuration(entry)
        return cls(HomeAssistantPumpGateway(hass), HomeAssistantStateStore(hass, entry.entry_id),
                   configuration[CONF_PUMP_ENTITY], configuration.get(CONF_RUNTIME_SECONDS, DEFAULT_RUNTIME_SECONDS),
                   configuration.get(CONF_MAX_STARTS, DEFAULT_MAX_STARTS))

    def settings(self):
        return deepcopy({"mode": "active" if self.runtime.enabled and self.runtime.demand_automation else "monitoring",
                         "schedule": self.runtime.schedule, "vacation_active": self.runtime.vacation_active,
                         "vacation_windows": self.runtime.vacation_windows})

    async def async_configure(self, values, revision):
        values = validate_control_settings(values)
        async with self.lock:
            if type(revision) is not int or revision != self.runtime.settings_revision:
                raise ValueError("settings_conflict")
            active = values["mode"] == "active"
            candidate = replace(self.runtime, enabled=active, demand_automation=active, control_fault=False,
                                schedule=values["schedule"], vacation_active=values["vacation_active"],
                                vacation_windows=values["vacation_windows"], settings_revision=revision + 1,
                                runtime_seconds=values.get("runtime_seconds", self.runtime_seconds),
                                max_starts=values.get("max_starts", self.max_starts),
                                last_reason="waiting_for_demand" if active else "monitoring")
            # Publish settings only after successful durable persistence.
            await self.store.save(candidate.__dict__)
            self.runtime = candidate
            _LOGGER.info("Circulation settings saved", extra={"reason": "control_settings_saved"})

    async def async_set_mode(self, enabled):
        # HA switch and panel use the same serialization and persistence path.
        while True:
            revision = self.runtime.settings_revision
            values = self.settings()
            values["mode"] = "active" if enabled else "monitoring"
            try:
                await self.async_configure(values, revision)
                return
            except ValueError as error:
                if str(error) != "settings_conflict":
                    raise

    async def async_start(self):
        persisted = await self.store.load()
        self.runtime = RuntimeState(**{k: v for k, v in persisted.items() if k in RuntimeState.__dataclass_fields__})
        validate_control_settings(self.settings())
        if not persisted:
            await self.store.save(self.runtime.__dict__)
        _LOGGER.info("warmwater coordinator started", extra={"enabled": self.runtime.enabled})

    async def async_stop(self):
        # Keep an owned deadline for recovery if the physical stop fails.
        async with self.lock:
            self._stopping = True
            if self.runtime.pump_until:
                await self._stop_owned()
        _LOGGER.info("warmwater coordinator stopped")

    async def _reason(self, reason):
        if self.runtime.last_reason != reason:
            self.runtime.last_reason = reason
            await self.store.save(self.runtime.__dict__)
        if self._last_reported_reason != reason:
            log = (_LOGGER.error if reason == "pump_unreachable" else _LOGGER.warning
                   if reason in ("fresh_flow_value_missing", "pump_state_unknown", "calendar_unavailable") else _LOGGER.info)
            log("Circulation operating state changed", extra={"reason": reason})
            self._last_reported_reason = reason
        return reason

    async def _stop_owned(self):
        try:
            await self.pump.turn_off(self.pump_entity)
        except Exception:
            if not self.runtime.control_fault:
                self.runtime.control_fault = True
                await self.store.save(self.runtime.__dict__)
            return await self._reason("pump_unreachable")
        self.runtime.pump_until = None
        await self.store.save(self.runtime.__dict__)
        return "stopped"

    async def process(self, samples: list[Sample], now: datetime, holidays=frozenset(), *, calendar_ready=True, prediction=None):
        async with self.lock:
            if self._stopping:
                return "monitoring"
            active = self.runtime.enabled and self.runtime.demand_automation
            settings = self.settings()
            # Stop owned runs even when measurements disappear or monitoring is selected.
            if self.runtime.pump_until:
                deadline = self.runtime.pump_until
                if (not active or self.runtime.control_fault or not calendar_ready or now.timestamp() >= deadline.timestamp()
                        or permitted_until(settings, now, holidays=holidays) is None):
                    return await self._stop_owned()
                return await self._reason("pump_already_running")
            if self.runtime.control_fault:
                return await self._reason("pump_unreachable")
            if not samples or not 0 <= (now - samples[-1].at).total_seconds() <= 600:
                return await self._reason("fresh_flow_value_missing")
            if not active:
                return await self._reason("monitoring")
            if not calendar_ready:
                return await self._reason("calendar_unavailable")
            if permitted_until(settings, now, self.runtime_seconds, holidays) is None:
                return await self._reason("outside_schedule")
            if samples[-1].pump is not PumpState.OFF:
                return await self._reason("pump_state_unknown" if samples[-1].pump is PumpState.UNKNOWN else "pump_already_running")
            today = now.date().isoformat()
            if self.runtime.starts_date != today:
                self.runtime.starts_date, self.runtime.daily_starts = today, 0
            if self.runtime.daily_starts >= self.max_starts:
                return await self._reason("daily_limit_reached")
            events = [event for event in self.detector.detect(samples)
                      if self.runtime.last_trigger_at is None or event.at > datetime.fromisoformat(self.runtime.last_trigger_at)]
            due = (prediction is not None and -30 <= prediction.at.timestamp()-now.timestamp() <= 0
                   and prediction.identity != self.runtime.last_prediction_id)
            if not events and not due:
                return await self._reason("waiting_for_demand")
            if self.runtime.last_start_at and now.timestamp()-datetime.fromisoformat(self.runtime.last_start_at).timestamp() < 1200:
                return await self._reason("cooldown")
            if not self.pump_entity:
                return await self._reason("pump_entity_missing")
            # Persist intent before sending hardware commands, also covering interrupted starts.
            self.runtime.pump_until = datetime.fromtimestamp(now.timestamp() + self.runtime_seconds, timezone.utc)
            previous_start = self.runtime.last_start_at
            self.runtime.last_start_at = now.isoformat()
            if due:
                self.runtime.last_prediction_id = prediction.identity
            elif events:
                self.runtime.last_trigger_at = events[-1].at.isoformat()
            self.runtime.daily_starts += 1
            await self.store.save(self.runtime.__dict__)
            try:
                await self.pump.turn_on(self.pump_entity)
            except PumpStartRefused:
                # Another automation or a person started it: this run is not ours.
                self.runtime.pump_until = None
                self.runtime.last_start_at = previous_start
                self.runtime.daily_starts -= 1
                await self.store.save(self.runtime.__dict__)
                return await self._reason("pump_state_unknown")
            except Exception as error:
                self.runtime.control_fault = True
                _LOGGER.error("automatic pump start failed", extra={"reason": "pump_unreachable", "error_type": type(error).__name__})
                await self._stop_owned()
                self.runtime.last_start_at = previous_start
                self.runtime.daily_starts -= 1
                await self.store.save(self.runtime.__dict__)
                return await self._reason("pump_unreachable")
            await self._reason("learned_schedule" if due else "demand_event")
            return "started"
