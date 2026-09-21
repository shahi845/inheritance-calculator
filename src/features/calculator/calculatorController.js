/**
 * calculatorController.js — Orchestrates calculations and passes results to the UI.
 */

import { calculateInheritance } from '../../madhahib/shafii/index.js';
import { calculateHanafiInheritance } from '../../madhahib/hanafi/index.js';
import { calculateMalikiInheritance } from '../../madhahib/maliki/index.js';
import { calculateHanbaliInheritance } from '../../madhahib/hanbali/index.js';
import { calculateJumhurInheritance } from '../../madhahib/jumhur/index.js';
import { PolicyRequiredError } from '../../madhahib/jumhur/jumhurRules.js';
import { formatResults } from '../../utils/formatResults.js';
import { displayResults } from './resultRenderer.js';
import { renderWaterfall } from '../charts/waterfallChart.js';
import { drawDonutChart } from '../charts/donutChart.js';
import { updateFamilyTreeVisual } from '../family-tree/familyTreeRenderer.js';
import { renderBlockingTree } from '../family-tree/blockingTreeRenderer.js';
import { readHeirsInput, readMalikiOptions, readJumhurOptions, readSelectedMadhhab, readRaddMode } from './inputReader.js';
import { getDetailedValues } from '../estate/estateBreakdown.js';
import { showCalculationProgress } from './progressIndicator.js';
import { saveCalculationToHistory } from '../history/calculationHistory.js';
import { renderVerificationCenter } from './verificationCenter.js';
import { renderRuleInspector } from './ruleInspector.js';
import { renderEstateFlowDiagram } from './estateFlowDiagram.js';
import { renderLearningModeQuiz } from './learningModeQuiz.js';

/**
 * Shows or hides the policy warning banner with a custom message.
 * @param {string|null} message — pass null to hide the banner
 */
function showPolicyWarning(message) {
    const banner = document.getElementById('policyWarningBanner');
    const textEl = document.getElementById('policyWarningText');
    if (!banner) return;
    if (message) {
        if (textEl) textEl.textContent = message;
        banner.classList.remove('hidden');
        banner.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
        banner.classList.add('hidden');
        if (textEl) textEl.textContent = '';
    }
}

let lastUsedCurrency = '$';

/**
 * Runs the inheritance calculation pipeline and updates all UI components.
 * @param {string} currencySymbol
 */
export function runCalculation(currencySymbol) {
    if (currencySymbol) lastUsedCurrency = currencySymbol;
    const resultsSection = document.getElementById('resultsSection');
    const errorContainer = document.getElementById('errorContainer');
    const printBtn = document.getElementById('printBtn');
    const copyBtn = document.getElementById('copyBtn');

    // Hide policy warning at the start of each fresh calculation
    showPolicyWarning(null);

    // Check if detailed estate breakdown is active
    let activeBreakdown = false;
    const detailedIds = [
        'assetCash', 'assetGold', 'assetStocks', 'assetRealEstate', 'assetBusiness',
        'assetPersonal', 'assetReceivables', 'assetClaims', 'assetUnpaidMahr',
        'liabilityFuneral', 'liabilityReligiousDebts', 'liabilityFinancialDebts', 'liabilityWills'
    ];
    for (const id of detailedIds) {
        if (parseFloat(document.getElementById(id)?.value) > 0) {
            activeBreakdown = true;
            break;
        }
    }

    const detailedBreakdown = activeBreakdown ? getDetailedValues() : null;
    const estateValue = activeBreakdown
        ? detailedBreakdown.netEstate
        : (parseFloat(document.getElementById('estateValue')?.value) || 0);

    const heirsInput = readHeirsInput();

    if (errorContainer) {
        errorContainer.style.display = 'none';
        errorContainer.textContent = '';
    }

    if (estateValue < 0) {
        if (errorContainer) {
            errorContainer.textContent = 'Estate value cannot be negative.';
            errorContainer.style.display = 'block';
        }
        if (resultsSection) resultsSection.classList.add('hidden');
        if (printBtn) printBtn.classList.add('hidden');
        if (copyBtn) copyBtn.classList.add('hidden');
        return;
    }

    try {
        const selectedMadhhab = readSelectedMadhhab();
        const raddMode = readRaddMode();

        let result;
        if (selectedMadhhab === 'hanafi') {
            result = calculateHanafiInheritance(heirsInput, { raddMode: 'returnToHeirs' });
        } else if (selectedMadhhab === 'maliki') {
            const malikiOpts = readMalikiOptions();
            result = calculateMalikiInheritance(heirsInput, malikiOpts);
        } else if (selectedMadhhab === 'hanbali') {
            result = calculateHanbaliInheritance(heirsInput, { raddMode: 'returnToHeirs' });
        } else if (selectedMadhhab === 'jumhur') {
            const jumhurOpts = readJumhurOptions();
            result = calculateJumhurInheritance(heirsInput, jumhurOpts);
        } else {
            result = calculateInheritance(heirsInput, { raddMode });
        }

        const { shares, messages, steps, blocked } = result;
        const formattedShares = formatResults(shares, estateValue);

        if (activeBreakdown && detailedBreakdown) {
            // Update Step numbers in existing steps
            steps.forEach(step => {
                const match = step.title.match(/^Step (\d+):/);
                if (match) {
                    const oldNum = parseInt(match[1]);
                    step.title = step.title.replace(/^Step \d+:/, `Step ${oldNum + 1}:`);
                }
            });

            const financialStep = {
                title: "Step 1: Settle Financial Obligations",
                items: [
                    `Gross Estate: ${currencySymbol}${detailedBreakdown.totalAssets.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                    detailedBreakdown.funeral > 0 ? `Minus Funeral Expenses: ${currencySymbol}${detailedBreakdown.funeral.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : null,
                    detailedBreakdown.debts > 0 ? `Minus Outstanding Debts: ${currencySymbol}${detailedBreakdown.debts.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : null,
                    detailedBreakdown.wills > 0 ? `Minus Bequests/Wills (Wasiyyah): ${currencySymbol}${detailedBreakdown.allowedWill.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}${detailedBreakdown.isWillCapped ? ' (Capped at 1/3)' : ''}` : null,
                    `Net Distributable Estate: ${currencySymbol}${detailedBreakdown.netEstate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                ].filter(Boolean)
            };
            steps.unshift(financialStep);
        }

        const combinedMessages = [...messages];
        if (activeBreakdown && detailedBreakdown.isWillCapped) {
            combinedMessages.push(`Bequest (Wasiyyah) capped at 1/3 (${currencySymbol}${detailedBreakdown.maxWillAllowed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}) of the net estate because it exceeded the legal limit, and no heirs' consent was assumed.`);
        }

        displayResults(formattedShares, combinedMessages, steps, estateValue, activeBreakdown ? detailedBreakdown : null, heirsInput, blocked, currencySymbol, selectedMadhhab);
        renderWaterfall(activeBreakdown ? detailedBreakdown : null, currencySymbol, estateValue);
        drawDonutChart(formattedShares);
        updateFamilyTreeVisual(heirsInput, blocked, shares);
        renderBlockingTree(heirsInput, blocked);

        // Render new panels
        if (result.verification) {
            renderVerificationCenter(result.verification);
        }
        renderRuleInspector(result.executedRules || [], blocked, heirsInput);
        renderEstateFlowDiagram(activeBreakdown ? detailedBreakdown : null, estateValue, currencySymbol);
        renderLearningModeQuiz(shares, result.context);

        // Save to LocalStorage History
        saveCalculationToHistory(heirsInput, formattedShares, estateValue, selectedMadhhab);

        if (resultsSection) resultsSection.classList.remove('hidden');
        if (printBtn) printBtn.classList.remove('hidden');
        if (copyBtn) copyBtn.classList.remove('hidden');

    } catch (error) {
        // PolicyRequiredError: a Jumhūr split case that needs user to choose a policy
        if (error instanceof PolicyRequiredError) {
            showPolicyWarning(
                `Policy required for "${error.policyKey}": ${error.message} ` +
                `Please select one of the available options in the Jumhūr Settings panel above, then recalculate.`
            );
            if (resultsSection) resultsSection.classList.add('hidden');
            if (printBtn) printBtn.classList.add('hidden');
            if (copyBtn) copyBtn.classList.add('hidden');
            return;
        }

        if (errorContainer) {
            errorContainer.textContent = error.message;
            errorContainer.style.display = 'block';
        }
        if (resultsSection) resultsSection.classList.add('hidden');
        if (printBtn) printBtn.classList.add('hidden');
        if (copyBtn) copyBtn.classList.add('hidden');
    }
}

// Automatically re-run calculation when language changes if results are currently shown
if (typeof window !== 'undefined') {
    window.addEventListener('faraid:languageChange', () => {
        const resultsSection = document.getElementById('resultsSection');
        if (resultsSection && !resultsSection.classList.contains('hidden')) {
            try {
                runCalculation(lastUsedCurrency);
            } catch (e) {
                console.error('[calculatorController] Error refreshing calculation on language switch:', e);
            }
        }
    });
}

