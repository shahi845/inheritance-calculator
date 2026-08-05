/**
 * jsonReporter.js — Serialises test results to JSON.
 *
 * Browser mode: Stores in localStorage['faraidTestResults']
 * Node mode:    Writes `test-results.json` to the current working directory
 *
 * @param {Array<SuiteResult>} suiteResults
 * @param {{ totalTests: number, totalPassed: number, totalFailed: number }} [summary]
 */
export function jsonReporter(suiteResults, summary = {}) {
    const { totalTests = 0, totalPassed = 0, totalFailed = 0 } = summary;

    const payload = {
        timestamp: new Date().toISOString(),
        summary: { totalTests, totalPassed, totalFailed },
        suites: suiteResults.map(suite => ({
            name:   suite.name,
            total:  suite.total,
            passed: suite.passed,
            failed: suite.failed,
            results: suite.results.map(r => ({
                name:   r.name,
                passed: r.passed,
                errors: r.errors,
            })),
        })),
    };

    const json = JSON.stringify(payload, null, 2);

    if (typeof window !== 'undefined') {
        try {
            localStorage.setItem('faraidTestResults', json);
            console.info('[jsonReporter] Results stored in localStorage["faraidTestResults"]');
        } catch (e) {
            console.warn('[jsonReporter] localStorage write failed:', e.message);
        }
    } else if (typeof process !== 'undefined') {
        try {
            const { writeFileSync } = _require('fs');
            writeFileSync('test-results.json', json, 'utf8');
            console.info('[jsonReporter] Written → test-results.json');
        } catch (e) {
            console.warn('[jsonReporter] Could not write test-results.json:', e.message);
        }
    }
}

/** Node-safe require shim */
function _require(mod) {
    // eslint-disable-next-line no-undef
    return typeof require !== 'undefined' ? require(mod) : { writeFileSync: () => {} };
}
