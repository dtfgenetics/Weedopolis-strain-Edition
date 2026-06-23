# Weedopolis Build Phases

## Phase 1 — Foundation data

Goal: create the source of truth so the board, cards, money, rules, and digital version do not drift.

Deliverables:

- `data/game_config.json`
- `data/board_map.csv`
- `data/color_groups.csv`
- `data/asset_registry.csv`
- Production bible

Acceptance:

- Board map has exactly 40 spaces
- Public-facing name is Weedopolis
- All spaces have board side and orientation fields
- No Potopoly naming in production content

## Phase 2 — Blank board skeleton

Goal: create a clean 20x20 board base with no names, icons, or prices.

Deliverables:

- Blank 40-space board SVG
- Blank 40-space board PNG proof
- Print-safe 300 DPI PDF
- Board geometry documentation

Acceptance:

- Exactly 40 spaces
- Four corner spaces sized correctly
- Nine non-corner spaces per side
- Center zone reserved for logo and card boxes

## Phase 3 — Four orientation templates

Goal: solve the recurring orientation problem before building the full board.

Deliverables:

- Bottom-row property template
- Left-row property template
- Top-row property template
- Right-row property template
- Card-space template per side
- Category/utility/tax templates per side

Acceptance:

- Bottom row faces bottom
- Left row faces left
- Top row faces top
- Right row faces right
- Property order is color bar, strain name, icon/image, bold price

## Phase 4 — Individual board spaces

Goal: generate every board space as its own editable asset.

Deliverables:

- 40 individual board-space SVGs
- 40 transparent PNG exports
- 4 row overlay PNGs

Acceptance:

- Every asset matches `data/board_map.csv`
- No missing or duplicate spaces
- Correct outward orientation

## Phase 5 — Full assembled board

Goal: assemble the final Weedopolis board from approved components.

Deliverables:

- Full board SVG
- Full board PNG proof
- 300 DPI print PDF
- Bleed version
- No-bleed version

Acceptance:

- Passes full board checklist from production bible
- Board is not a random full-image redraw

## Phase 6 — Deed cards

Goal: create all ownership cards.

Deliverables:

- Deed card template
- 22 strain deed cards
- 4 category deed cards
- 2 utility deed cards
- Print sheet

Acceptance:

- Board prices match deed cards
- Rent values are balanced and readable

## Phase 7 — Card decks

Goal: create the two draw-card decks.

Deliverables:

- 24 High Chance cards
- 24 Community Stash cards
- Front/back templates
- Print sheets
- JSON/CSV deck data

Acceptance:

- No Harvest Cards
- No Pressure Cards
- Rules are clear and playable

## Phase 8 — Money and tokens

Goal: create physical play pieces.

Deliverables:

- Bud Bucks bill set
- Player tokens
- Grow Tent pieces
- Dispensary pieces

Acceptance:

- Money denominations are clear
- Upgrade pieces visually read as Grow Tents and Dispensaries

## Phase 9 — Rulebook and box

Goal: make the game playable and presentable.

Deliverables:

- Full rulebook
- Quick start card
- Box front/back/sides
- Box dieline

Acceptance:

- Rules are simple enough to play without explanation
- Box clearly communicates the game

## Phase 10 — Digital prototype

Goal: create data and assets for a browser-playable version.

Deliverables:

- Board JSON
- Deck JSON
- Token sprites
- Basic browser implementation

Acceptance:

- Uses same source data as physical game
- Does not duplicate or contradict the board map
