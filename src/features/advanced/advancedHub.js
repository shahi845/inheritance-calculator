/**
 * advancedHub.js — Advanced topics hub controller.
 * Handles topic modal displays, Grandfather side-by-side comparison, and Madhhab differences.
 */

import { calculateInheritance } from '../../madhahib/shafii/index.js';
import { calculateHanafiInheritance } from '../../madhahib/hanafi/index.js';
import { calculateMalikiInheritance } from '../../madhahib/maliki/index.js';
import { calculateHanbaliInheritance } from '../../madhahib/hanbali/index.js';

export function initAdvancedHub() {
    setupAdvancedCardButtons();
}

function setupAdvancedCardButtons() {
    document.querySelectorAll('.adv-open-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            openAdvancedTopicView(action);
        });
    });
}

function openAdvancedTopicView(action) {
    const modal = document.getElementById('advancedTopicModal');
    const content = document.getElementById('advancedModalContent');
    if (!modal || !content) return;

    if (action === 'grandfather') {
        renderGrandfatherComparison(content);
    } else if (action === 'madhhab-diff') {
        renderMadhhabDiffCalculator(content);
    } else if (action === 'awl-cases') {
        renderTopicOverview(content, '⚖️ ʿAwl (Proportional Reduction)', 'ʿAwl occurs when the prescribed fractional shares exceed 100%. The base denominator is increased to match the sum of numerators, ensuring equal proportional reduction across all fixed sharers.');
    } else if (action === 'radd-cases') {
        renderTopicOverview(content, '↩️ Radd (Surplus Redistribution)', 'Radd occurs when fixed shares total less than 100% and no residuary heir (ʿAṣabah) exists. The remaining surplus is redistributed back to blood sharers in proportion to their initial shares.');
    } else if (action === 'dhawu-al-arham') {
        renderTopicOverview(content, '🌿 Dhawū al-Arḥām (Distant Kindred)', 'Dhawū al-Arḥām includes blood relatives who are neither fixed sharers nor male-line residuaries (such as daughter\'s children, sister\'s children, and maternal uncles). Ḥanafī and Ḥanbalī schools allow them to inherit when no primary heirs exist.');
    } else if (action === 'mushtarikah') {
        renderTopicOverview(content, '🤝 Mushtarikah (Ḥimariyyah Case)', 'The famous Mushtarikah case involves Husband + Mother + 2 Maternal Brothers + 1 Full Brother. Shāfiʿī and Mālikī schools allow the full brother to share in the maternal 1/3, while Ḥanafī and Ḥanbalī schools give 0 to the full brother.');
    } else if (action === 'akdariyyah') {
        renderTopicOverview(content, '📐 Akdariyyah Case', 'The Akdariyyah is a unique exception in Shāfiʿī Fiqh involving Husband + Mother + Grandfather + 1 Sister. The sister\'s share is recalculated with the grandfather under a special rule found in no other scenario.');
    }

    modal.classList.remove('hidden');

    document.getElementById('closeAdvancedModal')?.addEventListener('click', () => {
        modal.classList.add('hidden');
    });
}

function renderTopicOverview(container, title, text) {
    container.innerHTML = `
        <div class="advanced-view-header">
            <h2>${escapeHtml(title)}</h2>
            <button class="close-modal-btn" id="closeAdvancedModal">&times;</button>
        </div>
        <div class="advanced-view-body glass-card mt-md">
            <p style="line-height:1.7;font-size:1rem;color:var(--text-primary);">${escapeHtml(text)}</p>
        </div>
    `;
}

function renderGrandfatherComparison(container) {
    const heirs = { paternalGrandfather: 1, fullBrother: 1 };
    const shafiiRes = calculateInheritance(heirs, { raddMode: 'baytulMal' });
    const hanafiRes = calculateHanafiInheritance(heirs, { raddMode: 'returnToHeirs' });
    const malikiRes = calculateMalikiInheritance(heirs, { surplusMode: 'classical_baytulmal' });
    const hanbaliRes = calculateHanbaliInheritance(heirs, { raddMode: 'returnToHeirs' });

    container.innerHTML = `
        <div class="advanced-view-header">
            <h2>👴 Grandfather with Siblings — Side-by-Side School Comparison</h2>
            <button class="close-modal-btn" id="closeAdvancedModal">&times;</button>
        </div>
        <div class="advanced-view-body mt-md">
            <p class="mb-md">Comparing <strong>Grandfather + 1 Full Brother</strong> across all four Sunni Madhhabs:</p>
            <table class="shares-table">
                <thead>
                    <tr>
                        <th>Madhhab</th>
                        <th>Grandfather Share</th>
                        <th>Full Brother Share</th>
                        <th>Methodology</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Shāfiʿī</strong></td>
                        <td><span class="badge badge-accent">50% (1/2)</span></td>
                        <td><span class="badge badge-accent">50% (1/2)</span></td>
                        <td>Muqāsamah (Shares equally with brother)</td>
                    </tr>
                    <tr>
                        <td><strong>Ḥanafī</strong></td>
                        <td><span class="badge badge-success">100% (Full Estate)</span></td>
                        <td><span class="badge badge-danger">0% (Blocked)</span></td>
                        <td>Grandfather acts as Father and blocks siblings</td>
                    </tr>
                    <tr>
                        <td><strong>Mālikī</strong></td>
                        <td><span class="badge badge-accent">50% (1/2)</span></td>
                        <td><span class="badge badge-accent">50% (1/2)</span></td>
                        <td>Muqāsamah (Same as Shāfiʿī)</td>
                    </tr>
                    <tr>
                        <td><strong>Ḥanbalī</strong></td>
                        <td><span class="badge badge-accent">50% (1/2)</span></td>
                        <td><span class="badge badge-accent">50% (1/2)</span></td>
                        <td>Muqāsamah (Same as Shāfiʿī)</td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
}

function renderMadhhabDiffCalculator(container) {
    container.innerHTML = `
        <div class="advanced-view-header">
            <h2>🔀 Madhhab Difference Cases</h2>
            <button class="close-modal-btn" id="closeAdvancedModal">&times;</button>
        </div>
        <div class="advanced-view-body mt-md">
            <p>Select a case to see how the outcome differs between Shāfiʿī, Ḥanafī, Mālikī, and Ḥanbalī schools:</p>
            <div class="diff-cases-list mt-md">
                <div class="diff-case-item glass-card mb-sm">
                    <h4>1. Grandfather + 1 Full Brother</h4>
                    <p>Ḥanafī gives 100% to Grandfather (blocking brother). Shāfiʿī, Mālikī, and Ḥanbalī split 50/50.</p>
                </div>
                <div class="diff-case-item glass-card mb-sm">
                    <h4>2. Mushtarikah Case</h4>
                    <p>Shāfiʿī and Mālikī allow full brother to share in the maternal 1/3. Ḥanafī and Ḥanbalī give 0 to full brother.</p>
                </div>
                <div class="diff-case-item glass-card mb-sm">
                    <h4>3. Surplus Redistribution (Radd)</h4>
                    <p>Ḥanafī and Ḥanbalī return surplus to blood sharers. Classical Shāfiʿī sends surplus to Bayt al-Māl.</p>
                </div>
            </div>
        </div>
    `;
}

function escapeHtml(str) {
    if (typeof str !== 'string') return str;
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
