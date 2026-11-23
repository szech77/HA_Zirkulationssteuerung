import { mount, flushPromises } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import HistoryStatus from './HistoryStatus.vue'
import { entry } from './test-data'

describe('HA history bootstrap and learned planning status', () => {
  it('shows progress and disables duplicate imports', () => {
    const value=entry(); value.history_import!.state='loading'; value.history_import!.days=7
    const wrapper=mount(HistoryStatus,{props:{entry:value}})
    expect(wrapper.text()).toContain('7/28 Tage geprüft')
    expect(wrapper.get('button').attributes('disabled')).toBeDefined()
    expect(wrapper.text()).toContain('drei ausreichend beobachtete Tage')
  })
  it('shows the missing pump history assumption and a proposed pattern start', () => {
    const value=entry(); value.history_import!.state='complete'; value.history_import!.assumed_pump_off=true; value.next_start='2026-11-23T07:03:00+01:00'
    const wrapper=mount(HistoryStatus,{props:{entry:value}})
    expect(wrapper.text()).toContain('„Pumpe aus“ angenommen')
    expect(wrapper.text()).toContain('Nächster Muster-Vorschlag')
    expect(wrapper.text()).toContain('Schaltbefehle sind nur bei „Steuerung aktiv“ freigegeben')
  })
  it('requests a repeated import and confirms success', async () => {
    const request=vi.fn().mockResolvedValue(undefined)
    const wrapper=mount(HistoryStatus,{props:{entry:entry(),importHistory:request}})
    await wrapper.get('button').trigger('click'); await flushPromises()
    expect(request).toHaveBeenCalledExactlyOnceWith('synthetic-entry')
    expect(wrapper.text()).toContain('Historienimport angefordert')
  })
  it('keeps errors local and does not display private server details', async () => {
    const value=entry(); value.history_import!.state='error'
    const wrapper=mount(HistoryStatus,{props:{entry:value,importHistory:vi.fn().mockRejectedValue(new Error('synthetic private response'))}})
    expect(wrapper.text()).toContain('Live-Messungen werden weiter ausgewertet')
    await wrapper.get('button').trigger('click'); await flushPromises()
    expect(wrapper.get('[role=alert]').text()).toContain('Recorder, Verbindung und Administratorrechte')
    expect(wrapper.text()).not.toContain('synthetic private response')
  })
  it('names an unavailable Recorder without hiding live readings', () => {
    const value=entry(); value.history_import!.state='unavailable'
    const wrapper=mount(HistoryStatus,{props:{entry:value}})
    expect(wrapper.text()).toContain('Die Integration lernt aus Live-Messungen')
  })
})
