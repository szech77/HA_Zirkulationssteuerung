"""A copied integration must not depend on files outside the HACS payload."""
import subprocess
import sys

import pytest


def run_copy(component, code):
    return subprocess.run([sys.executable, '-I', '-c', code, str(component.parents[1])],
                          cwd=component.parents[1], check=True, capture_output=True, text=True)


def test_copied_core_imports_without_home_assistant_or_the_repository(copied_integration):
    run_copy(copied_integration, """
import importlib
import importlib.abc
from pathlib import Path
import sys

class NoHomeAssistant(importlib.abc.MetaPathFinder):
    def find_spec(self, fullname, path=None, target=None):
        if fullname == 'homeassistant' or fullname.startswith('homeassistant.'):
            raise ImportError('The circulation core must be independent of Home Assistant')

sys.meta_path.insert(0, NoHomeAssistant())
root = Path(sys.argv[1])
sys.path.insert(0, str(root))
prefix = 'custom_components.warmwasser_zirkulation'
for name in ('', '.app.main', '.app.core.config', '.app.core.calendar',
             '.app.models.detection', '.app.models.history', '.app.models.planning',
             '.app.models.runtime', '.app.models.contracts', '.app.schemas.control',
             '.app.services.detection', '.app.services.planning', '.app.services.usage',
             '.app.services.history', '.app.services.coordinator', '.app.db.migrations',
             '.app.db.runtime', '.app.utils.temperature', '.app.api.status'):
    module = importlib.import_module(prefix + name)
    assert Path(module.__file__).is_relative_to(root)
entry = importlib.import_module(prefix)
main = importlib.import_module(prefix + '.app.main')
assert entry.async_setup_entry is main.async_setup_entry
assert entry.async_unload_entry is main.async_unload_entry
assert not any(name == 'homeassistant' or name.startswith('homeassistant.') for name in sys.modules)
""")


def test_panel_finds_assets_in_the_copied_integration(copied_integration):
    pytest.importorskip('homeassistant', reason='Panel asset paths require the native HA runtime')
    web = copied_integration / 'web'
    web.mkdir()
    (web / 'panel.js').write_text('// synthetic panel', encoding='utf-8')
    (web / 'panel.css').write_text('/* synthetic styles */', encoding='utf-8')
    run_copy(copied_integration, """
from pathlib import Path
import sys

root = Path(sys.argv[1])
sys.path.insert(0, str(root))
from custom_components.warmwasser_zirkulation.app.adapters.panel import (
    ASSET_DIRECTORY, ICON_MODULE, asset_version,
)
component = root / 'custom_components' / 'warmwasser_zirkulation'
assert ASSET_DIRECTORY == component / 'web'
assert ICON_MODULE == component / 'icons.js'
version = asset_version()
assert len(version) == 16
(ASSET_DIRECTORY / 'panel.css').write_text('/* updated synthetic styles */', encoding='utf-8')
assert asset_version() != version
""")
