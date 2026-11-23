"""Shared paths and isolated, HACS-style integration copies."""
from pathlib import Path
import shutil

import pytest


@pytest.fixture(scope='session')
def project_root():
    return Path(__file__).resolve().parents[1]


@pytest.fixture
def copied_integration(tmp_path, project_root):
    component = tmp_path / 'custom_components' / 'warmwasser_zirkulation'
    shutil.copytree(project_root / 'custom_components' / 'warmwasser_zirkulation', component,
                    ignore=shutil.ignore_patterns('__pycache__', 'web'))
    return component
