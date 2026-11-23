import { afterEach, describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { WarmwasserPanel } from './main'
import { entry } from './test-data'
afterEach(()=>{ document.body.replaceChildren(); vi.useRealTimers() })
describe('HA custom panel bridge', () => {
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
})
