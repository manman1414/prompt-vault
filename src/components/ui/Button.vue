<!--
  Button
  @author prompt-vault team
  @date 2026-07-07
-->
<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset'
    variant?: 'primary' | 'default' | 'danger' | 'ghost'
    size?: 'sm' | 'md'
    disabled?: boolean
  }>(),
  {
    type: 'button',
    variant: 'default',
    size: 'md',
    disabled: false,
  },
)
</script>

<template>
  <button
    :type="type"
    class="inline-flex items-center justify-center rounded-lg border font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
    :class="[
      size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-4 py-2 text-sm',
      variant === 'primary' && 'border-brand bg-brand text-white hover:bg-brand-dark',
      variant === 'default' && 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50',
      variant === 'danger' && 'border-red-300 bg-white text-red-600 hover:bg-red-50',
      variant === 'ghost' && 'border-transparent bg-transparent text-red-600 hover:bg-red-50',
    ]"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>
