<!--
  Prompt card
  @author prompt-vault team
  @date 2026-07-07
-->
<script setup lang="ts">
import type { Prompt } from '@/types'
import { ElButton, ElMessage, ElMessageBox, ElTag } from 'element-plus'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePromptStore } from '@/stores/prompt'

const props = defineProps<{
  prompt: Prompt
}>()

const router = useRouter()
const store = usePromptStore()

const summary = computed(() => {
  const text = props.prompt.content.replace(/\s+/g, ' ').trim()
  return text.length > 80 ? `${text.slice(0, 80)}...` : text
})

const updatedLabel = computed(() => new Date(props.prompt.updatedAt).toLocaleString())

async function copyContent() {
  try {
    await navigator.clipboard.writeText(props.prompt.content)
    ElMessage.success('已复制到剪贴板')
  } catch {
    ElMessage.warning('复制失败，请手动复制')
  }
}

function editPrompt() {
  router.push(`/prompt/${props.prompt.id}/edit`)
}

async function deletePrompt() {
  try {
    await ElMessageBox.confirm(`确定删除「${props.prompt.title}」？`, '提示', { type: 'warning' })
    store.removePrompt(props.prompt.id)
    ElMessage.success('已删除')
  } catch {
    /* cancelled */
  }
}
</script>

<template>
  <article class="prompt-card">
    <div class="prompt-card__header">
      <h3>{{ prompt.title }}</h3>
      <ElTag size="small">{{ prompt.category }}</ElTag>
    </div>
    <p class="prompt-card__summary">{{ summary }}</p>
    <div v-if="prompt.tags.length" class="prompt-card__tags">
      <ElTag v-for="tag in prompt.tags" :key="tag" size="small" type="info">{{ tag }}</ElTag>
    </div>
    <div class="prompt-card__footer">
      <span class="prompt-card__time">{{ updatedLabel }}</span>
      <div class="prompt-card__actions">
        <ElButton size="small" type="primary" @click="copyContent">复制</ElButton>
        <ElButton size="small" @click="editPrompt">编辑</ElButton>
        <ElButton size="small" type="danger" text @click="deletePrompt">删除</ElButton>
      </div>
    </div>
  </article>
</template>

<style scoped>
.prompt-card {
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 10px;
  padding: 16px;
}

.prompt-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.prompt-card__header h3 {
  margin: 0;
  font-size: 16px;
}

.prompt-card__summary {
  margin: 12px 0;
  color: #606266;
  line-height: 1.6;
  white-space: pre-wrap;
}

.prompt-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.prompt-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.prompt-card__time {
  font-size: 12px;
  color: #909399;
}

.prompt-card__actions {
  display: flex;
  gap: 4px;
}
</style>
