import { assertMultiplayerAdapter } from './adapter.js';
import { createWordPressRestClient } from './wordpress-rest-client.js';
import { createWordPressRoomActions } from './wordpress-room-actions.js';
import { subscribeWordPressRoom } from './wordpress-polling.js';

export function createWordPressRestMultiplayerAdapter(options = {}) {
  const request = createWordPressRestClient(options);
  const actions = createWordPressRoomActions(request);

  return assertMultiplayerAdapter({
    createRoom: actions.createRoom,
    joinRoom: actions.joinRoom,
    getRoom: actions.getRoom,
    updatePlayer: actions.updatePlayer,
    saveState: actions.saveState,
    appendEvent: actions.appendEvent,
    subscribeRoom(roomId, onChange) {
      return subscribeWordPressRoom({ request, roomId, onChange, intervalMs: options.intervalMs || 1500 });
    }
  });
}
