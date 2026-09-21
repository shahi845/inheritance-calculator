/**
 * i18n.js — Core Internationalization Engine for Islamic Inheritance Platform.
 * Handles language switching, bidirectional RTL/LTR text, DOM translation, and persistence.
 */

import { translations, SUPPORTED_LANGUAGES } from './translations.js';

let currentLang = 'en';
const listeners = new Set();

/**
 * Returns the currently active language code.
 * @returns {string}
 */
export function getLanguage() {
    return currentLang;
}

/**
 * Returns array of all supported language objects.
 */
export function getSupportedLanguages() {
    return SUPPORTED_LANGUAGES;
}

/**
 * Translates a key with an optional fallback.
 * @param {string} key
 * @param {string} [fallback='']
 * @returns {string}
 */
export function t(key, fallback = '') {
    const langDict = translations[currentLang];
    if (langDict && langDict[key] !== undefined) {
        return langDict[key];
    }
    const enDict = translations['en'];
    if (enDict && enDict[key] !== undefined) {
        return enDict[key];
    }
    return fallback || key;
}

/**
 * Sets the active language, updates HTML attributes, translates the DOM,
 * and notifies listeners.
 * @param {string} langCode
 */
export function setLanguage(langCode) {
    const langObj = SUPPORTED_LANGUAGES.find(l => l.code === langCode);
    if (!langObj) {
        console.warn(`[i18n] Language "${langCode}" not supported. Falling back to "en".`);
        langCode = 'en';
    }

    currentLang = langCode;
    localStorage.setItem('faraid_language', langCode);

    const isRtl = langCode === 'ar' || langCode === 'ur';

    // Update document root attributes
    document.documentElement.lang = langCode;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';

    // Update body classes for styling and typography
    document.body.classList.toggle('rtl', isRtl);
    document.body.classList.toggle('ltr', !isRtl);

    // Remove previous language classes
    SUPPORTED_LANGUAGES.forEach(l => {
        document.body.classList.remove(`lang-${l.code}`);
    });
    document.body.classList.add(`lang-${langCode}`);

    // Update UI controls
    syncLanguageSelectors(langCode);

    // Translate all static DOM elements
    translateDOM();

    // Trigger external listeners
    listeners.forEach(fn => {
        try {
            fn(langCode, isRtl);
        } catch (err) {
            console.error('[i18n] Error in language change listener:', err);
        }
    });

    // Dispatch native window event for decoupled components
    window.dispatchEvent(new CustomEvent('faraid:languageChange', {
        detail: { language: langCode, isRtl, langObj }
    }));
}

/**
 * Registers a listener callback to run on language switch.
 * @param {Function} callback (langCode, isRtl) => void
 * @returns {Function} unsubscribe function
 */
export function onLanguageChange(callback) {
    listeners.add(callback);
    return () => listeners.delete(callback);
}

/**
 * Translates all DOM nodes containing data-i18n attributes.
 */
export function translateDOM(container = document) {
    // 1. Text Content
    container.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (key) {
            // Save initial text as fallback
            if (!el.dataset.i18nFallback) {
                el.dataset.i18nFallback = el.textContent.trim();
            }
            const translated = t(key, el.dataset.i18nFallback);
            if (translated) {
                el.textContent = translated;
            }
        }
    });

    // 2. Input Placeholders
    container.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (key) {
            if (!el.dataset.i18nPlaceholderFallback) {
                el.dataset.i18nPlaceholderFallback = el.getAttribute('placeholder') || '';
            }
            const translated = t(key, el.dataset.i18nPlaceholderFallback);
            if (translated) {
                el.setAttribute('placeholder', translated);
            }
        }
    });

    // 3. Aria Labels
    container.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
        const key = el.getAttribute('data-i18n-aria-label');
        if (key) {
            if (!el.dataset.i18nAriaFallback) {
                el.dataset.i18nAriaFallback = el.getAttribute('aria-label') || '';
            }
            const translated = t(key, el.dataset.i18nAriaFallback);
            if (translated) {
                el.setAttribute('aria-label', translated);
            }
        }
    });

    // 4. Titles / Tooltips
    container.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        if (key) {
            if (!el.dataset.i18nTitleFallback) {
                el.dataset.i18nTitleFallback = el.getAttribute('title') || '';
            }
            const translated = t(key, el.dataset.i18nTitleFallback);
            if (translated) {
                el.setAttribute('title', translated);
            }
        }
    });
}

/**
 * Synchronizes select inputs and cards to reflect the current language.
 * @param {string} langCode
 */
function syncLanguageSelectors(langCode) {
    const quickSelect = document.getElementById('headerLanguageSelect');
    if (quickSelect && quickSelect.value !== langCode) {
        quickSelect.value = langCode;
    }

    const settingsSelect = document.getElementById('settingsLanguageSelect');
    if (settingsSelect && settingsSelect.value !== langCode) {
        settingsSelect.value = langCode;
    }

    // Sync visual language cards in settings
    document.querySelectorAll('.lang-card').forEach(card => {
        const cardLang = card.getAttribute('data-lang');
        const isActive = cardLang === langCode;
        card.classList.toggle('active', isActive);

        const badge = card.querySelector('.lang-active-badge');
        if (isActive) {
            if (!badge) {
                const header = card.querySelector('.lang-card-header');
                if (header) {
                    const span = document.createElement('span');
                    span.className = 'lang-active-badge';
                    span.style.cssText = 'font-size:0.75rem;color:var(--accent);font-weight:700;';
                    span.textContent = 'Active';
                    header.appendChild(span);
                }
            }
        } else if (badge) {
            badge.remove();
        }
    });
}

/**
 * Initializes i18n subsystem.
 */
export function initI18n() {
    // 1. Detect saved or default language
    const saved = localStorage.getItem('faraid_language');
    const initialLang = saved && SUPPORTED_LANGUAGES.some(l => l.code === saved)
        ? saved
        : 'en';

    // 2. Setup Header Quick Language Selector
    const headerSelect = document.getElementById('headerLanguageSelect');
    if (headerSelect) {
        headerSelect.value = initialLang;
        headerSelect.addEventListener('change', (e) => {
            setLanguage(e.target.value);
        });
    }

    // 3. Setup Settings Language Selector
    const settingsSelect = document.getElementById('settingsLanguageSelect');
    if (settingsSelect) {
        settingsSelect.value = initialLang;
        settingsSelect.addEventListener('change', (e) => {
            setLanguage(e.target.value);
        });
    }

    // 4. Setup Language Cards clicks
    document.querySelectorAll('.lang-card').forEach(card => {
        card.addEventListener('click', () => {
            const lang = card.getAttribute('data-lang');
            if (lang) {
                setLanguage(lang);
            }
        });
    });

    // 5. Apply initial language
    setLanguage(initialLang);
}
