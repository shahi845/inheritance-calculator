/**
 * pageRouter.js — Client-side page router for the top navigation.
 *
 * Pages: home | calculator | learning | cases | advanced | references | settings
 *
 * The router shows/hides <section class="page-section"> elements and
 * marks the corresponding .top-nav-item as active.
 *
 * It does NOT change the URL (hash-based routing can be added later).
 */

/** @type {string} */
let currentPage = 'home';

/**
 * Navigate to a named page.
 * @param {string} page — one of the PAGE_IDS
 */
export function navigateTo(page) {
    if (!PAGE_IDS.includes(page)) return;

    // Deactivate all pages
    document.querySelectorAll('.page-section').forEach(el => {
        el.classList.remove('active-page');
    });

    // Activate target page
    const target = document.getElementById(`page-${page}`);
    if (target) target.classList.add('active-page');

    // Update nav tab states
    document.querySelectorAll('.top-nav-item').forEach(btn => {
        const isActive = btn.dataset.page === page;
        btn.classList.toggle('active', isActive);
        if (isActive) {
            const nav = btn.closest('.top-nav');
            if (nav && nav.scrollWidth > nav.clientWidth) {
                const navRect = nav.getBoundingClientRect();
                const btnRect = btn.getBoundingClientRect();
                const offset = (btnRect.left + btnRect.width / 2) - (navRect.left + navRect.width / 2);
                nav.scrollBy({ left: offset, behavior: 'smooth' });
            }
        }
    });

    currentPage = page;

    // Scroll to top on page change
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/** All registered page IDs */
const PAGE_IDS = ['home', 'calculator', 'learning', 'cases', 'advanced', 'references', 'settings', 'about'];

/**
 * Initialize the page router.
 * Wires up all .top-nav-item click handlers.
 */
export function initPageRouter() {
    document.querySelectorAll('.top-nav-item').forEach(btn => {
        btn.addEventListener('click', () => {
            const page = btn.dataset.page;
            if (page) navigateTo(page);
        });
    });

    // Wire home shortcut cards
    document.querySelectorAll('.home-shortcut-card[data-page]').forEach(card => {
        card.addEventListener('click', () => {
            const page = card.dataset.page;
            if (page) navigateTo(page);
        });
    });

    // Wire Advanced card "Open" buttons
    document.querySelectorAll('.adv-open-btn[data-action]').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            handleAdvancedAction(action);
        });
    });

    // Start on Home
    navigateTo('home');
}

/**
 * Handles actions triggered from the Advanced hub cards.
 * @param {string} action
 */
function handleAdvancedAction(action) {
    if (action === 'munasakhat') {
        // Navigate to Calculator page, then activate Munāsakhāt tab
        navigateTo('calculator');
        setTimeout(() => {
            const tab = document.getElementById('tab-munasakhat');
            if (tab) tab.click();
        }, 100);
    }
}

/** Returns the currently active page ID */
export function getCurrentPage() {
    return currentPage;
}
