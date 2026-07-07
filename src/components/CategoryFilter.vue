<!--
  Category filter
  @author prompt-vault team
  @date 2026-07-07
-->
<script setup lang="ts">
defineProps<{
  categories: string[]
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <button
      type="button"
      class="rounded-full border px-3 py-1 text-xs transition"
      :class="
        modelValue === ''
          ? 'border-brand bg-brand-light text-brand'
          : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400'
      "
      @click="emit('update:modelValue', '')"
    >
      全部
    </button>
    <button
      v-for="category in categories"
      :key="category"
      type="button"
      class="rounded-full border px-3 py-1 text-xs transition"
      :class="
        modelValue === category
          ? 'border-brand bg-brand-light text-brand'
          : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400'
      "
      @click="emit('update:modelValue', category)"
    >
      {{ category }}
    </button>
  </div>
</template>
