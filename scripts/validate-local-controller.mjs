import assert from 'node:assert/strict';
import { createStore } from '../src/games/weedopolis/controller/state-store.js';
import { createLocalActions } from '../src/games/weedopolis/controller/actions.js';

const boardRows = [
  { space_number: '1', space_name: 'Start Session', space_type: 'corner' },
  { space_number: '2', space_name: 'Acapulco Gold', space_type: 'property', purchase_price_bud_bucks: '60', rent_base: '2' },
  { space_number: '3', space_name: 'Community Stash', space_type: 'card' }
];

const store = createStore();
const actions = createLocalActions(store, { baseUrl: 'https://dtfseeds.com/games/weedopolis/' });

actions.createGame('Host');
actions.joinGame('Player 2');
let state = store.getState();
assert.equal(state.phase, 'lobby');
assert.equal(state.players.length, 2);
assert(state.inviteUrl.includes('game='));

actions.ready('host', true);
actions.ready(state.players[1].id, true);
actions.start();
state = store.getState();
assert.equal(state.phase, 'turn_start');

actions.roll(() => 0);
state = store.getState();
assert.equal(state.dice.total, 2);
assert.equal(state.phase, 'movement');

actions.move(boardRows);
state = store.getState();
assert.equal(state.phase, 'landing_resolution');
assert.equal(state.players[0].position, 3);
assert.equal(state.landing.action, 'draw_community_stash');

console.log('local controller validation passed');
