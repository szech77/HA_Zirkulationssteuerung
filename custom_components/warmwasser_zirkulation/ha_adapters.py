"""Home Assistant service and storage adapters for the coordinator contracts."""

from __future__ import annotations

from datetime import datetime
import re

from .const import DOMAIN

STORAGE_VERSION = 1


class HomeAssistantStateStore:
    """Persist runtime state under an entry-specific Home Assistant storage key."""

    def __init__(self, hass, entry_id: str):
        # Keep domain/coordinator unit tests independent of an installed HA runtime.
        from homeassistant.helpers.storage import Store

        self._store = Store(hass, STORAGE_VERSION, f"{DOMAIN}.{entry_id}")

    @staticmethod
    def _validate(state: dict) -> None:
        for key in ("enabled", "demand_automation"):
            if key in state and type(state[key]) is not bool:
                raise ValueError("Invalid persisted automation flag")
        if "daily_starts" in state:
            count = state["daily_starts"]
            if type(count) is not int or count < 0:
                raise ValueError("Invalid persisted pump start count")
        if "last_reason" in state and not isinstance(state["last_reason"], str):
            raise ValueError("Invalid persisted pump reason")

    async def load(self) -> dict:
        data = await self._store.async_load()
        if data is None:
            return {}
        if not isinstance(data, dict):
            raise ValueError("Invalid persisted runtime state")
        state = dict(data)
        self._validate(state)
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
                raise ValueError("Pump is not confirmed off")
        await self._hass.services.async_call(
            "switch", service, {"entity_id": entity_id}, blocking=True,
        )

    async def turn_on(self, entity_id: str) -> None:
        await self._call(entity_id, "turn_on")

    async def turn_off(self, entity_id: str) -> None:
        await self._call(entity_id, "turn_off")
