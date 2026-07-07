<!--
  Prompt edit page (create only)
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
import { storeToRefs } from 'pinia'
import { computed, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const store = usePromptStore()
const toast = useToast()
const { categories } = storeToRefs(store)

const form = reactive({
  title: '',
  content: '',
  category: categories.value[0] ?? '其他',
  tagsText: '',
})

function defaultCategory() {
  return categories.value[0] ?? '其他'
}

const categoryOptions = computed(() => [...categories.value])

function parseTags(text: string) {
  return text
    .split(/[,，]/)
    .map((tag) => tag.trim())
    .filter(Boolean)
}

function handleSubmit() {
  if (!form.title.trim() || !form.content.trim()) {
    toast.warning('请填写标题和内容')
    return
  }

  if (store.isTitleTaken(form.title)) {
    toast.warning('标题已存在，请使用其他名称')
    return
  }

  store.addPrompt({
    title: form.title,
    content: form.content,
    category: form.category || defaultCategory(),
    tags: parseTags(form.tagsText),
  })
  toast.success('已创建')
  router.push('/')
}

function handleCancel() {
  router.push('/')
}
</script>

<template>
  <div>
    <h2 class="page-title mb-6">新建提示词</h2>

    <form class="surface-card space-y-4 p-5" @submit.prevent="handleSubmit">
      <label class="block">
        <span class="field-label">标题 <span class="text-red-500">*</span></span>
        <Input v-model="form.title" placeholder="例如：代码审查助手" />
      </label>

      <label class="block">
        <span class="field-label">内容 <span class="text-red-500">*</span></span>
        <Textarea v-model="form.content" :rows="10" placeholder="输入完整提示词内容" />
      </label>

      <label class="block">
        <span class="field-label">分类</span>
        <Combobox v-model="form.category" :options="categoryOptions" placeholder="选择分类" />
      </label>

      <label class="block">
        <span class="field-label">标签</span>
        <Input v-model="form.tagsText" placeholder="多个标签用逗号分隔" />
      </label>

      <div class="flex gap-3 border-t border-slate-100 pt-4">
        <Button type="submit" variant="primary">保存</Button>
        <Button type="button" @click="handleCancel">取消</Button>
      </div>
    </form>
  </div>
</template>
