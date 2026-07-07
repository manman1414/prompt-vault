/**
 * storage tests
 * @author prompt-vault team
 * @date 2026-07-07
 */

import type { AppState } from '@/types'
import { describe, expect, it, beforeEach } from 'vitest'
import { loadState, saveState, STORAGE_KEY } from '../storage'

describe('storage', () => {
  beforeEach(() => localStorage.clear())

  it('returns default state when empty', () => {
    const state = loadState()
    expect(state.prompts).toEqual([])
    expect(state.categories.length).toBeGreaterThan(0)
  })

  it('persists and loads state', () => {
    const data: AppState = {
      prompts: [
        {
          id: '1',
          title: 't',
          content: 'c',
          category: '写作',
          tags: [],
          createdAt: 1,
          updatedAt: 1,
        },
      ],
      categories: ['写作'],
    }
    saveState(data)
    expect(localStorage.getItem(STORAGE_KEY)).toBeTruthy()
    expect(loadState().prompts[0]?.title).toBe('t')
  })
})
