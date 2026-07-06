export function createWordPressRoomActions(request) {
  return {
    createRoom(payload) {
      return request('/rooms', { method: 'POST', body: JSON.stringify(payload) });
    },
    joinRoom({ inviteCode, player }) {
      return request(`/rooms/${encodeURIComponent(inviteCode)}/join`, { method: 'POST', body: JSON.stringify({ player }) });
    },
    getRoom(inviteCode) {
      return request(`/rooms/${encodeURIComponent(inviteCode)}`);
    },
    updatePlayer(playerId, patch) {
      return request('/player', { method: 'POST', body: JSON.stringify({ playerId, patch }) });
    },
    saveState(roomId, statePatch) {
      return request(`/rooms/${encodeURIComponent(roomId)}/state`, { method: 'POST', body: JSON.stringify(statePatch) });
    },
    appendEvent(event) {
      return request(`/rooms/${encodeURIComponent(event.room_id)}/events`, { method: 'POST', body: JSON.stringify(event) });
    }
  };
}
