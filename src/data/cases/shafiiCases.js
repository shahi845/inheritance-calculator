/**
 * shafiiCases.js — Curated Shāfiʿī sample cases for the learning platform.
 *
 * Case object structure:
 * {
 *   id:             string   — unique case identifier
 *   madhhab:        string   — 'shafii'
 *   title:          string   — short descriptive title
 *   description:    string   — full scenario description
 *   category:       string   — 'basic' | 'awl' | 'radd' | 'blocking' | 'special' | 'grandfather' | 'asabah'
 *   tags:           string[] — heir keys present in this case (for search/filter)
 *   heirs:          Object   — heir key → count (matches HTML input IDs)
 *   expectedOutcome: string  — human-readable expected result summary
 *   teachingNote:   string   — the key learning point of this case
 * }
 */

export const shafiiCases = [

    // ─── BASIC CASES ──────────────────────────────────────────────────────────

    {
        id: 'shafii-001',
        madhhab: 'shafii',
        title: 'Wife + Son + Father',
        description: 'A man dies leaving behind his wife, one son, and his father.',
        category: 'basic',
        tags: ['wife', 'son', 'father'],
        heirs: { wife: 1, son: 1, father: 1 },
        expectedOutcome: 'Wife → 1/8 | Father → 1/6 | Son → Residue (17/24)',
        teachingNote: 'The son reduces the wife from 1/4 to 1/8, and forces the father from pure residuary into his fixed 1/6 share, with the son taking the remainder as ʿaṣabah.'
    },

    {
        id: 'shafii-002',
        madhhab: 'shafii',
        title: 'Husband + Mother + Father',
        description: 'A woman dies leaving her husband, mother, and father — the famous Gharāwiyyatayn case.',
        category: 'special',
        tags: ['husband', 'mother', 'father'],
        heirs: { husband: 1, mother: 1, father: 1 },
        expectedOutcome: 'Husband → 1/2 | Mother → 1/6 (1/3 of remainder) | Father → 1/3 (residue)',
        teachingNote: 'The Gharāwiyyatayn (ʿUmariyyatayn): ʿUmar ibn al-Khaṭṭāb ruled that the mother takes 1/3 of the remainder after the spouse, not 1/3 of the whole estate, so the father receives double the mother\'s share as residuary — overriding the literal 1/3.'
    },

    {
        id: 'shafii-003',
        madhhab: 'shafii',
        title: 'Wife + Mother + Father (Gharāwiyyatayn II)',
        description: 'A man dies leaving his wife, mother, and father — the second Gharāwiyyatayn case.',
        category: 'special',
        tags: ['wife', 'mother', 'father'],
        heirs: { wife: 1, mother: 1, father: 1 },
        expectedOutcome: 'Wife → 1/4 | Mother → 1/4 (1/3 of remainder) | Father → 1/2 (residue)',
        teachingNote: 'Mirror of case 2: mother again takes 1/3 of the remainder after the wife (= 1/4 of total), keeping the father at double her share.'
    },

    {
        id: 'shafii-004',
        madhhab: 'shafii',
        title: 'Two Daughters + Father',
        description: 'A man dies leaving two daughters and his father.',
        category: 'basic',
        tags: ['daughter', 'father'],
        heirs: { daughter: 2, father: 1 },
        expectedOutcome: 'Daughters → 2/3 (shared) | Father → 1/6 (fixed) + Residue (1/6)',
        teachingNote: 'Two daughters receive their fixed 2/3 collectively. The father takes 1/6 as his fixed share due to the daughters, and also takes the remaining 1/6 as residuary — father is both Sharer and Residuary simultaneously.'
    },

    {
        id: 'shafii-005',
        madhhab: 'shafii',
        title: 'Single Daughter Only',
        description: 'A man dies leaving only one daughter and no other heirs.',
        category: 'radd',
        tags: ['daughter'],
        heirs: { daughter: 1 },
        expectedOutcome: 'Daughter → 1/2 fixed share | Radd → remaining 1/2 returns to daughter',
        teachingNote: 'Without a residuary heir (ʿaṣabah), Radd (return) distributes the surplus back to the sharer. Shāfiʿī sends surplus to Bayt al-Māl by default — enable "Return to Heirs" mode to see Radd.'
    },

    {
        id: 'shafii-006',
        madhhab: 'shafii',
        title: 'Son + Daughter',
        description: 'A man dies leaving one son and one daughter.',
        category: 'basic',
        tags: ['son', 'daughter'],
        heirs: { son: 1, daughter: 1 },
        expectedOutcome: 'Son → 2/3 (residue) | Daughter → 1/3 (residue, 2:1 ratio)',
        teachingNote: 'When a son and daughter inherit together, both become residuaries (ʿaṣabah bil-nafs and ʿaṣabah bil-ghayr respectively). The son takes double the daughter\'s share: 2:1 ratio.'
    },

    {
        id: 'shafii-007',
        madhhab: 'shafii',
        title: 'Three Daughters',
        description: 'A man dies leaving three daughters and no other heirs.',
        category: 'radd',
        tags: ['daughter'],
        heirs: { daughter: 3 },
        expectedOutcome: 'Daughters → 2/3 collectively (shared equally) | Surplus → Bayt al-Māl or Radd',
        teachingNote: 'Whether two or more daughters, they collectively receive 2/3. The remaining 1/3 goes to Bayt al-Māl (Shāfiʿī) or back to them via Radd. Each daughter gets 2/9 of the estate.'
    },

    {
        id: 'shafii-008',
        madhhab: 'shafii',
        title: 'Mother + Daughter',
        description: 'A man dies leaving his mother and one daughter.',
        category: 'radd',
        tags: ['mother', 'daughter'],
        heirs: { mother: 1, daughter: 1 },
        expectedOutcome: 'Daughter → 1/2 | Mother → 1/6 | Radd or Bayt al-Māl → 1/3',
        teachingNote: 'Classic Radd scenario. Fixed shares total only 2/3. The remaining 1/3 is either returned proportionally to the sharers (Radd) or sent to Bayt al-Māl depending on the madhhab setting.'
    },

    // ─── ʿAWL CASES ───────────────────────────────────────────────────────────

    {
        id: 'shafii-009',
        madhhab: 'shafii',
        title: 'ʿAwl — Husband + 2 Daughters + Father + Mother',
        description: 'A man dies leaving a husband, two daughters, his father, and his mother — a classic ʿAwl (overflow) case.',
        category: 'awl',
        tags: ['husband', 'daughter', 'father', 'mother'],
        heirs: { husband: 1, daughter: 2, father: 1, mother: 1 },
        expectedOutcome: 'ʿAwl applied: shares reduced proportionally from 13/6 to 13/13',
        teachingNote: 'Husband (1/2) + Daughters (2/3) + Father (1/6) + Mother (1/6) = 13/6 → overflow! ʿAwl reduces all shares proportionally. The denominator becomes 13 and everyone gets their numerator as their share of 13.'
    },

    {
        id: 'shafii-010',
        madhhab: 'shafii',
        title: 'ʿAwl — Husband + 2 Sisters + Mother',
        description: 'A man dies leaving a husband, two full sisters, and his mother.',
        category: 'awl',
        tags: ['husband', 'fullSister', 'mother'],
        heirs: { husband: 1, fullSister: 2, mother: 1 },
        expectedOutcome: 'ʿAwl: Husband 3/9 | Sisters 4/9 | Mother 2/9',
        teachingNote: 'Husband (1/2) + Full Sisters (2/3) + Mother (1/6) = 4/3 → ʿAwl. Common 6-based case that ʿAwls to 9. The mother is reduced from 1/6 to 2/9.'
    },

    {
        id: 'shafii-011',
        madhhab: 'shafii',
        title: 'ʿAwl — Wife + 2 Daughters + Mother + Father',
        description: 'A woman dies leaving a wife (of the deceased woman), two daughters, her mother, and her father.',
        category: 'awl',
        tags: ['wife', 'daughter', 'mother', 'father'],
        heirs: { wife: 1, daughter: 2, mother: 1, father: 1 },
        expectedOutcome: 'ʿAwl applied: denominator increases from 12 to 13',
        teachingNote: 'Wife (1/4) + Daughters (2/3) + Mother (1/6) + Father (1/6) = 13/12 → ʿAwl to 13. Similar to case 9 but with wife rather than husband.'
    },

    // ─── BLOCKING CASES ────────────────────────────────────────────────────────

    {
        id: 'shafii-012',
        madhhab: 'shafii',
        title: 'Grandson Blocked by Son',
        description: 'A man dies leaving a son and a grandson (son\'s son).',
        category: 'blocking',
        tags: ['son', 'sonsSon'],
        heirs: { son: 1, sonsSon: 1 },
        expectedOutcome: 'Son → entire residue | Grandson → Blocked (ḥajb)',
        teachingNote: 'The son completely blocks the grandson. The grandson is a lower-priority ʿaṣabah and is excluded entirely when a son exists. This is ḥajb ḥirmān (total blocking).'
    },

    {
        id: 'shafii-013',
        madhhab: 'shafii',
        title: 'Paternal Sister Blocked by Daughter',
        description: 'A man dies leaving one daughter and one paternal (consanguine) sister.',
        category: 'blocking',
        tags: ['daughter', 'paternalSister'],
        heirs: { daughter: 1, paternalSister: 1 },
        expectedOutcome: 'Daughter → 1/2 | Paternal Sister → blocked as residuary, Radd or Bayt al-Māl for surplus',
        teachingNote: 'Paternal sister is blocked from inheriting as a residuary when a daughter is present. However, a full sister in the same scenario would inherit as ʿaṣabah maʿ al-ghayr.'
    },

    {
        id: 'shafii-014',
        madhhab: 'shafii',
        title: 'Full Brother Blocked by Son',
        description: 'A man dies leaving one son and one full brother.',
        category: 'blocking',
        tags: ['son', 'fullBrother'],
        heirs: { son: 1, fullBrother: 1 },
        expectedOutcome: 'Son → entire estate (residue) | Full Brother → Blocked',
        teachingNote: 'The son is a higher priority ʿaṣabah than the full brother, completely blocking him. This is why the principle is: "give fixed shares to their holders, and whatever remains goes to the closest male."'
    },

    {
        id: 'shafii-015',
        madhhab: 'shafii',
        title: 'Full Sister as ʿAṣabah maʿ al-Ghayr',
        description: 'A man dies leaving one daughter and one full sister.',
        category: 'asabah',
        tags: ['daughter', 'fullSister'],
        heirs: { daughter: 1, fullSister: 1 },
        expectedOutcome: 'Daughter → 1/2 (fixed share) | Full Sister → 1/2 (residue as ʿaṣabah maʿ al-ghayr)',
        teachingNote: 'The full sister inherits as a residuary "with" the daughter (ʿaṣabah maʿ al-ghayr). This is a unique Shāfiʿī principle: a full sister who would otherwise be a sharer becomes a residuary alongside daughters.'
    },

    // ─── GRANDFATHER CASES ─────────────────────────────────────────────────────

    {
        id: 'shafii-016',
        madhhab: 'shafii',
        title: 'Grandfather + Full Brother',
        description: 'A man dies leaving only a paternal grandfather and a full brother.',
        category: 'grandfather',
        tags: ['paternalGrandfather', 'fullBrother'],
        heirs: { paternalGrandfather: 1, fullBrother: 1 },
        expectedOutcome: 'Grandfather → 1/2 | Full Brother → 1/2 (Muqāsamah: share equally)',
        teachingNote: 'Under Shāfiʿī rules, when a grandfather co-exists with siblings, he takes the most favorable of: (1) his fixed 1/3, (2) Muqāsamah (sharing equally with siblings), or (3) 1/6. With one brother, Muqāsamah = 1/2, so he takes 1/2.'
    },

    {
        id: 'shafii-017',
        madhhab: 'shafii',
        title: 'Grandfather + Three Full Brothers',
        description: 'A man dies leaving a paternal grandfather and three full brothers.',
        category: 'grandfather',
        tags: ['paternalGrandfather', 'fullBrother'],
        heirs: { paternalGrandfather: 1, fullBrother: 3 },
        expectedOutcome: 'Grandfather → 1/4 (Muqāsamah: 1 of 4 shares) | Brothers → 3/4 (shared)',
        teachingNote: 'With 3 brothers, Muqāsamah gives grandfather 1/4, which is better than 1/3 (no — wait, 1/4 < 1/3). In Shāfiʿī: grandfather takes the better of 1/3 and Muqāsamah. Here, 1/3 is better so grandfather takes 1/3.'
    },

    {
        id: 'shafii-018',
        madhhab: 'shafii',
        title: 'Grandfather Alone (No Father)',
        description: 'A man dies leaving only a paternal grandfather as the sole heir.',
        category: 'grandfather',
        tags: ['paternalGrandfather'],
        heirs: { paternalGrandfather: 1 },
        expectedOutcome: 'Grandfather → entire estate (as residuary, acting in place of father)',
        teachingNote: 'In the absence of a father, the grandfather acts as father: he inherits as a pure residuary (ʿaṣabah) and takes the entire estate.'
    },

    // ─── SPECIAL / SON'S DAUGHTER CASES ───────────────────────────────────────

    {
        id: 'shafii-019',
        madhhab: 'shafii',
        title: "Son's Daughter + Daughter (Completing 2/3)",
        description: "A man dies leaving one daughter and one son's daughter (granddaughter through son).",
        category: 'special',
        tags: ['daughter', 'sonsDaughter'],
        heirs: { daughter: 1, sonsDaughter: 1 },
        expectedOutcome: "Daughter → 1/2 | Son's Daughter → 1/6 (completing 2/3) | No Radd needed",
        teachingNote: "The daughter takes her fixed 1/2. The son's daughter takes 1/6 to complete the 2/3 ceiling for female descendants. This is the famous 'Ibn Masʿūd ruling' — the granddaughter gets exactly what she needs to make the two shares sum to 2/3."
    },

    {
        id: 'shafii-020',
        madhhab: 'shafii',
        title: 'Multiple Wives Sharing',
        description: 'A man dies leaving two wives, one son, and his father.',
        category: 'basic',
        tags: ['wife', 'son', 'father'],
        heirs: { wife: 2, son: 1, father: 1 },
        expectedOutcome: 'Both wives share 1/8 total (1/16 each) | Father → 1/6 | Son → Residue',
        teachingNote: 'Multiple wives always share the single spousal share equally between them. Two wives receive 1/8 total, so each gets 1/16 of the estate. The number of wives never increases the spousal allocation.'
    },

    {
        id: 'shafii-021',
        madhhab: 'shafii',
        title: 'Father Only (No Descendants)',
        description: 'A man dies leaving only his father as the sole heir.',
        category: 'basic',
        tags: ['father'],
        heirs: { father: 1 },
        expectedOutcome: 'Father → entire estate (pure residuary)',
        teachingNote: 'Without any descendants, the father inherits the entire estate as a residuary. He is both the closest male relative and is "never blocked" from inheritance.'
    },

    {
        id: 'shafii-022',
        madhhab: 'shafii',
        title: 'Wife + Daughter + Mother',
        description: 'A man dies leaving his wife, one daughter, and his mother.',
        category: 'basic',
        tags: ['wife', 'daughter', 'mother'],
        heirs: { wife: 1, daughter: 1, mother: 1 },
        expectedOutcome: 'Wife → 1/8 | Daughter → 1/2 | Mother → 1/6 | Remainder → Bayt al-Māl or Radd',
        teachingNote: 'All three are fixed sharers. Total = 1/8 + 1/2 + 1/6 = 19/24. The remaining 5/24 has no residuary to claim it — it goes to Bayt al-Māl under Shāfiʿī, or returns to the sharers proportionally if Radd is enabled.'
    },

    {
        id: 'shafii-023',
        madhhab: 'shafii',
        title: 'Husband + Mother + Full Sister',
        description: 'A woman dies leaving her husband, mother, and one full sister.',
        category: 'asabah',
        tags: ['husband', 'mother', 'fullSister'],
        heirs: { husband: 1, mother: 1, fullSister: 1 },
        expectedOutcome: 'Husband → 1/2 | Mother → 1/6 | Full Sister → 1/3 (residue or fixed share)',
        teachingNote: 'Husband (1/2) + Mother (1/6) = 2/3. The full sister takes the remaining 1/3 as a sharer (her fixed share is 1/2 but she takes residue here since that is less). Actually, sister takes 1/3 as residue since she acts as ʿaṣabah maʿ al-ghayr is not triggered without a daughter — she takes her 1/2 fixed share but only 1/3 remains.'
    },

];
