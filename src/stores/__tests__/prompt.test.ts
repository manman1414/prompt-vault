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

  it('keeps stored category order on hydrate', () => {
    localStorage.setItem(
      'prompt-vault-data',
      JSON.stringify({ prompts: [], categories: ['自定义', '写作'] }),
    )
    setActivePinia(createPinia())
    const store = usePromptStore()
    store.hydrate()
    expect(store.categories).toEqual(['自定义', '写作'])
  })

  it('manages categories', () => {
    const store = usePromptStore()
    store.hydrate()

    expect(store.addCategory('自定义')).toEqual({ ok: true })
    expect(store.addCategory('自定义')).toEqual({ ok: false, reason: 'duplicate' })

    store.addPrompt({ title: 'A', content: 'x', category: '自定义', tags: [] })
    expect(store.categoryPromptCount('自定义')).toBe(1)

    expect(store.renameCategory('自定义', '新分类')).toEqual({ ok: true })
    expect(store.prompts[0]?.category).toBe('新分类')

    expect(store.removeCategory('新分类')).toEqual({ ok: false, reason: 'has_prompts', count: 1 })
    store.removePrompts([store.prompts[0]!.id])
    expect(store.removeCategory('新分类')).toEqual({ ok: true })
  })

  it('removes multiple prompts', () => {
    const store = usePromptStore()
    const a = store.addPrompt({ title: 'A', content: '1', category: '写作', tags: [] })
    const b = store.addPrompt({ title: 'B', content: '2', category: '写作', tags: [] })
    store.removePrompts([a.id, b.id])
    expect(store.prompts).toHaveLength(0)
  })
})
