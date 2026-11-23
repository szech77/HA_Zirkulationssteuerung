import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

type Icon = { path: string; secondaryPath?: string; viewBox?: string }
type IconPack = { getIcon(name: string): Promise<Icon>; getIconList(): Promise<{name:string}[]> }
const iconWindow = window as Window & {customIcons?: Record<string, IconPack>}
let previous: typeof iconWindow.customIcons
beforeEach(() => { previous=iconWindow.customIcons; vi.resetModules() })
afterEach(() => { iconWindow.customIcons=previous; vi.restoreAllMocks() })

describe('globally loaded HA sidebar icon module', () => {
  it('registers the circulation mark before the dashboard is opened without fetching anything', async () => {
    delete iconWindow.customIcons
    const fetch=vi.spyOn(globalThis,'fetch')
    await import('../../custom_components/warmwasser_zirkulation/icons.js')
    const icon=await iconWindow.customIcons!.warmwasser.getIcon('circulation')
    expect(icon.viewBox).toBe('0 0 256 256')
    expect(icon.path).toContain('M17 94')
    expect(icon.secondaryPath).toContain('M128 60')
    expect(await iconWindow.customIcons!.warmwasser.getIconList()).toEqual([expect.objectContaining({name:'circulation'})])
    expect(fetch).not.toHaveBeenCalled()
    expect(customElements.get('warmwasser-panel')).toBeUndefined()
  })
  it('preserves other registered icon sets and safely ignores unknown names', async () => {
    const other={getIcon:vi.fn(),getIconList:vi.fn()}
    const registry={other}; iconWindow.customIcons=registry
    await import('../../custom_components/warmwasser_zirkulation/icons.js')
    expect(iconWindow.customIcons).toBe(registry)
    expect(iconWindow.customIcons.other).toBe(other)
    expect(await iconWindow.customIcons.warmwasser.getIcon('unknown')).toEqual({path:''})
  })
})
