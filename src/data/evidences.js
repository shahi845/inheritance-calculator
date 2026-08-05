export const heirEvidences = {
    husband: {
        evidence: "Surah An-Nisā' 4:12",
        arabic: "وَلَكُمْ نِصْفُ مَا تَرَكَ أَزْوَاجُكُمْ إِن لَّمْ يَكُن لَّهُنَّ وَلَدٌ ۚ فَإِن كَانَ لَهُنَّ وَلَدٌ فَلَكُمُ الرُّبُعُ مِمَّا تَرَكْنَ",
        translation: "And for you is half of what your wives leave if they have no child. But if they have a child, for you is one-fourth of what they leave...",
        rules: [
            "Receives 1/2 if the deceased leaves no child or grandchild (from a son).",
            "Reduced to 1/4 if the deceased leaves a child or grandchild (from a son)."
        ]
    },
    wife: {
        evidence: "Surah An-Nisā' 4:12",
        arabic: "وَلَهُنَّ الرُّبُعُ مِمَّا تَرَكْتُمْ إِن لَّمْ يَكُن لَّكُمْ وَلَدٌ ۚ فَإِن كَانَ لَكُمْ وَلَدٌ فَلَهُنَّ الثُّمُنُ مِمَّا تَرَكْتُم",
        translation: "And for the wives is one-fourth if you leave no child. But if you leave a child, then for them is an eighth of what you leave...",
        rules: [
            "Receives 1/4 if the deceased leaves no child or grandchild (from a son). Shared equally if multiple wives.",
            "Reduced to 1/8 if the deceased leaves a child or grandchild (from a son). Shared equally if multiple wives."
        ]
    },
    mother: {
        evidence: "Surah An-Nisā' 4:11",
        arabic: "وَلِأَبَوَيْهِ لِكُلِّ وَاحِدٍ مِّنْهُمَا السُّدُسُ مِمَّا تَرَكَ إِن كَانَ لَهُ وَلَدٌ ۚ فَإِن لَّمْ يَكُن لَّهُ وَلَدٌ وَوَرِثَهُ أَبَوَاهُ فَلِأُمِّهِ الثُّلُثُ ۚ فَإِن كَانَ لَهُ إِخْوَةٌ فَلِأُمِّهِ السُّدُسُ",
        translation: "And for one's parents, to each one of them is a sixth of his estate if he left children. But if he had no children and the parents alone inherit, then for his mother is one-third. But if he had siblings, for his mother is a sixth...",
        rules: [
            "Receives 1/6 if the deceased leaves a child, grandchild, or multiple siblings (2 or more brothers/sisters).",
            "Receives 1/3 if there are no descendants and at most one sibling.",
            "In the 'Gharāwiyyatayn' cases (spouse + parents), she receives 1/3 of the remainder (equivalent to 1/4 of total if wife is present, 1/6 of total if husband is present) so the father takes double her share as residuary."
        ]
    },
    father: {
        evidence: "Surah An-Nisā' 4:11 & Sunnah",
        arabic: "وَلِأَبَوَيْهِ لِكُلِّ وَاحِدٍ مِّنْهُمَا السُّدُسُ مِمَّا تَرَكَ إِن كَانَ لَهُ وَلَدٌ",
        translation: "And for one's parents, to each one of them is a sixth of his estate if he left children...",
        rules: [
            "Receives 1/6 as a fixed share if the deceased has surviving male descendants (son or grandson).",
            "Receives 1/6 as fixed share AND acts as residuary (taking any remainder) if there are only female descendants.",
            "Acts as pure residuary (taking the entire remainder) in the absence of any descendants."
        ]
    },
    grandfather: {
        evidence: "Consensus (Ijmāʿ) standing in place of Father",
        arabic: "أَلْحِقُوا الْفَرَائِضَ بِأَهْلِهَا فَمَا بَقِيَ فَهُوَ لِأَوْلَى رَجُلٍ ذَكَرٍ",
        translation: "The Prophet (ﷺ) said: 'Give the fixed shares to those who are entitled. Whatever remains should be given to the closest male relative.'",
        rules: [
            "Acts as father in his absence, receiving 1/6 if male descendants exist, 1/6 + residue if only female descendants exist, or residue if no descendants exist.",
            "Blocked completely by the Father.",
            "Under Shāfiʿī Fiqh, he shares the residue with siblings under specific grandfather-sibling rules."
        ]
    },
    maternalGrandmother: {
        evidence: "Hadith of the Prophet (ﷺ) and Caliph Abu Bakr",
        arabic: "أَنَّ النَّبِيَّ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ جَعَلَ لِلْجَدَّةِ السُّدُسَ إِذَا لَمْ يَكُنْ دُونَهَا أُمٌّ",
        translation: "The Prophet (ﷺ) assigned a sixth to the grandmother when there is no mother standing before her.",
        rules: [
            "Receives 1/6 fixed share.",
            "Blocked completely by the Mother."
        ]
    },
    paternalGrandmother: {
        evidence: "Hadith and Consensus (Ijmāʿ)",
        arabic: "جَعَلَ لِلْجَدَّةِ السُّدُسَ",
        translation: "He assigned a sixth to the grandmother.",
        rules: [
            "Receives 1/6 fixed share (shared with maternal grandmother if both are eligible).",
            "Blocked completely by both the Mother and the Father."
        ]
    },
    daughter: {
        evidence: "Surah An-Nisā' 4:11",
        arabic: "يُوصِيكُمُ اللَّهُ فِي أَوْلَادِكُمْ ۖ لِلذَّكَرِ مِثْلُ حَظِّ الْأُنثَيَيْنِ ۚ فَإِن كُنَّ نِسَاءً فَوْقَ اثْنَتَيْنِ فَلَهُنَّ ثُلُثَا مَا تَرَكَ ۖ وَإِن كَانَتْ وَاحِدَةً فَلَهَا النِّصْفُ",
        translation: "Allah instructs you concerning your children: for the male, what is equal to the share of two females. But if there are daughters, two or more, for them is two-thirds of the estate. And if there is only one, for her is half...",
        rules: [
            "Receives 1/2 fixed share if she is a single daughter and no son is present.",
            "Receives 2/3 fixed share collectively if there are multiple daughters and no son is present.",
            "Inherits as a residuary (ʿaṣabah) if a son is present, sharing the residue in a 2:1 male-to-female ratio."
        ]
    },
    granddaughter: {
        evidence: "Hadith of Ibn Mas'ud (al-Bukhari) completing 2/3",
        arabic: "لِلِابْنَةِ النِّصْفُ وَلِابْنَةِ الِابْنِ السُّدُسُ تَكْمِلَةَ الثُّلُثَيْنِ",
        translation: "The Prophet (ﷺ) decreed: Half for the daughter, and a sixth for the son's daughter to complete the two-thirds...",
        rules: [
            "Receives 1/2 if single, or 2/3 if multiple, when there are no daughters or sons present.",
            "Receives 1/6 fixed share if there is exactly one daughter present, to complete the 2/3 share of daughters.",
            "Blocked completely if there are 2 or more daughters, or if there is a son present.",
            "Inherits as residuary if a grandson (same degree) is present, in a 2:1 ratio."
        ]
    },
    son: {
        evidence: "Surah An-Nisā' 4:11 & Hadith",
        arabic: "يُوصِيكُمُ اللَّهُ فِي أَوْلَادِكُمْ ۖ لِلذَّكَرِ مِثْلُ حَظِّ الْأُنثَيَيْنِ",
        translation: "Allah instructs you concerning your children: for the male, what is equal to the share of two females...",
        rules: [
            "Acts as a primary residuary (ʿaṣabah bi-nafsihi) and receives the entire remainder of the estate after fixed shares.",
            "Blocks all grandchildren, siblings, nephews, uncles, and cousins.",
            "Shares the residue with daughters in a 2:1 male-to-female ratio."
        ]
    },
    grandson: {
        evidence: "Consensus standing in place of Son",
        arabic: "أَلْحِقُوا الْفَرَائِضَ بِأَهْلِهَا",
        translation: "Give the fixed shares to those who are entitled...",
        rules: [
            "Acts as a residuary in the absence of a son.",
            "Blocked completely by any surviving Son.",
            "Blocks all siblings, nephews, uncles, and cousins."
        ]
    },
    brother: {
        evidence: "Surah An-Nisā' 4:176 & Hadith",
        arabic: "وَإِن كَانُوا إِخْوَةً رِّجَالًا وَنِسَاءً فَلِلذَّكَرِ مِثْلُ حَظِّ الْأُنثَيَيْنِ",
        translation: "...And if there are siblings, both men and women, then for the male is double the share of the female...",
        rules: [
            "Acts as a residuary in the absence of male descendants (son, grandson) and male ascendants (father, grandfather).",
            "Blocked by Father, Son, Grandson, and Grandfather (grandfather blocks or shares in Shāfiʿī).",
            "Shares the residue with full sisters in a 2:1 male-to-female ratio."
        ]
    },
    sister: {
        evidence: "Surah An-Nisā' 4:176",
        arabic: "إِنِ امْرُؤٌ هَلَكَ لَيْسَ لَهُ وَلَدٌ وَلَهُ أُخْتٌ فَلَهَا نِصْفُ مَا تَرَكَ",
        translation: "If a man dies, leaving no child but has a sister, she will have half of what he leaves...",
        rules: [
            "Receives 1/2 fixed share if single, or 2/3 if multiple, in the absence of descendants, ascendants, and full brothers.",
            "Inherits as residuary (2:1 ratio) if a full brother is present.",
            "Inherits as a residuary with others (ʿaṣabah maʿa al-ghayr) if daughters or granddaughters exist, taking the remaining residue."
        ]
    },
    paternalBrother: {
        evidence: "Surah An-Nisā' 4:176 & Hadith",
        arabic: "فَمَا بَقِيَ فَهو لِأَوْلَى رَجُلٍ ذَكَرٍ",
        translation: "...Whatever remains should be given to the closest male relative.",
        rules: [
            "Acts as a residuary in the absence of full brothers and closer male relatives.",
            "Blocked by Son, Grandson, Father, Grandfather, and Full Brother."
        ]
    },
    paternalSister: {
        evidence: "Surah An-Nisā' 4:176 & Hadith",
        arabic: "أُخْتٌ فَلَهَا نِصْفُ مَا تَرَكَ",
        translation: "...She will have half of what he leaves.",
        rules: [
            "Receives 1/2 if single, or 2/3 if multiple, in the absence of closer heirs.",
            "Receives 1/6 fixed share if there is exactly one full sister present, to complete the 2/3 sister pool.",
            "Blocked by 2+ full sisters, full brothers, or any male blocker."
        ]
    },
    maternalBrother: {
        evidence: "Surah An-Nisā' 4:12",
        arabic: "وَإِن كَانَ رَجُلٌ يُورَثُ كَلَالَةً أَوِ امْرَأَةٌ وَلَهُ أَخٌ أَوْ أُخْتٌ فَلِكُلِّ وَاحِدٍ مِّنْهُمَا السُّدُسُ ۚ فَإِن كَانُوا أَكْثَرَ مِن ذَٰلِكَ فَهُمْ شُرَكَاءُ فِي الثُّلُثِ",
        translation: "And if a man or woman leaves property through inheritance in Kalālah (having neither parent nor child) and he has a brother or sister, for each one of them is a sixth. But if they are more than that, they share in a third...",
        rules: [
            "Receives 1/6 fixed share if single, or shares in 1/3 equally if multiple (maternal siblings share 1:1 male/female).",
            "Blocked completely by any descendants (son, daughter, grandson, granddaughter) or male ascendants (father, grandfather)."
        ]
    },
    maternalSister: {
        evidence: "Surah An-Nisā' 4:12",
        arabic: "فَلِكُلِّ وَاحِدٍ مِّنْهُمَا السُّدُسُ ۚ فَإِن كَانُوا أَكْثَرَ مِن ذَٰلِكَ فَهُمْ شُرَكَاءُ فِي الثُّلُثِ",
        translation: "...For each one of them is a sixth. But if they are more than that, they share in a third...",
        rules: [
            "Receives 1/6 fixed share if single, or shares in 1/3 equally if multiple.",
            "Blocked completely by any descendants or male ascendants."
        ]
    },
    sonOfFullBrother: {
        evidence: "Sunnah of the Prophet (ﷺ)",
        arabic: "فَمَا بَقِيَ فَهُوَ لِأَوْلَى رَجُلٍ ذَكَرٍ",
        translation: "...Whatever remains should be given to the closest male relative.",
        rules: [
            "Acts as residuary.",
            "Blocked by Son, Grandson, Father, Grandfather, Brother, Paternal Brother, or Sister acting as residuary."
        ]
    },
    sonOfPaternalBrother: {
        evidence: "Sunnah of the Prophet (ﷺ)",
        arabic: "فَمَا بَقِيَ فَهُوَ لِأَوْلَى رَجُلٍ ذَكَرٍ",
        translation: "...Whatever remains should be given to the closest male relative.",
        rules: [
            "Acts as residuary.",
            "Blocked by Nephew (Full Brother's Son) and all closer male relatives."
        ]
    },
    uncle: {
        evidence: "Sunnah of the Prophet (ﷺ)",
        arabic: "أَلْحِقُوا الْفَرَائِضَ بِأَهْلِهَا فَمَا بَقِيَ فَهُوَ لِأَوْلَى رَجُلٍ ذَكَرٍ",
        translation: "Whatever remains should be given to the closest male relative.",
        rules: [
            "Acts as residuary.",
            "Blocked by Nephews, Brothers, Father, Grandfather, Son, and Grandson."
        ]
    },
    consanguinePaternalUncle: {
        evidence: "Sunnah of the Prophet (ﷺ)",
        rules: [
            "Acts as residuary.",
            "Blocked by Full Paternal Uncle and all closer male relatives."
        ]
    },
    paternalUncleSon: {
        evidence: "Sunnah of the Prophet (ﷺ)",
        rules: [
            "Acts as residuary.",
            "Blocked by Consanguine Paternal Uncle and all closer male relatives."
        ]
    },
    consanguinePaternalUncleSon: {
        evidence: "Sunnah of the Prophet (ﷺ)",
        rules: [
            "Acts as residuary.",
            "Blocked by Full Paternal Cousin (Paternal Uncle's Son) and all closer male relatives."
        ]
    },
    mutiq: {
        evidence: "Hadith: Wala' belongs to the liberator",
        arabic: "إِنَّمَا الْوَلاءُ لِمَنْ أَعْتَقَ",
        translation: "The Prophet (ﷺ) said: 'The loyalty/inheritance rights (wala') belong only to the one who liberated.'",
        rules: [
            "Acts as residuary if there are no blood residuaries or non-spouse sharers taking remainder.",
            "Blocked by any blood residuary."
        ]
    },
    mutiqah: {
        evidence: "Hadith of the Prophet (ﷺ)",
        rules: [
            "Acts as residuary if no male patron or blood residuary is present.",
            "Blocked by Mu'tiq (male patron), male relative through wala', or blood residuary."
        ]
    },
    walaRelative: {
        evidence: "Hadith and Consensus (Ijmāʿ)",
        rules: [
            "Acts as residuary in wala'.",
            "Blocked by Mu'tiq or blood residuary."
        ]
    },
    daughterSon: {
        evidence: "Tanzīl Rule for Dhawu al-Arḥām",
        translation: "Distant kindred stand in the place of the root through whom they are related. Daughter's children stand in place of the Daughter.",
        rules: [
            "Inherits when no blood sharers (except spouses) or residuaries exist.",
            "Stands in place of Daughter, splitting the remainder in a 2:1 male-to-female ratio."
        ]
    },
    daughterDaughter: {
        evidence: "Tanzīl Rule for Dhawu al-Arḥām",
        translation: "Daughter's children stand in place of the Daughter.",
        rules: [
            "Inherits when no blood sharers (except spouses) or residuaries exist.",
            "Stands in place of Daughter, splitting the remainder in a 2:1 male-to-female ratio."
        ]
    },
    maternalGrandfather: {
        evidence: "Tanzīl Rule for Dhawu al-Arḥām",
        translation: "Maternal Grandfather stands in place of the Mother.",
        rules: [
            "Inherits in the absence of class 1 distant kindred and all primary blood heirs.",
            "Stands in place of Mother, taking the remainder."
        ]
    },
    sisterSon: {
        evidence: "Tanzīl Rule for Dhawu al-Arḥām",
        translation: "Sister's children stand in place of the Sister.",
        rules: [
            "Inherits when no class 1 or class 2 distant kindred are present.",
            "Stands in place of Sister, taking their share."
        ]
    },
    sisterDaughter: {
        evidence: "Tanzīl Rule for Dhawu al-Arḥām",
        translation: "Sister's children stand in place of the Sister.",
        rules: [
            "Inherits when no class 1 or class 2 distant kindred are present.",
            "Stands in place of Sister, taking their share."
        ]
    },
    uterineSiblingChildren: {
        evidence: "Tanzīl Rule for Dhawu al-Arḥām",
        translation: "Uterine Sibling children stand in place of Uterine Brother/Sister.",
        rules: [
            "Inherits when no class 1 or class 2 distant kindred are present.",
            "Stands in place of Uterine Siblings, split equally."
        ]
    },
    maternalUncle: {
        evidence: "Tanzīl Rule for Dhawu al-Arḥām",
        translation: "Maternal Uncle/Aunt stand in place of the Mother.",
        rules: [
            "Inherits in class 4 when no closer distant kindred are present.",
            "Stands in place of Mother."
        ]
    },
    maternalAunt: {
        evidence: "Tanzīl Rule for Dhawu al-Arḥām",
        translation: "Maternal Uncle/Aunt stand in place of the Mother.",
        rules: [
            "Inherits in class 4 when no closer distant kindred are present.",
            "Stands in place of Mother."
        ]
    },
    paternalAunt: {
        evidence: "Tanzīl Rule for Dhawu al-Arḥām",
        translation: "Paternal Aunt stands in place of the Father.",
        rules: [
            "Inherits in class 4 when no closer distant kindred are present.",
            "Stands in place of Father."
        ]
    },
    otherDistantRelatives: {
        evidence: "Tanzīl Rule for Dhawu al-Arḥām",
        translation: "Other distant blood relatives stand in place of their respective closest blood roots.",
        rules: [
            "Inherits only when no other closer heirs or distant kindred are present."
        ]
    }
};

export const blockingTreeDefinition = {
    father: ["grandfather", "brother", "sister", "paternalBrother", "paternalSister", "sonOfFullBrother", "sonOfPaternalBrother", "uncle", "consanguinePaternalUncle", "paternalUncleSon", "consanguinePaternalUncleSon", "mutiq", "walaRelative", "mutiqah"],
    mother: ["maternalGrandmother", "paternalGrandmother"],
    son: ["grandson", "granddaughter", "brother", "sister", "paternalBrother", "paternalSister", "maternalBrother", "maternalSister", "sonOfFullBrother", "sonOfPaternalBrother", "uncle", "consanguinePaternalUncle", "paternalUncleSon", "consanguinePaternalUncleSon", "mutiq", "walaRelative", "mutiqah"],
    grandson: ["granddaughter", "brother", "sister", "paternalBrother", "paternalSister", "maternalBrother", "maternalSister", "sonOfFullBrother", "sonOfPaternalBrother", "uncle", "consanguinePaternalUncle", "paternalUncleSon", "consanguinePaternalUncleSon", "mutiq", "walaRelative", "mutiqah"],
    daughter: ["granddaughter"], // if 2+ daughters block granddaughters unless granddaughter is with grandson
    brother: ["paternalBrother", "paternalSister", "sonOfFullBrother", "sonOfPaternalBrother", "uncle", "consanguinePaternalUncle", "paternalUncleSon", "consanguinePaternalUncleSon", "mutiq", "walaRelative", "mutiqah"],
    sister: ["sonOfFullBrother", "sonOfPaternalBrother", "uncle", "consanguinePaternalUncle", "paternalUncleSon", "consanguinePaternalUncleSon"], // when sister acts as residuary with daughters
    paternalBrother: ["sonOfFullBrother", "sonOfPaternalBrother", "uncle", "consanguinePaternalUncle", "paternalUncleSon", "consanguinePaternalUncleSon", "mutiq", "walaRelative", "mutiqah"],
    paternalSister: ["sonOfPaternalBrother", "uncle", "consanguinePaternalUncle", "paternalUncleSon", "consanguinePaternalUncleSon"], // when paternal sister acts as residuary with daughters
    sonOfFullBrother: ["sonOfPaternalBrother", "uncle", "consanguinePaternalUncle", "paternalUncleSon", "consanguinePaternalUncleSon", "mutiq", "walaRelative", "mutiqah"],
    sonOfPaternalBrother: ["uncle", "consanguinePaternalUncle", "paternalUncleSon", "consanguinePaternalUncleSon", "mutiq", "walaRelative", "mutiqah"],
    uncle: ["consanguinePaternalUncle", "paternalUncleSon", "consanguinePaternalUncleSon", "mutiq", "walaRelative", "mutiqah"],
    consanguinePaternalUncle: ["paternalUncleSon", "consanguinePaternalUncleSon", "mutiq", "walaRelative", "mutiqah"],
    paternalUncleSon: ["consanguinePaternalUncleSon", "mutiq", "walaRelative", "mutiqah"],
    consanguinePaternalUncleSon: ["mutiq", "walaRelative", "mutiqah"],
    mutiq: ["mutiqah"],
    walaRelative: ["mutiqah"]
};
