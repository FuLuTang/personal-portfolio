---
title: AI Chatting Mail Summarizer
kind: Personnel · Module publié
tags: Thunderbird, JavaScript, AI Integration, AI Agent
facts:
  Catégorie: Personnel
  Technologies: Thunderbird, JavaScript, AI Integration
  Statut: Publié sur Thunderbird Add-ons sous le nom « AI Chatting Mail Summarizer »
links:
  - [GitHub](https://github.com/FuLuTang/tb-ai-summary)
  - [Modules Thunderbird](https://addons.thunderbird.net/thunderbird/addon/ai-chatting-mail-summarizer/)
gallery:
  - ![Main Interface](tb-ai-summary_main.png)
  - ![Briefing Feature](tb-ai-summary_briefing.png)
  - ![Settings Page](tb-ai-summary_setting.png)
category: personal
featured: true
order: 2
summary: Extension agent IA pour Thunderbird, publiée sur Thunderbird Add-ons sous le nom « AI Chatting Mail Summarizer » : résumés, briefing des non-lus et chat.
points:
  - Boucle ReAct maison, 3 niveaux de modèles
  - Résumés en lot limités en débit, urgence, briefing
---

Cette extension Thunderbird exploite l'API WebExtension et JavaScript asynchrone avancé pour intégrer des LLMs (par OpenAI ou les API des autres fournisseurs) directement dans le client de messagerie. L'architecture comprend un backend modulaire pour gérer les requêtes IA et un frontend réactif pour une interaction utilisateur en temps réel.

Notamment, ce projet a été construit en utilisant la méthodologie "Vibe Coding", permettant une itération et un déploiement rapides : la première version fonctionnelle a été publiée en moins de 8 heures de développement.

## Fonctionnalités Clés

- Chat IA contextuel pour les e-mails individuels.
- Support pour Ollama (Local) et OpenAI (Cloud).
- Briefing des e-mails non lus et catégorisation intelligente.
