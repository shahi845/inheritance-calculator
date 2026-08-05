export const hanafiMunasakhatCases = [
  {
    id: "HA-MUN-001",
    madhhab: "hanafi",
    question:
      "A man died leaving a wife, a paternal grandfather, and a full brother. Then the full brother died before the estate was divided, leaving a wife and a son.",
    firstDeath: {
      wife: 1,
      paternalGrandfather: 1,
      fullBrother: 1
    },
    secondDeath: {
      deceasedHeir: "fullBrother",
      wife: 1,
      son: 1
    }
  },
  {
    id: "HA-MUN-002",
    madhhab: "hanafi",
    question:
      "A woman died leaving a daughter, a son's daughter, and a full brother. Then the full brother died before the estate was divided, leaving a wife, a son, and a daughter.",
    firstDeath: {
      daughter: 1,
      sonsDaughter: 1,
      fullBrother: 1
    },
    secondDeath: {
      deceasedHeir: "fullBrother",
      wife: 1,
      son: 1,
      daughter: 1
    }
  },
  {
    id: "HA-MUN-003",
    madhhab: "hanafi",
    question:
      "A woman died leaving a mother, a daughter, and a son's daughter. Then the son's daughter died before the estate was divided, leaving a husband, a mother, and a son.",
    firstDeath: {
      mother: 1,
      daughter: 1,
      sonsDaughter: 1
    },
    secondDeath: {
      deceasedHeir: "sonsDaughter",
      husband: 1,
      mother: 1,
      son: 1
    }
  }
];
