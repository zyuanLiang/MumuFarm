# P29 — Fix the wrong character model

## Wrong model (why it looked broken)

Assumed the girl was a **CSS silhouette + hat/dress/boots stickers**.
Those stickers came from another art pack and never shared a body rig with the
mockup full-body PNG → wardrobe “monster.”

## Correct model

**One outfit preset = one full-body PNG.**

```
Look → closestOutfit() → theme.assets.girlFullBodies[outfit]
```

Shipped bodies under `public/skins/v1-complete/girl/`:

- `girl-raincoat-full.png`
- `girl-witch-full.png`
- `girl-denim-full.png`

Wardrobe only lists outfits that have a full-body asset. Mix hat/dress/boots
UI is removed until modular full-body art exists — do not revive CSS collage.

## Files

- `src/p1/character/fullBody.ts` — resolver
- `src/p1/GirlFigure.tsx` — full-body only
- `src/p1/WardrobeView.tsx` — outfit cards → full-body swap
- `src/p1/themes/packs/v1Complete.ts` — `girlFullBodies` map
