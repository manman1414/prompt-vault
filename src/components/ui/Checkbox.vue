<!--
  Checkbox
  @author prompt-vault team
  @date 2026-07-07
-->
<script setup lang="ts">
defineProps<{
  modelValue: boolean
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

function toggle(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).checked)
}
</script>

<template>
  <input
    type="checkbox"
    class="size-4 shrink-0 rounded-md border-slate-300 text-brand shadow-sm focus:ring-brand/30 disabled:cursor-not-allowed disabled:opacity-50"
    :checked="modelValue"
    :disabled="disabled"
    @change="toggle"
  />
</template>
