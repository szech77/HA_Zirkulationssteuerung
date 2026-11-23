"""Historical measurement and replay result data."""
from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from typing import TYPE_CHECKING
from .detection import PumpState

if TYPE_CHECKING:
    from ..services.usage import UsageHistory


@dataclass(frozen=True, slots=True)
class HistoricalTemperature:
    at: datetime
    value: float | None


@dataclass(frozen=True, slots=True)
class HistoricalPump:
    at: datetime
    state: PumpState


@dataclass
class HistoryReplay:
    history: UsageHistory
    events: list
    temperatures: int
    assumed_pump_off: bool
    last_event: datetime | None
