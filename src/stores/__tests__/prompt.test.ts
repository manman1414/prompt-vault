/**
 * prompt store tests
 * @author prompt-vault team
 * @date 2026-07-07
 */

import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { usePromptStore } from '../prompt'

describe('prompt store', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('adds and finds prompt', () => {
    const store = usePromptStore()
    const prompt = store.addPrompt({
      title: 'Test',
      content: 'Hello',
      category: '写作',
      tags: [],
    })
    expect(store.prompts).toHaveLength(1)
    expect(store.getById(prompt.id)?.title).toBe('Test')
  })

  it('filters by keyword', () => {
    const store = usePromptStore()
    store.addPrompt({ title: 'Vue', content: 'Composition API', category: '编程', tags: [] })
    store.addPrompt({ title: 'Other', content: 'xyz', category: '其他', tags: [] })
    expect(store.filteredPrompts('', 'Vue')).toHaveLength(1)
  })

  it('rejects duplicate titles', () => {
    const store = usePromptStore()
    store.addPrompt({ title: 'Same', content: 'A', category: '写作', tags: [] })
    expect(store.isTitleTaken('Same')).toBe(true)
    expect(store.isTitleTaken(' Same ')).toBe(true)
  })

  it('allows same title when editing current prompt', () => {
    const store = usePromptStore()
    const prompt = store.addPrompt({ title: 'Same', content: 'A', category: '写作', tags: [] })
    expect(store.isTitleTaken('Same', prompt.id)).toBe(false)
  })
})
