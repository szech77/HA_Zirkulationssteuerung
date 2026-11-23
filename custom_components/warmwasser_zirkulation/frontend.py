"""Serve the bundled Vue panel through authenticated Home Assistant APIs."""
import asyncio
from hashlib import sha256
from pathlib import Path

try:
    import probatio as vol
except ModuleNotFoundError:
    import voluptuous as vol
from homeassistant.components import frontend, panel_custom, websocket_api
from homeassistant.components.http import StaticPathConfig
from homeassistant.exceptions import ConfigEntryNotReady

from .const import DOMAIN
from .status import dashboard_status

STATIC_URL = '/warmwasser-zirkulation-static'
PANEL_URL = 'warmwasser-zirkulation'
FRONTEND_DATA = DOMAIN + '_frontend'
ASSET_DIRECTORY = Path(__file__).with_name('web')


def asset_version(directory=ASSET_DIRECTORY):
    digest = sha256()
    for name in ('panel.js', 'panel.css'):
        digest.update((directory / name).read_bytes())
    return digest.hexdigest()[:16]


async def async_register_frontend(hass):
    state = hass.data.setdefault(FRONTEND_DATA, {})
    async with state.setdefault('lock', asyncio.Lock()):
        try:
            version = await hass.async_add_executor_job(asset_version)
        except OSError:
            raise ConfigEntryNotReady('Dashboard-Dateien fehlen. Im Projektordner frontend den Befehl npm run build ausführen und den Integrationsordner vollständig kopieren.') from None
        if not state.get('resources_registered'):
            await hass.http.async_register_static_paths([StaticPathConfig(STATIC_URL, str(ASSET_DIRECTORY), False)])
            websocket_api.async_register_command(hass, websocket_status)
            state['resources_registered'] = True
        if not state.get('panel_registered'):
            await panel_custom.async_register_panel(hass, frontend_url_path=PANEL_URL,
                webcomponent_name='warmwasser-panel', sidebar_title='Warmwasser-Zirkulation',
                sidebar_icon='mdi:water-pump', module_url=f'{STATIC_URL}/panel.js?v={version}',
                embed_iframe=False, require_admin=True, config_panel_domain=DOMAIN)
            state['panel_registered'] = True


async def async_remove_frontend(hass):
    state = hass.data.get(FRONTEND_DATA, {})
    async with state.setdefault('lock', asyncio.Lock()):
        if state.pop('panel_registered', False):
            frontend.async_remove_panel(hass, PANEL_URL)


@websocket_api.websocket_command({vol.Required('type'): DOMAIN + '/status'})
@websocket_api.require_admin
@websocket_api.async_response
async def websocket_status(hass, connection, msg):
    connection.send_result(msg['id'], dashboard_status(hass))
