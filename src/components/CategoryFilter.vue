<!--
  Category filter
  @author prompt-vault team
  @date 2026-07-07
-->
<script setup lang="ts">
defineProps<{
  categories: string[]
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="category-filter">
    <button
      type="button"
      class="category-filter__item"
      :class="{ 'is-active': modelValue === '' }"
      @click="emit('update:modelValue', '')"
    >
      全部
    </button>
    <button
      v-for="category in categories"
      :key="category"
      type="button"
      class="category-filter__item"
      :class="{ 'is-active': modelValue === category }"
      @click="emit('update:modelValue', category)"
    >
      {{ category }}
    </button>
  </div>
</template>

<style scoped>
.category-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.category-filter__item {
  border: 1px solid #dcdfe6;
  background: #fff;
  border-radius: 16px;
  padding: 4px 12px;
  cursor: pointer;
  font-size: 13px;
}

.category-filter__item.is-active {
  border-color: #409eff;
  color: #409eff;
  background: #ecf5ff;
}
</style>
