# Weedopolis Creative Structure Guide

## Purpose

This guide controls how creativity is used in Weedopolis asset generation.

The problem to avoid: visually interesting assets that do not match the game system, orientation, text hierarchy, file structure, or print needs.

The rule: creativity must live inside a fixed structure.

## Creative hierarchy

Every asset must be designed in this order:

1. **Game function** — what the asset does in play.
2. **Text requirement** — what words/numbers must appear.
3. **Board/card orientation** — which way it faces and where text sits.
4. **Visual symbol** — the icon or illustration that communicates the space.
5. **Style layer** — vintage cannabis board-game look.
6. **Texture/detail layer** — parchment, ink, engraving, small flourishes.
7. **Export layer** — SVG, transparent PNG, print PDF, or data file.

Do not start with style. Start with function.

## Visual style lane

Weedopolis should consistently feel like:

- Vintage property-trading board game
- Cannabis city map
- Premium dispensary menu
- Cream parchment paper
- Deep green ink
- Gold accent details
- Clear board-game iconography
- Clean adult humor

It should not feel like:

- A random weed meme collage
- A psychedelic poster
- A cheap clipart board
- A direct copy of another board game
- Overloaded AI artwork with unreadable text

## Asset generation structure

Every generated image or design prompt must include these fields:

1. **Asset name**
2. **Asset type**
3. **Game purpose**
4. **Required exact text**
5. **Orientation/facing**
6. **Dimensions or aspect ratio**
7. **Color group or deck family**
8. **Icon/imagery direction**
9. **Style rules**
10. **What to avoid**
11. **Output requirement**
12. **Acceptance checklist**

## Text hierarchy rules

Text must be arranged by importance.

### Board property spaces

Order:

1. Color bar
2. Property/strain name
3. Icon/image
4. Price line

Text rules:

- Strain name must be the largest text on a property tile.
- Price must be bold and readable.
- Use `BUD BUCKS`, not dollars.
- Do not put long descriptions on board spaces.
- Do not let icons cover or compete with text.

### Board card spaces

Order:

1. Deck name
2. Large deck symbol
3. `DRAW CARD`

Required text examples:

- `HIGH CHANCE`
- `DRAW CARD`
- `COMMUNITY STASH`
- `DRAW CARD`

### Corner spaces

Corners may use larger art, but text must still be short.

Examples:

- `START SESSION`
- `COLLECT 200 BUD BUCKS`
- `TRIM JAIL`
- `JUST VISITING`
- `SMOKE BREAK`
- `COMPLIANCE CHECK`
- `GO TO TRIM JAIL`

### Deed cards

Order:

1. Color bar or category badge
2. Property name
3. Purchase price
4. Rent table
5. Upgrade cost
6. Mortgage/stash value
7. Small footer branding

Deed cards can carry more information than board spaces.

### Draw cards

Order:

1. Deck name
2. Card title
3. Flavor line, if short
4. Mechanical instruction
5. Small icon/art

Mechanical instruction must be unmistakable.

Bad card text:

- Too funny but unclear
- Too long
- Multiple conflicting effects
- Hidden important rules in flavor text

Good card text:

- `Advance to Start Session. Collect 200 Bud Bucks.`
- `Pay 50 Bud Bucks.`
- `Move back 3 spaces.`
- `Go directly to Trim Jail. Do not collect 200 Bud Bucks.`

## Icon system

Icons should be simple and readable at board-space size.

Rules:

- One main icon per board space.
- Use bold silhouettes or engraved-style spot illustrations.
- Avoid tiny internal details.
- Use consistent line weight.
- Use consistent shadow/texture treatment.
- Do not mix photorealistic art with flat clipart.

## Creativity lanes by asset family

### Strain properties

Creative freedom:

- Icon metaphor
- Small background texture
- Color-bar detail
- Engraved illustration style

Do not change:

- Strain name
- Price
- Color group
- Orientation
- Tile order

### Category spaces

Creative freedom:

- Badge shape
- Category symbol
- Subtle cannabis taxonomy cues

Do not change:

- Indica/Sativa/Hybrid/Autoflower names
- 200 Bud Buck price
- Category rent system

### Utility spaces

Creative freedom:

- Utility machinery style
- Grow room visual cues

Do not change:

- Grow Lights and Water Works names
- 150 Bud Buck price
- Dice-based rent rule

### Tax/fee spaces

Creative freedom:

- Receipt, stamp, clipboard, lab imagery

Do not change:

- 420 Tax = Pay 200 Bud Bucks
- Lab Testing Fee = Pay 100 Bud Bucks

### Card decks

Creative freedom:

- Card art
- Title personality
- Flavor language

Do not change:

- Clear mechanical instruction
- Deck identity
- Card count target
- Game balance

### Money

Creative freedom:

- Portrait/seal art
- Border engraving
- Denomination color accents

Do not change:

- Bud Bucks name
- Denomination clarity
- Counterfeit-looking parody money disclaimer if needed later

## Prompt template for image generation

Use this structure for every asset prompt:

```text
Create [asset name] for Weedopolis: Strain City Edition.
Asset type: [board space / deed card / draw card / money / token / board template].
Game purpose: [what it does].
Required exact text: [text that must appear].
Orientation: [bottom_edge / left_edge / top_edge / right_edge / upright card].
Color group/deck family: [brown / light_blue / High Chance / Community Stash / etc.].
Visual icon: [simple icon direction].
Style: vintage cannabis board game, cream parchment, deep green ink, gold accents, clean readable print design.
Layout: [specific text order and placement].
Avoid: unreadable text, extra words, wrong prices, wrong orientation, fake transparency, cheap clipart, direct copy of existing board games.
Output: [SVG-style flat asset / transparent PNG / print-ready card front / etc.].
```

## Acceptance checklist for every generated asset

An asset is rejected if any of these fail:

- Wrong game name
- Wrong space name
- Wrong price or fee
- Wrong board orientation
- Missing required text
- Text too small to read
- Icon does not match the spec
- File cannot be reused as a production asset
- Style does not match Weedopolis
- It looks like a poster instead of a board-game component

## Program manager rule

Every creative generation must be traceable back to one source row in one of these files:

- `data/board_space_asset_spec.csv`
- `data/deed_values.csv`
- `data/high_chance_cards.csv`
- `data/community_stash_cards.csv`
- `data/component_asset_spec.csv`

If it cannot be traced to source data, it is not ready to generate.
