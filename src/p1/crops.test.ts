import assert from 'node:assert/strict';
import {describe, it} from 'node:test';
import {
  advancePlot,
  applyPlotAction,
  createEmptyPlots,
  growthRate,
  helpWaterPlots,
  primaryKind,
  stageFromProgress,
} from './crops.ts';
import type {PlotState} from './types.ts';

describe('p1 crop heartbeat', () => {
  it('creates six empty plots', () => {
    assert.equal(createEmptyPlots().length, 6);
    assert.equal(createEmptyPlots()[0].cropId, null);
  });

  it('grows faster when watered like Stardew incentive', () => {
    assert.equal(growthRate(true), 1);
    assert.ok(growthRate(false) < 1);
  });

  it('maps progress into readable stages', () => {
    assert.equal(stageFromProgress(0, false), 'empty');
    assert.equal(stageFromProgress(0.1, true), 'seed');
    assert.equal(stageFromProgress(0.4, true), 'sprout');
    assert.equal(stageFromProgress(0.7, true), 'growing');
    assert.equal(stageFromProgress(1, true), 'mature');
  });

  it('chooses plant / water / harvest as primary action', () => {
    const empty: PlotState = {
      id: 0,
      cropId: null,
      grownMs: 0,
      watered: false,
      wateredAt: null,
      progress: 0,
    };
    assert.equal(primaryKind(empty), 'plant');

    const dry: PlotState = {
      id: 1,
      cropId: 'wheat',
      grownMs: 1000,
      watered: false,
      wateredAt: null,
      progress: 0.1,
    };
    assert.equal(primaryKind(dry), 'water');

    const mature: PlotState = {
      id: 2,
      cropId: 'wheat',
      grownMs: 12_000,
      watered: true,
      wateredAt: Date.now(),
      progress: 1,
    };
    assert.equal(primaryKind(mature), 'harvest');
  });

  it('advances growth slower on dry soil', () => {
    const now = 10_000;
    const dry: PlotState = {
      id: 0,
      cropId: 'wheat',
      grownMs: 0,
      watered: false,
      wateredAt: null,
      progress: 0,
    };
    const wet: PlotState = {
      ...dry,
      watered: true,
      wateredAt: now,
    };
    const dryNext = advancePlot(dry, now, 1000);
    const wetNext = advancePlot(wet, now, 1000);
    assert.ok(wetNext.grownMs > dryNext.grownMs);
  });
});

describe('p6 sticky swipe helpers', () => {
  it('sticky seed plants the selected crop on empty plot', () => {
    const empty: PlotState = {
      id: 0,
      cropId: null,
      grownMs: 0,
      watered: false,
      wateredAt: null,
      progress: 0,
    };
    const planted = applyPlotAction(empty, 'wheat', 1000, 'auto');
    assert.equal(planted.changed, true);
    assert.equal(planted.kind, 'plant');
    assert.equal(planted.plot.cropId, 'wheat');
    assert.equal(planted.plot.watered, true);
  });

  it('swipe mode refuses mismatched actions', () => {
    const empty: PlotState = {
      id: 1,
      cropId: null,
      grownMs: 0,
      watered: false,
      wateredAt: null,
      progress: 0,
    };
    const refused = applyPlotAction(empty, 'carrot', 1000, 'water');
    assert.equal(refused.changed, false);
  });

  it('soft helper waters dry growing plots only', () => {
    const now = 5000;
    const plots: PlotState[] = [
      {id: 0, cropId: 'wheat', grownMs: 100, watered: false, wateredAt: null, progress: 0.1},
      {id: 1, cropId: 'wheat', grownMs: 100, watered: true, wateredAt: now, progress: 0.1},
      {id: 2, cropId: null, grownMs: 0, watered: false, wateredAt: null, progress: 0},
    ];
    const helped = helpWaterPlots(plots, now, 1);
    assert.deepEqual(helped.wateredIds, [0]);
    assert.equal(helped.plots[0].watered, true);
    assert.equal(helped.plots[1].watered, true);
    assert.equal(helped.plots[2].watered, false);
  });
});
