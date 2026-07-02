# Weedopolis Card Print-Prep Skill

## Purpose

Reusable production workflow for arranging approved Weedopolis card images into a print-ready system where every card is the exact same size, consistently spaced, and verified before printing or digital use.

## Core rule

Use the approved card image files only.

Do not:

- regenerate card art
- rewrite card text
- rebuild from CSV
- restyle cards
- crop or stretch cards differently from one another

The approved visual card images are the source of truth.

## Locked print spec

- Card trim size: 2.5 × 3.5 in
- Resolution: 600 DPI
- Trim pixels: 1500 × 2100 px
- Bleed version: 1650 × 2250 px
- Bleed: 0.125 in on each side
- Sheet: US Letter
- Preferred sheet layout: 6-up front sheets
- Print scale: 100% / Actual Size only

## Workflow

1. Collect approved card images.
2. Verify every source card has the same pixel dimensions and aspect ratio.
3. Reject or flag any image that is cropped, blurry, stretched, shifted, or visually inconsistent.
4. Normalize each card to the locked 2.5 × 3.5 in 600 DPI format.
5. Create bleed-safe versions.
6. Arrange cards on evenly spaced US Letter sheets.
7. Add cut/trim guides outside the card face only.
8. Export print sheets.
9. Generate a manifest.
10. Generate a preflight audit.
11. Confirm no extra labels, overlays, or accidental text are on top of card artwork.

## Current verified deck context

The current verified uploaded Weedopolis card set contains:

- High Chance: 15 cards
- Community Stash: 16 cards
- Total: 31 cards

Current verified source images were checked at:

- Source pixel size: 1097 × 1536 px
- Normalized card trim: 1500 × 2100 px
- Normalized card bleed: 1650 × 2250 px

## Deliverables

Each print-prep run should produce:

- normalized individual card PNGs
- print-sheet PNGs or PDFs
- manifest CSV
- preflight audit TXT
- preview/contact sheet
- ZIP package when useful

## QA checklist

Before saying a package is ready, verify:

- all cards are the same final pixel size
- all cards have the same print dimensions
- all sheet placements use the same card box size
- no card face is clipped
- no text is cut off
- no artwork is stretched or squished
- spacing is equal across the page
- card order is documented
- source images are approved visual cards, not regenerated card art

## One-sentence production brief

Create a print-ready Weedopolis card layout system using only the approved High Chance and Community Stash card images, normalizing every card to the exact same 2.5 × 3.5 inch size at 600 DPI, and placing them into evenly spaced 6-up US Letter print sheets with consistent alignment and clean cutting workflow.
