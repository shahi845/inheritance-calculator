/**
 * inputReader.js — Reads heir counts and madhhab options from the DOM.
 */

/**
 * Reads all heir number inputs from the heirs container.
 * @returns {Object} Map of heir key → integer count
 */
export function readHeirsInput() {
    const heirsInput = {};
    document.querySelectorAll('.heirs-container input[type="number"]').forEach(input => {
        heirsInput[input.id] = parseInt(input.value) || 0;
    });
    return heirsInput;
}

/**
 * Reads Mālikī-specific settings from the settings panel.
 * @returns {{ surplusMode, dhawuArham, preventives }}
 */
export function readMalikiOptions() {
    const surplusMode = document.getElementById('malikiSurplusMode')?.value || 'classical_baytulmal';
    const dhawuArham  = document.getElementById('malikiDhawuArham')?.checked || false;

    const preventiveTarget = (document.getElementById('malikiPreventiveTarget')?.value || '').trim();
    const preventives = {};

    if (preventiveTarget) {
        preventives.targetHeir       = preventiveTarget;
        preventives.intentionalKiller = document.getElementById('malikiPreventiveKiller')?.checked || false;

        if (document.getElementById('malikiPreventiveReligion')?.checked) {
            preventives.sameReligion = false;
        }
        if (document.getElementById('malikiPreventiveSlavery')?.checked) {
            preventives.fullyFree = false;
        }
        if (document.getElementById('malikiPreventiveDead')?.checked) {
            preventives.aliveAtDeath = false;
        }
    }

    return { surplusMode, dhawuArham, preventives };
}

/**
 * Returns the currently selected madhhab from the hidden input.
 * @returns {string} 'shafii' | 'hanafi' | 'maliki' | 'hanbali' | 'jumhur'
 */
export function readSelectedMadhhab() {
    return document.getElementById('madhhabSelector')?.value || 'shafii';
}

/**
 * Returns the currently selected radd mode.
 * @returns {string} 'baytulMal' | 'returnToHeirs'
 */
export function readRaddMode() {
    return document.getElementById('raddModeSelector')?.value || 'baytulMal';
}

/**
 * Reads Jumhūr policy settings from the settings panel.
 * Returns the three policy dropdowns: mushtarikah, surplus, and dhawu al-arham.
 * @returns {{ mushtarikahPolicy, surplusPolicy, dhawilArhamPolicy }}
 */
export function readJumhurOptions() {
    return {
        mushtarikahPolicy: document.getElementById('mushtarikahPolicy')?.value || 'ask_if_detected',
        surplusPolicy:     document.getElementById('surplusPolicy')?.value     || 'ask_if_detected',
        dhawilArhamPolicy: document.getElementById('dhawilArhamPolicy')?.value || 'ask_if_detected',
    };
}
