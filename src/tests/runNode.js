/**
 * runNode.js — Unified Node.js CLI entry point for the Farā'iḍ test suite.
 *
 * Runs all test categories, validates rules, generates reports, and exits with 0 or 1.
 *
 * Usage:
 *   node src/tests/runNode.js
 */

import { runAllTests } from './runner/runAllTests.js';

const { totalFailed } = runAllTests();
process.exit(totalFailed === 0 ? 0 : 1);
