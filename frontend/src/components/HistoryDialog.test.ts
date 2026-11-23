import { mount } from '@vue/test-utils'
import { beforeAll, afterAll, describe, expect, it } from 'vitest'
import HistoryDialog from './HistoryDialog.vue'
import { entry } from '../test/fixtures'
let show: PropertyDescriptor | undefined, close: PropertyDescriptor | undefined
beforeAll(()=>{
  const prototype=HTMLDialogElement.prototype
  show=Object.getOwnPropertyDescriptor(prototype,'showModal');close=Object.getOwnPropertyDescriptor(prototype,'close')
  Object.defineProperty(prototype,'showModal',{configurable:true,value:function(this:HTMLDialogElement){this.setAttribute('open','')}})
  Object.defineProperty(prototype,'close',{configurable:true,value:function(this:HTMLDialogElement){this.removeAttribute('open')}})
})
afterAll(()=>{
  const prototype=HTMLDialogElement.prototype
  if(show)Object.defineProperty(prototype,'showModal',show);else delete (prototype as any).showModal
  if(close)Object.defineProperty(prototype,'close',close);else delete (prototype as any).close
})
describe('history details dialog',()=>{
  it('shows real history state and restores keyboard focus on close',async()=>{
    const trigger=document.createElement('button');document.body.append(trigger);trigger.focus()
    const wrapper=mount(HistoryDialog,{props:{entry:entry()},attachTo:document.body})
    expect(wrapper.get('dialog').attributes('open')).toBeDefined()
    expect(wrapper.text()).toContain('Die Lernbasis wird aus Live-Messungen aufgebaut')
    await wrapper.get('[aria-label="Dialog schließen"]').trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(1)
    wrapper.unmount();expect(document.activeElement).toBe(trigger);trigger.remove()
  })
  it('handles the native Escape/cancel action',async()=>{
    const wrapper=mount(HistoryDialog,{props:{entry:entry()}})
    await wrapper.get('dialog').trigger('cancel')
    expect(wrapper.emitted('close')).toHaveLength(1);wrapper.unmount()
  })
})
