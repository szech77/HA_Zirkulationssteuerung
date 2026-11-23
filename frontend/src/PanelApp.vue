<script setup lang="ts">
import { ref } from 'vue'
import lightLogo from '../../branding/icon.svg'
import darkLogo from '../../branding/dark_icon.svg'
import WarmwasserDashboard from './WarmwasserDashboard.vue'
import type { DashboardState, SaveSettings, ImportHistory } from './types'
defineProps<{ state: DashboardState; saveSettings?: SaveSettings; importHistory?: ImportHistory }>()
defineEmits<{ refresh: []; menu: [] }>()
const configurationOpen = ref(false)
</script>
<template>
  <main class="page"><header class="toolbar"><button class="menu-button" type="button" aria-label="Navigation öffnen" @click="$emit('menu')">☰</button><div class="brand-heading"><img class="brand-logo" :src="state.darkMode ? darkLogo : lightLogo" alt="" aria-hidden="true" width="52" height="52"><div><h1>Warmwasser-Zirkulation</h1><p>Verbrauchsmuster verstehen. Betrieb im Blick behalten.</p></div></div><button type="button" :disabled="state.loading" @click="$emit('refresh')">{{ state.loading ? 'Wird geladen …' : 'Aktualisieren' }}</button><button type="button" :aria-expanded="configurationOpen" @click="configurationOpen = !configurationOpen">{{ configurationOpen ? 'Konfiguration schließen' : 'Konfiguration' }}</button><a href="/config/integrations/integration/warmwasser_zirkulation" title="Sensoren und Feiertagsregion über das Zahnrad am gewünschten Eintrag ändern">Geräte &amp; Sensoren</a></header>
    <p v-if="state.error" class="error" role="alert">{{ state.error }} <button type="button" @click="$emit('refresh')">Erneut versuchen</button></p>
    <p v-else-if="state.loading && !state.entries.length" role="status">Die Betriebsdaten werden aus Home Assistant geladen …</p>
    <template v-else><p v-if="!state.entries.length" class="empty">Keine geladene Warmwasser-Zirkulation gefunden. Die Integration unter „Geräte & Dienste“ einrichten.</p><WarmwasserDashboard v-for="entry in state.entries" :key="entry.entry_id" :entry="entry" :configuration-open="configurationOpen" :save-settings="saveSettings" :import-history="importHistory" /><p v-if="state.updatedAt" class="updated">Letzte Aktualisierung: {{ new Date(state.updatedAt).toLocaleTimeString('de-DE') }} · Aktualisierung alle 15 Sekunden</p></template>
  </main>
</template>
