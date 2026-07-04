# Weedopolis Live Game Audit

Live route checked: `https://dtfseeds.com/games/weedopolis/`

## Current status

The route is reachable, but the current public game experience does not expose a complete multiplayer-ready Weedopolis flow.

The repo currently works best as the Weedopolis production-data and asset-source repo. The deployed website/game implementation still needs to be connected to this source data and finished as a real playable game module.

## Main player-facing gap

The largest missing system is multiplayer invitation.

A playable public version needs:

- Create Game
- Join Game
- Game Code
- Invite Link
- Copy Invite Link
- Lobby
- Player Name Entry
- Token Selection
- Ready Button
- Host Start Button
- Turn Sync
- Reconnect or Resume

## Game systems to verify or build

- Main menu
- Solo test mode
- Local pass-and-play mode
- Online multiplayer-ready mode
- Dice roll using two six-sided dice
- Token movement around 40 spaces
- Start Session reward
- Landing resolver
- Property purchase
- Rent payment
- Bud Bucks balance updates
- High Chance draw cards
- Community Stash draw cards
- Utility rent for Grow Lights and Water Works
- Premium Line rent for Indica, Sativa, Hybrid, Autoflower
- Grow Tent building
- Dispensary upgrade
- Compliance Check sends player to Trim Jail
- Smoke Break safe space
- Game log
- Mobile controls

## Data sources that must drive gameplay

- `data/board_map.csv`
- `data/color_groups.csv`
- `data/game_config.json`
- `data/money_rules.json`
- `data/movement_rules.json`
- `data/piece_rules.json`
- `data/deck_rules.json`
- `data/rent_schedule_part_*.csv`

## Current repo risks

- The live game route may be controlled by another website repo or deployment source.
- PR #3 is a card asset scaffold and was draft status when audited.
- PR #3 needed board/card correction overlay work before production use.
- PR #5 adds rules data and validation scaffolding but must be reviewed and merged before the game code depends on it.
- No confirmed deployed Weedopolis app module was found in this repo.

## Recommended next build PRs

1. Merge the safe rules/data foundation after review.
2. Fix and finalize the digital card asset manifest.
3. Create a Weedopolis web-game module.
4. Build local pass-and-play first.
5. Add Create Game and Join Game screens.
6. Add invite link and game-code flow.
7. Add lobby and ready/start flow.
8. Add the full turn state machine.
9. Add landing actions.
10. Add realtime multiplayer adapter after the local game loop works.

## Definition of done for multiplayer MVP

- A host can create a game.
- The game generates a short code.
- The game generates a shareable invite link.
- A second player can join by code or link.
- Players can enter names.
- Players can select tokens.
- Players can ready up.
- Host can start the game.
- Players can take turns.
- Game state survives refresh or has a clear reconnect path.
