import { fraction } from '../../utils/fractions.js';

export const malikiFixedShareRules = {
    husband: {
        eligible: ({ heirs }) => heirs.husband === 1,
        share: ({ context }) => context.hasDescendants ? fraction(1, 4) : fraction(1, 2),
        reason: ({ context }) => context.hasDescendants
            ? "1/4 — Deceased has inheriting descendants (Qurʾān 4:12)"
            : "1/2 — Deceased has no inheriting descendants (Qurʾān 4:12)"
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
            const totalSiblings =
                heirs.fullBrother + heirs.fullSister +
                heirs.paternalBrother + heirs.paternalSister +
                heirs.maternalBrother + heirs.maternalSister;
            if (context.hasDescendants || totalSiblings >= 2) return fraction(1, 6);
            
            // ʿUmariyyatān special cases
            if (heirs.father > 0 && heirs.husband > 0) return fraction(1, 6); // 1/3 of remainder (1/2) = 1/6
            if (heirs.father > 0 && heirs.wife > 0) return fraction(1, 4); // 1/3 of remainder (3/4) = 1/4
            
            return fraction(1, 3);
        },
        reason: ({ context, heirs }) => {
            const totalSiblings =
                heirs.fullBrother + heirs.fullSister +
                heirs.paternalBrother + heirs.paternalSister +
                heirs.maternalBrother + heirs.maternalSister;
            if (context.hasDescendants) return "1/6 — Inheriting descendants present (Qurʾān 4:11)";
            if (totalSiblings >= 2) return "1/6 — Two or more siblings present (Qurʾān 4:11)";
            if (heirs.father > 0 && heirs.husband > 0) return "1/6 — ʿUmariyyatān: 1/3 of remainder after husband's share (Mālikī Risālah)";
            if (heirs.father > 0 && heirs.wife > 0) return "1/4 — ʿUmariyyatān: 1/3 of remainder after wife's share (Mālikī Risālah)";
            return "1/3 — No descendants, fewer than two siblings (Qurʾān 4:11)";
        }
    },
    grandmothers: {
        eligible: ({ heirs, context }) =>
            (heirs.maternalGrandmother > 0 && !context.blocked.maternalGrandmother) ||
            (heirs.paternalGrandmother > 0 && !context.blocked.paternalGrandmother),
        share: () => fraction(1, 6),
        reason: () => "1/6 — Grandmother's fixed share (Mālikī only maternal and paternal lines allowed)"
    },
    father: {
        eligible: ({ heirs }) => heirs.father === 1,
        share: ({ context }) => {
            if (context.hasMaleDescendants) return fraction(1, 6);
            if (context.hasDescendants) return fraction(1, 6);
            return null; // pure asabah otherwise
        },
        reason: ({ context }) => {
            if (context.hasMaleDescendants) return "1/6 — Male descendants present (Qurʾān 4:11)";
            if (context.hasDescendants) return "1/6 fixed + residue — Female descendants only (Mālikī Fiqh)";
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
            if (heirs.daughter === 1) return "1/6 — Completing 2/3 with one daughter (Mālikī al-Risālah)";
            return heirs.sonsDaughter === 1
                ? "1/2 — Single son's daughter, no son or daughter"
                : "2/3 total — Multiple son's daughters";
        }
    },
    fullSister: {
        eligible: ({ heirs, context }) =>
            heirs.fullSister > 0 &&
            !context.blocked.fullSister &&
            heirs.fullBrother === 0 &&
            !context.hasDescendants &&
            heirs.paternalGrandfather === 0, // if grandfather is present, handled by grandfather-with-siblings
        share: ({ heirs }) => heirs.fullSister === 1 ? fraction(1, 2) : fraction(2, 3),
        reason: ({ heirs }) => heirs.fullSister === 1
            ? "1/2 — Single full sister, no full brother or descendants (Qurʾān 4:176)"
            : "2/3 total — Multiple full sisters, no full brother or descendants (Qurʾān 4:176)"
    },
    paternalSister: {
        eligible: ({ heirs, context }) =>
            heirs.paternalSister > 0 &&
            !context.blocked.paternalSister &&
            heirs.paternalBrother === 0 &&
            !context.hasDescendants &&
            heirs.paternalGrandfather === 0, // grandfather-with-siblings handles this if present
        share: ({ heirs }) => {
            if (heirs.fullSister === 1) return fraction(1, 6);
            return heirs.paternalSister === 1 ? fraction(1, 2) : fraction(2, 3);
        },
        reason: ({ heirs }) => {
            if (heirs.fullSister === 1) return "1/6 — Completing 2/3 with one full sister (Mālikī al-Risālah)";
            return heirs.paternalSister === 1
                ? "1/2 — Single paternal sister, no full sister or descendants"
                : "2/3 total — Multiple paternal sisters";
        }
    },
    maternalSiblings: {
        eligible: ({ heirs, context }) =>
            (heirs.maternalBrother > 0 && !context.blocked.maternalBrother) ||
            (heirs.maternalSister > 0 && !context.blocked.maternalSister),
        share: ({ heirs }) => {
            const total = heirs.maternalBrother + heirs.maternalSister;
            return total === 1 ? fraction(1, 6) : fraction(1, 3);
        },
        reason: ({ heirs }) => {
            const total = heirs.maternalBrother + heirs.maternalSister;
            return total === 1
                ? "1/6 — Single uterine sibling (Qurʾān 4:12)"
                : "1/3 total — Multiple uterine siblings shared equally (Qurʾān 4:12)"
        }
    }
};
