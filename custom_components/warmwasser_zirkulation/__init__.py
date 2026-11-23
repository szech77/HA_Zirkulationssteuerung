"""Home Assistant integration entry points."""
from .app.main import async_setup_entry, async_unload_entry

__all__ = ["async_setup_entry", "async_unload_entry"]
