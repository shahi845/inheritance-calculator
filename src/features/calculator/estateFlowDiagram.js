/**
 * estateFlowDiagram.js — Visual "Estate Flow" diagram showing how the estate flows
 * from gross assets → funeral → debt → will → distributable estate → heirs.
 */

export function renderEstateFlowDiagram(detailedBreakdown, estateValue, currencySymbol = '') {
    const panel = document.getElementById('estateFlowDiagram');
    const stepsEl = document.getElementById('estateFlowSteps');
    if (!panel || !stepsEl) return;

    const fmt = (v) => `${currencySymbol}${(+v || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    let steps = [];

    if (detailedBreakdown) {
        steps = [
            { label: 'Gross Estate', value: fmt(detailedBreakdown.totalAssets), color: '#a78bfa', icon: '🏛️' },
            { label: 'Funeral & Burial (Tajhīz)', value: `− ${fmt(detailedBreakdown.funeral)}`, color: '#ef4444', icon: '⚰️' },
            { label: 'Outstanding Debts (Diyūn)', value: `− ${fmt(detailedBreakdown.debts)}`, color: '#f59e0b', icon: '📋' },
            { label: 'Bequests / Wills (Waṣiyyah)', value: `− ${fmt(detailedBreakdown.allowedWill)}${detailedBreakdown.isWillCapped ? ' (capped at 1/3)' : ''}`, color: '#06b6d4', icon: '📜' },
            { label: 'Net Distributable Estate', value: fmt(detailedBreakdown.netEstate), color: '#10b981', icon: '✅', isTotal: true },
            { label: 'Distributed to Heirs', value: fmt(detailedBreakdown.netEstate), color: '#818cf8', icon: '👨‍👩‍👧', isTotal: true }
        ];
    } else if (estateValue > 0) {
        steps = [
            { label: 'Total Estate', value: fmt(estateValue), color: '#a78bfa', icon: '🏛️' },
            { label: 'Distributed to Heirs', value: fmt(estateValue), color: '#10b981', icon: '✅', isTotal: true }
        ];
    } else {
        steps = [
            { label: 'Estate (Fractional Mode)', value: '100%', color: '#a78bfa', icon: '🏛️' },
            { label: 'Distributed to Heirs', value: '100%', color: '#10b981', icon: '✅', isTotal: true }
        ];
    }

    stepsEl.innerHTML = steps.map((step, i) => `
        <div style="display:flex;flex-direction:column;align-items:center;width:100%;max-width:480px;">
            <div style="width:100%;padding:0.75rem 1.25rem;border-radius:10px;background:rgba(0,0,0,0.2);border:1px solid ${step.color}33;
                        display:flex;justify-content:space-between;align-items:center;
                        ${step.isTotal ? `box-shadow:0 0 12px ${step.color}22;` : ''}">
                <div style="display:flex;align-items:center;gap:0.65rem;">
                    <span style="font-size:1.2rem;">${step.icon}</span>
                    <span style="color:var(--text-primary);font-weight:${step.isTotal ? '700' : '500'};font-size:0.95em;">${step.label}</span>
                </div>
                <span style="font-weight:700;color:${step.color};font-family:monospace;font-size:0.95em;">${step.value}</span>
            </div>
            ${i < steps.length - 1 ? `
            <div style="display:flex;flex-direction:column;align-items:center;padding:4px 0;">
                <div style="width:2px;height:18px;background:rgba(255,255,255,0.12);"></div>
                <span style="color:rgba(255,255,255,0.3);font-size:1rem;line-height:1;">↓</span>
                <div style="width:2px;height:18px;background:rgba(255,255,255,0.12);"></div>
            </div>` : ''}
        </div>
    `).join('');

    panel.classList.remove('hidden');
}
