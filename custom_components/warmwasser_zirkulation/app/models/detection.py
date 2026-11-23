"""Measurement and learning data without a Home Assistant runtime."""
from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timedelta
from enum import Enum
from math import isfinite
from statistics import median
from typing import Iterable


class PumpState(str, Enum):
    ON = "on"
    OFF = "off"
    UNKNOWN = "unknown"


@dataclass(frozen=True, slots=True)
class Sample:
    at: datetime
    temperature: float
    pump: PumpState = PumpState.UNKNOWN


@dataclass(frozen=True, slots=True)
class DrawEvent:
    at: datetime
    slope: float
    confidence: float
    source: str = "live"


@dataclass(frozen=True, slots=True)
class DetectorConfig:
    window: timedelta = timedelta(minutes=5)
    min_slope: float = 0.12
    max_gap: timedelta = timedelta(minutes=8)
    dedupe: timedelta = timedelta(minutes=20)
    max_step: float = 12.0


@dataclass
class LearningModel:
    threshold: float = 0.12
    min_samples: int = 12
    samples: list[float] = field(default_factory=list)

    def learn(self, quiet_slopes: Iterable[float], plausible_events: Iterable[float]) -> None:
        values = [v for v in quiet_slopes if isfinite(v) and v >= 0]
        events = [v for v in plausible_events if isfinite(v) and v > 0]
        self.samples.extend(events)
        if len(self.samples) < self.min_samples:
            return
        baseline = median(values) if values else self.threshold / 3
        candidate = max(baseline * 3, median(self.samples) * 0.45)
        # Bounded adaptation prevents one bad import from making the system unsafe.
        self.threshold = min(max(candidate, self.threshold * 0.75), self.threshold * 1.25)
