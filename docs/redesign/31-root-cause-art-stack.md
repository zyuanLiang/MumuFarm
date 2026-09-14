# Root cause: why the game looked broken

## Verdict

Ugly was not “missing polish.” It was **stacking incompatible art systems** as if they were one character/scene.

## What was stacked

1. **v1-complete painted plates** — `farm-bg.jpg`, `wardrobe-room.jpg`, `girl-raincoat-full.png`, `black-cat.png`
2. **CSS silhouette collage** — oval head / hair / body slots (`gf-hair`, `gf-head`, …)
3. **png-portrait wardrobe stickers** — dress/hat/boots cutouts from another style, no matching body rig
4. **cozy-kit UI icons** — correct for chrome, wrong as a substitute for character art
5. **Text tip walls** — daily tip / yard tip / visitor “点我” covering the plate

Mockups are **one finished painting + thin UI**. Runtime was **painting + collage + stickers + frosted panels**.

## The “monster” wardrobe

`GirlFigure` used full-body PNG **only** for yellow raincoat. Any other look fell back to:

CSS head + png-portrait dress sticker + hat sticker + boots sticker

Different style, wrong anchors, hollow body → the screenshot you saw.

## Farm emptiness / clutter

`farm-bg` paints house/meadow, **not** the girl/cat. Actors must overlay as PNGs. An earlier “cleanup” accidentally hid actors whenever `farmBg` was set → empty lawn. Tip banners and mid-screen rails then buried whatever remained.

## Hard rules going forward

1. **Never** composite CSS silhouette + foreign stickers for the girl.
2. **Only** show a real full-body PNG for the character. Missing outfit art → keep the raincoat full body (or “立绘准备中”), do not invent a collage.
3. Farm plate + girl/cat PNG + cozy chrome. No tip walls on the first view.
4. New outfits need **new full-body art**, not more sticker packs on CSS.

## Code changes in this fix

- `GirlFigure.tsx`: full PNG only
- `FarmPrototype.tsx`: always mount girl/cat actors; strip tip walls from the farm stage
- Wardrobe preview no longer routes through collage
