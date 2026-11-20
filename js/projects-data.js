/* Shared project data layer for the home page (js/home-projects.js) and the
   detail page (js/project.js).

   Every project is a folder: content/projects/<slug>/{en,zh,fr}.md plus its
   images. Front matter holds the structured fields, the Markdown body holds the
   story. Any field missing from zh.md / fr.md is taken from en.md, so the
   translations only need the text that actually changes.

   Front matter is a small YAML subset:
     key: value
     key:            followed by "  - item" lines (list) or "  name: value" lines (map)
     # comments allowed. See content/projects/README.md. */
(() => {
    'use strict';

    const LANGS = [['en', 'lang-en'], ['zh', 'lang-cn'], ['fr', 'lang-fr']];
    const RAW = 'https://raw.githubusercontent.com/FuLuTang/personal-portfolio/main/';

    const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    function parse(md) {
        const m = String(md).replace(/\r\n/g, '\n').match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
        if (!m) return { meta: {}, body: String(md) };
        const meta = {};
        let current = null;
        m[1].split('\n').forEach((raw) => {
            // "# comment" lines and " # comment" at the end of a line are ignored ("C#" is fine: no space before #)
            const line = raw.replace(/\s+#\s.*$/, '');
            if (!line.trim() || /^\s*#/.test(line)) return;
            const nested = line.match(/^\s+(.*)$/);
            if (nested && current) {
                if (!Array.isArray(meta[current])) meta[current] = [];
                const item = nested[1];
                if (item.startsWith('- ')) {
                    meta[current].push(item.slice(2).trim());
                } else {
                    const i = item.indexOf(': ');
                    if (i > 0) meta[current].push([item.slice(0, i).trim(), item.slice(i + 2).trim()]);
                }
                return;
            }
            const i = line.indexOf(':');
            if (i < 0) return;
            current = line.slice(0, i).trim();
            const value = line.slice(i + 1).trim();
            meta[current] = value === '' ? null : value;
        });
        return { meta, body: m[2] };
    }

    // Same-site copy first (deployed site, or local files under a local server).
    // If that fails — e.g. the page was opened by double-clicking the file, where
    // browsers block fetch — fall back to the copy pushed to GitHub.
    const get = (url) => fetch(url, { cache: 'no-cache' }).then((r) => (r.ok ? r.text() : Promise.reject(r.status)));
    const fetchText = (path) => get(path).catch(() => get(RAW + path));

    /* Folder list. A local `python -m http.server` answers a folder URL with a
       directory listing, so new folders show up locally without any build step;
       GitHub Pages has no listings and uses content/projects/index.json, which
       .github/workflows/projects-index.yml regenerates on every push. */
    async function listSlugs() {
        try {
            const res = await fetch('content/projects/', { cache: 'no-cache' });
            if (res.ok && (res.headers.get('content-type') || '').includes('text/html')) {
                const html = await res.text();
                const slugs = [...html.matchAll(/href="([a-z0-9-]+)\/"/g)].map((m) => m[1]);
                if (slugs.length) return slugs;
            }
        } catch (_) { /* fall through */ }
        return JSON.parse(await fetchText('content/projects/index.json'));
    }

    /* Loads one project: { slug, en, zh, fr } where each language is
       { meta, body } with missing fields filled from English. */
    async function loadProject(slug) {
        const enText = await fetchText(`content/projects/${slug}/en.md`);
        const en = parse(enText);
        const project = { slug, en };
        await Promise.all(LANGS.slice(1).map(async ([lang]) => {
            let own = { meta: {}, body: '' };
            try { own = parse(await fetchText(`content/projects/${slug}/${lang}.md`)); } catch (_) { /* English only */ }
            const meta = { ...en.meta };
            Object.entries(own.meta).forEach(([k, v]) => { if (v !== null) meta[k] = v; });
            project[lang] = { meta, body: own.body.trim() ? own.body : en.body };
        }));
        return project;
    }

    // image and file paths in a project are relative to its folder
    const resolve = (slug, path) =>
        /^(?:[a-z]+:|\/|#|\.\.\/)/i.test(path) ? path : `content/projects/${slug}/${path.replace(/^\.\//, '')}`;

    // "![alt](src)" -> { alt, src }, also accepts a bare path
    function image(slug, item) {
        const m = String(item).match(/^!\[(.*)\]\((.+)\)$/);
        return m ? { alt: m[1], src: resolve(slug, m[2]) } : { alt: '', src: resolve(slug, String(item)) };
    }

    // rewrite relative <img src> inside rendered HTML without letting the browser fetch the wrong URL first
    function fixPaths(slug, html) {
        const t = document.createElement('template');
        t.innerHTML = html;
        t.content.querySelectorAll('img[src]').forEach((img) => img.setAttribute('src', resolve(slug, img.getAttribute('src'))));
        return t.innerHTML;
    }

    const list = (v) => (Array.isArray(v) ? v.filter((x) => typeof x === 'string') : []);
    const tags = (v) => String(v || '').split(',').map((t) => t.trim()).filter(Boolean);
    const truthy = (v) => /^(true|yes|1)$/i.test(String(v || ''));

    window.Projects = { LANGS, esc, parse, fetchText, listSlugs, loadProject, resolve, image, fixPaths, list, tags, truthy };
})();
