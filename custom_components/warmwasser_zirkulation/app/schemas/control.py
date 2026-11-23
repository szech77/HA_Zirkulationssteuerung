"""Validated public control settings and fail-closed defaults."""
from __future__ import annotations

from ..core.const import MAX_RUNTIME_SECONDS, MAX_DAILY_STARTS


# Missing windows always mean no automatic permission.
SCHEDULE_DAYS = ("mon", "tue", "wed", "thu", "fri", "sat", "sun_holiday")


def default_schedule():
    return {day: [] for day in SCHEDULE_DAYS}


def validate_control_settings(values):
    """Normalize bounded lists; reject malformed, overlapping or overnight windows."""
    import re
    required = {"mode", "schedule", "vacation_active", "vacation_windows"}
    if not isinstance(values, dict) or not required <= set(values) or set(values) - required - {"runtime_seconds", "max_starts"}:
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

    return {**validate_limits(values), "mode": values["mode"], "schedule": {day: windows(schedule[day]) for day in SCHEDULE_DAYS},
            "vacation_active": values["vacation_active"], "vacation_windows": windows(values["vacation_windows"])}


def validate_limits(values):
    """Optional limits preserve older clients; stored values use integer seconds."""
    limits = {}
    for key, maximum in (("runtime_seconds", MAX_RUNTIME_SECONDS), ("max_starts", MAX_DAILY_STARTS)):
        if key in values:
            value = values[key]
            if type(value) is not int or not 1 <= value <= maximum:
                raise ValueError("invalid_limits")
            limits[key] = value
    return limits
