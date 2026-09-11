# Skin asset drops

Put PNG/WebP packs here, then point `SkinPack.assets` / `ThemePack.assets` at them.

Example:

```text
public/skins/spring-crops/wheat-mature.png
public/skins/png-portrait/wardrobe/dress-witch.png
public/skins/png-portrait/mushroom-house.png
public/themes/rainy-lilac/vista-westlake.webp
```

### PNG portrait wardrobe (P24)

- Theme id: `png_portrait`
- Dress: `160×200` transparent PNG
- Hat: `160×96` transparent PNG
- Boots: `160×56` transparent PNG
- Same piece ids as SVG sample (`dress-witch.png`, `hat-witch.png`, …)

Gameplay code does not need to change when files are added — only the pack registry URLs.
