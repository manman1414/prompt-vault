<!--
  Prompt detail modal (editable on open)
  @author prompt-vault team
  @date 2026-07-07
-->
<script setup lang="ts">
import Button from '@/components/ui/Button.vue'
import Combobox from '@/components/ui/Combobox.vue'
import Input from '@/components/ui/Input.vue'
import Textarea from '@/components/ui/Textarea.vue'
import { confirm } from '@/composables/useConfirm'
import { useToast } from '@/composables/useToast'
import { usePromptStore } from '@/stores/prompt'
import { storeToRefs } from 'pinia'
import { computed, reactive, watch } from 'vue'

const props = defineProps<{
  promptId: string | null
}>()

const emit = defineEmits<{
  close: []
  deleted: []
}>()

const store = usePromptStore()
const toast = useToast()
const { categories } = storeToRefs(store)

const form = reactive({
  title: '',
  content: '',
  category: '',
  tagsText: '',
})

const open = computed(() => !!props.promptId)

const prompt = computed(() => (props.promptId ? store.getById(props.promptId) : null))

const categoryOptions = computed(() => {
  const list = [...categories.value]
  if (form.category && !list.includes(form.category)) {
    list.push(form.category)
  }
  return list
})

function defaultCategory() {
  return categories.value[0] ?? '其他'
}

function loadForm() {
  const item = prompt.value
  if (!item) return
  form.title = item.title
  form.content = item.content
  form.category = item.category
  form.tagsText = item.tags.join(', ')
}

function parseTags(text: string) {
  return text
    .split(/[,，]/)
    .map((tag) => tag.trim())
    .filter(Boolean)
}

watch(
  () => props.promptId,
  (id) => {
    if (!id) return
    if (!prompt.value) {
      toast.error('提示词不存在')
      emit('close')
      return
    }
    loadForm()
  },
)

function handleClose() {
  emit('close')
}

function handleSave() {
  if (!props.promptId) return
  if (!form.title.trim() || !form.content.trim()) {
    toast.warning('请填写标题和内容')
    return
  }
  if (store.isTitleTaken(form.title, props.promptId)) {
    toast.warning('标题已存在，请使用其他名称')
    return
  }

  const ok = store.updatePrompt(props.promptId, {
    title: form.title,
    content: form.content,
    category: form.category || defaultCategory(),
    tags: parseTags(form.tagsText),
  })
  if (!ok) {
    toast.error('保存失败')
    return
  }
  toast.success('已保存')
  emit('close')
}

async function copyContent() {
  try {
    await navigator.clipboard.writeText(form.content)
    toast.success('已复制到剪贴板')
  } catch {
    toast.warning('复制失败，请手动复制')
  }
}

async function deletePrompt() {
  if (!props.promptId || !prompt.value) return
  try {
    await confirm({ message: `确定删除「${form.title || prompt.value.title}」？`, variant: 'danger' })
    store.removePrompt(props.promptId)
    toast.success('已删除')
    emit('deleted')
  } catch {
    /* cancelled */
  }
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') handleClose()
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/40 p-4 backdrop-blur-sm sm:items-center"
      @click.self="handleClose"
      @keydown="onKeydown"
    >
      <div
        class="my-4 w-full max-w-2xl rounded-2xl border border-slate-200/80 bg-white p-6 shadow-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="prompt-modal-title"
      >
        <div class="mb-5 flex items-center justify-between gap-3">
          <h2 id="prompt-modal-title" class="text-lg font-semibold tracking-tight text-slate-900">编辑提示词</h2>
          <div class="flex gap-2">
            <Button size="sm" variant="primary" @click="copyContent">复制</Button>
            <Button size="sm" variant="danger" @click="deletePrompt">删除</Button>
            <Button size="sm" @click="handleClose">关闭</Button>
          </div>
        </div>

        <form class="space-y-4" @submit.prevent="handleSave">
          <label class="block">
            <span class="field-label">标题 <span class="text-red-500">*</span></span>
            <Input v-model="form.title" placeholder="例如：代码审查助手" />
          </label>

          <label class="block">
            <span class="field-label">内容 <span class="text-red-500">*</span></span>
            <Textarea v-model="form.content" :rows="12" placeholder="输入完整提示词内容" />
          </label>

          <label class="block">
            <span class="field-label">分类</span>
            <Combobox v-model="form.category" :options="categoryOptions" placeholder="选择分类" />
          </label>

          <label class="block">
            <span class="field-label">标签</span>
            <Input v-model="form.tagsText" placeholder="多个标签用逗号分隔" />
          </label>

          <div class="flex gap-3 pt-2">
            <Button type="submit" variant="primary">保存</Button>
            <Button type="button" @click="handleClose">取消</Button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>
