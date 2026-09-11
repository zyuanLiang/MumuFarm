import assert from 'node:assert/strict';
import {describe, it} from 'node:test';
import {OUTFIT_ORDER, OUTFITS, outfitsUnlockedBy} from './outfits.ts';

describe('p4/p5/p7 content unlocks', () => {
  it('unlocks denim, garden, picnic, then moonlight by harvest milestones', () => {
    assert.deepEqual(OUTFIT_ORDER, [
      'raincoat',
      'witch',
      'denim',
      'garden',
      'picnic',
      'moonlight',
    ]);
    assert.deepEqual(outfitsUnlockedBy(0), ['raincoat', 'witch']);
    assert.ok(outfitsUnlockedBy(3).includes('denim'));
    assert.ok(outfitsUnlockedBy(6).includes('garden'));
    assert.ok(outfitsUnlockedBy(8).includes('picnic'));
    assert.ok(outfitsUnlockedBy(10).includes('moonlight'));
    assert.equal(OUTFITS.picnic.name, '野餐格裙');
    assert.equal(OUTFITS.moonlight.name, '月夜裙');
  });
});
