/* Home page project cards, generated from content/projects/<slug>/*.md
   (see js/projects-data.js). Card fields in the front matter:
     focus: map of focus -> rank, e.g.  "  ai: 1"   (all | fullstack | ai | xr)
            a project shows only in the focuses it lists; rank 1-3 = big card
     card_title: optional shorter title               summary: one line
     points: list (big cards)                         kind: small source label
     cover: list of images for the card (default: the gallery)
     flow: list of columns for a diagram instead of images, flow_arrows: both
   Images on a card are fanned out like photos from left to right: moving the
   pointer (or a finger) across them pulls photo 1..n to the front.
   js/home.js calls HomeProjects.render(focus) when the visitor picks a focus. */
(() => {
    'use strict';

    const P = window.Projects;
    const inline = (s) => marked.parseInline(String(s || ''));
    const BIG = 3;

    // one span per language; the stylesheet shows the current one
    const tri = (project, pick) =>
        P.LANGS.map(([lang, cls]) => `<span class="${cls}">${pick(project[lang].meta)}</span>`).join('');

    // "focus:" map -> { all: 3, ai: 1 }
    function ranks(meta) {
        const out = {};
        (Array.isArray(meta.focus) ? meta.focus : []).forEach((pair) => {
            if (Array.isArray(pair)) out[pair[0]] = Number(pair[1]) || 99;
        });
        return out;
    }

    /* ---------- media ---------- */
    function stack(images, size) {
        if (!images.length) return '';
        const imgs = images.map(({ alt, src }) =>
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

    // no screenshot: a perspective grid stands in
    const wire = '<div class="wire" aria-hidden="true"><span></span></div>';

    function images(project) {
        const meta = project.en.meta;
        const cover = P.list(meta.cover);
        const gallery = P.list(meta.gallery).map((g) => P.image(project.slug, g));
        if (!cover.length) return gallery;
        return cover.map((c) => {
            const img = P.image(project.slug, c);
            const match = gallery.find((g) => g.src === img.src);
            return { src: img.src, alt: img.alt || (match && match.alt) || '' };
        });
    }

    /* ---------- cards ---------- */
    const MORE = '<span class="lang-en">Read more</span><span class="lang-cn">看详情</span><span class="lang-fr">Voir le détail</span>';

    function card(project, i, big) {
        const { slug } = project;
        const meta = project.en.meta;
        const pics = images(project);
        const flowCols = P.list(meta.flow);
        const title = (m) => inline(m.card_title || m.title);
        const tags = P.tags(meta.tags).map((t) => `<li>${P.esc(t)}</li>`).join('');
        const num = String(i + 1).padStart(2, '0');

        const text = `
            <p class="card__kind"><span class="card__num">${num}</span>${tri(project, (m) => inline(m.kind))}</p>
            <h3 class="card__title">${tri(project, title)}</h3>
            <p class="card__body">${tri(project, (m) => inline(m.summary))}</p>
            ${big ? P.LANGS.map(([lang, cls]) => {
                const pts = P.list(project[lang].meta.points);
                return pts.length ? `<ul class="points ${cls}">${pts.map((p) => `<li>${inline(p)}</li>`).join('')}</ul>` : '';
            }).join('') : ''}
            <ul class="tags">${tags}</ul>
            ${big ? `<span class="card__more">${MORE}<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>` : ''}`;

        const href = `project.html?p=${encodeURIComponent(slug)}`;
        const attrs = `href="${href}" data-reveal style="--d:${Math.min(i, 6) * 70}ms"`;

        if (big) {
            const media = pics.length ? stack(pics, 'feature')
                : flowCols.length ? flow(flowCols, meta.flow_arrows) : wire;
            return `<a class="card card--big${i % 2 ? ' is-flipped' : ''}" ${attrs}>
                <div class="card__media">${media}</div>
                <div class="card__text">${text}</div>
                <span class="corners" aria-hidden="true"></span>
            </a>`;
        }
        const thumb = pics.length ? stack(pics, 'thumb') : wire;
        return `<a class="card card--tile" ${attrs}>
            <div class="card__thumb">${thumb}</div>
            <div class="card__text">${text}</div>
            <span class="corners" aria-hidden="true"></span>
        </a>`;
    }

    /* ---------- photo stack ----------
       The images lie on the card like photos fanned out from left to right,
       each at its natural size and a slight angle. Photo i sits roughly where
       the pointer has to be to pick it: moving the pointer (or a finger dragged
       sideways) pulls that photo to the front, the others stay in their slots
       behind it, stacked by distance. Hovering also grows the front photo to
       fill the box and tilts it toward the pointer. */
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
            if (el.dataset.bound) return;
            el.dataset.bound = '1';
            const count = el.querySelectorAll('.stack__img').length;
            let active = 0;
            const redraw = () => layout(el, active);
            redraw();
            // slot positions depend on each photo's rendered width
            el.querySelectorAll('.stack__img').forEach((img) => { if (!img.complete) img.addEventListener('load', redraw); });
            if (window.ResizeObserver) new ResizeObserver(redraw).observe(el);

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
    let loaded = null;
    const load = () => (loaded = loaded || P.listSlugs()
        .then((slugs) => Promise.all(slugs.map((s) => P.loadProject(s).catch(() => null))))
        .then((list) => list.filter(Boolean)));

    async function render(focus) {
        const grid = document.querySelector('[data-project-grid]');
        if (!grid) return;
        const featuredList = grid.querySelector('[data-featured-list]');
        const otherList = grid.querySelector('[data-other-list]');
        grid.setAttribute('aria-busy', 'true');
        try {
            const projects = (await load())
                .map((p) => ({ p, rank: ranks(p.en.meta)[focus] }))
                .filter((x) => x.rank !== undefined)
                .sort((a, b) => a.rank - b.rank || a.p.slug.localeCompare(b.p.slug));
            const big = projects.filter((x) => x.rank <= BIG).map((x) => x.p);
            const rest = projects.filter((x) => x.rank > BIG).map((x) => x.p);
            featuredList.innerHTML = big.map((p, i) => card(p, i, true)).join('');
            otherList.innerHTML = rest.map((p, i) => card(p, big.length + i, false)).join('');
            bindStacks(grid);
        } catch (_) {
            featuredList.innerHTML = P.LANGS.map(([, cls], i) =>
                `<p class="${cls}">${['Projects could not be loaded.', '项目加载失败。', 'Impossible de charger les projets.'][i]}</p>`).join('');
            otherList.innerHTML = '';
        }
        grid.removeAttribute('aria-busy');
        document.dispatchEvent(new CustomEvent('projects:rendered'));
    }

    window.HomeProjects = { render, bindStacks };
    document.addEventListener('DOMContentLoaded', () => {
        bindStacks(document);   // the hero's photo fan
        load();                 // start fetching before a focus is picked
    });
})();
