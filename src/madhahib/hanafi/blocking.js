/**
 * Ḥanafī Blocking Rules (Ḥajb)
 *
 * Key differences from Shāfiʿī:
 * 1. True grandfather BLOCKS all full and paternal siblings (like father)
 * 2. Paternal grandmother is blocked by father (same as Shāfiʿī)
 *    but NOT automatically blocked by true grandfather alone
 * 3. Two or more siblings (even blocked ones) reduce mother from 1/3 → 1/6
 */
function applyHanafiGrandfatherBlocking(input, blocked = []) {
  if (!input.paternalGrandfather || input.father) return blocked;

  const blockedByGrandfather = [
    "fullBrother",
    "fullSister",
    "paternalBrother",
    "paternalSister",
    "maternalBrother",
    "maternalSister"
  ];

  for (const heir of blockedByGrandfather) {
    if (input[heir]) {
      blocked.push({
        heir,
        blockedBy: "paternalGrandfather",
        reason: "In Hanafi law, the paternal grandfather blocks siblings."
      });
      input[heir] = 0;
    }
  }

  return blocked;
}
export const hanafiBlockingRules = {
    // Grandparents
    paternalGrandfather: ({ heirs }) => heirs.father > 0,
    maternalGrandmother: ({ heirs }) => heirs.mother > 0,
    paternalGrandmother: ({ heirs }) => heirs.mother > 0 || heirs.father > 0,
    // NOTE: In Ḥanafī, paternal grandmother is NOT blocked by true grandfather

    // Descendants
    sonsSon: ({ heirs }) => heirs.son > 0,
    sonsDaughter: ({ heirs }) => {
        if (heirs.son > 0) return true;
        if (heirs.daughter >= 2 && heirs.sonsSon === 0) return true;
        return false;
    },
    sonsSonsSon: ({ heirs }) => heirs.son > 0 || heirs.sonsSon > 0,
    sonsSonsDaughter: ({ heirs }) => {
        if (heirs.son > 0 || heirs.sonsSon > 0) return true;
        if (heirs.daughter >= 2 && heirs.sonsSon === 0) return true;
        return false;
    },

    // Full siblings — KEY DIFFERENCE: blocked by true grandfather (unlike Shāfiʿī)
    fullBrother: ({ heirs }) =>
        heirs.son > 0 || heirs.sonsSon > 0 || heirs.sonsSonsSon > 0 ||
        heirs.father > 0 || heirs.paternalGrandfather > 0,
    fullSister: ({ heirs }) =>
        heirs.son > 0 || heirs.sonsSon > 0 || heirs.sonsSonsSon > 0 ||
        heirs.father > 0 || heirs.paternalGrandfather > 0,

    // Paternal siblings — also blocked by grandfather
    paternalBrother: ({ heirs, context }) => {
        const b = context.blocked || {};
        if (heirs.son > 0 || heirs.sonsSon > 0 || heirs.sonsSonsSon > 0) return true;
        if (heirs.father > 0 || heirs.paternalGrandfather > 0) return true;
        if (heirs.fullBrother > 0 && !b.fullBrother) return true;
        // Full sister acting as asabah with daughter blocks paternal brother
        if (_fullSisterAsAsabah(heirs)) return true;
        return false;
    },
    paternalSister: ({ heirs, context }) => {
        const b = context.blocked || {};
        if (heirs.son > 0 || heirs.sonsSon > 0 || heirs.sonsSonsSon > 0) return true;
        if (heirs.father > 0 || heirs.paternalGrandfather > 0) return true;
        if (heirs.fullBrother > 0 && !b.fullBrother) return true;
        if (heirs.fullSister >= 2 && heirs.paternalBrother === 0) return true;
        if (_fullSisterAsAsabah(heirs)) return true;
        return false;
    },

    // Maternal siblings — blocked by any descendant or male ascendant (including grandfather)
    maternalBrother: ({ heirs }) =>
        heirs.son > 0 || heirs.sonsSon > 0 || heirs.sonsSonsSon > 0 ||
        heirs.daughter > 0 || heirs.sonsDaughter > 0 ||
        heirs.father > 0 || heirs.paternalGrandfather > 0,
    maternalSister: ({ heirs }) =>
        heirs.son > 0 || heirs.sonsSon > 0 || heirs.sonsSonsSon > 0 ||
        heirs.daughter > 0 || heirs.sonsDaughter > 0 ||
        heirs.father > 0 || heirs.paternalGrandfather > 0,

    // Nephew chain — blocked by grandfather in Ḥanafī
    fullBrothersSon: ({ heirs, context }) => {
        const b = context.blocked || {};
        if (heirs.son > 0 || heirs.sonsSon > 0 || heirs.sonsSonsSon > 0) return true;
        if (heirs.father > 0 || heirs.paternalGrandfather > 0) return true;
        if (heirs.fullBrother > 0 && !b.fullBrother) return true;
        if (heirs.paternalBrother > 0 && !b.paternalBrother) return true;
        return false;
    },
    paternalBrothersSon: ({ heirs, context }) => {
        const b = context.blocked || {};
        if (heirs.son > 0 || heirs.sonsSon > 0 || heirs.sonsSonsSon > 0) return true;
        if (heirs.father > 0 || heirs.paternalGrandfather > 0) return true;
        if (heirs.fullBrother > 0 && !b.fullBrother) return true;
        if (heirs.paternalBrother > 0 && !b.paternalBrother) return true;
        if (heirs.fullBrothersSon > 0 && !b.fullBrothersSon) return true;
        return false;
    },

    // Uncles
    fullPaternalUncle: ({ heirs, context }) => {
        const b = context.blocked || {};
        if (heirs.son > 0 || heirs.sonsSon > 0 || heirs.sonsSonsSon > 0) return true;
        if (heirs.father > 0 || heirs.paternalGrandfather > 0) return true;
        if (heirs.fullBrother > 0 && !b.fullBrother) return true;
        if (heirs.paternalBrother > 0 && !b.paternalBrother) return true;
        if (heirs.fullBrothersSon > 0 && !b.fullBrothersSon) return true;
        if (heirs.paternalBrothersSon > 0 && !b.paternalBrothersSon) return true;
        return false;
    },
    paternalUncle: ({ heirs, context }) => {
        const b = context.blocked || {};
        if (heirs.fullPaternalUncle > 0 && !b.fullPaternalUncle) return true;
        return hanafiBlockingRules.fullPaternalUncle({ heirs, context });
    },

    // Cousins
    fullPaternalUnclesSon: ({ heirs, context }) => {
        const b = context.blocked || {};
        if (heirs.fullPaternalUncle > 0 && !b.fullPaternalUncle) return true;
        if (heirs.paternalUncle > 0 && !b.paternalUncle) return true;
        return hanafiBlockingRules.fullPaternalUncle({ heirs, context });
    },
    paternalUnclesSon: ({ heirs, context }) => {
        const b = context.blocked || {};
        if (heirs.fullPaternalUnclesSon > 0 && !b.fullPaternalUnclesSon) return true;
        return hanafiBlockingRules.fullPaternalUnclesSon({ heirs, context });
    },

    // Walāʾ
    maleEmancipator: ({ heirs, context }) => _hasPrimaryHeir(heirs, context.blocked || {}),
    walaRelative: ({ heirs, context }) => {
        if (heirs.maleEmancipator > 0 && !(context.blocked || {}).maleEmancipator) return true;
        return _hasPrimaryHeir(heirs, context.blocked || {});
    },
    femaleEmancipator: ({ heirs, context }) => {
        if (heirs.maleEmancipator > 0 && !(context.blocked || {}).maleEmancipator) return true;
        if (heirs.walaRelative > 0 && !(context.blocked || {}).walaRelative) return true;
        return _hasPrimaryHeir(heirs, context.blocked || {});
    },

    // Distant kindred — blocked by any primary heir or residuary
    daughtersSon: ({ heirs, context }) => _hasPrimaryHeir(heirs, context.blocked || {}),
    daughtersDaughter: ({ heirs, context }) => _hasPrimaryHeir(heirs, context.blocked || {}),
    maternalGrandfather: ({ heirs, context }) => {
        if (_hasPrimaryHeir(heirs, context.blocked || {})) return true;
        return (heirs.daughtersSon > 0 && !(context.blocked || {}).daughtersSon) ||
               (heirs.daughtersDaughter > 0 && !(context.blocked || {}).daughtersDaughter);
    },
    sistersSon: ({ heirs, context }) => {
        const b = context.blocked || {};
        if (_hasPrimaryHeir(heirs, b)) return true;
        if (heirs.daughtersSon > 0 && !b.daughtersSon) return true;
        if (heirs.daughtersDaughter > 0 && !b.daughtersDaughter) return true;
        if (heirs.maternalGrandfather > 0 && !b.maternalGrandfather) return true;
        return false;
    },
    sistersDaughter: ({ heirs, context }) => hanafiBlockingRules.sistersSon({ heirs, context }),
    uterineSiblingChildren: ({ heirs, context }) => hanafiBlockingRules.sistersSon({ heirs, context }),
    maternalUncle: ({ heirs, context }) => {
        const b = context.blocked || {};
        if (hanafiBlockingRules.sistersSon({ heirs, context })) return true;
        if (heirs.sistersSon > 0 && !b.sistersSon) return true;
        if (heirs.sistersDaughter > 0 && !b.sistersDaughter) return true;
        return false;
    },
    maternalAunt: ({ heirs, context }) => hanafiBlockingRules.maternalUncle({ heirs, context }),
    paternalAunt: ({ heirs, context }) => hanafiBlockingRules.maternalUncle({ heirs, context }),
    otherDistantRelatives: ({ heirs, context }) => {
        if (hanafiBlockingRules.maternalUncle({ heirs, context })) return true;
        const b = context.blocked || {};
        return ['maternalUncle','maternalAunt','paternalAunt'].some(k => heirs[k] > 0 && !b[k]);
    },
};

export const hanafiBlockingReasons = {
    paternalGrandfather: "Father",
    maternalGrandmother: "Mother",
    paternalGrandmother: "Mother or Father",
    sonsSon: "Son",
    sonsDaughter: "Son, or two+ Daughters without Son's Son",
    sonsSonsSon: "Son or Son's Son",
    // KEY DIFFERENCE from Shāfiʿī:
    fullBrother: "Son, Son's Son, Father, or Paternal Grandfather (Ḥanafī)",
    fullSister: "Son, Son's Son, Father, or Paternal Grandfather (Ḥanafī)",
    paternalBrother: "Full Brother, Son, Father, or Paternal Grandfather (Ḥanafī)",
    paternalSister: "Full Brother, two+ Full Sisters, Son, Father, or Grandfather (Ḥanafī)",
    maternalBrother: "Descendant, Father, or Paternal Grandfather (Ḥanafī)",
    maternalSister: "Descendant, Father, or Paternal Grandfather (Ḥanafī)",
    fullBrothersSon: "Closer agnate (incl. grandfather in Ḥanafī)",
    paternalBrothersSon: "Closer agnate",
    fullPaternalUncle: "Closer agnate",
    paternalUncle: "Full Paternal Uncle or closer",
    fullPaternalUnclesSon: "Uncle or closer",
    paternalUnclesSon: "Full Uncle's Son or closer",
};

// ─── Private helpers ──────────────────────────────────────────────────────────
const _primaryKeys = [
    'father', 'mother', 'paternalGrandfather', 'paternalGrandmother', 'maternalGrandmother',
    'son', 'daughter', 'sonsSon', 'sonsDaughter', 'sonsSonsSon',
    'fullBrother', 'fullSister', 'paternalBrother', 'paternalSister',
    'maternalBrother', 'maternalSister',
    'fullBrothersSon', 'paternalBrothersSon',
    'fullPaternalUncle', 'paternalUncle',
    'fullPaternalUnclesSon', 'paternalUnclesSon',
];

function _hasPrimaryHeir(heirs, blocked) {
    return _primaryKeys.some(k => heirs[k] > 0 && !blocked[k]);
}

function _fullSisterAsAsabah(heirs) {
    return heirs.fullSister > 0 &&
        (heirs.daughter > 0 || heirs.sonsDaughter > 0) &&
        heirs.son === 0 && heirs.sonsSon === 0 &&
        heirs.father === 0 && heirs.paternalGrandfather === 0 &&
        heirs.fullBrother === 0;
}
