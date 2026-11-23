import { describe, expect, it } from 'vitest'
import { createDashboardStore } from './dashboard'
import { entry } from '../test/fixtures'

describe('dashboard store', () => {
  it('keeps separate HA panel instances isolated and resets stale readings on remount', () => {
    const first=createDashboardStore(), second=createDashboardStore()
    first.receive({entries:[entry()]}); first.setTheme(true)
    expect(second.state.entries).toEqual([])
    expect(second.state.darkMode).toBe(false)
    expect(first.state.updatedAt).not.toBeNull()
    first.reset()
    expect(first.state.entries).toEqual([])
    expect(first.state.updatedAt).toBeNull()
    expect(first.state.loading).toBe(true)
  })
  it('rejects incomplete responses without replacing the last confirmed readings', () => {
    const store=createDashboardStore();store.receive({entries:[entry()]})
    expect(()=>store.receive({entries:null} as never)).toThrow('invalid_response')
    expect(store.state.entries[0].entry_id).toBe('synthetic-entry')
  })
})
