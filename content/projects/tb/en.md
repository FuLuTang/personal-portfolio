---
title: AI Chatting Mail Summarizer
kind: Personal · Published add-on
tags: Thunderbird, JavaScript, AI Integration, AI Agent
focus:                         # which "您关注哪个方面" views show this project; number = rank (1-3 = big card)
  all: 2
  ai: 2
  fullstack: 5
facts:
  Category: Personal
  Stack: Thunderbird, JavaScript, AI Integration
  Status: Published on Thunderbird Add-ons as “AI Chatting Mail Summarizer”
links:
  - [GitHub](https://github.com/FuLuTang/tb-ai-summary)
  - [Thunderbird Add-ons](https://addons.thunderbird.net/thunderbird/addon/ai-chatting-mail-summarizer/)
gallery:
  - ![Main Interface](tb-ai-summary_main.png)
  - ![Briefing Feature](tb-ai-summary_briefing.png)
  - ![Settings Page](tb-ai-summary_setting.png)
summary: AI agent add-on for Thunderbird, published on Thunderbird Add-ons as “AI Chatting Mail Summarizer”: email summaries, unread briefings and chat.
points:
  - Own ReAct agent loop with high / mid / low model tiers
  - Batch summaries with rate limiting, urgency scores, daily briefing
cover:
  - tb-ai-summary_main.png
  - tb-ai-summary_briefing.png
  - tb-ai-summary_setting.png
---

This Thunderbird extension leverages the WebExtension API and advanced asynchronous JavaScript to integrate LLMs (by OpenAI or other providers' APIs) directly into the email client. The architecture features a modular backend for handling AI requests and a responsive frontend for real-time user interaction.

Notably, this project was built using "Vibe Coding" methodology, allowing for rapid iteration and deployment—the first functional release was published in just under 8 hours of development.

## Key Features

- Context-aware AI Chat for individual emails.
- Support for Ollama (Local) and OpenAI (Cloud).
- Unread Email Briefing & Smart Categorization.
