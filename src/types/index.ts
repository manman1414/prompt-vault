/**
 * App types
 * @author prompt-vault team
 * @date 2026-07-07
 */

export interface Prompt {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  createdAt: number
  updatedAt: number
}

export interface AppState {
  prompts: Prompt[]
  categories: string[]
}

export const DEFAULT_CATEGORIES = ['写作', '编程', '翻译', '分析', '其他']
