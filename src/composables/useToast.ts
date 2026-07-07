/**
 * Toast notifications
 * @author prompt-vault team
 * @date 2026-07-07
 */

import { reactive } from 'vue'

export type ToastType = 'success' | 'warning' | 'error' | 'info'

export interface ToastItem {
  id: number
  type: ToastType
  message: string
}

const state = reactive<{ items: ToastItem[] }>({ items: [] })
let nextId = 1

function push(type: ToastType, message: string) {
  const id = nextId++
  state.items.push({ id, type, message })
  window.setTimeout(() => dismiss(id), 2800)
}

function dismiss(id: number) {
  const index = state.items.findIndex((item) => item.id === id)
  if (index >= 0) state.items.splice(index, 1)
}

export function useToast() {
  return {
    items: state.items,
    dismiss,
    success: (message: string) => push('success', message),
    warning: (message: string) => push('warning', message),
    error: (message: string) => push('error', message),
    info: (message: string) => push('info', message),
  }
}
