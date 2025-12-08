/**
 * Project Filter Switcher Logic
 * Handles the "sliding liquid" animation tracking and the actual filtering of project sections.
 */

document.addEventListener('DOMContentLoaded', () => {
    const switcher = document.querySelector('.switcher');

    if (switcher) {
        trackPrevious(switcher);

        // Add change listeners to inputs
        const radios = switcher.querySelectorAll('input[type="radio"]');
        radios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                filterProjects(e.target.value);
            });
        });
    }

    /**
     * Filters the project cards based on the selected category.
     * @param {string} category - 'all', 'school', or 'personal'
     */
    function filterProjects(category) {
        const cards = document.querySelectorAll('.project-card');

        cards.forEach(card => {
            if (category === 'all') {
                card.style.display = ''; // Reset inline display style
                card.classList.remove('hidden');
            } else {
                const cardCategory = card.getAttribute('data-category');
                if (cardCategory === category) {
                    card.style.display = ''; // Reset inline display style
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            }
        });
    }

    /**
     * Tracks the previous selection to enable the "direction-aware" sliding animation.
     * Adapted from the user's provided snippet.
     */
    function trackPrevious(el) {
        const radios = el.querySelectorAll('input[type="radio"]');
        let previousValue = null;

        // Find initially checked
        const initiallyChecked = el.querySelector('input[type="radio"]:checked');
        if (initiallyChecked) {
            previousValue = initiallyChecked.getAttribute("c-option");
            el.setAttribute('c-previous', previousValue);
        }

        radios.forEach(radio => {
            radio.addEventListener('change', () => {
                if (radio.checked) {
                    el.setAttribute('c-previous', previousValue ?? '');
                    previousValue = radio.getAttribute("c-option");
                }
            });
        });
    }
});
