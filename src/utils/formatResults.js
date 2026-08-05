export function formatResults(shares, estateValue) {
    // Sort: inheriting first (by fraction desc), then blocked
    shares.sort((a, b) => {
        const valA = a.adjustedShare ? (a.adjustedShare.num / a.adjustedShare.den) : 0;
        const valB = b.adjustedShare ? (b.adjustedShare.num / b.adjustedShare.den) : 0;
        if (valB !== valA) return valB - valA;
        // Blocked heirs go last
        const aBlocked = a.status === 'Blocked' ? 1 : 0;
        const bBlocked = b.status === 'Blocked' ? 1 : 0;
        return aBlocked - bBlocked;
    });

    return shares.map(share => {
        let totalFraction = 0;
        let fracText = '-';

        if (share.adjustedShare && share.adjustedShare.num > 0) {
            totalFraction = share.adjustedShare.num / share.adjustedShare.den;
            const pctStr = (totalFraction * 100).toFixed(2) + '%';
            if (share.adjustedShare.num === share.adjustedShare.den) {
                fracText = `1 (${pctStr})`;
            } else {
                fracText = `${share.adjustedShare.num}/${share.adjustedShare.den} (${pctStr})${share.count > 1 ? ' (Total)' : ''}`.trim();
            }
        }

        const perPersonFraction = share.count > 0 ? (totalFraction / share.count) : 0;
        const pctPerPerson = perPersonFraction * 100;
        const amountPerPerson = estateValue > 0 ? (estateValue * perPersonFraction).toFixed(2) : '-';
        const totalAmount = estateValue > 0 ? (estateValue * totalFraction).toFixed(2) : '-';

        return {
            ...share,
            totalFraction,
            pctPerPerson,
            amountPerPerson,
            totalAmount,
            fracText
        };
    });
}

export function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1).replace(/([A-Z])/g, ' $1').trim();
}

/**
 * Canonical display names for all heir keys.
 * Uses the new canonical key names but also retains legacy keys as fallbacks.
 */
const heirNames = {
    // Spouses
    husband: "Husband",
    wife: "Wife",

    // Parents
    father: "Father",
    mother: "Mother",

    // Grandparents
    paternalGrandfather: "Paternal Grandfather",
    paternalGrandmother: "Paternal Grandmother",
    maternalGrandmother: "Maternal Grandmother",
    grandmothers: "Grandmother(s)",

    // Descendants
    son: "Son",
    daughter: "Daughter",
    sonsSon: "Grandson (Son's Son)",
    sonsDaughter: "Son's Daughter",
    sonsSonsSon: "Son's Son's Son",
    sonsSonsDaughter: "Son's Son's Daughter",

    // Full Siblings
    fullBrother: "Full Brother",
    fullSister: "Full Sister",

    // Paternal Siblings
    paternalBrother: "Consanguine (Paternal) Brother",
    paternalSister: "Consanguine (Paternal) Sister",

    // Maternal Siblings
    maternalBrother: "Uterine (Maternal) Brother",
    maternalSister: "Uterine (Maternal) Sister",

    // Nephews
    fullBrothersSon: "Son of Full Brother",
    paternalBrothersSon: "Son of Consanguine Brother",
    fullBrothersSonsSon: "Son of Full Brother's Son",
    paternalBrothersSonsSon: "Son of Consanguine Brother's Son",

    // Uncles
    fullPaternalUncle: "Full Paternal Uncle",
    paternalUncle: "Consanguine Paternal Uncle",

    // Cousins
    fullPaternalUnclesSon: "Son of Full Paternal Uncle",
    paternalUnclesSon: "Son of Consanguine Paternal Uncle",
    fullPaternalUnclesSonsSon: "Son of Full Uncle's Son",
    paternalUnclesSonsSon: "Son of Consanguine Uncle's Son",

    // Walāʾ
    maleEmancipator: "Male Patron (Mu'tiq)",
    femaleEmancipator: "Female Patron (Mu'tiqah)",
    walaRelative: "Male Relative through Walāʾ",

    // Distant Kindred (Dhawu al-Arḥām)
    daughtersSon: "Daughter's Son",
    daughtersDaughter: "Daughter's Daughter",
    maternalGrandfather: "Maternal Grandfather",
    sistersSon: "Sister's Son",
    sistersDaughter: "Sister's Daughter",
    maternalUncle: "Maternal Uncle",
    maternalAunt: "Maternal Aunt",
    paternalAunt: "Paternal Aunt",
    uterineSiblingChildren: "Children of Uterine Siblings",
    otherDistantRelatives: "Other Distant Blood Relatives",

    // Special
    baytAlMal: "Bayt al-Māl (Public Treasury)",

    // Legacy key aliases (for backward compatibility with old test files)
    grandfather: "Paternal Grandfather",
    grandson: "Grandson (Son's Son)",
    granddaughter: "Son's Daughter",
    brother: "Full Brother",
    sister: "Full Sister",
    sonOfFullBrother: "Son of Full Brother",
    sonOfPaternalBrother: "Son of Consanguine Brother",
    uncle: "Full Paternal Uncle",
    consanguinePaternalUncle: "Consanguine Paternal Uncle",
    paternalUncleSon: "Son of Full Paternal Uncle",
    consanguinePaternalUncleSon: "Son of Consanguine Paternal Uncle",
    mutiq: "Male Patron (Mu'tiq)",
    mutiqah: "Female Patron (Mu'tiqah)",
    daughterSon: "Daughter's Son",
    daughterDaughter: "Daughter's Daughter",
    sisterSon: "Sister's Son",
    sisterDaughter: "Sister's Daughter",
};

export function getHeirDisplayName(key) {
    return heirNames[key] || capitalize(key);
}
