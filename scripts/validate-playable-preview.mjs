import assert from 'node:assert/strict';
import fs from 'node:fs';

const root = 'digital/weedopolis-web';
const html = fs.readFileSync(`${root}/index.html`, 'utf8');
const style = fs.readFileSync(`${root}/styles.css`, 'utf8');
const ui = fs.readFileSync(`${root}/js/weedopolis-ui.js`, 'utf8');
const engine = fs.readFileSync(`${root}/js/weedopolis-engine.js`, 'utf8');
const edition = fs.readFileSync(`${root}/js/weedopolis-edition.js`, 'utf8');
const manifest = JSON.parse(fs.readFileSync(`${root}/assets/asset-manifest.json`, 'utf8'));

for (const required of [
  'id="board"',
  'id="setupPanel"',
  'id="playerNameGrid"',
  'id="turnPanel"',
  'id="playersPanel"',
  'id="managePanel"',
  'id="logPanel"',
  'js/weedopolis-edition.js',
  'js/weedopolis-engine.js',
  'js/weedopolis-ui.js',
  'https://dtfseeds.com/games/weedopolis/'
]) {
  assert(html.includes(required), `missing playable Weedopolis markup: ${required}`);
}

assert(style.includes('grid-template-columns: repeat(11'), 'board must remain an 11x11 perimeter layout');
assert(style.includes('.player-token'), 'player tokens must be styled on the board');
assert(style.includes('@media'), 'playable build must retain responsive layout rules');

for (const required of ['boardPosition', 'renderBoard', 'buildPlayerInputs', 'player-token']) {
  assert(ui.includes(required), `missing playable UI behavior: ${required}`);
}
for (const required of ['rollDice', 'buy', 'auction', 'mortgage', 'upgrade']) {
  assert(engine.toLowerCase().includes(required.toLowerCase()), `missing game engine behavior: ${required}`);
}
assert(edition.includes('WEEDOPOLIS_EDITION'), 'edition data must be exposed to the browser runtime');
assert.equal(manifest.spaces.expected_count, 40, 'asset manifest must describe all 40 board spaces');
assert.equal(manifest.deeds.expected_count, 28, 'asset manifest must describe all 28 ownership cards');

console.log('full Weedopolis playable build validation passed');
