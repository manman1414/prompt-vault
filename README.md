# prompt-vault

本地 Prompt 管理网页：收藏、分类、搜索、一键复制 AI 提示词。

## 功能

- Prompt 增删改查
- 分类筛选与关键词搜索
- 一键复制到剪贴板
- localStorage 自动保存
- JSON 导入 / 导出备份

## 技术栈

Vue 3 + TypeScript + Vite + Vue Router + Pinia + Element Plus

## 启动

```bash
pnpm install
pnpm dev
```

浏览器访问终端显示的本地地址（默认 `http://localhost:5173`）。

## 测试

```bash
pnpm test
```

## 构建

```bash
pnpm build
```

## 桌面端（Electron）

**localStorage 不用改代码**，API 完全一样。桌面版数据存在应用自己的目录里，和浏览器里的数据**不互通**。

```bash
pnpm install
pnpm electron:dev      # 开发：打开桌面窗口
pnpm electron:build    # 打包：release/ 目录生成 .exe 安装包
```

数据目录（Windows）：`%APPDATA%\提示词库\`
