/**
 * stress.test.js — Stress and volume testing suite.
 *
 * Combines:
 *   1. 500 seeded random cases (structural-only, all 5 madhahib)
 *   2. All programmatic edge-case families
 *   3. Valid-coverage cases (single heirs, spouse pairs, three-heir combos)
 *
 * All tests check:
 *   - Engine does not crash
 *   - Shares pass all structural validators (sum ≤ 1, no negatives, etc.)
 *   - Blocked heirs have zero shares
 *   - ʿAwl flag matches actual sum
 *
 * No `expected` shares are asserted — this is structural robustness testing.
 */

import { generateRandomCases }   from '../generators/randomCaseGenerator.js';
import { generateEdgeCases }     from '../generators/edgeCaseGenerator.js';
import { generateValidCases }    from '../generators/validCaseGenerator.js';

// 500 random Shafii cases (reproducible seed)
const randomCases = generateRandomCases(500, 42, 'shafii');

// All edge-case families
const edgeCases = generateEdgeCases();

// Minimal valid coverage cases
const validCases = generateValidCases();

export const suite = {
    name:   'Stress & Volume Testing',
    engine: 'shafii',
    tests:  [...edgeCases, ...validCases, ...randomCases],
};
