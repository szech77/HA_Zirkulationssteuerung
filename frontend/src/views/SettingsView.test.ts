import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import SettingsView from './SettingsView.vue'
import { entry } from '../test/fixtures'
describe('settings page', () => {
  it('offers no fabricated system during initial loading', () => {
    const wrapper=mount(SettingsView,{props:{state:{entries:[],loading:true,error:null,updatedAt:null}}})
    expect(wrapper.get('[role=status]').text()).toContain('geladen')
    expect(wrapper.find('.control-settings').exists()).toBe(false)
  })
  it('keeps separate drafts for multiple systems', async () => {
    const first=entry(),second={...entry(),entry_id:'second',title:'Second synthetic system'}
    const wrapper=mount(SettingsView,{props:{state:{entries:[first,second],loading:false,error:null,updatedAt:null}}})
    await wrapper.findAll('.control-settings')[0].get('[aria-label="Montag Zeitraum hinzufügen"]').trigger('click')
    await wrapper.get('select').setValue('second')
    expect(wrapper.findAll('.control-settings')[1].find('[data-day=mon] input').exists()).toBe(false)
    await wrapper.get('select').setValue(first.entry_id)
    expect(wrapper.findAll('.control-settings')[0].get('[data-day=mon] input').element.value).toBe('06:00')
  })
  it('offers retry and preserves unavailable drafts while blocking commands', async () => {
    const state={entries:[entry()],loading:false,error:null as string|null,updatedAt:null}
    const wrapper=mount(SettingsView,{props:{state}})
    await wrapper.get('[aria-label="Montag Zeitraum hinzufügen"]').trigger('click')
    await wrapper.setProps({state:{...state,error:'Verbindung prüfen'}})
    await wrapper.get('[role=alert] button').trigger('click')
    expect(wrapper.emitted('refresh')).toHaveLength(1)
    expect(wrapper.get('[data-day=mon] input').element.value).toBe('06:00')
    expect(wrapper.get('[type=submit]').attributes('disabled')).toBeDefined()
  })
})
