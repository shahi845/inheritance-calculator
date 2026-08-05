/**
 * estateBreakdown.js — DOM-aware estate financial input reader.
 *
 * Reads detailed asset and liability fields from the DOM, delegates
 * the pure math to src/math/estateMath.js, and updates the live display.
 */

import { computeEstate } from '../../math/estateMath.js';

/** Reads all asset/liability fields and returns the computed breakdown. */
export function getDetailedValues() {
    const v = id => parseFloat(document.getElementById(id)?.value) || 0;

    return computeEstate({
        cash:           v('assetCash'),
        gold:           v('assetGold'),
        stocks:         v('assetStocks'),
        realEstate:     v('assetRealEstate'),
        business:       v('assetBusiness'),
        personal:       v('assetPersonal'),
        receivables:    v('assetReceivables'),
        claims:         v('assetClaims'),
        unpaidMahr:     v('assetUnpaidMahr'),
        funeral:        v('liabilityFuneral'),
        religiousDebts: v('liabilityReligiousDebts'),
        financialDebts: v('liabilityFinancialDebts'),
        wills:          v('liabilityWills'),
    });
}

/**
 * Updates the live net estate display and toggles the estate input's
 * read-only state depending on whether a detailed breakdown is active.
 *
 * @param {string} currencySymbol - e.g. '$', '£', 'RM'
 */
export function updateLiveNetEstate(currencySymbol) {
    const { netEstate, totalAssets, totalLiabilities } = getDetailedValues();
    const active = totalAssets > 0 || totalLiabilities > 0;

    const display = document.getElementById('calculatedNetEstateDisplay');
    if (display) {
        display.textContent = `${currencySymbol}${netEstate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    const estateInput = document.getElementById('estateValue');
    const estateLabel = document.getElementById('estateValueLabel');

    if (active) {
        if (estateInput) { estateInput.value = netEstate.toFixed(2); estateInput.readOnly = true; estateInput.style.opacity = '0.7'; }
        if (estateLabel) estateLabel.textContent = `Total Estate Amount (Calculated from breakdown in ${currencySymbol}):`;
    } else {
        if (estateInput) { estateInput.readOnly = false; estateInput.style.opacity = '1'; }
        if (estateLabel) estateLabel.textContent = 'Total Estate Amount (Optional):';
    }
}

/**
 * Attaches input listeners to all asset/liability fields.
 * @param {Function} getCurrency - Returns current currency symbol
 */
export function initEstateBreakdown(getCurrency) {
    const ids = [
        'assetCash', 'assetGold', 'assetStocks', 'assetRealEstate', 'assetBusiness',
        'assetPersonal', 'assetReceivables', 'assetClaims', 'assetUnpaidMahr',
        'liabilityFuneral', 'liabilityReligiousDebts', 'liabilityFinancialDebts', 'liabilityWills',
    ];
    ids.forEach(id => {
        document.getElementById(id)?.addEventListener('input', () => updateLiveNetEstate(getCurrency()));
    });
}
