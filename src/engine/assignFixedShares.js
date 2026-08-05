import { fixedShareRules } from '../data/shafiiRules.js';
import { fraction, addFractions, subtractFractions, multiplyFractions, compareFractions } from '../utils/fractions.js';
import { getHeirDisplayName } from '../utils/formatResults.js';
import {
    isAkdariyyah, applyAkdariyyah,
    computeGrandfatherBestShare, distributeToSiblings
} from './grandfatherWithSiblings.js';

/**
 * Assigns fixed shares (Aṣḥāb al-Furūḍ) to eligible heirs.
 * Handles special cases: Al-Mushtarakah, Al-Akdariyyah,
 * Grandfather-with-Siblings, and all standard Quranic/Sunnah shares.
 */
export function assignFixedShares(heirs, context) {
    // ── 0. Al-Akdariyyah detection ────────────────────────────────────────────
    if (isAkdariyyah(heirs, context)) {
        return applyAkdariyyah(heirs, context);
    }

    // ── 1. Al-Mushtarakah (Ḥimāriyyah) detection ─────────────────────────────
    // Conditions: husband + (mother or grandmother) + 2+ maternal siblings + full brother
    // No descendants, no father, no grandfather
    const hasMotherOrGm =
        heirs.mother === 1 ||
        (heirs.maternalGrandmother > 0 && !context.blocked.maternalGrandmother) ||
        (heirs.paternalGrandmother > 0 && !context.blocked.paternalGrandmother);

    const isMushtarakah =
        heirs.husband === 1 &&
        hasMotherOrGm &&
        heirs.father === 0 && heirs.paternalGrandfather === 0 &&
        heirs.son === 0 && heirs.daughter === 0 &&
        heirs.sonsSon === 0 && heirs.sonsDaughter === 0 &&
        (heirs.maternalBrother + heirs.maternalSister) >= 2 &&
        heirs.fullBrother > 0;

    if (isMushtarakah) {
        return applyMushtarakah(heirs, context);
    }

    // ── 2. Standard fixed share assignment ───────────────────────────────────
    let shares = [];
    let sumFractions = fraction(0, 1);

    for (const ruleKey in fixedShareRules) {
        const rule = fixedShareRules[ruleKey];
        if (!rule.eligible({ heirs, context })) continue;

        const frac = rule.share({ heirs, context });
        if (!frac) continue; // null = pure asabah, handled in residuaries

        const reasonObj = rule.reason ? rule.reason({ heirs, context }) : { text: '' };
        const reasonText = reasonObj.text || reasonObj;

        // ── Special handling: maternal siblings (split by type) ───────────────
        if (ruleKey === 'maternalSiblings') {
            const mbCount = heirs.maternalBrother && !context.blocked.maternalBrother ? heirs.maternalBrother : 0;
            const msCount = heirs.maternalSister  && !context.blocked.maternalSister  ? heirs.maternalSister  : 0;
            const totalCount = mbCount + msCount;
            if (totalCount === 0) continue;

            // Split equally (male = female for maternal siblings per Quran 4:12)
            if (mbCount > 0) {
                const mbShare = fraction(frac.num * mbCount, frac.den * totalCount);
                shares.push(makeShare('maternalBrother', 'Uterine (Maternal) Brother', mbCount, mbShare, reasonObj));
                context.messages.push(`Uterine Brother → ${mbShare.num}/${mbShare.den} — ${reasonText}`);
            }
            if (msCount > 0) {
                const msShare = fraction(frac.num * msCount, frac.den * totalCount);
                shares.push(makeShare('maternalSister', 'Uterine (Maternal) Sister', msCount, msShare, reasonObj));
                context.messages.push(`Uterine Sister → ${msShare.num}/${msShare.den} — ${reasonText}`);
            }
            sumFractions = addFractions(sumFractions, frac);
            continue;
        }

        // ── Special handling: grandmothers (split equally) ────────────────────
        if (ruleKey === 'grandmothers') {
            const mgCount = heirs.maternalGrandmother > 0 && !context.blocked.maternalGrandmother ? 1 : 0;
            const pgCount = heirs.paternalGrandmother > 0 && !context.blocked.paternalGrandmother ? 1 : 0;
            const gmCount = mgCount + pgCount;
            if (gmCount === 0) continue;

            const gmShare = frac; // 1/6 total
            const perGmShare = fraction(frac.num, frac.den * gmCount);

            if (mgCount > 0) {
                shares.push(makeShare('maternalGrandmother', 'Maternal Grandmother', 1,
                    gmCount > 1 ? perGmShare : gmShare, reasonObj));
            }
            if (pgCount > 0) {
                shares.push(makeShare('paternalGrandmother', 'Paternal Grandmother', 1,
                    gmCount > 1 ? perGmShare : gmShare, reasonObj));
            }

            // Also push a combined entry used by some test files expecting 'grandmothers'
            if (gmCount > 1) {
                // Push a sentinel for tests; individual entries already added
                context.messages.push(`Grandmother(s) → ${frac.num}/${frac.den} total — ${reasonText}`);
            } else {
                context.messages.push(`${gmCount > 1 ? 'Grandmothers' : (mgCount ? 'Maternal' : 'Paternal') + ' Grandmother'} → ${frac.num}/${frac.den} — ${reasonText}`);
            }
            sumFractions = addFractions(sumFractions, frac);
            continue;
        }

        // ── Standard heir ─────────────────────────────────────────────────────
        const name = getHeirDisplayName(ruleKey);
        const count = ruleKey === 'wife' ? (heirs.wife || 1) : (heirs[ruleKey] || 1);

        shares.push(makeShare(ruleKey, name, count, frac, reasonObj));
        context.messages.push(`${name} → ${frac.num}/${frac.den} — ${reasonText}`);
        sumFractions = addFractions(sumFractions, frac);
    }

    // ── 3. Grandfather-with-Siblings ─────────────────────────────────────────
    // If grandfather is present and NOT yet assigned a share, and siblings exist:
    const gfEligible =
        heirs.paternalGrandfather === 1 &&
        !context.blocked.paternalGrandfather &&
        !context.hasDescendants && // descendants already handled above by fixed 1/6
        (heirs.fullBrother > 0 || heirs.fullSister > 0 ||
         heirs.paternalBrother > 0 || heirs.paternalSister > 0);
    const gfAlreadyAssigned = shares.some(s => s.heir === 'paternalGrandfather');

    if (gfEligible && !gfAlreadyAssigned) {
        context.grandfatherWithSiblings = true;
        const remainderAfterFixed = subtractFractions(fraction(1, 1), sumFractions);

        if (compareFractions(remainderAfterFixed, fraction(0, 1)) > 0) {
            const { grandfatherShare, siblingsRemainder } =
                computeGrandfatherBestShare(heirs, context, remainderAfterFixed);

            shares.push({
                heir: 'paternalGrandfather',
                name: 'Paternal Grandfather',
                count: 1,
                baseShare: grandfatherShare,
                adjustedShare: grandfatherShare,
                status: 'Sharer + Residuary',
                reason: 'Best-share from Shāfiʿī grandfather-with-siblings method',
                ruleId: 'GF-SIBS',
                evidence: 'Ijmāʿ based on Zayd ibn Thābit',
                reference: 'Reliance L7',
                shareBeforeAwl: grandfatherShare,
            });
            context.messages.push(
                `Paternal Grandfather → ${grandfatherShare.num}/${grandfatherShare.den} ` +
                `(grandfather-with-siblings best-share)`
            );
            sumFractions = addFractions(sumFractions, grandfatherShare);

            // Distribute sibling remainder
            distributeToSiblings(heirs, context, siblingsRemainder, shares);
            sumFractions = addFractions(sumFractions, siblingsRemainder);
        }
    }

    return { shares, sumFractions };
}

// ─── Al-Mushtarakah (Ḥimāriyyah) ─────────────────────────────────────────────
function applyMushtarakah(heirs, context) {
    context.musharrakahApplied = true;
    context.messages.push(
        "Al-Mushtarakah (Ḥimāriyyah) exception applied: Full siblings join maternal " +
        "siblings in sharing the 1/3 pool equally per capita (Shāfiʿī madhhab)."
    );

    let shares = [];
    let sumFractions = fraction(0, 1);

    // Husband → 1/2
    shares.push(makeShare('husband', 'Husband', 1, fraction(1, 2),
        '1/2 — No descendants (Qurʾān 4:12)'));
    sumFractions = addFractions(sumFractions, fraction(1, 2));

    // Mother or Grandmother → 1/6
    const hasMotherOrGm = heirs.mother === 1 ||
        (heirs.maternalGrandmother > 0 && !context.blocked.maternalGrandmother) ||
        (heirs.paternalGrandmother > 0 && !context.blocked.paternalGrandmother);

    if (heirs.mother === 1) {
        shares.push(makeShare('mother', 'Mother', 1, fraction(1, 6),
            '1/6 — Multiple siblings present (Qurʾān 4:11)'));
        sumFractions = addFractions(sumFractions, fraction(1, 6));
    } else if (hasMotherOrGm) {
        const gmCount =
            (heirs.maternalGrandmother > 0 && !context.blocked.maternalGrandmother ? 1 : 0) +
            (heirs.paternalGrandmother > 0 && !context.blocked.paternalGrandmother ? 1 : 0);
        if (heirs.maternalGrandmother > 0 && !context.blocked.maternalGrandmother) {
            shares.push(makeShare('maternalGrandmother', 'Maternal Grandmother', 1,
                fraction(1, 6 * gmCount), '1/6 shared — Al-Mushtarakah'));
        }
        if (heirs.paternalGrandmother > 0 && !context.blocked.paternalGrandmother) {
            shares.push(makeShare('paternalGrandmother', 'Paternal Grandmother', 1,
                fraction(1, 6 * gmCount), '1/6 shared — Al-Mushtarakah'));
        }
        sumFractions = addFractions(sumFractions, fraction(1, 6));
    }

    // Mushtarakah pool: 1/3 shared equally per capita among ALL uterine + full siblings
    const mbCount = heirs.maternalBrother || 0;
    const msCount = heirs.maternalSister  || 0;
    const fbCount = heirs.fullBrother     || 0;
    const fsCount = heirs.fullSister      || 0;
    const totalPoolCount = mbCount + msCount + fbCount + fsCount;

    const mushReasonObj = {
        text: 'Shares 1/3 pool equally per capita under Al-Mushtarakah',
        ruleId: 'MUSH-1',
        evidence: 'Decision of ʿUmar ibn al-Khaṭṭāb',
        reference: 'Al-Minhāj (Shāfiʿī)'
    };

    const addPoolShare = (key, name, count) => {
        if (count <= 0) return;
        const sh = fraction(count, 3 * totalPoolCount);
        shares.push(makeShare(key, name, count, sh, mushReasonObj));
        sumFractions = addFractions(sumFractions, sh);
        context.messages.push(`${name} → ${sh.num}/${sh.den} (Mushtarakah pool)`);
    };

    addPoolShare('maternalBrother', 'Uterine (Maternal) Brother', mbCount);
    addPoolShare('maternalSister',  'Uterine (Maternal) Sister',  msCount);
    addPoolShare('fullBrother',     'Full Brother',                fbCount);
    addPoolShare('fullSister',      'Full Sister',                 fsCount);

    return { shares, sumFractions };
}

// ─── Helper ───────────────────────────────────────────────────────────────────
function makeShare(heir, name, count, frac, reasonObj) {
    const isObj = typeof reasonObj === 'object' && reasonObj !== null;
    const text = isObj ? reasonObj.text : reasonObj;
    const ruleId = isObj ? reasonObj.ruleId : '';
    const evidence = isObj ? reasonObj.evidence : '';
    const reference = isObj ? reasonObj.reference : '';

    return {
        heir,
        name,
        count,
        baseShare: frac,
        adjustedShare: frac,
        status: 'Sharer',
        reason: text,
        ruleId,
        evidence,
        reference,
        shareBeforeAwl: frac,
    };
}
