<!--

  App layout

  @author prompt-vault team

  @date 2026-07-07

-->

<script setup lang="ts">

import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'

import ToastHost from '@/components/ui/ToastHost.vue'

import { RouterLink, RouterView } from 'vue-router'

</script>



<template>

  <div class="min-h-screen">

    <header class="border-b border-slate-200 bg-white px-6 py-3">

      <nav class="flex gap-4 text-sm">

        <RouterLink class="text-slate-600 hover:text-brand" active-class="!text-brand font-semibold" to="/">

          提示词库

        </RouterLink>

        <RouterLink class="text-slate-600 hover:text-brand" active-class="!text-brand font-semibold" to="/prompt/new">

          新建

        </RouterLink>

        <RouterLink class="text-slate-600 hover:text-brand" active-class="!text-brand font-semibold" to="/settings">

          设置

        </RouterLink>

      </nav>

    </header>

    <main class="mx-auto max-w-3xl px-4 py-6 pb-12">

      <RouterView />

    </main>

    <ToastHost />

    <ConfirmDialog />

  </div>

</template>

