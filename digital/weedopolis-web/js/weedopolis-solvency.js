/* Weedopolis solvency guard: keeps local games from advancing with unresolved negative balances. */
(function () {
  'use strict';

  const Game = window.WeedopolisGame;
  if (!Game || typeof Game.nextTurn !== 'function') return;

  const originalNextTurn = Game.nextTurn.bind(Game);

  function ownedAssets(playerId) {
    return Game.state.spaces.filter(function (space) { return space.owner === playerId; });
  }

  function sellOneUpgrade(player, assets) {
    const candidates = assets
      .filter(function (space) { return space.type === 'property' && space.upgrades > 0; })
      .sort(function (a, b) {
        if (b.upgrades !== a.upgrades) return b.upgrades - a.upgrades;
        return b.upgradeCost - a.upgradeCost;
      });
    const space = candidates[0];
    if (!space) return false;

    const refund = Math.max(1, Math.floor(space.upgradeCost / 2));
    const soldWasDispensary = space.upgrades === 5;
    space.upgrades -= 1;
    player.money += refund;
    Game.log(player.name + ' automatically sold ' + (soldWasDispensary ? 'a Dispensary' : 'a Grow Tent') + ' on ' + space.name + ' for ' + refund + ' Bud Bucks to cover debt.');
    return true;
  }

  function mortgageOneAsset(player, assets) {
    const candidates = assets
      .filter(function (space) { return !space.mortgaged && Number(space.upgrades || 0) === 0 && Number(space.mortgageValue || 0) > 0; })
      .sort(function (a, b) { return b.mortgageValue - a.mortgageValue; });
    const space = candidates[0];
    if (!space) return false;

    space.mortgaged = true;
    player.money += space.mortgageValue;
    Game.log(player.name + ' automatically mortgaged ' + space.name + ' for ' + space.mortgageValue + ' Bud Bucks to cover debt.');
    return true;
  }

  function declareBankruptcy(player, assets) {
    assets.forEach(function (space) {
      space.owner = null;
      space.mortgaged = false;
      space.upgrades = 0;
    });
    player.bankrupt = true;
    Game.log(player.name + ' could not cover the remaining debt and is bankrupt. Properties returned to the bank.');
  }

  Game.resolveSolvency = function () {
    if (!this.state) return true;
    const player = this.currentPlayer();
    if (!player || player.bankrupt || player.money >= 0) return true;

    let assets = ownedAssets(player.id);
    let guard = 0;
    while (player.money < 0 && guard < 100) {
      guard += 1;
      if (sellOneUpgrade(player, assets)) continue;
      if (mortgageOneAsset(player, assets)) continue;
      break;
    }

    assets = ownedAssets(player.id);
    if (player.money < 0) declareBankruptcy(player, assets);
    return player.money >= 0 || player.bankrupt;
  };

  Game.nextTurn = function () {
    if (!this.state) return;
    if (this.state.phase === 'finished') return;

    const player = this.currentPlayer();
    if (player && player.money < 0 && !player.bankrupt) {
      this.resolveSolvency();
      this.emit();
    }

    if (player && player.money < 0 && !player.bankrupt) {
      this.log(player.name + ' must resolve the negative balance before ending the turn.');
      this.emit();
      return;
    }

    return originalNextTurn();
  };
})();
