"""Exercise the HA entry boundary, JSON storage, and service error handling."""

from datetime import datetime, timedelta, timezone
import json
import sys
from types import ModuleType, SimpleNamespace
from unittest.mock import AsyncMock, call

import pytest

from custom_components.warmwasser_zirkulation import async_setup_entry, async_unload_entry
from custom_components.warmwasser_zirkulation.const import DOMAIN
from custom_components.warmwasser_zirkulation.coordinator import CirculationCoordinator
from custom_components.warmwasser_zirkulation.domain import PumpState, Sample
from custom_components.warmwasser_zirkulation.ha_adapters import HomeAssistantPumpGateway


@pytest.fixture
def ha_boundary(monkeypatch):
    # Model the public Store contract without adding HA as a Python 3.12 test dependency.
    # JSON serialization is deliberate: an in-memory dict fake misses datetime bugs.
    files = {}

    class JsonStore:
        def __init__(self, hass, version, key):
            self.key = key
            self.hass = hass
            self.version = version

        async def async_load(self):
            return json.loads(files[self.key]) if self.key in files else None

        async def async_save(self, data):
            files[self.key] = json.dumps(data, allow_nan=False)

    for name in ('homeassistant', 'homeassistant.helpers', 'homeassistant.helpers.storage'):
        module = ModuleType(name)
        module.__path__ = []
        monkeypatch.setitem(sys.modules, name, module)
    sys.modules['homeassistant.helpers.storage'].Store = JsonStore
    import_helper = ModuleType('homeassistant.helpers.importlib')
    async def async_import_module(hass, name):
        return sys.modules[name]
    import_helper.async_import_module = async_import_module
    monkeypatch.setitem(sys.modules, import_helper.__name__, import_helper)
    frontend = ModuleType('custom_components.warmwasser_zirkulation.frontend')
    frontend.async_register_frontend = AsyncMock()
    frontend.async_remove_frontend = AsyncMock()
    monkeypatch.setitem(sys.modules, frontend.__name__, frontend)
    observations = ModuleType('custom_components.warmwasser_zirkulation.observations')
    class Observer:
        def __init__(self, *args): pass
        async def async_start(self): pass
        async def async_stop(self): pass
    observations.ObservationMonitor = Observer
    monkeypatch.setitem(sys.modules, observations.__name__, observations)
    hass = SimpleNamespace(
        data={}, config_entries=SimpleNamespace(async_forward_entry_setups=AsyncMock(),
            async_unload_platforms=AsyncMock(return_value=True)), services=SimpleNamespace(async_call=AsyncMock()),
        states=SimpleNamespace(get=lambda entity_id: SimpleNamespace(state='off')),
    )
    entry = SimpleNamespace(entry_id='synthetic-entry', data={
        'pump_entity': 'switch.test_pump', 'runtime_seconds': 90, 'max_starts': 3,
    })
    return hass, entry, files


def samples(now):
    return [Sample(now - timedelta(minutes=2), 40, PumpState.OFF),
            Sample(now, 50, PumpState.OFF)]


@pytest.mark.asyncio
async def test_entry_starts_in_monitoring_and_unloads_without_pump_commands(ha_boundary):
    hass, entry, files = ha_boundary
    assert await async_setup_entry(hass, entry) is True
    coordinator = hass.data[DOMAIN][entry.entry_id]
    assert coordinator.runtime.enabled is False
    assert coordinator.runtime.demand_automation is False
    assert coordinator.runtime_seconds == 90
    assert coordinator.max_starts == 3
    assert await coordinator.process(samples(datetime.now(timezone.utc)), datetime.now(timezone.utc)) == 'monitoring'
    stored = json.loads(files[f'{DOMAIN}.{entry.entry_id}'])
    assert stored['enabled'] is False
    assert stored['pump_until'] is None
    assert await async_unload_entry(hass, entry) is True
    assert entry.entry_id not in hass.data[DOMAIN]
    hass.services.async_call.assert_not_awaited()


@pytest.mark.asyncio
async def test_started_run_survives_json_roundtrip_without_double_start(ha_boundary):
    hass, entry, files = ha_boundary
    await async_setup_entry(hass, entry)
    coordinator = hass.data[DOMAIN][entry.entry_id]
    coordinator.runtime.enabled = coordinator.runtime.demand_automation = True
    now = datetime(2026, 1, 1, 10, tzinfo=timezone.utc)
    assert await coordinator.process(samples(now), now) == 'started'
    hass.services.async_call.assert_awaited_once_with(
        'switch', 'turn_on', {'entity_id': 'switch.test_pump'}, blocking=True,
    )
    assert json.loads(files[f'{DOMAIN}.{entry.entry_id}'])['pump_until'] == (now + timedelta(seconds=90)).isoformat()
    await async_unload_entry(hass, entry)
    await async_setup_entry(hass, entry)
    restored = hass.data[DOMAIN][entry.entry_id]
    assert restored.runtime.pump_until == now + timedelta(seconds=90)
    assert restored.runtime.daily_starts == 1
    assert await restored.process(samples(now), now) == 'pump_already_running'
    assert hass.services.async_call.await_count == 1


@pytest.mark.asyncio
async def test_entries_do_not_share_runtime_state(ha_boundary):
    hass, entry, files = ha_boundary
    first = CirculationCoordinator.from_home_assistant(hass, entry)
    await first.async_start()
    await first.process(samples(datetime.now(timezone.utc)), datetime.now(timezone.utc))
    another = SimpleNamespace(entry_id='another-synthetic-entry', data=entry.data)
    files[f'{DOMAIN}.{entry.entry_id}'] = json.dumps({'daily_starts': 2})
    second = CirculationCoordinator.from_home_assistant(hass, another)
    await second.async_start()
    assert second.runtime.daily_starts == 0
    await first.async_start()
    assert first.runtime.daily_starts == 2


@pytest.mark.asyncio
@pytest.mark.parametrize('data', [[], True, 'invalid', {'enabled': 'true'},
    {'demand_automation': 1}, {'daily_starts': -1}, {'daily_starts': True},
    {'last_reason': []}, {'pump_until': 123}, {'pump_until': 'not-a-date'},
    {'pump_until': '2026-01-01T10:00:00'}])
async def test_invalid_persisted_state_cannot_start_entry(ha_boundary, data):
    hass, entry, files = ha_boundary
    files[f'{DOMAIN}.{entry.entry_id}'] = json.dumps(data)
    with pytest.raises(ValueError):
        await async_setup_entry(hass, entry)
    assert entry.entry_id not in hass.data.get(DOMAIN, {})
    hass.services.async_call.assert_not_awaited()


@pytest.mark.asyncio
async def test_save_refuses_a_deadline_without_timezone(ha_boundary):
    hass, entry, files = ha_boundary
    coordinator = CirculationCoordinator.from_home_assistant(hass, entry)
    with pytest.raises(ValueError, match='timezone'):
        await coordinator.store.save({'pump_until': datetime(2026, 1, 1)})
    assert files == {}


@pytest.mark.asyncio
async def test_gateway_uses_awaited_services_for_start_and_stop(ha_boundary):
    hass, _, _ = ha_boundary
    gateway = HomeAssistantPumpGateway(hass)
    await gateway.turn_on('switch.test_pump')
    await gateway.turn_off('switch.test_pump')
    assert hass.services.async_call.await_args_list == [
        call('switch', 'turn_on', {'entity_id': 'switch.test_pump'}, blocking=True),
        call('switch', 'turn_off', {'entity_id': 'switch.test_pump'}, blocking=True),
    ]


@pytest.mark.asyncio
@pytest.mark.parametrize('state', [None, 'unknown', 'unavailable', 'on'])
async def test_gateway_refuses_starts_unless_pump_is_confirmed_off(ha_boundary, state):
    hass, _, _ = ha_boundary
    hass.states.get = lambda entity_id: None if state is None else SimpleNamespace(state=state)
    gateway = HomeAssistantPumpGateway(hass)
    with pytest.raises(ValueError, match='confirmed off'):
        await gateway.turn_on('switch.test_pump')
    hass.services.async_call.assert_not_awaited()
    # Unknown readings must not prevent an explicitly requested stop command.
    await gateway.turn_off('switch.test_pump')
    hass.services.async_call.assert_awaited_once_with(
        'switch', 'turn_off', {'entity_id': 'switch.test_pump'}, blocking=True,
    )


@pytest.mark.asyncio
@pytest.mark.parametrize('entity_id', ['', 'sensor.test_pump', 'switch.invalid entity'])
async def test_gateway_refuses_invalid_switch_ids(ha_boundary, entity_id):
    hass, _, _ = ha_boundary
    gateway = HomeAssistantPumpGateway(hass)
    with pytest.raises(ValueError):
        await gateway.turn_on(entity_id)
    with pytest.raises(ValueError):
        await gateway.turn_off(entity_id)
    hass.services.async_call.assert_not_awaited()


@pytest.mark.asyncio
async def test_failed_ha_service_is_not_persisted_as_success(ha_boundary, caplog):
    hass, entry, files = ha_boundary
    hass.services.async_call.side_effect = RuntimeError('synthetic service failure')
    coordinator = CirculationCoordinator.from_home_assistant(hass, entry)
    await coordinator.async_start()
    coordinator.runtime.enabled = coordinator.runtime.demand_automation = True
    now = datetime.now(timezone.utc)
    assert await coordinator.process(samples(now), now) == 'pump_unreachable'
    stored = json.loads(files[f'{DOMAIN}.{entry.entry_id}'])
    assert stored['daily_starts'] == 0
    assert stored['pump_until'] is None
    assert stored['last_reason'] == 'pump_unreachable'
    assert 'synthetic service failure' not in caplog.text
    failure = next(record for record in caplog.records if hasattr(record, 'error_type'))
    assert failure.reason == 'pump_unreachable'
    assert failure.error_type == 'RuntimeError'
