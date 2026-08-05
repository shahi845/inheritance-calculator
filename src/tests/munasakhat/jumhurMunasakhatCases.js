export const jumhurMunasakhatCases = [
  {
    id: "JU-MUN-001",
    madhhab: "jumhur",
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
    id: "JU-MUN-002",
    madhhab: "jumhur",
    question:
      "A woman died leaving a husband, a mother, and a son. Then the son died before the estate was divided, leaving a wife, a mother, and two daughters.",
    firstDeath: {
      husband: 1,
      mother: 1,
      son: 1
    },
    secondDeath: {
      deceasedHeir: "son",
      wife: 1,
      mother: 1,
      daughter: 2
    }
  },
  {
    id: "JU-MUN-003",
    madhhab: "jumhur",
    question:
      "A man died leaving a wife and three sons. Then one of the sons died before the estate was divided, leaving a wife and two sons.",
    firstDeath: {
      wife: 1,
      son: 3
    },
    secondDeath: {
      deceasedHeir: "son",
      wife: 1,
      son: 2
    }
  },
  {
    id: "JU-MUN-004",
    madhhab: "jumhur",
    question:
      "A man died leaving a father, a mother, and two sons. Then the father died before the estate was divided, leaving a wife and the remaining son.",
    firstDeath: {
      father: 1,
      mother: 1,
      son: 2
    },
    secondDeath: {
      deceasedHeir: "father",
      wife: 1,
      son: 1
    }
  },
  {
    id: "JU-MUN-005",
    madhhab: "jumhur",
    question:
      "A woman died leaving a husband, a daughter, and a mother. Then the daughter died before the estate was divided, leaving a husband, a son, and her mother.",
    firstDeath: {
      husband: 1,
      daughter: 1,
      mother: 1
    },
    secondDeath: {
      deceasedHeir: "daughter",
      husband: 1,
      son: 1,
      mother: 1
    }
  },
  {
    id: "JU-MUN-006",
    madhhab: "jumhur",
    question:
      "A man died leaving a wife, a father, and a son. Then the son died before the estate was divided, leaving a wife, a mother, and a son.",
    firstDeath: {
      wife: 1,
      father: 1,
      son: 1
    },
    secondDeath: {
      deceasedHeir: "son",
      wife: 1,
      mother: 1,
      son: 1
    }
  },
  {
    id: "JU-MUN-007",
    madhhab: "jumhur",
    question:
      "A woman died leaving a mother, two sons, and a daughter. Then the daughter died before the estate was divided, leaving a husband and a son.",
    firstDeath: {
      mother: 1,
      son: 2,
      daughter: 1
    },
    secondDeath: {
      deceasedHeir: "daughter",
      husband: 1,
      son: 1
    }
  },
  {
    id: "JU-MUN-008",
    madhhab: "jumhur",
    question:
      "A man died leaving a wife, a son, and a daughter. Then the wife died before the estate was divided, leaving her son, her daughter, and her mother.",
    firstDeath: {
      wife: 1,
      son: 1,
      daughter: 1
    },
    secondDeath: {
      deceasedHeir: "wife",
      son: 1,
      daughter: 1,
      mother: 1
    }
  },
  {
    id: "JU-MUN-009",
    madhhab: "jumhur",
    question:
      "A woman died leaving a husband and a full sister. Then the full sister died before the estate was divided, leaving a husband and a mother.",
    firstDeath: {
      husband: 1,
      fullSister: 1
    },
    secondDeath: {
      deceasedHeir: "fullSister",
      husband: 1,
      mother: 1
    }
  }
];
