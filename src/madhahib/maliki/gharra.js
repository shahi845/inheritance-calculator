import { fraction } from '../../utils/fractions.js';

export function isMalikiGharra(heirs, context) {
    return (
        heirs.husband === 1 &&
        heirs.mother === 1 &&
        heirs.paternalGrandfather === 1 &&
        !context.blocked.paternalGrandfather &&
        heirs.father === 0 &&
        heirs.son === 0 && heirs.daughter === 0 &&
        heirs.sonsSon === 0 && heirs.sonsDaughter === 0 &&
        ((heirs.fullSister === 1 && heirs.paternalSister === 0 && heirs.fullBrother === 0 && heirs.paternalBrother === 0) ||
         (heirs.paternalSister === 1 && heirs.fullSister === 0 && heirs.fullBrother === 0 && heirs.paternalBrother === 0))
    );
}

export function applyMalikiGharra(heirs, context) {
    context.messages.push(
        "Al-Gharrāʾ case detected (Husband + Mother + Paternal Grandfather + 1 Sister). " +
        "Mālikī ruling: Grandfather and sister merge and redistribute 2:1."
    );

    const sisterKey = heirs.fullSister === 1 ? 'fullSister' : 'paternalSister';
    const sisterName = heirs.fullSister === 1 ? 'Full Sister' : 'Consanguine (Paternal) Sister';

    const shares = [
        {
            heir: 'husband',
            name: 'Husband',
            count: 1,
            baseShare: fraction(1, 2),
            adjustedShare: fraction(9, 27),
            status: 'Sharer',
            reason: '9/27 after ʿawl — Al-Gharrāʾ case (Qurʾān 4:12)',
            shareBeforeAwl: fraction(1, 2),
        },
        {
            heir: 'mother',
            name: 'Mother',
            count: 1,
            baseShare: fraction(1, 3),
            adjustedShare: fraction(6, 27),
            status: 'Sharer',
            reason: '6/27 after ʿawl — Al-Gharrāʾ case (Qurʾān 4:11)',
            shareBeforeAwl: fraction(1, 3),
        },
        {
            heir: 'paternalGrandfather',
            name: 'Paternal Grandfather',
            count: 1,
            baseShare: fraction(8, 27),
            adjustedShare: fraction(8, 27),
            status: 'Sharer + Residuary',
            reason: '8/27 — Al-Gharrāʾ: grandfather merges with sister, takes 2/3 of combined share (2:1 ratio)',
            shareBeforeAwl: null,
        },
        {
            heir: sisterKey,
            name: sisterName,
            count: 1,
            baseShare: fraction(4, 27),
            adjustedShare: fraction(4, 27),
            status: 'Sharer',
            reason: `4/27 — Al-Gharrāʾ: sister merges with grandfather, takes 1/3 of combined share (2:1 ratio)`,
            shareBeforeAwl: fraction(1, 2),
        },
    ];

    context.awlApplied = true;
    context.messages.push("ʿAwl applied: denominator raised to 27 (Al-Gharrāʾ).");
    return { shares, sumFractions: fraction(1, 1) };
}
