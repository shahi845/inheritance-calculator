/**
 * formatCurrency.js — Utility for consistent currency formatting
 */

/**
 * Formats a number as a currency string with two decimal places.
 * @param {number} value
 * @param {string} symbol
 */
export function formatAmount(value, symbol = '$') {
    if (isNaN(value) || value === null || value === undefined) {
        return `${symbol}0.00`;
    }
    const abs = Math.abs(value).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    return value < 0 ? `-${symbol}${abs}` : `${symbol}${abs}`;
}
