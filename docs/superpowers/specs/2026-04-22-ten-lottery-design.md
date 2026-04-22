# 10 连抽设计

- 日期：2026-04-22
- 范围：`src/hooks/useGameActions.ts`、`src/components/LotteryModal.tsx`、`src/App.tsx`、`src/constants.ts`、`src/hooks/useGameActions.test.ts`、`src/text-sanity.test.ts`
- 目标：在不修改奖池概率与保底规则的前提下，为现有抽奖系统补齐独立的 10 连抽入口、450 金币折扣结算、按稀有度排序的批量结果展示，以及随高稀有奖励数量增强的全屏特效。

## 1. 背景与问题

当前工程已经具备单抽闭环：

1. `useGameActions.ts` 中存在单次 `drawLottery` 结算逻辑，可处理皮肤、金币、背包奖励与单次特效反馈。
2. `LotteryModal.tsx` 已具备神泉主题背景、单卡结果展示、奖池横向预览和单抽按钮。
3. `App.tsx` 已具备金币雨、蝴蝶、Sparkles、背景辉光等单次全屏反馈能力。

但要支持 10 连抽时，现有结构存在以下限制：

1. 抽奖逻辑只返回单个 `reward/effect`，没有批量结算和汇总结构。
2. Modal 只支持单张奖励展示，状态源也只有 `lastReward`，无法承载 10 个结果的排序和序列化弹出。
3. App 侧全屏特效是单次布尔触发，不能按 10 连中的高稀有数量叠加强度。
4. 10 连入口、折扣文案和结果展示还未成为统一的交互闭环。

本次设计要解决的是“可上线的完整闭环版 10 连抽”，而不是一次性做完流星散射、翻牌或 3-4-3 收藏卡阵型。

## 2. 已确认约束

以下约束已经在会话中确认，本次设计与实现必须遵守：

1. 采用独立按钮触发 10 连抽，不做长按 1.5 秒触发。
2. 结果展示采用“先按稀有度排序，再逐个 `stagger` 弹出到网格中”的方式。
3. 不引入保底机制，严格复用现有奖池概率配置。
4. 单抽与 10 连体验并存，不能因为 10 连改动让现有单抽退化。
5. 本轮优先做完整闭环，不做流星散射路径动画、卡背翻牌、3-4-3 阵型。

## 3. 方案对比与结论

### 3.1 备选方案

1. 最小叠加式：在现有单抽逻辑外包一层循环，UI 增加一个 10 连按钮和一个网格结果区。
2. 批量结果对象化：把单抽结算收敛成原子能力，再新增批量结算与批量展示结构。
3. 演出先行式：先做独立的 10 连状态机与演出，再回接现有抽奖逻辑。

### 3.2 推荐方案

采用方案 2，即“批量结果对象化”。

原因：

1. 它能用最小的结构扩展支持折扣、批量结算、排序展示和强度叠加特效。
2. 它保留现有单抽的稳定路径，不需要推翻现有 `drawLottery` 行为。
3. 后续若继续做流星雨、翻牌和 3-4-3 布局，也有明确的汇总数据结构可复用。

## 4. 交互设计

### 4.1 底部操作区

`LotteryModal` 保留当前底部操作区，但将主操作按钮升级为胶囊双按钮布局：

1. 左侧按钮：`单抽`
2. 右侧按钮：`10 连抽`
3. 10 连按钮文案同时展示 `450 金币` 和 `立省 50`

建议文案：

1. 单抽：`触碰神圣之源` / `献祭 50 金币`
2. 10 连：`十重祈愿` / `献祭 450 金币`
3. 右上角或角标：`立省 50`

### 4.2 禁用逻辑

两个按钮独立判断可点击状态：

1. 单抽：`gold >= LOTTERY_COST && !isDrawing`
2. 10 连：`gold >= LOTTERY_TEN_COST && !isDrawing`

当金币不足时，对应按钮应独立显示禁用态，不能互相影响。

### 4.3 体验边界

1. 首版不做长按触发。
2. 首版不做保底。
3. 单抽继续走单卡展示。
4. 10 连走批量网格展示。

## 5. 数据结构设计

### 5.1 常量

在 `src/constants.ts` 新增：

```ts
export const LOTTERY_TEN_COST = 450;
```

目的：

1. 避免在 UI 和逻辑层写死 `450`
2. 为后续活动折扣或配置化留出口

### 5.2 单抽原子结果

保留现有 `drawLottery(state, randomValue?)` 的职责，但要明确它是单次结算原子能力：

1. 校验单抽金币是否足够
2. 计算 1 次掉落
3. 生成单个 `reward`
4. 生成单个 `effect`
5. 返回结算后的 `nextState`

### 5.3 批量结果对象

新增批量能力，例如：

```ts
drawLotteryBatch(state, count)
```

建议返回结构：

```ts
interface DrawLotteryBatchResult {
  nextState: GameState;
  rewards: PrizePoolItem[];
  displayRewards: PrizePoolItem[];
  primaryReward: PrizePoolItem;
  summaryEffect: LotteryEffect;
  highRarityCount: number;
  drawCount: number;
}
```

字段说明：

1. `rewards`：真实掉落顺序，保留原始抽取结果
2. `displayRewards`：用于 UI 展示的排序结果，按 `legendary > epic > rare > common`
3. `primaryReward`：排序后排第一的结果，用于顶部标题区和主视觉强调
4. `summaryEffect`：合并后的特效汇总，用于驱动 App 侧全屏反馈
5. `highRarityCount`：`epic + legendary` 数量，用于控制背景脉冲和粒子强度
6. `drawCount`：本次抽奖次数，便于 Modal 判断单抽还是 10 连

### 5.4 会话级结果对象

App 侧不再只保留 `lastReward`，而是升级为 `lastLotterySession`，建议形态如下：

```ts
interface LotterySessionResult {
  drawCount: number;
  rewards: PrizePoolItem[];
  displayRewards: PrizePoolItem[];
  primaryReward: PrizePoolItem | null;
  summaryEffect: LotteryEffect;
  highRarityCount: number;
}
```

单抽场景：

1. `drawCount = 1`
2. `rewards.length = 1`
3. `displayRewards.length = 1`
4. `primaryReward` 为该次奖励

10 连场景：

1. `drawCount = 10`
2. `rewards.length = 10`
3. `displayRewards.length = 10`
4. `primaryReward` 为排序后第一张卡

## 6. 结算链路设计

### 6.1 单抽链路

现有行为保持不变：

1. 扣除 `LOTTERY_COST`
2. 结算一份奖励
3. 更新 `activeSkin` / `inventory` / `gold`
4. 产出单次 `effect`

### 6.2 10 连链路

`drawLotteryBatch` 按以下顺序执行：

1. 校验金币是否足够支付 `LOTTERY_TEN_COST`
2. 以局部变量持有累计中的 `currentState`
3. 循环执行 10 次单次抽奖原子能力
4. 每次将上一次的 `nextState` 作为下一次输入
5. 累积所有 `rewards`
6. 合并所有 `effects`
7. 生成 `displayRewards`、`primaryReward`、`highRarityCount`
8. 返回最终批量结果对象

这样可以保证：

1. 金币奖励即时入账
2. 背包类奖励正确叠加
3. 皮肤奖励在同一次 10 连中也能真实更新 `activeSkin`
4. 逻辑始终只维护一份可信的 `nextState`

### 6.3 排序规则

展示排序只影响 UI，不影响真实结算顺序。

建议稀有度优先级：

1. `legendary`
2. `epic`
3. `rare`
4. `common`

同稀有度内保留原始掉落顺序，避免完全丢失真实抽取序列。

### 6.4 汇总特效规则

`summaryEffect` 的合并规则采用“简单且可预测”的策略：

1. `triggerCoins`：10 个结果中任意一个命中金币奖励或金币雨效果即为 `true`
2. `triggerButterflies`：任意一个结果命中蝴蝶爆发即为 `true`
3. `triggerSparkles`：任意一个结果为 `epic/legendary` 或触发闪烁特效即为 `true`
4. `triggerRainbow`：任意一个结果满足现有彩光规则即为 `true`

强度不直接塞进 `LotteryEffect`，而是由 `highRarityCount` 和 `drawCount` 在 App 侧计算，这样能避免让基础特效结构过早膨胀。

## 7. UI 结构设计

### 7.1 整体结构

`LotteryModal` 继续保留当前三段式结构：

1. 顶部标题区
2. 中部主舞台
3. 底部操作区

这样可以最大限度复用现有神泉背景、底座质感和奖池横向预览。

### 7.2 主舞台模式

中部主舞台新增两种展示模式：

1. `single`：沿用现有 `RewardDisplay`
2. `batch`：新增 `RewardGridDisplay`

判断依据：

1. `lastLotterySession.drawCount === 1` 时展示单卡
2. `lastLotterySession.drawCount === 10` 时展示批量网格

### 7.3 10 连结果网格

首版采用 `2 x 5` 网格，不直接上 `3-4-3`。

原因：

1. 当前 Modal 宽高更适合稳定展示 `2 x 5`
2. 移动端适配更直接
3. 信息分布均匀，不需要立刻引入更复杂的收藏卡布局规则

### 7.4 结果揭晓顺序

10 连主舞台的揭晓顺序固定为三段：

1. 抽奖中状态
2. 结果排序完成
3. `stagger` 逐卡弹出

这与已确认的交互目标一致：先按稀有度排序，再用序列化弹出提升冲击感。

### 7.5 单卡动画建议

每张卡片的弹出动画分层：

1. 外层卡槽：从中心轻微飞向目标格位
2. 卡面本体：`scale + opacity + y`
3. 高稀有奖励：持续脉冲光晕

高亮规则：

1. `legendary`：最大边框辉光 + 强脉冲
2. `epic`：中等边框辉光 + 轻脉冲
3. `rare/common`：静态卡框

### 7.6 标题区文案

10 连模式下，标题区不再显示单个奖励名，而显示汇总文案，例如：

1. 主标题：`神泉回应了你的十次祈愿`
2. 副标题：`传说 x1 · 史诗 x2`
3. 若没有高稀有奖励，则显示：`本次共获得 10 件奖励`

单抽模式下继续保持以 `primaryReward` 为主的奖励聚焦体验。

### 7.7 奖池预览区

底部奖池横向预览继续保留，不因结果展示而隐藏。

原因：

1. 当前底部信息密度不高
2. 奖池预览能维持“神泉商店”的场景感
3. 不会与中部 10 连结果区直接冲突

## 8. App 全屏特效设计

### 8.1 目标

App 现有全屏反馈需要从“单次开关”升级为“可按强度变化的触发”。

### 8.2 首版实现策略

不要求立刻重写成复杂状态机，但至少需要在触发时带上强度输入，例如：

1. `coinBurstCount`
2. `butterflyCount`
3. `sparkleCount`
4. `brightnessLevel`

这些值可由 `drawCount` 和 `highRarityCount` 推导。

### 8.3 强度规则

建议首版使用以下规则：

1. 金币雨：任意金币奖励命中即可触发；10 连时数量略增
2. 蝴蝶：有传说时显著增强，数量提升到单抽的 2 倍以上
3. Sparkles：随 `highRarityCount` 增加，但要避免满屏过载
4. 神泉背景 `brightness`：仅在 10 连命中高稀有时增强，频率随 `highRarityCount` 增加

### 8.4 保持兼容

单抽场景仍然能继续使用原有特效入口，10 连只是向这些入口传入更高的强度，不应拆断现有体验。

## 9. 组件与文件影响

### 9.1 `src/hooks/useGameActions.ts`

需要改动：

1. 保留并收敛单抽原子结算能力
2. 新增批量结算能力
3. 补充批量返回结构
4. 让 `handleDraw` 支持抽奖次数参数，例如 `handleDraw(count?: number)`

不应改动：

1. 奖池权重算法
2. 现有奖励类型的结算语义
3. 单抽不足金币时返回 `null` 的约定

### 9.2 `src/components/LotteryModal.tsx`

需要改动：

1. Props 从 `lastReward` 升级为 `lastLotterySession`
2. 新增 `onDrawTen` 或统一的 `onDraw(count)` 入口
3. 新增 `RewardGridDisplay`
4. 底部主操作区改成双按钮
5. 顶部文案支持单抽与 10 连两种模式

### 9.3 `src/App.tsx`

需要改动：

1. 状态从 `lastReward` 升级为 `lastLotterySession`
2. `onLotteryResolved` 接收单抽或批量结果后，统一转换成会话对象
3. 全屏特效入口支持强度参数
4. 将新的 `lastLotterySession` 传给 Modal

### 9.4 `src/constants.ts`

需要改动：

1. 新增 `LOTTERY_TEN_COST`

### 9.5 测试文件

需要改动：

1. `src/hooks/useGameActions.test.ts`
2. `src/text-sanity.test.ts`

## 10. 测试与验证策略

### 10.1 逻辑测试

`src/hooks/useGameActions.test.ts` 至少新增以下覆盖：

1. 10 连扣除 `450` 金币
2. 10 连会累计 10 个奖励
3. 金币奖励直接入账，不进入背包
4. 道具类奖励会在背包中正确叠加
5. 皮肤奖励会更新最终 `activeSkin`
6. `displayRewards` 会按稀有度优先排序
7. 金币不足时批量抽奖返回 `null`

### 10.2 文本与结构回归

`src/text-sanity.test.ts` 至少校验以下标记仍然存在：

1. `10 连抽`
2. `立省 50`
3. `LOTTERY_TEN_COST`
4. `RewardGridDisplay` 或等效的批量结果展示标记

### 10.3 手工验证

如果运行环境允许，应手工确认：

1. 单抽仍可正常使用，展示单张奖励卡
2. 10 连按钮在金币充足时可点击，在金币不足时独立禁用
3. 10 连结果会先排序，再逐卡弹出
4. 高稀有奖励视觉层级明显强于普通奖励
5. 背景与粒子强度会随高稀有数量增强

## 11. 非目标

以下内容明确不在本轮范围内：

1. 长按 1.5 秒触发
2. 保底机制
3. 流星散射路径动画
4. 卡背翻牌仪式感
5. 3-4-3 阵型
6. 奖池概率调整
7. 抽奖以外的经济系统重平衡

## 12. 实施顺序

建议实现顺序如下：

1. 先补 `useGameActions.test.ts` 中的 10 连失败测试
2. 再改 `useGameActions.ts`，落地单抽原子能力与批量结算
3. 然后改 `App.tsx`，引入 `lastLotterySession` 与强度化特效触发
4. 再改 `LotteryModal.tsx`，接入双按钮、批量展示和排序弹出
5. 最后补 `text-sanity.test.ts` 并运行测试与类型检查

## 13. 当前限制说明

按标准流程，这份设计文档之后应进入一次独立的 spec review，并提交到 git。

当前环境有两个现实限制：

1. 当前工作目录不是 git 仓库，无法执行 spec 提交步骤。
2. 当前会话未被授权启用子代理，因此无法执行技能要求的标准 spec review loop。

因此本次采用“文档落盘 + 会话内人工复核”替代完整流程。若后续环境允许，我会在进入实现前继续补齐计划文档与测试先行流程。
