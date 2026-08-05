/**
 * edgeCaseGenerator.js — Programmatically generates known edge-case families.
 */

const AWL_CASES = [
    {
        id:    'EDGE-AWL-01',
        name:  'Al-Minbariyyah (wife+2daughters+father+mother) — awl to 27',
        input: { wife: 1, daughter: 2, father: 1, mother: 1 },
        expected: {},
    },
    {
        id:    'EDGE-AWL-02',
        name:  'Husband + 2 full sisters — awl to 7',
        input: { husband: 1, fullSister: 2 },
        expected: {},
    },
    {
        id:    'EDGE-AWL-03',
        name:  'Wife + 2 full sisters + mother + 2 maternal siblings — awl to 17',
        input: { wife: 1, fullSister: 2, mother: 1, maternalSister: 2 },
        expected: {},
    },
    {
        id:    'EDGE-AWL-04',
        name:  'Husband + 2 full sisters + mother — awl to 8',
        input: { husband: 1, fullSister: 2, mother: 1 },
        expected: {},
    },
    {
        id:    'EDGE-AWL-05',
        name:  'All Quranic sharers at once (theoretical max crowding)',
        input: { wife: 4, daughter: 2, sonsDaughter: 1, father: 1, mother: 1,
                 paternalGrandfather: 1, paternalGrandmother: 2,
                 maternalBrother: 2, fullSister: 2, paternalSister: 1 },
        expected: {},
    },
];

const BLOCKING_CASES = [
    {
        id:    'EDGE-BLOCK-01',
        name:  'Maximum blocking chain: son → grandson → brother → uncle → cousin',
        input: { son: 1, sonsSon: 1, fullBrother: 1, fullPaternalUncle: 1, fullPaternalUnclesSon: 1 },
        expected: {},
    },
    {
        id:    'EDGE-BLOCK-02',
        name:  'Father blocks grandfather, paternal grandmother, full brother',
        input: { father: 1, paternalGrandfather: 1, paternalGrandmother: 1, fullBrother: 1 },
        expected: {},
    },
    {
        id:    'EDGE-BLOCK-03',
        name:  'Mother blocks both grandmothers',
        input: { mother: 1, paternalGrandmother: 1, maternalGrandmother: 1 },
        expected: {},
    },
    {
        id:    'EDGE-BLOCK-04',
        name:  'Two daughters block granddaughter',
        input: { daughter: 2, sonsDaughter: 1, fullBrother: 1 },
        expected: {},
    },
    {
        id:    'EDGE-BLOCK-05',
        name:  'Full brother blocks paternal brother',
        input: { fullBrother: 1, paternalBrother: 1, paternalSister: 1 },
        expected: {},
    },
];

const WIVES_CASES = [
    {
        id:    'EDGE-WIVES-01',
        name:  'Maximum wives (4) — no blood heirs → bayt al-māl',
        input: { wife: 4 },
        expected: {},
    },
    {
        id:    'EDGE-WIVES-02',
        name:  '4 wives + distant kindred only',
        input: { wife: 4, daughtersSon: 1 },
        expected: {},
    },
];

const RADD_CASES = [
    {
        id:    'EDGE-RADD-01',
        name:  'Mother alone — full estate by radd',
        input: { mother: 1 },
        expected: {},
    },
    {
        id:    'EDGE-RADD-02',
        name:  'Mother + daughter — radd splits remainder 1:3',
        input: { mother: 1, daughter: 1 },
        expected: {},
    },
    {
        id:    'EDGE-RADD-03',
        name:  'Paternal grandmother + full sister — radd',
        input: { paternalGrandmother: 1, fullSister: 1 },
        expected: {},
    },
    {
        id:    'EDGE-RADD-04',
        name:  'Wife + mother + daughter — radd after spouse fixed share',
        input: { wife: 1, mother: 1, daughter: 1 },
        expected: {},
    },
];

const DHAWU_CASES = [
    {
        id:    'EDGE-DHAWU-01',
        name:  "Daughter's son alone (Class 1 dhawu)",
        input: { daughtersSon: 1 },
        expected: {},
        options: { dhawuAlArhamMode: 'enabledWhenNoBaytulMal' },
    },
    {
        id:    'EDGE-DHAWU-02',
        name:  "Maternal grandfather alone (Class 2 dhawu)",
        input: { maternalGrandfather: 1 },
        expected: {},
        options: { dhawuAlArhamMode: 'enabledWhenNoBaytulMal' },
    },
    {
        id:    'EDGE-DHAWU-03',
        name:  "Sister's son + maternal uncle (Classes 3 & 4 dhawu)",
        input: { sistersSon: 1, maternalUncle: 1 },
        expected: {},
        options: { dhawuAlArhamMode: 'enabledWhenNoBaytulMal' },
    },
    {
        id:    'EDGE-DHAWU-04',
        name:  'Husband + dhawu heir — spouse takes fixed, dhawu takes remainder',
        input: { husband: 1, daughtersSon: 1 },
        expected: {},
        options: { dhawuAlArhamMode: 'enabledWhenNoBaytulMal' },
    },
];

const SPOUSE_ONLY_CASES = [
    {
        id:    'EDGE-SPOUSE-01',
        name:  'Husband alone — gets 1/2 or full estate by radd',
        input: { husband: 1 },
        expected: {},
    },
    {
        id:    'EDGE-SPOUSE-02',
        name:  'Wife alone — gets 1/4 or full estate by radd',
        input: { wife: 1 },
        expected: {},
    },
];

const GRANDFATHER_CASES = [
    {
        id:    'EDGE-GF-01',
        name:  'Grandfather + 1 full brother (competing residuaries)',
        input: { paternalGrandfather: 1, fullBrother: 1 },
        expected: {},
    },
    {
        id:    'EDGE-GF-02',
        name:  'Grandfather + 2 full brothers + 1 full sister',
        input: { paternalGrandfather: 1, fullBrother: 2, fullSister: 1 },
        expected: {},
    },
    {
        id:    'EDGE-GF-03',
        name:  'Wife + grandfather + full brother + mother',
        input: { wife: 1, paternalGrandfather: 1, fullBrother: 1, mother: 1 },
        expected: {},
    },
    {
        id:    'EDGE-GF-04',
        name:  'Grandfather + 3 full brothers + 2 full sisters (stress classical algorithm)',
        input: { paternalGrandfather: 1, fullBrother: 3, fullSister: 2 },
        expected: {},
    },
];

export function generateEdgeCases() {
    return [
        ...AWL_CASES,
        ...BLOCKING_CASES,
        ...WIVES_CASES,
        ...RADD_CASES,
        ...DHAWU_CASES,
        ...SPOUSE_ONLY_CASES,
        ...GRANDFATHER_CASES,
    ];
}

export {
    AWL_CASES      as edgeAwlCases,
    BLOCKING_CASES as edgeBlockingCases,
    WIVES_CASES    as edgeWivesCases,
    RADD_CASES     as edgeRaddCases,
    DHAWU_CASES    as edgeDhawuCases,
    SPOUSE_ONLY_CASES as edgeSpouseCases,
    GRANDFATHER_CASES as edgeGrandfatherCases,
};
