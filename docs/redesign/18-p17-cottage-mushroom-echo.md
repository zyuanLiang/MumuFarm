# P17 小屋呼应蘑菇屋

门外是黄蘑菇屋，推门进去也该像走进菌盖里——不是另一套房间皮肤。

## 目标

1. **结构呼应**：圆拱暖窗、菌盖顶斑、菌柄色墙、地毯蘑菇弧  
2. **主题同色**：小屋用 ThemePack CSS 变量（`--honey` / `--cream` / `--wood`）  
3. **可贴图**：`ThemeAssets.cottageInterior` 可选墙纸 URL；无图仍用 CSS  

## 槽位

| 槽 | 说明 |
|---|---|
| CSS 结构层 | 永远在；保证「蘑菇屋室内」可读 |
| `cottageInterior` | 可选墙纸/装饰贴，叠在结构后 |

示例：
- `public/themes/sample-v1/cottage-interior.svg`
- `public/themes/rainy-lilac/cottage-interior.svg`

## 不做

- 新家具玩法、收纳系统  
- 换装规则改动  
