(() => {
    'use strict';

    const projects = [
        { href: 'project-ios.html', category: 'personal', image: 'assets/task_ios_4categories.webp', alt: 'iOS task app interface', tags: ['SwiftUI', 'iOS', 'Productivity'], title: { en: 'iOS Task App', zh: 'iOS 任务管理应用', fr: 'Application Mobile iOS' }, summary: { en: 'SwiftUI task manager with Urgency/Importance classification.', zh: '使用 SwiftUI 开发的任务管理工具（紧急/重要分类）。', fr: 'Outil de gestion des tâches en SwiftUI.' } },
        { href: 'project-tb.html', category: 'personal', image: 'assets/tb-ai-summary_main.png', alt: 'Thunderbird AI Mail Summarizer interface', tags: ['Thunderbird', 'JavaScript', 'AI Integration'], title: { en: 'AI Mail Summarizer', zh: '邮件智能摘要助手', fr: 'Résumeur de mails IA' }, summary: { en: 'Thunderbird extension for AI-powered email summarization and chatting.', zh: '基于 AI 的 Thunderbird 邮件摘要与对话扩展。', fr: 'Extension Thunderbird de résumé et chat par IA.' } },
        { href: 'project-subtitle.html', category: 'personal', image: 'assets/SubtitleTool_p1.jpg', alt: 'Subtitle tool interface', tags: ['Python', 'Tkinter', 'AI API'], title: { en: 'Subtitle Tool', zh: '字幕处理工具', fr: 'Outil de sous-titres' }, summary: { en: 'Python/Tkinter tool for multi-format subtitle processing with AI integration.', zh: 'Python/Tkinter 多平台工具，支持多格式和 AI 接口。', fr: 'Outil Python multiplateforme de traitement de sous-titres.' } },
        { href: 'project-rpg.html', category: 'school', image: 'assets/2DGame_gameing.webp', alt: '2D RPG gameplay', tags: ['C++', 'SDL2', 'Game Engine'], title: { en: '2D RPG Game', zh: '2D RPG 游戏', fr: 'Jeu vidéo RPG 2D' }, summary: { en: 'C++/SDL2 game engine with rendering, enemy logic, and dynamic camera.', zh: '自主开发的 C++/SDL2 游戏引擎，实现渲染、敌人逻辑和动态相机。', fr: 'RPG 2D C++/SDL2 avec moteur, logique et caméra.' } },
        { href: 'project-db.html', category: 'school', image: 'assets/db_cdm.webp', alt: 'Real estate database model', tags: ['SQLite', 'SQL', 'Data Modeling'], title: { en: 'Real Estate DB', zh: '房产管理数据库', fr: 'Base de données immobilière' }, summary: { en: 'Real estate management database using SQLite.', zh: '基于 SQLite 的房地产管理系统数据库设计。', fr: 'Base de données de gestion immobilière sous SQLite.' } },
        { href: 'project-unity.html', category: 'personal', image: '', alt: '', tags: ['Unity', 'C#', 'Shaders'], title: { en: '3D Scenography', zh: '3D 场景设计', fr: 'Scénographie 3D' }, summary: { en: 'Interactive Unity scene with C# and shaders.', zh: 'Unity 交互式场景，包含 C# 编程和 Shader 基础。', fr: 'Scène Unity interactive avec C# et shaders.' } },
        { href: 'project-uiux.html', category: 'school', image: 'assets/StudentResidence_penpot.jpg', alt: 'Student residence UI design', tags: ['Figma / Penpot', 'Personas', 'Prototyping'], title: { en: 'UI/UX Design', zh: 'UI/UX 设计', fr: 'Conception IHM/UX' }, summary: { en: 'Student residence management interface using Personas and Figma / Penpot.', zh: '学生公寓管理界面原型设计，使用 Personas 和 Figma / Penpot。', fr: 'Prototype de gestion de résidences étudiantes.' } },
        { href: 'project-web.html', category: 'school', image: 'assets/website.webp', alt: 'Tourism website preview', tags: ['HTML5', 'CSS3', 'Responsive'], title: { en: 'Tourism Website', zh: '旅游网站前端', fr: 'Site touristique' }, summary: { en: 'Responsive HTML/CSS website respecting W3C standards.', zh: '响应式 HTML/CSS 旅游网站，符合 W3C 标准。', fr: 'Site touristique responsive HTML/CSS conforme W3C.' } }
    ];

    const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
    const localizedSpans = (translations) => Object.entries(translations).map(([language, text]) => `<span class="lang-${language === 'zh' ? 'cn' : language}">${escapeHtml(text)}</span>`).join('');

    function createCard(project) {
        const image = project.image ? `<img class="project-card-image" src="${escapeHtml(project.image)}" alt="${escapeHtml(project.alt)}" loading="lazy">` : '';
        const tags = project.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join('');
        return `<a href="${escapeHtml(project.href)}" class="project-card" data-category="${escapeHtml(project.category)}">${image}<h3>${localizedSpans(project.title)}</h3><div class="project-tags">${tags}</div><p>${localizedSpans(project.summary)}</p></a>`;
    }

    document.addEventListener('DOMContentLoaded', () => {
        const grid = document.querySelector('[data-project-grid]');
        if (grid) grid.innerHTML = projects.map(createCard).join('');
    });
})();
