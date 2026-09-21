/**
 * main.js — Application entry point.
 * Wires up UI events to the features modules.
 */

import { APP_CONFIG } from './config.js';
import { initRouter } from './router.js';
import { initPageRouter } from './pageRouter.js';
import { runCalculation } from '../features/calculator/calculatorController.js';
import { loadPreset } from '../features/calculator/presets.js';
import { initValidationAlerts } from '../features/calculator/validationAlerts.js';
import { initEstateBreakdown } from '../features/estate/estateBreakdown.js';
import { initEvidenceModal } from '../features/evidence-modal/evidenceModal.js';
import { initLearningSection } from '../features/learning/learningSection.js';
import { initSampleCasesSection } from '../features/sample-cases/sampleCasesSection.js';
import { initAdvancedHub } from '../features/advanced/advancedHub.js';
import { initReferencesSection } from '../features/references/referencesSection.js';
import { initSettingsSection } from '../features/settings/settingsSection.js';
import { initGlobalSearch } from '../features/search/searchEngine.js';
import { initComparisonView } from '../features/comparison/comparisonView.js';
import { initHeirInspector } from '../features/family-tree/heirInspector.js';
import { initCalculationHistory } from '../features/history/calculationHistory.js';
import { showCalculationProgress } from '../features/calculator/progressIndicator.js';
import { initTouchSteppers } from '../features/calculator/touchSteppers.js';
import { initI18n } from '../i18n/i18n.js';

let currencySymbol = APP_CONFIG.defaultCurrency;

document.addEventListener('DOMContentLoaded', () => {
    // 0. Initialize internationalization subsystem (first so UI renders in selected language)
    initI18n();

    // 0.1 Initialize page navigation router
    initPageRouter();

    // 1. Initialize core router (madhhab tabs)
    initRouter();

    // 2. Initialize live components & feature sections
    initValidationAlerts();
    initTouchSteppers();
    initEvidenceModal();
    initEstateBreakdown(() => currencySymbol);
    initLearningSection();
    initSampleCasesSection();
    initAdvancedHub();
    initReferencesSection();
    initSettingsSection();
    initGlobalSearch();
    initComparisonView();
    initHeirInspector();
    initCalculationHistory();

    // 3. Setup Currency Toggle
    const currencySelect = document.getElementById('currencySelect');
    const customCurrencyContainer = document.getElementById('customCurrencyContainer');
    const customCurrencyInput = document.getElementById('customCurrencyInput');

    function updateCurrencySymbol() {
        if (currencySelect.value === 'custom') {
            customCurrencyContainer.classList.remove('hidden');
            currencySymbol = customCurrencyInput.value.trim() || 'Unit';
        } else {
            customCurrencyContainer.classList.add('hidden');
            currencySymbol = currencySelect.value;
        }
        // Fire input event on an estate field to trigger recalculation of net estate display
        document.getElementById('assetCash')?.dispatchEvent(new Event('input'));
    }
    
    currencySelect?.addEventListener('change', updateCurrencySymbol);
    customCurrencyInput?.addEventListener('input', updateCurrencySymbol);

    // 4. Setup Presets
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const presetName = btn.getAttribute('data-preset');
            loadPreset(presetName);
            // Trigger live validation update
            document.getElementById('husband')?.dispatchEvent(new Event('input'));
        });
    });

    // 5. Setup Action Buttons
    const calculateBtn = document.getElementById('calculateBtn');
    const resetBtn = document.getElementById('resetBtn');
    const scholarMode = document.getElementById('scholarMode');
    const messagesContainer = document.getElementById('messages');
    const resultsSection = document.getElementById('resultsSection');

    calculateBtn?.addEventListener('click', () => {
        showCalculationProgress(() => {
            runCalculation(currencySymbol);
        });
    });

    document.getElementById('printBtn')?.addEventListener('click', () => {
        window.print();
    });

    resetBtn?.addEventListener('click', () => {
        // Reset all heirs
        document.querySelectorAll('.heirs-container input[type="number"]').forEach(input => {
            input.value = 0;
        });
        
        // Reset detailed estate inputs
        const detailedIds = [
            'assetCash', 'assetGold', 'assetStocks', 'assetRealEstate', 'assetBusiness',
            'assetPersonal', 'assetReceivables', 'assetClaims', 'assetUnpaidMahr',
            'liabilityFuneral', 'liabilityReligiousDebts', 'liabilityFinancialDebts', 'liabilityWills'
        ];
        detailedIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });

        const estateInput = document.getElementById('estateValue');
        if (estateInput) {
            estateInput.value = '';
            estateInput.readOnly = false;
            estateInput.style.opacity = '1';
        }
        
        document.getElementById('validationAlerts')?.classList.add('hidden');
        resultsSection?.classList.add('hidden');
        document.getElementById('printBtn')?.classList.add('hidden');
        document.getElementById('copyBtn')?.classList.add('hidden');
        
        // Reset live estate display
        const display = document.getElementById('calculatedNetEstateDisplay');
        if (display) display.textContent = `${currencySymbol}0.00`;
    });

    scholarMode?.addEventListener('change', (e) => {
        if (e.target.checked && !resultsSection?.classList.contains('hidden')) {
            messagesContainer?.classList.remove('hidden');
        } else {
            messagesContainer?.classList.add('hidden');
        }
    });
});
