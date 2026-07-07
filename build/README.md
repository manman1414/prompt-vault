# 应用图标

将 Windows 图标文件放到此目录：

```
build/icon.ico
```

## 要求

- 格式：`.ico`（Windows 安装包 / exe 用这个）
- 建议尺寸：至少 **256×256**
- **必须包含多尺寸**：16、32、48、64、128、256（单尺寸 ico 可能导致 rcedit 写入失败）
- 文件大小通常 **50KB～300KB**；过大或只有 1 个尺寸时，exe 可能仍显示默认 Electron 图标

## 在线制作

1. 准备一张正方形 PNG（512×512）
2. 上传到 [icoconvert.com](https://icoconvert.com) 或搜索「png 转 ico」
3. **勾选多种尺寸**（16–256），下载 `icon.ico`
4. 放到本目录覆盖原文件

## 打包后仍无图标？

1. **安装版桌面图标**：安装脚本已配置为使用 `resources/icon.ico`，请先卸载旧版、删旧快捷方式，再装新的 Setup.exe
2. **exe 内嵌图标失败**：若看到 `Unable to commit changes`，通常是 exe 被占用（应用未关、杀毒软件）。打包前请关闭「提示词库」
3. **刷新图标缓存**：`ie4uinit.exe -show` 或重启电脑
4. **源图**：替换 `build/icon-source.png` 后执行 `pnpm electron:build`

## 网页 favicon（可选）

把 `public/favicon.ico` 也换成同一图标，浏览器标签页会一致。
