"""Bounded observation history and honest weekday heatmaps (no HA imports)."""
from datetime import date, datetime, timedelta, timezone
from math import isfinite

ROWS = ('mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun', 'holiday')
RETENTION_DAYS = 180
MIN_COVERAGE_SECONDS = 900
MIN_OBSERVED_DAYS = 3


class UsageHistory:
    def __init__(self, days=None):
        self.days = {}
        if days is not None and (not isinstance(days, dict) or len(days) > RETENTION_DAYS + 2):
            raise ValueError('Invalid observation history size')
        for key, value in (days or {}).items():
            try:
                date.fromisoformat(key)
            except (ValueError, TypeError):
                raise ValueError('Invalid observation date') from None
            coverage, events = value['coverage'], value['events']
            if (len(coverage) != 48 or len(events) != 48
                    or any(type(v) not in (int, float) or not 0 <= v <= 1800 or not isfinite(v) for v in coverage)
                    or any(type(v) is not bool for v in events)):
                raise ValueError('Invalid observation history')
            self.days[key] = {'coverage': list(coverage), 'events': list(events)}

    def _day(self, day):
        return self.days.setdefault(day.isoformat(), {'coverage': [0] * 48, 'events': [False] * 48})

    def prune(self, today):
        cutoff = today - timedelta(days=RETENTION_DAYS - 1)
        self.days = {key: value for key, value in self.days.items() if cutoff <= date.fromisoformat(key) <= today}

    def observe(self, start, end, zone):
        """Count each UTC interval once; split coverage into local half-hour cells."""
        if start.utcoffset() is None or end.utcoffset() is None:
            raise ValueError('Observation times need a timezone')
        start, end = start.astimezone(timezone.utc), end.astimezone(timezone.utc)
        if not 0 < (end - start).total_seconds() <= 480:
            return
        cursor = start
        while cursor < end:
            local = cursor.astimezone(zone)
            # Split at the next minute; this also handles DST transitions.
            next_minute = cursor.replace(second=0, microsecond=0) + timedelta(minutes=1)
            boundary = min(end, next_minute)
            index = local.hour * 2 + local.minute // 30
            cell = self._day(local.date())['coverage']
            cell[index] = min(1800, cell[index] + (boundary - cursor).total_seconds())
            cursor = boundary
        self.prune(end.astimezone(zone).date())

    def event(self, at, zone):
        local = at.astimezone(zone)
        self._day(local.date())['events'][local.hour * 2 + local.minute // 30] = True

    def heatmap(self, today, holiday_dates=(), calendar_enabled=False):
        self.prune(today)
        result = {row: [{'observed_days': 0, 'event_days': 0, 'partial_days': 0} for _ in range(48)] for row in ROWS}
        for key, day in self.days.items():
            day_date = date.fromisoformat(key)
            row = 'holiday' if calendar_enabled and day_date in holiday_dates else ROWS[day_date.weekday()]
            for index, coverage in enumerate(day['coverage']):
                cell = result[row][index]
                if coverage:
                    cell['partial_days'] += 1
                if coverage >= MIN_COVERAGE_SECONDS:
                    cell['observed_days'] += 1
                    cell['event_days'] += int(day['events'][index])
        for cells in result.values():
            for cell in cells:
                denominator = cell['observed_days']
                ratio = cell['event_days'] / denominator if denominator else None
                cell.update(ratio=ratio, sufficient=denominator >= MIN_OBSERVED_DAYS,
                            level=min(4, int(ratio * 4)) if ratio is not None else None)
        return {'rows': [{'key': key, 'cells': result[key]} for key in ROWS],
                'calendar_enabled': calendar_enabled, 'retention_days': RETENTION_DAYS,
                'minimum_coverage_minutes': MIN_COVERAGE_SECONDS // 60,
                'minimum_observed_days': MIN_OBSERVED_DAYS, 'observed_dates': len(self.days)}
