---
title: NEON-UNO
kind: Scolaire · Projet en équipe
tags: Vue 3, Node.js, Socket.io, AI Bots
facts:
  Catégorie: Scolaire (projet en équipe)
  Technologies: Vue 3, Node.js, Socket.io
  Joueurs: Deux équipes, accès par QR code, bots IA
links:
  - [GitHub](https://github.com/yassine9-1/neon_uno)
gallery:
  - ![NEON-UNO game interface](neon_uno_preview.png)
summary: Les joueurs rejoignent par QR code et jouent simultanément en deux équipes sur un écran projeté, avec des bots IA de plusieurs niveaux.
points:
  - 11 PR fusionnées (migration Vue 3, lobby, joueurs IA)
  - IA : aléatoire, heuristique, anticipation à 2 coups
---

NEON-UNO est un jeu de cartes multijoueur colocalisé inspiré du UNO classique. Conçu pour les rassemblements, il utilise un grand écran (projecteur ou moniteur) comme arène commune, tandis que les joueurs utilisent leur smartphone comme manette.

## Fonctionnalités Clés

- Écran principal projeté ; tous les joueurs jouent simultanément en deux équipes, avec des bots IA de plusieurs niveaux de difficulté.
- Expérience colocalisée : rejoindre en scannant un QR code, interaction en temps réel via Socket.io.
- Esthétique néon : thèmes d'équipe bleu et rose, retours de score flottants et effets de particules.
- Système de score à multiplicateurs non linéaires (nombre de cartes, variété des couleurs, séries consécutives).
- Mécaniques interactives : secouer pour piocher (accéléromètre), gel d'équipe et événements « Virus » aléatoires.
