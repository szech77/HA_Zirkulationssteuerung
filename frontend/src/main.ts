import { createApp, reactive, type App } from 'vue'
import PanelApp from './PanelApp.vue'
import type { DashboardState, EntryStatus, HomeAssistant } from './types'
import './panel.css'

export class WarmwasserPanel extends HTMLElement {
  private currentHass: HomeAssistant | null = null
  private app: App | null = null
  private state: DashboardState | null = null
  private timer: number | null = null
  private pending = false
  private generation = 0

  set hass(value: HomeAssistant) {
    const firstConnection = this.currentHass === null
    this.currentHass = value
    if (firstConnection && this.state && this.state.updatedAt === null) void this.refresh()
  }

  connectedCallback() {
    if (this.app) return
    const root = this.shadowRoot ?? this.attachShadow({ mode: 'open' })
    root.replaceChildren()
    const stylesheet = document.createElement('link')
    stylesheet.rel = 'stylesheet'
    stylesheet.href = '/warmwasser-zirkulation-static/panel.css'
    const target = document.createElement('div')
    root.append(stylesheet, target)
    this.state = reactive({ entries: [], loading: true, error: null, updatedAt: null })
    this.app = createApp(PanelApp, { state: this.state, onRefresh: () => void this.refresh(), onMenu: () => this.dispatchEvent(new CustomEvent('hass-toggle-menu', { bubbles: true, composed: true })) })
    this.app.mount(target)
    this.timer = window.setInterval(() => { if (document.visibilityState !== 'hidden') void this.refresh() }, 15_000)
    void this.refresh()
  }

  disconnectedCallback() {
    this.generation++
    if (this.timer !== null) window.clearInterval(this.timer)
    this.timer = null
    this.app?.unmount()
    this.app = null
    this.state = null
    this.pending = false
  }

  async refresh() {
    if (!this.currentHass || !this.state || this.pending || !this.isConnected) return
    const generation = this.generation
    this.pending = true
    this.state.loading = true
    try {
      const response = await this.currentHass.callWS<{ entries: EntryStatus[] }>({ type: 'warmwasser_zirkulation/status' })
      if (generation !== this.generation || !this.state) return
      if (!response || !Array.isArray(response.entries)) throw new Error('invalid_response')
      this.state.entries = response.entries
      this.state.error = null
      this.state.updatedAt = new Date().toISOString()
    } catch {
      if (generation === this.generation && this.state) this.state.error = 'Betriebsdaten konnten nicht geladen werden. Verbindung und Administratorrechte prüfen.'
    } finally {
      if (generation === this.generation && this.state) { this.state.loading = false; this.pending = false }
    }
  }
}
if (!customElements.get('warmwasser-panel')) customElements.define('warmwasser-panel', WarmwasserPanel)
