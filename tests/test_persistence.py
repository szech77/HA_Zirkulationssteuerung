from copy import deepcopy
import pytest
from custom_components.warmwasser_zirkulation.persistence import migrate_observation_payload, migrate_runtime_payload


def test_version_one_observations_upgrade_without_losing_counts_learning_or_source():
    original={'days':{'2026-11-22':{'coverage':[900]*48,'events':[True]*48}},
              'threshold':.2,'learning_samples':[.3]*12,'history_entities':['sensor.test_supply','switch.test_pump']}
    before=deepcopy(original)
    migrated=migrate_observation_payload(original,'Europe/Berlin')
    assert original==before
    assert migrated['schema_version']==2
    assert migrated['days']['2026-11-22']['coverage']==[900]*48
    assert migrated['days']['2026-11-22']['events']==[True]*48
    assert migrated['days']['2026-11-22']['minutes']==[None]*48
    assert migrated['learning_samples']==[.3]*12 and migrated['threshold']==.2
    assert migrated['history_entities'][-1]=='Europe/Berlin'
    assert migrate_observation_payload(migrated,'Europe/Berlin')==migrated


@pytest.mark.parametrize('version',[0,3,True,'2'])
def test_unknown_payload_versions_are_rejected_instead_of_overwritten(version):
    original={'schema_version':version}
    for migrate in (migrate_runtime_payload,lambda value:migrate_observation_payload(value,'UTC')):
        with pytest.raises(ValueError): migrate(original)
    assert original=={'schema_version':version}


def test_automatic_runtime_migration_is_versioned_and_idempotent():
    schedule={day:[] for day in ('mon','tue','wed','thu','fri','sat','sun','holiday')}
    schedule['sun']=[{'start':'06:00','end':'10:00'}]
    schedule['holiday']=[{'start':'08:00','end':'12:00'}]
    original={'enabled':True,'demand_automation':True,'schedule':schedule,'settings_revision':4,'daily_starts':2}
    migrated=migrate_runtime_payload(original)
    assert migrated['schema_version']==2
    assert migrated['schedule']['sun_holiday']==[{'start':'08:00','end':'10:00'}]
    assert migrated['settings_revision']==5 and migrated['daily_starts']==2
    assert migrated['enabled'] is True and migrated['demand_automation'] is True
    assert migrate_runtime_payload(migrated)==migrated
    assert 'schema_version' not in original
