"""Run against real Home Assistant; synthetic services never touch hardware."""
import asyncio
from datetime import datetime, timedelta, timezone
from tempfile import TemporaryDirectory
from types import SimpleNamespace
from unittest import IsolatedAsyncioTestCase
from unittest.mock import AsyncMock, Mock, patch
import pytest

pytest.importorskip('homeassistant', reason='Native panel checks require installed Home Assistant')

from homeassistant.core import HomeAssistant
from homeassistant.exceptions import Unauthorized, ConfigEntryNotReady
from homeassistant.components import frontend
from custom_components.warmwasser_zirkulation import async_setup_entry, async_unload_entry
from custom_components.warmwasser_zirkulation.const import DOMAIN
from custom_components.warmwasser_zirkulation.frontend import websocket_status
from custom_components.warmwasser_zirkulation.observations import OBSERVERS
from custom_components.warmwasser_zirkulation.sensor import WarmwaterReasonSensor
from custom_components.warmwasser_zirkulation.switch import WarmwaterAutomationSwitch


class TestNativePanel(IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        self.directory = TemporaryDirectory(prefix='circulation-panel-')
        self.hass = HomeAssistant(self.directory.name)
        self.entries = {}
        self.hass.http = SimpleNamespace(async_register_static_paths=AsyncMock())
        self.hass.config_entries = SimpleNamespace(async_get_entry=self.entries.get,
            async_forward_entry_setups=AsyncMock(), async_unload_platforms=AsyncMock(return_value=True))
        self.asset_patch = patch('custom_components.warmwasser_zirkulation.frontend.asset_version', return_value='verified-build')
        self.asset_patch.start()
        self.addCleanup(self.asset_patch.stop)
        self.service_calls = []
        async def service(call): self.service_calls.append(call)
        self.hass.services.async_register('switch', 'turn_on', service)
        self.hass.services.async_register('switch', 'turn_off', service)
        self.entry = SimpleNamespace(entry_id='synthetic-panel', title='Synthetic circulation',
            data={'flow_sensor': 'sensor.test_supply', 'pump_entity': 'switch.test_pump'}, options={})
        self.entries[self.entry.entry_id] = self.entry
        self.hass.states.async_set('sensor.test_supply', '45', {'device_class': 'temperature', 'unit_of_measurement': '°C'})
        self.hass.states.async_set('switch.test_pump', 'off')

    async def asyncTearDown(self):
        try:
            for entry_id in list(self.hass.data.get(DOMAIN, {})):
                await async_unload_entry(self.hass, self.entries[entry_id])
            await self.hass.async_stop(force=True)
        finally:
            self.directory.cleanup()

    async def test_setup_registers_sidebar_status_and_platforms_then_unloads_cleanly(self):
        assert await async_setup_entry(self.hass, self.entry)
        assert frontend.async_panel_exists(self.hass, 'warmwasser-zirkulation')
        panel = self.hass.data[frontend.DATA_PANELS]['warmwasser-zirkulation']
        assert panel.require_admin is True
        # HA gives config panels precedence over the native options dialog.
        # Keeping this unset lets the integration gear open ConfigFlow options.
        assert panel.config_panel_domain is None
        assert panel.config['_panel_custom']['name'] == 'warmwasser-panel'
        assert panel.config['_panel_custom']['module_url'].endswith('panel.js?v=verified-build')
        self.hass.http.async_register_static_paths.assert_awaited_once()
        self.hass.config_entries.async_forward_entry_setups.assert_awaited_once_with(self.entry, ['sensor', 'switch'])
        connection = SimpleNamespace(user=SimpleNamespace(is_admin=True), send_result=Mock(), send_error=Mock())
        websocket_status(self.hass, connection, {'id': 1, 'type': DOMAIN + '/status'})
        await asyncio.sleep(0)
        response = connection.send_result.call_args.args[1]
        assert response['entries'][0]['flow']['value'] == 45
        assert len(response['entries'][0]['heatmap']['rows']) == 8
        assert self.service_calls == []
        assert await async_unload_entry(self.hass, self.entry)
        assert not frontend.async_panel_exists(self.hass, 'warmwasser-zirkulation')
        assert not self.hass.data[OBSERVERS]

    async def test_non_admins_and_anonymous_connections_cannot_read_operating_data(self):
        for user in (None, SimpleNamespace(is_admin=False)):
            connection = SimpleNamespace(user=user, send_result=Mock())
            with self.assertRaises(Unauthorized):
                websocket_status(self.hass, connection, {'id': 1, 'type': DOMAIN + '/status'})
            connection.send_result.assert_not_called()

    async def test_panel_is_shared_and_not_removed_until_last_entry_unloads(self):
        await async_setup_entry(self.hass, self.entry)
        another = SimpleNamespace(entry_id='synthetic-panel-two', title='Second synthetic circulation',
                                  data=self.entry.data, options={})
        self.entries[another.entry_id] = another
        await async_setup_entry(self.hass, another)
        assert await async_unload_entry(self.hass, self.entry)
        assert frontend.async_panel_exists(self.hass, 'warmwasser-zirkulation')
        self.hass.http.async_register_static_paths.assert_awaited_once()
        assert await async_unload_entry(self.hass, another)
        assert not frontend.async_panel_exists(self.hass, 'warmwasser-zirkulation')

    async def test_failed_platform_unload_keeps_panel_and_coordinator(self):
        await async_setup_entry(self.hass, self.entry)
        self.hass.config_entries.async_unload_platforms.return_value = False
        assert await async_unload_entry(self.hass, self.entry) is False
        assert self.entry.entry_id in self.hass.data[DOMAIN]
        assert frontend.async_panel_exists(self.hass, 'warmwasser-zirkulation')
        self.hass.config_entries.async_unload_platforms.return_value = True

    async def test_missing_assets_fail_explicitly_without_leaking_an_observer(self):
        with patch('custom_components.warmwasser_zirkulation.frontend.asset_version', side_effect=FileNotFoundError):
            with self.assertRaises(ConfigEntryNotReady):
                await async_setup_entry(self.hass, self.entry)
        assert not self.hass.data[DOMAIN]
        assert not self.hass.data[OBSERVERS]
        self.hass.config_entries.async_forward_entry_setups.assert_not_awaited()

    async def test_entity_ids_are_per_entry_and_switch_preferences_are_persisted(self):
        await async_setup_entry(self.hass, self.entry)
        coordinator = self.hass.data[DOMAIN][self.entry.entry_id]
        sensor = WarmwaterReasonSensor(coordinator, self.entry.entry_id)
        switch = WarmwaterAutomationSwitch(coordinator, self.entry.entry_id)
        assert sensor.unique_id != WarmwaterReasonSensor(coordinator, 'another-entry').unique_id
        assert switch.unique_id != WarmwaterAutomationSwitch(coordinator, 'another-entry').unique_id
        with patch.object(WarmwaterAutomationSwitch, 'async_write_ha_state'):
            await switch.async_turn_on()
            assert (await coordinator.store.load())['demand_automation'] is True
            await switch.async_turn_off()
            assert (await coordinator.store.load())['demand_automation'] is False
        assert self.service_calls == []

    async def test_live_observation_fills_heatmap_without_switching_hardware(self):
        base = datetime(2026, 1, 5, 6, tzinfo=timezone.utc)
        with patch('homeassistant.util.dt.utcnow', return_value=base):
            self.hass.states.async_set('sensor.test_supply', '45', {'device_class': 'temperature', 'unit_of_measurement': '°C'}, force_update=True, timestamp=base.timestamp())
            await async_setup_entry(self.hass, self.entry)
        for minutes in (5, 10, 15):
            with patch('homeassistant.util.dt.utcnow', return_value=base + timedelta(minutes=minutes)):
                self.hass.states.async_set('sensor.test_supply', str(45 + minutes / 5),
                    {'device_class': 'temperature', 'unit_of_measurement': '°C'}, force_update=True, timestamp=(base + timedelta(minutes=minutes)).timestamp())
                await self.hass.async_block_till_done()
        observer = self.hass.data[OBSERVERS][self.entry.entry_id]
        with patch('homeassistant.util.dt.utcnow', return_value=base + timedelta(minutes=15)):
            cell = observer.snapshot()['rows'][0]['cells'][12]
            assert cell['observed_days'] == 1
            assert cell['event_days'] == 1
        assert len(observer.coordinator.model.samples) == 1
        assert self.service_calls == []


    async def test_platform_setup_failure_and_cancellation_are_rolled_back(self):
        for error in (RuntimeError('synthetic setup failure'), asyncio.CancelledError()):
            self.hass.config_entries.async_forward_entry_setups.side_effect = error
            with self.assertRaises(type(error)):
                await async_setup_entry(self.hass, self.entry)
            assert not self.hass.data[DOMAIN]
            assert not self.hass.data[OBSERVERS]
            assert not frontend.async_panel_exists(self.hass, 'warmwasser-zirkulation')
        assert self.hass.config_entries.async_unload_platforms.await_count == 2

    async def test_bad_observation_store_is_preserved_and_setup_is_not_published(self):
        from homeassistant.helpers.storage import Store
        store = Store(self.hass, 1, f'{DOMAIN}.{self.entry.entry_id}.observations')
        original = {'days': {'2026-01-05': {'coverage': [0], 'events': [False]}}}
        await store.async_save(original)
        with self.assertRaises(ValueError):
            await async_setup_entry(self.hass, self.entry)
        assert await store.async_load() == original
        assert not self.hass.data[DOMAIN]
        assert not self.hass.data[OBSERVERS]
        assert self.service_calls == []


@pytest.mark.parametrize(('value', 'unit', 'expected'), [
    ('45', '°C', 45), ('113', '°F', 45), ('318.15', 'K', 45),
    ('unknown', '°C', None), ('nan', '°C', None), ('999', '°C', None), ('45', None, None),
])
def test_temperature_readings_have_explicit_valid_units(value, unit, expected):
    from custom_components.warmwasser_zirkulation.observations import temperature
    result = temperature(SimpleNamespace(state=value, attributes={'unit_of_measurement':unit}))
    if expected is None:
        assert result is None
    else:
        assert result == pytest.approx(expected)
