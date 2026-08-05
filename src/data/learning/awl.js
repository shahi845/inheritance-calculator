/**
 * awl.js — Learning topic: Proportional Reduction (ʿAwl).
 */

export const awlTopic = {
    id: 'awl',
    title: 'Proportional Reduction (ʿAwl)',
    category: 'advanced',
    icon: '⚖️',
    summary: 'Method for reducing all fixed shares proportionally when total fractions exceed 100%.',
    definition: 'ʿAwl occurs when the sum of prescribed fixed shares exceeds the total estate (e.g., total = 13/12). The base denominator is expanded to match the sum of numerators.',
    purpose: 'To distribute the shortage equitably among all sharers so no single heir suffers the full deficit.',
    explanation: 'First established by Caliph ʿUmar ibn al-Khaṭṭāb when faced with a case of Husband (1/2) + 2 Full Sisters (2/3). 1/2 + 2/3 = 7/6. Denominator was increased from 6 to 7.',
    rules: [
        'Only base denominators 6, 12, and 24 can undergo ʿAwl.',
        '6 can ʿAwl to: 7, 8, 9, 10.',
        '12 can ʿAwl to: 13, 15, 17.',
        '24 can ʿAwl to: 27.'
    ],
    examples: 'Husband (1/2 = 3/6) + 2 Daughters (2/3 = 4/6) + Mother (1/6) + Father (1/6) = 9/6 → ʿAwl to 9/9.',
    evidence: 'Ruling of ʿUmar ibn al-Khaṭṭāb & Consensus',
    calculatorCase: 'shafii-009',
    relatedTopics: ['fixed-shares', 'radd']
};
