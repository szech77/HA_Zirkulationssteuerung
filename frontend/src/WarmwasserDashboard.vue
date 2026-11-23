<script setup lang="ts">
import { computed } from 'vue'
import HistoryStatus from './HistoryStatus.vue'
import ControlSettings from './ControlSettings.vue'
import UsageHeatmap from './UsageHeatmap.vue'
import type { EntryStatus, Reading, SaveSettings, ImportHistory } from './types'
const props = defineProps<{ entry: EntryStatus; configurationOpen?: boolean; saveSettings?: SaveSettings; importHistory?: ImportHistory }>()
const reasons: Record<string, string> = { learned_schedule: 'Vorausschauendes Vorwärmen', cooldown: 'Wartezeit zwischen Starts', outside_schedule: 'Außerhalb der Freigabezeiten', waiting_for_demand: 'Steuerung aktiv · wartet auf Bedarf', calendar_unavailable: 'Feiertagskalender nicht verfügbar', control_failed: 'Steuerung gestört', monitoring: 'Monitoring', started: 'Pumpe gestartet', demand_event: 'Pumpe gestartet', pump_entity_missing: 'Pumpenschalter fehlt', pump_unreachable: 'Pumpenfehler · Steuerung pausiert', fresh_flow_value_missing: 'Frische Temperaturwerte fehlen', pump_state_unknown: 'Pumpenzustand unbekannt', daily_limit_reached: 'Startlimit erreicht', no_draw_event: 'Kein Zapfvorgang', pump_already_running: 'Pumpe läuft' }
const status = computed(() => reasons[props.entry.reason] || 'Status unbekannt')
const number = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 1 })
const reading = (value: Reading | null) => value?.value == null ? '—' : `${number.format(value.value)} ${value.unit ?? ''}`
const pumpState = computed(() => ({ on: 'Läuft', off: 'Aus', unknown: 'Unbekannt' })[props.entry.pump.state] || 'Unbekannt')
</script>
<template>
  <article class="system-card">
    <header class="system-heading"><div><p class="eyebrow">WARMWASSER ZU HAUSE</p><h2>{{ entry.title }}</h2></div><span class="status" :class="`status--${entry.status_level}`">{{ status }}</span></header>
    <div class="metrics temperatures">
      <section><span>Vorlauf</span><strong>{{ reading(entry.flow) }}</strong><small>{{ entry.flow?.name || 'Nicht konfiguriert' }}<template v-if="entry.flow?.stale"> · veraltet</template></small></section>
      <section><span>Warmwasserpuffer</span><strong>{{ reading(entry.buffer) }}</strong><small>{{ entry.buffer?.name || 'Nicht konfiguriert' }}<template v-if="entry.buffer?.stale"> · veraltet</template></small></section>
      <section><span>Zirkulationspumpe</span><strong>{{ pumpState }}</strong><small>{{ entry.pump.entity_id }}</small></section>
    </div>
    <div class="metrics learning">
      <section><span>Erkennungsschwelle</span><strong>{{ entry.threshold.toFixed(3).replace('.', ',') }} <small>°C/min</small></strong><small>{{ entry.learning_ready ? 'Lernbasis ausreichend' : 'Messdaten werden gesammelt' }}</small></section>
      <section><span>Erkannte Ereignisse · Lernbasis</span><strong>{{ entry.sample_size }}</strong><small>Zur Anpassung der Erkennungsschwelle</small></section>
      <section><span>Startkontingent</span><strong>{{ entry.remaining_starts }} <small>/ {{ entry.max_starts }}</small></strong><small>Laufzeit je Start: {{ entry.runtime_seconds }} Sekunden</small></section>
    </div>
    <p class="monitoring-note">{{ entry.enabled ? 'Steuerfreigabe ist gesetzt.' : 'Monitoring: Die Messwertbeobachtung schaltet die Pumpe nicht.' }} Bedarfsautomatik: {{ entry.demand_automation ? 'freigegeben' : 'ausgeschaltet' }}.</p>
    <p class="calendar-summary">Feiertagskalender: {{ entry.country ? [entry.country, entry.subdivision].filter(Boolean).join(' · ') : 'Nicht konfiguriert' }}</p>
    <p v-if="entry.settings.vacation_active" class="vacation-status">Urlaubsprofil aktiv · ersetzt den Wochen- und Feiertagsplan</p>
    <ControlSettings v-if="configurationOpen" :entry="entry" :save-settings="saveSettings" />
    <HistoryStatus :entry="entry" :import-history="importHistory" />
    <UsageHeatmap v-if="entry.heatmap" :data="entry.heatmap" />
    <p class="hint">Automatische Starts müssen ausdrücklich freigegeben werden. Fehlende oder veraltete Messwerte sind keine gültige Steuergrundlage.</p>
  </article>
</template>
