/**
 * consoleReporter.js — Formats test results and rule coverage to terminal / console.
 *
 * @param {Array<SuiteResult>} suiteResults
 */
import { calculateCoverage } from '../runner/coverageCalculator.js';

export function consoleReporter(suiteResults) {
    for (const suite of suiteResults) {
        const icon = suite.failed === 0 ? '✅' : '❌';
        console.log(`${icon}  Suite: "${suite.name}"  —  ${suite.passed}/${suite.total} passed`);

        for (const test of suite.results) {
            if (test.passed) continue; // Only print failures

            console.error(`   ❌  ${test.name}`);
            for (const msg of test.errors) {
                console.error(`         › ${msg}`);
            }
        }
    }

    const { categories, overallCoveragePct } = calculateCoverage(suiteResults);

    console.log('');
    console.log('---------------------------------------------------');
    console.log('📊 RULE COVERAGE BREAKDOWN');
    console.log('---------------------------------------------------');
    for (const cat of categories) {
        const bar = '█'.repeat(Math.round(cat.percentage / 10)) + '░'.repeat(10 - Math.round(cat.percentage / 10));
        console.log(` ${cat.label.padEnd(38)} [${bar}] ${String(cat.percentage).padStart(3)}% (${cat.passed}/${cat.total})`);
    }
    console.log('---------------------------------------------------');
    console.log(` Overall Rule Coverage: ${overallCoveragePct}%`);
    console.log('---------------------------------------------------');
}
