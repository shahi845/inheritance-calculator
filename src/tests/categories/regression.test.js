/**
 * regression.test.js — Golden-snapshot regression suite.
 *
 * Contains hand-verified cases that have previously passed.
 * Any future engine change that breaks one of these tests is a regression.
 *
 * Sources:
 *   - shafii/verified/complex.test.js  (re-included as regression anchors)
 *   - shafii/verified/awl.test.js      (key awl cases)
 *   - shafii/verified/radd.test.js     (key radd cases)
 *   - Additional manually-verified golden snapshots
 *
 * All cases here have known-correct `expected` values.
 */

import { complexTests } from '../shafii/verified/complex.test.js';
import { awlTests }     from '../shafii/verified/awl.test.js';
import { raddTests }    from '../shafii/verified/radd.test.js';

// ── Additional golden snapshots ────────────────────────────────────────────────

const goldenSnapshots = [
    // ── Core fixed-share anchors ────────────────────────────────────────────
    {
        name: '[REG] Husband 1/4 with male descendants',
        input: { husband: 1, son: 1 },
        expected: { husband: '1/4', son: '3/4' },
    },
    {
        name: '[REG] Husband 1/2 with no descendants',
        input: { husband: 1, fullBrother: 1 },
        expected: { husband: '1/2', fullBrother: '1/2' },
    },
    {
        name: '[REG] Wife 1/8 with male descendants',
        input: { wife: 1, son: 1 },
        expected: { wife: '1/8', son: '7/8' },
    },
    {
        name: '[REG] Father 1/6 + residue with no male descendants',
        input: { father: 1, mother: 1 },
        expected: { father: '2/3', mother: '1/3' },
    },
    {
        name: '[REG] Father 1/6 fixed with son',
        input: { father: 1, son: 1 },
        expected: { father: '1/6', son: '5/6' },
    },
    {
        name: '[REG] Mother 1/6 with two siblings (hajb nāqiṣ)',
        input: { husband: 1, mother: 1, fullBrother: 2 },
        expected: { husband: '1/2', mother: '1/6', fullBrother: '1/3' },
    },
    {
        name: '[REG] Mother 1/3 with no descendants and no siblings',
        input: { husband: 1, mother: 1 },
        expected: { husband: '1/2', mother: '1/2' },
    },
    // ── Residuary anchors ────────────────────────────────────────────────────
    {
        name: '[REG] Son takes all as residuary',
        input: { son: 1 },
        expected: { son: '1' },
    },
    {
        name: '[REG] Son and daughter 2:1 split',
        input: { son: 1, daughter: 1 },
        expected: { son: '2/3', daughter: '1/3' },
    },
    {
        name: '[REG] 2 sons and 3 daughters — 2:1 split',
        input: { son: 2, daughter: 3 },
        expected: { son: '4/7', daughter: '3/7' },
    },
    {
        name: '[REG] Full brother takes residue after fixed shares',
        input: { daughter: 1, fullBrother: 1 },
        expected: { daughter: '1/2', fullBrother: '1/2' },
    },
    {
        name: '[REG] Full sister as ʿaṣabah bi-l-ghayr with daughter',
        input: { daughter: 1, fullSister: 1 },
        expected: { daughter: '1/2', fullSister: '1/2' },
    },
    // ── Blocking anchors ─────────────────────────────────────────────────────
    {
        name: '[REG] Father blocks grandfather',
        input: { father: 1, paternalGrandfather: 1 },
        expected: { father: '1' },
    },
    {
        name: '[REG] Son blocks full brother',
        input: { son: 1, fullBrother: 1 },
        expected: { son: '1' },
    },
    {
        name: '[REG] Mother blocks paternal grandmother',
        input: { mother: 1, paternalGrandmother: 1 },
        expected: { mother: '1' },
    },
    // ── ʿAwl anchor (al-Minbariyyah) ─────────────────────────────────────────
    {
        name: '[REG] Al-Minbariyyah — awl to 27',
        input: { wife: 1, daughter: 2, father: 1, mother: 1 },
        expected: { wife: '3/27', daughter: '16/27', father: '4/27', mother: '4/27' },
    },
    // ── Radd anchor ──────────────────────────────────────────────────────────
    {
        name: '[REG] Mother + daughter — radd',
        input: { mother: 1, daughter: 1 },
        expected: { mother: '1/4', daughter: '3/4' },
    },
];

export const suite = {
    name:   'Regression (Golden Snapshots)',
    engine: 'shafii',
    tests:  [...goldenSnapshots, ...complexTests, ...awlTests, ...raddTests],
};
