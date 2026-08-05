/**
 * blockingTreeRenderer.js — Hierarchical blocking visualization.
 */

import { blockingTreeDefinition } from '../../data/evidences.js';
import { getHeirDisplayName } from '../../utils/formatResults.js';

/**
 * Renders the textual blocking tree showing who blocked whom.
 *
 * @param {Object} heirsInput - Normalized counts
 * @param {Object} blocked    - Blocked status map
 */
export function renderBlockingTree(heirsInput, blocked) {
    const container = document.getElementById('blockingHierarchyContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    for (const [blockerKey, blockedKeys] of Object.entries(blockingTreeDefinition)) {
        const row = document.createElement('div');
        row.className = 'blocking-row';
        
        const isActiveBlocker = heirsInput[blockerKey] > 0 && !blocked[blockerKey];
        if (isActiveBlocker) {
            row.classList.add('active-blocking');
        }
        
        const blockerName = getHeirDisplayName(blockerKey);
        
        let badgesHtml = '';
        blockedKeys.forEach(blockedKey => {
            const isPresentAndBlocked = heirsInput[blockedKey] > 0 && blocked[blockedKey];
            const blockedName = getHeirDisplayName(blockedKey);
            badgesHtml += `
                <span class="blocked-badge ${isPresentAndBlocked ? 'is-blocked' : ''}">
                    ${blockedName} ${isPresentAndBlocked ? '(BLOCKED)' : ''}
                </span>
            `;
        });
        
        row.innerHTML = `
            <div class="blocker-label">
                <strong>${blockerName}</strong>
            </div>
            <div class="blocked-list">
                ${badgesHtml}
            </div>
        `;
        container.appendChild(row);
    }
}
