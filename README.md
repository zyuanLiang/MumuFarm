# MumuFarm

一个偏治愈风格的 H5 农场小游戏，基于 React + Vite 构建，支持播种、成长、收获、升级、道具、皮肤和抽奖玩法。

## 项目特点

- 核心种植循环：播种、倒计时成长、成熟收获、金币与经验结算。
- 等级成长系统：随着等级提升逐步解锁更高价值作物和更多地块。
- 一键操作：支持一键播种、一键收取，并带有对应的动效反馈。
- 抽奖系统：支持单抽和十连抽，可获得皮肤、道具、种子、碎片和金币奖励。
- 皮肤主题：内置经典农场、赛博空间、神圣神泉等不同视觉主题。
- 仓库与增益：道具入库、即时使用、限时增益状态展示。
- 移动端适配：界面和交互兼顾桌面端与移动端。

## 技术栈

- React 19
- TypeScript
- Vite 6
- Tailwind CSS 4
- Motion
- Lucide React

## 本地运行

### 环境要求

- Node.js 18 及以上

### 安装依赖

```bash
npm install
```

### 启动开发环境

```bash
npm run dev
```

默认启动地址：

```text
http://localhost:3000
```

### 生产构建

```bash
npm run build
```

### 本地预览构建产物

```bash
npm run preview
```

## 常用脚本

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run test
npm run clean
npm run check:encoding
```

脚本说明：

- `npm run lint`：执行 TypeScript 类型检查。
- `npm run test`：执行当前项目内的核心逻辑与文案相关测试。
- `npm run check:encoding`：检查文件编码，避免中文文案乱码问题。

## 目录结构

```text
.
├─ public/
│  └─ assets/                 静态资源与奖池图片
├─ scripts/                   工程脚本
├─ src/
│  ├─ components/             页面组件与玩法弹窗
│  ├─ hooks/                  状态与玩法逻辑
│  ├─ constants.ts            作物、皮肤、道具、奖池等配置
│  ├─ types.ts                类型定义
│  ├─ index.css               全局样式
│  ├─ main.tsx                应用入口
│  └─ App.tsx                 农场主界面与核心交互
├─ docs/                      设计说明与实现计划
├─ package.json
└─ vite.config.ts
```

## 玩法说明

### 基础玩法

1. 选择种子。
2. 点击空地播种。
3. 等待作物成熟。
4. 点击成熟地块收获金币和经验。
5. 使用金币继续扩展种植节奏，并通过升级解锁更多内容。

### 抽奖玩法

- 单抽消耗 `50` 金币。
- 十连抽消耗 `450` 金币。
- 奖励可能包含皮肤、道具、稀有种子、碎片和金币。

### 当前内置内容

- 作物：小麦、胡萝卜、玉米、西瓜、向日葵、薰衣草、草莓、菠萝、祈愿神豆、锦鲤草。
- 皮肤：经典农场、夏日明媚、金秋时节、赛博空间、神圣神泉。
- 道具：神奇泉水、远古化肥、超级化肥、黄金摇铃。

## 环境变量

项目内保留了 [`.env.example`](E:/remix_-remix_-mumu农场-(mini-farm)/.env.example) 模板，当前本地前端玩法运行不强依赖该文件。

如果后续接入 AI Studio / Gemini 相关能力，可按模板补充：

- `GEMINI_API_KEY`
- `APP_URL`

## 质量校验

当前仓库已通过以下校验：

```bash
npm run build
npm run test
npm run lint
```

## 后续可优化方向

- 增加存档同步或云端存档能力。
- 丰富任务系统与成就系统。
- 增加更多季节场景、作物和抽奖池内容。
- 拆分玩法配置，降低后续扩展成本。
