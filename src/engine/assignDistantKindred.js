import { _assignHanafiDhawuAlArham } from '../madhahib/hanafi/dhawuAlArham.js';
/**
 * Assigns Dhawu al-Arḥām (Distant Kindred) shares for the Shāfiʿī engine.
 *
 * Shāfiʿī position: Dhawu al-Arḥām do NOT inherit in the Shāfiʿī madhhab
 * by the most correct opinion. The surplus goes to Bayt al-Māl.
 *
 * This module is a placeholder for completeness of the import chain.
 * In practice, the Shāfiʿī calculateInheritance.js will only call
 * applyRadd (baytulMal mode) rather than this module.
 *
 * The full Dhawu al-Arḥām implementation lives in:
 *   src/madhahib/hanafi/calculateHanafi.js (_assignHanafiDhawuAlArham)
 */

import { fraction } from '../utils/fractions.js';
import { getHeirDisplayName } from '../utils/formatResults.js';

export function assignDistantKindred(shares, heirs, remainder, context) {
    if (context.dhawuAlArhamMode === 'enabledWhenNoBaytulMal') {
        context.messages.push(
            "Shāfiʿī madhhab (Modern Fallback): Bayt al-Māl inactive. Dhawū al-Arḥām inherit (using proximity rules)."
        );
        return _assignHanafiDhawuAlArham(shares, heirs, remainder, context);
    }

    // Default Shāfiʿī strict rule
    context.messages.push(
        "Shāfiʿī madhhab: Dhawū al-Arḥām do not inherit. Surplus → Bayt al-Māl."
    );
    shares.push({
        heir: 'baytAlMal',
        name: 'Bayt al-Māl (Public Treasury)',
        count: 1,
        baseShare: remainder,
        adjustedShare: remainder,
        status: 'Bayt al-Māl',
        reason: 'No Dhawū al-Arḥām in strict Shāfiʿī madhhab — surplus to Bayt al-Māl (Reliance L9)',
    });
    return shares;
}
