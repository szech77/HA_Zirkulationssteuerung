"""Read-only HA Recorder adapter; query and replay run in Recorder's DB executor."""
from .domain import PumpState, temperature_value
from .history import HistoricalTemperature, HistoricalPump, replay_history

MAX_STATES_PER_DAY = 200_000


async def read_history_day(hass, flow_entity, pump_entity, start, end, zone, threshold, last_event):
    from homeassistant.components.recorder import get_instance
    from homeassistant.components.recorder.history import get_significant_states
    instance = get_instance(hass)
    if not await instance.async_db_ready:
        raise RuntimeError('Recorder is unavailable')

    def read_and_replay():
        records = get_significant_states(hass,start,end,entity_ids=[flow_entity,pump_entity],
            include_start_time_state=True,significant_changes_only=False,
            minimal_response=False,no_attributes=False)
        flows = records.get(flow_entity,[]); pumps = records.get(pump_entity,[])
        if len(flows) + len(pumps) > MAX_STATES_PER_DAY:
            raise ValueError('History batch is too large')
        temperatures = [HistoricalTemperature(state.last_updated,
            temperature_value(state.state,state.attributes.get('unit_of_measurement'))) for state in flows]
        pump_states = [HistoricalPump(state.last_updated,
            PumpState(state.state) if state.state in ('on','off') else PumpState.UNKNOWN) for state in pumps]
        return replay_history(temperatures,pump_states,start,end,zone,threshold,last_event)

    return await instance.async_add_executor_job(read_and_replay)
