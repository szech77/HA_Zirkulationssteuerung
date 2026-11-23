<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import UiIcon from './UiIcon.vue'
import UsageHeatmap from './UsageHeatmap.vue'
import HistoryDialog from './HistoryDialog.vue'
import type { EntryStatus, ImportHistory, Reading } from '../types'
const props = defineProps<{ entry: EntryStatus; importHistory?: ImportHistory }>()
const showHistory = ref(false)
const reasons: Record<string, string> = { learned_schedule:'Vorausschauendes Vorwärmen',cooldown:'Wartezeit zwischen Starts',outside_schedule:'Außerhalb der Freigabezeiten',waiting_for_demand:'Steuerung aktiv · wartet auf Bedarf',calendar_unavailable:'Feiertagskalender nicht verfügbar',control_failed:'Steuerung gestört',monitoring:'Monitoring',started:'Pumpe gestartet',demand_event:'Pumpe gestartet',pump_entity_missing:'Pumpenschalter fehlt',pump_unreachable:'Pumpenfehler · Steuerung pausiert',fresh_flow_value_missing:'Frische Temperaturwerte fehlen',pump_state_unknown:'Pumpenzustand unbekannt',daily_limit_reached:'Startlimit erreicht',no_draw_event:'Kein Zapfvorgang',pump_already_running:'Pumpe läuft' }
const status = computed(() => reasons[props.entry.reason] || 'Status unbekannt')
const number = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 2 })
const reading = (value: Reading | null) => value?.value == null || value.stale ? '—' : number.format(value.value)
const pumpState = computed(() => ({on:'Läuft',off:'Aus',unknown:'Unbekannt'})[props.entry.pump.state] || 'Unbekannt')
const next = computed(() => props.entry.next_start ? new Date(props.entry.next_start).toLocaleString('de-DE', {weekday:'short',hour:'2-digit',minute:'2-digit'}) : 'Noch kein Vorschlag')
const finish = computed(() => props.entry.pump_until ? new Date(props.entry.pump_until).toLocaleString('de-DE', {weekday:'short',hour:'2-digit',minute:'2-digit'}) : null)
const starts = computed(() => props.entry.heatmap?.planning?.starts?.slice(0, 3) ?? [])
const formatStart = (at: string) => new Date(at).toLocaleString('de-DE', {weekday:'short',hour:'2-digit',minute:'2-digit'})
</script>
<template>
  <article class="system-card">
    <p class="system-label">{{ entry.title }}</p>
    <section class="surface status-banner" :class="{ warning: entry.status_level === 'warning', 'error-state': entry.status_level === 'error', monitor: !entry.enabled }">
      <div class="status-illustration"><UiIcon :name="entry.status_level !== 'normal' ? 'warning' : entry.enabled ? 'pump' : 'eye'" /></div>
      <div class="status-copy"><span class="status-label"><i class="status-dot"></i>{{ status }}</span><h3>Zirkulationspumpe · {{ pumpState }}</h3><p>{{ entry.enabled ? 'Steuerfreigabe ist gesetzt.' : 'Monitoring: Die Messwertbeobachtung schaltet die Pumpe nicht.' }} Bedarfsautomatik: {{ entry.demand_automation ? 'freigegeben' : 'ausgeschaltet' }}.</p></div>
      <div class="status-action"><small>{{ finish ? 'Bestätigte Endzeit des laufenden Laufs' : entry.enabled ? 'Nächster Muster-Vorschlag' : 'Planungsvorschau · keine Ausführung' }}</small><span class="next-time">{{ finish ?? next }}</span></div>
    </section>
    <p v-if="entry.settings.vacation_active" class="info-note vacation-status"><UiIcon name="sun" />Urlaubsprofil aktiv · ersetzt den Wochen- und Feiertagsplan.</p>
    <div class="metrics">
      <section class="metric surface"><div class="metric-label">Vorlauf<UiIcon name="thermo" /></div><strong>{{ reading(entry.flow) }}<small v-if="entry.flow?.value != null && !entry.flow.stale">{{ entry.flow.unit }}</small></strong><span class="metric-foot">{{ entry.flow?.stale ? 'Messwert veraltet' : entry.flow?.name || 'Nicht konfiguriert' }}</span></section>
      <section class="metric surface"><div class="metric-label">Warmwasserpuffer<UiIcon name="drop" /></div><strong>{{ reading(entry.buffer) }}<small v-if="entry.buffer?.value != null && !entry.buffer.stale">{{ entry.buffer.unit }}</small></strong><span class="metric-foot">{{ entry.buffer?.stale ? 'Messwert veraltet' : entry.buffer?.name || 'Nicht konfiguriert' }}</span></section>
      <section class="metric surface"><div class="metric-label">Startkontingent<UiIcon name="pump" /></div><strong>{{ entry.remaining_starts }}<small>/ {{ entry.max_starts }}</small></strong><span class="metric-foot">Starts noch verfügbar</span></section>
      <section class="metric surface"><div class="metric-label">Laufzeit pro Start<UiIcon name="clock" /></div><strong>{{ number.format(entry.runtime_seconds / 60) }}<small>min</small></strong><span class="metric-foot">Innerhalb deiner Freigaben</span></section>
    </div>
    <UsageHeatmap v-if="entry.heatmap" :data="entry.heatmap" />
    <div class="bottom-grid">
      <section class="surface plan-card"><div class="card-head"><h3>{{ entry.enabled ? 'Als Nächstes geplant' : 'Deine Planungsvorschau' }}</h3><RouterLink class="text-button" to="/settings">Zeitplan bearbeiten <UiIcon name="arrow" /></RouterLink></div><p class="subtle">{{ entry.enabled ? 'Ausführung bei gültigen Live-Werten und freigegebener Steuerung.' : 'Auch im Monitoring sichtbar · ohne automatische Starts.' }}</p><div v-if="starts.length" class="timeline"><div v-for="(start,index) in starts" :key="start.at" class="timeline-item" :class="{next:index===0}"><i class="timeline-point"></i><strong>{{ formatStart(start.at) }}</strong><span>Vorwärmen</span></div></div><p v-else class="empty-plan">Noch kein freigegebener Musterstart mit ausreichender Messbasis.</p></section>
      <section class="surface learn-card"><div class="card-head"><h3>Ein System, das dazulernt.</h3><button class="text-button" @click="showHistory = true">Lernbasis ansehen <UiIcon name="arrow" /></button></div><div class="learn-row"><strong>{{ entry.heatmap?.observed_dates ?? 0 }} <small>Tage beobachtet</small></strong><span class="small-tag">{{ entry.learning_ready ? 'Lernbasis ausreichend' : 'Messdaten werden gesammelt' }}</span></div><p>{{ entry.sample_size }} erkannte Ereignisse · Erkennungsschwelle {{ number.format(entry.threshold) }} °C/min</p><p class="calendar-summary">Feiertagskalender: {{ entry.country ? [entry.country, entry.subdivision].filter(Boolean).join(' · ') : 'Nicht konfiguriert' }}</p></section>
    </div>
    <HistoryDialog v-if="showHistory" :entry="entry" :import-history="importHistory" @close="showHistory = false" />
  </article>
</template>
