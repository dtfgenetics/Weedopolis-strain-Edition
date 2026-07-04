export function joinGameModel(inviteCode = '') {
  return {
    title: 'Join Weedopolis Game',
    inviteCode,
    fields: [
      { id: 'player-name', label: 'Player Name', required: true },
      { id: 'game-code', label: 'Game Code', required: true }
    ],
    actions: [
      { id: 'join-game', label: 'Join Game' },
      { id: 'back-to-menu', label: 'Back' }
    ]
  };
}
