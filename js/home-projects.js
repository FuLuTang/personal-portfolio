/* Home page project cards, generated from content/projects/<slug>/*.md
   (see js/projects-data.js). Card fields in the front matter:
     category: professional | school | personal     featured: true | false
     order: number (ascending)                       card_title: optional shorter title
     summary: one line                               points: list (featured cards)
     cover: list of images for the card (default: the gallery)
     flow: list of columns for a diagram instead of images, flow_arrows: both
   Images on a card are fanned out like photos from left to right: moving the
   pointer (or a finger) across them pulls photo 1..n to the front. */
(() => {
    'use strict';

    const P = window.Projects;
    const inline = (s) => marked.parseInline(String(s || ''));

    // one span per language; the stylesheet shows the current one
    const tri = (project, pick) =>
        P.LANGS.map(([lang, cls]) => `<span class="${cls}">${pick(project[lang].meta)}</span>`).join('');

    /* ---------- media ---------- */
    function stack(slug, images, size) {
        if (!images.length) return '';
        const imgs = images.map(({ alt, src }, i) =>
            `<img class="stack__img" src="${P.esc(src)}" alt="${P.esc(alt)}" loading="lazy" decoding="async">`).join('');
        const ticks = images.length > 1
            ? `<span class="stack__ticks" aria-hidden="true">${images.map(() => '<i></i>').join('')}</span>`
            : '';
        return `<div class="stack stack--${size}${images.length > 1 ? ' stack--multi' : ''}" data-stack>${imgs}${ticks}</div>`;
    }

    // "Agent loop {plan · tools} (core); FastAPI (muted)" -> flow column
    function flow(columns, arrows) {
        const arrow = `<span class="flow__arrow${arrows === 'both' ? ' flow__arrow--both' : ''}"></span>`;
        const node = (raw) => {
            const m = raw.trim().match(/^(.*?)\s*(?:\{(.*?)\})?\s*(?:\((core|out|muted)\))?$/);
            const [, label, small, style] = m || [null, raw, '', ''];
            return `<span class="flow__node${style ? ` flow__node--${style}` : ''}">${P.esc(label)}${small ? `<small>${P.esc(small)}</small>` : ''}</span>`;
        };
        const cols = columns.map((c) => `<div class="flow__col">${c.split(';').map(node).join('')}</div>`);
        return `<div class="flow" aria-hidden="true">${cols.join(arrow)}</div>`;
    }

    function images(project) {
        const meta = project.en.meta;
        const cover = P.list(meta.cover);
        // alt text from the gallery in the viewer's language would need 3 stacks; English alt is enough here
        const gallery = P.list(meta.gallery).map((g) => P.image(project.slug, g));
        if (!cover.length) return gallery;
        return cover.map((c) => {
            const img = P.image(project.slug, c);
            const match = gallery.find((g) => g.src === img.src);
            return { src: img.src, alt: img.alt || (match && match.alt) || '' };
        });
    }

    /* ---------- cards ---------- */
    function card(project, i) {
        const { slug } = project;
        const meta = project.en.meta;
        const featured = P.truthy(meta.featured);
        const pics = images(project);
        const flowCols = P.list(meta.flow);
        const title = (m) => inline(m.card_title || m.title);
        const tags = P.tags(meta.tags).map((t) => `<li>${P.esc(t)}</li>`).join('');

        const text = `
            <p class="project-card__kind">${tri(project, (m) => inline(m.kind))}</p>
            <h3 class="project-card__title">${tri(project, title)}</h3>
            <p class="project-card__body">${tri(project, (m) => inline(m.summary))}</p>
            ${featured ? P.LANGS.map(([lang, cls]) => {
                const pts = P.list(project[lang].meta.points);
                return pts.length ? `<ul class="points ${cls}">${pts.map((p) => `<li>${inline(p)}</li>`).join('')}</ul>` : '';
            }).join('') : ''}
            <ul class="tags">${tags}</ul>`;

        const href = `project.html?p=${encodeURIComponent(slug)}`;
        const attrs = `href="${href}" data-category="${P.esc(meta.category || 'personal')}" style="--i:${i}"`;

        if (featured) {
            const media = pics.length ? stack(slug, pics, 'feature')
                : flowCols.length ? flow(flowCols, meta.flow_arrows) : '';
            return `<a class="project-card project-card--feature" ${attrs}>
                <div class="project-card__media">${media}</div>
                <div class="project-card__text">${text}</div>
            </a>`;
        }
        const thumb = pics.length
            ? `<div class="project-card__thumb">${stack(slug, pics, 'thumb')}</div>`
            : '<div class="project-card__thumb project-card__thumb--wire"><span class="wire" aria-hidden="true"></span></div>';
        return `<a class="project-card project-card--tile" ${attrs}>
            ${thumb}
            <div class="project-card__text">${text}</div>
        </a>`;
    }

    /* ---------- photo stack ----------
       The images lie on the card like photos fanned out from left to right,
       each at its natural size and a slight angle. Photo i sits roughly where
       the pointer has to be to pick it: moving the pointer (or a finger dragged
       sideways) pulls that photo to the front, the others stay in their slots
       behind it, stacked by distance. Hovering also tilts the front photo
       toward the pointer. */
    const ANGLES = [-4, 3, -2.2, 4.2, -3, 2.4, -4.6, 2.8];
    const LIFT = [2.5, -3, 3.5, -2, 3, -3.5, 2, -2.5];   // small vertical jitter, % of own height

    function layout(el, active, { hover = false, tiltX = 0, tiltY = 0 } = {}) {
        const imgs = el.querySelectorAll('.stack__img');
        const n = imgs.length;
        const W = el.clientWidth;
        imgs.forEach((img, i) => {
            const d = i - active;
            const t = n > 1 ? (i / (n - 1)) * 2 - 1 : 0;          // -1 (left) .. 1 (right)
            const room = Math.max((W - img.offsetWidth) / 2, 0) * 0.94;
            let tx = t * room;
            const base = ANGLES[i % ANGLES.length];
            let ty = LIFT[i % LIFT.length];
            let rot = base;
            let scale = 0.9;
            let tilt = '';
            if (d === 0) {
                ty = -2;
                rot = base * 0.2;
                scale = 1;
                if (hover) {
                    // the picked photo grows until it fills the container, then a little more;
                    // it keeps its slot unless that would push it out of the container
                    const w = img.offsetWidth || 1;
                    const h = img.offsetHeight || 1;
                    scale = Math.min(W / w, el.clientHeight / h) * 1.05;
                    const slack = Math.max((W - w * scale) / 2, 0);
                    tx = Math.max(-slack, Math.min(slack, tx));
                    ty = 0;
                    tilt = `perspective(900px) rotateX(${tiltY}deg) rotateY(${tiltX}deg) `;
                }
            }
            img.style.transform = `translate(-50%, -50%) translate(${tx}px, ${ty}%) ${tilt}rotate(${rot}deg) scale(${scale})`;
            img.style.zIndex = n * 2 - Math.abs(d) * 2 + (d === 0 ? 1 : 0);
            img.classList.toggle('is-active', d === 0);
        });
        el.querySelectorAll('.stack__ticks i').forEach((tk, i) => tk.classList.toggle('is-active', i === active));
    }

    function bindStacks(root) {
        root.querySelectorAll('[data-stack]').forEach((el) => {
            const count = el.querySelectorAll('.stack__img').length;
            let active = 0;
            const redraw = () => layout(el, active);
            redraw();
            // slot positions depend on each photo's rendered width
            el.querySelectorAll('.stack__img').forEach((img) => { if (!img.complete) img.addEventListener('load', redraw); });
            if (window.ResizeObserver) new ResizeObserver(redraw).observe(el);
            if (count < 2) return;

            const move = (event) => {
                const box = el.getBoundingClientRect();
                const x = Math.min(Math.max((event.clientX - box.left) / box.width, 0), 0.9999);
                const y = Math.min(Math.max((event.clientY - box.top) / box.height, 0), 1);
                active = Math.floor(x * count);
                // tilt only with a mouse; on touch the finger is already moving the photos
                const tilt = event.pointerType === 'mouse' ? { tiltX: (x - 0.5) * 10, tiltY: (0.5 - y) * 8 } : {};
                layout(el, active, { hover: true, ...tilt });
            };
            el.addEventListener('pointermove', move);
            el.addEventListener('pointerdown', move);
            const reset = () => { active = 0; redraw(); };
            el.addEventListener('pointerleave', reset);
            el.addEventListener('pointercancel', reset);
        });
    }

    /* ---------- page ---------- */
    async function init() {
        const grid = document.querySelector('[data-project-grid]');
        if (!grid) return;
        const featuredList = grid.querySelector('[data-featured-list]');
        const otherList = grid.querySelector('[data-other-list]');

        try {
            const slugs = await P.listSlugs();
            const projects = (await Promise.all(slugs.map((s) => P.loadProject(s).catch(() => null)))).filter(Boolean);
            projects.sort((a, b) => (Number(a.en.meta.order) || 999) - (Number(b.en.meta.order) || 999) || a.slug.localeCompare(b.slug));

            const featured = projects.filter((p) => P.truthy(p.en.meta.featured));
            const others = projects.filter((p) => !P.truthy(p.en.meta.featured));
            featuredList.innerHTML = featured.map(card).join('');
            otherList.innerHTML = others.map((p, i) => card(p, featured.length + i)).join('');
            bindStacks(grid);
        } catch (_) {
            featuredList.innerHTML = P.LANGS.map(([, cls], i) =>
                `<p class="tile__body ${cls}">${['Projects could not be loaded.', '项目加载失败。', 'Impossible de charger les projets.'][i]}</p>`).join('');
        }
        grid.removeAttribute('aria-busy');
        if (window.refreshProjectFilter) window.refreshProjectFilter();
    }

    document.addEventListener('DOMContentLoaded', init);
})();
