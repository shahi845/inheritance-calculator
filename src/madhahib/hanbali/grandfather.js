import { fraction, addFractions, subtractFractions, multiplyFractions, compareFractions, maxFraction } from '../../utils/fractions.js';

/**
 * Calculates paternal grandfather's share when full or paternal siblings are present.
 * Under the Ḥanbalī school, he takes the best of:
 * 1. Muqāsamah (sharing with siblings as if he were a brother)
 * 2. 1/6 of the total estate
 * 3. 1/3 of the remaining residue (after other fixed share heirs)
 *
 * @param {Object} heirs
 * @param {Object} context
 * @param {Fraction} remainderAfterOthers
 * @returns {{ grandfatherShare: Fraction, siblingsRemainder: Fraction, chosenMethod: string }}
 */
export function computeHanbaliGrandfatherBestShare(heirs, context, remainderAfterOthers) {
    const activeFull  = heirs.fullBrother    || 0;
    const activeFullS = heirs.fullSister     || 0;
    const activePat   = heirs.paternalBrother || 0;
    const activePatS  = heirs.paternalSister  || 0;

    // Grandfather counts as 1 male = 2 units.
    // Both full and paternal siblings are counted to reduce grandfather's portion (Muʿādah).
    const totalMaleUnits   = activeFull + activePat + 1; // +1 for grandfather
    const totalFemaleUnits = activeFullS + activePatS;
    const totalUnits       = totalMaleUnits * 2 + totalFemaleUnits;

    // Option 1: Muqāsamah
    const gfUnits = 2;
    const muqasamahShare = multiplyFractions(remainderAfterOthers, fraction(gfUnits, totalUnits));

    // Option 2: 1/6 of total estate
    const oneSixthEstate = fraction(1, 6);

    // Option 3: 1/3 of residue
    const oneThirdResidue = multiplyFractions(remainderAfterOthers, fraction(1, 3));

    // Best share = max(Muqasamah, 1/6 total, 1/3 residue)
    let bestShare = maxFraction(muqasamahShare, oneThirdResidue);
    bestShare = maxFraction(bestShare, oneSixthEstate);

    let chosenMethod = '';
    if (compareFractions(bestShare, oneSixthEstate) === 0 && compareFractions(bestShare, muqasamahShare) !== 0 && compareFractions(bestShare, oneThirdResidue) !== 0) {
        chosenMethod = '1/6 of total estate';
    } else if (compareFractions(bestShare, oneThirdResidue) === 0 && compareFractions(bestShare, muqasamahShare) !== 0) {
        chosenMethod = '1/3 of residue';
    } else {
        chosenMethod = 'Muqāsamah';
    }

    context.messages.push(
        `Ḥanbalī Paternal Grandfather with siblings: ` +
        `Muqāsamah=${muqasamahShare.num}/${muqasamahShare.den}, ` +
        `1/6 total=${oneSixthEstate.num}/${oneSixthEstate.den}, ` +
        `1/3 residue=${oneThirdResidue.num}/${oneThirdResidue.den}. ` +
        `Chosen: ${chosenMethod} (${bestShare.num}/${bestShare.den}).`
    );

    const siblingsRemainder = subtractFractions(remainderAfterOthers, bestShare);
    return { grandfatherShare: bestShare, siblingsRemainder, chosenMethod };
}

/**
 * Distributes the siblings' pool among full and paternal siblings following the Muʿādah rules:
 * - If full brother exists, paternal siblings are completely blocked. Full siblings take the pool in a 2:1 ratio.
 * - If no full brother:
 *   - One full sister takes up to 1/2 of the whole estate.
 *   - Multiple full sisters take up to 2/3 of the whole estate.
 *   - Paternal siblings take the remainder of the pool (if any) in a 2:1 ratio.
 */
export function distributeHanbaliSiblings(heirs, context, siblingsPool, shares) {
    const activeFull  = heirs.fullBrother    || 0;
    const activeFullS = heirs.fullSister     || 0;
    const activePat   = heirs.paternalBrother || 0;
    const activePatS  = heirs.paternalSister  || 0;

    if (compareFractions(siblingsPool, fraction(0, 1)) <= 0) return;

    // Case 1: Full brother exists
    if (activeFull > 0) {
        // Paternal siblings get nothing
        const totalMaleUnits = activeFull;
        const totalFemaleUnits = activeFullS;
        const totalUnits = totalMaleUnits * 2 + totalFemaleUnits;

        const addSiblingShare = (key, name, count, units) => {
            if (count <= 0) return;
            const sh = multiplyFractions(siblingsPool, fraction(units, totalUnits));
            shares.push({
                heir: key,
                name,
                count,
                baseShare: sh,
                adjustedShare: sh,
                status: 'Residuary',
                reason: `Residuary — Grandfather-with-siblings pool (paternal siblings blocked by Full Brother)`
            });
            context.messages.push(`${name} receives ${sh.num}/${sh.den} from sibling pool.`);
        };

        addSiblingShare('fullBrother', 'Full Brother', activeFull, activeFull * 2);
        addSiblingShare('fullSister', 'Full Sister', activeFullS, activeFullS);
        return;
    }

    // Case 2: No full brother, but full sister(s) exist
    if (activeFullS > 0) {
        // Full sisters can take up to their Qur'anic share (1/2 if one, 2/3 if multiple) of the *whole estate*.
        const maxSisterFraction = activeFullS === 1 ? fraction(1, 2) : fraction(2, 3);

        if (compareFractions(siblingsPool, maxSisterFraction) <= 0) {
            // Pool is smaller than or equal to their maximum share, so they take everything, paternal gets nothing.
            shares.push({
                heir: 'fullSister',
                name: 'Full Sister',
                count: activeFullS,
                baseShare: siblingsPool,
                adjustedShare: siblingsPool,
                status: 'Residuary',
                reason: `Residuary — Grandfather-with-siblings pool (takes entire pool)`
            });
            context.messages.push(`Full Sister(s) take the entire sibling pool of ${siblingsPool.num}/${siblingsPool.den}.`);
            
            if (activePat > 0 || activePatS > 0) {
                context.messages.push(`Consanguine siblings receive nothing because Full Sister(s) exhausted the pool.`);
            }
        } else {
            // Pool is larger than their maximum share, so they take their max, and paternal siblings get the remainder.
            const fullSistersShare = maxSisterFraction;
            shares.push({
                heir: 'fullSister',
                name: 'Full Sister',
                count: activeFullS,
                baseShare: fullSistersShare,
                adjustedShare: fullSistersShare,
                status: 'Residuary',
                reason: `Residuary — Grandfather-with-siblings pool (limited to Qur'anic share of ${fullSistersShare.num}/${fullSistersShare.den})`
            });
            context.messages.push(`Full Sister(s) take their limit of ${fullSistersShare.num}/${fullSistersShare.den}.`);

            const paternalPool = subtractFractions(siblingsPool, fullSistersShare);
            const totalPatMale = activePat;
            const totalPatFemale = activePatS;
            const totalPatUnits = totalPatMale * 2 + totalPatFemale;

            if (totalPatUnits > 0) {
                const addPatShare = (key, name, count, units) => {
                    if (count <= 0) return;
                    const sh = multiplyFractions(paternalPool, fraction(units, totalPatUnits));
                    shares.push({
                        heir: key,
                        name,
                        count,
                        baseShare: sh,
                        adjustedShare: sh,
                        status: 'Residuary',
                        reason: `Residuary — Grandfather-with-siblings pool (remainder after Full Sister's limit)`
                    });
                    context.messages.push(`${name} receives ${sh.num}/${sh.den} from consanguine remainder.`);
                };

                addPatShare('paternalBrother', 'Consanguine Brother', activePat, activePat * 2);
                addPatShare('paternalSister', 'Consanguine Sister', activePatS, activePatS);
            }
        }
        return;
    }

    // Case 3: Only paternal siblings exist
    const totalPatMale = activePat;
    const totalPatFemale = activePatS;
    const totalPatUnits = totalPatMale * 2 + totalPatFemale;

    if (totalPatUnits > 0) {
        const addPatShare = (key, name, count, units) => {
            if (count <= 0) return;
            const sh = multiplyFractions(siblingsPool, fraction(units, totalPatUnits));
            shares.push({
                heir: key,
                name,
                count,
                baseShare: sh,
                adjustedShare: sh,
                status: 'Residuary',
                reason: `Residuary — Grandfather-with-siblings pool`
            });
            context.messages.push(`${name} receives ${sh.num}/${sh.den} from sibling pool.`);
        };

        addPatShare('paternalBrother', 'Consanguine Brother', activePat, activePat * 2);
        addPatShare('paternalSister', 'Consanguine Sister', activePatS, activePatS);
    }
}

export function calculateHanbaliGrandfatherWithSiblings(heirs, context, sumFractionsAfterPrimary) {
    const shares = [];
    const remainderAfterOthers = subtractFractions(fraction(1, 1), sumFractionsAfterPrimary);

    const { grandfatherShare, siblingsRemainder, chosenMethod } =
        computeHanbaliGrandfatherBestShare(heirs, context, remainderAfterOthers);

    shares.push({
        heir: 'paternalGrandfather',
        name: 'Paternal Grandfather',
        count: 1,
        baseShare: grandfatherShare,
        adjustedShare: grandfatherShare,
        status: 'Residuary',
        reason: `Best share among 3 options (Ḥanbalī calculation)`
    });

    distributeHanbaliSiblings(heirs, context, siblingsRemainder, shares);

    // Summing fractions
    let totalFraction = grandfatherShare;
    if (compareFractions(siblingsRemainder, fraction(0, 1)) > 0) {
        totalFraction = addFractions(totalFraction, siblingsRemainder);
    }

    return {
        shares,
        sumFractions: totalFraction
    };
}
