/**
 * fixedShares.js — Learning topic: Fixed Shares (Aṣḥāb al-Furūḍ).
 */

export const fixedSharesTopic = {
    id: 'fixed-shares',
    title: 'Fixed Shares (Aṣḥāb al-Furūḍ)',
    category: 'core',
    icon: '⚖️',
    summary: 'Prescribed fractional shares (1/2, 1/4, 1/8, 2/3, 1/3, 1/6) directly specified in the Qurʾān.',
    definition: 'Aṣḥāb al-Furūḍ (Sharers) are relatives who have a fixed fractional share of the estate explicitly defined in the Qurʾān (Surah An-Nisāʾ 4:11–12, 4:176).',
    purpose: 'To ensure primary family members (spouses, parents, daughters, sisters) receive their guaranteed divine entitlement before residual distribution.',
    explanation: 'There are six canonical fractions in Farāʾiḍ: 1/2, 1/4, 1/8, 2/3, 1/3, and 1/6. Sharers are given absolute priority in estate distribution.',
    rules: [
        'Fixed sharers inherit before any residuary (ʿAṣabah) heir.',
        'Spouses are primary sharers whose fraction depends on whether children exist.',
        'Parents inherit a minimum 1/6 share when male descendants exist.'
    ],
    examples: 'A husband receives 1/2 if no children exist, but 1/4 if the deceased left a child.',
    evidence: 'Surah An-Nisāʾ 4:11–12',
    calculatorCase: 'shafii-001',
    relatedTopics: ['residuary', 'blocking', 'awl', 'radd']
};
