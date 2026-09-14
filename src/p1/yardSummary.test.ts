import assert from 'node:assert/strict';
import {describe, it} from 'node:test';
import {createEmptyPlots} from './crops.ts';
import {summarizeYard} from './yardSummary.ts';

describe('p13 yard summary', () => {
  it('points returning players at mature plots first', () => {
    const plots = createEmptyPlots(6);
    plots[1] = {
      ...plots[1],
      cropId: 'wheat',
      grownMs: 999_999,
      watered: true,
      wateredAt: Date.now(),
      progress: 1,
    };
    plots[2] = {
      ...plots[2],
      cropId: 'carrot',
      grownMs: 5_000,
      watered: false,
      wateredAt: null,
      progress: 0.2,
    };
    const summary = summarizeYard(plots);
    assert.deepEqual(summary.readyIds, [1]);
    assert.deepEqual(summary.thirstyIds, [2]);
    assert.equal(summary.focusPlotId, 1);
    assert.match(summary.message ?? '', /熟了/);
    assert.match(summary.message ?? '', /浇水/);
  });

  it('welcomes an empty yard without sounding like a quest board', () => {
    const summary = summarizeYard(createEmptyPlots(6));
    assert.equal(summary.readyIds.length, 0);
    assert.equal(summary.focusPlotId, 0);
    assert.match(summary.message ?? '', /空着|种子/);
  });
});
