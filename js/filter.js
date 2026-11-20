(() => {
    'use strict';

    // cards are rendered later by js/home-projects.js, so they're looked up on every run
    function filterProjects() {
        const switcher = document.querySelector('[data-project-filter]');
        if (!switcher) return;
        const checked = switcher.querySelector('input[type="radio"]:checked');
        const category = checked ? checked.value : 'all';

        document.querySelectorAll('.project-card').forEach((card) => {
            const matches = category === 'all' || card.dataset.category === category;
            card.classList.toggle('hidden', !matches);
        });

        // hide a tier that has nothing left in it (e.g. "Internship" has no list items)
        document.querySelectorAll('[data-project-group]').forEach((group) => {
            const hasCards = group.querySelector('.project-card');
            group.classList.toggle('hidden', Boolean(hasCards) && !group.querySelector('.project-card:not(.hidden)'));
        });

        // featured rows alternate picture left / right among the visible ones
        document.querySelectorAll('.project-card--feature:not(.hidden)').forEach((card, i) => {
            card.classList.toggle('is-flipped', i % 2 === 1);
        });
    }

    function initializeProjectFilter() {
        const switcher = document.querySelector('[data-project-filter]');
        if (!switcher) return;
        filterProjects();
        switcher.addEventListener('change', (event) => {
            if (event.target.matches('input[type="radio"]')) filterProjects();
        });
    }

    window.refreshProjectFilter = filterProjects;
    document.addEventListener('DOMContentLoaded', initializeProjectFilter);
})();
