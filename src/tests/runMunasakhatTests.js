import { calculateMunasakhat } from '../features/munasakhat/calculateMunasakhat.js';
import { simpleMunasakhatTests } from './munasakhat/verified/simpleMunasakhat.test.js';

function runMunasakhatTests() {
  console.log("=========================================");
  console.log("      MUNASAKHAT TEST SUITE RUNNER       ");
  console.log("=========================================\n");

  let totalTests = 0;
  let passedTests = 0;

  simpleMunasakhatTests.forEach(testCase => {
    totalTests++;
    console.log(`Running Case: ${testCase.id} (${testCase.madhhab})`);

    try {
      const result = calculateMunasakhat(testCase);
      let casePassed = true;
      const errors = [];

      for (const [personId, expectedStr] of Object.entries(testCase.expectedFinalShares)) {
        const actualFraction = result.finalShares[personId];
        if (!actualFraction) {
          errors.push(`Missing share for ${personId}`);
          casePassed = false;
          continue;
        }

        // Parse expected fraction
        const [expNumStr, expDenStr] = expectedStr.split('/');
        const expNum = parseInt(expNumStr, 10);
        const expDen = parseInt(expDenStr, 10);

        const actNum = actualFraction.num;
        const actDen = actualFraction.den;

        const equivalent = (actNum * expDen === expNum * actDen);
        if (!equivalent) {
          errors.push(`Share mismatch for ${personId}: expected ${expectedStr}, got ${actNum}/${actDen}`);
          casePassed = false;
        } else {
          console.log(`  ✓ ${personId}: ${actNum}/${actDen} (matches ${expectedStr})`);
        }
      }

      if (casePassed) {
        console.log(`Result: Case ${testCase.id} PASSED!\n`);
        passedTests++;
      } else {
        console.log(`Result: Case ${testCase.id} FAILED!`);
        errors.forEach(err => console.log(`  - ${err}`));
        console.log();
      }
    } catch (err) {
      console.error(`Error running case ${testCase.id}:`, err);
      console.log();
    }
  });

  console.log("=========================================");
  console.log(`Summary: ${passedTests}/${totalTests} tests passed.`);
  console.log("=========================================");

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runMunasakhatTests();
