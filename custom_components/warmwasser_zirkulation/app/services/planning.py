"""Pure schedule permissions, day groups and event planning."""
from __future__ import annotations

from datetime import datetime, timedelta
from typing import Iterable
from ..models.detection import DrawEvent
from ..models.planning import PlannedStart, Window
from ..schemas.control import SCHEDULE_DAYS


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
