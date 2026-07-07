/**
 * Promise-based confirm dialog
 * @author prompt-vault team
 * @date 2026-07-07
 */

import { reactive } from 'vue'

export interface ConfirmOptions {
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'danger'
}

interface ConfirmState {
  open: boolean
  title: string
  message: string
  confirmText: string
  cancelText: string
  variant: 'default' | 'danger'
  resolve: ((value: boolean) => void) | null
}

const state = reactive<ConfirmState>({
  open: false,
  title: '提示',
  message: '',
  confirmText: '确定',
  cancelText: '取消',
  variant: 'default',
  resolve: null,
})

export function useConfirmState() {
  return state
}

export function confirm(options: ConfirmOptions | string): Promise<void> {
  const opts = typeof options === 'string' ? { message: options } : options

  return new Promise((resolve, reject) => {
    state.title = opts.title ?? '提示'
    state.message = opts.message
    state.confirmText = opts.confirmText ?? '确定'
    state.cancelText = opts.cancelText ?? '取消'
    state.variant = opts.variant ?? 'default'
    state.open = true
    state.resolve = (accepted) => {
      state.open = false
      state.resolve = null
      if (accepted) resolve()
      else reject(new Error('cancelled'))
    }
  })
}

export function acceptConfirm() {
  state.resolve?.(true)
}

export function cancelConfirm() {
  state.resolve?.(false)
}
