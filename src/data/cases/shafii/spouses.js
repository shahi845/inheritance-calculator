/**
 * spouses.js — Shāfiʿī sample cases involving husband and wife.
 */

export const spousesCases = [
    {
        id: 'shafii-spouses-001',
        madhhab: 'shafii',
        title: 'Husband + Mother + Father',
        description: 'A woman dies leaving her husband, mother, and father — the famous Gharāwiyyatayn case.',
        category: 'special',
        tags: ['husband', 'mother', 'father'],
        heirs: { husband: 1, mother: 1, father: 1 },
        expectedOutcome: 'Husband → 1/2 | Mother → 1/6 (1/3 of remainder) | Father → 1/3 (residue)',
        teachingNote: 'The Gharāwiyyatayn (ʿUmariyyatayn): ʿUmar ibn al-Khaṭṭāb ruled that the mother takes 1/3 of the remainder after the spouse, not 1/3 of the whole estate.'
    },
    {
        id: 'shafii-spouses-002',
        madhhab: 'shafii',
        title: 'Wife + Mother + Father (Gharāwiyyatayn II)',
        description: 'A man dies leaving his wife, mother, and father — the second Gharāwiyyatayn case.',
        category: 'special',
        tags: ['wife', 'mother', 'father'],
        heirs: { wife: 1, mother: 1, father: 1 },
        expectedOutcome: 'Wife → 1/4 | Mother → 1/4 (1/3 of remainder) | Father → 1/2 (residue)',
        teachingNote: 'Mirror of case 1: mother takes 1/3 of remainder after wife (= 1/4 total), keeping father at double her share.'
    },
    {
        id: 'shafii-spouses-003',
        madhhab: 'shafii',
        title: 'Wife + Son + Father',
        description: 'A man dies leaving behind his wife, one son, and his father.',
        category: 'basic',
        tags: ['wife', 'son', 'father'],
        heirs: { wife: 1, son: 1, father: 1 },
        expectedOutcome: 'Wife → 1/8 | Father → 1/6 | Son → Residue (17/24)',
        teachingNote: 'The son reduces the wife from 1/4 to 1/8, and forces the father into his fixed 1/6 share.'
    }
];
