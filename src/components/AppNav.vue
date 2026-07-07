<!--
  App navigation with sliding pill indicator
  @author prompt-vault team
  @date 2026-07-07
-->
<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const navItems = [
  { to: '/', label: '提示词库' },
  { to: '/prompt/new', label: '新建' },
  { to: '/categories', label: '分类' },
  { to: '/settings', label: '设置' },
]

const route = useRoute()
const navRef = ref<HTMLElement | null>(null)
const indicator = ref({ left: 0, width: 0, opacity: 0 })

function isActive(path: string) {
  if (path === '/') return route.path === '/'
  return route.path === path || route.path.startsWith(`${path}/`)
}

function updateIndicator() {
  const nav = navRef.value
  if (!nav) return

  const activeEl = nav.querySelector<HTMLElement>('[data-nav-active="true"]')
  if (!activeEl) {
    indicator.value = { ...indicator.value, opacity: 0 }
    return
  }

  indicator.value = {
    left: activeEl.offsetLeft,
    width: activeEl.offsetWidth,
    opacity: 1,
  }
}

watch(
  () => route.path,
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
</script>

<template>
  <nav ref="navRef" class="relative flex gap-1 rounded-full bg-slate-100/90 p-1">
    <div
      aria-hidden="true"
      class="nav-pill-indicator absolute top-1 rounded-full bg-white shadow-sm"
      :style="{
        left: `${indicator.left}px`,
        width: `${indicator.width}px`,
        opacity: indicator.opacity,
      }"
    />

    <RouterLink
      v-for="item in navItems"
      :key="item.to"
      :to="item.to"
      class="relative z-10 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-200"
      :class="isActive(item.to) ? 'text-brand' : 'text-slate-600 hover:text-slate-900'"
      :data-nav-active="isActive(item.to) ? 'true' : 'false'"
    >
      {{ item.label }}
    </RouterLink>
  </nav>
</template>

<style scoped>
.nav-pill-indicator {
  height: calc(100% - 0.5rem);
  transition:
    left 0.28s cubic-bezier(0.4, 0, 0.2, 1),
    width 0.28s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.2s ease;
}

@media (prefers-reduced-motion: reduce) {
  .nav-pill-indicator {
    transition: none;
  }
}
</style>
