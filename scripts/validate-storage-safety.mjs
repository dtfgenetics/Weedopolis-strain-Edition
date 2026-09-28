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

console.log('Weedopolis restricted-storage runtime contract passed.');
