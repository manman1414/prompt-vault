<!--
  Empty state
  @author prompt-vault team
  @date 2026-07-07
-->
<script setup lang="ts">
defineProps<{
  description: string
}>()
</script>

<template>
  <div class="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
    <p class="text-sm text-slate-500">{{ description }}</p>
  </div>
</template>
