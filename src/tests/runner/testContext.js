/**
 * testContext.js — Shared test execution engine.
 *
 * Handles:
 *   - Selecting the correct madhhab engine for a suite
 *   - Running a single test case and collecting pass/fail detail
 *   - Normalising expected keys via legacyKeyMap
 *
 * All category suites and the stress runner call `runTestCase()`.
 */

import { calculateInheritance }        from '../../madhahib/shafii/index.js';
import { calculateHanafiInheritance }  from '../../madhahib/hanafi/index.js';
import { calculateMalikiInheritance }  from '../../madhahib/maliki/index.js';
import { calculateHanbaliInheritance } from '../../madhahib/hanbali/index.js';
import { calculateJumhurInheritance }  from '../../madhahib/jumhur/index.js';
import { legacyKeyMap }                from '../../data/heirs.js';
import { validateResults }             from '../validators/validateResults.js';

// ─── Engine Dispatch ──────────────────────────────────────────────────────────

/**
 * Map engine name → calculator function.
 * @type {Record<string, Function>}
 */
export const ENGINES = {
    shafii:  (input, opts) => calculateInheritance(input, opts),
    hanafi:  (input, opts) => calculateHanafiInheritance(input, opts),
    maliki:  (input, opts) => calculateMalikiInheritance(input, opts),
    hanbali: (input, opts) => calculateHanbaliInheritance(input, opts),
    jumhur:  (input, opts) => calculateJumhurInheritance(input, opts),
};

/**
 * Call the appropriate engine for the given suite + test.
 *
 * @param {Object} test       - A single test case object
 * @param {string} [engine]   - Engine name (default: 'shafii')
 * @param {Object} [opts]     - Suite-level options (can be overridden by test.options)
 * @returns {Object}          - Raw result from the calculator
 */
export function callEngine(test, engine = 'shafii', opts = {}) {
    const fn = ENGINES[engine];
    if (!fn) throw new Error(`Unknown engine: "${engine}". Valid: ${Object.keys(ENGINES).join(', ')}`);
    const mergedOpts = { ...opts, ...(test.options || {}) };
    return fn(test.input, mergedOpts);
}

// ─── Key Normalisation ────────────────────────────────────────────────────────

/**
 * Map legacy expected keys to canonical keys so test authors can use
 * either 'brother' or 'fullBrother' in expected objects.
 *
 * @param {Object} expected
 * @returns {Object}
 */
export function normalizeExpected(expected = {}) {
    const out = {};
    for (const [key, value] of Object.entries(expected)) {
        out[legacyKeyMap[key] || key] = value;
    }
    return out;
}

// ─── Single Test Execution ────────────────────────────────────────────────────

/**
 * @typedef {Object} TestResult
 * @property {boolean}   passed
 * @property {string}    name
 * @property {string[]}  errors
 * @property {Object}    [result]   - Raw engine output (on success)
 * @property {string}    [thrown]   - Error message (on crash)
 */

/**
 * Run one test case and return a structured result object.
 *
 * @param {Object} test             - Test case ({ name, input, expected, options? })
 * @param {string} [engine='shafii']
 * @param {Object} [suiteOpts={}]  - Suite-level options
 * @returns {TestResult}
 */
export function runTestCase(test, engine = 'shafii', suiteOpts = {}) {
    try {
        const result = callEngine(test, engine, suiteOpts);
        const errors = validateResults(result, test.expected || {});
        return {
            passed: errors.length === 0,
            name:   test.name || '(unnamed)',
            errors,
            result,
        };
    } catch (err) {
        return {
            passed:  false,
            name:    test.name || '(unnamed)',
            errors:  [`CRASH: ${err.message}`],
            thrown:  err.message,
        };
    }
}

// ─── Suite Execution ──────────────────────────────────────────────────────────

/**
 * @typedef {Object} SuiteResult
 * @property {string}       name
 * @property {number}       total
 * @property {number}       passed
 * @property {number}       failed
 * @property {TestResult[]} results
 */

/**
 * Run all tests in a suite descriptor and return aggregated results.
 *
 * @param {{ name: string, engine?: string, options?: Object, tests: Object[], _customRunner?: Function }} suite
 * @returns {SuiteResult}
 */
export function runSuite(suite) {
    const runner = suite._customRunner || null;

    const results = (suite.tests || []).map(test => {
        // If the suite provides a custom runner, delegate entirely
        if (runner) return runner(test._raw || test);
        return runTestCase(test, suite.engine || 'shafii', suite.options || {});
    });

    const passed = results.filter(r => r.passed).length;
    return {
        name:    suite.name,
        total:   results.length,
        passed,
        failed:  results.length - passed,
        results,
    };
}
