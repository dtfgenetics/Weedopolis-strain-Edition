import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const outputRoot = 'dist/weedopolis';

await rm(outputRoot, { recursive: true, force: true });
await mkdir(outputRoot, { recursive: true });

// Copy the public shell.
await cp('public/weedopolis-preview/style.css', join(outputRoot, 'style.css'));
let html = await readFile('public/weedopolis-preview/index.html', 'utf8');
html = html.replace(
  'src="../../src/games/weedopolis/preview/app.js"',
  'src="./src/games/weedopolis/preview/app.js"'
);
await writeFile(join(outputRoot, 'index.html'), html, 'utf8');

// Preserve the module tree so native browser ESM imports continue to work.
const gameSourceTarget = join(outputRoot, 'src/games/weedopolis');
await mkdir(dirname(gameSourceTarget), { recursive: true });
await cp('src/games/weedopolis', gameSourceTarget, { recursive: true });

// Copy only the production data needed by the browser preview.
await mkdir(join(outputRoot, 'data'), { recursive: true });
await cp('data/board_map.csv', join(outputRoot, 'data/board_map.csv'));

console.log(`Built self-contained Weedopolis preview at ${outputRoot}`);
