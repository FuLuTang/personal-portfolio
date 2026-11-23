/* GitHub contributions block on the home page: fills the four numbers and the
   activity log from data/contributions.json (refreshed daily by
   .github/workflows/contributions.yml). No request goes to the GitHub API from
   the visitor's browser. The log is one line per PR / issue, newest first,
   grouped by year; dates show month + day in the page's language. */
(() => {
    'use strict';

    const tri = ([en, zh, fr]) =>
        `<span class="lang-en">${en}</span><span class="lang-cn">${zh}</span><span class="lang-fr">${fr}</span>`;
    const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    const STATE = {
        open: 'Open', merged: 'Merged', closed: 'Closed', issueOpen: 'Open issue', issueClosed: 'Closed issue',
    };
    // GitHub Octicons (MIT), 16px
    const ICON = {
        open: 'M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354ZM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm8.25.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z',
        merged: 'M5.45 5.154A4.25 4.25 0 0 0 9.25 7.5h1.378a2.251 2.251 0 1 1 0 1.5H9.25A5.734 5.734 0 0 1 5 7.123v3.505a2.25 2.25 0 1 1-1.5 0V5.372a2.25 2.25 0 1 1 1.95-.218ZM4.25 13.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm8.5-4.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM5 3.25a.75.75 0 1 0 0 .005V3.25Z',
        closed: 'M3.25 1A2.25 2.25 0 0 1 4 5.372v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.251 2.251 0 0 1 3.25 1Zm9.5 5.5a.75.75 0 0 1 .75.75v3.378a2.251 2.251 0 1 1-1.5 0V7.25a.75.75 0 0 1 .75-.75Zm-2.03-5.273a.75.75 0 0 1 1.06 0l.97.97.97-.97a.748.748 0 0 1 1.265.332.75.75 0 0 1-.205.729l-.97.97.97.97a.751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018l-.97-.97-.97.97a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734l.97-.97-.97-.97a.75.75 0 0 1 0-1.06ZM2.5 12.25a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0ZM3.25 3.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm9.5 9.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z',
        issueOpen: 'M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z',
        issueClosed: 'M11.28 6.78a.75.75 0 0 0-1.06-1.06L7.25 8.69 5.78 7.22a.75.75 0 0 0-1.06 1.06l2 2a.75.75 0 0 0 1.06 0l3.5-3.5ZM16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0Zm-1.5 0a6.5 6.5 0 1 0-13 0 6.5 6.5 0 0 0 13 0Z',
    };

    const stateOf = (item) => (item.kind === 'issue' ? (item.state === 'open' ? 'issueOpen' : 'issueClosed') : item.state);

    // "2026-11-18" -> Nov 18 / 11/18 / 18 nov.
    function date(iso) {
        const d = new Date(`${iso}T12:00:00`);
        const f = (locale, month) => d.toLocaleDateString(locale, { month, day: 'numeric' });
        return tri([f('en-US', 'short'), f('zh-CN', 'numeric'), f('fr-FR', 'short')]);
    }

    function row(item) {
        const key = stateOf(item) in ICON ? stateOf(item) : 'open';
        return `<div class="gh__row">
            <time class="gh-date" datetime="${esc(item.created)}">${date(item.created)}</time>
            <svg class="gh-ico gh-ico--${key}" viewBox="0 0 16 16" role="img" aria-label="${STATE[key]}"><title>${STATE[key]}</title><path d="${ICON[key]}"/></svg>
            <span class="gh-kind gh-kind--${item.kind}">${item.kind === 'pr' ? 'PR' : 'Issue'}</span>
            <a class="gh-repo" href="https://github.com/${esc(item.repo)}" target="_blank" rel="noopener noreferrer">${esc(item.repo)}</a>
            <a class="gh-title" href="${esc(item.url)}" target="_blank" rel="noopener noreferrer" title="${esc(item.title)}">${esc(item.title)}</a>
        </div>`;
    }

    function render(root, data) {
        const prs = (data.prs || []).map((p) => ({ ...p, kind: 'pr' }));
        const issues = (data.issues || []).map((i) => ({ ...i, kind: 'issue' }));
        const all = [...prs, ...issues].sort((a, b) => b.created.localeCompare(a.created));
        const numbers = {
            prs: prs.length,
            merged: prs.filter((p) => p.state === 'merged').length,
            repos: new Set(all.map((p) => p.repo)).size,
            issues: issues.length,
        };

        root.querySelectorAll('[data-gh-n]').forEach((el) => { el.textContent = numbers[el.dataset.ghN]; });
        root.querySelector('[data-gh-updated]').innerHTML = `${tri(['Updated', '更新于', 'Mis à jour le'])} ${esc(data.updated || '')}`;

        let year = '';
        root.querySelector('[data-gh-log]').innerHTML = all.map((item) => {
            const y = item.created.slice(0, 4);
            const head = y !== year ? `<div class="gh__row gh__year"><span>${y}</span></div>` : '';
            year = y;
            return head + row(item);
        }).join('');

        // the skills panel repeats the merged count
        document.querySelectorAll('[data-contrib-stat]').forEach((el) => {
            const value = numbers[el.dataset.contribStat];
            if (value !== undefined) el.textContent = value;
        });
    }

    function init() {
        const root = document.querySelector('[data-contrib]');
        if (!root) return;
        fetch('data/contributions.json', { cache: 'no-cache' })
            .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
            .then((data) => render(root, data))
            .catch(() => {
                root.querySelector('[data-gh-log]').innerHTML =
                    `<p class="gh__lbl">${tri(['Contribution data is unavailable right now.', '贡献数据暂时无法加载。', 'Données de contribution indisponibles pour le moment.'])}</p>`;
            });
    }

    document.addEventListener('DOMContentLoaded', init);
})();
