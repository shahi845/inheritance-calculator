/**
 * heirInspector.js — Interactive Family Tree Node Inspector.
 * Renders full 7-part juristic profile modal when clicking SVG tree nodes or heir cards.
 * Provides: Definition, Entitlement, Who blocks, Whom blocks, Primary Evidence, Examples, Related Heirs.
 */

import { heirEvidences } from '../../data/evidences.js';

export const HEIR_PROFILES = {
    father: {
        title: "Father (الأب)",
        definition: "The direct male ascendant of the deceased.",
        canInherit: "Always inherits. Never blocked by any relative.",
        whoBlocks: "None (Primary heir).",
        whomBlocks: "Blocks paternal grandfather, brothers, sisters, nephews, uncles, and cousins.",
        evidence: "Surah An-Nisā' 4:11 & Sahih Hadith",
        examples: "1) Deceased leaves Father + Son: Father gets 1/6 fixed, Son gets residue. 2) Deceased leaves Father + Daughter: Father gets 1/6 fixed + residue.",
        relatedHeirs: "Mother, Paternal Grandfather, Sons, Daughters."
    },
    mother: {
        title: "Mother (الأم)",
        definition: "The direct female ascendant of the deceased.",
        canInherit: "Always inherits. Never blocked by any relative.",
        whoBlocks: "None (Primary heir).",
        whomBlocks: "Blocks all grandmothers (maternal and paternal).",
        evidence: "Surah An-Nisā' 4:11",
        examples: "1) Deceased leaves Mother + Son: Mother gets 1/6. 2) Deceased leaves Mother + No Children + 1 Brother: Mother gets 1/3.",
        relatedHeirs: "Father, Maternal Grandmother, Paternal Grandmother."
    },
    husband: {
        title: "Husband (الزوج)",
        definition: "The surviving male spouse of the deceased at time of death.",
        canInherit: "Always inherits if marriage was legally valid and active at death.",
        whoBlocks: "None.",
        whomBlocks: "Does not block any heir, but reduces shares of residuaries.",
        evidence: "Surah An-Nisā' 4:12",
        examples: "1) Husband + No Children: Husband gets 1/2. 2) Husband + Daughter: Husband gets 1/4.",
        relatedHeirs: "Wife, Children, Parents."
    },
    wife: {
        title: "Wife / Wives (الزوجة)",
        definition: "The surviving female spouse(s) of the deceased at time of death.",
        canInherit: "Always inherits. Multiple wives share the 1/4 or 1/8 portion equally.",
        whoBlocks: "None.",
        whomBlocks: "Does not block any heir.",
        evidence: "Surah An-Nisā' 4:12",
        examples: "1) Wife + No Children: Wife gets 1/4. 2) 2 Wives + Son: Wives share 1/8 equally (1/16 each).",
        relatedHeirs: "Husband, Children, Parents."
    },
    son: {
        title: "Son (الابن)",
        definition: "Direct male descendant of the deceased.",
        canInherit: "Always inherits as primary male residuary (ʿAṣabah bi-nafsihi).",
        whoBlocks: "None.",
        whomBlocks: "Blocks grandsons, granddaughters, all brothers, sisters, nephews, uncles, and cousins.",
        evidence: "Surah An-Nisā' 4:11 & Prophetic Hadith",
        examples: "1) 2 Sons: Divide entire estate 50-50 as residuaries. 2) Son + Daughter: Son takes 2/3 of residue, Daughter takes 1/3.",
        relatedHeirs: "Daughter, Grandson, Father, Mother, Spouse."
    },
    daughter: {
        title: "Daughter (البنت)",
        definition: "Direct female descendant of the deceased.",
        canInherit: "Always inherits. Gets fixed share (1/2 or 2/3) or becomes residuary with Son.",
        whoBlocks: "None.",
        whomBlocks: "Consumes fixed share allowance, partially blocking lower female descendants (granddaughters).",
        evidence: "Surah An-Nisā' 4:11",
        examples: "1) 1 Daughter: Takes 1/2 fixed share. 2) 2 Daughters: Take 2/3 shared equally.",
        relatedHeirs: "Son, Granddaughter, Father, Mother."
    },
    grandfather: {
        title: "Paternal Grandfather (الجد من الأب)",
        definition: "Father's father of the deceased, sound male ascendant.",
        canInherit: "Inherits when Father is absent.",
        whoBlocks: "Blocked completely by Father (and closer grandfathers).",
        whomBlocks: "Blocks great-grandfathers, nephews, uncles, and cousins. (Shares with siblings in Shāfiʿī/Mālikī/Ḥanbalī).",
        evidence: "Consensus (Ijmāʿ) standing in place of Father",
        examples: "1) Grandfather + Son: Grandfather gets 1/6. 2) Grandfather + Brother (Shāfiʿī): Shares residue 50-50.",
        relatedHeirs: "Father, Paternal Grandmother, Full Brother."
    },
    paternalGrandmother: {
        title: "Paternal Grandmother (الجدة لأب)",
        definition: "Father's mother of the deceased.",
        canInherit: "Inherits 1/6 fixed share when Mother and Father are absent.",
        whoBlocks: "Blocked by Mother and Father.",
        whomBlocks: "Blocks more distant grandmothers.",
        evidence: "Hadith of Caliph Abu Bakr & Consensus",
        examples: "Paternal Grandmother + Husband + Son: Grandmother gets 1/6.",
        relatedHeirs: "Mother, Father, Maternal Grandmother."
    },
    maternalGrandmother: {
        title: "Maternal Grandmother (الجدة لأم)",
        definition: "Mother's mother of the deceased.",
        canInherit: "Inherits 1/6 fixed share when Mother is absent.",
        whoBlocks: "Blocked completely by Mother.",
        whomBlocks: "Blocks more distant maternal grandmothers.",
        evidence: "Sunnah of the Prophet (ﷺ)",
        examples: "Maternal Grandmother + Son: Grandmother gets 1/6, Son gets 5/6 residue.",
        relatedHeirs: "Mother, Paternal Grandmother."
    },
    brother: {
        title: "Full Brother (الأخ الشقيق)",
        definition: "Brother sharing both Father and Mother with deceased.",
        canInherit: "Inherits as residuary when no male descendants or Father exist.",
        whoBlocks: "Blocked by Son, Grandson, Father (and Grandfather in Ḥanafī).",
        whomBlocks: "Blocks paternal brothers, sisters, nephews, uncles, and cousins.",
        evidence: "Surah An-Nisā' 4:176",
        examples: "Full Brother + Mother: Mother gets 1/3, Full Brother gets 2/3 residue.",
        relatedHeirs: "Full Sister, Paternal Brother, Father, Son."
    }
};

export function initHeirInspector() {
    const svg = document.getElementById('familyTreeSvg');
    if (svg) {
        svg.querySelectorAll('.tree-node').forEach(node => {
            node.style.cursor = 'pointer';
            node.addEventListener('click', () => {
                const heirKey = getHeirKeyFromNodeId(node.id);
                if (heirKey) openHeirInspectorModal(heirKey);
            });
        });
    }

    // Attach to dynamic result cards or family tree list items
    document.addEventListener('click', (e) => {
        const target = e.target.closest('[data-heir-inspect]');
        if (target) {
            const key = target.dataset.heirInspect;
            openHeirInspectorModal(key);
        }
    });
}

function getHeirKeyFromNodeId(nodeId) {
    const map = {
        'node-father': 'father',
        'node-mother': 'mother',
        'node-grandfather': 'grandfather',
        'node-grandmother': 'paternalGrandmother',
        'node-maternalGrandfather': 'maternalGrandmother',
        'node-spouse': 'wife',
        'node-son': 'son',
        'node-daughter': 'daughter',
        'node-siblings': 'brother'
    };
    return map[nodeId] || '';
}

export function openHeirInspectorModal(heirKey) {
    const key = (heirKey || '').toLowerCase();
    const profile = HEIR_PROFILES[key] || HEIR_PROFILES[getCanonicalKey(key)] || generateGenericProfile(key);
    const evidenceInfo = heirEvidences[key] || heirEvidences[getCanonicalKey(key)] || {};

    const modal = document.getElementById('heirInspectorModal') || document.getElementById('evidenceModal');
    if (!modal) return;

    const modalContent = modal.querySelector('.modal-content') || modal;
    
    // Inject rich 7-section inspector UI into modal
    modalContent.innerHTML = `
        <div class="heir-inspector-container" style="padding: 1.5rem; position: relative;">
            <button id="closeHeirModalBtn" style="position: absolute; top: 1rem; right: 1rem; background: transparent; border: none; font-size: 1.5rem; color: var(--text-secondary); cursor: pointer;">&times;</button>
            
            <div class="heir-inspector-header" style="border-bottom: 2px solid var(--accent); padding-bottom: 0.75rem; margin-bottom: 1.25rem;">
                <h2 style="margin: 0; color: var(--accent); font-family: 'Outfit', sans-serif;">${escapeHtml(profile.title)}</h2>
                <span style="font-size: 0.88em; opacity: 0.8; color: var(--text-secondary);">Comprehensive Juristic Heir Breakdown</span>
            </div>

            <div class="heir-inspector-grid" style="display: grid; grid-template-columns: 1fr; gap: 1rem; font-size: 0.95em; max-height: 70vh; overflow-y: auto; padding-right: 0.5rem;">
                
                <div class="inspector-card" style="background: rgba(255,255,255,0.03); padding: 0.88rem; border-radius: 8px; border: 1px solid var(--glass-border);">
                    <h4 style="margin: 0 0 0.4rem 0; color: var(--accent);">📘 1. Definition</h4>
                    <p style="margin: 0; line-height: 1.5;">${escapeHtml(profile.definition)}</p>
                </div>

                <div class="inspector-card" style="background: rgba(16, 185, 129, 0.05); padding: 0.88rem; border-radius: 8px; border: 1px solid rgba(16, 185, 129, 0.2);">
                    <h4 style="margin: 0 0 0.4rem 0; color: #10b981;">✅ 2. Can Inherit? (Conditions)</h4>
                    <p style="margin: 0; line-height: 1.5;">${escapeHtml(profile.canInherit)}</p>
                </div>

                <div class="inspector-card" style="background: rgba(239, 68, 68, 0.05); padding: 0.88rem; border-radius: 8px; border: 1px solid rgba(239, 68, 68, 0.2);">
                    <h4 style="margin: 0 0 0.4rem 0; color: #ef4444;">🛡️ 3. Who Blocks Him/Her?</h4>
                    <p style="margin: 0; line-height: 1.5;">${escapeHtml(profile.whoBlocks)}</p>
                </div>

                <div class="inspector-card" style="background: rgba(245, 158, 11, 0.05); padding: 0.88rem; border-radius: 8px; border: 1px solid rgba(245, 158, 11, 0.2);">
                    <h4 style="margin: 0 0 0.4rem 0; color: #f59e0b;">⚔️ 4. Whom Does He/She Block?</h4>
                    <p style="margin: 0; line-height: 1.5;">${escapeHtml(profile.whomBlocks)}</p>
                </div>

                <div class="inspector-card" style="background: rgba(139, 92, 246, 0.05); padding: 0.88rem; border-radius: 8px; border: 1px solid rgba(139, 92, 246, 0.2);">
                    <h4 style="margin: 0 0 0.4rem 0; color: #a78bfa;">📖 5. Divine Evidence</h4>
                    <p style="margin: 0 0 0.4rem 0; font-weight: 600; color: var(--accent);">${escapeHtml(profile.evidence)}</p>
                    ${evidenceInfo.arabic ? `<div style="text-align: right; direction: rtl; font-family: 'Amiri', serif; font-size: 1.1em; background: rgba(0,0,0,0.2); padding: 0.5rem; border-radius: 4px; margin-bottom: 0.4rem;">${escapeHtml(evidenceInfo.arabic)}</div>` : ''}
                    ${evidenceInfo.translation ? `<p style="margin: 0; font-style: italic; opacity: 0.9;">"${escapeHtml(evidenceInfo.translation)}"</p>` : ''}
                </div>

                <div class="inspector-card" style="background: rgba(255,255,255,0.03); padding: 0.88rem; border-radius: 8px; border: 1px solid var(--glass-border);">
                    <h4 style="margin: 0 0 0.4rem 0; color: var(--text-primary);">💡 6. Practical Case Examples</h4>
                    <p style="margin: 0; line-height: 1.5;">${escapeHtml(profile.examples)}</p>
                </div>

                <div class="inspector-card" style="background: rgba(255,255,255,0.03); padding: 0.88rem; border-radius: 8px; border: 1px solid var(--glass-border);">
                    <h4 style="margin: 0 0 0.4rem 0; color: var(--text-secondary);">🔗 7. Related Heirs</h4>
                    <p style="margin: 0; line-height: 1.5;">${escapeHtml(profile.relatedHeirs)}</p>
                </div>
            </div>
        </div>
    `;

    modal.classList.remove('hidden');

    const closeBtn = document.getElementById('closeHeirModalBtn');
    closeBtn?.addEventListener('click', () => {
        modal.classList.add('hidden');
    });
}

function getCanonicalKey(key) {
    if (key.includes('husband')) return 'husband';
    if (key.includes('wife')) return 'wife';
    if (key.includes('father') && !key.includes('grand')) return 'father';
    if (key.includes('mother') && !key.includes('grand')) return 'mother';
    if (key.includes('son') && !key.includes('grand')) return 'son';
    if (key.includes('daughter') && !key.includes('grand')) return 'daughter';
    if (key.includes('grand') && key.includes('father')) return 'grandfather';
    if (key.includes('brother')) return 'brother';
    return key;
}

function generateGenericProfile(key) {
    return {
        title: formatKey(key),
        definition: `Heir relative category (${formatKey(key)}).`,
        canInherit: "Inherits according to fixed shares or residuary rules when eligible.",
        whoBlocks: "Blocked by closer surviving male ascendants or descendants.",
        whomBlocks: "May block more distant relatives in the inheritance chain.",
        evidence: "Primary Fara'id Consensus & Sunnah",
        examples: "Refer to Sample Cases section for full calculation scenarios.",
        relatedHeirs: "Immediate family members and ascendants."
    };
}

function formatKey(key) {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
}

function escapeHtml(str) {
    if (typeof str !== 'string') return str;
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
