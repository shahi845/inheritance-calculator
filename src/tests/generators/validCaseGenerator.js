/**
 * validCaseGenerator.js — Generates minimal structurally-valid heir combinations.
 *
 * Produces:
 *   1. Every single heir alone (baseline)
 *   2. Every spouse + every non-spouse heir (pair coverage)
 *   3. Selected three-heir combinations for regression baseline
 *
 * All cases have empty `expected` — used for "engine must not crash" verification.
 */

import { defaultHeirs } from '../../data/heirs.js';

const ALL_HEIR_KEYS  = Object.keys(defaultHeirs);
const SPOUSE_KEYS    = ['husband', 'wife'];
const NON_SPOUSE     = ALL_HEIR_KEYS.filter(k => !SPOUSE_KEYS.includes(k));

// ─── Single-heir cases ────────────────────────────────────────────────────────

function singleHeirCases() {
    return ALL_HEIR_KEYS.map(key => ({
        id:       `VALID-SINGLE-${key.toUpperCase()}`,
        name:     `Single heir: ${key}`,
        input:    { [key]: 1 },
        expected: {},
    }));
}

// ─── Spouse + one other ───────────────────────────────────────────────────────

function spousePairCases() {
    const cases = [];
    for (const spouse of SPOUSE_KEYS) {
        for (const other of NON_SPOUSE) {
            cases.push({
                id:       `VALID-PAIR-${spouse.toUpperCase()}-${other.toUpperCase()}`,
                name:     `${spouse} + ${other}`,
                input:    { [spouse]: 1, [other]: 1 },
                expected: {},
            });
        }
    }
    return cases;
}

// ─── Three-heir combos (curated, not exhaustive) ──────────────────────────────

const THREE_HEIR_SETS = [
    ['husband', 'son', 'daughter'],
    ['wife',    'son', 'daughter'],
    ['father',  'mother', 'son'],
    ['father',  'mother', 'daughter'],
    ['husband', 'father', 'mother'],
    ['wife',    'father', 'mother'],
    ['husband', 'mother', 'fullSister'],
    ['wife',    'paternalGrandfather', 'fullBrother'],
    ['husband', 'daughter', 'fullBrother'],
    ['husband', 'sonsDaughter', 'paternalSister'],
    ['father',  'paternalGrandmother', 'fullBrother'],
    ['mother',  'fullBrother', 'maternalBrother'],
];

function threeHeirCases() {
    return THREE_HEIR_SETS.map((set, i) => ({
        id:       `VALID-THREE-${String(i + 1).padStart(3, '0')}`,
        name:     `Three heirs: ${set.join(', ')}`,
        input:    Object.fromEntries(set.map(k => [k, 1])),
        expected: {},
    }));
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Generate all valid-coverage cases.
 * @returns {Array<{ id, name, input, expected: {} }>}
 */
export function generateValidCases() {
    return [
        ...singleHeirCases(),
        ...spousePairCases(),
        ...threeHeirCases(),
    ];
}
