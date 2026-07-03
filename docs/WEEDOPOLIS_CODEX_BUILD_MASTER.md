# Weedopolis Codex Build Master

This document tells Codex how to build Weedopolis without confusing approved print assets, board data, card data, and digital gameplay.

## Build goal

Build **Weedopolis: Strain City Edition** as a complete print-first and digital-ready cannabis property-trading board game.

Codex must treat the repo as a production system, not a loose idea folder.

## What must be defined before full build

The full game requires these layers:

1. Master rules and terminology
2. Board map data
3. Color groups and prices
4. Approved image asset manifest
5. Property / category / utility card data
6. High Chance deck data
7. Community Stash deck data
8. Bud Bucks currency data
9. Grow Tent and Dispensary upgrade piece rules
10. Dice and player movement rules
11. Print layout specs
12. Digital game implementation
13. Validation scripts

## Required files Codex must check first

- `AGENTS.md`
- `README.md`
- `docs/WEEDOPOLIS_PRODUCTION_BIBLE.md`
- `docs/BUILD_PHASES.md`
- `docs/REPO_ROUTING.md`
- `data/game_config.json`
- `data/board_map.csv`
- `data/color_groups.csv`
- `data/asset_registry.csv`
- `data/master_asset_manifest.csv`

## Approved image rule

Approved images must live under:

- `assets/source-approved/`

Codex may create optimized copies under:

- `assets/web-optimized/`
- `assets/print-ready/`

Codex must not overwrite, crop, stretch, recolor, or regenerate approved source images unless explicitly instructed.

If an approved image is missing from the repo, Codex must report it as missing instead of silently replacing it.

## Asset manifest rule

`data/master_asset_manifest.csv` is the image routing source of truth.

Each approved asset must have:

- asset ID
- component type
- component name
- board space number if applicable
- approved source path
- web export path
- print export path
- required format
- target print size
- DPI target
- status
- Codex handling rule

## Board rules

The board must match `data/board_map.csv` exactly:

- 40 total spaces
- 4 corners
- 22 strain properties
- 4 category spaces
- 6 draw-card spaces
- 2 utilities
- 2 taxes/fees

All spaces must face outward from the center.

## Property cards

Property cards must match the board map:

- same strain name
- same board space number
- same color group
- same purchase price
- same category/type

Category cards are Premium Line cards:

- Indica
- Sativa
- Hybrid
- Autoflower

Utility cards are:

- Grow Lights
- Water Works

Category and utility cards are not normal strain color properties.

## Draw-card decks

There are exactly two draw-card deck systems:

- High Chance
- Community Stash

Do not add Harvest Cards or Pressure Cards.

Each deck should eventually have:

- card data file
- approved front/back template
- card images
- print sheet
- web data export

## Upgrade pieces

Classic houses are replaced by:

- Grow Tents

Classic hotels are replaced by:

- Dispensaries

Codex must use those terms in rules, UI, cards, and printable files.

## Currency

Money is called:

- Bud Bucks

Default denominations come from `data/game_config.json`.

Do not call it cash, dollars, money, or Monopoly money in player-facing content unless explaining rules internally.

## Dice and player movement

Digital gameplay must support dice-based movement around the 40-space board.

Movement rules:

- Player position is an integer from 1 to 40.
- Moving past space 40 wraps to space 1.
- Passing or landing on Start Session awards the configured Bud Bucks amount.
- Landing on a space must resolve that space type from `data/board_map.csv`.
- Tokens must sit visually on board spaces, not off to the side.

## Print rules

Print assets must be treated as production files.

Minimum print requirements:

- 300 DPI or higher
- locked physical size
- no stretching
- no accidental cropping
- bleed-safe versions where needed
- no-bleed proof versions where needed
- consistent card sizing across print sheets

Property card print rebuilds may use 600 DPI when preparing high-quality print sheets.

## Validation required before expansion

Before building more code or print exports, Codex should run or create validation that checks:

- board count and board type counts
- board space numbers 1 through 40 exist once each
- color groups match board map
- all listed approved assets have expected paths
- all required property cards exist or are reported missing
- all Premium Lines exist or are reported missing
- Grow Lights and Water Works exist or are reported missing
- no outdated Potopoly naming
- no city-building description
- no Harvest Cards or Pressure Cards

## Safe small-push order

Use small reviewable pushes in this order:

1. Fix master data errors.
2. Add repo/Codex instruction files.
3. Add asset manifest and expected folders.
4. Add validation scripts.
5. Add card/deck/currency/rule data files.
6. Add approved images to source-approved folders.
7. Generate web-optimized copies.
8. Generate print-ready sheets.
9. Build digital prototype.
10. Add final QA checklist and release notes.

## Completion report format

Every Codex task must report:

- branch name
- changed files
- validation commands run
- validation results
- missing assets/data
- screenshots or print proofs if visual work changed
- exact next recommended push
