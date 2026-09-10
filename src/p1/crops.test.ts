import assert from 'node:assert/strict';
import {describe, it} from 'node:test';
import {
  advancePlot,
  createEmptyPlots,
  growthRate,
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
