/**
 * DayNightCycle Component
 * Gradient backgrounds for different times of day with smooth transitions
 * Dawn, Day, Dusk, Night with stars and moon phases
 */

import React, { useMemo } from 'react';
import { useTimeStyles, useWeatherEffects } from '../../hooks/useWeatherTime';
import type { MoonPhase } from '../../services/WeatherTimeService';

// Star Field Component
const StarField: React.FC<{
  density: number;
  twinkle: boolean;
}> = ({ density, twinkle }) => {
  const stars = useMemo(() => {
    const starCount = Math.floor(100 * density);
    return Array.from({ length: starCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 60, // Stars only in upper portion
      size: 1 + Math.random() * 2,
      opacity: 0.3 + Math.random() * 0.7,
      twinkleDelay: Math.random() * 5,
      twinkleDuration: 2 + Math.random() * 3,
    }));
  }, [density]);

  return (
    <div className="star-field">
      <style>{`
        .star-field {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 5;
        }
        .star {
          position: absolute;
          background: radial-gradient(circle, #fff 0%, rgba(255,255,255,0.8) 30%, transparent 70%);
          border-radius: 50%;
        }
        .star.twinkle {
          animation: star-twinkle ease-in-out infinite;
        }
        @keyframes star-twinkle {
          0%, 100% {
            opacity: var(--star-opacity);
            transform: scale(1);
          }
          50% {
            opacity: calc(var(--star-opacity) * 0.3);
            transform: scale(0.8);
          }
        }
      `}</style>
      {stars.map((star) => (
        <div
          key={star.id}
          className={`star ${twinkle ? 'twinkle' : ''}`}
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            '--star-opacity': star.opacity,
            animationDelay: twinkle ? `${star.twinkleDelay}s` : undefined,
            animationDuration: twinkle ? `${star.twinkleDuration}s` : undefined,
            opacity: twinkle ? undefined : star.opacity,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};

// Moon Component with phases
const Moon: React.FC<{
  phase: MoonPhase;
  illumination: number;
}> = ({ phase, illumination }) => {
  // Calculate moon shadow based on phase
  const getMoonStyle = useMemo(() => {
    const moonSize = 60;
    const shadowOffset = (() => {
      switch (phase) {
        case 'new':
          return { visible: false, offset: 0, direction: 'left' };
        case 'waxing_crescent':
          return { visible: true, offset: 70, direction: 'left' };
        case 'first_quarter':
          return { visible: true, offset: 50, direction: 'left' };
        case 'waxing_gibbous':
          return { visible: true, offset: 30, direction: 'left' };
        case 'full':
          return { visible: true, offset: 0, direction: 'none' };
        case 'waning_gibbous':
          return { visible: true, offset: 30, direction: 'right' };
        case 'last_quarter':
          return { visible: true, offset: 50, direction: 'right' };
        case 'waning_crescent':
          return { visible: true, offset: 70, direction: 'right' };
        default:
          return { visible: false, offset: 0, direction: 'left' };
      }
    })();

    return { moonSize, ...shadowOffset };
  }, [phase]);

  if (!getMoonStyle.visible) {
    return null;
  }

  return (
    <div className="moon-container">
      <style>{`
        .moon-container {
          position: absolute;
          top: 10%;
          right: 15%;
          z-index: 10;
          filter: drop-shadow(0 0 20px rgba(255, 255, 220, 0.5));
        }
        .moon {
          width: ${getMoonStyle.moonSize}px;
          height: ${getMoonStyle.moonSize}px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #fffef0 0%, #e8e4c9 50%, #c9c4a0 100%);
          position: relative;
          overflow: hidden;
          box-shadow:
            inset -5px -5px 15px rgba(0,0,0,0.1),
            0 0 30px rgba(255, 255, 200, 0.3);
        }
        .moon-shadow {
          position: absolute;
          top: -5%;
          width: 110%;
          height: 110%;
          border-radius: 50%;
          background: #0d0221;
          transition: transform 0.5s ease;
        }
        .moon-craters {
          position: absolute;
          inset: 0;
          opacity: 0.15;
        }
        .crater {
          position: absolute;
          border-radius: 50%;
          background: rgba(0,0,0,0.2);
          box-shadow: inset 1px 1px 3px rgba(0,0,0,0.3);
        }
        .moon-glow {
          position: absolute;
          inset: -50%;
          background: radial-gradient(circle, rgba(255,255,220,0.1) 0%, transparent 50%);
          animation: moon-pulse 4s ease-in-out infinite;
        }
        @keyframes moon-pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
      `}</style>
      <div className="moon-glow" />
      <div className="moon">
        {/* Moon craters */}
        <div className="moon-craters">
          <div className="crater" style={{ top: '20%', left: '25%', width: '15%', height: '15%' }} />
          <div className="crater" style={{ top: '40%', left: '55%', width: '20%', height: '20%' }} />
          <div className="crater" style={{ top: '65%', left: '30%', width: '12%', height: '12%' }} />
          <div className="crater" style={{ top: '50%', left: '15%', width: '8%', height: '8%' }} />
          <div className="crater" style={{ top: '25%', left: '60%', width: '10%', height: '10%' }} />
        </div>
        {/* Shadow for phases */}
        {getMoonStyle.offset > 0 && (
          <div
            className="moon-shadow"
            style={{
              [getMoonStyle.direction === 'left' ? 'right' : 'left']: `${100 - getMoonStyle.offset}%`,
            }}
          />
        )}
      </div>
    </div>
  );
};

// Sky Gradient Component
const SkyGradient: React.FC<{
  gradientColors: {
    start: string;
    middle: string;
    end: string;
    accent: string;
  };
  transitionProgress: number;
}> = ({ gradientColors, transitionProgress }) => {
  return (
    <div
      className="sky-gradient"
      style={{
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(
          to bottom,
          ${gradientColors.start} 0%,
          ${gradientColors.middle} 40%,
          ${gradientColors.end} 100%
        )`,
        transition: 'background 2s ease',
        zIndex: 1,
      }}
    />
  );
};

// Horizon Glow Component (for dawn/dusk)
const HorizonGlow: React.FC<{
  color: string;
  visible: boolean;
}> = ({ color, visible }) => {
  if (!visible) return null;

  return (
    <div
      className="horizon-glow"
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '40%',
        background: `linear-gradient(
          to top,
          ${color} 0%,
          transparent 100%
        )`,
        opacity: 0.6,
        zIndex: 2,
        pointerEvents: 'none',
      }}
    />
  );
};

// Sun Component (simple for day/dawn/dusk)
const Sun: React.FC<{
  timeOfDay: 'dawn' | 'day' | 'dusk' | 'night';
}> = ({ timeOfDay }) => {
  if (timeOfDay === 'night') return null;

  const sunPosition = useMemo(() => {
    switch (timeOfDay) {
      case 'dawn':
        return { top: '70%', right: '80%', size: 50, glow: 80 };
      case 'day':
        return { top: '15%', right: '30%', size: 60, glow: 100 };
      case 'dusk':
        return { top: '65%', right: '15%', size: 55, glow: 90 };
      default:
        return { top: '15%', right: '30%', size: 60, glow: 100 };
    }
  }, [timeOfDay]);

  const sunColor = timeOfDay === 'day' ? '#ffd700' : '#ff8c00';

  return (
    <div
      className="sun"
      style={{
        position: 'absolute',
        top: sunPosition.top,
        right: sunPosition.right,
        width: `${sunPosition.size}px`,
        height: `${sunPosition.size}px`,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${sunColor} 0%, rgba(255,200,0,0.8) 50%, transparent 70%)`,
        boxShadow: `0 0 ${sunPosition.glow}px ${sunColor}`,
        zIndex: 8,
        transition: 'all 1s ease',
      }}
    />
  );
};

// Clouds Component
const Clouds: React.FC<{
  count?: number;
  speed?: number;
}> = ({ count = 5, speed = 1 }) => {
  const clouds = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      top: 10 + Math.random() * 40,
      size: 80 + Math.random() * 120,
      opacity: 0.3 + Math.random() * 0.4,
      duration: (40 + Math.random() * 40) / speed,
      delay: Math.random() * 30,
    }));
  }, [count, speed]);

  return (
    <div className="clouds-container">
      <style>{`
        .clouds-container {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 15;
        }
        .cloud {
          position: absolute;
          background: radial-gradient(ellipse at center, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 50%, transparent 70%);
          border-radius: 50%;
          animation: cloud-drift linear infinite;
        }
        @keyframes cloud-drift {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(calc(100vw + 100%));
          }
        }
      `}</style>
      {clouds.map((cloud) => (
        <div
          key={cloud.id}
          className="cloud"
          style={{
            top: `${cloud.top}%`,
            width: `${cloud.size}px`,
            height: `${cloud.size * 0.6}px`,
            opacity: cloud.opacity,
            animationDuration: `${cloud.duration}s`,
            animationDelay: `${-cloud.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

// Main DayNightCycle Component
export const DayNightCycle: React.FC<{
  showClouds?: boolean;
  className?: string;
  style?: React.CSSProperties;
}> = ({ showClouds = true, className = '', style }) => {
  const { timeOfDay, isDaytime, gradientColors, transitionProgress } = useTimeStyles();
  const { starConfig, moonConfig, weather } = useWeatherEffects();

  // Determine if horizon glow should show
  const showHorizonGlow = timeOfDay === 'dawn' || timeOfDay === 'dusk';

  // Only show clouds during day or if weather is cloudy
  const displayClouds = showClouds && (isDaytime || weather === 'cloudy');

  return (
    <div
      className={`day-night-cycle ${className}`}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* Base sky gradient */}
      <SkyGradient
        gradientColors={gradientColors}
        transitionProgress={transitionProgress}
      />

      {/* Horizon glow for dawn/dusk */}
      <HorizonGlow
        color={gradientColors.accent}
        visible={showHorizonGlow}
      />

      {/* Stars (night only) */}
      {starConfig.visible && (
        <StarField
          density={starConfig.density}
          twinkle={starConfig.twinkle}
        />
      )}

      {/* Moon (night only) */}
      {moonConfig.visible && !isDaytime && (
        <Moon
          phase={moonConfig.phase}
          illumination={moonConfig.illumination}
        />
      )}

      {/* Sun (day only) */}
      {isDaytime && <Sun timeOfDay={timeOfDay} />}

      {/* Clouds */}
      {displayClouds && <Clouds count={6} speed={0.8} />}

      {/* Gothic overlay for atmosphere */}
      <div
        className="gothic-vignette"
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(
            ellipse at center,
            transparent 40%,
            rgba(13, 2, 33, ${isDaytime ? 0.2 : 0.5}) 100%
          )`,
          pointerEvents: 'none',
          zIndex: 50,
        }}
      />
    </div>
  );
};

// Export individual components for standalone use
export { StarField, Moon, SkyGradient, HorizonGlow, Sun, Clouds };

export default DayNightCycle;
