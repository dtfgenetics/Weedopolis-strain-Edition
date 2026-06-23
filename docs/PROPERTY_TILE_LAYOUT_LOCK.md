# Weedopolis Property Tile Layout Lock

## Locked property-space order

Every strain property space must follow this exact visual order:

1. **Color bar**
2. **Property / strain title**
3. **Main image / icon**
4. **Bottom price**

In plain terms:

**Color → Title → Image → Bottom Price**

This is the required structure for every property board space on every side of the board.

## What this means

The image/icon sits between the title and the price.

The price always lives at the bottom of the property tile after the image. It must be bold, clear, and readable.

## Rotated side rule

The same order applies on all four board sides, but the entire tile rotates to face outward:

| Board side | Tile faces | Property order |
|---|---|---|
| Bottom row | Bottom edge | Color → Title → Image → Bottom Price |
| Left row | Left edge | Color → Title → Image → Bottom Price |
| Top row | Top edge | Color → Title → Image → Bottom Price |
| Right row | Right edge | Color → Title → Image → Bottom Price |

Do not rearrange the internal hierarchy when rotating a tile. Rotate the complete tile as one designed unit.

## Board-space text format

Property board spaces use short text only:

```text
[STRAIN NAME]
[PRICE]
BUD BUCKS
```

Example:

```text
BLUE DREAM
200
BUD BUCKS
```

## Rejection rules

Reject any property tile where:

- The image is above the strain title
- The price is above the image
- The price is not at the bottom of the tile
- The color bar is missing
- The title is smaller than the price
- The image competes with or covers the title
- The image competes with or covers the price
- The side orientation is wrong
- The tile does not preserve the Color → Title → Image → Bottom Price order
