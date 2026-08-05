/**
 * types.js — JSDoc type definitions for the Farāʾiḍ calculator.
 *
 * These are documentation-only types. JavaScript does not enforce them at
 * runtime. Use these as references when writing or reading engine code.
 */

/**
 * @typedef {Object} Fraction
 * @property {number} num - Numerator
 * @property {number} den - Denominator (always positive, always simplified)
 */

/**
 * @typedef {Object} HeirsInput
 * @property {number} husband
 * @property {number} wife
 * @property {number} son
 * @property {number} daughter
 * @property {number} father
 * @property {number} mother
 * @property {number} paternalGrandfather
 * @property {number} paternalGrandmother
 * @property {number} maternalGrandmother
 * @property {number} fullBrother
 * @property {number} fullSister
 * @property {number} paternalBrother
 * @property {number} paternalSister
 * @property {number} maternalBrother
 * @property {number} maternalSister
 * // ... and all other canonical heir keys
 */

/**
 * @typedef {Object} ShareEntry
 * @property {string}   heir           - Canonical heir key (e.g. 'husband')
 * @property {string}   name           - Display name (e.g. 'Husband')
 * @property {number}   count          - Number of this heir
 * @property {Fraction} baseShare      - Share before ʿawl adjustment
 * @property {Fraction} adjustedShare  - Final share after ʿawl
 * @property {string}   status         - 'Sharer' | 'Residuary' | 'Blocked' | 'Bayt al-Māl'
 * @property {string}   reason         - Human-readable explanation
 */

/**
 * @typedef {Object} CalculationContext
 * @property {boolean}  hasDescendants
 * @property {boolean}  hasMaleDescendants
 * @property {boolean}  hasFemaleDescendants
 * @property {boolean}  hasFather
 * @property {boolean}  hasPaternalGrandfather
 * @property {number}   siblingCount
 * @property {Object}   blocked          - { [heirKey]: boolean }
 * @property {Object}   disqualified     - { [heirKey]: boolean }
 * @property {boolean}  awlApplied
 * @property {boolean}  raddApplied
 * @property {boolean}  musharrakahApplied
 * @property {boolean}  grandfatherWithSiblings
 * @property {boolean}  fullSisterAsAsabah
 * @property {string}   raddMode         - 'baytulMal' | 'returnToHeirs'
 * @property {string}   dhawuAlArhamMode - 'disabled' | 'enabledWhenNoBaytulMal'
 * @property {string[]} messages
 * @property {Object}   explanations
 */

/**
 * @typedef {Object} CalcResult
 * @property {ShareEntry[]} shares
 * @property {string[]}     messages
 * @property {string[]}     warnings
 * @property {Object}       blocked   - { [heirKey]: boolean }
 * @property {Object}       context   - Reduced context flags
 */

export {}; // Module marker — all types are JSDoc only
