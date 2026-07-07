/**
 * localStorage helpers
 * @author prompt-vault team
 * @date 2026-07-07
 */

import type { AppState } from '@/types'
import { DEFAULT_CATEGORIES } from '@/types'

export const STORAGE_KEY = 'prompt-vault-data'

export function defaultState(): AppState {
  return { prompts: [], categories: [...DEFAULT_CATEGORIES] }
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()
    const parsed = JSON.parse(raw) as AppState
    return {
      prompts: parsed.prompts ?? [],
      categories: parsed.categories?.length ? parsed.categories : [...DEFAULT_CATEGORIES],
    }
  } catch {
    return defaultState()
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}
