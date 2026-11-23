<script setup lang="ts">
import { computed, ref } from 'vue'
import type { EntryStatus, ImportHistory } from '../types'
const props=defineProps<{entry:EntryStatus; importHistory?:ImportHistory}>()
const pending=ref(false), error=ref(''), message=ref('')
const descriptions:Record<string,string>={idle:'Die Lernbasis wird aus Live-Messungen aufgebaut.',loading:'HA-Historie wird eingelesen',complete:'HA-Historie eingelesen',unavailable:'HA-Recorder ist nicht verfügbar. Die Integration lernt aus Live-Messungen.',error:'HA-Historie konnte nicht vollständig eingelesen werden. Live-Messungen werden weiter ausgewertet.'}
const description=computed(()=>descriptions[props.entry.history_import?.state ?? 'idle'])
const nextStart=computed(()=>props.entry.next_start ? new Date(props.entry.next_start).toLocaleString('de-DE') : null)
async function request() {
  if(pending.value || props.entry.history_import?.state==='loading') return
  pending.value=true; error.value=''; message.value=''
  try {
    if(!props.importHistory) throw new Error('unavailable')
    await props.importHistory(props.entry.entry_id)
    message.value='Historienimport angefordert.'
  } catch {error.value='Historienimport konnte nicht gestartet werden. Recorder, Verbindung und Administratorrechte prüfen.'}
  finally {pending.value=false}
}
</script>
<template>
  <section class="history-status" aria-label="Historie und Lernplanung">
    <h3>Historie und Lernplanung</h3>
    <p role="status">{{ description }}<template v-if="entry.history_import && ['loading','complete'].includes(entry.history_import.state)"> · {{ entry.history_import.days }}/28 Tage geprüft · {{ entry.history_import.events }} zusätzliche Lernereignisse</template></p>
    <p v-if="entry.history_import?.assumed_pump_off" class="calendar-hint">Bei fehlenden historischen Pumpenaufzeichnungen wurde „Pumpe aus“ angenommen. Die daraus gelernten Muster bitte anhand der Heatmap prüfen.</p>
    <p><strong>{{ nextStart ? 'Nächster Muster-Vorschlag: ' + nextStart : 'Noch kein freigegebener Musterstart mit ausreichender Messbasis.' }}</strong></p>
    <p class="hint">Zum Vorwärmen braucht ein Zeitabschnitt mindestens drei ausreichend beobachtete Tage und Entnahmen an mindestens 60 % dieser Tage. Es gelten Freigabezeiten, Laufzeit und Tageslimit sowie mindestens 20 Minuten Abstand zwischen Starts. Schaltbefehle sind nur bei „Steuerung aktiv“ freigegeben.</p>
    <button type="button" :disabled="pending || entry.history_import?.state==='loading'" @click="request">{{ pending || entry.history_import?.state==='loading' ? 'Historienimport läuft …' : 'HA-Historie erneut einlesen' }}</button>
    <p v-if="message" role="status">{{ message }}</p><p v-if="error" role="alert" class="error">{{ error }}</p>
  </section>
</template>
