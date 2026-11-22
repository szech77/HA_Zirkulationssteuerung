"""Minimal config flow; production IDs are always entered by the user."""
from __future__ import annotations

import voluptuous as vol
from homeassistant import config_entries

from .const import CONF_FLOW_SENSOR, CONF_PUMP_ENTITY, CONF_RUNTIME_SECONDS, DEFAULT_RUNTIME_SECONDS, DOMAIN


class ConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    VERSION = 1

    async def async_step_user(self, user_input=None):
        if user_input is not None:
            return self.async_create_entry(title="Warmwasser-Zirkulation", data=user_input)
        return self.async_show_form(step_id="user", data_schema=vol.Schema({vol.Required(CONF_FLOW_SENSOR): str, vol.Required(CONF_PUMP_ENTITY): str, vol.Optional(CONF_RUNTIME_SECONDS, default=DEFAULT_RUNTIME_SECONDS): vol.Coerce(int)}))

