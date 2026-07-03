#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const boardMapPath = path.join(repoRoot, 'data', 'board_map.csv');
const colorGroupsPath = path.join(repoRoot, 'data', 'color_groups.csv');
const configPath = path.join(repoRoot, 'data', 'game_config.json');

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exitCode = 1;
}

function parseCsvLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"' && next === '"' && inQuotes) {
      current += '"';
      i += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

function readCsv(filePath) {
  if (!fs.existsSync(filePath)) {
    fail(`Missing required file: ${path.relative(repoRoot, filePath)}`);
    return [];
  }

  const lines = fs.readFileSync(filePath, 'utf8').trim().split(/\r?\n/);
  const headers = parseCsvLine(lines[0]);

  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? '']));
  });
}

function readJson(filePath) {
  if (!fs.existsSync(filePath)) {
    fail(`Missing required file: ${path.relative(repoRoot, filePath)}`);
    return {};
  }

  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

const boardSpaces = readCsv(boardMapPath);
const colorGroups = readCsv(colorGroupsPath);
const config = readJson(configPath);

const requiredTypeCounts = {
  corner: 4,
  property: 22,
  category: 4,
  card: 6,
  utility: 2,
  tax: 1,
  fee: 1,
};

if (boardSpaces.length !== config.board?.space_count) {
  fail(`Expected ${config.board?.space_count} board spaces, found ${boardSpaces.length}.`);
}

const seenSpaceNumbers = new Set();
const seenSpaceNames = new Map();

for (const space of boardSpaces) {
  const number = Number(space.space_number);

  if (!Number.isInteger(number) || number < 1 || number > 40) {
    fail(`Invalid space number for ${space.space_name}: ${space.space_number}`);
  }

  if (seenSpaceNumbers.has(number)) {
    fail(`Duplicate board space number: ${number}`);
  }
  seenSpaceNumbers.add(number);

  const previousCount = seenSpaceNames.get(space.space_name) ?? 0;
  seenSpaceNames.set(space.space_name, previousCount + 1);
}

for (let number = 1; number <= 40; number += 1) {
  if (!seenSpaceNumbers.has(number)) {
    fail(`Missing board space number: ${number}`);
  }
}

for (const [type, expected] of Object.entries(requiredTypeCounts)) {
  const actual = boardSpaces.filter((space) => space.space_type === type).length;
  if (actual !== expected) {
    fail(`Expected ${expected} spaces of type '${type}', found ${actual}.`);
  }
}

const expectedSideCounts = {
  bottom: 10,
  left: 10,
  top: 10,
  right: 10,
};

for (const [side, expected] of Object.entries(expectedSideCounts)) {
  const actual = boardSpaces.filter((space) => space.board_side === side).length;
  if (actual !== expected) {
    fail(`Expected ${expected} '${side}' spaces, found ${actual}.`);
  }
}

const expectedOrientations = {
  bottom: 'bottom_edge',
  left: 'left_edge',
  top: 'top_edge',
  right: 'right_edge',
};

for (const space of boardSpaces) {
  const expectedOrientation = expectedOrientations[space.board_side];
  if (space.orientation !== expectedOrientation) {
    fail(`Space ${space.space_number} (${space.space_name}) has orientation '${space.orientation}', expected '${expectedOrientation}'.`);
  }
}

const duplicateAllowedNames = new Set(['High Chance', 'Community Stash']);
for (const [name, count] of seenSpaceNames.entries()) {
  if (count > 1 && !duplicateAllowedNames.has(name)) {
    fail(`Unexpected duplicate board space name: ${name}`);
  }
}

const spacesByNumber = new Map(boardSpaces.map((space) => [Number(space.space_number), space]));

for (const group of colorGroups) {
  const numbers = group.space_numbers
    .split(',')
    .map((value) => Number(value.trim()))
    .filter(Boolean);

  const properties = group.properties
    .split(';')
    .map((value) => value.trim())
    .filter(Boolean);

  if (numbers.length !== Number(group.property_count)) {
    fail(`Color group '${group.color_group}' expected ${group.property_count} spaces but lists ${numbers.length}.`);
  }

  if (properties.length !== Number(group.property_count)) {
    fail(`Color group '${group.color_group}' expected ${group.property_count} names but lists ${properties.length}.`);
  }

  numbers.forEach((spaceNumber, index) => {
    const boardSpace = spacesByNumber.get(spaceNumber);
    const expectedName = properties[index];

    if (!boardSpace) {
      fail(`Color group '${group.color_group}' references missing board space ${spaceNumber}.`);
      return;
    }

    if (boardSpace.space_name !== expectedName) {
      fail(`Color group '${group.color_group}' maps space ${spaceNumber} to '${expectedName}', but board map has '${boardSpace.space_name}'.`);
    }

    if (boardSpace.color_group !== group.color_group) {
      fail(`Color group '${group.color_group}' maps space ${spaceNumber}, but board map color is '${boardSpace.color_group}'.`);
    }
  });
}

const requiredRailroads = new Set(config.replacement_terms?.railroads ?? []);
const categoryNames = new Set(boardSpaces.filter((space) => space.space_type === 'category').map((space) => space.space_name));
for (const railroad of requiredRailroads) {
  if (!categoryNames.has(railroad)) {
    fail(`Missing category/railroad replacement: ${railroad}`);
  }
}

const propertySpaces = boardSpaces.filter((space) => space.space_type === 'property');
for (const property of propertySpaces) {
  if (!property.color_group || property.color_group === 'none') {
    fail(`Property ${property.space_number} (${property.space_name}) is missing a color group.`);
  }

  if (Number(property.purchase_price_bud_bucks) <= 0) {
    fail(`Property ${property.space_number} (${property.space_name}) is missing a purchase price.`);
  }

  if (property.deed_card_required !== 'yes') {
    fail(`Property ${property.space_number} (${property.space_name}) must require a deed card.`);
  }
}

if (process.exitCode) {
  console.error('\nWeedopolis data validation failed. Fix the source data before building assets or code.');
  process.exit(process.exitCode);
}

console.log('Weedopolis data validation passed.');
