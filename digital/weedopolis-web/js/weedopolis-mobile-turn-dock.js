/* Weedopolis mobile primary-action bridge.
 * Keeps the existing roll handler authoritative during the roll phase.
 * During buy/auction/end phases, the same dock control becomes a direct route
 * to the Turn panel so required actions stay reachable on small screens.
 */
window.addEventListener('DOMContentLoaded', function () {
  'use strict';

  const Game = window.WeedopolisGame;
  const mobilePrimaryButton = document.getElementById('mobileRollBtn');
  const turnSection = document.getElementById('turnSection');

  if (!Game || !mobilePrimaryButton || !turnSection) return;

  function scrollToTurnActions() {
    const reducedMotion = Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
    turnSection.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
    const actionable = turnSection.querySelector('button:not(:disabled), input:not(:disabled)');
    if (actionable instanceof HTMLElement) {
      window.requestAnimationFrame(function () {
        actionable.focus({ preventScroll: true });
      });
    }
  }

  function syncMobilePrimaryAction(state) {
    const player = state && state.players ? state.players[state.turn] : null;
    const canRoll = Boolean(state && state.phase === 'roll' && player && !player.bankrupt);
    const needsTurnAction = Boolean(state && !canRoll && state.phase !== 'finished');

    mobilePrimaryButton.classList.toggle('turn-action-mode', needsTurnAction);
    mobilePrimaryButton.dataset.mobileAction = canRoll ? 'roll' : needsTurnAction ? 'turn-actions' : 'inactive';

    if (canRoll) {
      mobilePrimaryButton.textContent = 'Roll Dice';
      mobilePrimaryButton.disabled = false;
      mobilePrimaryButton.setAttribute('aria-disabled', 'false');
      mobilePrimaryButton.setAttribute('aria-label', 'Roll dice for the current player');
      return;
    }

    if (needsTurnAction) {
      mobilePrimaryButton.textContent = 'Turn Actions';
      mobilePrimaryButton.disabled = false;
      mobilePrimaryButton.setAttribute('aria-disabled', 'false');
      mobilePrimaryButton.setAttribute('aria-label', 'Jump to the current required turn actions');
      return;
    }

    mobilePrimaryButton.textContent = state?.phase === 'finished' ? 'Game Over' : 'Roll Dice';
    mobilePrimaryButton.disabled = true;
    mobilePrimaryButton.setAttribute('aria-disabled', 'true');
    mobilePrimaryButton.setAttribute('aria-label', state?.phase === 'finished' ? 'Game finished' : 'Roll dice unavailable');
  }

  mobilePrimaryButton.addEventListener('click', function () {
    const state = Game.state;
    if (!state || state.phase === 'roll' || state.phase === 'finished') return;
    scrollToTurnActions();
  });

  Game.onChange(syncMobilePrimaryAction);
  syncMobilePrimaryAction(Game.state);
});
