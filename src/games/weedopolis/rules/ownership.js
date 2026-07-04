export function findOwner(game, spaceNumber) {
  return game.players.find((player) => player.ownedSpaceNumbers.includes(spaceNumber)) || null;
}

export function buySpace(game, playerId, space) {
  const price = Number(space.purchase_price_bud_bucks || 0);
  if (price <= 0) throw new Error('This space cannot be purchased.');
  if (findOwner(game, Number(space.space_number))) throw new Error('This space is already owned.');

  return {
    ...game,
    players: game.players.map((player) => {
      if (player.id !== playerId) return player;
      if (player.budBucks < price) throw new Error('Not enough Bud Bucks.');
      return {
        ...player,
        budBucks: player.budBucks - price,
        ownedSpaceNumbers: [...player.ownedSpaceNumbers, Number(space.space_number)]
      };
    }),
    actionLog: [...game.actionLog, `${playerId} bought ${space.space_name} for ${price} Bud Bucks`]
  };
}

export function transferBudBucks(game, fromPlayerId, toPlayerId, amount) {
  return {
    ...game,
    players: game.players.map((player) => {
      if (player.id === fromPlayerId) return { ...player, budBucks: player.budBucks - amount };
      if (player.id === toPlayerId) return { ...player, budBucks: player.budBucks + amount };
      return player;
    })
  };
}
