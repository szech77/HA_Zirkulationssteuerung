"""Catch manifest ordering and shared HA dependency conflicts before Hassfest."""
import importlib.metadata
import importlib.util
import json
from pathlib import Path
import tomllib

from packaging.requirements import Requirement
import pytest

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / 'custom_components/warmwasser_zirkulation/manifest.json'


def test_manifest_keys_follow_home_assistant_order():
    manifest = json.loads(MANIFEST.read_text(encoding='utf-8'))
    assert list(manifest) == ['domain', 'name', *sorted(set(manifest) - {'domain', 'name'})]


def test_project_and_manifest_declare_the_same_runtime_requirements():
    manifest = json.loads(MANIFEST.read_text(encoding='utf-8'))
    project = tomllib.loads((ROOT / 'pyproject.toml').read_text(encoding='utf-8'))
    assert set(manifest['requirements']) == set(project['project']['dependencies'])


def test_shared_holiday_requirement_accepts_home_assistant_and_installed_test_version():
    spec = importlib.util.find_spec('homeassistant')
    if spec is None:
        pytest.skip('Shared dependency check needs the native HA test environment')
    ha_root = Path(spec.origin).parent
    workday = json.loads((ha_root / 'components/workday/manifest.json').read_text(encoding='utf-8'))
    ha_requirement = next(Requirement(value) for value in workday['requirements'] if Requirement(value).name == 'holidays')
    manifest = json.loads(MANIFEST.read_text(encoding='utf-8'))
    requirement = next(Requirement(value) for value in manifest['requirements'] if Requirement(value).name == 'holidays')
    ha_version = next(specifier.version for specifier in ha_requirement.specifier if specifier.operator == '==')
    assert ha_version in requirement.specifier
    installed = importlib.metadata.version('holidays')
    assert installed in ha_requirement.specifier
    assert installed in requirement.specifier
