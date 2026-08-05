/**
 * referencesSection.js — References feature controller.
 * Renders Quran, Hadith, Classical books, and Scholar notes in collapsible cards.
 */

import { ALL_REFERENCES } from '../../data/references/index.js';

export function initReferencesSection() {
    const container = document.getElementById('referencesCardsContainer');
    if (!container) return;

    renderReferences(container);
    setupReferenceFilters(container);
}

function renderReferences(container, categoryFilter = 'all') {
    const items = categoryFilter === 'all'
        ? ALL_REFERENCES
        : ALL_REFERENCES.filter(r => r.category === categoryFilter);

    container.innerHTML = items.map(ref => `
        <details class="heir-group reference-card mb-md">
            <summary>
                <span>
                    <span class="ref-category-badge badge-${ref.category}">${ref.category.toUpperCase()}</span>
                    <strong>${escapeHtml(ref.title)}</strong>
                </span>
            </summary>
            <div class="group-content group-content-single">
                ${ref.arabic ? `
                    <div class="arabic-verse" dir="rtl" style="font-size:1.25rem;line-height:2.2;color:#f8fafc;background:rgba(0,0,0,0.25);padding:1rem;border-radius:8px;margin-bottom:0.75rem;">
                        ${escapeHtml(ref.arabic)}
                    </div>
                ` : ''}

                ${ref.translation ? `
                    <p style="font-style:italic;color:#cbd5e1;line-height:1.6;margin-bottom:0.75rem;">
                        "${escapeHtml(ref.translation)}"
                    </p>
                ` : ''}

                ${ref.commentary ? `
                    <p style="color:var(--text-secondary);font-size:0.9rem;line-height:1.5;">
                        📖 <strong>Commentary:</strong> ${escapeHtml(ref.commentary)}
                    </p>
                ` : ''}

                ${ref.description ? `
                    <p style="color:var(--text-primary);font-size:0.95rem;line-height:1.6;">
                        ${escapeHtml(ref.description)}
                    </p>
                    ${ref.significance ? `<p class="text-accent text-small mt-sm">🏛️ <strong>Significance:</strong> ${escapeHtml(ref.significance)}</p>` : ''}
                ` : ''}
            </div>
        </details>
    `).join('');
}

function setupReferenceFilters(container) {
    document.querySelectorAll('.ref-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.ref-filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const category = btn.dataset.category;
            renderReferences(container, category);
        });
    });
}

function escapeHtml(str) {
    if (typeof str !== 'string') return str;
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
