export const malikiMunasakhatCases = [
  {
    id: "MA-MUN-001",
    madhhab: "maliki",
    question:
      "A man died leaving a wife, two sons, and a daughter. Then one of the sons died before the estate was divided, leaving a wife, a son, and a daughter.",
    firstDeath: {
      wife: 1,
      son: 2,
      daughter: 1
    },
    secondDeath: {
      deceasedHeir: "son",
      wife: 1,
      son: 1,
      daughter: 1
    }
  },
  {
    id: "MA-MUN-002",
    madhhab: "maliki",
    question:
      "A woman died leaving a husband, a mother, and two daughters. Then one of the daughters died before the estate was divided, leaving a husband, a mother, and a son.",
    firstDeath: {
      husband: 1,
      mother: 1,
      daughter: 2
    },
    secondDeath: {
      deceasedHeir: "daughter",
      husband: 1,
      mother: 1,
      son: 1
    }
  },
  {
    id: "MA-MUN-003",
    madhhab: "maliki",
    question:
      "A man died leaving a wife, a father, a mother, and a daughter. Then the mother died before the estate was divided, leaving a husband and a son.",
    firstDeath: {
      wife: 1,
      father: 1,
      mother: 1,
      daughter: 1
    },
    secondDeath: {
      deceasedHeir: "mother",
      husband: 1,
      son: 1
    }
  }
];
