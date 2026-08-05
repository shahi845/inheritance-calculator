/**
 * Validates normalized heir input before calculation.
 * Throws hard errors for impossible inputs.
 * Returns warning messages for advisory situations.
 */
export function validateInput(heirs) {
    const warnings = [];

    // ─── Hard errors (impossible combinations) ─────────────────────────────────
    const totalHeirs = Object.values(heirs).reduce((sum, count) => sum + count, 0);
    if (totalHeirs === 0) {
        throw new Error(
            "No heirs entered. Estate remains unassigned or goes to Bayt al-Māl."
        );
    }

    if (heirs.husband > 0 && heirs.wife > 0) {
        throw new Error(
            "A deceased cannot leave behind both a husband and a wife. Please enter only one."
        );
    }

    if (heirs.father > 1) {
        throw new Error("Cannot have more than one father.");
    }
    if (heirs.mother > 1) {
        throw new Error("Cannot have more than one mother.");
    }
    if (heirs.husband > 1) {
        throw new Error("Cannot have more than one husband.");
    }
    if (heirs.wife > 4) {
        throw new Error("Cannot have more than four wives in Islamic law.");
    }
    if (heirs.paternalGrandfather > 1) {
        throw new Error("Cannot have more than one paternal grandfather.");
    }
    if (heirs.paternalGrandmother > 1) {
        throw new Error("Cannot have more than one paternal grandmother.");
    }
    if (heirs.maternalGrandmother > 1) {
        throw new Error("Cannot have more than one maternal grandmother.");
    }
    if (heirs.maternalGrandfather > 1) {
        throw new Error("Cannot have more than one maternal grandfather.");
    }
    if (heirs.maleEmancipator > 1) {
        throw new Error("Cannot have more than one male patron (Muʿtiq).");
    }
    if (heirs.femaleEmancipator > 1) {
        throw new Error("Cannot have more than one female patron (Muʿtiqah).");
    }

    // ─── Informational warnings (blocking pre-notifications) ───────────────────
    if (heirs.paternalGrandfather > 0 && heirs.father > 0) {
        warnings.push(
            "⚠️ Paternal grandfather is entered but will be BLOCKED by the father."
        );
    }
    if (heirs.paternalGrandmother > 0 && (heirs.mother > 0 || heirs.father > 0)) {
        warnings.push(
            "⚠️ Paternal grandmother is entered but will be BLOCKED by the mother or father."
        );
    }
    if (heirs.maternalGrandmother > 0 && heirs.mother > 0) {
        warnings.push(
            "⚠️ Maternal grandmother is entered but will be BLOCKED by the mother."
        );
    }
    if (heirs.sonsSon > 0 && heirs.son > 0) {
        warnings.push(
            "⚠️ Son's son (grandson) is entered but will be BLOCKED by the son."
        );
    }
    if (heirs.sonsDaughter > 0 && heirs.son > 0) {
        warnings.push(
            "⚠️ Son's daughter (granddaughter) is entered but will be BLOCKED by the son."
        );
    }
    if ((heirs.fullBrother > 0 || heirs.fullSister > 0) &&
        (heirs.son > 0 || heirs.sonsSon > 0 || heirs.father > 0)) {
        warnings.push(
            "⚠️ Full siblings are entered but will be BLOCKED by a son, grandson, or father."
        );
    }
    if ((heirs.maternalBrother > 0 || heirs.maternalSister > 0) &&
        (heirs.son > 0 || heirs.sonsSon > 0 || heirs.daughter > 0 || heirs.sonsDaughter > 0 || heirs.father > 0 || heirs.paternalGrandfather > 0)) {
        warnings.push(
            "⚠️ Maternal (uterine) siblings are entered but will be BLOCKED by descendants or an ascendant male."
        );
    }

    // Grandfather-with-siblings advisory
    if (heirs.paternalGrandfather > 0 && !heirs.father &&
        (heirs.fullBrother > 0 || heirs.fullSister > 0 || heirs.paternalBrother > 0 || heirs.paternalSister > 0)) {
        warnings.push(
            "ℹ️ Grandfather with siblings detected. The advanced Shāfiʿī best-share (muqāsamah / 1/3 / 1/6) module will be applied."
        );
    }

    return warnings;
}
