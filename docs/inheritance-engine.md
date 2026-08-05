# Inheritance Calculation Engine Specification (`src/engine/`)

The **Farā'iḍ Inheritance Engine** is a deterministic, multi-phase calculator designed to solve Islamic estate division according to classical jurisprudence (Fiqh al-Farā'iḍ).

---

## 📐 Exact Fraction Arithmetic (`src/utils/fractions.js`)

Floating-point numbers (`0.3333...`) are strictly forbidden in calculation logic to eliminate rounding errors. All shares are calculated using **Exact Rational Arithmetic**:

```typescript
type Fraction = {
    num: number; // Numerator
    den: number; // Denominator (always > 0)
}
```

### Fraction Operations
- **Addition**: $\frac{a}{b} + \frac{c}{d} = \frac{ad + bc}{bd}$ (simplified via $\gcd$)
- **Subtraction**: $\frac{a}{b} - \frac{c}{d} = \frac{ad - bc}{bd}$ (simplified via $\gcd$)
- **Multiplication**: $\frac{a}{b} \times \frac{c}{d} = \frac{ac}{bd}$ (simplified via $\gcd$)
- **Reduction**: Numerator and denominator are reduced after every operation: $\gcd(|num|, den)$.

---

## 🔄 6-Phase Pipeline Architecture (`calculateInheritance.js`)

Each calculation follows a 6-step sequential pipeline:

```text
[Input] → Phase 0 (Normalize & Validate)
        → Phase 1 (Blocking / Ḥajb)
        → Phase 2 (Fixed Shares / Furūḍ)
        → Phase 3 (ʿAwl Adjustment)
        → Phase 4 (Residuary / ʿAṣabah)
        → Phase 5 (Radd / Dhawū al-Arḥām)
        → Phase 6 (Result Verification & Assembly) → [CalcResult]
```

### Phase 0: Input Normalization (`normalizeInput.js` & `buildContext.js`)
- Maps user form keys (`grandfather`, `brother`, `sister`) to canonical keys (`paternalGrandfather`, `fullBrother`, `fullSister`).
- Evaluates family tree flags: `hasDescendants`, `hasMaleDescendants`, `hasFather`, `siblingCount`.

### Phase 1: Total & Partial Exclusion (`applyBlocking.js`)
- Applies **Ḥajb al-Ḥirmān** (total exclusion): e.g. Son blocks Grandson, Father blocks Grandfather, Mother blocks all Grandmothers.
- Identifies **Sharers with Partial Exclusion** (Ḥajb al-Nuqṣān): e.g. Husband drops from $1/2$ to $1/4$ if descendants exist; Mother drops from $1/3$ to $1/6$ if descendants or $\ge 2$ siblings exist.

### Phase 2: Quranic Fixed Shares (`assignFixedShares.js`)
- Evaluates the 12 primary fixed-share heirs (*Aṣḥāb al-Furūḍ*):
  - Husband ($1/2$ or $1/4$)
  - Wife / Wives ($1/4$ or $1/8$ shared)
  - Father ($1/6$ fixed share if descendants exist)
  - Mother ($1/3$ or $1/6$, or $1/3$ of remainder in Gharrawiyyatayn)
  - Paternal Grandfather ($1/6$ fixed share if male descendants exist)
  - Paternal & Maternal Grandmothers ($1/6$ shared)
  - Daughter / Daughters ($1/2$ or $2/3$ shared)
  - Son's Daughter / Daughters ($1/2$, $2/3$, or $1/6$ to complete $2/3$)
  - Full Sister / Sisters ($1/2$ or $2/3$ shared)
  - Paternal Sister / Sisters ($1/2$, $2/3$, or $1/6$ to complete $2/3$)
  - Maternal Brother / Sister ($1/6$ single, $1/3$ shared)

### Phase 3: ʿAwl Proportional Reduction (`applyAwl.js`)
- Triggered when $\sum \text{Shares} > 1$.
- Multiplies each share by a common denominator and raises the base denominator to equal the sum of numerators.
- **Example**: Base 6 $\to$ 7, 8, 9, 10; Base 12 $\to$ 13, 15, 17; Base 24 $\to$ 27 (Al-Minbariyyah).

### Phase 4: Residuary Agnates (`assignResiduaries.js`)
- If $\sum \text{Shares} < 1$, the remaining estate ($\text{Residue} = 1 - \sum \text{Shares}$) is distributed to agnatic relatives (*ʿAṣabah bi-Nafsih*):
  1. Descendants (Son, Son's Son)
  2. Ascendants (Father, Paternal Grandfather)
  3. Male Siblings (Full Brother, Paternal Brother)
  4. Male Nephews (Full Brother's Son, Paternal Brother's Son)
  5. Male Paternal Uncles & Cousins
- Female heirs become residuaries with their male counterparts (*ʿAṣabah bi-Ghayrih*) in a 2:1 ratio (Son:Daughter, Brother:Sister).
- Full Sisters become residuaries with daughters (*ʿAṣabah maʿa al-Ghayr*).

### Phase 5: Radd & Distant Kindred (`applyRadd.js` & `assignDistantKindred.js`)
- If no residuaries exist and $\sum \text{Shares} < 1$:
  - **Radd**: The surplus is redistributed proportionally among non-spouse blood sharers.
  - **Dhawū al-Arḥām**: If no blood sharers or residuaries exist, distant kindred (e.g. Daughter's children, Maternal Grandfather, Maternal Uncle) inherit based on class ordering or parenting rules (*Tanzīl*).

### Phase 6: Result Assembly (`calculateInheritance.js`)
- Appends blocked heirs with status `'Blocked'` and zero share.
- Calculates monetary amounts if an estate value is supplied.
- Validates structural integrity before returning `CalcResult`.

---

## 📊 Result Object Schema (`CalcResult`)

```javascript
{
    shares: [
        {
            heir: "daughter",
            name: "Daughter",
            count: 2,
            baseShare: { num: 2, den: 3 },
            adjustedShare: { num: 8, den: 11 },
            status: "Sharer",
            reason: "Two or more daughters take 2/3, reduced by ʿAwl"
        }
    ],
    messages: [
        "ʿAwl applied: denominator raised from 24 to 27."
    ],
    warnings: [],
    blocked: { sonsDaughter: true },
    context: {
        awlApplied: true,
        raddApplied: false,
        grandfatherWithSiblings: false
    }
}
```
