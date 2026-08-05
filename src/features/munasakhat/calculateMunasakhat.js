import { calculateInheritance } from '../../engine/calculateInheritance.js';
import { multiplyFractions, addFractions, fraction } from '../../utils/fractions.js';
import { buildHeirInput } from './buildHeirInput.js';
import { splitAggregatedShares } from './splitAggregatedShares.js';

export function calculateMunasakhat(caseData) {
  const madhhab = caseData.madhhab || 'shafii';
  
  if (!caseData.deaths || !Array.isArray(caseData.deaths) || caseData.deaths.length === 0) {
    throw new Error('Munāsakhāt requires an array of deaths.');
  }

  const timeline = [];
  const globalShares = {}; // personId -> accumulated fraction of original estate

  for (let i = 0; i < caseData.deaths.length; i++) {
    const death = caseData.deaths[i];
    
    let estateFractionToDistribute = fraction(1, 1);
    
    if (i > 0) {
      if (!death.deceasedHeirId) {
        throw new Error(`Death stage ${i + 1} must specify a deceasedHeirId.`);
      }
      
      const deceasedShare = globalShares[death.deceasedHeirId];
      if (!deceasedShare) {
        throw new Error(`Deceased heir ${death.deceasedHeirId} in stage ${i + 1} has no inherited share to distribute.`);
      }
      
      estateFractionToDistribute = deceasedShare;
      
      // Remove deceased from final beneficiaries
      delete globalShares[death.deceasedHeirId];
    }
    
    const input = buildHeirInput(death.heirs);
    const result = calculateInheritance({
      ...input,
      madhhab
    });
    
    const localPersonalShares = splitAggregatedShares(result.shares, death.heirs);
    const transferredSharesMap = {};

    for (const shareObj of localPersonalShares) {
      const transferredShare = multiplyFractions(estateFractionToDistribute, shareObj.share);
      
      globalShares[shareObj.personId] = addFractions(
        globalShares[shareObj.personId] || fraction(0, 1),
        transferredShare
      );
      
      transferredSharesMap[shareObj.personId] = transferredShare;
    }
    
    timeline.push({
      id: death.id,
      name: death.name || `Death ${i + 1}`,
      deceasedHeirId: death.deceasedHeirId || null,
      estateFractionToDistribute,
      input,
      result,
      localPersonalShares,
      transferredSharesMap
    });
  }

  // Cleanup: remove 0 fraction shares (if any)
  for (const personId in globalShares) {
    if (globalShares[personId].n === 0) {
      delete globalShares[personId];
    }
  }

  return {
    caseId: caseData.id,
    madhhab,
    timeline,
    finalShares: globalShares
  };
}
