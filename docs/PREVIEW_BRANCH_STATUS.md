# Playable Preview Branch Status

Branch: `playable-preview`

Status:

- Preview HTML page added.
- Preview mount script added.
- Preview validator added.

Manual validation command:

```bash
node scripts/validate-playable-preview.mjs
```

Expected output:

```text
playable preview validation passed
```

Known cleanup:

- Add or repair preview styling.
- Wire preview validator into package scripts.
- Replace the sample board rows with parsed board map data.
- Add buy, rent, and draw-card action buttons.
