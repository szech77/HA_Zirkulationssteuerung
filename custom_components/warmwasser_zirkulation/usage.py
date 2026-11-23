"""Bounded observation history and honest weekday heatmaps (no HA imports)."""
from datetime import date, datetime, timedelta, timezone
from math import isfinite
from statistics import median

from .domain import SCHEDULE_DAYS, day_group, LearnedStart, permitted_until

ROWS = SCHEDULE_DAYS
MIN_PATTERN_RATIO = 0.6
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
            minutes = value.get('minutes', [None] * 48)
            if (not isinstance(minutes, list) or len(minutes) != 48
                    or any(v is not None and (type(v) is not int or not 0 <= v < 30) for v in minutes)):
                raise ValueError('Invalid observation event minutes')
            self.days[key] = {'coverage': list(coverage), 'events': list(events), 'minutes':list(minutes)}

    def _day(self, day):
        return self.days.setdefault(day.isoformat(), {'coverage': [0] * 48, 'events': [False] * 48, 'minutes':[None] * 48})

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
        day = self._day(local.date())
        slot = local.hour * 2 + local.minute // 30
        day['events'][slot] = True
        before = day['minutes'][slot]
        day['minutes'][slot] = local.minute % 30 if before is None else min(before, local.minute % 30)

    def heatmap(self, today, holiday_dates=(), calendar_enabled=False):
        self.prune(today)
        result = {row: [{'observed_days': 0, 'event_days': 0, 'partial_days': 0} for _ in range(48)] for row in ROWS}
        for key, day in self.days.items():
            day_date = date.fromisoformat(key)
            row = day_group(day_date, holiday_dates if calendar_enabled else ())
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


    def merge(self, other):
        """Conservative, idempotent union; overlapping coverage is never added twice."""
        for key, incoming in other.days.items():
            target = self._day(date.fromisoformat(key))
            for slot in range(48):
                target['coverage'][slot] = max(target['coverage'][slot], incoming['coverage'][slot])
                target['events'][slot] |= incoming['events'][slot]
                minute = incoming['minutes'][slot]
                if minute is not None:
                    before = target['minutes'][slot]
                    target['minutes'][slot] = minute if before is None else min(before, minute)

    def sufficient(self, today, holidays=(), calendar_enabled=False):
        return all(any(cell['sufficient'] for cell in row['cells']) for row in
                   self.heatmap(today, holidays, calendar_enabled)['rows'])

    def planned_starts(self, now, settings, runtime_seconds, holidays=(), calendar_enabled=False,
                       exclude_identity=None, *, max_starts=None, used_starts=0, starts_date=None, last_start_at=None):
        """Forecast learned starts from observed days, never from missing data."""
        holidays = holidays if calendar_enabled else ()
        buckets = {key:[[] for _ in range(48)] for key in ROWS}
        for key, day in self.days.items():
            at = date.fromisoformat(key)
            # The current day's observations cannot train their own prediction.
            if not now.date() - timedelta(days=RETENTION_DAYS-1) <= at < now.date():
                continue
            row = day_group(at, holidays if calendar_enabled else ())
            for slot in range(48):
                if day['coverage'][slot] >= MIN_COVERAGE_SECONDS:
                    buckets[row][slot].append((day['events'][slot], day['minutes'][slot]))
        candidates = []
        for offset in range(8):
            day = now.date() + timedelta(days=offset)
            row = day_group(day, holidays if calendar_enabled else ())
            for slot, observations in enumerate(buckets[row]):
                count = len(observations)
                ratio = sum(event for event, _ in observations) / count if count else 0
                minutes = [minute for event, minute in observations if event and minute is not None]
                if count < MIN_OBSERVED_DAYS or ratio < MIN_PATTERN_RATIO or len(minutes) < 2:
                    continue
                from datetime import time
                minute = slot * 30 + int(median(minutes))
                demand = datetime.combine(day, time(minute//60, minute%60), now.tzinfo)
                if datetime.fromtimestamp(demand.timestamp(),now.tzinfo).replace(tzinfo=None) != demand.replace(tzinfo=None):
                    continue
                start = datetime.fromtimestamp(demand.timestamp()-runtime_seconds, now.tzinfo)
                if start.date() != day or not -30 <= start.timestamp()-now.timestamp() <= 7*86400:
                    continue
                if demand.isoformat() != exclude_identity and permitted_until(settings,start,runtime_seconds,holidays):
                    candidates.append(LearnedStart(start,demand,ratio,count))
        # Forecast execution limits too; the same plan feeds both control and display.
        counts = {now.date():used_starts} if starts_date==now.date().isoformat() else {}
        previous = datetime.fromisoformat(last_start_at).timestamp() if last_start_at else None
        planned = []
        for candidate in sorted(candidates,key=lambda value:value.at.timestamp()):
            day=candidate.at.date()
            if max_starts is not None and counts.get(day,0)>=max_starts:
                continue
            if previous is not None and candidate.at.timestamp()-previous<1200:
                continue
            planned.append(candidate)
            counts[day]=counts.get(day,0)+1
            previous=candidate.at.timestamp()
        return planned

    def predict(self, now, settings, runtime_seconds, holidays=(), calendar_enabled=False, exclude_identity=None, **limits):
        return next(iter(self.planned_starts(now,settings,runtime_seconds,holidays,calendar_enabled,
                                            exclude_identity,**limits)),None)

    def planning_snapshot(self, now, settings, runtime_seconds, holidays=(), calendar_enabled=False, **limits):
        """Read-only overlay for the same seven groups; monitoring still has a full plan."""
        data=self.heatmap(now.date(),holidays,calendar_enabled)
        rows={row['key']:row['cells'] for row in data['rows']}
        for key,cells in rows.items():
            windows=settings['vacation_windows'] if settings['vacation_active'] else settings['schedule'][key]
            for slot,cell in enumerate(cells):
                cell['allowed_windows']=[]; cell['planned_runs']=[]
                for window in windows:
                    def minute(value):
                        hour,minutes=map(int,value.split(':')); return hour*60+minutes
                    start,end=max(slot*30,minute(window['start'])),min((slot+1)*30,minute(window['end']))
                    if start<end:
                        cell['allowed_windows'].append({'start':f'{start//60:02d}:{start%60:02d}',
                            'end':f'{end//60:02d}:{end%60:02d}',
                            'offset':(start-slot*30)/30*100,'width':(end-start)/30*100})
        plans=self.planned_starts(now,settings,runtime_seconds,holidays,calendar_enabled,**limits)
        for plan in plans:
            # Split real elapsed time into local minute segments, including DST jumps.
            segments={}
            cursor=plan.at.timestamp(); finish=plan.demand_at.timestamp()
            while cursor<finish:
                local=datetime.fromtimestamp(cursor,now.tzinfo)
                boundary=min(finish,(int(cursor)//60+1)*60)
                row=day_group(local.date(),holidays if calendar_enabled else ())
                slot=local.hour*2+local.minute//30
                offset=(local.minute%30)*60+local.second+local.microsecond/1_000_000
                segments.setdefault((row,slot),[]).append((offset,offset+boundary-cursor))
                cursor=boundary
            for (row,slot),parts in segments.items():
                merged=[]
                for start,end in sorted(parts):
                    if merged and start<=merged[-1][1]:
                        merged[-1]=(merged[-1][0],max(end,merged[-1][1]))
                    else:
                        merged.append((start,end))
                for start,end in merged:
                    rows[row][slot]['planned_runs'].append({'date':plan.at.date().isoformat(),
                        'start':plan.at.strftime('%H:%M:%S'),'end':plan.demand_at.strftime('%H:%M:%S'),
                        'offset':start/1800*100,'width':(end-start)/1800*100})
        data['planning']={'mode':settings['mode'],'vacation_active':settings['vacation_active'],
                          'horizon_days':7,'next_start':plans[0].at.isoformat() if plans else None}
        return data
