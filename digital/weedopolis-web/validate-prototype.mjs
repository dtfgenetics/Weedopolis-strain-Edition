import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const root = new URL('./', import.meta.url);
const read = (name) => readFile(new URL(name, root), 'utf8');

const [html, css, editionSource, engineSource, uiSource, testsSource] = await Promise.all([
  read('index.html'),
  read('styles.css'),
  read('js/weedopolis-edition.js'),
  read('js/weedopolis-engine.js'),
  read('js/weedopolis-ui.js'),
  read('js/weedopolis-tests.js')
]);

// Parse every script before executing any of them.
for (const [name, source] of [
  ['weedopolis-edition.js', editionSource],
  ['weedopolis-engine.js', engineSource],
  ['weedopolis-ui.js', uiSource],
  ['weedopolis-tests.js', testsSource]
]) {
  assert.doesNotThrow(() => new vm.Script(source, { filename: name }), `${name} must have valid JavaScript syntax`);
}

const storage = new Map();
const sandbox = {
  console,
  Math,
  Date,
  JSON,
  setTimeout,
  clearTimeout,
  localStorage: {
    getItem(key) {
      return storage.has(key) ? storage.get(key) : null;
    },
    setItem(key, value) {
      storage.set(key, String(value));
    },
    removeItem(key) {
      storage.delete(key);
    }
  }
};
sandbox.window = sandbox;
vm.createContext(sandbox);
vm.runInContext(editionSource, sandbox, { filename: 'weedopolis-edition.js' });
vm.runInContext(engineSource, sandbox, { filename: 'weedopolis-engine.js' });
vm.runInContext(testsSource, sandbox, { filename: 'weedopolis-tests.js' });

const data = sandbox.WEEDOPOLIS_EDITION;
const game = sandbox.WeedopolisGame;
assert.ok(data, 'Edition data must be exposed');
assert.ok(game, 'Game engine must be exposed');
assert.equal(data.gameName, 'Weedopolis');
assert.equal(data.edition, 'Strain City Edition');
assert.equal(data.spaces.length, 40, 'Board must contain exactly 40 spaces');
assert.equal(data.spaces[0].name, 'Start Session');
assert.equal(data.spaces[39].name, 'Permanent Marker');
assert.equal(data.spaces.filter((space) => space.type === 'property').length, 22);
assert.equal(data.spaces.filter((space) => space.type === 'corner').length, 4);
assert.equal(data.spaces.filter((space) => space.type === 'category').length, 4);
assert.equal(data.spaces.filter((space) => space.type === 'utility').length, 2);
assert.equal(data.decks.highChance.length, 24);
assert.equal(data.decks.communityStash.length, 24);
assert.equal(sandbox.runWeedopolisTests(), true, 'Existing browser data tests must pass');

const requiredMethods = [
  'newGame',
  'load',
  'save',
  'clearSave',
  'rollDice',
  'payToLeaveJail',
  'buyCurrent',
  'declineCurrent',
  'auctionCurrent',
  'nextTurn',
  'canUpgrade',
  'upgrade',
  'mortgage',
  'unmortgage',
  'activePlayers'
];
for (const method of requiredMethods) {
  assert.equal(typeof game[method], 'function', `Game engine must expose ${method}()`);
  assert.match(uiSource, new RegExp(`Game\\.${method}\\b`), `UI must reference ${method}()`);
}

game.newGame(['Alpha', 'Beta']);
assert.equal(game.state.players.length, 2);
assert.equal(game.state.players[0].money, 1500);
assert.equal(game.state.spaces.length, 40);
assert.equal(storage.has('weedopolis.strain.city.local.v1'), true, 'New games must persist locally');
assert.equal(game.load(), true, 'Saved games must load');

assert.match(html, /<title>Weedopolis: Strain City Edition \| DTF Genetics<\/title>/);
assert.match(html, /name="description"/);
assert.match(html, /rel="canonical" href="https:\/\/dtfseeds\.com\/games\/weedopolis\/"/);
assert.match(html, /application\/ld\+json/);
assert.match(html, /<h1>Weedopolis<\/h1>/);
assert.match(html, /<noscript>/);
assert.doesNotMatch(html, /Game prototype/i, 'Public shell must not label itself as a generic placeholder prototype');

assert.ok(css.length > 5000, 'Production stylesheet must not be a placeholder');
for (const selector of ['.board', '.tile', '.sidebar', '.player-token', '.visually-hidden']) {
  assert.ok(css.includes(selector), `Stylesheet must include ${selector}`);
}
assert.doesNotMatch(css, /Minimal stylesheet placeholder/i);
assert.doesNotMatch(uiSource, /Minimal Weedopolis UI placeholder/i);

const expectedBoardMapping = new Map([
  [1, [11, 11]],
  [10, [11, 2]],
  [11, [11, 1]],
  [20, [2, 1]],
  [21, [1, 1]],
  [30, [1, 10]],
  [31, [1, 11]],
  [40, [10, 11]]
]);
for (const [space, [row, column]] of expectedBoardMapping) {
  const mappingPattern = new RegExp(`spaceNumber\\s*===\\s*${space}[^}]*row:\\s*${row}[^}]*column:\\s*${column}`);
  assert.match(uiSource, mappingPattern, `Board mapping for space ${space} must remain correct`);
}

console.log('Weedopolis prototype validation passed:', {
  spaces: data.spaces.length,
  players: game.state.players.length,
  highChanceCards: data.decks.highChance.length,
  communityStashCards: data.decks.communityStash.length,
  stylesheetBytes: css.length
});
