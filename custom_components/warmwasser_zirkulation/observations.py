"""Collect measurements and schedule serialized control independently of the panel."""
from datetime import datetime, timedelta, timezone
import logging
from math import isfinite

from homeassistant.core import callback
from homeassistant.helpers.event import async_track_state_change_event, async_track_time_interval
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from .calendar import holiday_dates
from .configuration import entry_configuration
from .const import DOMAIN
from .domain import PumpState, Sample
from .usage import UsageHistory

_LOGGER = logging.getLogger(__name__)
OBSERVERS = DOMAIN + '_observations'


def temperature(state):
    if state is None:
        return None
    try:
        value = float(state.state)
    except (TypeError, ValueError):
        return None
    unit = state.attributes.get('unit_of_measurement')
    if unit == '°F':
        value = (value - 32) * 5 / 9
    elif unit == 'K':
        value -= 273.15
    elif unit != '°C':
        return None
    return value if isfinite(value) and -20 <= value <= 150 else None


def _positive_number(value):
    try:
        return type(value) in (int, float) and value > 0 and isfinite(value)
    except OverflowError:
        return False


class ObservationMonitor:
    def __init__(self, hass, entry, coordinator):
        self.hass, self.entry, self.coordinator = hass, entry, coordinator
        self.configuration = entry_configuration(entry)
        self.store = Store(hass, 1, f'{DOMAIN}.{entry.entry_id}.observations')
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

    async def async_start(self):
        data = await self.store.async_load()
        if data is None:
            data = {}
        if not isinstance(data, dict):
            raise ValueError('Invalid observation data')
        self.history = UsageHistory(data.get('days', {}))
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
        if self.closed or self.control_pending or not (self.coordinator.runtime.enabled or self.coordinator.runtime.pump_until):
            return
        zone = dt_util.get_time_zone(self.hass.config.time_zone) or timezone.utc
        local_now = now.astimezone(zone)
        self.control_pending = True
        try:
            await self.coordinator.process(self.control_samples if not self.problem else [], local_now,
                self.holidays, calendar_ready=self.calendar_year == local_now.year)
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
        return {'days': self.history.days, 'last_event': self.last_event.isoformat() if self.last_event else None,
                'learning_samples': self.coordinator.model.samples, 'threshold': self.coordinator.model.threshold}

    def snapshot(self):
        zone = dt_util.get_time_zone(self.hass.config.time_zone) or timezone.utc
        return self.history.heatmap(dt_util.utcnow().astimezone(zone).date(), self.holidays,
                                    bool(self.configuration.get('country')))

    async def async_stop(self):
        self.closed = True
        for unsubscribe in self.unsubscribers:
            unsubscribe()
        self.unsubscribers.clear()
        if self.started:
            await self.store.async_save(self._data())
