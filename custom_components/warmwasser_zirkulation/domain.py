"""Pure domain model. It intentionally has no Home Assistant imports."""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timedelta
from enum import Enum
from math import isfinite
from statistics import median
from typing import Iterable, Sequence


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


class DetectionEngine:
    def __init__(self, config: DetectorConfig, model: LearningModel):
        self.config, self.model = config, model

    def detect(self, samples: Sequence[Sample]) -> list[DrawEvent]:
        ordered = sorted(samples, key=lambda s: s.at)
        result: list[DrawEvent] = []
        for current in ordered:
            if current.pump is PumpState.ON or current.pump is PumpState.UNKNOWN:
                continue
            previous = next((p for p in reversed(ordered) if p.at < current.at), None)
            if previous is None:
                continue
            delta_t = (current.at - previous.at).total_seconds()
            if delta_t <= 0 or current.at - previous.at > self.config.max_gap:
                continue
            delta = current.temperature - previous.temperature
            if delta < 0 or delta > self.config.max_step:
                continue
            # Domain unit is °C/minute; this is easier to inspect in HA history
            # and avoids thresholds depending on the recorder's sample cadence.
            slope = delta * 60 / delta_t
            if slope < max(self.config.min_slope, self.model.threshold):
                continue
            if result and current.at - result[-1].at < self.config.dedupe:
                continue
            result.append(DrawEvent(current.at, slope, min(1.0, slope / self.model.threshold)))
        return result


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


class Planner:
    def __init__(self, runtime_seconds: int, max_starts: int, windows: dict[int, Window]):
        self.runtime_seconds, self.max_starts, self.windows = runtime_seconds, max_starts, windows

    def plan(self, events: Iterable[DrawEvent], now: datetime, existing: Iterable[PlannedStart] = ()) -> list[PlannedStart]:
        starts = list(existing)
        for event in sorted(events, key=lambda e: e.at):
            start = event.at - timedelta(seconds=self.runtime_seconds)
            if start <= now or any(abs((s.at - start).total_seconds()) < 900 for s in starts):
                continue
            weekday_window = self.windows.get(start.weekday(), Window(0, 0, False))
            minute = start.hour * 60 + start.minute
            if weekday_window.contains(minute, self.runtime_seconds // 60) and self._day_count(starts, start) < self.max_starts:
                starts.append(PlannedStart(start, "learned_schedule"))
        return sorted(starts, key=lambda s: s.at)

    @staticmethod
    def _day_count(starts: Iterable[PlannedStart], at: datetime) -> int:
        return sum(s.at.date() == at.date() for s in starts)


def heatmap(events: Iterable[DrawEvent], observed_days: dict[tuple[int, int], int], min_observations: int = 3) -> dict[tuple[int, int], dict[str, float | int | bool]]:
    counts: dict[tuple[int, int], int] = {}
    for event in events:
        key = (event.at.weekday(), event.at.hour * 2 + event.at.minute // 30)
        counts[key] = counts.get(key, 0) + 1
    result = {}
    for key, denominator in observed_days.items():
        numerator = counts.get(key, 0)
        result[key] = {"numerator": numerator, "denominator": denominator, "quote": numerator / denominator if denominator else 0.0, "sufficient": denominator >= min_observations}
    return result

