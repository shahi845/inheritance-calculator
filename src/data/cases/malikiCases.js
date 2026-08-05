/**
 * malikiCases.js — Curated Mālikī sample cases for the learning platform.
 *
 * Key Mālikī distinctions:
 * - Mushtarikah (Ḥimariyyah): maternal siblings share with full siblings when husband + mother present
 * - Radd: applied to blood heirs (same as Ḥanafī/Ḥanbalī, but Mālikī also gives Radd to spouse in some versions)
 * - Dhawu al-Arḥām: Mālikī does NOT give inheritance to dhawu al-arḥām — goes to Bayt al-Māl
 * - Grandfather: Mālikī gives grandfather a choice similar to Shāfiʿī but with distinct rules
 */

export const malikiCases = [

    // ─── MUSHTARIKAH (ḤIMARIYYAH) ─────────────────────────────────────────────

    {
        id: 'maliki-001',
        madhhab: 'maliki',
        title: 'Mushtarikah — Husband + Mother + Maternal Brothers + Full Brother',
        description: 'A woman dies leaving her husband, mother, two maternal brothers, and one full brother. The famous Mushtarikah (Ḥimariyyah) case.',
        category: 'special',
        tags: ['husband', 'mother', 'maternalBrother', 'fullBrother'],
        heirs: { husband: 1, mother: 1, maternalBrother: 2, fullBrother: 1 },
        expectedOutcome: 'Husband → 1/2 | Mother → 1/6 | All siblings share 1/3 equally (maternal + full brothers share as if all maternal)',
        teachingNote: 'Mushtarikah: Mālikī (and Shāfiʿī) rule that the full brother is "joined" (shuraka) with the maternal brothers to share the 1/3 equally — because he shares the same mother. Without this rule, the full brother as ʿaṣabah gets nothing from 1/2+1/6=2/3. He protests: "we share the same mother!" Hence the exception. Ḥanbalī rejects this.'
    },

    {
        id: 'maliki-002',
        madhhab: 'maliki',
        title: 'Mushtarikah — With Two Full Brothers',
        description: 'A woman dies leaving her husband, mother, one maternal brother, and two full brothers.',
        category: 'special',
        tags: ['husband', 'mother', 'maternalBrother', 'fullBrother'],
        heirs: { husband: 1, mother: 1, maternalBrother: 1, fullBrother: 2 },
        expectedOutcome: 'Husband → 1/2 | Mother → 1/6 | All 3 siblings share 1/3 equally',
        teachingNote: 'The Mushtarikah applies whenever: husband (or wife) + mother + maternal siblings + full siblings are present simultaneously. All siblings share the maternal siblings\' fixed 1/3 together regardless of their type.'
    },

    // ─── RADD CASES ────────────────────────────────────────────────────────────

    {
        id: 'maliki-003',
        madhhab: 'maliki',
        title: 'Radd — Mother + Daughter',
        description: 'A man dies leaving his mother and one daughter — Mālikī Radd case.',
        category: 'radd',
        tags: ['mother', 'daughter'],
        heirs: { mother: 1, daughter: 1 },
        expectedOutcome: 'Daughter → 1/2 + Radd portion | Mother → 1/6 + Radd portion | Shared proportionally (3:1)',
        teachingNote: 'Mālikī applies Radd to blood heirs (mother and daughter) but NOT to the spouse. The remaining 1/3 after fixed shares returns to them in the ratio 3:1 (daughter:mother).'
    },

    {
        id: 'maliki-004',
        madhhab: 'maliki',
        title: 'Radd with Spouse Present',
        description: 'A man dies leaving his wife and his mother — testing Radd with a spouse.',
        category: 'radd',
        tags: ['wife', 'mother'],
        heirs: { wife: 1, mother: 1 },
        expectedOutcome: 'Wife → 1/4 (fixed, no Radd) | Mother → 3/4 (1/3 fixed + Radd of 5/12)',
        teachingNote: 'Under Mālikī, Radd goes to blood heirs only — not to spouses. The wife takes her fixed 1/4 with no increase, and the mother receives the entire remaining 3/4 via Radd.'
    },

    // ─── GRANDFATHER CASES ─────────────────────────────────────────────────────

    {
        id: 'maliki-005',
        madhhab: 'maliki',
        title: 'Grandfather + Brothers (Mālikī)',
        description: 'A man dies leaving a grandfather and two full brothers.',
        category: 'grandfather',
        tags: ['paternalGrandfather', 'fullBrother'],
        heirs: { paternalGrandfather: 1, fullBrother: 2 },
        expectedOutcome: 'Grandfather → 1/3 | Brothers → 2/3 (Mālikī Muqāsamah)',
        teachingNote: 'MĀLIKĪ DIFFERENCE: Mālikī agrees with Shāfiʿī that the grandfather shares with brothers (not like Ḥanafī who gives grandfather everything). Grandfather takes the better of 1/3 or Muqāsamah. With 2 brothers: Muqāsamah = 1/3, same result.'
    },

    {
        id: 'maliki-006',
        madhhab: 'maliki',
        title: 'Grandfather + Sister (Mālikī)',
        description: 'A man dies leaving a grandfather and one full sister.',
        category: 'grandfather',
        tags: ['paternalGrandfather', 'fullSister'],
        heirs: { paternalGrandfather: 1, fullSister: 1 },
        expectedOutcome: 'Grandfather → 1/2 (Muqāsamah) | Full Sister → 1/2',
        teachingNote: 'Grandfather and sister: Muqāsamah gives grandfather 1/2. Mālikī applies grandfather-sibling sharing rules, though sister inherits 1/2 as her fixed share plus grandfather takes residue — the interaction is complex and worth exploring in the calculator.'
    },

    // ─── BASIC CASES ──────────────────────────────────────────────────────────

    {
        id: 'maliki-007',
        madhhab: 'maliki',
        title: 'Husband + Two Daughters',
        description: 'A man dies leaving a husband and two daughters.',
        category: 'basic',
        tags: ['husband', 'daughter'],
        heirs: { husband: 1, daughter: 2 },
        expectedOutcome: 'Husband → 1/4 | Daughters → 2/3 (shared) | Radd to daughters: they absorb the 1/12 surplus',
        teachingNote: 'Total = 1/4 + 2/3 = 11/12. Under Mālikī, the remaining 1/12 goes back to the daughters (not the husband and not Bayt al-Māl). This illustrates how Mālikī Radd benefits the blood heirs.'
    },

    {
        id: 'maliki-008',
        madhhab: 'maliki',
        title: 'Father + Daughter',
        description: 'A man dies leaving his father and one daughter.',
        category: 'basic',
        tags: ['father', 'daughter'],
        heirs: { father: 1, daughter: 1 },
        expectedOutcome: 'Daughter → 1/2 | Father → 1/6 (fixed) + 1/3 (residue) = 1/2',
        teachingNote: 'Father and daughter each take exactly 1/2 — the father gets his 1/6 fixed share plus the remaining 1/3 as residuary. This elegant split is the same across all schools.'
    },

    {
        id: 'maliki-009',
        madhhab: 'maliki',
        title: 'Wife + Son',
        description: 'A man dies leaving his wife and one son.',
        category: 'basic',
        tags: ['wife', 'son'],
        heirs: { wife: 1, son: 1 },
        expectedOutcome: 'Wife → 1/8 | Son → 7/8 (residue)',
        teachingNote: 'Son reduces wife from 1/4 to 1/8. Son takes remaining 7/8 as residuary. Basic but important — same across all schools.'
    },

    // ─── SISTERS CASES ─────────────────────────────────────────────────────────

    {
        id: 'maliki-010',
        madhhab: 'maliki',
        title: 'Two Full Sisters',
        description: 'A man dies leaving two full sisters and no other heirs.',
        category: 'basic',
        tags: ['fullSister'],
        heirs: { fullSister: 2 },
        expectedOutcome: 'Full Sisters → 2/3 collectively | Radd → remaining 1/3 returns to them',
        teachingNote: 'Two or more full sisters share the fixed 2/3. Under Mālikī, the remaining 1/3 is returned to them via Radd. Each sister ends up with 1/2 of the estate.'
    },

    {
        id: 'maliki-011',
        madhhab: 'maliki',
        title: 'Full Sisters + Paternal Sisters',
        description: 'A man dies leaving two full sisters and two paternal sisters.',
        category: 'special',
        tags: ['fullSister', 'paternalSister'],
        heirs: { fullSister: 2, paternalSister: 2 },
        expectedOutcome: 'Full Sisters → 2/3 | Paternal Sisters → Blocked (2/3 ceiling reached)',
        teachingNote: 'The paternal sisters are blocked here: full sisters have already consumed the entire 2/3 ceiling for female kin. Paternal sisters only inherit (1/6 to complete 2/3) if there is exactly one full sister.'
    },

    {
        id: 'maliki-012',
        madhhab: 'maliki',
        title: 'One Full Sister + Paternal Sister',
        description: 'A man dies leaving one full sister and one paternal sister.',
        category: 'special',
        tags: ['fullSister', 'paternalSister'],
        heirs: { fullSister: 1, paternalSister: 1 },
        expectedOutcome: 'Full Sister → 1/2 | Paternal Sister → 1/6 (completing 2/3)',
        teachingNote: 'One full sister takes 1/2, and the paternal sister takes 1/6 to bring the total to 2/3. This is called "completing the two-thirds" — same principle as son\'s daughter + daughter (case shafii-019).'
    },

    // ─── ʿAWL ─────────────────────────────────────────────────────────────────

    {
        id: 'maliki-013',
        madhhab: 'maliki',
        title: 'ʿAwl — Full ʿAwl Case',
        description: 'A man dies leaving a wife, two daughters, father, and mother.',
        category: 'awl',
        tags: ['wife', 'daughter', 'father', 'mother'],
        heirs: { wife: 1, daughter: 2, father: 1, mother: 1 },
        expectedOutcome: 'ʿAwl: denominator expands from 12 to 13',
        teachingNote: 'ʿAwl is applied identically in Mālikī as in other schools. All shares are reduced proportionally when fixed shares overflow 100%.'
    },

    // ─── CHILDREN + PARENTS ────────────────────────────────────────────────────

    {
        id: 'maliki-014',
        madhhab: 'maliki',
        title: 'Parents + Son',
        description: 'A man dies leaving both parents and one son.',
        category: 'basic',
        tags: ['father', 'mother', 'son'],
        heirs: { father: 1, mother: 1, son: 1 },
        expectedOutcome: 'Father → 1/6 | Mother → 1/6 | Son → 2/3 (residue)',
        teachingNote: 'The son reduces both parents to their fixed 1/6 shares and takes the remaining 2/3 as residuary. Classic three-party split, identical across all schools.'
    },

    {
        id: 'maliki-015',
        madhhab: 'maliki',
        title: 'Parents Only (No Children)',
        description: 'A man dies leaving only his parents.',
        category: 'basic',
        tags: ['father', 'mother'],
        heirs: { father: 1, mother: 1 },
        expectedOutcome: 'Mother → 1/3 | Father → 2/3 (residue)',
        teachingNote: 'With no children or siblings, mother takes 1/3. The father takes the remaining 2/3 as residuary (2:1 ratio with mother). This is Qur\'an 4:11.'
    },

];
