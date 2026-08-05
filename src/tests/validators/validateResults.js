/**
 * validateResults.js — Master result validator.
 *
 * Composes all sub-validators and adds the expected-vs-actual share comparison.
 * This is the primary entry point called by testContext.js for every test case.
 *
 * Exported:
 *   - normalizeExpected(expected) → normalized key map
 *   - validateResults(result, expected) → string[] of errors
 */

import { validateEstate }  from './validateEstate.js';
import { validateShares }  from './validateShares.js';
import { validateBlocking } from './validateBlocking.js';
import { validateAwl }     from './validateAwl.js';
import { validateRadd }    from './validateRadd.js';
import { legacyKeyMap }    from '../../data/heirs.js';

// ─── Key Normalisation ────────────────────────────────────────────────────────

/**
 * Map legacy expected keys to canonical engine keys.
 * e.g. { brother: '1/2' } → { fullBrother: '1/2' }
 *
 * @param {Object} expected
 * @returns {Object}
 */
export function normalizeExpected(expected = {}) {
    const out = {};
    for (const [key, value] of Object.entries(expected)) {
        out[legacyKeyMap[key] || key] = value;
    }
    return out;
}

// ─── Fraction Helpers ─────────────────────────────────────────────────────────

/**
 * Parse a fraction string like "3/7", "1", or "0" into { num, den }.
 */
function parseFraction(str) {
    if (str === '1') return { num: 1, den: 1 };
    if (str === '0') return { num: 0, den: 1 };
    const parts = String(str).split('/');
    return {
        num: parseInt(parts[0], 10),
        den: parts[1] ? parseInt(parts[1], 10) : 1,
    };
}

/**
 * Check mathematical equivalence of two fractions.
 * a/b == c/d  ⟺  a*d == c*b
 */
function fractionsEqual(a, b) {
    return a.num * b.den === b.num * a.den;
}

// ─── Expected vs Actual Comparison ───────────────────────────────────────────

/**
 * Compare expected shares against actual engine output.
 *
 * @param {{ shares: Array }} result
 * @param {Object} rawExpected  - { heirKey: '3/7' | '1' | '0', ... }
 * @returns {string[]}
 */
function compareExpected(result, rawExpected) {
    const errors = [];
    const expected = normalizeExpected(rawExpected);

    // ── Check every expected heir ──────────────────────────────────────────
    for (const [heir, expectedStr] of Object.entries(expected)) {
        const share = result.shares.find(s => s.heir === heir);

        if (!share) {
            // Tolerate missing entry if expected is "0"
            if (expectedStr === '0') continue;
            errors.push(`Missing expected share for "${heir}" (expected ${expectedStr})`);
            continue;
        }

        const { num, den } = share.adjustedShare || { num: 0, den: 1 };
        const actualStr    = num === den ? '1' : `${num}/${den}`;
        const expFrac      = parseFraction(expectedStr);
        const actFrac      = { num, den };

        if (!fractionsEqual(actFrac, expFrac)) {
            errors.push(
                `Share mismatch for "${heir}": expected ${expectedStr}, got ${actualStr}`
            );
        }
    }

    // ── Check for unexpected positive shares ───────────────────────────────
    for (const share of result.shares) {
        if (share.heir === 'baytAlMal') continue;
        if (share.status && share.status.includes('Blocked')) continue;

        const { num = 0 } = share.adjustedShare || {};
        if (num > 0 && !expected[share.heir]) {
            errors.push(
                `Unexpected share for "${share.heir}": got ${share.adjustedShare.num}/${share.adjustedShare.den} ` +
                `(heir not listed in expected)`
            );
        }
    }

    return errors;
}

// ─── Master Validator ─────────────────────────────────────────────────────────

/**
 * Run all structural validators + expected comparison.
 *
 * @param {Object} result       - Raw engine output
 * @param {Object} expected     - Expected shares map (may use legacy keys)
 * @param {Object} [options]
 * @param {boolean} [options.skipStructural=false] - Skip estate/share/blocking checks
 * @returns {string[]}           - All error messages; empty = pass
 */
export function validateResults(result, expected = {}, options = {}) {
    const errors = [];

    if (!options.skipStructural) {
        errors.push(...validateShares(result));
        errors.push(...validateEstate(result));
        errors.push(...validateBlocking(result));
        errors.push(...validateAwl(result));
        errors.push(...validateRadd(result));
    }

    // Always compare expected vs actual
    if (expected && Object.keys(expected).length > 0) {
        errors.push(...compareExpected(result, expected));
    }

    return errors;
}
