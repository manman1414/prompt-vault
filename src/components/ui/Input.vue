<!--
  Text input
  @author prompt-vault team
  @date 2026-07-07
-->
<script setup lang="ts">
defineProps<{
  modelValue: string
  placeholder?: string
  clearable?: boolean
  type?: 'text' | 'search'
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="relative">
    <input
      :type="type ?? 'text'"
      class="w-full rounded-xl border border-slate-200/80 bg-white px-3.5 py-2.5 text-sm shadow-sm outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-4 focus:ring-brand/10"
      :class="clearable ? 'pr-9' : ''"
      :value="modelValue"
      :placeholder="placeholder"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <button
      v-if="clearable && modelValue"
      type="button"
      class="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
      aria-label="清空"
      @click="emit('update:modelValue', '')"
    >
      ×
    </button>
  </div>
</template>
