import { afterEach, describe, expect, it, vi } from 'vitest'
import { useSidebarSwipe } from './useSidebarSwipe'

const touch = (x: number, y: number, id = 1) => ({ identifier:id, clientX:x, clientY:y })
function dispatch(target: HTMLElement, type: string, touches: ReturnType<typeof touch>[], changed = touches) {
  const event = new Event(type, { bubbles:true, composed:true, cancelable:true })
  Object.defineProperties(event, { touches:{value:touches}, changedTouches:{value:changed} })
  target.dispatchEvent(event)
  return event
}
const active: (() => void)[] = []
afterEach(() => { active.splice(0).forEach(stop => stop()); document.body.replaceChildren(); vi.restoreAllMocks() })
function setup(left = 0) {
  const surface = document.createElement('div'); document.body.append(surface)
  vi.spyOn(surface,'getBoundingClientRect').mockReturnValue({left} as DOMRect)
  const open = vi.fn(); const stop = useSidebarSwipe(surface,open); active.push(stop)
  return {surface,open,stop}
}
describe('native HA sidebar edge swipe', () => {
  it('opens once after a completed rightward edge gesture without canceling native events', () => {
    const {surface,open} = setup()
    const start = dispatch(surface,'touchstart',[touch(8,200)])
    const move = dispatch(surface,'touchmove',[touch(105,207)])
    const end = dispatch(surface,'touchend',[],[touch(105,207)])
    expect(open).toHaveBeenCalledTimes(1)
    expect([start,move,end].every(event => !event.defaultPrevented)).toBe(true)
  })
  it('uses the panel edge when HA has a docked sidebar', () => {
    const {surface,open} = setup(256)
    dispatch(surface,'touchstart',[touch(264,200)])
    dispatch(surface,'touchend',[],[touch(355,205)])
    expect(open).toHaveBeenCalledTimes(1)
  })
  it('does not treat an ordinary horizontal content swipe as opening the menu', () => {
    const {surface,open} = setup()
    dispatch(surface,'touchstart',[touch(170,200)])
    dispatch(surface,'touchend',[],[touch(300,205)])
    expect(open).not.toHaveBeenCalled()
  })
  it('keeps vertical scrolling, taps, leftward swipes and diagonal movement untouched', () => {
    const {surface,open} = setup()
    for (const [x,y] of [[10,350],[15,202],[-90,200],[100,300]]) {
      dispatch(surface,'touchstart',[touch(10,200)])
      dispatch(surface,'touchmove',[touch(x,y)])
      dispatch(surface,'touchend',[],[touch(x,y)])
    }
    expect(open).not.toHaveBeenCalled()
  })
  it('does not convert a vertical scroll into a menu swipe when direction changes later', () => {
    const {surface,open} = setup()
    dispatch(surface,'touchstart',[touch(8,200)])
    dispatch(surface,'touchmove',[touch(10,240)])
    dispatch(surface,'touchend',[],[touch(120,205)])
    expect(open).not.toHaveBeenCalled()
  })
  it('ignores multiple fingers, cancellation and the wrong ending finger', () => {
    const {surface,open} = setup()
    dispatch(surface,'touchstart',[touch(8,200),touch(20,210,2)])
    dispatch(surface,'touchend',[],[touch(120,200)])
    dispatch(surface,'touchstart',[touch(8,200)])
    dispatch(surface,'touchmove',[touch(8,200),touch(20,210,2)])
    dispatch(surface,'touchend',[],[touch(120,200)])
    dispatch(surface,'touchstart',[touch(8,200)])
    dispatch(surface,'touchcancel',[])
    dispatch(surface,'touchend',[],[touch(120,200)])
    dispatch(surface,'touchstart',[touch(8,200)])
    dispatch(surface,'touchend',[],[touch(120,200,2)])
    expect(open).not.toHaveBeenCalled()
  })
  it('ignores interactive controls at the edge and long holds', () => {
    const {surface,open} = setup()
    const input = document.createElement('input');surface.append(input)
    dispatch(input,'touchstart',[touch(8,200)])
    dispatch(input,'touchend',[],[touch(120,200)])
    const clock = vi.spyOn(performance,'now').mockReturnValue(0)
    dispatch(surface,'touchstart',[touch(8,200)])
    clock.mockReturnValue(900)
    dispatch(surface,'touchend',[],[touch(120,200)])
    expect(open).not.toHaveBeenCalled()
  })
  it('removes listeners and pending gesture state on disconnect', () => {
    const {surface,open,stop} = setup()
    dispatch(surface,'touchstart',[touch(8,200)])
    stop()
    dispatch(surface,'touchend',[],[touch(120,200)])
    dispatch(surface,'touchstart',[touch(8,200)])
    dispatch(surface,'touchend',[],[touch(120,200)])
    expect(open).not.toHaveBeenCalled()
  })
})
