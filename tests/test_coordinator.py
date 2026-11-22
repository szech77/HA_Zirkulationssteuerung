from datetime import datetime, timedelta, timezone

import pytest

from custom_components.warmwasser_zirkulation.coordinator import CirculationCoordinator
from custom_components.warmwasser_zirkulation.domain import PumpState, Sample


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
    coordinator.runtime.enabled = True
    coordinator.runtime.demand_automation = True
    now = datetime.now(timezone.utc)
    assert await coordinator.process(samples(now), now) == "pump_unreachable"
    assert coordinator.runtime.daily_starts == 0


@pytest.mark.asyncio
async def test_concurrent_trigger_does_not_double_start():
    pump, store = Pump(), Store()
    coordinator = CirculationCoordinator(pump, store, "switch.pump")
    coordinator.runtime.enabled = True
    coordinator.runtime.demand_automation = True
    now = datetime.now(timezone.utc)
    assert await coordinator.process(samples(now), now) == "started"
    assert await coordinator.process(samples(now), now) == "pump_already_running"
    assert len(pump.calls) == 1

