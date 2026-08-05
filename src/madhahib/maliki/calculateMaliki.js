import {
    fraction,
    addFractions,
    subtractFractions,
    multiplyFractions,
    divideFractions,
    compareFractions,
    maxFraction
} from '../../utils/fractions.js';
import { getHeirDisplayName } from '../../utils/formatResults.js';
import { buildContext } from '../../engine/buildContext.js';
import { validateInput } from '../../engine/validateInput.js';
import { normalizeInput } from '../../engine/normalizeInput.js';
import { applyAwl } from '../../engine/applyAwl.js';
import { malikiBlockingRules, malikiBlockingReasons } from './blocking.js';
import { malikiFixedShareRules } from './fixedShares.js';
import { computeMalikiGrandfatherBestShare, distributeMalikiSiblings } from './grandfather.js';
import { isMalikiMushtarikah, applyMalikiMushtarikah } from './mushtarikah.js';
import { isMalikiGharra, applyMalikiGharra } from './gharra.js';
import { asabahChain } from '../../data/heirs.js';
export function calculateMalikiInheritance(rawInput, options = {}) {
    const heirs = normalizeInput(rawInput);
    const warnings = validateInput(heirs);
    const context = buildContext(heirs);

    // Apply options overrides
    context.madhhab = 'maliki';
    context.surplusMode = options.surplusMode || 'classical_baytulmal';
    context.includeDhawilArham = options.includeDhawilArham || false;
    if (options.estate !== undefined) context.estateValue = options.estate;

    // ── Phase 0: Preventives (Disqualification) ──────────────────────────────
    const disqualified = [];
    const p = options.preventives || {};

    for (const key in heirs) {
        if (heirs[key] > 0) {
            let isDisq = false;
            let reason = '';
            
            // Check if this heir is targeted by options.preventives
            // Accept both a per-heir key or targetHeir parameter
            const heirPrev = p[key] || (p.targetHeir === key ? p : null);
            if (heirPrev) {
                if (heirPrev.intentionalKiller) {
                    isDisq = true;
                    reason = 'Disqualified: Intentional homicide prevents inheritance under Mālikī law.';
                } else if (heirPrev.accidentalKiller) {
                    context.messages.push(`Note: ${getHeirDisplayName(key)} is an accidental killer; they inherit from the general estate but are excluded from blood money (diyah).`);
                }
                if (heirPrev.sameReligion === false) {
                    isDisq = true;
                    reason = 'Disqualified: Difference of religion prevents mutual inheritance.';
                }
                if (heirPrev.fullyFree === false) {
                    isDisq = true;
                    reason = 'Disqualified: Slavery/bondage prevents inheritance.';
                }
                if (heirPrev.aliveAtDeath === false) {
                    isDisq = true;
                    reason = 'Disqualified: Heir was not alive at the moment of the deceased\'s death.';
                }
            }

            if (isDisq) {
                disqualified.push({
                    heir: key,
                    name: getHeirDisplayName(key),
                    count: heirs[key],
                    status: 'Disqualified',
                    reason: reason,
                    baseShare: fraction(0, 1),
                    adjustedShare: fraction(0, 1),
                    shareBeforeAwl: fraction(0, 1)
                });
                context.messages.push(`${getHeirDisplayName(key)} is disqualified: ${reason}`);
                heirs[key] = 0; // Set count to 0 so they don't inherit
            }
        }
    }

    // Update descendants flags after preventives
    context.hasSon = heirs.son > 0;
    context.hasDaughter = heirs.daughter > 0;
    context.hasSonsSon = heirs.sonsSon > 0;
    context.hasSonsDaughter = heirs.sonsDaughter > 0;
    context.hasMaleDescendants = heirs.son > 0 || heirs.sonsSon > 0 || heirs.sonsSonsSon > 0;
    context.hasFemaleDescendants = heirs.daughter > 0 || heirs.sonsDaughter > 0 || heirs.sonsSonsDaughter > 0;
    context.hasDescendants = context.hasMaleDescendants || context.hasFemaleDescendants;

    // ── Phase 1: Blocking (Ḥajb) ─────────────────────────────────────────────
    const blocked = {};
    context.blocked = blocked;

    for (const heir in malikiBlockingRules) {
        if ((heirs[heir] || 0) === 0) continue;
        blocked[heir] = malikiBlockingRules[heir]({ heirs, context });
        if (blocked[heir]) {
            const name = getHeirDisplayName(heir);
            const reason = malikiBlockingReasons[heir] || 'Closer relative';
            context.messages.push(`${name} BLOCKED by ${reason}`);
        }
    }

    let shares = [];
    let sumFractions = fraction(0, 1);

    // ── Phase 2: Detect Special Cases ─────────────────────────────────────────
    if (isMalikiMushtarikah(heirs, context)) {
        const mushtarikahResult = applyMalikiMushtarikah(heirs, context);
        shares = mushtarikahResult.shares;
        sumFractions = mushtarikahResult.sumFractions;
    } else if (isMalikiGharra(heirs, context)) {
        const gharraResult = applyMalikiGharra(heirs, context);
        shares = gharraResult.shares;
        sumFractions = gharraResult.sumFractions;
    } else {
        // ── Phase 3: Standard Fixed Shares ─────────────────────────────────────
        for (const ruleKey in malikiFixedShareRules) {
            const rule = malikiFixedShareRules[ruleKey];
            if (!rule.eligible({ heirs, context })) continue;

            const frac = rule.share({ heirs, context });
            if (!frac) continue; // null = pure asabah, handled in residuaries

            const reason = rule.reason ? rule.reason({ heirs, context }) : '';

            // Uterine siblings split equally
            if (ruleKey === 'maternalSiblings') {
                const mbCount = heirs.maternalBrother && !context.blocked.maternalBrother ? heirs.maternalBrother : 0;
                const msCount = heirs.maternalSister  && !context.blocked.maternalSister  ? heirs.maternalSister  : 0;
                const totalCount = mbCount + msCount;
                if (totalCount === 0) continue;

                if (mbCount > 0) {
                    const mbShare = fraction(frac.num * mbCount, frac.den * totalCount);
                    shares.push(_makeShare('maternalBrother', 'Uterine (Maternal) Brother', mbCount, mbShare, reason));
                    context.messages.push(`Uterine Brother → ${mbShare.num}/${mbShare.den} — ${reason}`);
                }
                if (msCount > 0) {
                    const msShare = fraction(frac.num * msCount, frac.den * totalCount);
                    shares.push(_makeShare('maternalSister', 'Uterine (Maternal) Sister', msCount, msShare, reason));
                    context.messages.push(`Uterine Sister → ${msShare.num}/${msShare.den} — ${reason}`);
                }
                sumFractions = addFractions(sumFractions, frac);
                continue;
            }

            // Grandmothers split equally
            if (ruleKey === 'grandmothers') {
                const mgCount = heirs.maternalGrandmother > 0 && !context.blocked.maternalGrandmother ? 1 : 0;
                const pgCount = heirs.paternalGrandmother > 0 && !context.blocked.paternalGrandmother ? 1 : 0;
                const gmCount = mgCount + pgCount;
                if (gmCount === 0) continue;

                const gmShare = frac;
                const perGmShare = fraction(frac.num, frac.den * gmCount);

                if (mgCount > 0) {
                    shares.push(_makeShare('maternalGrandmother', 'Maternal Grandmother', 1, perGmShare, reason));
                }
                if (pgCount > 0) {
                    shares.push(_makeShare('paternalGrandmother', 'Paternal Grandmother', 1, perGmShare, reason));
                }
                sumFractions = addFractions(sumFractions, frac);
                context.messages.push(`Grandmother(s) → ${frac.num}/${frac.den} total — ${reason}`);
                continue;
            }

            const name = getHeirDisplayName(ruleKey);
            const count = ruleKey === 'wife' ? (heirs.wife || 1) : (heirs[ruleKey] || 1);

            shares.push(_makeShare(ruleKey, name, count, frac, reason));
            context.messages.push(`${name} → ${frac.num}/${frac.den} — ${reason}`);
            sumFractions = addFractions(sumFractions, frac);
        }

        // ── Phase 4: Grandfather-with-Siblings ─────────────────────────────────
        const gfEligible =
            heirs.paternalGrandfather === 1 &&
            !context.blocked.paternalGrandfather &&
            !context.hasDescendants &&
            (heirs.fullBrother > 0 || heirs.fullSister > 0 || heirs.paternalBrother > 0 || heirs.paternalSister > 0);
        const gfAlreadyAssigned = shares.some(s => s.heir === 'paternalGrandfather');

        if (gfEligible && !gfAlreadyAssigned) {
            context.grandfatherWithSiblings = true;
            const remainderAfterFixed = subtractFractions(fraction(1, 1), sumFractions);

            if (compareFractions(remainderAfterFixed, fraction(0, 1)) > 0) {
                const { grandfatherShare, siblingsRemainder } =
                    computeMalikiGrandfatherBestShare(heirs, context, remainderAfterFixed);

                shares.push({
                    heir: 'paternalGrandfather',
                    name: 'Paternal Grandfather',
                    count: 1,
                    baseShare: grandfatherShare,
                    adjustedShare: grandfatherShare,
                    status: 'Sharer + Residuary',
                    reason: 'Best-share from Mālikī grandfather-with-siblings method',
                    shareBeforeAwl: grandfatherShare,
                });
                context.messages.push(`Paternal Grandfather → ${grandfatherShare.num}/${grandfatherShare.den} (grandfather-with-siblings best-share)`);
                sumFractions = addFractions(sumFractions, grandfatherShare);

                distributeMalikiSiblings(heirs, context, siblingsRemainder, shares);
                sumFractions = addFractions(sumFractions, siblingsRemainder);
            }
        }
    }

    // ── Phase 5: ʿAwl ────────────────────────────────────────────────────────
    sumFractions = applyAwl(shares, sumFractions, context);

    // ── Phase 6: ʿAṣabah (Residuaries) ───────────────────────────────────────
    const hasResiduaries = shares.some(s => s.status && (s.status.includes('Residuary') || s.status.includes('Sharer + Residuary')));
    if (!hasResiduaries && compareFractions(sumFractions, fraction(1, 1)) < 0) {
        shares = assignMalikiResiduaries(shares, heirs, sumFractions, context);
    }

    // ── Phase 7: Surplus (Bayt al-Māl / Radd) ─────────────────────────────────
    const finalSum = computeCurrentSum(shares);
    if (compareFractions(finalSum, fraction(1, 1)) < 0) {
        const remainder = subtractFractions(fraction(1, 1), finalSum);
        
        if (context.surplusMode === 'classical_baytulmal') {
            // Surplus goes to Bayt al-Māl
            shares.push({
                heir: 'baytAlMal',
                name: 'Bayt al-Māl (Public Treasury)',
                count: 1,
                baseShare: remainder,
                adjustedShare: remainder,
                status: 'Bayt al-Māl',
                reason: 'Surplus returned to Bayt al-Māl — classical Mālikī surplus rule'
            });
            context.messages.push(`Surplus ${remainder.num}/${remainder.den} goes to Bayt al-Māl (Classical Mālikī).`);
        } else {
            // Modern surplus mode: return proportionally to blood sharers, spouse excluded
            const spouseKeys = ['husband', 'wife'];
            const bloodShares = shares.filter(s => !spouseKeys.includes(s.heir) && s.status !== 'Blocked');
            const spouseShares = shares.filter(s => spouseKeys.includes(s.heir) && s.status !== 'Blocked');

            if (bloodShares.length > 0) {
                context.raddApplied = true;
                context.messages.push(`Radd: Surplus ${remainder.num}/${remainder.den} returned to blood sharers proportionally (modern Mālikī fallback).`);
                
                const totalBloodShare = bloodShares.reduce(
                    (sum, sh) => addFractions(sum, sh.adjustedShare),
                    fraction(0, 1)
                );

                for (const s of bloodShares) {
                    const ratio = divideFractions(s.adjustedShare, totalBloodShare);
                    const raddPortion = multiplyFractions(remainder, ratio);
                    const newTotal = addFractions(s.adjustedShare, raddPortion);
                    s.adjustedShare = newTotal;
                    s.baseShare = newTotal;
                    s.status = s.status === 'Sharer'
                        ? 'Sharer + Radd'
                        : `${s.status} + Radd`;
                   s.reason += ' + Radd (proportional)';
                }

            } else if (spouseShares.length > 0) {
                // If spouse alone and no blood sharers, goes to spouse in modern practice
                context.raddApplied = true;
                context.messages.push(`Radd: Spouse is sole heir. Surplus ${remainder.num}/${remainder.den} returned to spouse (modern Mālikī fallback).`);
                for (const s of spouseShares) {
                    const newTotal = addFractions(s.adjustedShare, remainder);
                    s.adjustedShare = s.baseShare = newTotal;
                    s.status = 'Sharer + Radd';
                    s.reason += ' + Radd (sole heir, modern fallback)';
                }
            }
        }
    }

    // ── Phase 8: Append Blocked and Disqualified Heirs ────────────────────────
    for (const key in heirs) {
        if (heirs[key] > 0 && blocked[key]) {
            const alreadyListed = shares.some(s => s.heir === key);
            if (!alreadyListed) {
                shares.push({
                    heir: key,
                    name: getHeirDisplayName(key),
                    count: heirs[key],
                    baseShare: fraction(0, 1),
                    adjustedShare: fraction(0, 1),
                    status: 'Blocked',
                    reason: `Blocked by ${malikiBlockingReasons[key] || 'closer relative'}`,
                    shareBeforeAwl: fraction(0, 1),
                });
            }
        }
    }

    // Add disqualified heirs
    disqualified.forEach(d => {
        shares.push(d);
    });

    return {
        shares,
        messages: context.messages,
        warnings,
        blocked: context.blocked,
        context: {
            awlApplied: context.awlApplied,
            raddApplied: context.raddApplied,
            musharrakahApplied: context.musharrakahApplied,
            grandfatherWithSiblings: context.grandfatherWithSiblings,
            fullSisterAsAsabah: context.fullSisterAsAsabah,
            raddMode: context.surplusMode === 'classical_baytulmal' ? 'baytulMal' : 'returnToHeirs',
        }
    };
}

function _makeShare(heir, name, count, frac, reason) {
    return {
        heir,
        name,
        count,
        baseShare: frac,
        adjustedShare: frac,
        status: 'Sharer',
        reason,
        shareBeforeAwl: frac,
    };
}

function computeCurrentSum(shares) {
    return shares
        .filter(s => s.status !== 'Blocked' && s.status !== 'Bayt al-Māl' && s.status !== 'Disqualified')
        .reduce((sum, s) => {
            if (s.adjustedShare && s.adjustedShare.num > 0) {
                const a = sum.num * s.adjustedShare.den + s.adjustedShare.num * sum.den;
                const b = sum.den * s.adjustedShare.den;
                const d = gcd(Math.abs(a), Math.abs(b));
                return { num: a / d, den: b / d };
            }
            return sum;
        }, fraction(0, 1));
}

function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }

function assignMalikiResiduaries(shares, heirs, sumFractions, context) {
    if (compareFractions(sumFractions, fraction(1, 1)) >= 0) return shares;

    const remainder = subtractFractions(fraction(1, 1), sumFractions);

    // ʿAṣabah maʿa l-ghayr: sister + female descendant
    const canSisterBeAsabah =
        heirs.son === 0 && heirs.sonsSon === 0 && heirs.sonsSonsSon === 0 &&
        heirs.father === 0 && heirs.paternalGrandfather === 0 &&
        heirs.fullBrother === 0 && heirs.paternalBrother === 0;

    if (canSisterBeAsabah && (heirs.daughter > 0 || heirs.sonsDaughter > 0)) {
        if (heirs.fullSister > 0 && !context.blocked.fullSister) {
            context.fullSisterAsAsabah = true;
            shares.push({
                heir: 'fullSister',
                name: 'Full Sister',
                count: heirs.fullSister,
                baseShare: remainder,
                adjustedShare: remainder,
                status: 'Residuary',
                reason: "ʿAṣabah maʿa l-ghayr — Takes remainder alongside female descendant (Mālikī Risālah)"
            });
            context.messages.push(`Full Sister → ${remainder.num}/${remainder.den} (ʿaṣabah maʿa l-ghayr)`);
            return shares;
        }
        if (heirs.paternalSister > 0 && !context.blocked.paternalSister && heirs.fullSister === 0) {
            shares.push({
                heir: 'paternalSister',
                name: 'Consanguine (Paternal) Sister',
                count: heirs.paternalSister,
                baseShare: remainder,
                adjustedShare: remainder,
                status: 'Residuary',
                reason: "ʿAṣabah maʿa l-ghayr — Takes remainder alongside female descendant (Mālikī Risālah)"
            });
            context.messages.push(`Paternal Sister → ${remainder.num}/${remainder.den} (ʿaṣabah maʿa l-ghayr)`);
            return shares;
        }
    }

    // Walk the asabah priority chain
    for (const [maleKey, femaleKey] of asabahChain) {
        const maleCount   = heirs[maleKey] || 0;
        const femaleCount = femaleKey ? (heirs[femaleKey] || 0) : 0;
        const maleBlocked = context.blocked[maleKey];
        const femBlocked  = femaleKey ? context.blocked[femaleKey] : true;
        const activeMale  = maleCount > 0 && !maleBlocked;
        const activeFem   = femaleCount > 0 && !femBlocked;

        if (!activeMale && !activeFem) continue;

        // Father / grandfather: sharer + residuary
        if (maleKey === 'father' || maleKey === 'paternalGrandfather') {
            if (!activeMale) continue;
            const existing = shares.find(s => s.heir === maleKey);
            if (existing) {
                existing.status = 'Sharer + Residuary';
                const newTotal = addFractions(existing.adjustedShare, remainder);
                existing.adjustedShare = existing.baseShare = newTotal;
                existing.reason += ' + Takes residue as ʿaṣabah';
            } else {
                shares.push({
                    heir: maleKey,
                    name: getHeirDisplayName(maleKey),
                    count: 1,
                    baseShare: remainder,
                    adjustedShare: remainder,
                    status: 'Residuary',
                    reason: 'Pure ʿaṣabah — Takes entire remainder'
                });
            }
            context.messages.push(`${getHeirDisplayName(maleKey)} takes residue`);
            return shares;
        }

        if (activeMale && activeFem) {
            const mUnits = maleCount * 2;
            const fUnits = femaleCount;
            const tUnits = mUnits + fUnits;
            const ms = multiplyFractions(remainder, fraction(mUnits, tUnits));
            const fs = multiplyFractions(remainder, fraction(fUnits, tUnits));
            shares.push({
                heir: maleKey,
                name: getHeirDisplayName(maleKey),
                count: maleCount,
                baseShare: ms,
                adjustedShare: ms,
                status: 'Residuary',
                reason: 'ʿAṣabah bi-l-ghayr — 2:1 ratio'
            });
            shares.push({
                heir: femaleKey,
                name: getHeirDisplayName(femaleKey),
                count: femaleCount,
                baseShare: fs,
                adjustedShare: fs,
                status: 'Residuary',
                reason: 'ʿAṣabah bi-l-ghayr — 2:1 ratio'
            });
            context.messages.push(`${getHeirDisplayName(maleKey)} + ${getHeirDisplayName(femaleKey)} (2:1 ʿaṣabah)`);
            return shares;
        }

        if (activeMale) {
            shares.push({
                heir: maleKey,
                name: getHeirDisplayName(maleKey),
                count: maleCount,
                baseShare: remainder,
                adjustedShare: remainder,
                status: 'Residuary',
                reason: 'ʿAṣabah bi-nafsihī — Takes entire remainder'
            });
            context.messages.push(`${getHeirDisplayName(maleKey)} → ${remainder.num}/${remainder.den} (ʿaṣabah)`);
            return shares;
        }
    }

    return shares;
}
