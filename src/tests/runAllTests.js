/**
 * runAllTests.js (top-level shim) — Backward-compatibility re-export.
 *
 * The real orchestrator lives in runner/runAllTests.js.
 * This file exists so any legacy import of 'src/tests/runAllTests.js'
 * continues to work without modification.
 */
export { runAllTests } from './runner/runAllTests.js';
