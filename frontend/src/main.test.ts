import { beforeAll, afterAll, afterEach, describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { WarmwasserPanel } from './main'
import { entry } from './test/fixtures'
let restoreDialog: () => void
beforeAll(() => {
  const prototype = HTMLDialogElement.prototype
  const show = Object.getOwnPropertyDescriptor(prototype, 'showModal'), close = Object.getOwnPropertyDescriptor(prototype, 'close')
  Object.defineProperty(prototype, 'showModal', {configurable:true,value:function(this:HTMLDialogElement){this.setAttribute('open','')}})
  Object.defineProperty(prototype, 'close', {configurable:true,value:function(this:HTMLDialogElement){this.removeAttribute('open')}})
  restoreDialog = () => { if(show) Object.defineProperty(prototype,'showModal',show);else delete (prototype as any).showModal; if(close) Object.defineProperty(prototype,'close',close);else delete (prototype as any).close }
})
afterAll(() => restoreDialog())
afterEach(()=>{ document.body.replaceChildren(); vi.useRealTimers() })
describe('HA custom panel bridge', () => {
  it('starts when HA assigns panel metadata before hass and keeps working after metadata updates', async () => {
    vi.useFakeTimers()
    const panel = document.createElement('warmwasser-panel') as WarmwasserPanel
    const metadata = {
      component_name: 'custom', url_path: 'warmwasser-zirkulation',
      config: { _panel_custom: { name: 'warmwasser-panel', embed_iframe: false } },
    }
    // ha-panel-custom supplies these public properties before appending the element.
    Object.assign(panel, {
      panel: metadata, hass: { callWS: vi.fn().mockResolvedValue({ entries: [entry()] }) },
      narrow: false, route: { path: '', prefix: '/warmwasser-zirkulation' },
    })
    document.body.append(panel)
    await flushPromises()
    expect(panel.shadowRoot!.textContent).toContain('Test-Zirkulation')
    expect(Reflect.get(panel, 'panel')).toBe(metadata)
    Object.assign(panel, { panel: { ...metadata, title: 'Updated panel' }, narrow: true })
    await panel.refresh()
    await flushPromises()
    expect(panel.shadowRoot!.textContent).toContain('Test-Zirkulation')
    panel.remove()
    expect(vi.getTimerCount()).toBe(0)
  })
  it('registers a custom element, loads through HA auth and cleans up on disconnect', async () => {
    vi.useFakeTimers()
    expect(customElements.get('warmwasser-panel')).toBe(WarmwasserPanel)
    const panel=document.createElement('warmwasser-panel') as WarmwasserPanel
    const callWS=vi.fn().mockResolvedValue({entries:[entry()]})
    panel.hass={callWS}; document.body.append(panel)
    await flushPromises()
    expect(callWS).toHaveBeenCalledWith({type:'warmwasser_zirkulation/status'})
    expect(panel.shadowRoot!.textContent).toContain('Test-Zirkulation')
    expect(panel.shadowRoot!.querySelector('link')!.getAttribute('href')).toBe('/warmwasser-zirkulation-static/panel.css')
    await vi.advanceTimersByTimeAsync(15_000)
    expect(callWS).toHaveBeenCalledTimes(2)
    panel.remove(); await vi.advanceTimersByTimeAsync(30_000)
    expect(callWS).toHaveBeenCalledTimes(2)
  })
  it('shows a safe error without displaying raw server messages', async () => {
    const panel=document.createElement('warmwasser-panel') as WarmwasserPanel
    panel.hass={callWS:vi.fn().mockRejectedValue(new Error('synthetic private response'))}
    document.body.append(panel); await flushPromises()
    expect(panel.shadowRoot!.textContent).toContain('Administratorrechte prüfen')
    expect(panel.shadowRoot!.textContent).not.toContain('synthetic private response')
  })
  it('ignores a result delivered after the panel was disconnected', async () => {
    let finish:(value:unknown)=>void=()=>{}
    const panel=document.createElement('warmwasser-panel') as WarmwasserPanel
    panel.hass={callWS:vi.fn(()=>new Promise(resolve=>{finish=resolve}))}
    document.body.append(panel); panel.remove(); finish({entries:[entry()]}); await flushPromises()
    expect(panel.shadowRoot!.querySelector('.system-card')).toBeNull()
  })
  it('saves settings through the authenticated HA connection and reloads the confirmed state', async () => {
    const initial=entry(); const updated=entry(); updated.settings.mode='active'; updated.settings_revision=1; updated.enabled=true; updated.demand_automation=true
    const callWS=vi.fn().mockResolvedValueOnce({entries:[initial]}).mockResolvedValueOnce({revision:1}).mockResolvedValueOnce({entries:[updated]})
    const panel=document.createElement('warmwasser-panel') as WarmwasserPanel
    panel.hass={callWS}; document.body.append(panel); await flushPromises()
    const root=panel.shadowRoot!
    const configure=root.querySelector<HTMLAnchorElement>('a[href="/settings"]')!
    panel.scrollTop=300
    configure.click(); await flushPromises()
    expect(panel.scrollTop).toBe(0)
    const mode=Array.from(root.querySelectorAll<HTMLButtonElement>('.mode-option')).find(button=>button.textContent?.includes('Automatische Steuerung'))!; mode.click()
    await flushPromises()
    root.querySelector('form')!.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}))
    await flushPromises()
    expect(callWS).toHaveBeenNthCalledWith(2,{type:'warmwasser_zirkulation/configure',entry_id:initial.entry_id,settings:{...updated.settings,runtime_seconds:120,max_starts:6},revision:0})
    expect(callWS).toHaveBeenNthCalledWith(3,{type:'warmwasser_zirkulation/status'})
    expect(panel.shadowRoot!.textContent).toContain('Konfiguration gespeichert.')
    root.querySelector<HTMLAnchorElement>('nav a[href="/"]')!.click(); await flushPromises()
    expect(panel.shadowRoot!.textContent).toContain('Steuerfreigabe')
  })

  it('ignores an older status poll arriving after settings were saved', async () => {
    let finish:(value:unknown)=>void=()=>{}
    const initial=entry(); const updated=entry(); updated.enabled=true; updated.demand_automation=true; updated.settings.mode='active'; updated.settings_revision=1
    const callWS=vi.fn().mockResolvedValueOnce({entries:[initial]}).mockImplementationOnce(()=>new Promise(resolve=>{finish=resolve})).mockResolvedValueOnce({revision:1}).mockResolvedValueOnce({entries:[updated]})
    const panel=document.createElement('warmwasser-panel') as WarmwasserPanel
    panel.hass={callWS}; document.body.append(panel); await flushPromises()
    const poll=panel.refresh()
    await panel.configure(initial.entry_id, updated.settings, 0)
    finish({entries:[initial]}); await poll; await flushPromises()
    expect(panel.shadowRoot!.textContent).toContain('Steuerfreigabe ist gesetzt')
  })

  it('updates the UI logo when the HA theme changes without reloading the panel', async () => {
    const callWS=vi.fn().mockResolvedValue({entries:[entry()]})
    const panel=document.createElement('warmwasser-panel') as WarmwasserPanel
    panel.hass={callWS,themes:{darkMode:false}}; document.body.append(panel); await flushPromises()
    const light=panel.shadowRoot!.querySelector('.brand-logo')!.getAttribute('src')
    panel.hass={callWS,themes:{darkMode:true}}; await flushPromises()
    expect(panel.shadowRoot!.querySelector('.brand-logo')!.getAttribute('src')).not.toBe(light)
    expect(callWS).toHaveBeenCalledTimes(1)
  })

  it('connects the visible history import button to the administrator WebSocket command', async () => {
    const initial=entry(); const loading=entry(); loading.history_import!.state='loading'
    const callWS=vi.fn().mockResolvedValueOnce({entries:[initial]}).mockResolvedValueOnce({started:true}).mockResolvedValueOnce({entries:[loading]})
    const panel=document.createElement('warmwasser-panel') as WarmwasserPanel
    panel.hass={callWS}; document.body.append(panel); await flushPromises()
    const open=Array.from(panel.shadowRoot!.querySelectorAll('button')).find(b=>b.textContent?.includes('Lernbasis ansehen'))!;open.click();await flushPromises()
    const button=Array.from(panel.shadowRoot!.querySelectorAll('button')).find(b=>b.textContent==='HA-Historie erneut einlesen')!
    button.click(); await flushPromises()
    expect(callWS).toHaveBeenNthCalledWith(2,{type:'warmwasser_zirkulation/import_history',entry_id:initial.entry_id})
    expect(panel.shadowRoot!.textContent).toContain('HA-Historie wird eingelesen')
  })

})
