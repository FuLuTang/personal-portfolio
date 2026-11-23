# 项目内容怎么写

首页的项目卡片和每个项目的详情页，都由这个文件夹里的 md 文件生成。**加新项目不用改 HTML**，只要新建一个文件夹就行。

## 新建项目

```
content/projects/<项目名>/
    en.md          必须有，其他语言缺少的字段都从这里取
    zh.md          可选
    fr.md          可选
    图片.png        和 md 放在一起，md 里直接写文件名
```

`<项目名>` 只能用小写字母、数字和 `-`，它就是详情页地址 `project.html?p=<项目名>`。

推送到 main 后，GitHub Action「Update project index」会自动更新 `index.json`（线上首页靠它知道有哪些项目）。本地用 `python -m http.server` 打开时不需要它，新文件夹会被直接识别。

## 图片放在哪里，就在哪里显示

同一张图可以出现在多个地方，也可以只出现在一个地方，完全由你写在哪决定：

| 写在哪 | 显示在哪 | 适合放什么 |
|---|---|---|
| 正文里 `![说明](图.png)` | 只在详情页正文的那个位置 | 架构图、流程图、需要配合文字解释的图 |
| 头信息 `gallery:` | 详情页底部的相册 | 界面截图、成品效果图 |
| 头信息 `cover:` | 首页卡片上那一摞照片 | 最能代表项目的 2–5 张截图 |

- 不写 `cover:` 时，首页直接用 `gallery:` 的图。所以如果相册里有不适合放首页的图，就写一个 `cover:` 只列想放的那几张。
- 正文里的图不会自动进相册，也不会上首页。
- 详情页上点击任何图（正文或相册）都能放大查看。

## 头信息（两条 `---` 之间）

格式是简化版 YAML：一行一个 `键: 值`；列表写成下一行开头缩进的 `  - 项`；键值对写成下一行开头缩进的 `  名称: 值`。不要加引号，值不能换行。

```markdown
---
title: 项目全名                      # 详情页大标题
card_title: 短标题                   # 可选，首页卡片用
kind: 个人项目 · 2026                # 类型标签
tags: Python, FastAPI, AI Agent
focus:                              # 首页「您关注哪个方面？」：这个项目出现在哪些方向里，数字是排名
  all: 3                            # all = 综合；fullstack = 全栈；ai = AI；xr = XR/游戏/具身智能
  ai: 1                             # 排名 1–3 = 大卡片，其余是下面的小卡片；不写的方向就不显示
summary: 首页卡片上的一句话简介
points:                             # 只在大卡片上显示
  - 要点一
  - 要点二
facts:                              # 详情页右侧「项目信息」
  技术栈: Python · FastAPI
  状态: 已上线
links:
  - [GitHub](https://github.com/...)
gallery:                            # 详情页底部截图
  - ![主界面](main.png)
  - ![设置页](settings.png)
cover:                              # 可选，首页卡片的那一摞照片（默认用 gallery）
  - main.png
  - settings.png
plate: 截图暂未公开                   # 没有截图时，代替 gallery 显示的文字
flow:                               # 没有图片时，首页卡片可以用小流程图代替
  - 前端 {Vue 3} (core)
  - API; 数据库 (muted)
flow_arrows: both                   # 可选，箭头双向
---
```

- `focus`、`tags`、`cover`、`gallery` 这些和语言无关的字段，只写在 en.md 里就行。
- zh.md / fr.md 里只需要写要翻译的字段（title、kind、summary、points、facts……），没写的都从 en.md 取。正文没写也用英文的。
- `flow` 每一项是一列，同一列里的多个框用 `;` 隔开，`{}` 里是小字，末尾 `(core)` / `(out)` / `(muted)` 是样式。

## 正文（第二个 `---` 下面）

普通 Markdown。第一个 `##` 标题之前的段落会用大号字显示，作为导语。

- 图片：`![说明](文件名.png)`，路径相对于这个 md 所在的文件夹。
- Mermaid 图：

  ````markdown
  ```mermaid
  flowchart LR
      A["前端"] --> B["后端"]
  ```
  ````
