/**
 * evidenceModal.js — UI logic for the Qur'anic/Sunnah evidence popup.
 */

import { heirEvidences } from '../../data/evidences.js';
import { getHeirDisplayName } from '../../utils/formatResults.js';

/**
 * Opens the evidence modal and populates it with text for the given heir.
 * @param {string} heirKey 
 */
export function openEvidenceModal(heirKey) {
    const evidenceModal = document.getElementById('evidenceModal');
    if (!evidenceModal) return;

    const info = heirEvidences[heirKey] || {
        evidence: "General Shāfiʿī Farā’iḍ principles",
        arabic: "وَأُولُو الْأَرْحَامِ بَعْضُهُمْ أَوْلَىٰ بِبَعْضٍ فِي كِتَابِ اللَّهِ",
        translation: "And blood relatives are closer to one another in the decree of Allah...",
        rules: ["Inherits according to Shāfiʿī jurisprudence rules of proximity and blocking."]
    };
    
    document.getElementById('modalHeirName').textContent = getHeirDisplayName(heirKey);
    document.getElementById('modalEvidenceCitation').textContent = info.evidence || "Evidence Citation";
    document.getElementById('modalArabicVerse').textContent = info.arabic || "";
    document.getElementById('modalTranslation').textContent = info.translation || "";
    
    const rulesHtml = (info.rules || []).map(r => `<li>${r}</li>`).join('');
    document.getElementById('modalRulesList').innerHTML = rulesHtml;
    
    evidenceModal.classList.remove('hidden');
}

/**
 * Attaches event listeners for closing the modal and clicking family tree nodes.
 */
export function initEvidenceModal() {
    const evidenceModal = document.getElementById('evidenceModal');
    const closeModalBtn = document.getElementById('closeModalBtn');

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            evidenceModal.classList.add('hidden');
        });
    }
    
    if (evidenceModal) {
        evidenceModal.addEventListener('click', (e) => {
            if (e.target === evidenceModal) {
                evidenceModal.classList.add('hidden');
            }
        });
    }

    // Attach to family tree nodes
    document.querySelectorAll('.tree-node').forEach(node => {
        node.addEventListener('click', () => {
            const id = node.id.replace('node-', '');
            let key = id;
            if (id === 'spouse') {
                const husbandVal = document.getElementById('husband')?.value;
                key = (parseInt(husbandVal) > 0) ? 'husband' : 'wife';
            } else if (id === 'siblings') {
                key = 'brother';
            } else if (id === 'grandmother') {
                key = 'paternalGrandmother';
            }
            openEvidenceModal(key);
        });
    });
}
