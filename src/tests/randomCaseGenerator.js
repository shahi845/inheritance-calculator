/**
 * randomCaseGenerator.js (top-level shim) — Backward-compatibility re-export.
 *
 * The real generator lives in generators/. This shim re-exports it
 * for any legacy import of 'src/tests/randomCaseGenerator.js'.
 */
export {
    generateRandomCases,
    generateRandomCasesAllMadhahib,
} from './generators/randomCaseGenerator.js';
