# prompt-vault 设计规格

> 作者：prompt-vault team / Cursor Agent  
> 日期：2026-07-07  
> 状态：已确认（方案 B）

## 1. 概述

**prompt-vault** 是一个本地 Prompt 管理工具。用户可收藏、分类、搜索 AI 提示词，并一键复制到剪贴板。数据保存在浏览器 localStorage，支持 JSON 导入/导出备份。

### 1.1 目标

- 提供简洁好用的 Prompt 管理界面
- Vue 3 + Vue Router + Pinia 技术栈
- v0.1 纯前端，无需后端
- 支持分类、搜索、复制、导入/导出

### 1.2 非目标（v0.1 不做）

- 用户登录 / 云端同步
- 调用 AI API 生成 Prompt
- 多语言 / 暗色主题
- 协作分享

---

## 2. 方案选型

采用 **方案 B：多页面 + Pinia**。

| 维度 | 决策 |
|------|------|
| 架构 | 单仓库 SPA |
| 路由 | Vue Router 多页面 |
| 状态 | Pinia + localStorage 持久化 |
| UI | Element Plus |
| 存储 | 浏览器 localStorage |

---

## 3. 页面结构

| 路由 | 页面 | 功能 |
|------|------|------|
| `/` | PromptList | 列表、分类筛选、搜索、一键复制 |
| `/prompt/new` | PromptEdit | 新建 Prompt |
| `/prompt/:id/edit` | PromptEdit | 编辑 Prompt |
| `/settings` | Settings | 导入/导出 JSON、清空数据 |

---

## 4. 数据模型

```ts
interface Prompt {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  createdAt: number
  updatedAt: number
}

interface AppState {
  prompts: Prompt[]
  categories: string[]
}
```

### 预设分类

`写作`、`编程`、`翻译`、`分析`、`其他`

用户可在编辑页输入自定义分类（写入 categories 列表）。

---

## 5. 核心功能

### 5.1 Prompt CRUD

- 新建/编辑：标题（必填）、内容（必填）、分类、标签（逗号分隔或 tag 输入）
- 删除：列表页操作，需确认

### 5.2 列表与筛选

- 左侧或顶部分类 Tab/菜单
- 关键词搜索（标题 + 内容 + 标签）
- 卡片展示：标题、分类、内容摘要（前 80 字）、更新时间

### 5.3 一键复制

- 点击「复制」→ `navigator.clipboard.writeText(content)`
- 成功/失败 Toast 提示

### 5.4 持久化

- Pinia store 变更后写入 localStorage（key: `prompt-vault-data`）
- 应用启动时 hydrate

### 5.5 导入 / 导出

- **导出**：下载 `prompt-vault-backup.json`
- **导入**：上传 JSON，合并或覆盖（v0.1 采用覆盖 + 确认）
- **清空**：删除全部数据，需二次确认

---

## 6. 项目结构

```
prompt-vault/
├── src/
│   ├── main.ts
│   ├── App.vue
│   ├── router/index.ts
│   ├── stores/prompt.ts
│   ├── views/
│   │   ├── PromptList.vue
│   │   ├── PromptEdit.vue
│   │   └── Settings.vue
│   ├── components/
│   │   ├── PromptCard.vue
│   │   └── CategoryFilter.vue
│   ├── types/index.ts
│   └── utils/storage.ts
├── docs/superpowers/
│   ├── specs/
│   └── plans/
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## 7. 技术栈

| 项 | 版本/库 |
|----|---------|
| Vue | ^3.5 |
| Vue Router | ^4 |
| Pinia | ^2 |
| Element Plus | ^2.9 |
| TypeScript | ^5.7 |
| Vite | ^5.4 |
| Vitest | ^2（工具函数单测） |

---

## 8. 错误处理

| 场景 | 处理 |
|------|------|
| 复制失败 | ElMessage.warning，提示手动复制 |
| 导入 JSON 格式错误 | ElMessage.error，不修改现有数据 |
| 编辑不存在的 id | 跳转 404 或回列表页 |
| localStorage 不可用 | 降级为内存模式 + 警告 |

---

## 9. 测试策略

- `utils/storage.ts`：序列化/反序列化单测
- `stores/prompt.ts`：CRUD、搜索、导入导出逻辑单测（Pinia testing）
- 手动测试：复制、导入导出、刷新后数据保留

---

## 10. 后续扩展（v0.2+）

- 收藏 / 置顶
- Markdown 预览
- 暗色主题
- 可选云端同步
