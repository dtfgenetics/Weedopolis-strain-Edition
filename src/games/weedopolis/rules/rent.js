export function calculateBaseRent(space, owner, diceTotal = 0) {
  if (!space) return 0;

  if (space.space_type === 'property') return Number(space.rent_base || 0);

  if (space.space_type === 'category') {
    const ownedLines = owner.ownedSpaceNumbers.filter((spaceNumber) => [6, 16, 26, 36].includes(spaceNumber)).length;
    return { 1: 25, 2: 50, 3: 100, 4: 200 }[ownedLines] || 25;
  }

  if (space.space_type === 'utility') {
    const utilitiesOwned = owner.ownedSpaceNumbers.filter((spaceNumber) => [13, 29].includes(spaceNumber)).length;
    return diceTotal * (utilitiesOwned >= 2 ? 10 : 4);
  }

  return 0;
}
