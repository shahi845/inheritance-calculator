/**
 * hanbaliCases.js — Curated Ḥanbalī sample cases for the learning platform.
 */

export const hanbaliCases = [
    {
        id: 'hanbali-001',
        madhhab: 'hanbali',
        title: 'Wife + Son + Father',
        description: 'A man dies leaving his wife, one son, and his father.',
        category: 'basic',
        tags: ['wife', 'son', 'father'],
        heirs: { wife: 1, son: 1, father: 1 },
        expectedOutcome: 'Wife → 1/8 | Father → 1/6 | Son → Residue',
        teachingNote: 'Agreed across all 4 Sunni madhhabs.'
    },
    {
        id: 'hanbali-002',
        madhhab: 'hanbali',
        title: 'Grandfather + Brother (Ḥanbalī View)',
        description: 'A man dies leaving a paternal grandfather and one full brother.',
        category: 'grandfather',
        tags: ['paternalGrandfather', 'fullBrother'],
        heirs: { paternalGrandfather: 1, fullBrother: 1 },
        expectedOutcome: 'Grandfather → 1/2 | Brother → 1/2 (Muqāsamah)',
        teachingNote: 'Ḥanbalī school agrees with Shāfiʿī and Mālikī that grandfather shares with brothers via Muqāsamah or 1/3 fixed share.'
    },
    {
        id: 'hanbali-003',
        madhhab: 'hanbali',
        title: 'Rejection of Mushtarikah',
        description: 'Husband + Mother + 2 Maternal Brothers + 1 Full Brother in Ḥanbalī.',
        category: 'special',
        tags: ['husband', 'mother', 'maternalBrother', 'fullBrother'],
        heirs: { husband: 1, mother: 1, maternalBrother: 2, fullBrother: 1 },
        expectedOutcome: 'Husband → 1/2 | Mother → 1/6 | Maternal Brothers → 1/3 | Full Brother → 0',
        teachingNote: 'CRITICAL ḤANBALĪ DIFFERENCE: Imām Aḥmad rejected the Mushtarikah exception. The full brother inherits as ʿaṣabah; since 1/2 + 1/6 + 1/3 = 100%, 0 remains for ʿaṣabah.'
    },
    {
        id: 'hanbali-004',
        madhhab: 'hanbali',
        title: 'Radd to Blood Heirs',
        description: 'Mother + 1 Daughter in Ḥanbalī Madhhab.',
        category: 'radd',
        tags: ['mother', 'daughter'],
        heirs: { mother: 1, daughter: 1 },
        expectedOutcome: 'Daughter → 3/4 | Mother → 1/4 (Radd applied proportionally)',
        teachingNote: 'Ḥanbalī school applies Radd to blood sharers, similar to Ḥanafī.'
    }
];
