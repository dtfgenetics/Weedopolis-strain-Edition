import { makeCode, makeInvite } from '../rules/invite-code.js';
import { createLobby } from '../state/lobby.js';

export function createOnlineRoomDraft({ hostName = 'Host', baseUrl, maxPlayers = 6 } = {}) {
  const inviteCode = makeCode();
  const roomId = `room_${inviteCode.toLowerCase()}`;
  const lobby = createLobby({ hostName, baseUrl });
  const host = lobby.players[0];

  return {
    room: {
      room_id: roomId,
      invite_code: inviteCode,
      invite_url: makeInvite(inviteCode, baseUrl),
      host_player_id: host.id,
      status: 'lobby',
      max_players: maxPlayers
    },
    hostPlayer: {
      player_id: host.id,
      room_id: roomId,
      display_name: host.name,
      token: host.token,
      color: host.color,
      is_host: true,
      ready: false,
      connected: true
    },
    initialState: {
      room_id: roomId,
      state_version: 1,
      phase: 'lobby',
      current_player_id: null,
      state_json: lobby
    }
  };
}
