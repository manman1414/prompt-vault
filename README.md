# prompt-vault

本地提示词管理工具：收藏、分类、搜索、一键复制 AI 提示词。

## 功能

- 提示词增删改查
- 分类筛选与关键词搜索
- 一键复制到剪贴板
- 本地自动保存
- JSON 导入 / 导出备份
- 桌面端自动更新（检查 GitHub Releases）

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

## 桌面端（Electron，仅 Windows）

桌面版数据存在应用自己的目录里，和浏览器里的数据**不互通**。

```bash
pnpm install
pnpm electron:dev      # 开发：打开桌面窗口
pnpm electron:build    # 打包 Windows .exe 安装包
```

数据目录：`%APPDATA%\提示词库\`

### 环境要求

| 项目 | 要求 |
|------|------|
| 系统 | Windows 10 / 11（64 位） |
| Node.js / 编程环境 | 不需要，安装即用 |
| 网络 | 不必须，纯本地运行 |
| 磁盘空间 | 约 200 MB |
| 内存 | 建议 4 GB 及以上 |

### 注意事项

1. **桌面版与浏览器版数据不互通**  
   桌面版数据保存在应用目录，浏览器 `pnpm dev` 的数据在浏览器本地存储里，两者不会自动同步。

2. **安装包未做代码签名**  
   首次安装可能弹出 SmartScreen 警告，需选择「仍要运行」。

## 发版（GitHub Releases 自动打包）

推送 `v*` 标签后，GitHub Actions 会自动：

1. 运行测试
2. 打包 Windows 安装包
3. 上传到 [GitHub Releases](https://github.com/manman1414/prompt-vault/releases)

安装包：`prompt-vault-setup-x.y.z-windows.exe`

### 发布新版本

```bash
pnpm release patch
git push origin main
git push origin v0.3.0   # 换成实际标签
```

发版完成后，在 **Releases** 下载 Windows 安装包。

发版产物需包含 `latest.yml`（及 `.blockmap`），供桌面端自动更新读取。

> `package.json` 的 `version` 必须与 git 标签一致（如 `0.3.0` 对应 `v0.3.0`）。
