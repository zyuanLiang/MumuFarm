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
  bootsArtUrl,
  hatArtUrl,
  houseArtUrl,
  cottageArtUrl,
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

  it('p15 fills master sticker slots for all mix pieces and vistas', () => {
    const theme = getTheme('sample_art');
    assert.ok(vistaArtUrl(theme, 'guilin')?.includes('vista-guilin'));
    assert.ok(vistaArtUrl(theme, 'skycastle')?.includes('vista-skycastle'));
    assert.ok(vistaArtUrl(theme, 'huangshan')?.includes('vista-huangshan'));
    assert.ok(dressArtUrl(theme, 'denim')?.includes('dress-denim'));
    assert.ok(dressArtUrl(theme, 'spore')?.includes('dress-spore'));
    assert.ok(hatArtUrl(theme, 'beret')?.includes('hat-beret'));
    assert.ok(bootsArtUrl(theme, 'yellow')?.includes('boots-yellow'));
    assert.ok(bootsArtUrl(theme, 'witch')?.includes('boots-witch'));
    assert.ok(bootsArtUrl(theme, 'moon')?.includes('boots-moon'));
    assert.equal(dressArtUrl(getTheme('cottage_cream'), 'witch'), undefined);
    assert.equal(bootsArtUrl(getTheme('cottage_cream'), 'yellow'), undefined);
  });

  it('p16 seasonal packs fill rainy lilac theme and spring crops', () => {
    const lilac = getTheme('rainy_lilac');
    assert.ok(houseArtUrl(lilac)?.includes('rainy-lilac/mushroom-house'));
    assert.ok(vistaArtUrl(lilac, 'westlake')?.includes('rainy-lilac/vista-westlake'));
    assert.ok(vistaArtUrl(lilac, 'guilin')?.includes('rainy-lilac/vista-guilin'));
    const spring = getSkin('spring_crops');
    assert.ok(cropArtUrl(spring, 'wheat', 'mature')?.includes('spring-crops/wheat-mature'));
    assert.ok(cropArtUrl(spring, 'star_pumpkin', 'mature')?.includes('star-pumpkin-mature'));
    assert.ok(cropArtUrl(spring, 'carrot', 'sprout')?.includes('spring-crops/sprout'));
    assert.ok(skinsUnlockedBy(6, 'crops').includes('spring_crops'));
    assert.ok(!skinsUnlockedBy(5, 'crops').includes('spring_crops'));
  });

  it('p17 cottage interior art slots echo the mushroom house', () => {
    assert.ok(cottageArtUrl(getTheme('sample_art'))?.includes('cottage-interior'));
    assert.ok(cottageArtUrl(getTheme('rainy_lilac'))?.includes('rainy-lilac/cottage-interior'));
    assert.equal(cottageArtUrl(getTheme('cottage_cream')), undefined);
  });

  it('p23 rainy lilac fills wardrobe sticker slots', () => {
    const lilac = getTheme('rainy_lilac');
    assert.ok(dressArtUrl(lilac, 'witch')?.includes('rainy-lilac/wardrobe/dress-witch'));
    assert.ok(dressArtUrl(lilac, 'raincoat')?.includes('rainy-lilac/wardrobe/dress-raincoat'));
    assert.ok(dressArtUrl(lilac, 'spore')?.includes('rainy-lilac/wardrobe/dress-spore'));
    assert.ok(hatArtUrl(lilac, 'witch_hat')?.includes('rainy-lilac/wardrobe/hat-witch'));
    assert.ok(hatArtUrl(lilac, 'rain_hood')?.includes('rainy-lilac/wardrobe/hat-rain-hood'));
    assert.ok(bootsArtUrl(lilac, 'yellow')?.includes('rainy-lilac/wardrobe/boots-yellow'));
    assert.ok(bootsArtUrl(lilac, 'moon')?.includes('rainy-lilac/wardrobe/boots-moon'));
    assert.equal(dressArtUrl(getTheme('cottage_cream'), 'witch'), undefined);
  });
});
