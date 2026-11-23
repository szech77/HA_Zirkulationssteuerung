"""Versioned observation persistence using Home Assistant Store."""
from __future__ import annotations

from homeassistant.helpers.storage import Store
from .migrations import migrate_observation_payload


class ObservationStateStore(Store):
    async def _async_migrate_func(self, old_major_version, old_minor_version, old_data):
        if (old_major_version,old_minor_version) not in ((1,1),(2,1)):
            raise ValueError('Unsupported observation storage version')
        return migrate_observation_payload(old_data,self.hass.config.time_zone)
