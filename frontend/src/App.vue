<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import UiIcon from './components/UiIcon.vue'
import lightLogo from './assets/images/icon.svg'
import darkLogo from './assets/images/dark_icon.svg'
import type { DashboardState, SaveSettings, ImportHistory } from './types'
const props = defineProps<{ state: DashboardState; saveSettings?: SaveSettings; importHistory?: ImportHistory }>()
defineEmits<{ refresh: []; menu: [] }>()
const route = useRoute()
const themeOverride = ref<boolean | null>(null)
const dark = computed(() => themeOverride.value ?? Boolean(props.state.darkMode))
</script>
<template>
  <div class="app-shell" :data-theme="dark ? 'dark' : 'light'">
    <header class="app-header"><div class="header-inner">
      <button class="icon-button menu-button" aria-label="Navigation öffnen" @click="$emit('menu')"><UiIcon name="menu" /></button>
      <RouterLink class="brand" to="/" aria-label="Zirkulation – zur Übersicht"><img class="brand-logo" :src="dark ? darkLogo : lightLogo" alt="" width="36" height="36"><span>Warmwasser<small>ZIRKULATION</small></span></RouterLink>
      <nav aria-label="Hauptnavigation"><RouterLink to="/" :class="{active: route.name === 'dashboard'}">Übersicht</RouterLink><RouterLink to="/settings" :class="{active: route.name === 'settings'}">Einstellungen</RouterLink></nav>
      <button class="icon-button refresh-button" :disabled="state.loading" :aria-label="state.loading ? 'Wird geladen …' : 'Aktualisieren'" title="Aktualisieren" @click="$emit('refresh')"><UiIcon name="refresh" /></button>
      <button class="icon-button theme-button" :aria-label="dark ? 'Helle Ansicht aktivieren' : 'Dunkle Ansicht aktivieren'" @click="themeOverride = !dark"><UiIcon :name="dark ? 'sun' : 'moon'" /></button>
    </div></header>
    <div class="panel-viewport">
      <RouterView v-slot="{ Component }">
        <KeepAlive><component :is="Component" :state="state" :save-settings="saveSettings" :import-history="importHistory" @refresh="$emit('refresh')" /></KeepAlive>
      </RouterView>
      <footer class="page-footer"><span><i class="status-dot"></i><template v-if="state.error">Verbindung unterbrochen</template><template v-else-if="state.updatedAt">Aktualisiert {{ new Date(state.updatedAt).toLocaleTimeString('de-DE') }} · alle 15 Sekunden</template><template v-else>Verbindung mit Home Assistant</template></span><span>Warmwasser-Zirkulation</span></footer>
    </div>
  </div>
</template>
