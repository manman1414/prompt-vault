<!--
  Prompt card
  @author prompt-vault team
  @date 2026-07-07
-->
<script setup lang="ts">
import Button from '@/components/ui/Button.vue'
import Tag from '@/components/ui/Tag.vue'
import { confirm } from '@/composables/useConfirm'
import { useToast } from '@/composables/useToast'
import { usePromptStore } from '@/stores/prompt'
import type { Prompt } from '@/types'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  prompt: Prompt
}>()

const router = useRouter()
const store = usePromptStore()
const toast = useToast()

const summary = computed(() => {
  const text = props.prompt.content.replace(/\s+/g, ' ').trim()
  return text.length > 80 ? `${text.slice(0, 80)}...` : text
})

const updatedLabel = computed(() => new Date(props.prompt.updatedAt).toLocaleString())

async function copyContent() {
  try {
    await navigator.clipboard.writeText(props.prompt.content)
    toast.success('已复制到剪贴板')
  } catch {
    toast.warning('复制失败，请手动复制')
  }
}

function editPrompt() {
  router.push(`/prompt/${props.prompt.id}/edit`)
}

async function deletePrompt() {
  try {
    await confirm({ message: `确定删除「${props.prompt.title}」？`, variant: 'danger' })
    store.removePrompt(props.prompt.id)
    toast.success('已删除')
  } catch {
    /* cancelled */
  }
}
</script>

<template>
  <article class="rounded-xl border border-slate-200 bg-white p-4">
    <div class="flex items-center justify-between gap-3">
      <h3 class="text-base font-semibold">{{ prompt.title }}</h3>
      <Tag>{{ prompt.category }}</Tag>
    </div>
    <p class="my-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">{{ summary }}</p>
    <div v-if="prompt.tags.length" class="mb-3 flex flex-wrap gap-1.5">
      <Tag v-for="tag in prompt.tags" :key="tag" variant="info">{{ tag }}</Tag>
    </div>
    <div class="flex items-center justify-between gap-3">
      <span class="text-xs text-slate-400">{{ updatedLabel }}</span>
      <div class="flex gap-1">
        <Button size="sm" variant="primary" @click="copyContent">复制</Button>
        <Button size="sm" @click="editPrompt">编辑</Button>
        <Button size="sm" variant="ghost" @click="deletePrompt">删除</Button>
      </div>
    </div>
  </article>
</template>
