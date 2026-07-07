<!--
  Settings page
  @author prompt-vault team
  @date 2026-07-07
-->
<script setup lang="ts">
import Button from '@/components/ui/Button.vue'
import { confirm } from '@/composables/useConfirm'
import { useToast } from '@/composables/useToast'
import type { AppState } from '@/types'
import { usePromptStore } from '@/stores/prompt'
import { ref } from 'vue'

const store = usePromptStore()
const toast = useToast()
const fileInput = ref<HTMLInputElement | null>(null)

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
</script>

<template>
  <div>
    <h2 class="mb-2 text-xl font-semibold">设置</h2>
    <p class="mb-5 text-sm text-slate-500">数据保存在本机，不会上传云端。建议定期导出 JSON 备份。</p>

    <div class="flex flex-wrap gap-3">
      <Button variant="primary" @click="exportJson">导出 JSON</Button>
      <Button @click="openImport">导入 JSON</Button>
      <Button variant="danger" @click="clearAll">清空数据</Button>
      <input ref="fileInput" type="file" accept="application/json,.json" hidden @change="handleImport" />
    </div>
  </div>
</template>
