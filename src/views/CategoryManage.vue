<!--
  Category management page
  @author prompt-vault team
  @date 2026-07-07
-->
<script setup lang="ts">
import Button from '@/components/ui/Button.vue'
import Empty from '@/components/ui/Empty.vue'
import Input from '@/components/ui/Input.vue'
import { confirm } from '@/composables/useConfirm'
import { useToast } from '@/composables/useToast'
import { usePromptStore } from '@/stores/prompt'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

const store = usePromptStore()
const toast = useToast()
const { categories } = storeToRefs(store)

const newCategoryName = ref('')
const editingName = ref<string | null>(null)
const editingValue = ref('')

function handleAdd() {
  const result = store.addCategory(newCategoryName.value)
  if (!result.ok) {
    if (result.reason === 'empty') toast.warning('请输入分类名称')
    if (result.reason === 'duplicate') toast.warning('分类已存在')
    return
  }
  newCategoryName.value = ''
  toast.success('已添加分类')
}

function startRename(name: string) {
  editingName.value = name
  editingValue.value = name
}

function cancelRename() {
  editingName.value = null
  editingValue.value = ''
}

function submitRename(oldName: string) {
  const result = store.renameCategory(oldName, editingValue.value)
  if (!result.ok) {
    if (result.reason === 'empty') toast.warning('分类名称不能为空')
    if (result.reason === 'duplicate') toast.warning('分类已存在')
    if (result.reason === 'not_found') toast.error('分类不存在')
    return
  }
  cancelRename()
  toast.success('已重命名')
}

async function handleDelete(name: string) {
  const count = store.categoryPromptCount(name)
  if (count > 0) {
    toast.warning(`该分类下还有 ${count} 条提示词，无法删除`)
    return
  }
  try {
    await confirm({ message: `确定删除分类「${name}」？`, variant: 'danger' })
    const result = store.removeCategory(name)
    if (!result.ok) {
      if (result.reason === 'has_prompts') {
        toast.warning(`该分类下还有 ${result.count} 条提示词，无法删除`)
      } else {
        toast.error('删除失败')
      }
      return
    }
    toast.success('已删除')
  } catch {
    /* cancelled */
  }
}
</script>

<template>
  <div>
    <h2 class="page-title mb-6">分类管理</h2>

    <form class="surface-card mb-5 flex gap-2 p-4" @submit.prevent="handleAdd">
      <Input v-model="newCategoryName" class="flex-1" placeholder="输入新分类名称" />
      <Button type="submit" variant="primary">添加</Button>
    </form>

    <ul v-if="categories.length" class="flex flex-col gap-2">
      <li
        v-for="name in categories"
        :key="name"
        class="surface-card flex items-center justify-between gap-3 px-4 py-3.5 transition hover:border-brand/20"
      >
        <div v-if="editingName === name" class="flex flex-1 items-center gap-2">
          <Input v-model="editingValue" class="flex-1" @keyup.enter="submitRename(name)" />
          <Button size="sm" variant="primary" @click="submitRename(name)">保存</Button>
          <Button size="sm" @click="cancelRename">取消</Button>
        </div>
        <template v-else>
          <div>
            <span class="font-medium text-slate-900">{{ name }}</span>
            <span class="ml-2 text-sm text-slate-400">{{ store.categoryPromptCount(name) }} 条</span>
          </div>
          <div class="flex gap-1">
            <Button size="sm" @click="startRename(name)">重命名</Button>
            <Button size="sm" variant="danger" @click="handleDelete(name)">删除</Button>
          </div>
        </template>
      </li>
    </ul>
    <Empty v-else description="暂无分类，请添加第一个分类" />
  </div>
</template>
