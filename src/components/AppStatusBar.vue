<!--
  App status bar (version + prompt count)
  @author prompt-vault team
  @date 2026-07-07
-->
<script setup lang="ts">
import { usePromptStore } from '@/stores/prompt'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

const store = usePromptStore()
const { prompts } = storeToRefs(store)

const promptCount = computed(() => prompts.value.length)
const version = __APP_VERSION__
</script>

<template>
  <div
    class="pointer-events-none fixed bottom-4 right-4 z-30 flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/80 px-3 py-1.5 text-xs text-slate-500 shadow-sm backdrop-blur-md"
    aria-live="polite"
  >
    <span>v{{ version }}</span>
    <span class="text-slate-300" aria-hidden="true">·</span>
    <span>{{ promptCount }} 条提示词</span>
  </div>
</template>
