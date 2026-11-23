import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import UsageHeatmap from './UsageHeatmap.vue'
import { heatmap } from './test-data'

describe('usage heatmap', () => {
  it('shows weekdays, Saturday and the combined Sunday/holiday row without inventing data', () => {
    const wrapper=mount(UsageHeatmap,{props:{data:heatmap()}})
    for (const day of ['Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag','Sonn-/Feiertage']) expect(wrapper.text()).toContain(day)
    expect(wrapper.findAll('tbody tr')).toHaveLength(7)
    expect(wrapper.findAll('.heat-cell')).toHaveLength(336)
    expect(wrapper.findAll('.no-data')).toHaveLength(337)
    expect(wrapper.text()).toContain('HA-Historie')
  })
  it('explains measured fractions and exposes the cell details on click', async () => {
    const data=heatmap(); data.observed_dates=4
    data.rows[0].cells[14]={observed_days:4,event_days:2,partial_days:4,ratio:0.5,sufficient:true,level:2}
    const wrapper=mount(UsageHeatmap,{props:{data}})
    const button=wrapper.findAll('tbody tr')[0].findAll('button')[14]
    expect(button.attributes('aria-label')).toContain('Montag · 07:00–07:30')
    await button.trigger('click')
    expect(wrapper.get('.cell-detail').text()).toContain('2 von 4')
    expect(wrapper.get('.cell-detail').text()).toContain('50')
  })
  it('marks insufficient samples and an unset holiday calendar', () => {
    const data=heatmap(); data.calendar_enabled=false
    data.rows[0].cells[1]={observed_days:1,event_days:1,partial_days:1,ratio:1,sufficient:false,level:4}
    const wrapper=mount(UsageHeatmap,{props:{data}})
    expect(wrapper.findAll('tbody tr')[0].findAll('button')[1].classes()).toContain('provisional')
    expect(wrapper.text()).toContain('Feiertage sind noch nicht konfiguriert')
    expect(wrapper.findAll('tbody tr')[6].find('button').attributes('aria-label')).toContain('Sonn-/Feiertage')
  })
  it('offers arrow-key navigation with one keyboard entry point', async () => {
    const wrapper=mount(UsageHeatmap,{props:{data:heatmap()},attachTo:document.body})
    const buttons=wrapper.findAll('.heat-cell')
    expect(buttons.filter(button=>button.attributes('tabindex')==='0')).toHaveLength(1)
    await buttons[0].trigger('keydown',{key:'ArrowRight'})
    expect(buttons[1].attributes('tabindex')).toBe('0')
    expect(buttons[0].attributes('tabindex')).toBe('-1')
    await buttons[1].trigger('keydown',{key:'ArrowDown'})
    expect(buttons[49].attributes('tabindex')).toBe('0')
    wrapper.unmount()
  })

})
