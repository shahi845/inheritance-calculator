/**
 * hanafiCases.js — Curated Ḥanafī sample cases for the learning platform.
 *
 * Key Ḥanafī distinctions from Shāfiʿī:
 * - Grandfather + Brothers: grandfather is prioritized (blocks brothers under most scenarios)
 * - Radd: returned to blood sharers (never to Bayt al-Māl)
 * - Dhawu al-Arḥām: inherit when no aṣḥāb al-furūḍ or ʿaṣabah remain
 * - Sisters with daughters: in Ḥanafī, sister receives fixed share (1/2) — ʿaṣabah maʿ al-ghayr is NOT applied
 */

export const hanafiCases = [

    // ─── BASIC CASES ──────────────────────────────────────────────────────────

    {
        id: 'hanafi-001',
        madhhab: 'hanafi',
        title: 'Wife + Son + Father',
        description: 'A man dies leaving his wife, one son, and his father.',
        category: 'basic',
        tags: ['wife', 'son', 'father'],
        heirs: { wife: 1, son: 1, father: 1 },
        expectedOutcome: 'Wife → 1/8 | Father → 1/6 | Son → Residue — same as Shāfiʿī',
        teachingNote: 'This core case is identical across all four schools: son reduces wife to 1/8, father gets his fixed 1/6, son takes residue.'
    },

    {
        id: 'hanafi-002',
        madhhab: 'hanafi',
        title: 'Radd to Blood Heirs (Mother + Daughter)',
        description: 'A man dies leaving his mother and one daughter. Ḥanafī applies Radd automatically.',
        category: 'radd',
        tags: ['mother', 'daughter'],
        heirs: { mother: 1, daughter: 1 },
        expectedOutcome: 'Daughter → 1/2 + Radd | Mother → 1/6 + Radd | Total redistributed proportionally',
        teachingNote: 'Unlike Shāfiʿī (which sends surplus to Bayt al-Māl), Ḥanafī returns (Radd) the surplus to blood sharers proportionally. The daughter and mother effectively share the whole estate in their ratio 3:1.'
    },

    {
        id: 'hanafi-003',
        madhhab: 'hanafi',
        title: 'Radd — Three Daughters Only',
        description: 'A man dies leaving only three daughters.',
        category: 'radd',
        tags: ['daughter'],
        heirs: { daughter: 3 },
        expectedOutcome: 'Daughters → 2/3 + Radd of 1/3 → effectively 100% shared equally',
        teachingNote: 'Ḥanafī sends the surplus 1/3 back to the daughters. Each daughter receives 1/3 of the total estate. Radd is automatic under Ḥanafī without needing to toggle any settings.'
    },

    // ─── GRANDFATHER CASES (KEY ḤANAFĪ DISTINCTION) ──────────────────────────

    {
        id: 'hanafi-004',
        madhhab: 'hanafi',
        title: 'Grandfather + Full Brother (Ḥanafī View)',
        description: 'A man dies leaving only a paternal grandfather and a full brother — a major difference case.',
        category: 'grandfather',
        tags: ['paternalGrandfather', 'fullBrother'],
        heirs: { paternalGrandfather: 1, fullBrother: 1 },
        expectedOutcome: 'Grandfather → entire estate | Full Brother → Blocked',
        teachingNote: 'CRITICAL DIFFERENCE: Under Ḥanafī, the grandfather acts exactly like a father and completely blocks all brothers and sisters. Compare with Shāfiʿī (case shafii-016) where the grandfather shares with the brother via Muqāsamah.'
    },

    {
        id: 'hanafi-005',
        madhhab: 'hanafi',
        title: 'Grandfather + Multiple Brothers (Ḥanafī)',
        description: 'A man dies leaving his grandfather and three full brothers.',
        category: 'grandfather',
        tags: ['paternalGrandfather', 'fullBrother'],
        heirs: { paternalGrandfather: 1, fullBrother: 3 },
        expectedOutcome: 'Grandfather → entire estate | All Brothers → Blocked',
        teachingNote: 'Regardless of the number of brothers, grandfather blocks all of them in the Ḥanafī school. This contrasts with Shāfiʿī/Mālikī/Ḥanbalī where grandfather and brothers share under certain conditions.'
    },

    {
        id: 'hanafi-006',
        madhhab: 'hanafi',
        title: 'Grandfather + Wife + Brothers',
        description: 'A man dies leaving his grandfather, a wife, and two full brothers.',
        category: 'grandfather',
        tags: ['paternalGrandfather', 'wife', 'fullBrother'],
        heirs: { paternalGrandfather: 1, wife: 1, fullBrother: 2 },
        expectedOutcome: 'Wife → 1/4 | Grandfather → 3/4 (residue) | Brothers → Blocked',
        teachingNote: 'Even with a wife present taking her 1/4, the grandfather still blocks the brothers entirely and takes the residue under Ḥanafī.'
    },

    // ─── DHAWU AL-ARḤĀM ────────────────────────────────────────────────────────

    {
        id: 'hanafi-007',
        madhhab: 'hanafi',
        title: "Daughter's Son (Dhawu al-Arḥām)",
        description: "A man dies leaving only his daughter's son (maternal grandson) — a dhawu al-arḥām heir.",
        category: 'special',
        tags: ['daughtersSon'],
        heirs: { daughtersSon: 1 },
        expectedOutcome: "Daughter's Son → inherits entire estate as dhawu al-arḥām",
        teachingNote: "The daughter's son is not a regular heir — he is from the distant kin (dhawu al-arḥām). Under Ḥanafī, he inherits when no primary heirs exist. Under Shāfiʿī, he does not inherit and estate goes to Bayt al-Māl."
    },

    {
        id: 'hanafi-008',
        madhhab: 'hanafi',
        title: "Maternal Uncle (Dhawu al-Arḥām)",
        description: 'A man dies leaving only his maternal uncle.',
        category: 'special',
        tags: ['maternalUncle'],
        heirs: { maternalUncle: 1 },
        expectedOutcome: 'Maternal Uncle → inherits as dhawu al-arḥām',
        teachingNote: 'Maternal uncles are dhawu al-arḥām — not in the ʿaṣabah chain. Ḥanafī gives them inheritance rights when no primary heirs exist. Shāfiʿī would direct estate to Bayt al-Māl instead.'
    },

    // ─── PATERNAL SIBLINGS ────────────────────────────────────────────────────

    {
        id: 'hanafi-009',
        madhhab: 'hanafi',
        title: 'Full Brothers — Multiple',
        description: 'A man dies leaving three full brothers and no other heirs.',
        category: 'basic',
        tags: ['fullBrother'],
        heirs: { fullBrother: 3 },
        expectedOutcome: 'All three brothers share the estate equally as ʿaṣabah',
        teachingNote: 'Multiple full brothers share the estate equally among themselves as residuaries (ʿaṣabah). Each receives 1/3.'
    },

    {
        id: 'hanafi-010',
        madhhab: 'hanafi',
        title: 'Full Sister + Daughter (Ḥanafī — Fixed Share)',
        description: 'A man dies leaving one daughter and one full sister.',
        category: 'special',
        tags: ['daughter', 'fullSister'],
        heirs: { daughter: 1, fullSister: 1 },
        expectedOutcome: 'Daughter → 1/2 | Full Sister → 1/2 (her fixed share) | No surplus',
        teachingNote: 'ḤANAFĪ DIFFERENCE: Unlike Shāfiʿī where the full sister becomes ʿaṣabah maʿ al-ghayr, under Ḥanafī the sister takes her own fixed share of 1/2. The two shares exactly sum to 1, so no surplus or deficit.'
    },

    // ─── ʿAWL CASES ───────────────────────────────────────────────────────────

    {
        id: 'hanafi-011',
        madhhab: 'hanafi',
        title: 'ʿAwl — Husband + 2 Daughters + Father + Mother',
        description: 'A man dies leaving a husband, two daughters, his father, and his mother.',
        category: 'awl',
        tags: ['husband', 'daughter', 'father', 'mother'],
        heirs: { husband: 1, daughter: 2, father: 1, mother: 1 },
        expectedOutcome: 'ʿAwl applied — Ḥanafī and Shāfiʿī agree on this case',
        teachingNote: 'ʿAwl is applied identically across all schools — fractional overflow forces proportional reduction. This is one area of unanimous scholarly consensus.'
    },

    // ─── GRANDMOTHER CASES ─────────────────────────────────────────────────────

    {
        id: 'hanafi-012',
        madhhab: 'hanafi',
        title: 'Paternal Grandmother + Father',
        description: 'A man dies leaving his paternal grandmother and his father.',
        category: 'blocking',
        tags: ['paternalGrandmother', 'father'],
        heirs: { paternalGrandmother: 1, father: 1 },
        expectedOutcome: 'Father → residue (entire estate) | Grandmother → Blocked by father',
        teachingNote: 'The paternal grandmother is completely blocked by the father in all schools. She only inherits when neither father nor mother is present.'
    },

    {
        id: 'hanafi-013',
        madhhab: 'hanafi',
        title: 'Maternal Grandmother + Mother',
        description: 'A man dies leaving his maternal grandmother and his mother.',
        category: 'blocking',
        tags: ['maternalGrandmother', 'mother'],
        heirs: { maternalGrandmother: 1, mother: 1 },
        expectedOutcome: 'Mother → residue or fixed share | Grandmother → Blocked by mother',
        teachingNote: 'The maternal grandmother is blocked by the mother in all schools. Grandmothers only inherit (at 1/6) when no closer ascendant female (mother) exists.'
    },

    {
        id: 'hanafi-014',
        madhhab: 'hanafi',
        title: 'Maternal Grandmother Alone',
        description: 'A man dies leaving only his maternal grandmother.',
        category: 'basic',
        tags: ['maternalGrandmother'],
        heirs: { maternalGrandmother: 1 },
        expectedOutcome: 'Maternal Grandmother → 1/6 | Radd → remaining 5/6 returned to her (Ḥanafī)',
        teachingNote: 'Grandmother receives her fixed 1/6 share. Under Ḥanafī, the surplus 5/6 is returned to her via Radd, so she effectively inherits the whole estate. Under Shāfiʿī, the 5/6 goes to Bayt al-Māl.'
    },

    {
        id: 'hanafi-015',
        madhhab: 'hanafi',
        title: 'Blocked Sisters (Daughter Present)',
        description: 'A man dies leaving one son, one daughter, and two full sisters.',
        category: 'blocking',
        tags: ['son', 'daughter', 'fullSister'],
        heirs: { son: 1, daughter: 1, fullSister: 2 },
        expectedOutcome: 'Son + Daughter → share residue 2:1 | Full Sisters → Blocked by son',
        teachingNote: 'Sisters (full or paternal) are blocked by the son. The presence of a son (or son\'s son) removes all sisters from inheritance entirely as residuaries, since the son himself is higher priority ʿaṣabah.'
    },

];
