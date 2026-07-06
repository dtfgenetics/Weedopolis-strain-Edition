export function createMissingMultiplayerAdapter() {
  return {
    async createRoom() {
      throw new Error('Online multiplayer adapter is not configured.');
    },
    async joinRoom() {
      throw new Error('Online multiplayer adapter is not configured.');
    },
    async getRoom() {
      throw new Error('Online multiplayer adapter is not configured.');
    },
    async updatePlayer() {
      throw new Error('Online multiplayer adapter is not configured.');
    },
    async saveState() {
      throw new Error('Online multiplayer adapter is not configured.');
    },
    async appendEvent() {
      throw new Error('Online multiplayer adapter is not configured.');
    },
    subscribeRoom() {
      throw new Error('Online multiplayer adapter is not configured.');
    }
  };
}

export function assertMultiplayerAdapter(adapter) {
  const required = ['createRoom', 'joinRoom', 'getRoom', 'updatePlayer', 'saveState', 'appendEvent', 'subscribeRoom'];
  for (const key of required) {
    if (typeof adapter?.[key] !== 'function') throw new Error(`Missing multiplayer adapter method: ${key}`);
  }
  return adapter;
}
