/* Open-source contributions: one scrollable timeline built from
   data/contributions.json (refreshed daily by .github/workflows/contributions.yml).
   No request goes to the GitHub API from the visitor's browser. */
(() => {
    'use strict';

    const T = {
        merged: ['Merged', '已合并', 'Fusionnée'],
        open: ['Open', '进行中', 'Ouverte'],
        closed: ['Closed', '未合并', 'Fermée'],
        issueOpen: ['Open', '未关闭', 'Ouverte'],
        issueClosed: ['Closed', '已关闭', 'Fermée'],
        prs: ['PRs', '个 PR', 'PR'],
        mergedStat: ['merged', '已合并', 'fusionnées'],
        repos: ['repos', '个仓库', 'dépôts'],
        issues: ['issues', '个 Issue', 'issues'],
        updated: ['Updated', '更新于', 'Mis à jour le'],
        error: ['Contribution data is unavailable right now.', '贡献数据暂时无法加载。', 'Données de contribution indisponibles pour le moment.'],
    };

    const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    // three spans, one per language; css/bento.css shows the one matching <html lang>
    const tri = ([en, zh, fr]) =>
        `<span class="lang-en">${en}</span><span class="lang-cn">${zh}</span><span class="lang-fr">${fr}</span>`;

    function statusKey(item) {
        if (item.kind === 'issue') return item.state === 'open' ? 'issueOpen' : 'issueClosed';
        return item.state; // merged | open | closed
    }

    const entry = (item) => {
        const key = statusKey(item);
        return `
        <li class="tl__item tl__item--${key}">
            <time class="tl__date" datetime="${esc(item.created)}">${esc(item.created)}</time>
            <div class="tl__body">
                <div class="tl__meta">
                    <span class="tl__kind">${item.kind === 'pr' ? 'PR' : 'Issue'}</span>
                    <a class="tl__repo" href="https://github.com/${esc(item.repo)}" target="_blank" rel="noopener noreferrer">${esc(item.repo)}</a>
                    <span class="status status--${key}">${tri(T[key])}</span>
                </div>
                <a class="tl__title" href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">${esc(item.title)}</a>
            </div>
        </li>`;
    };

    function render(root, data) {
        const prs = (data.prs || []).map((p) => ({ ...p, kind: 'pr' }));
        const issues = (data.issues || []).map((i) => ({ ...i, kind: 'issue' }));
        const all = [...prs, ...issues].sort((a, b) => b.created.localeCompare(a.created));
        const merged = prs.filter((p) => p.state === 'merged').length;
        const repos = new Set(prs.map((p) => p.repo)).size;

        const stats = [
            [prs.length, T.prs],
            [merged, T.mergedStat],
            [repos, T.repos],
            [issues.length, T.issues],
        ].map(([n, label]) => `<span class="contrib__stat"><strong>${n}</strong> ${tri(label)}</span>`).join('');

        root.innerHTML = `
            <div class="contrib__head">
                <div class="contrib__stats">${stats}</div>
                <span class="contrib__updated">${tri(T.updated)} ${esc(data.updated || '')}</span>
            </div>
            <div class="contrib__scroll" tabindex="0">
                <ol class="tl">${all.map(entry).join('')}</ol>
            </div>`;

        // the hero shows the same headline number
        document.querySelectorAll('[data-contrib-stat]').forEach((el) => {
            const value = { prs: prs.length, merged, repos }[el.dataset.contribStat];
            if (value !== undefined) el.textContent = value;
        });
    }

    function init() {
        const root = document.querySelector('[data-contrib]');
        if (!root) return;
        fetch('data/contributions.json', { cache: 'no-cache' })
            .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
            .then((data) => render(root, data))
            .catch(() => { root.innerHTML = `<p class="tile__body">${tri(T.error)}</p>`; });
    }

    document.addEventListener('DOMContentLoaded', init);
})();
