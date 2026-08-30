import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = 'digital/weedopolis-web';
const html = fs.readFileSync(`${root}/index.html`, 'utf8');
const style = fs.readFileSync(`${root}/styles.css`, 'utf8');
const approvedStyle = fs.readFileSync(`${root}/approved-assets.css`, 'utf8');
const runtimeAssetStyle = fs.readFileSync(`${root}/runtime-assets.css`, 'utf8');
const masterOverlayStyle = fs.readFileSync(`${root}/master-board-overlay.css`, 'utf8');
const masterOverrides = fs.readFileSync(`${root}/js/weedopolis-master-overrides.js`, 'utf8');
const assetRegistry = fs.readFileSync(`${root}/js/weedopolis-assets.js`, 'utf8');
const visualContract = fs.readFileSync(`${root}/MASTER_VISUAL_CONTRACT.md`, 'utf8');
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
  'id="currentBalance"',
  'id="mobileRollBtn"',
  'id="propertyArtSlot"',
  'id="propertyAssetChip"',
  'data-ui-standard="premium-responsive-shell-v1"',
  'data-art-standard="weedopolis-v1-master"',
  'data-art-status="v1-master-loaded"',
  'js/weedopolis-edition.js',
  'js/weedopolis-master-overrides.js',
  'js/weedopolis-assets.js',
  'js/weedopolis-engine.js',
  'js/weedopolis-ui.js',
  'approved-assets.css',
  'runtime-assets.css',
  'master-board-overlay.css',
  'https://dtfseeds.com/games/weedopolis/'
]) {
  assert(html.includes(required), `missing playable Weedopolis markup: ${required}`);
}

assert(style.includes('grid-template-columns: repeat(11'), 'board must remain an 11x11 perimeter layout');
assert(style.includes('.player-token'), 'player tokens must be styled on the board');
assert(style.includes('@media'), 'playable build must retain responsive layout rules');
assert(approvedStyle.includes('.game-command-bar'), 'premium command bar styling must be present');
assert(approvedStyle.includes('.game-shell'), 'premium responsive game shell must be present');
assert(approvedStyle.includes('.mobile-game-dock'), 'mobile game dock styling must be present');
assert(runtimeAssetStyle.includes('.property-art-slot img'), 'verified deed image presentation must be styled');
assert(runtimeAssetStyle.includes('.selected-property-summary'), 'selected property summary styling must be present');
assert(masterOverlayStyle.includes("url('assets/board/weedopolis-master-board.webp')"), 'V1 master board must be the visible board artwork');
assert(masterOverlayStyle.includes('.board-frame .tile'), 'interactive tile overlay styling must be present');

for (const required of [
  'boardPosition',
  'renderBoard',
  'buildPlayerInputs',
  'player-token',
  'renderPropertyArt',
  'selectedSpaceIndex',
  'syncTopControls',
  'mobileRollButton.addEventListener',
  'ASSETS.bySpaceIndex'
]) {
  assert(ui.includes(required), `missing playable UI behavior: ${required}`);
}
for (const required of ['rollDice', 'buy', 'auction', 'mortgage', 'upgrade']) {
  assert(engine.toLowerCase().includes(required.toLowerCase()), `missing game engine behavior: ${required}`);
}
assert(edition.includes('WEEDOPOLIS_EDITION'), 'edition data must be exposed to the browser runtime');

const lockedColors = {
  brown: '#683417',
  light_blue: '#1C78A4',
  pink: '#7B1139',
  orange: '#E65101',
  red: '#B70405',
  yellow: '#CC9F19',
  green: '#3C8527',
  dark_blue: '#0C1179'
};
for (const [group, hex] of Object.entries(lockedColors)) {
  assert(masterOverrides.includes(`${group}: '${hex}'`), `missing locked V1 ${group} color ${hex}`);
  assert(assetRegistry.includes(`${group}: '${hex}'`), `ownership asset registry must use locked V1 ${group} color ${hex}`);
}
assert(masterOverrides.includes('v2HexAllowed: false'), 'V2/Hex substitution must remain disabled');
assert(masterOverrides.includes('Weedopolis_Master_Board_20x20in_300dpi.pdf'), 'master board authority must be declared');
assert(visualContract.includes('The mockup board and card illustrations are NOT production masters'), 'visual contract must separate structure approval from artwork approval');
assert(visualContract.includes('Do not regenerate approved board/property artwork'), 'visual contract must forbid regenerated master art');

for (const required of [
  "expectedOwnershipCards: 28",
  "expectedProperties: 22",
  "expectedPremiumLines: 4",
  "expectedUtilities: 2",
  "generatedMockupArtAllowed: false",
  "['green-crack','Green Crack','property',18,180,'orange'",
  "['og-kush','OG Kush','property',38,350,'dark_blue'",
  "['permanent-marker','Permanent Marker','property',40,400,'dark_blue'",
  "['indica','Indica','category',6,200,null",
  "['autoflower','Autoflower','category',36,200,null",
  "['grow-lights','Grow Lights','utility',13,150,null",
  "['water-works','Water Works','utility',29,150,null",
  "swatchPolicy: type === 'property' ? 'match-v1-master-board' : 'preserve-original-card-art'"
]) {
  assert(assetRegistry.includes(required), `missing canonical ownership asset rule: ${required}`);
}
const sourceFileMatches = assetRegistry.match(/_Verified\.png/g) || [];
assert.equal(sourceFileMatches.length, 28, `ownership registry must map 28 verified master filenames; found ${sourceFileMatches.length}`);

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

console.log(`Weedopolis V1 production validation passed; master board ${boardBytes.length} bytes; 28-card registry + premium responsive runtime locked`);
