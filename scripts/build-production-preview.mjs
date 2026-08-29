import { cp, mkdir, rm } from 'node:fs/promises';

const outputRoot = 'dist/weedopolis';
const sourceRoot = 'digital/weedopolis-web';

await rm(outputRoot, { recursive: true, force: true });
await mkdir(outputRoot, { recursive: true });

// Ship the recovered full browser prototype instead of the lightweight
// menu/lobby preview. The DTFSeeds public-suite workflow publishes everything
// in dist/weedopolis to https://dtfseeds.com/games/weedopolis/.
await cp(sourceRoot, outputRoot, { recursive: true });

console.log(`Built playable Weedopolis web game from ${sourceRoot} at ${outputRoot}`);
