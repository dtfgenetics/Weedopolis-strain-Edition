# Weedopolis: Strain City Edition

Production repository for **Weedopolis: Strain City Edition**, a cannabis-themed property-trading board game.

This repo is the source of truth for the game system, board map, asset checklist, card decks, print files, and future digital implementation.

## Core production rule

Do not generate the final board as one uncontrolled image. Build the game in layers:

1. Master data
2. Blank board skeleton
3. Four orientation row templates
4. Individual board spaces
5. Deed cards
6. High Chance deck
7. Community Stash deck
8. Bud Bucks money
9. Tokens and upgrade pieces
10. Print files
11. Digital assets

## Locked board structure

The board must have exactly **40 spaces**:

- 4 corners
- 22 strain properties
- 4 category spaces
- 6 card draw spaces
- 2 utilities
- 2 taxes/fees

## Locked orientation rule

Board spaces must face outward from the center:

- Bottom row faces bottom
- Left row faces left
- Top row faces top
- Right row faces right

Property tile order is always:

**Color bar → strain name → icon/image → bold price**

## Locked replacement terms

| Classic concept | Weedopolis version |
|---|---|
| Money | Bud Bucks |
| Houses | Grow Tents |
| Hotels | Dispensaries |
| Chance | High Chance |
| Community Chest | Community Stash |
| Jail | Trim Jail |
| Go to Jail | Compliance Check |
| Free Parking-style space | Smoke Break |
| Go/Start | Start Session |
| Railroads | Indica, Sativa, Hybrid, Autoflower |

## Current files

- `docs/WEEDOPOLIS_PRODUCTION_BIBLE.md` — locked design/game rules
- `docs/BUILD_PHASES.md` — production order
- `data/board_map.csv` — official 40-space board map
- `data/asset_registry.csv` — full asset checklist
- `data/color_groups.csv` — property color set structure
- `data/game_config.json` — core game settings
