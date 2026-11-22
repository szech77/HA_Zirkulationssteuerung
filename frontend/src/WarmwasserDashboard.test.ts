import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import WarmwasserDashboard from './WarmwasserDashboard.vue'

const renderDashboard = (reason = 'monitoring') => mount(WarmwasserDashboard, {
  props: {
    reason,
    threshold: 0.42,
    sampleSize: 18,
    remainingStarts: 4,
    nextStart: '07:30',
  },
})

describe('WarmwasserDashboard', () => {
  it('shows monitoring status and all operational metrics', () => {
    const wrapper = renderDashboard()

    expect(wrapper.get('.status').text()).toBe('Monitoring')
    expect(wrapper.text()).toContain('0.420 °C/min')
    expect(wrapper.text()).toContain('18')
    expect(wrapper.text()).toContain('4')
    expect(wrapper.text()).toContain('07:30')
  })

  it('shows a started status for a successful automatic start', () => {
    const wrapper = renderDashboard('started')

    expect(wrapper.get('.status').text()).toBe('Pumpe gestartet')
  })

  it('keeps safety information visible for paused and failure reasons', () => {
    const wrapper = renderDashboard('pump_unreachable')

    expect(wrapper.get('.status').text()).toBe('pump_unreachable')
    expect(wrapper.text()).toContain('fehlenden frischen Messwerten')
    expect(wrapper.text()).toContain('unerreichbarer Pumpe')
  })
})

