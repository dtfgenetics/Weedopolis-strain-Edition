import { createStore } from '../controller/state-store.js';
import { createLocalActions } from '../controller/actions.js';
import { loadPreviewData } from './load-preview-data.js';
import { renderMenuScreen, renderLobbyScreen } from '../ui/index.js';

const root = document.getElementById('weedopolis-root');
const store = createStore();
const actions = createLocalActions(store, { baseUrl: window.location.href.split('?')[0] });
let boardRows = [];

async function boot() {
  const data = await loadPreviewData();
  boardRows = data.boardRows;
  render();
}

function render() {
  const state = store.getState();
  if (!state) {
    renderMenuScreen(root);
    return;
  }
  renderLobbyScreen(root, state);
  appendControls();
  appendLog(state);
}

function appendControls() {
  const panel = document.createElement('section');
  panel.className = 'panel';
  for (const item of [
    ['ready-all', 'Ready All'],
    ['roll-dice', 'Roll Dice'],
    ['move-player', 'Move Current Player']
  ]) {
    const control = document.createElement('button');
    control.textContent = item[1];
    control.dataset.action = item[0];
    panel.appendChild(control);
  }
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
  if (action === 'move-player') actions.move(boardRows);
  render();
});

boot();
