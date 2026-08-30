# Weedopolis Digital Visual Contract

## Authority

The digital game must use the existing Weedopolis V1 production masters as the source of truth.

- Board master: `Weedopolis_Master_Board_20x20in_300dpi.pdf` (6000 x 6000 embedded raster).
- Property/deed artwork: verified individual files from `01_Property_Deed_Cards`.
- 28-card exact-size PDF is an assembled reference package, not a replacement art source.
- V2 / Hex Edition assets are a separate product and must never replace V1 assets.

## Approved structure

The 2026-08-29 desktop/mobile UI mockup establishes the layout and interaction structure only:

- premium command bar with game identity, Bud Bucks, bank/save/new-game controls;
- board-first desktop composition with right-side rail;
- stacked mobile composition;
- Current Turn, Players, Property / Management, and Game Log hierarchy;
- touch-friendly primary actions;
- responsive mobile action dock;
- board tokens, dice, buy/auction/mortgage/upgrade controls tied to game state.

The mockup board and card illustrations are NOT production masters and must not be copied into the shipped game.

## Locked V1 property colors

- brown `#683417`
- light blue `#1C78A4`
- pink `#7B1139`
- orange `#E65101`
- red `#B70405`
- yellow `#CC9F19`
- green `#3C8527`
- dark blue `#0C1179`

These colors apply only to the 22 strain property groups. Do not recolor Premium Lines, Grow Lights, or Water Works.

## Asset rules

1. Do not regenerate approved board/property artwork.
2. Do not substitute CSS illustrations for an available master asset.
3. Do not crop or distort card art.
4. Keep property names, prices, rules, and group assignments synchronized with the V1 master.
5. Every visual slot must have a deterministic asset mapping.
6. Missing final assets must be visibly flagged in development and must fail production acceptance once the corresponding master is registered.
7. Production should never silently fall back to V2/Hex or AI-generated board/card art.
