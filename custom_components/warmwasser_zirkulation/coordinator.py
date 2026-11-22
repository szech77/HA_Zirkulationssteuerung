"""HA boundary: safe orchestration, persistence and structured logging."""

from __future__ import annotations

import logging
from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import Protocol

from .domain import DetectionEngine, DetectorConfig, LearningModel, Planner, PumpState, Sample

_LOGGER = logging.getLogger(__name__)


class PumpGateway(Protocol):
    async def turn_on(self, entity_id: str) -> None: ...
    async def turn_off(self, entity_id: str) -> None: ...


class StateStore(Protocol):
    async def load(self) -> dict: ...
    async def save(self, state: dict) -> None: ...


@dataclass
class RuntimeState:
    enabled: bool = False
    demand_automation: bool = False
    pump_until: datetime | None = None
    daily_starts: int = 0
    last_reason: str = "monitoring"


class CirculationCoordinator:
    """Fail-closed coordinator; unknown state never causes an automatic start."""

    def __init__(self, pump: PumpGateway, store: StateStore, pump_entity: str, runtime_seconds: int = 120, max_starts: int = 6):
        self.pump, self.store, self.pump_entity = pump, store, pump_entity
        self.runtime_seconds, self.max_starts = runtime_seconds, max_starts
        self.runtime = RuntimeState()
        self.model = LearningModel()
        self.detector = DetectionEngine(DetectorConfig(), self.model)

    @classmethod
    def from_home_assistant(cls, hass, entry):
        from .const import (
            CONF_MAX_STARTS, CONF_PUMP_ENTITY, CONF_RUNTIME_SECONDS,
            DEFAULT_MAX_STARTS, DEFAULT_RUNTIME_SECONDS,
        )
        from .ha_adapters import HomeAssistantPumpGateway, HomeAssistantStateStore

        return cls(
            HomeAssistantPumpGateway(hass),
            HomeAssistantStateStore(hass, entry.entry_id),
            entry.data[CONF_PUMP_ENTITY],
            entry.data.get(CONF_RUNTIME_SECONDS, DEFAULT_RUNTIME_SECONDS),
            entry.data.get(CONF_MAX_STARTS, DEFAULT_MAX_STARTS),
        )

    async def async_start(self) -> None:
        persisted = await self.store.load()
        self.runtime = RuntimeState(**{k: v for k, v in persisted.items() if k in RuntimeState.__dataclass_fields__})
        _LOGGER.info("warmwater coordinator started", extra={"pump_entity": self.pump_entity, "enabled": self.runtime.enabled})

    async def async_stop(self) -> None:
        _LOGGER.info("warmwater coordinator stopped")

    async def process(self, samples: list[Sample], now: datetime) -> str:
        if not samples or now - samples[-1].at > timedelta(minutes=10):
            return await self._pause("fresh_flow_value_missing")
        events = self.detector.detect(samples)
        if not self.runtime.enabled or not self.runtime.demand_automation:
            self.runtime.last_reason = "monitoring"
            await self.store.save(self.runtime.__dict__)
            return "monitoring"
        if self.runtime.pump_until and self.runtime.pump_until > now:
            return "pump_already_running"
        if self.runtime.daily_starts >= self.max_starts:
            return await self._pause("daily_limit_reached")
        if not events:
            return "no_draw_event"
        if not self.pump_entity:
            return await self._pause("pump_entity_missing")
        try:
            await self.pump.turn_on(self.pump_entity)
        except Exception as error:
            _LOGGER.error(
                "automatic pump start failed; automatic start paused",
                extra={"pump_entity": self.pump_entity, "reason": "pump_unreachable",
                       "error_type": type(error).__name__},
            )
            return await self._pause("pump_unreachable")
        self.runtime.pump_until = now + timedelta(seconds=self.runtime_seconds)
        self.runtime.daily_starts += 1
        self.runtime.last_reason = "demand_event"
        await self.store.save(self.runtime.__dict__)
        _LOGGER.info("automatic pump start", extra={"reason": "demand_event", "daily_starts": self.runtime.daily_starts})
        return "started"

    async def _pause(self, reason: str) -> str:
        self.runtime.last_reason = reason
        await self.store.save(self.runtime.__dict__)
        _LOGGER.warning("automatic start paused", extra={"reason": reason})
        return reason

