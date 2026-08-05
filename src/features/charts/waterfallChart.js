/**
 * waterfallChart.js — Estate deduction waterfall timeline renderer.
 */

/**
 * Renders the estate waterfall steps into #estateWaterfallSteps.
 *
 * @param {Object|null} detailed      - Detailed breakdown object (or null)
 * @param {string}      currency      - Currency symbol e.g. '$'
 * @param {number}      rawEstateValue - Direct estate value when no breakdown is used
 */
export function renderWaterfall(detailed, currency, rawEstateValue) {
    const container = document.getElementById('estateWaterfallSteps');
    if (!container) return;

    if (!detailed || (detailed.totalAssets === 0 && detailed.totalLiabilities === 0)) {
        container.innerHTML = `
            <div class="waterfall-step active">
                <div class="step-title">Gross Distributable</div>
                <div class="step-value">${currency}${rawEstateValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                <div class="step-desc">Direct estate distribution</div>
            </div>
        `;
        return;
    }

    const fmt = val => {
        const abs = Math.abs(val).toLocaleString(undefined, { minimumFractionDigits: 2 });
        return val === 0 ? `${currency}0.00` : `${val < 0 ? '-' : ''}${currency}${abs}`;
    };

    const steps = [
        { title: "Gross Assets",   value: detailed.totalAssets,    desc: "Liquid & fixed properties" },
        { title: "Tajhīz",         value: -detailed.funeral,       desc: "Funeral / Burial costs" },
        { title: "Diyūn (Debts)",  value: -detailed.debts,         desc: "Religious & human debts" },
        { title: "Wasiyyah",       value: -detailed.allowedWill,   desc: "Non-heir bequest (max 1/3)" },
        { title: "Net Estate",     value: detailed.netEstate,      desc: "Distributed to heirs", active: true },
    ];

    container.innerHTML = steps.map(step => `
        <div class="waterfall-step ${step.active ? 'active' : ''}">
            <div class="step-title">${step.title}</div>
            <div class="step-value">${fmt(step.value)}</div>
            <div class="step-desc">${step.desc}</div>
        </div>
    `).join('');
}
