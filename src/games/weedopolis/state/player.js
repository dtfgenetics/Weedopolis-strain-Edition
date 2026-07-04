export function createPlayer(input = {}, startingBalance = 1500) {
  return {
    id: input.id || `p_${Math.random().toString(36).slice(2, 10)}`,
    name: input.name || 'Player',
    token: input.token || null,
    color: input.color || null,
    position: 1,
    budBucks: startingBalance,
    ownedSpaceNumbers: [],
    growTents: {},
    dispensaries: {},
    inTrimJail: false,
    ready: false,
    connected: true
  };
}
