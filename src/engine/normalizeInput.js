import { defaultHeirs, legacyKeyMap } from '../data/heirs.js';

/**
 * Normalizes raw form input into canonical heir keys.
 * Accepts both legacy keys (old HTML form IDs) and canonical keys.
 * Clamps values to legal ranges.
 */
export function normalizeInput(raw) {
    const heirs = { ...defaultHeirs };

    // First pass: map legacy keys to canonical keys in the raw input
    const normalized = {};
    for (const key in raw) {
        const canonicalKey = legacyKeyMap[key] || key;
        // Sum up if multiple legacy keys map to the same canonical key
        normalized[canonicalKey] = (normalized[canonicalKey] || 0) + (parseInt(raw[key], 10) || 0);
    }

    // Second pass: apply clamped values to the canonical heirs object
    for (const key in heirs) {
        if (normalized[key] !== undefined) {
            let val = normalized[key];
            if (isNaN(val) || val < 0) val = 0;

            // Apply cardinality clamps
            const singletonKeys = [
                'husband', 'father', 'mother',
                'paternalGrandfather', 'paternalGrandmother', 'maternalGrandmother',
                'maternalGrandfather', 'maleEmancipator', 'femaleEmancipator'
            ];
            if (singletonKeys.includes(key)) {
                val = Math.min(val, 1);
            } else if (key === 'wife') {
                val = Math.min(val, 4);
            }

            heirs[key] = val;
        }
    }

    return heirs;
}
