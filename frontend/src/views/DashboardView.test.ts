import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createPanelRouter } from '../router'
import DashboardView from './DashboardView.vue'
import { entry } from '../test/fixtures'
describe('dashboard page states',()=>{
 it('renders real backend data with settings on another page',()=>{const wrapper=mount(DashboardView,{props:{state:{entries:[entry()],loading:false,error:null,updatedAt:null}},global:{plugins:[createPanelRouter()]}});expect(wrapper.text()).toContain('Test-Zirkulation');expect(wrapper.find('.control-settings').exists()).toBe(false);expect(wrapper.get('a').attributes('href')).toBe('/settings')})
 it('shows loading without inventing metrics',()=>{const wrapper=mount(DashboardView,{props:{state:{entries:[],loading:true,error:null,updatedAt:null}}});expect(wrapper.get('[role=status]').text()).toContain('geladen');expect(wrapper.find('.system-card').exists()).toBe(false)})
 it('hides old readings on a connection error and permits retry',async()=>{const wrapper=mount(DashboardView,{props:{state:{entries:[entry()],loading:false,error:'Verbindung prüfen',updatedAt:null}}});expect(wrapper.get('[role=alert]').text()).toContain('Verbindung prüfen');expect(wrapper.find('.system-card').exists()).toBe(false);await wrapper.get('[role=alert] button').trigger('click');expect(wrapper.emitted('refresh')).toHaveLength(1)})
})
