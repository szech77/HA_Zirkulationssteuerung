import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import UsageHeatmap from './UsageHeatmap.vue'
import { heatmap } from '../test/fixtures'

describe('usage heatmap', () => {
  it('uses the exact measured fraction continuously, including zero, nearby values and full usage', () => {
    const data=heatmap()
    for(const [slot,ratio] of [0,0.41,0.42,1].entries()) data.rows[0].cells[slot]={observed_days:100,event_days:ratio*100,partial_days:100,ratio,sufficient:true,level:2}
    const wrapper=mount(UsageHeatmap,{props:{data}})
    const cells=wrapper.findAll('tbody tr')[0].findAll('button')
    for(const [slot,ratio] of [0,0.41,0.42,1].entries()) {
      expect(cells[slot].attributes('style')).toContain('--usage: '+ratio)
      expect(cells[slot].classes()).not.toContain('no-data')
      expect(cells[slot].classes().some(value=>value.startsWith('level-'))).toBe(false)
    }
    expect(cells[4].classes()).toContain('no-data')
    expect(cells[4].attributes('style')).toBeUndefined()
    expect(wrapper.get('.usage-scale').attributes('aria-label')).toContain('stufenlos von 0 bis 100 Prozent')
    expect(wrapper.get('.usage-gradient').exists()).toBe(true)
  })
  it('can hide each planning overlay without changing measured colors', async () => {
    const data=heatmap();data.planning={mode:'monitoring',vacation_active:false,horizon_days:7,next_start:null}
    data.rows[0].cells[12].allowed_windows=[{start:'06:00',end:'06:30',offset:0,width:100}]
    data.rows[0].cells[12].planned_runs=[{start:'06:05',end:'06:07',offset:16.67,width:6.67}]
    const wrapper=mount(UsageHeatmap,{props:{data}})
    expect(wrapper.find('.allowed-window').exists()).toBe(true)
    await wrapper.findAll('input[type=checkbox]')[0].setValue(false)
    expect(wrapper.find('.allowed-window').exists()).toBe(false)
    expect(wrapper.find('.planned-run').exists()).toBe(true)
    await wrapper.findAll('input[type=checkbox]')[1].setValue(false)
    expect(wrapper.find('.planned-run').exists()).toBe(false)
    expect(wrapper.findAll('.heat-cell')).toHaveLength(336)
  })

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

  it('marks permissions and planned warming in monitoring without replacing usage colors', async () => {
    const data=heatmap(); data.observed_dates=3
    data.planning={mode:'monitoring',vacation_active:false,horizon_days:7,next_start:'2026-01-26T07:03:00Z'}
    data.rows[0].cells[14]={observed_days:3,event_days:3,partial_days:3,ratio:1,sufficient:true,level:4,
      allowed_windows:[{start:'07:00',end:'07:30',offset:0,width:100}],
      planned_runs:[{date:'2026-01-26',start:'07:03:00',end:'07:05:00',offset:10,width:6.67}]}
    const wrapper=mount(UsageHeatmap,{props:{data}})
    const cell=wrapper.findAll('tbody tr')[0].findAll('button')[14]
    expect(cell.attributes('style')).toContain('--usage: 1')
    expect(cell.get('.allowed-window').attributes('style')).toContain('width: 100%')
    expect(cell.get('.planned-run').attributes('style')).toContain('left: 10%')
    expect(wrapper.text()).toContain('Planungsvorschau im Monitoring')
    expect(wrapper.text()).toContain('automatische Schaltbefehle sind ausgeschaltet')
    expect(wrapper.findAll('tbody tr')).toHaveLength(7)
    await cell.trigger('click')
    expect(wrapper.get('.cell-detail').text()).toContain('Freigabe 07:00–07:30')
    expect(wrapper.get('.cell-detail').text()).toContain('Geplantes Vorwärmen 2026-01-26 07:03:00–07:05:00')
    await wrapper.setProps({data:{...data,planning:{...data.planning,mode:'active'}}})
    expect(wrapper.findAll('.planned-run')).toHaveLength(1)
    expect(wrapper.text()).toContain('Ausführung bei gültigen Live-Werten')
  })
  it('shows permission bars even without observations or active pump control', () => {
    const data=heatmap();data.planning={mode:'monitoring',vacation_active:true,horizon_days:7,next_start:null}
    data.rows[6].cells[24].allowed_windows=[{start:'12:00',end:'12:30',offset:0,width:100}]
    const wrapper=mount(UsageHeatmap,{props:{data}})
    const cell=wrapper.findAll('tbody tr')[6].findAll('button')[24]
    expect(cell.classes()).toContain('no-data')
    expect(cell.find('.allowed-window').exists()).toBe(true)
    expect(cell.attributes('aria-label')).toContain('Freigabe 12:00–12:30')
    expect(wrapper.text()).toContain('Urlaubsprofil bestimmt die dargestellten Freigaben')
    expect(wrapper.findAll('.planned-run')).toHaveLength(0)
  })
  it('refreshes selected planning details after settings or forecast change', async () => {
    const data=heatmap();data.rows[0].cells[14].allowed_windows=[{start:'07:00',end:'07:30',offset:0,width:100}]
    const wrapper=mount(UsageHeatmap,{props:{data}})
    await wrapper.findAll('tbody tr')[0].findAll('button')[14].trigger('click')
    expect(wrapper.get('.cell-detail').text()).toContain('Freigabe')
    await wrapper.setProps({data:heatmap()})
    expect(wrapper.get('.cell-detail').text()).not.toContain('Freigabe')
  })

})
