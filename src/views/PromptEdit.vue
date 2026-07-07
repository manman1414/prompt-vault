<!--
  Prompt edit page
  @author prompt-vault team
  @date 2026-07-07
-->
<script setup lang="ts">
import { usePromptStore } from '@/stores/prompt'
import { ElButton, ElForm, ElFormItem, ElInput, ElMessage, ElOption, ElSelect } from 'element-plus'
import { storeToRefs } from 'pinia'
import { computed, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const store = usePromptStore()
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
  const merged = new Set([...categories.value, form.category].filter(Boolean))
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
    ElMessage.error('Prompt 不存在')
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
    ElMessage.warning('请填写标题和内容')
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
      ElMessage.error('保存失败')
      return
    }
    ElMessage.success('已更新')
  } else {
    store.addPrompt(payload)
    ElMessage.success('已创建')
  }

  router.push('/')
}

function handleCancel() {
  router.push('/')
}
</script>

<template>
  <div class="prompt-edit">
    <h2>{{ pageTitle }}</h2>

    <ElForm label-width="72px" @submit.prevent="handleSubmit">
      <ElFormItem label="标题" required>
        <ElInput v-model="form.title" placeholder="例如：代码审查助手" />
      </ElFormItem>

      <ElFormItem label="内容" required>
        <ElInput
          v-model="form.content"
          type="textarea"
          :rows="10"
          placeholder="输入完整 Prompt 内容"
        />
      </ElFormItem>

      <ElFormItem label="分类">
        <ElSelect v-model="form.category" filterable allow-create default-first-option>
          <ElOption v-for="item in categoryOptions" :key="item" :label="item" :value="item" />
        </ElSelect>
      </ElFormItem>

      <ElFormItem label="标签">
        <ElInput v-model="form.tagsText" placeholder="多个标签用逗号分隔" />
      </ElFormItem>

      <ElFormItem>
        <ElButton type="primary" @click="handleSubmit">保存</ElButton>
        <ElButton @click="handleCancel">取消</ElButton>
      </ElFormItem>
    </ElForm>
  </div>
</template>

<style scoped>
.prompt-edit h2 {
  margin: 0 0 20px;
}
</style>
