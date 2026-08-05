/**
 * validationAlerts.js — Real-time blocking warnings shown as the user types.
 */

import { getHeirDisplayName } from '../../utils/formatResults.js';
import { escapeHtml } from '../../utils/escapeHtml.js';

/**
 * Reads current inputs, computes blocking pre-notifications, and updates
 * the #validationAlerts container.
 */
export function updateRealTimeValidation() {
    const heirsInput = {};
    document.querySelectorAll('.heirs-container input[type="number"]').forEach(input => {
        heirsInput[input.id] = parseInt(input.value) || 0;
    });

    const warnings = [];

    if (heirsInput.husband > 0 && heirsInput.wife > 0) {
        warnings.push("⚠️ <strong>Deceased cannot have both Husband and Wife</strong>: A single person can only leave behind one spouse category.");
    }

    if (heirsInput.father > 0) {
        const blocked = ['grandfather', 'brother', 'sister', 'paternalBrother', 'paternalSister',
            'sonOfFullBrother', 'sonOfPaternalBrother', 'uncle', 'consanguinePaternalUncle',
            'paternalUncleSon', 'consanguinePaternalUncleSon'];
        const activeBlocked = blocked.filter(key => heirsInput[key] > 0);
        if (activeBlocked.length > 0) {
            warnings.push(`⚠️ <strong>Father blocks other relatives</strong>: The Father will block: ${activeBlocked.map(k => escapeHtml(getHeirDisplayName(k))).join(', ')}.`);
        }
    }

    if (heirsInput.mother > 0) {
        const blocked = ['maternalGrandmother', 'paternalGrandmother'];
        const activeBlocked = blocked.filter(key => heirsInput[key] > 0);
        if (activeBlocked.length > 0) {
            warnings.push(`⚠️ <strong>Mother blocks Grandmothers</strong>: The Mother will block: ${activeBlocked.map(k => escapeHtml(getHeirDisplayName(k))).join(', ')}.`);
        }
    }

    if (heirsInput.son > 0) {
        const blocked = ['grandson', 'granddaughter', 'brother', 'sister', 'paternalBrother',
            'paternalSister', 'maternalBrother', 'maternalSister', 'sonOfFullBrother',
            'sonOfPaternalBrother', 'uncle', 'consanguinePaternalUncle',
            'paternalUncleSon', 'consanguinePaternalUncleSon'];
        const activeBlocked = blocked.filter(key => heirsInput[key] > 0);
        if (activeBlocked.length > 0) {
            warnings.push(`⚠️ <strong>Son blocks other heirs</strong>: The Son will block: ${activeBlocked.map(k => escapeHtml(getHeirDisplayName(k))).join(', ')}.`);
        }
    }

    if (heirsInput.grandson > 0) {
        const blocked = ['brother', 'sister', 'paternalBrother', 'paternalSister',
            'maternalBrother', 'maternalSister', 'sonOfFullBrother', 'sonOfPaternalBrother',
            'uncle', 'consanguinePaternalUncle', 'paternalUncleSon', 'consanguinePaternalUncleSon'];
        const activeBlocked = blocked.filter(key => heirsInput[key] > 0);
        if (activeBlocked.length > 0) {
            warnings.push(`⚠️ <strong>Grandson blocks other heirs</strong>: The Grandson will block: ${activeBlocked.map(k => escapeHtml(getHeirDisplayName(k))).join(', ')}.`);
        }
    }

    const container = document.getElementById('validationAlerts');
    if (!container) return;

    if (warnings.length > 0) {
        container.innerHTML = warnings.map(w => `<div class="validation-alert-item">${w}</div>`).join('');
        container.classList.remove('hidden');
    } else {
        container.innerHTML = '';
        container.classList.add('hidden');
    }
}

/** Attaches input listeners to all heir fields to trigger live validation. */
export function initValidationAlerts() {
    document.querySelectorAll('.heirs-container input[type="number"]').forEach(input => {
        input.addEventListener('input', updateRealTimeValidation);
    });
}
