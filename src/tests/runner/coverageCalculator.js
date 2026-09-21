/**
 * coverageCalculator.js — Computes rule and category coverage statistics for the test suite.
 */

export function calculateCoverage(suiteResults) {
    const categories = [
        { key: 'fixedShares', label: 'Fixed Shares (Furūḍ)', suites: ['Fixed Shares (Aṣḥāb al-Furūḍ)'] },
        { key: 'blocking', label: 'Blocking (Ḥajb)', suites: ['Blocking (Ḥajb)'] },
        { key: 'awl', label: 'ʿAwl (Proportional Reduction)', suites: ["ʿAwl (Proportional Reduction)"] },
        { key: 'radd', label: 'Radd (Redistribution)', suites: ['Radd (Redistribution)'] },
        { key: 'grandfather', label: 'Grandfather with Siblings', suites: ['Paternal Grandfather with Siblings'] },
        { key: 'dhawuAlArham', label: 'Dhawū al-Arḥām (Distant Kindred)', suites: ['Dhawū al-Arḥām (Distant Kindred)'] },
        { key: 'crossMadhhab', label: 'Cross-Madhhab Parity', suites: ['Madhhab Comparison (Cross-School Divergences)'] },
        { key: 'regression', label: 'Golden Regression', suites: ['Regression (Golden Snapshots)'] }
    ];

    const coverage = [];
    let totalTargetSuites = 0;
    let coveredSuites = 0;

    for (const cat of categories) {
        const matchingResults = suiteResults.filter(s => cat.suites.includes(s.name));
        const total = matchingResults.reduce((sum, r) => sum + r.total, 0);
        const passed = matchingResults.reduce((sum, r) => sum + r.passed, 0);
        const pct = total > 0 ? Math.round((passed / total) * 100) : 0;

        totalTargetSuites++;
        if (pct >= 80) coveredSuites++;

        coverage.push({
            key: cat.key,
            label: cat.label,
            total,
            passed,
            percentage: pct,
            status: pct === 100 ? 'Full' : pct >= 80 ? 'High' : 'Partial'
        });
    }

    const overallCoveragePct = Math.round((coveredSuites / totalTargetSuites) * 100);

    return {
        categories: coverage,
        overallCoveragePct
    };
}
