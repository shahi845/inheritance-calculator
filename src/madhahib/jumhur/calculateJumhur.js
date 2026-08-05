/**
 * calculateJumhur.js — The Jumhūr engine entry point.
 */

import { buildContext } from '../../core/buildContext.js';
import { applyJumhurHajb, detectJumhurSpecialCases, PolicyRequiredError } from './jumhurRules.js';
import { fraction, subtractFractions, compareFractions, addFractions } from '../../math/fractions.js';
// We will reuse some engine components from Shafi'i/Hanafi for the agreed-upon parts
import { calculateInheritance as calculateShafii } from '../shafii/index.js';
import { calculateHanafiInheritance } from '../hanafi/index.js';

export function calculateJumhurInheritance(rawInput, options = {}) {
    const context = buildContext(options);
    context.messages.push("Madhhab mode: Jumhūr / majority-policy mode.");
    context.messages.push("Important: Jumhūr is not a separate madhhab. Where a clear majority exists, that rule is used. Where schools are split, policy selection is required.");

    // Extract policy settings from options
    const mushtarikahPolicy = options.mushtarikahPolicy || 'ask_if_detected';
    const surplusPolicy = options.surplusPolicy || 'ask_if_detected';
    const dhawilArhamPolicy = options.dhawilArhamPolicy || 'ask_if_detected';

    // 1. Detect Jumhūr Special Cases
    const specialCase = detectJumhurSpecialCases(rawInput);
    
    if (specialCase.type === 'mushtarikah') {
        if (mushtarikahPolicy === 'ask_if_detected') {
            throw new PolicyRequiredError(
                'mushtarikahPolicy',
                'Mushtarikah detected. There is no single four-school Jumhūr rule. Choose Shāfiʿī/Mālikī sharing or Ḥanafī/Ḥanbalī no-residue result.',
                ['shafii_maliki', 'hanafi_hanbali']
            );
        }
        // If policy is provided, we can route to the appropriate engine for calculation
        if (mushtarikahPolicy === 'shafii_maliki') {
            context.messages.push("Jumhūr Policy Applied: Shāfiʿī/Mālikī Mushtarikah sharing.");
            return calculateShafii(rawInput, { raddMode: surplusPolicy === 'radd_to_sharers' ? 'returnToHeirs' : 'baytulMal' });
        } else {
            context.messages.push("Jumhūr Policy Applied: Ḥanafī/Ḥanbalī Mushtarikah (no residue for full brothers).");
            return calculateHanafiInheritance(rawInput, { raddMode: surplusPolicy === 'radd_to_sharers' ? 'returnToHeirs' : 'baytulMal' });
        }
    }

    // 2. Check for Dhawu al-Arham only (or no primary heirs)
    const primaryHeirs = ['husband', 'wife', 'father', 'mother', 'paternalGrandfather', 'maternalGrandmother', 'paternalGrandmother', 
        'son', 'daughter', 'grandson', 'granddaughter', 'fullBrother', 'fullSister', 'paternalBrother', 'paternalSister', 
        'maternalBrother', 'maternalSister', 'paternalUncleSon', 'consanguinePaternalUncleSon', 'uncle', 'consanguinePaternalUncle', 'mutiq', 'mutiqah'];
    
    let hasPrimaryHeir = false;
    let hasDistantKindred = false;
    for (const [heir, count] of Object.entries(rawInput)) {
        if (count > 0) {
            if (primaryHeirs.includes(heir)) hasPrimaryHeir = true;
            else hasDistantKindred = true;
        }
    }

    // Determine if Dhawu al-Arham might inherit
    if (hasDistantKindred && !hasPrimaryHeir) {
        if (dhawilArhamPolicy === 'ask_if_detected') {
            throw new PolicyRequiredError(
                'dhawilArhamPolicy',
                'Dhawū al-Arḥām (distant kindred) detected with no primary heirs. Schools are split: Ḥanafī/Ḥanbalī allow them to inherit, Mālikī/Shāfiʿī classically do not (surplus to Bayt al-Māl).',
                ['enabled_hanafi_hanbali', 'disabled_classical_shafii_maliki']
            );
        }
        if (dhawilArhamPolicy === 'enabled_hanafi_hanbali') {
            context.messages.push("Jumhūr Policy Applied: Dhawū al-Arḥām inherit (Ḥanafī/Ḥanbalī rule).");
            return calculateHanafiInheritance(rawInput, { dhawuAlArhamMode: 'enabledWhenNoBaytulMal' });
        } else {
            context.messages.push("Jumhūr Policy Applied: Dhawū al-Arḥām do not inherit (Classical Shāfiʿī/Mālikī rule).");
            return calculateShafii(rawInput, { dhawuAlArhamMode: 'disabled' });
        }
    }

    // 3. For grandfather + siblings, Jumhur uses non-Hanafi majority method (handled by Shafii engine)
    if (specialCase.type === 'grandfather_with_siblings') {
        context.messages.push("Jumhūr: Grandfather with siblings detected. Applying non-Ḥanafī majority rule (comparison method).");
        // Shafi'i engine implements the comparison method natively
        const res = calculateShafii(rawInput, { 
            raddMode: surplusPolicy === 'radd_to_sharers' ? 'returnToHeirs' : 'baytulMal' 
        });
        
        // We need to inject the Jumhur message into the result
        res.messages = [...context.messages, ...res.messages];
        return res;
    }

    // 4. Default execution (routing to Shafi'i as it implements the standard Sunni rules closely matching Jumhur defaults)
    // We must check if surplus occurs to trigger surplusPolicy
    const res = calculateShafii(rawInput, { 
        raddMode: surplusPolicy === 'radd_to_sharers' ? 'returnToHeirs' : 'baytulMal' 
    });

    // Check if radd was actually needed by looking at the messages or checking if Bayt al-Mal received something
    const hasBaytAlMal = res.shares.some(s => s.heir === 'baytAlMal');
    const hasRaddApplied = res.messages.some(m => m.includes('Radd'));
    
    if ((hasBaytAlMal || hasRaddApplied) && surplusPolicy === 'ask_if_detected' && !hasDistantKindred) {
        throw new PolicyRequiredError(
            'surplusPolicy',
            'Surplus detected with no ʿaṣabah. Classical schools are split: Ḥanafī/Ḥanbalī apply radd, while Mālikī/Shāfiʿī classically send surplus to Bayt al-Māl.',
            ['classical_baytulmal', 'radd_to_sharers']
        );
    }

    res.messages = [...context.messages, ...res.messages];
    return res;
}
