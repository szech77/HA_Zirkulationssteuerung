from tools.release import changelog_sections, next_version


def test_release_draft_requires_all_security_categories() -> None:
    text = """# Changelog

## New Version

### Features

- Neue Funktion

### Bugfixes

- Keine.

### Breaking Changes

- Keine.

### Security

- Sicherheitsprüfung

## 0.1.0 - 2026-11-22
"""

    sections, _ = changelog_sections(text)

    assert sections["Features"] == ["- Neue Funktion"]
    assert sections["Bugfixes"] == []
    assert sections["Security"] == ["- Sicherheitsprüfung"]


def test_feature_release_increments_minor_version() -> None:
    sections = {"Features": ["- feature"], "Bugfixes": [], "Breaking Changes": [], "Security": []}

    assert next_version("0.1.0", sections) == "0.2.0"


def test_security_only_release_increments_patch_version() -> None:
    sections = {"Features": [], "Bugfixes": [], "Breaking Changes": [], "Security": ["- fix"]}

    assert next_version("1.4.2", sections) == "1.4.3"
