/**
 * estateMath.js — Pure estate financial calculations (no DOM).
 *
 * Used by src/features/estate/estateBreakdown.js which handles DOM I/O.
 */

/**
 * Computes asset totals, liability totals, Wasiyyah cap, and net distributable estate.
 *
 * @param {Object} inputs  - Raw numeric values for each asset/liability field
 * @returns {Object} Detailed breakdown object
 */
export function computeEstate({
    cash = 0,
    gold = 0,
    stocks = 0,
    realEstate = 0,
    business = 0,
    personal = 0,
    receivables = 0,
    claims = 0,
    unpaidMahr = 0,
    funeral = 0,
    religiousDebts = 0,
    financialDebts = 0,
    wills = 0,
} = {}) {
    const totalAssets      = cash + gold + stocks + realEstate + business + personal + receivables + claims + unpaidMahr;
    const preWillLiabilities = funeral + religiousDebts + financialDebts;
    const netBeforeWill    = Math.max(0, totalAssets - preWillLiabilities);
    const maxWillAllowed   = netBeforeWill / 3;
    const allowedWill      = Math.min(wills, maxWillAllowed);
    const netEstate        = Math.max(0, netBeforeWill - allowedWill);
    const totalLiabilities = preWillLiabilities + allowedWill;

    return {
        totalAssets,
        currentAssets:  cash + gold + stocks,
        fixedAssets:    realEstate + business + personal,
        futureAssets:   receivables + claims + unpaidMahr,
        funeral,
        debts:          religiousDebts + financialDebts,
        wills,
        allowedWill,
        netEstate,
        totalLiabilities,
        isWillCapped:   wills > maxWillAllowed,
        maxWillAllowed,
    };
}
