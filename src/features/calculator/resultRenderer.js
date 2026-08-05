/**
 * resultRenderer.js — Builds and injects HTML for calculation results.
 */

import { escapeHtml } from '../../utils/escapeHtml.js';
import { generateWhyReasoningHTML } from './whyReasoning.js';
import { heirEvidences } from '../../data/evidences.js';

function getHeirKeyFromName(name) {
    if (!name) return '';
    const map = {
        'Husband': 'husband', 'Wife': 'wife', 'Wives': 'wife', 'Father': 'father', 'Mother': 'mother',
        'Paternal Grandfather': 'grandfather', 'Maternal Grandmother': 'maternalGrandmother', 'Paternal Grandmother': 'paternalGrandmother',
        'Son': 'son', 'Sons': 'son', 'Daughter': 'daughter', 'Daughters': 'daughter',
        'Full Brother': 'brother', 'Full Sister': 'sister', 'Paternal Brother': 'paternalBrother', 'Paternal Sister': 'paternalSister',
        'Maternal Brother': 'maternalBrother', 'Maternal Sister': 'maternalSister'
    };
    return map[name] || name.toLowerCase().replace(/[^a-z]/g, '');
}

export function displayResults(shares, messages, steps, estateValue, detailedBreakdown, heirsInput, blocked, currencySymbol = '$', activeMadhhab = 'shafii') {
    const safeCurrency = escapeHtml(currencySymbol);
    const resultsCards = document.getElementById('resultsCards');
    const messagesContainer = document.getElementById('messages');
    const sharesTableBody = document.getElementById('sharesTableBody');
    
    if (!resultsCards || !messagesContainer) return;

    resultsCards.innerHTML = '';
    messagesContainer.innerHTML = '';
    if (sharesTableBody) sharesTableBody.innerHTML = '';
    
    const sharers = shares.filter(s => s.status.includes('Sharer'));
    const residuaries = shares.filter(s => s.status.includes('Residuary') && !s.status.includes('Sharer + Residuary'));
    const blockedHeirsList = shares.filter(s => s.status.includes('Blocked'));
    
    const specialRules = [];
    if (messages.some(msg => msg.includes("'Awl applied"))) specialRules.push("ʿAwl (Proportional Reduction) applied to handle fractional overflow.");
    if (messages.some(msg => msg.includes("Radd applied"))) specialRules.push("Radd (Redistribution) applied to return surplus to sharers.");
    if (shares.some(s => s.reason && s.reason.includes("Gharāwiyyatayn"))) specialRules.push("Gharāwiyyatayn (ʿUmariyyatayn) exception applied for parents with spouse.");

    let html = '';

    // Financial Breakdown Card if detailed breakdown was used
    if (detailedBreakdown) {
        html += `
            <div class="result-card result-card-accent">
                <h3 class="estate-breakdown-title">Estate Financial Breakdown</h3>
                <ul class="estate-breakdown-list">
                    <li class="breakdown-item breakdown-bold">
                        <span><strong>Gross Assets:</strong></span>
                        <span>${safeCurrency}${detailedBreakdown.totalAssets.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </li>
                    <li class="breakdown-subitem breakdown-liquid">
                        <span>- Current / Liquid Assets:</span>
                        <span>${safeCurrency}${detailedBreakdown.currentAssets.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </li>
                    <li class="breakdown-subitem breakdown-fixed">
                        <span>- Fixed / Physical Assets:</span>
                        <span>${safeCurrency}${detailedBreakdown.fixedAssets.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </li>
                    <li class="breakdown-subitem breakdown-future">
                        <span>- Future / Receivable Assets:</span>
                        <span>${safeCurrency}${detailedBreakdown.futureAssets.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </li>
                    
                    <li class="breakdown-item breakdown-bold">
                        <span><strong>Total Liabilities & Deductions:</strong></span>
                        <span class="text-danger">${detailedBreakdown.totalLiabilities > 0 ? '-' : ''}${safeCurrency}${detailedBreakdown.totalLiabilities.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </li>
                    <li class="breakdown-subitem">
                        <span>- Funeral Expenses:</span>
                        <span>${detailedBreakdown.funeral > 0 ? '-' : ''}${safeCurrency}${detailedBreakdown.funeral.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </li>
                    <li class="breakdown-subitem">
                        <span>- Outstanding Debts:</span>
                        <span>${detailedBreakdown.debts > 0 ? '-' : ''}${safeCurrency}${detailedBreakdown.debts.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </li>
                    <li class="breakdown-subitem breakdown-future">
                        <span>- Bequests / Wills (Wasiyyah):</span>
                        <span>${detailedBreakdown.allowedWill > 0 ? '-' : ''}${safeCurrency}${detailedBreakdown.allowedWill.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${detailedBreakdown.isWillCapped ? `<span class="will-capped-warning">(Capped at 1/3)</span>` : ''}</span>
                    </li>
                    
                    <li class="breakdown-item breakdown-net">
                        <span><strong>Net Distributable Estate:</strong></span>
                        <span>${safeCurrency}${detailedBreakdown.netEstate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </li>
                </ul>
            </div>
        `;
    }

    // Summary Card
    html += `
        <div class="result-card summary-card">
            <h3>Summary</h3>
            <ul>
                <li><span>Total Estate Distributed:</span> <span>100% ${estateValue ? '(' + safeCurrency + estateValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ')' : ''}</span></li>
            </ul>
        </div>
    `;

    // Special Rules Card
    if (specialRules.length > 0) {
        html += `
            <div class="result-card" style="border-color: var(--accent);">
                <h3 style="color: var(--accent);">Special Rules Applied</h3>
                <ul>
                    ${specialRules.map(rule => `<li><span style="font-weight: 600;">${rule}</span></li>`).join('')}
                </ul>
            </div>
        `;
    }

    // 1. Calculation Steps Panel
    const madhhabNames = { shafii: 'Shāfiʿī', hanafi: 'Ḥanafī', maliki: 'Mālikī', hanbali: 'Ḥanbalī', jumhur: 'Jumhūr (Majority)' };
    const madhhabName = madhhabNames[activeMadhhab.toLowerCase()] || 'Shāfiʿī';
    
    let stepsHtml = `
        <div class="result-card steps-card timeline-trace-card" style="border: 1px solid rgba(167, 139, 250, 0.2); background: var(--bg-tertiary);">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem;">
                <span style="font-size: 1.25rem;">⏱️</span>
                <h3 style="margin: 0; color: var(--accent);">Calculation Timeline Trace</h3>
            </div>
            <div class="calculation-steps-container" style="position: relative; padding-left: 1.75rem; display: flex; flex-direction: column; gap: 1.5rem;">
                <!-- Vertical Timeline Line -->
                <div style="position: absolute; left: 0.45rem; top: 0.5rem; bottom: 0.5rem; width: 2px; background: rgba(167, 139, 250, 0.2);"></div>
                
                <div class="step-block" style="position: relative;">
                    <!-- Timeline Dot -->
                    <div style="position: absolute; left: -1.75rem; top: 0.35rem; width: 12px; height: 12px; border-radius: 50%; background: var(--bg-tertiary); border: 2px solid var(--accent); box-shadow: 0 0 0 2px var(--bg-tertiary);"></div>
                    <strong style="color: var(--text-primary); display: block; margin-bottom: 0.25rem;">Step 0: Determine Madhhab</strong>
                    <div style="font-size: 0.9em; color: var(--text-secondary); background: rgba(0,0,0,0.1); padding: 0.75rem; border-radius: 6px; border-left: 2px solid var(--accent);">
                        Applied rules according to the ${madhhabName} school of jurisprudence.
                    </div>
                </div>
    `;

    if (steps && steps.length > 0) {
        steps.forEach((step, idx) => {
            stepsHtml += `
                <div class="step-block" style="position: relative;">
                    <!-- Timeline Dot -->
                    <div style="position: absolute; left: -1.75rem; top: 0.35rem; width: 12px; height: 12px; border-radius: 50%; background: var(--bg-tertiary); border: 2px solid var(--accent); box-shadow: 0 0 0 2px var(--bg-tertiary);"></div>
                    <strong style="color: var(--text-primary); display: block; margin-bottom: 0.25rem;">${escapeHtml(step.title)}</strong>
                    <div style="font-size: 0.9em; color: var(--text-secondary); background: rgba(0,0,0,0.1); padding: 0.75rem; border-radius: 6px; border-left: 2px solid var(--glass-border);">
                        ${step.items.map(item => `• ${escapeHtml(item)}`).join('<br>')}
                    </div>
                </div>
            `;
        });
    }
    stepsHtml += `</div></div>`;
    html += stepsHtml;

    // 2. Beautiful Heir Cards
    html += `<h3 style="margin-top: 2rem; margin-bottom: 1rem;">Final Distribution</h3>
             <div class="heir-cards-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem;">`;

    // Process all heirs (Sharers, Residuaries, Blocked)
    shares.forEach(s => {
        const isBlocked = s.status.includes('Blocked');
        const countStr = s.count > 1 ? ` (x${s.count})` : '';
        const statusColor = isBlocked ? 'var(--danger)' : (s.status.includes('Sharer') ? 'var(--success)' : 'var(--accent)');
        
        let fractionStr = '-';
        if (!isBlocked && s.fracText && s.fracText !== '-') fractionStr = s.fracText.split(' ')[0];

        let totalPctStr = '0%';
        if (!isBlocked && s.pctPerPerson > 0) totalPctStr = (s.pctPerPerson * (s.count || 1)).toFixed(2) + '%';
        
        let amountStr = isBlocked || s.totalAmount === '-' ? '-' : safeCurrency + escapeHtml(s.totalAmount.toString());

        // Get evidence
        const key = s.key || getHeirKeyFromName(s.name);
        const evidenceInfo = heirEvidences[key] || {};
        const citation = evidenceInfo.evidence || 'Consensus (Ijmāʿ) / Primary Prophetic Sunnah';
        const reason = s.reason || (isBlocked ? 'Excluded by a closer surviving relative (Ḥajb)' : 'Standard inheritance rules');

        html += `
            <div class="result-card heir-card" style="border-top: 4px solid ${statusColor};">
                <div style="display: flex; justify-content: space-between; align-items: baseline; border-bottom: 1px solid var(--glass-border); padding-bottom: 0.75rem; margin-bottom: 1rem;">
                    <h3 style="margin: 0; font-size: 1.25em;">${escapeHtml(s.name)}${countStr}</h3>
                    <span style="font-size: 0.85em; font-weight: 600; padding: 0.25rem 0.5rem; border-radius: 4px; background: ${isBlocked ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)'}; color: ${statusColor};">
                        ${escapeHtml(s.status)}
                    </span>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.5rem; text-align: center; margin-bottom: 1rem;">
                    <div style="background: var(--bg-tertiary); padding: 0.5rem; border-radius: 6px;">
                        <div style="font-size: 0.75em; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px;">Share</div>
                        <div style="font-size: 1.1em; font-family: monospace; font-weight: bold;">${isBlocked ? '0' : escapeHtml(fractionStr)}</div>
                    </div>
                    <div style="background: var(--bg-tertiary); padding: 0.5rem; border-radius: 6px;">
                        <div style="font-size: 0.75em; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px;">Percentage</div>
                        <div style="font-size: 1.1em; font-weight: bold;">${escapeHtml(totalPctStr)}</div>
                    </div>
                    <div style="background: var(--bg-tertiary); padding: 0.5rem; border-radius: 6px;">
                        <div style="font-size: 0.75em; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px;">Amount</div>
                        <div style="font-size: 1.1em; font-weight: bold;">${amountStr}</div>
                        ${!isBlocked && s.count > 1 && s.amountPerPerson !== '-' ? `<div style="font-size: 0.7em; color: var(--accent); opacity: 0.9;">(${safeCurrency}${escapeHtml(s.amountPerPerson.toString())} each)</div>` : ''}
                    </div>
                </div>

                <details class="heir-reason-block" style="font-size: 0.9em; background: rgba(0,0,0,0.15); padding: 0.75rem; border-radius: 6px; border-left: 2px solid var(--text-secondary); margin-top: 0.5rem;">
                    <summary style="cursor: pointer; color: var(--text-secondary); font-weight: 600; padding-bottom: 0.25rem;">Why did they inherit this?</summary>
                    <div style="margin-top: 0.5rem; margin-bottom: 0.5rem;">
                        <strong style="color: var(--text-primary);">Reason:</strong> <span style="color: var(--text-secondary);">${escapeHtml(reason)}</span>
                    </div>
                    ${s.ruleId ? `<div style="margin-bottom: 0.25rem;"><strong style="color: var(--text-primary);">Rule ID:</strong> <span style="color: var(--text-secondary);">${escapeHtml(s.ruleId)}</span></div>` : ''}
                    ${s.reference ? `<div style="margin-bottom: 0.25rem;"><strong style="color: var(--text-primary);">Reference:</strong> <span style="color: var(--text-secondary);">${escapeHtml(s.reference)}</span></div>` : ''}
                    <div>
                        <strong style="color: var(--text-primary);">Evidence:</strong> <span style="color: #a78bfa;">📖 ${escapeHtml(s.evidence || citation)}</span>
                    </div>
                </details>
            </div>
        `;
    });
    
    html += `</div>`; // Close grid


    // Generate "Why?" Step-by-Step Educational Breakdown
    html += generateWhyReasoningHTML(shares, messages, heirsInput, activeMadhhab);

    resultsCards.innerHTML = html;

    // Populate the new Distribution Details table
    if (sharesTableBody) {
        let tableHtml = '';
        shares.forEach((share, index) => {
            const isBlocked = share.status.includes('Blocked');
            const rowStyle = isBlocked ? 'opacity: 0.6;' : '';
            const statusColor = isBlocked ? 'var(--danger)' : (share.status.includes('Sharer') ? 'var(--success)' : 'var(--accent)');
            
            // Extract just the fraction string (e.g., "1/8" from "1/8 (12.50%)")
            let fractionStr = '-';
            if (!isBlocked && share.fracText && share.fracText !== '-') {
                fractionStr = share.fracText.split(' ')[0];
            }

            // Calculate total percentage for the row
            let totalPctStr = '-';
            if (!isBlocked && share.pctPerPerson > 0) {
                totalPctStr = (share.pctPerPerson * (share.count || 1)).toFixed(2) + '%';
            }
            
            let amountStr = isBlocked || share.totalAmount === '-' ? '-' : safeCurrency + escapeHtml(share.totalAmount.toString());

            tableHtml += `
                <tr style="${rowStyle}">
                    <td style="text-align: center; color: var(--text-secondary);">${index + 1}</td>
                    <td>
                        <strong style="color: var(--text-primary);">${escapeHtml(share.name)}</strong>
                        ${share.count > 1 ? `<span style="font-size: 0.85em; color: var(--text-secondary); margin-left: 0.5rem;">(x${share.count})</span>` : ''}
                        <div style="font-size: 0.8em; color: ${statusColor}; margin-top: 2px;">${escapeHtml(share.status)}</div>
                    </td>
                    <td style="font-family: monospace; font-size: 1.1em; text-align: center;">${isBlocked ? '0' : escapeHtml(fractionStr)}</td>
                    <td style="text-align: center;">
                        <div>${isBlocked ? '0%' : escapeHtml(totalPctStr)}</div>
                        <div style="font-size: 0.85em; color: var(--text-secondary);">${amountStr}</div>
                    </td>
                    <td style="font-size: 0.85em; color: var(--text-secondary); line-height: 1.4;">
                        ${escapeHtml(share.reason || '')}
                        ${!isBlocked && share.count > 1 && share.amountPerPerson !== '-' ? `<br><span style="color: var(--accent); opacity: 0.9;">(${safeCurrency}${escapeHtml(share.amountPerPerson.toString())} each)</span>` : ''}
                    </td>
                    <td style="text-align: center; color: var(--text-secondary);">
                        <span style="font-weight:600;color:var(--text-primary);">${escapeHtml(share.ruleId || '-')}</span><br>
                        <span style="font-size: 0.8em; color: var(--accent); opacity:0.8;">${escapeHtml(share.reference || '')}</span>
                    </td>
                </tr>
            `;
        });
        sharesTableBody.innerHTML = tableHtml;
    }

    // Messages
    if (messages.length > 0) {
        messagesContainer.innerHTML = messages.map(msg => `
            <div class="message ${msg.includes('BLOCKED') ? 'blocked' : 'info'}">
                ${escapeHtml(msg)}
            </div>
        `).join('');
    }
}
