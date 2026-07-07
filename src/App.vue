<!--
  App layout
  @author prompt-vault team
  @date 2026-07-07
-->
<script setup lang="ts">
import AppNav from '@/components/AppNav.vue'
import AppStatusBar from '@/components/AppStatusBar.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import ToastHost from '@/components/ui/ToastHost.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/50">
    <header class="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
      <div class="mx-auto flex max-w-3xl items-center justify-center px-4 py-3.5">
        <AppNav />
      </div>
    </header>

    <main class="mx-auto max-w-3xl px-4 py-8 pb-16">
      <div class="page-stage">
        <RouterView v-slot="{ Component, route }">
          <Transition name="page">
            <div v-if="Component" :key="route.path" class="page-shell">
              <component :is="Component" />
            </div>
          </Transition>
        </RouterView>
      </div>
    </main>

    <ToastHost />
    <ConfirmDialog />
    <AppStatusBar />
  </div>
</template>
