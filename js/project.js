/* Project detail page: project.html?p=<slug>
   Data comes from js/projects-data.js (content/projects/<slug>/{en,zh,fr}.md).
   All three languages are rendered up front into .lang-* wrappers, so the
   language switcher keeps working through the same CSS as the rest of the site.
   ```mermaid code blocks are drawn as diagrams (Mermaid is loaded only when a
   page has one) and redrawn when the light/dark theme changes. */
(() => {
    'use strict';

    const P = window.Projects;
    const MERMAID = 'https://cdn.jsdelivr.net/npm/mermaid@11.4.1/dist/mermaid.esm.min.mjs';

    const UI = {
        en: { info: 'Project info', gallery: 'Project gallery', all: '← All projects', contact: 'Get in touch', missing: 'This project page could not be loaded.' },
        zh: { info: '项目信息', gallery: '项目展示', all: '← 全部项目', contact: '联系我', missing: '项目详情加载失败。' },
        fr: { info: 'Fiche projet', gallery: 'Galerie du projet', all: '← Tous les projets', contact: 'Me contacter', missing: 'Impossible de charger ce projet.' },
    };

    const inline = (s) => marked.parseInline(String(s || ''));

    function render(slug, lang, cls, { meta, body }) {
        const ui = UI[lang];
        const facts = Array.isArray(meta.facts) ? meta.facts.filter(Array.isArray) : [];
        const links = P.list(meta.links).map((l) => l.match(/^\[(.+)\]\((.+)\)$/)).filter(Boolean);
        const shots = P.list(meta.gallery).map((g) => P.image(slug, g));

        const gallery = shots.length
            ? shots.map(({ alt, src }, i) => `<img class="detail__shot" src="${P.esc(src)}" alt="${P.esc(alt)}"${i ? ' loading="lazy"' : ''}>`).join('')
            : `<div class="detail__plate">${P.esc(meta.plate || '')}</div>`;

        return `
        <div class="detail__lang ${cls}">
            <section class="detail__hero">
                <p class="detail__kind">${inline(meta.kind)}</p>
                <h1 class="detail__title">${inline(meta.title)}</h1>
                <div class="detail__tags">${P.tags(meta.tags).map((t) => `<span>${P.esc(t)}</span>`).join('')}</div>
            </section>
            <div class="detail__grid">
                <article class="detail__card detail__md">${P.fixPaths(slug, marked.parse(body))}</article>
                <aside class="detail__card">
                    <h2 class="detail__h">${ui.info}</h2>
                    <dl class="detail__facts">
                        ${facts.map(([k, v]) => `<div><dt>${inline(k)}</dt><dd>${inline(v)}</dd></div>`).join('')}
                    </dl>
                    <div class="detail__links">
                        ${links.map(([, label, href]) => `<a class="detail__link" href="${P.esc(P.resolve(slug, href))}" target="_blank" rel="noopener noreferrer">${inline(label)}</a>`).join('')}
                        <a class="detail__link" href="index.html#projects">${ui.all}</a>
                        <a class="detail__link" href="index.html#contact">${ui.contact}</a>
                    </div>
                </aside>
            </div>
            <section class="detail__gallery">
                <h2 class="detail__h">${ui.gallery}</h2>
                <div class="detail__shots">${gallery}</div>
            </section>
        </div>`;
    }

    /* ---------- Mermaid ---------- */
    let mermaidLib = null;
    let mermaidRun = 0;

    async function drawDiagrams(root) {
        const blocks = root.querySelectorAll('[data-mermaid]');
        if (!blocks.length) return;
        mermaidLib = mermaidLib || (await import(MERMAID)).default;
        const dark = document.documentElement.dataset.theme === 'dark';
        mermaidLib.initialize({ startOnLoad: false, theme: dark ? 'dark' : 'neutral', securityLevel: 'strict', fontFamily: 'Inter, system-ui, sans-serif' });
        const run = ++mermaidRun;
        for (const [i, el] of [...blocks].entries()) {
            try {
                // render() draws in an off-screen node, so diagrams inside the hidden languages work too
                const { svg } = await mermaidLib.render(`mmd-${run}-${i}`, el.dataset.mermaid);
                el.innerHTML = svg;
            } catch (err) {
                el.innerHTML = `<pre><code>${P.esc(el.dataset.mermaid)}</code></pre>`;
            }
        }
    }

    function prepareDiagrams(root) {
        root.querySelectorAll('pre > code.language-mermaid').forEach((code) => {
            const box = document.createElement('div');
            box.className = 'detail__diagram';
            box.dataset.mermaid = code.textContent;
            code.parentElement.replaceWith(box);
        });
    }

    /* ---------- page ---------- */
    async function init() {
        const root = document.querySelector('[data-project-detail]');
        if (!root) return;
        const slug = new URLSearchParams(location.search).get('p') || '';
        if (!/^[a-z0-9-]+$/.test(slug)) { location.replace('index.html#projects'); return; }

        try {
            const project = await P.loadProject(slug);
            root.innerHTML = P.LANGS.map(([lang, cls]) => render(slug, lang, cls, project[lang])).join('');

            // per-language tab titles, then re-apply the current language so lang.js picks them up
            P.LANGS.forEach(([lang]) => {
                const title = String(project[lang].meta.title || slug).replace(/[*_`]/g, '');
                document.documentElement.dataset[`title${lang[0].toUpperCase()}${lang.slice(1)}`] =
                    `${title} — ${lang === 'zh' ? '唐颢宸' : 'Haochen Tang'}`;
            });
            if (window.setLanguage) window.setLanguage(document.documentElement.lang, { persist: false });

            prepareDiagrams(root);
            drawDiagrams(root);
            new MutationObserver(() => drawDiagrams(root))
                .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
        } catch (_) {
            root.innerHTML = P.LANGS.map(([lang, cls]) => `<p class="detail__card ${cls}">${UI[lang].missing}</p>`).join('');
        }
        root.removeAttribute('aria-busy');
    }

    document.addEventListener('DOMContentLoaded', init);
})();
