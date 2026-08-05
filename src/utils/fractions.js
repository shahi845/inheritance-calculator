import { gcd } from './gcd.js';

export const fraction = (num, den) => {
    if (den === 0) throw new Error("Denominator cannot be zero.");
    return simplifyFraction({ num, den });
};

export const simplifyFraction = (f) => {
    if (f.num === 0) return { num: 0, den: 1 };
    const d = gcd(Math.abs(f.num), Math.abs(f.den));
    if (f.den < 0) {
        return { num: -f.num / d, den: -f.den / d };
    }
    return { num: f.num / d, den: f.den / d };
};

export const addFractions = (a, b) => {
    return fraction(a.num * b.den + b.num * a.den, a.den * b.den);
};

export const subtractFractions = (a, b) => {
    return fraction(a.num * b.den - b.num * a.den, a.den * b.den);
};

export const multiplyFractions = (a, b) => {
    return fraction(a.num * b.num, a.den * b.den);
};

export const divideFractions = (a, b) => {
    if (b.num === 0) throw new Error("Cannot divide by zero fraction.");
    return fraction(a.num * b.den, a.den * b.num);
};

export const compareFractions = (a, b) => {
    // > 0 if a > b, < 0 if a < b, 0 if equal
    return a.num * b.den - b.num * a.den;
};

// Returns the larger of two fractions
export const maxFraction = (a, b) => {
    return compareFractions(a, b) >= 0 ? a : b;
};

// Returns the smaller of two fractions
export const minFraction = (a, b) => {
    return compareFractions(a, b) <= 0 ? a : b;
};

export const lcm = (a, b) => {
    return (a * b) / gcd(a, b);
};

export const fractionToPercentage = (f, decimals = 2) => {
    if (f.den === 0) return "0.00%";
    return ((f.num / f.den) * 100).toFixed(decimals) + "%";
};

export const fractionToAmount = (f, estate) => {
    if (!estate || estate <= 0 || f.den === 0) return 0;
    return (f.num / f.den) * estate;
};

export const fractionToDecimal = (f) => {
    if (f.den === 0) return 0;
    return f.num / f.den;
};
