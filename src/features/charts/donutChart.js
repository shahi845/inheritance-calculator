/**
 * donutChart.js — SVG donut chart for heir share visualisation.
 */

const COLORS = [
    '#3b82f6', '#10b981', '#a78bfa', '#f59e0b', '#ec4899',
    '#14b8a6', '#f43f5e', '#06b6d4', '#84cc16', '#e11d48'
];

/**
 * Draws a donut chart into #sharesDonutChart and populates #chartLegend.
 * @param {Array} shares - Formatted share entries (from formatResults)
 */
export function drawDonutChart(shares) {
    const svg = document.getElementById('sharesDonutChart');
    const legend = document.getElementById('chartLegend');
    if (!svg || !legend) return;

    svg.innerHTML = '<circle cx="50" cy="50" r="40" fill="transparent" stroke="rgba(255,255,255,0.05)" stroke-width="12"></circle>';
    legend.innerHTML = '';

    const inheriting = shares.filter(s => s.totalFraction > 0);

    const centerText = document.getElementById('chartCenterText');
    if (inheriting.length === 0) {
        if (centerText) centerText.textContent = "0%";
        return;
    }
    if (centerText) centerText.textContent = "100%";

    let cumulativePercent = 0;

    inheriting.forEach((share, idx) => {
        const color = COLORS[idx % COLORS.length];
        const percent = share.totalFraction;
        const strokeDasharray = `${percent * 251.2} 251.2`;
        const strokeDashoffset = `${-cumulativePercent * 251.2}`;

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', '50');
        circle.setAttribute('cy', '50');
        circle.setAttribute('r', '40');
        circle.setAttribute('fill', 'transparent');
        circle.setAttribute('stroke', color);
        circle.setAttribute('stroke-width', '12');
        circle.setAttribute('stroke-dasharray', strokeDasharray);
        circle.setAttribute('stroke-dashoffset', strokeDashoffset);
        circle.setAttribute('transform', 'rotate(-90 50 50)');
        svg.appendChild(circle);

        cumulativePercent += percent;

        const pctText = (percent * 100).toFixed(2) + '%';
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';
        legendItem.innerHTML = `
            <div class="legend-color-label">
                <span class="legend-color" style="background-color: ${color};"></span>
                <span>${share.name}</span>
            </div>
            <span><strong>${pctText}</strong></span>
        `;
        legend.appendChild(legendItem);
    });
}
