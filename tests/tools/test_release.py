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


def test_release_requires_both_built_frontend_assets(tmp_path):
    import pytest
    from tools.release import frontend_files
    with pytest.raises(ValueError, match='Build the frontend'):
        frontend_files(tmp_path)
    (tmp_path / 'panel.js').write_text('export const panel = true;', encoding='utf-8')
    with pytest.raises(ValueError):
        frontend_files(tmp_path)
    (tmp_path / 'panel.css').write_text(':host{display:block}', encoding='utf-8')
    result = frontend_files(tmp_path)
    assert set(result) == {'custom_components/warmwasser_zirkulation/web/panel.js',
                           'custom_components/warmwasser_zirkulation/web/panel.css'}


def test_published_snapshot_includes_panel_assets_without_changing_source_branch(monkeypatch):
    import tools.release as release
    from types import SimpleNamespace
    source = 'a' * 40
    requests = []
    class GitHub:
        def __init__(self, *args): pass
        def request(self, path, method='GET', payload=None):
            requests.append((path, method, payload))
            if path.startswith('/git/ref/tags/'):
                return None
            if path.startswith('/git/ref/heads/'):
                return {'object': {'sha':source}}
            if path == '/git/commits/' + source:
                return {'tree': {'sha':'source-tree'}}
            if path == '/git/blobs':
                return {'sha':f'blob-{len(requests)}'}
            if path == '/git/trees':
                return {'sha':'release-tree'}
            if path == '/git/commits':
                return {'sha':'release-commit'}
            return {}
    monkeypatch.setattr(release, 'GitHub', GitHub)
    monkeypatch.setattr(release, 'build_plan', lambda *args: ('0.2.0b123',
        {'Features':['- Panel'], 'Bugfixes':[], 'Breaking Changes':[], 'Security':[]}))
    assets = {'custom_components/warmwasser_zirkulation/web/panel.js':'verified-js',
              'custom_components/warmwasser_zirkulation/web/panel.css':'verified-css'}
    monkeypatch.setattr(release, 'frontend_files', lambda:assets)
    release.publish(SimpleNamespace(channel='beta', beta_number='123', branch='feature/test',
        repository='synthetic/repository', commit=source))
    tree = next(payload for path, method, payload in requests if path == '/git/trees')
    assert set(assets).issubset({item['path'] for item in tree['tree']})
    commit = next(payload for path, method, payload in requests if path == '/git/commits' and method == 'POST')
    assert commit['parents'] == [source]
    assert not any(path.startswith('/git/refs/heads/') and method != 'GET' for path, method, _ in requests)
