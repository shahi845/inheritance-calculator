export function buildHeirInput(heirs = []) {
  const input = {};

  for (const heir of heirs) {
    input[heir.heirType] = (input[heir.heirType] || 0) + 1;
  }

  return input;
}
