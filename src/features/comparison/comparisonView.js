/**
 * comparisonView.js — One-Screen 4-Madhhab Side-by-Side Comparison Engine.
 * Runs the current heir configuration simultaneously through Shāfiʿī, Ḥanafī, Mālikī, and Ḥanbalī engines.
 */

import { calculateInheritance } from '../../madhahib/shafii/index.js';
import { calculateHanafiInheritance } from '../../madhahib/hanafi/index.js';
import { calculateMalikiInheritance } from '../../madhahib/maliki/index.js';
import { calculateHanbaliInheritance } from '../../madhahib/hanbali/index.js';
import { readHeirsInput } from '../calculator/inputReader.js';

export function initComparisonView() {
    const compareBtn = document.getElementById('compareAllSchoolsBtn');
    if (!compareBtn) return;

    compareBtn.addEventListener('click', runAllSchoolsComparison);
}

export function runAllSchoolsComparison() {
    const container = document.getElementById('madhhabComparisonContainer');
    if (!container) return;

    const heirsInput = readHeirsInput();

    // Check if any heir entered
    const hasHeirs = Object.values(heirsInput).some(v => v > 0);
    if (!hasHeirs) {
        container.innerHTML = `<div class="error-container" style="display:block;">Please select at least one heir before running comparison.</div>`;
        container.classList.remove('hidden');
        return;
    }

    try {
        // Run all 4 calculation engines
        const shafiiRes = calculateInheritance(heirsInput, { raddMode: 'baytulMal' });
        const hanafiRes = calculateHanafiInheritance(heirsInput, { raddMode: 'returnToHeirs' });
        const malikiRes = calculateMalikiInheritance(heirsInput, { surplusMode: 'classical_baytulmal' });
        const hanbaliRes = calculateHanbaliInheritance(heirsInput, { raddMode: 'returnToHeirs' });

        renderComparisonTable(container, heirsInput, shafiiRes, hanafiRes, malikiRes, hanbaliRes);
        container.classList.remove('hidden');
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });

    } catch (err) {
        container.innerHTML = `<div class="error-container" style="display:block;">Comparison error: ${escapeHtml(err.message)}</div>`;
        container.classList.remove('hidden');
    }
}

function renderComparisonTable(container, heirsInput, shafii, hanafi, maliki, hanbali) {
    // Unique list of active heirs
    const heirKeys = Object.keys(heirsInput).filter(k => heirsInput[k] > 0);

    let tableRows = '';
    let foundDifference = false;

    heirKeys.forEach(key => {
        const shafiiShare = findShareText(shafii.shares, key);
        const hanafiShare = findShareText(hanafi.shares, key);
        const malikiShare = findShareText(maliki.shares, key);
        const hanbaliShare = findShareText(hanbali.shares, key);

        const isDifferent = (shafiiShare !== hanafiShare) || (shafiiShare !== malikiShare) || (shafiiShare !== hanbaliShare);
        if (isDifferent) foundDifference = true;

        const rowClass = isDifferent ? 'diff-row-highlight' : '';

        tableRows += `
            <tr class="${rowClass}">
                <td>
                    <strong>${escapeHtml(formatKey(key))}</strong>
                    <span class="text-small text-muted">(x${heirsInput[key]})</span>
                </td>
                <td><span class="badge ${getShareBadgeClass(shafiiShare)}">${escapeHtml(shafiiShare)}</span></td>
                <td><span class="badge ${getShareBadgeClass(hanafiShare)}">${escapeHtml(hanafiShare)}</span></td>
                <td><span class="badge ${getShareBadgeClass(malikiShare)}">${escapeHtml(malikiShare)}</span></td>
                <td><span class="badge ${getShareBadgeClass(hanbaliShare)}">${escapeHtml(hanbaliShare)}</span></td>
            </tr>
        `;
    });

    container.innerHTML = `
        <div class="result-card glass-card mt-lg" style="border-color: var(--accent);">
            <div class="comparison-header">
                <h3>⚖️ Side-by-Side 4-Madhhab School Comparison</h3>
                <p class="text-secondary text-small">Calculated for active heir selection across all four Sunni jurisprudence schools simultaneously.</p>
            </div>

            ${foundDifference ? `
                <div class="case-note mb-md" style="border-color:#3b82f6;background:rgba(59,130,246,0.1);color:#60a5fa;">
                    ℹ️ <strong>Highlight:</strong> Rows with glowing blue borders highlight heirs where juristic rulings differ between the schools!
                </div>
            ` : `
                <div class="case-note mb-md" style="border-color:#10b981;background:rgba(16,185,129,0.1);color:#34d399;">
                    ✓ <strong>Consensus (Ijmāʿ):</strong> All four schools agree 100% on this heir distribution!
                </div>
            `}

            <div class="table-responsive">
                <table class="shares-table">
                    <thead>
                        <tr>
                            <th>Heir</th>
                            <th>Shāfiʿī</th>
                            <th>Ḥanafī</th>
                            <th>Mālikī</th>
                            <th>Ḥanbalī</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function findShareText(sharesArray, key) {
    if (!sharesArray) return '0%';
    const match = sharesArray.find(s => s.key === key || s.name.toLowerCase().includes(key.toLowerCase()));
    if (!match) return '0%';
    if (match.status && match.status.includes('Blocked')) return 'Blocked (0%)';
    return match.fracText || (match.pctPerPerson ? (match.pctPerPerson * (match.count || 1)).toFixed(2) + '%' : '0%');
}

function getShareBadgeClass(shareText) {
    if (shareText.includes('Blocked') || shareText === '0%') return 'badge-danger';
    return 'badge-accent';
}

function formatKey(key) {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
}

function escapeHtml(str) {
    if (typeof str !== 'string') return str;
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
