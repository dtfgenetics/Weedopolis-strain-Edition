# Weedopolis Repository Instructions

## Repository identity
This is the authoritative production repository for **Weedopolis: Strain City Edition**.

All production work must stay in this repository unless the user explicitly says otherwise.

## Correct game identity
Weedopolis is a cannabis-themed property-trading board game and future digital browser game. It is not a city-building game, not a random grow simulator, and not the old Potopoly project.

## Required source-of-truth files
Before editing game logic, board data, assets, card data, printable files, or public-facing copy, check:

- `README.md`
- `docs/WEEDOPOLIS_PRODUCTION_BIBLE.md`
- `docs/BUILD_PHASES.md`
- `docs/REPO_ROUTING.md`
- `data/board_map.csv`
- `data/color_groups.csv`
- `data/asset_registry.csv`
- `data/game_config.json`

## Locked rules
- Public-facing name: `Weedopolis`
- Edition: `Strain City Edition`
- Board space count: exactly 40
- Corners: exactly 4
- Strain properties: exactly 22
- Category spaces: exactly 4
- Card draw spaces: exactly 6
- Utilities: exactly 2
- Taxes/fees: exactly 2
- Houses are `Grow Tents`
- Hotels are `Dispensaries`
- Chance is `High Chance`
- Community Chest is `Community Stash`
- Jail is `Trim Jail`
- Go to Jail is `Compliance Check`
- Free Parking-style space is `Smoke Break`
- Go/Start is `Start Session`
- Railroads are `Indica`, `Sativa`, `Hybrid`, and `Autoflower`
- Do not add Harvest Cards or Pressure Cards to Weedopolis.

## Board orientation rule
All board spaces must face outward from the center:

- Bottom row faces the bottom edge
- Left row faces the left edge
- Top row faces the top edge
- Right row faces the right edge

Property tile order is always:

1. Color bar
2. Strain name
3. Icon/image
4. Bold price

## Asset rules
- Never overwrite approved source assets.
- Do not crop, stretch, recolor, or regenerate approved artwork unless the task explicitly requests that exact change.
- Keep print-ready assets separate from web-optimized assets.
- Do not silently replace missing assets with unrelated placeholders.
- Preserve printable source files and export copies separately.

## Coding rules
- Keep master data separate from UI rendering.
- Do not hardcode board spaces into page components if a data file exists.
- Add validation before expanding features.
- Make small commits and small pull requests.
- Report changed files, tests run, and unresolved issues after every task.

## Required validation mindset
Before claiming completion, check:

- The board has exactly 40 spaces.
- Color groups match `data/board_map.csv`.
- Properties have prices and color groups.
- Categories and utilities are not treated as normal strain properties.
- Public copy does not describe Weedopolis as a city-building game.
- Print specs remain 300 DPI or higher unless intentionally changed.
