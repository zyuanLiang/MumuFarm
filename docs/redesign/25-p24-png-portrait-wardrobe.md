# P24 真 PNG 立绘包

示例 SVG 贴纸之外，再挂一套**真 PNG** 帽/衣/靴立绘——同一母版脸，只换贴纸层。

## 本轮

1. 新主题 `png_portrait`（水彩立绘），`unlockAtHarvests: 5`  
2. `public/skins/png-portrait/wardrobe/`：19 张透明 PNG（衣 160×200，帽 160×96，靴 160×56）  
3. 附带蘑菇屋 PNG：`mushroom-house.png`  
4. 切到该主题提示「水彩立绘包穿上了～」  
5. SVG 示例美装 / 雨紫仍可选，作对照  

## 槽位约定（与 P15 相同）

| 槽 | 画布比 | 对齐 |
|---|---|---|
| 衣 | 80×100（×2 = 160×200） | 顶部领口 |
| 帽 | 80×48（×2 = 160×96） | 帽檐贴底 |
| 靴 | 80×28（×2 = 160×56） | 鞋底贴底 |

换文件只改 `ThemePack.assets` URL，不改玩法。

## 不做

- 换脸/换发型  
- SkinPack.kind=wardrobe 运行时分流（仍走 ThemePack）  
- 商城售卖  
