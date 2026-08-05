/**
 * Ḥanbalī Fixed-Share (Aṣḥāb al-Furūḍ) Rules
 *
 * Ten categories per Ibn Qudāmah, al-ʿUmdah, Book of Farāʾiḍ:
 *   1. Husband
 *   2. Wife / wives
 *   3. Father
 *   4. Mother
 *   5. Paternal grandfather (when no father)
 *   6. Grandmother(s)
 *   7. Daughters
 *   8. Son's daughters
 *   9. Sisters (full and paternal)
 *  10. Maternal siblings
 *
 * Note: Father's share and grandfather's share when acting as pure ʿaṣabah
 * are handled in the ʿaṣabah assignment phase, not here.
 */

import { fraction } from '../../utils/fractions.js';

export const hanbaliFixedShareRules = {

    // ── Husband ───────────────────────────────────────────────────────────────
    husband: {
        eligible: ({ heirs }) => heirs.husband === 1,
        share: ({ context }) => context.hasDescendants ? fraction(1, 4) : fraction(1, 2),
        reason: ({ context }) => context.hasDescendants
            ? '1/4 — Deceased has inheriting descendants (Qurʾān 4:12)'
            : '1/2 — Deceased has no inheriting descendants (Qurʾān 4:12)'
    },

    // ── Wife / wives ──────────────────────────────────────────────────────────
    wife: {
        eligible: ({ heirs }) => heirs.wife > 0,
        share: ({ context }) => context.hasDescendants ? fraction(1, 8) : fraction(1, 4),
        reason: ({ context, heirs }) => {
            const s = context.hasDescendants ? '1/8' : '1/4';
            const desc = context.hasDescendants
                ? 'inheriting descendants present (Qurʾān 4:12)'
                : 'no inheriting descendants (Qurʾān 4:12)';
            return heirs.wife > 1
                ? `${s} total, shared equally by ${heirs.wife} wives — ${desc}`
                : `${s} — ${desc}`;
        }
    },

    // ── Father ────────────────────────────────────────────────────────────────
    // Father has three states:
    //   1. Male descendants → fixed 1/6 only (rest goes to ʿaṣabah chain)
    //   2. Female descendants only → 1/6 fixed + residue as ʿaṣabah
    //   3. No descendants → pure ʿaṣabah (no fixed share; handled in ʿaṣabah phase)
    father: {
        eligible: ({ heirs, context }) => heirs.father === 1 && context.hasDescendants,
        share: ({ context }) => {
            if (context.hasMaleDescendants) return fraction(1, 6);
            if (context.hasFemaleDescendants) return fraction(1, 6); // + residue added in ʿaṣabah phase
            return null;
        },
        reason: ({ context }) => {
            if (context.hasMaleDescendants) return '1/6 — Male descendants present (Qurʾān 4:11)';
            if (context.hasFemaleDescendants) return '1/6 fixed + residue — Female descendants only (Ibn Qudāmah, al-ʿUmdah)';
            return '';
        }
    },

    // ── Mother ────────────────────────────────────────────────────────────────
    mother: {
        eligible: ({ heirs }) => heirs.mother === 1,
        share: ({ context, heirs }) => {
            // 1/6 with descendants
            if (context.hasDescendants) return fraction(1, 6);
            // 1/6 with two or more siblings (counting all, even blocked)
            const totalSiblings =
                heirs.fullBrother + heirs.fullSister +
                heirs.paternalBrother + heirs.paternalSister +
                heirs.maternalBrother + heirs.maternalSister;
            if (totalSiblings >= 2) return fraction(1, 6);
            // ʿUmariyyatān: father + husband → 1/3 of remainder = 1/6
            if (heirs.father > 0 && heirs.husband > 0) return fraction(1, 6);
            // ʿUmariyyatān: father + wife → 1/3 of remainder (3/4) = 1/4
            if (heirs.father > 0 && heirs.wife > 0) return fraction(1, 4);
            return fraction(1, 3);
        },
        reason: ({ context, heirs }) => {
            if (context.hasDescendants) return '1/6 — Inheriting descendants present (Qurʾān 4:11)';
            const totalSiblings =
                heirs.fullBrother + heirs.fullSister +
                heirs.paternalBrother + heirs.paternalSister +
                heirs.maternalBrother + heirs.maternalSister;
            if (totalSiblings >= 2) return '1/6 — Two or more siblings present (Qurʾān 4:11)';
            if (heirs.father > 0 && heirs.husband > 0) return '1/6 — ʿUmariyyatān: 1/3 of remainder after husband\'s 1/2 (Ibn Qudāmah, al-ʿUmdah)';
            if (heirs.father > 0 && heirs.wife > 0) return '1/4 — ʿUmariyyatān: 1/3 of remainder after wife\'s 1/4 (Ibn Qudāmah, al-ʿUmdah)';
            return '1/3 — No descendants, fewer than two siblings (Qurʾān 4:11)';
        }
    },

    // ── Paternal grandfather (acting as fixed-share heir) ─────────────────────
    // Only eligible when no father. His share when acting as fixed-share heir:
    //   - With male descendants: 1/6
    //   - With female descendants only: 1/6 + residue (handled in ʿaṣabah phase)
    //   - With siblings only (no fixed-share heirs): handled in grandfather.js
    //   - With siblings + fixed-share heirs: handled in grandfather.js
    paternalGrandfather: {
        eligible: ({ heirs, context }) =>
            heirs.paternalGrandfather === 1 &&
            !context.blocked.paternalGrandfather &&
            heirs.father === 0 &&
            context.hasDescendants &&
            // Only give fixed 1/6 when no siblings present (grandfather.js handles sibling case)
            heirs.fullBrother === 0 && heirs.fullSister === 0 &&
            heirs.paternalBrother === 0 && heirs.paternalSister === 0,
        share: ({ context }) => fraction(1, 6),
        reason: () => '1/6 — Acting in place of father with descendants, no siblings (Ibn Qudāmah, al-ʿUmdah)'
    },

    // ── Grandmothers ──────────────────────────────────────────────────────────
    // Ḥanbalī recognizes multiple valid grandmother lines:
    //   maternal grandmother, paternal grandmother, mother of paternal grandfather
    // Nearer excludes farther; they share 1/6 equally if same degree
    grandmothers: {
        eligible: ({ heirs, context }) =>
            (heirs.maternalGrandmother > 0 && !context.blocked.maternalGrandmother) ||
            (heirs.paternalGrandmother > 0 && !context.blocked.paternalGrandmother),
        share: () => fraction(1, 6),
        reason: () => '1/6 shared — Grandmother(s) in absence of mother (Ibn Qudāmah, al-ʿUmdah)'
    },

    // ── Daughters ────────────────────────────────────────────────────────────
    daughter: {
        eligible: ({ heirs }) => heirs.daughter > 0 && heirs.son === 0,
        share: ({ heirs }) => heirs.daughter === 1 ? fraction(1, 2) : fraction(2, 3),
        reason: ({ heirs }) => heirs.daughter === 1
            ? '1/2 — Single daughter, no son (Qurʾān 4:11)'
            : '2/3 total — Multiple daughters, no son (Qurʾān 4:11)'
    },

    // ── Son's daughter ────────────────────────────────────────────────────────
    sonsDaughter: {
        eligible: ({ heirs, context }) => {
            if (context.blocked.sonsDaughter) return false;
            if (heirs.son > 0 || heirs.sonsSon > 0) return false;
            // No daughters: takes 1/2 or 2/3
            if (heirs.daughter === 0) return heirs.sonsDaughter > 0;
            // One daughter: takes 1/6 to complete 2/3
            if (heirs.daughter === 1) return heirs.sonsDaughter > 0;
            // Two+ daughters: blocked unless a son's son makes her ʿaṣabah
            return false;
        },
        share: ({ heirs }) => {
            if (heirs.daughter === 0) {
                return heirs.sonsDaughter === 1 ? fraction(1, 2) : fraction(2, 3);
            }
            // One daughter present: son's daughters get 1/6 to complete 2/3
            return fraction(1, 6);
        },
        reason: ({ heirs }) => {
            if (heirs.daughter === 0) {
                return heirs.sonsDaughter === 1
                    ? '1/2 — Son\'s daughter, no daughter or son (Qurʾān 4:11 by analogy)'
                    : '2/3 total — Multiple son\'s daughters, no daughter or son';
            }
            return '1/6 — Completing 2/3 alongside one daughter (Ibn Qudāmah, al-ʿUmdah)';
        }
    },

    // ── Full sisters ──────────────────────────────────────────────────────────
    fullSister: {
        eligible: ({ heirs, context }) => {
            if (context.blocked.fullSister) return false;
            // Not eligible as fixed-share if acting as ʿaṣabah with daughter
            if ((heirs.daughter > 0 || heirs.sonsDaughter > 0) && heirs.son === 0 && heirs.father === 0 && heirs.paternalGrandfather === 0) return false;
            // Not eligible if full brother present (she becomes ʿaṣabah with him)
            if (heirs.fullBrother > 0 && !context.blocked.fullBrother) return false;
            return heirs.fullSister > 0;
        },
        share: ({ heirs }) => heirs.fullSister === 1 ? fraction(1, 2) : fraction(2, 3),
        reason: ({ heirs }) => heirs.fullSister === 1
            ? '1/2 — Single full sister (Qurʾān 4:176)'
            : '2/3 jointly — Multiple full sisters (Qurʾān 4:176)'
    },

    // ── Paternal sisters ──────────────────────────────────────────────────────
    paternalSister: {
        eligible: ({ heirs, context }) => {
            if (context.blocked.paternalSister) return false;
            // Not eligible as fixed-share if acting as ʿaṣabah with daughter
            if ((heirs.daughter > 0 || heirs.sonsDaughter > 0) && heirs.son === 0 && heirs.father === 0 && heirs.paternalGrandfather === 0) return false;
            // Not eligible if paternal brother present (she becomes ʿaṣabah with him)
            if (heirs.paternalBrother > 0 && !context.blocked.paternalBrother) return false;
            return heirs.paternalSister > 0;
        },
        share: ({ heirs, context }) => {
            // With one full sister: get 1/6 to complete 2/3
            const fullSisBlocked = context.blocked.fullSister;
            const hasFullSis = heirs.fullSister === 1 && !fullSisBlocked;
            if (hasFullSis) return fraction(1, 6);
            // Alone: 1/2 (one) or 2/3 (multiple)
            return heirs.paternalSister === 1 ? fraction(1, 2) : fraction(2, 3);
        },
        reason: ({ heirs, context }) => {
            const hasFullSis = heirs.fullSister === 1 && !context.blocked.fullSister;
            if (hasFullSis) return '1/6 — Completing 2/3 alongside one full sister (Qurʾān 4:176 by analogy)';
            return heirs.paternalSister === 1
                ? '1/2 — Single paternal sister, no full sister (Qurʾān 4:176 by analogy)'
                : '2/3 jointly — Multiple paternal sisters (Qurʾān 4:176 by analogy)';
        }
    },

    // ── Maternal siblings ─────────────────────────────────────────────────────
    // Male and female receive equal shares — unique among sibling categories
    maternalSiblings: {
        eligible: ({ heirs, context }) => {
            if (context.blocked.maternalBrother && context.blocked.maternalSister) return false;
            const activeMat = (heirs.maternalBrother > 0 && !context.blocked.maternalBrother ? heirs.maternalBrother : 0)
                            + (heirs.maternalSister > 0 && !context.blocked.maternalSister ? heirs.maternalSister : 0);
            return activeMat > 0;
        },
        share: ({ heirs, context }) => {
            const activeMat = (heirs.maternalBrother > 0 && !context.blocked.maternalBrother ? heirs.maternalBrother : 0)
                            + (heirs.maternalSister > 0 && !context.blocked.maternalSister ? heirs.maternalSister : 0);
            return activeMat === 1 ? fraction(1, 6) : fraction(1, 3);
        },
        reason: ({ heirs, context }) => {
            const activeMat = (heirs.maternalBrother > 0 && !context.blocked.maternalBrother ? heirs.maternalBrother : 0)
                            + (heirs.maternalSister > 0 && !context.blocked.maternalSister ? heirs.maternalSister : 0);
            return activeMat === 1
                ? '1/6 — Single maternal sibling, male and female equal (Qurʾān 4:12)'
                : '1/3 jointly — Multiple maternal siblings, equal shares (Qurʾān 4:12)';
        }
    },
};
