from homeassistant.components.switch import SwitchEntity

from .const import DOMAIN


async def async_setup_entry(hass, entry, async_add_entities):
    async_add_entities([WarmwaterAutomationSwitch(hass.data[DOMAIN][entry.entry_id])])


class WarmwaterAutomationSwitch(SwitchEntity):
    _attr_name = "Warmwasser Bedarfsautomatik"
    _attr_unique_id = "warmwasser_demand_automation"

    def __init__(self, coordinator):
        self.coordinator = coordinator

    @property
    def is_on(self):
        return self.coordinator.runtime.demand_automation

    async def async_turn_on(self, **kwargs):
        self.coordinator.runtime.demand_automation = True
        self.async_write_ha_state()

    async def async_turn_off(self, **kwargs):
        self.coordinator.runtime.demand_automation = False
        self.async_write_ha_state()

