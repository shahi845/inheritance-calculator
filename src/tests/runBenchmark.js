/**
 * runBenchmark.js — Node CLI entry point for running speed benchmarks.
 *
 * Usage:
 *   node src/tests/runBenchmark.js
 */

import { runBenchmarkSuite } from './runner/benchmarkRunner.js';

runBenchmarkSuite();
