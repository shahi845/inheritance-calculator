/**
 * benchmarkRunner.js — Measures calculation speed and throughput for Farā'iḍ engine.
 *
 * Runs benchmarks across 100, 1,000, and 10,000 cases and reports timing statistics.
 */

import { generateRandomCases } from '../generators/randomCaseGenerator.js';
import { calculateInheritance } from '../../madhahib/shafii/index.js';
import { calculateHanafiInheritance } from '../../madhahib/hanafi/index.js';
import { calculateMalikiInheritance } from '../../madhahib/maliki/index.js';
import { calculateHanbaliInheritance } from '../../madhahib/hanbali/index.js';
import { calculateJumhurInheritance } from '../../madhahib/jumhur/index.js';

const ENGINES = {
    shafii: calculateInheritance,
    hanafi: calculateHanafiInheritance,
    maliki: calculateMalikiInheritance,
    hanbali: calculateHanbaliInheritance,
    jumhur: calculateJumhurInheritance,
};

/**
 * Run a benchmark for N cases.
 * @param {number} count
 * @param {string} [engineName='shafii']
 * @returns {{ count: number, totalMs: number, avgMs: number, opsPerSec: number }}
 */
export function runBenchmark(count = 1000, engineName = 'shafii') {
    const fn = ENGINES[engineName] || calculateInheritance;
    const cases = generateRandomCases(count, 12345, engineName);

    // Warm up JS engine JIT
    for (let i = 0; i < 50; i++) {
        fn(cases[i % cases.length].input);
    }

    const start = performance.now();
    for (let i = 0; i < count; i++) {
        fn(cases[i].input);
    }
    const end = performance.now();

    const totalMs = Math.max(end - start, 0.001);
    const avgMs = totalMs / count;
    const opsPerSec = Math.round((count / totalMs) * 1000);

    return {
        count,
        engine: engineName,
        totalMs: Number(totalMs.toFixed(2)),
        avgMs: Number(avgMs.toFixed(4)),
        opsPerSec,
    };
}

/**
 * Run suite of standard benchmarks (100, 1,000, 10,000 cases).
 */
export function runBenchmarkSuite() {
    console.log('');
    console.log('===================================================');
    console.log("   FARĀ'IḌ CALCULATOR — PERFORMANCE BENCHMARK");
    console.log('===================================================');
    console.log('');

    const tiers = [100, 1000, 10000];
    const results = [];

    for (const count of tiers) {
        const res = runBenchmark(count, 'shafii');
        results.push(res);
        console.log(` ⚡ ${count.toLocaleString().padStart(6)} cases : ${res.totalMs.toFixed(1).padStart(7)} ms | ${res.avgMs.toFixed(4)} ms/case | ${res.opsPerSec.toLocaleString().padStart(8)} ops/sec`);
    }

    console.log('');
    let rating = 'Excellent';
    const ops10k = results.find(r => r.count === 10000)?.opsPerSec || 0;
    if (ops10k < 1000) rating = 'Needs Optimization';
    else if (ops10k < 5000) rating = 'Good';
    else rating = 'Exceptional';

    console.log(` Performance Rating : ${rating}`);
    console.log('===================================================\n');

    return { results, rating };
}
