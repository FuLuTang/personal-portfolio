function setLanguage(lang) {
    if (['en', 'cn', 'fr'].indexOf(lang) === -1) return;

    // Update HTML lang attribute (this triggers the CSS)
    document.documentElement.lang = lang;

    // Update active state in switcher
    document.querySelectorAll('.language-switcher a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('onclick').includes(`'${lang}'`)) {
            link.classList.add('active');
        }
    });

    // Save preference
    localStorage.setItem('preferredLanguage', lang);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('preferredLanguage');
    const browserLang = navigator.language.slice(0, 2);
    // Support English, Chinese, French. Default to English.
    const supportedLangs = ['en', 'cn', 'fr'];
    const defaultLang = savedLang || (supportedLangs.includes(browserLang) ? browserLang : 'en');

    setLanguage(defaultLang);
});
