import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import path from 'node:path';

const readUtf8 = (relativePath: string) =>
  readFileSync(path.join(process.cwd(), relativePath), 'utf8');

test('P1 App mounts the six-plot farm prototype', () => {
  const app = readUtf8('src/App.tsx');
  assert.ok(app.includes('FarmPrototype'));
  assert.ok(!app.includes('showLottery'));
});

test('P1 prototype exposes selectable plots and contextual primary action', () => {
  const farm = readUtf8('src/p1/FarmPrototype.tsx');
  assert.ok(farm.includes('p1-plots'));
  assert.ok(farm.includes('onPrimary'));
  assert.ok(farm.includes('mushroom-house'));
  assert.ok(farm.includes('GirlFigure'));
});

test('P2 wires cottage wardrobe and return-to-farm showoff', () => {
  const farm = readUtf8('src/p1/FarmPrototype.tsx');
  assert.ok(farm.includes('equipAndShowOff'));
  assert.ok(farm.includes('openCottage'));
  assert.ok(farm.includes('WardrobeView'));
  assert.ok(farm.includes('穿上了'));

  const wardrobe = readUtf8('src/p1/WardrobeView.tsx');
  assert.ok(wardrobe.includes('穿上并回农场'));

  const outfits = readUtf8('src/p1/outfits.ts');
  assert.ok(outfits.includes('小魔女'));
  assert.ok(outfits.includes('黄雨衣'));
});

test('P3 records light surprises and day-feel hooks', () => {
  const farm = readUtf8('src/p1/FarmPrototype.tsx');
  assert.ok(farm.includes('claimVisitorGift'));
  assert.ok(farm.includes('takePhoto'));
  assert.ok(farm.includes('cycleAtmosphere'));
  assert.ok(farm.includes('writeSave'));

  const doc = readUtf8('docs/redesign/04-p3-day-feel.md');
  assert.ok(doc.includes('不做毁田'));
  assert.ok(doc.includes('猫耳'));
});

test('P4 content loop unlocks vistas and denim by harvest', () => {
  const farm = readUtf8('src/p1/FarmPrototype.tsx');
  assert.ok(farm.includes('cycleVista'));
  assert.ok(farm.includes('sunflowerCelebrated'));
  assert.ok(farm.includes('SongBird'));

  const doc = readUtf8('docs/redesign/05-p4-content-loop.md');
  assert.ok(doc.includes('牛仔日常装'));
  assert.ok(doc.includes('向日葵首开'));
});

test('P5 polish adds sfx wardrobe pieces and photo frame', () => {
  const farm = readUtf8('src/p1/FarmPrototype.tsx');
  assert.ok(farm.includes('playSfx'));
  assert.ok(farm.includes('onPrimaryWithSfx'));
  assert.ok(farm.includes('photo-frame'));
  assert.ok(farm.includes('starPumpkinGifted'));

  const sfx = readUtf8('src/p1/sfx.ts');
  assert.ok(sfx.includes("case 'harvest'"));

  const doc = readUtf8('docs/redesign/06-p5-polish.md');
  assert.ok(doc.includes('花园背带装'));
  assert.ok(doc.includes('拍照相框'));
});



test('P6 sticky seed swipe helpers and soft rain/cat assist', () => {
  const farm = readUtf8('src/p1/FarmPrototype.tsx');
  const crops = readUtf8('src/p1/crops.ts');
  const hook = readUtf8('src/p1/useFarmPrototype.ts');
  assert.match(farm, /touch-hint/);
  assert.match(farm, /onPlotsPointerDown/);
  assert.match(farm, /onAssist=\{catAssist\}/);
  assert.match(farm, /软雨替你润了一块地/);
  assert.match(farm, /黑猫踮脚浇了一格/);
  assert.match(crops, /applyPlotAction/);
  assert.match(crops, /helpWaterPlots/);
  assert.match(hook, /apply_plot/);
  assert.match(hook, /help_water/);
  assert.match(hook, /onApplyPlot/);
  assert.match(hook, /onHelpWater/);
});


test('P7 wardrobe expansion and mushroom cottage enter', () => {
  const outfits = readUtf8('src/p1/outfits.ts');
  const farm = readUtf8('src/p1/FarmPrototype.tsx');
  const cottage = readUtf8('src/p1/CottageView.tsx');
  const day = readUtf8('src/p1/dayFeel.ts');
  assert.match(outfits, /picnic/);
  assert.match(outfits, /moonlight/);
  assert.match(outfits, /野餐格裙/);
  assert.match(outfits, /月夜裙/);
  assert.match(day, /mushroom_pin/);
  assert.match(farm, /cottageEntering/);
  assert.match(farm, /mushroomPinGifted/);
  assert.match(farm, /蘑菇屋里找到一枚蘑菇胸针|蘑菇屋里找到一枚蘑菇胸针|蘑菇胸针/);
  assert.match(cottage, /推开蘑菇门/);
  assert.match(cottage, /cottage-enter-veil/);
});


test('P8 scrapbook journal saves photo moments', () => {
  const farm = readUtf8('src/p1/FarmPrototype.tsx');
  const journal = readUtf8('src/p1/journal.ts');
  const view = readUtf8('src/p1/JournalView.tsx');
  const save = readUtf8('src/p1/save.ts');
  assert.match(farm, /openJournal/);
  assert.match(farm, /createJournalEntry/);
  assert.match(farm, /手帐/);
  assert.match(journal, /JOURNAL_MAX/);
  assert.match(view, /手帐本/);
  assert.match(save, /journalEntries/);
});

test('P9 mix wardrobe exposes hat dress boots slots', () => {
  const pieces = readUtf8('src/p1/pieces.ts');
  const wardrobe = readUtf8('src/p1/WardrobeView.tsx');
  const farm = readUtf8('src/p1/FarmPrototype.tsx');
  const girl = readUtf8('src/p1/GirlFigure.tsx');
  assert.match(pieces, /LOOK_PRESETS/);
  assert.match(pieces, /straw_hat/);
  assert.match(pieces, /sweater/);
  assert.match(pieces, /spore/);
  assert.match(wardrobe, /onPreviewHat/);
  assert.match(wardrobe, /onPreviewBoots/);
  assert.match(wardrobe, /套装（一键穿上，再混搭）/);
  assert.match(farm, /onApplyPreset/);
  assert.match(farm, /unlockedHats/);
  assert.match(girl, /dress-\$\{look\.dress\}/);
  assert.match(girl, /hat-\$\{look\.hat\}/);
});
