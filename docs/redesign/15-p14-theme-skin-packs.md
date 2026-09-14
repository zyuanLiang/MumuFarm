# P14 主题 / 皮肤包

后期要**频繁换主题和皮肤**：玩法不动，只换包。

## 分层

| 层 | 换什么 | 例子 |
|---|---|---|
| **ThemePack** | 世界色板 + 可选远景/小屋底图 | 奶油小院、雨紫庭院 |
| **SkinPack** | 贴纸图集（作物 / 衣橱 / UI） | 纸片作物、春日作物 |
| **Vista** | 远景明信片（已有） | 西湖、桂林… |
| **Look** | 帽衣靴混搭（已有） | 魔女裙 + 草帽 |

## 加一套新主题（约改 1 个文件）

1. 在 `src/p1/themes/packs/` 新建 `xxx.ts`，填 `tokens`（必填）和 `assets`（有图再填 URL）  
2. 注册进 `src/p1/themes/index.ts` 的 `THEME_PACKS` / `THEME_ORDER`  
3. 不用改种田/换装逻辑  

## 加一套皮肤

1. 把 PNG 丢到 `public/skins/<pack-id>/`  
2. 在 SkinPack.assets 写上 key → 路径（如 `wheat.mature`）  
3. CropSprite / GirlFigure 读到 URL 就显示图，否则仍用 CSS 占位  

## 本轮已做

- ThemePack + SkinPack 类型与注册表  
- 默认「示例美装」（SVG 槽位已挂）+ 「奶油小院」纸片对照 + 「雨紫庭院」（收获 3 次解锁）  
- CropSprite / GirlFigure / SeedIcon / 蘑菇屋 / 远景：有 URL 用图，无 URL 回退 CSS  
- 农场顶栏切主题；收获提示旁可切作物皮；CSS 变量热更新  
- 示例资产：`public/themes/sample-v1/`、`public/skins/sample-v1/`  
- 存档字段：`activeTheme` / `unlockedThemes` / `activeCropSkin`  

## 换真素材只需

1. 把 PNG/WebP 丢进 `public/themes/<pack>/` 或 `public/skins/<pack>/`  
2. 改对应 pack 的 `assets` 路径  
3. 不动种田 / 换装规则  

## 不做（留给贴图到位时）

- 商城买皮肤、抽奖换皮  
- 运行时下载 CDN 包（结构已预留 URL）  
