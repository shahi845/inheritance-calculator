/**
 * verificationCenter.js — Renders the post-calculation Verification Center.
 * Shows a checklist of validation results and a confidence percentage.
 */

export function renderVerificationCenter(verificationResult) {
    const panel = document.getElementById('verificationCenter');
    const checksContainer = document.getElementById('verificationChecks');
    const badge = document.getElementById('confidenceBadge');
    if (!panel || !checksContainer || !badge) return;

    const { checks, confidence, allPassed } = verificationResult;

    // Update badge
    badge.textContent = `${confidence}%`;
    badge.style.color = confidence === 100 ? '#10b981' : confidence >= 80 ? '#f59e0b' : '#ef4444';

    // Update panel border color
    panel.style.borderColor = confidence === 100 
        ? 'rgba(16,185,129,0.4)' 
        : confidence >= 80 ? 'rgba(245,158,11,0.4)' : 'rgba(239,68,68,0.4)';

    // Render checks
    checksContainer.innerHTML = checks.map(check => {
        const icon = check.passed ? '✓' : '✗';
        const color = check.passed ? '#10b981' : '#ef4444';
        const bg = check.passed ? 'rgba(16,185,129,0.07)' : 'rgba(239,68,68,0.07)';
        return `
            <div style="display:flex;align-items:center;gap:0.75rem;padding:0.55rem 0.85rem;border-radius:8px;background:${bg};">
                <span style="font-size:1rem;font-weight:700;color:${color};min-width:1.2rem;">${icon}</span>
                <span style="color:var(--text-primary);font-size:0.9em;">${check.label}</span>
            </div>
        `;
    }).join('');

    // Confidence bar
    checksContainer.innerHTML += `
        <div style="margin-top:1rem;padding:0.75rem;background:rgba(0,0,0,0.15);border-radius:8px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem;">
                <span style="font-size:0.85em;color:var(--text-secondary);">Confidence Score</span>
                <span style="font-size:0.85em;font-weight:700;color:${badge.style.color};">${confidence}%</span>
            </div>
            <div style="height:6px;background:rgba(255,255,255,0.08);border-radius:3px;overflow:hidden;">
                <div style="height:100%;width:${confidence}%;background:${badge.style.color};border-radius:3px;transition:width 0.6s ease;"></div>
            </div>
        </div>
    `;

    panel.classList.remove('hidden');
}
