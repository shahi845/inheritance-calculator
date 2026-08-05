import { fraction, addFractions } from '../../utils/fractions.js';

export function isMalikiMushtarikah(heirs, context) {
    const hasMotherOrGm =
        heirs.mother === 1 ||
        (heirs.maternalGrandmother > 0 && !context.blocked.maternalGrandmother) ||
        (heirs.paternalGrandmother > 0 && !context.blocked.paternalGrandmother);

    return (
        heirs.husband === 1 &&
        hasMotherOrGm &&
        heirs.father === 0 && heirs.paternalGrandfather === 0 &&
        heirs.son === 0 && heirs.daughter === 0 &&
        heirs.sonsSon === 0 && heirs.sonsDaughter === 0 &&
        (heirs.maternalBrother + heirs.maternalSister) >= 2 &&
        heirs.fullBrother > 0
    );
}

export function applyMalikiMushtarikah(heirs, context) {
    context.musharrakahApplied = true;
    context.messages.push(
        "Al-Mushtarikah (Ḥimāriyyah) exception applied: Full siblings join maternal " +
        "siblings in sharing the 1/3 pool equally per capita (Mālikī madhhab)."
    );

    let shares = [];
    let sumFractions = fraction(0, 1);

    // Husband → 1/2
    shares.push({
        heir: 'husband',
        name: 'Husband',
        count: 1,
        baseShare: fraction(1, 2),
        adjustedShare: fraction(1, 2),
        status: 'Sharer',
        reason: '1/2 — No descendants (Qurʾān 4:12)',
        shareBeforeAwl: fraction(1, 2)
    });
    sumFractions = addFractions(sumFractions, fraction(1, 2));

    // Mother or Grandmother → 1/6
    if (heirs.mother === 1) {
        shares.push({
            heir: 'mother',
            name: 'Mother',
            count: 1,
            baseShare: fraction(1, 6),
            adjustedShare: fraction(1, 6),
            status: 'Sharer',
            reason: '1/6 — Multiple siblings present (Qurʾān 4:11)',
            shareBeforeAwl: fraction(1, 6)
        });
        sumFractions = addFractions(sumFractions, fraction(1, 6));
    } else {
        const mgCount = heirs.maternalGrandmother > 0 && !context.blocked.maternalGrandmother ? 1 : 0;
        const pgCount = heirs.paternalGrandmother > 0 && !context.blocked.paternalGrandmother ? 1 : 0;
        const gmCount = mgCount + pgCount;
        if (heirs.maternalGrandmother > 0 && !context.blocked.maternalGrandmother) {
            shares.push({
                heir: 'maternalGrandmother',
                name: 'Maternal Grandmother',
                count: 1,
                baseShare: fraction(1, 6 * gmCount),
                adjustedShare: fraction(1, 6 * gmCount),
                status: 'Sharer',
                reason: '1/6 shared — Al-Mushtarikah',
                shareBeforeAwl: fraction(1, 6 * gmCount)
            });
        }
        if (heirs.paternalGrandmother > 0 && !context.blocked.paternalGrandmother) {
            shares.push({
                heir: 'paternalGrandmother',
                name: 'Paternal Grandmother',
                count: 1,
                baseShare: fraction(1, 6 * gmCount),
                adjustedShare: fraction(1, 6 * gmCount),
                status: 'Sharer',
                reason: '1/6 shared — Al-Mushtarikah',
                shareBeforeAwl: fraction(1, 6 * gmCount)
            });
        }
        sumFractions = addFractions(sumFractions, fraction(1, 6));
    }

    // Mushtarikah pool: 1/3 shared equally per capita among ALL uterine + full siblings
    const mbCount = heirs.maternalBrother || 0;
    const msCount = heirs.maternalSister  || 0;
    const fbCount = heirs.fullBrother     || 0;
    const fsCount = heirs.fullSister      || 0;
    const totalPoolCount = mbCount + msCount + fbCount + fsCount;

    const addPoolShare = (key, name, count) => {
        if (count <= 0) return;
        const sh = fraction(count, 3 * totalPoolCount);
        shares.push({
            heir: key,
            name,
            count,
            baseShare: sh,
            adjustedShare: sh,
            status: 'Sharer',
            reason: `Shares 1/3 pool equally per capita under Al-Mushtarikah (Mālikī madhhab)`,
            shareBeforeAwl: sh
        });
        sumFractions = addFractions(sumFractions, sh);
        context.messages.push(`${name} → ${sh.num}/${sh.den} (Mushtarikah pool)`);
    };

    addPoolShare('maternalBrother', 'Uterine (Maternal) Brother', mbCount);
    addPoolShare('maternalSister',  'Uterine (Maternal) Sister',  msCount);
    addPoolShare('fullBrother',     'Full Brother',                fbCount);
    addPoolShare('fullSister',      'Full Sister',                 fsCount);

    return { shares, sumFractions };
}
