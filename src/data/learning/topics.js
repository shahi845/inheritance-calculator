/**
 * topics.js — Educational concepts data repository for Islamic Inheritance (Farāʾiḍ).
 */

export const LEARNING_TOPICS = [
    {
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
    },
    {
        id: 'residuary',
        title: 'Residuary Heirs (ʿAṣabah)',
        category: 'core',
        icon: '🛡️',
        summary: 'Male-line relatives who inherit whatever estate remains after fixed shares are distributed.',
        definition: 'ʿAṣabah are male-line relatives (or female relatives inheriting alongside males) who take the entire remaining estate after fixed sharers receive their portions.',
        purpose: 'To distribute surplus wealth to the closest male-line relatives of the deceased.',
        explanation: 'If no fixed sharers exist, the closest ʿAṣabah takes 100% of the estate. If fixed shares leave a remainder, the ʿAṣabah takes the remainder. If fixed shares equal 100%, the ʿAṣabah receives 0.',
        rules: [
            'The Prophet ﷺ said: "Give the fixed shares to those entitled. Whatever remains goes to the closest male relative."',
            'Order of priority: Sons → Grandsons → Father → Grandfather → Full Brothers → Paternal Brothers → Nephews → Uncles → Cousins.',
            'When male and female siblings inherit as ʿAṣabah, males take double the share of females (2:1 ratio).'
        ],
        examples: 'Son and daughter inherit together: Son takes 2/3 of remainder, Daughter takes 1/3.',
        evidence: 'Ṣaḥīḥ al-Bukhārī #6735; Surah An-Nisāʾ 4:11',
        calculatorCase: 'shafii-006',
        relatedTopics: ['fixed-shares', 'blocking', 'children']
    },
    {
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
    },
    {
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
    },
    {
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
    },
    {
        id: 'grandfather',
        title: 'Grandfather with Siblings',
        category: 'advanced',
        icon: '👴',
        summary: 'Complex rules governing whether a paternal grandfather blocks or shares with siblings.',
        definition: 'A classical chapter of Farāʾiḍ debating how the paternal grandfather inherits alongside full/paternal brothers and sisters in the absence of the father.',
        purpose: 'To balance the ascendants\' right (grandfather) with collaterals\' right (siblings).',
        explanation: 'Ḥanafī Madhhab: Grandfather acts like Father and totally blocks all siblings. Jumhūr (Shāfiʿī, Mālikī, Ḥanbalī): Grandfather shares with siblings via Muqāsamah (sharing equally as a brother) or fixed shares (1/3 or 1/6), whichever is most favorable.',
        rules: [
            'Ḥanafī: Grandfather blocks all brothers and sisters.',
            'Shāfiʿī / Mālikī / Ḥanbalī: Grandfather takes the best of: (1) Muqāsamah, (2) 1/3 of estate/remainder, or (3) 1/6 fixed share.'
        ],
        examples: 'Grandfather + 1 Full Brother: Under Shāfiʿī → 1/2 each (Muqāsamah). Under Ḥanafī → Grandfather 100%, Brother 0.',
        evidence: 'Opinions of Zayd ibn Thābit, ʿAlī, and Ibn ʿAbbās',
        calculatorCase: 'shafii-016',
        relatedTopics: ['blocking', 'madhhab-differences', 'hanafi-cases']
    },
    {
        id: 'grandmother',
        title: 'Grandmothers (Jaddāt)',
        category: 'heirs',
        icon: '👵',
        summary: 'Inheritance rights of maternal and paternal grandmothers.',
        definition: 'Grandmothers (maternal and paternal) inherit a collective fixed share of 1/6 when eligible.',
        purpose: 'To honor maternal and paternal ancestral ties.',
        explanation: 'A maternal grandmother is blocked by the Mother. A paternal grandmother is blocked by both the Mother and Father.',
        rules: [
            'Grandmothers collectively share 1/6 (if both are alive and eligible, each takes 1/12).',
            'Mother blocks ALL grandmothers.',
            'Father blocks paternal grandmother but NOT maternal grandmother.'
        ],
        examples: 'Maternal Grandmother + Paternal Grandmother + Son: Grandmothers share 1/6 (1/12 each), Son takes 5/6.',
        evidence: 'Hadith of Caliph Abū Bakr and Prophet ﷺ',
        calculatorCase: 'hanafi-014',
        relatedTopics: ['fixed-shares', 'blocking', 'parents']
    },
    {
        id: 'sisters',
        title: 'Sisters (Full, Paternal, Maternal)',
        category: 'heirs',
        icon: '👩',
        summary: 'Different rules applying to full sisters, paternal sisters, and maternal (uterine) sisters.',
        definition: 'Sisters can inherit as fixed sharers, as residuaries with brothers (ʿAṣabah bil-Ghayr), or as residuaries with daughters (ʿAṣabah maʿ al-Ghayr).',
        purpose: 'Ensures comprehensive sibling inheritance rules based on maternal vs paternal ties.',
        explanation: '1 Full Sister = 1/2. 2+ Full Sisters = 2/3. With Full Brother = 2:1 ratio as ʿAṣabah. With Daughters = ʿAṣabah maʿ al-Ghayr (takes remainder).',
        rules: [
            'Maternal siblings share 1/6 (single) or 1/3 (multiple) equally regardless of gender.',
            'Paternal sisters receive 1/6 to complete 2/3 when 1 full sister is present.',
            'Daughters turn full sisters into residuaries (ʿAṣabah maʿ al-Ghayr).'
        ],
        examples: 'Daughter (1/2) + Full Sister: Sister takes 1/2 as ʿAṣabah maʿ al-Ghayr.',
        evidence: 'Surah An-Nisāʾ 4:176',
        calculatorCase: 'shafii-015',
        relatedTopics: ['fixed-shares', 'children', 'asabah']
    },
    {
        id: 'children',
        title: 'Children & Descendants',
        category: 'heirs',
        icon: '👶',
        summary: 'Inheritance rights of sons, daughters, grandsons, and granddaughters.',
        definition: 'Children are primary descendants. Sons are primary residuaries who block lower male descendants. Daughters are primary sharers.',
        purpose: 'To ensure children—the primary continuation of the family—receive major inheritance.',
        explanation: 'Sons always inherit as ʿAṣabah and are never blocked. Single Daughter takes 1/2; 2+ Daughters take 2/3. Sons convert daughters into 2:1 residuaries.',
        rules: [
            'Son blocks grandsons and granddaughters.',
            'Son\'s daughter takes 1/6 with 1 daughter to complete 2/3.',
            'If 2+ daughters exist, son\'s daughters are blocked unless a male descendant of equal/lower degree makes them ʿAṣabah.'
        ],
        examples: '1 Daughter + 1 Son\'s Daughter: Daughter 1/2, Son\'s Daughter 1/6.',
        evidence: 'Surah An-Nisāʾ 4:11; Hadith of Ibn Masʿūd',
        calculatorCase: 'shafii-019',
        relatedTopics: ['fixed-shares', 'residuary', 'blocking']
    },
    {
        id: 'parents',
        title: 'Parents & Ascendants',
        category: 'heirs',
        icon: '👨‍👩‍👧',
        summary: 'Roles of Father and Mother in estate distribution.',
        definition: 'Parents are primary ascendants who are never totally blocked from inheritance.',
        purpose: 'To guarantee financial care and honor for parents from their children\'s wealth.',
        explanation: 'Mother takes 1/3 (no children/siblings) or 1/6 (with children or 2+ siblings). Father takes 1/6 with sons, 1/6 + residue with daughters, or pure residue with no children.',
        rules: [
            'Father acts as both Sharer (1/6) and Residuary when only female descendants exist.',
            'Gharāwiyyatayn exception: Mother takes 1/3 of remainder when spouse and parents exist.',
            '2 or more siblings (even if blocked) reduce mother\'s share from 1/3 to 1/6.'
        ],
        examples: 'Father + Mother + Son: Father 1/6, Mother 1/6, Son 2/3.',
        evidence: 'Surah An-Nisāʾ 4:11',
        calculatorCase: 'shafii-001',
        relatedTopics: ['fixed-shares', 'grandfather', 'blocking']
    },
    {
        id: 'spouses',
        title: 'Spouses (Husband & Wives)',
        category: 'heirs',
        icon: '💍',
        summary: 'Fixed shares allocated to surviving husband or wives.',
        definition: 'Spouse shares are strictly fixed and depend on whether the deceased left surviving children or grandchildren.',
        purpose: 'Protects marital rights and financial security of surviving spouses.',
        explanation: 'Husband: 1/2 (no child) or 1/4 (with child). Wife/Wives: 1/4 (no child) or 1/8 (with child). Multiple wives share the single spousal portion equally.',
        rules: [
            'Spouses are never blocked by any heir.',
            'Multiple wives share 1/4 or 1/8 equally (e.g. 2 wives get 1/16 each).',
            'Spouses do not receive Radd surplus under classical consensus.'
        ],
        examples: 'Husband + 2 Wives is impossible (deceased is either male or female). Deceased male leaves 2 Wives + Son → Wives share 1/8 (1/16 each), Son takes 7/8.',
        evidence: 'Surah An-Nisāʾ 4:12',
        calculatorCase: 'shafii-020',
        relatedTopics: ['fixed-shares', 'radd', 'gharawiyyatayn']
    },
    {
        id: 'dhawu-al-arham',
        title: 'Distant Kindred (Dhawū al-Arḥām)',
        category: 'advanced',
        icon: '🌿',
        summary: 'Blood relatives who are neither fixed sharers nor male-line residuaries.',
        definition: 'Dhawū al-Arḥām includes relatives like daughter\'s children, sister\'s children, maternal uncles, and aunts.',
        purpose: 'Extends inheritance to distant maternal and female-line kin when no primary heirs exist.',
        explanation: 'Ḥanafī and Ḥanbalī schools allow them to inherit when no fixed sharers or ʿAṣabah exist. Shāfiʿī and Mālikī classically send estate to Bayt al-Māl.',
        rules: [
            'Inherit ONLY when no primary sharers (other than spouse) or ʿAṣabah exist.',
            'Categorized into 4 classes based on degree of relationship.',
            'Class 1 (descendants: daughter\'s children) has priority over Class 2 (ascendants: maternal grandfather).'
        ],
        examples: 'Deceased leaves only Daughter\'s Son → Inherits 100% under Ḥanafī.',
        evidence: 'Surah Al-Anfāl 8:75',
        calculatorCase: 'hanafi-007',
        relatedTopics: ['madhhab-differences', 'hanafi-cases']
    },
    {
        id: 'munasakhat',
        title: 'Sequential Deaths (Munāsakhāt)',
        category: 'advanced',
        icon: '🔗',
        summary: 'Connected inheritance cases where an heir dies before estate distribution.',
        definition: 'Munāsakhāt is the methodology for solving chained inheritance cases where one or more heirs die prior to the distribution of the initial estate.',
        purpose: 'To calculate consolidated final shares across consecutive deaths without errors or manual recalculation.',
        explanation: 'Instead of separate calculations, the second deceased\'s inherited share from the first estate is combined and distributed among their own heirs.',
        rules: [
            'Solve Death #1 estate and assign fractional shares.',
            'Determine which heir died before receiving their share.',
            'Solve Death #2 estate for that heir\'s estate.',
            'Multiply and consolidate fractions into a single final distribution.'
        ],
        examples: 'Man dies leaving Wife and Son. Before estate is split, Son dies leaving his own Grandson. Son\'s share passes to Grandson.',
        evidence: 'Consensus of Jurists (Ijmāʿ)',
        calculatorCase: 'shafii-001',
        relatedTopics: ['advanced', 'calculator']
    },
    {
        id: 'madhhab-differences',
        title: 'Madhhab Differences in Farāʾiḍ',
        category: 'comparative',
        icon: '🔀',
        summary: 'Key areas of juristic disagreement between Shāfiʿī, Ḥanafī, Mālikī, and Ḥanbalī schools.',
        definition: 'Comparative analysis of how the 4 Sunni madhhabs resolve edge cases in Islamic inheritance.',
        purpose: 'Educates students on valid juristic reasoning (ijtihād) and historical scholarly consensus vs disagreement.',
        explanation: 'Major difference areas: (1) Grandfather with Siblings, (2) Mushtarikah exception, (3) Radd to blood heirs vs Bayt al-Māl, (4) Dhawū al-Arḥām rights.',
        rules: [
            'All schools agree on core Quranic shares (1/2, 1/4, 1/8, 2/3, 1/3, 1/6).',
            'Disagreements stem from interpretation of Hadith and Companion rulings.',
            'User can switch Madhhab tabs in calculator to compare outcomes.'
        ],
        examples: 'Grandfather + Brother: Ḥanafī gives 100% to Grandfather; Shāfiʿī/Mālikī/Ḥanbalī split 50/50.',
        evidence: 'Comparative Fiqh Treatises',
        calculatorCase: 'shafii-016',
        relatedTopics: ['grandfather', 'radd', 'dhawu-al-arham']
    },
    {
        id: 'glossary',
        title: 'Farāʾiḍ Key Terminology & Glossary',
        category: 'reference',
        icon: '📖',
        summary: 'Comprehensive dictionary of classical Arabic inheritance terms.',
        definition: 'A reference glossary defining key technical terms used in Islamic inheritance law.',
        purpose: 'Provides quick terminology lookup for students and researchers.',
        explanation: 'Contains definitions for: Farāʾiḍ, Tarikah, Aṣḥāb al-Furūḍ, ʿAṣabah, Ḥajb, ʿAwl, Radd, Munāsakhāt, Dhawū al-Arḥām, Bayt al-Māl, Wasiyyah, and Mawāniʿ al-Irth.',
        rules: [
            'Tarikah: Net estate after funeral, debt, and valid bequests.',
            'Wasiyyah: Bequest to non-heirs, capped at 1/3 of net estate.',
            'Mawāniʿ al-Irth: Disqualifications (homicide, difference of religion, slavery).'
        ],
        examples: 'Farāʾiḍ (فَرَائِض) = Plural of Farīḍah, meaning "prescribed duties/shares".',
        evidence: 'Classical Arabic Dictionaries & Fiqh Manuals',
        calculatorCase: 'shafii-001',
        relatedTopics: ['fixed-shares', 'residuary', 'references']
    }
];
