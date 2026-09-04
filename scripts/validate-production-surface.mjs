import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync('digital/weedopolis-web/index.html', 'utf8');
const solvency = fs.readFileSync('digital/weedopolis-web/js/weedopolis-solvency.js', 'utf8');

assert(!html.includes('weedopolis-tests.js'), 'production HTML must not load the browser test harness');
assert(!html.includes('runWeedopolisTests'), 'production HTML must not expose test-only controls or hooks');

for (const required of [
  'js/weedopolis-edition.js',
  'js/weedopolis-master-overrides.js',
  'js/weedopolis-assets.js',
  'js/weedopolis-engine.js',
  'js/weedopolis-solvency.js',
  'js/weedopolis-approved-decks.js',
  'js/weedopolis-ui.js'
]) {
  assert(html.includes(required), `production runtime is missing ${required}`);
}

assert(
  html.indexOf('js/weedopolis-engine.js') < html.indexOf('js/weedopolis-solvency.js') &&
  html.indexOf('js/weedopolis-solvency.js') < html.indexOf('js/weedopolis-ui.js'),
  'solvency guard must load after the engine and before the UI'
);

for (const required of [
  'Game.resolveSolvency',
  'Game.nextTurn',
  'automatically sold',
  'automatically mortgaged',
  'Properties returned to the bank'
]) {
  assert(solvency.includes(required), `solvency guard is missing behavior marker: ${required}`);
}

console.log('Weedopolis production surface validation passed');
