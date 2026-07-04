import { createPlayer } from './player.js';
import { makeCode, makeInvite } from '../rules/invite-code.js';

export function createLobby({ hostName = 'Host', baseUrl } = {}) {
  const code = makeCode();
  const host = createPlayer({ id: 'host', name: hostName });
  return {
    id: code,
    inviteCode: code,
    inviteUrl: makeInvite(code, baseUrl),
    hostPlayerId: host.id,
    phase: 'lobby',
    players: [host],
    currentPlayerIndex: 0,
    actionLog: [`${host.name} created the lobby`]
  };
}

export function addLobbyPlayer(lobby, input) {
  const player = createPlayer(input);
  return {
    ...lobby,
    players: [...lobby.players, player],
    actionLog: [...lobby.actionLog, `${player.name} joined`]
  };
}

export function setReady(lobby, playerId, ready = true) {
  return {
    ...lobby,
    players: lobby.players.map((player) => player.id === playerId ? { ...player, ready } : player)
  };
}
