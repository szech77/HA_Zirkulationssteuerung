import { reactive } from 'vue'
import type { DashboardState, EntryStatus } from '../types'

const initialState = (): DashboardState => ({
  darkMode: false, entries: [], loading: true, error: null, updatedAt: null,
})

// One store per mounted HA panel; no state is shared across HA instances or tests.
export function createDashboardStore() {
  const state = reactive<DashboardState>(initialState())
  return {
    state,
    reset() { Object.assign(state, initialState()) },
    setTheme(darkMode: boolean) { state.darkMode = darkMode },
    receive(response: { entries: EntryStatus[] }) {
      if (!response || !Array.isArray(response.entries)) throw new Error('invalid_response')
      state.entries = response.entries
      state.error = null
      state.updatedAt = new Date().toISOString()
    },
  }
}
