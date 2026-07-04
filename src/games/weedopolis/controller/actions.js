import { createLobby, addLobbyPlayer, setReady } from '../state/lobby.js';
import { startGame } from '../state/turn.js';

export function createLocalActions(store) {
  return {
    createGame(hostName = 'Host') {
      return store.setState(createLobby({ hostName }));
    },
    joinGame(name = 'Player') {
      const state = store.getState();
      if (!state) throw new Error('No lobby exists.');
      return store.setState(addLobbyPlayer(state, { name }));
    },
    ready(playerId, value = true) {
      return store.setState(setReady(store.getState(), playerId, value));
    },
    start() {
      return store.setState(startGame(store.getState()));
    }
  };
}
