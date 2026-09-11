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

test('P10 daily tips suggest outfit and harvest notes', () => {
  const tips = readUtf8('src/p1/dailyTips.ts');
  const farm = readUtf8('src/p1/FarmPrototype.tsx');
  assert.match(tips, /suggestTodayLook/);
  assert.match(tips, /makeHarvestNote/);
  assert.match(tips, /shouldPinHarvestNote/);
  assert.match(farm, /applyDailyTip/);
  assert.match(farm, /今天穿什么/);
  assert.match(farm, /丰收小记/);
});

test('P11 visual breath and plot micro-feedback', () => {
  const farm = readUtf8('src/p1/FarmPrototype.tsx');
  const css = readUtf8('src/index.css');
  const plot = readUtf8('src/p1/PlotTile.tsx');
  const girl = readUtf8('src/p1/GirlFigure.tsx');
  const html = readUtf8('index.html');
  assert.match(farm, /flashPlot/);
  assert.match(farm, /yard-meadow/);
  assert.match(farm, /has-paper/);
  assert.match(plot, /plot-fx/);
  assert.match(plot, /fx-plant|PlotFxKind/);
  assert.match(girl, /gf-blush/);
  assert.match(css, /sky-breath/);
  assert.match(css, /willow-sway/);
  assert.match(css, /seed-drop/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(html, /蘑菇屋里的小魔女/);
  assert.match(html, /Nunito/);
});

test('P12 paper-cut crops and warmer empty plots', () => {
  const crop = readUtf8('src/p1/CropSprite.tsx');
  const plot = readUtf8('src/p1/PlotTile.tsx');
  const css = readUtf8('src/index.css');
  assert.match(crop, /crop-mature/);
  assert.match(crop, /star_pumpkin/);
  assert.match(crop, /ear a/);
  assert.match(crop, /petals/);
  assert.match(plot, /plot-furrow/);
  assert.match(plot, /plot-plantable/);
  assert.match(plot, /可种/);
  assert.match(css, /star-twinkle/);
  assert.match(css, /crop-wheat \.ear/);
  assert.match(css, /plot-empty-hint \.ridge/);
});

test('P13 yard summary and paper seed icons', () => {
  const summary = readUtf8('src/p1/yardSummary.ts');
  const farm = readUtf8('src/p1/FarmPrototype.tsx');
  const icon = readUtf8('src/p1/SeedIcon.tsx');
  const css = readUtf8('src/index.css');
  assert.match(summary, /summarizeYard/);
  assert.match(summary, /readyIds/);
  assert.match(summary, /thirstyIds/);
  assert.match(farm, /actOnYardFocus/);
  assert.match(farm, /yard-tip/);
  assert.match(farm, /SeedIcon/);
  assert.match(icon, /seed-icon-\$\{cropId\}/);
  assert.match(icon, /seed-icon/);
  assert.match(css, /yard-tip-go/);
  assert.match(css, /seed-icon-star_pumpkin/);
});

test('P14 theme and skin packs support hot-swap', () => {
  const registry = readUtf8('src/p1/themes/index.ts');
  const lilac = readUtf8('src/p1/themes/packs/rainyLilac.ts');
  const sample = readUtf8('src/p1/themes/packs/sampleArt.ts');
  const farm = readUtf8('src/p1/FarmPrototype.tsx');
  const crop = readUtf8('src/p1/CropSprite.tsx');
  const girl = readUtf8('src/p1/GirlFigure.tsx');
  const css = readUtf8('src/index.css');
  const save = readUtf8('src/p1/save.ts');
  const doc = readUtf8('docs/redesign/15-p14-theme-skin-packs.md');
  assert.match(registry, /THEME_PACKS/);
  assert.match(registry, /SKIN_PACKS/);
  assert.match(registry, /themeToCssVars/);
  assert.match(registry, /sampleArtTheme/);
  assert.match(lilac, /rainy_lilac/);
  assert.match(sample, /sample_art/);
  assert.match(sample, /vista-westlake/);
  assert.match(farm, /cycleTheme/);
  assert.match(farm, /cycleCropSkin/);
  assert.match(farm, /data-theme/);
  assert.match(farm, /activeCropSkin/);
  assert.match(farm, /ThemeRuntimeContext/);
  assert.match(crop, /cropArtUrl/);
  assert.match(girl, /dressArtUrl/);
  assert.match(css, /crop-art/);
  assert.match(css, /gf-dress-art/);
  assert.match(css, /mh-art/);
  assert.match(save, /activeTheme/);
  assert.match(save, /unlockedThemes/);
  assert.match(doc, /频繁换/);
  assert.match(doc, /示例美装/);
});

test('P15 girl master sticker anchors and full sample wardrobe', () => {
  const girl = readUtf8('src/p1/GirlFigure.tsx');
  const sample = readUtf8('src/p1/themes/packs/sampleArt.ts');
  const css = readUtf8('src/index.css');
  const doc = readUtf8('docs/redesign/16-p15-girl-master-stickers.md');
  assert.match(girl, /master-v1/);
  assert.match(girl, /bootsArtUrl/);
  assert.match(girl, /gf-boots-art/);
  assert.match(girl, /has-boots-art/);
  assert.match(sample, /boots-yellow/);
  assert.match(sample, /dress-denim/);
  assert.match(sample, /hat-beret/);
  assert.match(sample, /vista-guilin/);
  assert.match(sample, /vista-skycastle/);
  assert.match(sample, /vista-huangshan/);
  assert.match(css, /gf-boots-art/);
  assert.match(css, /master-v1/);
  assert.match(css, /\.p1-sky \.vista-guilin/);
  assert.match(doc, /母版锚点/);
});

test('P16 seasonal packs ship spring crops and rainy lilac art', () => {
  const crops = readUtf8('src/p1/themes/packs/cropSkins.ts');
  const lilac = readUtf8('src/p1/themes/packs/rainyLilac.ts');
  const farm = readUtf8('src/p1/FarmPrototype.tsx');
  const doc = readUtf8('docs/redesign/17-p16-seasonal-packs.md');
  assert.match(crops, /spring-crops\/wheat-mature/);
  assert.match(crops, /春日作物/);
  assert.match(lilac, /rainy-lilac\/mushroom-house/);
  assert.match(lilac, /rainy-lilac\/vista-westlake/);
  assert.match(farm, /解锁作物皮/);
  assert.match(doc, /换季/);
  assert.match(doc, /春日作物/);
});
