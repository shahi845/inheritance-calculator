export const shafiiModernDistantKindredTests = [
    {
        name: "Distant Kindred Class 1 (Daughter's children) split 2:1",
        input: { daughterSon: 1, daughterDaughter: 1 },
        expected: {
            daughterSon: "2/3",
            daughterDaughter: "1/3"
        }
    },
    {
        name: "Class 1 (Daughter's Son) blocks Class 2 (Maternal Grandfather)",
        input: { daughterSon: 1, maternalGrandfather: 1 },
        expected: {
            daughterSon: "1"
        }
    },
    {
        name: "Class 2 (Maternal Grandfather) takes all after spouse",
        input: { husband: 1, maternalGrandfather: 1 },
        expected: {
            husband: "1/2",
            maternalGrandfather: "1/2"
        }
    },
    {
        name: "Class 2 (Maternal Grandfather) blocks Class 3 (Sister's Son)",
        input: { maternalGrandfather: 1, sisterSon: 1 },
        expected: {
            maternalGrandfather: "1"
        }
    },
    {
        name: "Class 3 (Sister's children + Uterine sibling's children)",
        input: { sisterSon: 1, sisterDaughter: 1, uterineSiblingChildren: 1 },
        expected: {
            sisterSon: "1/2",
            sisterDaughter: "1/4",
            uterineSiblingChildren: "1/4"
        }
    },
    {
        name: "Class 4 (Maternal Uncle & Aunt + Paternal Aunt)",
        input: { maternalUncle: 1, maternalAunt: 1, paternalAunt: 1 },
        expected: {
            maternalUncle: "2/9",
            maternalAunt: "1/9",
            paternalAunt: "2/3"
        }
    },
    {
        name: "Class 4 (Maternal Uncle/Aunt) blocks Class 5 (Other Distant Relatives)",
        input: { maternalUncle: 1, otherDistantRelatives: 1 },
        expected: {
            maternalUncle: "1"
        }
    }
];
