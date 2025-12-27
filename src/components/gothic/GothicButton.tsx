// Gothic Button Component
// Buttons with gold trim, glow effects, and elegant animations

import React from 'react';
import { Box, BoxProps } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 10px var(--glow-color, rgba(139, 92, 246, 0.4)); }
  50% { box-shadow: 0 0 25px var(--glow-color, rgba(139, 92, 246, 0.6)); }
`;

const shimmerBorder = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

interface GothicButtonProps extends Omit<BoxProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger';
  glowing?: boolean;
  ornate?: boolean;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  onClick?: () => void;
}

const StyledButton = styled(Box, {
  shouldForwardProp: (prop) =>
    !['variant', 'glowing', 'ornate', 'size', 'disabled'].includes(prop as string),
})<GothicButtonProps>(({ variant = 'primary', glowing, ornate, size = 'medium', disabled }) => {
  const baseStyles = {
    position: 'relative' as const,
    fontFamily: 'var(--font-accent, "Cinzel", serif)',
    fontWeight: 600,
    letterSpacing: '0.05em',
    textTransform: 'uppercase' as const,
    borderRadius: ornate ? '4px' : '8px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    overflow: 'hidden',

    // Size variants
    padding: size === 'small' ? '8px 16px' : size === 'large' ? '16px 32px' : '12px 24px',
    fontSize: size === 'small' ? '0.75rem' : size === 'large' ? '1rem' : '0.875rem',
  };

  const variantStyles = {
    primary: {
      background: 'linear-gradient(135deg, var(--color-primary, #8b5cf6) 0%, var(--color-secondary, #6366f1) 100%)',
      color: '#ffffff',
      border: '1px solid var(--border-color, rgba(139, 92, 246, 0.5))',
      boxShadow: '0 4px 15px var(--shadow-color, rgba(0, 0, 0, 0.3))',
      '&:hover': {
        background: 'linear-gradient(135deg, var(--color-primary-hover, #a78bfa) 0%, var(--color-primary, #8b5cf6) 100%)',
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 25px var(--shadow-color, rgba(0, 0, 0, 0.4)), 0 0 20px var(--glow-color, rgba(139, 92, 246, 0.3))',
      },
    },
    secondary: {
      background: 'transparent',
      color: 'var(--color-primary, #8b5cf6)',
      border: '2px solid var(--color-primary, #8b5cf6)',
      '&:hover': {
        background: 'rgba(139, 92, 246, 0.1)',
        borderColor: 'var(--color-primary-hover, #a78bfa)',
        transform: 'translateY(-2px)',
      },
    },
    accent: {
      background: 'linear-gradient(135deg, var(--color-accent, #d4af37) 0%, #f4d03f 50%, var(--color-accent, #d4af37) 100%)',
      backgroundSize: '200% 200%',
      color: '#0a0a0f',
      border: '1px solid var(--color-accent, #d4af37)',
      fontWeight: 700,
      '&:hover': {
        animation: `${shimmerBorder} 2s ease infinite`,
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 25px rgba(212, 175, 55, 0.4)',
      },
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-secondary, #a0a0a0)',
      border: '1px solid transparent',
      '&:hover': {
        background: 'rgba(255, 255, 255, 0.05)',
        color: 'var(--text-primary, #e0e0e0)',
        borderColor: 'var(--border-color, rgba(139, 92, 246, 0.3))',
      },
    },
    danger: {
      background: 'linear-gradient(135deg, var(--color-error, #ef4444) 0%, #dc2626 100%)',
      color: '#ffffff',
      border: '1px solid rgba(239, 68, 68, 0.5)',
      '&:hover': {
        background: 'linear-gradient(135deg, #f87171 0%, var(--color-error, #ef4444) 100%)',
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 25px rgba(239, 68, 68, 0.4)',
      },
    },
  };

  return {
    ...baseStyles,
    ...variantStyles[variant],

    // Glowing effect
    ...(glowing && {
      animation: `${pulseGlow} 2s ease-in-out infinite`,
    }),

    // Ornate border decoration
    ...(ornate && {
      '&::before': {
        content: '""',
        position: 'absolute',
        top: '2px',
        left: '2px',
        right: '2px',
        bottom: '2px',
        border: '1px solid rgba(212, 175, 55, 0.3)',
        borderRadius: '2px',
        pointerEvents: 'none',
      },
      '&::after': {
        content: '""',
        position: 'absolute',
        top: '-1px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '40%',
        height: '2px',
        background: 'var(--color-accent, #d4af37)',
      },
    }),

    // Active/pressed state
    '&:active': {
      transform: 'translateY(0)',
    },

    // Disabled state
    ...(disabled && {
      opacity: 0.5,
      cursor: 'not-allowed',
      pointerEvents: 'none' as const,
    }),
  };
});

// Icon wrapper for buttons with icons
const IconWrapper = styled('span')<{ position: 'start' | 'end' }>(({ position }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  marginRight: position === 'start' ? '8px' : 0,
  marginLeft: position === 'end' ? '8px' : 0,
}));

export const GothicButton: React.FC<GothicButtonProps & {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}> = ({
  children,
  startIcon,
  endIcon,
  onClick,
  disabled,
  ...props
}) => {
  return (
    <StyledButton
      component="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      {...props}
    >
      {startIcon && <IconWrapper position="start">{startIcon}</IconWrapper>}
      {children}
      {endIcon && <IconWrapper position="end">{endIcon}</IconWrapper>}
    </StyledButton>
  );
};

export default GothicButton;
