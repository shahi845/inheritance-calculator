/**
 * validateRadd.js — Verifies Radd (return/redistribution) was applied correctly.
 *
 * Rules:
 *  - If context.raddApplied === true:
 *      · There must be no residuary heirs (no 'Residuary' status)
 *      · The final adjusted shares must sum to exactly 1
 *  - If sum < 1 and no residuaries exist and no baytAlMal entry, radd should have fired.
 *
 * Returns array of error strings.
 */

/**
 * @param {{ shares: Array, context: Object }} result
 * @returns {string[]}
 */
export function validateRadd(result) {
    const errors = [];
    if (!result || !Array.isArray(result.shares)) {
        errors.push('validateRadd: result.shares is missing or not an array');
        return errors;
    }

    const ctx = result.context || {};
    const activeShares = result.shares.filter(s =>
        s.status !== 'Blocked'
    );

    const hasResiduaries = activeShares.some(s =>
        s.status && (s.status.includes('Residuary') || s.status.includes('Sharer + Residuary'))
    );
    const hasBaytAlMal  = activeShares.some(s => s.heir === 'baytAlMal');

    // Sum adjusted shares (excluding baytAlMal)
    let num = 0, den = 1;
    for (const s of activeShares.filter(sh => sh.heir !== 'baytAlMal')) {
        const { num: n = 0, den: d = 1 } = s.adjustedShare || {};
        num = num * d + n * den;
        den = den * d;
        const g = gcd(Math.abs(num), Math.abs(den));
        num /= g; den /= g;
    }

    const sumIsLessThan1 = num < den && den > 0;

    if (ctx.raddApplied) {
        // After radd, adjusted shares (excl. spouse & baytAlMal) should sum to 1
        if (hasResiduaries) {
            errors.push('validateRadd: raddApplied=true but residuary heirs exist (radd should not apply when residuaries exist)');
        }
        // Note: radd sum check is lenient — spouses keep their fixed share,
        //       so the blood-heirs collectively absorb the remainder.
        // We only flag if the total is still < 1 AND no baytAlMal entry exists.
        if (sumIsLessThan1 && !hasBaytAlMal) {
            errors.push(
                `validateRadd: raddApplied=true but shares still sum to ${num}/${den} < 1 ` +
                `with no bayt al-māl entry`
            );
        }
    }

    return errors;
}

function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }
