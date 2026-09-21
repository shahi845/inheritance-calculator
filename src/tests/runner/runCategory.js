/**
 * runCategory.js — Run a single named category suite in isolation.
 *
 * Usage (Node CLI):
 *   node src/tests/runner/runCategory.js <categoryName>
 *
 * Valid category names:
 *   fixedShares | blocking | awl | radd | grandfather |
 *   dhawuAlArham | madhhabComparison | stress | regression
 *
 * Exits with code 0 on full pass, 1 on any failure.
 */

import { runSuite }          from './testContext.js';
import { consoleReporter }   from '../reports/consoleReporter.js';
import { jsonReporter }      from '../reports/jsonReporter.js';

// ─── Category Registry ────────────────────────────────────────────────────────

/**
 * Lazily import a category suite by name.
 * Returns null if the name is unknown.
 *
 * @param {string} name
 * @returns {Promise<Object|null>}
 */
async function loadCategory(name) {
    const map = {
        fixedShares:        () => import('../categories/fixedShares.test.js'),
        blocking:           () => import('../categories/blocking.test.js'),
        awl:                () => import('../categories/awl.test.js'),
        radd:               () => import('../categories/radd.test.js'),
        grandfather:        () => import('../categories/grandfather.test.js'),
        dhawuAlArham:       () => import('../categories/dhawuAlArham.test.js'),
        madhhabComparison:  () => import('../categories/madhhabComparison.test.js'),
        stress:             () => import('../categories/stress.test.js'),
        regression:         () => import('../categories/regression.test.js'),
    };

    const loader = map[name];
    if (!loader) return null;

    const mod = await loader();

    // Each category module exports a default suite descriptor or a named `suite`
    return mod.suite || mod.default || null;
}

// ─── Runner ───────────────────────────────────────────────────────────────────

/**
 * Run a single category and report results.
 *
 * @param {string} categoryName
 * @returns {Promise<{ passed: boolean, result: Object }>}
 */
export async function runCategory(categoryName) {
    const suite = await loadCategory(categoryName);

    if (!suite) {
        console.error(`❌ Unknown category: "${categoryName}"`);
        console.error(`Valid names: fixedShares, blocking, awl, radd, grandfather, dhawuAlArham, madhhabComparison, stress, regression`);
        return { passed: false, result: null };
    }

    const result = runSuite(suite);
    consoleReporter([result]);
    jsonReporter([result]);

    return { passed: result.failed === 0, result };
}

// ─── CLI Entry Point ──────────────────────────────────────────────────────────

// Detect if running directly in Node (not imported as module)
const isNodeMain = typeof process !== 'undefined'
    && process.argv[1]
    && process.argv[1].includes('runCategory');

if (isNodeMain) {
    const categoryName = process.argv[2];

    if (!categoryName) {
        console.error('Usage: node runCategory.js <categoryName>');
        process.exit(1);
    }

    runCategory(categoryName).then(({ passed }) => {
        process.exit(passed ? 0 : 1);
    }).catch(err => {
        console.error('Fatal error:', err);
        process.exit(1);
    });
}
