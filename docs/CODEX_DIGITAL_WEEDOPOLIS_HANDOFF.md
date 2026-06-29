# Codex handoff: Weedopolis digital prototype

Branch: `digital-weedopolis-prototype`

Repo: `dtfgenetics/Weedopolis-strain-Edition`

## Goal

Turn the current Weedopolis data and starter web prototype into a polished playable browser game using the existing project rules and assets.

This repo is the source of truth. Do not use the deleted/old Potopoly repo. Do not rename the game.

## Files now available

### Existing source-of-truth files

- `docs/WEEDOPOLIS_PRODUCTION_BIBLE.md`
- `docs/BUILD_PHASES.md`
- `docs/REPO_ROUTING.md`
- `data/board_map.csv`
- `data/asset_registry.csv`
- `data/color_groups.csv`
- `data/game_config.json`

### Added for the digital build

- `data/rent_ladder.csv`
- `data/high_chance_cards.csv` expanded to 24 cards
- `data/community_stash_cards.csv` expanded to 24 cards
- `digital/weedopolis-web/index.html`
- `digital/weedopolis-web/styles.css` placeholder
- `digital/weedopolis-web/js/weedopolis-edition.js`
- `digital/weedopolis-web/js/weedopolis-engine.js`
- `digital/weedopolis-web/js/weedopolis-ui.js` minimal placeholder UI
- `digital/weedopolis-web/js/weedopolis-tests.js`
- `digital/weedopolis-web/assets/asset-manifest.json`
- `digital/weedopolis-web/LICENSE-THIRD-PARTY.md`
- `digital/weedopolis-web/README.md`

## Current implementation status

The data layer is mostly complete:

- 40 board spaces are defined.
- Board index conversion is handled: `space_number 1 = square index 0`, `space_number 40 = square index 39`.
- All 22 strain properties are included.
- All 4 category spaces are included: Indica, Sativa, Hybrid, Autoflower.
- Both utilities are included: Grow Lights and Water Works.
- Card spaces are included: 3 High Chance and 3 Community Stash.
- Taxes/fees are included: 420 Tax and Lab Testing Fee.
- Full property rent ladder exists for all 22 strain properties.
- High Chance deck has 24 cards.
- Community Stash deck has 24 cards.

The engine starter includes:

- 2-8 local players
- custom player names
- dice rolling
- movement
- Start Session payout
- buying properties
- auction starter logic
- rent calculation
- category/Premium Line rent scaling
- utility rent calculation
- Trim Jail and Compliance Check behavior
- High Chance and Community Stash card actions
- Grow Tent and Dispensary upgrades
- mortgage and unmortgage logic
- localStorage save/load

The current UI is intentionally minimal. It proves the files are wired, but it is not the final visual game interface.

## Codex tasks

### 1. Pull and inspect the branch

Use branch:

`digital-weedopolis-prototype`

Run locally:

```bash
cd digital/weedopolis-web
python -m http.server 8000
```

Open:

`http://localhost:8000`

In browser console run:

`runWeedopolisTests()`

All tests should pass before visual work begins.

### 2. Replace minimal UI with full playable UI

Upgrade `digital/weedopolis-web/js/weedopolis-ui.js` and `digital/weedopolis-web/styles.css`.

Required UI features:

- professional board layout with 40 perimeter spaces
- center Weedopolis logo area
- spaces facing outward by side
- property tile order: color bar, strain name, icon/image, bold price
- tokens sit directly on board spaces
- action panel for current player
- dice button
- buy button
- auction modal or panel
- rent payment feedback
- card draw modal
- manage properties panel
- upgrade buttons for Grow Tents and Dispensaries
- mortgage/unmortgage buttons
- player money shown as Bud Bucks
- clear game log
- mobile responsive layout

### 3. Keep data separated from visuals

Do not hardcode board content in the UI.

Use:

- `WEEDOPOLIS_EDITION.spaces`
- `WEEDOPOLIS_EDITION.decks.highChance`
- `WEEDOPOLIS_EDITION.decks.communityStash`
- `assets/asset-manifest.json`

### 4. Preserve Weedopolis terms

The UI must use:

- Bud Bucks
- Grow Tents
- Dispensaries
- High Chance
- Community Stash
- Trim Jail
- Compliance Check
- Smoke Break
- Start Session
- Premium Lines
- Indica
- Sativa
- Hybrid
- Autoflower

Do not display classic Monopoly wording.

### 5. Asset integration

Use the manifest as placeholders until approved assets are placed in the repo.

Do not regenerate or alter approved artwork. Only display it.

Support these folders:

- `digital/weedopolis-web/assets/board/`
- `digital/weedopolis-web/assets/property-cards/`
- `digital/weedopolis-web/assets/money/`
- `digital/weedopolis-web/assets/cards/`
- `digital/weedopolis-web/assets/tokens/`
- `digital/weedopolis-web/assets/icons/`

### 6. Tests to keep and expand

Keep `runWeedopolisTests()` working.

Expand it or add automated tests for:

- buying
- rent payment
- full color group double rent
- Premium Line/category rent scaling: 25, 50, 100, 200
- utility rent: 4x/10x dice roll
- High Chance card effects
- Community Stash card effects
- Compliance Check sends player to Trim Jail
- localStorage save/load
- no classic property names in player-facing UI

### 7. Important legal/content boundary

The intrepidcoder/monopoly repo can be used as an MIT-licensed mechanics reference, but the final Weedopolis build must not ship classic Monopoly names, card text, board art, logos, or player-facing data.

Preserve the third-party license note if substantial original code is copied.

## Acceptance checklist

The branch is ready when:

- `runWeedopolisTests()` passes.
- The board displays exactly 40 spaces.
- Player tokens sit on the board spaces.
- 2-8 players can complete multiple turns.
- All buy/rent/tax/card/jail flows work.
- All player-facing money says Bud Bucks.
- All building language says Grow Tents and Dispensaries.
- The UI contains no classic Monopoly property names.
- The visual board follows the locked outward orientation rule.
- Approved assets can be dropped into the manifest paths without rewriting game logic.
