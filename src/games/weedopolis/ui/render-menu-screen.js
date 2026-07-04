import { el, clear } from './dom.js';
import { mainMenuModel } from './main-menu-model.js';
import { renderTitle } from './render-title.js';
import { renderActions } from './render-actions.js';

export function renderMenuScreen(root) {
  const model = mainMenuModel();
  clear(root);
  renderTitle(root, model.title, model.edition);
  const panel = el('div', { className: 'weedopolis-actions' });
  renderActions(panel, model.actions);
  root.appendChild(panel);
}
