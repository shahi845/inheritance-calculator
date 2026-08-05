/**
 * jumhurRules.js — Jumhūr-specific detection and calculation logic.
 */

import { fraction } from '../../math/fractions.js';

export class PolicyRequiredError extends Error {
    constructor(policyKey, message, options = []) {
        super(message);
        this.name = 'PolicyRequiredError';
        this.policyKey = policyKey;
        this.options = options;
    }
}

export const JUMHUR_POLICY = {
    commonFixedShares: "all_four_sunni",
    spouseShares: "all_four_sunni",
    parentShares: "all_four_sunni",
    childShares: "all_four_sunni",
    maternalSiblingShares: "all_four_sunni",
    asabahPrinciple: "all_four_sunni",
    awl: "all_four_sunni",
    grandfatherWithSiblings: "majority_non_hanafi",
    paternalGrandmotherWithFather: "majority_excluded",
    mushtarikah: "no_single_jumhur",
    radd: "no_single_classical_jumhur",
    dhawilArham: "no_single_classical_jumhur",
    surplusFallback: "requires_setting"
};

/**
 * Checks if the case is the classic Mushtarikah (Ḥimāriyyah) case.
 */
export function isMushtarikah(heirs) {
    const hasHusband = heirs.husband > 0;
    const hasMotherOrGrandmother = heirs.mother > 0 || heirs.maternalGrandmother > 0 || heirs.paternalGrandmother > 0;
    const hasMultipleUterines = (heirs.maternalBrother || 0) + (heirs.maternalSister || 0) >= 2;
    const hasFullBrother = (heirs.fullBrother || 0) > 0;
    
    // To be true Mushtarikah, they must exhaust the estate (husband 1/2, mother 1/6, uterines 1/3 = 1)
    return hasHusband && hasMotherOrGrandmother && hasMultipleUterines && hasFullBrother;
}

/**
 * Checks if there is a grandfather with full or paternal siblings.
 */
export function hasGrandfatherWithSiblings(heirs) {
    if (heirs.paternalGrandfather === 0) return false;
    const siblingsCount = (heirs.fullBrother || 0) + (heirs.fullSister || 0) + (heirs.paternalBrother || 0) + (heirs.paternalSister || 0);
    return siblingsCount > 0;
}

/**
 * Detects special Jumhūr cases and returns an object detailing the required policy if applicable.
 */
export function detectJumhurSpecialCases(heirs) {
    if (isMushtarikah(heirs)) {
        return {
            type: "mushtarikah",
            status: "no_single_jumhur"
        };
    }

    if (hasGrandfatherWithSiblings(heirs)) {
        return {
            type: "grandfather_with_siblings",
            policy: "majority_non_hanafi"
        };
    }

    return { type: "none" };
}

/**
 * Applies Jumhūr blocking rules (Ḥajb).
 * Notable rule: Father blocks paternal grandmother, but grandfather does NOT block siblings here.
 */
export function applyJumhurHajb(heirsInput) {
    const blocked = {};
    const messages = [];
    
    function block(heirKey, reason) {
        if (heirsInput[heirKey] > 0 && !blocked[heirKey]) {
            blocked[heirKey] = true;
            messages.push(`${heirKey} BLOCKED: ${reason}`);
        }
    }

    if (heirsInput.son > 0) {
        block('grandson', "Blocked by son");
        block('granddaughter', "Blocked by son");
    }

    if (heirsInput.father > 0) {
        block('paternalGrandfather', "Blocked by father");
        block('fullBrother', "Blocked by father");
        block('fullSister', "Blocked by father");
        block('paternalBrother', "Blocked by father");
        block('paternalSister', "Blocked by father");
        block('paternalGrandmother', "Blocked by father (Jumhūr majority: Ḥanafī, Mālikī, Shāfiʿī)");
    }

    if (heirsInput.mother > 0) {
        block('maternalGrandmother', "Blocked by mother");
        block('paternalGrandmother', "Blocked by mother");
    }

    const hasDescendant = heirsInput.son > 0 || heirsInput.daughter > 0 || heirsInput.grandson > 0 || heirsInput.granddaughter > 0;

    if (hasDescendant || heirsInput.father > 0 || heirsInput.paternalGrandfather > 0) {
        block('maternalBrother', "Blocked by descendant or male ascendant");
        block('maternalSister', "Blocked by descendant or male ascendant");
    }

    if (heirsInput.son > 0 || heirsInput.grandson > 0 || heirsInput.father > 0) {
        block('fullBrother', "Blocked by son, grandson, or father");
        block('fullSister', "Blocked by son, grandson, or father");
        block('paternalBrother', "Blocked by son, grandson, or father");
        block('paternalSister', "Blocked by son, grandson, or father");
    }
    
    // Unlike Ḥanafī, we DO NOT block full/paternal siblings if paternalGrandfather exists here.

    return { blocked, messages };
}
