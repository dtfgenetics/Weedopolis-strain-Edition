import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync('public/weedopolis-preview/index.html', 'utf8');
const app = fs.readFileSync('src/games/weedopolis/preview/app.js', 'utf8');
const style = fs.readFileSync('public/weedopolis-preview/style.css', 'utf8');

for (const requiredHtml of [
  'weedopolis-root',
  '<title>Weedopolis: Strain City Edition | DTF Genetics</title>',
  '<link rel="canonical" href="https://dtfseeds.com/games/weedopolis/"',
  '<meta name="description"',
  '<h1 id="weedopolis-title">Weedopolis: Strain City Edition</h1>',
  'application/ld+json',
  'preview/app.js'
]) {
  assert(html.includes(requiredHtml), `missing production preview markup: ${requiredHtml}`);
}

const crawlableText = html
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();
assert(crawlableText.length >= 100, `preview fallback copy too short: ${crawlableText.length}`);

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
assert(app.includes("document.createElement('details')"), 'developer state should be collapsed by default');
assert(app.includes("summary.textContent = 'Game state details'"));
assert(style.includes(':focus-visible'), 'preview should expose visible keyboard focus');
assert(style.includes('min-height: 44px'), 'preview buttons should retain touch-friendly targets');
assert(style.includes('prefers-reduced-motion'), 'preview should respect reduced motion');

console.log('playable preview validation passed');
