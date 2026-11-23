from datetime import datetime, timedelta, timezone, date
from zoneinfo import ZoneInfo

import pytest
from custom_components.warmwasser_zirkulation.domain import (PumpState, default_schedule,
    migrate_schedule, validate_control_settings, permitted_until, LearnedStart)
from custom_components.warmwasser_zirkulation.history import HistoricalTemperature as Temperature, HistoricalPump as Pump, replay_history
from custom_components.warmwasser_zirkulation.usage import UsageHistory

UTC=timezone.utc
BASE=datetime(2026,1,5,7,tzinfo=UTC)


def temperatures(base=BASE):
    return [Temperature(base+timedelta(minutes=n),40+n*.2) for n in (0,5,10,15)]


def replay(values=None,pumps=(),base=BASE):
    return replay_history(values if values is not None else temperatures(base),pumps,
        base,base+timedelta(minutes=30),UTC)


def test_missing_historical_pump_states_are_explicitly_assumed_off():
    result=replay()
    assert result.assumed_pump_off is True
    assert result.temperatures==4 and len(result.events)==1
    cell=result.history.heatmap(BASE.date())['rows'][0]['cells'][14]
    assert cell['observed_days']==cell['event_days']==1


@pytest.mark.parametrize('state',[PumpState.ON,PumpState.UNKNOWN])
def test_recorded_running_or_unknown_pump_is_excluded_even_when_other_history_is_missing(state):
    result=replay(pumps=[Pump(BASE,state)])
    assert result.events==[] and result.history.days=={}
    assert not result.assumed_pump_off


def test_pump_transition_inside_a_temperature_interval_is_not_learned():
    result=replay(pumps=[Pump(BASE,PumpState.OFF),Pump(BASE+timedelta(minutes=2),PumpState.ON),
        Pump(BASE+timedelta(minutes=4),PumpState.OFF)])
    assert result.history.days[BASE.date().isoformat()]['coverage'][14]==600
    assert result.events[0].at==BASE+timedelta(minutes=10)


def test_unknown_temperature_breaks_the_pair_and_long_gaps_are_not_interpolated():
    result=replay([Temperature(BASE,40),Temperature(BASE+timedelta(minutes=5),None),
        Temperature(BASE+timedelta(minutes=10),45),Temperature(BASE+timedelta(minutes=20),50)])
    assert result.events==[] and result.history.days=={}


def test_replay_is_order_independent_deduplicated_and_preserves_live_data_on_merge():
    result=replay(list(reversed(temperatures()))+temperatures())
    target=UsageHistory(); target.observe(BASE+timedelta(minutes=15),BASE+timedelta(minutes=20),UTC)
    target.merge(result.history)
    before=UsageHistory(target.days).days
    target.merge(result.history)
    assert target.days==before
    assert len(result.events)==1
    assert target.days[BASE.date().isoformat()]['coverage'][14]==900


def settings():
    return {'mode':'active','schedule':{day:[{'start':'06:00','end':'09:00'}] for day in default_schedule()},
            'vacation_active':False,'vacation_windows':[]}


def pattern(days=3,events=3):
    history=UsageHistory()
    for week in range(days):
        at=BASE+timedelta(weeks=week)
        for minutes in (0,5,10): history.observe(at+timedelta(minutes=minutes),at+timedelta(minutes=minutes+5),UTC)
        if week<events: history.event(at+timedelta(minutes=5),UTC)
    return history


def test_predictive_start_uses_median_event_minute_and_runtime_lead():
    at=BASE+timedelta(weeks=3)
    value=pattern().predict(at,settings(),120)
    assert value.at==at+timedelta(minutes=3)
    assert value.demand_at==at+timedelta(minutes=5)
    assert value.observed_days==3 and value.ratio==1
    assert pattern().predict(value.at,settings(),120,exclude_identity=value.identity).at>value.at


def test_sparse_missing_or_low_probability_history_does_not_schedule():
    at=BASE+timedelta(weeks=3)
    assert pattern(days=2).predict(at,settings(),120) is None
    assert pattern(days=3,events=1).predict(at,settings(),120) is None
    old=pattern(); key=next(iter(old.days)); old.days[key]['minutes']=[None]*48
    for day in old.days.values(): day['minutes']=[None]*48
    assert old.predict(at,settings(),120) is None


def test_prediction_obeys_permissions_vacation_and_does_not_catch_up_missed_starts():
    at=BASE+timedelta(weeks=3)
    blocked=settings(); blocked['schedule']['mon']=[]
    assert pattern().predict(at,blocked,120) is None
    vacation=settings(); vacation['vacation_active']=True
    assert pattern().predict(at,vacation,120) is None
    later=pattern().predict(at+timedelta(minutes=4),settings(),120)
    assert later is not None and later.at>at+timedelta(days=1)


def test_sunday_holiday_group_counts_a_holiday_sunday_only_once():
    history=UsageHistory()
    at=datetime(2026,1,11,7,tzinfo=UTC)
    for n in (0,5,10): history.observe(at+timedelta(minutes=n),at+timedelta(minutes=n+5),UTC)
    history.event(at,UTC)
    rows=history.heatmap(at.date(),{at.date()},True)['rows']
    assert len(rows)==7
    assert rows[-1]['key']=='sun_holiday'
    assert rows[-1]['cells'][14]['observed_days']==1
    assert history.heatmap(at.date(),(),False)['rows'][-1]['cells'][14]['observed_days']==1


def test_legacy_window_migration_keeps_only_common_permission_and_is_idempotent():
    legacy={day:[] for day in ('mon','tue','wed','thu','fri','sat','sun','holiday')}
    legacy['sun']=[{'start':'06:00','end':'09:00'},{'start':'18:00','end':'20:00'}]
    legacy['holiday']=[{'start':'08:00','end':'10:00'}]
    migrated,changed=migrate_schedule(legacy)
    assert changed and migrated['sun_holiday']==[{'start':'08:00','end':'09:00'}]
    assert migrate_schedule(migrated)==(migrated,False)
    legacy['holiday']=[]
    assert migrate_schedule(legacy)[0]['sun_holiday']==[]
    legacy['sun']=[{'start':'bad','end':'09:00'}]
    with pytest.raises(ValueError): migrate_schedule(legacy)


def test_combined_sunday_holiday_permission_applies_to_both_calendar_types():
    config=settings(); config['schedule']['sun_holiday']=[{'start':'10:00','end':'12:00'}]
    sunday=datetime(2026,1,11,10,tzinfo=UTC)
    assert permitted_until(config,sunday,120)
    assert permitted_until(config,BASE,120,{BASE.date()}) is None
    assert permitted_until(config,BASE.replace(hour=10),120,{BASE.date()})
