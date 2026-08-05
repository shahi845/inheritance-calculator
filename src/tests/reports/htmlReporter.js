/**
 * htmlReporter.js — Dual-mode HTML test results reporter.
 *
 * Browser mode: Injects a styled overlay panel into document.body
 *               showing live test results. Toggled by pressing [T].
 *
 * Node mode:    Writes `test-report.html` to the current working directory.
 *
 * @param {Array<SuiteResult>} suiteResults
 * @param {{ totalTests: number, totalPassed: number, totalFailed: number }} [summary]
 */
export function htmlReporter(suiteResults, summary = {}) {
    const { totalTests = 0, totalPassed = 0, totalFailed = 0 } = summary;

    const html = buildHtml(suiteResults, { totalTests, totalPassed, totalFailed });

    if (typeof window !== 'undefined') {
        injectBrowserOverlay(html, suiteResults, { totalTests, totalPassed, totalFailed });
    } else if (typeof process !== 'undefined') {
        writeNodeFile(html);
    }
}

// ─── HTML Builder ─────────────────────────────────────────────────────────────

function buildHtml(suiteResults, { totalTests, totalPassed, totalFailed }) {
    const passRate = totalTests > 0 ? Math.round((totalPassed / totalTests) * 100) : 0;
    const overallClass = totalFailed === 0 ? 'pass' : 'fail';

    const suitesHtml = suiteResults.map(suite => {
        const suiteClass  = suite.failed === 0 ? 'pass' : 'fail';
        const failedTests = suite.results.filter(r => !r.passed);

        const failedHtml = failedTests.length === 0
            ? ''
            : `<ul class="failure-list">
                ${failedTests.map(t => `
                    <li>
                        <strong>${escHtml(t.name)}</strong>
                        <ul>${t.errors.map(e => `<li>${escHtml(e)}</li>`).join('')}</ul>
                    </li>
                `).join('')}
               </ul>`;

        return `
            <details class="suite ${suiteClass}" ${suite.failed > 0 ? 'open' : ''}>
                <summary>
                    <span class="badge ${suiteClass}">${suite.failed === 0 ? '✅ PASS' : '❌ FAIL'}</span>
                    <strong>${escHtml(suite.name)}</strong>
                    <span class="score">${suite.passed}/${suite.total}</span>
                </summary>
                ${failedHtml}
            </details>
        `;
    }).join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Farā'iḍ Test Report</title>
    <style>
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Segoe UI', system-ui, sans-serif;
            background: #0f1117; color: #e2e8f0;
            padding: 2rem; line-height: 1.6;
        }
        h1 { font-size: 1.6rem; margin-bottom: 1.5rem; color: #f8fafc; }
        .summary {
            display: flex; gap: 1.5rem; margin-bottom: 2rem;
            padding: 1rem 1.5rem; border-radius: 10px;
            background: #1e2130; border: 1px solid #2d3148;
        }
        .summary .stat { text-align: center; }
        .summary .stat .value { font-size: 2rem; font-weight: 700; }
        .summary .stat .label { font-size: 0.75rem; color: #94a3b8; text-transform: uppercase; letter-spacing: .05em; }
        .pass .value { color: #34d399; }
        .fail .value { color: #f87171; }
        .neutral .value { color: #60a5fa; }
        .suite {
            margin-bottom: .75rem; border-radius: 8px; overflow: hidden;
            border: 1px solid #2d3148;
        }
        .suite summary {
            display: flex; align-items: center; gap: .75rem;
            padding: .65rem 1rem; cursor: pointer;
            background: #1e2130; list-style: none;
            user-select: none;
        }
        .suite summary::-webkit-details-marker { display: none; }
        .suite summary:hover { background: #252840; }
        .suite.fail summary { border-left: 3px solid #f87171; }
        .suite.pass summary { border-left: 3px solid #34d399; }
        .badge { font-size: .7rem; font-weight: 700; padding: .15rem .45rem; border-radius: 4px; }
        .badge.pass { background: #064e3b; color: #34d399; }
        .badge.fail { background: #450a0a; color: #f87171; }
        .score { margin-left: auto; font-variant-numeric: tabular-nums; color: #94a3b8; font-size: .85rem; }
        .failure-list { padding: .75rem 1rem 1rem 2rem; background: #13151f; }
        .failure-list > li { margin-bottom: .5rem; }
        .failure-list > li strong { color: #fbbf24; }
        .failure-list ul { padding-left: 1.2rem; margin-top: .25rem; }
        .failure-list ul li { font-size: .82rem; color: #fca5a5; }
        .timestamp { margin-top: 2rem; font-size: .75rem; color: #475569; }
    </style>
</head>
<body>
    <h1>Farā'iḍ Calculator — Test Report</h1>
    <div class="summary">
        <div class="stat neutral"><div class="value">${totalTests}</div><div class="label">Total</div></div>
        <div class="stat pass"><div class="value">${totalPassed}</div><div class="label">Passed</div></div>
        <div class="stat fail"><div class="value">${totalFailed}</div><div class="label">Failed</div></div>
        <div class="stat ${overallClass}"><div class="value">${passRate}%</div><div class="label">Pass Rate</div></div>
    </div>
    ${suitesHtml}
    <p class="timestamp">Generated: ${new Date().toLocaleString()}</p>
</body>
</html>`;
}

// ─── Browser Overlay Injection ────────────────────────────────────────────────

function injectBrowserOverlay(fullHtml, suiteResults, stats) {
    // Remove existing panel if present
    const existing = document.getElementById('faraid-test-panel');
    if (existing) existing.remove();

    const { totalTests, totalPassed, totalFailed } = stats;
    const passRate = totalTests > 0 ? Math.round((totalPassed / totalTests) * 100) : 0;
    const overallColor = totalFailed === 0 ? '#34d399' : '#f87171';

    const panel = document.createElement('div');
    panel.id = 'faraid-test-panel';
    panel.style.cssText = `
        position: fixed; top: 1rem; right: 1rem; z-index: 99999;
        width: min(480px, 95vw); max-height: 80vh; overflow-y: auto;
        background: #0f1117cc; backdrop-filter: blur(16px);
        border: 1px solid #2d3148; border-radius: 12px;
        font-family: 'Segoe UI', system-ui, sans-serif;
        font-size: 13px; color: #e2e8f0;
        box-shadow: 0 20px 60px #000a;
    `;

    const header = `
        <div style="display:flex;align-items:center;gap:.6rem;padding:.75rem 1rem;
                    border-bottom:1px solid #2d3148;background:#1e2130;border-radius:12px 12px 0 0;">
            <span style="font-weight:700;flex:1;">Farā'iḍ Tests</span>
            <span style="color:${overallColor};font-weight:700;">${totalPassed}/${totalTests} (${passRate}%)</span>
            <button id="faraid-test-close"
                style="background:none;border:none;color:#94a3b8;cursor:pointer;font-size:1.1rem;
                       padding:.1rem .3rem;border-radius:4px;line-height:1;">✕</button>
        </div>`;

    const suitesHtml = suiteResults.map(suite => {
        const color = suite.failed === 0 ? '#34d399' : '#f87171';
        const failedHtml = suite.results.filter(r => !r.passed).map(t => `
            <div style="padding:.35rem .75rem;font-size:.78rem;color:#fca5a5;
                        border-left:2px solid #f87171;margin:.25rem 0;">
                <div style="color:#fbbf24;">${escHtml(t.name)}</div>
                ${t.errors.map(e => `<div style="padding-left:.75rem;">${escHtml(e)}</div>`).join('')}
            </div>`).join('');

        return `
            <div style="border-bottom:1px solid #1e2130;padding:.5rem .75rem;">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                    <span style="color:${color};">${suite.failed === 0 ? '✅' : '❌'} ${escHtml(suite.name)}</span>
                    <span style="color:#94a3b8;">${suite.passed}/${suite.total}</span>
                </div>
                ${failedHtml}
            </div>`;
    }).join('');

    panel.innerHTML = header + `<div style="padding:.5rem 0;">${suitesHtml}</div>`;
    document.body.appendChild(panel);

    document.getElementById('faraid-test-close')?.addEventListener('click', () => panel.remove());

    // Keyboard toggle: press 'T' to toggle
    document.addEventListener('keydown', e => {
        if (e.key === 't' || e.key === 'T') {
            const p = document.getElementById('faraid-test-panel');
            if (p) p.style.display = p.style.display === 'none' ? '' : 'none';
        }
    });

    console.info(`[Farā'iḍ Tests] Panel injected. Press [T] to toggle.`);
}

// ─── Node File Writer ─────────────────────────────────────────────────────────

function writeNodeFile(html) {
    try {
        // Dynamic import to keep browser-safe
        const { writeFileSync } = await_require('fs');
        writeFileSync('test-report.html', html, 'utf8');
        console.info('[htmlReporter] Written → test-report.html');
    } catch (e) {
        console.warn('[htmlReporter] Could not write test-report.html:', e.message);
    }
}

/** Synchronous require wrapper (Node only) */
function await_require(mod) {
    // eslint-disable-next-line no-undef
    return typeof require !== 'undefined' ? require(mod) : { writeFileSync: () => {} };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function escHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
