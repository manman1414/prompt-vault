# prompt-vault

本地 Prompt 管理网页：收藏、分类、搜索、一键复制 AI 提示词。

## 功能

- Prompt 增删改查
- 分类筛选与关键词搜索
- 一键复制到剪贴板
- localStorage 自动保存
- JSON 导入 / 导出备份

## 技术栈

Vue 3 + TypeScript + Vite + Vue Router + Pinia + Tailwind CSS

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
pnpm electron:build         # Windows .exe（当前平台）
pnpm electron:build:win     # Windows .exe
pnpm electron:build:mac     # macOS .dmg
pnpm electron:build:linux   # Linux .AppImage
```

数据目录：
- Windows：`%APPDATA%\提示词库\`
- macOS：`~/Library/Application Support/提示词库/`
- Linux：`~/.config/提示词库/`

## 发版（GitHub Releases 自动打包）

推送 `v*` 标签后，GitHub Actions 会自动：

1. 运行测试
2. 并行打包 **Windows / macOS / Linux** 安装包
3. 上传到 [GitHub Releases](https://github.com/manman1414/prompt-vault/releases)

| 平台 | 产物 |
|------|------|
| Windows | `prompt-vault-setup-x.y.z.exe` |
| macOS | `prompt-vault-setup-x.y.z.dmg` |
| Linux | `prompt-vault-setup-x.y.z.AppImage` |

### 发布新版本

```bash
# 方式一：递增 patch 版本（0.1.0 → 0.1.1）
pnpm release patch

# 方式二：指定版本号
pnpm release 0.2.0

# 推送到 GitHub，触发自动构建
git push origin main
git push origin v0.1.1   # 换成实际标签
```

发版完成后，仓库 **Releases** 区域可下载对应平台的安装包。

> `package.json` 的 `version` 必须与 git 标签一致（如 `0.1.1` 对应 `v0.1.1`）。
