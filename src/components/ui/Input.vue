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
      class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
      :class="clearable ? 'pr-9' : ''"
      :value="modelValue"
      :placeholder="placeholder"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <button
      v-if="clearable && modelValue"
      type="button"
      class="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
      aria-label="清空"
      @click="emit('update:modelValue', '')"
    >
      ×
    </button>
  </div>
</template>
