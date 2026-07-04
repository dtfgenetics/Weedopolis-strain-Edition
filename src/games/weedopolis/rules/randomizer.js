export function rollTwo(random = Math.random) {
  const a = 1 + Math.floor(random() * 6);
  const b = 1 + Math.floor(random() * 6);
  return { values: [a, b], total: a + b, match: a === b };
}
