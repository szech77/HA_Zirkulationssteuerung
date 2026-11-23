from datetime import date, datetime, timedelta, timezone
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError
import pytest
from custom_components.warmwasser_zirkulation.usage import UsageHistory
from custom_components.warmwasser_zirkulation.calendar import holiday_dates, supported_subdivisions

UTC = timezone.utc


def cover(history, start):
    for minutes in (0, 5, 10):
        history.observe(start + timedelta(minutes=minutes), start + timedelta(minutes=minutes + 5), UTC)


def test_weekdays_saturday_and_combined_sunday_holiday_group():
    history = UsageHistory()
    for day in range(5, 12):
        start = datetime(2026, 1, day, 6, tzinfo=UTC)
        cover(history, start)
        history.event(start, UTC)
    result = history.heatmap(date(2026, 1, 11), {date(2026, 1, 6)}, True)
    rows = {row['key']: row['cells'][12] for row in result['rows']}
    for key in ('mon', 'wed', 'thu', 'fri', 'sat'):
        assert rows[key]['ratio'] == 1
        assert rows[key]['event_days'] == rows[key]['observed_days'] == 1
    assert rows['sun_holiday']['event_days'] == rows['sun_holiday']['observed_days'] == 2
    assert rows['tue']['ratio'] is None


def test_proportions_count_observed_days_and_not_missing_or_duplicate_events():
    history = UsageHistory()
    for week in range(4):
        start = datetime(2026, 1, 5, 7, tzinfo=UTC) + timedelta(weeks=week)
        cover(history, start)
        if week < 2:
            history.event(start, UTC)
            history.event(start + timedelta(minutes=1), UTC)
    # A day with an event but no coverage cannot inflate the denominator or numerator.
    history.event(datetime(2026, 2, 2, 7, tzinfo=UTC), UTC)
    result = history.heatmap(date(2026, 2, 2))['rows'][0]['cells'][14]
    assert result['observed_days'] == 4
    assert result['event_days'] == 2
    assert result['ratio'] == 0.5
    assert result['sufficient'] is True


def test_partial_coverage_is_distinct_from_no_consumption():
    history = UsageHistory()
    start = datetime(2026, 1, 5, 7, tzinfo=UTC)
    history.observe(start, start + timedelta(minutes=5), UTC)
    history.event(start, UTC)
    cell = history.heatmap(start.date())['rows'][0]['cells'][14]
    assert cell['ratio'] is None
    assert cell['partial_days'] == 1
    assert cell['observed_days'] == 0


def test_gaps_are_not_interpolated_and_retention_is_bounded():
    history = UsageHistory()
    start = datetime(2026, 1, 5, 7, tzinfo=UTC)
    history.observe(start, start + timedelta(minutes=9), UTC)
    assert history.days == {}
    cover(history, start)
    history.heatmap(date(2026, 12, 1))
    assert history.days == {}


def test_fractional_timezone_splits_coverage_at_local_midnight():
    history = UsageHistory()
    zone = timezone(timedelta(hours=5, minutes=30))
    start = datetime(2026, 1, 5, 18, 28, tzinfo=UTC)
    history.observe(start, start + timedelta(minutes=4), zone)
    assert history.days['2026-01-05']['coverage'][47] == 120
    assert history.days['2026-01-06']['coverage'][0] == 120


def test_dst_transition_uses_real_elapsed_seconds():
    try:
        zone = ZoneInfo('Europe/Berlin')
    except ZoneInfoNotFoundError:
        pytest.skip('No IANA timezone database available in this environment')
    history = UsageHistory()
    start = datetime(2026, 3, 29, 0, 58, tzinfo=UTC)
    history.observe(start, start + timedelta(minutes=4), zone)
    coverage = history.days['2026-03-29']['coverage']
    assert coverage[3] == 120
    assert coverage[6] == 120
    assert sum(coverage) == 240


def test_history_roundtrip_and_malformed_history():
    history = UsageHistory()
    cover(history, datetime(2026, 1, 5, 7, tzinfo=UTC))
    assert UsageHistory(history.days).days == history.days
    with pytest.raises(ValueError):
        UsageHistory({'2026-01-05': {'coverage': [0], 'events': [False]}})


def test_configured_region_changes_holiday_assignment():
    assert 'BY' in supported_subdivisions('DE')
    bavaria = holiday_dates('DE', 'BY', 2026)
    berlin = holiday_dates('DE', 'BE', 2026)
    assert date(2026, 1, 6) in bavaria
    assert date(2026, 1, 6) not in berlin
    assert holiday_dates(None, None, 2026) == set()
    with pytest.raises(ValueError):
        holiday_dates('DE', 'invalid-region', 2026)
    with pytest.raises(ValueError):
        supported_subdivisions('invalid-country')
