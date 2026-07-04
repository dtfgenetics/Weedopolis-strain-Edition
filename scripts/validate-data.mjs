import fs from 'node:fs';

function fail(message) {
  console.error(message);
  process.exitCode = 1;
}

function splitCsvLine(line) {
  const out = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      quoted = !quoted;
    } else if (ch === ',' && !quoted) {
      out.push(cell);
      cell = '';
    } else {
      cell += ch;
    }
  }
  out.push(cell);
  return out;
}

function rows(path) {
  const text = fs.readFileSync(path, 'utf8').trim();
  const lines = text.split(/\r?\n/);
  const headers = splitCsvLine(lines.shift());
  return lines.map((line) => {
    const values = splitCsvLine(line);
    return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? '']));
  });
}

const board = rows('data/board_map.csv');
const colors = rows('data/color_groups.csv');

if (board.length !== 40) fail(`board_map.csv must have 40 spaces, found ${board.length}`);

const numbers = board.map((r) => Number(r.space_number));
for (let i = 1; i <= 40; i += 1) {
  if (!numbers.includes(i)) fail(`missing board space ${i}`);
}

const typeCounts = board.reduce((acc, row) => {
  acc[row.space_type] = (acc[row.space_type] ?? 0) + 1;
  return acc;
}, {});

if (typeCounts.corner !== 4) fail('expected 4 corners');
if (typeCounts.property !== 22) fail('expected 22 properties');
if (typeCounts.category !== 4) fail('expected 4 category spaces');
if (typeCounts.card !== 6) fail('expected 6 card spaces');
if (typeCounts.utility !== 2) fail('expected 2 utilities');
if ((typeCounts.tax ?? 0) + (typeCounts.fee ?? 0) !== 2) fail('expected 2 tax or fee spaces');

const byNumber = new Map(board.map((row) => [Number(row.space_number), row]));

for (const group of colors) {
  const listed = group.space_numbers.split(',').map((value) => Number(value.trim())).filter(Boolean);
  const expectedCount = Number(group.property_count);
  if (listed.length !== expectedCount) {
    fail(`${group.color_group} expected ${expectedCount} spaces but listed ${listed.length}`);
  }
  for (const spaceNumber of listed) {
    const space = byNumber.get(spaceNumber);
    if (!space) fail(`${group.color_group} references missing space ${spaceNumber}`);
    if (space && space.color_group !== group.color_group) {
      fail(`${group.color_group} references ${spaceNumber}, but board map says ${space.color_group}`);
    }
  }
}

if (process.exitCode) process.exit(process.exitCode);
console.log('data validation passed');
