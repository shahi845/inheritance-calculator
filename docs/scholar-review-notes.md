# Scholar Review Notes

This document tracks inheritance rules used in the calculator and whether each rule has been reviewed by a qualified scholar or verified against reliable fiqh references.

---

## Review Status Meaning

- unchecked: implemented but not reviewed
- reviewed: checked and accepted
- corrected: reviewed and fixed after correction
- disputed: differs between madhhabs or requires more research

---

# 1. Radd

## Rule Name
Radd to blood heirs

## Madhhab
Shāfiʿī / Ḥanafī / Mālikī / Ḥanbalī / Jumhūr

## Condition
Radd is applied when fixed-share heirs do not consume the full estate and there is no residuary heir.

## Share
The remaining estate is returned proportionally to eligible blood fixed-share heirs.

## Important Note
Spouses generally do not receive Radd in the normal classical structure.

## Blocked Heirs
Not applicable directly. Radd is redistribution of surplus, not blocking.

## Related Test File
tests/shafii/verified/radd.test.js

## Related Test Cases
- Daughter only
- Mother only
- Wife + daughter
- Husband + daughter

## Scholar Status
unchecked

## Notes
Needs scholar review for differences between madhhabs and modern fallback policies.

---

# 2. ʿAwl

## Rule Name
ʿAwl adjustment

## Madhhab
All madhhabs where applicable

## Condition
ʿAwl is applied when fixed shares exceed the whole estate.

## Share
All fixed shares are reduced proportionally by increasing the common denominator.

## Example
Husband + mother + full sister:
- Husband: 1/2
- Mother: 1/3
- Full sister: 1/2
Total = 3/6 + 2/6 + 3/6 = 8/6
Final denominator becomes 8.

## Related Test File
tests/shafii/verified/awl.test.js

## Scholar Status
unchecked

---

# 3. Full sister as residuary with daughter

## Rule Name
Full sister becomes ʿaṣabah maʿa al-ghayr

## Madhhab
Jumhūr / Shāfiʿī / Mālikī / Ḥanbalī

## Condition
When there is a daughter or son’s daughter and no son, father, paternal grandfather, or full brother, the full sister may become residuary with the daughter.

## Share
Daughter receives her fixed share. Full sister receives the residue.

## Important Blocking Effect
The full sister in this position can block weaker male agnates such as paternal brother.

## Related Test File
tests/shafii/verified/complex.test.js

## Scholar Status
unchecked

---

# 4. Grandfather with siblings

## Rule Name
Paternal grandfather with siblings

## Madhhab
Differs between madhhabs

## Condition
When paternal grandfather and siblings exist together.

## Important Difference
Ḥanafī generally gives stronger blocking power to the paternal grandfather against siblings.
Other madhhabs may treat grandfather-with-siblings differently.

## Related Test Files
tests/hanafi/question-bank/hanafiQuestionBank.js
tests/shafii/verified/complex.test.js

## Scholar Status
unchecked

---

# 5. Mushtarikah

## Rule Name
Mushtarikah / shared case

## Madhhab
Known in non-Ḥanafī discussions with specific conditions

## Condition
Usually appears with husband, mother or grandmother, multiple maternal siblings, and full siblings.

## Share
Maternal siblings and full siblings may share the remaining third in specific cases.

## Related Test File
tests/jumhur/jumhurCases.test.js

## Scholar Status
unchecked

---

# 6. Dhawū al-Arḥām

## Rule Name
Distant kindred inheritance

## Madhhab
Differs strongly between madhhabs

## Condition
Applies when there are no fixed-share heirs or residuary heirs, depending on madhhab and policy.

## Important Note
Strict Shāfiʿī treatment may differ from Ḥanafī and modern fallback treatment.

## Related Files
src/engine/assignDistantKindred.js
src/madhahib/hanafi/dhawuAlArham.js

## Scholar Status
unchecked

---

# 7. Munāsakhāt

## Rule Name
Multiple deaths before estate division

## Condition
One heir dies before receiving his or her share from a previous estate.

## Current Project Status
Starter person-ID Munāsakhāt engine is implemented and passes 5 verified test cases. UI integration is still incomplete.

## Related Folder
tests/munasakhat/

## Scholar Status
unchecked

## Notes
Requires special handling because ordinary inheritance calculation is not enough.
