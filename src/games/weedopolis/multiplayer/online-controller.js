import { assertMultiplayerAdapter } from './adapter.js';
import { createOnlineRoomDraft } from './room-factory.js';

export function createOnlineController(adapter, options = {}) {
  const multiplayer = assertMultiplayerAdapter(adapter);

  return {
    async createRoom({ hostName = 'Host' } = {}) {
      const draft = createOnlineRoomDraft({ hostName, baseUrl: options.baseUrl, maxPlayers: options.maxPlayers });
      await multiplayer.createRoom(draft);
      return draft.room;
    },

    async joinByCode({ inviteCode, player }) {
      return multiplayer.joinRoom({ inviteCode, player });
    },

    async loadRoom(inviteCode) {
      return multiplayer.getRoom(inviteCode);
    },

    subscribe(roomId, onChange) {
      return multiplayer.subscribeRoom(roomId, onChange);
    },

    async saveGameState(roomId, statePatch) {
      return multiplayer.saveState(roomId, statePatch);
    },

    async logEvent(event) {
      return multiplayer.appendEvent(event);
    }
  };
}
