<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import AppNavigation from './components/AppNavigation.vue'
import { useMediaQuery } from './composables/useMediaQuery'
import UiIcon from './components/UiIcon.vue'
import lightLogo from './assets/images/icon.svg'
import darkLogo from './assets/images/dark_icon.svg'
import type { DashboardState, SaveSettings, ImportHistory } from './types'
const props = defineProps<{ state: DashboardState; saveSettings?: SaveSettings; importHistory?: ImportHistory }>()
defineEmits<{ refresh: [] }>()
const mobile = useMediaQuery('(max-width: 640px)')
const bottomNavigation = ref<HTMLElement | null>(null)
const themeOverride = ref<boolean | null>(null)
const dark = computed(() => themeOverride.value ?? Boolean(props.state.darkMode))
</script>
<template>
  <div class="app-shell" :data-theme="dark ? 'dark' : 'light'">
    <header class="app-header"><div class="header-inner">
      <RouterLink class="brand" to="/" aria-label="Zirkulation – zur Übersicht"><img class="brand-logo" :src="dark ? darkLogo : lightLogo" alt="" width="38" height="38"><span class="brand-wordmark"><strong>Warmwasser</strong><span>Zirkulation</span></span></RouterLink>
      <Teleport :to="bottomNavigation || 'body'" :disabled="!mobile || !bottomNavigation"><AppNavigation /></Teleport>
      <div class="header-actions">
        <button class="icon-button refresh-button" :disabled="state.loading" :aria-label="state.loading ? 'Wird geladen …' : 'Aktualisieren'" title="Aktualisieren" @click="$emit('refresh')"><UiIcon name="refresh" /></button>
        <button class="icon-button theme-button" :aria-label="dark ? 'Helle Ansicht aktivieren' : 'Dunkle Ansicht aktivieren'" @click="themeOverride = !dark"><UiIcon :name="dark ? 'sun' : 'moon'" /></button>
      </div>
    </div></header>
    <div class="panel-viewport">
      <RouterView v-slot="{ Component }">
        <KeepAlive><component :is="Component" :state="state" :save-settings="saveSettings" :import-history="importHistory" @refresh="$emit('refresh')" /></KeepAlive>
      </RouterView>
      <footer class="page-footer"><span><i class="status-dot"></i><template v-if="state.error">Verbindung unterbrochen</template><template v-else-if="state.updatedAt">Aktualisiert {{ new Date(state.updatedAt).toLocaleTimeString('de-DE') }} · alle 15 Sekunden</template><template v-else>Verbindung mit Home Assistant</template></span><span>Warmwasser-Zirkulation</span></footer>
    </div>
    <div ref="bottomNavigation" class="bottom-navigation"></div>
  </div>
</template>
