# 应用图标

将 Windows 图标文件放到此目录：

```
build/icon.ico
```

## 要求

- 格式：`.ico`（Windows 安装包 / exe 用这个）
- 建议尺寸：至少 **256×256**
- 最好包含多尺寸：16、32、48、64、128、256（可用在线工具一键生成）

## 在线制作

1. 准备一张正方形 PNG（如 512×512）
2. 上传到 [icoconvert.com](https://icoconvert.com) 或搜索「png 转 ico」
3. 下载 `icon.ico`，重命名后放到本目录

## 生效

替换图标后重新打包：

```bash
pnpm electron:build
```

新图标会出现在：

- `release/提示词库 Setup x.x.x.exe`（安装程序）
- `release/win-unpacked/提示词库.exe`（绿色版）
- 安装后桌面 / 开始菜单快捷方式

## 网页 favicon（可选）

把 `public/favicon.ico` 也换成同一图标，浏览器标签页会一致。
