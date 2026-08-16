import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('public/assets/weedopolis/cards');
const manifestPath = path.join(root, 'data/weedopolis-cards.json');
const correctionsPath = path.join(root, 'data/weedopolis-card-corrections.json');

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exitCode = 1;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

const manifest = readJson(manifestPath);
const corrections = fs.existsSync(correctionsPath) ? readJson(correctionsPath).corrections || {} : {};
const cards = manifest.cards.map((card) => ({ ...card, ...(corrections[card.id] || {}) }));

const expected = {
  'acapulco-gold': { boardPosition: 2, purchase: 60 },
  'maui-wowie': { boardPosition: 4, purchase: 60 },
  'green-crack': { boardPosition: 18, purchase: 180 },
  'pineapple-express': { boardPosition: 19, purchase: 180 },
  'blue-dream': { boardPosition: 20, purchase: 200 },
  'og-kush': { boardPosition: 38, purchase: 350 },
  'permanent-marker': { boardPosition: 40, purchase: 400 },
  'grow-lights': { boardPosition: 13, purchase: 150 },
  'water-works': { boardPosition: 29, purchase: 150 },
  'indica-line': { boardPosition: 6, purchase: 200 },
  'sativa-line': { boardPosition: 16, purchase: 200 },
  'hybrid-line': { boardPosition: 26, purchase: 200 },
  'autoflower-line': { boardPosition: 36, purchase: 200 }
};

if (manifest.cardCount !== 28) fail(`manifest cardCount must be 28, found ${manifest.cardCount}`);
if (cards.length !== 28) fail(`manifest must include 28 cards, found ${cards.length}`);

const seenPositions = new Map();
for (const card of cards) {
  if (seenPositions.has(card.boardPosition)) {
    fail(`duplicate board position ${card.boardPosition}: ${seenPositions.get(card.boardPosition)} and ${card.id}`);
  }
  seenPositions.set(card.boardPosition, card.id);

  const rules = expected[card.id];
  if (!rules) continue;
  if (card.boardPosition !== rules.boardPosition) fail(`${card.id} boardPosition expected ${rules.boardPosition}, found ${card.boardPosition}`);
  if (card.purchase !== rules.purchase) fail(`${card.id} purchase expected ${rules.purchase}, found ${card.purchase}`);
}

for (const [id, rules] of Object.entries(expected)) {
  const card = cards.find((item) => item.id === id);
  if (!card) fail(`missing expected card ${id}`);
  if (!seenPositions.has(rules.boardPosition)) fail(`missing expected board position ${rules.boardPosition} for ${id}`);
}

if (process.exitCode) process.exit(process.exitCode);
console.log(`card manifest validation passed with ${Object.keys(corrections).length} correction entries`);
