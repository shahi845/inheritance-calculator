import { fraction } from '../utils/fractions.js';

// ─── Primary Heir Keys ────────────────────────────────────────────────────────
// These are heirs whose presence blocks the Dhawu al-Arham from inheriting
const primaryHeirKeys = [
    'father', 'mother', 'paternalGrandfather',
    'paternalGrandmother', 'maternalGrandmother',
    'son', 'daughter', 'sonsSon', 'sonsDaughter', 'sonsSonsSon',
    'fullBrother', 'fullSister', 'paternalBrother', 'paternalSister',
    'maternalBrother', 'maternalSister',
    'fullBrothersSon', 'paternalBrothersSon',
    'fullBrothersSonsSon', 'paternalBrothersSonsSon',
    'fullPaternalUncle', 'paternalUncle',
    'fullPaternalUnclesSon', 'paternalUnclesSon',
    'fullPaternalUnclesSonsSon', 'paternalUnclesSonsSon',
];

function hasActivePrimaryHeir(heirs, blocked) {
    return primaryHeirKeys.some(key => heirs[key] > 0 && !blocked[key]);
}

// Helper: is fullSister acting as asabah (residuary with female descendant)?
// This is set in context by the residuary module, but we check conditions here.
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

// ─── Blocking Rules ───────────────────────────────────────────────────────────
export const blockingRules = {
    // Grandparents
    paternalGrandfather: ({ heirs }) => heirs.father > 0,
    maternalGrandmother: ({ heirs }) => heirs.mother > 0,
    paternalGrandmother: ({ heirs }) => heirs.mother > 0 || heirs.father > 0,

    // Descendants — closer blocks farther
    sonsSon: ({ heirs }) => heirs.son > 0,
    sonsDaughter: ({ heirs }) => {
        if (heirs.son > 0) return true;
        // Two or more daughters block son's daughter UNLESS a son's son makes her asabah
        if (heirs.daughter >= 2 && heirs.sonsSon === 0) return true;
        return false;
    },
    sonsSonsSon: ({ heirs }) => heirs.son > 0 || heirs.sonsSon > 0,
    sonsSonsDaughter: ({ heirs }) => {
        if (heirs.son > 0 || heirs.sonsSon > 0) return true;
        if (heirs.daughter >= 2 && heirs.sonsSon === 0) return true;
        return false;
    },

    // Full siblings — blocked by son-line descendants or father (NOT grandfather in Shafi'i)
    fullBrother: ({ heirs }) =>
        heirs.son > 0 || heirs.sonsSon > 0 || heirs.sonsSonsSon > 0 || heirs.father > 0,
    fullSister: ({ heirs }) =>
        heirs.son > 0 || heirs.sonsSon > 0 || heirs.sonsSonsSon > 0 || heirs.father > 0,

    // Paternal siblings — blocked by full siblings (when fullSister acts as asabah)
    paternalBrother: ({ heirs, context }) => {
        if (heirs.son > 0 || heirs.sonsSon > 0 || heirs.sonsSonsSon > 0 || heirs.father > 0) return true;
        if (heirs.fullBrother > 0 && !context.blocked?.fullBrother) return true;
        if (fullSisterIsAsabah(heirs, context)) return true;
        return false;
    },
    paternalSister: ({ heirs, context }) => {
        if (heirs.son > 0 || heirs.sonsSon > 0 || heirs.sonsSonsSon > 0 || heirs.father > 0) return true;
        if (heirs.fullBrother > 0 && !context.blocked?.fullBrother) return true;
        // Two or more full sisters block paternal sister UNLESS paternal brother makes her asabah
        if (heirs.fullSister >= 2 && heirs.paternalBrother === 0) return true;
        if (fullSisterIsAsabah(heirs, context)) return true;
        return false;
    },

    // Maternal siblings — blocked by any descendant, father, or paternal grandfather
    maternalBrother: ({ heirs }) =>
        heirs.son > 0 || heirs.sonsSon > 0 || heirs.sonsSonsSon > 0 ||
        heirs.daughter > 0 || heirs.sonsDaughter > 0 ||
        heirs.father > 0 || heirs.paternalGrandfather > 0,
    maternalSister: ({ heirs }) =>
        heirs.son > 0 || heirs.sonsSon > 0 || heirs.sonsSonsSon > 0 ||
        heirs.daughter > 0 || heirs.sonsDaughter > 0 ||
        heirs.father > 0 || heirs.paternalGrandfather > 0,

    // Nephews (Full Brother's Son)
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

    // Paternal Uncles
    fullPaternalUncle: ({ heirs, context }) => {
        if (heirs.son > 0 || heirs.sonsSon > 0 || heirs.sonsSonsSon > 0 || heirs.father > 0) return true;
        if (heirs.paternalGrandfather > 0 && !context.blocked?.paternalGrandfather) return true;
        if (heirs.fullBrother > 0 && !context.blocked?.fullBrother) return true;
        if (heirs.paternalBrother > 0 && !context.blocked?.paternalBrother) return true;
        if (heirs.fullBrothersSon > 0 && !context.blocked?.fullBrothersSon) return true;
        if (heirs.fullBrothersSonsSon > 0 && !context.blocked?.fullBrothersSonsSon) return true;
        if (heirs.paternalBrothersSon > 0 && !context.blocked?.paternalBrothersSon) return true;
        if (fullSisterIsAsabah(heirs, context) || paternalSisterIsAsabah(heirs, context)) return true;
        return false;
    },
    paternalUncle: ({ heirs, context }) => {
        if (heirs.fullPaternalUncle > 0 && !context.blocked?.fullPaternalUncle) return true;
        // All the same blockers as fullPaternalUncle
        if (heirs.son > 0 || heirs.sonsSon > 0 || heirs.sonsSonsSon > 0 || heirs.father > 0) return true;
        if (heirs.paternalGrandfather > 0 && !context.blocked?.paternalGrandfather) return true;
        if (heirs.fullBrother > 0 && !context.blocked?.fullBrother) return true;
        if (heirs.paternalBrother > 0 && !context.blocked?.paternalBrother) return true;
        if (heirs.fullBrothersSon > 0 && !context.blocked?.fullBrothersSon) return true;
        if (heirs.paternalBrothersSon > 0 && !context.blocked?.paternalBrothersSon) return true;
        if (fullSisterIsAsabah(heirs, context) || paternalSisterIsAsabah(heirs, context)) return true;
        return false;
    },

    // Cousins (Uncle's Sons)
    fullPaternalUnclesSon: ({ heirs, context }) => {
        if (heirs.fullPaternalUncle > 0 && !context.blocked?.fullPaternalUncle) return true;
        if (heirs.paternalUncle > 0 && !context.blocked?.paternalUncle) return true;
        if (heirs.son > 0 || heirs.sonsSon > 0 || heirs.sonsSonsSon > 0 || heirs.father > 0) return true;
        if (heirs.paternalGrandfather > 0 && !context.blocked?.paternalGrandfather) return true;
        if (heirs.fullBrother > 0 && !context.blocked?.fullBrother) return true;
        if (heirs.paternalBrother > 0 && !context.blocked?.paternalBrother) return true;
        if (heirs.fullBrothersSon > 0 && !context.blocked?.fullBrothersSon) return true;
        if (heirs.paternalBrothersSon > 0 && !context.blocked?.paternalBrothersSon) return true;
        if (fullSisterIsAsabah(heirs, context) || paternalSisterIsAsabah(heirs, context)) return true;
        return false;
    },
    fullPaternalUnclesSonsSon: ({ heirs, context }) => {
        if (heirs.fullPaternalUnclesSon > 0 && !context.blocked?.fullPaternalUnclesSon) return true;
        if (heirs.paternalUncle > 0 && !context.blocked?.paternalUncle) return true;
        if (heirs.fullPaternalUncle > 0 && !context.blocked?.fullPaternalUncle) return true;
        return blockingRules.fullPaternalUnclesSon({ heirs, context });
    },
    paternalUnclesSon: ({ heirs, context }) => {
        if (heirs.fullPaternalUnclesSon > 0 && !context.blocked?.fullPaternalUnclesSon) return true;
        if (heirs.fullPaternalUncle > 0 && !context.blocked?.fullPaternalUncle) return true;
        if (heirs.paternalUncle > 0 && !context.blocked?.paternalUncle) return true;
        if (heirs.son > 0 || heirs.sonsSon > 0 || heirs.sonsSonsSon > 0 || heirs.father > 0) return true;
        if (heirs.paternalGrandfather > 0 && !context.blocked?.paternalGrandfather) return true;
        if (heirs.fullBrother > 0 && !context.blocked?.fullBrother) return true;
        if (heirs.paternalBrother > 0 && !context.blocked?.paternalBrother) return true;
        if (heirs.fullBrothersSon > 0 && !context.blocked?.fullBrothersSon) return true;
        if (heirs.paternalBrothersSon > 0 && !context.blocked?.paternalBrothersSon) return true;
        if (fullSisterIsAsabah(heirs, context) || paternalSisterIsAsabah(heirs, context)) return true;
        return false;
    },
    paternalUnclesSonsSon: ({ heirs, context }) => {
        if (heirs.paternalUnclesSon > 0 && !context.blocked?.paternalUnclesSon) return true;
        return blockingRules.paternalUnclesSon({ heirs, context });
    },

    // Walāʾ
    maleEmancipator: ({ heirs, context }) => hasActivePrimaryHeir(heirs, context.blocked || {}),
    walaRelative: ({ heirs, context }) => {
        if (heirs.maleEmancipator > 0 && !context.blocked?.maleEmancipator) return true;
        return hasActivePrimaryHeir(heirs, context.blocked || {});
    },
    femaleEmancipator: ({ heirs, context }) => {
        if (heirs.maleEmancipator > 0 && !context.blocked?.maleEmancipator) return true;
        if (heirs.walaRelative > 0 && !context.blocked?.walaRelative) return true;
        return hasActivePrimaryHeir(heirs, context.blocked || {});
    },

    // Distant Kindred — all blocked when any primary heir is active
    daughtersSon: ({ heirs, context }) => hasActivePrimaryHeir(heirs, context.blocked || {}),
    daughtersDaughter: ({ heirs, context }) => hasActivePrimaryHeir(heirs, context.blocked || {}),
    maternalGrandfather: ({ heirs, context }) => {
        if (hasActivePrimaryHeir(heirs, context.blocked || {})) return true;
        return (heirs.daughtersSon > 0 && !context.blocked?.daughtersSon) ||
               (heirs.daughtersDaughter > 0 && !context.blocked?.daughtersDaughter);
    },
    sistersSon: ({ heirs, context }) => {
        if (hasActivePrimaryHeir(heirs, context.blocked || {})) return true;
        if (heirs.daughtersSon > 0 && !context.blocked?.daughtersSon) return true;
        if (heirs.daughtersDaughter > 0 && !context.blocked?.daughtersDaughter) return true;
        if (heirs.maternalGrandfather > 0 && !context.blocked?.maternalGrandfather) return true;
        return false;
    },
    sistersDaughter: ({ heirs, context }) => {
        if (hasActivePrimaryHeir(heirs, context.blocked || {})) return true;
        if (heirs.daughtersSon > 0 && !context.blocked?.daughtersSon) return true;
        if (heirs.daughtersDaughter > 0 && !context.blocked?.daughtersDaughter) return true;
        if (heirs.maternalGrandfather > 0 && !context.blocked?.maternalGrandfather) return true;
        return false;
    },
    uterineSiblingChildren: ({ heirs, context }) => {
        if (hasActivePrimaryHeir(heirs, context.blocked || {})) return true;
        if (heirs.daughtersSon > 0 && !context.blocked?.daughtersSon) return true;
        if (heirs.daughtersDaughter > 0 && !context.blocked?.daughtersDaughter) return true;
        if (heirs.maternalGrandfather > 0 && !context.blocked?.maternalGrandfather) return true;
        return false;
    },
    maternalUncle: ({ heirs, context }) => {
        if (hasActivePrimaryHeir(heirs, context.blocked || {})) return true;
        if (heirs.daughtersSon > 0 && !context.blocked?.daughtersSon) return true;
        if (heirs.daughtersDaughter > 0 && !context.blocked?.daughtersDaughter) return true;
        if (heirs.maternalGrandfather > 0 && !context.blocked?.maternalGrandfather) return true;
        if (heirs.sistersSon > 0 && !context.blocked?.sistersSon) return true;
        if (heirs.sistersDaughter > 0 && !context.blocked?.sistersDaughter) return true;
        return false;
    },
    maternalAunt: ({ heirs, context }) => {
        if (hasActivePrimaryHeir(heirs, context.blocked || {})) return true;
        if (heirs.daughtersSon > 0 && !context.blocked?.daughtersSon) return true;
        if (heirs.daughtersDaughter > 0 && !context.blocked?.daughtersDaughter) return true;
        if (heirs.maternalGrandfather > 0 && !context.blocked?.maternalGrandfather) return true;
        if (heirs.sistersSon > 0 && !context.blocked?.sistersSon) return true;
        if (heirs.sistersDaughter > 0 && !context.blocked?.sistersDaughter) return true;
        return false;
    },
    paternalAunt: ({ heirs, context }) => {
        if (hasActivePrimaryHeir(heirs, context.blocked || {})) return true;
        if (heirs.daughtersSon > 0 && !context.blocked?.daughtersSon) return true;
        if (heirs.daughtersDaughter > 0 && !context.blocked?.daughtersDaughter) return true;
        if (heirs.maternalGrandfather > 0 && !context.blocked?.maternalGrandfather) return true;
        if (heirs.sistersSon > 0 && !context.blocked?.sistersSon) return true;
        if (heirs.sistersDaughter > 0 && !context.blocked?.sistersDaughter) return true;
        return false;
    },
    otherDistantRelatives: ({ heirs, context }) => {
        if (hasActivePrimaryHeir(heirs, context.blocked || {})) return true;
        const distantKeys = ['daughtersSon','daughtersDaughter','maternalGrandfather',
            'sistersSon','sistersDaughter','uterineSiblingChildren','maternalUncle','maternalAunt','paternalAunt'];
        return distantKeys.some(k => heirs[k] > 0 && !context.blocked?.[k]);
    },
};

// ─── Blocking Reasons (human-readable) ───────────────────────────────────────
export const blockingReasons = {
    paternalGrandfather: { text: "Father", ruleId: "BLK-PGF", evidence: "Ijmāʿ (Consensus)", reference: "Al-Minhāj" },
    maternalGrandmother: { text: "Mother", ruleId: "BLK-MGM", evidence: "Hadith & Ijmāʿ", reference: "Al-Minhāj" },
    paternalGrandmother: { text: "Mother or Father", ruleId: "BLK-PGM", evidence: "Hadith & Ijmāʿ", reference: "Al-Minhāj" },
    sonsSon: { text: "Son", ruleId: "BLK-SS", evidence: "Consensus", reference: "Al-Minhāj" },
    sonsDaughter: { text: "Son, or two+ Daughters without Son's Son", ruleId: "BLK-SD", evidence: "Consensus", reference: "Al-Minhāj" },
    sonsSonsSon: { text: "Son or Son's Son", ruleId: "BLK-SSS", evidence: "Consensus", reference: "Al-Minhāj" },
    sonsSonsDaughter: { text: "Son, Son's Son, or two+ Daughters", ruleId: "BLK-SSD", evidence: "Consensus", reference: "Al-Minhāj" },
    fullBrother: { text: "Son, Son's Son, or Father", ruleId: "BLK-FB", evidence: "Qurʾān 4:176 & Consensus", reference: "Al-Minhāj" },
    fullSister: { text: "Son, Son's Son, or Father", ruleId: "BLK-FS", evidence: "Qurʾān 4:176 & Consensus", reference: "Al-Minhāj" },
    paternalBrother: { text: "Full Brother, Son, or Father", ruleId: "BLK-PB", evidence: "Consensus", reference: "Al-Minhāj" },
    paternalSister: { text: "Full Brother, two+ Full Sisters, Son, or Father", ruleId: "BLK-PS", evidence: "Consensus", reference: "Al-Minhāj" },
    maternalBrother: { text: "Descendant, Father, or Paternal Grandfather", ruleId: "BLK-MB", evidence: "Qurʾān 4:12 (Kalālah)", reference: "Al-Minhāj" },
    maternalSister: { text: "Descendant, Father, or Paternal Grandfather", ruleId: "BLK-MS", evidence: "Qurʾān 4:12 (Kalālah)", reference: "Al-Minhāj" },
    fullBrothersSon: { text: "Closer agnate relative (Brother, Father, Grandfather, etc.)", ruleId: "BLK-FBS", evidence: "Hadith: Alḥiqū", reference: "Al-Minhāj" },
    fullBrothersSonsSon: { text: "Closer agnate relative", ruleId: "BLK-FBSS", evidence: "Hadith: Alḥiqū", reference: "Al-Minhāj" },
    paternalBrothersSon: { text: "Closer agnate relative (incl. Full Brother's Son)", ruleId: "BLK-PBS", evidence: "Hadith: Alḥiqū", reference: "Al-Minhāj" },
    paternalBrothersSonsSon: { text: "Closer agnate relative", ruleId: "BLK-PBSS", evidence: "Hadith: Alḥiqū", reference: "Al-Minhāj" },
    fullPaternalUncle: { text: "Closer agnate relative (Brother, Nephew, etc.)", ruleId: "BLK-FPU", evidence: "Hadith: Alḥiqū", reference: "Al-Minhāj" },
    paternalUncle: { text: "Full Paternal Uncle or closer agnate", ruleId: "BLK-PU", evidence: "Hadith: Alḥiqū", reference: "Al-Minhāj" },
    fullPaternalUnclesSon: { text: "Uncle or closer agnate relative", ruleId: "BLK-FPUS", evidence: "Hadith: Alḥiqū", reference: "Al-Minhāj" },
    fullPaternalUnclesSonsSon: { text: "Uncle's Son or closer agnate", ruleId: "BLK-FPUSS", evidence: "Hadith: Alḥiqū", reference: "Al-Minhāj" },
    paternalUnclesSon: { text: "Full Uncle's Son or closer agnate", ruleId: "BLK-PUS", evidence: "Hadith: Alḥiqū", reference: "Al-Minhāj" },
    paternalUnclesSonsSon: { text: "Closer agnate relative", ruleId: "BLK-PUSS", evidence: "Hadith: Alḥiqū", reference: "Al-Minhāj" },
    maleEmancipator: { text: "Primary blood/legal heir present", ruleId: "BLK-ME", evidence: "Wala' rules", reference: "Al-Minhāj" },
    walaRelative: { text: "Muʿtiq or primary heir present", ruleId: "BLK-WR", evidence: "Wala' rules", reference: "Al-Minhāj" },
    femaleEmancipator: { text: "Muʿtiq, Walāʾ relative, or primary heir present", ruleId: "BLK-FE", evidence: "Wala' rules", reference: "Al-Minhāj" },
    daughtersSon: { text: "Primary heir present", ruleId: "BLK-DS", evidence: "Dhawu al-Arham Tanzil", reference: "Al-Minhāj" },
    daughtersDaughter: { text: "Primary heir present", ruleId: "BLK-DD", evidence: "Dhawu al-Arham Tanzil", reference: "Al-Minhāj" },
    maternalGrandfather: { text: "Primary heir or closer distant kindred", ruleId: "BLK-MGF", evidence: "Dhawu al-Arham Tanzil", reference: "Al-Minhāj" },
    sistersSon: { text: "Primary heir or closer distant kindred", ruleId: "BLK-SSon", evidence: "Dhawu al-Arham Tanzil", reference: "Al-Minhāj" },
    sistersDaughter: { text: "Primary heir or closer distant kindred", ruleId: "BLK-SDau", evidence: "Dhawu al-Arham Tanzil", reference: "Al-Minhāj" },
    uterineSiblingChildren: { text: "Primary heir or closer distant kindred", ruleId: "BLK-USC", evidence: "Dhawu al-Arham Tanzil", reference: "Al-Minhāj" },
    maternalUncle: { text: "Primary heir or closer distant kindred", ruleId: "BLK-MUnc", evidence: "Dhawu al-Arham Tanzil", reference: "Al-Minhāj" },
    maternalAunt: { text: "Primary heir or closer distant kindred", ruleId: "BLK-MAnt", evidence: "Dhawu al-Arham Tanzil", reference: "Al-Minhāj" },
    paternalAunt: { text: "Primary heir or closer distant kindred", ruleId: "BLK-PAnt", evidence: "Dhawu al-Arham Tanzil", reference: "Al-Minhāj" },
    otherDistantRelatives: { text: "Closer heir present", ruleId: "BLK-ODR", evidence: "Dhawu al-Arham Tanzil", reference: "Al-Minhāj" },
    // Legacy key aliases
    grandfather: { text: "Father", ruleId: "BLK-LGF", evidence: "Ijmāʿ (Consensus)", reference: "Al-Minhāj" },
    grandson: { text: "Son", ruleId: "BLK-LGS", evidence: "Consensus", reference: "Al-Minhāj" },
    granddaughter: { text: "Son, or two+ Daughters", ruleId: "BLK-LGD", evidence: "Consensus", reference: "Al-Minhāj" },
    brother: { text: "Son, Son's Son, or Father", ruleId: "BLK-LB", evidence: "Qurʾān 4:176", reference: "Al-Minhāj" },
    sister: { text: "Son, Son's Son, or Father", ruleId: "BLK-LS", evidence: "Qurʾān 4:176", reference: "Al-Minhāj" },
    sonOfFullBrother: { text: "Closer agnate relative", ruleId: "BLK-LSFB", evidence: "Hadith: Alḥiqū", reference: "Al-Minhāj" },
    sonOfPaternalBrother: { text: "Closer agnate relative", ruleId: "BLK-LSPB", evidence: "Hadith: Alḥiqū", reference: "Al-Minhāj" },
    uncle: { text: "Closer agnate relative", ruleId: "BLK-LU", evidence: "Hadith: Alḥiqū", reference: "Al-Minhāj" },
    consanguinePaternalUncle: { text: "Full Paternal Uncle or closer agnate", ruleId: "BLK-LCPU", evidence: "Hadith: Alḥiqū", reference: "Al-Minhāj" },
    paternalUncleSon: { text: "Uncle or closer agnate", ruleId: "BLK-LPUS", evidence: "Hadith: Alḥiqū", reference: "Al-Minhāj" },
    consanguinePaternalUncleSon: { text: "Full Uncle's Son or closer agnate", ruleId: "BLK-LCPUS", evidence: "Hadith: Alḥiqū", reference: "Al-Minhāj" },
};

// ─── Fixed Share Rules ────────────────────────────────────────────────────────
export const fixedShareRules = {
    husband: {
        eligible: ({ heirs }) => heirs.husband === 1,
        share: ({ context }) => context.hasDescendants ? fraction(1, 4) : fraction(1, 2),
        reason: ({ context }) => context.hasDescendants
            ? { text: "1/4 — Deceased has inheriting descendants", ruleId: "HUSB-1", evidence: "Qurʾān 4:12", reference: "Al-Minhāj (Shāfiʿī)" }
            : { text: "1/2 — No inheriting descendants", ruleId: "HUSB-2", evidence: "Qurʾān 4:12", reference: "Al-Minhāj (Shāfiʿī)" }
    },
    wife: {
        eligible: ({ heirs }) => heirs.wife > 0,
        share: ({ context }) => context.hasDescendants ? fraction(1, 8) : fraction(1, 4),
        reason: ({ context, heirs }) => {
            const s = context.hasDescendants ? "1/8" : "1/4";
            const text = context.hasDescendants
                ? (heirs.wife > 1 ? `${s} total, shared equally among ${heirs.wife} wives — Deceased has inheriting descendants` : `${s} — Deceased has inheriting descendants`)
                : (heirs.wife > 1 ? `${s} total, shared equally among ${heirs.wife} wives — No inheriting descendants` : `${s} — No inheriting descendants`);
            return {
                text,
                ruleId: context.hasDescendants ? "WIFE-1" : "WIFE-2",
                evidence: "Qurʾān 4:12",
                reference: "Al-Minhāj (Shāfiʿī)"
            };
        }
    },
    mother: {
        eligible: ({ heirs }) => heirs.mother === 1,
        share: ({ context, heirs }) => {
            if (context.hasDescendants || context.siblingCount >= 2) return fraction(1, 6);
            if (heirs.father > 0 && (heirs.husband > 0 || heirs.wife > 0)) {
                if (heirs.husband > 0) return fraction(1, 6);
                if (heirs.wife > 0) return fraction(1, 4);
            }
            return fraction(1, 3);
        },
        reason: ({ context, heirs }) => {
            if (context.hasDescendants) return { text: "1/6 — Deceased has inheriting descendants", ruleId: "MOTH-1", evidence: "Qurʾān 4:11", reference: "Al-Minhāj (Shāfiʿī)" };
            if (context.siblingCount >= 2) return { text: "1/6 — Two or more siblings reduce mother's share", ruleId: "MOTH-2", evidence: "Qurʾān 4:11", reference: "Al-Minhāj (Shāfiʿī)" };
            if (heirs.father > 0 && heirs.husband > 0) return { text: "1/6 — Gharāwiyyatān: 1/3 of remainder after husband's 1/2", ruleId: "MOTH-3", evidence: "Ijmāʿ (ʿUmariyyatān)", reference: "Al-Minhāj (Shāfiʿī)" };
            if (heirs.father > 0 && heirs.wife > 0) return { text: "1/4 — Gharāwiyyatān: 1/3 of remainder after wife's 1/4", ruleId: "MOTH-4", evidence: "Ijmāʿ (ʿUmariyyatān)", reference: "Al-Minhāj (Shāfiʿī)" };
            return { text: "1/3 — No descendants or multiple siblings", ruleId: "MOTH-5", evidence: "Qurʾān 4:11", reference: "Al-Minhāj (Shāfiʿī)" };
        }
    },
    grandmothers: {
        eligible: ({ heirs, context }) =>
            (heirs.maternalGrandmother > 0 && !context.blocked.maternalGrandmother) ||
            (heirs.paternalGrandmother > 0 && !context.blocked.paternalGrandmother),
        share: () => fraction(1, 6),
        reason: ({ heirs, context }) => {
            const gmCount =
                (heirs.maternalGrandmother > 0 && !context.blocked.maternalGrandmother ? 1 : 0) +
                (heirs.paternalGrandmother > 0 && !context.blocked.paternalGrandmother ? 1 : 0);
            return gmCount > 1
                ? { text: "1/6 total, shared equally between valid grandmothers", ruleId: "GM-1", evidence: "Sunnah", reference: "Al-Minhāj (Shāfiʿī)" }
                : { text: "1/6 — Grandmother's fixed share", ruleId: "GM-2", evidence: "Sunnah", reference: "Al-Minhāj (Shāfiʿī)" };
        }
    },
    father: {
        eligible: ({ heirs }) => heirs.father === 1,
        share: ({ context }) => {
            if (context.hasMaleDescendants) return fraction(1, 6);
            if (context.hasDescendants) return fraction(1, 6);
            return null; // Pure asabah
        },
        reason: ({ context }) => {
            if (context.hasMaleDescendants) return { text: "1/6 fixed share — Male descendants present", ruleId: "FATH-1", evidence: "Qurʾān 4:11", reference: "Al-Minhāj (Shāfiʿī)" };
            if (context.hasDescendants) return { text: "1/6 fixed share + residue — Female descendants only", ruleId: "FATH-2", evidence: "Qurʾān 4:11", reference: "Al-Minhāj (Shāfiʿī)" };
            return { text: "Pure ʿaṣabah", ruleId: "FATH-3", evidence: "Sunnah", reference: "Al-Minhāj (Shāfiʿī)" };
        }
    },
    paternalGrandfather: {
        eligible: ({ heirs, context }) =>
            heirs.paternalGrandfather === 1 && !context.blocked.paternalGrandfather,
        share: ({ context }) => {
            if (context.hasMaleDescendants) return fraction(1, 6);
            if (context.hasDescendants) return fraction(1, 6);
            return null;
        },
        reason: ({ context }) => {
            if (context.hasMaleDescendants) return { text: "1/6 fixed share — Male descendants present", ruleId: "PGF-1", evidence: "Sunnah (analogous to Father)", reference: "Al-Minhāj (Shāfiʿī)" };
            if (context.hasDescendants) return { text: "1/6 fixed share + residue — Female descendants only", ruleId: "PGF-2", evidence: "Sunnah", reference: "Al-Minhāj (Shāfiʿī)" };
            return { text: "Pure ʿaṣabah", ruleId: "PGF-3", evidence: "Sunnah", reference: "Al-Minhāj (Shāfiʿī)" };
        }
    },
    daughter: {
        eligible: ({ heirs }) => heirs.daughter > 0 && heirs.son === 0,
        share: ({ heirs }) => heirs.daughter === 1 ? fraction(1, 2) : fraction(2, 3),
        reason: ({ heirs }) => heirs.daughter === 1
            ? { text: "1/2 — Single daughter, no son", ruleId: "DAU-1", evidence: "Qurʾān 4:11", reference: "Al-Minhāj (Shāfiʿī)" }
            : { text: "2/3 total — Multiple daughters, no son", ruleId: "DAU-2", evidence: "Qurʾān 4:11", reference: "Al-Minhāj (Shāfiʿī)" }
    },
    sonsDaughter: {
        eligible: ({ heirs, context }) => {
            if (context.blocked.sonsDaughter) return false;
            if (heirs.son > 0) return false;
            if (heirs.sonsSon > 0) return false;
            return heirs.sonsDaughter > 0;
        },
        share: ({ heirs }) => {
            if (heirs.daughter === 1) return fraction(1, 6);
            return heirs.sonsDaughter === 1 ? fraction(1, 2) : fraction(2, 3);
        },
        reason: ({ heirs }) => {
            if (heirs.daughter === 1) return { text: "1/6 — Completing the 2/3 cap with one daughter", ruleId: "SDAU-1", evidence: "Sunnah", reference: "Al-Minhāj (Shāfiʿī)" };
            return heirs.sonsDaughter === 1
                ? { text: "1/2 — Single son's daughter, no son/daughter/son's son", ruleId: "SDAU-2", evidence: "Qurʾān 4:11 (analogy)", reference: "Al-Minhāj (Shāfiʿī)" }
                : { text: "2/3 total — Multiple son's daughters, no son/daughter/son's son", ruleId: "SDAU-3", evidence: "Qurʾān 4:11 (analogy)", reference: "Al-Minhāj (Shāfiʿī)" };
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
            ? { text: "1/2 — Single full sister, no full brother, no descendant", ruleId: "FS-1", evidence: "Qurʾān 4:176", reference: "Al-Minhāj (Shāfiʿī)" }
            : { text: "2/3 total — Multiple full sisters, no full brother", ruleId: "FS-2", evidence: "Qurʾān 4:176", reference: "Al-Minhāj (Shāfiʿī)" }
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
            if (heirs.fullSister === 1) return { text: "1/6 — Completing 2/3 with one full sister", ruleId: "PS-1", evidence: "Sunnah", reference: "Al-Minhāj (Shāfiʿī)" };
            return heirs.paternalSister === 1
                ? { text: "1/2 — Single paternal sister, no full sibling, no descendant", ruleId: "PS-2", evidence: "Qurʾān 4:176 (analogy)", reference: "Al-Minhāj (Shāfiʿī)" }
                : { text: "2/3 total — Multiple paternal sisters, no paternal brother", ruleId: "PS-3", evidence: "Qurʾān 4:176 (analogy)", reference: "Al-Minhāj (Shāfiʿī)" };
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
                ? { text: "1/6 — Single maternal sibling", ruleId: "MSIB-1", evidence: "Qurʾān 4:12", reference: "Al-Minhāj (Shāfiʿī)" }
                : { text: "1/3 total, shared equally (male=female) — Multiple maternal siblings", ruleId: "MSIB-2", evidence: "Qurʾān 4:12", reference: "Al-Minhāj (Shāfiʿī)" };
        }
    }
};
