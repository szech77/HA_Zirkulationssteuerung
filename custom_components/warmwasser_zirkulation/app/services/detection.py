"""Pure demand detection from temperature samples."""
from __future__ import annotations

from typing import Sequence
from ..models.detection import DetectorConfig, DrawEvent, LearningModel, PumpState, Sample


class DetectionEngine:
    def __init__(self, config: DetectorConfig, model: LearningModel):
        self.config, self.model = config, model

    def detect(self, samples: Sequence[Sample]) -> list[DrawEvent]:
        ordered = sorted(samples, key=lambda s: s.at)
        result: list[DrawEvent] = []
        for current in ordered:
            if current.pump is PumpState.ON or current.pump is PumpState.UNKNOWN:
                continue
            previous = next((p for p in reversed(ordered) if p.at < current.at), None)
            if previous is None:
                continue
            delta_t = (current.at - previous.at).total_seconds()
            if delta_t <= 0 or current.at - previous.at > self.config.max_gap:
                continue
            delta = current.temperature - previous.temperature
            if delta < 0 or delta > self.config.max_step:
                continue
            # Domain unit is °C/minute; this is easier to inspect in HA history
            # and avoids thresholds depending on the recorder's sample cadence.
            slope = delta * 60 / delta_t
            if slope < max(self.config.min_slope, self.model.threshold):
                continue
            if result and current.at - result[-1].at < self.config.dedupe:
                continue
            result.append(DrawEvent(current.at, slope, min(1.0, slope / self.model.threshold)))
        return result
