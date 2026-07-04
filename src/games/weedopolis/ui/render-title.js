import { el } from './dom.js';

export function renderTitle(root, title, subtitle) {
  root.appendChild(el('h1', { text: title }));
  root.appendChild(el('p', { text: subtitle }));
}
