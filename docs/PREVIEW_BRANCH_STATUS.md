# Playable Preview Status

The historical `playable-preview` branch note is retained only for provenance. The canonical Weedopolis browser implementation now lives on `main` under:

`digital/weedopolis-web/`

Current canonical validation is driven by `package.json` and the GitHub Actions workflows, not by the retired branch checklist.

## Current browser prototype

The canonical digital prototype includes:

- the locked 40-space Weedopolis board;
- 2–8 local players with custom names;
- dice movement;
- property purchase and auctions;
- rent, taxes, utilities, and category rent;
- Grow Tent / Dispensary upgrades;
- mortgages;
- Trim Jail behavior;
- High Chance and Community Stash decks;
- local save/load;
- production board/property assets;
- mobile turn controls;
- trading support;
- storage-safety validation.

## Current checks

Run:

```bash
npm run validate
npm run check:preview
npm run check:online
npm run check:wordpress
```

The production-preview and canonical CI workflows enforce the active implementation on `main`.

## Working rule

Do not use the old preview-branch cleanup list as an active backlog. New gameplay, UI, multiplayer, board-data, or asset work must be based on the canonical sources in `digital/weedopolis-web/`, `src/games/weedopolis/`, `data/`, and `docs/WEEDOPOLIS_PRODUCTION_BIBLE.md`.
