/**
 * grandfather.js — Learning topic: Grandfather with Siblings.
 */

export const grandfatherTopic = {
    id: 'grandfather',
    title: 'Grandfather with Siblings',
    category: 'advanced',
    icon: '👴',
    summary: 'Complex rules governing whether a paternal grandfather blocks or shares with siblings.',
    definition: 'A classical chapter of Farāʾiḍ debating how the paternal grandfather inherits alongside full/paternal brothers and sisters in the absence of the father.',
    purpose: 'To balance the ascendants\' right (grandfather) with collaterals\' right (siblings).',
    explanation: 'Ḥanafī Madhhab: Grandfather acts like Father and totally blocks all siblings. Jumhūr (Shāfiʿī, Mālikī, Ḥanbalī): Grandfather shares with siblings via Muqāsamah or fixed shares, whichever is most favorable.',
    rules: [
        'Ḥanafī: Grandfather blocks all brothers and sisters.',
        'Shāfiʿī / Mālikī / Ḥanbalī: Grandfather takes best of: (1) Muqāsamah, (2) 1/3 of estate/remainder, or (3) 1/6 fixed share.'
    ],
    examples: 'Grandfather + 1 Full Brother: Under Shāfiʿī → 1/2 each (Muqāsamah). Under Ḥanafī → Grandfather 100%, Brother 0.',
    evidence: 'Opinions of Zayd ibn Thābit, ʿAlī, and Ibn ʿAbbās',
    calculatorCase: 'shafii-016',
    relatedTopics: ['blocking', 'madhhab-differences', 'hanafi-cases']
};
