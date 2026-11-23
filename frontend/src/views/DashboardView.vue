<script setup lang="ts">
import WarmwasserDashboard from '../components/WarmwasserDashboard.vue'
import type { DashboardState, ImportHistory } from '../types'
defineProps<{ state: DashboardState; importHistory?: ImportHistory }>()
defineEmits<{ refresh: [] }>()
</script>
<template>
  <main class="page" id="overview">
    <section class="intro"><div><span class="eyebrow">WARMWASSER ZU HAUSE</span><h2>Dein Warmwasser im Blick.</h2><p class="subtext">Dein Alltag als Taktgeber. Dein System lernt mit.</p></div></section>
    <div v-if="state.error" class="error" role="alert">{{ state.error }} <button class="secondary-button" @click="$emit('refresh')">Erneut versuchen</button></div>
    <p v-else-if="state.loading && !state.entries.length" class="surface empty" role="status">Die Betriebsdaten werden aus Home Assistant geladen …</p>
    <template v-else><p v-if="!state.entries.length" class="surface empty">Keine geladene Warmwasser-Zirkulation gefunden. Die Integration unter „Geräte &amp; Dienste“ einrichten.</p><WarmwasserDashboard v-for="entry in state.entries" :key="entry.entry_id" :entry="entry" :import-history="importHistory" /></template>
  </main>
</template>
