/* Weedopolis browser interface. */
window.addEventListener('DOMContentLoaded', function () {
  'use strict';

  const DATA = window.WEEDOPOLIS_EDITION;
  const ASSETS = window.WEEDOPOLIS_ASSETS || { bySpaceIndex: {} };
  const Game = window.WeedopolisGame;

  const board = document.getElementById('board');
  const setup = document.getElementById('setupPanel');
  const names = document.getElementById('playerNameGrid');
  const turn = document.getElementById('turnPanel');
  const players = document.getElementById('playersPanel');
  const manage = document.getElementById('managePanel');
  const log = document.getElementById('logPanel');
  const loadButton = document.getElementById('loadGameBtn');
  const newGameButton = document.getElementById('newGameTopBtn');
  const startButton = document.getElementById('startGameBtn');
  const currentBalance = document.getElementById('currentBalance');
  const mobileRollButton = document.getElementById('mobileRollBtn');
  const propertyArtSlot = document.getElementById('propertyArtSlot');
  const propertyAssetChip = document.getElementById('propertyAssetChip');

  let selectedSpaceIndex = null;

  function makeElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined && text !== null) element.textContent = String(text);
    return element;
  }

  function makeButton(label, onClick, options) {
    const config = options || {};
    const button = makeElement('button', config.className || '', label);
    button.type = 'button';
    button.disabled = Boolean(config.disabled);
    if (config.title) button.title = config.title;
    button.addEventListener('click', onClick);
    return button;
  }

  function formatMoney(value) {
    return Number(value || 0).toLocaleString() + ' BB';
  }

  function boardPosition(spaceNumber) {
    if (spaceNumber === 1) return { row: 11, column: 11 };
    if (spaceNumber >= 2 && spaceNumber <= 10) return { row: 11, column: 12 - spaceNumber };
    if (spaceNumber === 11) return { row: 11, column: 1 };
    if (spaceNumber >= 12 && spaceNumber <= 20) return { row: 22 - spaceNumber, column: 1 };
    if (spaceNumber === 21) return { row: 1, column: 1 };
    if (spaceNumber >= 22 && spaceNumber <= 30) return { row: 1, column: spaceNumber - 20 };
    if (spaceNumber === 31) return { row: 1, column: 11 };
    return { row: spaceNumber - 30, column: 11 };
  }

  function isOwnable(space) {
    return Boolean(space && ['property', 'category', 'utility'].includes(space.type));
  }

  function buildPlayerInputs() {
    names.textContent = '';
    for (let i = 1; i <= 8; i += 1) {
      const label = makeElement('label', 'player-name-field');
      const caption = makeElement('span', '', 'Player ' + i + (i <= 2 ? ' (required)' : ' (optional)'));
      const input = document.createElement('input');
      input.type = 'text';
      input.maxLength = 24;
      input.autocomplete = 'off';
      input.placeholder = 'Player ' + i;
      input.setAttribute('aria-label', 'Player ' + i + ' name');
      if (i <= 2) input.value = 'Player ' + i;
      label.append(caption, input);
      names.appendChild(label);
    }
  }

  function selectSpace(spaceIndex, state) {
    selectedSpaceIndex = Number(spaceIndex);
    renderBoard(state);
    renderManage(state);
  }

  function renderBoard(state) {
    board.textContent = '';

    const center = makeElement('section', 'board-center');
    center.setAttribute('aria-label', 'Weedopolis game status');
    center.appendChild(makeElement('p', 'eyebrow', 'DTF Genetics'));
    center.appendChild(makeElement('h2', '', 'Weedopolis'));
    center.appendChild(makeElement('p', '', 'Strain City Edition'));

    const dice = makeElement('div', 'dice-display');
    dice.setAttribute('aria-label', 'Current dice');
    const diceValues = state && state.dice ? state.dice : [0, 0];
    diceValues.forEach(function (value) {
      dice.appendChild(makeElement('span', 'die', value || '–'));
    });
    center.appendChild(dice);

    if (state) {
      const current = state.players[state.turn];
      center.appendChild(makeElement('p', '', current.name + ' · ' + formatMoney(current.money)));
      center.appendChild(makeElement('p', '', 'Phase: ' + state.phase.replace(/\b\w/g, function (letter) { return letter.toUpperCase(); })));
    } else {
      center.appendChild(makeElement('p', '', 'Enter at least two players to begin.'));
    }
    board.appendChild(center);

    const spaces = state ? state.spaces : DATA.spaces;
    spaces.forEach(function (space) {
      const position = boardPosition(space.spaceNumber);
      const tile = makeElement('article', 'tile ' + space.side + ' ' + space.type);
      tile.style.gridRow = String(position.row);
      tile.style.gridColumn = String(position.column);
      tile.style.setProperty('--space-color', space.color || DATA.colors.none);
      tile.dataset.spaceIndex = String(space.index);
      tile.title = space.notes || space.name;

      if (isOwnable(space)) {
        tile.tabIndex = 0;
        tile.setAttribute('role', 'button');
        tile.setAttribute('aria-label', 'View ' + space.name + ' property details');
        tile.addEventListener('click', function () { selectSpace(space.index, state); });
        tile.addEventListener('keydown', function (event) {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            selectSpace(space.index, state);
          }
        });
      }

      if (space.index === selectedSpaceIndex) tile.classList.add('selected-space');

      if (state) {
        const current = state.players[state.turn];
        if (current && current.position === space.index) tile.classList.add('current-space');
        if (space.owner !== null) tile.classList.add('owned');
        if (space.mortgaged) tile.classList.add('mortgaged');
      }

      tile.appendChild(makeElement('span', 'tile-number', space.spaceNumber));
      tile.appendChild(makeElement('strong', 'tile-name', space.name));

      if (space.price) tile.appendChild(makeElement('span', 'tile-price', formatMoney(space.price)));

      if (state && space.owner !== null) {
        const owner = state.players[space.owner];
        tile.appendChild(makeElement('span', 'owner-badge', owner ? owner.name : 'Owned'));
      }

      if (state && space.upgrades > 0) {
        const upgradeText = space.upgrades === 5
          ? '◆ Dispensary'
          : '△ ' + space.upgrades + ' Grow Tent' + (space.upgrades === 1 ? '' : 's');
        tile.appendChild(makeElement('span', 'upgrade-badge', upgradeText));
      }

      const tokenRow = makeElement('div', 'token-row');
      if (state) {
        state.players
          .filter(function (player) { return !player.bankrupt && player.position === space.index; })
          .forEach(function (player) {
            const token = makeElement('span', 'player-token', player.token);
            token.title = player.name;
            token.setAttribute('aria-label', player.name + ' token');
            tokenRow.appendChild(token);
          });
      }
      tile.appendChild(tokenRow);
      board.appendChild(tile);
    });
  }

  function renderPlayers(state) {
    players.textContent = '';
    if (!state) {
      players.appendChild(makeElement('p', 'empty-state', 'No game is running.'));
      return;
    }

    const list = makeElement('ul', 'player-list');
    state.players.forEach(function (player, index) {
      const item = makeElement('li', 'player-card' + (index === state.turn ? ' current' : ''));
      const header = makeElement('header');
      const name = makeElement('strong', '', player.token + ' ' + player.name);
      header.appendChild(name);
      if (index === state.turn && state.phase !== 'finished') {
        header.appendChild(makeElement('span', 'status-badge', 'Current'));
      } else if (player.bankrupt) {
        header.appendChild(makeElement('span', 'status-badge', 'Bankrupt'));
      }
      item.appendChild(header);
      const ownedCount = state.spaces.filter(function (space) { return space.owner === player.id; }).length;
      item.appendChild(makeElement('p', '', formatMoney(player.money) + ' · ' + ownedCount + ' owned · ' + state.spaces[player.position].name));
      if (player.inJail) item.appendChild(makeElement('p', '', 'In Trim Jail · turn ' + player.jailTurns));
      list.appendChild(item);
    });
    players.appendChild(list);
  }

  function renderAuction(state, container) {
    const pending = state.pending;
    const space = pending && state.spaces[pending.spaceIndex];
    if (!space) return;

    container.appendChild(makeElement('p', 'pending-card', 'Auction: ' + space.name + ' · listed at ' + formatMoney(space.price)));
    const grid = makeElement('div', 'auction-grid');

    state.players.filter(function (player) { return !player.bankrupt; }).forEach(function (player) {
      const label = makeElement('label', 'auction-field');
      label.appendChild(makeElement('span', '', player.token + ' ' + player.name + ' (max ' + formatMoney(player.money) + ')'));
      const input = document.createElement('input');
      input.type = 'number';
      input.min = '0';
      input.max = String(Math.max(0, player.money));
      input.step = '1';
      input.value = '0';
      input.dataset.playerId = String(player.id);
      input.setAttribute('aria-label', player.name + ' auction bid');
      label.appendChild(input);
      grid.appendChild(label);
    });

    container.appendChild(grid);
    container.appendChild(makeButton('Resolve Auction', function () {
      const bids = {};
      grid.querySelectorAll('input').forEach(function (input) {
        bids[input.dataset.playerId] = Math.max(0, Number(input.value || 0));
      });
      Game.auctionCurrent(bids);
    }, { className: 'primary' }));
  }

  function renderTurn(state) {
    turn.textContent = '';
    if (!state) {
      turn.appendChild(makeElement('p', 'empty-state', 'Start a new game or load a saved game.'));
      return;
    }

    const player = state.players[state.turn];
    const space = state.spaces[player.position];
    const summary = makeElement('p', 'turn-summary', player.token + ' ' + player.name + ' is on ' + space.name + ' with ' + formatMoney(player.money) + '.');
    summary.setAttribute('aria-live', 'polite');
    turn.appendChild(summary);

    if (state.lastDiceTotal) {
      turn.appendChild(makeElement('p', '', 'Last roll: ' + state.dice[0] + ' + ' + state.dice[1] + ' = ' + state.lastDiceTotal + (state.doubles ? ' (doubles)' : '')));
    }

    if (state.pending && state.pending.card) {
      turn.appendChild(makeElement('p', 'pending-card', state.pending.card.deck + ': ' + state.pending.card.text));
    }

    const actions = makeElement('div', 'action-row');

    if (state.phase === 'roll') {
      actions.appendChild(makeButton('Roll Dice', function () { Game.rollDice(); }, { className: 'primary' }));
      if (player.inJail) {
        actions.appendChild(makeButton(player.jailFreeCards > 0 ? 'Use Trim Jail Card' : 'Pay 50 BB to Leave', function () { Game.payToLeaveJail(); }));
      }
    } else if (state.phase === 'action' && state.pending && state.pending.type === 'buy') {
      const buySpace = state.spaces[state.pending.spaceIndex];
      turn.appendChild(makeElement('p', 'pending-card', buySpace.name + ' is available for ' + formatMoney(buySpace.price) + '.'));
      actions.appendChild(makeButton('Buy ' + buySpace.name, function () { Game.buyCurrent(); }, {
        className: 'primary',
        disabled: player.money < buySpace.price,
        title: player.money < buySpace.price ? 'Not enough Bud Bucks' : ''
      }));
      actions.appendChild(makeButton('Send to Auction', function () { Game.declineCurrent(); }));
    } else if (state.phase === 'auction') {
      renderAuction(state, turn);
    } else if (state.phase === 'end') {
      actions.appendChild(makeButton('End Turn', function () { Game.nextTurn(); }, { className: 'primary' }));
    } else if (state.phase === 'finished') {
      const winner = Game.activePlayers()[0];
      turn.appendChild(makeElement('p', 'pending-card', (winner ? winner.name : 'No player') + ' wins Weedopolis.'));
    }

    turn.appendChild(actions);
  }

  function renderPropertyArt(space) {
    propertyArtSlot.textContent = '';
    propertyArtSlot.style.removeProperty('background-image');
    propertyArtSlot.dataset.assetId = '';

    if (!space || !isOwnable(space)) {
      propertyAssetChip.textContent = 'Verified V1 deed mapping';
      propertyArtSlot.appendChild(makeElement('span', '', 'Select an ownership space'));
      return;
    }

    const asset = ASSETS.bySpaceIndex && ASSETS.bySpaceIndex[space.index];
    if (!asset) {
      propertyAssetChip.textContent = 'No verified mapping';
      propertyArtSlot.appendChild(makeElement('span', '', space.name));
      return;
    }

    propertyArtSlot.dataset.assetId = asset.id;
    propertyAssetChip.textContent = asset.type === 'property' ? 'V1 board-matched deed' : 'Original card art preserved';

    const image = new Image();
    image.alt = 'Verified Weedopolis ownership card for ' + asset.name;
    image.loading = 'lazy';
    image.decoding = 'async';
    image.src = asset.webImage;
    image.addEventListener('load', function () {
      propertyArtSlot.dataset.artStatus = 'verified-web-export-loaded';
    });
    image.addEventListener('error', function () {
      propertyArtSlot.textContent = '';
      propertyArtSlot.dataset.artStatus = 'verified-master-web-export-pending';
      const fallback = makeElement('div', 'verified-art-fallback');
      fallback.appendChild(makeElement('strong', '', asset.name));
      fallback.appendChild(makeElement('span', '', 'Verified master mapped: ' + asset.sourceFile));
      propertyArtSlot.appendChild(fallback);
    });
    propertyArtSlot.appendChild(image);
  }

  function renderManage(state) {
    manage.textContent = '';
    if (!state) {
      renderPropertyArt(null);
      manage.appendChild(makeElement('p', 'empty-state', 'Property management appears after a game starts.'));
      return;
    }

    const player = state.players[state.turn];
    const currentSpace = state.spaces[player.position];
    const focusSpace = selectedSpaceIndex !== null ? state.spaces[selectedSpaceIndex] : currentSpace;
    renderPropertyArt(focusSpace);

    if (isOwnable(focusSpace)) {
      const focusCard = makeElement('div', 'selected-property-summary');
      const focusHeader = makeElement('header');
      focusHeader.appendChild(makeElement('strong', '', focusSpace.name));
      focusHeader.appendChild(makeElement('span', 'status-badge', focusSpace.owner === null ? 'Unowned' : (focusSpace.owner === player.id ? 'Yours' : 'Owned')));
      focusCard.appendChild(focusHeader);
      focusCard.appendChild(makeElement('p', '', 'Purchase ' + formatMoney(focusSpace.price) + ' · Mortgage ' + formatMoney(focusSpace.mortgageValue)));
      manage.appendChild(focusCard);
    }

    const owned = state.spaces.filter(function (space) { return space.owner === player.id; });
    if (owned.length === 0) {
      manage.appendChild(makeElement('p', 'empty-state', player.name + ' does not own any spaces yet.'));
      return;
    }

    const list = makeElement('ul', 'property-list');
    owned.forEach(function (space) {
      const item = makeElement('li', 'property-card' + (space.index === selectedSpaceIndex ? ' selected' : ''));
      const header = makeElement('header');
      const select = makeButton(space.name, function () { selectSpace(space.index, state); }, { className: 'property-select-button' });
      header.appendChild(select);
      header.appendChild(makeElement('span', 'status-badge', space.mortgaged ? 'Mortgaged' : (space.upgrades === 5 ? 'Dispensary' : space.upgrades + ' tents')));
      item.appendChild(header);
      item.appendChild(makeElement('p', '', 'Mortgage ' + formatMoney(space.mortgageValue) + ' · Upgrade ' + formatMoney(space.upgradeCost)));

      const actions = makeElement('div', 'manage-actions');
      if (space.type === 'property') {
        actions.appendChild(makeButton('Add Upgrade', function () { Game.upgrade(space.index); }, {
          disabled: !Game.canUpgrade(space.index),
          title: 'Requires a complete color group, even building, and sufficient Bud Bucks.'
        }));
      }
      if (space.mortgaged) {
        actions.appendChild(makeButton('Unmortgage', function () { Game.unmortgage(space.index); }));
      } else {
        actions.appendChild(makeButton('Mortgage', function () { Game.mortgage(space.index); }, { disabled: space.upgrades > 0 }));
      }
      item.appendChild(actions);
      list.appendChild(item);
    });
    manage.appendChild(list);
  }

  function renderLog(state) {
    log.textContent = '';
    if (!state || !state.log.length) {
      log.appendChild(makeElement('li', 'empty-state', 'Game events will appear here.'));
      return;
    }
    state.log.slice(0, 30).forEach(function (message) { log.appendChild(makeElement('li', '', message)); });
  }

  function syncTopControls(state) {
    const player = state && state.players ? state.players[state.turn] : null;
    currentBalance.textContent = Number(player ? player.money : DATA.startMoney).toLocaleString();
    const canRoll = Boolean(state && state.phase === 'roll' && player && !player.bankrupt);
    mobileRollButton.disabled = !canRoll;
    mobileRollButton.setAttribute('aria-disabled', String(!canRoll));
  }

  function render(state) {
    setup.classList.toggle('hidden', Boolean(state));
    if (state && state.pending && Number.isInteger(state.pending.spaceIndex)) selectedSpaceIndex = state.pending.spaceIndex;
    renderBoard(state);
    renderTurn(state);
    renderPlayers(state);
    renderManage(state);
    renderLog(state);
    syncTopControls(state);
  }

  buildPlayerInputs();
  Game.onChange(render);
  render(Game.state);

  startButton.addEventListener('click', function () {
    const playerNames = Array.from(names.querySelectorAll('input')).map(function (input) { return input.value; });
    selectedSpaceIndex = null;
    Game.newGame(playerNames);
  });

  loadButton.addEventListener('click', function () {
    const loaded = Game.load();
    if (!loaded) {
      turn.textContent = '';
      turn.appendChild(makeElement('p', 'pending-card', 'No valid saved game was found in this browser.'));
    }
  });

  mobileRollButton.addEventListener('click', function () {
    if (Game.state && Game.state.phase === 'roll') Game.rollDice();
  });

  newGameButton.addEventListener('click', function () {
    const shouldReset = !Game.state || window.confirm('Start a new game? The current local save will be cleared.');
    if (!shouldReset) return;
    Game.clearSave();
    window.location.reload();
  });
});
