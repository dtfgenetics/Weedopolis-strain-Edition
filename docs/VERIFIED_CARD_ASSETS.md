# Verified Weedopolis Card Assets

This document locks the approved visual source for the **High Chance** and **Community Stash** decks.

## Locked source of truth

The approved source is the uploaded visual card image set, not the earlier regenerated CSV-card package.

- High Chance approved cards: 15
- Community Stash approved cards: 16
- Source pixel size for every approved uploaded card: 1097 × 1536 px
- Normalized print trim: 2.5 × 3.5 in
- Normalized print resolution: 600 DPI
- Normalized trim pixels: 1500 × 2100 px
- Normalized bleed pixels: 1650 × 2250 px
- Print sheet layout generated: US Letter, 6-up front sheets

## Production rule

Do not regenerate these cards from CSV data. Do not rewrite the text. Do not reinterpret the art. Future print packages must use the approved card image files only, then normalize size, align, and verify.

## Included verification files

- `assets/decks/verified_cards/Weedopolis_Approved_Cards_Manifest.csv`
- `assets/decks/verified_cards/Weedopolis_Approved_Cards_PREFLIGHT_AUDIT.txt`
- `assets/decks/verified_cards/README.md`

## Important note

The GitHub connector successfully committed the verification registry, manifest, and audit to the repo branch. The approved PNG image binaries are stored in the local print package and should be uploaded into `assets/decks/verified_cards/source/` and `assets/decks/verified_cards/normalized_cards/` from the generated ZIP package when binary file upload is available.
