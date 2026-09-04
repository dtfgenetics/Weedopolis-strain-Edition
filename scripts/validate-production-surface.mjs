import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync('digital/weedopolis-web/index.html', 'utf8');

assert(!html.includes('weedopolis-tests.js'), 'production HTML must not load the browser test harness');
assert(!html.includes('runWeedopolisTests'), 'production HTML must not expose test-only controls or hooks');

for (const required of [
  'js/weedopolis-edition.js',
  'js/weedopolis-master-overrides.js',
  'js/weedopolis-assets.js',
  'js/weedopolis-engine.js',
  'js/weedopolis-approved-decks.js',
  'js/weedopolis-ui.js'
]) {
  assert(html.includes(required), `production runtime is missing ${required}`);
}

console.log('Weedopolis production surface validation passed');
