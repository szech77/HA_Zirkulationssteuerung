import { createDashboardStore } from '../stores/dashboard'
import type { ControlSettings, EntryStatus, HomeAssistant } from '../types'

// HA supplies the authenticated connection. This module only manages its lifecycle.
export function useHomeAssistantPanel() {
  const store = createDashboardStore()
  let hass: HomeAssistant | null = null
  let connected = false
  let timer: number | null = null
  let pending = false
  let commanding = false
  let generation = 0
  let statusSequence = 0

  function setHass(value: HomeAssistant) {
    const firstConnection = hass === null
    hass = value
    store.setTheme(Boolean(value.themes?.darkMode))
    if (firstConnection && connected && store.state.updatedAt === null) void refresh()
  }

  function connect() {
    if (connected) return
    connected = true
    store.reset()
    store.setTheme(Boolean(hass?.themes?.darkMode))
    timer = window.setInterval(() => { if (document.visibilityState !== 'hidden') void refresh() }, 15_000)
    void refresh()
  }

  function disconnect() {
    connected = false
    generation++
    statusSequence++
    if (timer !== null) window.clearInterval(timer)
    timer = null
    pending = false
    commanding = false
  }

  async function command(message: { type: string; [key: string]: unknown }) {
    const connection = hass
    if (!connection || !connected) throw new Error('unavailable')
    if (commanding) throw new Error('busy')
    commanding = true
    statusSequence++
    const currentGeneration = generation
    try {
      await connection.callWS(message)
      if (!connected || currentGeneration !== generation) throw new Error('unavailable')
      const response = await connection.callWS<{ entries: EntryStatus[] }>({ type: 'warmwasser_zirkulation/status' })
      if (!connected || currentGeneration !== generation) throw new Error('unavailable')
      store.receive(response)
    } finally {
      if (currentGeneration === generation) commanding = false
    }
  }

  async function refresh() {
    if (!hass || !connected || pending || commanding) return
    const currentGeneration = generation
    const sequence = ++statusSequence
    pending = true
    store.state.loading = true
    try {
      const response = await hass.callWS<{ entries: EntryStatus[] }>({ type: 'warmwasser_zirkulation/status' })
      if (!connected || currentGeneration !== generation || sequence !== statusSequence) return
      store.receive(response)
    } catch {
      if (connected && currentGeneration === generation && sequence === statusSequence) {
        store.state.error = 'Betriebsdaten konnten nicht geladen werden. Verbindung und Administratorrechte prüfen.'
      }
    } finally {
      if (currentGeneration === generation) { pending = false; store.state.loading = false }
    }
  }

  return {
    state: store.state, setHass, connect, disconnect, refresh,
    configure: (entryId: string, settings: ControlSettings, revision: number) => command({
      type: 'warmwasser_zirkulation/configure', entry_id: entryId, settings, revision,
    }),
    importHistory: (entryId: string) => command({ type: 'warmwasser_zirkulation/import_history', entry_id: entryId }),
  }
}
