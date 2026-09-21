/**
 * router.js — UI router for switching active madhhabs.
 */

/**
 * Initializes the tab click handlers for madhhab switching.
 */
export function initRouter() {
    const madhhabTabs = document.querySelectorAll('.mode-selector .mode-tab');
    const madhhabInput = document.getElementById('madhhabSelector');
    const raddInput = document.getElementById('raddModeSelector');
    const titleEl = document.getElementById('calcSubtitle');
    const descEl  = document.getElementById('calcDesc');
    const malikiPanel  = document.getElementById('malikiSettingsContainer');
    const jumhurPanel  = document.getElementById('jumhurSettingsContainer');
    const malikiPresetBtns = document.querySelectorAll('.maliki-preset');

    madhhabTabs.forEach(tab => {
        const mode = tab.dataset.mode;
        // Only wire up supported engines; skip tabs with no data-mode or unsupported ones
        if (!['shafii', 'hanafi', 'maliki', 'hanbali', 'jumhur'].includes(mode)) return;

        tab.addEventListener('click', () => {
            madhhabTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            if (madhhabInput) madhhabInput.value = mode;

            // Reset panel visibility
            if (malikiPanel)  malikiPanel.classList.add('hidden');
            if (jumhurPanel)  jumhurPanel.classList.add('hidden');
            malikiPresetBtns.forEach(b => b.classList.add('hidden'));

            // Ensure calculator form is visible
            const mainForm = document.getElementById('mainCalculatorForm');
            if (mainForm) mainForm.classList.remove('hidden');

            if (mode === 'maliki') {
                if (titleEl) titleEl.textContent = "(Mālikī Madhhab — Beta)";
                if (descEl)  descEl.textContent  = "Mālikī educational model — selected tested cases, surplus settings, Mushtarikah, and grandfather-related rules.";
                if (raddInput) raddInput.value = 'baytulMal';
                if (malikiPanel) malikiPanel.classList.remove('hidden');
                malikiPresetBtns.forEach(b => b.classList.remove('hidden'));

            } else if (mode === 'hanafi') {
                if (titleEl) titleEl.textContent = '(Ḥanafī Madhhab — Beta)';
                if (descEl)  descEl.textContent  = "Ḥanafī educational model — selected tested cases, Radd to blood sharers, and grandfather blocking rules.";
                if (raddInput) raddInput.value = 'returnToHeirs';

            } else if (mode === 'hanbali') {
                if (titleEl) titleEl.textContent = '(Ḥanbalī Madhhab — Beta)';
                if (descEl)  descEl.textContent  = "Based on Ḥanbalī Farā'ḍ methodology — Radd to blood sharers | Rejects Mushtarikah/Akdariyyah exceptions";
                if (raddInput) raddInput.value = 'returnToHeirs';

            } else if (mode === 'jumhur') {
                if (titleEl) titleEl.textContent = '(Jumhūr — Majority View)';
                if (descEl)  descEl.textContent  = "Issue-by-issue majority rule. Where all four schools agree, that rule is applied automatically. Where they split, you choose the policy.";
                if (raddInput) raddInput.value = 'baytulMal';
                if (jumhurPanel) jumhurPanel.classList.remove('hidden');

            } else {
                // shafii (default)
                if (titleEl) titleEl.textContent = '(Shāfiʿī Madhhab)';
                if (descEl) descEl.textContent = "Shāfiʿī educational model — selected tested cases with classical rule explanations.";
                if (raddInput) raddInput.value = 'baytulMal';
            }
        });
    });
}
