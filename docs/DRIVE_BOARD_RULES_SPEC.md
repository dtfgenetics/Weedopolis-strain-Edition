# Weedopolis — Drive Board & Rules Specification

- Drive source ID: `1j0OjlmOlhVKgtzEJzflScKKSJ6z1srDJoYqIRsXN6zM`
- Drive title: `Weedopolis - Board and Rules Specification`
- Drive created: 2026-06-22T02:38:53.721Z
- Drive modified: 2026-07-14T23:14:23.415Z
- Migration date: 2026-08-18
- Record role: historical/controlled Drive specification mirror

> Current-design note: this Drive document predates the later Weedopolis V2 independent-expression/legal-risk work. Preserve the mechanics and production constraints that remain useful, but do not treat references to another commercial board-game layout/style as a requirement to copy protected expression. Current canonical repo rules, original board geometry, art, terminology, and source-of-truth documentation control the production implementation.

## Product direction captured by Drive

Weedopolis should be approachable, funny, visually strong, and easy to play rather than becoming an overly complex cannabis economy simulator.

## Locked production constraints captured by Drive

- Name: Weedopolis.
- Board-space text should face outward from the center.
- Top-row spaces face north/up.
- Bottom-row spaces face south/down.
- Left-row spaces face west/left.
- Right-row spaces face east/right.
- Corners remain readable and properly oriented.
- No Harvest Cards.
- No Pressure Cards.

## Base-board workflow

1. Create a clean empty board base.
2. Confirm square count and corner placement.
3. Confirm outward orientation.
4. Build individual side rows as transparent overlays where useful to production.
5. Add property colors after orientation is approved.
6. Add strain names/prices/icons after the structure passes review.

## Problems the source explicitly warns against

- Incorrect number of spaces.
- Side spaces rotated incorrectly.
- Text facing inward instead of outward.
- Prices overlapping adjacent spaces.
- Icons/names/prices cluttering the base board before geometry is correct.
- Rebuilding a final board before individual components are validated.

## Weedopolis concepts preserved from the Drive source

- Transit/category spaces: Indica, Sativa, Autoflower, Hybrid.
- Houses equivalent: Grow Tents.
- Hotels equivalent: Dispensaries.
- Jail-themed space: Trim Jail.

## Drive folder use

- `01 Rules` — specification and final rulebook.
- `02 Board` — base board, row overlays, orientation tests, final exports.
- `03 Properties` — strain/property lists, color sets, rent/price balance.
- `04 Cards` — event/community-style cards.
- `05 Digital` — browser adaptation notes.

## Historical next-required content

The July 2026 Drive source listed property list, board-space list, corner names, card equivalents, and a final clean empty board asset as remaining. These are historical migration notes only; current repo data/assets must be checked before treating any item as still missing.

## Related migrated evidence

See `data/drive-confirmed-assets.json` for the later Drive-backed confirmed asset inventory: 28 ownership cards, 16 Community Stash cards, 15 High Chance cards, currency assets, board sources, print files, and exact Drive folder IDs.
