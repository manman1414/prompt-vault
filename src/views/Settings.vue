<!--
  Settings page
  @author prompt-vault team
  @date 2026-07-07
-->
<script setup lang="ts">
import type { AppState } from '@/types'
import { usePromptStore } from '@/stores/prompt'
import { ElButton, ElMessage, ElMessageBox } from 'element-plus'
import { ref } from 'vue'

const store = usePromptStore()
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
  ElMessage.success('导出成功')
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
    await ElMessageBox.confirm('导入将覆盖当前全部数据，是否继续？', '提示', { type: 'warning' })
    store.importState(data)
    ElMessage.success('导入成功')
  } catch {
    ElMessage.error('导入失败，请检查 JSON 格式')
  } finally {
    input.value = ''
  }
}

async function clearAll() {
  try {
    await ElMessageBox.confirm('确定清空全部 Prompt？此操作不可恢复。', '警告', { type: 'warning' })
    store.clearAll()
    ElMessage.success('已清空')
  } catch {
    /* cancelled */
  }
}
</script>

<template>
  <div class="settings">
    <h2>设置</h2>
    <p class="settings__desc">数据保存在浏览器 localStorage，可导出 JSON 备份。</p>

    <div class="settings__actions">
      <ElButton type="primary" @click="exportJson">导出 JSON</ElButton>
      <ElButton @click="openImport">导入 JSON</ElButton>
      <ElButton type="danger" plain @click="clearAll">清空数据</ElButton>
      <input ref="fileInput" type="file" accept="application/json,.json" hidden @change="handleImport" />
    </div>
  </div>
</template>

<style scoped>
.settings h2 {
  margin: 0 0 8px;
}

.settings__desc {
  margin: 0 0 20px;
  color: #606266;
}

.settings__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
</style>
