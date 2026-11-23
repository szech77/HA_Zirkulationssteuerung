"""Exercise the real Recorder API boundary with synthetic HA State objects."""
import asyncio
from datetime import datetime, timedelta, timezone
import threading
from unittest.mock import AsyncMock, Mock, patch
from types import SimpleNamespace

import pytest

pytest.importorskip('homeassistant',reason='Recorder checks require native HA')
from homeassistant.core import State
from custom_components.warmwasser_zirkulation.app.db.recorder import read_history_day


@pytest.mark.asyncio
async def test_recorder_query_is_read_only_explicitly_scoped_and_runs_in_db_executor():
    at=datetime(2026,1,5,7,tzinfo=timezone.utc)
    ready=asyncio.get_running_loop().create_future(); ready.set_result(True)
    async def executor(target,*args): return await asyncio.to_thread(target,*args)
    instance=SimpleNamespace(async_db_ready=ready,async_add_executor_job=AsyncMock(side_effect=executor))
    flows=[State('sensor.test_supply',str(104+n*.36),{'unit_of_measurement':'°F'},
        last_updated=at+timedelta(minutes=n),last_changed=at+timedelta(minutes=n)) for n in (0,5,10,15)]
    main_thread=threading.get_ident()
    def read(*args,**kwargs):
        assert threading.get_ident()!=main_thread
        assert kwargs['entity_ids']==['sensor.test_supply','switch.test_pump']
        assert kwargs['include_start_time_state'] and not kwargs['significant_changes_only']
        assert not kwargs['minimal_response'] and not kwargs['no_attributes']
        return {'sensor.test_supply':flows}
    with patch('homeassistant.components.recorder.get_instance',return_value=instance), patch(
            'homeassistant.components.recorder.history.get_significant_states',side_effect=read) as query:
        result=await read_history_day(object(),'sensor.test_supply','switch.test_pump',at,at+timedelta(minutes=30),timezone.utc,.12,None)
    query.assert_called_once(); instance.async_add_executor_job.assert_awaited_once()
    assert result.temperatures==4 and result.assumed_pump_off
    assert len(result.events)==1 and result.events[0].slope==pytest.approx(.2)


@pytest.mark.asyncio
async def test_recorder_not_ready_does_not_issue_a_query():
    ready=asyncio.get_running_loop().create_future(); ready.set_result(False)
    instance=SimpleNamespace(async_db_ready=ready,async_add_executor_job=AsyncMock())
    with patch('homeassistant.components.recorder.get_instance',return_value=instance):
        with pytest.raises(RuntimeError):
            await read_history_day(object(),'sensor.test_supply','switch.test_pump',None,None,None,.12,None)
    instance.async_add_executor_job.assert_not_awaited()
