import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WarmwasserDashboard from './WarmwasserDashboard.vue'
import { entry } from './test-data'

describe('WarmwasserDashboard', () => {
  it('shows backend readings, monitoring and configured limits', () => {
    const wrapper = mount(WarmwasserDashboard, { props:{entry:entry()} })
    expect(wrapper.get('.status').text()).toBe('Monitoring')
    expect(wrapper.text()).toContain('45,2 °C')
    expect(wrapper.text()).toContain('Test-Vorlauf')
    expect(wrapper.text()).toContain('Nicht konfiguriert')
    expect(wrapper.text()).toContain('0,120')
    expect(wrapper.text()).toContain('DE · BY')
    expect(wrapper.text()).toContain('Messdaten werden gesammelt')
  })
  it('shows a real pump state and a successful start', () => {
    const value = entry(); value.reason='started'; value.pump.state='on'
    const wrapper = mount(WarmwasserDashboard,{props:{entry:value}})
    expect(wrapper.get('.status').text()).toBe('Pumpe gestartet')
    expect(wrapper.text()).toContain('Läuft')
  })
  it('names paused/error states in German and marks stale readings', () => {
    const value=entry(); value.reason='fresh_flow_value_missing'; value.flow!.stale=true
    const wrapper=mount(WarmwasserDashboard,{props:{entry:value}})
    expect(wrapper.text()).toContain('Frische Temperaturwerte fehlen')
    expect(wrapper.text()).toContain('veraltet')
    expect(wrapper.text()).not.toContain('fresh_flow_value_missing')
  })
})
