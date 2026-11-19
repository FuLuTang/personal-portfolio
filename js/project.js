/* Project detail page: project.html?p=<slug>
   Content lives in content/projects/<slug>/{en,zh,fr}.md — front matter for the
   hero, facts, links and gallery, Markdown body for the story. All three
   languages are rendered up front into .lang-* wrappers, so the language
   switcher keeps working through the same CSS as the rest of the site.
   A missing language file falls back to English. */
(() => {
    'use strict';

    const LANGS = [['en', 'lang-en'], ['zh', 'lang-cn'], ['fr', 'lang-fr']];

    const UI = {
        en: { info: 'Project info', gallery: 'Project gallery', all: '← All projects', contact: 'Get in touch', missing: 'This project page could not be loaded.' },
        zh: { info: '项目信息', gallery: '项目展示', all: '← 全部项目', contact: '联系我', missing: '项目详情加载失败。' },
        fr: { info: 'Fiche projet', gallery: 'Galerie du projet', all: '← Tous les projets', contact: 'Me contacter', missing: 'Impossible de charger ce projet.' },
    };

    const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    /* Front matter is a small YAML subset:
         key: value
         key:            followed by "  - item" lines (list) or "  name: value" lines (map) */
    function parse(md) {
        const m = md.replace(/\r\n/g, '\n').match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
        if (!m) return { meta: {}, body: md };
        const meta = {};
        let current = null;
        m[1].split('\n').forEach((line) => {
            if (!line.trim()) return;
            const nested = line.match(/^\s+(.*)$/);
            if (nested && current) {
                const item = nested[1];
                if (item.startsWith('- ')) {
                    if (!Array.isArray(meta[current])) meta[current] = [];
                    meta[current].push(item.slice(2).trim());
                } else {
                    const i = item.indexOf(': ');
                    if (i > 0) {
                        if (!Array.isArray(meta[current])) meta[current] = [];
                        meta[current].push([item.slice(0, i).trim(), item.slice(i + 2).trim()]);
                    }
                }
                return;
            }
            const i = line.indexOf(':');
            current = line.slice(0, i).trim();
            const value = line.slice(i + 1).trim();
            meta[current] = value || null;
        });
        return { meta, body: m[2] };
    }

    const inline = (s) => marked.parseInline(String(s || ''));

    function render(lang, cls, md) {
        const { meta, body } = parse(md);
        const ui = UI[lang];
        const tags = (meta.tags || '').split(',').map((t) => t.trim()).filter(Boolean);
        const facts = Array.isArray(meta.facts) ? meta.facts : [];
        const links = (meta.links || []).map((l) => l.match(/^\[(.+)\]\((.+)\)$/)).filter(Boolean);
        const shots = (meta.gallery || []).map((g) => g.match(/^!\[(.*)\]\((.+)\)$/)).filter(Boolean);

        const gallery = shots.length
            ? shots.map(([, alt, src], i) => `<img class="detail__shot" src="${esc(src)}" alt="${esc(alt)}"${i ? ' loading="lazy"' : ''}>`).join('')
            : `<div class="detail__plate">${esc(meta.plate || '')}</div>`;

        return `
        <div class="detail__lang ${cls}">
            <section class="detail__hero">
                <p class="detail__kind">${inline(meta.kind)}</p>
                <h1 class="detail__title">${inline(meta.title)}</h1>
                <div class="detail__tags">${tags.map((t) => `<span>${esc(t)}</span>`).join('')}</div>
            </section>
            <div class="detail__grid">
                <article class="detail__card detail__md">${marked.parse(body)}</article>
                <aside class="detail__card">
                    <h2 class="detail__h">${ui.info}</h2>
                    <dl class="detail__facts">
                        ${facts.map(([k, v]) => `<div><dt>${inline(k)}</dt><dd>${inline(v)}</dd></div>`).join('')}
                    </dl>
                    <div class="detail__links">
                        ${links.map(([, label, href]) => `<a class="detail__link" href="${esc(href)}" target="_blank" rel="noopener noreferrer">${inline(label)}</a>`).join('')}
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

    const load = (slug, lang) =>
        fetch(`content/projects/${slug}/${lang}.md`, { cache: 'no-cache' })
            .then((r) => (r.ok ? r.text() : Promise.reject(r.status)));

    async function init() {
        const root = document.querySelector('[data-project-detail]');
        if (!root) return;
        const slug = new URLSearchParams(location.search).get('p') || '';
        if (!/^[a-z0-9-]+$/.test(slug)) { location.replace('index.html#projects'); return; }

        try {
            const en = await load(slug, 'en');
            const texts = await Promise.all(LANGS.map(([lang]) => (lang === 'en' ? en : load(slug, lang).catch(() => en))));
            root.innerHTML = LANGS.map(([lang, cls], i) => render(lang, cls, texts[i])).join('');

            // per-language tab titles, then re-apply the current language so lang.js picks them up
            LANGS.forEach(([lang], i) => {
                const title = parse(texts[i]).meta.title || slug;
                document.documentElement.dataset[`title${lang[0].toUpperCase()}${lang.slice(1)}`] =
                    `${title.replace(/[*_`]/g, '')} — ${lang === 'zh' ? '唐颢宸' : 'Haochen Tang'}`;
            });
            if (window.setLanguage) window.setLanguage(document.documentElement.lang, { persist: false });
        } catch (_) {
            root.innerHTML = LANGS.map(([lang, cls]) => `<p class="detail__card ${cls}">${UI[lang].missing}</p>`).join('');
        }
        root.removeAttribute('aria-busy');
    }

    document.addEventListener('DOMContentLoaded', init);
})();
