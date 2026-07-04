export function el(tag, options = {}, children = []) {
  const node = document.createElement(tag);
  if (options.className) node.className = options.className;
  if (options.text) node.textContent = options.text;
  if (options.dataset) {
    for (const [key, value] of Object.entries(options.dataset)) node.dataset[key] = value;
  }
  for (const child of children) node.appendChild(child);
  return node;
}

export function button(action, label) {
  return el('button', { text: label, dataset: { action } });
}

export function clear(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
}
