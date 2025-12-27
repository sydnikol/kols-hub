// Animation System Component
// Provides particle effects, visual enhancements, and animated overlays

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';

// Keyframe Animations
const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.8; }
  50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
`;

const drift = keyframes`
  0% { transform: translateX(-10px) translateY(0); }
  50% { transform: translateX(10px) translateY(-15px); }
  100% { transform: translateX(-10px) translateY(0); }
`;

const sparkle = keyframes`
  0%, 100% { opacity: 0; transform: scale(0); }
  50% { opacity: 1; transform: scale(1); }
`;

const flicker = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
`;

const rise = keyframes`
  0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(-100px) rotate(720deg); opacity: 0; }
`;

const mist = keyframes`
  0% { transform: translateX(-100%) scale(1); opacity: 0.3; }
  50% { opacity: 0.5; }
  100% { transform: translateX(100%) scale(1.2); opacity: 0.3; }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.2); opacity: 1; }
`;

const orbit = keyframes`
  0% { transform: rotate(0deg) translateX(50px) rotate(0deg); }
  100% { transform: rotate(360deg) translateX(50px) rotate(-360deg); }
`;

// Styled Components
const ParticleContainer = styled(Box)({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  pointerEvents: 'none',
  overflow: 'hidden',
  zIndex: 0,
});

const Particle = styled(Box)<{
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
}>(({ x, y, size, color, duration, delay }) => ({
  position: 'absolute',
  left: `${x}%`,
  top: `${y}%`,
  width: `${size}px`,
  height: `${size}px`,
  background: color,
  borderRadius: '50%',
  animation: `${float} ${duration}s ease-in-out infinite`,
  animationDelay: `${delay}s`,
  boxShadow: `0 0 ${size * 2}px ${color}`,
}));

const SparkleParticle = styled(Box)<{
  x: number;
  y: number;
  size: number;
  delay: number;
}>(({ x, y, size, delay }) => ({
  position: 'absolute',
  left: `${x}%`,
  top: `${y}%`,
  width: `${size}px`,
  height: `${size}px`,
  animation: `${sparkle} 2s ease-in-out infinite`,
  animationDelay: `${delay}s`,
  '&::before, &::after': {
    content: '""',
    position: 'absolute',
    background: '#d4af37',
  },
  '&::before': {
    width: '100%',
    height: '2px',
    top: '50%',
    transform: 'translateY(-50%)',
  },
  '&::after': {
    width: '2px',
    height: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
  },
}));

const RisingParticle = styled(Box)<{
  x: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
}>(({ x, size, duration, delay, color }) => ({
  position: 'absolute',
  left: `${x}%`,
  bottom: '-50px',
  width: `${size}px`,
  height: `${size}px`,
  background: color,
  borderRadius: '50%',
  animation: `${rise} ${duration}s linear infinite`,
  animationDelay: `${delay}s`,
  opacity: 0,
  boxShadow: `0 0 ${size}px ${color}`,
}));

const MistLayer = styled(Box)<{ layer: number }>(({ layer }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  height: '30%',
  background: `linear-gradient(180deg, transparent 0%, rgba(139, 92, 246, ${0.05 + layer * 0.02}) 100%)`,
  animation: `${mist} ${20 + layer * 5}s linear infinite`,
  animationDelay: `${layer * 3}s`,
}));

const CandleFlame = styled(Box)<{ x: number; y: number }>(({ x, y }) => ({
  position: 'absolute',
  left: `${x}%`,
  top: `${y}%`,
  width: '8px',
  height: '16px',
  background: 'linear-gradient(180deg, #f59e0b 0%, #dc2626 50%, transparent 100%)',
  borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
  animation: `${flicker} 0.5s ease-in-out infinite`,
  boxShadow: '0 0 20px #f59e0b, 0 0 40px #dc2626',
  '&::before': {
    content: '""',
    position: 'absolute',
    bottom: '-4px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '4px',
    height: '8px',
    background: '#d4af37',
    borderRadius: '2px',
  },
}));

const OrbitingElement = styled(Box)<{
  duration: number;
  delay: number;
  color: string;
}>(({ duration, delay, color }) => ({
  position: 'absolute',
  width: '10px',
  height: '10px',
  background: color,
  borderRadius: '50%',
  animation: `${orbit} ${duration}s linear infinite`,
  animationDelay: `${delay}s`,
  boxShadow: `0 0 10px ${color}`,
}));

// Effect Types
export type EffectType =
  | 'floating-particles'
  | 'sparkles'
  | 'rising-souls'
  | 'mist'
  | 'candles'
  | 'orbiting'
  | 'snow'
  | 'fireflies';

interface ParticleData {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
}

interface AnimationSystemProps {
  effects?: EffectType[];
  intensity?: 'low' | 'medium' | 'high';
  colorScheme?: 'purple' | 'gold' | 'crimson' | 'teal' | 'rainbow';
  reducedMotion?: boolean;
}

const colorSchemes: Record<string, string[]> = {
  purple: ['#8b5cf6', '#a78bfa', '#c4b5fd', '#7c3aed'],
  gold: ['#d4af37', '#f59e0b', '#fbbf24', '#b8860b'],
  crimson: ['#dc2626', '#ef4444', '#f87171', '#b91c1c'],
  teal: ['#14b8a6', '#2dd4bf', '#5eead4', '#0d9488'],
  rainbow: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'],
};

export const AnimationSystem: React.FC<AnimationSystemProps> = ({
  effects = ['floating-particles', 'sparkles'],
  intensity = 'medium',
  colorScheme = 'purple',
  reducedMotion = false,
}) => {
  const colors = colorSchemes[colorScheme];

  const particleCount = useMemo(() => {
    switch (intensity) {
      case 'low': return 10;
      case 'medium': return 20;
      case 'high': return 40;
      default: return 20;
    }
  }, [intensity]);

  const generateParticles = useCallback((count: number): ParticleData[] => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: 5 + Math.random() * 10,
      delay: Math.random() * 5,
    }));
  }, [colors]);

  const floatingParticles = useMemo(
    () => generateParticles(particleCount),
    [generateParticles, particleCount]
  );

  const sparkleParticles = useMemo(
    () => generateParticles(Math.floor(particleCount / 2)),
    [generateParticles, particleCount]
  );

  const risingParticles = useMemo(
    () => generateParticles(Math.floor(particleCount / 3)),
    [generateParticles, particleCount]
  );

  if (reducedMotion) {
    return null;
  }

  return (
    <ParticleContainer>
      {/* Floating Particles */}
      {effects.includes('floating-particles') && floatingParticles.map((p) => (
        <Particle
          key={`float-${p.id}`}
          x={p.x}
          y={p.y}
          size={p.size}
          color={p.color}
          duration={p.duration}
          delay={p.delay}
        />
      ))}

      {/* Sparkles */}
      {effects.includes('sparkles') && sparkleParticles.map((p) => (
        <SparkleParticle
          key={`sparkle-${p.id}`}
          x={p.x}
          y={p.y}
          size={8 + Math.random() * 8}
          delay={p.delay}
        />
      ))}

      {/* Rising Souls */}
      {effects.includes('rising-souls') && risingParticles.map((p) => (
        <RisingParticle
          key={`rise-${p.id}`}
          x={p.x}
          size={p.size}
          duration={10 + Math.random() * 10}
          delay={p.delay * 2}
          color={p.color}
        />
      ))}

      {/* Mist Layers */}
      {effects.includes('mist') && [0, 1, 2].map((layer) => (
        <MistLayer key={`mist-${layer}`} layer={layer} />
      ))}

      {/* Candles */}
      {effects.includes('candles') && [
        { x: 5, y: 85 },
        { x: 95, y: 85 },
        { x: 15, y: 90 },
        { x: 85, y: 90 },
      ].map((pos, i) => (
        <CandleFlame key={`candle-${i}`} x={pos.x} y={pos.y} />
      ))}

      {/* Fireflies */}
      {effects.includes('fireflies') && floatingParticles.slice(0, 15).map((p) => (
        <Particle
          key={`firefly-${p.id}`}
          x={p.x}
          y={p.y}
          size={3}
          color="#fbbf24"
          duration={3 + Math.random() * 3}
          delay={p.delay}
          sx={{
            animation: `${drift} ${3 + Math.random() * 2}s ease-in-out infinite`,
          }}
        />
      ))}

      {/* Snow */}
      {effects.includes('snow') && risingParticles.map((p) => (
        <RisingParticle
          key={`snow-${p.id}`}
          x={p.x}
          size={2 + Math.random() * 4}
          duration={15 + Math.random() * 10}
          delay={Math.random() * 10}
          color="#ffffff"
          sx={{
            animation: `${rise} ${15 + Math.random() * 10}s linear infinite reverse`,
          }}
        />
      ))}
    </ParticleContainer>
  );
};

// Room-specific effect presets
export const roomEffects: Record<string, { effects: EffectType[]; colorScheme: string }> = {
  'grand-foyer': { effects: ['floating-particles', 'sparkles'], colorScheme: 'gold' },
  'ancestor-hall': { effects: ['rising-souls', 'mist', 'candles'], colorScheme: 'purple' },
  'library-study': { effects: ['floating-particles', 'candles'], colorScheme: 'gold' },
  'apothecary': { effects: ['mist', 'sparkles', 'candles'], colorScheme: 'teal' },
  'rooftop-observatory': { effects: ['sparkles', 'floating-particles'], colorScheme: 'purple' },
  'gaming-den': { effects: ['floating-particles', 'candles'], colorScheme: 'crimson' },
  'music-room': { effects: ['floating-particles', 'sparkles'], colorScheme: 'purple' },
  'dream-archives': { effects: ['mist', 'rising-souls', 'sparkles'], colorScheme: 'purple' },
  'fortune-teller-alcove': { effects: ['mist', 'candles', 'sparkles'], colorScheme: 'purple' },
  'cloud-garden': { effects: ['floating-particles', 'fireflies'], colorScheme: 'teal' },
  'kitchen-lab': { effects: ['sparkles', 'candles'], colorScheme: 'gold' },
  'pet-sanctuary': { effects: ['fireflies', 'floating-particles'], colorScheme: 'teal' },
  'creative-studio': { effects: ['sparkles', 'floating-particles'], colorScheme: 'rainbow' },
  'wardrobe-palace': { effects: ['sparkles'], colorScheme: 'gold' },
  'office-hub': { effects: ['floating-particles'], colorScheme: 'purple' },
  'guest-quarters': { effects: ['floating-particles', 'candles'], colorScheme: 'gold' },
};

export default AnimationSystem;
