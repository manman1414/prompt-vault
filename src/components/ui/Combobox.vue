<!--
  Filterable select with create option
  @author prompt-vault team
  @date 2026-07-07
-->
<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  modelValue: string
  options: string[]
  placeholder?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const open = ref(false)
const query = ref(props.modelValue)

watch(
  () => props.modelValue,
  (value) => {
    query.value = value
  },
)

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  const list = props.options.filter((item) => item.toLowerCase().includes(q))
  if (q && !props.options.some((item) => item.toLowerCase() === q)) {
    return [`创建「${query.value.trim()}」`, ...list]
  }
  return list
})

function selectOption(option: string) {
  if (option.startsWith('创建「')) {
    const value = query.value.trim()
    if (value) emit('update:modelValue', value)
  } else {
    emit('update:modelValue', option)
    query.value = option
  }
  open.value = false
}

function onInput(event: Event) {
  query.value = (event.target as HTMLInputElement).value
  emit('update:modelValue', query.value)
  open.value = true
}

function onBlur() {
  window.setTimeout(() => {
    open.value = false
  }, 120)
}
</script>

<template>
  <div class="relative">
    <input
      class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
      :value="modelValue"
      :placeholder="placeholder"
      @input="onInput"
      @focus="open = true"
      @blur="onBlur"
    />
    <ul
      v-if="open && filtered.length"
      class="absolute z-20 mt-1 max-h-48 w-full overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
    >
      <li v-for="option in filtered" :key="option">
        <button
          type="button"
          class="block w-full px-3 py-2 text-left text-sm hover:bg-slate-50"
          :class="option.startsWith('创建「') ? 'text-brand' : 'text-slate-700'"
          @mousedown.prevent="selectOption(option)"
        >
          {{ option }}
        </button>
      </li>
    </ul>
  </div>
</template>
