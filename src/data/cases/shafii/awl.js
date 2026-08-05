/**
 * awl.js — Shāfiʿī sample cases involving proportional reduction (ʿAwl).
 */

export const awlCases = [
    {
        id: 'shafii-awl-001',
        madhhab: 'shafii',
        title: 'Husband + 2 Full Sisters + Mother (Awl 6 to 7)',
        description: 'A woman dies leaving her husband, 2 full sisters, and mother.',
        category: 'awl',
        tags: ['husband', 'fullSister', 'mother'],
        heirs: { husband: 1, fullSister: 2, mother: 1 },
        expectedOutcome: 'Husband → 3/7 | 2 Sisters → 4/7 (2/7 each) | Mother → 1/7 (Awl from 6 to 8)',
        teachingNote: 'Fixed shares total 3/6 + 4/6 + 1/6 = 8/6. Base denominator increases from 6 to 8.'
    },
    {
        id: 'shafii-awl-002',
        madhhab: 'shafii',
        title: 'Husband + 2 Daughters + Mother + Father (Awl 12 to 15)',
        description: 'Deceased leaves husband, 2 daughters, mother, and father.',
        category: 'awl',
        tags: ['husband', 'daughter', 'mother', 'father'],
        heirs: { husband: 1, daughter: 2, mother: 1, father: 1 },
        expectedOutcome: 'Husband → 3/15 | 2 Daughters → 8/15 | Mother → 2/15 | Father → 2/15',
        teachingNote: 'Fractions total 3/12 + 8/12 + 2/12 + 2/12 = 15/12. Base expands to 15.'
    }
];
