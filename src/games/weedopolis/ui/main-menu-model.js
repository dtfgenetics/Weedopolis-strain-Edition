export function mainMenuModel() {
  return {
    title: 'Weedopolis',
    edition: 'Strain City Edition',
    actions: [
      { id: 'solo-test', label: 'Solo Test' },
      { id: 'create-game', label: 'Create Game' },
      { id: 'join-game', label: 'Join Game' },
      { id: 'local-pass-and-play', label: 'Local Pass-and-Play' }
    ]
  };
}
