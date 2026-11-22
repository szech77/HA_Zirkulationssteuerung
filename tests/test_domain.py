from datetime import datetime, timedelta, timezone

from custom_components.warmwasser_zirkulation.domain import (
    DetectionEngine, DetectorConfig, DrawEvent, LearningModel, Planner, PumpState, Sample, Window, heatmap,
)


def ts(minutes=0):
    return datetime(2026, 1, 5, 7, 0, tzinfo=timezone.utc) + timedelta(minutes=minutes)


def test_detection_ignores_pump_phase_gaps_outliers_and_deduplicates():
    engine = DetectionEngine(DetectorConfig(min_slope=1.0, max_step=30), LearningModel(threshold=1.0))
    samples = [Sample(ts(), 45, PumpState.OFF), Sample(ts(2), 46, PumpState.OFF),
               Sample(ts(3), 70, PumpState.OFF), Sample(ts(4), 71, PumpState.ON),
               Sample(ts(30), 72, PumpState.OFF), Sample(ts(32), 73, PumpState.OFF)]
    events = engine.detect(samples)
    assert len(events) == 1
    assert events[0].at == ts(3)


def test_learning_is_bounded_and_requires_enough_samples():
    model = LearningModel(threshold=.2, min_samples=4)
    model.learn([.01, .02], [10, 10, 10])
    assert model.threshold == .2
    model.learn([.02], [.4, .5])
    assert .15 <= model.threshold <= .25


def test_heatmap_exposes_denominator_and_thin_data():
    event = DrawEvent(ts(), .2, .9)
    result = heatmap([event], {(0, 14): 2, (0, 15): 5})
    assert result[(0, 14)]["sufficient"] is False
    assert result[(0, 15)]["denominator"] == 5


def test_planner_respects_runtime_window_limit_and_deduplication():
    windows = {i: Window(6 * 60, 8 * 60) for i in range(7)}
    planner = Planner(120, 1, windows)
    events = [DrawEvent(ts(60), .3, 1), DrawEvent(ts(62), .3, 1)]
    planned = planner.plan(events, ts(), [])
    assert len(planned) == 1
    assert planned[0].reason == "learned_schedule"

