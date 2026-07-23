/**
 * Desktop auto-update composable
 * @author prompt-vault team
 * @date 2026-07-23
 */

import type { UpdaterStatus } from '@/types/electron'
import { computed, onMounted, onUnmounted, ref } from 'vue'

const status = ref<UpdaterStatus | null>(null)
let subscribed = false

function ensureSubscription() {
  if (subscribed || !window.electronAPI) return
  subscribed = true
  window.electronAPI.onUpdaterStatus((payload) => {
    status.value = payload
  })
}

export function useUpdater() {
  const isElectron = computed(() => !!window.electronAPI?.isElectron)
  const busy = computed(() => {
    const s = status.value?.status
    return s === 'checking' || s === 'downloading'
  })

  const progressPercent = computed(() => {
    if (status.value?.status !== 'downloading') return 0
    return Math.max(0, Math.min(100, Math.round(status.value.percent)))
  })

  onMounted(() => {
    ensureSubscription()
  })

  onUnmounted(() => {
    // 保持全局订阅，避免设置页卸载后收不到启动检查结果
  })

  async function checkForUpdates() {
    if (!window.electronAPI) {
      status.value = { status: 'error', message: '当前不是桌面端，无法检查更新' }
      return
    }
    status.value = { status: 'checking' }
    const result = await window.electronAPI.checkForUpdates()
    if (!result.ok && result.reason === 'dev') {
      status.value = { status: 'error', message: '开发模式不支持自动更新，请使用安装包验证' }
    } else if (!result.ok) {
      status.value = { status: 'error', message: result.message || '检查更新失败' }
    }
  }

  async function downloadUpdate() {
    if (!window.electronAPI) return
    const result = await window.electronAPI.downloadUpdate()
    if (!result.ok) {
      status.value = { status: 'error', message: result.message || '下载更新失败' }
    }
  }

  async function installUpdate() {
    if (!window.electronAPI) return
    await window.electronAPI.installUpdate()
  }

  return {
    isElectron,
    status,
    busy,
    progressPercent,
    checkForUpdates,
    downloadUpdate,
    installUpdate,
  }
}

/** 在应用入口订阅一次，便于启动后静默检查有结果时提示 */
export function setupUpdaterListener(onStatus: (payload: UpdaterStatus) => void) {
  if (!window.electronAPI) return () => {}
  ensureSubscription()
  return window.electronAPI.onUpdaterStatus(onStatus)
}
