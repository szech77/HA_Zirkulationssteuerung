from homeassistant.components.sensor import SensorEntity

from .const import DOMAIN


async def async_setup_entry(hass, entry, async_add_entities):
    coordinator = hass.data[DOMAIN][entry.entry_id]
    async_add_entities([WarmwaterReasonSensor(coordinator)])


class WarmwaterReasonSensor(SensorEntity):
    _attr_name = "Warmwasser Zirkulation Grund"
    _attr_unique_id = "warmwasser_zirkulation_reason"

    def __init__(self, coordinator):
        self.coordinator = coordinator

    @property
    def native_value(self):
        return self.coordinator.runtime.last_reason

