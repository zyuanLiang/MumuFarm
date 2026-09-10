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
