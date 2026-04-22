import test from 'node:test';
import assert from 'node:assert/strict';
import {renderToStaticMarkup} from 'react-dom/server';
import FarmWeather, {
  getNextWeather,
  getRainStreakConfig,
  shouldShowWeatherDebugToggle,
} from './FarmWeather';

test('getNextWeather cycles through the supported weather states', () => {
  assert.equal(getNextWeather('sunny'), 'cloudy');
  assert.equal(getNextWeather('cloudy'), 'rainy');
  assert.equal(getNextWeather('rainy'), 'sunset');
  assert.equal(getNextWeather('sunset'), 'night');
  assert.equal(getNextWeather('night'), 'sunny');
});

test('FarmWeather renders the fixed overlay shell with sunny weather by default', () => {
  const markup = renderToStaticMarkup(<FarmWeather />);

  assert.ok(markup.includes('fixed inset-0 pointer-events-none z-0'));
  assert.ok(markup.includes('data-current-weather="sunny"'));
});

test('getRainStreakConfig keeps rainy streaks shorter and slower', () => {
  const firstStreak = getRainStreakConfig(0);
  const fifthStreak = getRainStreakConfig(4);

  assert.equal(firstStreak.duration, '1.08s');
  assert.equal(fifthStreak.duration, '1.48s');
  assert.equal(firstStreak.heightClassName, 'h-24');
});

test('shouldShowWeatherDebugToggle only enables the dev switch in uncontrolled dev mode', () => {
  assert.equal(shouldShowWeatherDebugToggle(true, undefined), true);
  assert.equal(shouldShowWeatherDebugToggle(false, undefined), false);
  assert.equal(shouldShowWeatherDebugToggle(true, 'sunny'), false);
});
