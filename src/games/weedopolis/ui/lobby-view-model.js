export function lobbyViewModel(lobby) {
  return {
    phase: lobby.phase,
    inviteCode: lobby.inviteCode,
    inviteUrl: lobby.inviteUrl,
    canStart: lobby.players.length > 0 && lobby.players.every((player) => player.ready),
    players: lobby.players.map((player) => ({
      id: player.id,
      name: player.name,
      token: player.token,
      color: player.color,
      ready: player.ready,
      connected: player.connected
    }))
  };
}
