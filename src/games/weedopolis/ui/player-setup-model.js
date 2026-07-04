export function playerSetupModel() {
  return {
    title: 'Player Setup',
    fields: [
      { id: 'player-name', label: 'Player Name', required: true },
      { id: 'token', label: 'Token', required: false },
      { id: 'color', label: 'Player Color', required: false }
    ],
    tokenOptions: ['Leaf', 'Jar', 'Dice', 'Bud', 'Light', 'Water'],
    actions: [
      { id: 'save-player', label: 'Save Player' },
      { id: 'ready-up', label: 'Ready' }
    ]
  };
}
