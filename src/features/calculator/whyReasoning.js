/**
 * whyReasoning.js — Generates the "Why?" educational reasoning breakdown for calculation results.
 * Explains assigned shares, reasons, evidence citations, applied rules, and active Madhhab per heir.
 * Features collapsible accordion details as prioritized by user feedback.
 */

import { heirEvidences } from '../../data/evidences.js';

/**
 * Generates HTML for the "Why?" step-by-step collapsible reasoning section.
 * @param {Array} shares — Formatted shares array from calculator
 * @param {Array} messages — Engine messages array
 * @param {Object} heirsInput — User entered heirs input object
 * @param {string} madhhab — Active madhhab ('shafii', 'hanafi', 'maliki', 'hanbali', 'jumhur')
 * @returns {string} HTML string for the "Why?" section
 */
export function generateWhyReasoningHTML(shares, messages, heirsInput, madhhab = 'shafii') {
    if (!shares || shares.length === 0) return '';

    const madhhabNames = {
        shafii: 'Shāfiʿī',
        hanafi: 'Ḥanafī',
        maliki: 'Mālikī',
        hanbali: 'Ḥanbalī',
        jumhur: 'Jumhūr (Majority)'
    };
    const activeMadhhabName = madhhabNames[madhhab.toLowerCase()] || 'Shāfiʿī';

    let html = `
        <div class="why-section-card result-card mt-lg" style="border: 1px solid var(--accent-light, rgba(99, 102, 241, 0.3));">
            <div class="why-header" style="margin-bottom: 1.25rem;">
                <h3 style="margin-bottom: 0.25rem;">❓ Why? — Interactive Step-by-Step Rationale</h3>
                <span class="why-subtitle" style="font-size: 0.88em; opacity: 0.85;">Click any heir below to toggle detailed juristic reasoning and divine primary evidence</span>
            </div>
            <div class="why-accordion-list" style="display: flex; flex-direction: column; gap: 0.75rem;">
    `;

    shares.forEach((share, idx) => {
        const key = share.key || getHeirKeyFromName(share.name);
        const evidenceInfo = heirEvidences[key] || {};
        const isBlocked = share.status.includes('Blocked');
        const countStr = share.count > 1 ? ` (Count: ${share.count})` : '';

        // Determine fields
        const reason = share.reason || (isBlocked ? 'Excluded by a closer surviving relative (Ḥajb)' : 'Primary Quranic Fixed Share entitlement');
        const citation = evidenceInfo.evidence || 'Consensus (Ijmāʿ) / Primary Prophetic Sunnah';
        const quranText = evidenceInfo.translation ? `"${evidenceInfo.translation}"` : '';
        const arabicText = evidenceInfo.arabic || '';

        let ruleText = '';
        if (evidenceInfo.rules && evidenceInfo.rules.length > 0) {
            ruleText = evidenceInfo.rules.join(' ');
        } else {
            ruleText = share.reason || 'Inherits according to standard Islamic inheritance rules.';
        }

        const shareDisplay = isBlocked ? '0% (Blocked)' : (share.fracText || '-');
        const isFirst = idx === 0;

        html += `
            <details class="why-accordion-item ${isBlocked ? 'blocked-accordion' : 'active-accordion'}" ${isFirst ? 'open' : ''} style="background: var(--bg-tertiary, rgba(255,255,255,0.03)); border: 1px solid var(--glass-border); border-radius: 8px; padding: 0.75rem 1rem; transition: all 0.2s ease;">
                <summary style="cursor: pointer; display: flex; justify-content: space-between; align-items: center; font-weight: 600; list-style: none; user-select: none;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <span style="font-size: 1.1em; color: ${isBlocked ? 'var(--danger)' : 'var(--accent)'}">
                            ${isBlocked ? '🚫' : '📜'}
                        </span>
                        <span>${escapeHtml(share.name)}</span>
                        <span style="font-size: 0.85em; opacity: 0.75; font-weight: normal;">${countStr}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <span class="share-badge" style="background: ${isBlocked ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)'}; color: ${isBlocked ? '#ef4444' : '#10b981'}; padding: 0.2rem 0.6rem; border-radius: 6px; font-size: 0.85em; font-family: monospace;">
                            ${escapeHtml(shareDisplay)}
                        </span>
                        <span class="toggle-icon" style="font-size: 0.8em; opacity: 0.6;">▼</span>
                    </div>
                </summary>
                
                <div class="why-item-details" style="margin-top: 1rem; pt: 0.75rem; border-top: 1px solid var(--glass-border); display: grid; grid-template-columns: 1fr; gap: 0.6rem; font-size: 0.92em;">
                    
                    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                        <strong style="color: var(--text-secondary); min-width: 110px;">Share:</strong>
                        <span style="color: var(--accent); font-weight: 600;">${escapeHtml(shareDisplay)} ${share.totalAmount && share.totalAmount !== '-' ? `(${escapeHtml(share.totalAmount.toString())})` : ''}</span>
                    </div>

                    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                        <strong style="color: var(--text-secondary); min-width: 110px;">Why?</strong>
                        <span style="line-height: 1.5;">${escapeHtml(reason)}</span>
                    </div>

                    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                        <strong style="color: var(--text-secondary); min-width: 110px;">Evidence:</strong>
                        <span style="color: #a78bfa; font-weight: 500;">📖 ${escapeHtml(citation)}</span>
                    </div>

                    ${arabicText ? `
                        <div style="margin: 0.25rem 0; padding: 0.5rem 0.75rem; background: rgba(0,0,0,0.2); border-left: 3px solid var(--accent); border-radius: 4px; font-family: 'Amiri', 'Traditional Arabic', serif; font-size: 1.1em; text-align: right; direction: rtl;">
                            ${escapeHtml(arabicText)}
                        </div>
                    ` : ''}

                    ${quranText ? `
                        <div style="font-style: italic; color: var(--text-secondary); padding-left: 0.5rem; border-left: 2px solid rgba(255,255,255,0.15);">
                            ${escapeHtml(quranText)}
                        </div>
                    ` : ''}

                    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                        <strong style="color: var(--text-secondary); min-width: 110px;">Rule Applied:</strong>
                        <span style="line-height: 1.5;">${escapeHtml(ruleText)}</span>
                    </div>

                    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                        <strong style="color: var(--text-secondary); min-width: 110px;">Madhhab:</strong>
                        <span style="background: rgba(99, 102, 241, 0.15); color: #818cf8; padding: 0.1rem 0.5rem; border-radius: 4px; font-weight: 500; font-size: 0.88em;">${escapeHtml(activeMadhhabName)}</span>
                    </div>
                </div>
            </details>
        `;
    });

    html += `
            </div>
        </div>
    `;

    return html;
}

/** Helper to infer heir key from name */
function getHeirKeyFromName(name) {
    if (!name) return '';
    const map = {
        'Husband': 'husband',
        'Wife': 'wife',
        'Wives': 'wife',
        'Father': 'father',
        'Mother': 'mother',
        'Paternal Grandfather': 'grandfather',
        'Maternal Grandmother': 'maternalGrandmother',
        'Paternal Grandmother': 'paternalGrandmother',
        'Son': 'son',
        'Sons': 'son',
        'Daughter': 'daughter',
        'Daughters': 'daughter',
        'Full Brother': 'brother',
        'Full Sister': 'sister',
        'Paternal Brother': 'paternalBrother',
        'Paternal Sister': 'paternalSister',
        'Maternal Brother': 'maternalBrother',
        'Maternal Sister': 'maternalSister'
    };
    return map[name] || name.toLowerCase().replace(/[^a-z]/g, '');
}

function escapeHtml(str) {
    if (typeof str !== 'string') return str;
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
