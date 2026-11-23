"""Native entity selection and editable options for warm-water circulation."""
from __future__ import annotations

try:
    import probatio as vol
except ModuleNotFoundError:
    import voluptuous as vol

from homeassistant import config_entries
from homeassistant.core import callback
from homeassistant.helpers import selector

from .calendar import supported_subdivisions, GERMAN_REGIONS
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


class CalendarSteps:
    async def async_step_calendar(self, user_input=None):
        errors = {}
        if user_input is not None:
            country = user_input.get('country') or None
            if country is None:
                return self._finish_configuration({**self._pending_configuration,
                    'country': None, 'subdivision': None})
            if not isinstance(country, str):
                errors['country'] = 'unsupported_country'
            else:
                country = country.upper()
                try:
                    self._regions = await self.hass.async_add_executor_job(supported_subdivisions, country)
                except (ValueError, NotImplementedError):
                    errors['country'] = 'unsupported_country'
                else:
                    self._pending_configuration['country'] = country
                    if not self._regions:
                        return self._finish_configuration({**self._pending_configuration, 'subdivision': None})
                    return await self.async_step_region()
        return self.async_show_form(step_id='calendar', errors=errors, last_step=False,
            data_schema=self.add_suggested_values_to_schema(
                vol.Schema({vol.Optional('country'): selector.CountrySelector()}),
                user_input if user_input is not None else self._calendar_defaults))

    async def async_step_region(self, user_input=None):
        errors = {}
        if user_input is not None:
            subdivision = user_input.get('subdivision') or None
            if subdivision is not None and subdivision not in self._regions:
                errors['subdivision'] = 'invalid_subdivision'
            else:
                return self._finish_configuration({**self._pending_configuration, 'subdivision': subdivision})
        country = self._pending_configuration['country']
        options = [{'value': region, 'label': GERMAN_REGIONS.get(region, region) if country == 'DE' else region}
                   for region in self._regions]
        defaults = self._calendar_defaults if self._calendar_defaults.get('country') == country else {}
        return self.async_show_form(step_id='region', errors=errors, last_step=True,
            data_schema=self.add_suggested_values_to_schema(vol.Schema({vol.Optional('subdivision'):
                selector.SelectSelector(selector.SelectSelectorConfig(options=options,
                    mode=selector.SelectSelectorMode.DROPDOWN))}), defaults))


class ConfigFlow(CalendarSteps, config_entries.ConfigFlow, domain=DOMAIN):
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
                self._pending_configuration = data
                self._calendar_defaults = {'country': getattr(self.hass.config, 'country', None)}
                return await self.async_step_calendar()
        return self.async_show_form(
            step_id="user", errors=errors, last_step=False,
            data_schema=self.add_suggested_values_to_schema(configuration_schema(), user_input),
        )


    def _finish_configuration(self, data):
        return self.async_create_entry(title="Warmwasser-Zirkulation", data=data)


class WarmwaterOptionsFlow(CalendarSteps, config_entries.OptionsFlowWithReload):
    """Save options and let HA reload the entry when they change."""

    async def async_step_init(self, user_input=None):
        errors = {}
        values = entry_configuration(self.config_entry)
        if user_input is not None:
            data, errors = _validate(self.hass, user_input)
            if not errors:
                self._pending_configuration = data
                self._calendar_defaults = values
                return await self.async_step_calendar()
            values.update(user_input)
        return self.async_show_form(
            step_id="init", errors=errors, last_step=False,
            data_schema=self.add_suggested_values_to_schema(configuration_schema(), values),
        )


    def _finish_configuration(self, data):
        return self.async_create_entry(data={**self.config_entry.options, **data})
