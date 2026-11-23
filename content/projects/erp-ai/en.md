---
title: ERP AI · Retail Analysis & Assistance
kind: Professional internship · 2026
tags: Python, FastAPI, AI Agent, ERP, Linux
focus:                         # which "您关注哪个方面" views show this project; number = rank (1-3 = big card)
  all: 1
  ai: 1
  fullstack: 2
facts:
  Period: 6 May – 25 July 2026
  Role: Full-stack AI developer intern
  Context: Pharmacy & retail ERP · Fuzhou, China
  Backend & data: Python · FastAPI · Uvicorn · Pandas · DuckDB
  AI: OpenAI SDK · AgentLoop
  Frontend: HTML/CSS/JavaScript during the internship; Vue in the current repository
  Deployment: Linux · systemd · Nginx
  Status: Modules deployed during the internship; pricing remains a prototype
links:
  - [Public source code on GitHub](https://github.com/FuLuTang/AI-Store-Analysis-System)
card_title: ERP AI Internship
summary: Fuzhou Shangbo Software (China), May–Jul 2026. AI plugin for a live pharmacy/retail ERP.
points:
  - Agent framework built from scratch, no existing library
  - Iterated on permissions, sandboxing and action traceability
  - Deployed on Linux with Nginx + systemd
cover:
  - price-estimation.jpg
  - diagnosis-import.jpg
  - price-result.jpg
  - history.jpg
gallery:
  - ![Price recommendation interface](price-estimation.jpg)
  - ![Business diagnosis: data import and console](diagnosis-import.jpg)
  - ![Price calculation result and chart](price-result.jpg)
  - ![History record management](history.jpg)
---

During my full-stack AI internship at Fuzhou Shangbo Software Co., Ltd., I developed AI features for an existing pharmacy and retail ERP. Working directly with the company director, I translated business needs into three modules: store diagnostics, price recommendations and an AI customer-support agent.

## Three business modules

- Store diagnostics — Import ERP exports, including archives, or retrieve data through APIs. Explore heterogeneous files, structure tabular data and calculate indicators. Produce a detailed Markdown report and concise JSON diagnostic cards linking findings to evidence and suggested actions.
- Price recommendations — Check input suitability, align product and sales data, and prepare price–volume observations. Python calculates revenue and, when purchase cost is available, profit; the interface presents charts and structured recommendations. In the current public implementation, candidates are ranked from normalized observations, rather than establishing a universally optimal price.
- AI customer support — Combine conversation history, user-provided files and controlled access to service documentation. Use tools and ERP APIs to assist with tasks such as preparing data imports from a previous ERP. Account-level file spaces and scoped service authorization frame access and actions.

![Business diagnosis workflow](diagnosis-workflow.png)

![Optimal price workflow](price-workflow.png)

![AI customer-support workflow](support-workflow.png)

## System architecture

- Web interface & API — The browser uploads files, starts jobs and retrieves results through FastAPI. Long-running jobs expose status and SSE progress logs, with history and cancellation controls.
- Agent orchestration — A custom AgentLoop uses the OpenAI SDK and configurable compatible model endpoints. It coordinates tool calls and a work plan inside a run workspace, separating input files, intermediate artifacts and outputs.
- Data & delivery — Python, Pandas and DuckDB support file processing and analytical work. Structured JSON connects backend outputs to the UI; Linux, Uvicorn, systemd and Nginx support deployment. GitHub-based update automation forms part of the operational workflow.

```mermaid
flowchart TB
    web["Web app"] <--> core["Agent core + account management"]
    core <--> erp[("Existing ERP system")]
```

![Agent internal components](agent-components.png)

![Agent and ERP internal APIs](erp-api.png)

## My contribution

- Requirements & design — Discussed expected user results with the director, broke the work into import, processing, output, interface and deployment stages, and iterated on demonstrations and feedback.
- Full-stack development — Worked independently across backend APIs, agent tools and workflows, data preparation, and web interfaces for the three modules. Added practical features including execution history, progress logs and structured result views.
- Integration & operations — Connected workflows to ERP APIs, worked on account-based file separation and authorization, deployed to the company’s Linux server and contributed to installation and update automation.

![User spaces and document access control](access-control.png)

![Deployment and updates](deployment.png)

## Technical scope & evolution

The internship report describes HTML/CSS/JavaScript interfaces and a Python/FastAPI backend. The public repository now includes a Vue frontend. This page distinguishes the internship responsibilities from the repository’s subsequent evolution; the linked code is a living project, not a frozen internship snapshot.

## Engineering lessons & limits

I learned to keep numerical calculations and access checks in program code, while using the language model to interpret files and explain results. Heterogeneous exports required exploration before processing and explicit output contracts. Price recommendations remain a decision-support prototype: sparse observations, promotions and data quality limit confidence. Deployment does not establish measured business impact.

## Public presentation

This overview presents general engineering work and links to the public source repository. Company documents, customer datasets, credentials, internal API details and production access are excluded. The screenshots and diagrams on this page come from my internship report.
