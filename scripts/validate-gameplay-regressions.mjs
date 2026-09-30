import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const editionSource = fs.readFileSync("digital/weedopolis-web/js/weedopolis-edition.js", "utf8");
const engineSource = fs.readFileSync("digital/weedopolis-web/js/weedopolis-engine.js", "utf8");

const storage = new Map();
const localStorage = {
  getItem(key) { return storage.has(key) ? storage.get(key) : null; },
  setItem(key, value) { storage.set(key, String(value)); },
  removeItem(key) { storage.delete(key); }
};

const window = { localStorage, __WEEDOPOLIS_TESTING__: true };
const context = vm.createContext({
  window,
  console,
  Date,
  Math,
  JSON,
  DOMException,
  setTimeout,
  clearTimeout
});

vm.runInContext(editionSource, context, { filename: "weedopolis-edition.js" });
vm.runInContext(engineSource, context, { filename: "weedopolis-engine.js" });

const data = window.WEEDOPOLIS_EDITION;
const game = window.WeedopolisGame;
assert.ok(data, "edition data must initialize");
assert.ok(game, "game engine must initialize");

function freshGame(names = ["Buyer", "Owner"]) {
  game.newGame(names);
  return game.state;
}

function namesFor(count) {
  return Array.from({ length: count }, (_, index) => `Tester ${index + 1}`);
}

assert.equal(data.spaces.length, 40, "board must have 40 spaces");
assert.equal(data.decks.highChance.length, 24, "High Chance deck must have 24 cards");
assert.equal(data.decks.communityStash.length, 24, "Community Stash deck must have 24 cards");

let state = freshGame();
let buyer = state.players[0];
buyer.position = 1;
game.resolveLanding(buyer);
assert.equal(state.pending?.type, "buy", "unowned property must offer purchase");
game.buyCurrent();
assert.equal(state.spaces[1].owner, buyer.id, "purchase must assign owner");
assert.equal(buyer.money, 1440, "purchase must deduct 60 Bud Bucks");

state = freshGame();
let renter = state.players[0];
let owner = state.players[1];
state.spaces[1].owner = owner.id;
renter.position = 1;
game.resolveLanding(renter);
assert.equal(renter.money, 1498, "base rent must debit renter");
assert.equal(owner.money, 1502, "base rent must credit owner");

state = freshGame();
state.spaces[1].owner = 1;
state.spaces[3].owner = 1;
state.players[0].position = 1;
game.resolveLanding(state.players[0]);
assert.equal(state.players[0].money, 1496, "full color group must double unimproved rent");
assert.equal(state.players[1].money, 1504, "double rent must credit owner");

for (const [index, expectedRent] of [25, 50, 100, 200].entries()) {
  state = freshGame();
  const premiumLines = state.spaces.filter((space) => space.type === "category");
  for (let ownedIndex = 0; ownedIndex <= index; ownedIndex += 1) {
    premiumLines[ownedIndex].owner = 1;
  }
  const before = state.players[0].money;
  game.payRent(state.players[0], premiumLines[0]);
  assert.equal(before - state.players[0].money, expectedRent, `Premium Line rent mismatch at ownership count ${index + 1}`);
}

state = freshGame();
let utilities = state.spaces.filter((space) => space.type === "utility");
utilities[0].owner = 1;
state.lastDiceTotal = 8;
game.payRent(state.players[0], utilities[0]);
assert.equal(state.players[0].money, 1468, "one utility must charge 4x dice total");

state = freshGame();
utilities = state.spaces.filter((space) => space.type === "utility");
utilities[0].owner = 1;
utilities[1].owner = 1;
state.lastDiceTotal = 8;
game.payRent(state.players[0], utilities[0]);
assert.equal(state.players[0].money, 1420, "two utilities must charge 10x dice total");

state = freshGame();
let card = data.decks.highChance.find((item) => item.action === "money" && item.value === 50);
assert.ok(card, "High Chance +50 card must exist");
game.applyCard(card);
assert.equal(state.players[0].money, 1550, "money card must update Bud Bucks");

state = freshGame();
state.players[0].position = 5;
card = data.decks.highChance.find((item) => item.action === "moveTo" && item.value === 0);
assert.ok(card, "Advance to Start Session card must exist");
game.applyCard(card);
assert.equal(state.players[0].position, 0, "move card must reach Start Session");
assert.equal(state.players[0].money, 1700, "passing to Start Session must award 200");

state = freshGame(["Collector", "Player 2", "Player 3"]);
card = data.decks.communityStash.find((item) => item.action === "collectEach" && item.value === 10);
assert.ok(card, "collect-each card must exist");
game.applyCard(card);
assert.equal(state.players[0].money, 1520, "collect-each must credit active player");
assert.equal(state.players[1].money, 1490, "collect-each must debit other players");

state = freshGame();
state.players[0].position = 30;
game.resolveLanding(state.players[0]);
assert.equal(state.players[0].inJail, true, "Compliance Check must set Trim Jail");
assert.equal(state.players[0].position, data.trimJailIndex, "Compliance Check must move player to Trim Jail");

state = freshGame();
state.players[0].position = 1;
game.resolveLanding(state.players[0]);
game.declineCurrent();
game.auctionCurrent({ 0: 70, 1: 85 });
assert.equal(state.spaces[1].owner, 1, "auction must assign highest valid bidder");
assert.equal(state.players[1].money, 1415, "auction must deduct winning bid");

state = freshGame();
state.spaces[1].owner = 0;
game.mortgage(1);
assert.equal(state.spaces[1].mortgaged, true, "mortgage must mark property");
assert.equal(state.players[0].money, 1530, "mortgage must pay listed value");
game.unmortgage(1);
assert.equal(state.spaces[1].mortgaged, false, "unmortgage must restore property");
assert.equal(state.players[0].money, 1497, "unmortgage must charge mortgage plus 10 percent");

state = freshGame();
state.spaces[1].owner = 0;
state.spaces[3].owner = 0;
for (let level = 0; level < 4; level += 1) {
  game.upgrade(1);
  game.upgrade(3);
}
game.upgrade(1);
assert.equal(state.spaces[1].upgrades, 5, "fifth upgrade must create Dispensary");
assert.equal(state.spaces[3].upgrades, 4, "upgrades must remain evenly distributed");

for (const playerCount of [2, 8]) {
  state = freshGame(namesFor(playerCount));
  assert.equal(state.players.length, playerCount, `game must support ${playerCount} players`);
  for (let turn = 0; turn < playerCount * 2; turn += 1) game.nextTurn();
  assert.ok(state.turn >= 0 && state.turn < playerCount, "turn index must stay in active player list");
}

state = freshGame(["Saved Grower", "Saved Partner"]);
state.players[0].position = 17;
game.save();
game.state = null;
assert.equal(game.load(), true, "saved Weedopolis session must load");
assert.equal(game.state.players[0].name, "Saved Grower", "save must preserve player names");
assert.equal(game.state.players[0].position, 17, "save must preserve position");

console.log("Weedopolis gameplay regression validation passed.");
