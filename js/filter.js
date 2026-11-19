(() => {
    'use strict';

    function initializeProjectFilter() {
        const switcher = document.querySelector('[data-project-filter]');
        const cards = document.querySelectorAll('.project-card');
        const groups = document.querySelectorAll('[data-project-group]');
        if (!switcher || !cards.length) return;

        function filterProjects(category) {
            cards.forEach((card) => {
                const matches = category === 'all' || card.dataset.category === category;
                card.classList.toggle('hidden', !matches);
            });

            // hide a tier that has nothing left in it (e.g. "Internship" has no list items)
            groups.forEach((group) => {
                group.classList.toggle('hidden', !group.querySelector('.project-card:not(.hidden)'));
            });

            // featured rows alternate picture left / right among the visible ones
            document.querySelectorAll('.project-card--feature:not(.hidden)').forEach((card, i) => {
                card.classList.toggle('is-flipped', i % 2 === 1);
            });
        }

        const checkedInput = switcher.querySelector('input[type="radio"]:checked');
        filterProjects(checkedInput ? checkedInput.value : 'all');

        switcher.addEventListener('change', (event) => {
            if (event.target.matches('input[type="radio"]')) {
                filterProjects(event.target.value);
            }
        });
    }

    document.addEventListener('DOMContentLoaded', initializeProjectFilter);
})();
