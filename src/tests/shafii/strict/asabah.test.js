export const shafiiAsabahTests = [
    {
        name: "Full Paternal Uncle blocks Consanguine Paternal Uncle",
        input: { uncle: 1, consanguinePaternalUncle: 1 },
        expected: {
            uncle: "1"
        }
    },
    {
        name: "Consanguine Paternal Uncle blocks Full Cousin",
        input: { consanguinePaternalUncle: 1, paternalUncleSon: 1 },
        expected: {
            consanguinePaternalUncle: "1"
        }
    },
    {
        name: "Full Cousin blocks Consanguine Cousin",
        input: { paternalUncleSon: 1, consanguinePaternalUncleSon: 1 },
        expected: {
            paternalUncleSon: "1"
        }
    },
    {
        name: "Wife + Mu'tiqah (Wala' Heir)",
        input: { wife: 1, mutiqah: 1 },
        expected: {
            wife: "1/4",
            mutiqah: "3/4"
        }
    },
    {
        name: "Wife + Male Relative through Wala'",
        input: { wife: 1, walaRelative: 1 },
        expected: {
            wife: "1/4",
            walaRelative: "3/4"
        }
    },
    {
        name: "Mu'tiq blocks Mu'tiqah",
        input: { mutiq: 1, mutiqah: 1 },
        expected: {
            mutiq: "1"
        }
    }
];
