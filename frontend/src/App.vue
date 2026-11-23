<script setup lang="ts">
import { RouterView } from 'vue-router'
import type { DashboardState, SaveSettings, ImportHistory } from './types'

defineProps<{ state: DashboardState; saveSettings?: SaveSettings; importHistory?: ImportHistory }>()
defineEmits<{ refresh: []; menu: [] }>()
</script>
<template>
  <RouterView v-slot="{ Component }">
    <component :is="Component" :state="state" :save-settings="saveSettings" :import-history="importHistory"
      @refresh="$emit('refresh')" @menu="$emit('menu')" />
  </RouterView>
</template>
