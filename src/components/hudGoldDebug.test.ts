import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveGoldDebugClick } from './hudGoldDebug';

test('resolveGoldDebugClick triggers on the second click within the threshold', () => {
  const first = resolveGoldDebugClick(null, 1_000);
  const second = resolveGoldDebugClick(first.lastClickAt, 1_250);

  assert.equal(first.shouldTrigger, false);
  assert.equal(second.shouldTrigger, true);
  assert.equal(second.lastClickAt, null);
});

test('resolveGoldDebugClick does not trigger when the second click is too late', () => {
  const first = resolveGoldDebugClick(null, 1_000);
  const second = resolveGoldDebugClick(first.lastClickAt, 1_500);

  assert.equal(first.shouldTrigger, false);
  assert.equal(second.shouldTrigger, false);
  assert.equal(second.lastClickAt, 1_500);
});
