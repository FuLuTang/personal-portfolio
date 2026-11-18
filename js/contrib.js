/* Open-source contributions: renders data/contributions.json (refreshed daily by
   .github/workflows/contributions.yml). No request goes to the GitHub API from
   the visitor's browser, so there is no rate limit to hit. */
(() => {
    'use strict';

    const VISIBLE_PER_REPO = 4;

    const T = {
        merged: ['Merged', '已合并', 'Fusionnée'],
        open: ['Open', '进行中', 'Ouverte'],
        closed: ['Closed', '未合并', 'Fermée'],
        issueOpen: ['Open', '未关闭', 'Ouverte'],
        issueClosed: ['Closed', '已关闭', 'Fermée'],
        prs: ['pull requests', '个 PR', 'pull requests'],
        mergedStat: ['merged', '已合并', 'fusionnées'],
        repos: ['repositories', '个仓库', 'dépôts'],
        issues: ['issues', '个 Issue', 'issues'],
        more: ['Show all', '展开全部', 'Tout afficher'],
        issuesTitle: ['Issues reported', '提交的 Issue', 'Issues signalées'],
        updated: ['Updated', '更新于', 'Mis à jour le'],
        error: ['Contribution data is unavailable right now.', '贡献数据暂时无法加载。', 'Données de contribution indisponibles pour le moment.'],
    };

    const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    // three spans, one per language; css/bento.css shows the one matching <html lang>
    const tri = ([en, zh, fr]) =>
        `<span class="lang-en">${en}</span><span class="lang-cn">${zh}</span><span class="lang-fr">${fr}</span>`;

    const pill = (state, isIssue) => {
        const key = isIssue ? (state === 'open' ? 'issueOpen' : 'issueClosed') : state;
        return `<span class="status status--${isIssue ? 'issue-' : ''}${state}">${tri(T[key])}</span>`;
    };

    const row = (item, isIssue) => `
        <li class="contrib__item">
            ${pill(item.state, isIssue)}
            <a class="contrib__link" href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">${esc(item.title)}</a>
            <span class="contrib__date">#${esc(item.number)} · ${esc(item.created)}</span>
        </li>`;

    function groupByRepo(prs) {
        const groups = new Map();
        prs.forEach((pr) => {
            if (!groups.has(pr.repo)) groups.set(pr.repo, []);
            groups.get(pr.repo).push(pr);
        });
        // repos with the most merged PRs first, then by most recent activity
        return [...groups.entries()].sort((a, b) => {
            const merged = (list) => list.filter((p) => p.state === 'merged').length;
            return merged(b[1]) - merged(a[1]) || b[1][0].created.localeCompare(a[1][0].created);
        });
    }

    function repoCard([repo, list]) {
        const merged = list.filter((p) => p.state === 'merged').length;
        const shown = list.slice(0, VISIBLE_PER_REPO).map((p) => row(p, false)).join('');
        const rest = list.slice(VISIBLE_PER_REPO).map((p) => row(p, false)).join('');
        return `
        <article class="contrib__repo">
            <header class="contrib__repoHead">
                <a class="contrib__repoName" href="https://github.com/${esc(repo)}" target="_blank" rel="noopener noreferrer">${esc(repo)}</a>
                <span class="contrib__repoCount">${merged}/${list.length} ${tri(T.mergedStat)}</span>
            </header>
            <ul class="contrib__list">${shown}</ul>
            ${rest ? `<details class="contrib__more"><summary>${tri(T.more)} (${list.length})</summary><ul class="contrib__list">${rest}</ul></details>` : ''}
        </article>`;
    }

    function render(root, data) {
        const prs = data.prs || [];
        const issues = data.issues || [];
        const groups = groupByRepo(prs);
        const merged = prs.filter((p) => p.state === 'merged').length;

        const stats = [
            [prs.length, T.prs],
            [merged, T.mergedStat],
            [groups.length, T.repos],
            [issues.length, T.issues],
        ].map(([n, label]) => `<div class="contrib__stat"><strong>${n}</strong><span>${tri(label)}</span></div>`).join('');

        root.innerHTML = `
            <div class="contrib__stats">${stats}</div>
            <div class="contrib__grid">${groups.map(repoCard).join('')}</div>
            ${issues.length ? `
            <article class="contrib__repo contrib__repo--issues">
                <header class="contrib__repoHead"><span class="contrib__repoName">${tri(T.issuesTitle)}</span></header>
                <ul class="contrib__list">${issues.map((i) => `
                    <li class="contrib__item">
                        ${pill(i.state, true)}
                        <a class="contrib__link" href="${esc(i.url)}" target="_blank" rel="noopener noreferrer">${esc(i.title)}</a>
                        <span class="contrib__date">${esc(i.repo)} · ${esc(i.created)}</span>
                    </li>`).join('')}
                </ul>
            </article>` : ''}
            <p class="contrib__updated">${tri(T.updated)} ${esc(data.updated || '')} · GitHub Actions</p>`;

        // the hero shows the same headline numbers
        document.querySelectorAll('[data-contrib-stat]').forEach((el) => {
            const value = { prs: prs.length, merged, repos: groups.length }[el.dataset.contribStat];
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
