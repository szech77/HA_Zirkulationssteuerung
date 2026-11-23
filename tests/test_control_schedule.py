from copy import deepcopy
from datetime import datetime, timedelta, timezone
from zoneinfo import ZoneInfo
import asyncio
from unittest.mock import AsyncMock

import pytest
from custom_components.warmwasser_zirkulation.domain import (default_schedule, validate_control_settings, permitted_until, PumpState, Sample)
from custom_components.warmwasser_zirkulation.coordinator import CirculationCoordinator


def settings():
    result = {"mode": "active", "schedule": default_schedule(), "vacation_active": False, "vacation_windows": []}
    result["schedule"]["mon"] = [{"start": "06:00", "end": "08:00"}, {"start": "18:00", "end": "21:00"}]
    result["schedule"]["holiday"] = [{"start": "09:00", "end": "11:00"}]
    return result


def now(hour=7, minute=0):
    return datetime(2026, 1, 5, hour, minute, tzinfo=ZoneInfo("Europe/Berlin"))


def samples(at):
    return [Sample(at - timedelta(minutes=2), 40, PumpState.OFF), Sample(at, 45, PumpState.OFF)]


def coordinator():
    store = AsyncMock()
    store.load.return_value = {}
    return CirculationCoordinator(AsyncMock(), store, "switch.test_pump")


def test_multiple_windows_holidays_and_vacation_take_precedence():
    config = validate_control_settings(settings())
    for hour in (6, 7, 18, 20):
        assert permitted_until(config, now(hour), 120)
    for hour in (5, 8, 12, 21):
        assert permitted_until(config, now(hour), 120) is None
    assert permitted_until(config, now(7), 120, {now().date()}) is None
    assert permitted_until(config, now(10), 120, {now().date()})
    config["vacation_active"] = True
    assert permitted_until(config, now(10), 120, {now().date()}) is None
    config["vacation_windows"] = [{"start": "12:00", "end": "14:00"}]
    assert permitted_until(config, now(12), 120, {now().date()})
    assert permitted_until(config, now(7), 120) is None
    assert permitted_until(settings(), now() + timedelta(days=1), 120) is None


def test_complete_runtime_must_fit_and_midnight_is_explicit():
    assert permitted_until(settings(), now(7, 58), 120)
    assert permitted_until(settings(), now(7, 58), 121) is None
    assert permitted_until(settings(), now(7, 59).replace(second=30), 60) is None
    config = settings()
    config["schedule"]["mon"] = [{"start": "23:00", "end": "24:00"}]
    assert permitted_until(config, now(23, 58), 120)
    assert permitted_until(config, now(23, 59), 120) is None


def test_runtime_uses_elapsed_seconds_at_dst_transition():
    config = settings()
    config["schedule"]["sun"] = [{"start": "01:00", "end": "04:00"}]
    at = datetime(2026, 3, 29, 1, 59, tzinfo=ZoneInfo("Europe/Berlin"))
    assert permitted_until(config, at, 3660)
    assert permitted_until(config, at, 3661) is None
    with pytest.raises(ValueError):
        permitted_until(config, datetime(2026, 1, 5, 7), 120)


@pytest.mark.parametrize('windows', [None, [{"start":"08:00","end":"06:00"}],
    [{"start":"06:00","end":"06:00"}], [{"start":"24:00","end":"24:00"}],
    [{"start":"6:00","end":"08:00"}], [{"start":True,"end":"08:00"}],
    [{"start":"06:00","end":"08:00","extra":True}],
    [{"start":"06:00","end":"08:00"},{"start":"07:00","end":"09:00"}],
    [{"start":"06:00","end":"08:00"}] * 13])
def test_bad_windows_are_rejected(windows):
    config = settings(); config["schedule"]["mon"] = windows
    with pytest.raises(ValueError): validate_control_settings(config)


def test_missing_keys_invalid_modes_and_non_boolean_vacation_rejected():
    for field, value in (("mode", "on"), ("schedule", {}), ("vacation_active", "true")):
        config = settings(); config[field] = value
        with pytest.raises(ValueError): validate_control_settings(config)
    config = settings(); config.pop("mode")
    with pytest.raises(ValueError): validate_control_settings(config)


@pytest.mark.asyncio
async def test_save_restart_and_conflict_and_storage_failure():
    control = coordinator()
    await control.async_configure(settings(), 0)
    stored = deepcopy(control.store.save.call_args.args[0])
    restored = coordinator(); restored.store.load.return_value = stored
    await restored.async_start()
    assert restored.settings() == settings()
    with pytest.raises(ValueError, match="settings_conflict"):
        await restored.async_configure(settings(), 0)
    previous = restored.settings()
    restored.store.save.side_effect = OSError("synthetic private storage error")
    changed = settings(); changed["mode"] = "monitoring"
    with pytest.raises(OSError): await restored.async_configure(changed, 1)
    assert restored.settings() == previous
    assert restored.runtime.settings_revision == 1


@pytest.mark.asyncio
async def test_monitoring_empty_windows_and_calendar_failure_never_start():
    control = coordinator()
    await control.async_start()
    assert await control.process(samples(now()), now()) == "monitoring"
    await control.async_set_mode(True)
    assert await control.process(samples(now()), now()) == "outside_schedule"
    await control.async_configure(settings(), 1)
    assert await control.process(samples(now()), now(), calendar_ready=False) == "calendar_unavailable"
    assert await control.process(samples(now()), now(), {now().date()}) == "outside_schedule"
    control.pump.turn_on.assert_not_awaited()


@pytest.mark.asyncio
async def test_start_stop_deadline_and_event_deduplication():
    control = coordinator(); await control.async_configure(settings(), 0)
    results = await asyncio.gather(control.process(samples(now()), now()), control.process(samples(now()), now()))
    assert results == ["started", "pump_already_running"]
    control.pump.turn_on.assert_awaited_once()
    # Stop works with no sensor data, independently of browser or a draw event.
    assert await control.process([], now() + timedelta(seconds=120)) == "stopped"
    control.pump.turn_off.assert_awaited_once()
    assert control.runtime.pump_until is None
    assert await control.process(samples(now()), now() + timedelta(seconds=121)) == "waiting_for_demand"
    control.pump.turn_on.assert_awaited_once()


@pytest.mark.asyncio
async def test_monitoring_switch_and_removed_window_stop_owned_run():
    for change in ("monitoring", "window", "vacation"):
        control = coordinator(); await control.async_configure(settings(), 0)
        await control.process(samples(now()), now())
        config = settings()
        if change == "monitoring": config["mode"] = "monitoring"
        elif change == "vacation": config["vacation_active"] = True
        else: config["schedule"]["mon"] = []
        await control.async_configure(config, 1)
        assert await control.process([], now() + timedelta(seconds=1)) == "stopped"
        control.pump.turn_off.assert_awaited_once()


@pytest.mark.asyncio
async def test_failed_stop_is_retained_and_retried_without_another_start(caplog):
    control = coordinator(); await control.async_configure(settings(), 0)
    await control.process(samples(now()), now())
    control.pump.turn_off.side_effect = RuntimeError("private device error")
    assert await control.process([], now() + timedelta(seconds=120)) == "pump_unreachable"
    assert control.runtime.pump_until is not None
    assert await control.process([], now() + timedelta(seconds=121)) == "pump_unreachable"
    assert control.pump.turn_off.await_count == 2
    assert "private device error" not in caplog.text
    assert sum(getattr(r, 'reason', '') == 'pump_unreachable' for r in caplog.records) == 1
    control.pump.turn_off.side_effect = None
    assert await control.process([], now() + timedelta(seconds=122)) == "stopped"
    control.pump.turn_on.assert_awaited_once()


@pytest.mark.asyncio
async def test_daily_limit_resets_on_local_date_and_active_state_survives():
    control = coordinator(); config = settings()
    config["schedule"]["tue"] = config["schedule"]["mon"]
    await control.async_configure(config, 0)
    control.runtime.starts_date = now().date().isoformat(); control.runtime.daily_starts = control.max_starts
    assert await control.process(samples(now()), now()) == "daily_limit_reached"
    tomorrow = now() + timedelta(days=1)
    assert await control.process(samples(tomorrow), tomorrow) == "started"
    assert control.runtime.daily_starts == 1
    assert control.runtime.enabled


@pytest.mark.asyncio
async def test_stale_future_and_unknown_measurements_are_not_control_inputs():
    for data, expected in ((samples(now()-timedelta(minutes=11)), "fresh_flow_value_missing"),
            (samples(now()+timedelta(minutes=1)), "fresh_flow_value_missing"),
            ([Sample(now(),45,PumpState.UNKNOWN)], "pump_state_unknown")):
        control = coordinator(); await control.async_configure(settings(), 0)
        assert await control.process(data, now()) == expected
        control.pump.turn_on.assert_not_awaited()


@pytest.mark.asyncio
async def test_graceful_stop_closes_owned_run_but_not_a_manual_pump():
    control = coordinator(); await control.async_configure(settings(), 0)
    await control.process(samples(now()), now()); await control.async_stop()
    control.pump.turn_off.assert_awaited_once()
    assert await control.process(samples(now()), now()) == "monitoring"
    other = coordinator(); await other.async_stop()
    other.pump.turn_off.assert_not_awaited()


@pytest.mark.asyncio
async def test_device_fault_does_not_clear_when_measurements_disappear_and_return():
    control = coordinator(); await control.async_configure(settings(), 0)
    control.pump.turn_on.side_effect = RuntimeError('private test failure')
    assert await control.process(samples(now()), now()) == 'pump_unreachable'
    assert await control.process([], now()) == 'pump_unreachable'
    control.pump.turn_on.side_effect = None
    later = now() + timedelta(minutes=5)
    assert await control.process(samples(later), later) == 'pump_unreachable'
    control.pump.turn_on.assert_awaited_once()
    await control.async_configure(settings(), 1)
    assert await control.process(samples(later), later) == 'started'


def test_nonexistent_dst_boundary_does_not_extend_permission():
    config=settings(); config['schedule']['sun']=[{'start':'01:00','end':'02:30'}]
    at=datetime(2026,3,29,1,59,tzinfo=ZoneInfo('Europe/Berlin'))
    assert permitted_until(config, at, 120) is None
