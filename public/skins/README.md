# Skin asset drops

Put PNG/WebP packs here, then point `SkinPack.assets` / `ThemePack.assets` at them.

Example:

```text
public/skins/spring-crops/wheat-mature.png
public/skins/png-portrait/wardrobe/dress-witch.png
public/skins/png-portrait/mushroom-house.png
public/themes/rainy-lilac/vista-westlake.webp
```

### PNG portrait pack (P24–P25)

- Theme id: `png_portrait`
- Wardrobe: dress `160×200`, hat `160×96`, boots `160×56` transparent PNG
- House: `mushroom-house.png`
- Vistas: `vistas/vista-{westlake,guilin,skycastle,huangshan}.png` (~720×405)
- Cottage: `cottage-interior.png`
- Same piece / vista ids as SVG sample packs

Gameplay code does not need to change when files are added — only the pack registry URLs.
