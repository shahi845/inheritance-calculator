/**
 * learningSection.js — Renders educational concept cards and detail modal.
 */

import { ALL_LEARNING_TOPICS } from '../../data/learning/index.js';
import { loadPreset } from '../calculator/presets.js';
import { navigateTo } from '../../app/pageRouter.js';
import { t } from '../../i18n/i18n.js';

let currentTopicCategory = 'all';

export function initLearningSection() {
    const container = document.getElementById('learningTopicsContainer');
    if (!container) return;

    renderTopicCards(ALL_LEARNING_TOPICS, container);
    setupCategoryFilters(container);
    setupTopicModal();

    window.addEventListener('faraid:languageChange', () => {
        const cont = document.getElementById('learningTopicsContainer');
        if (cont) {
            const filtered = currentTopicCategory === 'all'
                ? ALL_LEARNING_TOPICS
                : ALL_LEARNING_TOPICS.filter(t => t.category === currentTopicCategory);
            renderTopicCards(filtered, cont);
        }
    });
}

function renderTopicCards(topics, container) {
    container.innerHTML = topics.map(topic => `
        <div class="topic-card glass-card" data-topic-id="${topic.id}">
            <div class="topic-card-header">
                <span class="topic-icon">${topic.icon}</span>
                <span class="topic-category-badge">${escapeHtml(topic.category)}</span>
            </div>
            <h3 class="topic-title">${escapeHtml(topic.title)}</h3>
            <p class="topic-summary">${escapeHtml(topic.summary)}</p>
            <div class="topic-card-footer">
                <button class="view-topic-btn" data-topic-id="${topic.id}">${escapeHtml(t('explore_topic_btn', 'Explore Topic →'))}</button>
            </div>
        </div>
    `).join('');

    container.querySelectorAll('.view-topic-btn, .topic-card').forEach(el => {
        el.addEventListener('click', (e) => {
            const topicId = el.dataset.topicId || el.closest('.topic-card')?.dataset.topicId;
            if (topicId) openTopicModal(topicId);
        });
    });
}

function setupCategoryFilters(container) {
    const filterBtns = document.querySelectorAll('.learning-filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.dataset.category || 'all';
            currentTopicCategory = category;
            const filtered = category === 'all'
                ? ALL_LEARNING_TOPICS
                : ALL_LEARNING_TOPICS.filter(t => t.category === category);

            renderTopicCards(filtered, container);
        });
    });
}

function openTopicModal(topicId) {
    const topic = ALL_LEARNING_TOPICS.find(t => t.id === topicId);
    if (!topic) return;

    const modal = document.getElementById('learningTopicModal');
    const content = document.getElementById('learningModalContent');
    if (!modal || !content) return;

    content.innerHTML = `
        <div class="topic-modal-header">
            <div class="title-group">
                <span class="topic-icon-large">${topic.icon}</span>
                <div>
                    <h2>${escapeHtml(topic.title)}</h2>
                    <span class="badge badge-accent">${escapeHtml(topic.category.toUpperCase())}</span>
                </div>
            </div>
            <button class="close-modal-btn" id="closeLearningModal">&times;</button>
        </div>

        <div class="topic-modal-body">
            <div class="topic-section">
                <h4>📖 ${escapeHtml(t('topic_definition', 'Definition'))}</h4>
                <p>${escapeHtml(topic.definition)}</p>
            </div>

            <div class="topic-section">
                <h4>🎯 ${escapeHtml(t('topic_purpose', 'Purpose'))}</h4>
                <p>${escapeHtml(topic.purpose)}</p>
            </div>

            <div class="topic-section">
                <h4>💡 ${escapeHtml(t('topic_explanation', 'Detailed Explanation'))}</h4>
                <p>${escapeHtml(topic.explanation)}</p>
            </div>

            <div class="topic-section">
                <h4>📜 ${escapeHtml(t('topic_rules', 'Key Rules'))}</h4>
                <ul>
                    ${topic.rules.map(r => `<li>${escapeHtml(r)}</li>`).join('')}
                </ul>
            </div>

            <div class="topic-section">
                <h4>📝 ${escapeHtml(t('topic_example', 'Worked Example'))}</h4>
                <div class="example-box">${escapeHtml(topic.examples)}</div>
            </div>

            <div class="topic-section">
                <h4>📖 ${escapeHtml(t('topic_citation', 'Primary Evidence Citation'))}</h4>
                <p class="evidence-text"><strong>${escapeHtml(topic.evidence)}</strong></p>
            </div>

            ${topic.calculatorCase ? `
                <div class="topic-action-box">
                    <p>${escapeHtml(t('topic_action_prompt', 'Want to see this concept live in action?'))}</p>
                    <button class="primary-btn try-calc-btn" data-case="${topic.calculatorCase}">
                        🧮 ${escapeHtml(t('btn_load_calculator', 'Load Example in Calculator'))}
                    </button>
                </div>
            ` : ''}
        </div>
    `;

    modal.classList.remove('hidden');

    document.getElementById('closeLearningModal')?.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    content.querySelector('.try-calc-btn')?.addEventListener('click', (e) => {
        const caseId = e.target.dataset.case;
        modal.classList.add('hidden');
        if (caseId) {
            loadPreset(caseId);
        }
        navigateTo('calculator');
        setTimeout(() => {
            document.getElementById('calculateBtn')?.click();
        }, 50);
    });
}

function setupTopicModal() {
    const modal = document.getElementById('learningTopicModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.add('hidden');
        });
    }
}

function escapeHtml(str) {
    if (typeof str !== 'string') return str;
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
