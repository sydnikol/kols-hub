// Gothic Card Component
// Card with ornate borders, glassmorphism, and hover effects

import React from 'react';
import { Box, BoxProps } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const glowPulse = keyframes`
  0%, 100% { box-shadow: 0 0 20px var(--glow-color, rgba(139, 92, 246, 0.3)); }
  50% { box-shadow: 0 0 40px var(--glow-color, rgba(139, 92, 246, 0.5)); }
`;

interface GothicCardProps extends BoxProps {
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  glowOnHover?: boolean;
  ornate?: boolean;
  animated?: boolean;
}

const StyledCard = styled(Box, {
  shouldForwardProp: (prop) =>
    !['variant', 'glowOnHover', 'ornate', 'animated'].includes(prop as string),
})<GothicCardProps>(({ variant = 'default', glowOnHover, ornate, animated }) => ({
  position: 'relative',
  borderRadius: '12px',
  padding: '24px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  overflow: 'hidden',

  // Base styles
  background: variant === 'glass'
    ? 'rgba(20, 20, 30, 0.7)'
    : 'var(--bg-surface, rgba(20, 20, 30, 0.8))',
  backdropFilter: variant === 'glass' ? 'blur(10px)' : 'none',
  border: variant === 'outlined'
    ? '1px solid var(--border-accent, rgba(212, 175, 55, 0.5))'
    : '1px solid var(--border-color, rgba(139, 92, 246, 0.3))',
  boxShadow: variant === 'elevated'
    ? '0 10px 40px var(--shadow-color, rgba(0, 0, 0, 0.5))'
    : '0 4px 20px rgba(0, 0, 0, 0.3)',

  // Ornate border overlay
  ...(ornate && {
    '&::before': {
      content: '""',
      position: 'absolute',
      inset: 0,
      borderRadius: '12px',
      padding: '2px',
      background: 'linear-gradient(135deg, var(--color-accent, #d4af37), transparent, var(--color-accent, #d4af37))',
      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
      maskComposite: 'xor',
      WebkitMaskComposite: 'xor',
      pointerEvents: 'none',
    },
  }),

  // Corner ornaments for ornate cards
  ...(ornate && {
    '&::after': {
      content: '""',
      position: 'absolute',
      top: '8px',
      left: '8px',
      width: '20px',
      height: '20px',
      borderTop: '2px solid var(--color-accent, #d4af37)',
      borderLeft: '2px solid var(--color-accent, #d4af37)',
      borderTopLeftRadius: '4px',
    },
  }),

  // Animated shimmer effect
  ...(animated && {
    '&::before': {
      content: '""',
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent)',
      backgroundSize: '200% 100%',
      animation: `${shimmer} 3s infinite`,
      pointerEvents: 'none',
    },
  }),

  // Hover effects
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: glowOnHover
      ? '0 20px 60px var(--shadow-color, rgba(0, 0, 0, 0.6)), 0 0 30px var(--glow-color, rgba(139, 92, 246, 0.4))'
      : '0 15px 50px var(--shadow-color, rgba(0, 0, 0, 0.5))',
    borderColor: 'var(--border-accent, rgba(212, 175, 55, 0.5))',
    background: 'var(--bg-surface-hover, rgba(30, 30, 45, 0.9))',
  },

  // Glow animation on hover
  ...(glowOnHover && {
    '&:hover': {
      animation: `${glowPulse} 2s ease-in-out infinite`,
    },
  }),
}));

// Corner ornament component for extra decoration
const CornerOrnament = styled('div')<{ position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' }>(
  ({ position }) => ({
    position: 'absolute',
    width: '24px',
    height: '24px',
    pointerEvents: 'none',
    ...(position === 'top-left' && {
      top: '6px',
      left: '6px',
      borderTop: '2px solid var(--color-accent, #d4af37)',
      borderLeft: '2px solid var(--color-accent, #d4af37)',
    }),
    ...(position === 'top-right' && {
      top: '6px',
      right: '6px',
      borderTop: '2px solid var(--color-accent, #d4af37)',
      borderRight: '2px solid var(--color-accent, #d4af37)',
    }),
    ...(position === 'bottom-left' && {
      bottom: '6px',
      left: '6px',
      borderBottom: '2px solid var(--color-accent, #d4af37)',
      borderLeft: '2px solid var(--color-accent, #d4af37)',
    }),
    ...(position === 'bottom-right' && {
      bottom: '6px',
      right: '6px',
      borderBottom: '2px solid var(--color-accent, #d4af37)',
      borderRight: '2px solid var(--color-accent, #d4af37)',
    }),
  })
);

export const GothicCard: React.FC<GothicCardProps & { showAllCorners?: boolean }> = ({
  children,
  showAllCorners = false,
  ornate = false,
  ...props
}) => {
  return (
    <StyledCard ornate={ornate} {...props}>
      {(showAllCorners || ornate) && (
        <>
          <CornerOrnament position="top-left" />
          <CornerOrnament position="top-right" />
          <CornerOrnament position="bottom-left" />
          <CornerOrnament position="bottom-right" />
        </>
      )}
      {children}
    </StyledCard>
  );
};

export default GothicCard;
