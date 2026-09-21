/**
 * runAllTests.js (runner/) — Full test suite orchestrator.
 *
 * Imports every category suite, runs them all through the shared testContext,
 * and dispatches results to all configured reporters.
 *
 * Usage (Node CLI):
 *   node src/tests/runner/runAllTests.js
 *
 * Usage (browser):
 *   import { runAllTests } from './runner/runAllTests.js';
 *   window.runFaraidTests = runAllTests;
 *
 * Exits with code 0 on full pass, 1 on any failures.
 */

import { runSuite }         from './testContext.js';
import { consoleReporter }  from '../reports/consoleReporter.js';
import { htmlReporter }     from '../reports/htmlReporter.js';
import { jsonReporter }     from '../reports/jsonReporter.js';

// ─── Category Imports ─────────────────────────────────────────────────────────
// Each category module exports a `suite` descriptor:
//   { name: string, engine?: string, options?: Object, tests: Array }

import { suite as fixedSharesSuite }       from '../categories/fixedShares.test.js';
import { suite as blockingSuite }          from '../categories/blocking.test.js';
import { suite as awlSuite }               from '../categories/awl.test.js';
import { suite as raddSuite }              from '../categories/radd.test.js';
import { suite as grandfatherSuite }       from '../categories/grandfather.test.js';
import { suite as dhawuAlArhamSuite }      from '../categories/dhawuAlArham.test.js';
import { suite as madhhabComparisonSuite } from '../categories/madhhabComparison.test.js';
import { suite as stressSuite }            from '../categories/stress.test.js';
import { suite as regressionSuite }        from '../categories/regression.test.js';

// ─── Suite Registry ───────────────────────────────────────────────────────────

const ALL_SUITES = [
    fixedSharesSuite,
    blockingSuite,
    awlSuite,
    raddSuite,
    grandfatherSuite,
    dhawuAlArhamSuite,
    madhhabComparisonSuite,
    stressSuite,
    regressionSuite,
];

// ─── Orchestrator ─────────────────────────────────────────────────────────────

/**
 * Run all test suites and return aggregated results.
 *
 * @param {Object}  [options={}]
 * @param {boolean} [options.silent=false]      - Suppress console reporter
 * @param {boolean} [options.htmlOutput=true]   - Run HTML reporter
 * @param {boolean} [options.jsonOutput=true]   - Run JSON reporter
 * @param {string[]} [options.only]             - Run only these suite names
 * @returns {{ suiteResults: Array, totalPassed: number, totalFailed: number, totalTests: number }}
 */
export function runAllTests(options = {}) {
    const {
        silent     = false,
        htmlOutput = true,
        jsonOutput = true,
        only,
    } = options;

    const suites = only
        ? ALL_SUITES.filter(s => only.includes(s.name))
        : ALL_SUITES;

    if (!silent) {
        console.log('');
        console.log('═══════════════════════════════════════════════════');
        console.log("   FARĀ'IḌ CALCULATOR — FULL TEST SUITE");
        console.log('═══════════════════════════════════════════════════');
        console.log(`   Running ${suites.length} suite(s)…`);
        console.log('');
    }

    const suiteResults = suites.map(suite => runSuite(suite));

    // Aggregate totals
    const totalTests  = suiteResults.reduce((n, r) => n + r.total, 0);
    const totalPassed = suiteResults.reduce((n, r) => n + r.passed, 0);
    const totalFailed = suiteResults.reduce((n, r) => n + r.failed, 0);

    // ── Dispatch reporters ─────────────────────────────────────────────────
    if (!silent) {
        consoleReporter(suiteResults);
    }
    if (htmlOutput) {
        htmlReporter(suiteResults, { totalTests, totalPassed, totalFailed });
    }
    if (jsonOutput) {
        jsonReporter(suiteResults, { totalTests, totalPassed, totalFailed });
    }

    if (!silent) {
        console.log('');
        console.log('═══════════════════════════════════════════════════');
        const icon = totalFailed === 0 ? '✅' : '❌';
        console.log(`   ${icon}  OVERALL: ${totalPassed}/${totalTests} passed, ${totalFailed} failed`);
        console.log('═══════════════════════════════════════════════════');
        console.log('');
    }

    return { suiteResults, totalPassed, totalFailed, totalTests };
}

// ─── Browser Exposure ─────────────────────────────────────────────────────────

if (typeof window !== 'undefined') {
    window.runFaraidTests = runAllTests;
}

// ─── Node CLI Entry Point ─────────────────────────────────────────────────────

const isNodeMain = typeof process !== 'undefined'
    && process.argv[1]
    && (process.argv[1].includes('runner/runAllTests') || process.argv[1].includes('runner\\runAllTests'));

if (isNodeMain) {
    const { totalFailed } = runAllTests();
    process.exit(totalFailed === 0 ? 0 : 1);
}
