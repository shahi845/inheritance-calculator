/**
 * Canonical heir key definitions for the Shāfiʿī engine.
 * These are the internal keys used throughout the engine.
 * The HTML form may use legacy keys; normalizeInput.js maps them here.
 */
export const defaultHeirs = {
    // ─── Spouses ───────────────────────────────────────────────────────────────
    husband: 0,
    wife: 0,

    // ─── Parents ───────────────────────────────────────────────────────────────
    father: 0,
    mother: 0,

    // ─── Grandparents ──────────────────────────────────────────────────────────
    paternalGrandfather: 0,      // canonical (was: grandfather)
    paternalGrandmother: 0,
    maternalGrandmother: 0,

    // ─── Descendants ───────────────────────────────────────────────────────────
    son: 0,
    daughter: 0,
    sonsSon: 0,                  // canonical (was: grandson)
    sonsDaughter: 0,             // canonical (was: granddaughter) — also fixed-share heir
    sonsSonsSon: 0,              // son's son's son (further male-line)
    sonsSonsDaughter: 0,         // son's son's daughter

    // ─── Full Siblings ─────────────────────────────────────────────────────────
    fullBrother: 0,              // canonical (was: brother)
    fullSister: 0,               // canonical (was: sister)

    // ─── Paternal (Consanguine) Siblings ───────────────────────────────────────
    paternalBrother: 0,
    paternalSister: 0,

    // ─── Maternal (Uterine) Siblings ───────────────────────────────────────────
    maternalBrother: 0,
    maternalSister: 0,

    // ─── Nephews (Brothers' Sons and their descendants) ────────────────────────
    fullBrothersSon: 0,          // canonical (was: sonOfFullBrother)
    paternalBrothersSon: 0,      // canonical (was: sonOfPaternalBrother)
    fullBrothersSonsSon: 0,
    paternalBrothersSonsSon: 0,

    // ─── Paternal Uncles ───────────────────────────────────────────────────────
    fullPaternalUncle: 0,        // canonical (was: uncle)
    paternalUncle: 0,            // canonical (was: consanguinePaternalUncle)

    // ─── Cousins (Uncles' Sons) ────────────────────────────────────────────────
    fullPaternalUnclesSon: 0,    // canonical (was: paternalUncleSon)
    paternalUnclesSon: 0,        // canonical (was: consanguinePaternalUncleSon)
    fullPaternalUnclesSonsSon: 0,
    paternalUnclesSonsSon: 0,

    // ─── Walāʾ (Emancipator) ───────────────────────────────────────────────────
    maleEmancipator: 0,          // canonical (was: mutiq)
    femaleEmancipator: 0,        // canonical (was: mutiqah)
    walaRelative: 0,

    // ─── Dhawu al-Arḥām (Distant Kindred) ─────────────────────────────────────
    daughtersSon: 0,             // canonical (was: daughterSon)
    daughtersDaughter: 0,        // canonical (was: daughterDaughter)
    maternalGrandfather: 0,
    sistersSon: 0,               // canonical (was: sisterSon)
    sistersDaughter: 0,          // canonical (was: sisterDaughter)
    maternalUncle: 0,
    maternalAunt: 0,
    paternalAunt: 0,
    uterineSiblingChildren: 0,
    otherDistantRelatives: 0,

    // ─── Disqualification Flags (set by eligibility module) ───────────────────
    // These are not entered by the user but set programmatically:
    // killedDeceased, differentReligion, lianChild, missingPerson
};

/**
 * ʿAṣabah priority chain in descending order.
 * Each entry is [maleKey, femaleKey | null].
 * When both male and female are present, they share in 2:1 ratio.
 * Father and grandfather are handled separately (sharer + residuary logic).
 */
export const asabahChain = [
    // Descendants
    ['son',                      'daughter'],
    ['sonsSon',                  'sonsDaughter'],
    ['sonsSonsSon',              'sonsSonsDaughter'],
    // Ascendants — father and paternalGrandfather handled specially
    ['father',                   null],
    ['paternalGrandfather',      null],
    // Full siblings
    ['fullBrother',              'fullSister'],
    // Paternal siblings
    ['paternalBrother',          'paternalSister'],
    // Nephews (full)
    ['fullBrothersSon',          null],
    ['fullBrothersSonsSon',      null],
    // Nephews (paternal)
    ['paternalBrothersSon',      null],
    ['paternalBrothersSonsSon',  null],
    // Uncles
    ['fullPaternalUncle',        null],
    ['paternalUncle',            null],
    // Cousins
    ['fullPaternalUnclesSon',    null],
    ['fullPaternalUnclesSonsSon',null],
    ['paternalUnclesSon',        null],
    ['paternalUnclesSonsSon',    null],
    // Walāʾ
    ['maleEmancipator',          null],
    ['walaRelative',             null],
    ['femaleEmancipator',        null],
];

/**
 * Legacy key → canonical key mapping.
 * Used by normalizeInput.js to accept old HTML form field IDs.
 */
export const legacyKeyMap = {
    grandfather: 'paternalGrandfather',
    grandson: 'sonsSon',
    granddaughter: 'sonsDaughter',
    brother: 'fullBrother',
    sister: 'fullSister',
    sonOfFullBrother: 'fullBrothersSon',
    sonOfPaternalBrother: 'paternalBrothersSon',
    uncle: 'fullPaternalUncle',
    consanguinePaternalUncle: 'paternalUncle',
    paternalUncleSon: 'fullPaternalUnclesSon',
    consanguinePaternalUncleSon: 'paternalUnclesSon',
    mutiq: 'maleEmancipator',
    mutiqah: 'femaleEmancipator',
    daughterSon: 'daughtersSon',
    daughterDaughter: 'daughtersDaughter',
    sisterSon: 'sistersSon',
    sisterDaughter: 'sistersDaughter',
    // grandmother is an alias used by old form
    grandmother: 'paternalGrandmother',
};

/**
 * Heirs that are never totally blocked (always retain their Quranic right
 * to at least check for a share).
 */
export const NEVER_BLOCKED = ['father', 'mother', 'son', 'daughter', 'husband', 'wife'];

/**
 * Fixed-share heirs list (Aṣḥāb al-Furūḍ).
 */
export const FIXED_SHARE_HEIRS = [
    'husband', 'wife', 'father', 'mother',
    'paternalGrandfather', 'paternalGrandmother', 'maternalGrandmother',
    'daughter', 'sonsDaughter',
    'fullSister', 'paternalSister',
    'maternalBrother', 'maternalSister'
];
