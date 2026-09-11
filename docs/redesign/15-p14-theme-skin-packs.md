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
- 默认「奶油小院」+ 示例「雨紫庭院」（收获 3 次解锁）  
- 农场顶栏可切换主题；CSS 变量热更新  
- 存档字段：`activeTheme` / `unlockedThemes` / `activeCropSkin`  

## 不做（留给贴图到位时）

- 商城买皮肤、抽奖换皮  
- 运行时下载 CDN 包（结构已预留 URL）  
