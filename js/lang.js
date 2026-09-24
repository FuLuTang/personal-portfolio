(() => {
    'use strict';

    const SUPPORTED_LANGUAGES = ['en', 'zh', 'fr'];
    const LEGACY_LANGUAGE_MAP = { cn: 'zh' };

    function normalizeLanguage(language) {
        const normalized = String(language || '').toLowerCase().split('-')[0];
        const mapped = LEGACY_LANGUAGE_MAP[normalized] || normalized;
        return SUPPORTED_LANGUAGES.includes(mapped) ? mapped : null;
    }

    function getStoredLanguage() {
        try {
            return normalizeLanguage(localStorage.getItem('preferredLanguage'));
        } catch (_) {
            return null;
        }
    }

    function setDocumentTitle(language) {
        const title = document.title;
        const localizedTitle = document.documentElement.dataset[`title${language.charAt(0).toUpperCase()}${language.slice(1)}`];
        if (localizedTitle) document.title = localizedTitle;
        return title;
    }

    function setLanguage(language, { persist = true } = {}) {
        const selectedLanguage = normalizeLanguage(language);
        if (!selectedLanguage) return;

        document.documentElement.lang = selectedLanguage;
        setDocumentTitle(selectedLanguage);

        document.querySelectorAll('[data-language]').forEach((control) => {
            const isActive = normalizeLanguage(control.dataset.language) === selectedLanguage;
            control.classList.toggle('active', isActive);
            control.setAttribute('aria-current', isActive ? 'true' : 'false');
        });

        if (persist) {
            try {
                localStorage.setItem('preferredLanguage', selectedLanguage);
            } catch (_) {
                // Storage can be unavailable in privacy-restricted contexts.
            }
        }
    }

    function initializeLanguage() {
        const browserLanguage = normalizeLanguage(navigator.language);
        setLanguage(getStoredLanguage() || browserLanguage || 'en');

        document.querySelectorAll('[data-language]').forEach((control) => {
            control.addEventListener('click', (event) => {
                event.preventDefault();
                setLanguage(control.dataset.language);
            });
        });
    }

    window.setLanguage = setLanguage;
    document.addEventListener('DOMContentLoaded', initializeLanguage);
})();
