---
title: 邮件智能摘要助手 (AI Chatting Mail Summarizer)
kind: 个人项目
tags: Thunderbird, JavaScript, AI Integration, AI Agent
facts:
  分类: 个人
  技术栈: Thunderbird, JavaScript, AI Integration
  状态: 已以 “AI Chatting Mail Summarizer” 之名发布至 Thunderbird 扩展商店
links:
  - [GitHub](https://github.com/FuLuTang/tb-ai-summary)
  - [Thunderbird 扩展商店](https://addons.thunderbird.net/thunderbird/addon/ai-chatting-mail-summarizer/)
gallery:
  - ![Main Interface](assets/tb-ai-summary_main.png)
  - ![Briefing Feature](assets/tb-ai-summary_briefing.png)
  - ![Settings Page](assets/tb-ai-summary_setting.png)
---

此 Thunderbird 扩展利用 WebExtension API 和高级异步 JavaScript，将本地大语言模型直接集成到邮件客户端中（使用LLM API如OpenAI、Ollama等）。架构采用模块化后端处理 AI 请求，并配备响应式前端以实现实时用户交互。

值得一提的是，该项目采用“Vibe Coding”方法构建，实现了极速迭代与部署——仅用约 8 小时开发时间便发布了第一个可用版本。

## 主要功能

- 基于上下文的单封邮件 AI 对话。
- 支持 Ollama（本地）和 OpenAI（云端）。
- 未读邮件简报与智能分类。
