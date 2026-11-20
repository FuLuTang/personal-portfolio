---
title: NEON-UNO
kind: School · Team project
tags: Vue 3, Node.js, Socket.io, AI Bots
facts:
  Category: School (team project)
  Stack: Vue 3, Node.js, Socket.io
  Players: Two teams, QR-code join, AI bots
links:
  - [GitHub](https://github.com/yassine9-1/neon_uno)
gallery:
  - ![NEON-UNO game interface](neon_uno_preview.png)
category: school
featured: true
order: 4
summary: Players join by QR code and play simultaneously in two teams on a projector main screen, with AI bots at several difficulty levels.
points:
  - Top committer: 11 merged PRs (Vue 3 migration, lobby, AI players)
  - AI tiers: random, heuristic, 2-step lookahead
cover:
  - neon_uno_preview.png
---

NEON-UNO is a massive multiplayer colocalized card game inspired by the classic UNO. Designed for social gatherings, it uses a large screen (projector or monitor) as the common game arena while players use their own smartphones as individual controllers.

## Key Features

- Main screen on a projector; everyone plays simultaneously in two teams, with AI bots at several difficulty levels.
- Colocalized experience: scan a QR code to join, with real-time interaction powered by Socket.io.
- Neon aesthetics: blue and pink team themes, floating score feedback and particle effects.
- Scoring system with non-linear multipliers based on hand count, color variety and consecutive streaks.
- Interactive mechanics: shake-to-draw (accelerometer), team freezing effects and random "Virus" events.
