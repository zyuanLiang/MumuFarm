import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync, readFileSync} from 'node:fs';
import path from 'node:path';

const readUtf8 = (relativePath: string) =>
  readFileSync(path.join(process.cwd(), relativePath), 'utf8');

test('App.tsx still contains key gameplay hooks', () => {
  const content = readUtf8('src/App.tsx');

  assert.ok(content.includes('showLottery'));
  assert.ok(content.includes('showLevelUp'));
  assert.ok(content.includes('window.alert('));
  assert.ok(content.includes('onDraw={handleDraw}'));
  assert.ok(content.includes('handleHarvestAllClick'));
  assert.ok(content.includes('handlePlantAllClick'));
  assert.ok(content.includes('activeBulkAction'));
  assert.ok(content.includes('bulkHarvestFlights'));
  assert.ok(content.includes('bulkPlantFlights'));
  assert.ok(content.includes('一键收取'));
  assert.ok(content.includes('一键播种'));
  assert.ok(content.includes('aria-label="一键收取"'));
  assert.ok(content.includes('aria-label="一键播种"'));
});

test('LotteryModal.tsx still contains key lottery UI hooks', () => {
  const content = readUtf8('src/components/LotteryModal.tsx');

  assert.ok(content.includes('RewardDisplay'));
  assert.ok(content.includes('RewardGridDisplay'));
  assert.ok(content.includes('LOTTERY_COST'));
  assert.ok(content.includes('LOTTERY_TEN_COST'));
  assert.ok(content.includes('PRIZE_POOL.map'));
});

test('LotteryModal theme background is driven by activeSkin', () => {
  const appContent = readUtf8('src/App.tsx');
  const modalContent = readUtf8('src/components/LotteryModal.tsx');

  assert.ok(appContent.includes('activeSkin={gameState.activeSkin}'));
  assert.ok(modalContent.includes('activeSkin: SkinId'));
  assert.ok(modalContent.includes('backgroundTheme.bgImage'));
  assert.ok(modalContent.includes('brightnessSpike'));
  assert.ok(modalContent.includes('legendaryFlash'));
});

test('LotteryModal uses shrine-style nested UI layout', () => {
  const modalContent = readUtf8('src/components/LotteryModal.tsx');

  assert.ok(modalContent.includes("backgroundPosition: 'center center'"));
  assert.ok(modalContent.includes('h-[35%]'));
  assert.ok(modalContent.includes('sacred shrine base'));
  assert.ok(modalContent.includes('getThemeGlyph(reward, activeSkin)'));
});

test('LotteryModal button polish and ten-draw markers exist', () => {
  const modalContent = readUtf8('src/components/LotteryModal.tsx');

  assert.ok(modalContent.includes('cursor-not-allowed'));
  assert.ok(modalContent.includes('hover:brightness-110'));
  assert.ok(modalContent.includes('active:scale-95'));
  assert.ok(modalContent.includes('opacity-50'));
  assert.ok(modalContent.includes('grayscale-[0.4]'));
  assert.ok(!modalContent.includes('text-slate-400'));
  assert.ok(!modalContent.includes('text-rose-400/90'));
  assert.ok(!modalContent.includes('gold < LOTTERY_COST ?'));
  assert.ok(!modalContent.includes('gold < LOTTERY_TEN_COST ?'));
  assert.ok(modalContent.includes('String.fromCodePoint(0x89e6, 0x78b0, 0x795e, 0x5723, 0x4e4b, 0x6e90)'));
  assert.ok(modalContent.includes("'10 ' + String.fromCodePoint(0x91cd, 0x7948, 0x613f)"));
  assert.ok(modalContent.includes('String.fromCodePoint(0x7acb, 0x7701, 0x20, 0x35, 0x30)'));
  assert.ok(modalContent.includes('staggerChildren'));
});

test('Skin backgrounds still point at the expected assets', () => {
  const constantsContent = readUtf8('src/constants.ts');

  assert.ok(constantsContent.includes('/assets/backgrounds/bg_sacred_spring.png'));
  assert.ok(constantsContent.includes('/assets/backgrounds/bg_cyber_farm.png'));
  assert.ok(constantsContent.includes('LOTTERY_TEN_COST = 450'));
});

test('Prize art assets exist for every configured sacred spring reward', () => {
  const prizeAssetPaths = [
    'public/assets/prizes/skin_sacred_spring.png',
    'public/assets/prizes/prop_golden_bell.png',
    'public/assets/prizes/seed_magic_bean.png',
    'public/assets/prizes/prop_ancient_fertilizer.png',
    'public/assets/prizes/fragment_cyber.png',
    'public/assets/prizes/prop_magic_water.png',
    'public/assets/prizes/gold_pack_small.png',
  ];

  for (const assetPath of prizeAssetPaths) {
    assert.ok(existsSync(path.join(process.cwd(), assetPath)), `${assetPath} should exist`);
  }
});

test('Seed and lottery copy hooks remain wired through the UI', () => {
  const constantsContent = readUtf8('src/constants.ts');
  const seedSelectorContent = readUtf8('src/components/SeedSelector.tsx');
  const modalContent = readUtf8('src/components/LotteryModal.tsx');

  assert.ok(constantsContent.includes("id: 'wheat'"));
  assert.ok(constantsContent.includes("id: 'corn'"));
  assert.ok(constantsContent.includes("id: 'strawberry'"));
  assert.ok(constantsContent.includes("id: 'sacred_spring'"));
  assert.ok(constantsContent.includes("id: 'golden_bell'"));
  assert.ok(seedSelectorContent.includes('LV.{crop.unlockLevel}'));
  assert.ok(seedSelectorContent.includes('onSelect(crop.id);'));
  assert.ok(seedSelectorContent.includes('id="bulk-seed-launch-anchor"'));
  assert.ok(seedSelectorContent.includes('pointer-events-auto relative flex w-full items-end justify-center gap-3'));
  assert.ok(seedSelectorContent.includes('bulkControls?: {left?: React.ReactNode; right?: React.ReactNode}'));
  assert.ok(seedSelectorContent.includes('bulkControls?.left'));
  assert.ok(seedSelectorContent.includes('bulkControls?.right'));
  assert.ok(modalContent.includes('handleDraw(10)'));
});

test('Plot bulk action props and phase hooks remain available', () => {
  const plotContent = readUtf8('src/components/Plot.tsx');

  assert.ok(plotContent.includes('isBulkLocked?: boolean'));
  assert.ok(
    plotContent.includes("bulkPhase?: 'idle' | 'plant-target' | 'plant-impact' | 'harvest-lift' | 'harvest-cleared'"),
  );
  assert.ok(plotContent.includes('sequenceIndex?: number'));
  assert.ok(plotContent.includes('isBulkHighlighted?: boolean'));
});

test('Plot crops can grow beyond the tile bounds for 2.5D overlap', () => {
  const plotContent = readUtf8('src/components/Plot.tsx');

  assert.ok(!plotContent.includes('aspect-square overflow-hidden cursor-pointer'));
  assert.ok(plotContent.includes('absolute bottom-[18%] left-1/2 z-20'));
  assert.ok(plotContent.includes('-translate-x-1/2 origin-bottom text-7xl'));
});

test('LotteryModal result layout is compressed for mobile reward reveals', () => {
  const modalContent = readUtf8('src/components/LotteryModal.tsx');

  assert.ok(modalContent.includes('pt-10'));
  assert.ok(modalContent.includes('!featuredReward && ('));
  assert.ok(modalContent.includes('h-40 w-40'));
  assert.ok(modalContent.includes('w-[18.5%]'));
});

test('LotteryModal reveal shell and batch cards preserve effects without heavy blur', () => {
  const modalContent = readUtf8('src/components/LotteryModal.tsx');

  assert.ok(modalContent.includes("rgba(7,12,24,0.4) 0%, rgba(10,18,34,0.3) 34%, rgba(6,11,23,0.4) 100%"));
  assert.ok(modalContent.includes("w-[18.5%] min-w-[60px] flex-col transform-gpu will-change-transform"));
  assert.ok(!modalContent.includes("z-[-1]"));
  assert.ok(modalContent.includes("mix-blend-screen"));
  assert.ok(modalContent.includes("bg-slate-900/95 p-1.5 shadow-xl"));
  assert.ok(!modalContent.includes("bg-slate-900/95 p-1.5 shadow-xl backdrop-blur"));
});

test('LotteryModal reward cards use separated effect and content layers', () => {
  const modalContent = readUtf8('src/components/LotteryModal.tsx');

  assert.ok(modalContent.includes('absolute -inset-12 z-0 flex items-center justify-center transform-gpu'));
  assert.ok(modalContent.includes('rounded-full blur-2xl mix-blend-screen'));
  assert.ok(modalContent.includes('relative z-10 flex flex-col items-center justify-center overflow-hidden rounded-[28px] border-2 bg-slate-900/95 p-4 shadow-2xl'));
  assert.ok(modalContent.includes('className="relative flex w-[18.5%] min-w-[60px] flex-col transform-gpu will-change-transform"'));
  assert.ok(modalContent.includes('className="pointer-events-none absolute -inset-6 z-0 flex items-center justify-center transform-gpu"'));
  assert.ok(modalContent.includes('animate={{rotate: 360}}'));
  assert.ok(!modalContent.includes('z-[-1]'));
});
