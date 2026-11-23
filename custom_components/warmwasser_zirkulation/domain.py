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



# Public dashboard settings: missing windows always mean no automatic permission.
SCHEDULE_DAYS = ("mon", "tue", "wed", "thu", "fri", "sat", "sun_holiday")


def default_schedule():
    return {day: [] for day in SCHEDULE_DAYS}


def validate_control_settings(values):
    """Normalize bounded lists; reject malformed, overlapping or overnight windows."""
    import re
    if not isinstance(values, dict) or set(values) != {"mode", "schedule", "vacation_active", "vacation_windows"}:
        raise ValueError("invalid_settings")
    if values["mode"] not in ("monitoring", "active") or type(values["vacation_active"]) is not bool:
        raise ValueError("invalid_settings")
    schedule = values["schedule"]
    if not isinstance(schedule, dict) or set(schedule) != set(SCHEDULE_DAYS):
        raise ValueError("invalid_schedule")

    def windows(items):
        if not isinstance(items, list) or len(items) > 12:
            raise ValueError("invalid_windows")
        result = []
        for item in items:
            if not isinstance(item, dict) or set(item) != {"start", "end"}:
                raise ValueError("invalid_windows")
            for key in ("start", "end"):
                value = item[key]
                if not isinstance(value, str) or not re.fullmatch(r"(?:[01][0-9]|2[0-3]):[0-5][0-9]", value):
                    if key != "end" or value != "24:00":
                        raise ValueError("invalid_time")
            if item["start"] >= item["end"]:
                raise ValueError("invalid_time_range")
            result.append(dict(item))
        result.sort(key=lambda item: item["start"])
        if any(a["end"] > b["start"] for a, b in zip(result, result[1:])):
            raise ValueError("overlapping_windows")
        return result

    return {"mode": values["mode"], "schedule": {day: windows(schedule[day]) for day in SCHEDULE_DAYS},
            "vacation_active": values["vacation_active"], "vacation_windows": windows(values["vacation_windows"])}


def permitted_until(settings, now, runtime_seconds=0, holidays=frozenset()):
    """Use local calendar dates, but compare actual elapsed time across DST changes."""
    from datetime import time
    if now.utcoffset() is None:
        raise ValueError("A local timezone is required")
    key = day_group(now.date(), holidays)
    windows = settings["vacation_windows"] if settings["vacation_active"] else settings["schedule"][key]
    for window in windows:
        start = datetime.combine(now.date(), time.fromisoformat(window["start"]), now.tzinfo)
        end = (datetime.combine(now.date() + timedelta(days=1), time.min, now.tzinfo)
               if window["end"] == "24:00" else datetime.combine(now.date(), time.fromisoformat(window["end"]), now.tzinfo))
        if any(datetime.fromtimestamp(boundary.timestamp(), now.tzinfo).replace(tzinfo=None) != boundary.replace(tzinfo=None) for boundary in (start, end)):
            continue
        if start.timestamp() <= now.timestamp() < end.timestamp() and now.timestamp() + runtime_seconds <= end.timestamp():
            return end
    return None



def day_group(day, holidays=()):
    return "sun_holiday" if day.weekday() == 6 or day in holidays else SCHEDULE_DAYS[day.weekday()]


def migrate_schedule(schedule):
    """Merge legacy permissions by intersection, never adding an automatic hour."""
    from copy import deepcopy
    legacy = set(SCHEDULE_DAYS) - {"sun_holiday"} | {"sun", "holiday"}
    if not isinstance(schedule, dict) or set(schedule) != legacy:
        return schedule, False
    # Validate the two old lists before computing their common permissions.
    normal = {key: deepcopy(schedule[key]) for key in SCHEDULE_DAYS if key != "sun_holiday"}
    def checked(windows):
        values = {"mode":"monitoring", "schedule":{**normal, "sun_holiday":windows},
                  "vacation_active":False, "vacation_windows":[]}
        return validate_control_settings(values)["schedule"]["sun_holiday"]
    sunday, holiday = checked(schedule["sun"]), checked(schedule["holiday"])
    common = []
    for a in sunday:
        for b in holiday:
            start, end = max(a["start"], b["start"]), min(a["end"], b["end"])
            if start < end:
                common.append({"start":start,"end":end})
    # Both validated lists have at most twelve windows; intersection can have more.
    # Keep at most twelve common windows; omitted hours remain blocked for review.
    return {**normal, "sun_holiday":sorted(common,key=lambda w:w["start"])[:12]}, True


def temperature_value(value, unit):
    try:
        value = float(value)
    except (TypeError, ValueError):
        return None
    if unit == "°F": value = (value - 32) * 5 / 9
    elif unit == "K": value -= 273.15
    elif unit != "°C": return None
    return value if isfinite(value) and -20 <= value <= 150 else None


@dataclass(frozen=True, slots=True)
class LearnedStart:
    at: datetime
    demand_at: datetime
    ratio: float
    observed_days: int

    @property
    def identity(self):
        return self.demand_at.isoformat()
