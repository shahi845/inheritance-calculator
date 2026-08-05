/**
 * parents.js — Shāfiʿī sample cases involving parents and grand-parents.
 */

export const parentsCases = [
    {
        id: 'shafii-parents-001',
        madhhab: 'shafii',
        title: 'Father + Mother + 2 Sons',
        description: 'Deceased leaves father, mother, and two sons.',
        category: 'basic',
        tags: ['father', 'mother', 'son'],
        heirs: { father: 1, mother: 1, son: 2 },
        expectedOutcome: 'Father → 1/6 | Mother → 1/6 | 2 Sons → 4/6 (residue)',
        teachingNote: 'Presence of male descendants limits both father and mother to 1/6 fixed share each.'
    },
    {
        id: 'shafii-parents-002',
        madhhab: 'shafii',
        title: 'Mother + Paternal Grandmother',
        description: 'Deceased leaves mother and paternal grandmother.',
        category: 'blocking',
        tags: ['mother', 'paternalGrandmother'],
        heirs: { mother: 1, paternalGrandmother: 1 },
        expectedOutcome: 'Mother → 1/3 (or 100% with Radd) | Paternal Grandmother → 0% (Blocked)',
        teachingNote: 'The mother blocks all grandmothers (both maternal and paternal).'
    }
];
