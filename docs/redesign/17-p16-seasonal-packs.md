# P16 换季皮肤包

P14/P15 立好槽位后，本轮证明：**换季 = 换包**，不动玩法。

## 两套可切换示例

| 包 | 类型 | 内容 | 解锁 |
|---|---|---|---|
| **示例作物贴** | SkinPack | `public/skins/sample-v1/crops/` | 开局 |
| **春日作物** | SkinPack | `public/skins/spring-crops/` 嫩绿花粉色 | 收获 6 |
| **示例美装** | ThemePack | 奶油远景 + 黄蘑菇屋 + 全衣柜 | 开局 |
| **雨紫庭院** | ThemePack | `public/themes/rainy-lilac/` 紫调小屋与四远景 | 收获 3 |

## 玩家怎么换

- 顶栏主题芯片：奶油 / 示例美装 / 雨紫  
- 收获提示旁作物皮链接：纸片 / 示例贴 / 春日  

## 美术怎么加下一季

1. 新建 `public/skins/<季>/` 或 `public/themes/<季>/`  
2. 复制一份 pack 文件，改 `id` / `name` / `assets` URL  
3. 注册进 `themes/index.ts`  
4. 结束  

## 不做

- 商城购买、CDN 热更新  
- 改种田/换装规则  
