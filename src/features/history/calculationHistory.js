/**
 * calculationHistory.js — LocalStorage Calculation History Manager.
 * Stores up to 20 past calculations with reload, export, and delete options.
 */

import { loadPreset } from '../calculator/presets.js';
import { navigateTo } from '../../app/pageRouter.js';

const STORAGE_KEY = 'faraid_calc_history';
const MAX_HISTORY = 20;

export function initCalculationHistory() {
    renderHistoryPanel();
}

/**
 * Saves a completed calculation to localStorage history.
 */
export function saveCalculationToHistory(heirsInput, shares, estateValue, madhhab) {
    const history = getHistory();

    const activeHeirs = {};
    for (const [k, v] of Object.entries(heirsInput)) {
        if (v > 0) activeHeirs[k] = v;
    }

    const newEntry = {
        id: 'calc_' + Date.now(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' }),
        madhhab: madhhab || 'shafii',
        estateValue: estateValue || 0,
        heirs: activeHeirs,
        summary: shares.filter(s => !s.status.includes('Blocked')).map(s => `${s.name}: ${s.fracText || s.pctPerPerson + '%'}`).join(', ')
    };

    history.unshift(newEntry);
    if (history.length > MAX_HISTORY) history.pop();

    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    renderHistoryPanel();
}

function getHistory() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        return [];
    }
}

function renderHistoryPanel() {
    const panel = document.getElementById('calculationHistoryContainer');
    if (!panel) return;

    const history = getHistory();

    if (history.length === 0) {
        panel.innerHTML = `
            <div class="empty-state glass-card">
                <p>No calculation history yet. Perform a calculation to save history automatically.</p>
            </div>
        `;
        return;
    }

    panel.innerHTML = `
        <div class="glass-card mt-md">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
                <h3>📜 Calculation History</h3>
                <button class="secondary-btn text-small" id="exportHistoryBtn">💾 Export History (JSON)</button>
            </div>

            <div class="history-list">
                ${history.map(item => `
                    <div class="history-item glass-card mb-sm" style="padding:0.75rem 1rem;">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.4rem;">
                            <strong>${escapeHtml(item.timestamp)} — <span class="badge badge-${item.madhhab}">${item.madhhab.toUpperCase()}</span></strong>
                            <div style="display:flex;gap:0.4rem;">
                                <button class="primary-btn reload-history-btn" data-id="${item.id}" style="padding:0.25rem 0.6rem;font-size:0.75rem;">Reload</button>
                                <button class="secondary-btn delete-history-btn" data-id="${item.id}" style="padding:0.25rem 0.6rem;font-size:0.75rem;color:var(--danger);">Delete</button>
                            </div>
                        </div>
                        <div style="font-size:0.82rem;color:var(--text-secondary);">
                            <strong>Heirs:</strong> ${Object.entries(item.heirs).map(([k, v]) => `${k} (x${v})`).join(', ')}
                        </div>
                        <div style="font-size:0.82rem;color:#cbd5e1;margin-top:0.2rem;">
                            <strong>Summary:</strong> ${escapeHtml(item.summary)}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    // Wire actions
    panel.querySelectorAll('.reload-history-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            const entry = history.find(h => h.id === id);
            if (entry) reloadHistoryEntry(entry);
        });
    });

    panel.querySelectorAll('.delete-history-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            deleteHistoryEntry(id);
        });
    });

    document.getElementById('exportHistoryBtn')?.addEventListener('click', exportHistoryData);
}

function reloadHistoryEntry(entry) {
    document.querySelectorAll('.heirs-container input[type="number"]').forEach(input => {
        input.value = 0;
    });

    if (entry.heirs) {
        for (const [key, count] of Object.entries(entry.heirs)) {
            const input = document.getElementById(key);
            if (input) input.value = count;
        }
    }

    if (entry.estateValue) {
        const estateInput = document.getElementById('estateValue');
        if (estateInput) estateInput.value = entry.estateValue;
    }

    navigateTo('calculator');
}

function deleteHistoryEntry(id) {
    let history = getHistory();
    history = history.filter(h => h.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    renderHistoryPanel();
}

function exportHistoryData() {
    const history = getHistory();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "faraid_calculation_history.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
}

function escapeHtml(str) {
    if (typeof str !== 'string') return str;
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
