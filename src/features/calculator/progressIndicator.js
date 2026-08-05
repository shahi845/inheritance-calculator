/**
 * progressIndicator.js — Calculation Progress Animation Indicator & Empty State Controller.
 */

export function showCalculationProgress(onComplete) {
    const container = document.getElementById('calcProgressContainer');
    if (!container) {
        if (onComplete) onComplete();
        return;
    }

    const steps = [
        '✓ Validating heir eligibility',
        '✓ Applying fixed Quranic shares (Aṣḥāb al-Furūḍ)',
        '✓ Evaluating blocking rules (Ḥajb)',
        '✓ Checking proportional reduction (ʿAwl)',
        '✓ Checking surplus redistribution (Radd)',
        '✓ Allocating residual shares (ʿAṣabah)',
        '✓ Calculation finished successfully'
    ];

    container.classList.remove('hidden');

    let currentStep = 0;
    container.innerHTML = `
        <div class="progress-box glass-card" style="border-color: var(--accent); padding: 1rem; margin-bottom: 1.5rem;">
            <div style="font-weight:600;color:var(--accent);margin-bottom:0.5rem;" id="progressCurrentStepText">⚡ Running Farāʾiḍ Calculation Engine...</div>
            <div class="progress-bar-bg" style="background:rgba(255,255,255,0.05);height:6px;border-radius:3px;overflow:hidden;">
                <div id="progressBarFill" style="background:var(--accent);width:0%;height:100%;transition:width 0.2s ease;"></div>
            </div>
        </div>
    `;

    const stepInterval = setInterval(() => {
        currentStep++;
        const pct = Math.min(100, Math.round((currentStep / steps.length) * 100));

        const textEl = document.getElementById('progressCurrentStepText');
        const fillEl = document.getElementById('progressBarFill');

        if (textEl) textEl.textContent = steps[Math.min(currentStep, steps.length - 1)];
        if (fillEl) fillEl.style.width = `${pct}%`;

        if (currentStep >= steps.length) {
            clearInterval(stepInterval);
            setTimeout(() => {
                container.classList.add('hidden');
                if (onComplete) onComplete();
            }, 250);
        }
    }, 80);
}
