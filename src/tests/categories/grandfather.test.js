/**
 * grandfather.test.js — Paternal grandfather + siblings edge cases.
 *
 * Sources:
 *   - shafii/verified/complex.test.js  (contains grandfather scenarios)
 *   - Additional grandfather-with-siblings (al-Akdariyya, Muqāsama) cases
 */

import { complexTests } from '../shafii/verified/complex.test.js';

const grandfatherCases = [
    {
        name: 'Grandfather alone — takes full estate as residuary',
        input: { paternalGrandfather: 1 },
        expected: { paternalGrandfather: '1' },
    },
    {
        name: 'Grandfather + 1 full brother — equal split (muqāsama better than 1/3)',
        input: { paternalGrandfather: 1, fullBrother: 1 },
        expected: { paternalGrandfather: '1/2', fullBrother: '1/2' },
    },
    {
        name: 'Grandfather + 5 full brothers — 1/3 of estate better than muqāsama (1/6)',
        input: { paternalGrandfather: 1, fullBrother: 5 },
        expected: { paternalGrandfather: '1/3', fullBrother: '2/3' },
    },
    {
        name: 'Grandfather + full brother + full sister — 2:1 muqāsama',
        input: { paternalGrandfather: 1, fullBrother: 1, fullSister: 1 },
        expected: { paternalGrandfather: '2/5', fullBrother: '2/5', fullSister: '1/5' },
    },
    {
        name: 'Wife + grandfather + full brother — wife 1/4, GF+Br split 3/4',
        input: { wife: 1, paternalGrandfather: 1, fullBrother: 1 },
        expected: { wife: '1/4', paternalGrandfather: '3/8', fullBrother: '3/8' },
    },
    {
        name: 'Mother + grandfather + full brother — equal 1/3 split',
        input: { mother: 1, paternalGrandfather: 1, fullBrother: 1 },
        expected: { mother: '1/3', paternalGrandfather: '1/3', fullBrother: '1/3' },
    },
    {
        name: 'Grandfather + 3 full brothers + 2 full sisters — 1/3 of estate floor',
        input: { paternalGrandfather: 1, fullBrother: 3, fullSister: 2 },
        expected: { paternalGrandfather: '1/3', fullBrother: '1/2', fullSister: '1/6' },
    },
];

export const suite = {
    name:   'Paternal Grandfather with Siblings',
    engine: 'shafii',
    tests:  [...complexTests, ...grandfatherCases],
};
