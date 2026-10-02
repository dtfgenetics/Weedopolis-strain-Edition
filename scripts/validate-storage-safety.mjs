import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync('digital/weedopolis-web/js/weedopolis-engine.js', 'utf8');

const blockedWindow = {
  WEEDOPOLIS_EDITION: {
    startMoney: 1500,
    spaces: [],
    decks: { highChance: [], communityStash: [] },
    passStartBonus: 200,
    trimJailIndex: 10,
    categoryRent: [25, 50, 100, 200],
    utilityMultipliers: { one: 4, both: 10 }
  }
};

Object.defineProperty(blockedWindow, 'localStorage', {
  configurable: true,
  get() {
    throw new DOMException('Storage blocked', 'SecurityError');
  }
});

const context = vm.createContext({
  window: blockedWindow,
  console,
  Date,
  Math,
  JSON,
  DOMException
});

vm.runInContext(source, context, { filename: 'weedopolis-engine.js' });

const game = blockedWindow.WeedopolisGame;
assert.ok(game, 'engine should initialize even when localStorage access throws');
assert.equal(game.SAVE_VERSION, 1, 'Weedopolis save schema version must remain explicit');
assert.equal(game.load(), false, 'blocked storage should behave like no saved game');
assert.doesNotThrow(() => game.clearSave(), 'clearing a save must tolerate blocked storage');
game.state = { players: [], spaces: [], turn: 0, log: [] };
assert.doesNotThrow(() => game.save(), 'saving must tolerate blocked storage');

assert.match(source, /function storageGet\(key\)/);
assert.match(source, /function storageSet\(key, value\)/);
assert.match(source, /function storageRemove\(key\)/);
assert.doesNotMatch(source, /\blocalStorage\.getItem\(/);
assert.doesNotMatch(source, /\blocalStorage\.setItem\(/);
assert.doesNotMatch(source, /\blocalStorage\.removeItem\(/);

{
  const saved = new Map();
  const storageWindow = {
    WEEDOPOLIS_EDITION: blockedWindow.WEEDOPOLIS_EDITION,
    localStorage: {
      getItem(key) { return saved.get(key) ?? null; },
      setItem(key, value) { saved.set(key, String(value)); },
      removeItem(key) { saved.delete(key); }
    }
  };
  const storageContext = vm.createContext({ window: storageWindow, console, Date, Math, JSON, DOMException });
  vm.runInContext(source, storageContext, { filename: 'weedopolis-engine.js' });
  const versioned = storageWindow.WeedopolisGame;
  versioned.state = { players: [], spaces: [], turn: 0, log: [] };
  versioned.save();
  const raw = [...saved.values()][0];
  const payload = JSON.parse(raw);
  assert.equal(payload.version, 1, 'saved game must use explicit schema version');
  assert.ok(payload.savedAt, 'saved game must record savedAt');
  assert.deepEqual(payload.state.players, [], 'saved envelope must wrap gameplay state');

  saved.clear();
  saved.set('weedopolis.strain.city.local.v1', JSON.stringify({ players: [], spaces: [], turn: 0, log: [] }));
  assert.equal(versioned.load(), true, 'legacy raw v1 state should migrate into the versioned envelope');
  const migrated = JSON.parse(saved.get('weedopolis.strain.city.local.v1'));
  assert.equal(migrated.version, 1, 'legacy save should be rewritten into versioned envelope');
}

console.log('Weedopolis restricted-storage and save-version runtime contract passed.');
