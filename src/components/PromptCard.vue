<!--
  Prompt card
  @author prompt-vault team
  @date 2026-07-07
-->
<script setup lang="ts">
import Button from '@/components/ui/Button.vue'
import Checkbox from '@/components/ui/Checkbox.vue'
import Tag from '@/components/ui/Tag.vue'
import { confirm } from '@/composables/useConfirm'
import { useToast } from '@/composables/useToast'
import { usePromptStore } from '@/stores/prompt'
import type { Prompt } from '@/types'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    prompt: Prompt
    selectable?: boolean
    selected?: boolean
  }>(),
  {
    selectable: false,
    selected: false,
  },
)

const emit = defineEmits<{
  'update:selected': [value: boolean]
  open: [id: string]
}>()

const store = usePromptStore()
const toast = useToast()

const summary = computed(() => {
  const text = props.prompt.content.replace(/\s+/g, ' ').trim()
  return text.length > 80 ? `${text.slice(0, 80)}...` : text
})

const updatedLabel = computed(() => new Date(props.prompt.updatedAt).toLocaleString())

function openDetail() {
  if (props.selectable) return
  emit('open', props.prompt.id)
}

async function copyContent(event: Event) {
  event.stopPropagation()
  try {
    await navigator.clipboard.writeText(props.prompt.content)
    toast.success('已复制到剪贴板')
  } catch {
    toast.warning('复制失败，请手动复制')
  }
}

async function deletePrompt(event: Event) {
  event.stopPropagation()
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
  <article
    class="group surface-card p-5 transition-all duration-200"
    :class="[
      selectable && selected && 'border-brand/30 bg-brand-light/30 ring-2 ring-brand/15',
      !selectable && 'cursor-pointer hover:-translate-y-0.5 hover:border-brand/20 hover:shadow-card-hover',
    ]"
    @click="openDetail"
  >
    <div class="flex items-start gap-3">
      <Checkbox
        v-if="selectable"
        class="mt-1"
        :model-value="selected"
        @click.stop
        @update:model-value="emit('update:selected', $event)"
      />
      <div class="min-w-0 flex-1">
        <div class="flex items-center justify-between gap-3">
          <h3 class="text-base font-semibold tracking-tight text-slate-900 group-hover:text-brand">
            {{ prompt.title }}
          </h3>
          <Tag>{{ prompt.category }}</Tag>
        </div>
        <p class="my-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">{{ summary }}</p>
        <div v-if="prompt.tags.length" class="mb-3 flex flex-wrap gap-1.5">
          <Tag v-for="tag in prompt.tags" :key="tag" variant="info">{{ tag }}</Tag>
        </div>
        <div v-if="!selectable" class="flex items-center justify-between gap-3">
          <span class="text-xs text-slate-400">{{ updatedLabel }}</span>
          <div class="flex gap-1.5 opacity-90 transition group-hover:opacity-100">
            <Button size="sm" variant="primary" @click="copyContent">复制</Button>
            <Button size="sm" variant="danger" @click="deletePrompt">删除</Button>
          </div>
        </div>
        <div v-else class="text-xs text-slate-400">{{ updatedLabel }}</div>
      </div>
    </div>
  </article>
</template>
