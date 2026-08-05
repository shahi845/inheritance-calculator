/**
 * learningModeQuiz.js — Generates a contextual quiz after each calculation.
 * Questions are derived from the actual result, so they are always relevant.
 */

export function renderLearningModeQuiz(shares, context) {
    const panel = document.getElementById('learningModeQuiz');
    const content = document.getElementById('learningQuizContent');
    const isEnabled = document.getElementById('learningModeToggle')?.checked;

    if (!panel || !content) return;

    if (!isEnabled) {
        panel.classList.add('hidden');
        return;
    }

    // Pick an interesting heir to quiz on
    const inheriting = shares.filter(s => s.status && !s.status.includes('Blocked') && s.adjustedShare?.num > 0);
    if (!inheriting || inheriting.length === 0) {
        panel.classList.add('hidden');
        return;
    }

    // Prefer spouses or parents (more interesting questions)
    const preferred = inheriting.find(s => ['husband', 'wife', 'mother', 'father', 'daughter', 'son'].includes(s.heir));
    const quizTarget = preferred || inheriting[0];

    const q = generateQuestion(quizTarget, context, shares);
    if (!q) {
        panel.classList.add('hidden');
        return;
    }

    const qId = `quiz_${Date.now()}`;
    content.innerHTML = `
        <p style="font-size:0.95em;font-weight:600;color:var(--text-primary);margin-bottom:1rem;">
            ${q.question}
        </p>
        <div style="display:grid;gap:0.5rem;" id="${qId}_options">
            ${q.options.map((opt, i) => `
                <button 
                    data-correct="${opt.correct}"
                    onclick="handleQuizAnswer(this, '${qId}', '${encodeURIComponent(q.explanation)}')"
                    style="text-align:left;padding:0.65rem 1rem;border-radius:8px;background:rgba(255,255,255,0.04);
                           border:1px solid rgba(255,255,255,0.1);color:var(--text-primary);cursor:pointer;
                           font-family:inherit;font-size:0.9em;transition:all 0.2s;">
                    <span style="color:#818cf8;font-weight:700;margin-right:0.5rem;">${String.fromCharCode(65+i)}.</span>
                    ${opt.text}
                </button>
            `).join('')}
        </div>
        <div id="${qId}_explanation" style="display:none;margin-top:1rem;padding:0.85rem 1rem;
             border-radius:8px;background:rgba(16,185,129,0.08);border-left:3px solid #10b981;">
        </div>
    `;

    // Attach handler globally
    window.handleQuizAnswer = (btn, qId, explanationEncoded) => {
        const opts = document.getElementById(`${qId}_options`);
        if (!opts || opts.dataset.answered) return;
        opts.dataset.answered = '1';

        const correct = btn.dataset.correct === 'true';
        const expEl = document.getElementById(`${qId}_explanation`);

        // Color all buttons
        Array.from(opts.querySelectorAll('button')).forEach(b => {
            b.disabled = true;
            if (b.dataset.correct === 'true') {
                b.style.background = 'rgba(16,185,129,0.15)';
                b.style.borderColor = '#10b981';
            } else if (b === btn && !correct) {
                b.style.background = 'rgba(239,68,68,0.15)';
                b.style.borderColor = '#ef4444';
            }
        });

        // Show explanation
        if (expEl) {
            expEl.style.display = 'block';
            expEl.innerHTML = `
                <div style="font-weight:700;color:${correct ? '#10b981' : '#f59e0b'};margin-bottom:0.4rem;">
                    ${correct ? '✓ Correct!' : '○ See correct answer above'}
                </div>
                <div style="color:var(--text-secondary);font-size:0.9em;">${decodeURIComponent(explanationEncoded)}</div>
            `;
        }
    };

    panel.classList.remove('hidden');
}

function generateQuestion(target, context, shares) {
    const heir = target.heir;
    const adjShare = target.adjustedShare;
    if (!adjShare) return null;
    const fracStr = `${adjShare.num}/${adjShare.den}`;

    // Question templates based on heir type
    if (heir === 'wife' || heir === 'husband') {
        const isWife = heir === 'wife';
        const hasDesc = context?.awlApplied || shares.some(s => ['son','daughter','sonsSon','sonsDaughter'].includes(s.heir) && s.status !== 'Blocked');
        
        if (isWife) {
            const correct = hasDesc ? 'Descendants exist' : 'No descendants';
            const wrong1 = hasDesc ? 'No descendants' : 'Descendants exist';
            return {
                question: `Why did the wife (or wives) receive ${fracStr} of the estate?`,
                options: shuffle([
                    { text: correct, correct: true },
                    { text: wrong1, correct: false },
                    { text: 'ʿAwl reduced her share', correct: false },
                    { text: 'Radd was applied', correct: false }
                ]),
                explanation: `The wife receives 1/4 when no descendants exist and 1/8 when descendants exist (Qurʾān 4:12). Multiple wives share one portion equally.`
            };
        } else {
            const correct = hasDesc ? 'Descendants exist' : 'No descendants';
            return {
                question: `Why did the husband receive ${fracStr} of the estate?`,
                options: shuffle([
                    { text: correct, correct: true },
                    { text: hasDesc ? 'No descendants' : 'Descendants exist', correct: false },
                    { text: 'Radd was applied', correct: false },
                    { text: 'ʿAwl was applied', correct: false }
                ]),
                explanation: `The husband receives 1/2 when no descendants exist and 1/4 when descendants exist (Qurʾān 4:12).`
            };
        }
    }

    if (heir === 'mother') {
        return {
            question: `Why did the mother receive ${fracStr} of the estate?`,
            options: shuffle([
                { text: 'Descendants or 2+ siblings reduce her to 1/6', correct: adjShare.num === 1 && adjShare.den === 6 },
                { text: 'No descendants and at most one sibling (1/3 rule)', correct: adjShare.num === 1 && adjShare.den === 3 },
                { text: 'Gharāwiyyatān (ʿUmariyyatān) case', correct: (adjShare.num === 1 && adjShare.den === 4) },
                { text: 'ʿAwl was applied', correct: false }
            ]).map(o => ({ ...o, correct: o.correct })),
            explanation: `The mother's share is 1/3 if there are no descendants and fewer than 2 siblings. It reduces to 1/6 if there are descendants or 2+ siblings. In the Gharāwiyyatān case with a spouse + father, she takes 1/3 of the remainder.`
        };
    }

    if (heir === 'father') {
        const isResiduary = target.status?.includes('Residuary');
        return {
            question: `The father's status is "${target.status}". What does this mean?`,
            options: shuffle([
                { text: 'He takes 1/6 fixed share AND the remaining residue', correct: target.status?.includes('Sharer + Residuary') },
                { text: 'He takes only a 1/6 fixed share (male descendants exist)', correct: target.status === 'Sharer' },
                { text: 'He takes only the residue (no descendants)', correct: target.status === 'Residuary' },
                { text: 'He is blocked by the son', correct: false }
            ]),
            explanation: `The father receives: (1) 1/6 fixed share if male descendants exist; (2) 1/6 + residue if only female descendants; (3) Pure residue if no descendants. He is never blocked by siblings.`
        };
    }

    // Awl question
    if (context?.awlApplied) {
        return {
            question: `ʿAwl was applied in this case. What does ʿAwl mean?`,
            options: shuffle([
                { text: 'Proportionally reducing shares when they exceed 100%', correct: true },
                { text: 'Returning surplus estate to the heirs', correct: false },
                { text: 'Blocking a distant heir by a closer one', correct: false },
                { text: 'Dividing the estate through multiple deaths', correct: false }
            ]),
            explanation: `ʿAwl occurs when the sum of prescribed fractional shares exceeds the estate (denominator is too small). The denominator is raised, proportionally reducing each heir's share while keeping their relative ratios intact. Only Sunnī schools (not Shīʿa) accept ʿAwl.`
        };
    }

    // Radd question
    if (context?.raddApplied) {
        return {
            question: `Radd was applied in this case. What triggers Radd?`,
            options: shuffle([
                { text: 'Surplus estate remains after all fixed shares, and no residuary heir exists', correct: true },
                { text: 'Shares exceed 100% of the estate', correct: false },
                { text: 'A blocked heir challenges the distribution', correct: false },
                { text: 'Multiple deaths occur in sequence', correct: false }
            ]),
            explanation: `Radd (return) occurs when the sum of prescribed shares is less than 100% and there is no residuary heir (ʿaṣabah) to take the remainder. The surplus is returned proportionally to the blood sharers (not spouses, in most schools). The Ḥanafī school allows Radd even to spouses.`
        };
    }

    return null;
}

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}
