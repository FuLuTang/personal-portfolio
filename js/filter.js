/**
 * Project Filter Switcher Logic
 * Handles the "sliding liquid" animation tracking and the actual filtering of project sections.
 */

document.addEventListener('DOMContentLoaded', () => {
    const switcher = document.querySelector('.switcher');
    const projectWrappers = {
        school: document.getElementById('school-projects-wrapper'),
        personal: document.getElementById('personal-projects-wrapper')
    };

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
     * Filters the project sections based on the selected category.
     * @param {string} category - 'all', 'school', or 'personal'
     */
    function filterProjects(category) {
        // Simple fade out effect could be added here, but for now we toggle display
        if (category === 'all') {
            if (projectWrappers.school) projectWrappers.school.classList.remove('hidden');
            if (projectWrappers.personal) projectWrappers.personal.classList.remove('hidden');
        } else if (category === 'school') {
            if (projectWrappers.school) projectWrappers.school.classList.remove('hidden');
            if (projectWrappers.personal) projectWrappers.personal.classList.add('hidden');
        } else if (category === 'personal') {
            if (projectWrappers.school) projectWrappers.school.classList.add('hidden');
            if (projectWrappers.personal) projectWrappers.personal.classList.remove('hidden');
        }
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
