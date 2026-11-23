/* Home page behaviour:
   - the "What are you looking for?" picker: shows the skills panel, stats and
     projects for one focus. The choice goes into the URL (?focus=ai), so a link
     can open the page already focused, e.g. in an application email.
   - scroll effects: reveal-on-scroll, reading progress bar, hero parallax.
   All motion is skipped when the visitor prefers reduced motion. */
(() => {
    'use strict';

    const FOCUSES = ['all', 'fullstack', 'ai', 'xr'];
    const still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- reveal on scroll ---------- */
    let observer = null;
    function watch(root = document) {
        const items = root.querySelectorAll('[data-reveal]:not(.is-in)');
        if (still || !('IntersectionObserver' in window)) {
            items.forEach((el) => el.classList.add('is-in'));
            return;
        }
        observer = observer || new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (!e.isIntersecting) return;
                e.target.classList.add('is-in');
                observer.unobserve(e.target);
            });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
        items.forEach((el) => observer.observe(el));
    }

    /* ---------- focus picker ---------- */
    function readFocus() {
        const q = new URLSearchParams(location.search).get('focus');
        return FOCUSES.includes(q) ? q : null;
    }

    function setFocus(focus, { scroll = false } = {}) {
        if (!FOCUSES.includes(focus)) return;
        document.documentElement.dataset.focus = focus;

        document.querySelectorAll('[data-focus]').forEach((b) =>
            b.setAttribute('aria-pressed', String(b.dataset.focus === focus)));
        document.querySelectorAll('[data-panel]').forEach((p) => { p.hidden = p.dataset.panel !== focus; });
        document.querySelectorAll('[data-stat]').forEach((s) => { s.hidden = !s.dataset.stat.split(' ').includes(focus); });

        const area = document.querySelector('[data-focus-area]');
        const wasHidden = area.hidden;
        area.hidden = false;
        document.querySelector('[data-focus-nudge]').hidden = true;

        // replay the entrance of the panel that just appeared
        area.querySelectorAll('.panel, .stats, .head').forEach((el) => {
            el.classList.remove('is-swap');
            void el.offsetWidth;
            el.classList.add('is-swap');
        });

        const url = new URL(location.href);
        url.searchParams.set('focus', focus);
        history.replaceState(null, '', url);

        window.HomeProjects.render(focus);
        if (scroll) {
            const target = document.getElementById('skills-heading');
            const top = target.getBoundingClientRect().top + window.scrollY - 96;
            window.scrollTo({ top, behavior: still ? 'auto' : 'smooth' });
        }
        if (wasHidden) watch(area);
    }

    /* ---------- scroll: progress bar + hero parallax ---------- */
    function scrollEffects() {
        const bar = document.querySelector('[data-progress]');
        const media = document.querySelector('[data-parallax]');
        let ticking = false;
        const update = () => {
            ticking = false;
            const max = document.documentElement.scrollHeight - innerHeight;
            if (bar) bar.style.transform = `scaleX(${max > 0 ? Math.min(scrollY / max, 1) : 0})`;
            if (media && !still) {
                const y = Math.min(scrollY, innerHeight);
                media.style.setProperty('--py', `${y * 0.12}px`);
            }
            document.documentElement.classList.toggle('is-scrolled', scrollY > 8);
        };
        addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
        addEventListener('resize', update);
        update();
    }

    function init() {
        document.documentElement.classList.add('js');
        watch();
        scrollEffects();
        document.addEventListener('projects:rendered', () => watch(document.querySelector('[data-project-grid]')));

        document.querySelectorAll('[data-focus]').forEach((b) =>
            b.addEventListener('click', () => setFocus(b.dataset.focus, { scroll: true })));

        const initial = readFocus();
        if (initial) setFocus(initial);

        // hero name slides in once fonts are ready (avoids a re-layout mid-animation)
        const go = () => document.documentElement.classList.add('is-loaded');
        (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(() => requestAnimationFrame(go));
        setTimeout(go, 1200);
    }

    document.addEventListener('DOMContentLoaded', init);
})();
