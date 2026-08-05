/**
 * Builds the calculation context from normalized heirs input.
 * This context is passed to all engine modules and mutated as computation proceeds.
 */
export function buildContext(heirs) {
    // Descendants
    const hasSon = heirs.son > 0;
    const hasDaughter = heirs.daughter > 0;
    const hasSonsSon = heirs.sonsSon > 0;
    const hasSonsDaughter = heirs.sonsDaughter > 0;
    const hasSonsSonsSon = heirs.sonsSonsSon > 0;

    const hasMaleDescendants = hasSon || hasSonsSon || hasSonsSonsSon;
    const hasFemaleDescendants = hasDaughter || hasSonsDaughter || heirs.sonsSonsDaughter > 0;
    const hasDescendants = hasMaleDescendants || hasFemaleDescendants;

    // Siblings count (for mother's share calculation)
    // Counts ALL siblings who are not disqualified, regardless of blocking
    const siblingCount =
        heirs.fullBrother + heirs.fullSister +
        heirs.paternalBrother + heirs.paternalSister +
        heirs.maternalBrother + heirs.maternalSister;

    return {
        // Descendant flags
        hasMaleDescendants,
        hasFemaleDescendants,
        hasDescendants,
        hasSon,
        hasDaughter,
        hasSonsSon,
        hasSonsDaughter,

        // Ascendant flags
        hasFather: heirs.father > 0,
        hasPaternalGrandfather: heirs.paternalGrandfather > 0,

        // Sibling count (for mother 1/3 → 1/6 reduction rule)
        siblingCount,

        // Blocking state — populated by applyBlocking
        blocked: {},

        // Disqualification state — populated by applyEligibility
        disqualified: {},

        // Flags set during calculation
        awlApplied: false,
        raddApplied: false,
        musharrakahApplied: false,
        grandfatherWithSiblings: false,
        fullSisterAsAsabah: false,   // set when fullSister takes residuary with female descendant

        // Radd/Bayt al-Māl mode: 'returnToHeirs' | 'baytulMal'
        // Shāfiʿī position: surplus goes to Bayt al-Māl when no residuaries.
        // Toggle can be set by UI before calling calculateInheritance.
        raddMode: 'baytulMal',

        // Dhawu al-Arḥām mode: 'disabled' | 'enabledWhenNoBaytulMal'
        dhawuAlArhamMode: 'enabledWhenNoBaytulMal',

        // Calculation log messages
        messages: [],

        // Structured Calculation Steps for UI (Priority 1)
        steps: [],

        // Per-heir explanation data (populated during calculation)
        explanations: {},
    };
}
