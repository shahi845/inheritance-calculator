import { asabahChain } from '../data/heirs.js';
import { fraction, subtractFractions, compareFractions, addFractions, multiplyFractions } from '../utils/fractions.js';
import { getHeirDisplayName } from '../utils/formatResults.js';

/**
 * Assigns residuary shares (ʿAṣabah) after fixed shares.
 * Implements the full Shāfiʿī ʿaṣabah priority chain from asabahChain.
 *
 * Types of ʿaṣabah handled:
 * 1. ʿAṣabah bi-nafsihī — male takes all remainder
 * 2. ʿAṣabah bi-l-ghayr — male + female counterpart share 2:1
 * 3. ʿAṣabah maʿa l-ghayr — full/paternal sister + female descendant (sister takes remainder)
 */
export function assignResiduaries(shares, heirs, sumFractions, context) {
    let remainder = fraction(0, 1);
    let estateExhausted = false;

    if (compareFractions(sumFractions, fraction(1, 1)) >= 0) {
        estateExhausted = true;
    } else {
        remainder = subtractFractions(fraction(1, 1), sumFractions);
    }


    // ─── ʿAṣabah maʿa l-ghayr (MUST be checked before the chain) ─────────────
    // Full sister or paternal sister becomes residuary WITH a female descendant
    // (daughter or son's daughter) when no male asabah is blocking her.
    // This takes precedence over the male-only chain for sisters.
    const canBeSisterAsabah =
        heirs.son === 0 &&
        heirs.sonsSon === 0 &&
        heirs.sonsSonsSon === 0 &&
        heirs.father === 0 &&
        heirs.paternalGrandfather === 0 &&
        heirs.fullBrother === 0;

    if (canBeSisterAsabah && (heirs.daughter > 0 || heirs.sonsDaughter > 0)) {
        // Full Sister as ʿaṣabah maʿa l-ghayr
        if (heirs.fullSister > 0 && !context.blocked.fullSister) {
            if (estateExhausted) {
                shares.push({
                    heir: 'fullSister',
                    name: 'Full Sister',
                    count: heirs.fullSister,
                    baseShare: fraction(0, 1),
                    adjustedShare: fraction(0, 1),
                    status: 'Blocked',
                    reason: `Excluded — Estate exhausted by fixed shares`,
                    ruleId: 'RES-EXH',
                    evidence: '',
                    reference: '',
                    shareBeforeAwl: fraction(0, 1),
                });
                context.messages.push(`Full Sister excluded from ʿaṣabah (estate exhausted)`);
                return shares;
            }

            context.fullSisterAsAsabah = true;
            shares.push({
                heir: 'fullSister',
                name: 'Full Sister',
                count: heirs.fullSister,
                baseShare: remainder,
                adjustedShare: remainder,
                status: 'Residuary',
                reason: `ʿAṣabah maʿa l-ghayr — Takes remainder alongside female descendant`,
                ruleId: 'RES-M-1',
                evidence: 'Ibn Masʿūd (al-Bukhārī)',
                reference: 'Reliance L7',
                shareBeforeAwl: remainder,
            });
            context.messages.push(
                `Full Sister → ${remainder.num}/${remainder.den} as ʿaṣabah maʿa l-ghayr (with female descendant)`
            );
            return shares;
        }

        // Paternal Sister as ʿaṣabah maʿa l-ghayr (only if no full sister acting as asabah)
        if (heirs.paternalSister > 0 && !context.blocked.paternalSister && heirs.fullSister === 0) {
            if (estateExhausted) {
                shares.push({
                    heir: 'paternalSister',
                    name: 'Consanguine (Paternal) Sister',
                    count: heirs.paternalSister,
                    baseShare: fraction(0, 1),
                    adjustedShare: fraction(0, 1),
                    status: 'Blocked',
                    reason: `Excluded — Estate exhausted by fixed shares`,
                    ruleId: 'RES-EXH',
                    evidence: '',
                    reference: '',
                    shareBeforeAwl: fraction(0, 1),
                });
                context.messages.push(`Paternal Sister excluded from ʿaṣabah (estate exhausted)`);
                return shares;
            }

            shares.push({
                heir: 'paternalSister',
                name: 'Consanguine (Paternal) Sister',
                count: heirs.paternalSister,
                baseShare: remainder,
                adjustedShare: remainder,
                status: 'Residuary',
                reason: `ʿAṣabah maʿa l-ghayr — Takes remainder alongside female descendant`,
                ruleId: 'RES-M-1',
                evidence: 'Ibn Masʿūd (al-Bukhārī)',
                reference: 'Reliance L7',
                shareBeforeAwl: remainder,
            });
            context.messages.push(
                `Paternal Sister → ${remainder.num}/${remainder.den} as ʿaṣabah maʿa l-ghayr`
            );
            return shares;
        }
    }

    // ─── Walk the full ʿaṣabah chain ──────────────────────────────────────────
    for (const [maleKey, femaleKey] of asabahChain) {
        const maleCount   = heirs[maleKey] || 0;
        const femaleCount = femaleKey ? (heirs[femaleKey] || 0) : 0;

        // Father and grandfather are handled differently:
        // They may already have a fixed share (1/6) and take residue on top.
        if (maleKey === 'father' || maleKey === 'paternalGrandfather') {
            const maleBlocked = context.blocked[maleKey];
            if (maleCount > 0 && !maleBlocked) {
                const existing = shares.find(s => s.heir === maleKey);
                if (existing) {
                    if (estateExhausted) {
                        existing.reason += ` (No residue remains)`;
                    } else {
                        existing.status = 'Sharer + Residuary';
                        const newTotal = addFractions(existing.adjustedShare, remainder);
                        existing.baseShare    = newTotal;
                        existing.adjustedShare = newTotal;
                        existing.reason += ` + Takes residue as ʿaṣabah`;
                        context.messages.push(`${getHeirDisplayName(maleKey)} takes residue as ʿaṣabah`);
                    }
                } else {
                    if (estateExhausted) {
                        shares.push({
                            heir: maleKey,
                            name: getHeirDisplayName(maleKey),
                            count: 1,
                            baseShare: fraction(0, 1),
                            adjustedShare: fraction(0, 1),
                            status: 'Blocked',
                            reason: `Excluded — Estate exhausted by fixed shares`,
                            ruleId: 'RES-EXH',
                            evidence: '',
                            reference: '',
                        });
                        context.messages.push(`${getHeirDisplayName(maleKey)} excluded from ʿaṣabah (estate exhausted)`);
                    } else {
                        shares.push({
                            heir: maleKey,
                            name: getHeirDisplayName(maleKey),
                            count: 1,
                            baseShare: remainder,
                            adjustedShare: remainder,
                            status: 'Residuary',
                            reason: `Pure ʿaṣabah — Takes entire remainder`,
                            ruleId: 'RES-PURE-1',
                            evidence: 'Sunnah: Alḥiqū',
                            reference: 'Al-Minhāj',
                        });
                        context.messages.push(`${getHeirDisplayName(maleKey)} takes residue as ʿaṣabah`);
                    }
                }
                return shares;
            }
            continue;
        }

        const maleBlocked   = context.blocked[maleKey];
        const femaleBlocked = femaleKey ? context.blocked[femaleKey] : true;

        const activeMale   = maleCount   > 0 && !maleBlocked;
        const activeFemale = femaleCount > 0 && !femaleBlocked;

        if (!activeMale && !activeFemale) continue;

        // ── ʿAṣabah bi-l-ghayr: male + female (2:1) ──────────────────────────
        if (activeMale && activeFemale) {
            if (estateExhausted) {
                shares.push({
                    heir: maleKey,
                    name: getHeirDisplayName(maleKey),
                    count: maleCount,
                    baseShare: fraction(0, 1),
                    adjustedShare: fraction(0, 1),
                    status: 'Blocked',
                    reason: `Excluded — Estate exhausted by fixed shares`,
                    ruleId: 'RES-EXH',
                    evidence: '',
                    reference: '',
                });
                shares.push({
                    heir: femaleKey,
                    name: getHeirDisplayName(femaleKey),
                    count: femaleCount,
                    baseShare: fraction(0, 1),
                    adjustedShare: fraction(0, 1),
                    status: 'Blocked',
                    reason: `Excluded — Estate exhausted by fixed shares`,
                    ruleId: 'RES-EXH',
                    evidence: '',
                    reference: '',
                });
                context.messages.push(`${getHeirDisplayName(maleKey)} + ${getHeirDisplayName(femaleKey)} excluded (estate exhausted)`);
                return shares;
            }

            const maleUnits   = maleCount * 2;
            const femaleUnits = femaleCount;
            const totalUnits  = maleUnits + femaleUnits;

            const maleShare   = multiplyFractions(remainder, fraction(maleUnits,   totalUnits));
            const femaleShare = multiplyFractions(remainder, fraction(femaleUnits, totalUnits));

            shares.push({
                heir: maleKey,
                name: getHeirDisplayName(maleKey),
                count: maleCount,
                baseShare: maleShare,
                adjustedShare: maleShare,
                status: 'Residuary',
                reason: `ʿAṣabah bi-l-ghayr — Takes remainder at 2:1 (male/female) ratio`,
                ruleId: 'RES-BG-1',
                evidence: 'Qurʾān 4:11 / 4:176',
                reference: 'Al-Minhāj',
            });
            shares.push({
                heir: femaleKey,
                name: getHeirDisplayName(femaleKey),
                count: femaleCount,
                baseShare: femaleShare,
                adjustedShare: femaleShare,
                status: 'Residuary',
                reason: `ʿAṣabah bi-l-ghayr — Takes remainder at 2:1 (male/female) ratio`,
                ruleId: 'RES-BG-1',
                evidence: 'Qurʾān 4:11 / 4:176',
                reference: 'Al-Minhāj',
            });
            context.messages.push(
                `${getHeirDisplayName(maleKey)} + ${getHeirDisplayName(femaleKey)} → ` +
                `${maleShare.num}/${maleShare.den} + ${femaleShare.num}/${femaleShare.den} (2:1 ʿaṣabah)`
            );
            return shares;
        }

        // ── ʿAṣabah bi-nafsihī: male only ────────────────────────────────────
        if (activeMale) {
            if (estateExhausted) {
                shares.push({
                    heir: maleKey,
                    name: getHeirDisplayName(maleKey),
                    count: maleCount,
                    baseShare: fraction(0, 1),
                    adjustedShare: fraction(0, 1),
                    status: 'Blocked',
                    reason: `Excluded — Estate exhausted by fixed shares`,
                    ruleId: 'RES-EXH',
                    evidence: '',
                    reference: '',
                });
                context.messages.push(`${getHeirDisplayName(maleKey)} excluded (estate exhausted)`);
                return shares;
            }

            shares.push({
                heir: maleKey,
                name: getHeirDisplayName(maleKey),
                count: maleCount,
                baseShare: remainder,
                adjustedShare: remainder,
                status: 'Residuary',
                reason: `ʿAṣabah bi-nafsihī — Takes entire remainder`,
                ruleId: 'RES-BN-1',
                evidence: 'Sunnah: Alḥiqū',
                reference: 'Al-Minhāj',
            });
            context.messages.push(
                `${getHeirDisplayName(maleKey)} → ${remainder.num}/${remainder.den} (sole ʿaṣabah)`
            );
            return shares;
        }

        // ── Female with no male counterpart — usually fixed share, not asabah ─
        // Skip females without male counterparts here (handled in fixedShares)
    }

    return shares;
}
