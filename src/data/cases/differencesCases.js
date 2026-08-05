/**
 * differencesCases.js — Comparative cases highlighting madhhab differences.
 */

export const differencesCases = [
    {
        id: 'diff-001',
        madhhab: 'jumhur',
        title: 'Grandfather + 1 Full Brother',
        description: 'Compare how the 4 Sunni madhhabs treat Grandfather alongside a Full Brother.',
        category: 'grandfather',
        tags: ['paternalGrandfather', 'fullBrother'],
        heirs: { paternalGrandfather: 1, fullBrother: 1 },
        expectedOutcome: 'Shāfiʿī / Mālikī / Ḥanbalī: 50/50 split | Ḥanafī: Grandfather 100%, Brother 0%',
        teachingNote: 'Highlighting Ḥanafī isolation on Grandfather blocking siblings vs Jumhūr Muqāsamah.'
    },
    {
        id: 'diff-002',
        madhhab: 'jumhur',
        title: 'The Mushtarikah Case',
        description: 'Husband + Mother + 2 Maternal Brothers + 1 Full Brother.',
        category: 'special',
        tags: ['husband', 'mother', 'maternalBrother', 'fullBrother'],
        heirs: { husband: 1, mother: 1, maternalBrother: 2, fullBrother: 1 },
        expectedOutcome: 'Shāfiʿī / Mālikī: Full brother shares 1/3 with maternal brothers | Ḥanafī / Ḥanbalī: Full brother gets 0',
        teachingNote: 'Demonstrates juristic disagreement on whether full brothers can share in the maternal 1/3.'
    },
    {
        id: 'diff-003',
        madhhab: 'jumhur',
        title: 'Radd with Surplus',
        description: 'Mother + 1 Daughter (Surplus 1/3 remaining).',
        category: 'radd',
        tags: ['mother', 'daughter'],
        heirs: { mother: 1, daughter: 1 },
        expectedOutcome: 'Ḥanafī / Ḥanbalī / Modern Mālikī: Radd to heirs (3/4 & 1/4) | Classical Shāfiʿī: Surplus to Bayt al-Māl',
        teachingNote: 'Shows classical vs modern application of Radd.'
    }
];
