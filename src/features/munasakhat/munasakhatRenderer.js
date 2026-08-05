/**
 * munasakhatRenderer.js — Renders the N-Stage Munāsakhāt calculation result.
 */

import { escapeHtml } from '../../utils/escapeHtml.js';
import { formatMunasakhatResult } from './formatMunasakhatResult.js';

export function renderMunasakhatError(message) {
  const container = document.getElementById('wizardResultsContainer');
  if (!container) return;
  container.innerHTML = `
    <div class="validation-alert-item munasakhat-error" style="background:rgba(239, 68, 68, 0.1); border:1px solid var(--danger); padding:1rem; border-radius:6px; color:var(--danger);">
      ⚠️ <strong>Error:</strong> ${escapeHtml(message)}
    </div>
  `;
}

export function renderMunasakhatResult(rawResult, caseData) {
  const container = document.getElementById('wizardResultsContainer');
  if (!container) return;

  const result = formatMunasakhatResult(rawResult, caseData);

  let timelineHtml = '';
  if (result.timeline && result.timeline.length > 0) {
      timelineHtml = `
          <div class="munasakhat-timeline-view mt-md">
              <div class="timeline-steps">
                  ${result.timeline.map((step, idx) => `
                      <div class="timeline-step">
                          <div class="step-badge">${idx + 1}</div>
                          <h4>${escapeHtml(step.name)}</h4>
                          <p>
                              ${idx === 0 
                                  ? 'Primary estate distribution.' 
                                  : `Selected heir (<strong>${escapeHtml(step.deceasedName || step.deceasedHeirId)}</strong>) passes away. Their <strong>${escapeHtml(step.estateFractionToDistribute)}</strong> share is distributed.`}
                          </p>
                          <div class="table-responsive mt-sm">
                              <table class="shares-table" style="font-size:0.85rem;">
                                  <thead>
                                      <tr>
                                          <th>Heir</th>
                                          <th>Local Share</th>
                                          ${idx > 0 ? '<th>Transferred Share</th>' : ''}
                                      </tr>
                                  </thead>
                                  <tbody>
                                      ${step.shares.map(s => `
                                          <tr>
                                              <td>${escapeHtml(s.name)}</td>
                                              <td style="font-family:monospace;">${escapeHtml(s.localFraction)}</td>
                                              ${idx > 0 ? `<td style="font-family:monospace;color:var(--accent);">${escapeHtml(s.transferredFraction)}</td>` : ''}
                                          </tr>
                                      `).join('')}
                                  </tbody>
                              </table>
                          </div>
                      </div>
                      ${idx < result.timeline.length - 1 ? `<div class="timeline-arrow" style="text-align:center;color:var(--text-secondary);font-size:1.5rem;margin:0.5rem 0;">↓</div>` : ''}
                  `).join('')}
              </div>
          </div>
      `;
  }

  const finalRows = result.shares
    .map(share => `
      <tr>
        <td><strong>${escapeHtml(share.name)}</strong></td>
        <td style="font-family:monospace">${escapeHtml(share.fraction)}</td>
        <td><span class="badge badge-accent">${escapeHtml(share.percentage)}</span></td>
      </tr>
    `)
    .join('');

  container.innerHTML = `
    <div class="glass-card mt-md" style="border: 1px solid var(--accent);">
      <h3 style="color:var(--accent);margin-top:0;">✅ Calculation Successful</h3>
      
      ${timelineHtml}

      <div class="consolidated-results-table mt-lg">
          <h4 style="border-bottom:1px solid var(--glass-border);padding-bottom:0.5rem;">Consolidated Final Inheritance Net Shares</h4>
          <div class="table-responsive">
            <table class="shares-table">
              <thead><tr><th>Recipient Heir</th><th>Fractional Share</th><th>Percentage</th></tr></thead>
              <tbody>${finalRows}</tbody>
            </table>
          </div>
      </div>
    </div>
  `;
}
