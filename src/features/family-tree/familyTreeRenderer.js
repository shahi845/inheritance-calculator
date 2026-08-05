/**
 * familyTreeRenderer.js — Visual family tree state updates.
 * Sets SVG presentation attributes directly in JS for reliable cross-browser rendering.
 */

const STYLES = {
    default: {
        rectFill:   'rgba(30, 41, 59, 0.7)',
        rectStroke: 'rgba(255, 255, 255, 0.1)',
        strokeWidth: '1',
        textFill:   '#f8fafc',
        dashArray:  'none',
    },
    inherits: {
        rectFill:   'rgba(16, 185, 129, 0.2)',
        rectStroke: '#10b981',
        strokeWidth: '2',
        textFill:   '#10b981',
        dashArray:  'none',
    },
    blocked: {
        rectFill:   'rgba(239, 68, 68, 0.07)',
        rectStroke: 'rgba(239, 68, 68, 0.5)',
        strokeWidth: '1.5',
        textFill:   '#ef4444',
        dashArray:  'none',
    },
    absent: {
        rectFill:   'transparent',
        rectStroke: 'rgba(148, 163, 184, 0.3)',
        strokeWidth: '1',
        textFill:   'rgba(148, 163, 184, 0.45)',
        dashArray:  '4 4',
    },
};

function applyNodeStyle(element, state) {
    const s = STYLES[state] || STYLES.default;
    const rect = element.querySelector('rect');
    const mainText = element.querySelector('text');

    if (rect) {
        rect.setAttribute('fill', s.rectFill);
        rect.setAttribute('stroke', s.rectStroke);
        rect.setAttribute('stroke-width', s.strokeWidth);
        if (s.dashArray === 'none') {
            rect.removeAttribute('stroke-dasharray');
        } else {
            rect.setAttribute('stroke-dasharray', s.dashArray);
        }
    }
    if (mainText) {
        mainText.setAttribute('fill', s.textFill);
        mainText.style.textDecoration = (state === 'blocked') ? 'line-through' : 'none';
    }
}

/**
 * Updates the SVG family tree nodes based on calculation results.
 *
 * @param {Object} heirsInput - Normalized counts
 * @param {Object} blocked    - Blocked status map { [heirKey]: boolean }
 * @param {Array}  shares     - Result shares array
 */
export function updateFamilyTreeVisual(heirsInput, blocked, shares) {
    const nodesMapping = {
        'grandfather':       ['grandfather', 'paternalGrandfather'],
        'grandmother':       ['paternalGrandmother', 'maternalGrandmother', 'grandmothers'],
        'maternalGrandfather': ['maternalGrandfather'],
        'father':            ['father'],
        'mother':            ['mother'],
        'spouse':            ['husband', 'wife'],
        'son':               ['son', 'grandson', 'sonsSon'],
        'daughter':          ['daughter', 'granddaughter', 'sonsDaughter'],
        'siblings':          ['fullBrother', 'fullSister', 'paternalBrother', 'paternalSister', 'maternalBrother', 'maternalSister',
                              'brother', 'sister'],
    };

    for (const [nodeId, keys] of Object.entries(nodesMapping)) {
        const element = document.getElementById(`node-${nodeId}`);
        if (!element) continue;

        // Remove old badges
        element.querySelectorAll('.status-badge').forEach(b => b.remove());

        const count = keys.reduce((sum, key) => sum + (heirsInput[key] || 0), 0);

        if (count === 0) {
            element.classList.remove('inherits', 'blocked');
            element.classList.add('absent');
            applyNodeStyle(element, 'absent');
            continue;
        }

        const allBlocked = keys.every(key => !heirsInput[key] || blocked[key]);
        const inheriting = shares.filter(s =>
            keys.includes(s.heir) && s.adjustedShare && s.adjustedShare.num > 0
        );
        const anyInherits = inheriting.length > 0;

        if (anyInherits) {
            element.classList.remove('blocked', 'absent');
            element.classList.add('inherits');
            applyNodeStyle(element, 'inherits');

            // Fraction badge (e.g. ✓ 1/8)
            const s0 = inheriting[0].adjustedShare;
            const fracStr = `${s0.num}/${s0.den}`;
            const rect = element.querySelector('rect');
            const w = rect ? parseFloat(rect.getAttribute('width')) : 160;

            const badge = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            badge.setAttribute('class', 'status-badge');
            badge.setAttribute('x', String(w - 6));
            badge.setAttribute('y', '26');
            badge.setAttribute('text-anchor', 'end');
            badge.setAttribute('fill', '#10b981');
            badge.setAttribute('font-size', '10');
            badge.setAttribute('font-weight', 'bold');
            badge.textContent = `✓ ${fracStr}`;
            element.appendChild(badge);

        } else if (allBlocked) {
            element.classList.remove('inherits', 'absent');
            element.classList.add('blocked');
            applyNodeStyle(element, 'blocked');

            // Blocked info icon with tooltip
            const rect = element.querySelector('rect');
            const w = rect ? parseFloat(rect.getAttribute('width')) : 160;

            const badge = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            badge.setAttribute('class', 'status-badge');
            badge.setAttribute('x', String(w - 6));
            badge.setAttribute('y', '26');
            badge.setAttribute('text-anchor', 'end');
            badge.setAttribute('fill', '#ef4444');
            badge.setAttribute('font-size', '13');
            badge.setAttribute('font-weight', 'bold');
            badge.style.cursor = 'help';
            badge.textContent = 'ℹ';
            const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
            title.textContent = 'Blocked / Excluded — see Details table';
            badge.appendChild(title);
            element.appendChild(badge);

        } else {
            element.classList.remove('inherits', 'blocked');
            element.classList.add('absent');
            applyNodeStyle(element, 'absent');
        }
    }
}
