---
title: 霓虹 UNO
kind: 校内项目 · 团队
tags: Vue 3, Node.js, Socket.io, AI Bots
facts:
  分类: 校内（团队项目）
  技术栈: Vue 3, Node.js, Socket.io
  玩法: 两队对战，扫码加入，AI 机器人
links:
  - [GitHub](https://github.com/yassine9-1/neon_uno)
gallery:
  - ![NEON-UNO game interface](neon_uno_preview.png)
summary: 玩家扫码加入，在投影主屏上分两队同时出牌，并提供多种难度的 AI 机器人。
points:
  - 提交最多：11 个 PR 被合并（迁移 Vue 3、大厅、AI 玩家）
  - AI 三档：随机、启发式、两步前瞻
---

NEON-UNO 是一款受经典 UNO 启发的超大规模多人共玩卡牌游戏。专为线下社交聚会设计，它利用大屏幕（投影仪或显示器）作为公共竞技场，而玩家则使用自己的智能手机作为个人游戏手柄。

## 核心功能

- 主画面投影到大屏，所有玩家分两队同时出牌，并提供多种难度的 AI 机器人。
- 线下同步体验：扫码即刻加入，基于 Socket.io 的实时交互。
- 霓虹视觉：蓝粉团队主题设计，包含漂浮分数反馈与粒子特效。
- 评分系统：包含手牌数量、颜色多样性及连续出牌加成的非线性计分引擎。
- 交互机制：摇一摇摸牌（加速度计）、全队冰冻特效及随机发生的“病毒”事件。
