/* Weedopolis local pass-and-play trade desk. */
window.addEventListener('DOMContentLoaded', function () {
  'use strict';

  const Game = window.WeedopolisGame;
  const managePanel = document.getElementById('managePanel');
  if (!Game || !managePanel || typeof Game.trade !== 'function') return;

  function makeElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined && text !== null) element.textContent = String(text);
    return element;
  }

  function formatMoney(value) {
    return Number(value || 0).toLocaleString() + ' BB';
  }

  function tradeableSpaces(state, playerId) {
    return state.spaces.filter(function (space) {
      if (space.owner !== playerId) return false;
      const eligibility = Game.tradeEligibility(space.index, playerId);
      return Boolean(eligibility && eligibility.ok);
    });
  }

  function appendSpaceOptions(select, spaces, emptyLabel) {
    select.textContent = '';
    const empty = document.createElement('option');
    empty.value = '';
    empty.textContent = emptyLabel;
    select.appendChild(empty);
    spaces.forEach(function (space) {
      const option = document.createElement('option');
      option.value = String(space.index);
      option.textContent = space.name + ' · ' + formatMoney(space.price || 0);
      select.appendChild(option);
    });
  }

  function field(labelText, control) {
    const label = makeElement('label', 'trade-field');
    label.appendChild(makeElement('span', '', labelText));
    label.appendChild(control);
    return label;
  }

  function renderTradeDesk(state) {
    managePanel.querySelector('.trade-desk')?.remove();
    if (!state || state.phase === 'finished') return;

    const current = state.players[state.turn];
    if (!current || current.bankrupt) return;

    const targets = state.players.filter(function (player) {
      return !player.bankrupt && player.id !== current.id;
    });
    if (targets.length === 0) return;

    const desk = makeElement('section', 'trade-desk');
    desk.setAttribute('aria-labelledby', 'weedopolis-trade-title');

    const heading = makeElement('div', 'trade-heading');
    const copy = makeElement('div');
    copy.appendChild(makeElement('span', 'trade-kicker', 'PROPERTY TRADING'));
    const title = makeElement('h3', '', 'Trade Desk');
    title.id = 'weedopolis-trade-title';
    copy.appendChild(title);
    copy.appendChild(makeElement('p', '', 'Swap eligible ownership spaces and Bud Bucks. Built or mortgaged groups must be cleared first.'));
    heading.appendChild(copy);
    heading.appendChild(makeElement('span', 'status-badge', ['roll', 'end'].includes(state.phase) ? 'Open' : 'Locked'));
    desk.appendChild(heading);

    if (!['roll', 'end'].includes(state.phase)) {
      desk.appendChild(makeElement('p', 'trade-status warning', 'Finish the current landing, purchase, or auction before opening a trade.'));
      managePanel.appendChild(desk);
      return;
    }

    const grid = makeElement('div', 'trade-grid');
    const targetSelect = document.createElement('select');
    targetSelect.setAttribute('aria-label', 'Trade with player');
    targets.forEach(function (player) {
      const option = document.createElement('option');
      option.value = String(player.id);
      option.textContent = player.token + ' ' + player.name + ' · ' + formatMoney(player.money);
      targetSelect.appendChild(option);
    });

    const offerSpaceSelect = document.createElement('select');
    offerSpaceSelect.setAttribute('aria-label', current.name + ' property offered');
    appendSpaceOptions(offerSpaceSelect, tradeableSpaces(state, current.id), 'Cash only / no property');

    const requestSpaceSelect = document.createElement('select');
    requestSpaceSelect.setAttribute('aria-label', 'Requested property');

    const offerCash = document.createElement('input');
    offerCash.type = 'number';
    offerCash.min = '0';
    offerCash.step = '1';
    offerCash.value = '0';
    offerCash.max = String(Math.max(0, current.money));
    offerCash.inputMode = 'numeric';
    offerCash.setAttribute('aria-label', current.name + ' Bud Bucks offered');

    const requestCash = document.createElement('input');
    requestCash.type = 'number';
    requestCash.min = '0';
    requestCash.step = '1';
    requestCash.value = '0';
    requestCash.inputMode = 'numeric';
    requestCash.setAttribute('aria-label', 'Bud Bucks requested from trade partner');

    function targetPlayer() {
      return state.players[Number(targetSelect.value)];
    }

    function syncTargetAssets() {
      const target = targetPlayer();
      appendSpaceOptions(
        requestSpaceSelect,
        target ? tradeableSpaces(state, target.id) : [],
        'Cash only / no property'
      );
      requestCash.max = String(Math.max(0, target ? target.money : 0));
    }
    syncTargetAssets();

    grid.appendChild(field('Trade with', targetSelect));
    grid.appendChild(field(current.name + ' offers', offerSpaceSelect));
    grid.appendChild(field(current.name + ' adds cash', offerCash));
    grid.appendChild(field('Request from partner', requestSpaceSelect));
    grid.appendChild(field('Request partner cash', requestCash));
    desk.appendChild(grid);

    const consent = makeElement('label', 'trade-consent');
    const consentInput = document.createElement('input');
    consentInput.type = 'checkbox';
    consentInput.setAttribute('aria-label', 'Both players approve this trade');
    consent.appendChild(consentInput);
    consent.appendChild(makeElement('span', '', 'Both players reviewed and approve this trade.'));
    desk.appendChild(consent);

    const status = makeElement('p', 'trade-status', 'Choose at least one property/category/utility to transfer.');
    status.setAttribute('aria-live', 'polite');
    desk.appendChild(status);

    const execute = makeElement('button', 'primary trade-execute', 'Execute Trade');
    execute.type = 'button';
    execute.disabled = true;
    desk.appendChild(execute);

    function resetConsent() {
      consentInput.checked = false;
      execute.disabled = true;
    }

    targetSelect.addEventListener('change', function () {
      syncTargetAssets();
      resetConsent();
    });
    [offerSpaceSelect, requestSpaceSelect, offerCash, requestCash].forEach(function (control) {
      control.addEventListener('change', resetConsent);
      control.addEventListener('input', resetConsent);
    });
    consentInput.addEventListener('change', function () {
      execute.disabled = !consentInput.checked;
    });

    execute.addEventListener('click', function () {
      if (!consentInput.checked) return;
      const target = targetPlayer();
      if (!target) {
        status.textContent = 'Choose a valid trade partner.';
        status.classList.add('warning');
        return;
      }

      const result = Game.trade({
        targetPlayerId: target.id,
        offerSpaceIndex: offerSpaceSelect.value,
        requestSpaceIndex: requestSpaceSelect.value,
        offerCash: Number(offerCash.value || 0),
        requestCash: Number(requestCash.value || 0)
      });

      if (!result || !result.ok) {
        status.textContent = result && result.reason ? result.reason : 'Trade could not be completed.';
        status.classList.add('warning');
        resetConsent();
      }
    });

    managePanel.appendChild(desk);
  }

  Game.onChange(renderTradeDesk);
  renderTradeDesk(Game.state);
});
