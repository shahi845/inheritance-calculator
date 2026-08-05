/**
 * randomCaseGenerator.js — Generates random but structurally valid heir combinations.
 *
 * Used by stress.test.js to automatically produce large volumes of test inputs.
 * Each case is suitable for passing to any madhhab engine and checking that:
 *   (a) the engine does not crash
 *   (b) the result passes all structural validators
 *
 * Generated cases have an empty `expected` map — they are not compared against
 * known answers, only checked for structural correctness.
 */

import { defaultHeirs } from '../../data/heirs.js';

// ─── Configuration ────────────────────────────────────────────────────────────

/** Heirs that can appear in multiples (> 1) */
const PLURAL_HEIRS = new Set([
    'wife', 'son', 'daughter', 'sonsSon', 'sonsDaughter',
    'fullBrother', 'fullSister', 'paternalBrother', 'paternalSister',
    'maternalBrother', 'maternalSister',
]);

/** Maximum count for plural heirs */
const MAX_PLURAL = 4;

/** All canonical heir keys (excluding disqualification flags) */
const ALL_HEIR_KEYS = Object.keys(defaultHeirs);

/** Mutually exclusive pairs — only one side can be > 0 */
const MUTUAL_EXCLUSIONS = [
    ['husband', 'wife'],
];

// ─── Seeded PRNG (Mulberry32) ─────────────────────────────────────────────────

function mulberry32(seed) {
    return function () {
        seed |= 0; seed = seed + 0x6D2B79F5 | 0;
        let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}

// ─── Core Generator ───────────────────────────────────────────────────────────

/**
 * Generate N random test cases.
 *
 * @param {number}  [count=500]    - Number of cases to generate
 * @param {number}  [seed=42]      - PRNG seed for reproducibility
 * @param {string}  [madhhab]      - Optional tag for the cases
 * @returns {Array<{ id, name, input, expected: {} }>}
 */
export function generateRandomCases(count = 500, seed = 42, madhhab = 'shafii') {
    const rand    = mulberry32(seed);
    const cases   = [];

    for (let i = 0; i < count; i++) {
        const input    = {};
        const usedKeys = new Set();

        // Randomly pick 1–6 heirs
        const heirCount = 1 + Math.floor(rand() * 6);
        const shuffled  = shuffleArray([...ALL_HEIR_KEYS], rand);

        for (const key of shuffled) {
            if (usedKeys.size >= heirCount) break;

            // Enforce mutual exclusions
            const excluded = MUTUAL_EXCLUSIONS.find(pair => pair.includes(key) && pair.some(k => usedKeys.has(k)));
            if (excluded) continue;

            const maxCount = PLURAL_HEIRS.has(key) ? MAX_PLURAL : 1;
            const n        = 1 + Math.floor(rand() * maxCount);

            // Wives capped at 4
            const finalN = key === 'wife' ? Math.min(n, 4) : n;
            // Husband always 1
            const assign = key === 'husband' ? 1 : finalN;

            input[key] = assign;
            usedKeys.add(key);
        }

        cases.push({
            id:       `RANDOM-${String(i + 1).padStart(4, '0')}-SEED${seed}`,
            name:     `Random Case ${i + 1} (seed=${seed})`,
            madhhab,
            input,
            expected: {},   // Structural-only — no expected shares
        });
    }

    return cases;
}

/**
 * Shuffle array in-place using provided PRNG.
 * @param {Array} arr
 * @param {Function} rand
 * @returns {Array}
 */
function shuffleArray(arr, rand) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

/**
 * Convenience: generate cases across all 5 madhahib.
 *
 * @param {number} [perMadhhab=100]
 * @param {number} [seed=42]
 * @returns {Array}
 */
export function generateRandomCasesAllMadhahib(perMadhhab = 100, seed = 42) {
    const madhahib = ['shafii', 'hanafi', 'maliki', 'hanbali', 'jumhur'];
    return madhahib.flatMap((m, idx) =>
        generateRandomCases(perMadhhab, seed + idx * 1000, m).map(c => ({
            ...c,
            _engine: m,
        }))
    );
}
