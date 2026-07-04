export function canStart(lobby) {
  return lobby.players.length > 0 && lobby.players.every((player) => player.ready);
}

export function startGame(lobby) {
  if (!canStart(lobby)) throw new Error('All players must be ready before starting.');
  return {
    ...lobby,
    phase: 'turn_start',
    actionLog: [...lobby.actionLog, 'Game started']
  };
}

export function endTurn(game) {
  return {
    ...game,
    phase: 'turn_start',
    currentPlayerIndex: (game.currentPlayerIndex + 1) % game.players.length
  };
}

export function currentPlayer(game) {
  return game.players[game.currentPlayerIndex] || null;
}
