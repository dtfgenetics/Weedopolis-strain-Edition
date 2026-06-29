/* Weedopolis local game engine. */
(function () {
  const DATA = window.WEEDOPOLIS_EDITION;
  const STORAGE_KEY = 'weedopolis.strain.city.local.v1';

  function deepClone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function shuffle(items) {
    const copy = items.slice();
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function tokenFor(index) {
    return ['🌱','🔥','💨','🍪','🍍','💎','🧪','👑'][index] || '🌿';
  }

  function makePlayer(name, index) {
    return {
      id: index,
      name: name || `Player ${index + 1}`,
      money: DATA.startMoney,
      position: 0,
      token: tokenFor(index),
      inJail: false,
      jailTurns: 0,
      jailFreeCards: 0,
      bankrupt: false
    };
  }

  const Engine = {
    state: null,
    listeners: [],

    onChange(fn) {
      this.listeners.push(fn);
    },

    emit() {
      this.listeners.forEach((fn) => fn(this.state));
      this.save();
    },

    log(message) {
      this.state.log.unshift(message);
      this.state.log = this.state.log.slice(0, 80);
    },

    newGame(names) {
      const cleanNames = names.map((n) => n.trim()).filter(Boolean).slice(0, 8);
      while (cleanNames.length < 2) cleanNames.push(`Player ${cleanNames.length + 1}`);
      this.state = {
        createdAt: new Date().toISOString(),
        players: cleanNames.map(makePlayer),
        spaces: deepClone(DATA.spaces),
        turn: 0,
        phase: 'roll',
        dice: [0, 0],
        lastDiceTotal: 0,
        doubles: false,
        pending: null,
        decks: {
          highChance: shuffle(DATA.decks.highChance),
          communityStash: shuffle(DATA.decks.communityStash)
        },
        discard: { highChance: [], communityStash: [] },
        bank: { freeParkingPool: 0 }
      };
      this.log('New Weedopolis game started.');
      this.emit();
    },

    load() {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      try {
        this.state = JSON.parse(raw);
        this.log('Saved game loaded.');
        this.emit();
        return true;
      } catch (err) {
        console.error(err);
        return false;
      }
    },

    save() {
      if (this.state) localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    },

    clearSave() {
      localStorage.removeItem(STORAGE_KEY);
    },

    currentPlayer() {
      return this.state.players[this.state.turn];
    },

    activePlayers() {
      return this.state.players.filter((p) => !p.bankrupt);
    },

    nextTurn() {
      if (this.activePlayers().length <= 1) {
        this.state.phase = 'finished';
        this.log(`${this.activePlayers()[0]?.name || 'No player'} wins Weedopolis.`);
        this.emit();
        return;
      }
      do {
        this.state.turn = (this.state.turn + 1) % this.state.players.length;
      } while (this.currentPlayer().bankrupt);
      this.state.phase = 'roll';
      this.state.pending = null;
      this.state.dice = [0, 0];
      this.state.lastDiceTotal = 0;
      this.state.doubles = false;
      this.emit();
    },

    rollDice() {
      if (this.state.phase !== 'roll') return;
      const player = this.currentPlayer();
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      const total = d1 + d2;
      this.state.dice = [d1, d2];
      this.state.lastDiceTotal = total;
      this.state.doubles = d1 === d2;
      this.log(`${player.name} rolled ${d1} + ${d2} = ${total}.`);

      if (player.inJail) {
        this.handleJailRoll(player, total, d1 === d2);
        return;
      }

      this.moveBy(player, total);
    },

    handleJailRoll(player, total, isDouble) {
      if (isDouble) {
        player.inJail = false;
        player.jailTurns = 0;
        this.log(`${player.name} rolled doubles and left Trim Jail.`);
        this.moveBy(player, total);
        return;
      }
      player.jailTurns += 1;
      if (player.jailTurns >= 3) {
        this.payBank(player, 50, 'Trim Jail release fee');
        player.inJail = false;
        player.jailTurns = 0;
        this.log(`${player.name} paid 50 Bud Bucks after three Trim Jail turns.`);
        this.moveBy(player, total);
      } else {
        this.log(`${player.name} stays in Trim Jail.`);
        this.state.phase = 'end';
        this.emit();
      }
    },

    payToLeaveJail() {
      const player = this.currentPlayer();
      if (!player.inJail || this.state.phase !== 'roll') return;
      if (player.jailFreeCards > 0) {
        player.jailFreeCards -= 1;
        this.log(`${player.name} used a Skip Trim Jail card.`);
      } else {
        this.payBank(player, 50, 'Trim Jail release fee');
      }
      player.inJail = false;
      player.jailTurns = 0;
      this.emit();
    },

    moveBy(player, steps) {
      const old = player.position;
      const destination = (old + steps + 40) % 40;
      if (steps > 0 && old + steps >= 40) {
        player.money += DATA.passStartBonus;
        this.log(`${player.name} passed Start Session and collected 200 Bud Bucks.`);
      }
      player.position = destination;
      this.resolveLanding(player);
    },

    moveTo(player, index, collectIfPass = true) {
      const old = player.position;
      if (collectIfPass && index <= old && index !== old) {
        player.money += DATA.passStartBonus;
        this.log(`${player.name} passed Start Session and collected 200 Bud Bucks.`);
      }
      if (index === 0) {
        player.money += DATA.passStartBonus;
        this.log(`${player.name} reached Start Session and collected 200 Bud Bucks.`);
      }
      player.position = index;
      this.resolveLanding(player);
    },

    sendToJail(player) {
      player.position = DATA.trimJailIndex;
      player.inJail = true;
      player.jailTurns = 0;
      this.state.phase = 'end';
      this.log(`${player.name} was sent to Trim Jail.`);
      this.emit();
    },

    resolveLanding(player) {
      const space = this.state.spaces[player.position];
      this.log(`${player.name} landed on ${space.name}.`);

      if (space.name === 'Start Session') {
        this.state.phase = 'end';
      } else if (space.name === 'Compliance Check') {
        this.sendToJail(player);
        return;
      } else if (space.name === '420 Tax') {
        this.payBank(player, 200, '420 Tax');
        this.state.phase = 'end';
      } else if (space.name === 'Lab Testing Fee') {
        this.payBank(player, 100, 'Lab Testing Fee');
        this.state.phase = 'end';
      } else if (space.type === 'card') {
        this.drawCard(space.name === 'High Chance' ? 'highChance' : 'communityStash');
        return;
      } else if (this.isOwnable(space)) {
        if (space.owner === null) {
          this.state.pending = { type: 'buy', spaceIndex: space.index };
          this.state.phase = 'action';
        } else if (space.owner !== player.id) {
          this.payRent(player, space);
          this.state.phase = 'end';
        } else {
          this.log(`${player.name} owns ${space.name}.`);
          this.state.phase = 'end';
        }
      } else {
        this.state.phase = 'end';
      }
      this.checkBankruptcy(player);
      this.emit();
    },

    isOwnable(space) {
      return ['property','category','utility'].includes(space.type);
    },

    buyCurrent() {
      const pending = this.state.pending;
      if (!pending || pending.type !== 'buy') return;
      const player = this.currentPlayer();
      const space = this.state.spaces[pending.spaceIndex];
      if (player.money < space.price) {
        this.log(`${player.name} cannot afford ${space.name}.`);
        this.state.phase = 'end';
        this.emit();
        return;
      }
      player.money -= space.price;
      space.owner = player.id;
      this.log(`${player.name} bought ${space.name} for ${space.price} Bud Bucks.`);
      this.state.pending = null;
      this.state.phase = 'end';
      this.emit();
    },

    auctionCurrent(bids) {
      const pending = this.state.pending;
      if (!pending || pending.type !== 'buy') return;
      const space = this.state.spaces[pending.spaceIndex];
      const entries = this.state.players
        .filter((p) => !p.bankrupt)
        .map((p) => ({ player:p, bid: Math.max(0, Number(bids[p.id] || 0)) }))
        .filter((entry) => entry.bid <= entry.player.money)
        .sort((a, b) => b.bid - a.bid);
      const winner = entries[0];
      if (winner && winner.bid > 0) {
        winner.player.money -= winner.bid;
        space.owner = winner.player.id;
        this.log(`${winner.player.name} won auction for ${space.name} at ${winner.bid} Bud Bucks.`);
      } else {
        this.log(`${space.name} stayed unowned after auction.`);
      }
      this.state.pending = null;
      this.state.phase = 'end';
      this.emit();
    },

    declineCurrent() {
      if (!this.state.pending) return;
      this.log(`${this.currentPlayer().name} declined the purchase.`);
      this.state.phase = 'auction';
      this.emit();
    },

    payBank(player, amount, reason) {
      player.money -= amount;
      this.log(`${player.name} paid ${amount} Bud Bucks for ${reason}.`);
      this.checkBankruptcy(player);
    },

    payPlayer(from, to, amount, reason) {
      from.money -= amount;
      to.money += amount;
      this.log(`${from.name} paid ${to.name} ${amount} Bud Bucks for ${reason}.`);
      this.checkBankruptcy(from);
    },

    payRent(player, space) {
      if (space.mortgaged) {
        this.log(`${space.name} is mortgaged. No rent due.`);
        return;
      }
      const owner = this.state.players[space.owner];
      let amount = 0;
      if (space.type === 'property') {
        amount = space.rent[Math.min(space.upgrades, 5)] || space.rentBase;
        if (space.upgrades === 0 && this.ownsFullGroup(owner.id, space.colorGroup)) amount *= 2;
      } else if (space.type === 'category') {
        const count = this.state.spaces.filter((s) => s.type === 'category' && s.owner === owner.id).length;
        amount = DATA.categoryRent[count - 1] || 25;
        if (this.state.pending?.rentMultiplier) amount *= this.state.pending.rentMultiplier;
      } else if (space.type === 'utility') {
        const count = this.state.spaces.filter((s) => s.type === 'utility' && s.owner === owner.id).length;
        const multiplier = this.state.pending?.utilityMultiplier || (count === 2 ? DATA.utilityMultipliers.both : DATA.utilityMultipliers.one);
        amount = multiplier * Math.max(this.state.lastDiceTotal, 7);
      }
      this.payPlayer(player, owner, amount, `${space.name} rent`);
      this.state.pending = null;
    },

    ownsFullGroup(playerId, colorGroup) {
      if (!colorGroup || ['none','category','utility'].includes(colorGroup)) return false;
      const group = this.state.spaces.filter((s) => s.type === 'property' && s.colorGroup === colorGroup);
      return group.length > 0 && group.every((s) => s.owner === playerId && !s.mortgaged);
    },

    drawCard(deckKey) {
      if (this.state.decks[deckKey].length === 0) {
        this.state.decks[deckKey] = shuffle(this.state.discard[deckKey]);
        this.state.discard[deckKey] = [];
      }
      const card = this.state.decks[deckKey].shift();
      this.state.discard[deckKey].push(card);
      this.state.pending = { type: 'card', card };
      this.log(`${this.currentPlayer().name} drew ${card.deck}: ${card.text}`);
      this.applyCard(card);
    },

    applyCard(card) {
      const player = this.currentPlayer();
      switch (card.action) {
        case 'money':
          player.money += card.value;
          this.state.phase = 'end';
          break;
        case 'moveTo':
          this.moveTo(player, card.value);
          return;
        case 'moveRelative':
          this.moveBy(player, card.value);
          return;
        case 'jail':
          this.sendToJail(player);
          return;
        case 'jailFree':
          player.jailFreeCards += 1;
          this.state.phase = 'end';
          break;
        case 'payEach':
          this.state.players.forEach((p) => {
            if (p.id !== player.id && !p.bankrupt) this.payPlayer(player, p, card.value, card.deck);
          });
          this.state.phase = 'end';
          break;
        case 'collectEach':
          this.state.players.forEach((p) => {
            if (p.id !== player.id && !p.bankrupt) this.payPlayer(p, player, card.value, card.deck);
          });
          this.state.phase = 'end';
          break;
        case 'repair': {
          const [tentCost, dispensaryCost] = card.value;
          let total = 0;
          this.state.spaces.filter((s) => s.owner === player.id).forEach((s) => {
            if (s.upgrades > 0 && s.upgrades < 5) total += s.upgrades * tentCost;
            if (s.upgrades === 5) total += dispensaryCost;
          });
          if (total) this.payBank(player, total, card.deck);
          this.state.phase = 'end';
          break;
        }
        case 'nearestUtility':
          this.advanceToNearest('utility', { utilityMultiplier: card.value });
          return;
        case 'nearestCategory':
          this.advanceToNearest('category', { rentMultiplier: card.value });
          return;
        default:
          this.state.phase = 'end';
      }
      this.checkBankruptcy(player);
      this.emit();
    },

    advanceToNearest(type, extraPending) {
      const player = this.currentPlayer();
      let steps = 1;
      while (steps <= 40) {
        const target = (player.position + steps) % 40;
        if (this.state.spaces[target].type === type) {
          this.state.pending = Object.assign({ type: 'forcedRent' }, extraPending);
          this.moveBy(player, steps);
          return;
        }
        steps += 1;
      }
    },

    canUpgrade(spaceIndex) {
      const player = this.currentPlayer();
      const space = this.state.spaces[spaceIndex];
      if (!space || space.type !== 'property') return false;
      if (space.owner !== player.id || space.mortgaged || space.upgrades >= 5) return false;
      if (!this.ownsFullGroup(player.id, space.colorGroup)) return false;
      if (player.money < space.upgradeCost) return false;
      const group = this.state.spaces.filter((s) => s.type === 'property' && s.colorGroup === space.colorGroup);
      const min = Math.min(...group.map((s) => s.upgrades));
      return space.upgrades <= min;
    },

    upgrade(spaceIndex) {
      if (!this.canUpgrade(spaceIndex)) return;
      const player = this.currentPlayer();
      const space = this.state.spaces[spaceIndex];
      player.money -= space.upgradeCost;
      space.upgrades += 1;
      const label = space.upgrades === 5 ? 'Dispensary' : 'Grow Tent';
      this.log(`${player.name} added ${label} to ${space.name}.`);
      this.emit();
    },

    mortgage(spaceIndex) {
      const player = this.currentPlayer();
      const space = this.state.spaces[spaceIndex];
      if (!space || space.owner !== player.id || space.mortgaged || space.upgrades > 0) return;
      space.mortgaged = true;
      player.money += space.mortgageValue;
      this.log(`${player.name} mortgaged ${space.name} for ${space.mortgageValue} Bud Bucks.`);
      this.emit();
    },

    unmortgage(spaceIndex) {
      const player = this.currentPlayer();
      const space = this.state.spaces[spaceIndex];
      if (!space || space.owner !== player.id || !space.mortgaged) return;
      const cost = Math.ceil(space.mortgageValue * 1.1);
      if (player.money < cost) return;
      player.money -= cost;
      space.mortgaged = false;
      this.log(`${player.name} unmortgaged ${space.name} for ${cost} Bud Bucks.`);
      this.emit();
    },

    checkBankruptcy(player) {
      if (player.money >= 0 || player.bankrupt) return;
      const assets = this.state.spaces.filter((s) => s.owner === player.id);
      if (assets.length > 0) {
        this.log(`${player.name} is below zero. Mortgage or trade assets before ending the game.`);
        return;
      }
      player.bankrupt = true;
      this.log(`${player.name} is bankrupt.`);
    },

    ownedBy(playerId) {
      return this.state.spaces.filter((s) => s.owner === playerId);
    }
  };

  window.WeedopolisGame = Engine;
})();
