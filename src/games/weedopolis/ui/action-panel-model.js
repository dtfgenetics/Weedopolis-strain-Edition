export function actionPanelModel(game) {
  return {
    phase: game.phase,
    currentPlayerId: game.players[game.currentPlayerIndex]?.id || null,
    currentPlayerName: game.players[game.currentPlayerIndex]?.name || null,
    dice: game.dice || null,
    landing: game.landing || null,
    actions: actionsForPhase(game.phase, game.landing)
  };
}

function actionsForPhase(phase, landing) {
  if (phase === 'turn_start') return ['roll-dice'];
  if (phase === 'landing_resolution' && landing?.canBuy) return ['buy-space', 'skip-buy'];
  if (phase === 'landing_resolution' && landing?.action?.startsWith('draw_')) return ['draw-card'];
  if (phase === 'landing_resolution') return ['resolve-space', 'end-turn'];
  return [];
}
