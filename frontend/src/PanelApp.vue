<script setup lang="ts">
import WarmwasserDashboard from './WarmwasserDashboard.vue'
import type { DashboardState } from './types'
defineProps<{ state: DashboardState }>()
defineEmits<{ refresh: []; menu: [] }>()
</script>
<template>
  <main class="page"><header class="toolbar"><button class="menu-button" type="button" aria-label="Navigation öffnen" @click="$emit('menu')">☰</button><div><h1>Warmwasser-Zirkulation</h1><p>Verbrauchsmuster verstehen. Betrieb im Blick behalten.</p></div><button type="button" :disabled="state.loading" @click="$emit('refresh')">{{ state.loading ? 'Wird geladen …' : 'Aktualisieren' }}</button><a href="/config/integrations/integration/warmwasser_zirkulation">Konfiguration</a></header>
    <p v-if="state.error" class="error" role="alert">{{ state.error }} <button type="button" @click="$emit('refresh')">Erneut versuchen</button></p>
    <p v-else-if="state.loading && !state.entries.length" role="status">Die Betriebsdaten werden aus Home Assistant geladen …</p>
    <template v-else><p v-if="!state.entries.length" class="empty">Keine geladene Warmwasser-Zirkulation gefunden. Die Integration unter „Geräte & Dienste“ einrichten.</p><WarmwasserDashboard v-for="entry in state.entries" :key="entry.entry_id" :entry="entry" /><p v-if="state.updatedAt" class="updated">Letzte Aktualisierung: {{ new Date(state.updatedAt).toLocaleTimeString('de-DE') }} · Aktualisierung alle 15 Sekunden</p></template>
  </main>
</template>
