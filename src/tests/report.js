/**
 * report.js (top-level shim) — Backward-compatibility re-export.
 *
 * The real reporters live in reports/. This shim re-exports the
 * console reporter for any legacy import of 'src/tests/report.js'.
 */
export { consoleReporter, consoleReporter as report } from './reports/consoleReporter.js';
export { htmlReporter }                               from './reports/htmlReporter.js';
export { jsonReporter }                               from './reports/jsonReporter.js';
