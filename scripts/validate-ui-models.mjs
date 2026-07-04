import assert from 'node:assert/strict';
import { mainMenuModel } from '../src/games/weedopolis/ui/main-menu-model.js';
import { joinGameModel } from '../src/games/weedopolis/ui/join-game-model.js';
import { playerSetupModel } from '../src/games/weedopolis/ui/player-setup-model.js';
import { lobbyViewModel } from '../src/games/weedopolis/ui/lobby-view-model.js';
import { actionPanelModel } from '../src/games/weedopolis/ui/action-panel-model.js';
import { createLobby, addLobbyPlayer, setReady } from '../src/games/weedopolis/state/lobby.js';

const menu = mainMenuModel();
assert(menu.actions.some((action) => action.id === 'create-game'));
assert(menu.actions.some((action) => action.id === 'join-game'));
assert(menu.actions.some((action) => action.id === 'local-pass-and-play'));

const join = joinGameModel('ABC123');
assert.equal(join.inviteCode, 'ABC123');
assert(join.fields.some((field) => field.id === 'player-name'));
assert(join.fields.some((field) => field.id === 'game-code'));

const setup = playerSetupModel();
assert(setup.actions.some((action) => action.id === 'ready-up'));
assert(setup.tokenOptions.length >= 4);

let lobby = createLobby({ hostName: 'Host' });
lobby = addLobbyPlayer(lobby, { id: 'p2', name: 'Player 2' });
lobby = setReady(lobby, 'host', true);
lobby = setReady(lobby, 'p2', true);
const lobbyVm = lobbyViewModel(lobby);
assert.equal(lobbyVm.canStart, true);
assert.equal(lobbyVm.players.length, 2);

const panel = actionPanelModel({ ...lobby, phase: 'turn_start' });
assert(panel.actions.includes('roll-dice'));

console.log('ui model validation passed');
