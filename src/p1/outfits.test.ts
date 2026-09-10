import assert from 'node:assert/strict';
import {describe, it} from 'node:test';
import {OUTFIT_ORDER, OUTFITS, outfitsUnlockedBy} from './outfits.ts';
import {vistasUnlockedBy} from './vistas.ts';

describe('p4/p5 content unlocks', () => {
  it('unlocks denim then garden by harvest milestones', () => {
    assert.deepEqual(OUTFIT_ORDER, ['raincoat', 'witch', 'denim', 'garden']);
    assert.deepEqual(outfitsUnlockedBy(0), ['raincoat', 'witch']);
    assert.ok(outfitsUnlockedBy(3).includes('denim'));
    assert.ok(outfitsUnlockedBy(6).includes('garden'));
    assert.equal(OUTFITS.garden.name, '花园背带');
  });

  it('unlocks vistas by harvest milestones', () => {
    assert.deepEqual(vistasUnlockedBy(0), ['westlake']);
    assert.ok(vistasUnlockedBy(2).includes('guilin'));
    assert.ok(vistasUnlockedBy(5).includes('skycastle'));
    assert.ok(vistasUnlockedBy(8).includes('huangshan'));
  });
});
