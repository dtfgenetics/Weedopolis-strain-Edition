# Weedopolis Asset Folder Structure

Codex should treat the approved project images as master production inputs.

## Master image location

Approved master images should be placed under:

`assets/source-approved/`

## Export locations

Web copies should be placed under:

`assets/web-optimized/`

Print copies should be placed under:

`assets/print-ready/`

## Expected folders

- `assets/source-approved/board/`
- `assets/source-approved/board-spaces/`
- `assets/source-approved/property-cards/`
- `assets/source-approved/premium-lines/`
- `assets/source-approved/utilities/`
- `assets/source-approved/decks/high-chance/`
- `assets/source-approved/decks/community-stash/`
- `assets/source-approved/pieces/`
- `assets/source-approved/money/`
- `assets/source-approved/dice/`
- `assets/source-approved/tokens/`

## Rule

Use `data/master_asset_manifest.csv` to connect each approved image to its component name, board space, web export, print export, and handling rule.

If a listed master image is missing, Codex should report it as missing and stop before generating final files from guesses.
