import assert from 'node:assert/strict';
import {describe, it} from 'node:test';
import {OUTFIT_ORDER, OUTFITS} from './outfits.ts';

describe('p2 outfits', () => {
  it('starts with raincoat and witch on the same master plan', () => {
    assert.deepEqual(OUTFIT_ORDER, ['raincoat', 'witch']);
    assert.equal(OUTFITS.raincoat.name, '黄雨衣');
    assert.equal(OUTFITS.witch.name, '小魔女');
  });
});
