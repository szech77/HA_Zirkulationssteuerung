"""A per-entry diagnostic sensor, loaded by Home Assistant's entity platform."""
from homeassistant.components.sensor import SensorEntity
from homeassistant.helpers.entity import DeviceInfo

from .const import DOMAIN
from .status import entry_status


async def async_setup_entry(hass, entry, async_add_entities):
    async_add_entities([WarmwaterReasonSensor(hass.data[DOMAIN][entry.entry_id], entry.entry_id)])


class WarmwaterReasonSensor(SensorEntity):
    _attr_name = 'Betriebsgrund'
    _attr_has_entity_name = True

    def __init__(self, coordinator, entry_id):
        self.coordinator = coordinator
        self.entry_id = entry_id
        self._attr_unique_id = f'{entry_id}_reason'
        self._attr_device_info = DeviceInfo(identifiers={(DOMAIN, entry_id)}, name='Warmwasser-Zirkulation')

    @property
    def native_value(self):
        if self.hass is not None:
            entry = self.hass.config_entries.async_get_entry(self.entry_id)
            if entry is not None:
                observer = self.hass.data.get(DOMAIN + '_observations', {}).get(self.entry_id)
                return entry_status(self.hass, entry, self.coordinator, observer, include_heatmap=False)['reason']
        return self.coordinator.runtime.last_reason
