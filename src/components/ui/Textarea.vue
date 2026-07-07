<!--
  Textarea
  @author prompt-vault team
  @date 2026-07-07
-->
<script setup lang="ts">
defineProps<{
  modelValue: string
  placeholder?: string
  rows?: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <textarea
    class="w-full resize-y rounded-xl border border-slate-200/80 bg-white px-3.5 py-2.5 text-sm leading-6 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-4 focus:ring-brand/10"
    :rows="rows ?? 6"
    :value="modelValue"
    :placeholder="placeholder"
    @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
  />
</template>
