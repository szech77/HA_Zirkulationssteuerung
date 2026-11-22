"""Home Assistant adapter for the warm-water circulation domain."""

from __future__ import annotations

from .coordinator import CirculationCoordinator

DOMAIN = "warmwasser_zirkulation"


async def async_setup_entry(hass, entry) -> bool:
    coordinator = CirculationCoordinator.from_home_assistant(hass, entry)
    await coordinator.async_start()
    hass.data.setdefault(DOMAIN, {})[entry.entry_id] = coordinator
    return True


async def async_unload_entry(hass, entry) -> bool:
    coordinator = hass.data.get(DOMAIN, {}).pop(entry.entry_id, None)
    if coordinator:
        await coordinator.async_stop()
    return True

