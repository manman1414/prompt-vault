/**
 * Desktop auto-update composable
 * @author prompt-vault team
 * @date 2026-07-23
 */

import type { UpdaterStatus } from '@/types/electron'
import { computed, onMounted, ref } from 'vue'

const status = ref<UpdaterStatus | null>(null)
const currentVersion = ref('')
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

  onMounted(async () => {
    ensureSubscription()
    if (window.electronAPI) {
      try {
        currentVersion.value = await window.electronAPI.getVersion()
      } catch {
        currentVersion.value = ''
      }
    }
  })

  async function checkForUpdates() {
    if (!window.electronAPI) {
      status.value = { status: 'error', message: '当前不是桌面端，无法检查更新' }
      return null
    }
    status.value = { status: 'checking' }
    const result = await window.electronAPI.checkForUpdates()
    if (result.currentVersion) {
      currentVersion.value = result.currentVersion
    }

    if (!result.ok && result.reason === 'dev') {
      status.value = { status: 'error', message: '开发模式不支持自动更新，请使用安装包验证' }
      return result
    }
    if (!result.ok) {
      status.value = { status: 'error', message: result.message || '检查更新失败' }
      return result
    }

    // 以主进程返回结果为准，避免只依赖事件导致界面无反馈
    if (result.status === 'available' && result.version) {
      status.value = { status: 'available', version: result.version }
    } else if (result.status === 'not-available') {
      status.value = {
        status: 'not-available',
        version: result.version || result.currentVersion || currentVersion.value,
      }
    }
    return result
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
    currentVersion,
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
