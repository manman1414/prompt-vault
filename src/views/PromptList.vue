<!--
  Prompt list page
  @author prompt-vault team
  @date 2026-07-07
-->
<script setup lang="ts">
import CategoryFilter from '@/components/CategoryFilter.vue'
import PromptCard from '@/components/PromptCard.vue'
import Empty from '@/components/ui/Empty.vue'
import Input from '@/components/ui/Input.vue'
import { usePromptStore } from '@/stores/prompt'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

const store = usePromptStore()
const { categories } = storeToRefs(store)

const selectedCategory = ref('')
const keyword = ref('')

const list = computed(() => store.filteredPrompts(selectedCategory.value, keyword.value))
</script>

<template>
  <div>
    <div class="mb-4">
      <Input v-model="keyword" clearable placeholder="搜索标题、内容或标签" />
    </div>

    <CategoryFilter v-model="selectedCategory" :categories="categories" class="mb-5" />

    <div v-if="list.length" class="flex flex-col gap-3">
      <PromptCard v-for="item in list" :key="item.id" :prompt="item" />
    </div>
    <Empty v-else description="暂无 Prompt，点击「新建」添加" />
  </div>
</template>
