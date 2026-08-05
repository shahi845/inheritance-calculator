import { normalizeInput } from './normalizeInput.js';
import { validateInput } from './validateInput.js';
import { buildContext } from './buildContext.js';
import { applyBlocking } from './applyBlocking.js';
import { assignFixedShares } from './assignFixedShares.js';
import { applyAwl } from './applyAwl.js';
import { assignResiduaries } from './assignResiduaries.js';
import { applyRadd } from './applyRadd.js';
import { assignDistantKindred } from './assignDistantKindred.js';
import { getHeirDisplayName } from '../utils/formatResults.js';
import { blockingReasons } from '../data/shafiiRules.js';
import { fraction, subtractFractions, compareFractions } from '../utils/fractions.js';
import { verifyCalculation } from './VerificationEngine.js';

/**
 * Main inheritance calculation orchestrator.
 *
 * Accepts rawInput which may use either legacy form field keys or canonical keys.
 * Options can override context defaults (e.g., raddMode, dhawuAlArhamMode).
 *
 * @param {Object} rawInput - heir counts (legacy or canonical keys)
 * @param {Object} options  - optional overrides: { raddMode, dhawuAlArhamMode, estate }
 * @returns {{ shares, messages, blocked, warnings, context }}
 */
export function calculateInheritance(rawInput, options = {}) {
    const heirs = normalizeInput(rawInput);
    const warnings = validateInput(heirs);
    const context = buildContext(heirs);

    // Apply option overrides
    if (options.raddMode)          context.raddMode          = options.raddMode;
    if (options.dhawuAlArhamMode)  context.dhawuAlArhamMode  = options.dhawuAlArhamMode;
    if (options.estate !== undefined) context.estateValue    = options.estate;

    // ── Phase 1: Blocking (Ḥajb) ─────────────────────────────────────────────
    const blockStep = { title: "Step 1: Apply exclusions (Ḥajb)", items: [] };
    const messagesBeforeBlock = context.messages.length;
    applyBlocking(heirs, context);
    if (context.messages.length > messagesBeforeBlock) {
        blockStep.items = context.messages.slice(messagesBeforeBlock);
    } else {
        blockStep.items.push("No heirs excluded by Ḥajb rules.");
    }
    context.steps.push(blockStep);

    // ── Phase 2: Fixed Shares ─────────────────────────────────────────────────
    const fixedStep = { title: "Step 2: Assign fixed shares", items: [] };
    const messagesBeforeFixed = context.messages.length;
    let { shares, sumFractions } = assignFixedShares(heirs, context);
    if (context.messages.length > messagesBeforeFixed) {
        fixedStep.items = context.messages.slice(messagesBeforeFixed);
    } else {
        fixedStep.items.push("No fixed shares assigned.");
    }
    context.steps.push(fixedStep);

    // If grandfatherWithSiblings already handled everything, skip to blocked entries
    if (context.grandfatherWithSiblings && compareFractions(sumFractions, fraction(1, 1)) >= 0) {
        return buildResult(shares, heirs, context, warnings);
    }

    // ── Phase 3: ʿAwl ────────────────────────────────────────────────────────
    const awlStep = { title: "Step 3: Handle overflow (ʿAwl)", items: [] };
    const messagesBeforeAwl = context.messages.length;
    sumFractions = applyAwl(shares, sumFractions, context);
    if (context.messages.length > messagesBeforeAwl) {
        awlStep.items = context.messages.slice(messagesBeforeAwl);
        context.steps.push(awlStep);
    }

    // ── Phase 4: ʿAṣabah (Residuaries) ───────────────────────────────────────
    context.steps.push({ title: "Step 4: Remaining estate", items: [`Sum of fixed shares: ${sumFractions.num}/${sumFractions.den}`] });
    
    const residStep = { title: "Step 5: Assign residuary (ʿAṣabah)", items: [] };
    const messagesBeforeResid = context.messages.length;
    const prevLength = shares.length;
    shares = assignResiduaries(shares, heirs, sumFractions, context);
    const hasResiduaries = shares.length > prevLength ||
        shares.some(s => s.status && (s.status.includes('Residuary') || s.status.includes('Sharer + Residuary')));
        
    if (context.messages.length > messagesBeforeResid) {
        residStep.items = context.messages.slice(messagesBeforeResid);
        context.steps.push(residStep);
    }

    // ── Phase 5: Radd or Bayt al-Māl ─────────────────────────────────────────
    if (!hasResiduaries) {
        const currentSum = computeCurrentSum(shares);
        const remainder = subtractFractions(fraction(1, 1), currentSum);

        if (compareFractions(remainder, fraction(0, 1)) > 0) {
            const hasBloodSharers = shares.some(
                s => s.heir !== 'husband' && s.heir !== 'wife' &&
                     s.status !== 'Blocked' && s.status !== 'Bayt al-Māl'
            );
            const hasDhawuHeirs = hasDhawuAlArhamHeirs(heirs, context);

            if (hasDhawuHeirs && context.dhawuAlArhamMode !== 'disabled') {
                // Dhawu al-Arḥām get the remainder
                const dhawuStep = { title: "Step 6: Distribute to Dhawu al-Arḥām", items: [] };
                const msgs = context.messages.length;
                shares = assignDistantKindred(shares, heirs, remainder, context);
                if (context.messages.length > msgs) {
                    dhawuStep.items = context.messages.slice(msgs);
                    context.steps.push(dhawuStep);
                }
            } else {
                // Radd
                const raddStep = { title: "Step 6: Return surplus (Radd)", items: [] };
                const msgs = context.messages.length;
                shares = applyRadd(shares, currentSum, context);
                if (context.messages.length > msgs) {
                    raddStep.items = context.messages.slice(msgs);
                    context.steps.push(raddStep);
                }
            }
        }
    }

    // ── Phase 6: Append blocked heirs to result ───────────────────────────────
    return buildResult(shares, heirs, context, warnings);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function computeCurrentSum(shares) {
    return shares
        .filter(s => s.status !== 'Blocked' && s.status !== 'Bayt al-Māl')
        .reduce((sum, s) => {
            if (s.adjustedShare && s.adjustedShare.num > 0) {
                const a = sum.num * s.adjustedShare.den + s.adjustedShare.num * sum.den;
                const b = sum.den * s.adjustedShare.den;
                const d = gcd(Math.abs(a), Math.abs(b));
                return { num: a / d, den: b / d };
            }
            return sum;
        }, fraction(0, 1));
}

function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }

function hasDhawuAlArhamHeirs(heirs, context) {
    const dhawuKeys = [
        'daughtersSon', 'daughtersDaughter', 'maternalGrandfather',
        'sistersSon', 'sistersDaughter', 'maternalUncle', 'maternalAunt',
        'paternalAunt', 'uterineSiblingChildren', 'otherDistantRelatives'
    ];
    return dhawuKeys.some(key => heirs[key] > 0 && !context.blocked[key]);
}

function buildResult(shares, heirs, context, warnings) {
    // Append blocked heirs (those present but excluded)
    for (const key in heirs) {
        if (heirs[key] > 0 && context.blocked[key]) {
            const alreadyListed = shares.some(s => s.heir === key);
            if (!alreadyListed) {
                // Find block reason object from blockingDetails if available
                const blockDetail = context.blockingDetails?.find(d => d.heir === key);
                shares.push({
                    heir: key,
                    name: getHeirDisplayName(key),
                    count: heirs[key],
                    baseShare: fraction(0, 1),
                    adjustedShare: fraction(0, 1),
                    status: 'Blocked',
                    reason: blockDetail ? `Blocked by ${blockDetail.reason}` : `Blocked by closer relative`,
                    ruleId: blockDetail ? blockDetail.ruleId : '',
                    evidence: blockDetail ? blockDetail.evidence : '',
                    reference: blockDetail ? blockDetail.reference : '',
                    shareBeforeAwl: fraction(0, 1),
                });
            }
        }
    }

    // Extract executed rules from shares and blocks for Developer Mode Rule Inspector
    const executedRules = [];
    shares.forEach(s => {
        if (s.ruleId) {
            executedRules.push({
                ruleId: s.ruleId,
                heir: s.heir,
                name: s.name,
                reason: s.reason,
                evidence: s.evidence,
                reference: s.reference
            });
        }
    });

    const resultObj = {
        shares,
        messages: context.messages,
        steps: context.steps,
        warnings,
        blocked: context.blocked,
        executedRules,
        context: {
            awlApplied: context.awlApplied,
            raddApplied: context.raddApplied,
            musharrakahApplied: context.musharrakahApplied,
            grandfatherWithSiblings: context.grandfatherWithSiblings,
            fullSisterAsAsabah: context.fullSisterAsAsabah,
            raddMode: context.raddMode,
        }
    };
    
    resultObj.verification = verifyCalculation(resultObj, heirs);
    
    return resultObj;
}
