from datetime import datetime, timedelta, timezone
from types import SimpleNamespace
from custom_components.warmwasser_zirkulation.status import entry_status, dashboard_status
from custom_components.warmwasser_zirkulation.coordinator import CirculationCoordinator
from custom_components.warmwasser_zirkulation.const import DOMAIN


def test_status_uses_real_values_and_does_not_invent_an_unconfigured_buffer():
    now = datetime(2026, 1, 5, 7, tzinfo=timezone.utc)
    states = {'sensor.test_supply': SimpleNamespace(state='45.2', name='Test supply',
        attributes={'unit_of_measurement': '°C'}, last_reported=now),
        'switch.test_pump': SimpleNamespace(state='off')}
    entry = SimpleNamespace(entry_id='test-entry', title='Test circulation',
        data={'flow_sensor': 'sensor.test_supply', 'pump_entity': 'switch.test_pump'}, options={})
    coordinator = CirculationCoordinator(None, None, 'switch.test_pump')
    hass = SimpleNamespace(states=SimpleNamespace(get=states.get), data={DOMAIN:{entry.entry_id:coordinator}},
        config_entries=SimpleNamespace(async_get_entry=lambda entry_id:entry))
    data = entry_status(hass, entry, coordinator, now=now)
    assert data['flow']['value'] == 45.2
    assert data['buffer'] is None
    assert data['heatmap'] is None
    assert data['next_start'] is None
    assert data['reason'] == 'monitoring'
    assert data['status_level'] == 'normal'
    states['sensor.test_supply'].last_reported = now - timedelta(minutes=11)
    assert entry_status(hass, entry, coordinator, now=now)['reason'] == 'fresh_flow_value_missing'
    states['sensor.test_supply'].state = 'nan'
    assert entry_status(hass, entry, coordinator, now=now)['flow']['value'] is None
    states['switch.test_pump'].state = 'unavailable'
    assert entry_status(hass, entry, coordinator, now=now)['reason'] == 'pump_state_unknown'
    hass.config_entries.async_get_entry = lambda entry_id:None
    assert dashboard_status(hass) == {'entries': []}
