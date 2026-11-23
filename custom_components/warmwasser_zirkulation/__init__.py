"""Home Assistant setup, platform loading and panel lifecycle."""
from __future__ import annotations

import logging

from .coordinator import CirculationCoordinator
from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)
PLATFORMS = ['sensor', 'switch']
OBSERVERS = DOMAIN + '_observations'


async def async_setup_entry(hass, entry) -> bool:
    from homeassistant.helpers.importlib import async_import_module
    panel = await async_import_module(hass, __package__ + '.frontend')
    observations = await async_import_module(hass, __package__ + '.observations')

    coordinator = CirculationCoordinator.from_home_assistant(hass, entry)
    await coordinator.async_start()
    observer = observations.ObservationMonitor(hass, entry, coordinator)
    hass.data.setdefault(DOMAIN, {})[entry.entry_id] = coordinator
    hass.data.setdefault(OBSERVERS, {})[entry.entry_id] = observer
    platforms_requested = False
    try:
        await observer.async_start()
        await panel.async_register_frontend(hass)
        platforms_requested = True
        await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    except BaseException:
        # Also clean up subscriptions and the sidebar when HA cancels setup.
        try:
            await observer.async_stop()
        except Exception as error:
            _LOGGER.error('Observation cleanup failed', extra={'reason': 'observer_cleanup_failed', 'error_type': type(error).__name__})
        if platforms_requested:
            try:
                await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
            except Exception as error:
                _LOGGER.error('Platform cleanup failed', extra={'reason': 'platform_cleanup_failed', 'error_type': type(error).__name__})
        hass.data[OBSERVERS].pop(entry.entry_id, None)
        hass.data[DOMAIN].pop(entry.entry_id, None)
        if not hass.data[DOMAIN]:
            await panel.async_remove_frontend(hass)
        await coordinator.async_stop()
        raise
    return True


async def async_unload_entry(hass, entry) -> bool:
    from homeassistant.helpers.importlib import async_import_module
    panel = await async_import_module(hass, __package__ + '.frontend')

    if not await hass.config_entries.async_unload_platforms(entry, PLATFORMS):
        return False
    observer = hass.data.get(OBSERVERS, {}).get(entry.entry_id)
    if observer is not None:
        await observer.async_stop()
        hass.data[OBSERVERS].pop(entry.entry_id, None)
    coordinator = hass.data.get(DOMAIN, {}).pop(entry.entry_id, None)
    if coordinator is not None:
        await coordinator.async_stop()
    if not hass.data.get(DOMAIN):
        await panel.async_remove_frontend(hass)
    return True
