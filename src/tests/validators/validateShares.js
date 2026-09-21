/**
 * validateShares.js — Checks structural validity of each ShareEntry.
 *
 * Rules:
 *  - adjustedShare.num >= 0
 *  - adjustedShare.den > 0
 *  - Fraction is in reduced form (gcd of num & den == 1)
 *  - count > 0 for any heir present in shares
 *  - status is one of the known values
 *
 * Returns array of error strings.
 */

const VALID_STATUSES = new Set([
    'Sharer', 'Residuary', 'Sharer + Residuary',
    'Blocked', 'Bayt al-Māl', 'Distant Kindred',
    'Sharer + Radd', 'Dhawu al-Arham',
    'No Heirs',
]);

/**
 * @param {{ shares: Array }} result
 * @returns {string[]}
 */
export function validateShares(result) {
    const errors = [];
    if (!result || !Array.isArray(result.shares)) {
        errors.push('validateShares: result.shares is missing or not an array');
        return errors;
    }

    result.shares.forEach((s, i) => {
        const tag = `shares[${i}] (${s.heir ?? '?'})`;

        if (!s.heir) {
            errors.push(`${tag}: missing heir key`);
        }

        if (typeof s.count !== 'number' || s.count < 1) {
            errors.push(`${tag}: count must be >= 1, got ${s.count}`);
        }

        const { num = 0, den = 1 } = s.adjustedShare || {};

        if (num < 0) {
            errors.push(`${tag}: adjustedShare.num is negative (${num})`);
        }
        if (den <= 0) {
            errors.push(`${tag}: adjustedShare.den is non-positive (${den})`);
        }

        if (num > 0 && den > 0) {
            const g = gcd(num, den);
            if (g > 1) {
                errors.push(
                    `${tag}: adjustedShare ${num}/${den} is not fully reduced (gcd=${g}). ` +
                    `Should be ${num / g}/${den / g}.`
                );
            }
        }

        if (s.status && !VALID_STATUSES.has(s.status)) {
            // Soft warning — don't fail, just note unknown status
            errors.push(`${tag}: unrecognised status "${s.status}" (may be new engine value)`);
        }
    });

    return errors;
}

function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }
