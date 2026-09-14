# Cozy Kit — 1:1 复刻资产管线

## 你说得对：之前跑偏了

旧路线把「主题皮 / CSS 剪影 / 整图墙纸」当成产品，所以怎么叠都像原型壳，不像定稿那款**绘本玩具游戏**。

正确核心是：

1. **用真图标当 UI 词汇**（这批蘑菇/雏菊风格 sheet）
2. **按定稿构图摆场景**（角色主视觉 + 木框田 + 大主按钮）
3. **种收 / 换装手感**先于多主题包

## 本目录

```
public/skins/cozy-kit/
  sheets/     # 原始四张黑底合图
  icons/      # 自动裁切透明 PNG
  previews/   # 检测框预览
  atlas.json  # id → 路径映射
```

## 裁切脚本

```bash
python3 scripts/slice-cozy-kit.py --preview
```

- 黑底连通域检测
- 过宽粘连块按竖直空隙二次切开（已修草莓+南瓜粘连）
- 输出命名 id + atlas

## 代码里怎么用

```tsx
import {CozyIcon} from './cozy/CozyIcon';

<CozyIcon id="btn_water" size={160} />
<CozyIcon id="crop_carrot" size={96} />
<CozyIcon id="wardrobe" size={48} />
```

## 1:1 复刻建议顺序（先别再加主题包）

### A. 农场主屏（定稿 01）
- 背景：定稿构图一层（可先静帧）
- 田：`plot_*` / `crop_*` 六格木框状态机
- 主 CTA：`btn_water`
- 侧栏：`wardrobe` `home_mushroom` `codex` `quest`
- 顶栏：`coin` + 精简 HUD（先别堆说明文案）

### B. 换装屏（定稿 02）
- 卧室场景一层
- 分类页签 + 格子：`hat_*` `coat_*` `dress_*` `boots_*`
- 主按钮：`btn_hanger`

### C. 引擎选择
- **现阶段不必换引擎**：React 绝对定位 + 这批 PNG 足够复刻两屏 UI。
- 若以后要大量拖拽/粒子/场景层，再迁 Pixi/Phaser；**先把资产驱动的主屏做对**。

## 明确不做（直到 A/B 达标）
- 新主题皮、纸片 CSS 剪影、再叠一层生成墙纸当「完成」
