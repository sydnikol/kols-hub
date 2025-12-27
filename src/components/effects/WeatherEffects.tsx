/**
 * WeatherEffects Component
 * CSS-based weather animations for the Gothic Dollhouse
 * Rain, snow, storm, fog, and aurora effects
 */

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useWeatherEffects } from '../../hooks/useWeatherTime';

// Rain Effect Component
const RainEffect: React.FC<{
  intensity: number;
  angle: number;
  dropCount: number;
}> = ({ intensity, angle, dropCount }) => {
  const drops = useMemo(() => {
    return Array.from({ length: dropCount }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 0.5 + Math.random() * 0.3,
      opacity: 0.3 + Math.random() * 0.4 * intensity,
      height: 15 + Math.random() * 20,
    }));
  }, [dropCount, intensity]);

  return (
    <div className="rain-container" style={{ transform: `skewX(${-angle}deg)` }}>
      <style>{`
        .rain-container {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 100;
        }
        .rain-drop {
          position: absolute;
          top: -50px;
          width: 2px;
          background: linear-gradient(to bottom, transparent, rgba(174, 194, 224, 0.6));
          border-radius: 0 0 5px 5px;
          animation: rain-fall linear infinite;
        }
        @keyframes rain-fall {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(calc(100vh + 100px));
          }
        }
      `}</style>
      {drops.map((drop) => (
        <div
          key={drop.id}
          className="rain-drop"
          style={{
            left: `${drop.left}%`,
            height: `${drop.height}px`,
            opacity: drop.opacity,
            animationDelay: `${drop.delay}s`,
            animationDuration: `${drop.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

// Snow Effect Component
const SnowEffect: React.FC<{
  flakeCount: number;
  drift: number;
}> = ({ flakeCount, drift }) => {
  const flakes = useMemo(() => {
    return Array.from({ length: flakeCount }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 5 + Math.random() * 5,
      size: 2 + Math.random() * 6,
      opacity: 0.4 + Math.random() * 0.6,
      wobbleAmount: 20 + Math.random() * 40,
    }));
  }, [flakeCount]);

  return (
    <div className="snow-container">
      <style>{`
        .snow-container {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 100;
        }
        .snowflake {
          position: absolute;
          top: -20px;
          background: radial-gradient(circle, #fff 0%, rgba(255,255,255,0.8) 50%, transparent 100%);
          border-radius: 50%;
          animation: snow-fall linear infinite;
        }
        @keyframes snow-fall {
          0% {
            transform: translateY(-20px) translateX(0) rotate(0deg);
          }
          25% {
            transform: translateY(25vh) translateX(${drift * 20}px) rotate(90deg);
          }
          50% {
            transform: translateY(50vh) translateX(${-drift * 10}px) rotate(180deg);
          }
          75% {
            transform: translateY(75vh) translateX(${drift * 15}px) rotate(270deg);
          }
          100% {
            transform: translateY(calc(100vh + 20px)) translateX(0) rotate(360deg);
          }
        }
      `}</style>
      {flakes.map((flake) => (
        <div
          key={flake.id}
          className="snowflake"
          style={{
            left: `${flake.left}%`,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            opacity: flake.opacity,
            animationDelay: `${flake.delay}s`,
            animationDuration: `${flake.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

// Storm Effect Component (Lightning and Thunder)
const StormEffect: React.FC<{
  lightningFrequency: number;
  thunderDelay: number;
}> = ({ lightningFrequency, thunderDelay }) => {
  const [isFlashing, setIsFlashing] = useState(false);

  useEffect(() => {
    const triggerLightning = () => {
      if (Math.random() < lightningFrequency) {
        setIsFlashing(true);

        // Flash sequence
        setTimeout(() => setIsFlashing(false), 100);
        setTimeout(() => setIsFlashing(true), 150);
        setTimeout(() => setIsFlashing(false), 200);

        // Thunder rumble effect (visual shake)
        setTimeout(() => {
          document.body.style.animation = 'thunder-shake 0.3s ease-out';
          setTimeout(() => {
            document.body.style.animation = '';
          }, 300);
        }, thunderDelay);
      }
    };

    const interval = setInterval(triggerLightning, 1000);
    return () => clearInterval(interval);
  }, [lightningFrequency, thunderDelay]);

  return (
    <>
      <style>{`
        @keyframes thunder-shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-2px); }
          75% { transform: translateX(2px); }
        }
      `}</style>
      <div
        className="lightning-flash"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          opacity: isFlashing ? 1 : 0,
          transition: 'opacity 0.05s',
          pointerEvents: 'none',
          zIndex: 150,
        }}
      />
    </>
  );
};

// Fog Effect Component
const FogEffect: React.FC<{
  density: number;
  movement: number;
}> = ({ density, movement }) => {
  const fogLayers = useMemo(() => {
    return [
      { id: 1, opacity: density * 0.3, speed: 60, offset: 0 },
      { id: 2, opacity: density * 0.25, speed: 80, offset: 33 },
      { id: 3, opacity: density * 0.2, speed: 100, offset: 66 },
    ];
  }, [density]);

  return (
    <div className="fog-container">
      <style>{`
        .fog-container {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 90;
        }
        .fog-layer {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to right,
            transparent 0%,
            rgba(180, 180, 200, var(--fog-opacity)) 20%,
            rgba(160, 160, 180, var(--fog-opacity)) 40%,
            rgba(180, 180, 200, var(--fog-opacity)) 60%,
            rgba(160, 160, 180, var(--fog-opacity)) 80%,
            transparent 100%
          );
          animation: fog-drift linear infinite;
        }
        @keyframes fog-drift {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
      {fogLayers.map((layer) => (
        <div
          key={layer.id}
          className="fog-layer"
          style={{
            '--fog-opacity': layer.opacity,
            animationDuration: `${layer.speed / (movement + 0.1)}s`,
            animationDelay: `${-layer.offset / 100 * layer.speed}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};

// Aurora Borealis Effect Component
const AuroraEffect: React.FC<{
  colors: string[];
  waveSpeed: number;
}> = ({ colors, waveSpeed }) => {
  return (
    <div className="aurora-container">
      <style>{`
        .aurora-container {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 80;
        }
        .aurora-wave {
          position: absolute;
          top: 0;
          left: -50%;
          width: 200%;
          height: 60%;
          opacity: 0.4;
          filter: blur(30px);
          animation: aurora-wave ease-in-out infinite;
        }
        .aurora-wave:nth-child(1) {
          background: linear-gradient(
            90deg,
            transparent 0%,
            ${colors[0]} 20%,
            ${colors[1]} 40%,
            ${colors[2]} 60%,
            ${colors[3]} 80%,
            transparent 100%
          );
          animation-duration: ${20 / waveSpeed}s;
        }
        .aurora-wave:nth-child(2) {
          background: linear-gradient(
            90deg,
            transparent 0%,
            ${colors[1]} 25%,
            ${colors[2]} 50%,
            ${colors[0]} 75%,
            transparent 100%
          );
          animation-duration: ${25 / waveSpeed}s;
          animation-delay: -5s;
          opacity: 0.3;
        }
        .aurora-wave:nth-child(3) {
          background: linear-gradient(
            90deg,
            transparent 0%,
            ${colors[3]} 30%,
            ${colors[0]} 60%,
            transparent 100%
          );
          animation-duration: ${30 / waveSpeed}s;
          animation-delay: -10s;
          opacity: 0.35;
        }
        @keyframes aurora-wave {
          0%, 100% {
            transform: translateX(0) scaleY(1) skewX(0deg);
          }
          25% {
            transform: translateX(10%) scaleY(1.1) skewX(5deg);
          }
          50% {
            transform: translateX(-5%) scaleY(0.9) skewX(-3deg);
          }
          75% {
            transform: translateX(5%) scaleY(1.05) skewX(2deg);
          }
        }
      `}</style>
      <div className="aurora-wave" />
      <div className="aurora-wave" />
      <div className="aurora-wave" />
    </div>
  );
};

// Main WeatherEffects Component
export const WeatherEffects: React.FC<{
  className?: string;
  style?: React.CSSProperties;
}> = ({ className = '', style }) => {
  const {
    weather,
    rainConfig,
    snowConfig,
    stormConfig,
    fogConfig,
    auroraConfig,
  } = useWeatherEffects();

  return (
    <div
      className={`weather-effects ${className}`}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        ...style,
      }}
    >
      {/* Rain */}
      {rainConfig.enabled && (
        <RainEffect
          intensity={rainConfig.intensity}
          angle={rainConfig.angle}
          dropCount={rainConfig.dropCount}
        />
      )}

      {/* Snow */}
      {snowConfig.enabled && (
        <SnowEffect
          flakeCount={snowConfig.flakeCount}
          drift={snowConfig.drift}
        />
      )}

      {/* Storm (Lightning) */}
      {stormConfig.enabled && (
        <StormEffect
          lightningFrequency={stormConfig.lightningFrequency}
          thunderDelay={stormConfig.thunderDelay}
        />
      )}

      {/* Fog */}
      {fogConfig.enabled && (
        <FogEffect
          density={fogConfig.density}
          movement={fogConfig.movement}
        />
      )}

      {/* Aurora */}
      {auroraConfig.enabled && (
        <AuroraEffect
          colors={auroraConfig.colors}
          waveSpeed={auroraConfig.waveSpeed}
        />
      )}
    </div>
  );
};

// Individual effect exports for standalone use
export { RainEffect, SnowEffect, StormEffect, FogEffect, AuroraEffect };

export default WeatherEffects;
