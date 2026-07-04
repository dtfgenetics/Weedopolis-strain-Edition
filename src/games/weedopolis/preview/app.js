import { createStore } from '../controller/state-store.js';
import { createLocalActions } from '../controller/actions.js';
import { renderMenuScreen, renderLobbyScreen } from '../ui/index.js';

const root = document.getElementById('weedopolis-root');
const store = createStore();
const actions = createLocalActions(store, { baseUrl: window.location.href.split('?')[0] });

const sampleBoard = [
  { space_number: '1', space_name: 'Start Session', space_type: 'corner' },
  { space_number: '2', space_name: 'Acapulco Gold', space_type: 'property', purchase_price_bud_bucks: '60', rent_base: '2' },
  { space_number: '3', space_name: 'Community Stash', space_type: 'card' },
  { space_number: '4', space_name: 'Maui Wowie', space_type: 'property', purchase_price_bud_bucks: '60', rent_base: '4' }
];

function render() {
  const state = store.getState();
  if (!state) {
    renderMenuScreen(root);
    return;
  }
  renderLobbyScreen(root, state);
  appendControls(state);
  appendLog(state);
}

function appendControls(state) {
  const panel = document.createElement('section');
  panel.className = 'panel';

  const ready = document.createElement('button');
  ready.textContent = 'Ready All';
  ready.dataset.action = 'ready-all';
  panel.appendChild(ready);

  const roll = document.createElement('button');
  roll.textContent = 'Roll Dice';
  roll.dataset.action = 'roll-dice';
  panel.appendChild(roll);

  const move = document.createElement('button');
  move.textContent = 'Move Current Player';
  move.dataset.action = 'move-player';
  panel.appendChild(move);

  root.appendChild(panel);
}

function appendLog(state) {
  const log = document.createElement('pre');
  log.className = 'log';
  log.textContent = JSON.stringify({ phase: state.phase, dice: state.dice, landing: state.landing, players: state.players }, null, 2);
  root.appendChild(log);
}

root.addEventListener('click', (event) => {
  const action = event.target?.dataset?.action;
  if (!action) return;
  if (action === 'create-game') actions.createGame('Host');
  if (action === 'join-game') actions.joinGame('Player 2');
  if (action === 'ready-all') {
    const state = store.getState();
    for (const player of state.players) actions.ready(player.id, true);
    actions.start();
  }
  if (action === 'roll-dice') actions.roll();
  if (action === 'move-player') actions.move(sampleBoard);
  render();
});

render();
