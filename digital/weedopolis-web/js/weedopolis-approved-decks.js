/* Approved Weedopolis High Chance + Community Stash runtime contract.
 * Replaces the retired synthetic 24/24 browser decks with the verified
 * 15 High Chance + 16 Community Stash physical masters.
 */
(function () {
  'use strict';

  const DATA = window.WEEDOPOLIS_EDITION;
  const Game = window.WeedopolisGame;
  if (!DATA || !Game) throw new Error('Approved deck runtime requires Weedopolis edition data and engine.');

  function card(deck, number, text, action, value, sourceFile) {
    return {
      id: number - 1,
      approvedNumber: number,
      deck,
      text,
      action,
      value,
      sourceFile,
      webImage: 'assets/decks/' + (deck === 'High Chance' ? 'high-chance' : 'community-stash') + '/' +
        (deck === 'High Chance' ? 'high-chance-' : 'community-stash-') + String(number).padStart(2, '0') + '.webp'
    };
  }

  const highChance = [
    card('High Chance', 1, 'Green rush bonus. Collect 100 Bud Bucks.', 'money', 100, 'High_Chance_01_Green_Rush_Bonus_Collect_100.png'),
    card('High Chance', 2, 'Hosted session. Pay each player 25 Bud Bucks.', 'payEach', 25, 'High_Chance_02_Hosted_Session_Pay_25_Each.png'),
    card('High Chance', 3, 'Rare genetics. Collect 150 Bud Bucks.', 'money', 150, 'High_Chance_03_Rare_Genetics_Collect_150.png'),
    card('High Chance', 4, 'Paranoia hit hard. Pay 50 Bud Bucks for security upgrades.', 'money', -50, 'High_Chance_04_Security_Upgrades_Pay_50.png'),
    card('High Chance', 5, 'Move to the nearest Premium Line. If owned, pay double rent.', 'nearestCategory', 2, 'High_Chance_05_Nearest_Station_Double_Rent.png'),
    card('High Chance', 6, 'Move to the nearest Dispensary property. If owned, pay rent.', 'nearestDispensary', null, 'High_Chance_06_Nearest_Dispensary_Pay_Rent.png'),
    card('High Chance', 7, 'Edible kicked in. Move back 3 spaces.', 'moveRelative', -3, 'High_Chance_07_Edible_Kicked_In_Move_Back_3.png'),
    card('High Chance', 8, 'Advance to Start Session. Collect 200 Bud Bucks.', 'moveTo', 0, 'High_Chance_08_Advance_to_START_Collect_200.png'),
    card('High Chance', 9, 'Dispensary inspection fee. Pay 40 per Grow Tent and 115 per Dispensary.', 'repair', [40, 115], 'High_Chance_09_Dispensary_Inspection_Fee.png'),
    card('High Chance', 10, 'Move forward 3 spaces.', 'moveRelative', 3, 'High_Chance_10_Move_Forward_3_Spaces.png'),
    card('High Chance', 11, 'Rent due. Pay the bank 75 Bud Bucks.', 'money', -75, 'High_Chance_11_Rent_Due_Pay_Bank_75.png'),
    card('High Chance', 12, 'Go directly to Trim Jail.', 'jail', 0, 'High_Chance_12_Go_Directly_to_Trim_Jail.png'),
    card('High Chance', 13, 'Your strain went viral. Collect 25 Bud Bucks from each player.', 'collectEach', 25, 'High_Chance_13_Strain_Went_Viral_Collect_25_Each.png'),
    card('High Chance', 14, 'Forgotten jar. Collect 50 Bud Bucks.', 'money', 50, 'High_Chance_14_Forgotten_Jar_Collect_50.png'),
    card('High Chance', 15, 'Move to Hybrid.', 'moveTo', 25, 'High_Chance_15_Move_to_Hybrid_Station.png')
  ];

  const communityStash = [
    card('Community Stash', 1, 'Birthday blunt rotation. Collect 10 Bud Bucks from each player.', 'collectEach', 10, 'Community_Stash_Birthday_Blunt_Rotation_Collect_10_Each_Player.png'),
    card('Community Stash', 2, 'A friend brought snacks. Collect 25 Bud Bucks.', 'money', 25, 'Community_Stash_Friend_Brought_Snacks_Collect_25.png'),
    card('Community Stash', 3, 'Festival expense. Pay 60 Bud Bucks.', 'money', -60, 'Community_Card_03_Festival_Pay_60.png'),
    card('Community Stash', 4, 'Cleaned the smoke room. Collect 40 Bud Bucks.', 'money', 40, 'Community_Stash_Cleaned_Smoke_Room_Collect_40.png'),
    card('Community Stash', 5, 'Donated seeds. Collect 50 Bud Bucks.', 'money', 50, 'Community_Stash_Donated_Seeds_Collect_50.png'),
    card('Community Stash', 6, 'Recovery day. Collect 20 Bud Bucks.', 'money', 20, 'Community_Card_06_Recovery_Day_Collect_20.png'),
    card('Community Stash', 7, 'Local raffle. Collect 75 Bud Bucks.', 'money', 75, 'Community_Stash_Local_Raffle_Collect_75.png'),
    card('Community Stash', 8, 'Tax refund. Collect 100 Bud Bucks.', 'money', 100, 'Community_Stash_Tax_Refund_Collect_100.png'),
    card('Community Stash', 9, 'Snacks for the smoke circle. Collect 10 Bud Bucks from each player.', 'collectEach', 10, 'Community_Card_09_Snacks_Collect_10_Each.png'),
    card('Community Stash', 10, 'Forgot your lighter. Pay 25 Bud Bucks.', 'money', -25, 'Community_Card_10_Forgot_Lighter_Pay_25.png'),
    card('Community Stash', 11, 'Your homie paid you back. Collect 50 Bud Bucks.', 'money', 50, 'Community_Card_11_Homie_Paid_Back_Collect_50.png'),
    card('Community Stash', 12, 'Seed swap. Collect 75 Bud Bucks.', 'money', 75, 'Community_Card_12_Seed_Swap_Collect_75.png'),
    card('Community Stash', 13, 'A jar broke. Pay 50 Bud Bucks.', 'money', -50, 'Community_Card_13_Jar_Broke_Pay_50.png'),
    card('Community Stash', 14, 'Grower help. Collect 25 Bud Bucks.', 'money', 25, 'Community_Card_14_Grower_Help_Collect_25.png'),
    card('Community Stash', 15, 'Get out of Trim Jail free.', 'jailFree', 'communityStash', 'Community_Card_15_Get_Out_of_Trim_Jail_Free.png'),
    card('Community Stash', 16, 'Local grow-off. Collect 100 Bud Bucks.', 'money', 100, 'Community_Card_16_Local_Grow_Off_Collect_100.png')
  ];

  DATA.decks.highChance = highChance;
  DATA.decks.communityStash = communityStash;

  function hasApprovedDeckShape(state) {
    if (!state || !state.decks || !state.discard) return false;
    const high = (state.decks.highChance || []).concat(state.discard.highChance || []);
    const stash = (state.decks.communityStash || []).concat(state.discard.communityStash || []);
    return high.length === 15 && stash.length === 16 &&
      high.every(function (entry) { return Number.isInteger(entry.approvedNumber); }) &&
      stash.every(function (entry) { return Number.isInteger(entry.approvedNumber); });
  }

  function shuffled(items) {
    const copy = JSON.parse(JSON.stringify(items));
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const swap = Math.floor(Math.random() * (index + 1));
      const temp = copy[index];
      copy[index] = copy[swap];
      copy[swap] = temp;
    }
    return copy;
  }

  function migrateSavedDecks() {
    if (!Game.state || hasApprovedDeckShape(Game.state)) return false;
    Game.state.decks = {
      highChance: shuffled(highChance),
      communityStash: shuffled(communityStash)
    };
    Game.state.discard = { highChance: [], communityStash: [] };
    Game.log('Updated saved game to the approved 15 High Chance / 16 Community Stash decks.');
    return true;
  }

  const originalLoad = Game.load;
  Game.load = function () {
    const loaded = originalLoad.call(this);
    if (loaded && migrateSavedDecks()) this.emit();
    return loaded;
  };

  const originalApplyCard = Game.applyCard;
  Game.applyCard = function (drawnCard) {
    if (drawnCard.action !== 'nearestDispensary') return originalApplyCard.call(this, drawnCard);

    const player = this.currentPlayer();
    let steps = 1;
    let target = null;
    while (steps <= 40) {
      const candidate = this.state.spaces[(player.position + steps) % 40];
      if (candidate.type === 'property' && candidate.upgrades === 5) {
        target = candidate;
        break;
      }
      steps += 1;
    }

    if (!target) {
      this.log('No Dispensary property is currently on the board. High Chance #6 has no movement effect.');
      this.state.pending = null;
      this.state.phase = 'end';
      this.emit();
      return;
    }

    this.log(`${player.name} moves to the nearest Dispensary property: ${target.name}.`);
    this.moveBy(player, steps);
  };

  window.WEEDOPOLIS_APPROVED_DECKS = {
    version: 'approved-physical-masters-v1',
    highChanceCount: 15,
    communityStashCount: 16,
    highChance,
    communityStash
  };
})();
