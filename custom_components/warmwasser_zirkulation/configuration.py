"""Validate configuration without depending on a Home Assistant runtime."""

from collections.abc import Callable, Mapping
import re
from typing import Any

from .const import (
    CONF_BUFFER_SENSOR, CONF_FLOW_SENSOR, CONF_MAX_STARTS, CONF_PUMP_ENTITY,
    CONF_RUNTIME_SECONDS, DEFAULT_MAX_STARTS, DEFAULT_RUNTIME_SECONDS,
    MAX_DAILY_STARTS, MAX_RUNTIME_SECONDS,
)


def entry_configuration(entry) -> dict:
    """Options override initial values; explicit None clears an optional sensor."""
    return {**entry.data, **getattr(entry, "options", {})}


def validate_configuration(
    values: Mapping[str, Any],
    entity_attributes: Callable[[str], Mapping[str, Any] | None],
) -> tuple[dict, dict[str, str]]:
    """Validate entity existence/type and integer limits without switching devices."""
    normalized = {}
    errors = {}
    for key, domain in ((CONF_FLOW_SENSOR, "sensor"), (CONF_BUFFER_SENSOR, "sensor"),
                        (CONF_PUMP_ENTITY, "switch")):
        value = values.get(key)
        if key == CONF_BUFFER_SENSOR and value in (None, ""):
            normalized[key] = None
            continue
        if not isinstance(value, str) or not re.fullmatch(domain + r"\.[a-z0-9_]+", value):
            errors[key] = "invalid_pump" if domain == "switch" else "invalid_temperature_sensor"
            continue
        normalized[key] = value
        attributes = entity_attributes(value)
        if attributes is None:
            errors[key] = "unknown_entity"
        elif domain == "sensor" and attributes.get("device_class") != "temperature":
            errors[key] = "invalid_temperature_sensor"
    if (normalized.get(CONF_BUFFER_SENSOR)
            and normalized.get(CONF_BUFFER_SENSOR) == normalized.get(CONF_FLOW_SENSOR)):
        errors[CONF_BUFFER_SENSOR] = "same_sensor"
    for key, default, maximum, error in (
        (CONF_RUNTIME_SECONDS, DEFAULT_RUNTIME_SECONDS, MAX_RUNTIME_SECONDS, "invalid_runtime"),
        (CONF_MAX_STARTS, DEFAULT_MAX_STARTS, MAX_DAILY_STARTS, "invalid_max_starts"),
    ):
        value = values.get(key, default)
        if (type(value) not in (int, float) or not 1 <= value <= maximum
                or value != int(value)):
            errors[key] = error
        else:
            normalized[key] = int(value)
    return normalized, errors
