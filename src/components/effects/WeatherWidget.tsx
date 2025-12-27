/**
 * WeatherWidget Component
 * Floating widget showing current weather/time with manual controls
 * Gothic aesthetic with purple/gold colors
 */

import React, { useState, useCallback } from 'react';
import { useWeatherTime } from '../../hooks/useWeatherTime';
import type { WeatherState, TimeOfDay, Season } from '../../services/WeatherTimeService';

// Weather icon mapping
const WeatherIcon: React.FC<{ weather: WeatherState; size?: number }> = ({ weather, size = 24 }) => {
  const iconStyle = { width: size, height: size, display: 'inline-block' };

  const icons: Record<WeatherState, React.ReactNode> = {
    clear: (
      <svg style={iconStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
    ),
    cloudy: (
      <svg style={iconStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
      </svg>
    ),
    rain: (
      <svg style={iconStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 13v8M8 13v8M12 15v8" />
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
      </svg>
    ),
    storm: (
      <svg style={iconStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9" />
        <polyline points="13 11 9 17 15 17 11 23" />
      </svg>
    ),
    snow: (
      <svg style={iconStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
        <path d="M8 16h.01M8 20h.01M12 18h.01M12 22h.01M16 16h.01M16 20h.01" />
      </svg>
    ),
    fog: (
      <svg style={iconStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="3" y1="8" x2="21" y2="8" />
        <line x1="5" y1="12" x2="19" y2="12" />
        <line x1="3" y1="16" x2="21" y2="16" />
        <line x1="7" y1="20" x2="17" y2="20" />
      </svg>
    ),
    aurora: (
      <svg style={iconStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4c0 4 3 8 8 8s8-4 8-8" />
        <path d="M4 8c0 4 3 8 8 8s8-4 8-8" />
        <path d="M4 12c0 4 3 8 8 8s8-4 8-8" />
      </svg>
    ),
  };

  return <>{icons[weather]}</>;
};

// Time of day icon
const TimeIcon: React.FC<{ timeOfDay: TimeOfDay; size?: number }> = ({ timeOfDay, size = 20 }) => {
  const iconStyle = { width: size, height: size, display: 'inline-block' };

  if (timeOfDay === 'night') {
    return (
      <svg style={iconStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    );
  }

  return (
    <svg style={iconStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    </svg>
  );
};

// Season icon
const SeasonIcon: React.FC<{ season: Season; size?: number }> = ({ season, size = 16 }) => {
  const colors: Record<Season, string> = {
    spring: '#98d8aa',
    summer: '#ffd700',
    autumn: '#d35400',
    winter: '#a8d5e5',
  };

  return (
    <span
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: colors[season],
        boxShadow: `0 0 6px ${colors[season]}`,
      }}
    />
  );
};

// Main WeatherWidget Component
export const WeatherWidget: React.FC<{
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  collapsed?: boolean;
  className?: string;
}> = ({ position = 'top-right', collapsed: initialCollapsed = false, className = '' }) => {
  const {
    weather,
    timeOfDay,
    season,
    isAutoMode,
    formattedTime,
    formattedTemperature,
    weatherDescription,
    moonPhaseDescription,
    humidity,
    windSpeed,
    setAutoMode,
    setWeather,
    setTimeOfDay,
    setSeason,
    setTemperatureUnit,
    preferences,
  } = useWeatherTime();

  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);
  const [showSettings, setShowSettings] = useState(false);

  // Position styles
  const positionStyles: Record<string, React.CSSProperties> = {
    'top-left': { top: 20, left: 20 },
    'top-right': { top: 20, right: 20 },
    'bottom-left': { bottom: 20, left: 20 },
    'bottom-right': { bottom: 20, right: 20 },
  };

  const weatherOptions: WeatherState[] = ['clear', 'cloudy', 'rain', 'storm', 'snow', 'fog', 'aurora'];
  const timeOptions: TimeOfDay[] = ['dawn', 'day', 'dusk', 'night'];
  const seasonOptions: Season[] = ['spring', 'summer', 'autumn', 'winter'];

  const handleWeatherChange = useCallback((newWeather: WeatherState) => {
    setWeather(newWeather);
  }, [setWeather]);

  const handleTimeChange = useCallback((newTime: TimeOfDay) => {
    setTimeOfDay(newTime);
  }, [setTimeOfDay]);

  const handleSeasonChange = useCallback((newSeason: Season) => {
    setSeason(newSeason);
  }, [setSeason]);

  const toggleTemperatureUnit = useCallback(() => {
    setTemperatureUnit(preferences.temperatureUnit === 'fahrenheit' ? 'celsius' : 'fahrenheit');
  }, [setTemperatureUnit, preferences.temperatureUnit]);

  return (
    <>
      <style>{`
        .weather-widget {
          position: fixed;
          z-index: 1000;
          font-family: 'Georgia', serif;
          user-select: none;
        }
        .weather-widget-container {
          background: linear-gradient(135deg, rgba(26, 10, 46, 0.95) 0%, rgba(45, 27, 78, 0.95) 100%);
          border: 2px solid rgba(212, 175, 55, 0.6);
          border-radius: 12px;
          padding: 12px;
          color: #e8d5b7;
          box-shadow:
            0 4px 20px rgba(0, 0, 0, 0.5),
            0 0 30px rgba(155, 89, 182, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          min-width: 180px;
          transition: all 0.3s ease;
        }
        .weather-widget-container:hover {
          border-color: rgba(212, 175, 55, 0.9);
          box-shadow:
            0 6px 25px rgba(0, 0, 0, 0.6),
            0 0 40px rgba(155, 89, 182, 0.3);
        }
        .widget-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(212, 175, 55, 0.3);
          margin-bottom: 8px;
        }
        .widget-header.collapsed {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }
        .widget-title {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .widget-title-text {
          font-size: 14px;
          font-weight: 600;
          color: #d4af37;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .collapse-btn {
          background: none;
          border: none;
          color: #d4af37;
          cursor: pointer;
          padding: 2px 6px;
          font-size: 12px;
          transition: transform 0.3s ease;
        }
        .collapse-btn:hover {
          color: #f4d35e;
        }
        .widget-content {
          overflow: hidden;
          transition: max-height 0.3s ease, opacity 0.3s ease;
        }
        .widget-content.collapsed {
          max-height: 0;
          opacity: 0;
        }
        .widget-content.expanded {
          max-height: 500px;
          opacity: 1;
        }
        .weather-main {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 0;
        }
        .weather-icon-large {
          color: #d4af37;
          filter: drop-shadow(0 0 4px rgba(212, 175, 55, 0.5));
        }
        .weather-info {
          flex: 1;
        }
        .weather-temp {
          font-size: 24px;
          font-weight: 700;
          color: #fff;
          cursor: pointer;
          transition: color 0.2s;
        }
        .weather-temp:hover {
          color: #d4af37;
        }
        .weather-desc {
          font-size: 12px;
          color: #b8a080;
          text-transform: capitalize;
        }
        .weather-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
          padding: 8px 0;
          border-top: 1px solid rgba(212, 175, 55, 0.2);
          font-size: 11px;
          color: #a89070;
        }
        .detail-item {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .detail-label {
          color: #7a6a5a;
        }
        .mode-toggle {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 0;
          border-top: 1px solid rgba(212, 175, 55, 0.2);
        }
        .mode-label {
          font-size: 11px;
          color: #a89070;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .toggle-switch {
          position: relative;
          width: 40px;
          height: 20px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
          cursor: pointer;
          border: 1px solid rgba(212, 175, 55, 0.3);
          transition: all 0.3s ease;
        }
        .toggle-switch.active {
          background: rgba(155, 89, 182, 0.5);
          border-color: rgba(212, 175, 55, 0.6);
        }
        .toggle-switch::after {
          content: '';
          position: absolute;
          top: 2px;
          left: 2px;
          width: 14px;
          height: 14px;
          background: #d4af37;
          border-radius: 50%;
          transition: transform 0.3s ease;
        }
        .toggle-switch.active::after {
          transform: translateX(20px);
        }
        .settings-panel {
          padding-top: 8px;
          border-top: 1px solid rgba(212, 175, 55, 0.2);
        }
        .settings-section {
          margin-bottom: 10px;
        }
        .settings-label {
          font-size: 10px;
          color: #7a6a5a;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }
        .settings-options {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }
        .option-btn {
          padding: 4px 8px;
          font-size: 10px;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 4px;
          color: #b8a080;
          cursor: pointer;
          transition: all 0.2s ease;
          text-transform: capitalize;
        }
        .option-btn:hover {
          border-color: rgba(212, 175, 55, 0.5);
          color: #d4af37;
        }
        .option-btn.active {
          background: rgba(155, 89, 182, 0.4);
          border-color: #d4af37;
          color: #fff;
        }
        .settings-toggle {
          width: 100%;
          padding: 6px;
          margin-top: 8px;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 4px;
          color: #a89070;
          font-size: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .settings-toggle:hover {
          background: rgba(155, 89, 182, 0.2);
          border-color: rgba(212, 175, 55, 0.5);
          color: #d4af37;
        }
      `}</style>

      <div
        className={`weather-widget ${className}`}
        style={positionStyles[position]}
      >
        <div className="weather-widget-container">
          {/* Header */}
          <div
            className={`widget-header ${isCollapsed ? 'collapsed' : ''}`}
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <div className="widget-title">
              <TimeIcon timeOfDay={timeOfDay} size={18} />
              <span className="widget-title-text">{formattedTime}</span>
            </div>
            <button className="collapse-btn">
              {isCollapsed ? '+' : '-'}
            </button>
          </div>

          {/* Content */}
          <div className={`widget-content ${isCollapsed ? 'collapsed' : 'expanded'}`}>
            {/* Main Weather Display */}
            <div className="weather-main">
              <div className="weather-icon-large">
                <WeatherIcon weather={weather} size={36} />
              </div>
              <div className="weather-info">
                <div
                  className="weather-temp"
                  onClick={toggleTemperatureUnit}
                  title="Click to toggle unit"
                >
                  {formattedTemperature}
                </div>
                <div className="weather-desc">{weatherDescription}</div>
              </div>
            </div>

            {/* Weather Details */}
            <div className="weather-details">
              <div className="detail-item">
                <SeasonIcon season={season} size={12} />
                <span style={{ textTransform: 'capitalize' }}>{season}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Humidity:</span>
                <span>{humidity}%</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Wind:</span>
                <span>{windSpeed} mph</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Moon:</span>
                <span style={{ fontSize: '10px' }}>{moonPhaseDescription}</span>
              </div>
            </div>

            {/* Auto/Manual Mode Toggle */}
            <div className="mode-toggle">
              <span className="mode-label">
                {isAutoMode ? 'Auto (Real Time)' : 'Manual Mode'}
              </span>
              <div
                className={`toggle-switch ${isAutoMode ? 'active' : ''}`}
                onClick={() => setAutoMode(!isAutoMode)}
                title={isAutoMode ? 'Switch to manual mode' : 'Switch to auto mode'}
              />
            </div>

            {/* Settings Toggle */}
            <button
              className="settings-toggle"
              onClick={() => setShowSettings(!showSettings)}
            >
              {showSettings ? 'Hide Controls' : 'Manual Controls'}
            </button>

            {/* Manual Settings Panel */}
            {showSettings && !isAutoMode && (
              <div className="settings-panel">
                {/* Weather Selection */}
                <div className="settings-section">
                  <div className="settings-label">Weather</div>
                  <div className="settings-options">
                    {weatherOptions.map((w) => (
                      <button
                        key={w}
                        className={`option-btn ${weather === w ? 'active' : ''}`}
                        onClick={() => handleWeatherChange(w)}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time of Day Selection */}
                <div className="settings-section">
                  <div className="settings-label">Time of Day</div>
                  <div className="settings-options">
                    {timeOptions.map((t) => (
                      <button
                        key={t}
                        className={`option-btn ${timeOfDay === t ? 'active' : ''}`}
                        onClick={() => handleTimeChange(t)}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Season Selection */}
                <div className="settings-section">
                  <div className="settings-label">Season</div>
                  <div className="settings-options">
                    {seasonOptions.map((s) => (
                      <button
                        key={s}
                        className={`option-btn ${season === s ? 'active' : ''}`}
                        onClick={() => handleSeasonChange(s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default WeatherWidget;
