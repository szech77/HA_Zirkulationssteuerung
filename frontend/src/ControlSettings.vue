<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { ControlSettings, EntryStatus, SaveSettings, TimeWindow } from './types'
const props = defineProps<{ entry: EntryStatus; saveSettings?: SaveSettings }>()
const clone = (settings: ControlSettings): ControlSettings => JSON.parse(JSON.stringify(settings))
const draft = ref(clone(props.entry.settings))
const revision = ref(props.entry.settings_revision)
const dirty = ref(false)
const saving = ref(false)
const message = ref('')
const error = ref('')
const conflict = computed(() => revision.value !== props.entry.settings_revision)
const days = [ ['mon','Montag'], ['tue','Dienstag'], ['wed','Mittwoch'], ['thu','Donnerstag'], ['fri','Freitag'], ['sat','Samstag'], ['sun_holiday','Sonn-/Feiertage'] ]
watch(() => props.entry.settings_revision, () => { if (!dirty.value && !saving.value) reset() })
function reset() {
  draft.value = clone(props.entry.settings); revision.value = props.entry.settings_revision
  dirty.value = false; message.value = ''; error.value = ''
}
function edited() { dirty.value = true; message.value = ''; error.value = '' }
function add(windows: TimeWindow[]) { windows.push({ start:'06:00', end:'08:00' }); edited() }
function remove(windows: TimeWindow[], index: number) { windows.splice(index, 1); edited() }
async function save() {
  if (saving.value || conflict.value) return
  saving.value = true; error.value = ''; message.value = ''
  try {
    if (!props.saveSettings) throw new Error('unavailable')
    await props.saveSettings(props.entry.entry_id, clone(draft.value), revision.value)
    dirty.value = false; reset(); message.value = 'Konfiguration gespeichert.'
  } catch (cause) {
    const code = (cause as { code?: string })?.code
    error.value = code === 'invalid_settings' ? 'Zeitfenster prüfen: gültige Uhrzeiten, von vor bis und keine Überschneidungen. Nachtfenster auf zwei Tage aufteilen.' : code === 'settings_conflict' ? 'Die Konfiguration wurde inzwischen geändert. Gespeicherten Stand neu laden.' : 'Speichern oder Bestätigung fehlgeschlagen. Verbindung und Administratorrechte prüfen. Die Eingaben bleiben erhalten.'
  } finally { saving.value = false }
}
</script>
<template>
  <section class="control-settings" aria-label="Zirkulation konfigurieren">
    <h3>Konfiguration · Freigabezeiten</h3>
    <p>Freigabezeiten erlauben bedarfsabhängige und gelernte vorausschauende Starts. Die Pumpe läuft darin nicht dauerhaft. Es gilt die Home-Assistant-Zeitzone.</p>
    <form @submit.prevent="save" @input="edited" @change="edited">
      <fieldset :disabled="saving">
        <legend>Betriebsart</legend>
        <label class="mode-field">Betriebsart wählen <select v-model="draft.mode" aria-label="Betriebsart"><option value="monitoring">Nur Monitoring</option><option value="active">Steuerung aktiv</option></select></label>
        <p>Monitoring sammelt Messdaten ohne automatische Starts. Beim Wechsel ins Monitoring wird ein von dieser Integration gestarteter Lauf beendet. Aktive Steuerung benötigt frische Messwerte, eine bekannte Pumpe und ein freigegebenes Zeitfenster.</p>
      </fieldset>
      <fieldset :disabled="saving">
        <legend>Wochenplan</legend>
        <p>Ohne Zeitfenster ist der Tag gesperrt. Sonn- und Feiertage verwenden dieselben Zeitfenster. Für gesetzliche Feiertage Land und Region unter „Geräte &amp; Sensoren“ festlegen.</p>
        <div v-for="[key, label] in days" :key="key" class="schedule-day" :data-day="key">
          <h4>{{ label }}</h4>
          <p v-if="!draft.schedule[key].length" class="blocked-day">Gesperrt · keine Freigabe</p>
          <ul class="time-windows"><li v-for="(window, index) in draft.schedule[key]" :key="index">
            <label>Von <input v-model="window.start" type="time" required :aria-label="`${label} Abschnitt ${index+1} von`"></label>
            <label>Bis <input v-model="window.end" type="text" inputmode="numeric" pattern="([01][0-9]|2[0-3]):[0-5][0-9]|24:00" placeholder="HH:MM" required :aria-label="`${label} Abschnitt ${index+1} bis`"></label>
            <button type="button" :aria-label="`${label} Abschnitt ${index+1} entfernen`" @click="remove(draft.schedule[key], index)">Entfernen</button>
          </li></ul>
          <button type="button" :disabled="draft.schedule[key].length >= 12" @click="add(draft.schedule[key])">Zeitraum hinzufügen<span class="visually-hidden"> · {{ label }}</span></button>
        </div>
      </fieldset>
      <fieldset :disabled="saving">
        <legend>Urlaubsprofil</legend>
        <label><input v-model="draft.vacation_active" type="checkbox" aria-label="Urlaubsprofil aktivieren"> Urlaubsprofil aktivieren</label>
        <p>Ersetzt während der manuellen Aktivierung den gesamten Wochen- und Feiertagsplan. Die folgenden Zeitfenster gelten dann an jedem Tag. Ohne Abschnitte bleibt die Zirkulation im Urlaub gesperrt. Nach dem Urlaub hier wieder deaktivieren.</p>
        <div class="schedule-day" data-day="vacation">
          <h4>Alle Urlaubstage</h4>
          <p v-if="!draft.vacation_windows.length" class="blocked-day">Gesperrt · keine Freigabe</p>
          <ul class="time-windows"><li v-for="(window, index) in draft.vacation_windows" :key="index">
            <label>Von <input v-model="window.start" type="time" required :aria-label="`Urlaub Abschnitt ${index+1} von`"></label>
            <label>Bis <input v-model="window.end" type="text" inputmode="numeric" pattern="([01][0-9]|2[0-3]):[0-5][0-9]|24:00" placeholder="HH:MM" required :aria-label="`Urlaub Abschnitt ${index+1} bis`"></label>
            <button type="button" :aria-label="`Urlaub Abschnitt ${index+1} entfernen`" @click="remove(draft.vacation_windows, index)">Entfernen</button>
          </li></ul>
          <button type="button" :disabled="draft.vacation_windows.length >= 12" @click="add(draft.vacation_windows)">Zeitraum hinzufügen<span class="visually-hidden"> · Urlaub</span></button>
        </div>
      </fieldset>
      <p v-if="entry.reason === 'pump_unreachable'" class="error">Pumpenfehler: Gerät und Erreichbarkeit prüfen. Erneutes Speichern quittiert den Fehler und gibt die gewählte Betriebsart wieder frei.</p>
      <p class="hint">Maximal 12 Abschnitte pro Tag; Ende bis 24:00. Die gesamte Pumpenlaufzeit muss in einen Abschnitt passen. Änderungen wirken erst nach dem Speichern.</p>
      <p v-if="conflict" class="error" role="alert">Die Konfiguration wurde inzwischen geändert. Deine Eingaben wurden erhalten. Vor weiteren Änderungen den gespeicherten Stand neu laden.</p>
      <p v-if="error" class="error" role="alert">{{ error }}</p>
      <p v-if="message" role="status">{{ message }}</p>
      <div class="settings-actions"><button type="submit" :disabled="saving || conflict || (!dirty && entry.reason !== 'pump_unreachable')">{{ saving ? 'Wird gespeichert …' : 'Konfiguration speichern' }}</button><button type="button" :disabled="saving" @click="reset">Gespeicherten Stand neu laden</button><span v-if="dirty">Ungespeicherte Änderungen</span></div>
    </form>
  </section>
</template>
