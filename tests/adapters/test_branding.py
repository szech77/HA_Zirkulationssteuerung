"""Shipped branding must work through HA's native, authenticated brands view."""
from collections import deque
from pathlib import Path
import struct
from tempfile import TemporaryDirectory
from unittest.mock import AsyncMock, patch

import pytest

ROOT = Path(__file__).resolve().parents[2]
BRAND = ROOT / 'custom_components' / 'warmwasser_zirkulation' / 'brand'


def test_shipped_icons_are_transparent_pngs_at_native_and_retina_resolutions():
    for name, size in (('icon.png', 256), ('icon@2x.png', 512),
                       ('dark_icon.png', 256), ('dark_icon@2x.png', 512)):
        data = (BRAND / name).read_bytes()
        assert data[:8] == b'\x89PNG\r\n\x1a\n'
        width, height, depth, color = struct.unpack('>IIBB', data[16:26])
        assert (width, height, depth, color) == (size, size, 8, 6)  # RGBA


@pytest.mark.asyncio
async def test_native_brand_endpoint_serves_local_icons_and_logo_fallbacks_without_cdn():
    pytest.importorskip('homeassistant', reason='Native branding requires the HA test runtime')
    import custom_components
    from aiohttp.test_utils import make_mocked_request
    from homeassistant import loader
    from homeassistant.core import HomeAssistant
    from homeassistant.components.brands import BrandsIntegrationView
    from homeassistant.components.http import KEY_AUTHENTICATED
    from aiohttp.web import HTTPForbidden

    with TemporaryDirectory(prefix='circulation-brands-') as directory:
        hass = HomeAssistant(directory)
        loader.async_setup(hass)
        hass.data['brands'] = deque(['synthetic-brand-test-token'])
        try:
            integration = await hass.async_add_executor_job(loader.Integration.resolve_from_root,
                hass, custom_components, 'warmwasser_zirkulation')
            assert integration is not None and integration.has_branding
            view = BrandsIntegrationView(hass)
            files = {'icon.png':'icon.png', 'icon@2x.png':'icon@2x.png',
                     'dark_icon.png':'dark_icon.png', 'dark_icon@2x.png':'dark_icon@2x.png',
                     'logo.png':'icon.png', 'logo@2x.png':'icon.png',
                     'dark_logo.png':'dark_icon.png', 'dark_logo@2x.png':'dark_icon@2x.png'}
            with patch('homeassistant.components.brands.async_get_custom_components',
                       AsyncMock(return_value={'warmwasser_zirkulation':integration})), patch.object(
                       view, '_serve_from_cache_or_cdn', AsyncMock(side_effect=AssertionError('Unexpected CDN fallback'))):
                for name, source in files.items():
                    request = make_mocked_request('GET', f'/api/brands/integration/warmwasser_zirkulation/{name}?placeholder=no')
                    request[KEY_AUTHENTICATED] = True
                    response = await view.get(request, 'warmwasser_zirkulation', name)
                    assert response.status == 200 and response.content_type == 'image/png'
                    expected = await hass.async_add_executor_job((BRAND / source).read_bytes)
                    assert response.body == expected
                denied = make_mocked_request('GET', '/api/brands/integration/warmwasser_zirkulation/icon.png')
                denied[KEY_AUTHENTICATED] = False
                with pytest.raises(HTTPForbidden):
                    await view.get(denied, 'warmwasser_zirkulation', 'icon.png')
        finally:
            await hass.async_stop(force=True)
