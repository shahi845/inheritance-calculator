/**
 * fixedShares.test.js — Fixed-share (Aṣḥāb al-Furūḍ) test suite.
 */

import { spouseTests } from '../shafii/verified/spouse.test.js';

const additionalFixedShareCases = [
    {
        name: 'Husband alone — gets fixed 1/2 share',
        input: { husband: 1 },
        expected: { husband: '1/2' },
    },
    {
        name: 'Husband + son — husband gets 1/4, son gets residue',
        input: { husband: 1, son: 1 },
        expected: { husband: '1/4', son: '3/4' },
    },
    {
        name: 'Husband + 2 daughters — husband 1/4, daughters 3/4 (with radd remainder)',
        input: { husband: 1, daughter: 2 },
        expected: { husband: '1/4', daughter: '3/4' },
    },
    {
        name: 'Wife alone — gets fixed 1/4 share',
        input: { wife: 1 },
        expected: { wife: '1/4' },
    },
    {
        name: 'Wife + son — wife gets 1/8, son gets residue',
        input: { wife: 1, son: 1 },
        expected: { wife: '1/8', son: '7/8' },
    },
    {
        name: '4 wives + son — wives collectively 1/8',
        input: { wife: 4, son: 1 },
        expected: { wife: '1/8', son: '7/8' },
    },
    {
        name: 'Mother + father — mother 1/3, father residue (Gharrawiyyatayn 1)',
        input: { mother: 1, father: 1 },
        expected: { mother: '1/3', father: '2/3' },
    },
    {
        name: 'Mother + father + husband — mother 1/6 (Gharrawiyyatayn 2: 1/3 of remainder)',
        input: { mother: 1, father: 1, husband: 1 },
        expected: { husband: '1/2', mother: '1/6', father: '1/3' },
    },
    {
        name: 'Paternal grandmother alone — gets full estate (1/6 + radd)',
        input: { paternalGrandmother: 1 },
        expected: { paternalGrandmother: '1' },
    },
    {
        name: 'Maternal grandmother alone — gets full estate (1/6 + radd)',
        input: { maternalGrandmother: 1 },
        expected: { maternalGrandmother: '1' },
    },
    {
        name: 'Both grandmothers share 1/6 equally (with radd: 1/2 each)',
        input: { paternalGrandmother: 1, maternalGrandmother: 1 },
        expected: { paternalGrandmother: '1/2', maternalGrandmother: '1/2' },
    },
    {
        name: '1 daughter — gets full estate (1/2 + radd)',
        input: { daughter: 1 },
        expected: { daughter: '1' },
    },
    {
        name: '2+ daughters — get full estate (2/3 + radd)',
        input: { daughter: 3 },
        expected: { daughter: '1' },
    },
    {
        name: "Son's daughter — gets full estate (1/2 + radd)",
        input: { sonsDaughter: 1 },
        expected: { sonsDaughter: '1' },
    },
    {
        name: "1 daughter + 1 son's daughter — daughter 3/4, granddaughter 1/4 (with radd)",
        input: { daughter: 1, sonsDaughter: 1 },
        expected: { daughter: '3/4', sonsDaughter: '1/4' },
    },
    {
        name: '1 maternal sibling — gets full estate (1/6 + radd)',
        input: { maternalBrother: 1 },
        expected: { maternalBrother: '1' },
    },
    {
        name: '2+ maternal siblings share 1/3 equally (with radd 1/2 each)',
        input: { maternalBrother: 1, maternalSister: 1 },
        expected: { maternalBrother: '1/2', maternalSister: '1/2' },
    },
];

export const suite = {
    name:   'Fixed Shares (Aṣḥāb al-Furūḍ)',
    engine: 'shafii',
    tests:  [...spouseTests, ...additionalFixedShareCases],
};
