<script setup lang="ts">
import { computed, ref, nextTick } from 'vue'
import type { HeatCell, Heatmap } from '../types'
const props = defineProps<{ data: Heatmap }>()
const focused = ref({ row: 0, slot: 0 })
const selected = ref<{row:string;slot:number}|null>(null)
const selectedText=computed(()=>{
  if(!selected.value) return 'Eine Zelle auswählen, um Beobachtungstage und Zapfvorgänge zu sehen.'
  const row=props.data.rows.find(row=>row.key===selected.value!.row)
  return row ? describe(row.key,selected.value.slot,row.cells[selected.value.slot]) : 'Eine Zelle auswählen, um Beobachtungstage und Zapfvorgänge zu sehen.'
})
const labels: Record<string, string> = { mon: 'Montag', tue: 'Dienstag', wed: 'Mittwoch', thu: 'Donnerstag', fri: 'Freitag', sat: 'Samstag', sun_holiday: 'Sonn-/Feiertage' }
const time = (slot: number) => `${String(Math.floor(slot / 2)).padStart(2, '0')}:${slot % 2 ? '30' : '00'}`
const percent = new Intl.NumberFormat('de-DE', { style: 'percent', maximumFractionDigits: 0 })
function describe(row: string, slot: number, cell: HeatCell) {
  const prefix = `${labels[row]} · ${time(slot)}–${time(slot + 1)}`
  const observation=cell.ratio === null ? `${prefix}: Keine ausreichend beobachteten Tage. ${cell.partial_days} Tage mit Teilmessungen.` : `${prefix}: ${cell.event_days} von ${cell.observed_days} beobachteten Tagen mit Zapfvorgang (${percent.format(cell.ratio)}).${cell.sufficient ? '' : ' Vorläufig: noch zu wenige Beobachtungstage.'}`
  const allowed=(cell.allowed_windows ?? []).map(window=>`Freigabe ${window.start}–${window.end}`).join('; ')
  const planned=(cell.planned_runs ?? []).map(run=>`Geplantes Vorwärmen ${run.date} ${run.start}–${run.end}`).join('; ')
  return [observation,allowed,planned].filter(Boolean).join(' ')

}
function navigate(event: KeyboardEvent, row: number, slot: number) {
  let nextRow = row, nextSlot = slot
  if (event.key === 'ArrowRight') nextSlot = Math.min(47, slot + 1)
  else if (event.key === 'ArrowLeft') nextSlot = Math.max(0, slot - 1)
  else if (event.key === 'ArrowDown') nextRow = Math.min(props.data.rows.length - 1, row + 1)
  else if (event.key === 'ArrowUp') nextRow = Math.max(0, row - 1)
  else if (event.key === 'Home') { nextSlot = 0; if (event.ctrlKey) nextRow = 0 }
  else if (event.key === 'End') { nextSlot = 47; if (event.ctrlKey) nextRow = props.data.rows.length - 1 }
  else return
  event.preventDefault()
  focused.value = { row: nextRow, slot: nextSlot }
  const table = (event.currentTarget as Element).closest('table')
  void nextTick(() => table?.querySelector<HTMLButtonElement>(`button[data-row="${nextRow}"][data-slot="${nextSlot}"]`)?.focus())
}

</script>

<template>
  <section class="heatmap" aria-label="Zapfmuster nach Wochentag">
    <div class="heatmap-header"><h3>Wann wird Warmwasser gebraucht?</h3><span>Letzte {{ data.retention_days }} Tage</span></div>
    <p>Die Farbe zeigt den Anteil beobachteter Tage mit erkanntem Zapfvorgang je halber Stunde.</p>
    <p v-if="data.planning" class="planning-note">{{ data.planning.mode === 'monitoring' ? 'Planungsvorschau im Monitoring · automatische Schaltbefehle sind ausgeschaltet.' : 'Planung der nächsten ' + data.planning.horizon_days + ' Tage · Ausführung bei gültigen Live-Werten und freigegebener Steuerung.' }}<template v-if="data.planning.vacation_active"> Das Urlaubsprofil bestimmt die dargestellten Freigaben.</template></p>
    <p v-if="!data.observed_dates" class="empty-heatmap">Noch keine ausreichenden Beobachtungen vorhanden. Vorhandene HA-Historie wird zum Lernstart eingelesen. Vorhandene Lücken werden nicht als „kein Verbrauch“ gewertet.</p>
    <div class="heatmap-scroll">
      <table><caption class="visually-hidden">Zapfvorgänge nach Wochentag und halber Stunde</caption>
        <thead><tr><th scope="col">Tag</th><th v-for="slot in 48" :key="slot" scope="col"><span v-if="(slot - 1) % 4 === 0">{{ time(slot - 1) }}</span><span v-else class="visually-hidden">{{ time(slot - 1) }}</span></th></tr></thead>
        <tbody><tr v-for="(row, rowIndex) in data.rows" :key="row.key"><th scope="row">{{ labels[row.key] }}</th>
          <td v-for="(cell, slot) in row.cells" :key="slot"><button type="button" class="heat-cell" :data-row="rowIndex" :data-slot="slot"
            :tabindex="focused.row === rowIndex && focused.slot === slot ? 0 : -1"
            @focus="focused = { row: rowIndex, slot }" @keydown="navigate($event, rowIndex, slot)"
            :class="[cell.level === null ? 'no-data' : `level-${cell.level}`, { provisional: cell.ratio !== null && !cell.sufficient }]"
            :title="describe(row.key, slot, cell)" :aria-label="describe(row.key, slot, cell)"
            @click="selected = {row:row.key,slot}">
            <span v-for="(window,index) in cell.allowed_windows ?? []" :key="`allowed-${index}`" class="allowed-window" aria-hidden="true" :style="{left:window.offset+'%',width:window.width+'%'}"></span>
            <span v-for="(run,index) in cell.planned_runs ?? []" :key="`planned-${index}`" class="planned-run" aria-hidden="true" :style="{left:run.offset+'%',width:run.width+'%'}"></span>
            </button></td>
        </tr></tbody>
      </table>
    </div>
    <div class="legend"><span><i class="no-data"></i>Keine Messbasis</span><span><i class="level-0"></i>0 %</span><span><i class="level-2"></i>50 %</span><span><i class="level-4"></i>100 %</span><span><i class="level-2 provisional"></i>Vorläufig</span><template v-if="data.planning"><span><i class="legend-allowed"></i>Freigabezeit</span><span><i class="legend-planned"></i>Geplantes Vorwärmen</span></template></div>
    <p class="cell-detail" aria-live="polite">{{ selectedText }}</p>
    <p class="subtle">Ein Tag zählt pro Zelle ab {{ data.minimum_coverage_minutes }} Minuten gültiger Messungen bei ausgeschalteter Pumpe. Ab {{ data.minimum_observed_days }} Tagen gilt die Messbasis als ausreichend. Sonntage und konfigurierte Feiertage werden gemeinsam gezählt; jeder Kalendertag zählt einmal.</p>
    <p v-if="!data.calendar_enabled" class="calendar-hint">Feiertage sind noch nicht konfiguriert. Land und Bundesland/Region unter „Konfigurieren → Feiertagskalender“ auswählen.</p>
  </section>
</template>
