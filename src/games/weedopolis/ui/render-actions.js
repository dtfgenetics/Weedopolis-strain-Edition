import { button } from './dom.js';

export function renderActions(container, actions) {
  for (const action of actions) {
    container.appendChild(button(action.id, action.label));
  }
}
