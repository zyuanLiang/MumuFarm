import test from 'node:test';
import assert from 'node:assert/strict';
import {pickSessionDayWeather, resolveWeatherForHour} from './useLocalWeather';

test('pickSessionDayWeather follows the requested weighted distribution thresholds', () => {
  assert.equal(pickSessionDayWeather(0), 'sunny');
  assert.equal(pickSessionDayWeather(59.99), 'sunny');
  assert.equal(pickSessionDayWeather(60), 'cloudy');
  assert.equal(pickSessionDayWeather(79.99), 'cloudy');
  assert.equal(pickSessionDayWeather(80), 'rainy');
  assert.equal(pickSessionDayWeather(99.99), 'rainy');
});

test('resolveWeatherForHour forces night before daytime random weather', () => {
  assert.equal(resolveWeatherForHour(5, 'rainy'), 'night');
  assert.equal(resolveWeatherForHour(19, 'sunny'), 'night');
});

test('resolveWeatherForHour switches to sunset in the late afternoon window', () => {
  assert.equal(resolveWeatherForHour(16, 'sunny'), 'sunset');
  assert.equal(resolveWeatherForHour(18, 'cloudy'), 'sunset');
});

test('resolveWeatherForHour uses the session weather during daytime', () => {
  assert.equal(resolveWeatherForHour(6, 'sunny'), 'sunny');
  assert.equal(resolveWeatherForHour(12, 'cloudy'), 'cloudy');
  assert.equal(resolveWeatherForHour(15, 'rainy'), 'rainy');
});
