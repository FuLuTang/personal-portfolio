// Theme (dark / light) toggle
// Supported themes — stored as a variable just like language options in lang.js
const SUPPORTED_THEMES = ['light', 'dark'];
const THEME_ICONS = {
    light: '☀️',   // shown when switching TO light (i.e. current theme is dark)
    dark: '🌙'     // shown when switching TO dark  (i.e. current theme is light)
};

function setTheme(theme) {
    if (SUPPORTED_THEMES.indexOf(theme) === -1) return;

    document.documentElement.setAttribute('data-theme', theme);

    const btn = document.getElementById('theme-toggle');
    if (btn) {
        // Icon shows what you'll switch TO
        btn.textContent = theme === 'dark' ? THEME_ICONS.light : THEME_ICONS.dark;
        btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }

    localStorage.setItem('preferredTheme', theme);
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    setTheme(current === 'dark' ? 'light' : 'dark');
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('preferredTheme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const defaultTheme = saved || (systemDark ? 'dark' : 'light');
    setTheme(defaultTheme);
});
