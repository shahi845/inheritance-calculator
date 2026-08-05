/**
 * Ḥanbalī Radd (Return of Surplus)
 *
 * Ḥanbalīs apply Radd to all sharers except spouses. 
 * The calculation is identical to the modern standard practice (return to heirs).
 */

import { applyRadd } from '../../engine/applyRadd.js';

export function applyHanbaliRadd(shares, sumFractions, context) {
    // Ḥanbalī madhhab traditionally returns surplus to heirs
    // We override the mode just in case to ensure it doesn't go to Bayt al-Māl
    context.raddMode = 'returnToHeirs';
    return applyRadd(shares, sumFractions, context);
}
