"""Serve the bundled Vue panel through authenticated Home Assistant APIs."""
import asyncio
from hashlib import sha256
from pathlib import Path

from homeassistant.components import frontend, panel_custom, websocket_api
from homeassistant.components.http import StaticPathConfig
from homeassistant.exceptions import ConfigEntryNotReady

from ..core.const import DOMAIN
from ..api.websocket import websocket_status, websocket_configure, websocket_import_history

STATIC_URL = '/warmwasser-zirkulation-static'
PANEL_URL = 'warmwasser-zirkulation'
FRONTEND_DATA = DOMAIN + '_frontend'
INTEGRATION_DIRECTORY = Path(__file__).resolve().parents[2]
ASSET_DIRECTORY = INTEGRATION_DIRECTORY / 'web'
ICON_MODULE = INTEGRATION_DIRECTORY / 'icons.js'
ICON_URL = '/warmwasser-zirkulation-icons.js'


def asset_version(directory=ASSET_DIRECTORY):
    digest = sha256()
    for name in ('panel.js', 'panel.css'):
        digest.update((directory / name).read_bytes())
    digest.update(ICON_MODULE.read_bytes())
    return digest.hexdigest()[:16]


async def async_register_frontend(hass):
    state = hass.data.setdefault(FRONTEND_DATA, {})
    async with state.setdefault('lock', asyncio.Lock()):
        try:
            version = await hass.async_add_executor_job(asset_version)
        except OSError:
            raise ConfigEntryNotReady('Dashboard-Dateien fehlen. Im Projektordner frontend den Befehl npm run build ausführen und den Integrationsordner vollständig kopieren.') from None
        if not state.get('resources_registered'):
            await hass.http.async_register_static_paths([
                StaticPathConfig(STATIC_URL, str(ASSET_DIRECTORY), False),
                StaticPathConfig(ICON_URL, str(ICON_MODULE), False),
            ])
            websocket_api.async_register_command(hass, websocket_status)
            websocket_api.async_register_command(hass, websocket_configure)
            websocket_api.async_register_command(hass, websocket_import_history)
            state['resources_registered'] = True
        if not state.get('icon_url'):
            icon_url = f'{ICON_URL}?v={version}'
            frontend.add_extra_js_url(hass, icon_url)
            state['icon_url'] = icon_url
        if not state.get('panel_registered'):
            # Keep HA's configure gear connected to the native options dialog.
            await panel_custom.async_register_panel(hass, frontend_url_path=PANEL_URL,
                webcomponent_name='warmwasser-panel', sidebar_title='Warmwasser-Zirkulation',
                sidebar_icon='warmwasser:circulation', module_url=f'{STATIC_URL}/panel.js?v={version}',
                embed_iframe=False, require_admin=True)
            state['panel_registered'] = True


async def async_remove_frontend(hass):
    state = hass.data.get(FRONTEND_DATA, {})
    async with state.setdefault('lock', asyncio.Lock()):
        if state.pop('panel_registered', False):
            frontend.async_remove_panel(hass, PANEL_URL)
        if icon_url := state.pop('icon_url', None):
            frontend.remove_extra_js_url(hass, icon_url)
