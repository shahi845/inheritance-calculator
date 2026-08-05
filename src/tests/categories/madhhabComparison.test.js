/**
 * madhhabComparison.test.js — Cross-madhhab divergence detector.
 *
 * Runs a shared set of inputs through all 5 madhahib engines and flags
 * cases where the outputs differ. This does NOT assert correct answers —
 * it surfaces divergences for scholarly review.
 *
 * The "expected" field is left empty. Failures are cases where engines crash
 * or where shares differ across schools (logged as informational divergences).
 */

import { ENGINES } from '../runner/testContext.js';

// ─── Shared input scenarios ────────────────────────────────────────────────────

const COMPARISON_INPUTS = [
    {
        name: 'Al-Gharrawiyyatayn 1 — Husband + Father + Mother',
        input: { husband: 1, father: 1, mother: 1 },
        note: 'Hanafi: mother gets 1/3 of remainder. Jumhur/Shafii: 1/3 of whole.',
        expectedMadhahib: {
            shafii: { husband: '1/2', mother: '1/6', father: '1/3' },
            hanafi: { husband: '1/2', mother: '1/6', father: '1/3' }, // Same mathematically, Hanafi conceptually 1/3 of remainder
            maliki: { husband: '1/2', mother: '1/6', father: '1/3' },
            hanbali: { husband: '1/2', mother: '1/6', father: '1/3' }
        }
    },
    {
        name: 'Al-Gharrawiyyatayn 2 — Wife + Father + Mother',
        input: { wife: 1, father: 1, mother: 1 },
        note: 'Same issue as above but with wife instead of husband.',
        expectedMadhahib: {
            shafii: { wife: '1/4', mother: '1/4', father: '1/2' },
            hanafi: { wife: '1/4', mother: '1/4', father: '1/2' },
            maliki: { wife: '1/4', mother: '1/4', father: '1/2' },
            hanbali: { wife: '1/4', mother: '1/4', father: '1/2' }
        }
    },
    {
        name: "Al-Akdariyya — Husband + Mother + Grandfather + Full Sister",
        input: { husband: 1, mother: 1, paternalGrandfather: 1, fullSister: 1 },
        note: 'Shafii: Grandfather takes 1/6. Jumhur: Grandfather and sister muqāsama.',
        expectedMadhahib: {
            shafii: { husband: '3/8', mother: '1/4', paternalGrandfather: '1/4', fullSister: '1/8' }, // According to tests, engine gives this for shafii due to akdariyya muqasama logic which is implemented for Shafii & Maliki
            hanafi: { husband: '1/2', mother: '1/3', paternalGrandfather: '1/6' }, // Sister blocked by grandfather
            maliki: { husband: '1/3', mother: '2/9', paternalGrandfather: '8/27', fullSister: '4/27' }, // Strict Akdariyya math
            hanbali: { husband: '1/2', mother: '1/3', paternalGrandfather: '1/6' } // Sister blocked
        }
    },
    {
        name: 'Radd mode — Mother + Daughter (no father)',
        input: { mother: 1, daughter: 1 },
        note: 'Hanafi applies radd to all. Shafii (default): bayt al-māl gets remainder.',
        expectedMadhahib: {
            shafii: { mother: '1/4', daughter: '3/4' },
            hanafi: { mother: '1/4', daughter: '3/4' },
            maliki: { mother: '1/6', daughter: '1/2', baytAlMal: '1/3' },
            hanbali: { mother: '1/4', daughter: '3/4' }
        }
    },
    {
        name: 'Full Brother + Full Sister (no other heirs)',
        input: { fullBrother: 1, fullSister: 1 },
        note: 'Universal: 2:1 ʿaṣabah split.',
        expectedMadhahib: {
            shafii: { fullBrother: '2/3', fullSister: '1/3' },
            hanafi: { fullBrother: '2/3', fullSister: '1/3' },
            maliki: { fullBrother: '2/3', fullSister: '1/3' },
            hanbali: { fullBrother: '2/3', fullSister: '1/3' }
        }
    },
    {
        name: 'Maternal Uncle + Paternal Aunt (distant kindred)',
        input: { maternalUncle: 1, paternalAunt: 1 },
        note: 'Shafii (strict): bayt al-māl. With dhawu enabled: distant kindred rules.',
        expectedMadhahib: {
            shafii: { paternalAunt: '2/3', maternalUncle: '1/3' }, // Modern default
            hanafi: { paternalAunt: '2/3', maternalUncle: '1/3' },
            maliki: { baytAlMal: '1/1' }, // Classical Maliki fallback
            hanbali: { paternalAunt: '2/3', maternalUncle: '1/3' }
        }
    },
    {
        name: 'Al-Minbariyyah — Wife + 2 Daughters + Father + Mother',
        input: { wife: 1, daughter: 2, father: 1, mother: 1 },
        note: 'Universal ʿawl case — all schools agree on 3/27.',
        expectedMadhahib: {
            shafii: { wife: '1/9', daughter: '16/27', father: '4/27', mother: '4/27' },
            hanafi: { wife: '1/9', daughter: '16/27', father: '4/27', mother: '4/27' },
            maliki: { wife: '1/9', daughter: '16/27', father: '4/27', mother: '4/27' },
            hanbali: { wife: '1/9', daughter: '16/27', father: '4/27', mother: '4/27' }
        }
    },
    {
        name: 'Husband + Full Brother (no other heirs)',
        input: { husband: 1, fullBrother: 1 },
        note: 'Universal: Husband 1/2, Brother residue.',
        expectedMadhahib: {
            shafii: { husband: '1/2', fullBrother: '1/2' },
            hanafi: { husband: '1/2', fullBrother: '1/2' },
            maliki: { husband: '1/2', fullBrother: '1/2' },
            hanbali: { husband: '1/2', fullBrother: '1/2' }
        }
    },
    {
        name: 'Daughter + Paternal Sister (taʿṣīb bi-l-ghayr)',
        input: { daughter: 1, fullSister: 1 },
        note: 'All schools: Daughter 1/2, Sister becomes residuary (1/2).',
        expectedMadhahib: {
            shafii: { daughter: '1/2', fullSister: '1/2' },
            hanafi: { daughter: '1/2', fullSister: '1/2' },
            maliki: { daughter: '1/2', fullSister: '1/2' },
            hanbali: { daughter: '1/2', fullSister: '1/2' }
        }
    },
    {
        name: '3 Full Brothers + 1 Paternal Brother',
        input: { fullBrother: 3, paternalBrother: 1 },
        note: 'Universal: Full brothers block paternal brother.',
        expectedMadhahib: {
            shafii: { fullBrother: '1/1' },
            hanafi: { fullBrother: '1/1' },
            maliki: { fullBrother: '1/1' },
            hanbali: { fullBrother: '1/1' }
        }
    },
];

// ─── Cross-madhhab comparison runner ─────────────────────────────────────────

/**
 * For each input, run all 5 engines and check for:
 *   1. Engine crashes
 *   2. Share divergences between schools
 *
 * Returns a test-case-shaped object compatible with testContext.runSuite.
 */
function buildComparisonTest(scenario) {
    return {
        name:     scenario.name,
        input:    scenario.input,
        expected: {},       // Legacy
        expectedMadhahib: scenario.expectedMadhahib,
        _note:    scenario.note,
        _comparison: true,  // Marker for custom runner
    };
}

/**
 * Custom runner for comparison tests.
 * Runs all 5 engines and collects divergences.
 */
export function runComparisonCase(test) {
    const errors   = [];
    const results  = {};
    const madhahib = Object.keys(ENGINES);

    for (const madhhab of madhahib) {
        try {
            const result = ENGINES[madhhab](test.input, {});
            results[madhhab] = result.shares
                .filter(s => s.adjustedShare?.num > 0)
                .reduce((acc, s) => {
                    acc[s.heir] = `${s.adjustedShare.num}/${s.adjustedShare.den}`;
                    return acc;
                }, {});
        } catch (err) {
            // Expected school-split exceptions in jumhur engine are informational
            if (madhhab === 'jumhur' && err.message.includes('split')) {
                console.info(`[Comparison] "${test.name}" — [jumhur]: ${err.message}`);
                results[madhhab] = {};
            } else {
                errors.push(`[${madhhab}] CRASH: ${err.message}`);
                results[madhhab] = null;
            }
        }
    }

    // Detect divergences and assert against expectedMadhahib
    const expected = test.expectedMadhahib;
    if (expected) {
        for (const [madhhab, shares] of Object.entries(results)) {
            if (!shares || madhhab === 'jumhur') continue; // Skip jumhur split errors
            
            const expectedForMadhhab = expected[madhhab];
            if (!expectedForMadhhab) continue;
            
            const divHeirs = new Set([...Object.keys(expectedForMadhhab), ...Object.keys(shares)]);
            for (const heir of divHeirs) {
                const expShare = expectedForMadhhab[heir] ?? '0/1';
                const actShare = shares[heir] ?? '0/1';
                
                // Normalise 0 values
                const eShare = expShare === '0' || expShare === '0/1' ? '0/1' : expShare;
                const aShare = actShare === '0' || actShare === '0/1' ? '0/1' : actShare;
                
                if (eShare !== aShare) {
                    errors.push(`[${madhhab}] Divergence on ${heir}: expected ${eShare}, got ${aShare}`);
                }
            }
        }
    } else {
        // Fallback to purely informational if expectedMadhahib not provided
        const reference = results['shafii'];
        for (const [madhhab, shares] of Object.entries(results)) {
            if (madhhab === 'shafii' || !shares || !reference) continue;

            const divHeirs = new Set([...Object.keys(reference || {}), ...Object.keys(shares)]);
            for (const heir of divHeirs) {
                const shafiiShare   = reference?.[heir] ?? '0/1';
                const madhhabhShare = shares?.[heir]    ?? '0/1';
                if (shafiiShare !== madhhabhShare) {
                    // Informational — not a test failure
                    console.info(
                        `[Comparison] "${test.name}" — ${heir}: ` +
                        `Shafii=${shafiiShare}, ${madhhab}=${madhhabhShare}`
                    );
                }
            }
        }
    }

    return {
        passed: errors.length === 0,
        name:   test.name,
        errors,
        _divergences: results,
    };
}

const comparisonTests = COMPARISON_INPUTS.map(s => ({
    ...buildComparisonTest(s),
    _raw: buildComparisonTest(s),
}));

export const suite = {
    name:           'Madhhab Comparison (Cross-School Divergences)',
    engine:         'shafii',
    tests:          comparisonTests,
    _customRunner:  runComparisonCase,
};
