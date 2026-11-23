"""Authenticated admin-only dashboard WebSocket endpoints."""
from __future__ import annotations

import logging

try:
    import probatio as vol
except ModuleNotFoundError:
    import voluptuous as vol
from homeassistant.components import websocket_api
from ..core.const import DOMAIN
from .status import dashboard_status


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
            'Zeitfenster prüfen: gültige Uhrzeiten, von vor bis, keine Überschneidungen, höchstens 12 Abschnitte pro Tag. Laufzeit: 1 Sekunde bis 1.440 Minuten; Tageslimit: 1 bis 100 Starts.')
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
