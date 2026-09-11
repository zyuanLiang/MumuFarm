import assert from 'node:assert/strict';
import {describe, it} from 'node:test';
import {pickAtmosphere, rollVisitor} from './dayFeel.ts';

describe('p3/p4 day feel visitors', () => {
  it('never rolls visitors after gifts claimed', () => {
    assert.equal(rollVisitor('soft_rain', {cat: true, bird: true}), null);
    assert.equal(rollVisitor('clear', {cat: true, bird: true}), null);
  });

  it('never rolls a cat on clear skies', () => {
    for (let i = 0; i < 30; i++) {
      assert.notEqual(rollVisitor('clear', {cat: false, bird: true}), 'cat');
    }
  });

  it('picks a known atmosphere', () => {
    assert.ok(['clear', 'soft_rain', 'dusk'].includes(pickAtmosphere(3)));
  });
});
