import { describe, expect, it } from 'vitest'
import { createPanelRouter } from './index'

describe('embedded panel router', () => {
  it('navigates and resolves unknown internal paths without changing the HA URL', async () => {
    const browserUrl=window.location.href
    const router=createPanelRouter()
    await router.replace('/')
    expect(router.currentRoute.value.name).toBe('dashboard')
    await router.push('/unknown-internal-page')
    expect(router.currentRoute.value.name).toBe('dashboard')
    expect(window.location.href).toBe(browserUrl)
  })
  it('creates isolated routing state for separate HA panels', async () => {
    const first=createPanelRouter(), second=createPanelRouter()
    await first.push('/')
    expect(first.currentRoute.value.name).toBe('dashboard')
    expect(second.currentRoute.value.name).toBeUndefined()
  })
})
