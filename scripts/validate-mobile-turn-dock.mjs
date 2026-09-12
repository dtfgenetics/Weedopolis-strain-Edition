import assert from 'node:assert/strict';
import fs from 'node:fs';

const root = 'digital/weedopolis-web';
const html = fs.readFileSync(`${root}/index.html`, 'utf8');
const controller = fs.readFileSync(`${root}/js/weedopolis-mobile-turn-dock.js`, 'utf8');

assert(html.includes('id="turnSection"'), 'mobile turn routing requires the Turn section');
assert(html.includes('id="turnSection" class="panel parchment-panel turn-card" tabindex="-1"'), 'Turn section must be programmatically focusable');
assert(html.includes('id="mobileRollBtn"'), 'mobile primary action button must remain present');
assert(html.includes('js/weedopolis-ui.js'), 'core Weedopolis UI must load before the mobile turn bridge');
assert(html.includes('js/weedopolis-mobile-turn-dock.js'), 'mobile turn bridge must load in the playable page');
assert(
  html.indexOf('js/weedopolis-ui.js') < html.indexOf('js/weedopolis-mobile-turn-dock.js'),
  'mobile turn bridge must load after the core UI so the core roll handler remains authoritative'
);

for (const required of [
  "state.phase === 'roll'",
  "state.phase !== 'finished'",
  "mobilePrimaryButton.textContent = 'Roll Dice'",
  "mobilePrimaryButton.textContent = 'Turn Actions'",
  "mobilePrimaryButton.textContent = state?.phase === 'finished' ? 'Game Over' : 'Roll Dice'",
  "mobilePrimaryButton.dataset.mobileAction",
  "turnSection.scrollIntoView",
  "querySelector('button:not(:disabled), input:not(:disabled)')",
  "actionable.focus({ preventScroll: true })",
  "prefers-reduced-motion: reduce",
  "Game.onChange(syncMobilePrimaryAction)"
]) {
  assert(controller.includes(required), `missing mobile turn-dock behavior: ${required}`);
}

const listenerBody = controller.match(/mobilePrimaryButton\.addEventListener\('click',[\s\S]*?\n  \}\);/i)?.[0] || '';
assert(listenerBody, 'mobile primary action click listener must exist');
assert(listenerBody.includes("state.phase === 'roll'"), 'mobile bridge must not duplicate the core roll action');
assert(listenerBody.includes('scrollToTurnActions()'), 'non-roll phases must route the player to required Turn actions');

console.log('Weedopolis mobile turn dock validation passed: roll remains authoritative; action/auction/end phases route to Turn controls.');
