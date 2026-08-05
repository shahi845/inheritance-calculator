/**
 * munasakhat.test.js — Munāsakhat (inheritance-on-inheritance) test suite.
 *
 * Source: munasakhat/verified/simpleMunasakhat.test.js
 */

import { simpleMunasakhatTests } from '../munasakhat/verified/simpleMunasakhat.test.js';
import { nStageMunasakhatTests } from '../munasakhat/verified/nStageMunasakhat.test.js';
import { calculateMunasakhat } from '../../features/munasakhat/calculateMunasakhat.js';

function runMunasakhatCase(testCase) {
    const errors = [];

    try {
        const result = calculateMunasakhat(testCase);
        const expected = testCase.expectedFinalShares || {};

        for (const [personId, expectedStr] of Object.entries(expected)) {
            const actualFraction = result.finalShares?.[personId];
            if (!actualFraction) {
                errors.push(`Missing final share for "${personId}"`);
                continue;
            }

            const parts  = String(expectedStr).split('/');
            const expNum = parseInt(parts[0], 10);
            const expDen = parts[1] ? parseInt(parts[1], 10) : 1;
            const { num: actNum, den: actDen } = actualFraction;

            if (actNum * expDen !== expNum * actDen) {
                errors.push(
                    `Share mismatch for "${personId}": expected ${expectedStr}, ` +
                    `got ${actNum}/${actDen}`
                );
            }
        }
    } catch (err) {
        errors.push(`CRASH: ${err.message}`);
    }

    return {
        passed: errors.length === 0,
        name:   `[${testCase.id}] (${testCase.madhhab}) Estate=${testCase.estate || 0}`,
        errors,
    };
}

const allTests = [...simpleMunasakhatTests, ...nStageMunasakhatTests];

const munasakhatTests = allTests.map(tc => ({
    name:     `[${tc.id}] (${tc.madhhab})`,
    input:    tc,
    expected: {},
    _munasakhat: true,
    _raw: tc,
}));

export const suite = {
    name:          'Munāsakhat (Inheritance-on-Inheritance)',
    engine:        'shafii',
    tests:         munasakhatTests,
    _customRunner: runMunasakhatCase,
};
