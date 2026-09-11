import assert from 'node:assert/strict';
import {describe, it} from 'node:test';
import {
  DEFAULT_CROP_SKIN_ID,
  DEFAULT_THEME_ID,
  THEME_ORDER,
  cropArtUrl,
  getSkin,
  getTheme,
  themeToCssVars,
  themesUnlockedBy,
  skinsUnlockedBy,
  vistaArtUrl,
  dressArtUrl,
  houseArtUrl,
} from './index.ts';

describe('p14 theme / skin packs', () => {
  it('defaults to sample art theme with cream + lilac in order', () => {
    assert.equal(DEFAULT_THEME_ID, 'sample_art');
    assert.equal(DEFAULT_CROP_SKIN_ID, 'sample_crops');
    assert.ok(THEME_ORDER.includes('cottage_cream'));
    assert.ok(THEME_ORDER.includes('sample_art'));
    assert.ok(THEME_ORDER.includes('rainy_lilac'));
    assert.deepEqual(themesUnlockedBy(0), ['cottage_cream', 'sample_art']);
    assert.ok(themesUnlockedBy(3).includes('rainy_lilac'));
    assert.equal(getTheme('missing').id, 'sample_art');
  });

  it('maps tokens to CSS variables for hot-swap', () => {
    const lilac = getTheme('rainy_lilac');
    const vars = themeToCssVars(lilac.tokens);
    assert.equal(vars['--peach'], lilac.tokens.peach);
    assert.ok(vars['--shell-gradient'].includes('gradient'));
    assert.ok(skinsUnlockedBy(0, 'crops').includes('paper_crops'));
    assert.ok(skinsUnlockedBy(0, 'crops').includes('sample_crops'));
    assert.ok(skinsUnlockedBy(6, 'crops').includes('spring_crops'));
  });

  it('resolves sample art URLs for vista, house, dress, and crops', () => {
    const theme = getTheme('sample_art');
    const skin = getSkin('sample_crops');
    assert.ok(vistaArtUrl(theme, 'westlake')?.includes('vista-westlake'));
    assert.ok(houseArtUrl(theme)?.includes('mushroom-house'));
    assert.ok(dressArtUrl(theme, 'witch')?.includes('dress-witch'));
    assert.ok(cropArtUrl(skin, 'wheat', 'mature')?.includes('wheat-mature'));
    assert.ok(cropArtUrl(skin, 'carrot', 'seed')?.includes('seed.svg'));
    assert.equal(cropArtUrl(getSkin('paper_crops'), 'wheat', 'mature'), undefined);
  });
});
