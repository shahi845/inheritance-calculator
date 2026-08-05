/**
 * Ḥanbalī Inheritance Engine
 *
 * A complete calculation pipeline for the Ḥanbalī madhhab.
 *
 * Pipeline:
 * 1. normalizeInput (shared)
 * 2. validateInput (shared)
 * 3. buildContext (shared)
 * 4. applyHanbaliBlocking
 * 5. assignHanbaliFixedShares (includes grandfather with siblings Muqāsamah)
 * 6. applyAwl (shared)
 * 7. assignHanbaliResiduaries
 * 8. applyHanbaliRadd
 * 9. assignHanbaliDhawuAlArham (Tanzīl system)
 */

import { normalizeInput } from '../../engine/normalizeInput.js';
import { validateInput } from '../../engine/validateInput.js';
import { buildContext } from '../../engine/buildContext.js';
import { applyAwl } from '../../engine/applyAwl.js';
import { getHeirDisplayName } from '../../utils/formatResults.js';
import { hanbaliBlockingRules, hanbaliBlockingReasons } from './blocking.js';
import { hanbaliFixedShareRules } from './fixedShares.js';
import { calculateHanbaliGrandfatherWithSiblings } from './grandfather.js';
import { applyHanbaliRadd } from './radd.js';
import { assignHanbaliDhawuAlArham } from './dhawilArham.js';
import { asabahChain } from '../../data/heirs.js';
import {
    fraction,
    addFractions,
    subtractFractions,
    compareFractions,
    multiplyFractions,
    divideFractions
} from '../../utils/fractions.js';

export function calculateHanbaliInheritance(rawInput, options = {}) {
    const heirs = normalizeInput(rawInput);
    const warnings = validateInput(heirs);
    const context = buildContext(heirs);

    // Ḥanbalī defaults
    context.raddMode = options.raddMode || 'returnToHeirs'; // Hanbalis return surplus to heirs
    context.dhawuAlArhamMode = options.dhawuAlArhamMode || 'enabled'; // Hanbalis use Tanzil system for dhawu al-arham
    context.madhhab = 'hanbali';
    if (options.estate !== undefined) context.estateValue = options.estate;

    // Phase 1: Blocking
    _applyHanbaliBlocking(heirs, context);

    // Phase 2: Fixed Shares
    let { shares, sumFractions } = _assignHanbaliFixedShares(heirs, context);

    // Phase 3: ʿAwl
    sumFractions = applyAwl(shares, sumFractions, context);

    // Phase 4: ʿAṣabah
    const prevLen = shares.length;
    shares = _assignHanbaliResiduaries(shares, heirs, sumFractions, context);
    const hasResiduaries = shares.length > prevLen ||
        shares.some(s => s.status && s.status.includes('Residuary'));

    // Phase 5: Radd / Dhawu al-Arḥām
    if (!hasResiduaries) {
        const currentSum = _sumShares(shares);
        const remainder = subtractFractions(fraction(1, 1), currentSum);

        if (compareFractions(remainder, fraction(0, 1)) > 0) {
            const hasDhawu = _hasDhawuHeirs(heirs, context);
            if (hasDhawu && context.dhawuAlArhamMode !== 'disabled') {
                shares = assignHanbaliDhawuAlArham(shares, heirs, remainder, context);
            } else {
                shares = applyHanbaliRadd(shares, currentSum, context);
            }
        }
    }

    // Phase 6: Append blocked heirs
    return _buildResult(shares, heirs, context, warnings);
}

function _applyHanbaliBlocking(heirs, context) {
    const blocked = {};
    context.blocked = blocked;

    for (const heir in hanbaliBlockingRules) {
        if ((heirs[heir] || 0) === 0) continue;
        blocked[heir] = hanbaliBlockingRules[heir]({ heirs, context });
        if (blocked[heir]) {
            const reason = hanbaliBlockingReasons[heir] || 'Closer relative (Ḥanbalī)';
            context.messages.push(`${getHeirDisplayName(heir)} BLOCKED by ${reason}`);
        }
    }
}

function _assignHanbaliFixedShares(heirs, context) {
    let shares = [];
    let sumFractions = fraction(0, 1);
    
    // Check for Grandfather + Siblings
    const hasActiveGF = heirs.paternalGrandfather > 0 && !context.blocked.paternalGrandfather;
    const activeSiblings = (heirs.fullBrother > 0 && !context.blocked.fullBrother) || 
                           (heirs.fullSister > 0 && !context.blocked.fullSister) ||
                           (heirs.paternalBrother > 0 && !context.blocked.paternalBrother) ||
                           (heirs.paternalSister > 0 && !context.blocked.paternalSister);

    if (hasActiveGF && activeSiblings) {
        context.grandfatherWithSiblings = true;
    }

    for (const ruleKey in hanbaliFixedShareRules) {
        const rule = hanbaliFixedShareRules[ruleKey];
        if (!rule.eligible({ heirs, context })) continue;
        
        // Skip grandfather and siblings if handling them via the special sharing method later
        if (context.grandfatherWithSiblings && 
            ['paternalGrandfather', 'fullBrother', 'fullSister', 'paternalBrother', 'paternalSister'].includes(ruleKey)) {
            continue;
        }

        const frac = rule.share({ heirs, context });
        if (!frac) continue;

        const reason = rule.reason ? rule.reason({ heirs, context }) : '';

        // Maternal siblings — split equally
        if (ruleKey === 'maternalSiblings') {
            const mb = heirs.maternalBrother && !context.blocked.maternalBrother ? heirs.maternalBrother : 0;
            const ms = heirs.maternalSister  && !context.blocked.maternalSister  ? heirs.maternalSister  : 0;
            const total = mb + ms;
            if (total === 0) continue;
            if (mb > 0) {
                const sh = fraction(frac.num * mb, frac.den * total);
                shares.push(_makeShare('maternalBrother', 'Uterine Brother', mb, sh, reason));
                context.messages.push(`Uterine Brother → ${sh.num}/${sh.den}`);
            }
            if (ms > 0) {
                const sh = fraction(frac.num * ms, frac.den * total);
                shares.push(_makeShare('maternalSister', 'Uterine Sister', ms, sh, reason));
                context.messages.push(`Uterine Sister → ${sh.num}/${sh.den}`);
            }
            sumFractions = addFractions(sumFractions, frac);
            continue;
        }

        // Grandmothers — split individually
        if (ruleKey === 'grandmothers') {
            const mg = heirs.maternalGrandmother > 0 && !context.blocked.maternalGrandmother;
            const pg = heirs.paternalGrandmother > 0 && !context.blocked.paternalGrandmother;
            const count = (mg ? 1 : 0) + (pg ? 1 : 0);
            if (count === 0) continue;
            const perShare = fraction(frac.num, frac.den * count);
            if (mg) shares.push(_makeShare('maternalGrandmother', 'Maternal Grandmother', 1, perShare, reason));
            if (pg) shares.push(_makeShare('paternalGrandmother', 'Paternal Grandmother', 1, perShare, reason));
            sumFractions = addFractions(sumFractions, frac);
            context.messages.push(`Grandmother(s) → ${frac.num}/${frac.den} total`);
            continue;
        }

        const name = getHeirDisplayName(ruleKey);
        const count = ruleKey === 'wife' ? (heirs.wife || 1) : (heirs[ruleKey] || 1);
        shares.push(_makeShare(ruleKey, name, count, frac, reason));
        context.messages.push(`${name} → ${frac.num}/${frac.den} — ${reason}`);
        sumFractions = addFractions(sumFractions, frac);
    }

    if (context.grandfatherWithSiblings) {
        const gfResult = calculateHanbaliGrandfatherWithSiblings(heirs, context, sumFractions);
        shares = shares.concat(gfResult.shares);
        sumFractions = addFractions(sumFractions, gfResult.sumFractions);
    }

    return { shares, sumFractions };
}

function _assignHanbaliResiduaries(shares, heirs, sumFractions, context) {
    if (compareFractions(sumFractions, fraction(1, 1)) >= 0) return shares;

    const remainder = subtractFractions(fraction(1, 1), sumFractions);

    // ʿAṣabah maʿa l-ghayr: sister + female descendant
    const canSisterBeAsabah =
        heirs.son === 0 &&
        heirs.sonsSon === 0 &&
        heirs.sonsSonsSon === 0 &&
        heirs.father === 0 &&
        heirs.paternalGrandfather === 0 &&
        heirs.fullBrother === 0;

    if (canSisterBeAsabah && (heirs.daughter > 0 || heirs.sonsDaughter > 0)) {
        if (heirs.fullSister > 0 && !context.blocked.fullSister) {
            context.fullSisterAsAsabah = true;
            shares.push(_makeShare('fullSister', 'Full Sister', heirs.fullSister, remainder,
                "ʿAṣabah maʿa l-ghayr — Takes remainder alongside female descendant (Ḥanbalī)"));
            context.messages.push(`Full Sister → ${remainder.num}/${remainder.den} (ʿaṣabah maʿa l-ghayr)`);
            return shares;
        }
        if (heirs.paternalSister > 0 && !context.blocked.paternalSister && heirs.fullSister === 0) {
            shares.push(_makeShare('paternalSister', 'Consanguine Sister', heirs.paternalSister, remainder,
                "ʿAṣabah maʿa l-ghayr — Takes remainder alongside female descendant (Ḥanbalī)"));
            context.messages.push(`Paternal Sister → ${remainder.num}/${remainder.den} (ʿaṣabah maʿa l-ghayr)`);
            return shares;
        }
    }

    // Walk the ʿaṣabah chain
    for (const [maleKey, femaleKey] of asabahChain) {
        // Skip grandfather/siblings if they were already handled by the sharing method
        if (context.grandfatherWithSiblings && ['paternalGrandfather', 'fullBrother', 'fullSister', 'paternalBrother', 'paternalSister'].includes(maleKey)) {
            continue;
        }

        const maleCount   = heirs[maleKey] || 0;
        const femaleCount = femaleKey ? (heirs[femaleKey] || 0) : 0;
        const maleBlocked = context.blocked[maleKey];
        const femBlocked  = femaleKey ? context.blocked[femaleKey] : true;
        const activeMale  = maleCount > 0 && !maleBlocked;
        const activeFem   = femaleCount > 0 && !femBlocked;

        if (!activeMale && !activeFem) continue;

        if (maleKey === 'father' || maleKey === 'paternalGrandfather') {
            if (!activeMale) continue;
            const existing = shares.find(s => s.heir === maleKey);
            if (existing) {
                existing.status = 'Sharer + Residuary';
                const newTotal = addFractions(existing.adjustedShare, remainder);
                existing.adjustedShare = existing.baseShare = newTotal;
                existing.reason += ' + Takes residue as ʿaṣabah';
            } else {
                shares.push(_makeShare(maleKey, getHeirDisplayName(maleKey), 1, remainder,
                    'Pure ʿaṣabah — Takes entire remainder'));
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
            shares.push(_makeShare(maleKey, getHeirDisplayName(maleKey), maleCount, ms, 'ʿAṣabah bi-l-ghayr (2:1 ratio)'));
            shares.push(_makeShare(femaleKey, getHeirDisplayName(femaleKey), femaleCount, fs, 'ʿAṣabah bi-l-ghayr (2:1 ratio)'));
            context.messages.push(`${getHeirDisplayName(maleKey)} + ${getHeirDisplayName(femaleKey)} (2:1 ʿaṣabah)`);
            return shares;
        }

        if (activeMale) {
            shares.push(_makeShare(maleKey, getHeirDisplayName(maleKey), maleCount, remainder, 'ʿAṣabah bi-nafsihī'));
            context.messages.push(`${getHeirDisplayName(maleKey)} → ${remainder.num}/${remainder.den} (ʿaṣabah)`);
            return shares;
        }
    }

    return shares;
}

function _hasDhawuHeirs(heirs, context) {
    const primaryHeirs = [
        'husband', 'wife', 'father', 'mother', 'paternalGrandfather', 'maternalGrandmother', 'paternalGrandmother',
        'son', 'daughter', 'sonsSon', 'sonsDaughter', 'sonsSonsSon', 'sonsSonsDaughter',
        'fullBrother', 'fullSister', 'paternalBrother', 'paternalSister', 'maternalBrother', 'maternalSister',
        'fullBrothersSon', 'paternalBrothersSon', 'fullPaternalUncle', 'paternalUncle',
        'fullPaternalUncleSon', 'paternalUncleSon'
    ];
    for (const [key, count] of Object.entries(heirs)) {
        if (count > 0 && !primaryHeirs.includes(key)) {
            return true;
        }
    }
    return false;
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

function _sumShares(shares) {
    return shares.reduce((sum, s) => {
        if (s.adjustedShare && s.adjustedShare.num > 0) {
            return addFractions(sum, s.adjustedShare);
        }
        return sum;
    }, fraction(0, 1));
}

function _buildResult(shares, heirs, context, warnings) {
    for (const key in heirs) {
        if (heirs[key] > 0 && context.blocked[key]) {
            const alreadyListed = shares.some(s => s.heir === key);
            if (!alreadyListed) {
                shares.push({
                    heir: key,
                    name: getHeirDisplayName(key),
                    count: heirs[key],
                    baseShare: fraction(0, 1),
                    adjustedShare: fraction(0, 1),
                    status: 'Blocked',
                    reason: `Blocked by ${hanbaliBlockingReasons[key] || 'closer relative'}`,
                    shareBeforeAwl: fraction(0, 1),
                });
            }
        }
    }

    return {
        shares,
        messages: context.messages,
        warnings,
        blocked: context.blocked,
        context: {
            awlApplied: context.awlApplied,
            raddApplied: context.raddApplied,
            grandfatherWithSiblings: context.grandfatherWithSiblings,
            fullSisterAsAsabah: context.fullSisterAsAsabah,
        }
    };
}
