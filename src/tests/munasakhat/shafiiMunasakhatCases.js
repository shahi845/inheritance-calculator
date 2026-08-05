export const shafiiMunasakhatCases = [
  {
    id: "SH-MUN-001",
    madhhab: "shafii",
    question:
      "A man died leaving a wife, a son, and a daughter. Then the son died before the estate was divided, leaving a wife, a son, and a daughter.",
    firstDeath: {
      wife: 1,
      son: 1,
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
    id: "SH-MUN-002",
    madhhab: "shafii",
    question:
      "A woman died leaving a husband, a mother, and a daughter. Then the daughter died before the estate was divided, leaving a husband, her mother, and a son.",
    firstDeath: {
      husband: 1,
      mother: 1,
      daughter: 1
    },
    secondDeath: {
      deceasedHeir: "daughter",
      husband: 1,
      mother: 1,
      son: 1
    }
  },
  {
    id: "SH-MUN-003",
    madhhab: "shafii",
    question:
      "A man died leaving a wife, a father, a mother, and a son. Then the father died before the estate was divided, leaving a wife, a mother, and a son.",
    firstDeath: {
      wife: 1,
      father: 1,
      mother: 1,
      son: 1
    },
    secondDeath: {
      deceasedHeir: "father",
      wife: 1,
      mother: 1,
      son: 1
    }
  },
  {
    id: "SH-MUN-004",
    madhhab: "shafii",
    question:
      "A woman died leaving a husband, a daughter, and a full sister. Then the full sister died before the estate was divided, leaving a husband, a mother, and a full brother.",
    firstDeath: {
      husband: 1,
      daughter: 1,
      fullSister: 1
    },
    secondDeath: {
      deceasedHeir: "fullSister",
      husband: 1,
      mother: 1,
      fullBrother: 1
    }
  }
];
