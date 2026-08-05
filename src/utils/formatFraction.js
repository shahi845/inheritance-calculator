/**
 * formatFraction.js — Utility for displaying fractions cleanly
 */

/**
 * Returns a readable string representation of a fraction.
 * @param {Object} frac - { num: number, den: number }
 */
export function fracText(frac) {
    if (!frac || frac.num === 0) return "0";
    if (frac.num === frac.den) return "1";
    return `${frac.num}/${frac.den}`;
}
