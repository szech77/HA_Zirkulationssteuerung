<script setup lang="ts">
import { computed } from 'vue'

interface Props { reason: string; threshold: number; sampleSize: number; remainingStarts: number; nextStart?: string }
const props = withDefaults(defineProps<Props>(), { nextStart: '—' })
const status = computed(() => props.reason === 'monitoring' ? 'Monitoring' : props.reason === 'started' ? 'Pumpe gestartet' : props.reason)
</script>

<template>
  <section class="warmwasser-card" aria-label="Warmwasser-Zirkulation">
    <header><h2>Warmwasser-Zirkulation</h2><span class="status">{{ status }}</span></header>
    <div class="metrics">
      <div><small>Gelernte Schwelle</small><strong>{{ threshold.toFixed(3) }} °C/min</strong></div>
      <div><small>Stichprobe</small><strong>{{ sampleSize }}</strong></div>
      <div><small>Restliche Starts</small><strong>{{ remainingStarts }}</strong></div>
      <div><small>Nächster Start</small><strong>{{ nextStart }}</strong></div>
    </div>
    <p class="hint">Automatische Starts werden bei fehlenden frischen Messwerten oder unerreichbarer Pumpe sicher pausiert.</p>
  </section>
</template>

<style scoped>
.warmwasser-card{font-family:system-ui,sans-serif;background:#102a43;color:#f0f4f8;border-radius:16px;padding:20px}.warmwasser-card header{display:flex;justify-content:space-between;align-items:center}.status{color:#9ae6b4}.metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:16px}.metrics div{background:#243b53;border-radius:10px;padding:12px}.metrics small{display:block;color:#bcccdc}.metrics strong{display:block;margin-top:6px}.hint{color:#d9e2ec;font-size:.9rem}@media(max-width:700px){.metrics{grid-template-columns:repeat(2,1fr)}}
</style>
