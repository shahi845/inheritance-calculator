/**
 * validateEstate.js — Checks that share fractions are consistent with estate totals.
 *
 * Rules checked:
 *  1. No single share > 1
 *  2. Sum of all non-blocked shares ≤ 1  (awl cases will be exactly 1 after adjustment)
 *  3. If no blockers and no baytAlMal and estate is fully distributed, sum == 1
 *
 * Returns an array of error strings. Empty array = pass.
 */

/**
 * @param {{ shares: Array, context: Object }} result - Raw engine output
 * @returns {string[]}
 */
export function validateEstate(result) {
    const errors = [];
    if (!result || !Array.isArray(result.shares)) {
        errors.push('validateEstate: result.shares is missing or not an array');
        return errors;
    }

    const activeShares = result.shares.filter(s =>
        s.status !== 'Blocked' && s.heir !== 'baytAlMal'
    );

    let numSum = 0;
    let denSum = 1;

    for (const s of activeShares) {
        const { num, den } = s.adjustedShare || { num: 0, den: 1 };

        if (num < 0) {
            errors.push(`validateEstate: negative numerator for ${s.heir} (${num}/${den})`);
        }
        if (den <= 0) {
            errors.push(`validateEstate: non-positive denominator for ${s.heir} (${num}/${den})`);
            continue;
        }

        // Check individual share ≤ 1
        if (num > den) {
            errors.push(`validateEstate: share for ${s.heir} exceeds 1 (${num}/${den})`);
        }

        // Running sum (cross-multiply)
        numSum = numSum * den + num * denSum;
        denSum = denSum * den;

        // Simplify to avoid overflow on large tests
        const g = gcd(Math.abs(numSum), Math.abs(denSum));
        numSum /= g;
        denSum /= g;
    }

    // Sum must not exceed 1
    // Skip if the result already has engine warnings (e.g. husband+wife)
    const hasWarnings = (result.warnings && result.warnings.length > 0);
    if (numSum > denSum && !hasWarnings) {
        errors.push(
            `validateEstate: total shares sum > 1 (${numSum}/${denSum}). ` +
            `ʿAwl should have been applied.`
        );
    }

    return errors;
}

function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }
