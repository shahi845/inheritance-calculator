/**
 * validateBlocking.js — Verifies blocked heirs appear correctly in results.
 *
 * Rules:
 *  - If result.blocked[key] === true, that heir should appear in shares
 *    with status === 'Blocked' and adjustedShare.num === 0
 *  - A blocked heir must NOT have a positive share
 *
 * Returns array of error strings.
 */

/**
 * @param {{ shares: Array, blocked: Object }} result
 * @returns {string[]}
 */
export function validateBlocking(result) {
    const errors = [];
    if (!result || !Array.isArray(result.shares)) {
        errors.push('validateBlocking: result.shares is missing or not an array');
        return errors;
    }

    const blocked = result.blocked || {};

    for (const [heir, isBlocked] of Object.entries(blocked)) {
        if (!isBlocked) continue;

        const entry = result.shares.find(s => s.heir === heir);
        if (!entry) {
            // Blocked heir may simply be absent if count === 0; that's fine.
            continue;
        }

        // If present in shares, must be marked Blocked
        if (!entry.status || !entry.status.includes('Blocked')) {
            errors.push(
                `validateBlocking: ${heir} is in result.blocked but has status="${entry.status}" (expected 'Blocked')`
            );
        }

        // Must have zero share
        const { num = 0, den = 1 } = entry.adjustedShare || {};
        if (num !== 0) {
            errors.push(
                `validateBlocking: ${heir} is blocked but has non-zero adjustedShare (${num}/${den})`
            );
        }
    }

    // Also check the reverse: no heir marked Blocked in shares should have a positive share
    result.shares
        .filter(s => s.status && s.status.includes('Blocked'))
        .forEach(s => {
            const { num = 0 } = s.adjustedShare || {};
            if (num > 0) {
                errors.push(
                    `validateBlocking: ${s.heir} has status 'Blocked' but adjustedShare.num=${num} (should be 0)`
                );
            }
        });

    return errors;
}
