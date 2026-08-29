import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = 'digital/weedopolis-web';
const html = fs.readFileSync(`${root}/index.html`, 'utf8');
const style = fs.readFileSync(`${root}/styles.css`, 'utf8');
const approvedStyle = fs.readFileSync(`${root}/approved-assets.css`, 'utf8');
const ui = fs.readFileSync(`${root}/js/weedopolis-ui.js`, 'utf8');
const engine = fs.readFileSync(`${root}/js/weedopolis-engine.js`, 'utf8');
const edition = fs.readFileSync(`${root}/js/weedopolis-edition.js`, 'utf8');
const manifest = JSON.parse(fs.readFileSync(`${root}/assets/asset-manifest.json`, 'utf8'));
const buildScript = fs.readFileSync('scripts/build-production-preview.mjs', 'utf8');

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
  'approved-assets.css',
  'assets/board/weedopolis-master-board.webp',
  'Approved Weedopolis V1 master board',
  'https://dtfseeds.com/games/weedopolis/'
]) {
  assert(html.includes(required), `missing playable Weedopolis markup: ${required}`);
}

assert(style.includes('grid-template-columns: repeat(11'), 'board must remain an 11x11 perimeter layout');
assert(style.includes('.player-token'), 'player tokens must be styled on the board');
assert(style.includes('@media'), 'playable build must retain responsive layout rules');
assert(approvedStyle.includes('.approved-board-panel'), 'approved board artwork styling must be present');

for (const required of ['boardPosition', 'renderBoard', 'buildPlayerInputs', 'player-token']) {
  assert(ui.includes(required), `missing playable UI behavior: ${required}`);
}
for (const required of ['rollDice', 'buy', 'auction', 'mortgage', 'upgrade']) {
  assert(engine.toLowerCase().includes(required.toLowerCase()), `missing game engine behavior: ${required}`);
}
assert(edition.includes('WEEDOPOLIS_EDITION'), 'edition data must be exposed to the browser runtime');
assert.equal(manifest.board.version, 'V1', 'digital game must use Weedopolis V1, not the separate V2/Hex edition');
assert.equal(manifest.board.layout, 'classic 40-space square board');
assert.equal(manifest.board.assembled_board, 'assets/board/weedopolis-master-board.webp');
assert.equal(manifest.spaces.expected_count, 40, 'asset manifest must describe all 40 board spaces');
assert.equal(manifest.deeds.expected_count, 28, 'asset manifest must describe all 28 ownership cards');

const chunkRoot = path.join(root, 'assets/board/v1-master-b64');
const chunks = fs.readdirSync(chunkRoot).filter((name) => /^part-\d+\.txt$/.test(name)).sort();
assert.equal(chunks.length, 13, `expected 13 V1 board chunks, found ${chunks.length}`);
const boardBase64 = chunks.map((name) => fs.readFileSync(path.join(chunkRoot, name), 'utf8').trim()).join('');
const boardBytes = Buffer.from(boardBase64, 'base64');
assert(boardBytes.length >= 30000, `approved V1 board asset unexpectedly small: ${boardBytes.length}`);
assert.equal(boardBytes.subarray(0, 4).toString('ascii'), 'RIFF', 'approved board must be RIFF WebP');
assert.equal(boardBytes.subarray(8, 12).toString('ascii'), 'WEBP', 'approved board must be WebP');
assert(buildScript.includes('weedopolis-master-board.webp'), 'production build must reconstruct approved board artwork');
assert(buildScript.includes('v1-master-b64'), 'production build must use locked V1 board chunks');

console.log(`full Weedopolis playable build validation passed; approved V1 board ${boardBytes.length} bytes`);
