<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import HistoryStatus from './HistoryStatus.vue'
import UiIcon from './UiIcon.vue'
import type { EntryStatus, ImportHistory } from '../types'
defineProps<{ entry: EntryStatus; importHistory?: ImportHistory }>()
const emit = defineEmits<{ close: [] }>()
const dialog = ref<HTMLDialogElement>()
const previous = document.activeElement as HTMLElement | null
onMounted(() => dialog.value?.showModal())
onBeforeUnmount(() => { dialog.value?.close(); previous?.focus() })
</script>
<template><dialog ref="dialog" class="history-dialog" aria-label="Historie und Lernplanung" @cancel.prevent="emit('close')" @click="event => { if (event.target === dialog) emit('close') }"><div class="dialog-head"><span class="eyebrow">DEINE LERNBASIS</span><button class="icon-button" aria-label="Dialog schließen" @click="emit('close')"><UiIcon name="close" /></button></div><HistoryStatus :entry="entry" :import-history="importHistory" /></dialog></template>
