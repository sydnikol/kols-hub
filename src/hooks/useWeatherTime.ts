/**
 * useWeatherTime Hook
 * React hook to access current weather and time state with subscription to changes
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  weatherTimeService,
  WeatherTimeState,
  WeatherTimePreferences,
  WeatherState,
  TimeOfDay,
  Season,
} from '../services/WeatherTimeService';

// Main hook for weather/time state
export function useWeatherTime() {
  const [state, setState] = useState<WeatherTimeState>(weatherTimeService.getState());
  const [preferences, setPreferences] = useState<WeatherTimePreferences>(weatherTimeService.getPreferences());

  // Subscribe to state changes
  useEffect(() => {
    const unsubscribe = weatherTimeService.subscribe((newState) => {
      setState(newState);
      setPreferences(weatherTimeService.getPreferences());
    });

    return unsubscribe;
  }, []);

  // Actions
  const setAutoMode = useCallback((enabled: boolean) => {
    weatherTimeService.setAutoMode(enabled);
  }, []);

  const setWeather = useCallback((weather: WeatherState) => {
    weatherTimeService.setManualWeather(weather);
  }, []);

  const setTimeOfDay = useCallback((timeOfDay: TimeOfDay) => {
    weatherTimeService.setManualTimeOfDay(timeOfDay);
  }, []);

  const setSeason = useCallback((season: Season) => {
    weatherTimeService.setManualSeason(season);
  }, []);

  const setTemperatureUnit = useCallback((unit: 'fahrenheit' | 'celsius') => {
    weatherTimeService.setTemperatureUnit(unit);
  }, []);

  const refresh = useCallback(() => {
    weatherTimeService.refresh();
  }, []);

  const reset = useCallback(() => {
    weatherTimeService.reset();
  }, []);

  // Formatted values
  const formattedTime = useMemo(() => weatherTimeService.getFormattedTime(), [state.hour, state.minute]);
  const formattedTemperature = useMemo(() => weatherTimeService.getFormattedTemperature(), [state.temperature, preferences.temperatureUnit]);
  const weatherDescription = useMemo(() => weatherTimeService.getWeatherDescription(), [state.weather]);
  const moonPhaseDescription = useMemo(() => weatherTimeService.getMoonPhaseDescription(), [state.moonPhase]);
  const timeOfDayDescription = useMemo(() => weatherTimeService.getTimeOfDayDescription(), [state.timeOfDay]);

  return {
    // State
    ...state,
    preferences,

    // Formatted values
    formattedTime,
    formattedTemperature,
    weatherDescription,
    moonPhaseDescription,
    timeOfDayDescription,

    // Actions
    setAutoMode,
    setWeather,
    setTimeOfDay,
    setSeason,
    setTemperatureUnit,
    refresh,
    reset,
  };
}

// Hook specifically for time-based styling
export function useTimeStyles() {
  const { timeOfDay, isDaytime, hour } = useWeatherTime();

  const gradientColors = useMemo(() => {
    switch (timeOfDay) {
      case 'dawn':
        return {
          start: '#1a0a2e',
          middle: '#5c3d6e',
          end: '#e8a87c',
          accent: '#f8c291',
        };
      case 'day':
        return {
          start: '#87ceeb',
          middle: '#b4d7e8',
          end: '#f0f8ff',
          accent: '#ffd700',
        };
      case 'dusk':
        return {
          start: '#2d1b4e',
          middle: '#6b3fa0',
          end: '#ff7e5f',
          accent: '#feb47b',
        };
      case 'night':
      default:
        return {
          start: '#0d0221',
          middle: '#1a0a2e',
          end: '#2d1b4e',
          accent: '#9b59b6',
        };
    }
  }, [timeOfDay]);

  const transitionProgress = useMemo(() => {
    // Calculate how far we are through the current time period
    if (timeOfDay === 'dawn') {
      return (hour - 5) / 3; // 5-8 AM
    } else if (timeOfDay === 'day') {
      return (hour - 8) / 9; // 8 AM - 5 PM
    } else if (timeOfDay === 'dusk') {
      return (hour - 17) / 3; // 5-8 PM
    } else {
      // Night spans midnight, so calculate differently
      if (hour >= 20) {
        return (hour - 20) / 9; // 8 PM - 5 AM (first part)
      } else {
        return (hour + 4) / 9; // After midnight
      }
    }
  }, [hour, timeOfDay]);

  return {
    timeOfDay,
    isDaytime,
    gradientColors,
    transitionProgress,
  };
}

// Hook specifically for weather effects
export function useWeatherEffects() {
  const { weather, windSpeed, starsVisible, moonPhase, moonIllumination, season } = useWeatherTime();

  const effectIntensity = useMemo(() => {
    // Intensity based on weather type
    const intensities: Record<WeatherState, number> = {
      clear: 0,
      cloudy: 0.3,
      rain: 0.7,
      storm: 1,
      snow: 0.6,
      fog: 0.8,
      aurora: 0.9,
    };
    return intensities[weather];
  }, [weather]);

  const rainConfig = useMemo(() => ({
    enabled: weather === 'rain' || weather === 'storm',
    intensity: weather === 'storm' ? 1 : 0.6,
    angle: Math.min(30, windSpeed), // Rain angle based on wind
    dropCount: weather === 'storm' ? 200 : 100,
  }), [weather, windSpeed]);

  const snowConfig = useMemo(() => ({
    enabled: weather === 'snow',
    intensity: 0.8,
    flakeCount: 150,
    drift: windSpeed / 5, // Lateral movement
  }), [weather, windSpeed]);

  const stormConfig = useMemo(() => ({
    enabled: weather === 'storm',
    lightningFrequency: 0.1, // Chance per second
    thunderDelay: 1500, // ms after lightning
  }), [weather]);

  const fogConfig = useMemo(() => ({
    enabled: weather === 'fog',
    density: 0.7,
    movement: windSpeed / 10,
  }), [weather, windSpeed]);

  const auroraConfig = useMemo(() => ({
    enabled: weather === 'aurora',
    colors: ['#00ff88', '#00ffcc', '#8b5cf6', '#c084fc'],
    waveSpeed: 0.5,
  }), [weather]);

  const starConfig = useMemo(() => ({
    visible: starsVisible,
    density: moonIllumination < 50 ? 1 : 0.6, // Less stars visible with bright moon
    twinkle: true,
  }), [starsVisible, moonIllumination]);

  const moonConfig = useMemo(() => ({
    phase: moonPhase,
    illumination: moonIllumination,
    visible: !starsVisible ? false : true, // Only visible at night with clear-ish skies
  }), [moonPhase, moonIllumination, starsVisible]);

  return {
    weather,
    effectIntensity,
    rainConfig,
    snowConfig,
    stormConfig,
    fogConfig,
    auroraConfig,
    starConfig,
    moonConfig,
    season,
  };
}

// Hook for seasonal styling
export function useSeasonalStyles() {
  const { season } = useWeatherTime();

  const seasonColors = useMemo(() => {
    switch (season) {
      case 'spring':
        return {
          primary: '#e8b4d4',
          secondary: '#98d8aa',
          accent: '#ffd93d',
          foliage: '#7ac74f',
        };
      case 'summer':
        return {
          primary: '#ffd700',
          secondary: '#87ceeb',
          accent: '#ff6b6b',
          foliage: '#228b22',
        };
      case 'autumn':
        return {
          primary: '#d35400',
          secondary: '#9b59b6',
          accent: '#f39c12',
          foliage: '#c0392b',
        };
      case 'winter':
      default:
        return {
          primary: '#a8d5e5',
          secondary: '#5c6bc0',
          accent: '#9b59b6',
          foliage: '#607d8b',
        };
    }
  }, [season]);

  return {
    season,
    seasonColors,
  };
}

export default useWeatherTime;
