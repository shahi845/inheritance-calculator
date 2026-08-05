/**
 * Ḥanafī Dhawū al-Arḥām (Distant Kindred) — 4-Class System
 *
 * This module is the canonical implementation of the 4-class Ḥanafī
 * distant-kindred (Dhawū al-Arḥām) priority system, based on the
 * Sirājiyyah and Mulla's Digest.
 *
 * It is imported and reused by:
 *   - src/madhahib/hanafi/calculateHanafi.js   (primary Ḥanafī engine)
 *   - src/madhahib/hanbali/dhawilArham.js      (Ḥanbalī Tanzīl fallback)
 *   - src/engine/assignDistantKindred.js        (Shāfiʿī modern-fallback mode)
 *
 * Class Priority:
 *   Class 1 — Descendants of the deceased not already covered (daughter's children)
 *   Class 2 — Ascendants not already covered (maternal grandfather)
 *   Class 3 — Descendants of parents (sister's/brother's children, etc.)
 *   Class 4 — Descendants of grandparents (aunts, uncles, etc.)
 *
 * Distribution within a class: per-capita (equal heads).
 *
 * Sources: Sirājiyyah (al-Sajawindī), IIUM Fara'id notes
 */

import { fraction } from '../../utils/fractions.js';
import { getHeirDisplayName } from '../../utils/formatResults.js';

// ─── Helpers (local) ──────────────────────────────────────────────────────────
function _makeShare(heir, name, count, frac, reason, status = 'Dhawu al-Arham') {
    return { heir, name, count, baseShare: frac, adjustedShare: frac, status, reason, shareBeforeAwl: frac };
}

/**
 * Distributes remainder among a set of Dhawū al-Arḥām heirs.
 * Males who are in a paired male/female role receive 2× the share of females (2:1 rule).
 * Standalone types (e.g. uterineSiblingChildren) are treated as single units.
 *
 * @param {string[]} maleKeys   - Keys of male heirs in this distribution group
 * @param {string[]} femaleKeys - Keys of female heirs (each male-female pair shares 2:1)
 * @param {string[]} neutralKeys - Keys of heirs with no gendered pairing (count as 1 unit each)
 */
function _distributeToDhawuGendered(shares, heirs, maleKeys, femaleKeys, neutralKeys, remainder, context, className) {
    // Calculate total units: males = 2 per head, females = 1 per head, neutral = 1 per head
    let totalUnits = 0;
    for (const k of maleKeys)   totalUnits += (heirs[k] || 0) * 2;
    for (const k of femaleKeys) totalUnits += (heirs[k] || 0) * 1;
    for (const k of neutralKeys) totalUnits += (heirs[k] || 0) * 1;

    if (totalUnits === 0) return shares;

    const pushShare = (k, units) => {
        const count = heirs[k] || 0;
        if (count === 0) return;
        const sh = fraction(remainder.num * units, remainder.den * totalUnits);
        shares.push(_makeShare(k, getHeirDisplayName(k), count, sh,
            `Dhawu al-Arḥām ${className} — gendered distribution (Ḥanafī 2:1)`));
        context.messages.push(`${getHeirDisplayName(k)} → ${sh.num}/${sh.den} (Dhawu al-Arḥām ${className})`);
    };

    for (const k of maleKeys)    pushShare(k, (heirs[k] || 0) * 2);
    for (const k of femaleKeys)  pushShare(k, (heirs[k] || 0) * 1);
    for (const k of neutralKeys) pushShare(k, (heirs[k] || 0) * 1);

    return shares;
}

function _distributeToDhawu(shares, heirs, keys, remainder, context, className) {
    const totalHeads = keys.reduce((s, k) => s + heirs[k], 0);
    for (const k of keys) {
        const count = heirs[k];
        const sh = fraction(remainder.num * count, remainder.den * totalHeads);
        shares.push(_makeShare(
            k,
            getHeirDisplayName(k),
            count,
            sh,
            `Dhawu al-Arḥām ${className} — per-capita distribution (Ḥanafī)`
        ));
        context.messages.push(
            `${getHeirDisplayName(k)} → ${sh.num}/${sh.den} (Dhawu al-Arḥām ${className})`
        );
    }
    return shares;
}

// ─── Main export ──────────────────────────────────────────────────────────────
/**
 * Assigns shares from the remainder to Dhawū al-Arḥām heirs using the
 * Ḥanafī 4-class priority system with gendered (2:1) distribution.
 *
 * Within each class, males receive double the share of females (Tanzīl principle).
 * In Class 4, paternal-side descendants represent a male ancestor (2 units per head)
 * and maternal-side descendants represent a female ancestor (1 unit per head).
 *
 * @param {Array}   shares    - Existing shares array (will be mutated)
 * @param {Object}  heirs     - Normalized heirs object
 * @param {Object}  remainder - Fraction representing undistributed remainder
 * @param {Object}  context   - Engine context (messages, blocked, etc.)
 * @returns {Array} Updated shares array
 */
export function _assignHanafiDhawuAlArham(shares, heirs, remainder, context) {
    context.messages.push(
        `Dhawu al-Arḥām: No primary heirs or residuaries. Distributing ${remainder.num}/${remainder.den} to distant kindred.`
    );

    const active = k => (heirs[k] || 0) > 0 && !context.blocked[k];

    // ── Class 1: Descendants of deceased not covered by sharers/residuaries ─────
    // daughtersSon (male, 2:1) and daughtersDaughter (female, 1:1)
    const hasDaughtersSon = active('daughtersSon');
    const hasDaughtersDaughter = active('daughtersDaughter');
    if (hasDaughtersSon || hasDaughtersDaughter) {
        return _distributeToDhawuGendered(
            shares, heirs,
            hasDaughtersSon       ? ['daughtersSon']       : [],
            hasDaughtersDaughter  ? ['daughtersDaughter']  : [],
            [],
            remainder, context, 'Class 1'
        );
    }

    // ── Class 2: Ascendants not covered (maternal grandfather) ──────────────────
    if (active('maternalGrandfather')) {
        shares.push(_makeShare(
            'maternalGrandfather',
            'Maternal Grandfather',
            1,
            remainder,
            'Dhawu al-Arḥām Class 2 — Maternal ascendant (Ḥanafī)'
        ));
        context.messages.push(
            `Maternal Grandfather → ${remainder.num}/${remainder.den} (Dhawu al-Arḥām)`
        );
        return shares;
    }

    // ── Class 3: Descendants of parents ──────────────────────────────────────────
    // sistersSon (male, 2:1), sistersDaughter (female, 1:1), uterineSiblingChildren (neutral, 1:1)
    const hasSistersSon  = active('sistersSon');
    const hasSistersDaughter = active('sistersDaughter');
    const hasUterineSiblingChildren = active('uterineSiblingChildren');
    if (hasSistersSon || hasSistersDaughter || hasUterineSiblingChildren) {
        return _distributeToDhawuGendered(
            shares, heirs,
            hasSistersSon             ? ['sistersSon']             : [],
            hasSistersDaughter        ? ['sistersDaughter']        : [],
            hasUterineSiblingChildren ? ['uterineSiblingChildren'] : [],
            remainder, context, 'Class 3'
        );
    }

    // ── Class 4: Descendants of grandparents ──────────────────────────────────────
    // Sub-groups (Tanzīl approach):
    //   Paternal-side: paternalAunt → represents paternal grandfather (male ancestor = 2 units)
    //   Maternal-side: maternalUncle (2 units within group), maternalAunt (1 unit within group)
    //                  → both represent maternal grandmother (female ancestor = 1 unit)
    // Between groups: paternal side : maternal side = 2 : 1
    const hasPaternalAunt  = active('paternalAunt');
    const hasMatUncle      = active('maternalUncle');
    const hasMatAunt       = active('maternalAunt');
    const hasOtherDistant  = active('otherDistantRelatives');

    if (hasPaternalAunt || hasMatUncle || hasMatAunt || hasOtherDistant) {
        // Paternal-side total units (2 per head, representing male ancestor)
        const paternalUnits = (heirs.paternalAunt || 0) * 2;
        // Maternal-side: uncle is male (2x within group), aunt is female (1x within group)
        const maternalRawUnits = (heirs.maternalUncle || 0) * 2 + (heirs.maternalAunt || 0) * 1;
        // Other distant relatives treated as single neutral units
        const otherUnits = heirs.otherDistantRelatives || 0;

        // If we have both paternal and maternal kin, scale groups by 2:1 (paternal : maternal)
        // Total = paternalUnits * 3 + maternalRawUnits * 1 ... actually simplest:
        // - paternal group "size" = 2 (as it represents male ancestor)
        // - maternal group "size" = 1 (as it represents female ancestor)
        // Scale each sub-unit within maternal group by (1/maternalGroupShare)
        // Final unit counts: paternal each = 2 * (2) = 4? No — let me use direct calculation.

        // Total estate units:
        //   If only paternal: distribute by head among them (all get equal share)
        //   If only maternal: distribute 2:1 among uncle/aunt
        //   If both: paternal group gets 2/3, maternal group gets 1/3
        //   Other distant: per-capita within remaining

        const hasPat = hasPaternalAunt;
        const hasMat = hasMatUncle || hasMatAunt;
        const hasOth = hasOtherDistant;

        if (!hasPat && !hasMat && hasOth) {
            // Only other distant — per capita
            return _distributeToDhawu(shares, heirs, ['otherDistantRelatives'], remainder, context, 'Class 4');
        }

        if (hasPat && !hasMat) {
            // Only paternal — all get equal share per head
            return _distributeToDhawu(shares, heirs, ['paternalAunt'], remainder, context, 'Class 4');
        }

        if (!hasPat && hasMat) {
            // Only maternal — 2:1 uncle:aunt distribution
            return _distributeToDhawuGendered(
                shares, heirs,
                hasMatUncle ? ['maternalUncle'] : [],
                hasMatAunt  ? ['maternalAunt']  : [],
                [],
                remainder, context, 'Class 4'
            );
        }

        // Both paternal and maternal present:
        // Paternal group gets 2/3, maternal group gets 1/3
        // (Tanzīl: paternal side represents a male ancestor, maternal a female ancestor — 2:1)

        // Scale remainder fractions: paternal=2/3, maternal=1/3
        const patRemainder = { num: remainder.num * 2, den: remainder.den * 3 };
        const matRemainder = { num: remainder.num * 1, den: remainder.den * 3 };

        // Distribute paternal share equally among paternalAunt
        const paternalCount = heirs.paternalAunt || 0;
        if (paternalCount > 0) {
            const sh = fraction(patRemainder.num, patRemainder.den * paternalCount);
            shares.push(_makeShare('paternalAunt', getHeirDisplayName('paternalAunt'), paternalCount, sh,
                'Dhawu al-Arḥām Class 4 (paternal side, 2/3 group) — Tanzīl (Ḥanafī)'));
            context.messages.push(`Paternal Aunt → ${sh.num}/${sh.den} (Dhawu al-Arḥām Class 4)`);
        }

        // Distribute maternal 1/3 with 2:1 among uncle/aunt
        _distributeToDhawuGendered(
            shares, heirs,
            hasMatUncle ? ['maternalUncle'] : [],
            hasMatAunt  ? ['maternalAunt']  : [],
            [],
            matRemainder, context, 'Class 4'
        );

        return shares;
    }

    // No dhawu al-arḥām found → Bayt al-Māl
    context.messages.push('No Dhawu al-Arḥām found. Surplus → Bayt al-Māl.');
    shares.push(_makeShare(
        'baytAlMal',
        'Bayt al-Māl (Public Treasury)',
        1,
        remainder,
        'No heirs at all — estate goes to public treasury',
        'Bayt al-Māl'
    ));
    return shares;
}
