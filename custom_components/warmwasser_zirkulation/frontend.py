"""Serve the bundled Vue panel through authenticated Home Assistant APIs."""
import asyncio
import logging
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
ICON_MODULE = Path(__file__).with_name('icons.js')
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


@websocket_api.websocket_command({vol.Required('type'): DOMAIN + '/status'})
@websocket_api.require_admin
@websocket_api.async_response
async def websocket_status(hass, connection, msg):
    connection.send_result(msg['id'], dashboard_status(hass))


@websocket_api.websocket_command({vol.Required('type'): DOMAIN + '/configure',
    vol.Required('entry_id'): str, vol.Required('revision'): int, vol.Required('settings'): dict})
@websocket_api.require_admin
@websocket_api.async_response
async def websocket_configure(hass, connection, msg):
    coordinator = hass.data.get(DOMAIN, {}).get(msg['entry_id'])
    if coordinator is None:
        connection.send_error(msg['id'], 'entry_unavailable', 'Die Integration ist nicht geladen.')
        return
    try:
        await coordinator.async_configure(msg['settings'], msg['revision'])
    except ValueError as error:
        conflict = str(error) == 'settings_conflict'
        connection.send_error(msg['id'], 'settings_conflict' if conflict else 'invalid_settings',
            'Die Konfiguration wurde inzwischen geändert. Neu laden und erneut bearbeiten.' if conflict else
            'Zeitfenster prüfen: gültige Uhrzeiten, von vor bis, keine Überschneidungen, höchstens 12 Abschnitte pro Tag.')
        return
    except Exception as error:
        logging.getLogger(__name__).error('Control settings could not be saved',
            extra={'reason': 'settings_save_failed', 'error_type': type(error).__name__})
        connection.send_error(msg['id'], 'save_failed', 'Die Konfiguration konnte nicht gespeichert werden.')
        return
    connection.send_result(msg['id'], {'revision': coordinator.runtime.settings_revision})


@websocket_api.websocket_command({vol.Required('type'): DOMAIN + '/import_history', vol.Required('entry_id'):str})
@websocket_api.require_admin
@websocket_api.async_response
async def websocket_import_history(hass, connection, msg):
    observer = hass.data.get(DOMAIN + '_observations',{}).get(msg['entry_id'])
    if observer is None:
        connection.send_error(msg['id'],'entry_unavailable','Die Integration ist nicht geladen.')
    elif not observer.request_history(force=True):
        connection.send_error(msg['id'],'history_unavailable','Der Recorder ist nicht verfügbar oder ein Import läuft bereits.')
    else:
        connection.send_result(msg['id'],{'started':True})
