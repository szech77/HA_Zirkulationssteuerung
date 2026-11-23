"""Confirmed Home Assistant pump commands."""
from __future__ import annotations

import asyncio
import re
from ..models.contracts import PumpStartRefused


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
