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
    class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
    :class="
      variant === 'info'
        ? 'bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200/80'
        : 'bg-brand-light text-brand ring-1 ring-inset ring-brand/10'
    "
  >
    <slot />
  </span>
</template>
