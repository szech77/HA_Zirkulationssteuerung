import { mount, flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import App from './App.vue'
import { createPanelRouter } from './router'
import { entry } from './test/fixtures'

describe('application root', () => {
  it('renders the routed dashboard and forwards HA menu and refresh events', async () => {
    const router=createPanelRouter();await router.push('/')
    const wrapper=mount(App,{props:{state:{entries:[entry()],loading:false,error:null,updatedAt:null}},global:{plugins:[router]}})
    await flushPromises()
    expect(wrapper.text()).toContain('Test-Zirkulation')
    await wrapper.get('.menu-button').trigger('click')
    await wrapper.findAll('button').find(button=>button.text()==='Aktualisieren')!.trigger('click')
    expect(wrapper.emitted('menu')).toHaveLength(1)
    expect(wrapper.emitted('refresh')).toHaveLength(1)
    wrapper.unmount()
  })
})
