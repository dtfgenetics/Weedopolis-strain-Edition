# Weedopolis Digital Game Assets v1

This package turns the corrected Weedopolis premium cards into a web-game-ready asset set.

## Contents

- `cards/png_1152x1536/` — full-size corrected master PNG files, 3:4 ratio
- `cards/webp_768x1024/` — browser-ready large card images
- `cards/webp_384x512/` — browser-ready standard card images
- `cards/thumbs_180x240/` — small preview thumbnails
- `data/weedopolis-cards.json` — game data manifest with pricing, board positions, groups, and asset paths
- `js/weedopolis-card-loader.js` — optional ES module helper for loading cards
- `preview/index.html` — simple visual preview page

## Import path recommendation

Place the folder at:

```text
/public/assets/weedopolis/cards/
```

Then load:

```js
import { loadWeedopolisCards } from '/assets/weedopolis/cards/js/weedopolis-card-loader.js';

const { cards } = await loadWeedopolisCards('/assets/weedopolis/cards');
```

## Important rules locked

- Property swatches match the provided board colors.
- Utility and Premium Line cards are not board-swatch corrected.
- All master images are exactly 1152 × 1536 px.
- Use WebP files in gameplay for performance.
- Use PNG masters for print/admin/modals where maximum quality is needed.

## Counts

- 22 property cards
- 2 utility cards
- 4 premium line cards
- 28 total cards
