import assert from 'node:assert/strict';
import {describe, it} from 'node:test';
import {pickAtmosphere, rollVisitor} from './dayFeel.ts';

describe('p3 day feel', () => {
  it('never rolls a visitor after the gift was claimed', () => {
    assert.equal(rollVisitor('soft_rain', true), false);
  });

  it('never rolls a visitor on clear skies', () => {
    for (let i = 0; i < 20; i++) {
      assert.equal(rollVisitor('clear', false), false);
    }
  });

  it('picks a known atmosphere', () => {
    assert.ok(['clear', 'soft_rain', 'dusk'].includes(pickAtmosphere(3)));
  });
});
