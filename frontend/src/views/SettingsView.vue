<script setup lang="ts">
import { ref, watch } from 'vue'
import ControlSettings from '../components/ControlSettings.vue'
import type { DashboardState, SaveSettings } from '../types'
const props = defineProps<{ state: DashboardState; saveSettings?: SaveSettings }>()
defineEmits<{ refresh: [] }>()
const selected = ref(props.state.entries[0]?.entry_id ?? '')
watch(() => props.state.entries.map(entry => entry.entry_id), ids => { if (!ids.includes(selected.value)) selected.value = ids[0] ?? '' })
</script>
<template>
  <main class="page" id="settings">
    <h1 class="visually-hidden">Einstellungen</h1>
    <section class="intro"><div><span class="eyebrow">DEIN SYSTEM. DEINE EINSTELLUNGEN.</span><h2>So passt es zu deinem Alltag.</h2><p class="subtext">Freigaben, Betriebsart und Geräte an einem Ort.</p></div><label v-if="state.entries.length > 1" class="field">System<select v-model="selected"><option v-for="entry in state.entries" :key="entry.entry_id" :value="entry.entry_id">{{ entry.title }}</option></select></label></section>
    <div v-if="state.error" class="error" role="alert">{{ state.error }} Deine Eingaben bleiben erhalten. <button class="secondary-button" @click="$emit('refresh')">Erneut versuchen</button></div>
    <p v-if="!state.entries.length" class="surface empty" role="status">{{ state.loading ? 'Konfiguration wird geladen …' : 'Kein geladenes System verfügbar.' }}</p>
    <ControlSettings v-for="entry in state.entries" v-show="entry.entry_id === selected" :key="entry.entry_id" :entry="entry" :save-settings="saveSettings" :disabled="Boolean(state.error)" />
  </main>
</template>
