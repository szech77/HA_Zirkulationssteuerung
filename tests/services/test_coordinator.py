from datetime import datetime, timedelta, timezone

import pytest

from custom_components.warmwasser_zirkulation.app.services.coordinator import CirculationCoordinator
from custom_components.warmwasser_zirkulation.app.models.detection import PumpState, Sample


class Store:
    def __init__(self): self.data = {}
    async def load(self): return self.data
    async def save(self, state): self.data = dict(state)


class Pump:
    def __init__(self, fails=False): self.calls = []; self.fails = fails
    async def turn_on(self, entity_id):
        if self.fails: raise RuntimeError("unreachable")
        self.calls.append(entity_id)
    async def turn_off(self, entity_id): pass


def samples(now):
    return [Sample(now - timedelta(minutes=2), 40, PumpState.OFF), Sample(now, 50, PumpState.OFF)]


@pytest.mark.asyncio
async def test_monitoring_never_switches_pump():
    pump, store = Pump(), Store()
    coordinator = CirculationCoordinator(pump, store, "switch.pump")
    coordinator.runtime.enabled = False
    coordinator.runtime.demand_automation = True
    now = datetime.now(timezone.utc)
    assert await coordinator.process(samples(now), now) == "monitoring"
    assert pump.calls == []


@pytest.mark.asyncio
async def test_missing_fresh_value_pauses_automation():
    pump, store = Pump(), Store()
    coordinator = CirculationCoordinator(pump, store, "switch.pump")
    now = datetime.now(timezone.utc)
    assert await coordinator.process([Sample(now - timedelta(minutes=11), 40, PumpState.OFF)], now) == "fresh_flow_value_missing"
    assert store.data["last_reason"] == "fresh_flow_value_missing"


@pytest.mark.asyncio
async def test_unreachable_pump_is_fail_closed_and_logged_as_reason():
    pump, store = Pump(fails=True), Store()
    coordinator = CirculationCoordinator(pump, store, "switch.pump")
    coordinator.runtime.schedule = {day: [{"start": "00:00", "end": "24:00"}] for day in coordinator.runtime.schedule}
    coordinator.runtime.enabled = True
    coordinator.runtime.demand_automation = True
    now = datetime.now(timezone.utc)
    assert await coordinator.process(samples(now), now) == "pump_unreachable"
    assert coordinator.runtime.daily_starts == 0


@pytest.mark.asyncio
async def test_concurrent_trigger_does_not_double_start():
    pump, store = Pump(), Store()
    coordinator = CirculationCoordinator(pump, store, "switch.pump")
    coordinator.runtime.schedule = {day: [{"start": "00:00", "end": "24:00"}] for day in coordinator.runtime.schedule}
    coordinator.runtime.enabled = True
    coordinator.runtime.demand_automation = True
    now = datetime.now(timezone.utc)
    assert await coordinator.process(samples(now), now) == "started"
    assert await coordinator.process(samples(now), now) == "pump_already_running"
    assert len(pump.calls) == 1



@pytest.mark.asyncio
@pytest.mark.parametrize('seconds', [1, 90, 3600, 5400, 43200, 86400])
async def test_runtime_limits_are_durable_and_preserved_for_older_clients(seconds):
    pump, store = Pump(), Store()
    control = CirculationCoordinator(pump, store, 'switch.pump')
    await control.async_configure({**control.settings(), 'runtime_seconds': seconds, 'max_starts': 12}, 0)
    assert control.runtime_seconds == seconds and control.max_starts == 12
    restored = CirculationCoordinator(pump, store, 'switch.pump')
    await restored.async_start()
    assert restored.runtime_seconds == seconds and restored.max_starts == 12
    await restored.async_configure(restored.settings(), 1)
    assert restored.runtime_seconds == seconds and restored.max_starts == 12
    assert pump.calls == []


@pytest.mark.asyncio
@pytest.mark.parametrize('seconds', [0, -1, 86401, True, 1.5, '90', float('inf')])
async def test_invalid_runtime_never_changes_settings_or_issues_commands(seconds):
    pump, store = Pump(), Store()
    control = CirculationCoordinator(pump, store, 'switch.pump')
    with pytest.raises(ValueError):
        await control.async_configure({**control.settings(), 'runtime_seconds': seconds}, 0)
    assert control.runtime_seconds == 120 and control.runtime.settings_revision == 0
    assert store.data == {} and pump.calls == []


@pytest.mark.asyncio
async def test_failed_persistence_does_not_publish_new_runtime_limits():
    class FailedStore(Store):
        async def save(self, state): raise OSError('synthetic write failure')
    pump = Pump(); control = CirculationCoordinator(pump, FailedStore(), 'switch.pump')
    with pytest.raises(OSError):
        await control.async_configure({**control.settings(), 'runtime_seconds': 5400, 'max_starts': 12}, 0)
    assert control.runtime_seconds == 120 and control.max_starts == 6
    assert control.runtime.settings_revision == 0 and pump.calls == []


@pytest.mark.asyncio
async def test_long_run_keeps_its_confirmed_deadline_when_runtime_is_edited_and_restored():
    pump, store = Pump(), Store()
    control = CirculationCoordinator(pump, store, 'switch.pump')
    values = {**control.settings(), 'mode': 'active', 'runtime_seconds': 5400}
    values['schedule'] = {day: [{'start':'00:00','end':'24:00'}] for day in values['schedule']}
    await control.async_configure(values, 0)
    now = datetime(2026, 1, 5, 8, tzinfo=timezone.utc)
    assert await control.process(samples(now), now) == 'started'
    deadline = now + timedelta(minutes=90)
    assert control.runtime.pump_until == deadline
    await control.async_update_limits(1800, 8)
    assert control.runtime.pump_until == deadline
    restored = CirculationCoordinator(pump, store, 'switch.pump')
    await restored.async_start()
    assert restored.runtime_seconds == 1800 and restored.runtime.pump_until == deadline
    assert await restored.process(samples(now), now + timedelta(minutes=30)) == 'pump_already_running'
    assert await restored.process([], deadline) == 'stopped'
    assert restored.runtime.pump_until is None and len(pump.calls) == 1


@pytest.mark.asyncio
async def test_long_runtime_requires_the_whole_run_to_fit_inside_permission():
    control = CirculationCoordinator(Pump(), Store(), 'switch.pump')
    values = {**control.settings(), 'mode':'active', 'runtime_seconds':5400}
    values['schedule']['mon'] = [{'start':'06:00','end':'07:00'}]
    await control.async_configure(values, 0)
    now = datetime(2026, 1, 5, 6, tzinfo=timezone.utc)
    assert await control.process(samples(now), now) == 'outside_schedule'
    assert control.pump.calls == []
