"""Home Assistant service and storage adapters for the coordinator contracts."""

from __future__ import annotations

import asyncio
from datetime import datetime
import re

from .const import DOMAIN
from .domain import default_schedule, validate_control_settings

from .persistence import SCHEMA_VERSION, migrate_runtime_payload

STORAGE_VERSION = SCHEMA_VERSION


class PumpStartRefused(ValueError):
    """No start command was sent because the current pump is not confirmed off."""



class HomeAssistantStateStore:
    """Persist runtime state under an entry-specific Home Assistant storage key."""

    def __init__(self, hass, entry_id: str):
        # Keep domain/coordinator unit tests independent of an installed HA runtime.
        from homeassistant.helpers.storage import Store

        class RuntimeStore(Store):
            async def _async_migrate_func(self, old_major_version, old_minor_version, old_data):
                if (old_major_version,old_minor_version)!=(1,1):
                    raise ValueError('Unsupported runtime storage version')
                migrated=migrate_runtime_payload(old_data)
                HomeAssistantStateStore._validate(migrated)
                HomeAssistantStateStore._validate_deadline(migrated)
                return migrated
        self._store = RuntimeStore(hass, STORAGE_VERSION, f"{DOMAIN}.{entry_id}")

    @staticmethod
    def _validate(state: dict) -> None:
        if 'schema_version' in state and (type(state['schema_version']) is not int or state['schema_version']!=SCHEMA_VERSION):
            raise ValueError('Unsupported runtime schema version')
        for key in ("enabled", "demand_automation", "control_fault"):
            if key in state and type(state[key]) is not bool:
                raise ValueError("Invalid persisted automation flag")
        validate_control_settings({"mode": "active" if state.get("enabled") and state.get("demand_automation") else "monitoring",
            "schedule": state.get("schedule", default_schedule()), "vacation_active": state.get("vacation_active", False),
            "vacation_windows": state.get("vacation_windows", [])})
        if "settings_revision" in state and (type(state["settings_revision"]) is not int or state["settings_revision"] < 0):
            raise ValueError("Invalid settings revision")
        for key in ("starts_date", "last_trigger_at", "last_start_at", "last_prediction_id"):
            if state.get(key) is not None:
                if not isinstance(state[key], str):
                    raise ValueError("Invalid persisted control date")
                from datetime import date
                if key == "starts_date":
                    date.fromisoformat(state[key])
                elif datetime.fromisoformat(state[key]).utcoffset() is None:
                    raise ValueError("Invalid persisted trigger time")
        if "daily_starts" in state:
            count = state["daily_starts"]
            if type(count) is not int or count < 0:
                raise ValueError("Invalid persisted pump start count")
        if "last_reason" in state and not isinstance(state["last_reason"], str):
            raise ValueError("Invalid persisted pump reason")

    @staticmethod
    def _validate_deadline(state):
        until=state.get('pump_until')
        if until is not None and (not isinstance(until,str) or datetime.fromisoformat(until).utcoffset() is None):
            raise ValueError('Invalid persisted pump deadline or timezone')

    async def load(self) -> dict:
        data = await self._store.async_load()
        if data is None:
            return {}
        if not isinstance(data, dict):
            raise ValueError("Invalid persisted runtime state")
        state = migrate_runtime_payload(data)
        self._validate(state)
        self._validate_deadline(state)
        if state != data:
            await self._store.async_save(state)
        until = state.get("pump_until")
        if until is not None:
            if not isinstance(until, str):
                raise ValueError("Invalid persisted pump deadline")
            try:
                deadline = datetime.fromisoformat(until)
            except ValueError:
                raise ValueError("Invalid persisted pump deadline") from None
            if deadline.utcoffset() is None:
                raise ValueError("Persisted pump deadline has no timezone")
            state["pump_until"] = deadline
        return state

    async def save(self, state: dict) -> None:
        payload = dict(state)
        payload.setdefault('schema_version',SCHEMA_VERSION)
        self._validate(payload)
        until = payload.get("pump_until")
        if until is not None:
            if not isinstance(until, datetime) or until.utcoffset() is None:
                raise ValueError("Pump deadline must have a timezone")
            payload["pump_until"] = until.isoformat()
        await self._store.async_save(payload)


class HomeAssistantPumpGateway:
    """Use blocking HA service calls; refuse starts with an unknown pump state."""

    def __init__(self, hass):
        self._hass = hass

    async def _call(self, entity_id: str, service: str) -> None:
        if not isinstance(entity_id, str) or not re.fullmatch(r"switch\.[a-z0-9_]+", entity_id):
            raise ValueError("Pump entity must be a switch")
        if service == "turn_on":
            state = self._hass.states.get(entity_id)
            if state is None or state.state != "off":
                raise PumpStartRefused("Pump is not confirmed off")
        async with asyncio.timeout(15):
            await self._hass.services.async_call("switch", service, {"entity_id": entity_id}, blocking=True)
            expected = "on" if service == "turn_on" else "off"
            for _ in range(20):
                confirmed = self._hass.states.get(entity_id)
                if confirmed is not None and confirmed.state == expected:
                    return
                await asyncio.sleep(0.1)
            raise ValueError("Pump command was not confirmed")

    async def turn_on(self, entity_id: str) -> None:
        await self._call(entity_id, "turn_on")

    async def turn_off(self, entity_id: str) -> None:
        await self._call(entity_id, "turn_off")
