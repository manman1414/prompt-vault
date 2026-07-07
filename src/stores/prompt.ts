/**
 * Prompt Pinia store
 * @author prompt-vault team
 * @date 2026-07-07
 */

import type { AppState, Prompt } from '@/types'
import { defaultState, loadState, saveState } from '@/utils/storage'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface PromptInput {
  title: string
  content: string
  category: string
  tags: string[]
}

function createId(): string {
  return crypto.randomUUID()
}

function normalizeCategoryName(name: string) {
  return name.trim()
}

export const usePromptStore = defineStore('prompt', () => {
  const prompts = ref<Prompt[]>([])
  const categories = ref<string[]>([])

  function hydrate() {
    const state = loadState()
    prompts.value = state.prompts
    categories.value = [...state.categories]
  }

  function persist() {
    saveState({ prompts: prompts.value, categories: categories.value })
  }

  function ensureCategory(category: string) {
    const trimmed = normalizeCategoryName(category)
    if (!trimmed) return
    if (!categories.value.includes(trimmed)) {
      categories.value.push(trimmed)
    }
  }

  function addPrompt(input: PromptInput): Prompt {
    ensureCategory(input.category)
    const now = Date.now()
    const prompt: Prompt = {
      id: createId(),
      title: input.title.trim(),
      content: input.content.trim(),
      category: input.category.trim() || '其他',
      tags: input.tags,
      createdAt: now,
      updatedAt: now,
    }
    prompts.value.unshift(prompt)
    persist()
    return prompt
  }

  function updatePrompt(id: string, input: PromptInput): boolean {
    const index = prompts.value.findIndex((item) => item.id === id)
    if (index === -1) return false
    ensureCategory(input.category)
    const existing = prompts.value[index]!
    prompts.value[index] = {
      ...existing,
      title: input.title.trim(),
      content: input.content.trim(),
      category: input.category.trim() || '其他',
      tags: input.tags,
      updatedAt: Date.now(),
    }
    persist()
    return true
  }

  function removePrompt(id: string) {
    prompts.value = prompts.value.filter((item) => item.id !== id)
    persist()
  }

  function removePrompts(ids: string[]) {
    if (!ids.length) return
    const idSet = new Set(ids)
    prompts.value = prompts.value.filter((item) => !idSet.has(item.id))
    persist()
  }

  function getById(id: string) {
    return prompts.value.find((item) => item.id === id) ?? null
  }

  function isTitleTaken(title: string, excludeId?: string) {
    const normalized = title.trim()
    if (!normalized) return false
    return prompts.value.some(
      (item) => item.id !== excludeId && item.title.trim() === normalized,
    )
  }

  function categoryPromptCount(name: string) {
    return prompts.value.filter((item) => item.category === name).length
  }

  function addCategory(name: string): { ok: true } | { ok: false; reason: 'empty' | 'duplicate' } {
    const trimmed = normalizeCategoryName(name)
    if (!trimmed) return { ok: false, reason: 'empty' }
    if (categories.value.includes(trimmed)) return { ok: false, reason: 'duplicate' }
    categories.value.push(trimmed)
    persist()
    return { ok: true }
  }

  function renameCategory(
    oldName: string,
    newName: string,
  ): { ok: true } | { ok: false; reason: 'empty' | 'duplicate' | 'not_found' } {
    const trimmed = normalizeCategoryName(newName)
    if (!trimmed) return { ok: false, reason: 'empty' }
    const index = categories.value.indexOf(oldName)
    if (index === -1) return { ok: false, reason: 'not_found' }
    if (trimmed !== oldName && categories.value.includes(trimmed)) {
      return { ok: false, reason: 'duplicate' }
    }
    categories.value[index] = trimmed
    for (const prompt of prompts.value) {
      if (prompt.category === oldName) {
        prompt.category = trimmed
      }
    }
    persist()
    return { ok: true }
  }

  function removeCategory(
    name: string,
  ): { ok: true } | { ok: false; reason: 'not_found' | 'has_prompts'; count?: number } {
    const index = categories.value.indexOf(name)
    if (index === -1) return { ok: false, reason: 'not_found' }
    const count = categoryPromptCount(name)
    if (count > 0) return { ok: false, reason: 'has_prompts', count }
    categories.value.splice(index, 1)
    persist()
    return { ok: true }
  }

  function filteredPrompts(category: string, keyword: string) {
    const q = keyword.trim().toLowerCase()
    return prompts.value.filter((item) => {
      if (category && item.category !== category) return false
      if (!q) return true
      const haystack = [item.title, item.content, item.tags.join(' ')].join(' ').toLowerCase()
      return haystack.includes(q)
    })
  }

  function exportState(): AppState {
    return { prompts: prompts.value, categories: categories.value }
  }

  function importState(state: AppState) {
    prompts.value = state.prompts ?? []
    categories.value = state.categories?.length ? [...state.categories] : defaultState().categories
    persist()
  }

  function clearAll() {
    const empty = defaultState()
    prompts.value = empty.prompts
    categories.value = empty.categories
    persist()
  }

  return {
    prompts,
    categories,
    hydrate,
    addPrompt,
    updatePrompt,
    removePrompt,
    removePrompts,
    getById,
    isTitleTaken,
    categoryPromptCount,
    addCategory,
    renameCategory,
    removeCategory,
    filteredPrompts,
    exportState,
    importState,
    clearAll,
  }
})
