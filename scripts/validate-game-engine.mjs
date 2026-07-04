import assert from 'node:assert/strict';
import { makeInvite } from '../src/games/weedopolis/rules/invite-code.js';
import { rollTwo } from '../src/games/weedopolis/rules/randomizer.js';
import { movePosition, applyStartReward } from '../src/games/weedopolis/rules/movement.js';
import { resolveLanding } from '../src/games/weedopolis/rules/landing.js';
import { createLobby, addLobbyPlayer, setReady } from '../src/games/weedopolis/state/lobby.js';
import { canStart, startGame } from '../src/games/weedopolis/state/turn.js';

assert.equal(makeInvite('ABC123'), 'https://dtfseeds.com/games/weedopolis/?game=ABC123');

const dice = rollTwo(() => 0);
assert.deepEqual(dice.values, [1, 1]);
assert.equal(dice.total, 2);
assert.equal(dice.match, true);

const move = movePosition(39, 4);
assert.equal(move.position, 3);
assert.equal(move.passedStart, true);
assert.equal(applyStartReward(100, true, false), 300);

assert.equal(resolveLanding({ space_name: 'Start Session', space_type: 'corner' }).action, 'start_session');
assert.equal(resolveLanding({ space_name: 'Compliance Check', space_type: 'corner' }).action, 'go_to_trim_jail');
assert.equal(resolveLanding({ space_name: 'High Chance', space_type: 'card' }).action, 'draw_high_chance');
assert.equal(resolveLanding({ space_name: 'Community Stash', space_type: 'card' }).action, 'draw_community_stash');

let lobby = createLobby({ hostName: 'Host' });
lobby = addLobbyPlayer(lobby, { id: 'p2', name: 'Player 2' });
lobby = setReady(lobby, 'host', true);
lobby = setReady(lobby, 'p2', true);
assert.equal(canStart(lobby), true);
assert.equal(startGame(lobby).phase, 'turn_start');

console.log('game engine validation passed');
