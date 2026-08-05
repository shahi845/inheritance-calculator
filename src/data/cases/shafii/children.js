/**
 * children.js — Shāfiʿī sample cases involving sons, daughters, and grandchildren.
 */

export const childrenCases = [
    {
        id: 'shafii-children-001',
        madhhab: 'shafii',
        title: 'Son + Daughter',
        description: 'A man dies leaving one son and one daughter.',
        category: 'basic',
        tags: ['son', 'daughter'],
        heirs: { son: 1, daughter: 1 },
        expectedOutcome: 'Son → 2/3 (residue) | Daughter → 1/3 (residue, 2:1 ratio)',
        teachingNote: 'Son and daughter inherit together as residuaries in a 2:1 male-to-female ratio.'
    },
    {
        id: 'shafii-children-002',
        madhhab: 'shafii',
        title: 'Daughter + Son\'s Daughter (Granddaughter)',
        description: 'Deceased leaves 1 daughter and 1 son\'s daughter.',
        category: 'basic',
        tags: ['daughter', 'sonsDaughter'],
        heirs: { daughter: 1, sonsDaughter: 1 },
        expectedOutcome: 'Daughter → 1/2 | Son\'s Daughter → 1/6 (completing 2/3)',
        teachingNote: 'Son\'s daughter takes 1/6 to complete the prescribed 2/3 maximum female descendant allocation.'
    }
];
