import { fraction, divideFractions } from '../../utils/fractions.js';
import { legacyKeyMap } from '../../data/heirs.js';

export function splitAggregatedShares(shares = [], heirs = []) {
  const personalShares = [];

  for (const share of shares) {
    const matchingHeirs = heirs.filter(h => {
      const canonicalHeirType = legacyKeyMap[h.heirType] || h.heirType;
      const canonicalShareHeir = legacyKeyMap[share.heir] || share.heir;
      return canonicalHeirType === canonicalShareHeir;
    });

    if (matchingHeirs.length === 0) continue;

    const individualShare = divideFractions(
      share.adjustedShare,
      fraction(matchingHeirs.length, 1)
    );

    for (const heir of matchingHeirs) {
      personalShares.push({
        personId: heir.personId,
        heirType: heir.heirType,
        share: individualShare,
        originalGroupShare: share.adjustedShare,
        status: share.status,
        reason: share.reason
      });
    }
  }

  return personalShares;
}
