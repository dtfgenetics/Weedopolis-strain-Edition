/* Weedopolis local property-trading extension. */
(function () {
  'use strict';

  const Game = window.WeedopolisGame;
  if (!Game) return;

  function cashValue(value) {
    const amount = Number(value || 0);
    return Number.isInteger(amount) && amount >= 0 ? amount : null;
  }

  function groupHasUpgrades(space) {
    if (!space || space.type !== 'property' || !space.colorGroup) return false;
    return Game.state.spaces.some(function (candidate) {
      return candidate.type === 'property' &&
        candidate.colorGroup === space.colorGroup &&
        Number(candidate.upgrades || 0) > 0;
    });
  }

  Game.tradeEligibility = function (spaceIndex, ownerId) {
    if (!this.state) return { ok: false, reason: 'No game is running.' };
    const space = this.state.spaces[Number(spaceIndex)];
    if (!space || !this.isOwnable(space)) return { ok: false, reason: 'Choose an ownable space.' };
    if (space.owner !== Number(ownerId)) return { ok: false, reason: 'The selected player does not own that space.' };
    if (space.mortgaged) return { ok: false, reason: 'Mortgaged spaces must be unmortgaged before trading.' };
    if (Number(space.upgrades || 0) > 0) return { ok: false, reason: 'Sell all Grow Tents or the Dispensary before trading this space.' };
    if (groupHasUpgrades(space)) return { ok: false, reason: 'A color group with upgrades cannot be split by a trade.' };
    return { ok: true, space };
  };

  Game.trade = function (input) {
    if (!this.state) return { ok: false, reason: 'No game is running.' };
    if (!['roll', 'end'].includes(this.state.phase)) {
      return { ok: false, reason: 'Trades are available before rolling or after landing actions are resolved.' };
    }

    const from = this.currentPlayer();
    const targetId = Number(input && input.targetPlayerId);
    const target = this.state.players[targetId];
    if (!from || from.bankrupt) return { ok: false, reason: 'The current player cannot trade.' };
    if (!target || target.bankrupt || target.id === from.id) return { ok: false, reason: 'Choose another active player.' };

    const offerCash = cashValue(input && input.offerCash);
    const requestCash = cashValue(input && input.requestCash);
    if (offerCash === null || requestCash === null) return { ok: false, reason: 'Trade cash values must be whole Bud Bucks at or above zero.' };
    if (offerCash > from.money) return { ok: false, reason: from.name + ' cannot afford the offered Bud Bucks.' };
    if (requestCash > target.money) return { ok: false, reason: target.name + ' cannot afford the requested Bud Bucks.' };

    const offerIndex = input && input.offerSpaceIndex !== '' && input.offerSpaceIndex !== null && input.offerSpaceIndex !== undefined
      ? Number(input.offerSpaceIndex)
      : null;
    const requestIndex = input && input.requestSpaceIndex !== '' && input.requestSpaceIndex !== null && input.requestSpaceIndex !== undefined
      ? Number(input.requestSpaceIndex)
      : null;

    if (offerIndex === null && requestIndex === null) {
      return { ok: false, reason: 'A trade must move at least one property, category, or utility space.' };
    }
    if (offerIndex !== null && requestIndex !== null && offerIndex === requestIndex) {
      return { ok: false, reason: 'The same space cannot be on both sides of a trade.' };
    }

    let offeredSpace = null;
    let requestedSpace = null;
    if (offerIndex !== null) {
      const eligibility = this.tradeEligibility(offerIndex, from.id);
      if (!eligibility.ok) return eligibility;
      offeredSpace = eligibility.space;
    }
    if (requestIndex !== null) {
      const eligibility = this.tradeEligibility(requestIndex, target.id);
      if (!eligibility.ok) return eligibility;
      requestedSpace = eligibility.space;
    }

    from.money -= offerCash;
    target.money += offerCash;
    target.money -= requestCash;
    from.money += requestCash;
    if (offeredSpace) offeredSpace.owner = target.id;
    if (requestedSpace) requestedSpace.owner = from.id;

    const fromPieces = [];
    const targetPieces = [];
    if (offeredSpace) fromPieces.push(offeredSpace.name);
    if (offerCash) fromPieces.push(offerCash + ' BB');
    if (requestedSpace) targetPieces.push(requestedSpace.name);
    if (requestCash) targetPieces.push(requestCash + ' BB');
    if (fromPieces.length === 0) fromPieces.push('no extra cash');
    if (targetPieces.length === 0) targetPieces.push('no extra cash');

    this.log(from.name + ' traded ' + fromPieces.join(' + ') + ' to ' + target.name + ' for ' + targetPieces.join(' + ') + '.');
    this.emit();
    return {
      ok: true,
      fromPlayerId: from.id,
      targetPlayerId: target.id,
      offeredSpaceIndex: offeredSpace ? offeredSpace.index : null,
      requestedSpaceIndex: requestedSpace ? requestedSpace.index : null,
      offerCash,
      requestCash
    };
  };
})();
