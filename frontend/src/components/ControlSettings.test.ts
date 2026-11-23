import { mount, flushPromises } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import ControlSettings from './ControlSettings.vue'
import { entry } from '../test/fixtures'
import type { ControlSettings as Settings } from '../types'
const selectSection = async (wrapper: ReturnType<typeof mount>, label: string) => wrapper.findAll('.settings-nav button').find(button => button.text() === label)!.trigger('click')
const add = (wrapper: ReturnType<typeof mount>, day: string) => wrapper.get(`[aria-label="${day} Zeitraum hinzufügen"]`).trigger('click')
describe('schedule, operating mode and free runtime', () => {
  it('starts in monitoring with seven blocked groups and a native device configuration link', () => {
    const wrapper = mount(ControlSettings, {props:{entry:entry()}})
    expect(wrapper.get('[aria-pressed=true]').text()).toContain('Nur Monitoring')
    expect(wrapper.findAll('[data-day]')).toHaveLength(8)
    expect(wrapper.text()).toContain('Sonn- und Feiertage verwenden dieselben Zeitfenster')
    expect(wrapper.get('[type=submit]').attributes('disabled')).toBeDefined()
    expect(wrapper.get('.native-config-link').attributes('title')).toContain('Zahnrad')
  })
  it('saves morning/evening, combined holidays, vacation and active mode together', async () => {
    const initial = entry(); let wrapper: ReturnType<typeof mount>
    const save = vi.fn(async (_id:string, settings:Settings, revision:number) => { await wrapper.setProps({entry:{...initial,settings,settings_revision:revision+1}}) })
    wrapper = mount(ControlSettings, {props:{entry:initial,saveSettings:save}})
    await add(wrapper,'Montag'); await add(wrapper,'Montag')
    await wrapper.get('[aria-label="Montag Abschnitt 2 von"]').setValue('18:00')
    await wrapper.get('[aria-label="Montag Abschnitt 2 bis"]').setValue('21:00')
    await wrapper.get('[data-day=sun_holiday] .day-head').trigger('click'); await add(wrapper,'Sonn-/Feiertage')
    await selectSection(wrapper,'Betrieb & Urlaub')
    await wrapper.get('[aria-label="Urlaubsprofil aktivieren"]').trigger('click'); await add(wrapper,'Urlaub')
    await wrapper.findAll('.mode-option')[1].trigger('click')
    await wrapper.get('form').trigger('submit'); await flushPromises()
    expect(save).toHaveBeenCalledWith('synthetic-entry',expect.objectContaining({mode:'active',runtime_seconds:120,max_starts:6,vacation_active:true,schedule:expect.objectContaining({mon:[{start:'06:00',end:'08:00'},{start:'18:00',end:'21:00'}],sun_holiday:[{start:'06:00',end:'08:00'}]}),vacation_windows:[{start:'06:00',end:'08:00'}]}),0)
    expect(wrapper.get('[role=status]').text()).toBe('Konfiguration gespeichert.')
    await selectSection(wrapper,'Freigabezeiten'); await wrapper.get('[data-day=mon] .day-head').trigger('click')
    await wrapper.get('[aria-label="Montag Abschnitt 1 entfernen"]').trigger('click')
    expect(wrapper.findAll('[data-day=mon] li')).toHaveLength(1)
  })
  it.each([[90,5400],[1.5,90],[1440,86400]])('converts %s free minutes to %s seconds', async (minutes,seconds) => {
    const save = vi.fn().mockResolvedValue(undefined)
    const wrapper = mount(ControlSettings,{props:{entry:entry(),saveSettings:save}})
    await selectSection(wrapper,'Betrieb & Urlaub')
    await wrapper.get('[aria-label="Pumpenlaufzeit in Minuten"]').setValue(minutes)
    await wrapper.get('[aria-label="Maximale Starts pro Tag"]').setValue(12)
    await wrapper.get('form').trigger('submit'); await flushPromises()
    expect(save).toHaveBeenCalledWith('synthetic-entry',expect.objectContaining({runtime_seconds:seconds,max_starts:12}),0)
  })
  it('rejects a zero or excessive duration before issuing a command', async () => {
    const save=vi.fn(); const wrapper=mount(ControlSettings,{props:{entry:entry(),saveSettings:save}})
    for (const minutes of [0,1441]) { await wrapper.get('[aria-label="Pumpenlaufzeit in Minuten"]').setValue(minutes); await wrapper.get('form').trigger('submit'); expect(wrapper.get('[role=alert]').text()).toContain('Laufzeit und Tageslimit') }
    expect(save).not.toHaveBeenCalled()
  })
  it('retains edits and hides private server messages after validation failure', async () => {
    const save=vi.fn().mockRejectedValue({code:'invalid_settings',message:'private synthetic details'})
    const wrapper=mount(ControlSettings,{props:{entry:entry(),saveSettings:save}})
    await add(wrapper,'Montag'); await wrapper.get('form').trigger('submit'); await flushPromises()
    expect(wrapper.get('[role=alert]').text()).toContain('Zeitfenster prüfen')
    expect(wrapper.text()).not.toContain('private synthetic details')
    expect(wrapper.get('[aria-label="Montag Abschnitt 1 von"]').element.value).toBe('06:00')
    expect(wrapper.text()).toContain('Ungespeicherte Änderungen')
  })
  it('preserves drafts on poll conflicts and reloads only on explicit request', async () => {
    const save=vi.fn();const wrapper=mount(ControlSettings,{props:{entry:entry(),saveSettings:save}})
    await add(wrapper,'Montag');await wrapper.setProps({entry:{...entry(),settings_revision:1}})
    expect(wrapper.get('[role=alert]').text()).toContain('inzwischen geändert')
    expect(wrapper.find('[data-day=mon] input').exists()).toBe(true)
    await wrapper.get('form').trigger('submit');expect(save).not.toHaveBeenCalled()
    await wrapper.findAll('button').find(button=>button.text()==='Gespeicherten Stand neu laden')!.trigger('click')
    expect(wrapper.find('[role=alert]').exists()).toBe(false)
    expect(wrapper.find('[data-day=mon] input').exists()).toBe(false)
  })
  it('blocks duplicate saves and retains input after a storage error', async () => {
    let reject:(cause:unknown)=>void=()=>{}
    const save=vi.fn(()=>new Promise<void>((_resolve,fail)=>{reject=fail}))
    const wrapper=mount(ControlSettings,{props:{entry:entry(),saveSettings:save}})
    await wrapper.findAll('.mode-option')[1].trigger('click')
    await wrapper.get('form').trigger('submit');await wrapper.get('form').trigger('submit')
    expect(save).toHaveBeenCalledTimes(1)
    expect(wrapper.get('fieldset').attributes('disabled')).toBeDefined()
    reject(new Error('private response'));await flushPromises()
    expect(wrapper.get('[role=alert]').text()).toContain('Administratorrechte prüfen')
    expect(wrapper.text()).not.toContain('private response')
    expect(wrapper.findAll('.mode-option')[1].attributes('aria-pressed')).toBe('true')
  })
  it('allows fault acknowledgement and does not save while disconnected', async () => {
    const initial=entry();initial.reason='pump_unreachable'
    const save=vi.fn().mockResolvedValue(undefined)
    const wrapper=mount(ControlSettings,{props:{entry:initial,saveSettings:save}})
    expect(wrapper.get('[type=submit]').attributes('disabled')).toBeUndefined()
    await wrapper.get('form').trigger('submit');await flushPromises();expect(save).toHaveBeenCalledTimes(1)
    await wrapper.setProps({disabled:true});await wrapper.get('form').trigger('submit');expect(save).toHaveBeenCalledTimes(1)
  })
  it('copies Monday without sharing arrays and retains a single Sunday/holiday group', async () => {
    const wrapper=mount(ControlSettings,{props:{entry:entry()}})
    await add(wrapper,'Montag');await wrapper.findAll('button').find(b=>b.text().includes('Montag auf Di–Fr'))!.trigger('click')
    await wrapper.get('[aria-label="Montag Abschnitt 1 von"]').setValue('05:00')
    expect(wrapper.get('[data-day=tue] .time-chip').text()).toContain('06:00')
    expect(wrapper.find('[data-day=sun]').exists()).toBe(false)
    expect(wrapper.find('[data-day=holiday]').exists()).toBe(false)
  })
})
