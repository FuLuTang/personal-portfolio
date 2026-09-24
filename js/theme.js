(() => {
    'use strict';

    const SUPPORTED_THEMES = ['light', 'dark'];
    const THEME_LABELS = {
        light: 'Switch to dark mode',
        dark: 'Switch to light mode'
    };
    const THEME_ICONS = { light: '🌙', dark: '☀️' };

    function getStoredTheme() {
        try {
            const theme = localStorage.getItem('preferredTheme');
            return SUPPORTED_THEMES.includes(theme) ? theme : null;
        } catch (_) {
            return null;
        }
    }

    function setTheme(theme, { persist = true } = {}) {
        if (!SUPPORTED_THEMES.includes(theme)) return;

        document.documentElement.dataset.theme = theme;
        const button = document.querySelector('[data-theme-toggle]');
        if (button) {
            button.textContent = THEME_ICONS[theme];
            button.setAttribute('aria-label', THEME_LABELS[theme]);
            button.setAttribute('title', THEME_LABELS[theme]);
        }

        if (persist) {
            try {
                localStorage.setItem('preferredTheme', theme);
            } catch (_) {
                // Storage can be unavailable in privacy-restricted contexts.
            }
        }
    }

    function toggleTheme() {
        const currentTheme = document.documentElement.dataset.theme || 'light';
        setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    }

    function initializeTheme() {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(getStoredTheme() || (prefersDark ? 'dark' : 'light'));

        const button = document.querySelector('[data-theme-toggle]');
        if (button) button.addEventListener('click', toggleTheme);
    }

    window.toggleTheme = toggleTheme;
    document.addEventListener('DOMContentLoaded', initializeTheme);
})();
