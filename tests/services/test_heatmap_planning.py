from copy import deepcopy
from datetime import datetime,timedelta,timezone
from zoneinfo import ZoneInfo
import pytest
from custom_components.warmwasser_zirkulation.app.schemas.control import default_schedule
from custom_components.warmwasser_zirkulation.app.services.usage import UsageHistory

UTC=timezone.utc
NOW=datetime(2026,1,26,7,tzinfo=UTC)


def settings():
    schedule=default_schedule(); schedule['mon']=[{'start':'06:10','end':'08:20'}]
    return {'mode':'monitoring','schedule':schedule,'vacation_active':False,'vacation_windows':[]}


def history():
    result=UsageHistory()
    for week in (3,2,1):
        at=NOW-timedelta(weeks=week)
        for n in (0,5,10):result.observe(at+timedelta(minutes=n),at+timedelta(minutes=n+5),UTC)
        result.event(at+timedelta(minutes=5),UTC)
    return result


def test_overlay_keeps_exactly_seven_unique_rows_and_combined_sunday_holiday():
    data=history().planning_snapshot(NOW,settings(),120)
    keys=[row['key'] for row in data['rows']]
    assert len(keys)==len(set(keys))==7
    assert keys[-1]=='sun_holiday' and 'sun' not in keys and 'holiday' not in keys


def test_monitoring_and_active_modes_have_identical_permission_and_learned_run_overlays():
    source=history(); config=settings(); before=deepcopy(source.days)
    monitoring=source.planning_snapshot(NOW,config,120)
    active=source.planning_snapshot(NOW,{**config,'mode':'active'},120)
    assert monitoring['rows']==active['rows']
    assert source.days==before and config['mode']=='monitoring'
    assert monitoring['planning']['next_start']==(NOW+timedelta(minutes=3)).isoformat()
    cells=monitoring['rows'][0]['cells']
    assert cells[12]['allowed_windows']==[{'start':'06:10','end':'06:30','offset':pytest.approx(100/3),'width':pytest.approx(200/3)}]
    assert cells[16]['allowed_windows'][0]['end']=='08:20'
    assert cells[14]['planned_runs'][0]=={'date':'2026-01-26','start':'07:03:00','end':'07:05:00','offset':10,'width':pytest.approx(200/30)}


def test_permissions_exist_without_measurements_and_vacation_replaces_each_day():
    config=settings();config['vacation_active']=True;config['vacation_windows']=[{'start':'12:00','end':'13:00'}]
    data=UsageHistory().planning_snapshot(NOW,config,120)
    assert data['planning']['vacation_active']
    for row in data['rows']:
        assert row['cells'][24]['allowed_windows'] and not row['cells'][14]['allowed_windows']
        assert not any(cell['planned_runs'] for cell in row['cells'])


def test_forecast_applies_daily_quota_and_recent_start_cooldown_to_control_and_view():
    source=history();config=settings()
    quota=source.planning_snapshot(NOW,config,120,max_starts=1,used_starts=1,starts_date=NOW.date().isoformat())
    assert not quota['rows'][0]['cells'][14]['planned_runs']
    assert quota['planning']['next_start'] is None  # Next week's run lies beyond the seven-day horizon.
    cool=source.planning_snapshot(NOW,config,120,last_start_at=NOW.isoformat())
    assert cool['planning']['next_start'] is None
    assert source.predict(NOW,config,120,max_starts=1,used_starts=1,starts_date=NOW.date().isoformat()) is None


def test_planned_marker_splits_across_half_hour_cells():
    source=UsageHistory()
    for week in (3,2,1):
        base=NOW-timedelta(weeks=week)
        for n in (30,35,40):source.observe(base+timedelta(minutes=n),base+timedelta(minutes=n+5),UTC)
        source.event(base+timedelta(minutes=31),UTC)
    data=source.planning_snapshot(NOW,settings(),120)
    assert data['rows'][0]['cells'][14]['planned_runs'][0]['offset']==pytest.approx(29/30*100)
    assert data['rows'][0]['cells'][15]['planned_runs'][0]['offset']==0


def test_marker_tracks_real_time_when_spring_dst_skips_an_hour():
    zone=ZoneInfo('Europe/Berlin'); now=datetime(2026,3,29,1,58,tzinfo=zone)
    source=UsageHistory();config=settings();config['schedule']['sun_holiday']=[{'start':'01:00','end':'04:00'}]
    for week in (3,2,1):
        at=datetime(2026,3,29,3,0,tzinfo=zone)-timedelta(weeks=week)
        for n in (0,5,10):source.observe(at+timedelta(minutes=n),at+timedelta(minutes=n+5),zone)
        source.event(at+timedelta(minutes=1),zone)
    data=source.planning_snapshot(now,config,120)
    row=data['rows'][-1]['cells']
    assert row[3]['planned_runs'] and row[6]['planned_runs']
    assert not row[4]['planned_runs'] and not row[5]['planned_runs']


def test_overview_receives_the_same_concrete_starts_as_the_control_planner():
    source=history();config=settings()
    data=source.planning_snapshot(NOW,config,120)
    prediction=source.predict(NOW,config,120)
    assert data['planning']['starts'][0]=={'at':prediction.at.isoformat(),
        'demand_at':prediction.demand_at.isoformat(),'observed_days':prediction.observed_days,'ratio':prediction.ratio}
