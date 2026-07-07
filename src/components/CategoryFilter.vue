<!--
  Category filter with sliding pill indicator
  @author prompt-vault team
  @date 2026-07-07
-->
<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps<{
  categories: string[]
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const filterRef = ref<HTMLElement | null>(null)
const indicator = ref({ left: 0, top: 0, width: 0, height: 0, opacity: 0 })

function isActive(value: string) {
  return props.modelValue === value
}

function updateIndicator() {
  const container = filterRef.value
  if (!container) return

  const activeEl = container.querySelector<HTMLElement>('[data-filter-active="true"]')
  if (!activeEl) {
    indicator.value = { ...indicator.value, opacity: 0 }
    return
  }

  indicator.value = {
    left: activeEl.offsetLeft,
    top: activeEl.offsetTop,
    width: activeEl.offsetWidth,
    height: activeEl.offsetHeight,
    opacity: 1,
  }
}

watch(
  () => [props.modelValue, props.categories] as const,
  async () => {
    await nextTick()
    updateIndicator()
  },
)

onMounted(async () => {
  await nextTick()
  updateIndicator()
  window.addEventListener('resize', updateIndicator)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateIndicator)
})

function select(value: string) {
  emit('update:modelValue', value)
}
</script>

<template>
  <div
    ref="filterRef"
    class="relative flex flex-wrap gap-1.5 rounded-2xl border border-slate-200/70 bg-slate-100/60 p-1.5"
  >
    <div
      aria-hidden="true"
      class="filter-pill-indicator absolute rounded-full bg-white shadow-sm ring-1 ring-brand/15"
      :style="{
        left: `${indicator.left}px`,
        top: `${indicator.top}px`,
        width: `${indicator.width}px`,
        height: `${indicator.height}px`,
        opacity: indicator.opacity,
      }"
    />

    <button
      type="button"
      class="relative z-10 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors duration-200"
      :class="isActive('') ? 'text-brand' : 'text-slate-600 hover:text-slate-900'"
      :data-filter-active="isActive('') ? 'true' : 'false'"
      @click="select('')"
    >
      全部
    </button>
    <button
      v-for="category in categories"
      :key="category"
      type="button"
      class="relative z-10 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors duration-200"
      :class="isActive(category) ? 'text-brand' : 'text-slate-600 hover:text-slate-900'"
      :data-filter-active="isActive(category) ? 'true' : 'false'"
      @click="select(category)"
    >
      {{ category }}
    </button>
  </div>
</template>

<style scoped>
.filter-pill-indicator {
  transition:
    left 0.28s cubic-bezier(0.4, 0, 0.2, 1),
    top 0.28s cubic-bezier(0.4, 0, 0.2, 1),
    width 0.28s cubic-bezier(0.4, 0, 0.2, 1),
    height 0.28s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.2s ease;
}

@media (prefers-reduced-motion: reduce) {
  .filter-pill-indicator {
    transition: none;
  }
}
</style>
