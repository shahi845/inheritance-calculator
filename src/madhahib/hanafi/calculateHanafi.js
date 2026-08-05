/**
 * Ḥanafī Inheritance Engine
 *
 * A complete, separate calculation pipeline for the Ḥanafī madhhab.
 * DO NOT use Shāfiʿī modules here (no musharrakah, no Akdariyyah,
 * no grandfather best-share — grandfather simply blocks siblings).
 *
 * Pipeline:
 * 1. normalizeInput (shared — canonical key mapping)
 * 2. validateInput (shared)
 * 3. buildContext (shared, but raddMode defaulted to 'returnToHeirs')
 * 4. applyHanafiBlocking
 * 5. assignHanafiFixedShares
 * 6. applyAwl (shared)
 * 7. assignHanafiResiduaries
 * 8. applyHanafiRadd
 * 9. assignDhawuAlArham (if enabled)
 *
 * Sources: Mulla's Digest (Sirājiyyah), IIUM Hadith Commentary
 */

import { normalizeInput } from '../../engine/normalizeInput.js';
import { validateInput } from '../../engine/validateInput.js';
import { buildContext } from '../../engine/buildContext.js';
import { applyAwl } from '../../engine/applyAwl.js';
import { getHeirDisplayName } from '../../utils/formatResults.js';
import { hanafiBlockingRules, hanafiBlockingReasons } from './blocking.js';
import { hanafiFixedShareRules } from './fixedShares.js';
import { asabahChain } from '../../data/heirs.js';
import {
    fraction,
    addFractions,
    subtractFractions,
    compareFractions,
    multiplyFractions,
    divideFractions
} from '../../utils/fractions.js';
import { _assignHanafiDhawuAlArham } from './dhawuAlArham.js';

// ─── Main entry point ─────────────────────────────────────────────────────────
export function calculateHanafiInheritance(rawInput, options = {}) {
    const heirs = normalizeInput(rawInput);
    const warnings = validateInput(heirs);
    const context = buildContext(heirs);

    // Ḥanafī defaults
    context.raddMode = options.raddMode || 'returnToHeirs';
    context.spouseRaddMode = options.spouseRaddMode || 'modernIfNoOtherHeir';
    context.dhawuAlArhamMode = options.dhawuAlArhamMode || 'enabledWhenNoBaytulMal';
    context.madhhab = 'hanafi';
    if (options.estate !== undefined) context.estateValue = options.estate;

    // Phase 1: Blocking
    _applyHanafiBlocking(heirs, context);

    // Phase 2: Fixed Shares
    let { shares, sumFractions } = _assignHanafiFixedShares(heirs, context);

    // Phase 3: ʿAwl
    sumFractions = applyAwl(shares, sumFractions, context);

    // Phase 4: ʿAṣabah
    const prevLen = shares.length;
    shares = _assignHanafiResiduaries(shares, heirs, sumFractions, context);
    const hasResiduaries = shares.length > prevLen ||
        shares.some(s => s.status && s.status.includes('Residuary'));

    // Phase 5: Radd / Dhawu al-Arḥām
    if (!hasResiduaries) {
        const currentSum = _sumShares(shares);
        const remainder = subtractFractions(fraction(1, 1), currentSum);

        if (compareFractions(remainder, fraction(0, 1)) > 0) {
            const hasDhawu = _hasDhawuHeirs(heirs, context);
            if (hasDhawu && context.dhawuAlArhamMode !== 'disabled') {
                shares = _assignHanafiDhawuAlArham(shares, heirs, remainder, context);
            } else {
                shares = _applyHanafiRadd(shares, currentSum, context);
            }
        }
    }

    // Phase 6: Append blocked heirs
    return _buildResult(shares, heirs, context, warnings);
}

// ─── Phase 1: Blocking ────────────────────────────────────────────────────────
function _applyHanafiBlocking(heirs, context) {
    const blocked = {};
    context.blocked = blocked;

    for (const heir in hanafiBlockingRules) {
        if ((heirs[heir] || 0) === 0) continue;
        blocked[heir] = hanafiBlockingRules[heir]({ heirs, context });
        if (blocked[heir]) {
            const reason = hanafiBlockingReasons[heir] || 'Closer relative (Ḥanafī)';
            context.messages.push(`${getHeirDisplayName(heir)} BLOCKED by ${reason}`);
        }
    }
}

// ─── Phase 2: Fixed Shares ────────────────────────────────────────────────────
function _assignHanafiFixedShares(heirs, context) {
    let shares = [];
    let sumFractions = fraction(0, 1);

    for (const ruleKey in hanafiFixedShareRules) {
        const rule = hanafiFixedShareRules[ruleKey];
        if (!rule.eligible({ heirs, context })) continue;

        const frac = rule.share({ heirs, context });
        if (!frac) continue;

        const reason = rule.reason ? rule.reason({ heirs, context }) : '';

        // Maternal siblings — split equally (male=female in Ḥanafī)
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

    return { shares, sumFractions };
}

// ─── Phase 3: ʿAṣabah (Residuaries) ─────────────────────────────────────────
function _assignHanafiResiduaries(shares, heirs, sumFractions, context) {
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
                "ʿAṣabah maʿa l-ghayr — Takes remainder alongside female descendant"));
            context.messages.push(`Full Sister → ${remainder.num}/${remainder.den} (ʿaṣabah maʿa l-ghayr)`);
            return shares;
        }
        if (heirs.paternalSister > 0 && !context.blocked.paternalSister && heirs.fullSister === 0) {
            shares.push(_makeShare('paternalSister', 'Consanguine Sister', heirs.paternalSister, remainder,
                "ʿAṣabah maʿa l-ghayr — Takes remainder alongside female descendant"));
            context.messages.push(`Paternal Sister → ${remainder.num}/${remainder.den} (ʿaṣabah maʿa l-ghayr)`);
            return shares;
        }
    }

    // Walk the ʿaṣabah chain
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
                shares.push(_makeShare(maleKey, getHeirDisplayName(maleKey), 1, remainder,
                    'Pure ʿaṣabah — Takes entire remainder', 'Residuary'));
            }
            context.messages.push(`${getHeirDisplayName(maleKey)} takes residue`);
            return shares;
        }

        if (activeMale && activeFem) {
            const mU = maleCount * 2, fU = femaleCount, tU = mU + fU;
            const ms = multiplyFractions(remainder, fraction(mU, tU));
            const fs = multiplyFractions(remainder, fraction(fU, tU));
            shares.push(_makeShare(maleKey, getHeirDisplayName(maleKey), maleCount, ms,
                'ʿAṣabah bi-l-ghayr — 2:1 ratio', 'Residuary'));
            shares.push(_makeShare(femaleKey, getHeirDisplayName(femaleKey), femaleCount, fs,
                'ʿAṣabah bi-l-ghayr — 2:1 ratio', 'Residuary'));
            context.messages.push(`${getHeirDisplayName(maleKey)} + ${getHeirDisplayName(femaleKey)} (2:1 ʿaṣabah)`);
            return shares;
        }

        if (activeMale) {
            shares.push(_makeShare(maleKey, getHeirDisplayName(maleKey), maleCount, remainder,
                'ʿAṣabah bi-nafsihī — Takes entire remainder', 'Residuary'));
            context.messages.push(`${getHeirDisplayName(maleKey)} → ${remainder.num}/${remainder.den} (ʿaṣabah)`);
            return shares;
        }
    }

    return shares;
}

// ─── Phase 4: Ḥanafī Radd ────────────────────────────────────────────────────
function _applyHanafiRadd(shares, currentSum, context) {
    const remainder = subtractFractions(fraction(1, 1), currentSum);
    if (compareFractions(remainder, fraction(0, 1)) <= 0) return shares;

    context.raddApplied = true;

    const spouseKeys = ['husband', 'wife'];
    const bloodShares  = shares.filter(s => !spouseKeys.includes(s.heir) && s.status !== 'Blocked');
    const spouseShares = shares.filter(s => spouseKeys.includes(s.heir) && s.status !== 'Blocked');

    if (bloodShares.length > 0) {
        // Blood sharers receive proportional radd; spouse excluded
        context.messages.push(`Ḥanafī Radd: surplus ${remainder.num}/${remainder.den} returned to blood sharers proportionally.`);
        const totalBloodShare = bloodShares.reduce(
    (sum, s) => addFractions(sum, s.adjustedShare),
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
}

    // Spouse + dhawu al-arḥām: handled in calling function
    // Spouse alone:
    if (spouseShares.length > 0) {
        if (context.spouseRaddMode === 'modernIfNoOtherHeir') {
            context.messages.push(`Ḥanafī Radd: spouse is sole heir — entire estate returned (modern practice).`);
            for (const s of spouseShares) {
                const nt = addFractions(s.adjustedShare, remainder);
                s.adjustedShare = s.baseShare = nt;
                s.status = 'Sharer + Radd';
                s.reason += ' + Radd (sole heir, modern Ḥanafī practice)';
            }
        } else {
            context.messages.push(`Ḥanafī Radd: surplus → Bayt al-Māl (classical Sirājiyyah — spouse alone).`);
            shares.push(_makeShare('baytAlMal', 'Bayt al-Māl (Public Treasury)', 1, remainder,
                'Classical Sirājiyyah: spouse alone does not receive radd', 'Bayt al-Māl'));
        }
    }

    return shares;
}

// ─── Phase 5: Dhawu al-Arḥām ─────────────────────────────────────────────────
// Delegated to the dedicated module: src/madhahib/hanafi/dhawuAlArham.js
// (also reused by Ḥanbalī and Shāfiʿī modern-fallback engines)

// ─── Helpers ──────────────────────────────────────────────────────────────────
function _makeShare(heir, name, count, frac, reason, status = 'Sharer') {
    return { heir, name, count, baseShare: frac, adjustedShare: frac, status, reason, shareBeforeAwl: frac };
}

function _sumShares(shares) {
    return shares
        .filter(s => s.status !== 'Blocked' && s.status !== 'Bayt al-Māl')
        .reduce((sum, s) => {
            if (s.adjustedShare && s.adjustedShare.num > 0) {
                const n = sum.num * s.adjustedShare.den + s.adjustedShare.num * sum.den;
                const d = sum.den * s.adjustedShare.den;
                const g = _gcd(Math.abs(n), Math.abs(d));
                return { num: n / g, den: d / g };
            }
            return sum;
        }, fraction(0, 1));
}

function _gcd(a, b) { return b === 0 ? a : _gcd(b, a % b); }

function _hasDhawuHeirs(heirs, context) {
    const keys = ['daughtersSon','daughtersDaughter','maternalGrandfather',
        'sistersSon','sistersDaughter','maternalUncle','maternalAunt','paternalAunt',
        'uterineSiblingChildren','otherDistantRelatives'];
    return keys.some(k => heirs[k] > 0 && !context.blocked[k]);
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
                    reason: `Blocked by ${hanafiBlockingReasons[key] || 'closer relative (Ḥanafī)'}`,
                });
            }
        }
    }

    return {
        shares,
        messages: context.messages,
        warnings,
        blocked: context.blocked,
        madhhab: 'hanafi',
        context: {
            awlApplied: context.awlApplied,
            raddApplied: context.raddApplied,
            raddMode: context.raddMode,
            spouseRaddMode: context.spouseRaddMode,
        }
    };
}
