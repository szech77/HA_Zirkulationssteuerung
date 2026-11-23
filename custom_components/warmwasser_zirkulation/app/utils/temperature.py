"""Normalize finite temperature readings to Celsius."""
from __future__ import annotations

from math import isfinite


def temperature_value(value, unit):
    try:
        value = float(value)
    except (TypeError, ValueError):
        return None
    if unit == "°F": value = (value - 32) * 5 / 9
    elif unit == "K": value -= 273.15
    elif unit != "°C": return None
    return value if isfinite(value) and -20 <= value <= 150 else None
