"""Explicit versioned payload migrations. Pure functions never write source data."""
from copy import deepcopy
from datetime import datetime
from math import isfinite

from ..schemas.control import SCHEDULE_DAYS, default_schedule, validate_control_settings
from ..services.usage import UsageHistory

from ..core.const import SCHEMA_VERSION


def _payload(data):
    if not isinstance(data,dict):
        raise ValueError('Invalid stored payload')
    version=data.get('schema_version',1)
    if type(version) is not int or version not in (1,SCHEMA_VERSION):
        raise ValueError('Unsupported stored schema version')
    return deepcopy(data),version


def migrate_runtime_payload(data):
    result,version=_payload(data)
    if version==1:
        schedule,changed=migrate_schedule(result.get('schedule',default_schedule()))
        result['schedule']=schedule
        if changed:
            revision=result.get('settings_revision',0)
            if type(revision) is not int or revision<0:
                raise ValueError('Invalid settings revision')
            result['settings_revision']=revision+1
        result.pop('schedule_migrated',None)
        result['schema_version']=SCHEMA_VERSION
    return result


def _time(value):
    if value is not None:
        if not isinstance(value,str) or datetime.fromisoformat(value).utcoffset() is None:
            raise ValueError('Stored time needs a timezone')


def migrate_observation_payload(data,time_zone):
    result,version=_payload(data)
    history=UsageHistory(result.get('days',{}))
    _time(result.get('last_event'))
    samples=result.get('learning_samples',[])
    threshold=result.get('threshold',.12)
    def positive(value):
        return type(value) in (int,float) and isfinite(value) and value>0
    if (not isinstance(samples,list) or len(samples)>512 or any(not positive(value) for value in samples)
            or not positive(threshold)):
        raise ValueError('Invalid learning data')
    info=result.get('history_import')
    if info:
        if (not isinstance(info,dict) or info.get('state') not in ('idle','loading','complete','unavailable','error')
                or type(info.get('days')) is not int or not 0<=info['days']<=28
                or type(info.get('events')) is not int or info['events']<0
                or type(info.get('assumed_pump_off')) is not bool):
            raise ValueError('Invalid history import data')
        for key in ('until','last_event'): _time(info.get(key))
    if version==1:
        result['days']=history.days
        if isinstance(result.get('history_entities'),list) and len(result['history_entities'])==2:
            result['history_entities'].append(time_zone)
        result['schema_version']=SCHEMA_VERSION
    return result


def migrate_schedule(schedule):
    """Merge legacy permissions by intersection, never adding an automatic hour."""
    from copy import deepcopy
    legacy = set(SCHEDULE_DAYS) - {"sun_holiday"} | {"sun", "holiday"}
    if not isinstance(schedule, dict) or set(schedule) != legacy:
        return schedule, False
    # Validate the two old lists before computing their common permissions.
    normal = {key: deepcopy(schedule[key]) for key in SCHEDULE_DAYS if key != "sun_holiday"}
    def checked(windows):
        values = {"mode":"monitoring", "schedule":{**normal, "sun_holiday":windows},
                  "vacation_active":False, "vacation_windows":[]}
        return validate_control_settings(values)["schedule"]["sun_holiday"]
    sunday, holiday = checked(schedule["sun"]), checked(schedule["holiday"])
    common = []
    for a in sunday:
        for b in holiday:
            start, end = max(a["start"], b["start"]), min(a["end"], b["end"])
            if start < end:
                common.append({"start":start,"end":end})
    # Both validated lists have at most twelve windows; intersection can have more.
    # Keep at most twelve common windows; omitted hours remain blocked for review.
    return {**normal, "sun_holiday":sorted(common,key=lambda w:w["start"])[:12]}, True
