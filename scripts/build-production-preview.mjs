import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const outputRoot = 'dist/weedopolis';
const sourceRoot = 'digital/weedopolis-web';
const boardChunkRoot = join(sourceRoot, 'assets/board/v1-master-b64');
const boardOutput = join(outputRoot, 'assets/board/weedopolis-master-board.webp');

await rm(outputRoot, { recursive: true, force: true });
await mkdir(outputRoot, { recursive: true });

// Ship the recovered full browser prototype instead of the lightweight
// menu/lobby preview. The DTFSeeds public-suite workflow publishes everything
// in dist/weedopolis to https://dtfseeds.com/games/weedopolis/.
await cp(sourceRoot, outputRoot, { recursive: true });

// The GitHub connector is text-oriented, so the approved V1 board is stored as
// deterministic base64 chunks in source control and reconstructed during build.
const boardChunks = (await readdir(boardChunkRoot))
  .filter((name) => /^part-\d+\.txt$/.test(name))
  .sort();
if (boardChunks.length !== 13) {
  throw new Error(`Expected 13 approved V1 board chunks, found ${boardChunks.length}.`);
}
const base64 = (await Promise.all(
  boardChunks.map((name) => readFile(join(boardChunkRoot, name), 'utf8'))
)).map((value) => value.trim()).join('');
const boardBytes = Buffer.from(base64, 'base64');
if (boardBytes.length < 30000 || boardBytes.subarray(0, 4).toString('ascii') !== 'RIFF' || boardBytes.subarray(8, 12).toString('ascii') !== 'WEBP') {
  throw new Error('Approved V1 Weedopolis board asset failed WebP integrity validation.');
}
await mkdir(join(outputRoot, 'assets/board'), { recursive: true });
await writeFile(boardOutput, boardBytes);

// Do not publish source transport chunks to the public site.
await rm(join(outputRoot, 'assets/board/v1-master-b64'), { recursive: true, force: true });
await rm(join(outputRoot, 'assets/board/source-b64'), { recursive: true, force: true });

console.log(`Built playable Weedopolis web game with approved V1 master board (${boardBytes.length} bytes) at ${outputRoot}`);
