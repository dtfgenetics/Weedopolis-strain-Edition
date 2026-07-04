import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync('public/weedopolis-preview/index.html', 'utf8');
const app = fs.readFileSync('src/games/weedopolis/preview/app.js', 'utf8');

assert(html.includes('weedopolis-root'));
assert(html.includes('Weedopolis Playable Preview'));
assert(html.includes('preview/app.js'));

for (const required of [
  'create-game',
  'join-game',
  'ready-all',
  'roll-dice',
  'move-player'
]) {
  assert(app.includes(required), `missing preview action ${required}`);
}

assert(app.includes('createLocalActions'));
assert(app.includes('createStore'));
assert(app.includes('renderMenuScreen'));
assert(app.includes('renderLobbyScreen'));

console.log('playable preview validation passed');
