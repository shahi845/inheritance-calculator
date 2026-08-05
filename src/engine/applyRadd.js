import {
    fraction,
    addFractions,
    subtractFractions,
    multiplyFractions,
    divideFractions,
    compareFractions
} from '../utils/fractions.js';
/**
 * Applies Radd (return of surplus) when fixed shares < estate and no ʿaṣabah.
 *
 * Shāfiʿī position (Reliance of the Traveller L9):
 *   - Surplus goes to Bayt al-Māl (public treasury) by default.
 *   - Spouse NEVER receives radd.
 *   - If no functional Bayt al-Māl, the surplus is returned to blood sharers proportionally.
 *
 * context.raddMode controls this:
 *   'baytulMal'     — classical Shāfiʿī: surplus → Bayt al-Māl
 *   'returnToHeirs' — modern/Ḥanafī-style: surplus → blood sharers proportionally
 *
 * Ḥanafī position (for use by Ḥanafī engine):
 *   - Blood sharers always receive radd proportionally.
 *   - Spouse excluded from radd when other heir exists.
 *   - Spouse alone: configurable (classical Sirājiyyah = Bayt al-Māl; modern = spouse gets all).
 */
export function applyRadd(shares, sumFractions, context) {
    if (compareFractions(sumFractions, fraction(1, 1)) >= 0) {
        return shares; // No surplus
    }

    const remainder = subtractFractions(fraction(1, 1), sumFractions);
    if (remainder.num <= 0) return shares;

    const spouseKeys = ['husband', 'wife'];
    const bloodShares = shares.filter(s => !spouseKeys.includes(s.heir) && s.status !== 'Blocked');
    const spouseShares = shares.filter(s => spouseKeys.includes(s.heir) && s.status !== 'Blocked');

    // ── Mode: Bayt al-Māl (Shāfiʿī classical) ────────────────────────────────
    if (context.raddMode === 'baytulMal') {
        if (bloodShares.length > 0) {
            // Return to blood sharers proportionally (common modern Shāfiʿī practice
            // when Bayt al-Māl is non-functional)
            context.messages.push(
                `Radd: Surplus ${remainder.num}/${remainder.den} returned to blood sharers ` +
                `(Shāfiʿī: Bayt al-Māl mode, but returning proportionally as modern practice)`
            );
            return distributeRaddProportionally(shares, bloodShares, remainder, context);
        } else {
            // Only spouse(s) — surplus → Bayt al-Māl
            context.raddApplied = true;
            context.messages.push(
                `Radd: Surplus ${remainder.num}/${remainder.den} goes to Bayt al-Māl ` +
                `(Shāfiʿī: spouse does not receive radd while no blood sharer exists).`
            );
            shares.push({
                heir: 'baytAlMal',
                name: "Bayt al-Māl (Public Treasury)",
                count: 1,
                baseShare: remainder,
                adjustedShare: remainder,
                status: 'Bayt al-Māl',
                reason: "Surplus returned to Bayt al-Māl — no blood sharers eligible for radd (Shāfiʿī madhhab)",
            });
            return shares;
        }
    }

    // ── Mode: Return to Heirs (Ḥanafī / modern default) ──────────────────────
    context.raddApplied = true;

    if (bloodShares.length > 0) {
        context.messages.push(
            `Radd: Surplus ${remainder.num}/${remainder.den} returned proportionally to blood sharers.`
        );
        return distributeRaddProportionally(shares, bloodShares, remainder, context);
    }

    // Only spouse(s), no blood sharers
    if (spouseShares.length > 0) {
        // Ḥanafī: spouse alone can receive whole estate in modern practice
        context.messages.push(
            `Radd: Spouse is sole heir. Surplus ${remainder.num}/${remainder.den} ` +
            `returned to spouse (modern practice — configure raddMode for classical Bayt al-Māl).`
        );
        for (const s of spouseShares) {
            const newTotal = addFractions(s.adjustedShare, remainder);
            s.adjustedShare = newTotal;
            s.baseShare = newTotal;
            s.status = 'Sharer + Radd';
            s.reason += ' + Entire estate (sole heir, radd)';
        }
    }

    return shares;
}

// ─── Helper: distribute surplus proportionally to blood sharers ───────────────
function distributeRaddProportionally(shares, bloodShares, remainder, context) {
    context.raddApplied = true;

    const totalBloodShare = bloodShares.reduce(
        (sum, s) => addFractions(sum, s.adjustedShare),
        fraction(0, 1)
    );

    if (compareFractions(totalBloodShare, fraction(0, 1)) <= 0) {
        return shares;
    }

    for (const s of bloodShares) {
        const ratio = divideFractions(s.adjustedShare, totalBloodShare);
        const raddPortion = multiplyFractions(remainder, ratio);
        const newTotal = addFractions(s.adjustedShare, raddPortion);

        s.adjustedShare = newTotal;
        s.baseShare = newTotal;
        s.status = s.status === 'Sharer'
            ? 'Sharer + Radd'
            : `${s.status} + Radd`;

        s.reason += ' + Radd';
    }

    return shares;
}