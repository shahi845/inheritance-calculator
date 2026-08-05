/**
 * settingsSection.js — Application Settings Controller.
 * Handles Light/Dark theme switching, currency preferences, and default settings.
 */

export function initSettingsSection() {
    setupThemeToggle();
    setupDefaultMadhhab();
}

function setupThemeToggle() {
    const themeSelect = document.getElementById('themeSelect');
    const themeCards = document.querySelectorAll('.theme-card');

    // Load saved theme
    const savedTheme = localStorage.getItem('faraid_theme') || 'dark';
    if (themeSelect) themeSelect.value = savedTheme;
    applyTheme(savedTheme);

    if (themeSelect) {
        themeSelect.addEventListener('change', (e) => {
            const theme = e.target.value;
            localStorage.setItem('faraid_theme', theme);
            applyTheme(theme);
        });
    }

    themeCards.forEach(card => {
        card.addEventListener('click', () => {
            const theme = card.dataset.theme;
            if (!theme) return;
            localStorage.setItem('faraid_theme', theme);
            if (themeSelect) themeSelect.value = theme;
            applyTheme(theme);
        });
    });
}

function applyTheme(theme) {
    document.body.classList.remove(
        'light-theme',
        'theme-dark',
        'theme-light',
        'theme-emerald',
        'theme-sapphire',
        'theme-parchment'
    );

    if (theme === 'light') {
        document.body.classList.add('light-theme', 'theme-light');
    } else if (theme === 'dark') {
        document.body.classList.add('theme-dark');
    } else {
        document.body.classList.add(`theme-${theme}`);
    }

    // Sync active class on visual cards
    document.querySelectorAll('.theme-card').forEach(card => {
        if (card.dataset.theme === theme) {
            card.classList.add('active');
            const badge = card.querySelector('.theme-card-header span:last-child');
            if (!badge || !badge.textContent.includes('Active')) {
                const header = card.querySelector('.theme-card-header');
                if (header) {
                    const existingActive = header.querySelector('.active-badge');
                    if (!existingActive) {
                        const span = document.createElement('span');
                        span.className = 'active-badge';
                        span.style.cssText = 'font-size:0.75rem;color:var(--accent);font-weight:700;';
                        span.textContent = 'Active';
                        header.appendChild(span);
                    }
                }
            }
        } else {
            card.classList.remove('active');
            const badge = card.querySelector('.active-badge');
            if (badge) badge.remove();
        }
    });
}

function setupDefaultMadhhab() {
    const defaultSelect = document.getElementById('defaultMadhhabSelect');
    if (!defaultSelect) return;

    const saved = localStorage.getItem('faraid_default_madhhab') || 'shafii';
    defaultSelect.value = saved;

    defaultSelect.addEventListener('change', (e) => {
        localStorage.setItem('faraid_default_madhhab', e.target.value);
    });
}
