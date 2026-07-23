<!--
  Settings page
  @author prompt-vault team
  @date 2026-07-07
-->
<script setup lang="ts">
import Button from '@/components/ui/Button.vue'
import { confirm } from '@/composables/useConfirm'
import { useToast } from '@/composables/useToast'
import { useUpdater } from '@/composables/useUpdater'
import type { AppState } from '@/types'
import { usePromptStore } from '@/stores/prompt'
import { computed, ref, watch } from 'vue'

const store = usePromptStore()
const toast = useToast()
const fileInput = ref<HTMLInputElement | null>(null)
const manualCheck = ref(false)

const { isElectron, status, busy, progressPercent, checkForUpdates, downloadUpdate, installUpdate } =
  useUpdater()

const updateHint = computed(() => {
  const s = status.value
  if (!s) return isElectron.value ? '可检查 GitHub Releases 上的新版本' : '自动更新仅桌面安装版可用'
  switch (s.status) {
    case 'checking':
      return '正在检查更新…'
    case 'available':
      return `发现新版本 v${s.version}，可下载安装`
    case 'not-available':
      return '当前已是最新版本'
    case 'downloading':
      return `正在下载更新… ${progressPercent.value}%`
    case 'downloaded':
      return `v${s.version} 已下载完成，重启后安装`
    case 'error':
      return s.message
    default:
      return ''
  }
})

watch(
  () => status.value,
  async (s) => {
    if (!s) return
    if (s.status === 'not-available' && manualCheck.value) {
      toast.success('已是最新版本')
      manualCheck.value = false
    } else if (s.status === 'available' && manualCheck.value) {
      manualCheck.value = false
    } else if (s.status === 'downloaded') {
      try {
        await confirm({
          title: '更新已就绪',
          message: `新版本 v${s.version} 已下载完成，是否立即重启安装？`,
        })
        await installUpdate()
      } catch {
        toast.info('可稍后点击「立即安装」')
      }
    } else if (s.status === 'error' && !s.silent && manualCheck.value) {
      toast.error(s.message || '更新失败')
      manualCheck.value = false
    }
  },
)

function exportJson() {
  const data = store.exportState()
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `prompt-vault-backup-${Date.now()}.json`
  link.click()
  URL.revokeObjectURL(url)
  toast.success('导出成功')
}

function openImport() {
  fileInput.value?.click()
}

async function handleImport(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  try {
    const text = await file.text()
    const data = JSON.parse(text) as AppState
    if (!Array.isArray(data.prompts)) {
      throw new Error('invalid format')
    }
    await confirm({ message: '导入将覆盖当前全部数据，是否继续？', variant: 'danger' })
    store.importState(data)
    toast.success('导入成功')
  } catch (error) {
    if (error instanceof Error && error.message === 'cancelled') return
    toast.error('导入失败，请检查 JSON 格式')
  } finally {
    input.value = ''
  }
}

async function clearAll() {
  try {
    await confirm({
      title: '警告',
      message: '确定清空全部提示词？此操作不可恢复。',
      variant: 'danger',
    })
    store.clearAll()
    toast.success('已清空')
  } catch {
    /* cancelled */
  }
}

async function handleCheckUpdate() {
  manualCheck.value = true
  await checkForUpdates()
}

async function handleDownloadUpdate() {
  await downloadUpdate()
}

async function handleInstallUpdate() {
  try {
    await confirm({
      title: '安装更新',
      message: '将关闭应用并安装新版本，是否继续？',
    })
    await installUpdate()
  } catch {
    /* cancelled */
  }
}
</script>

<template>
  <div>
    <h2 class="page-title">设置</h2>
    <p class="page-desc mb-6">数据保存在本机，不会上传云端。建议定期导出 JSON 备份。当前为更新测试版本。</p>

    <div class="surface-card mb-5 p-5">
      <h3 class="mb-4 text-sm font-semibold text-slate-800">数据管理</h3>
      <div class="flex flex-wrap gap-3">
        <Button variant="primary" @click="exportJson">导出 JSON</Button>
        <Button @click="openImport">导入 JSON</Button>
        <Button variant="danger" @click="clearAll">清空数据</Button>
        <input ref="fileInput" type="file" accept="application/json,.json" hidden @change="handleImport" />
      </div>
    </div>

    <div class="surface-card p-5">
      <h3 class="mb-1 text-sm font-semibold text-slate-800">软件更新</h3>
      <p class="page-desc mb-4">{{ updateHint }}</p>

      <div
        v-if="status?.status === 'downloading'"
        class="mb-4 h-2 overflow-hidden rounded-full bg-slate-100"
      >
        <div
          class="h-full rounded-full bg-brand transition-all duration-200"
          :style="{ width: `${progressPercent}%` }"
        />
      </div>

      <div class="flex flex-wrap gap-3">
        <Button variant="primary" :disabled="busy" @click="handleCheckUpdate">检查更新</Button>
        <Button
          v-if="status?.status === 'available'"
          :disabled="busy"
          @click="handleDownloadUpdate"
        >
          下载更新
        </Button>
        <Button
          v-if="status?.status === 'downloaded'"
          variant="primary"
          @click="handleInstallUpdate"
        >
          立即安装
        </Button>
      </div>
    </div>
  </div>
</template>
