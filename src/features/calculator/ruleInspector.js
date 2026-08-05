/**
 * ruleInspector.js — Developer Mode Rule Inspector panel.
 * Shows every executed/skipped rule with its Rule ID, evidence, and reference.
 */

export function renderRuleInspector(executedRules, blocked, heirs) {
    const panel = document.getElementById('ruleInspectorPanel');
    const content = document.getElementById('ruleInspectorContent');
    const isDev = document.getElementById('developerMode')?.checked;
    
    if (!panel || !content) return;

    if (!isDev) {
        panel.classList.add('hidden');
        return;
    }

    // Executed rules
    const executedHtml = executedRules && executedRules.length > 0
        ? executedRules.map(r => `
            <div style="display:flex;align-items:flex-start;gap:0.75rem;padding:0.55rem 0.85rem;border-radius:8px;background:rgba(16,185,129,0.07);border-left:3px solid rgba(16,185,129,0.5);">
                <span style="color:#10b981;font-weight:700;font-size:0.8em;min-width:80px;font-family:monospace;">${r.ruleId || 'N/A'}</span>
                <div>
                    <div style="color:var(--text-primary);font-size:0.9em;font-weight:600;">${r.name}</div>
                    <div style="color:var(--text-secondary);font-size:0.8em;margin-top:2px;">${r.reason}</div>
                    ${r.evidence ? `<div style="color:#a78bfa;font-size:0.75em;margin-top:2px;">📖 ${r.evidence}</div>` : ''}
                    ${r.reference ? `<div style="color:var(--text-secondary);font-size:0.75em;opacity:0.7;">${r.reference}</div>` : ''}
                </div>
            </div>
        `).join('')
        : '<p style="color:var(--text-secondary);font-size:0.9em;">No rules with IDs found.</p>';

    // Blocked (skipped) heirs
    const skippedHtml = Object.keys(blocked || {})
        .filter(k => blocked[k] && (heirs?.[k] || 0) > 0)
        .map(k => `
            <div style="display:flex;align-items:center;gap:0.75rem;padding:0.55rem 0.85rem;border-radius:8px;background:rgba(239,68,68,0.07);border-left:3px solid rgba(239,68,68,0.4);">
                <span style="color:#ef4444;font-size:1rem;">✗</span>
                <div>
                    <span style="color:var(--text-primary);font-size:0.9em;font-weight:600;">${k}</span>
                    <span style="color:var(--text-secondary);font-size:0.8em;margin-left:0.5rem;">— Skipped (Blocked by Ḥajb)</span>
                </div>
            </div>
        `).join('');

    content.innerHTML = `
        <div style="margin-bottom:1rem;">
            <div style="font-size:0.8em;font-weight:700;color:#fbbf24;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.5rem;">✓ Executed Rules</div>
            <div style="display:grid;gap:0.4rem;">${executedHtml}</div>
        </div>
        ${skippedHtml ? `
        <div>
            <div style="font-size:0.8em;font-weight:700;color:#ef4444;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.5rem;">✗ Skipped (Blocked Heirs)</div>
            <div style="display:grid;gap:0.4rem;">${skippedHtml}</div>
        </div>
        ` : ''}
    `;

    panel.classList.remove('hidden');
}
