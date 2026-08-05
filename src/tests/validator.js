/**
 * validator.js (top-level shim) — Backward-compatibility re-export.
 *
 * The real validators live in validators/. This shim re-exports the
 * master validator for any legacy import of 'src/tests/validator.js'.
 */
export { validateResults, normalizeExpected } from './validators/validateResults.js';
export { validateEstate }                     from './validators/validateEstate.js';
export { validateShares }                     from './validators/validateShares.js';
export { validateBlocking }                   from './validators/validateBlocking.js';
export { validateAwl }                        from './validators/validateAwl.js';
export { validateRadd }                       from './validators/validateRadd.js';
