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
  <div class="surface-card px-6 py-14 text-center">
    <div
      class="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-xl text-slate-400"
    >
      ✦
    </div>
    <p class="text-sm leading-6 text-slate-500">{{ description }}</p>
  </div>
</template>
