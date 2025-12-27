// Gothic Tooltip Component
// Elegant tooltips with fade effects and gothic styling

import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Portal } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

interface GothicTooltipProps {
  title: React.ReactNode;
  children: React.ReactElement;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  variant?: 'default' | 'ornate' | 'minimal';
  delay?: number;
  arrow?: boolean;
}

const TooltipContainer = styled(Box, {
  shouldForwardProp: (prop) =>
    !['placement', 'variant', 'visible'].includes(prop as string),
})<{ placement: string; variant: string; visible: boolean }>(({ placement, variant, visible }) => ({
  position: 'fixed',
  zIndex: 1400,
  padding: variant === 'minimal' ? '6px 10px' : '10px 16px',
  borderRadius: variant === 'ornate' ? '4px' : '8px',
  pointerEvents: 'none',
  opacity: visible ? 1 : 0,
  animation: visible ? `${fadeIn} 0.2s ease-out` : 'none',
  maxWidth: '300px',

  // Background and border based on variant
  background: variant === 'ornate'
    ? 'linear-gradient(135deg, rgba(20, 20, 30, 0.98) 0%, rgba(30, 30, 45, 0.98) 100%)'
    : variant === 'minimal'
    ? 'rgba(10, 10, 15, 0.95)'
    : 'rgba(20, 20, 30, 0.95)',
  backdropFilter: 'blur(10px)',
  border: variant === 'ornate'
    ? '1px solid var(--color-accent, #d4af37)'
    : '1px solid var(--border-color, rgba(139, 92, 246, 0.4))',
  boxShadow: variant === 'ornate'
    ? '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 20px rgba(212, 175, 55, 0.2)'
    : '0 8px 24px rgba(0, 0, 0, 0.4)',

  // Ornate decorations
  ...(variant === 'ornate' && {
    '&::before': {
      content: '""',
      position: 'absolute',
      inset: '3px',
      border: '1px solid rgba(212, 175, 55, 0.3)',
      borderRadius: '2px',
      pointerEvents: 'none',
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: '20%',
      right: '20%',
      height: '100%',
      background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.1), transparent)',
      backgroundSize: '200% 100%',
      animation: `${shimmer} 3s infinite`,
      pointerEvents: 'none',
    },
  }),
}));

const TooltipText = styled(Box)<{ tooltipStyle: string }>(({ tooltipStyle }) => ({
  fontFamily: tooltipStyle === 'ornate'
    ? 'var(--font-accent, "Cinzel", serif)'
    : 'var(--font-family, sans-serif)',
  fontSize: tooltipStyle === 'minimal' ? '0.8rem' : '0.875rem',
  color: tooltipStyle === 'ornate' ? 'var(--text-accent, #d4af37)' : 'var(--text-primary, #e0e0e0)',
  lineHeight: 1.5,
  textAlign: 'center',
}));

const Arrow = styled('div', {
  shouldForwardProp: (prop) => !['placement', 'variant'].includes(prop as string),
})<{ placement: string; variant: string }>(({ placement, variant }) => ({
  position: 'absolute',
  width: 0,
  height: 0,
  border: '6px solid transparent',

  ...(placement === 'top' && {
    bottom: '-12px',
    left: '50%',
    transform: 'translateX(-50%)',
    borderTopColor: variant === 'ornate' ? 'var(--color-accent, #d4af37)' : 'var(--border-color, rgba(139, 92, 246, 0.4))',
  }),
  ...(placement === 'bottom' && {
    top: '-12px',
    left: '50%',
    transform: 'translateX(-50%)',
    borderBottomColor: variant === 'ornate' ? 'var(--color-accent, #d4af37)' : 'var(--border-color, rgba(139, 92, 246, 0.4))',
  }),
  ...(placement === 'left' && {
    right: '-12px',
    top: '50%',
    transform: 'translateY(-50%)',
    borderLeftColor: variant === 'ornate' ? 'var(--color-accent, #d4af37)' : 'var(--border-color, rgba(139, 92, 246, 0.4))',
  }),
  ...(placement === 'right' && {
    left: '-12px',
    top: '50%',
    transform: 'translateY(-50%)',
    borderRightColor: variant === 'ornate' ? 'var(--color-accent, #d4af37)' : 'var(--border-color, rgba(139, 92, 246, 0.4))',
  }),
}));

export const GothicTooltip: React.FC<GothicTooltipProps> = ({
  title,
  children,
  placement = 'top',
  variant = 'default',
  delay = 200,
  arrow = true,
}) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const gap = 12;

    let top = 0;
    let left = 0;

    switch (placement) {
      case 'top':
        top = triggerRect.top - tooltipRect.height - gap;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case 'bottom':
        top = triggerRect.bottom + gap;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.left - tooltipRect.width - gap;
        break;
      case 'right':
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.right + gap;
        break;
    }

    // Keep tooltip within viewport
    const padding = 10;
    left = Math.max(padding, Math.min(left, window.innerWidth - tooltipRect.width - padding));
    top = Math.max(padding, Math.min(top, window.innerHeight - tooltipRect.height - padding));

    setPosition({ top, left });
  };

  useEffect(() => {
    if (visible) {
      calculatePosition();
      window.addEventListener('scroll', calculatePosition);
      window.addEventListener('resize', calculatePosition);
    }
    return () => {
      window.removeEventListener('scroll', calculatePosition);
      window.removeEventListener('resize', calculatePosition);
    };
  }, [visible]);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setVisible(false);
  };

  return (
    <>
      <Box
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
        component="span"
        sx={{ display: 'inline-flex' }}
      >
        {children}
      </Box>

      <Portal>
        <TooltipContainer
          ref={tooltipRef}
          placement={placement}
          variant={variant}
          visible={visible}
          sx={{
            top: position.top,
            left: position.left,
            visibility: visible ? 'visible' : 'hidden',
          }}
        >
          {arrow && <Arrow placement={placement} variant={variant} />}
          <TooltipText tooltipStyle={variant}>
            {title}
          </TooltipText>
        </TooltipContainer>
      </Portal>
    </>
  );
};

export default GothicTooltip;
