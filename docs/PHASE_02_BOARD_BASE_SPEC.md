# Phase 02 — Blank Board Base and Orientation Templates

## Purpose

Phase 02 creates the board skeleton that every later Weedopolis asset must fit into.

The goal is not to create the final decorated board yet. The goal is to create a reusable production base with correct geometry, orientation, safe zones, and text hierarchy.

## Board base target

- Shape: square
- Master size: 20 in x 20 in
- Print resolution: 300 DPI
- Pixel master target: 6000 x 6000 px
- Board spaces: exactly 40
- Corners: 4
- Non-corner spaces per side: 9
- Center area: open safe zone for logo, deck areas, legend, and decorative cannabis city artwork

## Board geometry

Each side contains:

- 1 corner at the beginning/end of the side
- 9 rectangular spaces between corners
- 1 corner at the opposite end

The board must visually read as one continuous track.

## Required board zones

1. Outer border
2. Inner board-space border
3. 40 perimeter spaces
4. Center artwork safe zone
5. High Chance deck zone
6. Community Stash deck zone
7. Logo zone
8. Grow Tent / Dispensary legend zone
9. Optional decorative cannabis city map background zone

## Blank board rules

The blank board base should contain:

- Correct board outline
- Correct 40-space grid
- Empty property spaces
- Empty corner spaces
- Empty card/utility/tax/category spaces
- Center safe zones
- No strain names
- No prices
- No final icons
- No final card text

The blank board can include placeholder labels only in development versions, not final print base exports.

## Orientation template requirement

Four row templates must exist before any final board spaces are mass-produced:

1. Bottom row template — faces bottom edge
2. Left row template — faces left edge
3. Top row template — faces top edge
4. Right row template — faces right edge

## Property tile layout

Every property tile uses this hierarchy:

1. Color bar
2. Strain name
3. Icon/image
4. Bold price line

This hierarchy rotates with the side orientation.

## Card-space layout

Every card draw space uses this hierarchy:

1. Deck name
2. Large icon/symbol
3. DRAW CARD

## Category/utility/tax layout

Category and utility spaces use the same hierarchy as properties but without color-set rent context:

1. Space name
2. Icon
3. Price or fee instruction
4. BUD BUCKS line where needed

## Corner layout

Corners can be larger and more illustrated, but text must remain short.

Corner required text:

- Start Session: `START SESSION` and `COLLECT 200 BUD BUCKS`
- Trim Jail: `TRIM JAIL` and `JUST VISITING`
- Smoke Break: `SMOKE BREAK`
- Compliance Check: `COMPLIANCE CHECK` and `GO TO TRIM JAIL`

## First proof assets

Before making all 40 spaces, create these proof assets:

1. One bottom-facing property tile: `Acapulco Gold`
2. One left-facing property tile: `Blue Dream`
3. One top-facing property tile: `GSC`
4. One right-facing property tile: `OG Kush`
5. One card tile: `High Chance`
6. One card tile: `Community Stash`
7. One category tile: `Indica`
8. One utility tile: `Grow Lights`
9. One tax tile: `420 Tax`
10. One corner tile: `Start Session`

## Acceptance checklist

The blank board base fails if:

- It does not have exactly 40 spaces
- The corner sizes are inconsistent
- A side has the wrong number of spaces
- The center area crowds the perimeter track
- It includes final names or icons too early
- It cannot be exported as SVG/PDF/PNG

A row template fails if:

- The text faces the wrong edge
- The price is not readable
- The color bar is not in the correct position
- The icon competes with the name or price
- The template cannot be reused for multiple spaces

## Next phase trigger

Only move to Phase 03 after the blank board and four row templates pass review.
