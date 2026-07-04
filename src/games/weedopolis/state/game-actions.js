import { movePosition, applyStartReward } from '../rules/movement.js';
import { resolveLanding } from '../rules/landing.js';

export function moveCurrentPlayer(game, spaces, boardRows) {
  const current = game.players[game.currentPlayerIndex];
  if (!current) throw new Error('No current player.');

  const move = movePosition(current.position, spaces);
  const players = game.players.map((player) => {
    if (player.id !== current.id) return player;
    return {
      ...player,
      position: move.position,
      budBucks: applyStartReward(player.budBucks, move.passedStart, move.position === 1)
    };
  });

  const landedSpace = boardRows.find((row) => Number(row.space_number) === move.position);
  const landing = resolveLanding(landedSpace);

  return {
    ...game,
    players,
    phase: 'landing_resolution',
    lastMove: { playerId: current.id, spaces, ...move },
    landing,
    actionLog: [...game.actionLog, `${current.name} moved ${spaces} spaces to ${move.position}`]
  };
}
