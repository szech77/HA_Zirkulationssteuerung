import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WarmwasserDashboard from './WarmwasserDashboard.vue'
import { createPanelRouter } from '../router'
import { entry } from '../test/fixtures'

describe('WarmwasserDashboard', () => {
  it('shows the confirmed end of an owned run instead of promising a new duration', () => {
    const value=entry();value.pump_until='2026-11-23T18:30:00Z';value.pump.state='on';value.reason='pump_already_running'
    const wrapper=mount(WarmwasserDashboard,{props:{entry:value},global:{plugins:[createPanelRouter()]}})
    expect(wrapper.get('.status-action').text()).toContain('Bestätigte Endzeit des laufenden Laufs')
    expect(wrapper.get('.status-action').text()).not.toContain('Planungsvorschau')
  })

  it('shows backend readings, monitoring and configured limits', () => {
    const wrapper = mount(WarmwasserDashboard, { props:{entry:entry()}, global:{plugins:[createPanelRouter()]} })
    expect(wrapper.get('.status-label').text()).toBe('Monitoring')
    expect(wrapper.text()).toContain('45,2°C')
    expect(wrapper.text()).toContain('Test-Vorlauf')
    expect(wrapper.text()).toContain('Nicht konfiguriert')
    expect(wrapper.text()).toContain('0,12')
    expect(wrapper.text()).toContain('DE · BY')
    expect(wrapper.text()).toContain('Messdaten werden gesammelt')
  })
  it('shows a real pump state and a successful start', () => {
    const value = entry(); value.reason='started'; value.pump.state='on'
    const wrapper = mount(WarmwasserDashboard,{props:{entry:value},global:{plugins:[createPanelRouter()]}})
    expect(wrapper.get('.status-label').text()).toBe('Pumpe gestartet')
    expect(wrapper.text()).toContain('Läuft')
  })
  it('names paused/error states in German and marks stale readings', () => {
    const value=entry(); value.reason='fresh_flow_value_missing'; value.flow!.stale=true
    const wrapper=mount(WarmwasserDashboard,{props:{entry:value},global:{plugins:[createPanelRouter()]}})
    expect(wrapper.text()).toContain('Frische Temperaturwerte fehlen')
    expect(wrapper.text()).toContain('veraltet')
    expect(wrapper.text()).not.toContain('fresh_flow_value_missing')
  })
})
