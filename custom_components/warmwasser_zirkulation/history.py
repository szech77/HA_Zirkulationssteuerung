"""Pure replay of historical temperatures and pump transitions; no HA or commands."""
from dataclasses import dataclass
from datetime import datetime, timedelta
from bisect import bisect_right

from .domain import DetectionEngine, DetectorConfig, LearningModel, PumpState, Sample
from .usage import UsageHistory


@dataclass(frozen=True, slots=True)
class HistoricalTemperature:
    at: datetime
    value: float | None


@dataclass(frozen=True, slots=True)
class HistoricalPump:
    at: datetime
    state: PumpState


@dataclass
class HistoryReplay:
    history: UsageHistory
    events: list
    temperatures: int
    assumed_pump_off: bool
    last_event: datetime | None


def replay_history(temperatures, pumps, start, end, zone, threshold=0.12, last_event=None):
    """Missing pump records mean OFF by explicit user policy; recorded UNKNOWN stays invalid."""
    history = UsageHistory()
    engine = DetectionEngine(DetectorConfig(), LearningModel(threshold=threshold))
    pumps = sorted(pumps,key=lambda item:item.at)
    pump_times = [item.at for item in pumps]
    temperatures = sorted({item.at:item for item in temperatures}.values(),key=lambda item:item.at)
    events = []; assumed = False; count = 0
    previous = None
    for current in temperatures:
        if current.at >= end:
            break
        if current.value is None:
            previous = None
            continue
        if current.at >= start:
            count += 1
        if previous is not None and current.at >= start and 0 < (current.at-previous.at).total_seconds() <= 480:
            index = bisect_right(pump_times,previous.at)-1
            state = pumps[index].state if index >= 0 else PumpState.OFF
            transitions = pumps[index+1:bisect_right(pump_times,current.at)]
            if state is PumpState.OFF and all(item.state is PumpState.OFF for item in transitions):
                assumed |= index < 0
                history.observe(max(previous.at,start),current.at,zone)
                for event in engine.detect([Sample(previous.at,previous.value,PumpState.OFF),Sample(current.at,current.value,PumpState.OFF)]):
                    if last_event is None or event.at-last_event >= timedelta(minutes=20):
                        history.event(event.at,zone); events.append(event); last_event=event.at
        previous = current
    return HistoryReplay(history,events,count,assumed,last_event)
