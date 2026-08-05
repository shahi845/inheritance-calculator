# Guide: Adding New Verified Inheritance Cases

This guide explains step-by-step how to add verified classical inheritance test cases to the Farā'iḍ test suite.

---

## 📌 Test Case Format

Every test case object must conform to the following schema:

```javascript
{
    name: "Short descriptive name (e.g. Al-Minbariyyah)",
    input: {
        wife: 1,
        daughter: 2,
        father: 1,
        mother: 1
    },
    expected: {
        wife: "3/27",
        daughter: "16/27",
        father: "4/27",
        mother: "4/27"
    },
    options: {                     // Optional school overrides
        raddMode: "returnToHeirs",
        dhawuAlArhamMode: "enabledWhenNoBaytulMal"
    }
}
```

---

## 🔑 Canonical Heir Key Names

Use canonical heir keys in `input` and `expected` objects:

| Category | Canonical Key Name | Allowed Alternate (Legacy Key) |
|---|---|---|
| **Spouses** | `husband`, `wife` | - |
| **Parents** | `father`, `mother` | - |
| **Grandparents** | `paternalGrandfather`, `paternalGrandmother`, `maternalGrandmother`, `maternalGrandfather` | `grandfather`, `grandmother` |
| **Children** | `son`, `daughter` | - |
| **Grandchildren** | `sonsSon`, `sonsDaughter` | `grandson`, `granddaughter` |
| **Full Siblings** | `fullBrother`, `fullSister` | `brother`, `sister` |
| **Paternal Siblings** | `paternalBrother`, `paternalSister` | `consanguineBrother` |
| **Maternal Siblings** | `maternalBrother`, `maternalSister` | `uterineBrother` |
| **Nephews** | `fullBrothersSon`, `paternalBrothersSon` | `sonOfFullBrother` |
| **Uncles & Cousins** | `fullPaternalUncle`, `paternalUncle`, `fullPaternalUnclesSon`, `paternalUnclesSon` | `uncle` |
| **Distant Kindred** | `daughtersSon`, `daughtersDaughter`, `sistersSon`, `sistersDaughter`, `maternalUncle`, `maternalAunt`, `paternalAunt` | `daughterSon`, `sisterSon` |

---

## 📁 Where to Add Your Test Case

1. **Shāfiʿī Verified Cases**: Add to `src/tests/shafii/verified/` (e.g., `spouse.test.js`, `awl.test.js`, `radd.test.js`, `blocking.test.js`, `complex.test.js`).
2. **Ḥanafī School Cases**: Add to `src/tests/hanafi/sampleCases/hanafiSampleCases.js`.
3. **Mālikī School Cases**: Add to `src/tests/maliki/malikiCases.test.js`.
4. **Ḥanbalī School Cases**: Add to `src/tests/hanbali/hanbaliCases.test.js`.
5. **Jumhūr Cases**: Add to `src/tests/jumhur/jumhurCases.test.js`.
6. **Regression Snapshots**: Add to `src/tests/categories/regression.test.js`.

---

## 🧪 Verification Step-by-Step

After adding a test case:

1. Run the test suite:
```bash
npm test
```
2. If your test fails, check:
   - Are the expected fractions simplified? (e.g. `1/2` instead of `2/4`).
   - Did ʿAwl change the denominator?
   - Did Radd return surplus to blood sharers?
   - Is an heir blocked who was expected to receive a share?
3. Check the visual report in browser (`npm run dev` and click **🧪 Run Tests**).
