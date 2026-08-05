/**
 * radd.js — Learning topic: Surplus Redistribution (Radd).
 */

export const raddTopic = {
    id: 'radd',
    title: 'Surplus Redistribution (Radd)',
    category: 'advanced',
    icon: '↩️',
    summary: 'Return of leftover estate to fixed sharers when no residuary heir exists.',
    definition: 'Radd is the counterpart of ʿAwl. When fixed shares total less than 100% and no ʿAṣabah exists, the surplus is returned to eligible blood sharers.',
    purpose: 'To keep family wealth within eligible blood relatives rather than forfeiting unassigned shares.',
    explanation: 'Madhhab views on Radd differ: Ḥanafī, Mālikī (modern), and Ḥanbalī return surplus to blood sharers. Classical Shāfiʿī & Mālikī direct surplus to Bayt al-Māl (Public Treasury).',
    rules: [
        'Spouses (Husband/Wife) do not receive Radd under standard rulings.',
        'Radd is distributed in proportion to original fixed shares.',
        'If only one sharer exists (e.g. 1 Daughter), she receives 100% (1/2 share + 1/2 Radd).'
    ],
    examples: 'Mother (1/6) + Daughter (1/2 = 3/6) = 4/6 total. 2/6 surplus returned in 1:3 ratio → Mother 1/4, Daughter 3/4.',
    evidence: 'Hadith of the Prophet ﷺ; Fatwas of ʿAlī & Ibn Masʿūd',
    calculatorCase: 'hanafi-002',
    relatedTopics: ['fixed-shares', 'awl', 'madhhab-differences']
};
