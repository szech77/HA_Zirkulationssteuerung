import { createMemoryHistory, createRouter, type RouteRecordRaw } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'

export const routes: RouteRecordRaw[] = [
  { path: '/', name: 'dashboard', component: DashboardView },
  { path: '/:pathMatch(.*)*', redirect: { name: 'dashboard' } },
]

// HA owns the browser URL. Each panel gets its own internal router instance.
export function createPanelRouter() {
  return createRouter({ history: createMemoryHistory(), routes })
}
