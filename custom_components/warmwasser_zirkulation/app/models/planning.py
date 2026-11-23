"""Time windows and planned circulation starts."""
from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime


@dataclass(frozen=True, slots=True)
class Window:
    start: int
    end: int
    enabled: bool = True

    def contains(self, minute: int, runtime: int = 0) -> bool:
        if not self.enabled or self.start == self.end:
            return False
        if self.start < self.end:
            return self.start <= minute and minute + runtime <= self.end
        return minute >= self.start or minute + runtime <= self.end


@dataclass(frozen=True, slots=True)
class PlannedStart:
    at: datetime
    reason: str


@dataclass(frozen=True, slots=True)
class LearnedStart:
    at: datetime
    demand_at: datetime
    ratio: float
    observed_days: int

    @property
    def identity(self):
        return self.demand_at.isoformat()
