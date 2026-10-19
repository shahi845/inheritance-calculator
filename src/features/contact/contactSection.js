/**
 * contactSection.js — Handles the Contact & Discrepancy Reporting flow.
 * Allows users, students, and scholars to report calculation errors, madhhab rulings, or citations.
 * Automatically routes reports directly to Gmail addressed to mshahid3845@gmail.com.
 */

import { t } from '../../i18n/i18n.js';
import { readHeirsInput, readSelectedMadhhab } from '../calculator/inputReader.js';
import { navigateTo } from '../../app/pageRouter.js';

export const RECIPIENT_EMAIL = 'mshahid3845@gmail.com';

export function initContactSection() {
    const attachBtn = document.getElementById('contactAttachCalcBtn');
    const form = document.getElementById('discrepancyContactForm');
    const copyReportBtn = document.getElementById('contactCopyReportBtn');
    const openEmailBtn = document.getElementById('contactEmailBtn');
    const reportCalcBtn = document.getElementById('reportCalculationBtn');
    const quickEmailCalcBtn = document.getElementById('quickEmailCalcBtn');

    // 1. "Report Issue" button in calculator results -> navigate to contact page
    if (reportCalcBtn) {
        reportCalcBtn.addEventListener('click', () => {
            navigateTo('contact');
            attachCurrentCalculatorData();
            const detailsField = document.getElementById('contactDetails');
            if (detailsField) {
                detailsField.focus();
            }
        });
    }

    // 2. Quick "Send via Gmail" button in calculator results
    if (quickEmailCalcBtn) {
        quickEmailCalcBtn.addEventListener('click', () => {
            const heirs = readHeirsInput();
            const madhhab = readSelectedMadhhab();
            const estateVal = document.getElementById('estateValue')?.value || '0';
            const currency = document.getElementById('currencySelect')?.value || '$';

            const activeHeirs = Object.entries(heirs)
                .filter(([_, count]) => count > 0)
                .map(([heir, count]) => `${heir}: ${count}`)
                .join(', ');

            const subject = `[Fara'id Discrepancy] - Calculation Review (${madhhab.toUpperCase()})`;
            const body = `=== ISLAMIC INHERITANCE PLATFORM - CALCULATION DISCREPANCY ===
Recipient: ${RECIPIENT_EMAIL}
Category: Calculation Review
Relevant Madhhab: ${madhhab.toUpperCase()}
Estate Value: ${currency}${estateVal}
Heirs Input: ${activeHeirs || 'None selected'}

Discrepancy / Question:
[Please explain what share or calculation you observed to be incorrect, and your expected distribution or scholarly citation]

Timestamp: ${new Date().toISOString()}
==============================================================`;

            copyTextToClipboard(body, () => {
                triggerGmailCompose(subject, body);
            });
        });
    }

    // 3. "Attach Current Calculator Data" button
    if (attachBtn) {
        attachBtn.addEventListener('click', (e) => {
            e.preventDefault();
            attachCurrentCalculatorData();
        });
    }

    // 4. Form submission ("Submit Report / Feedback")
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            handleFormSubmit();
        });
    }

    // 5. Copy report to clipboard
    if (copyReportBtn) {
        copyReportBtn.addEventListener('click', () => {
            copyReportToClipboard();
        });
    }

    // 6. "Send via Email" button
    if (openEmailBtn) {
        openEmailBtn.addEventListener('click', () => {
            handleEmailButtonClick();
        });
    }
}

/**
 * Escapes HTML characters for safe innerHTML injection.
 */
function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/**
 * Gathers current calculator inputs, estate value, and selected madhhab,
 * and formats them into the contact case summary field.
 */
function attachCurrentCalculatorData() {
    const heirs = readHeirsInput();
    const madhhab = readSelectedMadhhab();
    const estateVal = document.getElementById('estateValue')?.value || '0';
    const currency = document.getElementById('currencySelect')?.value || '$';

    const activeHeirs = Object.entries(heirs)
        .filter(([_, count]) => count > 0)
        .map(([heir, count]) => `${heir}: ${count}`)
        .join(', ');

    const summaryText = `[Calculation Snapshot]
Madhhab: ${madhhab.toUpperCase()}
Estate Value: ${currency}${estateVal}
Heirs: ${activeHeirs || 'None selected'}`;

    const caseField = document.getElementById('contactHeirsSummary');
    if (caseField) {
        caseField.value = summaryText;
    }

    const madhhabSelect = document.getElementById('contactMadhhabSelect');
    if (madhhabSelect && madhhab) {
        madhhabSelect.value = madhhab;
    }

    const statusEl = document.getElementById('contactFormStatus');
    if (statusEl) {
        statusEl.className = 'status-msg status-info';
        statusEl.textContent = '✓ Current calculator data attached successfully.';
        statusEl.classList.remove('hidden');
        setTimeout(() => statusEl.classList.add('hidden'), 4000);
    }
}

/**
 * Builds a plain-text report from the form fields.
 */
function compileReportText() {
    const name = document.getElementById('contactName')?.value.trim() || 'Anonymous User';
    const email = document.getElementById('contactEmail')?.value.trim() || 'Not provided';
    const issueType = document.getElementById('contactIssueType')?.value || 'Calculation Discrepancy';
    const madhhab = document.getElementById('contactMadhhabSelect')?.value || 'shafii';
    const caseData = document.getElementById('contactHeirsSummary')?.value.trim() || 'No calculator snapshot attached';
    const details = document.getElementById('contactDetails')?.value.trim() || 'No detailed description provided.';

    return `=== ISLAMIC INHERITANCE PLATFORM - DISCREPANCY REPORT ===
Recipient: ${RECIPIENT_EMAIL}
Reported By: ${name} (${email})
Issue Category: ${issueType}
Relevant Madhhab: ${madhhab.toUpperCase()}

Case Data:
${caseData}

Detailed Explanation & Scholarly Citations:
${details}

Timestamp: ${new Date().toISOString()}
==========================================================`;
}

/**
 * Helper to safely copy text to the clipboard.
 */
function copyTextToClipboard(text, onSuccess) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
            .then(() => {
                if (onSuccess) onSuccess();
            })
            .catch(() => {
                fallbackCopy(text);
                if (onSuccess) onSuccess();
            });
    } else {
        fallbackCopy(text);
        if (onSuccess) onSuccess();
    }
}

function fallbackCopy(text) {
    try {
        const tempArea = document.createElement('textarea');
        tempArea.value = text;
        tempArea.style.position = 'fixed';
        tempArea.style.left = '-9999px';
        document.body.appendChild(tempArea);
        tempArea.select();
        document.execCommand('copy');
        document.body.removeChild(tempArea);
    } catch (e) {
        console.warn('Clipboard copy fallback failed:', e);
    }
}

/**
 * Copies the compiled report to the user's clipboard and displays confirmation.
 */
function copyReportToClipboard() {
    const report = compileReportText();
    copyTextToClipboard(report, () => {
        const statusEl = document.getElementById('contactFormStatus');
        if (statusEl) {
            statusEl.className = 'status-msg status-success';
            statusEl.textContent = '📋 Discrepancy report copied to clipboard! You can paste it anywhere.';
            statusEl.classList.remove('hidden');
        }
    });
}

/**
 * Triggers automatic opening of Gmail compose pre-addressed to mshahid3845@gmail.com,
 * with full subject and report body. Also returns URLs for backup action buttons.
 */
export function triggerGmailCompose(subject, body) {
    const encodedTo = encodeURIComponent(RECIPIENT_EMAIL);
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedTo}&su=${encodedSubject}&body=${encodedBody}`;
    const mailtoUrl = `mailto:${RECIPIENT_EMAIL}?subject=${encodedSubject}&body=${encodedBody}`;

    // Automatically navigate / open Gmail tab
    try {
        const link = document.createElement('a');
        link.href = gmailUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
            if (link.parentNode) link.parentNode.removeChild(link);
        }, 300);
    } catch (err) {
        console.warn('Automatic link click deferred:', err);
    }

    return { gmailUrl, mailtoUrl };
}

/**
 * Displays rich confirmation status with direct links to Gmail and mailto fallback.
 */
function renderSuccessStatus(gmailUrl, mailtoUrl) {
    const statusEl = document.getElementById('contactFormStatus');
    if (!statusEl) return;

    statusEl.className = 'status-msg status-success';
    statusEl.innerHTML = `
        <div style="display:flex;flex-direction:column;gap:0.4rem;">
            <div style="font-weight:700;font-size:0.95rem;">
                ✓ ${escapeHtml(t('contact_success_msg', 'Opening Gmail to send report directly to mshahid3845@gmail.com (Report also copied to clipboard)'))}
            </div>
            <div style="font-size:0.85rem;color:var(--text-secondary);">
                Destination: <strong style="color:var(--text-primary);user-select:all;">${RECIPIENT_EMAIL}</strong>
            </div>
            <div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-top:0.35rem;">
                <a href="${gmailUrl}" target="_blank" rel="noopener noreferrer" class="primary-btn" style="text-decoration:none;padding:0.4rem 0.85rem;font-size:0.83rem;background:#ea4335;border-color:#ea4335;color:#ffffff;display:inline-flex;align-items:center;gap:0.35rem;">
                    <span>📧</span> Open in Gmail Web
                </a>
                <a href="${mailtoUrl}" class="secondary-btn" style="text-decoration:none;padding:0.4rem 0.85rem;font-size:0.83rem;display:inline-flex;align-items:center;gap:0.35rem;">
                    <span>✉️</span> Open in Mail App (mailto)
                </a>
            </div>
        </div>
    `;
    statusEl.classList.remove('hidden');
}

/**
 * Handles "Send via Email" button press:
 * Immediately compiles the report, copies to clipboard, and goes to Gmail targeting mshahid3845@gmail.com.
 */
function handleEmailButtonClick() {
    const issueType = document.getElementById('contactIssueType')?.value || 'Calculation Discrepancy';
    const madhhab = document.getElementById('contactMadhhabSelect')?.value || 'shafii';
    const subject = `[Fara'id Discrepancy Report] - ${issueType} (${madhhab.toUpperCase()})`;
    const reportText = compileReportText();

    copyTextToClipboard(reportText, () => {
        const { gmailUrl, mailtoUrl } = triggerGmailCompose(subject, reportText);
        renderSuccessStatus(gmailUrl, mailtoUrl);
    });
}

/**
 * Handles "Submit Report / Feedback" form submission:
 * Validates details, copies report to clipboard, and automatically goes to Gmail targeting mshahid3845@gmail.com.
 */
function handleFormSubmit() {
    const statusEl = document.getElementById('contactFormStatus');
    const details = document.getElementById('contactDetails')?.value.trim();

    if (!details) {
        if (statusEl) {
            statusEl.className = 'status-msg status-error';
            statusEl.textContent = 'Please describe the discrepancy or issue before submitting.';
            statusEl.classList.remove('hidden');
            const detailsField = document.getElementById('contactDetails');
            if (detailsField) detailsField.focus();
        }
        return;
    }

    const issueType = document.getElementById('contactIssueType')?.value || 'Calculation Discrepancy';
    const madhhab = document.getElementById('contactMadhhabSelect')?.value || 'shafii';
    const subject = `[Fara'id Discrepancy Report] - ${issueType} (${madhhab.toUpperCase()})`;
    const reportText = compileReportText();

    copyTextToClipboard(reportText, () => {
        const { gmailUrl, mailtoUrl } = triggerGmailCompose(subject, reportText);
        renderSuccessStatus(gmailUrl, mailtoUrl);
    });
}
