import { createMemoryHistory, createRouter, type RouteRecordRaw } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import SettingsView from '../views/SettingsView.vue'

export const routes: RouteRecordRaw[] = [
  { path: '/', name: 'dashboard', component: DashboardView },
  { path: '/settings', name: 'settings', component: SettingsView },
  { path: '/:pathMatch(.*)*', redirect: { name: 'dashboard' } },
]

// HA owns the browser URL. Each panel gets its own internal router instance.
export function createPanelRouter() {
  return createRouter({ history: createMemoryHistory(), routes })
}
