<!--
  Toast host
  @author prompt-vault team
  @date 2026-07-07
-->
<script setup lang="ts">
import { useToast } from '@/composables/useToast'

const toast = useToast()

const typeClass: Record<string, string> = {
  success: 'border-green-200/80 bg-green-50/95 text-green-700',
  warning: 'border-amber-200/80 bg-amber-50/95 text-amber-800',
  error: 'border-red-200/80 bg-red-50/95 text-red-700',
  info: 'border-slate-200/80 bg-white/95 text-slate-700',
}
</script>

<template>
  <div class="pointer-events-none fixed right-4 top-4 z-[80] flex w-80 flex-col gap-2">
    <div
      v-for="item in toast.items"
      :key="item.id"
      class="pointer-events-auto rounded-xl border px-4 py-3 text-sm shadow-card backdrop-blur-md"
      :class="typeClass[item.type]"
    >
      {{ item.message }}
    </div>
  </div>
</template>
