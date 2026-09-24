(() => {
    'use strict';

    function initializeProjectFilter() {
        const switcher = document.querySelector('[data-project-filter]');
        const cards = document.querySelectorAll('.project-card');
        if (!switcher || !cards.length) return;

        function filterProjects(category) {
            cards.forEach((card) => {
                const matches = category === 'all' || card.dataset.category === category;
                card.classList.toggle('hidden', !matches);
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
