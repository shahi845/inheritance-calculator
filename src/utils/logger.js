/**
 * logger.js — Centralized application logging.
 */

export const logger = {
    log: (...args) => console.log('[Faraid Engine]', ...args),
    warn: (...args) => console.warn('[Faraid Engine]', ...args),
    error: (...args) => console.error('[Faraid Engine Error]', ...args),
    debug: (...args) => {
        if (typeof window !== 'undefined' && window.FARAID_DEBUG) {
            console.debug('[Faraid Engine Debug]', ...args);
        }
    }
};
