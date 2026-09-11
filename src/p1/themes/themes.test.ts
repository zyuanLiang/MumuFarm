import assert from 'node:assert/strict';
import {describe, it} from 'node:test';
import {
  DEFAULT_THEME_ID,
  THEME_ORDER,
  getTheme,
  themeToCssVars,
  themesUnlockedBy,
  skinsUnlockedBy,
} from './index.ts';

describe('p14 theme / skin packs', () => {
  it('registers default cream theme and rainy lilac unlock', () => {
    assert.equal(DEFAULT_THEME_ID, 'cottage_cream');
    assert.ok(THEME_ORDER.includes('rainy_lilac'));
    assert.deepEqual(themesUnlockedBy(0), ['cottage_cream']);
    assert.ok(themesUnlockedBy(3).includes('rainy_lilac'));
    assert.equal(getTheme('missing').id, 'cottage_cream');
  });

  it('maps tokens to CSS variables for hot-swap', () => {
    const lilac = getTheme('rainy_lilac');
    const vars = themeToCssVars(lilac.tokens);
    assert.equal(vars['--peach'], lilac.tokens.peach);
    assert.ok(vars['--shell-gradient'].includes('gradient'));
    assert.ok(skinsUnlockedBy(0, 'crops').includes('paper_crops'));
    assert.ok(skinsUnlockedBy(6, 'crops').includes('spring_crops'));
  });
});
