import { blockingRules, blockingReasons } from '../data/shafiiRules.js';
import { getHeirDisplayName } from '../utils/formatResults.js';

/**
 * Applies all blocking (Ḥajb ḥirmān) rules.
 * Populates context.blocked[key] = true for each blocked heir.
 *
 * Rules are evaluated in the order defined in shafiiRules.js.
 * Later rules may reference earlier blocking decisions via context.blocked.
 */
export function applyBlocking(heirs, context) {
    const blocked = {};
    context.blocked = blocked;

    for (const heir in blockingRules) {
        // Only evaluate if this heir is actually present
        if ((heirs[heir] || 0) === 0) continue;

        blocked[heir] = blockingRules[heir]({ heirs, context });

        if (blocked[heir]) {
            const name = getHeirDisplayName(heir);
            const reasonObj = blockingReasons[heir] || { text: 'Closer relative', ruleId: '', evidence: '', reference: '' };
            const reasonText = reasonObj.text || reasonObj;
            context.messages.push(`${name} BLOCKED by ${reasonText}`);
            
            // We can also store the block objects in a new context array for the Developer Inspector
            if (!context.blockingDetails) context.blockingDetails = [];
            context.blockingDetails.push({ heir, name, reason: reasonText, ruleId: reasonObj.ruleId, evidence: reasonObj.evidence, reference: reasonObj.reference });
        }
    }

    return blocked;
}
