import assert from 'node:assert/strict';
import {describe, it} from 'node:test';
import {
  makeHarvestNote,
  shouldPinHarvestNote,
  suggestTodayLook,
} from './dailyTips.ts';
import {lookFromOutfit, looksEqual} from './pieces.ts';

const unlocked = {
  hats: ['bare', 'rain_hood', 'witch_hat', 'straw_hat', 'beret'] as const,
  dresses: [
    'raincoat',
    'witch',
    'denim',
    'garden',
    'picnic',
    'sweater',
    'moonlight',
    'spore',
  ] as const,
  boots: ['yellow', 'witch', 'denim', 'moss', 'peach', 'check', 'moon'] as const,
};

describe('p10 daily tips', () => {
  it('suggests an unlocked look for soft rain', () => {
    const tip = suggestTodayLook({
      atmosphere: 'soft_rain',
      unlocked: {
        hats: [...unlocked.hats],
        dresses: [...unlocked.dresses],
        boots: [...unlocked.boots],
      },
      current: lookFromOutfit('witch'),
      seed: 2,
    });
    assert.ok(unlocked.dresses.includes(tip.look.dress));
    assert.ok(unlocked.hats.includes(tip.look.hat));
    assert.ok(unlocked.boots.includes(tip.look.boots));
    assert.match(tip.reason, /软雨|安心/);
    assert.ok(tip.label.length > 0);
  });

  it('avoids suggesting the exact current look when alternatives exist', () => {
    const current = lookFromOutfit('raincoat');
    const tip = suggestTodayLook({
      atmosphere: 'clear',
      unlocked: {
        hats: [...unlocked.hats],
        dresses: [...unlocked.dresses],
        boots: [...unlocked.boots],
      },
      current,
      seed: 0,
    });
    assert.equal(looksEqual(tip.look, current), false);
  });

  it('writes a readable harvest note and pins sparingly', () => {
    const note = makeHarvestNote('carrot', 4, 'westlake', 1);
    assert.match(note, /胡萝卜|西湖|收获/);
    assert.equal(shouldPinHarvestNote('wheat', 1), true);
    assert.equal(shouldPinHarvestNote('wheat', 2), false);
    assert.equal(shouldPinHarvestNote('sunflower', 5), true);
    assert.equal(shouldPinHarvestNote('star_pumpkin', 9), true);
  });
});
