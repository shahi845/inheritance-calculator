/**
 * Ḥanbalī Blocking (Ḥajb) Rules
 *
 * Key Ḥanbalī distinctions:
 *   1. Paternal grandfather does NOT block full or paternal siblings.
 *      He competes with them via the best-share three-way comparison.
 *   2. Full siblings ARE blocked by son, son's son, or father — but NOT grandfather.
 *   3. Paternal siblings blocked by: son, son's son, father, full brother (NOT grandfather).
 *   4. Maternal siblings blocked by: child, son's child, father, paternal grandfather.
 *   5. Dhawū al-arḥām blocked by ANY non-spouse fixed-share heir or any ʿaṣabah.
 *
 * Source: Ibn Qudāmah, al-ʿUmdah, Book of Farāʾiḍ.
 */

function fullSisterIsAsabah(heirs, context) {
    return context.fullSisterAsAsabah ||
        (heirs.fullSister > 0 && !context.blocked?.fullSister &&
         (heirs.daughter > 0 || heirs.sonsDaughter > 0) &&
         heirs.son === 0 && heirs.sonsSon === 0 &&
         heirs.father === 0 && heirs.paternalGrandfather === 0 &&
         heirs.fullBrother === 0);
}

function paternalSisterIsAsabah(heirs, context) {
    return (heirs.paternalSister > 0 && !context.blocked?.paternalSister &&
            (heirs.daughter > 0 || heirs.sonsDaughter > 0) &&
            heirs.son === 0 && heirs.sonsSon === 0 &&
            heirs.father === 0 && heirs.paternalGrandfather === 0 &&
            heirs.fullBrother === 0 && heirs.fullSister === 0 &&
            heirs.paternalBrother === 0);
}

export const hanbaliBlockingRules = {
    // ── Grandparents ─────────────────────────────────────────────────────────
    // Grandfather is blocked by father, but does NOT block full/paternal siblings
    paternalGrandfather: ({ heirs }) => heirs.father > 0,

    // Both grandmothers blocked by mother; paternal grandmother also blocked by father
    maternalGrandmother: ({ heirs }) => heirs.mother > 0,
    paternalGrandmother: ({ heirs }) => heirs.mother > 0 || heirs.father > 0,

    // ── Descendants ──────────────────────────────────────────────────────────
    sonsSon: ({ heirs }) => heirs.son > 0,
    sonsDaughter: ({ heirs }) => {
        if (heirs.son > 0) return true;
        // Blocked by two or more daughters unless a son's son makes her ʿaṣabah
        if (heirs.daughter >= 2 && heirs.sonsSon === 0) return true;
        return false;
    },
    sonsSonsSon:     ({ heirs }) => heirs.son > 0 || heirs.sonsSon > 0,
    sonsSonsDaughter: ({ heirs }) => {
        if (heirs.son > 0 || heirs.sonsSon > 0) return true;
        if (heirs.daughter >= 2 && heirs.sonsSon === 0 && heirs.sonsSonsSon === 0) return true;
        return false;
    },

    // ── Full siblings — blocked by son-line or father (NOT grandfather) ───────
    fullBrother: ({ heirs }) =>
        heirs.son > 0 || heirs.sonsSon > 0 || heirs.sonsSonsSon > 0 || heirs.father > 0,
    fullSister: ({ heirs }) =>
        heirs.son > 0 || heirs.sonsSon > 0 || heirs.sonsSonsSon > 0 || heirs.father > 0,

    // ── Paternal siblings — blocked by son-line, father, or full brother ──────
    // Note: paternal grandfather does NOT block them (he competes via best-share)
    paternalBrother: ({ heirs, context }) => {
        if (heirs.son > 0 || heirs.sonsSon > 0 || heirs.sonsSonsSon > 0 || heirs.father > 0) return true;
        if (heirs.fullBrother > 0 && !context.blocked?.fullBrother) return true;
        if (fullSisterIsAsabah(heirs, context)) return true;
        return false;
    },
    paternalSister: ({ heirs, context }) => {
        if (heirs.son > 0 || heirs.sonsSon > 0 || heirs.sonsSonsSon > 0 || heirs.father > 0) return true;
        if (heirs.fullBrother > 0 && !context.blocked?.fullBrother) return true;
        // Blocked by two+ full sisters when no paternal brother present
        if (heirs.fullSister >= 2 && heirs.paternalBrother === 0) return true;
        if (fullSisterIsAsabah(heirs, context)) return true;
        return false;
    },

    // ── Maternal siblings — blocked by descendants, father, or grandfather ────
    maternalBrother: ({ heirs }) =>
        heirs.son > 0 || heirs.sonsSon > 0 || heirs.sonsSonsSon > 0 ||
        heirs.daughter > 0 || heirs.sonsDaughter > 0 ||
        heirs.father > 0 || heirs.paternalGrandfather > 0,
    maternalSister: ({ heirs }) =>
        heirs.son > 0 || heirs.sonsSon > 0 || heirs.sonsSonsSon > 0 ||
        heirs.daughter > 0 || heirs.sonsDaughter > 0 ||
        heirs.father > 0 || heirs.paternalGrandfather > 0,

    // ── Nephews (sons of brothers) ────────────────────────────────────────────
    fullBrothersSon: ({ heirs, context }) => {
        if (heirs.son > 0 || heirs.sonsSon > 0 || heirs.sonsSonsSon > 0 || heirs.father > 0) return true;
        if (heirs.paternalGrandfather > 0 && !context.blocked?.paternalGrandfather) return true;
        if (heirs.fullBrother > 0 && !context.blocked?.fullBrother) return true;
        if (heirs.paternalBrother > 0 && !context.blocked?.paternalBrother) return true;
        if (fullSisterIsAsabah(heirs, context) || paternalSisterIsAsabah(heirs, context)) return true;
        return false;
    },
    paternalBrothersSon: ({ heirs, context }) => {
        if (heirs.son > 0 || heirs.sonsSon > 0 || heirs.sonsSonsSon > 0 || heirs.father > 0) return true;
        if (heirs.paternalGrandfather > 0 && !context.blocked?.paternalGrandfather) return true;
        if (heirs.fullBrother > 0 && !context.blocked?.fullBrother) return true;
        if (heirs.paternalBrother > 0 && !context.blocked?.paternalBrother) return true;
        if (heirs.fullBrothersSon > 0 && !context.blocked?.fullBrothersSon) return true;
        if (fullSisterIsAsabah(heirs, context) || paternalSisterIsAsabah(heirs, context)) return true;
        return false;
    },

    // ── Paternal uncles ───────────────────────────────────────────────────────
    fullPaternalUncle: ({ heirs, context }) => {
        if (heirs.son > 0 || heirs.sonsSon > 0 || heirs.sonsSonsSon > 0 || heirs.father > 0) return true;
        if (heirs.paternalGrandfather > 0 && !context.blocked?.paternalGrandfather) return true;
        if (heirs.fullBrother > 0 && !context.blocked?.fullBrother) return true;
        if (heirs.paternalBrother > 0 && !context.blocked?.paternalBrother) return true;
        if (heirs.fullBrothersSon > 0 && !context.blocked?.fullBrothersSon) return true;
        if (heirs.paternalBrothersSon > 0 && !context.blocked?.paternalBrothersSon) return true;
        return false;
    },
    paternalUncle: ({ heirs, context }) => {
        if (heirs.son > 0 || heirs.sonsSon > 0 || heirs.sonsSonsSon > 0 || heirs.father > 0) return true;
        if (heirs.paternalGrandfather > 0 && !context.blocked?.paternalGrandfather) return true;
        if (heirs.fullBrother > 0 && !context.blocked?.fullBrother) return true;
        if (heirs.paternalBrother > 0 && !context.blocked?.paternalBrother) return true;
        if (heirs.fullBrothersSon > 0 && !context.blocked?.fullBrothersSon) return true;
        if (heirs.paternalBrothersSon > 0 && !context.blocked?.paternalBrothersSon) return true;
        if (heirs.fullPaternalUncle > 0 && !context.blocked?.fullPaternalUncle) return true;
        return false;
    },
    fullPaternalUncleSon: ({ heirs, context }) => {
        if (heirs.son > 0 || heirs.sonsSon > 0 || heirs.father > 0) return true;
        if (heirs.paternalGrandfather > 0 && !context.blocked?.paternalGrandfather) return true;
        if (heirs.fullBrother > 0 && !context.blocked?.fullBrother) return true;
        if (heirs.paternalBrother > 0 && !context.blocked?.paternalBrother) return true;
        if (heirs.fullBrothersSon > 0 && !context.blocked?.fullBrothersSon) return true;
        if (heirs.paternalBrothersSon > 0 && !context.blocked?.paternalBrothersSon) return true;
        if (heirs.fullPaternalUncle > 0 && !context.blocked?.fullPaternalUncle) return true;
        if (heirs.paternalUncle > 0 && !context.blocked?.paternalUncle) return true;
        return false;
    },
    paternalUncleSon: ({ heirs, context }) => {
        if (heirs.son > 0 || heirs.sonsSon > 0 || heirs.father > 0) return true;
        if (heirs.paternalGrandfather > 0 && !context.blocked?.paternalGrandfather) return true;
        if (heirs.fullBrother > 0 && !context.blocked?.fullBrother) return true;
        if (heirs.paternalBrother > 0 && !context.blocked?.paternalBrother) return true;
        if (heirs.fullBrothersSon > 0 && !context.blocked?.fullBrothersSon) return true;
        if (heirs.paternalBrothersSon > 0 && !context.blocked?.paternalBrothersSon) return true;
        if (heirs.fullPaternalUncle > 0 && !context.blocked?.fullPaternalUncle) return true;
        if (heirs.paternalUncle > 0 && !context.blocked?.paternalUncle) return true;
        if (heirs.fullPaternalUncleSon > 0 && !context.blocked?.fullPaternalUncleSon) return true;
        return false;
    },
};

export const hanbaliBlockingReasons = {
    paternalGrandfather:   "Father",
    maternalGrandmother:   "Mother",
    paternalGrandmother:   "Mother or Father",
    sonsSon:               "Son",
    sonsDaughter:          "Son or two+ Daughters (without qualifying son's son)",
    sonsSonsSon:           "Son or Son's Son",
    sonsSonsDaughter:      "Son, Son's Son, or two+ Daughters",
    fullBrother:           "Son, Son's Son, or Father",
    fullSister:            "Son, Son's Son, or Father",
    paternalBrother:       "Son, Son's Son, Father, or Full Brother",
    paternalSister:        "Son, Son's Son, Father, Full Brother, or two+ Full Sisters",
    maternalBrother:       "Child, Son's Child, Father, or Paternal Grandfather",
    maternalSister:        "Child, Son's Child, Father, or Paternal Grandfather",
    fullBrothersSon:       "Closer agnate (brother, grandfather, or uncle)",
    paternalBrothersSon:   "Closer agnate",
    fullPaternalUncle:     "Closer agnate",
    paternalUncle:         "Closer agnate or Full Paternal Uncle",
    fullPaternalUncleSon:  "Closer agnate",
    paternalUncleSon:      "Closer agnate or Full Paternal Uncle's Son",
};

