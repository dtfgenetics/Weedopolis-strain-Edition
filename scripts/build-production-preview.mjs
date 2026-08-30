import { createHash } from 'node:crypto';
import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const outputRoot = 'dist/weedopolis';
const sourceRoot = 'digital/weedopolis-web';
const boardChunkRoot = join(sourceRoot, 'assets/board/v1-master-b64');
const boardOutput = join(outputRoot, 'assets/board/weedopolis-master-board.webp');
const autoFlowerChunkRoot = join(sourceRoot, 'assets/property-cards/source-b64/autoflower');
const autoFlowerOutput = join(outputRoot, 'assets/property-cards/webp/autoflower.webp');
const AUTO_FLOWER_SHA256 = '84c0d05bfc26aa104351e3f9065e1ea8b2a94bacc566b5b66a57ff7ad98fca12';

await rm(outputRoot, { recursive: true, force: true });
await mkdir(outputRoot, { recursive: true });

// Ship the recovered full browser prototype instead of the lightweight
// menu/lobby preview. The DTFSeeds public-suite workflow publishes everything
// in dist/weedopolis to https://dtfseeds.com/games/weedopolis/.
await cp(sourceRoot, outputRoot, { recursive: true });

async function reconstructWebp({ chunkRoot, expectedChunks, output, label, minBytes, expectedSha256 = null }) {
  const chunks = (await readdir(chunkRoot))
    .filter((name) => /^part-\d+\.txt$/.test(name))
    .sort();
  if (chunks.length !== expectedChunks) {
    throw new Error(`Expected ${expectedChunks} ${label} chunks, found ${chunks.length}.`);
  }
  const base64 = (await Promise.all(
    chunks.map((name) => readFile(join(chunkRoot, name), 'utf8'))
  )).map((value) => value.trim()).join('');
  const bytes = Buffer.from(base64, 'base64');
  if (bytes.length < minBytes || bytes.subarray(0, 4).toString('ascii') !== 'RIFF' || bytes.subarray(8, 12).toString('ascii') !== 'WEBP') {
    throw new Error(`${label} failed WebP integrity validation.`);
  }
  const sha256 = createHash('sha256').update(bytes).digest('hex');
  if (expectedSha256 && sha256 !== expectedSha256) {
    throw new Error(`${label} SHA-256 mismatch: expected ${expectedSha256}, got ${sha256}.`);
  }
  await mkdir(join(output, '..'), { recursive: true });
  await writeFile(output, bytes);
  return { bytes: bytes.length, sha256 };
}

const board = await reconstructWebp({
  chunkRoot: boardChunkRoot,
  expectedChunks: 13,
  output: boardOutput,
  label: 'Approved V1 Weedopolis board asset',
  minBytes: 30000
});

const autoFlower = await reconstructWebp({
  chunkRoot: autoFlowerChunkRoot,
  expectedChunks: 7,
  output: autoFlowerOutput,
  label: 'Verified AutoFlower ownership card',
  minBytes: 39000,
  expectedSha256: AUTO_FLOWER_SHA256
});

// Do not publish source transport chunks to the public site.
await rm(join(outputRoot, 'assets/board/v1-master-b64'), { recursive: true, force: true });
await rm(join(outputRoot, 'assets/board/source-b64'), { recursive: true, force: true });
await rm(join(outputRoot, 'assets/property-cards/source-b64'), { recursive: true, force: true });

console.log(`Built playable Weedopolis web game with approved V1 master board (${board.bytes} bytes) and verified AutoFlower deed (${autoFlower.bytes} bytes, sha256=${autoFlower.sha256}) at ${outputRoot}`);
