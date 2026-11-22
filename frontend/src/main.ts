import { createApp } from 'vue'
import WarmwasserDashboard from './WarmwasserDashboard.vue'

export function mount(el: string | Element) { return createApp(WarmwasserDashboard, { reason: 'monitoring', threshold: 0.12, sampleSize: 0, remainingStarts: 0 }).mount(el) }

