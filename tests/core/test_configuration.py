"""Configuration validation and translated field/error coverage."""

import json
from pathlib import Path
from types import SimpleNamespace

import pytest

from custom_components.warmwasser_zirkulation.app.core.config import (
    entry_configuration,
    validate_configuration,
)

ENTITIES = {
    'sensor.test_supply': {'device_class': 'temperature'},
    'sensor.test_buffer': {'device_class': 'temperature'},
    'sensor.test_power': {'device_class': 'power'},
    'sensor.test_unclassified': {},
    'switch.test_pump': {},
    'switch.test_other_pump': {},
}
VALID = {'flow_sensor': 'sensor.test_supply', 'pump_entity': 'switch.test_pump'}


def test_defaults_and_optional_buffer_sensor():
    data, errors = validate_configuration(VALID, ENTITIES.get)
    assert errors == {}
    assert data == {**VALID, 'buffer_sensor': None, 'runtime_seconds': 120, 'max_starts': 6}
    data, errors = validate_configuration({**VALID, 'buffer_sensor': 'sensor.test_buffer',
        'runtime_seconds': 90.0, 'max_starts': 3.0}, ENTITIES.get)
    assert not errors
    assert data['buffer_sensor'] == 'sensor.test_buffer'
    assert type(data['runtime_seconds']) is int
    assert type(data['max_starts']) is int


@pytest.mark.parametrize(('key', 'value', 'error'), [
    ('flow_sensor', 'sensor.missing', 'unknown_entity'),
    ('flow_sensor', 'sensor.test_power', 'invalid_temperature_sensor'),
    ('flow_sensor', 'sensor.test_unclassified', 'invalid_temperature_sensor'),
    ('flow_sensor', 'switch.test_pump', 'invalid_temperature_sensor'),
    ('flow_sensor', None, 'invalid_temperature_sensor'),
    ('buffer_sensor', 'sensor.missing', 'unknown_entity'),
    ('buffer_sensor', 'sensor.test_power', 'invalid_temperature_sensor'),
    ('buffer_sensor', 'sensor.test_supply', 'same_sensor'),
    ('pump_entity', 'sensor.test_supply', 'invalid_pump'),
    ('pump_entity', 'switch.missing', 'unknown_entity'),
    ('pump_entity', 'switch.invalid entity', 'invalid_pump'),
])
def test_invalid_entity_selection_has_a_field_error(key, value, error):
    _, errors = validate_configuration({**VALID, key: value}, ENTITIES.get)
    assert errors[key] == error


@pytest.mark.parametrize('key', ['runtime_seconds', 'max_starts'])
@pytest.mark.parametrize('value', [0, -1, 1.5, True, '120', None, float('inf'), float('nan'), 10**1000])
def test_limits_require_bounded_whole_numbers(key, value):
    _, errors = validate_configuration({**VALID, key: value}, ENTITIES.get)
    assert key in errors


@pytest.mark.parametrize(('runtime', 'starts'), [(1, 1), (3600, 100)])
def test_limit_endpoints_are_valid(runtime, starts):
    data, errors = validate_configuration({**VALID, 'runtime_seconds': runtime,
        'max_starts': starts}, ENTITIES.get)
    assert not errors
    assert data['runtime_seconds'] == runtime
    assert data['max_starts'] == starts


@pytest.mark.parametrize('value', [None, ''])
def test_buffer_can_be_cleared_even_when_initial_data_contains_one(value):
    result, errors = validate_configuration({**VALID, 'buffer_sensor': value}, ENTITIES.get)
    assert not errors
    entry = SimpleNamespace(data={**VALID, 'buffer_sensor': 'sensor.test_buffer'}, options=result)
    assert entry_configuration(entry)['buffer_sensor'] is None
    assert entry.data['buffer_sensor'] == 'sensor.test_buffer'


def test_options_override_initial_values_without_mutating_them():
    entry = SimpleNamespace(data={**VALID, 'runtime_seconds': 120},
        options={'pump_entity': 'switch.test_other_pump', 'runtime_seconds': 60})
    result = entry_configuration(entry)
    assert result['pump_entity'] == 'switch.test_other_pump'
    assert result['runtime_seconds'] == 60
    assert entry.data['pump_entity'] == 'switch.test_pump'
    assert entry_configuration(SimpleNamespace(data=VALID)) == VALID


def test_both_languages_cover_every_configuration_field_and_validation_error():
    component = Path(__file__).parents[2] / 'custom_components/warmwasser_zirkulation'
    source = json.loads((component / 'strings.json').read_text(encoding='utf-8'))
    fields = {'flow_sensor', 'buffer_sensor', 'pump_entity', 'runtime_seconds', 'max_starts'}
    errors = {'unknown_entity', 'invalid_temperature_sensor', 'invalid_pump', 'same_sensor',
              'invalid_runtime', 'invalid_max_starts', 'unsupported_country', 'invalid_subdivision'}
    for language in ('de', 'en'):
        text = json.loads((component / 'translations' / f'{language}.json').read_text(encoding='utf-8'))
        for section, step in (('config', 'user'), ('options', 'init')):
            assert set(text[section]['step'][step]['data']) == fields
            assert set(text[section]['step'][step]['data_description']) == fields
            assert set(text[section]['error']) == errors
            assert all(text[section]['error'].values())
        if language == 'en':
            assert source == text
        else:
            assert text['config']['step']['user']['data']['flow_sensor'] == 'Vorlauftemperaturf\u00fchler'
