/**
 * blocking.js — Learning topic: Blocking (Ḥajb).
 */

export const blockingTopic = {
    id: 'blocking',
    title: 'Blocking (Ḥajb)',
    category: 'core',
    icon: '🚫',
    summary: 'Rules by which closer relatives partially or totally exclude more distant relatives.',
    definition: 'Ḥajb (Exclusion) is the rule where a closer relative prevents a more distant relative from inheriting partially (Ḥajb Nuqṣān) or totally (Ḥajb Ḥirmān).',
    purpose: 'To maintain logical family proximity — preventing distant relatives from competing with immediate family.',
    explanation: 'There are 6 heirs who are NEVER totally blocked: Father, Mother, Son, Daughter, Husband, Wife. All other relatives can be excluded by closer kin.',
    rules: [
        'Son blocks: Grandsons, Brothers, Sisters, Nephews, Uncles, Cousins.',
        'Father blocks: Grandfather, Grandmothers (paternal), Brothers, Sisters.',
        'Mother blocks: All Grandmothers (maternal and paternal).'
    ],
    examples: 'If a deceased leaves a Son and a Full Brother, the Son inherits 100% and the Brother is totally blocked.',
    evidence: 'Scholarly Consensus (Ijmāʿ)',
    calculatorCase: 'shafii-014',
    relatedTopics: ['fixed-shares', 'residuary', 'grandfather']
};
