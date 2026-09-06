import { createLobby, addLobbyPlayer, setReady } from '../state/lobby.js';
import { startGame } from '../state/turn.js';
import { rollTwo } from '../rules/randomizer.js';
import { moveCurrentPlayer } from '../state/game-actions.js';

export function createLocalActions(store, options = {}) {
  return {
    createGame(hostName = 'Host') {
      return store.setState(createLobby({ hostName, baseUrl: options.baseUrl }));
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
    },
    roll(random = Math.random) {
      const state = store.getState();
      if (!state) throw new Error('No game exists.');
      if (state.phase !== 'turn_start') {
        throw new Error('Finish the current turn before rolling again.');
      }
      const result = rollTwo(random);
      return store.setState({ ...state, dice: result, phase: 'movement' });
    },
    move(boardRows) {
      const state = store.getState();
      if (!state?.dice) throw new Error('Roll before moving.');
      if (state.phase !== 'movement') {
        throw new Error('Movement is only allowed after the current turn roll.');
      }
      return store.setState(moveCurrentPlayer(state, state.dice.total, boardRows));
    }
  };
}
