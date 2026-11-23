"""Build dashboard data from real HA states and coordinator values."""
from datetime import datetime, timezone
from math import isfinite

from ..core.config import entry_configuration
from ..core.const import DOMAIN, MAX_RUNTIME_SECONDS, MAX_DAILY_STARTS


def sensor_status(hass, entity_id, now):
    if not entity_id:
        return None
    state = hass.states.get(entity_id)
    value = None
    if state is not None:
        try:
            value = float(state.state)
        except (TypeError, ValueError):
            value = None
    if value is not None and not isfinite(value):
        value = None
    at = getattr(state, 'last_reported', None) if state is not None else None
    return {'entity_id': entity_id, 'name': state.name if state is not None else entity_id,
            'value': value, 'unit': state.attributes.get('unit_of_measurement') if state is not None else None,
            'stale': at is None or not 0 <= (now - at).total_seconds() <= 600,
            'updated_at': at.isoformat() if at is not None else None}


def entry_status(hass, entry, coordinator, observer=None, now=None, *, include_heatmap=True):
    now = now or datetime.now(timezone.utc)
    configuration = entry_configuration(entry)
    pump = hass.states.get(coordinator.pump_entity)
    flow = sensor_status(hass, configuration.get('flow_sensor'), now)
    reason = coordinator.runtime.last_reason
    if observer is not None and observer.problem:
        reason = observer.problem
    elif reason != 'pump_unreachable' and (not coordinator.runtime.enabled or not coordinator.runtime.demand_automation):
        reason = 'monitoring'
    if flow is None or flow['value'] is None or flow['stale']:
        reason = 'fresh_flow_value_missing'
    if pump is None or pump.state not in ('on', 'off'):
        reason = 'pump_state_unknown'
    if getattr(observer, 'control_problem', None):
        reason = observer.control_problem
    if coordinator.runtime.control_fault:
        reason = 'pump_unreachable'
    level = 'error' if reason in ('pump_unreachable', 'control_failed') else (
        'warning' if reason in ('fresh_flow_value_missing', 'pump_state_unknown', 'daily_limit_reached', 'calendar_unavailable') else 'normal')
    heatmap = observer.snapshot() if observer is not None and include_heatmap else None
    next_start = (heatmap.get('planning',{}).get('next_start') if heatmap is not None else
                  observer.next_prediction.at.isoformat() if getattr(observer,'next_prediction',None) else None)
    return {'entry_id': entry.entry_id, 'title': entry.title,
            'reason': reason, 'status_level': level, 'flow': flow,
            'buffer': sensor_status(hass, configuration.get('buffer_sensor'), now),
            'pump': {'entity_id': coordinator.pump_entity,
                     'state': pump.state if pump is not None and pump.state in ('on', 'off') else 'unknown'},
            'settings': coordinator.settings(), 'settings_revision': coordinator.runtime.settings_revision,
            'enabled': coordinator.runtime.enabled,
            'demand_automation': coordinator.runtime.demand_automation,
            'threshold': coordinator.model.threshold, 'sample_size': len(coordinator.model.samples),
            'learning_ready': len(coordinator.model.samples) >= coordinator.model.min_samples,
            'daily_starts': coordinator.runtime.daily_starts, 'max_starts': coordinator.max_starts,
            'remaining_starts': max(0, coordinator.max_starts - coordinator.runtime.daily_starts),
            'runtime_seconds': coordinator.runtime_seconds,
            'runtime_max_seconds': MAX_RUNTIME_SECONDS, 'max_daily_starts': MAX_DAILY_STARTS,
            'pump_until': coordinator.runtime.pump_until.isoformat() if coordinator.runtime.pump_until else None,
            'next_start': next_start,
            'history_import': dict(observer.import_info) if observer is not None else None,
            'country': configuration.get('country'), 'subdivision': configuration.get('subdivision'),
            'heatmap': heatmap}


def dashboard_status(hass):
    observers = hass.data.get(DOMAIN + '_observations', {})
    result = []
    for entry_id, coordinator in hass.data.get(DOMAIN, {}).items():
        entry = hass.config_entries.async_get_entry(entry_id)
        if entry is not None:
            result.append(entry_status(hass, entry, coordinator, observers.get(entry_id)))
    return {'entries': result}
