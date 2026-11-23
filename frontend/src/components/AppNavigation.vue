<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import UiIcon from './UiIcon.vue'
const route = useRoute()
const links = [
  { to: '/', name: 'dashboard', label: 'Übersicht', icon: 'home' },
  { to: '/settings', name: 'settings', label: 'Einstellungen', icon: 'settings' },
]
</script>
<template>
  <nav class="app-navigation" aria-label="Hauptnavigation">
    <RouterLink v-for="link in links" :key="link.name" :to="link.to" :class="{active: route.name === link.name}">
      <UiIcon :name="link.icon" /><span>{{ link.label }}</span>
    </RouterLink>
  </nav>
</template>
