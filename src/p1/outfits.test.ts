import assert from 'node:assert/strict';
import {describe, it} from 'node:test';
import {OUTFIT_ORDER, OUTFITS, outfitsUnlockedBy} from './outfits.ts';
import {
  BOOTS_ORDER,
  DRESS_ORDER,
  HAT_ORDER,
  countWearablePieces,
  lookFromOutfit,
  looksEqual,
} from './pieces.ts';

describe('p4/p5/p7/p9 content unlocks', () => {
  it('unlocks denim → garden → picnic → sweater → moonlight → spore', () => {
    assert.deepEqual(OUTFIT_ORDER, [
      'raincoat',
      'witch',
      'denim',
      'garden',
      'picnic',
      'sweater',
      'moonlight',
      'spore',
    ]);
    assert.deepEqual(outfitsUnlockedBy(0), ['raincoat', 'witch']);
    assert.ok(outfitsUnlockedBy(3).includes('denim'));
    assert.ok(outfitsUnlockedBy(6).includes('garden'));
    assert.ok(outfitsUnlockedBy(8).includes('picnic'));
    assert.ok(outfitsUnlockedBy(9).includes('sweater'));
    assert.ok(outfitsUnlockedBy(10).includes('moonlight'));
    assert.ok(outfitsUnlockedBy(12).includes('spore'));
    assert.equal(OUTFITS.picnic.name, '野餐格裙');
    assert.equal(OUTFITS.moonlight.name, '月夜裙');
    assert.equal(OUTFITS.sweater.name, '奶油毛衣');
    assert.equal(OUTFITS.spore.name, '蘑菇裙');
  });

  it('mix pieces reach about a dozen wearables by mid progress', () => {
    assert.ok(HAT_ORDER.length >= 4);
    assert.ok(DRESS_ORDER.length >= 8);
    assert.ok(BOOTS_ORDER.length >= 6);
    assert.ok(countWearablePieces(0) >= 4);
    assert.ok(countWearablePieces(12) >= 12);
    assert.ok(countWearablePieces(12) <= 20);
  });

  it('presets produce distinct looks that can be remixed', () => {
    const rain = lookFromOutfit('raincoat');
    const witch = lookFromOutfit('witch');
    assert.equal(looksEqual(rain, witch), false);
    const mixed = {...rain, hat: 'witch_hat' as const};
    assert.equal(mixed.dress, 'raincoat');
    assert.equal(mixed.hat, 'witch_hat');
  });
});
