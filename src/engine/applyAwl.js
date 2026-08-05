import { fraction, addFractions, subtractFractions, multiplyFractions, compareFractions } from '../utils/fractions.js';
import { getHeirDisplayName } from '../utils/formatResults.js';

/**
 * Applies ʿAwl (proportional reduction) when the sum of fixed shares exceeds the estate.
 *
 * Method: multiply each share's numerator by the least common factor such that the
 * new denominator equals the sum of all original numerators on a common denominator.
 *
 * Example: husband 1/2 + sister 1/2 + mother 1/3
 *   Common denominator = 6: 3 + 3 + 2 = 8 → new denominator = 8
 *   husband 3/8, sister 3/8, mother 2/8
 */
export function applyAwl(shares, sumFractions, context) {
    if (compareFractions(sumFractions, fraction(1, 1)) <= 0) {
        return sumFractions; // No ʿawl needed
    }

    context.awlApplied = true;

    // Find a common denominator across all shares
    const lcm = (a, b) => (a * b) / gcd(a, b);
    const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);

    let commonDen = 1;
    for (const share of shares) {
        if (share.adjustedShare && share.adjustedShare.num > 0) {
            commonDen = lcm(commonDen, share.adjustedShare.den);
        }
    }

    // Sum all numerators on common denominator
    let totalNumerator = 0;
    for (const share of shares) {
        if (share.adjustedShare && share.adjustedShare.num > 0) {
            totalNumerator += share.adjustedShare.num * (commonDen / share.adjustedShare.den);
        }
    }

    const originalDenominator = commonDen;
    const newDenominator = totalNumerator;

    context.messages.push(
        `ʿAwl applied: denominator raised from ${originalDenominator} to ${newDenominator} ` +
        `(total fixed shares = ${sumFractions.num}/${sumFractions.den} > 1).`
    );

    // Adjust each share proportionally
    for (const share of shares) {
        if (share.adjustedShare && share.adjustedShare.num > 0) {
            share.shareBeforeAwl = { ...share.adjustedShare };
            const originalNumeratorOnCommon = share.adjustedShare.num * (commonDen / share.adjustedShare.den);
            share.adjustedShare = fraction(originalNumeratorOnCommon, newDenominator);
            share.awlAdjusted = true;
        }
    }

    return fraction(1, 1); // After ʿawl, shares exactly fill the estate
}
