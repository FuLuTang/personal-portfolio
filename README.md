# personal-portfolio

个人作品集网站 —— 唐颢宸（Haochen TANG），计算机科学 / 开发者。

纯静态站点（原生 HTML / CSS / JavaScript，无框架、无构建步骤），直接部署在 GitHub Pages。

线上地址：<https://fulutang.github.io/personal-portfolio/>

## 设计

首页采用 **Bento 格子矩阵**：暖奶油底色 + 白色不等尺寸格子 + 一块深森林绿姓名锚点格 + 琥珀色类别标签。项目截图以 `contain` 完整呈现、不做裁切，首屏即可读完全部核心信息（姓名、身份、简介、教育、语言、技能、抱负、兴趣、联系方式、GitHub 贡献图）。

设计 token 集中在 `css/bento.css` 顶部（`:root` 与 `[data-theme="dark"]`），浅色 / 深色各一套：

| 用途 | 浅色 | 深色 |
| --- | --- | --- |
| 页面底色 | `#FAF7F2` | `#14120E` |
| 格子面 | `#FFFFFF` | `#1C1917` |
| 主色（森林绿） | `#1F6F5C` | `#4FAE93` |
| 点缀（琥珀） | `#D97706` | `#E8A03C` |
| 正文 | `#1C1917` | `#F4EFE7` |
| 次要文字 | `#78716C` | `#B4ADA6` |

## 功能

- **三语切换** —— 英语 / 中文 / 法语，切换时同步更新 `<html lang>` 与浏览器标签标题，选择写入 `localStorage`
- **明暗主题** —— 默认跟随系统偏好，可手动切换并持久化（首页与详情页共用同一套状态）
- **项目筛选** —— 全部 / 校内 / 个人，基于 `data-category` + CSS class，无框架依赖
- **响应式** —— 桌面 4 列格子矩阵 → 平板 2 列 → 手机单列；全断点无横向溢出
- **无障碍** —— 键盘焦点可见（`:focus-visible`）、图片带语义 `alt`、`prefers-reduced-motion` 降级、跳转正文链接

## 目录结构

```text
index.html          首页（Bento 格子矩阵）
project-*.html      8 个项目详情页
css/bento.css       首页样式（设计 token 在此）
css/style.css       详情页样式（配色已与 bento.css 对齐）
js/lang.js          多语言切换
js/theme.js         明暗主题切换
js/filter.js        项目分类筛选
js/projects.js      项目数据（首页当前为静态卡片，此文件保留备用）
assets/             项目截图与素材
```

## 本地预览

```bash
python3 -m http.server 8088
# 浏览器打开 http://localhost:8088/
```

## 部署

推送到 `main` 分支后由 GitHub Pages 自动发布，无构建产物、无额外配置。

## 版本记录

- **v2.0** 首页改版为 Bento 格子矩阵；配色由蓝 / 靛紫 / 品红更换为暖奶油 + 森林绿 + 琥珀；项目截图统一 `contain` 完整显示（不再裁切成条带）；详情页配色对齐主色板，并清除 15 处遗留的旧蓝色内联样式
- **v1.1** 静态重构：修复 `<title>` 内嵌 `<span>` 的无效标记，多语言代码统一为 `en` / `zh` / `fr`，移除内联 `onclick`，补齐键盘可达性与减少动画支持
- **v1.0** 初始版本：单页作品集，含多语言、明暗主题与项目筛选
