# prompt-vault MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 搭建一个 Vue 3 Prompt 管理 SPA，支持 CRUD、分类、搜索、复制、localStorage 持久化、JSON 导入导出。

**Architecture:** 单仓库 SPA；Vue Router 分 4 个路由；Pinia 单一 `prompt` store 管理 prompts 与 categories；storage 工具负责 localStorage 读写；Element Plus 提供 UI 组件。

**Tech Stack:** Vue 3, Vue Router 4, Pinia 2, Element Plus, TypeScript, Vite, Vitest

---

## File Map

| 文件 | 职责 |
|------|------|
| `src/types/index.ts` | Prompt、AppState 类型 |
| `src/utils/storage.ts` | localStorage 读写、默认值 |
| `src/stores/prompt.ts` | CRUD、搜索、导入导出 |
| `src/router/index.ts` | 路由定义 |
| `src/components/PromptCard.vue` | 单条 Prompt 卡片 + 复制/编辑/删除 |
| `src/components/CategoryFilter.vue` | 分类筛选 |
| `src/views/PromptList.vue` | 列表 + 搜索 |
| `src/views/PromptEdit.vue` | 新建/编辑表单 |
| `src/views/Settings.vue` | 导入/导出/清空 |
| `src/App.vue` | 布局 + 导航 |
| `src/main.ts` | 入口，注册 Pinia/Router/ElementPlus |

---

### Task 1: 项目脚手架

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `src/main.ts`, `src/App.vue`, `src/vite-env.d.ts`

- [ ] **Step 1: 初始化 Vite Vue TS 项目**

```bash
cd C:\Users\Administrator\Projects
pnpm create vite prompt-vault --template vue-ts
cd prompt-vault
pnpm add vue-router pinia element-plus
pnpm add -D vitest @vue/test-utils jsdom
```

- [ ] **Step 2: 配置 vite.config.ts**

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    environment: 'jsdom',
  },
})
```

- [ ] **Step 3: 配置 main.ts 注册插件**

```ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'

createApp(App).use(createPinia()).use(router).use(ElementPlus).mount('#app')
```

- [ ] **Step 4: 验证启动**

Run: `pnpm dev`  
Expected: 页面可访问，无报错

---

### Task 2: 类型与 storage 工具

**Files:**
- Create: `src/types/index.ts`
- Create: `src/utils/storage.ts`
- Create: `src/utils/__tests__/storage.test.ts`

- [ ] **Step 1: 写 failing test**

```ts
import { describe, expect, it, beforeEach } from 'vitest'
import { loadState, saveState, STORAGE_KEY } from '../storage'
import type { AppState } from '@/types'

describe('storage', () => {
  beforeEach(() => localStorage.clear())

  it('returns default state when empty', () => {
    const state = loadState()
    expect(state.prompts).toEqual([])
    expect(state.categories.length).toBeGreaterThan(0)
  })

  it('persists and loads state', () => {
    const data: AppState = {
      prompts: [{ id: '1', title: 't', content: 'c', category: '写作', tags: [], createdAt: 1, updatedAt: 1 }],
      categories: ['写作'],
    }
    saveState(data)
    expect(localStorage.getItem(STORAGE_KEY)).toBeTruthy()
    expect(loadState().prompts[0]?.title).toBe('t')
  })
})
```

- [ ] **Step 2: 运行测试确认 FAIL**

Run: `pnpm vitest run src/utils/__tests__/storage.test.ts`  
Expected: FAIL — module not found

- [ ] **Step 3: 实现 types 与 storage**

`src/types/index.ts`:

```ts
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
```

`src/utils/storage.ts`:

```ts
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
```

- [ ] **Step 4: 运行测试确认 PASS**

Run: `pnpm vitest run src/utils/__tests__/storage.test.ts`  
Expected: PASS

---

### Task 3: Pinia Store

**Files:**
- Create: `src/stores/prompt.ts`
- Create: `src/stores/__tests__/prompt.test.ts`

- [ ] **Step 1: 写 store 测试**

```ts
import { setActivePinia, createPinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { usePromptStore } from '../prompt'

describe('prompt store', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('adds and finds prompt', () => {
    const store = usePromptStore()
    const p = store.addPrompt({ title: 'Test', content: 'Hello', category: '写作', tags: [] })
    expect(store.prompts).toHaveLength(1)
    expect(store.getById(p.id)?.title).toBe('Test')
  })

  it('filters by keyword', () => {
    const store = usePromptStore()
    store.addPrompt({ title: 'Vue', content: 'Composition API', category: '编程', tags: [] })
    store.addPrompt({ title: 'Other', content: 'xyz', category: '其他', tags: [] })
    expect(store.filteredPrompts('', 'Vue')).toHaveLength(1)
  })
})
```

- [ ] **Step 2: 实现 store**

核心 actions: `hydrate`, `persist`, `addPrompt`, `updatePrompt`, `removePrompt`, `importState`, `exportState`, `clearAll`, `filteredPrompts(category, keyword)`

每次 mutation 后调用 `persist()`。

- [ ] **Step 3: 运行测试 PASS**

Run: `pnpm vitest run src/stores/__tests__/prompt.test.ts`

---

### Task 4: 路由与布局

**Files:**
- Create: `src/router/index.ts`
- Modify: `src/App.vue`

- [ ] **Step 1: 定义路由**

```ts
import { createRouter, createWebHistory } from 'vue-router'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'list', component: () => import('@/views/PromptList.vue') },
    { path: '/prompt/new', name: 'new', component: () => import('@/views/PromptEdit.vue') },
    { path: '/prompt/:id/edit', name: 'edit', component: () => import('@/views/PromptEdit.vue') },
    { path: '/settings', name: 'settings', component: () => import('@/views/Settings.vue') },
  ],
})
```

- [ ] **Step 2: App.vue 布局**

顶部导航：Prompt 库 | 新建 | 设置；`<router-view />`

- [ ] **Step 3: main.ts 启动时 store.hydrate()**

---

### Task 5: 列表页与组件

**Files:**
- Create: `src/components/CategoryFilter.vue`
- Create: `src/components/PromptCard.vue`
- Create: `src/views/PromptList.vue`

- [ ] **Step 1: CategoryFilter** — 展示 categories，emit `update:modelValue`

- [ ] **Step 2: PromptCard** — 标题、摘要、复制按钮（clipboard API + ElMessage）

- [ ] **Step 3: PromptList** — 搜索框 + CategoryFilter + PromptCard 列表 + 空状态 ElEmpty

---

### Task 6: 编辑页

**Files:**
- Create: `src/views/PromptEdit.vue`

- [ ] **Step 1: 新建模式** — `/prompt/new`，表单提交调用 `addPrompt`，跳转 `/`

- [ ] **Step 2: 编辑模式** — 读 `:id`，加载 prompt，提交 `updatePrompt`

- [ ] **Step 3: 表单校验** — 标题、内容必填；分类可选预设或自定义

---

### Task 7: 设置页

**Files:**
- Create: `src/views/Settings.vue`

- [ ] **Step 1: 导出** — 下载 JSON 文件

- [ ] **Step 2: 导入** — file input，parse 后 `importState`，错误 toast

- [ ] **Step 3: 清空** — ElMessageBox.confirm 后 `clearAll`

---

### Task 8: 收尾

- [ ] **Step 1: 运行全部测试**

Run: `pnpm vitest run`  
Expected: ALL PASS

- [ ] **Step 2: 构建验证**

Run: `pnpm build`  
Expected: 无 TS 错误

- [ ] **Step 3: README**

简要说明功能、启动命令、技术栈

---

## Spec Coverage Check

| 需求 | Task |
|------|------|
| Prompt CRUD | Task 3, 5, 6 |
| 分类筛选 | Task 5 |
| 搜索 | Task 3, 5 |
| 一键复制 | Task 5 |
| localStorage | Task 2, 3 |
| 导入/导出 | Task 7 |
| 多页面路由 | Task 4 |

## Execution Handoff

Plan complete. Two execution options:

1. **Subagent-Driven** — 每个 Task 派子 agent，逐 task 审查
2. **Inline Execution** — 当前会话按 Task 顺序直接实现
