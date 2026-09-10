import assert from 'node:assert/strict';
import {describe, it} from 'node:test';
import {OUTFIT_ORDER, OUTFITS, outfitsUnlockedBy} from './outfits.ts';
import {vistasUnlockedBy} from './vistas.ts';

describe('p4 content unlocks', () => {
  it('starts with raincoat and witch; denim waits for harvests', () => {
    assert.deepEqual(OUTFIT_ORDER, ['raincoat', 'witch', 'denim']);
    assert.deepEqual(outfitsUnlockedBy(0), ['raincoat', 'witch']);
    assert.ok(outfitsUnlockedBy(3).includes('denim'));
    assert.equal(OUTFITS.denim.name, '牛仔日常');
  });

  it('unlocks vistas by harvest milestones', () => {
    assert.deepEqual(vistasUnlockedBy(0), ['westlake']);
    assert.ok(vistasUnlockedBy(2).includes('guilin'));
    assert.ok(vistasUnlockedBy(5).includes('skycastle'));
    assert.ok(vistasUnlockedBy(8).includes('huangshan'));
  });
});
