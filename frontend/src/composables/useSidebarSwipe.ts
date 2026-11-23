// Observe an edge swipe; native scrolling and browser touch handling stay intact.
export function useSidebarSwipe(surface: HTMLElement, openSidebar: () => void) {
  let start: { id: number; x: number; y: number; at: number } | null = null
  const reset = () => { start = null }
  function onStart(event: TouchEvent) {
    reset()
    if (event.touches.length !== 1) return
    const touch = event.touches[0]
    const edge = touch.clientX - surface.getBoundingClientRect().left
    if (edge < 0 || edge > 28) return
    // A control keeps its normal interaction, even if it sits near the edge.
    if (event.composedPath().some(node => node instanceof HTMLElement &&
      node.matches('button, a, input, select, textarea, [contenteditable="true"]'))) return
    start = { id: touch.identifier, x: touch.clientX, y: touch.clientY, at: performance.now() }
  }
  function onMove(event: TouchEvent) {
    if (!start) return
    if (event.touches.length !== 1) { reset(); return }
    const touch = Array.from(event.touches).find(item => item.identifier === start!.id)
    if (!touch) { reset(); return }
    const dx = touch.clientX - start.x, dy = touch.clientY - start.y
    if (dx < -12 || (Math.abs(dy) > 24 && Math.abs(dy) > Math.abs(dx))) reset()
  }
  function onEnd(event: TouchEvent) {
    const gesture = start
    reset()
    if (!gesture || event.touches.length) return
    const touch = Array.from(event.changedTouches).find(item => item.identifier === gesture.id)
    if (!touch) return
    const dx = touch.clientX - gesture.x, dy = Math.abs(touch.clientY - gesture.y)
    const duration = performance.now() - gesture.at
    if (duration >= 0 && duration <= 700 && dx >= 70 && dy <= 48 && dx >= dy * 1.75) openSidebar()
  }
  surface.addEventListener('touchstart', onStart, { passive: true })
  surface.addEventListener('touchmove', onMove, { passive: true })
  surface.addEventListener('touchend', onEnd, { passive: true })
  surface.addEventListener('touchcancel', reset, { passive: true })
  return () => {
    reset()
    surface.removeEventListener('touchstart', onStart)
    surface.removeEventListener('touchmove', onMove)
    surface.removeEventListener('touchend', onEnd)
    surface.removeEventListener('touchcancel', reset)
  }
}
