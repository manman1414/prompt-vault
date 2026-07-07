<!--
  Confirm dialog
  @author prompt-vault team
  @date 2026-07-07
-->
<script setup lang="ts">
import { acceptConfirm, cancelConfirm, useConfirmState } from '@/composables/useConfirm'
import Button from '@/components/ui/Button.vue'

const state = useConfirmState()
</script>

<template>
  <Teleport to="body">
    <div
      v-if="state.open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      @click.self="cancelConfirm"
    >
      <div class="w-full max-w-md rounded-xl bg-white p-6 shadow-xl" role="dialog" aria-modal="true">
        <h3 class="text-lg font-semibold text-slate-800">{{ state.title }}</h3>
        <p class="mt-3 text-sm leading-6 text-slate-600">{{ state.message }}</p>
        <div class="mt-6 flex justify-end gap-3">
          <Button @click="cancelConfirm">{{ state.cancelText }}</Button>
          <Button :variant="state.variant === 'danger' ? 'danger' : 'primary'" @click="acceptConfirm">
            {{ state.confirmText }}
          </Button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
