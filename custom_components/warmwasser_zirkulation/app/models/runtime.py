"""Persisted control runtime data."""
from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from ..core.const import SCHEMA_VERSION
from ..schemas.control import default_schedule


@dataclass
class RuntimeState:
    schema_version: int = SCHEMA_VERSION
    last_prediction_id: str | None = None
    last_start_at: str | None = None
    control_fault: bool = False
    enabled: bool = False
    demand_automation: bool = False
    pump_until: datetime | None = None
    daily_starts: int = 0
    last_reason: str = "monitoring"
    starts_date: str | None = None
    last_trigger_at: str | None = None
    schedule: dict = field(default_factory=default_schedule)
    vacation_active: bool = False
    vacation_windows: list = field(default_factory=list)
    settings_revision: int = 0
