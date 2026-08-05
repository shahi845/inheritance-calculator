/**
 * Ḥanafī Fixed Share Rules
 *
 * Differences from Shāfiʿī:
 * 1. No Al-Mushtarakah (Ḥimāriyyah) special case — full brother gets only residue
 * 2. No Al-Akdariyyah — grandfather blocks sister entirely
 * 3. True grandfather works EXACTLY like father for fixed share purposes
 *    (1/6 with male descendants, 1/6 + residue with female-only descendants, pure asabah otherwise)
 * 4. Mother: even BLOCKED siblings count for reducing mother from 1/3 → 1/6 (Ḥanafī rule)
 *
 * Source: Mulla's Digest of Ḥanafī Inheritance, Scribd/Sirājiyyah
 */

import { fraction } from '../../utils/fractions.js';

export const hanafiFixedShareRules = {
    husband: {
        eligible: ({ heirs }) => heirs.husband === 1,
        share: ({ context }) => context.hasDescendants ? fraction(1, 4) : fraction(1, 2),
        reason: ({ context }) => context.hasDescendants
            ? "1/4 — Inheriting descendants present (Qurʾān 4:12)"
            : "1/2 — No inheriting descendants (Qurʾān 4:12)"
    },
    wife: {
        eligible: ({ heirs }) => heirs.wife > 0,
        share: ({ context }) => context.hasDescendants ? fraction(1, 8) : fraction(1, 4),
        reason: ({ context, heirs }) => {
            const s = context.hasDescendants ? "1/8" : "1/4";
            const desc = context.hasDescendants
                ? "inheriting descendants present (Qurʾān 4:12)"
                : "no inheriting descendants (Qurʾān 4:12)";
            return heirs.wife > 1
                ? `${s} total, shared equally by ${heirs.wife} wives — ${desc}`
                : `${s} — ${desc}`;
        }
    },
    mother: {
        eligible: ({ heirs }) => heirs.mother === 1,
        share: ({ context, heirs }) => {
            // Ḥanafī: BLOCKED siblings still count for reducing mother
            const totalSiblings =
                heirs.fullBrother + heirs.fullSister +
                heirs.paternalBrother + heirs.paternalSister +
                heirs.maternalBrother + heirs.maternalSister;
            if (context.hasDescendants || totalSiblings >= 2) return fraction(1, 6);
            // ʿUmariyyatān
            if (heirs.father > 0 && heirs.husband > 0) return fraction(1, 6);
            if (heirs.father > 0 && heirs.wife > 0) return fraction(1, 4);
            return fraction(1, 3);
        },
        reason: ({ context, heirs }) => {
            const totalSiblings =
                heirs.fullBrother + heirs.fullSister +
                heirs.paternalBrother + heirs.paternalSister +
                heirs.maternalBrother + heirs.maternalSister;
            if (context.hasDescendants) return "1/6 — Inheriting descendants (Qurʾān 4:11)";
            if (totalSiblings >= 2) return "1/6 — Two or more siblings exist (even if blocked, Ḥanafī rule) (Qurʾān 4:11)";
            if (heirs.father > 0 && heirs.husband > 0) return "1/6 — ʿUmariyyatān: 1/3 of remainder after husband's 1/2";
            if (heirs.father > 0 && heirs.wife > 0) return "1/4 — ʿUmariyyatān: 1/3 of remainder after wife's 1/4";
            return "1/3 — No descendants, fewer than two siblings (Qurʾān 4:11)";
        }
    },
    grandmothers: {
        eligible: ({ heirs, context }) =>
            (heirs.maternalGrandmother > 0 && !context.blocked.maternalGrandmother) ||
            (heirs.paternalGrandmother > 0 && !context.blocked.paternalGrandmother),
        share: () => fraction(1, 6),
        reason: () => "1/6 — Grandmother's fixed share (Sunnah)"
    },
    father: {
        eligible: ({ heirs }) => heirs.father === 1,
        share: ({ context }) => {
            if (context.hasMaleDescendants) return fraction(1, 6);
            if (context.hasDescendants) return fraction(1, 6);
            return null; // Pure asabah
        },
        reason: ({ context }) => {
            if (context.hasMaleDescendants) return "1/6 — Male descendants present (Qurʾān 4:11)";
            if (context.hasDescendants) return "1/6 fixed + residue — Female descendants only";
            return "";
        }
    },
    // True grandfather acts like father in Ḥanafī (blocks siblings, takes same shares)
    paternalGrandfather: {
        eligible: ({ heirs, context }) =>
            heirs.paternalGrandfather === 1 && !context.blocked.paternalGrandfather,
        share: ({ context }) => {
            if (context.hasMaleDescendants) return fraction(1, 6);
            if (context.hasDescendants) return fraction(1, 6);
            return null;
        },
        reason: ({ context }) => {
            if (context.hasMaleDescendants) return "1/6 — Acts like father in Ḥanafī (male descendants present)";
            if (context.hasDescendants) return "1/6 fixed + residue — Acts like father in Ḥanafī";
            return "";
        }
    },
    daughter: {
        eligible: ({ heirs }) => heirs.daughter > 0 && heirs.son === 0,
        share: ({ heirs }) => heirs.daughter === 1 ? fraction(1, 2) : fraction(2, 3),
        reason: ({ heirs }) => heirs.daughter === 1
            ? "1/2 — Single daughter, no son (Qurʾān 4:11)"
            : "2/3 total — Multiple daughters, no son (Qurʾān 4:11)"
    },
    sonsDaughter: {
        eligible: ({ heirs, context }) => {
            if (context.blocked.sonsDaughter) return false;
            if (heirs.son > 0 || heirs.sonsSon > 0) return false;
            return heirs.sonsDaughter > 0;
        },
        share: ({ heirs }) => {
            if (heirs.daughter === 1) return fraction(1, 6);
            return heirs.sonsDaughter === 1 ? fraction(1, 2) : fraction(2, 3);
        },
        reason: ({ heirs }) => {
            if (heirs.daughter === 1) return "1/6 — Completing 2/3 with one daughter (Mulla Digest)";
            return heirs.sonsDaughter === 1
                ? "1/2 — Single son's daughter, no son/daughter/son's son"
                : "2/3 total — Multiple son's daughters";
        }
    },
    fullSister: {
        eligible: ({ heirs, context }) =>
            heirs.fullSister > 0 &&
            !context.blocked.fullSister &&
            heirs.fullBrother === 0 &&
            !context.hasDescendants,
        share: ({ heirs }) => heirs.fullSister === 1 ? fraction(1, 2) : fraction(2, 3),
        reason: ({ heirs }) => heirs.fullSister === 1
            ? "1/2 — Single full sister, no full brother, no descendant (Qurʾān 4:176)"
            : "2/3 total — Multiple full sisters, no full brother (Qurʾān 4:176)"
    },
    paternalSister: {
        eligible: ({ heirs, context }) =>
            heirs.paternalSister > 0 &&
            !context.blocked.paternalSister &&
            heirs.paternalBrother === 0 &&
            !context.hasDescendants,
        share: ({ heirs }) => {
            if (heirs.fullSister === 1) return fraction(1, 6);
            return heirs.paternalSister === 1 ? fraction(1, 2) : fraction(2, 3);
        },
        reason: ({ heirs }) => {
            if (heirs.fullSister === 1) return "1/6 — Completing 2/3 with one full sister (Mulla Digest)";
            return heirs.paternalSister === 1
                ? "1/2 — Single paternal sister, no full sibling, no descendant"
                : "2/3 total — Multiple paternal sisters";
        }
    },
    maternalSiblings: {
        eligible: ({ heirs, context }) => {
            const count = (context.blocked.maternalBrother ? 0 : heirs.maternalBrother) +
                          (context.blocked.maternalSister ? 0 : heirs.maternalSister);
            return count > 0;
        },
        share: ({ heirs, context }) => {
            const count = (context.blocked.maternalBrother ? 0 : heirs.maternalBrother) +
                          (context.blocked.maternalSister ? 0 : heirs.maternalSister);
            return count === 1 ? fraction(1, 6) : fraction(1, 3);
        },
        reason: ({ heirs, context }) => {
            const count = (context.blocked.maternalBrother ? 0 : heirs.maternalBrother) +
                          (context.blocked.maternalSister ? 0 : heirs.maternalSister);
            return count === 1
                ? "1/6 — Single maternal sibling (Qurʾān 4:12)"
                : "1/3 total, equally shared male=female — Multiple maternal siblings (Qurʾān 4:12)";
        }
    }
};
