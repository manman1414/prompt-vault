<!--
  Tag badge
  @author prompt-vault team
  @date 2026-07-07
-->
<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'default' | 'info'
  }>(),
  { variant: 'default' },
)
</script>

<template>
  <span
    class="inline-flex items-center rounded-full px-2 py-0.5 text-xs"
    :class="
      variant === 'info'
        ? 'bg-slate-100 text-slate-600'
        : 'bg-brand-light text-brand'
    "
  >
    <slot />
  </span>
</template>
