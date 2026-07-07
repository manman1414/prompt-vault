<!--
  Prompt list page
  @author prompt-vault team
  @date 2026-07-07
-->
<script setup lang="ts">
import CategoryFilter from '@/components/CategoryFilter.vue'
import PromptCard from '@/components/PromptCard.vue'
import PromptDetailModal from '@/components/PromptDetailModal.vue'
import Button from '@/components/ui/Button.vue'
import Empty from '@/components/ui/Empty.vue'
import Input from '@/components/ui/Input.vue'
import { confirm } from '@/composables/useConfirm'
import { useToast } from '@/composables/useToast'
import { usePromptStore } from '@/stores/prompt'
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'

const store = usePromptStore()
const toast = useToast()
const { categories } = storeToRefs(store)

const selectedCategory = ref('')
const keyword = ref('')
const batchMode = ref(false)
const selectedIds = ref<string[]>([])
const activePromptId = ref<string | null>(null)

const list = computed(() => store.filteredPrompts(selectedCategory.value, keyword.value))
const selectedSet = computed(() => new Set(selectedIds.value))
const allSelected = computed(
  () => list.value.length > 0 && list.value.every((item) => selectedSet.value.has(item.id)),
)

watch([selectedCategory, keyword], () => {
  selectedIds.value = []
})

function toggleBatchMode() {
  batchMode.value = !batchMode.value
  selectedIds.value = []
}

function toggleSelect(id: string, checked: boolean) {
  if (checked) {
    if (!selectedIds.value.includes(id)) {
      selectedIds.value = [...selectedIds.value, id]
    }
  } else {
    selectedIds.value = selectedIds.value.filter((item) => item !== id)
  }
}

function toggleSelectAll() {
  if (allSelected.value) {
    selectedIds.value = []
  } else {
    selectedIds.value = list.value.map((item) => item.id)
  }
}

async function deleteSelected() {
  const count = selectedIds.value.length
  if (!count) return
  try {
    await confirm({
      message: `确定删除选中的 ${count} 条提示词？`,
      variant: 'danger',
    })
    store.removePrompts(selectedIds.value)
    selectedIds.value = []
    toast.success(`已删除 ${count} 条`)
    if (!list.value.length) {
      batchMode.value = false
    }
  } catch {
    /* cancelled */
  }
}
</script>

<template>
  <div>
    <div class="mb-5 flex items-center gap-2">
      <Input v-model="keyword" class="flex-1" clearable placeholder="搜索标题、内容或标签" />
      <Button v-if="list.length" @click="toggleBatchMode">
        {{ batchMode ? '完成' : '管理' }}
      </Button>
    </div>

    <div
      v-if="batchMode && list.length"
      class="mb-5 flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200/70 bg-white/80 p-3 shadow-sm backdrop-blur-sm"
    >
      <Button size="sm" @click="toggleSelectAll">
        {{ allSelected ? '取消全选' : '全选' }}
      </Button>
      <Button size="sm" variant="danger" :disabled="!selectedIds.length" @click="deleteSelected">
        删除选中 ({{ selectedIds.length }})
      </Button>
    </div>

    <CategoryFilter v-model="selectedCategory" :categories="categories" class="mb-5" />

    <div v-if="list.length" class="flex flex-col gap-3">
      <PromptCard
        v-for="item in list"
        :key="item.id"
        :prompt="item"
        :selectable="batchMode"
        :selected="selectedSet.has(item.id)"
        @update:selected="toggleSelect(item.id, $event)"
        @open="activePromptId = $event"
      />
    </div>
    <Empty v-else description="暂无提示词，点击顶部「新建」添加" />

    <PromptDetailModal
      :prompt-id="activePromptId"
      @close="activePromptId = null"
      @deleted="activePromptId = null"
    />
  </div>
</template>
