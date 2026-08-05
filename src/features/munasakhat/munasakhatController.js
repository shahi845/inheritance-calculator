/**
 * munasakhatController.js — Interactive N-Stage Munāsakhāt Visual Builder.
 */

import { calculateMunasakhat } from './calculateMunasakhat.js';
import { renderMunasakhatResult, renderMunasakhatError } from './munasakhatRenderer.js';

let stageCount = 0;
let isFinished = false;
let _initialized = false;

const HEIR_TYPES = [
    // Primary Spouses & Parents
    { id: 'husband', label: 'Husband', max: 1, category: 'primary' },
    { id: 'wife', label: 'Wives', max: 4, category: 'primary' },
    { id: 'father', label: 'Father', max: 1, category: 'primary' },
    { id: 'mother', label: 'Mother', max: 1, category: 'primary' },
    
    // Direct Children & Grandchildren
    { id: 'son', label: 'Sons', category: 'primary' },
    { id: 'daughter', label: 'Daughters', category: 'primary' },
    { id: 'grandson', label: 'Grandsons (Son\'s Sons)', category: 'grand' },
    { id: 'granddaughter', label: 'Granddaughters (Son\'s Daughters)', category: 'grand' },

    // Grandparents
    { id: 'grandfather', label: 'Paternal Grandfather', max: 1, category: 'grand' },
    { id: 'paternalGrandmother', label: 'Paternal Grandmother', max: 1, category: 'grand' },
    { id: 'maternalGrandmother', label: 'Maternal Grandmother', max: 1, category: 'grand' },

    // Full & Half Siblings
    { id: 'brother', label: 'Full Brothers', category: 'siblings' },
    { id: 'sister', label: 'Full Sisters', category: 'siblings' },
    { id: 'paternalBrother', label: 'Paternal Half-Brothers', category: 'siblings' },
    { id: 'paternalSister', label: 'Paternal Half-Sisters', category: 'siblings' },
    { id: 'maternalBrother', label: 'Maternal Half-Brothers', category: 'siblings' },
    { id: 'maternalSister', label: 'Maternal Half-Sisters', category: 'siblings' },

    // Nephews, Uncles & Cousins
    { id: 'sonOfFullBrother', label: 'Sons of Full Brother', category: 'uncles' },
    { id: 'sonOfPaternalBrother', label: 'Sons of Paternal Half-Brother', category: 'uncles' },
    { id: 'uncle', label: 'Full Paternal Uncles', category: 'uncles' },
    { id: 'consanguinePaternalUncle', label: 'Consanguine Paternal Uncles', category: 'uncles' },
    { id: 'paternalUncleSon', label: 'Sons of Full Paternal Uncle', category: 'uncles' },
    { id: 'consanguinePaternalUncleSon', label: 'Sons of Consanguine Paternal Uncle', category: 'uncles' },

    // Distant Kindred (Dhawū al-Arḥām)
    { id: 'daughterSon', label: 'Daughter\'s Son', category: 'distant' },
    { id: 'daughterDaughter', label: 'Daughter\'s Daughter', category: 'distant' },
    { id: 'sisterSon', label: 'Sister\'s Son', category: 'distant' },
    { id: 'sisterDaughter', label: 'Sister\'s Daughter', category: 'distant' },
    { id: 'maternalUncle', label: 'Maternal Uncle', category: 'distant' },
    { id: 'maternalAunt', label: 'Maternal Aunt', category: 'distant' },
    { id: 'paternalAunt', label: 'Paternal Aunt', category: 'distant' },
    { id: 'maternalGrandfather', label: 'Maternal Grandfather', max: 1, category: 'distant' },
    { id: 'uterineSiblingChildren', label: 'Children of Uterine Siblings', category: 'distant' },
    { id: 'otherDistantRelatives', label: 'Other Distant Relatives', category: 'distant' }
];

export function initMunasakhatController() {
    if (_initialized) return;
    _initialized = true;

    const presetSelects = document.querySelectorAll('#munasakhatPresetSelect, .munasakhat-preset-select');
    presetSelects.forEach(select => select.addEventListener('change', handlePresetLoad));

    const resetBtns = document.querySelectorAll('.munasakhat-reset-btn');
    resetBtns.forEach(btn => btn.addEventListener('click', resetMunasakhat));

    // Initialize with first stage if container exists
    const container = document.getElementById('munasakhatDeathsContainer');
    if (container && stageCount === 0) {
        addDeathStage();
        renderWizardControls();
    }
}

export function resetMunasakhat() {
    const container = document.getElementById('munasakhatDeathsContainer');
    if (container) container.innerHTML = '';

    const resultsContainer = document.getElementById('wizardResultsContainer');
    if (resultsContainer) resultsContainer.innerHTML = '';

    const presetSelects = document.querySelectorAll('#munasakhatPresetSelect, .munasakhat-preset-select');
    presetSelects.forEach(select => { select.value = ''; });

    stageCount = 0;
    isFinished = false;

    addDeathStage();
    renderWizardControls();
}

function addDeathStage() {
    stageCount++;
    isFinished = false;
    const container = document.getElementById('munasakhatDeathsContainer');
    if (!container) return;

    const isFirstStage = stageCount === 1;
    
    const panel = document.createElement('div');
    panel.className = 'glass-panel munasakhat-stage-panel';
    panel.dataset.stageIndex = stageCount;
    panel.style.margin = '0';
    
    let deceasedSelectHtml = '';
    if (!isFirstStage) {
        const potentialHeirs = gatherPotentialDeceasedHeirs(stageCount);
        const optionsHtml = potentialHeirs.map(h => `<option value="${h.id}">${h.name}</option>`).join('');
        
        deceasedSelectHtml = `
            <div class="deceased-selection-card" style="background: rgba(239, 68, 68, 0.08); border: 1.5px solid rgba(239, 68, 68, 0.3); padding: 0.9rem 1.1rem; border-radius: 12px; margin-bottom: 0.75rem;">
                <label for="stage${stageCount}_deceased" style="color: #f87171; font-weight: 700; font-size: 0.9rem; display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.35rem;">
                    <span style="font-size: 1.05rem;">💀</span> Select Who Passed Away in Death #${stageCount}:
                </label>
                <p style="font-size: 0.8rem; color: var(--text-secondary); margin: 0 0 0.5rem 0;">
                    Choose from the receiving beneficiaries who inherited shares in earlier stages.
                </p>
                <select id="stage${stageCount}_deceased" class="stage-deceased-select" style="background: var(--card-bg); border: 1.5px solid rgba(239, 68, 68, 0.4); color: var(--text-primary); padding: 0.5rem 0.75rem; border-radius: 8px; width: 100%; font-size: 0.88rem; font-weight: 600;">
                    <option value="">-- Select Deceased Heir from Previous Stage --</option>
                    ${optionsHtml}
                </select>
                <div class="deceased-info-badge" style="margin-top: 0.5rem; font-size: 0.82rem; color: var(--accent); font-weight: 600; display: none;"></div>
            </div>
            <div class="beneficiaries-overview-card" style="background: rgba(99, 102, 241, 0.06); border: 1px solid rgba(99, 102, 241, 0.2); padding: 0.85rem 1rem; border-radius: 10px; font-size: 0.83rem;">
                <div style="font-weight: 700; color: var(--text-primary); margin-bottom: 0.4rem; display: flex; align-items: center; gap: 0.35rem;">
                    <span>👥</span> Auto-Inheriting Living Beneficiaries:
                </div>
                <div class="living-chips-container" style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.35rem;"></div>
            </div>
        `;
    }

    let heirInputsHtml = '';
    if (isFirstStage) {
        const categoryFilterHtml = `
            <div class="munasakhat-categories">
                <button type="button" class="munasakhat-cat-btn active" data-cat="all">All Heirs <span class="cat-badge" id="cat-badge-all">0</span></button>
                <button type="button" class="munasakhat-cat-btn" data-cat="primary">Primary Family <span class="cat-badge" id="cat-badge-primary">0</span></button>
                <button type="button" class="munasakhat-cat-btn" data-cat="grand">Grandparents & Kids <span class="cat-badge" id="cat-badge-grand">0</span></button>
                <button type="button" class="munasakhat-cat-btn" data-cat="siblings">Siblings <span class="cat-badge" id="cat-badge-siblings">0</span></button>
                <button type="button" class="munasakhat-cat-btn" data-cat="uncles">Uncles & Nephews <span class="cat-badge" id="cat-badge-uncles">0</span></button>
                <button type="button" class="munasakhat-cat-btn" data-cat="distant">Distant Kindred <span class="cat-badge" id="cat-badge-distant">0</span></button>
            </div>
        `;

        const cardsHtml = HEIR_TYPES.map(type => `
            <div class="munasakhat-heir-card" data-category="${type.category}">
                <label for="stage1_${type.id}" class="munasakhat-heir-label">${type.label}</label>
                <div class="munasakhat-stepper">
                    <button type="button" class="stepper-btn stepper-minus" data-target="stage1_${type.id}" aria-label="Decrease ${type.label}">−</button>
                    <input type="number" id="stage1_${type.id}" class="stage-heir-input stepper-input" data-type="${type.id}" data-category="${type.category}" min="0" ${type.max ? `max="${type.max}"` : ''} value="0">
                    <button type="button" class="stepper-btn stepper-plus" data-target="stage1_${type.id}" aria-label="Increase ${type.label}">+</button>
                </div>
            </div>
        `).join('');

        heirInputsHtml = `
            <div style="margin-top:0.5rem;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.6rem;">
                    <label style="font-size:0.83rem; font-weight:700; color:var(--text-primary); text-transform:uppercase; letter-spacing:0.03em;">
                        Primary Beneficiaries Receiving Shares:
                    </label>
                    <span id="primaryHeirTotalBadge" style="font-size:0.78rem; font-weight:700; color:#a78bfa; background:rgba(167,139,250,0.12); padding:0.2rem 0.55rem; border-radius:12px;">0 Selected</span>
                </div>
                ${categoryFilterHtml}
                <div class="munasakhat-heirs-grid">
                    ${cardsHtml}
                </div>
            </div>
        `;
    }

    panel.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.65rem;">
            <div style="display:flex; align-items:center; gap:0.5rem;">
                <span style="background:rgba(167,139,250,0.2); color:#c4b5fd; font-weight:800; font-size:0.75rem; padding:0.2rem 0.5rem; border-radius:6px; text-transform:uppercase;">Stage ${stageCount}</span>
                <h4 class="stage-title-text" style="margin:0; font-weight:700;">${isFirstStage ? 'Death #1 (Primary Deceased)' : `Death #${stageCount}`}</h4>
            </div>
            ${!isFirstStage ? `<button type="button" class="remove-stage-btn" title="Remove this stage">&times;</button>` : ''}
        </div>
        ${isFirstStage ? `<p style="font-size:0.82rem; color:var(--text-secondary); margin: 0 0 0.85rem 0;">Enter all beneficiaries who survive the primary deceased person. They will automatically inherit through all subsequent death events.</p>` : ''}
        ${deceasedSelectHtml}
        ${heirInputsHtml}
    `;

    if (isFirstStage) {
        // Setup Category Filtering
        const catBtns = panel.querySelectorAll('.munasakhat-cat-btn');
        catBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                catBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const selectedCat = btn.dataset.cat;
                const cards = panel.querySelectorAll('.munasakhat-heir-card');
                cards.forEach(card => {
                    if (selectedCat === 'all' || card.dataset.category === selectedCat) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });

        // Setup Stepper Buttons (+ and -)
        const stepperBtns = panel.querySelectorAll('.stepper-btn');
        stepperBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = btn.dataset.target;
                const input = document.getElementById(targetId);
                if (!input) return;

                let val = parseInt(input.value) || 0;
                const max = input.max ? parseInt(input.max) : Infinity;

                if (btn.classList.contains('stepper-plus')) {
                    if (val < max) val++;
                } else if (btn.classList.contains('stepper-minus')) {
                    if (val > 0) val--;
                }

                input.value = val;
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
            });
        });
    }

    if (!isFirstStage) {
        panel.querySelector('.remove-stage-btn').addEventListener('click', () => {
            panel.remove();
            stageCount--; 
            updateAllDeceasedSelects();
            renderWizardControls();
            
            const resultsContainer = document.getElementById('wizardResultsContainer');
            if (resultsContainer) resultsContainer.innerHTML = '';
        });

        const deceasedSelect = panel.querySelector('.stage-deceased-select');
        if (deceasedSelect) {
            deceasedSelect.addEventListener('change', () => {
                updateDeceasedBanner(panel);
                updateAllDeceasedSelects();
            });
        }
    }

    // Attach real-time input listeners
    const heirInputs = panel.querySelectorAll('.stage-heir-input');
    heirInputs.forEach(input => {
        const updateInputState = () => {
            const card = input.closest('.munasakhat-heir-card');
            const val = parseInt(input.value) || 0;
            if (card) {
                if (val > 0) {
                    card.classList.add('has-value');
                } else {
                    card.classList.remove('has-value');
                }
            }
            updateCategoryBadges(panel);
            updateAllDeceasedSelects();
            renderWizardControls();
        };

        input.addEventListener('input', updateInputState);
        input.addEventListener('change', updateInputState);
    });

    container.appendChild(panel);
    updateCategoryBadges(panel);
    updateAllDeceasedSelects();
}

function updateCategoryBadges(stage1Panel) {
    if (!stage1Panel || stage1Panel.dataset.stageIndex !== '1') return;

    const inputs = stage1Panel.querySelectorAll('.stage-heir-input');
    const counts = {
        all: 0,
        primary: 0,
        grand: 0,
        siblings: 0,
        uncles: 0,
        distant: 0
    };

    inputs.forEach(input => {
        const val = parseInt(input.value) || 0;
        if (val > 0) {
            counts.all += val;
            const cat = input.dataset.category;
            if (counts[cat] !== undefined) {
                counts[cat] += val;
            }
        }
    });

    for (const [cat, count] of Object.entries(counts)) {
        const badge = stage1Panel.querySelector(`#cat-badge-${cat}`);
        if (badge) badge.textContent = count;
    }

    const totalBadge = stage1Panel.querySelector('#primaryHeirTotalBadge');
    if (totalBadge) {
        totalBadge.textContent = `${counts.all} Selected`;
    }
}

export function updateAllDeceasedSelects() {
    const panels = document.querySelectorAll('.munasakhat-stage-panel');
    
    // Map stageIndex -> currently selected deceased ID
    const selectedDeceasedMap = new Map();
    panels.forEach(p => {
        const stageIndex = parseInt(p.dataset.stageIndex);
        const select = p.querySelector('.stage-deceased-select');
        if (select && select.value) {
            selectedDeceasedMap.set(stageIndex, select.value);
        }
    });

    panels.forEach(panel => {
        const stageIndex = parseInt(panel.dataset.stageIndex);
        if (stageIndex <= 1) return;

        const select = panel.querySelector('.stage-deceased-select');
        if (!select) return;

        const currentVal = select.value;
        const potentialHeirs = gatherPotentialDeceasedHeirs(stageIndex, selectedDeceasedMap);

        select.innerHTML = `<option value="">-- Select Deceased Heir from Previous Stage --</option>` +
            potentialHeirs.map(h => `<option value="${h.id}">${h.name}</option>`).join('');

        if (currentVal && potentialHeirs.some(h => h.id === currentVal)) {
            select.value = currentVal;
        } else {
            select.value = '';
        }

        updateDeceasedBanner(panel);
        updateLivingChips(panel, selectedDeceasedMap, stageIndex);
    });
}

function updateLivingChips(panel, selectedDeceasedMap, currentStageIndex) {
    const container = panel.querySelector('.living-chips-container');
    if (!container) return;

    const firstStagePanel = document.querySelector('.munasakhat-stage-panel[data-stage-index="1"]');
    if (!firstStagePanel) return;

    const inputs = firstStagePanel.querySelectorAll('.stage-heir-input');
    const allStage1Heirs = [];

    inputs.forEach(input => {
        const count = parseInt(input.value) || 0;
        const type = input.dataset.type;
        const typeLabel = HEIR_TYPES.find(t => t.id === type)?.label || type;

        for (let i = 1; i <= count; i++) {
            const personId = `stage1_${type}_${i}`;
            allStage1Heirs.push({
                id: personId,
                name: `${typeLabel} ${count > 1 ? i : ''}`.trim()
            });
        }
    });

    if (allStage1Heirs.length === 0) {
        container.innerHTML = `<span style="color:var(--text-secondary); font-style:italic; font-size:0.8rem;">No primary heirs entered in Stage 1 yet.</span>`;
        return;
    }

    container.innerHTML = allStage1Heirs.map(h => {
        let isDeceased = false;
        let diedInStage = null;

        for (const [sIdx, decId] of selectedDeceasedMap.entries()) {
            if (sIdx < currentStageIndex && decId === h.id) {
                isDeceased = true;
                diedInStage = sIdx;
                break;
            }
        }

        if (isDeceased) {
            return `<span class="beneficiary-chip deceased">💀 ${h.name} (Died in Stage ${diedInStage})</span>`;
        } else {
            return `<span class="beneficiary-chip">👤 ${h.name}</span>`;
        }
    }).join('');
}

function updateDeceasedBanner(panel) {
    const select = panel.querySelector('.stage-deceased-select');
    const badge = panel.querySelector('.deceased-info-badge');
    const stageNum = panel.dataset.stageIndex;
    const titleElem = panel.querySelector('.stage-title-text');

    if (!select || !badge) return;

    if (select.value) {
        const selectedOption = select.options[select.selectedIndex];
        const heirName = selectedOption ? selectedOption.text : '';
        badge.style.display = 'block';
        badge.innerHTML = `✓ <strong>Deceased Selected:</strong> ${heirName}. Remaining living heirs will automatically inherit their share.`;
        if (titleElem) {
            titleElem.innerHTML = `Death #${stageNum} (Deceased: <span style="color:var(--accent);">${heirName}</span>)`;
        }
    } else {
        badge.style.display = 'none';
        badge.innerHTML = '';
        if (titleElem) {
            titleElem.innerHTML = `Death #${stageNum}`;
        }
    }
}

function gatherPotentialDeceasedHeirs(upToStageIndex, selectedDeceasedMap = new Map()) {
    const heirs = [];
    const firstPanel = document.querySelector('.munasakhat-stage-panel[data-stage-index="1"]');
    if (!firstPanel) return heirs;
    
    const inputs = firstPanel.querySelectorAll('.stage-heir-input');
    inputs.forEach(input => {
        const count = parseInt(input.value) || 0;
        const type = input.dataset.type;
        const typeLabel = HEIR_TYPES.find(t => t.id === type)?.label || type;
        
        for (let i = 1; i <= count; i++) {
            const personId = `stage1_${type}_${i}`;
            
            // Exclude heirs who already died in an earlier stage
            let alreadyDiedEarlier = false;
            for (const [sIdx, decId] of selectedDeceasedMap.entries()) {
                if (sIdx < upToStageIndex && decId === personId) {
                    alreadyDiedEarlier = true;
                    break;
                }
            }

            if (!alreadyDiedEarlier) {
                heirs.push({
                    id: personId,
                    name: `${typeLabel} ${count > 1 ? i : ''} (From Death #1)`.trim()
                });
            }
        }
    });
    
    return heirs;
}

function renderWizardControls() {
    const controlsContainer = document.getElementById('wizardControlsContainer');
    if (!controlsContainer) return;

    if (isFinished) {
        controlsContainer.innerHTML = `
            <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid var(--success); padding: 1.25rem; border-radius: 12px; text-align: center;">
                <p style="color: var(--success); font-weight: 700; margin: 0 0 0.85rem 0; font-size: 1rem;">
                    ✓ Sequential Death Case Successfully Calculated!
                </p>
                <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
                    <button type="button" id="wizardRecalculateBtn" class="primary-btn" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 0.55rem 1.25rem; border-radius: 8px; font-weight: 700; cursor: pointer;">
                        ⚡ Recalculate
                    </button>
                    <button type="button" id="wizardAddStageBtn" class="secondary-btn" style="border-color: rgba(167, 139, 250, 0.5); color: #c4b5fd; padding: 0.55rem 1.25rem; border-radius: 8px; font-weight: 700; cursor: pointer;">
                        + Add Another Death Event
                    </button>
                    <button type="button" class="munasakhat-reset-btn secondary-btn" style="border-color: rgba(239, 68, 68, 0.4); color: #f87171; padding: 0.55rem 1.25rem; border-radius: 8px; font-weight: 700; cursor: pointer;">
                        ↺ Reset Case
                    </button>
                </div>
            </div>
        `;

        document.getElementById('wizardRecalculateBtn')?.addEventListener('click', () => {
            handleCalculate();
        });

        document.getElementById('wizardAddStageBtn')?.addEventListener('click', () => {
            addDeathStage();
            renderWizardControls();
        });

        controlsContainer.querySelectorAll('.munasakhat-reset-btn').forEach(btn => {
            btn.addEventListener('click', resetMunasakhat);
        });

        return;
    }

    controlsContainer.innerHTML = `
        <div style="display: flex; gap: 0.85rem; flex-wrap: wrap; align-items: center; justify-content: space-between; background: rgba(15, 23, 42, 0.4); padding: 0.9rem 1.2rem; border-radius: 12px; border: 1px solid var(--glass-border);">
            <div style="display: flex; align-items: center; gap: 0.6rem;">
                <span style="font-size: 0.83rem; font-weight: 700; color: var(--text-secondary);">Case Status:</span>
                <span style="font-size: 0.82rem; font-weight: 700; color: #a78bfa; background: rgba(167, 139, 250, 0.15); padding: 0.25rem 0.65rem; border-radius: 12px;">
                    ${stageCount} Death Event${stageCount > 1 ? 's' : ''} Configured
                </span>
            </div>

            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
                <button type="button" id="wizardAddStageBtn" class="secondary-btn" style="border-color: rgba(167, 139, 250, 0.5); color: #c4b5fd; padding: 0.55rem 1.1rem; border-radius: 8px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 0.35rem;">
                    <span>+</span> Add Next Death Event
                </button>
                <button type="button" id="wizardCalculateBtn" class="primary-btn" style="background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%); padding: 0.55rem 1.35rem; border-radius: 8px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 0.4rem; box-shadow: 0 4px 14px rgba(139, 92, 246, 0.3);">
                    <span>⚡</span> Calculate Final Distribution
                </button>
            </div>
        </div>
    `;

    document.getElementById('wizardAddStageBtn')?.addEventListener('click', () => {
        addDeathStage();
        renderWizardControls();
    });

    document.getElementById('wizardCalculateBtn')?.addEventListener('click', () => {
        const success = handleCalculate();
        if (success) {
            isFinished = true;
            renderWizardControls();
        }
    });
}

function handleCalculate() {
    const panels = document.querySelectorAll('.munasakhat-stage-panel');
    if (panels.length === 0) return false;

    // First collect all primary beneficiaries from Stage 1
    const stage1Panel = panels[0];
    const primaryHeirs = [];
    const stage1Inputs = stage1Panel.querySelectorAll('.stage-heir-input');
    
    stage1Inputs.forEach(input => {
        const count = parseInt(input.value) || 0;
        const type = input.dataset.type;
        for (let j = 1; j <= count; j++) {
            primaryHeirs.push({
                personId: `stage1_${type}_${j}`,
                heirType: type
            });
        }
    });

    if (primaryHeirs.length === 0) {
        renderMunasakhatError('Please enter at least one primary beneficiary in Death #1.');
        return false;
    }

    const deaths = [];
    const deceasedSetSoFar = new Set();
    
    for (let i = 0; i < panels.length; i++) {
        const panel = panels[i];
        const stageNum = panel.dataset.stageIndex;
        
        let deceasedHeirId = null;
        if (i > 0) {
            const deceasedSelect = panel.querySelector('.stage-deceased-select');
            deceasedHeirId = deceasedSelect?.value;
            if (!deceasedHeirId) {
                renderMunasakhatError(`Death #${stageNum} is missing a selected deceased heir.`);
                return false;
            }
            deceasedSetSoFar.add(deceasedHeirId);
        }

        // For Stage 1: use primaryHeirs
        // For Stage N: use remaining living primaryHeirs excluding anyone who has died in stages 1..N
        let stageHeirs;
        if (i === 0) {
            stageHeirs = primaryHeirs;
        } else {
            stageHeirs = primaryHeirs.filter(h => !deceasedSetSoFar.has(h.personId));
        }
        
        deaths.push({
            id: `death_${stageNum}`,
            name: i === 0 ? 'Primary Deceased' : `Death #${stageNum}`,
            deceasedHeirId,
            heirs: stageHeirs
        });
    }

    const caseData = {
        id: `munasakhat-interactive-${Date.now()}`,
        madhhab: 'shafii',
        deaths
    };

    try {
        const result = calculateMunasakhat(caseData);
        renderMunasakhatResult(result, caseData);
        return true;
    } catch (err) {
        renderMunasakhatError(`Calculation error: ${err.message}`);
        return false;
    }
}

function handlePresetLoad(e) {
    const val = e.target.value;
    if (!val) return;
    
    const container = document.getElementById('munasakhatDeathsContainer');
    container.innerHTML = '';
    stageCount = 0;
    isFinished = false;
    
    if (val === '2stage') {
        addDeathStage(); // D1
        addDeathStage(); // D2
        
        document.getElementById('stage1_wife').value = 1;
        document.getElementById('stage1_son').value = 2;
        updateAllDeceasedSelects();
        
        setTimeout(() => {
            const d2select = document.getElementById('stage2_deceased');
            if (d2select) {
                const options = Array.from(d2select.options);
                const sonOption = options.find(o => o.value.includes('stage1_son_1'));
                if (sonOption) d2select.value = sonOption.value;
            }
            updateAllDeceasedSelects();
            
            isFinished = true;
            renderWizardControls();
            handleCalculate();
        }, 50);
        
    } else if (val === '3stage') {
        addDeathStage(); // D1
        addDeathStage(); // D2
        addDeathStage(); // D3
        
        document.getElementById('stage1_wife').value = 1;
        document.getElementById('stage1_son').value = 2;
        updateAllDeceasedSelects();
        
        setTimeout(() => {
            const d2select = document.getElementById('stage2_deceased');
            if (d2select) {
                const sonOption = Array.from(d2select.options).find(o => o.value.includes('stage1_son_1'));
                if (sonOption) d2select.value = sonOption.value;
            }
            updateAllDeceasedSelects();
            
            const d3select = document.getElementById('stage3_deceased');
            if (d3select) {
                const wifeOption = Array.from(d3select.options).find(o => o.value.includes('stage1_wife_1'));
                if (wifeOption) d3select.value = wifeOption.value;
            }
            updateAllDeceasedSelects();
            
            isFinished = true;
            renderWizardControls();
            handleCalculate();
        }, 50);
    }
    
    e.target.value = '';
}
