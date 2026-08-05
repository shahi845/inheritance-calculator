/**
 * searchEngine.js — Universal Global Search for Islamic Inheritance Platform.
 * Searches simultaneously across Calculator Heirs, Learning Topics, Sample Cases, and Scripture References.
 */

import { ALL_LEARNING_TOPICS } from '../../data/learning/index.js';
import { ALL_CASES } from '../../data/cases/index.js';
import { REFERENCES_DATA } from '../../data/references/referencesData.js';
import { heirEvidences } from '../../data/evidences.js';
import { navigateTo } from '../../app/pageRouter.js';
import { loadPreset } from '../calculator/presets.js';

export function initGlobalSearch() {
    const input = document.getElementById('globalSearchInput');
    const dropdown = document.getElementById('globalSearchDropdown');
    if (!input || !dropdown) return;

    input.addEventListener('input', (e) => {
        const query = e.target.value.trim().toLowerCase();
        if (query.length < 2) {
            dropdown.classList.add('hidden');
            dropdown.innerHTML = '';
            return;
        }

        const results = performUniversalSearch(query);
        renderSearchResults(results, dropdown);
    });

    document.addEventListener('click', (e) => {
        if (!input.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.add('hidden');
        }
    });
}

function performUniversalSearch(query) {
    const results = {
        heirs: [],
        learning: [],
        cases: [],
        references: []
    };

    // 1. Search Heirs & Calculator Rules
    for (const [key, info] of Object.entries(heirEvidences)) {
        if (key.toLowerCase().includes(query) || (info.evidence && info.evidence.toLowerCase().includes(query))) {
            results.heirs.push({
                key,
                title: formatHeirName(key),
                citation: info.evidence,
                rules: info.rules ? info.rules[0] : ''
            });
        }
    }

    // 2. Search Learning Topics
    ALL_LEARNING_TOPICS.forEach(topic => {
        if (topic.title.toLowerCase().includes(query) ||
            topic.summary.toLowerCase().includes(query) ||
            topic.definition.toLowerCase().includes(query)) {
            results.learning.push(topic);
        }
    });

    // 3. Search Sample Cases
    ALL_CASES.forEach(c => {
        if (c.title.toLowerCase().includes(query) ||
            c.description.toLowerCase().includes(query) ||
            (c.tags && c.tags.some(t => t.toLowerCase().includes(query)))) {
            results.cases.push(c);
        }
    });

    // 4. Search References
    REFERENCES_DATA.forEach(ref => {
        if (ref.title.toLowerCase().includes(query) ||
            (ref.translation && ref.translation.toLowerCase().includes(query)) ||
            (ref.commentary && ref.commentary.toLowerCase().includes(query))) {
            results.references.push(ref);
        }
    });

    return results;
}

function renderSearchResults(results, dropdown) {
    const total = results.heirs.length + results.learning.length + results.cases.length + results.references.length;

    if (total === 0) {
        dropdown.innerHTML = `<div class="search-no-results">No results found for your query.</div>`;
        dropdown.classList.remove('hidden');
        return;
    }

    let html = '';

    if (results.heirs.length > 0) {
        html += `<div class="search-category-header">🧮 Calculator &amp; Heir Rules</div>`;
        results.heirs.slice(0, 3).forEach(h => {
            html += `
                <div class="search-result-item" data-type="heir" data-key="${h.key}">
                    <div class="search-item-title">${escapeHtml(h.title)}</div>
                    <div class="search-item-sub">${escapeHtml(h.citation || '')} — ${escapeHtml(h.rules || '')}</div>
                </div>
            `;
        });
    }

    if (results.learning.length > 0) {
        html += `<div class="search-category-header">📚 Learning Topics</div>`;
        results.learning.slice(0, 3).forEach(t => {
            html += `
                <div class="search-result-item" data-type="learning" data-id="${t.id}">
                    <div class="search-item-title">${t.icon} ${escapeHtml(t.title)}</div>
                    <div class="search-item-sub">${escapeHtml(t.summary)}</div>
                </div>
            `;
        });
    }

    if (results.cases.length > 0) {
        html += `<div class="search-category-header">📋 Sample Cases</div>`;
        results.cases.slice(0, 3).forEach(c => {
            html += `
                <div class="search-result-item" data-type="case" data-id="${c.id}">
                    <div class="search-item-title">[${c.madhhab.toUpperCase()}] ${escapeHtml(c.title)}</div>
                    <div class="search-item-sub">${escapeHtml(c.description)}</div>
                </div>
            `;
        });
    }

    if (results.references.length > 0) {
        html += `<div class="search-category-header">📖 Scripture &amp; Classical Books</div>`;
        results.references.slice(0, 3).forEach(r => {
            html += `
                <div class="search-result-item" data-type="reference" data-id="${r.id}">
                    <div class="search-item-title">${escapeHtml(r.title)}</div>
                    <div class="search-item-sub">${escapeHtml(r.commentary || r.description || '')}</div>
                </div>
            `;
        });
    }

    dropdown.innerHTML = html;
    dropdown.classList.remove('hidden');

    dropdown.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', () => {
            const type = item.dataset.type;
            dropdown.classList.add('hidden');

            if (type === 'heir') {
                navigateTo('calculator');
                const el = document.getElementById(item.dataset.key);
                if (el) {
                    el.focus();
                    el.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.6)';
                    setTimeout(() => el.style.boxShadow = '', 2000);
                }
            } else if (type === 'learning') {
                navigateTo('learning');
            } else if (type === 'case') {
                navigateTo('cases');
            } else if (type === 'reference') {
                navigateTo('references');
            }
        });
    });
}

function formatHeirName(key) {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
}

function escapeHtml(str) {
    if (typeof str !== 'string') return str;
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
