import { createApp, type App as VueApp } from 'vue'
import App from './App.vue'
import { useHomeAssistantPanel } from './composables/useHomeAssistantPanel'
import { useSidebarSwipe } from './composables/useSidebarSwipe'
import { createPanelRouter } from './router'
import type { ControlSettings, HomeAssistant } from './types'
import './assets/styles/panel.css'

// The custom-element bridge only mounts Vue and forwards the HA connection.
export class WarmwasserPanel extends HTMLElement {
  private app: VueApp | null = null
  // HA owns public panel/hass/route/narrow properties on this custom element.
  readonly #controller = useHomeAssistantPanel()
  #stopSidebarSwipe: (() => void) | null = null

  set hass(value: HomeAssistant) { this.#controller.setHass(value) }

  connectedCallback() {
    if (this.app) return
    const root = this.shadowRoot ?? this.attachShadow({ mode: 'open' })
    root.replaceChildren()
    const stylesheet = document.createElement('link')
    stylesheet.rel = 'stylesheet'
    stylesheet.href = '/warmwasser-zirkulation-static/panel.css'
    const target = document.createElement('div')
    target.className = 'panel-root'
    root.append(stylesheet, target)
    this.#stopSidebarSwipe = useSidebarSwipe(target, () => {
      this.dispatchEvent(new CustomEvent('hass-toggle-menu', { detail: { open: true }, bubbles: true, composed: true }))
    })
    const router = createPanelRouter()
    router.afterEach(() => {
      const viewport = target.querySelector<HTMLElement>('.panel-viewport')
      if (viewport) viewport.scrollTop = 0
    })
    this.app = createApp(App, {
      state: this.#controller.state, saveSettings: this.#controller.configure, importHistory: this.#controller.importHistory,
      onRefresh: () => void this.#controller.refresh(),
      onMenu: () => this.dispatchEvent(new CustomEvent('hass-toggle-menu', { bubbles: true, composed: true })),
    })
    this.app.use(router)
    this.app.mount(target)
    void router.replace({ name: 'dashboard' })
    this.#controller.connect()
  }

  disconnectedCallback() {
    this.#stopSidebarSwipe?.()
    this.#stopSidebarSwipe = null
    this.#controller.disconnect()
    this.app?.unmount()
    this.app = null
  }

  refresh() { return this.#controller.refresh() }
  configure(entryId: string, settings: ControlSettings, revision: number) {
    return this.#controller.configure(entryId, settings, revision)
  }
  importHistory(entryId: string) { return this.#controller.importHistory(entryId) }
}
if (!customElements.get('warmwasser-panel')) customElements.define('warmwasser-panel', WarmwasserPanel)
