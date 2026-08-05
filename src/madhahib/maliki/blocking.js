import { getHeirDisplayName } from '../../utils/formatResults.js';

function fullSisterIsAsabah(heirs, context) {
    return context.fullSisterAsAsabah ||
        (heirs.fullSister > 0 && !context.blocked?.fullSister &&
         (heirs.daughter > 0 || heirs.sonsDaughter > 0) &&
         heirs.son === 0 && heirs.sonsSon === 0 && heirs.father === 0 &&
         heirs.paternalGrandfather === 0 && heirs.fullBrother === 0);
}

function paternalSisterIsAsabah(heirs, context) {
    return (heirs.paternalSister > 0 && !context.blocked?.paternalSister &&
            (heirs.daughter > 0 || heirs.sonsDaughter > 0) &&
            heirs.son === 0 && heirs.sonsSon === 0 && heirs.father === 0 &&
            heirs.paternalGrandfather === 0 && heirs.fullBrother === 0 &&
            heirs.fullSister === 0 && heirs.paternalBrother === 0 &&
            !fullSisterIsAsabah(heirs, context));
}

export const malikiBlockingRules = {
    // Grandparents
    paternalGrandfather: ({ heirs }) => heirs.father > 0,
    maternalGrandmother: ({ heirs }) => heirs.mother > 0,
    paternalGrandmother: ({ heirs }) => heirs.mother > 0 || heirs.father > 0,

    // Descendants
    sonsSon: ({ heirs }) => heirs.son > 0,
    sonsDaughter: ({ heirs, context }) => {
        if (heirs.son > 0) return true;
        if (heirs.daughter >= 2 && heirs.sonsSon === 0) return true;
        return false;
    },
    sonsSonsSon: ({ heirs }) => heirs.son > 0 || heirs.sonsSon > 0,
    sonsSonsDaughter: ({ heirs, context }) => {
        if (heirs.son > 0 || heirs.sonsSon > 0) return true;
        if (heirs.daughter >= 2 && heirs.sonsSon === 0 && heirs.sonsSonsSon === 0) return true;
        return false;
    },

    // Full siblings — blocked by son-line or father (NOT grandfather)
    fullBrother: ({ heirs }) =>
        heirs.son > 0 || heirs.sonsSon > 0 || heirs.sonsSonsSon > 0 || heirs.father > 0,
    fullSister: ({ heirs }) =>
        heirs.son > 0 || heirs.sonsSon > 0 || heirs.sonsSonsSon > 0 || heirs.father > 0,

    // Paternal siblings — blocked by full brother or full sister acting as ʿaṣabah
    paternalBrother: ({ heirs, context }) => {
        if (heirs.son > 0 || heirs.sonsSon > 0 || heirs.sonsSonsSon > 0 || heirs.father > 0) return true;
        if (heirs.fullBrother > 0 && !context.blocked?.fullBrother) return true;
        if (fullSisterIsAsabah(heirs, context)) return true;
        return false;
    },
    paternalSister: ({ heirs, context }) => {
        if (heirs.son > 0 || heirs.sonsSon > 0 || heirs.sonsSonsSon > 0 || heirs.father > 0) return true;
        if (heirs.fullBrother > 0 && !context.blocked?.fullBrother) return true;
        if (heirs.fullSister >= 2 && heirs.paternalBrother === 0) return true;
        if (fullSisterIsAsabah(heirs, context)) return true;
        return false;
    },

    // Maternal siblings — blocked by child, son's child, father, or paternal grandfather
    maternalBrother: ({ heirs }) =>
        heirs.son > 0 || heirs.sonsSon > 0 || heirs.sonsSonsSon > 0 ||
        heirs.daughter > 0 || heirs.sonsDaughter > 0 ||
        heirs.father > 0 || heirs.paternalGrandfather > 0,
    maternalSister: ({ heirs }) =>
        heirs.son > 0 || heirs.sonsSon > 0 || heirs.sonsSonsSon > 0 ||
        heirs.daughter > 0 || heirs.sonsDaughter > 0 ||
        heirs.father > 0 || heirs.paternalGrandfather > 0,

    // Nephews
    fullBrothersSon: ({ heirs, context }) => {
        if (heirs.son > 0 || heirs.sonsSon > 0 || heirs.sonsSonsSon > 0 || heirs.father > 0) return true;
        if (heirs.paternalGrandfather > 0 && !context.blocked?.paternalGrandfather) return true;
        if (heirs.fullBrother > 0 && !context.blocked?.fullBrother) return true;
        if (heirs.paternalBrother > 0 && !context.blocked?.paternalBrother) return true;
        if (fullSisterIsAsabah(heirs, context) || paternalSisterIsAsabah(heirs, context)) return true;
        return false;
    },
    fullBrothersSonsSon: ({ heirs, context }) => {
        if (heirs.son > 0 || heirs.sonsSon > 0 || heirs.sonsSonsSon > 0 || heirs.father > 0) return true;
        if (heirs.paternalGrandfather > 0 && !context.blocked?.paternalGrandfather) return true;
        if (heirs.fullBrother > 0 && !context.blocked?.fullBrother) return true;
        if (heirs.paternalBrother > 0 && !context.blocked?.paternalBrother) return true;
        if (heirs.fullBrothersSon > 0 && !context.blocked?.fullBrothersSon) return true;
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
    paternalBrothersSonsSon: ({ heirs, context }) => {
        if (heirs.son > 0 || heirs.sonsSon > 0 || heirs.sonsSonsSon > 0 || heirs.father > 0) return true;
        if (heirs.paternalGrandfather > 0 && !context.blocked?.paternalGrandfather) return true;
        if (heirs.fullBrother > 0 && !context.blocked?.fullBrother) return true;
        if (heirs.paternalBrother > 0 && !context.blocked?.paternalBrother) return true;
        if (heirs.fullBrothersSon > 0 && !context.blocked?.fullBrothersSon) return true;
        if (heirs.paternalBrothersSon > 0 && !context.blocked?.paternalBrothersSon) return true;
        if (fullSisterIsAsabah(heirs, context) || paternalSisterIsAsabah(heirs, context)) return true;
        return false;
    },

    // Uncles
    fullPaternalUncle: ({ heirs, context }) => {
        if (heirs.son > 0 || heirs.sonsSon > 0 || heirs.sonsSonsSon > 0 || heirs.father > 0) return true;
        if (heirs.paternalGrandfather > 0 && !context.blocked?.paternalGrandfather) return true;
        if (heirs.fullBrother > 0 && !context.blocked?.fullBrother) return true;
        if (heirs.paternalBrother > 0 && !context.blocked?.paternalBrother) return true;
        if (heirs.fullBrothersSon > 0 && !context.blocked?.fullBrothersSon) return true;
        if (heirs.fullBrothersSonsSon > 0 && !context.blocked?.fullBrothersSonsSon) return true;
        if (heirs.paternalBrothersSon > 0 && !context.blocked?.paternalBrothersSon) return true;
        if (heirs.paternalBrothersSonsSon > 0 && !context.blocked?.paternalBrothersSonsSon) return true;
        if (fullSisterIsAsabah(heirs, context) || paternalSisterIsAsabah(heirs, context)) return true;
        return false;
    },
    paternalUncle: ({ heirs, context }) => {
        if (heirs.son > 0 || heirs.sonsSon > 0 || heirs.sonsSonsSon > 0 || heirs.father > 0) return true;
        if (heirs.paternalGrandfather > 0 && !context.blocked?.paternalGrandfather) return true;
        if (heirs.fullBrother > 0 && !context.blocked?.fullBrother) return true;
        if (heirs.paternalBrother > 0 && !context.blocked?.paternalBrother) return true;
        if (heirs.fullBrothersSon > 0 && !context.blocked?.fullBrothersSon) return true;
        if (heirs.fullBrothersSonsSon > 0 && !context.blocked?.fullBrothersSonsSon) return true;
        if (heirs.paternalBrothersSon > 0 && !context.blocked?.paternalBrothersSon) return true;
        if (heirs.paternalBrothersSonsSon > 0 && !context.blocked?.paternalBrothersSonsSon) return true;
        if (heirs.fullPaternalUncle > 0 && !context.blocked?.fullPaternalUncle) return true;
        if (fullSisterIsAsabah(heirs, context) || paternalSisterIsAsabah(heirs, context)) return true;
        return false;
    },

    // Cousins
    fullPaternalUnclesSon: ({ heirs, context }) => {
        if (heirs.son > 0 || heirs.sonsSon > 0 || heirs.sonsSonsSon > 0 || heirs.father > 0) return true;
        if (heirs.paternalGrandfather > 0 && !context.blocked?.paternalGrandfather) return true;
        if (heirs.fullBrother > 0 && !context.blocked?.fullBrother) return true;
        if (heirs.paternalBrother > 0 && !context.blocked?.paternalBrother) return true;
        if (heirs.fullBrothersSon > 0 && !context.blocked?.fullBrothersSon) return true;
        if (heirs.fullBrothersSonsSon > 0 && !context.blocked?.fullBrothersSonsSon) return true;
        if (heirs.paternalBrothersSon > 0 && !context.blocked?.paternalBrothersSon) return true;
        if (heirs.paternalBrothersSonsSon > 0 && !context.blocked?.paternalBrothersSonsSon) return true;
        if (heirs.fullPaternalUncle > 0 && !context.blocked?.fullPaternalUncle) return true;
        if (heirs.paternalUncle > 0 && !context.blocked?.paternalUncle) return true;
        if (fullSisterIsAsabah(heirs, context) || paternalSisterIsAsabah(heirs, context)) return true;
        return false;
    },
    paternalUnclesSon: ({ heirs, context }) => {
        if (heirs.son > 0 || heirs.sonsSon > 0 || heirs.sonsSonsSon > 0 || heirs.father > 0) return true;
        if (heirs.paternalGrandfather > 0 && !context.blocked?.paternalGrandfather) return true;
        if (heirs.fullBrother > 0 && !context.blocked?.fullBrother) return true;
        if (heirs.paternalBrother > 0 && !context.blocked?.paternalBrother) return true;
        if (heirs.fullBrothersSon > 0 && !context.blocked?.fullBrothersSon) return true;
        if (heirs.fullBrothersSonsSon > 0 && !context.blocked?.fullBrothersSonsSon) return true;
        if (heirs.paternalBrothersSon > 0 && !context.blocked?.paternalBrothersSon) return true;
        if (heirs.paternalBrothersSonsSon > 0 && !context.blocked?.paternalBrothersSonsSon) return true;
        if (heirs.fullPaternalUncle > 0 && !context.blocked?.fullPaternalUncle) return true;
        if (heirs.paternalUncle > 0 && !context.blocked?.paternalUncle) return true;
        if (heirs.fullPaternalUnclesSon > 0 && !context.blocked?.fullPaternalUnclesSon) return true;
        if (fullSisterIsAsabah(heirs, context) || paternalSisterIsAsabah(heirs, context)) return true;
        return false;
    }
};

export const malikiBlockingReasons = {
    paternalGrandfather: "Father",
    maternalGrandmother: "Mother",
    paternalGrandmother: "Mother or Father",
    sonsSon: "Son",
    sonsDaughter: "Son or multiple daughters",
    sonsSonsSon: "Son or Grandson",
    sonsSonsDaughter: "Son, Grandson or multiple daughters",
    fullBrother: "Father, Son or Grandson",
    fullSister: "Father, Son or Grandson",
    paternalBrother: "Father, Son, Grandson, Full Brother or Full Sister acting as Asabah",
    paternalSister: "Father, Son, Grandson, Full Brother, Full Sister acting as Asabah or multiple full sisters",
    maternalBrother: "Child, Grandchild, Father or Paternal Grandfather",
    maternalSister: "Child, Grandchild, Father or Paternal Grandfather",
    fullBrothersSon: "Closer male agnate",
    fullBrothersSonsSon: "Closer male agnate",
    paternalBrothersSon: "Closer male agnate",
    paternalBrothersSonsSon: "Closer male agnate",
    fullPaternalUncle: "Closer male agnate",
    paternalUncle: "Closer male agnate",
    fullPaternalUnclesSon: "Closer male agnate",
    paternalUnclesSon: "Closer male agnate"
};
