"""Native entity selection and editable options for warm-water circulation."""
from __future__ import annotations

try:
    import probatio as vol
except ModuleNotFoundError:
    import voluptuous as vol

from homeassistant import config_entries
from homeassistant.core import callback
from homeassistant.helpers import selector

from .configuration import entry_configuration, validate_configuration
from .const import (
    CONF_BUFFER_SENSOR, CONF_FLOW_SENSOR, CONF_MAX_STARTS, CONF_PUMP_ENTITY,
    CONF_RUNTIME_SECONDS, DEFAULT_MAX_STARTS, DEFAULT_RUNTIME_SECONDS, DOMAIN,
    MAX_DAILY_STARTS, MAX_RUNTIME_SECONDS,
)


def configuration_schema():
    """Show searchable temperature/switch selectors and bounded number inputs."""
    temperature = selector.EntitySelectorConfig(
        filter={"domain": "sensor", "device_class": "temperature"},
    )
    return vol.Schema({
        vol.Required(CONF_FLOW_SENSOR): selector.EntitySelector(temperature),
        vol.Optional(CONF_BUFFER_SENSOR): selector.EntitySelector(temperature),
        vol.Required(CONF_PUMP_ENTITY): selector.EntitySelector(
            selector.EntitySelectorConfig(filter={"domain": "switch"}),
        ),
        vol.Required(CONF_RUNTIME_SECONDS, default=DEFAULT_RUNTIME_SECONDS): selector.NumberSelector(
            selector.NumberSelectorConfig(min=1, max=MAX_RUNTIME_SECONDS, step=1,
                mode=selector.NumberSelectorMode.BOX, unit_of_measurement="s"),
        ),
        vol.Required(CONF_MAX_STARTS, default=DEFAULT_MAX_STARTS): selector.NumberSelector(
            selector.NumberSelectorConfig(min=1, max=MAX_DAILY_STARTS, step=1,
                mode=selector.NumberSelectorMode.BOX),
        ),
    })


def _validate(hass, user_input):
    def attributes(entity_id):
        state = hass.states.get(entity_id)
        return None if state is None else state.attributes
    return validate_configuration(user_input, attributes)


class ConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    VERSION = 1

    @staticmethod
    @callback
    def async_get_options_flow(config_entry):
        return WarmwaterOptionsFlow()

    async def async_step_user(self, user_input=None):
        errors = {}
        if user_input is not None:
            data, errors = _validate(self.hass, user_input)
            if not errors:
                return self.async_create_entry(title="Warmwasser-Zirkulation", data=data)
        return self.async_show_form(
            step_id="user", errors=errors,
            data_schema=self.add_suggested_values_to_schema(configuration_schema(), user_input),
        )


class WarmwaterOptionsFlow(config_entries.OptionsFlowWithReload):
    """Save options and let HA reload the entry when they change."""

    async def async_step_init(self, user_input=None):
        errors = {}
        values = entry_configuration(self.config_entry)
        if user_input is not None:
            data, errors = _validate(self.hass, user_input)
            if not errors:
                return self.async_create_entry(data={**self.config_entry.options, **data})
            values.update(user_input)
        return self.async_show_form(
            step_id="init", errors=errors,
            data_schema=self.add_suggested_values_to_schema(configuration_schema(), values),
        )
