<!--
  Prompt list page
  @author prompt-vault team
  @date 2026-07-07
-->
<script setup lang="ts">
import CategoryFilter from '@/components/CategoryFilter.vue'
import PromptCard from '@/components/PromptCard.vue'
import { usePromptStore } from '@/stores/prompt'
import { ElEmpty, ElInput } from 'element-plus'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

const store = usePromptStore()
const { categories } = storeToRefs(store)

const selectedCategory = ref('')
const keyword = ref('')

const list = computed(() => store.filteredPrompts(selectedCategory.value, keyword.value))
</script>

<template>
  <div class="prompt-list">
    <div class="prompt-list__toolbar">
      <ElInput v-model="keyword" clearable placeholder="搜索标题、内容或标签" />
    </div>

    <CategoryFilter v-model="selectedCategory" :categories="categories" class="prompt-list__categories" />

    <div v-if="list.length" class="prompt-list__items">
      <PromptCard v-for="item in list" :key="item.id" :prompt="item" />
    </div>
    <ElEmpty v-else description="暂无 Prompt，点击「新建」添加" />
  </div>
</template>

<style scoped>
.prompt-list__toolbar {
  margin-bottom: 16px;
}

.prompt-list__categories {
  margin-bottom: 20px;
}

.prompt-list__items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
