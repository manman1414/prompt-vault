<!--
  Prompt edit page
  @author prompt-vault team
  @date 2026-07-07
-->
<script setup lang="ts">
import Button from '@/components/ui/Button.vue'
import Combobox from '@/components/ui/Combobox.vue'
import Input from '@/components/ui/Input.vue'
import Textarea from '@/components/ui/Textarea.vue'
import { useToast } from '@/composables/useToast'
import { usePromptStore } from '@/stores/prompt'
import { DEFAULT_CATEGORIES } from '@/types'
import { storeToRefs } from 'pinia'
import { computed, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const store = usePromptStore()
const toast = useToast()
const { categories } = storeToRefs(store)

const isEdit = computed(() => route.name === 'edit')
const pageTitle = computed(() => (isEdit.value ? '编辑 Prompt' : '新建 Prompt'))

const form = reactive({
  title: '',
  content: '',
  category: '写作',
  tagsText: '',
})

const categoryOptions = computed(() => {
  const merged = new Set([...DEFAULT_CATEGORIES, ...categories.value, form.category].filter(Boolean))
  return Array.from(merged)
})

function parseTags(text: string) {
  return text
    .split(/[,，]/)
    .map((tag) => tag.trim())
    .filter(Boolean)
}

onMounted(() => {
  if (!isEdit.value) return
  const id = route.params.id as string
  const prompt = store.getById(id)
  if (!prompt) {
    toast.error('Prompt 不存在')
    router.replace('/')
    return
  }
  form.title = prompt.title
  form.content = prompt.content
  form.category = prompt.category
  form.tagsText = prompt.tags.join(', ')
})

function handleSubmit() {
  if (!form.title.trim() || !form.content.trim()) {
    toast.warning('请填写标题和内容')
    return
  }

  const excludeId = isEdit.value ? (route.params.id as string) : undefined
  if (store.isTitleTaken(form.title, excludeId)) {
    toast.warning('标题已存在，请使用其他名称')
    return
  }

  const payload = {
    title: form.title,
    content: form.content,
    category: form.category || '其他',
    tags: parseTags(form.tagsText),
  }

  if (isEdit.value) {
    const ok = store.updatePrompt(route.params.id as string, payload)
    if (!ok) {
      toast.error('保存失败')
      return
    }
    toast.success('已更新')
  } else {
    store.addPrompt(payload)
    toast.success('已创建')
  }

  router.push('/')
}

function handleCancel() {
  router.push('/')
}
</script>

<template>
  <div>
    <h2 class="mb-5 text-xl font-semibold">{{ pageTitle }}</h2>

    <form class="space-y-4" @submit.prevent="handleSubmit">
      <label class="block">
        <span class="mb-1.5 block text-sm text-slate-600">标题 <span class="text-red-500">*</span></span>
        <Input v-model="form.title" placeholder="例如：代码审查助手" />
      </label>

      <label class="block">
        <span class="mb-1.5 block text-sm text-slate-600">内容 <span class="text-red-500">*</span></span>
        <Textarea v-model="form.content" :rows="10" placeholder="输入完整 Prompt 内容" />
      </label>

      <label class="block">
        <span class="mb-1.5 block text-sm text-slate-600">分类</span>
        <Combobox v-model="form.category" :options="categoryOptions" placeholder="选择或输入分类" />
      </label>

      <label class="block">
        <span class="mb-1.5 block text-sm text-slate-600">标签</span>
        <Input v-model="form.tagsText" placeholder="多个标签用逗号分隔" />
      </label>

      <div class="flex gap-3 pt-2">
        <Button type="submit" variant="primary">保存</Button>
        <Button type="button" @click="handleCancel">取消</Button>
      </div>
    </form>
  </div>
</template>
