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
    loading?: boolean
  }>(),
  {
    type: 'button',
    variant: 'default',
    size: 'md',
    disabled: false,
    loading: false,
  },
)
</script>

<template>
  <button
    :type="type"
    class="inline-flex items-center justify-center gap-2 rounded-xl border font-medium transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
    :class="[
      size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2.5 text-sm',
      variant === 'primary' &&
        'border-transparent bg-gradient-to-b from-brand to-brand-dark text-white shadow-sm hover:brightness-105',
      variant === 'default' &&
        'border-slate-200/80 bg-white text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50',
      variant === 'danger' &&
        'border-red-200 bg-white text-red-600 shadow-sm hover:border-red-300 hover:bg-red-50',
      variant === 'ghost' &&
        'border-transparent bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-700',
    ]"
    :disabled="disabled || loading"
  >
    <span
      v-if="loading"
      class="size-3.5 shrink-0 animate-spin rounded-full border-2 border-current border-r-transparent"
      aria-hidden="true"
    />
    <slot />
  </button>
</template>
