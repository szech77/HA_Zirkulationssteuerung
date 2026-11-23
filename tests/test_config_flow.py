"""Native HA flow checks; run additionally in an environment with HA installed."""

from tempfile import TemporaryDirectory
from types import SimpleNamespace
from unittest import IsolatedAsyncioTestCase

import pytest

pytest.importorskip('homeassistant', reason='Native flow checks require an installed Home Assistant')

from homeassistant.core import HomeAssistant
from homeassistant.helpers.selector import EntitySelector, NumberSelector

from custom_components.warmwasser_zirkulation.config_flow import ConfigFlow, configuration_schema
from custom_components.warmwasser_zirkulation.coordinator import CirculationCoordinator


def schema_fields(schema):
    return {str(key): value for key, value in schema.schema.items()}


def test_native_schema_has_filtered_entities_and_number_inputs():
    fields = schema_fields(configuration_schema())
    for key in ('flow_sensor', 'buffer_sensor'):
        assert isinstance(fields[key], EntitySelector)
        assert fields[key].config['filter'] == [{'domain': ['sensor'], 'device_class': ['temperature']}]
    assert fields['pump_entity'].config['filter'] == [{'domain': ['switch']}]
    for key, maximum in (('runtime_seconds', 3600), ('max_starts', 100)):
        assert isinstance(fields[key], NumberSelector)
        assert fields[key].config['max'] == maximum
    validated = configuration_schema()({'flow_sensor': 'sensor.test_supply', 'pump_entity': 'switch.test_pump'})
    assert validated['runtime_seconds'] == 120


class TestNativeConfigFlow(IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        self.directory = TemporaryDirectory(prefix='circulation-native-flow-')
        self.hass = HomeAssistant(self.directory.name)
        self.hass.states.async_set('sensor.test_supply', '45', {'device_class': 'temperature'})
        self.hass.states.async_set('sensor.test_buffer', 'unknown', {'device_class': 'temperature'})
        self.hass.states.async_set('sensor.test_power', '100', {'device_class': 'power'})
        self.hass.states.async_set('switch.test_pump', 'off')
        self.service_calls = []
        async def handle_service(service_call):
            self.service_calls.append(service_call)
        self.hass.services.async_register('switch', 'turn_on', handle_service)
        self.hass.services.async_register('switch', 'turn_off', handle_service)

    async def asyncTearDown(self):
        try:
            await self.hass.async_stop(force=True)
        finally:
            self.directory.cleanup()

    async def test_native_initial_form_and_valid_creation_do_not_switch_pump(self):
        native_hass = self.hass
        flow = ConfigFlow()
        flow.hass = native_hass
        result = await flow.async_step_user()
        assert result['step_id'] == 'user'
        assert not result['errors']
        result = await flow.async_step_user({'flow_sensor': 'sensor.test_supply',
            'buffer_sensor': 'sensor.test_buffer', 'pump_entity': 'switch.test_pump',
            'runtime_seconds': 90.0, 'max_starts': 3.0})
        assert result['type'] == 'create_entry'
        assert result['data']['runtime_seconds'] == 90
        assert result['data']['buffer_sensor'] == 'sensor.test_buffer'
        assert self.service_calls == []


    async def test_native_form_keeps_input_and_field_error_for_wrong_sensor(self):
        native_hass = self.hass
        flow = ConfigFlow()
        flow.hass = native_hass
        result = await flow.async_step_user({'flow_sensor': 'sensor.test_power', 'pump_entity': 'switch.test_pump'})
        assert result['type'] == 'form'
        assert result['errors'] == {'flow_sensor': 'invalid_temperature_sensor'}
        marker = next(key for key in result['data_schema'].schema if str(key) == 'flow_sensor')
        assert marker.description['suggested_value'] == 'sensor.test_power'


    async def test_native_options_are_prefilled_can_clear_buffer_and_reload(self):
        native_hass = self.hass
        entry = SimpleNamespace(entry_id='synthetic-config',
            data={'flow_sensor': 'sensor.test_supply', 'buffer_sensor': 'sensor.test_buffer',
                  'pump_entity': 'switch.test_pump', 'runtime_seconds': 120}, options={})
        native_hass.config_entries = SimpleNamespace(async_get_known_entry=lambda entry_id: entry)
        flow = ConfigFlow.async_get_options_flow(entry)
        flow.hass = native_hass
        flow.handler = entry.entry_id
        assert flow.automatic_reload is True
        result = await flow.async_step_init()
        marker = next(key for key in result['data_schema'].schema if str(key) == 'buffer_sensor')
        assert marker.description['suggested_value'] == 'sensor.test_buffer'
        result = await flow.async_step_init({'flow_sensor': 'sensor.test_supply',
            'pump_entity': 'switch.test_pump', 'runtime_seconds': 60, 'max_starts': 2})
        assert result['type'] == 'create_entry'
        assert result['data']['buffer_sensor'] is None
        entry.options = result['data']
        coordinator = CirculationCoordinator.from_home_assistant(native_hass, entry)
        await coordinator.async_start()
        assert coordinator.runtime_seconds == 60
        assert coordinator.max_starts == 2
        assert entry.data['runtime_seconds'] == 120
        assert self.service_calls == []


    async def test_native_invalid_options_do_not_change_saved_values(self):
        native_hass = self.hass
        entry = SimpleNamespace(entry_id='synthetic-config', data={'flow_sensor': 'sensor.test_supply',
            'pump_entity': 'switch.test_pump'}, options={'max_starts': 4})
        native_hass.config_entries = SimpleNamespace(async_get_known_entry=lambda entry_id: entry)
        flow = ConfigFlow.async_get_options_flow(entry)
        flow.hass = native_hass
        flow.handler = entry.entry_id
        result = await flow.async_step_init({'flow_sensor': 'sensor.missing',
            'pump_entity': 'switch.test_pump', 'max_starts': 0})
        assert result['errors'] == {'flow_sensor': 'unknown_entity', 'max_starts': 'invalid_max_starts'}
        assert entry.options == {'max_starts': 4}
