export const simpleMunasakhatTests = [
  {
    id: "MUN-001",
    madhhab: "shafii",
    estate: 120000,

    people: {
      deceased1: { name: "First deceased", gender: "male" },
      wife1: { name: "First wife", gender: "female" },
      son1: { name: "Son 1", gender: "male" },
      son2: { name: "Son 2", gender: "male" },
      daughter1: { name: "Daughter 1", gender: "female" },
      wife2: { name: "Son 1 wife", gender: "female" },
      grandson1: { name: "Son 1 son", gender: "male" },
      granddaughter1: { name: "Son 1 daughter", gender: "female" }
    },

    deaths: [
      {
        deceasedHeirId: null,
        heirs: [
        { personId: "wife1", heirType: "wife" },
        { personId: "son1", heirType: "son" },
        { personId: "son2", heirType: "son" },
        { personId: "daughter1", heirType: "daughter" }
      ]
      },
      {
        deceasedHeirId: 'son1',
        heirs: [
        { personId: "wife2", heirType: "wife" },
        { personId: "grandson1", heirType: "son" },
        { personId: "granddaughter1", heirType: "daughter" }
      ]
      }
    ],

    expectedFinalShares: {
      wife1: "1/8",
      son2: "7/20",
      daughter1: "7/40",
      wife2: "7/160",
      grandson1: "49/240",
      granddaughter1: "49/480"
    }
  },
  {
    id: "MUN-002",
    madhhab: "shafii",
    estate: 120000,

    people: {
      deceased1: { name: "First deceased", gender: "female" },
      husband: { name: "Husband", gender: "male" },
      mother1: { name: "Mother 1", gender: "female" },
      brother1: { name: "Brother 1", gender: "male" },
      mother2: { name: "Husband's Mother", gender: "female" },
      son2: { name: "Husband's Son", gender: "male" }
    },

    deaths: [
      {
        deceasedHeirId: null,
        heirs: [
        { personId: "husband", heirType: "husband" },
        { personId: "mother1", heirType: "mother" },
        { personId: "brother1", heirType: "brother" }
      ]
      },
      {
        deceasedHeirId: 'husband',
        heirs: [
        { personId: "mother2", heirType: "mother" },
        { personId: "son2", heirType: "son" }
      ]
      }
    ],

    expectedFinalShares: {
      mother1: "1/3",
      brother1: "1/6",
      mother2: "1/12",
      son2: "5/12"
    }
  },
  {
    id: "MUN-003",
    madhhab: "shafii",
    estate: 240000,

    people: {
      deceased1: { name: "First deceased", gender: "male" },
      wife: { name: "Wife", gender: "female" },
      daughter: { name: "Daughter", gender: "female" },
      paternalBrother: { name: "Paternal Brother", gender: "male" },
      wifeMother: { name: "Wife's Mother", gender: "female" },
      wifeBrother: { name: "Wife's Brother", gender: "male" }
    },

    deaths: [
      {
        deceasedHeirId: null,
        heirs: [
        { personId: "wife", heirType: "wife" },
        { personId: "daughter", heirType: "daughter" },
        { personId: "paternalBrother", heirType: "paternalBrother" }
      ]
      },
      {
        deceasedHeirId: 'wife',
        heirs: [
        { personId: "wifeMother", heirType: "mother" },
        { personId: "wifeBrother", heirType: "brother" }
      ]
      }
    ],

    expectedFinalShares: {
      daughter: "1/2",
      paternalBrother: "3/8",
      wifeMother: "1/24",
      wifeBrother: "1/12"
    }
  },
  {
    id: "MUN-004",
    madhhab: "shafii",
    estate: 320000,

    people: {
      deceased1: { name: "First deceased", gender: "female" },
      husband: { name: "Husband", gender: "male" },
      son: { name: "Son", gender: "male" },
      sonWife: { name: "Son's Wife", gender: "female" },
      sonDaughter: { name: "Son's Daughter", gender: "female" },
      sonUncle: { name: "Son's Uncle", gender: "male" }
    },

    deaths: [
      {
        deceasedHeirId: null,
        heirs: [
        { personId: "husband", heirType: "husband" },
        { personId: "son", heirType: "son" }
      ]
      },
      {
        deceasedHeirId: 'son',
        heirs: [
        { personId: "sonWife", heirType: "wife" },
        { personId: "sonDaughter", heirType: "daughter" },
        { personId: "sonUncle", heirType: "uncle" }
      ]
      }
    ],

    expectedFinalShares: {
      husband: "1/4",
      sonWife: "3/32",
      sonDaughter: "3/8",
      sonUncle: "9/32"
    }
  },
  {
    id: "MUN-005",
    madhhab: "shafii",
    estate: 240000,

    people: {
      deceased1: { name: "First deceased", gender: "male" },
      wife: { name: "Wife", gender: "female" },
      mother: { name: "Mother", gender: "female" },
      son: { name: "Son", gender: "male" },
      motherHusband: { name: "Mother's Husband", gender: "male" }
    },

    deaths: [
      {
        deceasedHeirId: null,
        heirs: [
        { personId: "wife", heirType: "wife" },
        { personId: "mother", heirType: "mother" },
        { personId: "son", heirType: "son" }
      ]
      },
      {
        deceasedHeirId: 'mother',
        heirs: [
        { personId: "motherHusband", heirType: "husband" },
        { personId: "son", heirType: "son" }
      ]
      }
    ],

    expectedFinalShares: {
      wife: "1/8",
      motherHusband: "1/24",
      son: "5/6"
    }
  }
];
