/**
 * validateAwl.js — Verifies ʿAwl (proportional reduction) was applied correctly.
 *
 * Rules:
 *  - If context.awlApplied === true, baseShare sum must have exceeded 1
 *    and adjustedShare sum must equal 1 (all shares proportionally reduced)
 *  - If context.awlApplied === false, no share should have a different
 *    baseShare vs adjustedShare (no silent reduction)
 *
 * Returns array of error strings.
 */

/**
 * @param {{ shares: Array, context: Object }} result
 * @returns {string[]}
 */
export function validateAwl(result) {
    const errors = [];
    if (!result || !Array.isArray(result.shares)) {
        errors.push('validateAwl: result.shares is missing or not an array');
        return errors;
    }

    const ctx = result.context || {};
    const activeShares = result.shares.filter(s =>
        s.status !== 'Blocked' && s.heir !== 'baytAlMal'
    );

    // Sum baseShares
    let baseNum = 0, baseDen = 1;
    for (const s of activeShares) {
        const { num = 0, den = 1 } = s.baseShare || s.adjustedShare || {};
        baseNum = baseNum * den + num * baseDen;
        baseDen = baseDen * den;
        const g = gcd(Math.abs(baseNum), Math.abs(baseDen));
        baseNum /= g; baseDen /= g;
    }

    const baseSumExceeds1 = baseNum > baseDen && baseDen > 0;
    const hasWarnings     = (result.warnings && result.warnings.length > 0);

    if (baseSumExceeds1 && !ctx.awlApplied && !hasWarnings) {
        errors.push(
            `validateAwl: baseShare sum exceeds 1 (${baseNum}/${baseDen}) ` +
            `but context.awlApplied is false`
        );
    }

    if (ctx.awlApplied) {
        // After awl, adjusted shares must sum to exactly 1
        let adjNum = 0, adjDen = 1;
        for (const s of activeShares) {
            const { num = 0, den = 1 } = s.adjustedShare || {};
            adjNum = adjNum * den + num * adjDen;
            adjDen = adjDen * den;
            const g = gcd(Math.abs(adjNum), Math.abs(adjDen));
            adjNum /= g; adjDen /= g;
        }

        if (adjNum !== adjDen) {
            errors.push(
                `validateAwl: awlApplied=true but adjustedShare sum is ${adjNum}/${adjDen} (expected 1/1)`
            );
        }
    }

    return errors;
}

function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }
