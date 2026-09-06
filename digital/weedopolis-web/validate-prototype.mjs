import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const root = new URL('./', import.meta.url);
const read = (name) => readFile(new URL(name, root), 'utf8');

const [html, css, tradingCss, editionSource, engineSource, tradingSource, uiSource, tradeUiSource, testsSource] = await Promise.all([
  read('index.html'),
  read('styles.css'),
  read('trading.css'),
  read('js/weedopolis-edition.js'),
  read('js/weedopolis-engine.js'),
  read('js/weedopolis-trading.js'),
  read('js/weedopolis-ui.js'),
  read('js/weedopolis-trade-ui.js'),
  read('js/weedopolis-tests.js')
]);

for (const [name, source] of [
  ['weedopolis-edition.js', editionSource],
  ['weedopolis-engine.js', engineSource],
  ['weedopolis-trading.js', tradingSource],
  ['weedopolis-ui.js', uiSource],
  ['weedopolis-trade-ui.js', tradeUiSource],
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
vm.runInContext(tradingSource, sandbox, { filename: 'weedopolis-trading.js' });
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

const engineMethods = [
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
  'tradeEligibility',
  'trade',
  'activePlayers'
];
for (const method of engineMethods) {
  assert.equal(typeof game[method], 'function', `Game engine must expose ${method}()`);
}

const uiMethods = [
  'newGame',
  'load',
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
for (const method of uiMethods) {
  assert.match(uiSource, new RegExp(`Game\\.${method}\\b`), `UI must reference ${method}()`);
}
assert.match(tradeUiSource, /Game\.tradeEligibility\b/, 'Trade Desk must use engine eligibility rules');
assert.match(tradeUiSource, /Game\.trade\b/, 'Trade Desk must execute trades through the engine');
assert.match(tradeUiSource, /Both players reviewed and approve this trade/, 'Local trades require explicit bilateral approval');
assert.match(tradeUiSource, /aria-live/, 'Trade failures must be announced accessibly');

function firstOwnable(excludedIndex = null) {
  return game.state.spaces.find((space) => game.isOwnable(space) && space.index !== excludedIndex);
}

function propertyGroupWithMultipleSpaces() {
  const groups = new Map();
  game.state.spaces.filter((space) => space.type === 'property').forEach((space) => {
    const list = groups.get(space.colorGroup) || [];
    list.push(space);
    groups.set(space.colorGroup, list);
  });
  return [...groups.values()].find((spaces) => spaces.length >= 2);
}

game.newGame(['Alpha', 'Beta']);
assert.equal(game.state.players.length, 2);
assert.equal(game.state.players[0].money, 1500);
assert.equal(game.state.spaces.length, 40);
assert.equal(storage.has('weedopolis.strain.city.local.v1'), true, 'New games must persist locally');
assert.equal(game.load(), true, 'Saved games must load');

// Property trading must move ownership and cash atomically while keeping the current player turn intact.
const alphaSpace = firstOwnable();
const betaSpace = firstOwnable(alphaSpace.index);
alphaSpace.owner = 0;
betaSpace.owner = 1;
const beforeTurn = game.state.turn;
const tradeResult = game.trade({
  targetPlayerId: 1,
  offerSpaceIndex: alphaSpace.index,
  requestSpaceIndex: betaSpace.index,
  offerCash: 100,
  requestCash: 25
});
assert.equal(tradeResult.ok, true, 'Eligible property swap should succeed');
assert.equal(alphaSpace.owner, 1, 'Offered space must transfer to target player');
assert.equal(betaSpace.owner, 0, 'Requested space must transfer to current player');
assert.equal(game.state.players[0].money, 1425, 'Current player cash must settle atomically');
assert.equal(game.state.players[1].money, 1575, 'Target player cash must settle atomically');
assert.equal(game.state.turn, beforeTurn, 'Trading must not advance the turn');
assert.match(game.state.log[0], /traded/, 'Successful trade must be written to the game log');

// A player can also buy an eligible ownership space for cash without offering a property.
game.newGame(['Alpha', 'Beta']);
const cashPurchaseSpace = firstOwnable();
cashPurchaseSpace.owner = 1;
const cashTrade = game.trade({ targetPlayerId: 1, offerSpaceIndex: '', requestSpaceIndex: cashPurchaseSpace.index, offerCash: 300, requestCash: 0 });
assert.equal(cashTrade.ok, true, 'Cash-for-property trade should succeed');
assert.equal(cashPurchaseSpace.owner, 0);
assert.equal(game.state.players[0].money, 1200);
assert.equal(game.state.players[1].money, 1800);

// Mortgaged spaces are deliberately excluded until mortgage-transfer interest rules are authored.
game.newGame(['Alpha', 'Beta']);
const mortgagedSpace = firstOwnable();
mortgagedSpace.owner = 1;
mortgagedSpace.mortgaged = true;
const mortgagedTrade = game.trade({ targetPlayerId: 1, requestSpaceIndex: mortgagedSpace.index, offerCash: 100 });
assert.equal(mortgagedTrade.ok, false);
assert.match(mortgagedTrade.reason, /unmortgaged/i);
assert.equal(mortgagedSpace.owner, 1, 'Rejected trade must not mutate ownership');

// Unimproved members of a color group cannot be traded while another member still has upgrades.
game.newGame(['Alpha', 'Beta']);
const improvedGroup = propertyGroupWithMultipleSpaces();
assert.ok(improvedGroup, 'Expected at least one multi-space property group');
improvedGroup.forEach((space) => { space.owner = 0; });
improvedGroup[1].upgrades = 1;
const splitImprovedGroup = game.trade({ targetPlayerId: 1, offerSpaceIndex: improvedGroup[0].index, offerCash: 0 });
assert.equal(splitImprovedGroup.ok, false);
assert.match(splitImprovedGroup.reason, /group with upgrades/i);
assert.equal(improvedGroup[0].owner, 0, 'Rejected improved-group trade must not mutate ownership');

// Invalid cash offers and unresolved landing phases must fail before mutation.
game.newGame(['Alpha', 'Beta']);
const expensiveTarget = firstOwnable();
expensiveTarget.owner = 1;
const unaffordable = game.trade({ targetPlayerId: 1, requestSpaceIndex: expensiveTarget.index, offerCash: 2000 });
assert.equal(unaffordable.ok, false);
assert.match(unaffordable.reason, /cannot afford/i);
assert.equal(expensiveTarget.owner, 1);
game.state.phase = 'action';
const wrongPhase = game.trade({ targetPlayerId: 1, requestSpaceIndex: expensiveTarget.index, offerCash: 100 });
assert.equal(wrongPhase.ok, false);
assert.match(wrongPhase.reason, /before rolling|after landing/i);

assert.match(html, /<title>Weedopolis: Strain City Edition \| DTF Genetics<\/title>/);
assert.match(html, /name="description"/);
assert.match(html, /rel="canonical" href="https:\/\/dtfseeds\.com\/games\/weedopolis\/"/);
assert.match(html, /application\/ld\+json/);
assert.match(html, /<h1>Weedopolis<\/h1>/);
assert.match(html, /<noscript>/);
assert.match(html, /trading\.css/);
assert.match(html, /js\/weedopolis-trading\.js/);
assert.match(html, /js\/weedopolis-trade-ui\.js/);
assert.ok(html.indexOf('js/weedopolis-engine.js') < html.indexOf('js/weedopolis-trading.js'), 'Trading engine must load after the base engine');
assert.ok(html.indexOf('js/weedopolis-ui.js') < html.indexOf('js/weedopolis-trade-ui.js'), 'Trade Desk must load after the base UI');
assert.doesNotMatch(html, /Game prototype/i, 'Public shell must not label itself as a generic placeholder prototype');

assert.ok(css.length > 5000, 'Production stylesheet must not be a placeholder');
assert.ok(tradingCss.length > 1000, 'Trade Desk stylesheet must not be a placeholder');
for (const selector of ['.board', '.tile', '.sidebar', '.player-token', '.visually-hidden']) {
  assert.ok(css.includes(selector), `Stylesheet must include ${selector}`);
}
for (const selector of ['.trade-desk', '.trade-grid', '.trade-consent', '.trade-execute']) {
  assert.ok(tradingCss.includes(selector), `Trade stylesheet must include ${selector}`);
}
assert.match(tradingCss, /min-height:\s*44px/, 'Trade controls must preserve touch target sizing');
assert.match(tradingCss, /prefers-reduced-motion/, 'Trade layer must preserve reduced-motion behavior');
assert.doesNotMatch(css, /Minimal stylesheet placeholder/i);
assert.doesNotMatch(uiSource, /Minimal Weedopolis UI placeholder/i);

// The renderer must preserve the four-sided 40-space perimeter formulas.
for (const requiredSnippet of [
  'spaceNumber === 1',
  'spaceNumber >= 2 && spaceNumber <= 10',
  '12 - spaceNumber',
  'spaceNumber === 11',
  'spaceNumber >= 12 && spaceNumber <= 20',
  '22 - spaceNumber',
  'spaceNumber === 21',
  'spaceNumber >= 22 && spaceNumber <= 30',
  'spaceNumber - 20',
  'spaceNumber === 31',
  'spaceNumber - 30'
]) {
  assert.ok(uiSource.includes(requiredSnippet), `Board mapping must include: ${requiredSnippet}`);
}

console.log('Weedopolis prototype validation passed:', {
  spaces: data.spaces.length,
  players: game.state.players.length,
  highChanceCards: data.decks.highChance.length,
  communityStashCards: data.decks.communityStash.length,
  stylesheetBytes: css.length,
  tradingStylesheetBytes: tradingCss.length,
  trading: true
});
