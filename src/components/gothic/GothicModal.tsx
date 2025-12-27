// Gothic Modal Component
// Modal with dramatic entrance animations and ornate styling

import React from 'react';
import { Modal, Box, IconButton, Typography } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { X } from 'lucide-react';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, -40%) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
`;

const unfurl = keyframes`
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scaleY(0) scaleX(0.8);
  }
  50% {
    transform: translate(-50%, -50%) scaleY(1) scaleX(0.8);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, -50%) scaleY(1) scaleX(1);
  }
`;

const glowBorder = keyframes`
  0%, 100% { box-shadow: 0 0 30px var(--glow-color, rgba(139, 92, 246, 0.3)); }
  50% { box-shadow: 0 0 50px var(--glow-color, rgba(139, 92, 246, 0.5)); }
`;

interface GothicModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  animation?: 'fade' | 'slide' | 'unfurl';
  showCloseButton?: boolean;
  ornate?: boolean;
}

const Backdrop = styled('div')({
  position: 'fixed',
  inset: 0,
  background: 'rgba(0, 0, 0, 0.85)',
  backdropFilter: 'blur(4px)',
  animation: `${fadeIn} 0.3s ease-out`,
  zIndex: 1300,
});

const ModalContainer = styled(Box, {
  shouldForwardProp: (prop) =>
    !['size', 'animation', 'ornate'].includes(prop as string),
})<{ size: string; animation: string; ornate: boolean }>(({ size, animation, ornate }) => ({
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  background: 'var(--bg-surface, rgba(20, 20, 30, 0.95))',
  backdropFilter: 'blur(20px)',
  borderRadius: size === 'fullscreen' ? 0 : '16px',
  border: '1px solid var(--border-accent, rgba(212, 175, 55, 0.5))',
  boxShadow: '0 25px 80px rgba(0, 0, 0, 0.6)',
  outline: 'none',
  zIndex: 1301,
  maxHeight: size === 'fullscreen' ? '100vh' : '90vh',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',

  // Size variants
  width: size === 'small' ? '400px' : size === 'large' ? '900px' : size === 'fullscreen' ? '100vw' : '600px',
  maxWidth: size === 'fullscreen' ? '100vw' : '95vw',
  height: size === 'fullscreen' ? '100vh' : 'auto',

  // Animation variants
  animation: animation === 'slide'
    ? `${slideUp} 0.4s cubic-bezier(0.16, 1, 0.3, 1)`
    : animation === 'unfurl'
    ? `${unfurl} 0.5s cubic-bezier(0.16, 1, 0.3, 1)`
    : `${fadeIn} 0.3s ease-out`,

  // Ornate styling
  ...(ornate && {
    animation: `${animation === 'slide' ? slideUp : animation === 'unfurl' ? unfurl : fadeIn} 0.4s ease-out, ${glowBorder} 3s ease-in-out infinite`,

    '&::before': {
      content: '""',
      position: 'absolute',
      inset: 0,
      borderRadius: '16px',
      padding: '2px',
      background: 'linear-gradient(135deg, var(--color-accent, #d4af37), transparent 40%, transparent 60%, var(--color-accent, #d4af37))',
      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
      maskComposite: 'xor',
      WebkitMaskComposite: 'xor',
      pointerEvents: 'none',
    },
  }),
}));

const Header = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '20px 24px',
  borderBottom: '1px solid var(--border-color, rgba(139, 92, 246, 0.3))',
  background: 'rgba(0, 0, 0, 0.2)',
});

const Title = styled(Typography)({
  fontFamily: 'var(--font-heading, "Playfair Display", serif)',
  fontSize: '1.5rem',
  fontWeight: 600,
  color: 'var(--text-accent, #d4af37)',
  letterSpacing: '0.02em',
});

const CloseButton = styled(IconButton)({
  color: 'var(--text-secondary, #a0a0a0)',
  padding: '8px',
  transition: 'all 0.2s ease',
  '&:hover': {
    color: 'var(--color-error, #ef4444)',
    background: 'rgba(239, 68, 68, 0.1)',
    transform: 'rotate(90deg)',
  },
});

const Content = styled(Box)({
  padding: '24px',
  overflowY: 'auto',
  flex: 1,
  color: 'var(--text-primary, #e0e0e0)',

  // Custom scrollbar
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'rgba(0, 0, 0, 0.2)',
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'var(--color-primary, #8b5cf6)',
    borderRadius: '4px',
    '&:hover': {
      background: 'var(--color-primary-hover, #a78bfa)',
    },
  },
});

// Decorative corner pieces for ornate modal
const Corner = styled('div')<{ position: 'tl' | 'tr' | 'bl' | 'br' }>(({ position }) => ({
  position: 'absolute',
  width: '30px',
  height: '30px',
  pointerEvents: 'none',
  ...(position === 'tl' && {
    top: '10px',
    left: '10px',
    borderTop: '3px solid var(--color-accent, #d4af37)',
    borderLeft: '3px solid var(--color-accent, #d4af37)',
  }),
  ...(position === 'tr' && {
    top: '10px',
    right: '10px',
    borderTop: '3px solid var(--color-accent, #d4af37)',
    borderRight: '3px solid var(--color-accent, #d4af37)',
  }),
  ...(position === 'bl' && {
    bottom: '10px',
    left: '10px',
    borderBottom: '3px solid var(--color-accent, #d4af37)',
    borderLeft: '3px solid var(--color-accent, #d4af37)',
  }),
  ...(position === 'br' && {
    bottom: '10px',
    right: '10px',
    borderBottom: '3px solid var(--color-accent, #d4af37)',
    borderRight: '3px solid var(--color-accent, #d4af37)',
  }),
}));

export const GothicModal: React.FC<GothicModalProps> = ({
  open,
  onClose,
  title,
  children,
  size = 'medium',
  animation = 'slide',
  showCloseButton = true,
  ornate = false,
}) => {
  if (!open) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      slotProps={{
        backdrop: {
          sx: {
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(4px)',
          },
        },
      }}
      closeAfterTransition
    >
      <ModalContainer size={size} animation={animation} ornate={ornate}>
        {ornate && (
          <>
            <Corner position="tl" />
            <Corner position="tr" />
            <Corner position="bl" />
            <Corner position="br" />
          </>
        )}

        {(title || showCloseButton) && (
          <Header>
            {title && <Title>{title}</Title>}
            {showCloseButton && (
              <CloseButton onClick={onClose} aria-label="Close modal">
                <X size={24} />
              </CloseButton>
            )}
          </Header>
        )}

        <Content>
          {children}
        </Content>
      </ModalContainer>
    </Modal>
  );
};

export default GothicModal;
