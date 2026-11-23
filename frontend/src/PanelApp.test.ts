import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import PanelApp from './PanelApp.vue'
import { entry } from './test-data'

describe('panel states', () => {
  it('renders backend data and emits refresh/menu actions', async () => {
    const wrapper=mount(PanelApp,{props:{state:{entries:[entry()],loading:false,error:null,updatedAt:null}}})
    expect(wrapper.text()).toContain('Test-Zirkulation')
    const configuration=wrapper.get('a')
    expect(configuration.text()).toBe('Konfiguration')
    expect(configuration.attributes('href')).toBe('/config/integrations/integration/warmwasser_zirkulation')
    expect(configuration.attributes('title')).toContain('Zahnrad')
    await wrapper.get('.menu-button').trigger('click')
    await wrapper.findAll('button').find(button=>button.text()==='Aktualisieren')!.trigger('click')
    expect(wrapper.emitted('menu')).toHaveLength(1)
    expect(wrapper.emitted('refresh')).toHaveLength(1)
  })
  it('shows loading and does not render example metrics', () => {
    const wrapper=mount(PanelApp,{props:{state:{entries:[],loading:true,error:null,updatedAt:null}}})
    expect(wrapper.get('[role=status]').text()).toContain('geladen')
    expect(wrapper.find('.system-card').exists()).toBe(false)
  })
  it('hides old readings on a connection error and permits retry', async () => {
    const wrapper=mount(PanelApp,{props:{state:{entries:[entry()],loading:false,error:'Verbindung prüfen',updatedAt:null}}})
    expect(wrapper.get('[role=alert]').text()).toContain('Verbindung prüfen')
    expect(wrapper.find('.system-card').exists()).toBe(false)
    await wrapper.get('[role=alert] button').trigger('click')
    expect(wrapper.emitted('refresh')).toHaveLength(1)
  })
})
