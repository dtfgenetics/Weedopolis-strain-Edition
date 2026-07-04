import { el, clear, button } from './dom.js';
import { lobbyViewModel } from './lobby-view-model.js';
import { renderPlayerList } from './render-player-list.js';

export function renderLobbyScreen(root, lobby) {
  const model = lobbyViewModel(lobby);
  clear(root);
  root.appendChild(el('h2', { text: 'Weedopolis Lobby' }));
  root.appendChild(el('p', { text: `Game Code: ${model.inviteCode}` }));
  root.appendChild(el('p', { text: `Invite Link: ${model.inviteUrl}` }));
  root.appendChild(button('copy-invite', 'Copy Invite Link'));
  root.appendChild(renderPlayerList(model.players));
  root.appendChild(button('start-game', model.canStart ? 'Start Game' : 'Waiting for Ready'));
}
