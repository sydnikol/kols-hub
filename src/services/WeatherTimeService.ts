/**
 * Weather and Time Service for Gothic Dollhouse
 * Real-time clock tracking, weather states, moon phases, and seasonal effects
 */

// Types
export type WeatherState = 'clear' | 'cloudy' | 'rain' | 'storm' | 'snow' | 'fog' | 'aurora';
export type TimeOfDay = 'dawn' | 'day' | 'dusk' | 'night';
export type Season = 'spring' | 'summer' | 'autumn' | 'winter';
export type MoonPhase = 'new' | 'waxing_crescent' | 'first_quarter' | 'waxing_gibbous' | 'full' | 'waning_gibbous' | 'last_quarter' | 'waning_crescent';

export interface WeatherTimeState {
  // Time
  currentTime: Date;
  timeOfDay: TimeOfDay;
  hour: number;
  minute: number;
  isDaytime: boolean;

  // Weather
  weather: WeatherState;
  temperature: number; // Atmospheric/fake temperature in Fahrenheit
  humidity: number;
  windSpeed: number;

  // Astronomical
  moonPhase: MoonPhase;
  moonIllumination: number; // 0-100%
  starsVisible: boolean;

  // Seasonal
  season: Season;
  dayOfYear: number;

  // Mode
  isAutoMode: boolean;
}

export interface WeatherTimePreferences {
  isAutoMode: boolean;
  manualWeather?: WeatherState;
  manualTimeOfDay?: TimeOfDay;
  manualSeason?: Season;
  temperatureUnit: 'fahrenheit' | 'celsius';
  enableTransitions: boolean;
  transitionSpeed: 'slow' | 'normal' | 'fast';
}

type WeatherTimeListener = (state: WeatherTimeState) => void;

const STORAGE_KEY = 'gothic-dollhouse-weather-time-prefs';
const UPDATE_INTERVAL = 60000; // Update every minute

// Default preferences
const defaultPreferences: WeatherTimePreferences = {
  isAutoMode: true,
  temperatureUnit: 'fahrenheit',
  enableTransitions: true,
  transitionSpeed: 'normal',
};

class WeatherTimeService {
  private state: WeatherTimeState;
  private preferences: WeatherTimePreferences;
  private listeners: Set<WeatherTimeListener> = new Set();
  private updateInterval: number | null = null;

  constructor() {
    this.preferences = this.loadPreferences();
    this.state = this.calculateState();
    this.startAutoUpdate();
  }

  // Load preferences from localStorage
  private loadPreferences(): WeatherTimePreferences {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...defaultPreferences, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.error('Failed to load weather/time preferences:', e);
    }
    return { ...defaultPreferences };
  }

  // Save preferences to localStorage
  private savePreferences(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.preferences));
    } catch (e) {
      console.error('Failed to save weather/time preferences:', e);
    }
  }

  // Calculate current state based on real time or manual settings
  private calculateState(): WeatherTimeState {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();

    // Calculate time of day
    let timeOfDay: TimeOfDay;
    if (this.preferences.isAutoMode) {
      timeOfDay = this.calculateTimeOfDay(hour);
    } else {
      timeOfDay = this.preferences.manualTimeOfDay || 'day';
    }

    // Calculate if daytime (6am - 6pm)
    const isDaytime = hour >= 6 && hour < 18;

    // Calculate season
    const season = this.preferences.isAutoMode
      ? this.calculateSeason(now)
      : (this.preferences.manualSeason || 'autumn');

    // Calculate moon phase
    const { phase, illumination } = this.calculateMoonPhase(now);

    // Calculate weather (auto-generated based on season and time, or manual)
    const weather = this.preferences.isAutoMode
      ? this.generateWeather(season, timeOfDay)
      : (this.preferences.manualWeather || 'clear');

    // Generate atmospheric temperature
    const temperature = this.generateTemperature(season, timeOfDay, weather);

    // Day of year
    const startOfYear = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - startOfYear.getTime();
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

    return {
      currentTime: now,
      timeOfDay,
      hour,
      minute,
      isDaytime,
      weather,
      temperature,
      humidity: this.generateHumidity(weather),
      windSpeed: this.generateWindSpeed(weather),
      moonPhase: phase,
      moonIllumination: illumination,
      starsVisible: !isDaytime && weather !== 'cloudy' && weather !== 'rain' && weather !== 'storm' && weather !== 'fog',
      season,
      dayOfYear,
      isAutoMode: this.preferences.isAutoMode,
    };
  }

  // Calculate time of day based on hour
  private calculateTimeOfDay(hour: number): TimeOfDay {
    if (hour >= 5 && hour < 8) return 'dawn';
    if (hour >= 8 && hour < 17) return 'day';
    if (hour >= 17 && hour < 20) return 'dusk';
    return 'night';
  }

  // Calculate season based on date (Northern Hemisphere)
  private calculateSeason(date: Date): Season {
    const month = date.getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'autumn';
    return 'winter';
  }

  // Calculate moon phase based on date
  // Uses a simple algorithm based on the synodic month (29.53 days)
  private calculateMoonPhase(date: Date): { phase: MoonPhase; illumination: number } {
    // Reference new moon: January 6, 2000
    const referenceNewMoon = new Date(2000, 0, 6, 18, 14, 0);
    const synodicMonth = 29.53058867; // Days

    const daysSinceReference = (date.getTime() - referenceNewMoon.getTime()) / (1000 * 60 * 60 * 24);
    const lunarAge = ((daysSinceReference % synodicMonth) + synodicMonth) % synodicMonth;

    // Calculate illumination (0 at new moon, 100 at full moon)
    const illumination = Math.round((1 - Math.cos(2 * Math.PI * lunarAge / synodicMonth)) / 2 * 100);

    // Determine phase
    let phase: MoonPhase;
    if (lunarAge < 1.84566) phase = 'new';
    else if (lunarAge < 5.53699) phase = 'waxing_crescent';
    else if (lunarAge < 9.22831) phase = 'first_quarter';
    else if (lunarAge < 12.91963) phase = 'waxing_gibbous';
    else if (lunarAge < 16.61096) phase = 'full';
    else if (lunarAge < 20.30228) phase = 'waning_gibbous';
    else if (lunarAge < 23.99361) phase = 'last_quarter';
    else if (lunarAge < 27.68493) phase = 'waning_crescent';
    else phase = 'new';

    return { phase, illumination };
  }

  // Generate weather based on season and time (semi-random with persistence)
  private currentWeatherPersistence: { weather: WeatherState; until: number } | null = null;

  private generateWeather(season: Season, timeOfDay: TimeOfDay): WeatherState {
    // Check if we should persist current weather
    if (this.currentWeatherPersistence && Date.now() < this.currentWeatherPersistence.until) {
      return this.currentWeatherPersistence.weather;
    }

    // Weather probabilities by season
    const probabilities: Record<Season, Record<WeatherState, number>> = {
      spring: { clear: 35, cloudy: 25, rain: 25, storm: 5, snow: 0, fog: 8, aurora: 2 },
      summer: { clear: 50, cloudy: 20, rain: 10, storm: 15, snow: 0, fog: 3, aurora: 2 },
      autumn: { clear: 30, cloudy: 30, rain: 20, storm: 5, snow: 0, fog: 13, aurora: 2 },
      winter: { clear: 25, cloudy: 25, rain: 10, storm: 5, snow: 25, fog: 8, aurora: 2 },
    };

    // Aurora only visible at night
    const seasonProbs = { ...probabilities[season] };
    if (timeOfDay !== 'night') {
      seasonProbs.clear += seasonProbs.aurora;
      seasonProbs.aurora = 0;
    }

    // Random selection based on probabilities
    const rand = Math.random() * 100;
    let cumulative = 0;
    let selectedWeather: WeatherState = 'clear';

    for (const [weather, prob] of Object.entries(seasonProbs)) {
      cumulative += prob;
      if (rand < cumulative) {
        selectedWeather = weather as WeatherState;
        break;
      }
    }

    // Persist weather for 30-120 minutes
    const persistDuration = (30 + Math.random() * 90) * 60 * 1000;
    this.currentWeatherPersistence = {
      weather: selectedWeather,
      until: Date.now() + persistDuration,
    };

    return selectedWeather;
  }

  // Generate atmospheric temperature
  private generateTemperature(season: Season, timeOfDay: TimeOfDay, weather: WeatherState): number {
    // Base temperatures by season (Fahrenheit)
    const baseTemps: Record<Season, number> = {
      spring: 58,
      summer: 78,
      autumn: 52,
      winter: 32,
    };

    // Time of day modifiers
    const timeModifiers: Record<TimeOfDay, number> = {
      dawn: -5,
      day: 5,
      dusk: -2,
      night: -10,
    };

    // Weather modifiers
    const weatherModifiers: Record<WeatherState, number> = {
      clear: 3,
      cloudy: -2,
      rain: -5,
      storm: -8,
      snow: -10,
      fog: -3,
      aurora: -15, // Very cold for aurora
    };

    const base = baseTemps[season];
    const timeModifier = timeModifiers[timeOfDay];
    const weatherModifier = weatherModifiers[weather];
    const randomVariation = (Math.random() - 0.5) * 10;

    return Math.round(base + timeModifier + weatherModifier + randomVariation);
  }

  // Generate humidity
  private generateHumidity(weather: WeatherState): number {
    const baseHumidity: Record<WeatherState, number> = {
      clear: 40,
      cloudy: 55,
      rain: 85,
      storm: 90,
      snow: 70,
      fog: 95,
      aurora: 30,
    };
    return baseHumidity[weather] + Math.round((Math.random() - 0.5) * 20);
  }

  // Generate wind speed (mph)
  private generateWindSpeed(weather: WeatherState): number {
    const baseWind: Record<WeatherState, number> = {
      clear: 5,
      cloudy: 8,
      rain: 12,
      storm: 25,
      snow: 15,
      fog: 2,
      aurora: 3,
    };
    return Math.round(baseWind[weather] + Math.random() * 10);
  }

  // Start auto-update interval
  private startAutoUpdate(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    this.updateInterval = window.setInterval(() => {
      this.state = this.calculateState();
      this.notifyListeners();
    }, UPDATE_INTERVAL);
  }

  // Notify all listeners
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.state));
  }

  // Public API

  // Get current state
  getState(): WeatherTimeState {
    return { ...this.state };
  }

  // Get preferences
  getPreferences(): WeatherTimePreferences {
    return { ...this.preferences };
  }

  // Subscribe to state changes
  subscribe(listener: WeatherTimeListener): () => void {
    this.listeners.add(listener);
    // Immediately call with current state
    listener(this.state);

    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  // Set auto mode
  setAutoMode(enabled: boolean): void {
    this.preferences.isAutoMode = enabled;
    this.currentWeatherPersistence = null; // Reset weather persistence
    this.savePreferences();
    this.state = this.calculateState();
    this.notifyListeners();
  }

  // Set manual weather
  setManualWeather(weather: WeatherState): void {
    this.preferences.manualWeather = weather;
    this.preferences.isAutoMode = false;
    this.savePreferences();
    this.state = this.calculateState();
    this.notifyListeners();
  }

  // Set manual time of day
  setManualTimeOfDay(timeOfDay: TimeOfDay): void {
    this.preferences.manualTimeOfDay = timeOfDay;
    this.preferences.isAutoMode = false;
    this.savePreferences();
    this.state = this.calculateState();
    this.notifyListeners();
  }

  // Set manual season
  setManualSeason(season: Season): void {
    this.preferences.manualSeason = season;
    this.preferences.isAutoMode = false;
    this.currentWeatherPersistence = null; // Reset weather
    this.savePreferences();
    this.state = this.calculateState();
    this.notifyListeners();
  }

  // Set temperature unit
  setTemperatureUnit(unit: 'fahrenheit' | 'celsius'): void {
    this.preferences.temperatureUnit = unit;
    this.savePreferences();
    this.notifyListeners();
  }

  // Set transition settings
  setTransitionSettings(enable: boolean, speed?: 'slow' | 'normal' | 'fast'): void {
    this.preferences.enableTransitions = enable;
    if (speed) {
      this.preferences.transitionSpeed = speed;
    }
    this.savePreferences();
  }

  // Convert temperature
  convertTemperature(fahrenheit: number): number {
    if (this.preferences.temperatureUnit === 'celsius') {
      return Math.round((fahrenheit - 32) * 5 / 9);
    }
    return fahrenheit;
  }

  // Get formatted temperature string
  getFormattedTemperature(): string {
    const temp = this.convertTemperature(this.state.temperature);
    const unit = this.preferences.temperatureUnit === 'celsius' ? 'C' : 'F';
    return `${temp}${unit}`;
  }

  // Get weather description
  getWeatherDescription(): string {
    const descriptions: Record<WeatherState, string> = {
      clear: 'Clear Skies',
      cloudy: 'Overcast',
      rain: 'Rainfall',
      storm: 'Thunderstorm',
      snow: 'Snowfall',
      fog: 'Misty Fog',
      aurora: 'Aurora Borealis',
    };
    return descriptions[this.state.weather];
  }

  // Get moon phase description
  getMoonPhaseDescription(): string {
    const descriptions: Record<MoonPhase, string> = {
      new: 'New Moon',
      waxing_crescent: 'Waxing Crescent',
      first_quarter: 'First Quarter',
      waxing_gibbous: 'Waxing Gibbous',
      full: 'Full Moon',
      waning_gibbous: 'Waning Gibbous',
      last_quarter: 'Last Quarter',
      waning_crescent: 'Waning Crescent',
    };
    return descriptions[this.state.moonPhase];
  }

  // Get time of day description
  getTimeOfDayDescription(): string {
    const descriptions: Record<TimeOfDay, string> = {
      dawn: 'Dawn',
      day: 'Day',
      dusk: 'Dusk',
      night: 'Night',
    };
    return descriptions[this.state.timeOfDay];
  }

  // Get formatted time
  getFormattedTime(): string {
    const hours = this.state.hour % 12 || 12;
    const minutes = this.state.minute.toString().padStart(2, '0');
    const ampm = this.state.hour >= 12 ? 'PM' : 'AM';
    return `${hours}:${minutes} ${ampm}`;
  }

  // Force refresh state
  refresh(): void {
    this.state = this.calculateState();
    this.notifyListeners();
  }

  // Reset to defaults
  reset(): void {
    this.preferences = { ...defaultPreferences };
    this.currentWeatherPersistence = null;
    this.savePreferences();
    this.state = this.calculateState();
    this.notifyListeners();
  }

  // Cleanup
  destroy(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    this.listeners.clear();
  }
}

// Singleton instance
export const weatherTimeService = new WeatherTimeService();

export default weatherTimeService;
