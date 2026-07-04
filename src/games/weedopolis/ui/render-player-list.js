import { el } from './dom.js';

export function renderPlayerList(players) {
  const list = el('ul', { className: 'weedopolis-player-list' });
  for (const player of players) {
    const status = player.ready ? 'Ready' : 'Not Ready';
    list.appendChild(el('li', { text: `${player.name} — ${status}`, dataset: { playerId: player.id } }));
  }
  return list;
}
