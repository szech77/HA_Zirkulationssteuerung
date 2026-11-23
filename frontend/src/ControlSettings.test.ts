import { mount, flushPromises } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import ControlSettings from './ControlSettings.vue'
import { entry } from './test-data'
import type { ControlSettings as Settings } from './types'

describe('Dashboard schedule and operating mode configuration', () => {
  it('starts in monitoring with all seven day groups blocked', () => {
    const wrapper=mount(ControlSettings,{props:{entry:entry()}})
    expect(wrapper.get('select').element.value).toBe('monitoring')
    expect(wrapper.findAll('[data-day]')).toHaveLength(8)
    expect(wrapper.text()).toContain('Sonn- und Feiertage verwenden dieselben Zeitfenster')
    expect(wrapper.text()).toContain('Home-Assistant-Zeitzone')
    expect(wrapper.get('[type=submit]').attributes('disabled')).toBeDefined()
  })
  it('saves morning and evening lists, holiday/vacation windows and active mode', async () => {
    const initial=entry()
    let wrapper: ReturnType<typeof mount>
    const save=vi.fn(async (_id:string, settings:Settings, revision:number)=>{
      await wrapper.setProps({entry:{...initial,settings,settings_revision:revision+1}})
    })
    wrapper=mount(ControlSettings,{props:{entry:initial,saveSettings:save}})
    const monday=wrapper.get('[data-day=mon]')
    await monday.get('button').trigger('click'); await monday.findAll('button').at(-1)!.trigger('click')
    await wrapper.get('[aria-label="Montag Abschnitt 2 von"]').setValue('18:00')
    await wrapper.get('[aria-label="Montag Abschnitt 2 bis"]').setValue('21:00')
    await wrapper.get('[data-day=sun_holiday] button').trigger('click')
    await wrapper.get('[data-day=vacation] button').trigger('click')
    await wrapper.get('[aria-label="Urlaubsprofil aktivieren"]').setValue(true)
    await wrapper.get('select').setValue('active')
    await wrapper.get('form').trigger('submit'); await flushPromises()
    expect(save).toHaveBeenCalledWith('synthetic-entry',expect.objectContaining({mode:'active',vacation_active:true,schedule:expect.objectContaining({mon:[{start:'06:00',end:'08:00'},{start:'18:00',end:'21:00'}],sun_holiday:[{start:'06:00',end:'08:00'}]}),vacation_windows:[{start:'06:00',end:'08:00'}]}),0)
    expect(wrapper.get('[role=status]').text()).toBe('Konfiguration gespeichert.')
    expect(wrapper.text()).not.toContain('Ungespeicherte Änderungen')
    await wrapper.get('[aria-label="Montag Abschnitt 1 entfernen"]').trigger('click')
    expect(wrapper.findAll('[data-day=mon] li')).toHaveLength(1)
  })
  it('retains input and shows German validation errors without private responses', async () => {
    const save=vi.fn().mockRejectedValue({code:'invalid_settings',message:'private synthetic details'})
    const wrapper=mount(ControlSettings,{props:{entry:entry(),saveSettings:save}})
    await wrapper.get('[data-day=mon] button').trigger('click')
    await wrapper.get('form').trigger('submit'); await flushPromises()
    expect(wrapper.get('[role=alert]').text()).toContain('Zeitfenster prüfen')
    expect(wrapper.text()).not.toContain('private synthetic details')
    expect(wrapper.get('[aria-label="Montag Abschnitt 1 von"]').element.value).toBe('06:00')
    expect(wrapper.text()).toContain('Ungespeicherte Änderungen')
  })
  it('does not overwrite unsaved work during polling and handles conflicts explicitly', async () => {
    const initial=entry(); const save=vi.fn()
    const wrapper=mount(ControlSettings,{props:{entry:initial,saveSettings:save}})
    await wrapper.get('[data-day=mon] button').trigger('click')
    await wrapper.setProps({entry:{...entry(),settings_revision:1}})
    expect(wrapper.get('[role=alert]').text()).toContain('inzwischen geändert')
    expect(wrapper.find('[data-day=mon] input').exists()).toBe(true)
    await wrapper.get('form').trigger('submit')
    expect(save).not.toHaveBeenCalled()
    await wrapper.findAll('button').find(b=>b.text()==='Gespeicherten Stand neu laden')!.trigger('click')
    expect(wrapper.find('[role=alert]').exists()).toBe(false)
    expect(wrapper.find('[data-day=mon] input').exists()).toBe(false)
  })
  it('blocks duplicate saves and displays a safe storage/connection error', async () => {
    let reject:(reason:unknown)=>void=()=>{}
    const save=vi.fn(()=>new Promise<void>((_resolve, fail)=>{reject=fail}))
    const wrapper=mount(ControlSettings,{props:{entry:entry(),saveSettings:save}})
    await wrapper.get('select').setValue('active')
    await wrapper.get('form').trigger('submit'); await wrapper.get('form').trigger('submit')
    expect(save).toHaveBeenCalledTimes(1)
    expect(wrapper.get('fieldset').attributes('disabled')).toBeDefined()
    reject(new Error('private synthetic response')); await flushPromises()
    expect(wrapper.get('[role=alert]').text()).toContain('Administratorrechte prüfen')
    expect(wrapper.text()).not.toContain('private synthetic response')
    expect(wrapper.get('select').element.value).toBe('active')
  })
  it('allows explicit acknowledgement of a pump fault without changing windows', async () => {
    const initial=entry(); initial.reason='pump_unreachable'
    const save=vi.fn().mockResolvedValue(undefined)
    const wrapper=mount(ControlSettings,{props:{entry:initial,saveSettings:save}})
    expect(wrapper.text()).toContain('Erneutes Speichern quittiert den Fehler')
    expect(wrapper.get('[type=submit]').attributes('disabled')).toBeUndefined()
    await wrapper.get('form').trigger('submit'); await flushPromises()
    expect(save).toHaveBeenCalledTimes(1)
  })

  it('shows the automatically migrated single Sunday/holiday group', () => {
    const value=entry()
    const wrapper=mount(ControlSettings,{props:{entry:value}})
    expect(wrapper.get('[data-day=sun_holiday]').text()).toContain('Sonn-/Feiertage')
    expect(wrapper.find('[data-day=sun]').exists()).toBe(false)
    expect(wrapper.find('[data-day=holiday]').exists()).toBe(false)
  })

})
