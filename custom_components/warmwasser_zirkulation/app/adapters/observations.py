"""Collect measurements and schedule serialized control independently of the panel."""
import asyncio
from copy import deepcopy
from datetime import datetime, timedelta, timezone, time
import logging
from math import isfinite

from homeassistant.core import callback
from homeassistant.helpers.event import async_track_state_change_event, async_track_time_interval
from ..db.observations import ObservationStateStore
from homeassistant.util import dt as dt_util

from ..core.calendar import holiday_dates
from ..core.config import entry_configuration
from ..core.const import DOMAIN
from ..models.detection import PumpState, Sample
from ..utils.temperature import temperature_value
from ..services.usage import UsageHistory
from ..core.const import SCHEMA_VERSION
from ..db.migrations import migrate_observation_payload

_LOGGER = logging.getLogger(__name__)
OBSERVERS = DOMAIN + '_observations'


def temperature(state):
    return None if state is None else temperature_value(state.state,state.attributes.get('unit_of_measurement'))


def _positive_number(value):
    try:
        return type(value) in (int, float) and value > 0 and isfinite(value)
    except OverflowError:
        return False


class ObservationMonitor:
    def __init__(self, hass, entry, coordinator):
        self.hass, self.entry, self.coordinator = hass, entry, coordinator
        self.configuration = entry_configuration(entry)
        self.store = ObservationStateStore(hass, SCHEMA_VERSION, f'{DOMAIN}.{entry.entry_id}.observations')
        self.history = UsageHistory()
        self.previous = None
        self.control_samples = []
        self.pump_state = None
        self.valid_after = None
        self.last_event = None
        self.holidays = set()
        self.calendar_year = None
        self.unsubscribers = []
        self.problem = None
        self.closed = False
        self.started = False
        self.control_pending = False
        self.control_problem = None
        self.import_task = None
        self.import_info = {'state':'idle','days':0,'events':0,'assumed_pump_off':False,'until':None,'last_event':None}
        self.next_prediction = None
        self.prediction_key = None

    async def async_start(self):
        data = await self.store.async_load()
        if data is None:
            data = {}
        if not isinstance(data, dict):
            raise ValueError('Invalid observation data')
        migrated=migrate_observation_payload(data,self.hass.config.time_zone)
        if migrated!=data:
            await self.store.async_save(migrated)
        data=migrated
        source = [self.configuration.get('flow_sensor'),self.configuration.get('pump_entity'),self.hass.config.time_zone]
        if data.get('history_entities',source) != source:
            data = {}
        self.history = UsageHistory(data.get('days', {}))
        saved_import = data.get('history_import',{})
        if saved_import:
            if (not isinstance(saved_import,dict) or saved_import.get('state') not in ('idle','loading','complete','unavailable','error')
                    or type(saved_import.get('days')) is not int or not 0 <= saved_import['days'] <= 28
                    or type(saved_import.get('events')) is not int or saved_import['events'] < 0
                    or type(saved_import.get('assumed_pump_off')) is not bool):
                raise ValueError('Invalid history import data')
            for key in ('until','last_event'):
                if saved_import.get(key):
                    until = datetime.fromisoformat(saved_import[key])
                    if until.utcoffset() is None:
                        raise ValueError('History import time needs a timezone')
            self.import_info = dict(saved_import)
        try:
            self.last_event = datetime.fromisoformat(data['last_event']) if data.get('last_event') else None
        except (ValueError, TypeError):
            raise ValueError('Invalid observation event time') from None
        if self.last_event is not None and self.last_event.utcoffset() is None:
            raise ValueError('Observation time has no timezone')
        samples = data.get('learning_samples', [])
        threshold = data.get('threshold', 0.12)
        if (not isinstance(samples, list) or len(samples) > 512
                or any(not _positive_number(v) for v in samples)
                or not _positive_number(threshold)):
            raise ValueError('Invalid learning data')
        self.coordinator.model.samples = list(samples)
        self.coordinator.model.threshold = threshold
        await self._calendar()
        self.started = True
        self.refresh()
        entities = [self.configuration.get('flow_sensor'), self.configuration.get('pump_entity')]
        self.unsubscribers.append(async_track_state_change_event(self.hass, [e for e in entities if e], self._changed))
        self.unsubscribers.append(async_track_time_interval(self.hass, self._tick, timedelta(seconds=30)))
        self.unsubscribers.append(async_track_time_interval(self.hass, self._control_tick, timedelta(seconds=1)))
        self.request_history()

    async def _calendar(self):
        zone = dt_util.get_time_zone(self.hass.config.time_zone) or timezone.utc
        year = dt_util.utcnow().astimezone(zone).year
        if self.calendar_year != year:
            self.holidays = await self.hass.async_add_executor_job(holiday_dates,
                self.configuration.get('country'), self.configuration.get('subdivision'), year)
            self.calendar_year = year

    @callback
    def _changed(self, event):
        self.refresh()

    async def _tick(self, now):
        if not self.closed:
            await self._calendar()
            self.refresh()

    async def _control_tick(self, now):
        if self.closed or self.control_pending:
            return
        zone = dt_util.get_time_zone(self.hass.config.time_zone) or timezone.utc
        local_now = now.astimezone(zone)
        self.control_pending = True
        try:
            key = (int(now.timestamp())//30,self.coordinator.runtime.settings_revision,
                   self.coordinator.runtime.last_prediction_id,self.coordinator.runtime.last_start_at,
                   self.coordinator.runtime.daily_starts,self.coordinator.runtime.starts_date)
            if key != self.prediction_key:
                self.next_prediction = self.history.predict(local_now,self.coordinator.settings(),
                    self.coordinator.runtime_seconds,self.holidays,bool(self.configuration.get('country')),
                    **self._planning_limits())
                self.prediction_key = key
            if not (self.coordinator.runtime.enabled or self.coordinator.runtime.pump_until):
                return
            await self.coordinator.process(self.control_samples if not self.problem else [], local_now,
                self.holidays, calendar_ready=self.calendar_year == local_now.year,
                prediction=self.next_prediction if self.import_info['state'] != 'loading' else None)
            if self.control_problem:
                _LOGGER.info('Circulation control recovered', extra={'reason': 'control_restored'})
                self.control_problem = None
        except Exception as error:
            # Storage failures must not produce repeated start commands.
            if self.control_problem != 'control_failed':
                _LOGGER.error('Circulation control failed', extra={'reason': 'control_failed', 'error_type': type(error).__name__})
            self.control_problem = 'control_failed'
        finally:
            self.control_pending = False

    @callback
    def refresh(self):
        if self.closed:
            return
        now = dt_util.utcnow()
        state = self.hass.states.get(self.configuration.get('flow_sensor', ''))
        pump = self.hass.states.get(self.configuration.get('pump_entity', ''))
        value = temperature(state)
        reported = state.last_reported if state else None
        problem = None
        if value is None or reported is None or not 0 <= (now - reported).total_seconds() <= 600:
            problem = 'fresh_flow_value_missing'
        elif pump is None or pump.state not in ('on', 'off'):
            problem = 'pump_state_unknown'
        if problem != self.problem:
            if problem:
                _LOGGER.warning('Heatmap observation paused', extra={'reason': problem})
            elif self.problem:
                _LOGGER.info('Heatmap observation resumed', extra={'reason': 'measurements_restored'})
            self.problem = problem
        if problem:
            self.control_samples = []
            self.previous = None
            self.valid_after = now
            return
        if self.pump_state is not None and pump.state != self.pump_state:
            self.control_samples = []
            self.previous = None
            self.valid_after = now
        self.pump_state = pump.state
        if self.valid_after is not None and reported < self.valid_after:
            return
        current = Sample(reported, value, PumpState(pump.state))
        previous = self.previous
        if previous is not None and current.at <= previous.at:
            # A pump-only change invalidates a temperature interval for detection.
            if current.pump != previous.pump:
                self.previous = current
            return
        self.previous = current
        self.control_samples = [previous, current] if previous is not None else [current]
        if previous is None:
            return
        zone = dt_util.get_time_zone(self.hass.config.time_zone) or timezone.utc
        if previous.pump is PumpState.OFF and current.pump is PumpState.OFF:
            self.history.observe(previous.at, current.at, zone)
            for event in self.coordinator.detector.detect([previous, current]):
                if self.last_event is None or event.at - self.last_event >= timedelta(minutes=20):
                    self.history.event(event.at, zone)
                    self.last_event = event.at
                    self.coordinator.model.learn([], [event.slope])
                    self.coordinator.model.samples = self.coordinator.model.samples[-512:]
        self.store.async_delay_save(self._data, 30)

    def _data(self):
        return {'schema_version':SCHEMA_VERSION,'days': deepcopy(self.history.days), 'history_import':dict(self.import_info),
                'history_entities':[self.configuration.get('flow_sensor'),self.configuration.get('pump_entity'),self.hass.config.time_zone], 'last_event': self.last_event.isoformat() if self.last_event else None,
                'learning_samples': list(self.coordinator.model.samples), 'threshold': self.coordinator.model.threshold}

    def request_history(self, *, force=False):
        if self.closed or self.import_task is not None and not self.import_task.done():
            return False
        if 'recorder' not in self.hass.config.components:
            self.import_info['state'] = 'unavailable'
            return False
        zone = dt_util.get_time_zone(self.hass.config.time_zone) or timezone.utc
        today = dt_util.utcnow().astimezone(zone).date()
        if not force and self.history.sufficient(today,self.holidays,bool(self.configuration.get('country'))):
            return False
        self.import_info['state'] = 'loading'
        self.import_task = self.hass.async_create_background_task(self._import_history(force),
            'warmwater_recorder_history', eager_start=False)
        return True

    async def _import_history(self, force):
        zone = dt_util.get_time_zone(self.hass.config.time_zone) or timezone.utc
        today = dt_util.utcnow().astimezone(zone).date()
        first = datetime.combine(today-timedelta(days=28),time.min,zone)
        stop = datetime.combine(today,time.min,zone)
        cursor = first
        if not force and self.import_info.get('until'):
            cursor = max(first,datetime.fromisoformat(self.import_info['until']).astimezone(zone))
        self.import_info['days'] = max(0,min(28,(cursor.date()-first.date()).days))
        last_event = (datetime.fromisoformat(self.import_info['last_event'])
                      if not force and self.import_info.get('last_event') else None)
        try:
            from ..db.recorder import read_history_day
            while cursor < stop and not self.closed:
                end = datetime.combine(cursor.date()+timedelta(days=1),time.min,zone)
                batch = await read_history_day(self.hass,self.configuration['flow_sensor'],self.configuration['pump_entity'],
                    cursor.astimezone(timezone.utc),end.astimezone(timezone.utc),zone,self.coordinator.model.threshold,last_event)
                if self.closed:
                    return
                last_event = batch.last_event
                unseen = []
                seen = set()
                for event in batch.events:
                    local = event.at.astimezone(zone); date_key = local.date().isoformat()
                    slot = local.hour*2+local.minute//30
                    before = self.history.days.get(date_key)
                    if (before is None or not before['events'][slot]) and (date_key,slot) not in seen:
                        unseen.append(event.slope); seen.add((date_key,slot))
                self.history.merge(batch.history)
                self.history.prune(today)
                if unseen:
                    self.coordinator.model.learn([],unseen)
                    self.coordinator.model.samples = self.coordinator.model.samples[-512:]
                self.import_info['events'] += len(unseen)
                self.import_info['assumed_pump_off'] |= batch.assumed_pump_off
                self.import_info['days'] += 1
                self.import_info['until'] = end.isoformat()
                self.import_info['last_event'] = last_event.isoformat() if last_event else None
                self.prediction_key = None
                await self.store.async_save(self._data())
                cursor = end
                await asyncio.sleep(0)
            if not self.closed:
                self.import_info['state'] = 'complete'
                await self.store.async_save(self._data())
                _LOGGER.info('Recorder history import completed',extra={'reason':'history_import_complete'})
        except asyncio.CancelledError:
            raise
        except Exception as error:
            self.import_info['state'] = 'error'
            _LOGGER.error('Recorder history import failed; live monitoring continues',
                extra={'reason':'history_import_failed','error_type':type(error).__name__})

    def _planning_limits(self):
        runtime=self.coordinator.runtime
        return {'exclude_identity':runtime.last_prediction_id,'max_starts':self.coordinator.max_starts,
                'used_starts':runtime.daily_starts,'starts_date':runtime.starts_date,
                'last_start_at':runtime.last_start_at}

    def snapshot(self):
        zone = dt_util.get_time_zone(self.hass.config.time_zone) or timezone.utc
        return self.history.planning_snapshot(dt_util.utcnow().astimezone(zone),self.coordinator.settings(),
            self.coordinator.runtime_seconds,self.holidays,bool(self.configuration.get('country')),
            **self._planning_limits())

    async def async_stop(self):
        self.closed = True
        if self.import_task is not None and not self.import_task.done():
            self.import_task.cancel()
            try:
                await self.import_task
            except asyncio.CancelledError:
                pass
        for unsubscribe in self.unsubscribers:
            unsubscribe()
        self.unsubscribers.clear()
        if self.started:
            await self.store.async_save(self._data())
