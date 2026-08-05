/**
 * presets.js — Preset heir configurations for quick-load buttons.
 *
 * Keys must match canonical heir input IDs in the HTML.
 */

export const PRESETS = {
    // Shāfiʿī presets
    gharawiyyatayn1: { wife: 1, father: 1, mother: 1 },
    awl1:           { husband: 1, daughter: 2, father: 1, mother: 1 },
    radd1:          { mother: 1, daughter: 1 },

    // Mālikī presets
    malikiMushtarikah: { husband: 1, mother: 1, maternalBrother: 2, brother: 1 },
    malikiGharra:      { husband: 1, mother: 1, paternalGrandfather: 1, sister: 1 },
};

/**
 * Loads a preset into the heir input fields.
 * Resets all fields to 0 first, then applies preset values.
 *
 * @param {string} presetName - Key from PRESETS
 */
export function loadPreset(presetName) {
    const data = PRESETS[presetName];
    if (!data) return;

    // Reset all heir inputs
    document.querySelectorAll('.heirs-container input[type="number"]').forEach(input => {
        input.value = 0;
    });

    // Apply preset values
    for (const key in data) {
        const input = document.getElementById(key);
        if (input) input.value = data[key];
    }
}
