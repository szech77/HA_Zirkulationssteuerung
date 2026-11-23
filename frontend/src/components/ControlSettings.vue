<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import UiIcon from './UiIcon.vue'
import type { ControlSettings, EntryStatus, SaveSettings, TimeWindow } from '../types'
const props = defineProps<{ entry: EntryStatus; saveSettings?: SaveSettings; disabled?: boolean }>()
const clone = (value: ControlSettings): ControlSettings => JSON.parse(JSON.stringify(value))
const draft = ref(clone(props.entry.settings))
const runtimeMinutes = ref(String(props.entry.runtime_seconds / 60))
const maxStarts = ref<number | string>(props.entry.max_starts)
const revision = ref(props.entry.settings_revision)
const dirty = ref(false), saving = ref(false), message = ref(''), error = ref('')
const section = ref('schedule'), expanded = ref('mon')
const conflict = computed(() => revision.value !== props.entry.settings_revision)
const maxMinutes = computed(() => (props.entry.runtime_max_seconds ?? 86400) / 60)
const days = [['mon','Montag'],['tue','Dienstag'],['wed','Mittwoch'],['thu','Donnerstag'],['fri','Freitag'],['sat','Samstag'],['sun_holiday','Sonn-/Feiertage']]
watch(() => props.entry.settings_revision, () => { if (!dirty.value && !saving.value) reset() })
function reset() {
  draft.value = clone(props.entry.settings); revision.value = props.entry.settings_revision
  runtimeMinutes.value = String(props.entry.runtime_seconds / 60); maxStarts.value = props.entry.max_starts
  dirty.value = false; message.value = ''; error.value = ''
}
function edited() { dirty.value = true; message.value = ''; error.value = '' }
function add(windows: TimeWindow[]) { if (windows.length < 12) { windows.push({start:'06:00',end:'08:00'}); edited() } }
function remove(windows: TimeWindow[], index: number) { windows.splice(index, 1); edited() }
function copyWeekdays() { for (const key of ['tue','wed','thu','fri']) draft.value.schedule[key] = draft.value.schedule.mon.map(window => ({...window})); edited() }
async function save() {
  if (saving.value || conflict.value || props.disabled) return
  const minutes = Number(runtimeMinutes.value), limit = Number(maxStarts.value)
  if (!Number.isFinite(minutes) || minutes < 1 / 60 || minutes > maxMinutes.value || !Number.isInteger(limit) || limit < 1 || limit > (props.entry.max_daily_starts ?? 100)) {
    section.value = 'operation'; error.value = 'Laufzeit und Tageslimit prüfen. Die Laufzeit muss mindestens eine Sekunde betragen und innerhalb der angegebenen Grenzen liegen.'; return
  }
  saving.value = true; error.value = ''; message.value = ''
  try {
    if (!props.saveSettings) throw new Error('unavailable')
    await props.saveSettings(props.entry.entry_id, {...clone(draft.value),runtime_seconds:Math.round(minutes * 60),max_starts:limit}, revision.value)
    dirty.value = false; reset(); message.value = 'Konfiguration gespeichert.'
  } catch (cause) {
    const code = (cause as {code?: string})?.code
    error.value = code === 'invalid_settings' ? 'Zeitfenster prüfen: gültige Uhrzeiten, von vor bis und keine Überschneidungen. Auch Laufzeit und Tageslimit müssen innerhalb ihrer Grenzen liegen.' : code === 'settings_conflict' ? 'Die Konfiguration wurde inzwischen geändert. Gespeicherten Stand neu laden.' : 'Speichern oder Bestätigung fehlgeschlagen. Verbindung und Administratorrechte prüfen. Die Eingaben bleiben erhalten.'
  } finally { saving.value = false }
}
</script>
<template>
  <section class="control-settings settings-layout" aria-label="Zirkulation konfigurieren">
    <aside class="settings-nav" aria-label="Einstellungsbereiche"><button v-for="item in [{key:'schedule',label:'Freigabezeiten',icon:'calendar'},{key:'operation',label:'Betrieb & Urlaub',icon:'sliders'},{key:'devices',label:'Sensoren & Region',icon:'link'}]" :key="item.key" type="button" :class="{active:section===item.key}" :aria-current="section===item.key?'page':undefined" @click="section=item.key"><UiIcon :name="item.icon" />{{ item.label }}</button><p class="nav-description">Freigaben erlauben gezielte Starts. Die Pumpe läuft innerhalb dieser Zeiten nicht dauerhaft.</p></aside>
    <form class="settings-content" novalidate @submit.prevent="save" @input="edited" @change="edited">
      <fieldset v-show="section==='schedule'" class="settings-card surface" :disabled="saving || disabled">
        <legend class="visually-hidden">Wochenplan</legend><div class="section-heading"><UiIcon name="calendar" /><h3>Deine Freigabezeiten</h3></div><p class="settings-description">Lege fest, wann automatisch zirkuliert werden darf. Mehrere Zeiträume pro Tag sind möglich – etwa morgens und abends. Es gilt die Home-Assistant-Zeitzone.</p>
        <div class="schedule-actions"><span>WOCHENPLAN</span><button type="button" class="text-button" @click="copyWeekdays">Montag auf Di–Fr übertragen <UiIcon name="arrow" /></button></div>
        <section v-for="[key,label] in days" :key="key" class="schedule-day day" :class="{open:expanded===key}" :data-day="key">
          <button class="day-head" type="button" :aria-expanded="expanded===key" @click="expanded=expanded===key?'':key"><span class="day-name">{{ label }}</span><span class="day-chips"><span v-for="(window,index) in draft.schedule[key]" :key="index" class="time-chip">{{ window.start }} – {{ window.end }}</span><span v-if="!draft.schedule[key].length" class="time-chip blocked-day">Keine Freigabe</span></span><UiIcon name="chevron" /></button>
          <div v-if="expanded===key" class="day-editor"><ul class="time-windows"><li v-for="(window,index) in draft.schedule[key]" :key="index" class="time-line"><label>Von <input v-model="window.start" type="time" required :aria-label="`${label} Abschnitt ${index+1} von`"></label><span class="dash">—</span><label>Bis <input v-model="window.end" type="text" inputmode="numeric" pattern="([01][0-9]|2[0-3]):[0-5][0-9]|24:00" placeholder="HH:MM" required :aria-label="`${label} Abschnitt ${index+1} bis`"></label><button class="icon-button" type="button" :aria-label="`${label} Abschnitt ${index+1} entfernen`" @click="remove(draft.schedule[key],index)"><UiIcon name="trash" /></button></li></ul><button class="add-window" type="button" :disabled="draft.schedule[key].length>=12" :aria-label="`${label} Zeitraum hinzufügen`" @click="add(draft.schedule[key])"><UiIcon name="plus" />Zeitraum hinzufügen</button></div>
        </section>
        <p class="settings-info">Sonn- und Feiertage verwenden dieselben Zeitfenster. Maximal zwölf Abschnitte pro Tag, Ende bis 24:00. Ein kompletter Lauf muss in einen Abschnitt passen.</p>
      </fieldset>
      <div v-show="section==='operation'">
        <fieldset class="surface settings-card" :disabled="saving || disabled"><legend class="visually-hidden">Betriebsart</legend><div class="section-heading"><UiIcon name="sliders" /><h3>Betriebsart</h3></div><p class="settings-description">Du entscheidest, ob dein System beobachtet oder die Zirkulation übernimmt.</p><div class="mode-grid"><button v-for="item in [{key:'monitoring',label:'Nur Monitoring',icon:'eye',description:'Beobachten und lernen. Die Planung bleibt sichtbar, automatische Starts sind aus.'},{key:'active',label:'Automatische Steuerung',icon:'play',description:'Bei Bedarf und vor gelernten Entnahmezeiten vorwärmen – innerhalb deiner Freigaben.'}]" :key="item.key" type="button" class="mode-option" :class="{selected:draft.mode===item.key}" :aria-pressed="draft.mode===item.key" @click="draft.mode=item.key as ControlSettings['mode'];edited()"><span class="radio-circle"></span><UiIcon :name="item.icon" /><strong>{{ item.label }}</strong><p>{{ item.description }}</p></button></div><p class="settings-info">Beim Wechsel ins Monitoring wird ein von dieser Integration gestarteter Lauf beendet.</p></fieldset>
        <fieldset class="surface settings-card" :disabled="saving || disabled"><legend class="visually-hidden">Urlaubsprofil</legend><div class="section-heading"><UiIcon name="sun" /><h3>Urlaubsprofil</h3></div><p class="settings-description">Ein eigener Tagesrhythmus für die Zeit zu Hause – oder keine Freigabe, wenn du unterwegs bist.</p><div class="setting-row"><div><strong>Urlaubsprofil verwenden</strong><p>Ersetzt den gesamten Wochen- und Feiertagsplan, bis du es wieder ausschaltest.</p></div><button class="switch" type="button" role="switch" :aria-checked="draft.vacation_active" aria-label="Urlaubsprofil aktivieren" @click="draft.vacation_active=!draft.vacation_active;edited()"></button></div><div v-show="draft.vacation_active" class="vacation-fields" data-day="vacation"><p class="subtle">Diese Freigaben gelten an jedem Urlaubstag.</p><ul class="time-windows"><li v-for="(window,index) in draft.vacation_windows" :key="index" class="time-line"><label>Von <input v-model="window.start" type="time" :aria-label="`Urlaub Abschnitt ${index+1} von`"></label><span class="dash">—</span><label>Bis <input v-model="window.end" type="text" inputmode="numeric" placeholder="HH:MM" :aria-label="`Urlaub Abschnitt ${index+1} bis`"></label><button class="icon-button" type="button" :aria-label="`Urlaub Abschnitt ${index+1} entfernen`" @click="remove(draft.vacation_windows,index)"><UiIcon name="trash" /></button></li></ul><button class="add-window" type="button" :disabled="draft.vacation_windows.length>=12" aria-label="Urlaub Zeitraum hinzufügen" @click="add(draft.vacation_windows)"><UiIcon name="plus" />Zeitraum hinzufügen</button><p v-if="!draft.vacation_windows.length" class="subtle">Keine Zeiträume: automatische Starts sind im Urlaub gesperrt.</p></div></fieldset>
        <fieldset class="surface settings-card" :disabled="saving || disabled"><legend class="visually-hidden">Grenzen für die Automatik</legend><div class="section-heading"><UiIcon name="clock" /><h3>Grenzen für die Automatik</h3></div><p class="settings-description">Wähle deine Pumpenlaufzeit frei in Minuten. Dezimalwerte sind möglich; gespeichert wird sekundengenau.</p><div class="field-grid"><label class="field"><span>Laufzeit pro Start · Minuten</span><input v-model="runtimeMinutes" type="number" :min="1/60" :max="maxMinutes" step="any" inputmode="decimal" aria-label="Pumpenlaufzeit in Minuten"><small>1 Sekunde bis {{ maxMinutes.toLocaleString('de-DE') }} Minuten</small></label><label class="field"><span>Maximale Starts pro Tag</span><input v-model="maxStarts" type="number" min="1" :max="entry.max_daily_starts ?? 100" step="1" aria-label="Maximale Starts pro Tag"></label></div><p class="settings-info">Änderungen gelten für künftige Starts. Ein laufender Pumpenlauf behält seine bestätigte Endzeit.</p></fieldset>
      </div>
      <div v-show="section==='devices'">
        <section class="surface settings-card"><div class="section-heading"><UiIcon name="link" /><h3>Deine Geräte</h3></div><p class="settings-description">Sensoren und Pumpenschalter werden mit Home Assistants durchsuchbarer Geräteauswahl eingerichtet.</p><dl class="device-list"><div><dt>Vorlauftemperatur</dt><dd>{{ entry.flow?.name || 'Nicht konfiguriert' }}</dd></div><div><dt>Warmwasserpuffer</dt><dd>{{ entry.buffer?.name || 'Nicht konfiguriert' }}</dd></div><div><dt>Zirkulationspumpe</dt><dd>{{ entry.pump.entity_id }}</dd></div></dl><a class="secondary-button native-config-link" href="/config/integrations/integration/warmwasser_zirkulation" title="Das Zahnrad am gewünschten Eintrag öffnet die native Konfiguration">Geräte in Home Assistant auswählen <UiIcon name="arrow" /></a><p class="settings-info">Über das Zahnrad am Eintrag „{{ entry.title }}“ die Konfiguration öffnen.</p></section>
        <section class="surface settings-card"><div class="section-heading"><UiIcon name="calendar" /><h3>Feiertage &amp; Region</h3></div><p class="settings-description">An gesetzlichen Feiertagen gilt derselbe Plan wie an Sonntagen.</p><dl class="device-list"><div><dt>Land / Region</dt><dd>{{ entry.country ? [entry.country,entry.subdivision].filter(Boolean).join(' · ') : 'Nicht konfiguriert' }}</dd></div></dl><p class="settings-info">Land und Bundesland/Region sind in derselben HA-Konfiguration änderbar.</p></section>
      </div>
      <p v-if="entry.reason==='pump_unreachable'" class="error">Pumpenfehler: Gerät und Erreichbarkeit prüfen. Erneutes Speichern quittiert den Fehler und gibt die gewählte Betriebsart wieder frei.</p>
      <p v-if="conflict" class="error" role="alert">Die Konfiguration wurde inzwischen geändert. Deine Eingaben wurden erhalten. Vor weiteren Änderungen den gespeicherten Stand neu laden.</p><p v-if="error" class="error" role="alert">{{ error }}</p><p v-if="message" class="success-message" role="status">{{ message }}</p>
      <div class="save-bar"><span class="save-caption" :class="{dirty}"><i class="status-dot"></i>{{ dirty?'Ungespeicherte Änderungen':'Alle Änderungen gespeichert' }}</span><div class="button-group"><button class="secondary-button" type="button" :disabled="saving" @click="reset">Gespeicherten Stand neu laden</button><button class="primary-button" type="submit" :disabled="saving || disabled || conflict || (!dirty && entry.reason!=='pump_unreachable')"><UiIcon name="check" />{{ saving?'Wird gespeichert …':'Änderungen speichern' }}</button></div></div>
      <p class="settings-info">Automatische Starts benötigen frische Messwerte, eine bestätigte Pumpe und ausreichend Freigabezeit.</p>
    </form>
  </section>
</template>
