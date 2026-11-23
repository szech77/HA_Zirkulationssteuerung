"""Pump and state-store contracts used by the control service."""
from __future__ import annotations

from typing import Protocol


class PumpGateway(Protocol):
    async def turn_on(self, entity_id: str) -> None: ...
    async def turn_off(self, entity_id: str) -> None: ...


class StateStore(Protocol):
    async def load(self) -> dict: ...
    async def save(self, state: dict) -> None: ...


class PumpStartRefused(ValueError):
    """No start command was sent because the current pump is not confirmed off."""
