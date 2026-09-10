import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import path from 'node:path';

const readUtf8 = (relativePath: string) =>
  readFileSync(path.join(process.cwd(), relativePath), 'utf8');

test('P1 App mounts the six-plot farm prototype', () => {
  const app = readUtf8('src/App.tsx');
  assert.ok(app.includes('FarmPrototype'));
  assert.ok(!app.includes('showLottery'));
});

test('P1 prototype exposes selectable plots and contextual primary action', () => {
  const farm = readUtf8('src/p1/FarmPrototype.tsx');
  assert.ok(farm.includes('p1-plots'));
  assert.ok(farm.includes('onPrimary'));
  assert.ok(farm.includes('mushroom-house'));
  assert.ok(farm.includes('girl-raincoat'));
});

test('P1 keeps UTF-8 Chinese labels for seeds and actions', () => {
  const crops = readUtf8('src/p1/crops.ts');
  assert.ok(crops.includes('小麦'));
  assert.ok(crops.includes('星星南瓜'));
  assert.ok(crops.includes('浇水'));
  assert.ok(crops.includes('收获'));
});
