import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync('digital/weedopolis-web/index.html', 'utf8');
const interactions = fs.readFileSync('digital/weedopolis-web/production-interactions.css', 'utf8');
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
  'js/weedopolis-ui.js',
  'production-interactions.css'
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

for (const forbidden of [
  'Weedopolis V1 production master board',
  'Verified V1 deed mapping',
  'Gameplay uses the Weedopolis V1 square-board master as the visual authority'
]) {
  assert(!html.includes(forbidden), `player-facing production HTML leaks internal wording: ${forbidden}`);
}

for (const required of [
  'min-height:44px',
  'touch-action:manipulation',
  'env(safe-area-inset-bottom)',
  '.tile.current-space::after',
  'content:"ACTIVE"',
  '@media(forced-colors:active)',
  '@media(prefers-reduced-motion:reduce)'
]) {
  assert(interactions.includes(required), `production interaction layer missing: ${required}`);
}

console.log('Weedopolis production surface validation passed');
