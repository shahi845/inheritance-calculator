export function formatMunasakhatResult(calculationResult, caseData) {
  const formatted = {
    caseId: calculationResult.caseId,
    madhhab: calculationResult.madhhab,
    totalEstate: caseData.estate || 0,
    shares: [],
    timeline: []
  };

  // Format the timeline
  if (calculationResult.timeline) {
    for (const step of calculationResult.timeline) {
      const stepShares = step.localPersonalShares.map(shareObj => {
        const personName = caseData.people?.[shareObj.personId]?.name || shareObj.personId;
        const transferredShare = step.transferredSharesMap[shareObj.personId];
        return {
          personId: shareObj.personId,
          name: personName,
          localFraction: `${shareObj.share.num}/${shareObj.share.den}`,
          transferredFraction: `${transferredShare.num}/${transferredShare.den}`
        };
      });

      formatted.timeline.push({
        id: step.id,
        name: step.name,
        deceasedHeirId: step.deceasedHeirId,
        deceasedName: step.deceasedHeirId ? (caseData.people?.[step.deceasedHeirId]?.name || step.deceasedHeirId) : null,
        estateFractionToDistribute: `${step.estateFractionToDistribute.num}/${step.estateFractionToDistribute.den}`,
        shares: stepShares
      });
    }
  }

  // Format the final consolidated shares
  for (const [personId, fractionObj] of Object.entries(calculationResult.finalShares)) {
    const personName = caseData.people?.[personId]?.name || personId;
    const gender = caseData.people?.[personId]?.gender || 'unknown';
    
    const percentage = ((fractionObj.num / fractionObj.den) * 100).toFixed(2) + '%';
    const fractionStr = `${fractionObj.num}/${fractionObj.den}`;
    const amount = caseData.estate ? (caseData.estate * (fractionObj.num / fractionObj.den)) : 0;

    formatted.shares.push({
      personId,
      name: personName,
      gender,
      fraction: fractionStr,
      percentage,
      amount: amount
    });
  }

  return formatted;
}
