<script setup lang="ts">
defineProps<{ name: string }>()
const paths: Record<string, string> = {
  menu: 'M4 6h16M4 12h16M4 18h16',
  sun: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5',
  moon: 'M20.5 13a8.5 8.5 0 1 1-9.5-9.5A7 7 0 0 0 20.5 13Z',
  arrow: 'M5 12h14m-5-5 5 5-5 5', chevron: 'm6 9 6 6 6-6',
  drop: 'M12 3C9 8 5 11 5 15a7 7 0 0 0 14 0c0-4-4-7-7-12ZM8 15a4 4 0 0 0 4 4',
  thermo: 'M10 14.5V5a2 2 0 0 1 4 0v9.5a4 4 0 1 1-4 0ZM12 10v7',
  pump: 'M8 3h8m-4 0v4m-4 14h8m-4 0v-4M17 12a5 5 0 1 0-10 0 5 5 0 0 0 10 0M3 9v6m18-6v6m-18-3h4m10 0h4m-9-3v6m-3-3h6',
  clock: 'M20.5 12a8.5 8.5 0 1 0-17 0 8.5 8.5 0 0 0 17 0M12 7v5l3 2',
  calendar: 'M5 5h14q2 0 2 2v12q0 2-2 2H5q-2 0-2-2V7q0-2 2-2ZM7 3v4m10-4v4M3 10h18m-13 4h2m4 0h2m-8 3h2',
  sliders: 'M4 7h4m4 0h8M4 17h9m4 0h3M12 7a2 2 0 1 0-4 0 2 2 0 0 0 4 0M17 17a2 2 0 1 0-4 0 2 2 0 0 0 4 0',
  link: 'm10 13 4-4m-5 8-2 2a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0m2 6a4 4 0 0 0 6 0l4-4a4 4 0 0 0-6-6l-2 2',
  plus: 'M12 5v14M5 12h14', trash: 'M4 6h16M9 6V3h6v3M6 6l1 14h10l1-14M10 10v6m4-6v6',
  check: 'm5 12 4 4L19 6', info: 'M21 12a9 9 0 1 0-18 0 9 9 0 0 0 18 0M12 11v6m0-10v.1',
  eye: 'M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7ZM15 12a3 3 0 1 0-6 0 3 3 0 0 0 6 0',
  play: 'm8 4 12 8-12 8Z', warning: 'm12 3 10 18H2L12 3ZM12 9v5m0 3v.1',
  refresh: 'M20 7v5h-5M4 17v-5h5M5.5 7a8 8 0 0 1 13 0L20 12M4 12l1.5 5a8 8 0 0 0 13 0',
  close: 'm6 6 12 12M6 18 18 6',
}
</script>
<template><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path :d="paths[name] || paths.info" /></svg></template>
