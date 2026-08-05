/**
 * grandfather.js — Shāfiʿī sample cases involving Paternal Grandfather & Siblings.
 */

export const grandfatherCases = [
    {
        id: 'shafii-gf-001',
        madhhab: 'shafii',
        title: 'Grandfather + 1 Full Brother',
        description: 'Deceased leaves paternal grandfather and 1 full brother.',
        category: 'grandfather',
        tags: ['paternalGrandfather', 'fullBrother'],
        heirs: { paternalGrandfather: 1, fullBrother: 1 },
        expectedOutcome: 'Paternal Grandfather → 1/2 | Full Brother → 1/2 (Muqāsamah)',
        teachingNote: 'Under Shāfiʿī Fiqh, grandfather does not block brothers; he shares residue equally via Muqāsamah.'
    },
    {
        id: 'shafii-gf-002',
        madhhab: 'shafii',
        title: 'Akdariyyah Case (Husband + Mother + Grandfather + Sister)',
        description: 'Famous Akdariyyah exception in Shāfiʿī inheritance law.',
        category: 'special',
        tags: ['husband', 'mother', 'paternalGrandfather', 'fullSister'],
        heirs: { husband: 1, mother: 1, paternalGrandfather: 1, fullSister: 1 },
        expectedOutcome: 'Husband → 9/27 | Mother → 6/27 | Grandfather → 8/27 | Sister → 4/27',
        teachingNote: 'The Akdariyyah is the sole exception where sister is given fixed share alongside grandfather, then recalculated.'
    }
];
