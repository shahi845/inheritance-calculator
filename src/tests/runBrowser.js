/**
 * runBrowser.js — Browser entry point for the Farā'iḍ test suite.
 *
 * Exposes window.runFaraidTests and mounts the interactive browser UI trigger.
 */

import { runAllTests } from './runner/runAllTests.js';

if (typeof window !== 'undefined') {
    window.runFaraidTests = runAllTests;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectTriggerButton);
    } else {
        injectTriggerButton();
    }
}

function injectTriggerButton() {
    if (document.getElementById('faraid-test-trigger')) return;

    const btn = document.createElement('button');
    btn.id = 'faraid-test-trigger';
    btn.textContent = '🧪 Run Tests';
    btn.title = "Run Farā'iḍ test suite";
    btn.style.cssText = `
        position: fixed; bottom: 1.25rem; right: 1.25rem; z-index: 99990;
        padding: .5rem 1rem; border-radius: 8px; border: none; cursor: pointer;
        background: #1e40af; color: #fff; font-size: .85rem; font-weight: 600;
        font-family: 'Segoe UI', system-ui, sans-serif;
        box-shadow: 0 4px 20px #0007;
        transition: background .2s, transform .1s;
    `;

    btn.addEventListener('mouseenter', () => { btn.style.background = '#1d4ed8'; });
    btn.addEventListener('mouseleave', () => { btn.style.background = '#1e40af'; });
    btn.addEventListener('mousedown',  () => { btn.style.transform = 'scale(.96)'; });
    btn.addEventListener('mouseup',    () => { btn.style.transform = 'scale(1)'; });

    btn.addEventListener('click', () => {
        btn.textContent = '⏳ Running…';
        btn.disabled = true;
        btn.style.background = '#374151';

        requestAnimationFrame(() => {
            setTimeout(() => {
                const { totalPassed, totalFailed, totalTests } = runAllTests();
                const icon = totalFailed === 0 ? '✅' : '❌';
                btn.textContent = `${icon} ${totalPassed}/${totalTests}`;
                btn.disabled = false;
                btn.style.background = totalFailed === 0 ? '#065f46' : '#7f1d1d';
            }, 50);
        });
    });

    document.body.appendChild(btn);
    console.info("[Farā'iḍ] Test button injected. Click '🧪 Run Tests' to run all tests.");
}

export { runAllTests };
