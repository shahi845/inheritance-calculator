/**
 * Grandfather-with-Siblings Module — Shāfiʿī Madhhab
 *
 * This module implements the Shāfiʿī position on inheritance when the
 * Paternal Grandfather coexists with full or paternal siblings (in the
 * absence of the father).
 *
 * The Shāfiʿī method (from Minhāj al-Ṭālibīn / Reliance of the Traveller L7):
 * - Grandfather takes the BEST of:
 *   (a) Muqāsamah: share with siblings as if he were one brother (2:1 male/female ratio)
 *   (b) 1/3 of the estate portion available to grandfather + siblings combined
 * - He never receives less than 1/6 of the total estate (minimum floor when descendants exist)
 * - Maternal siblings are ALWAYS blocked by the grandfather
 * - The best-share comparison is computed AFTER other fixed shares are assigned
 *
 * Al-Akdariyyah (special case):
 * Husband + Mother + Grandfather + Full Sister
 * - Fixed shares: husband 1/2, mother 1/3, sister 1/2 → sum = 4/3 → ʿAwl to 8
 * - Under ʿawl: husband 3/8, mother 2/8, grandfather + sister compete over 3/8
 * - Special Shāfiʿī ruling: grandfather and sister merge their shares (3/8)
 *   and redistribute 2:1 (grandfather gets 2/3 of 3/8, sister gets 1/3 of 3/8)
 * - Final: husband 3/8, mother 2/8, grandfather 2/8, sister 1/8
 */

import { fraction, addFractions, subtractFractions, multiplyFractions,
         compareFractions, maxFraction } from '../utils/fractions.js';

/**
 * Detects if this is the Al-Akdariyyah case.
 * Conditions: husband + mother + grandfather + full sister (no other heirs)
 */
export function isAkdariyyah(heirs, context) {
    return (
        heirs.husband === 1 &&
        heirs.mother === 1 &&
        heirs.paternalGrandfather === 1 &&
        !context.blocked.paternalGrandfather &&
        heirs.fullSister > 0 &&
        heirs.wife === 0 &&
        heirs.father === 0 &&
        heirs.son === 0 && heirs.daughter === 0 &&
        heirs.sonsSon === 0 && heirs.sonsDaughter === 0 &&
        heirs.fullBrother === 0 &&
        heirs.paternalBrother === 0 && heirs.paternalSister === 0
    );
}

/**
 * Applies the Al-Akdariyyah (Shāfiʿī) ruling.
 * Returns the shares array with all four heirs assigned.
 */
export function applyAkdariyyah(heirs, context) {
    context.messages.push(
        "Al-Akdariyyah case detected (Husband + Mother + Grandfather + Full Sister). " +
        "Shāfiʿī ruling: grandfather and sister merge and redistribute 2:1."
    );

    // Step 1: Normal fixed shares → will cause ʿawl
    // husband 1/2 = 3/6, mother 1/3 = 2/6, sister 1/2 = 3/6 → total 8/6
    // ʿAwl denominator = 8
    const shares = [
        {
            heir: 'husband',
            name: 'Husband',
            count: 1,
            baseShare: fraction(1, 2),
            adjustedShare: fraction(3, 8),
            status: 'Sharer',
            reason: '3/8 after ʿawl — Al-Akdariyyah case (Qurʾān 4:12)',
            shareBeforeAwl: fraction(1, 2),
        },
        {
            heir: 'mother',
            name: 'Mother',
            count: 1,
            baseShare: fraction(1, 3),
            adjustedShare: fraction(2, 8),
            status: 'Sharer',
            reason: '2/8 after ʿawl — Al-Akdariyyah case (Qurʾān 4:11)',
            shareBeforeAwl: fraction(1, 3),
        },
        // Grandfather and sister together hold 3/8, then split 2:1
        {
            heir: 'paternalGrandfather',
            name: 'Paternal Grandfather',
            count: 1,
            baseShare: fraction(2, 8),
            adjustedShare: fraction(2, 8),
            status: 'Sharer + Residuary',
            reason: '2/8 — Al-Akdariyyah: grandfather merges with sister, takes 2/3 of combined share (2:1 ratio)',
            shareBeforeAwl: null,
        },
        {
            heir: 'fullSister',
            name: 'Full Sister',
            count: heirs.fullSister,
            baseShare: fraction(1, 8),
            adjustedShare: fraction(1, 8),
            status: 'Sharer',
            reason: '1/8 — Al-Akdariyyah: sister merges with grandfather, takes 1/3 of combined share (2:1 ratio)',
            shareBeforeAwl: fraction(1, 2),
        },
    ];

    context.awlApplied = true;
    context.messages.push("ʿAwl applied: denominator raised to 8 (Al-Akdariyyah).");
    return { shares, sumFractions: fraction(1, 1) };
}

/**
 * Main function: assigns grandfather's share when siblings are present.
 * Called from assignFixedShares when grandfather + siblings detected (no father, no son-line).
 *
 * @param {Object} heirs - normalized heirs
 * @param {Object} context - calculation context
 * @param {Object} remainderAfterOthers - fraction of estate available to grandfather+siblings pool
 * @returns {{ grandfatherShare: Fraction, siblingsRemainder: Fraction }}
 */
export function computeGrandfatherBestShare(heirs, context, remainderAfterOthers) {
    // Active siblings (not blocked by grandfather — maternal siblings are always blocked by gf)
    const activeFull  = heirs.fullBrother    || 0;
    const activeFullS = heirs.fullSister     || 0;
    const activePat   = heirs.paternalBrother || 0;
    const activePatS  = heirs.paternalSister  || 0;

    // Paternal brothers are blocked by full brothers in normal circumstances
    // but when grandfather is present, both compete with him
    const totalMaleUnits   = activeFull + activePat + 1; // +1 for grandfather (counts as 1 male)
    const totalFemaleUnits = activeFullS + activePatS;
    const totalUnits       = totalMaleUnits * 2 + totalFemaleUnits; // 2:1 ratio

    // Option A: Muqāsamah — grandfather as one male unit
    // grandfather_units = 2, total_units as above
    const gfUnits = 2; // grandfather counts as 1 male = 2 units in 2:1 system
    const muqasamahShare = multiplyFractions(remainderAfterOthers, fraction(gfUnits, totalUnits));

    // Option B: 1/3 of the combined pool (remainderAfterOthers)
    const oneThirdPool = multiplyFractions(remainderAfterOthers, fraction(1, 3));

    // Option C: 1/6 of entire estate (minimum floor — only relevant with many siblings)
    const oneSixthEstate = fraction(1, 6);

    // Best share = max(muqasamah, oneThirdPool)
    // But never less than 1/6 of the estate
    const bestBeforeFloor = maxFraction(muqasamahShare, oneThirdPool);
    const grandfatherShare = maxFraction(bestBeforeFloor, oneSixthEstate);

    // Explain which option was chosen
    let chosenMethod;
    if (compareFractions(grandfatherShare, oneSixthEstate) === 0 &&
        compareFractions(bestBeforeFloor, oneSixthEstate) < 0) {
        chosenMethod = '1/6 minimum floor';
    } else if (compareFractions(muqasamahShare, oneThirdPool) >= 0) {
        chosenMethod = `Muqāsamah (${muqasamahShare.num}/${muqasamahShare.den} — sharing as one of the brothers)`;
    } else {
        chosenMethod = `1/3 of sibling pool (${oneThirdPool.num}/${oneThirdPool.den})`;
    }

    context.messages.push(
        `Grandfather-with-siblings (Shāfiʿī best-share): ` +
        `Muqāsamah=${muqasamahShare.num}/${muqasamahShare.den}, ` +
        `1/3 pool=${oneThirdPool.num}/${oneThirdPool.den}, ` +
        `1/6 floor=${oneSixthEstate.num}/${oneSixthEstate.den}. ` +
        `Chosen: ${chosenMethod}.`
    );

    const siblingsRemainder = subtractFractions(remainderAfterOthers, grandfatherShare);

    return { grandfatherShare, siblingsRemainder, chosenMethod, totalUnits, gfUnits };
}

/**
 * Distributes the siblings' remaining share among active siblings (2:1 ratio).
 * Full siblings block paternal siblings of the same sex (except when grandfather is present —
 * in Shāfiʿī, grandfather-with-siblings allows paternal siblings to compete).
 */
export function distributeToSiblings(heirs, context, siblingsPool, shares) {
    const activeFull  = heirs.fullBrother   || 0;
    const activeFullS = heirs.fullSister    || 0;
    const activePat   = heirs.paternalBrother || 0;
    const activePatS  = heirs.paternalSister  || 0;

    const totalMaleUnits   = activeFull + activePat;
    const totalFemaleUnits = activeFullS + activePatS;
    const totalUnits       = totalMaleUnits * 2 + totalFemaleUnits;

    if (totalUnits === 0 || compareFractions(siblingsPool, fraction(0, 1)) <= 0) return;

    const addSiblingShare = (key, name, count, units) => {
        if (count <= 0 || units <= 0) return;
        const sh = multiplyFractions(siblingsPool, fraction(units, totalUnits));
        shares.push({
            heir: key,
            name,
            count,
            baseShare: sh,
            adjustedShare: sh,
            status: 'Residuary',
            reason: `Residuary — Grandfather-with-siblings pool distribution (Shāfiʿī best-share method)`
        });
        context.messages.push(`${name} receives ${sh.num}/${sh.den} from sibling pool.`);
    };

    addSiblingShare('fullBrother',    'Full Brother',           activeFull,  activeFull  * 2);
    addSiblingShare('fullSister',     'Full Sister',            activeFullS, activeFullS);
    addSiblingShare('paternalBrother','Consanguine Brother',    activePat,   activePat   * 2);
    addSiblingShare('paternalSister', 'Consanguine Sister',     activePatS,  activePatS);
}
