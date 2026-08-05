/**
 * sampleCasesSection.js — Sample Cases feature controller.
 * Renders categorized cases with filters and instant "Load into Calculator" action.
 */

import { ALL_CASES, getFilteredCases } from '../../data/cases/index.js';
import { loadPreset } from '../calculator/presets.js';
import { navigateTo } from '../../app/pageRouter.js';

let currentMadhhab = 'all';
let currentCategory = 'all';
let currentQuery = '';

export function initSampleCasesSection() {
    const grid = document.getElementById('sampleCasesGrid');
    if (!grid) return;

    renderCases(grid);
    setupFilters(grid);
    setupSearch(grid);
}

function renderCases(grid) {
    const cases = getFilteredCases(currentMadhhab, currentCategory, currentQuery);

    if (cases.length === 0) {
        grid.innerHTML = `
            <div class="empty-state glass-card">
                <p>No sample cases match your filter criteria.</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = cases.map(c => `
        <div class="case-card glass-card">
            <div class="case-card-header">
                <div class="case-madhhab-badge badge-${c.madhhab}">${escapeHtml(c.madhhab.toUpperCase())}</div>
                <span class="case-category-tag">${escapeHtml(c.category)}</span>
            </div>

            <h3 class="case-title">${escapeHtml(c.title)}</h3>
            <p class="case-desc">${escapeHtml(c.description)}</p>

            <div class="case-heirs-preview">
                <strong>Heirs:</strong>
                <div class="heir-chips">
                    ${Object.entries(c.heirs || {}).map(([k, v]) => `
                        <span class="heir-chip">${escapeHtml(k)}: ${v}</span>
                    `).join('')}
                </div>
            </div>

            ${c.teachingNote ? `
                <div class="case-note">
                    💡 <strong>Teaching Note:</strong> ${escapeHtml(c.teachingNote)}
                </div>
            ` : ''}

            <div class="case-card-footer">
                <span class="case-outcome-text">${escapeHtml(c.expectedOutcome || '')}</span>
                <button class="primary-btn load-case-btn" data-case-id="${c.id}">
                    ⚡ Load into Calculator
                </button>
            </div>
        </div>
    `).join('');

    grid.querySelectorAll('.load-case-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const caseId = btn.dataset.caseId;
            const targetCase = ALL_CASES.find(item => item.id === caseId);
            if (targetCase) {
                loadCaseIntoCalculator(targetCase);
            }
        });
    });
}

function loadCaseIntoCalculator(caseObj) {
    // 1. Reset all heir inputs
    document.querySelectorAll('.heirs-container input[type="number"]').forEach(input => {
        input.value = 0;
    });

    // 2. Fill heir inputs from case object
    if (caseObj.heirs) {
        for (const [key, count] of Object.entries(caseObj.heirs)) {
            const input = document.getElementById(key);
            if (input) input.value = count;
        }
    }

    // 3. Switch madhhab tab if specific madhhab
    if (caseObj.madhhab && caseObj.madhhab !== 'jumhur') {
        const tab = document.getElementById(`tab-${caseObj.madhhab}`);
        if (tab) tab.click();
    }

    // 4. Navigate to Calculator page
    navigateTo('calculator');

    // 5. Trigger calculation automatically
    setTimeout(() => {
        const calcBtn = document.getElementById('calculateBtn');
        if (calcBtn) calcBtn.click();
    }, 50);
}

function setupFilters(grid) {
    // Madhhab Filter Buttons
    document.querySelectorAll('.case-madhhab-filter').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.case-madhhab-filter').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentMadhhab = btn.dataset.madhhab;
            renderCases(grid);
        });
    });

    // Category Filter Select
    const categorySelect = document.getElementById('caseCategoryFilter');
    categorySelect?.addEventListener('change', (e) => {
        currentCategory = e.target.value;
        renderCases(grid);
    });
}

function setupSearch(grid) {
    const searchInput = document.getElementById('caseSearchInput');
    searchInput?.addEventListener('input', (e) => {
        currentQuery = e.target.value;
        renderCases(grid);
    });
}

function escapeHtml(str) {
    if (typeof str !== 'string') return str;
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
