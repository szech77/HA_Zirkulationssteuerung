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
from custom_components.warmwasser_zirkulation.frontend import websocket_status, websocket_configure, websocket_import_history
from custom_components.warmwasser_zirkulation.observations import OBSERVERS
from custom_components.warmwasser_zirkulation.sensor import WarmwaterReasonSensor
from custom_components.warmwasser_zirkulation.switch import WarmwaterAutomationSwitch


class TestNativePanel(IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        self.directory = TemporaryDirectory(prefix='circulation-panel-')
        self.hass = HomeAssistant(self.directory.name)
        self.hass.data[frontend.DATA_EXTRA_MODULE_URL] = frontend.UrlManager(lambda *args: None, [])
        self.entries = {}
        self.hass.http = SimpleNamespace(async_register_static_paths=AsyncMock())
        self.hass.config_entries = SimpleNamespace(async_get_entry=self.entries.get,
            async_forward_entry_setups=AsyncMock(), async_unload_platforms=AsyncMock(return_value=True))
        self.asset_patch = patch('custom_components.warmwasser_zirkulation.frontend.asset_version', return_value='verified-build')
        self.asset_patch.start()
        self.addCleanup(self.asset_patch.stop)
        self.service_calls = []
        async def service(call):
            self.service_calls.append(call)
            self.hass.states.async_set(call.data['entity_id'], 'on' if call.service == 'turn_on' else 'off')
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
        assert panel.sidebar_icon == 'warmwasser:circulation'
        assert self.hass.data[frontend.DATA_EXTRA_MODULE_URL].urls == frozenset(['/warmwasser-zirkulation-icons.js?v=verified-build'])
        # HA gives config panels precedence over the native options dialog.
        # Keeping this unset lets the integration gear open ConfigFlow options.
        assert panel.config_panel_domain is None
        assert panel.config['_panel_custom']['name'] == 'warmwasser-panel'
        assert panel.config['_panel_custom']['module_url'].endswith('panel.js?v=verified-build')
        self.hass.http.async_register_static_paths.assert_awaited_once()
        paths = self.hass.http.async_register_static_paths.call_args.args[0]
        assert {path.url_path for path in paths} == {'/warmwasser-zirkulation-static', '/warmwasser-zirkulation-icons.js'}
        self.hass.config_entries.async_forward_entry_setups.assert_awaited_once_with(self.entry, ['sensor', 'switch'])
        connection = SimpleNamespace(user=SimpleNamespace(is_admin=True), send_result=Mock(), send_error=Mock())
        websocket_status(self.hass, connection, {'id': 1, 'type': DOMAIN + '/status'})
        await asyncio.sleep(0)
        response = connection.send_result.call_args.args[1]
        assert response['entries'][0]['flow']['value'] == 45
        assert len(response['entries'][0]['heatmap']['rows']) == 7
        assert self.service_calls == []
        assert await async_unload_entry(self.hass, self.entry)
        assert not frontend.async_panel_exists(self.hass, 'warmwasser-zirkulation')
        assert not self.hass.data[OBSERVERS]
        assert not self.hass.data[frontend.DATA_EXTRA_MODULE_URL].urls

    async def test_non_admins_and_anonymous_connections_cannot_read_operating_data(self):
        for user in (None, SimpleNamespace(is_admin=False)):
            connection = SimpleNamespace(user=user, send_result=Mock())
            with self.assertRaises(Unauthorized):
                websocket_status(self.hass, connection, {'id': 1, 'type': DOMAIN + '/status'})
            connection.send_result.assert_not_called()

    async def test_dashboard_write_permissions_validation_conflict_and_persistence(self):
        from custom_components.warmwasser_zirkulation.domain import default_schedule
        await async_setup_entry(self.hass, self.entry)
        values = {'mode':'active', 'schedule':default_schedule(), 'vacation_active':False, 'vacation_windows':[]}
        values['schedule']['mon'] = [{'start':'06:00', 'end':'08:00'}, {'start':'18:00', 'end':'21:00'}]
        message = {'id':2, 'type': DOMAIN+'/configure', 'entry_id':self.entry.entry_id, 'revision':0, 'settings':values}
        for user in (None, SimpleNamespace(is_admin=False)):
            denied = SimpleNamespace(user=user, send_result=Mock(), send_error=Mock())
            with self.assertRaises(Unauthorized): websocket_configure(self.hass, denied, message)
            denied.send_result.assert_not_called()
        completed = asyncio.Event()
        connection = SimpleNamespace(user=SimpleNamespace(is_admin=True),
            send_result=Mock(side_effect=lambda *args: completed.set()),
            send_error=Mock(side_effect=lambda *args: completed.set()))
        async def request(payload):
            completed.clear()
            websocket_configure(self.hass, connection, payload)
            await asyncio.wait_for(completed.wait(), timeout=20)
        await request(message)
        connection.send_error.assert_not_called()
        connection.send_result.assert_called_with(2, {'revision':1})
        control = self.hass.data[DOMAIN][self.entry.entry_id]
        assert control.settings() == values
        assert (await control.store.load())['schedule']['mon'] == values['schedule']['mon']
        await request(message)
        assert connection.send_error.call_args.args[1] == 'settings_conflict'
        invalid = dict(message, revision=1, settings=dict(values, vacation_active='true'))
        await request(invalid)
        assert connection.send_error.call_args.args[1] == 'invalid_settings'
        await request(dict(message, entry_id='missing'))
        assert connection.send_error.call_args.args[1] == 'entry_unavailable'
        assert self.service_calls == []

    async def test_control_tick_starts_and_stops_without_browser_requests(self):
        from custom_components.warmwasser_zirkulation.domain import PumpState, Sample
        from homeassistant.util import dt as dt_util
        await async_setup_entry(self.hass, self.entry)
        observer = self.hass.data[OBSERVERS][self.entry.entry_id]
        control = observer.coordinator
        values = control.settings(); values['mode']='active'
        values['schedule'] = {day:[{'start':'00:00','end':'24:00'}] for day in values['schedule']}
        await control.async_configure(values, 0)
        at = dt_util.utcnow().replace(hour=12, minute=0)
        observer.calendar_year = at.year
        observer.control_samples = [Sample(at-timedelta(minutes=2),40,PumpState.OFF),Sample(at,45,PumpState.OFF)]
        await observer._control_tick(at)
        assert self.hass.states.get('switch.test_pump').state == 'on'
        assert control.runtime.pump_until is not None
        await observer._control_tick(at+timedelta(seconds=120))
        assert self.hass.states.get('switch.test_pump').state == 'off'
        assert control.runtime.pump_until is None
        assert [call.service for call in self.service_calls] == ['turn_on','turn_off']

    async def test_observation_save_failure_during_unload_does_not_leave_owned_pump_running(self):
        from homeassistant.util import dt as dt_util
        await async_setup_entry(self.hass, self.entry)
        control = self.hass.data[DOMAIN][self.entry.entry_id]
        control.runtime.pump_until = dt_util.utcnow() + timedelta(minutes=2)
        self.hass.states.async_set('switch.test_pump', 'on')
        observer = self.hass.data[OBSERVERS][self.entry.entry_id]
        with patch.object(observer.store, 'async_save', side_effect=OSError('synthetic storage error')):
            with self.assertRaises(OSError):
                await async_unload_entry(self.hass, self.entry)
        assert self.hass.states.get('switch.test_pump').state == 'off'
        assert control.runtime.pump_until is None

    async def test_background_history_bootstrap_is_idempotent_and_never_switches_hardware(self):
        from custom_components.warmwasser_zirkulation.history import HistoricalTemperature, replay_history
        from copy import deepcopy
        at=datetime(2026,11,23,7,tzinfo=timezone.utc)
        async def read(hass,flow,pump,start,end,zone,threshold,last_event):
            base=start+timedelta(hours=7)
            values=[HistoricalTemperature(base+timedelta(minutes=n),40+n*.2) for n in (0,5,10,15)]
            return replay_history(values,[],start,end,zone,threshold,last_event)
        self.hass.config.components.add('recorder')
        with patch('homeassistant.util.dt.utcnow',return_value=at), patch(
                'custom_components.warmwasser_zirkulation.recorder.read_history_day',side_effect=read) as query:
            await async_setup_entry(self.hass,self.entry)
            observer=self.hass.data[OBSERVERS][self.entry.entry_id]
            await observer.import_task
            assert observer.import_info['state']=='complete'
            assert observer.import_info['days']==28
            assert observer.import_info['assumed_pump_off']
            assert len(observer.coordinator.model.samples)==28
            before=deepcopy(observer.history.days)
            assert observer.request_history(force=True)
            await observer.import_task
            assert observer.history.days==before
            assert len(observer.coordinator.model.samples)==28
            assert query.call_count==56
            saved=await observer.store.async_load()
            assert saved['history_import']['state']=='complete'
            assert len(saved['days'])==28
            values=observer.coordinator.settings()
            values['schedule']={day:[{'start':'06:00','end':'09:00'}] for day in values['schedule']}
            await observer.coordinator.async_configure(values,0)
            await observer._control_tick(at)
            assert observer.next_prediction is not None
        assert self.service_calls==[]

    async def test_history_failure_preserves_live_monitoring_and_hides_private_exception(self):
        self.hass.config.components.add('recorder')
        with patch('custom_components.warmwasser_zirkulation.recorder.read_history_day',side_effect=RuntimeError('synthetic private response')):
            await async_setup_entry(self.hass,self.entry)
            observer=self.hass.data[OBSERVERS][self.entry.entry_id]
            await observer.import_task
        assert observer.import_info['state']=='error'
        assert observer.problem is None
        assert self.service_calls==[]

    async def test_history_import_resumes_from_persisted_day_after_failure_and_reload(self):
        from custom_components.warmwasser_zirkulation.history import HistoricalTemperature, replay_history
        at=datetime(2026,11,23,7,tzinfo=timezone.utc)
        calls=[]
        async def read(hass,flow,pump,start,end,zone,threshold,last_event):
            calls.append(start)
            if len(calls)==3:
                raise RuntimeError('synthetic private database details')
            values=[HistoricalTemperature(start+timedelta(hours=7,minutes=n),40+n*.2) for n in (0,5,10,15)]
            return replay_history(values,[],start,end,zone,threshold,last_event)
        self.hass.config.components.add('recorder')
        with patch('homeassistant.util.dt.utcnow',return_value=at), patch(
                'custom_components.warmwasser_zirkulation.recorder.read_history_day',side_effect=read):
            await async_setup_entry(self.hass,self.entry)
            observer=self.hass.data[OBSERVERS][self.entry.entry_id]
            with self.assertLogs('custom_components.warmwasser_zirkulation.observations',level='ERROR') as log:
                await observer.import_task
            assert 'synthetic private database details' not in str(log.output)
            assert observer.import_info['state']=='error'
            assert observer.import_info['days']==2
            await async_unload_entry(self.hass,self.entry)
            await async_setup_entry(self.hass,self.entry)
            restored=self.hass.data[OBSERVERS][self.entry.entry_id]
            await restored.import_task
            assert restored.import_info['state']=='complete' and restored.import_info['days']==28
            assert calls[2]==calls[3]
            assert len(calls)==29
            assert len(restored.coordinator.model.samples)==28
        assert self.service_calls==[]

    async def test_pending_history_import_is_cancelled_when_unloading(self):
        started=asyncio.Event()
        async def wait(*args):
            started.set()
            await asyncio.Event().wait()
        self.hass.config.components.add('recorder')
        with patch('custom_components.warmwasser_zirkulation.recorder.read_history_day',side_effect=wait):
            await async_setup_entry(self.hass,self.entry)
            observer=self.hass.data[OBSERVERS][self.entry.entry_id]
            await asyncio.wait_for(started.wait(),5)
            assert await async_unload_entry(self.hass,self.entry)
            assert observer.import_task.done() and observer.closed
        assert self.service_calls==[]

    async def test_history_import_command_requires_admin_and_loaded_entry(self):
        payload={'id':3,'type':DOMAIN+'/import_history','entry_id':self.entry.entry_id}
        for user in (None,SimpleNamespace(is_admin=False)):
            connection=SimpleNamespace(user=user,send_result=Mock(),send_error=Mock())
            with self.assertRaises(Unauthorized): websocket_import_history(self.hass,connection,payload)
        done=asyncio.Event()
        connection=SimpleNamespace(user=SimpleNamespace(is_admin=True),send_result=Mock(side_effect=lambda *args:done.set()),send_error=Mock(side_effect=lambda *args:done.set()))
        websocket_import_history(self.hass,connection,payload)
        await asyncio.wait_for(done.wait(),5)
        assert connection.send_error.call_args.args[1]=='entry_unavailable'
        await async_setup_entry(self.hass,self.entry)
        done.clear(); websocket_import_history(self.hass,connection,payload)
        await asyncio.wait_for(done.wait(),5)
        assert connection.send_error.call_args.args[1]=='history_unavailable'

    async def test_version_one_native_stores_migrate_both_envelopes_and_payloads_automatically(self):
        import json
        from pathlib import Path
        from homeassistant.helpers.storage import Store
        from custom_components.warmwasser_zirkulation.domain import default_schedule
        runtime_key=f'{DOMAIN}.{self.entry.entry_id}'
        observation_key=runtime_key+'.observations'
        schedule={day:[] for day in ('mon','tue','wed','thu','fri','sat','sun','holiday')}
        schedule['sun']=[{'start':'06:00','end':'10:00'}]
        schedule['holiday']=[{'start':'08:00','end':'12:00'}]
        await Store(self.hass,1,runtime_key).async_save({'schedule':schedule,'daily_starts':2,'settings_revision':4})
        original={'days':{'2026-11-22':{'coverage':[900]*48,'events':[True]*48}},'threshold':.2,'learning_samples':[.3]*12}
        await Store(self.hass,1,observation_key).async_save(original)
        await async_setup_entry(self.hass,self.entry)
        control=self.hass.data[DOMAIN][self.entry.entry_id]
        observer=self.hass.data[OBSERVERS][self.entry.entry_id]
        assert control.runtime.schema_version==2 and control.runtime.settings_revision==5
        assert control.runtime.daily_starts==2
        assert control.runtime.schedule['sun_holiday']==[{'start':'08:00','end':'10:00'}]
        assert observer.history.days['2026-11-22']['events']==[True]*48
        assert control.model.samples==[.3]*12 and control.model.threshold==.2
        for key in (runtime_key,observation_key):
            path=Path(self.directory.name)/'.storage'/key
            raw=json.loads(await self.hass.async_add_executor_job(path.read_text))
            assert raw['version']==2 and raw['data']['schema_version']==2
        await async_unload_entry(self.hass,self.entry)
        await async_setup_entry(self.hass,self.entry)
        assert self.hass.data[DOMAIN][self.entry.entry_id].runtime.settings_revision==5
        assert self.service_calls==[]

    async def test_unknown_newer_storage_is_not_overwritten(self):
        from homeassistant.helpers.storage import Store
        from homeassistant.exceptions import UnsupportedStorageVersionError
        key=f'{DOMAIN}.{self.entry.entry_id}'
        future=Store(self.hass,3,key)
        original={'schema_version':3,'enabled':False}
        await future.async_save(original)
        with self.assertRaises(UnsupportedStorageVersionError):
            await async_setup_entry(self.hass,self.entry)
        assert await future.async_load()==original
        assert self.service_calls==[]

    async def test_heatmap_plan_is_visible_in_monitoring_without_enabling_or_switching_pump(self):
        from copy import deepcopy
        at=datetime(2026,1,26,7,tzinfo=timezone.utc)
        await async_setup_entry(self.hass,self.entry)
        observer=self.hass.data[OBSERVERS][self.entry.entry_id]
        control=observer.coordinator
        values=control.settings();values['schedule']['mon']=[{'start':'06:00','end':'09:00'}]
        await control.async_configure(values,0)
        for week in (3,2,1):
            base=at-timedelta(weeks=week)
            for n in (0,5,10):observer.history.observe(base+timedelta(minutes=n),base+timedelta(minutes=n+5),timezone.utc)
            observer.history.event(base+timedelta(minutes=5),timezone.utc)
        before=deepcopy(control.runtime.__dict__)
        with patch('homeassistant.util.dt.utcnow',return_value=at):
            snapshot=observer.snapshot()
        assert snapshot['planning']['mode']=='monitoring'
        assert snapshot['rows'][0]['cells'][14]['allowed_windows']
        assert snapshot['rows'][0]['cells'][14]['planned_runs']
        assert snapshot['planning']['next_start']==(at+timedelta(minutes=3)).isoformat()
        assert control.runtime.__dict__==before
        assert not control.runtime.enabled and not control.runtime.demand_automation
        assert self.service_calls==[]

    async def test_panel_is_shared_and_not_removed_until_last_entry_unloads(self):
        await async_setup_entry(self.hass, self.entry)
        another = SimpleNamespace(entry_id='synthetic-panel-two', title='Second synthetic circulation',
                                  data=self.entry.data, options={})
        self.entries[another.entry_id] = another
        await async_setup_entry(self.hass, another)
        assert await async_unload_entry(self.hass, self.entry)
        assert frontend.async_panel_exists(self.hass, 'warmwasser-zirkulation')
        assert len(self.hass.data[frontend.DATA_EXTRA_MODULE_URL].urls) == 1
        self.hass.http.async_register_static_paths.assert_awaited_once()
        assert await async_unload_entry(self.hass, another)
        assert not frontend.async_panel_exists(self.hass, 'warmwasser-zirkulation')
        assert not self.hass.data[frontend.DATA_EXTRA_MODULE_URL].urls

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
            assert not self.hass.data[frontend.DATA_EXTRA_MODULE_URL].urls
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
