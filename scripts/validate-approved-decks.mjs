import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const runtimePath = 'digital/weedopolis-web/js/weedopolis-approved-decks.js';
const indexPath = 'digital/weedopolis-web/index.html';
const runtime = fs.readFileSync(runtimePath, 'utf8');
const html = fs.readFileSync(indexPath, 'utf8');

const log = [];
const game = {
  state: null,
  load() { return false; },
  applyCard(card) { this.lastDelegatedCard = card; },
  currentPlayer() { return this.state.players[this.state.turn]; },
  log(message) { log.push(message); },
  emit() { this.emitted = true; },
  moveBy(player, steps) { this.lastMove = { player, steps }; }
};

const sandbox = {
  window: {
    WEEDOPOLIS_EDITION: { decks: {} },
    WeedopolisGame: game
  },
  console
};
vm.runInNewContext(runtime, sandbox, { filename: runtimePath });

const approved = sandbox.window.WEEDOPOLIS_APPROVED_DECKS;
assert(approved, 'approved deck contract must be exposed');
assert.equal(approved.version, 'approved-physical-masters-v1');
assert.equal(approved.highChanceCount, 15, 'High Chance must contain exactly 15 approved physical masters');
assert.equal(approved.communityStashCount, 16, 'Community Stash must contain exactly 16 approved physical masters');
assert.equal(approved.highChance.length, 15);
assert.equal(approved.communityStash.length, 16);
assert.equal(sandbox.window.WEEDOPOLIS_EDITION.decks.highChance.length, 15);
assert.equal(sandbox.window.WEEDOPOLIS_EDITION.decks.communityStash.length, 16);

function assertNumbering(cards, label) {
  assert.deepEqual(Array.from(cards, (card) => card.approvedNumber), Array.from({ length: cards.length }, (_, index) => index + 1), `${label} numbering must be continuous`);
  assert.equal(new Set(Array.from(cards, (card) => card.sourceFile)).size, cards.length, `${label} master filenames must be unique`);
}
assertNumbering(approved.highChance, 'High Chance');
assertNumbering(approved.communityStash, 'Community Stash');

const highExpected = [
  'High_Chance_01_Green_Rush_Bonus_Collect_100.png',
  'High_Chance_02_Hosted_Session_Pay_25_Each.png',
  'High_Chance_03_Rare_Genetics_Collect_150.png',
  'High_Chance_04_Security_Upgrades_Pay_50.png',
  'High_Chance_05_Nearest_Station_Double_Rent.png',
  'High_Chance_06_Nearest_Dispensary_Pay_Rent.png',
  'High_Chance_07_Edible_Kicked_In_Move_Back_3.png',
  'High_Chance_08_Advance_to_START_Collect_200.png',
  'High_Chance_09_Dispensary_Inspection_Fee.png',
  'High_Chance_10_Move_Forward_3_Spaces.png',
  'High_Chance_11_Rent_Due_Pay_Bank_75.png',
  'High_Chance_12_Go_Directly_to_Trim_Jail.png',
  'High_Chance_13_Strain_Went_Viral_Collect_25_Each.png',
  'High_Chance_14_Forgotten_Jar_Collect_50.png',
  'High_Chance_15_Move_to_Hybrid_Station.png'
];
assert.deepEqual(Array.from(approved.highChance, (card) => card.sourceFile), highExpected);

const stashExpected = [
  'Community_Stash_Birthday_Blunt_Rotation_Collect_10_Each_Player.png',
  'Community_Stash_Friend_Brought_Snacks_Collect_25.png',
  'Community_Card_03_Festival_Pay_60.png',
  'Community_Stash_Cleaned_Smoke_Room_Collect_40.png',
  'Community_Stash_Donated_Seeds_Collect_50.png',
  'Community_Card_06_Recovery_Day_Collect_20.png',
  'Community_Stash_Local_Raffle_Collect_75.png',
  'Community_Stash_Tax_Refund_Collect_100.png',
  'Community_Card_09_Snacks_Collect_10_Each.png',
  'Community_Card_10_Forgot_Lighter_Pay_25.png',
  'Community_Card_11_Homie_Paid_Back_Collect_50.png',
  'Community_Card_12_Seed_Swap_Collect_75.png',
  'Community_Card_13_Jar_Broke_Pay_50.png',
  'Community_Card_14_Grower_Help_Collect_25.png',
  'Community_Card_15_Get_Out_of_Trim_Jail_Free.png',
  'Community_Card_16_Local_Grow_Off_Collect_100.png'
];
assert.deepEqual(Array.from(approved.communityStash, (card) => card.sourceFile), stashExpected);

const high4 = approved.highChance[3];
assert.equal(high4.action, 'money');
assert.equal(high4.value, -50);
const high5 = approved.highChance[4];
assert.equal(high5.action, 'nearestCategory');
assert.equal(high5.value, 2);
const high6 = approved.highChance[5];
assert.equal(high6.action, 'nearestDispensary');
const high9 = approved.highChance[8];
assert.equal(high9.action, 'repair');
assert.deepEqual(Array.from(high9.value), [40, 115]);
const high13 = approved.highChance[12];
assert.equal(high13.action, 'collectEach');
assert.equal(high13.value, 25);
const high15 = approved.highChance[14];
assert.equal(high15.action, 'moveTo');
assert.equal(high15.value, 25);
const stash15 = approved.communityStash[14];
assert.equal(stash15.action, 'jailFree');
assert.equal(stash15.value, 'communityStash');

// Verify the one rule the base engine does not natively support: move to the
// nearest property upgraded to a Dispensary, with ordinary landing/rent logic
// delegated through moveBy.
game.state = {
  turn: 0,
  phase: 'action',
  pending: { type: 'card', card: high6 },
  players: [{ id: 0, name: 'Player 1', position: 3, money: 1500 }],
  spaces: Array.from({ length: 40 }, (_, index) => ({ index, name: `Space ${index + 1}`, type: 'property', upgrades: 0 }))
};
game.state.spaces[8].upgrades = 5;
game.applyCard(high6);
assert.equal(game.lastMove.steps, 5, 'nearest Dispensary rule must move forward to the first upgraded Dispensary property');

const enginePos = html.indexOf('js/weedopolis-engine.js');
const approvedPos = html.indexOf('js/weedopolis-approved-decks.js');
const uiPos = html.indexOf('js/weedopolis-ui.js');
assert(enginePos >= 0 && approvedPos > enginePos && uiPos > approvedPos, 'approved deck module must load after engine and before UI');
assert(runtime.includes('Updated saved game to the approved 15 High Chance / 16 Community Stash decks.'), 'saved-game deck migration must remain enabled');

console.log('Approved Weedopolis deck validation passed: 15 High Chance + 16 Community Stash masters, nearest-Dispensary rule, and saved-game migration locked.');
