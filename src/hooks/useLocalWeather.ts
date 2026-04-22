import {useEffect, useRef, useState} from 'react';
import type {WeatherType} from '../components/FarmWeather';

export type SessionDayWeather = Extract<WeatherType, 'sunny' | 'cloudy' | 'rainy'>;

export const pickSessionDayWeather = (randomValue: number): SessionDayWeather => {
  if (randomValue < 60) {
    return 'sunny';
  }

  if (randomValue < 80) {
    return 'cloudy';
  }

  return 'rainy';
};

export const resolveWeatherForHour = (
  hour: number,
  sessionDayWeather: SessionDayWeather,
): WeatherType => {
  if (hour >= 19 || hour < 6) {
    return 'night';
  }

  if (hour >= 16 && hour < 19) {
    return 'sunset';
  }

  return sessionDayWeather;
};

export function useLocalWeather(): WeatherType {
  const [weather, setWeather] = useState<WeatherType>('sunny');
  const sessionDayWeather = useRef<SessionDayWeather>('sunny');

  useEffect(() => {
    sessionDayWeather.current = pickSessionDayWeather(Math.random() * 100);

    const updateWeather = () => {
      const hour = new Date().getHours();
      setWeather(resolveWeatherForHour(hour, sessionDayWeather.current));
    };

    updateWeather();

    const intervalId = window.setInterval(updateWeather, 60_000);
    return () => window.clearInterval(intervalId);
  }, []);

  return weather;
}
