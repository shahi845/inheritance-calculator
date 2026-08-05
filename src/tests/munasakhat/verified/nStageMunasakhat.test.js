export const nStageMunasakhatTests = [
  {
    id: "MUN-N-001",
    madhhab: "shafii",
    estate: 120000,
    people: {
      deceased1: { name: "First deceased", gender: "male" },
      wife: { name: "Wife", gender: "female" },
      son1: { name: "Son 1", gender: "male" },
      son2: { name: "Son 2", gender: "male" },
      son1Wife: { name: "Son 1 Wife", gender: "female" },
      son1Son: { name: "Son 1 Son", gender: "male" },
      wifeBrother: { name: "Wife's Brother", gender: "male" }
    },
    deaths: [
      {
        deceasedHeirId: null,
        heirs: [
          { personId: "wife", heirType: "wife" },
          { personId: "son1", heirType: "son" },
          { personId: "son2", heirType: "son" }
        ]
      },
      {
        deceasedHeirId: "son1",
        heirs: [
          { personId: "son1Wife", heirType: "wife" },
          { personId: "son1Son", heirType: "son" }
        ]
      },
      {
        deceasedHeirId: "wife",
        heirs: [
          { personId: "son2", heirType: "son" },
          { personId: "wifeBrother", heirType: "brother" }
        ]
      }
    ],
    expectedFinalShares: {
      son2: "9/16",
      son1Wife: "7/128", 
      son1Son: "49/128"
    }
  }
];
