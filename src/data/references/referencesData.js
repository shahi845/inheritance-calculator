/**
 * referencesData.js — Repository of Quran, Hadith, Classical Books, and Scholar Notes.
 */

export const REFERENCES_DATA = [
    {
        id: 'quran-4-11',
        title: "Sūrah An-Nisāʾ 4:11 (Children & Parents Shares)",
        category: 'quran',
        arabic: "يُوصِيكُمُ اللَّهُ فِي أَوْلَادِكُمْ ۖ لِلذَّكَرِ مِثْلُ حَظِّ الْأُنثَيَيْنِ ۚ فَإِن كُنَّ نِسَاءً فَوْقَ اثْنَتَيْنِ فَلَهُنَّ ثُلُثَا مَا تَرَكَ ۖ وَإِن كَانَتْ وَاحِدَةً فَلَهَا النِّصْفُ ۚ وَلِأَبَوَيْهِ لِكُلِّ وَاحِدٍ مِّنْهُمَا السُّدُسُ مِمَّا تَرَكَ إِن كَانَ لَهُ وَلَدٌ ۚ فَإِن لَّمْ يَكُن لَّهُ وَلَدٌ وَوَرِثَهُ أَبَوَاهُ فَلِأُمِّهِ الثُّلُثُ ۚ فَإِن كَانَ لَهُ إِخْوَةٌ فَلِأُمِّهِ السُّدُسُ",
        translation: "Allah instructs you concerning your children: for the male, what is equal to the share of two females. But if there are daughters, two or more, for them is two-thirds of the estate. And if there is only one, for her is half. And for one's parents, to each one of them is a sixth of his estate if he left children. But if he had no children and the parents alone inherit, then for his mother is one-third. But if he had siblings, for his mother is a sixth...",
        commentary: "The foundational verse of Farāʾiḍ establishing the 2:1 ratio for children, the 2/3 share for multiple daughters, the 1/2 for a single daughter, and parent shares."
    },
    {
        id: 'quran-4-12',
        title: "Sūrah An-Nisāʾ 4:12 (Spouses & Uterine Siblings Shares)",
        category: 'quran',
        arabic: "وَلَكُمْ نِصْفُ مَا تَرَكَ أَزْوَاجُكُمْ إِن لَّمْ يَكُن لَّهُنَّ وَلَدٌ ۚ فَإِن كَانَ لَهُنَّ وَلَدٌ فَلَكُمُ الرُّبُعُ مِمَّا تَرَكْنَ... وَلَهُنَّ الرُّبُعُ مِمَّا تَرَكْتُمْ إِن لَّمْ يَكُن لَّكُمْ وَلَدٌ ۚ فَإِن كَانَ لَكُمْ وَلَدٌ فَلَهُنَّ الثُُّمُنُ مِمَّا تَرَكْتُم",
        translation: "And for you is half of what your wives leave if they have no child. But if they have a child, for you is one-fourth... And for the wives is one-fourth if you leave no child. But if you leave a child, then for them is an eighth...",
        commentary: "Establishes spousal fixed shares: Husband (1/2 or 1/4) and Wife/Wives (1/4 or 1/8), as well as uterine sibling shares (1/6 single, 1/3 multiple)."
    },
    {
        id: 'quran-4-176',
        title: "Sūrah An-Nisāʾ 4:176 (Kalālah & Sisters Shares)",
        category: 'quran',
        arabic: "يَسْتَفْتُونَكَ قُلِ اللَّهُ يُفْتِيكُمْ فِي الْكَلَالَةِ ۚ إِنِ امْرُؤٌ هَلَكَ لَيْسَ لَهُ وَلَدٌ وَلَهُ أُخْتٌ فَلَهَا نِصْفُ مَا تَرَكَ",
        translation: "They request from you a ruling. Say, 'Allah gives you a ruling concerning Kalālah (one leaving neither parent nor child): if a man dies leaving no child but has a sister, she has half of what he should leave...'",
        commentary: "Specifies shares for full and paternal sisters in Kalālah scenarios (1/2 for single sister, 2/3 for multiple sisters)."
    },
    {
        id: 'hadith-bukhari-asabah',
        title: "Hadith of Ibn ʿAbbās (Residuary Priority)",
        category: 'hadith',
        source: "Ṣaḥīḥ al-Bukhārī #6735, Ṣaḥīḥ Muslim #1615",
        arabic: "أَلْحِقُوا الْفَرَائِضَ بِأَهْلِهَا فَمَا بَقِيَ فَهُوَ لِلأَوْلَى رَجُلٍ ذَكَرٍ",
        translation: "The Prophet (ﷺ) said: 'Give the fixed shares (Farāʾiḍ) to those who are entitled to them. Whatever remains should be given to the closest male relative.'",
        commentary: "The primary legal foundation for the entire ʿAṣabah (residuary) distribution system."
    },
    {
        id: 'hadith-granddaughter',
        title: "Hadith of Ibn Masʿūd (Son's Daughter Share)",
        category: 'hadith',
        source: "Ṣaḥīḥ al-Bukhārī #6736",
        arabic: "قَضَى النَّبِيُّ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ لِلِابْنَةِ النِّصْفَ وَلِلابْنَةِ الابْنِ السُّدُسَ تَكْمِلَةَ الثُّلُثَيْنِ",
        translation: "Abdullah ibn Masʿūd said: 'The Prophet (ﷺ) judged for the daughter half, and for the son\'s daughter a sixth—completing the two-thirds—and whatever remains goes to the sister.'",
        commentary: "Establishes the rule of 'completing 2/3' for granddaughter alongside daughter, and sisters as ʿAṣabah maʿ al-ghayr."
    },
    {
        id: 'book-minhaj',
        title: "Minhāj al-Ṭālibīn — Imām al-Nawawī (d. 676 AH)",
        category: 'classical',
        school: "Shāfiʿī",
        description: "The primary reference text of the Shāfiʿī school. The Bāb al-Farāʾiḍ section covers blocking, ʿAwl, and grandfather sharing rules in detail.",
        significance: "Standard curriculum text across traditional Shāfiʿī academies worldwide."
    },
    {
        id: 'book-sirajiyyah',
        title: "Al-Sirājiyyah fī al-Mīrāth — Sirāj al-Dīn al-Sajāwandī (d. 600 AH)",
        category: 'classical',
        school: "Ḥanafī",
        description: "The quintessential Ḥanafī inheritance treatise detailing Dhawū al-Arḥām categories and Radd redistribution rules.",
        significance: "Widely studied and commented upon across Ḥanafī institutions."
    },
    {
        id: 'book-mukhtasar-khalil',
        title: "Mukhtaṣar Khalīl — Sheikh Khalīl ibn Isḥāq (d. 776 AH)",
        category: 'classical',
        school: "Mālikī",
        description: "The authoritative summary of Mālikī Fiqh detailing Mushtarikah, Bayt al-Māl surplus, and disqualification (Mawāniʿ) rules.",
        significance: "The definitive reference in North & West African Mālikī jurisprudence."
    },
    {
        id: 'book-mughni',
        title: "Al-Mughnī — Ibn Qudāmah al-Maqdisī (d. 620 AH)",
        category: 'classical',
        school: "Ḥanbalī",
        description: "Comprehensive encyclopedic comparative Fiqh manual presenting Ḥanbalī arguments alongside comparative views of all schools.",
        significance: "Unequalled in its depth of comparative jurisprudence."
    }
];
