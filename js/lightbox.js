/* Lightbox for project pages: click a gallery screenshot or an image in the text.
   The image flies from its place on the page to the centre (and back on close).
   Next / previous deal the images like cards; on touch the photo follows the
   finger and is thrown left or right. Keys: ← → Esc. */
(() => {
    'use strict';

    const SELECTOR = '.detail__shot, .detail__md img';
    const EASE = 'cubic-bezier(0.2, 0.9, 0.25, 1.1)';
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ms = (t) => (reduced ? 1 : t);

    let box = null;   // overlay element while open
    let items = [];
    let index = 0;
    let current = null;
    let hidden = null; // the page image hidden while its copy is in the lightbox

    const visible = (rect) => rect.bottom > 0 && rect.top < innerHeight && rect.width > 0;

    function flyFrom(img, origin) {
        const first = origin.getBoundingClientRect();
        const last = img.getBoundingClientRect();
        if (!visible(first) || !last.width) return null;
        const dx = first.left + first.width / 2 - (last.left + last.width / 2);
        const dy = first.top + first.height / 2 - (last.top + last.height / 2);
        return `translate(${dx}px, ${dy}px) scale(${first.width / last.width})`;
    }

    function hideOrigin(el) {
        if (hidden) hidden.style.visibility = '';
        hidden = el;
        if (el) el.style.visibility = 'hidden';
    }

    function makeImg(el) {
        const img = document.createElement('img');
        img.className = 'lb__img';
        img.src = el.currentSrc || el.src;
        img.alt = el.alt || '';
        img.draggable = false;
        img.style.gridArea = '1 / 1';
        return img;
    }

    function caption() {
        box.querySelector('.lb__cap').innerHTML =
            `<span class="lb__count">${index + 1} / ${items.length}</span>${current.alt ? current.alt.replace(/</g, '&lt;') : ''}`;
    }

    function open(el) {
        const scope = el.closest('.detail__lang') || document;
        items = [...scope.querySelectorAll(SELECTOR)];
        index = Math.max(items.indexOf(el), 0);

        box = document.createElement('div');
        box.className = 'lb';
        box.setAttribute('role', 'dialog');
        box.setAttribute('aria-modal', 'true');
        box.innerHTML = `
            <button class="lb__btn lb__close" type="button" aria-label="Close">×</button>
            <button class="lb__btn lb__prev" type="button" aria-label="Previous">‹</button>
            <button class="lb__btn lb__next" type="button" aria-label="Next">›</button>
            <p class="lb__cap"></p>`;
        current = makeImg(el);
        box.prepend(current);
        document.body.append(box);
        document.documentElement.style.overflow = 'hidden';
        caption();

        const from = flyFrom(current, el);
        if (from) {
            hideOrigin(el);
            current.animate([{ transform: from }, { transform: 'none' }], { duration: ms(450), easing: EASE });
        }
        box.querySelector('.lb__close').focus({ preventScroll: true });
        bind();
    }

    function close() {
        if (!box) return;
        const el = items[index];
        const overlay = box;
        const img = current;
        box = null;
        document.removeEventListener('keydown', onKey);
        overlay.classList.add('is-closing');
        const to = flyFrom(img, el);
        const done = () => { overlay.remove(); hideOrigin(null); document.documentElement.style.overflow = ''; };
        if (to) {
            hideOrigin(el);
            img.animate([{ transform: getComputedStyle(img).transform === 'none' ? 'none' : getComputedStyle(img).transform }, { transform: to }],
                { duration: ms(380), easing: EASE, fill: 'forwards' }).finished.then(done);
        } else {
            setTimeout(done, ms(250));
        }
    }

    // dir: +1 next, -1 previous. startX: where a dragged photo currently is
    function go(dir, startX = 0) {
        if (items.length < 2) {
            current.animate([{ transform: `translateX(${startX}px)` }, { transform: 'none' }], { duration: ms(300), easing: EASE });
            return;
        }
        const out = current;
        index = (index + dir + items.length) % items.length;
        current = makeImg(items[index]);
        out.after(current);
        caption();
        out.animate([
            { transform: `translateX(${startX}px) rotate(${startX / 25}deg)`, opacity: 1 },
            { transform: `translateX(${-dir * 65}vw) rotate(${-dir * 14}deg)`, opacity: 0 },
        ], { duration: ms(420), easing: 'cubic-bezier(0.4, 0, 0.6, 1)', fill: 'forwards' }).finished.then(() => out.remove());
        current.animate([
            { transform: `translateX(${dir * 55}vw) rotate(${dir * 10}deg) scale(0.9)`, opacity: 0 },
            { transform: 'none', opacity: 1 },
        ], { duration: ms(480), easing: EASE });
    }

    function onKey(e) {
        if (e.key === 'Escape') close();
        else if (e.key === 'ArrowRight') go(1);
        else if (e.key === 'ArrowLeft') go(-1);
    }

    function bind() {
        document.addEventListener('keydown', onKey);
        box.querySelector('.lb__close').addEventListener('click', close);
        box.querySelector('.lb__prev').addEventListener('click', () => go(-1));
        box.querySelector('.lb__next').addEventListener('click', () => go(1));

        // drag / swipe: the photo follows the pointer, a long enough throw changes photo
        let downX = null;
        let moved = 0;
        box.addEventListener('pointerdown', (e) => {
            if (e.target.closest('.lb__btn')) return;
            downX = e.clientX;
            moved = 0;
        });
        box.addEventListener('pointermove', (e) => {
            if (downX === null) return;
            moved = e.clientX - downX;
            if (Math.abs(moved) > 4) current.style.transform = `translateX(${moved}px) rotate(${moved / 25}deg)`;
        });
        const up = (e) => {
            if (downX === null) return;
            const dx = moved;
            downX = null;
            current.style.transform = '';
            if (Math.abs(dx) > 70) go(dx < 0 ? 1 : -1, dx);
            else if (Math.abs(dx) > 4) current.animate([{ transform: `translateX(${dx}px) rotate(${dx / 25}deg)` }, { transform: 'none' }], { duration: ms(350), easing: EASE });
            else if (e.type === 'pointerup' && e.target === box) close(); // click on the backdrop
        };
        box.addEventListener('pointerup', up);
        box.addEventListener('pointercancel', up);
    }

    document.addEventListener('click', (e) => {
        const el = e.target.closest(SELECTOR);
        if (el && !box) { e.preventDefault(); open(el); }
    });
})();
