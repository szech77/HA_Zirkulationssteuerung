"""Persist the automation preference without issuing physical pump commands."""
import asyncio

from homeassistant.components.switch import SwitchEntity
from homeassistant.helpers.entity import DeviceInfo

from .const import DOMAIN


async def async_setup_entry(hass, entry, async_add_entities):
    async_add_entities([WarmwaterAutomationSwitch(hass.data[DOMAIN][entry.entry_id], entry.entry_id)])


class WarmwaterAutomationSwitch(SwitchEntity):
    _attr_name = 'Bedarfsautomatik'
    _attr_has_entity_name = True

    def __init__(self, coordinator, entry_id):
        self.coordinator = coordinator
        self._settings_lock = asyncio.Lock()
        self._attr_unique_id = f'{entry_id}_demand_automation'
        self._attr_device_info = DeviceInfo(identifiers={(DOMAIN, entry_id)}, name='Warmwasser-Zirkulation')

    @property
    def is_on(self):
        return self.coordinator.runtime.demand_automation

    async def _set(self, enabled):
        async with self._settings_lock:
            previous = self.coordinator.runtime.demand_automation
            self.coordinator.runtime.demand_automation = enabled
            try:
                await self.coordinator.store.save(self.coordinator.runtime.__dict__)
            except Exception:
                self.coordinator.runtime.demand_automation = previous
                raise
            self.async_write_ha_state()

    async def async_turn_on(self, **kwargs):
        await self._set(True)

    async def async_turn_off(self, **kwargs):
        await self._set(False)
