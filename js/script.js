document.addEventListener('DOMContentLoaded', () => {
    const langButtons = document.querySelectorAll('.language-switcher button');
    const translatableElements = document.querySelectorAll('[lang]');

    // Function to switch language
    const switchLanguage = (targetLang) => {
        // Hide all translatable elements
        translatableElements.forEach(el => {
            el.classList.add('hidden');
        });

        // Show only the elements for the target language
        const elementsToShow = document.querySelectorAll(`[lang="${targetLang}"]`);
        elementsToShow.forEach(el => {
            el.classList.remove('hidden');
        });

        // Update active button state
        langButtons.forEach(button => {
            if (button.dataset.lang === targetLang) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });

        // Set html lang attribute
        document.documentElement.lang = targetLang;

        // Store preference
        localStorage.setItem('preferredLanguage', targetLang);
    };

    // Add click event listeners to buttons
    langButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            switchLanguage(e.target.dataset.lang);
        });
    });

    // Check for stored language preference on page load
    const preferredLanguage = localStorage.getItem('preferredLanguage') || 'en';
    switchLanguage(preferredLanguage);
});