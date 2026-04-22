# 抽奖系统资源备注

本目录用于存放抽奖系统奖品图片资源，`src/constants.ts` 中 `PRIZE_POOL[*].image` 的路径已按下面文件名约定写死。

## 目录结构

```text
public/
└── assets/
    └── prizes/
        ├── skin_sacred_spring.png
        ├── prop_golden_bell.png
        ├── seed_magic_bean.png
        ├── prop_ancient_fertilizer.png
        ├── fragment_cyber.png
        ├── prop_magic_water.png
        └── gold_pack_small.png
```

## 奖池资源映射

| 奖池 ID | 类型 | 稀有度 | 文件名 | `constants.ts` 路径 |
| --- | --- | --- | --- | --- |
| `sacred_spring` | 皮肤 | `legendary` | `skin_sacred_spring.png` | `/assets/prizes/skin_sacred_spring.png` |
| `golden_bell` | 道具 | `epic` | `prop_golden_bell.png` | `/assets/prizes/prop_golden_bell.png` |
| `magic_bean` | 种子 | `epic` | `seed_magic_bean.png` | `/assets/prizes/seed_magic_bean.png` |
| `ancient_fertilizer` | 道具 | `rare` | `prop_ancient_fertilizer.png` | `/assets/prizes/prop_ancient_fertilizer.png` |
| `cyber_skin_fragment` | 碎片 | `rare` | `fragment_cyber.png` | `/assets/prizes/fragment_cyber.png` |
| `magic_water` | 道具 | `common` | `prop_magic_water.png` | `/assets/prizes/prop_magic_water.png` |
| `gold_pack_small` | 金币包 | `common` | `gold_pack_small.png` | `/assets/prizes/gold_pack_small.png` |

## 落地约定

1. 美术资源文件名必须与上表完全一致，避免前端路径失配。
2. 所有奖品图建议使用透明背景 PNG，推荐尺寸至少 `512x512`。
3. 如果某个资源暂时缺失，前端会回退到 `LotteryModal.tsx` 中的占位图标，不会阻塞抽奖流程，但会影响展示效果。
4. 后续新增奖品时，必须同时更新：
   - `src/constants.ts` 中的 `PRIZE_POOL`
   - 本说明文件中的奖池资源映射

## 当前入库状态

- 已导入：`skin_sacred_spring.png`
- 已导入：`prop_golden_bell.png`
- 已导入：`seed_magic_bean.png`
- 已导入：`prop_ancient_fertilizer.png`
- 已导入：`fragment_cyber.png`
- 已导入：`prop_magic_water.png`
- 已导入：`gold_pack_small.png`
