// Room Transition Component
// Smooth animated transitions between dollhouse rooms

import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const doorOpen = keyframes`
  0% {
    clip-path: inset(50% 0 50% 0);
  }
  100% {
    clip-path: inset(0 0 0 0);
  }
`;

const curtainReveal = keyframes`
  0% {
    clip-path: polygon(50% 0, 50% 0, 50% 100%, 50% 100%);
  }
  100% {
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
  }
`;

const spiralIn = keyframes`
  0% {
    opacity: 0;
    transform: rotate(-180deg) scale(0);
  }
  100% {
    opacity: 1;
    transform: rotate(0) scale(1);
  }
`;

const mistFade = keyframes`
  0% {
    opacity: 1;
    filter: blur(20px);
  }
  100% {
    opacity: 1;
    filter: blur(0);
  }
`;

type TransitionType = 'fade' | 'slide' | 'door' | 'curtain' | 'spiral' | 'mist';

interface RoomTransitionProps {
  children: React.ReactNode;
  roomId: string;
  transitionType?: TransitionType;
  duration?: number;
  delay?: number;
  onTransitionComplete?: () => void;
}

const TransitionContainer = styled(Box, {
  shouldForwardProp: (prop) =>
    !['transitionType', 'duration', 'isAnimating'].includes(prop as string),
})<{ transitionType: TransitionType; duration: number; isAnimating: boolean }>(
  ({ transitionType, duration, isAnimating }) => {
    const getAnimation = () => {
      if (!isAnimating) return 'none';

      switch (transitionType) {
        case 'fade':
          return `${fadeIn} ${duration}ms ease-out`;
        case 'slide':
          return `${slideUp} ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`;
        case 'door':
          return `${doorOpen} ${duration}ms ease-out`;
        case 'curtain':
          return `${curtainReveal} ${duration}ms ease-out`;
        case 'spiral':
          return `${spiralIn} ${duration}ms ease-out`;
        case 'mist':
          return `${mistFade} ${duration}ms ease-out`;
        default:
          return `${fadeIn} ${duration}ms ease-out`;
      }
    };

    return {
      width: '100%',
      height: '100%',
      animation: getAnimation(),
      animationFillMode: 'forwards',
    };
  }
);

// Transition overlay for dramatic effect
const TransitionOverlay = styled(Box, {
  shouldForwardProp: (prop) => !['isVisible', 'color'].includes(prop as string),
})<{ isVisible: boolean; color: string }>(({ isVisible, color }) => ({
  position: 'fixed',
  inset: 0,
  background: color,
  zIndex: 9999,
  pointerEvents: 'none',
  opacity: isVisible ? 1 : 0,
  transition: 'opacity 0.3s ease-out',
}));

// Decorative particles during transition
const ParticleField = styled(Box)({
  position: 'absolute',
  inset: 0,
  overflow: 'hidden',
  pointerEvents: 'none',

  '& .particle': {
    position: 'absolute',
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    background: 'var(--color-accent, #d4af37)',
    animation: `${fadeIn} 0.5s ease-out`,
  },
});

export const RoomTransition: React.FC<RoomTransitionProps> = ({
  children,
  roomId,
  transitionType = 'slide',
  duration = 500,
  delay = 0,
  onTransitionComplete,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentRoomId, setCurrentRoomId] = useState(roomId);
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    if (roomId !== currentRoomId) {
      // Start transition
      setShowOverlay(true);

      const overlayTimer = setTimeout(() => {
        setCurrentRoomId(roomId);
        setIsAnimating(true);
        setShowOverlay(false);
      }, 200);

      const animationTimer = setTimeout(() => {
        setIsAnimating(false);
        onTransitionComplete?.();
      }, 200 + duration + delay);

      return () => {
        clearTimeout(overlayTimer);
        clearTimeout(animationTimer);
      };
    } else {
      // Initial mount animation
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
        onTransitionComplete?.();
      }, duration + delay);

      return () => clearTimeout(timer);
    }
  }, [roomId, currentRoomId, duration, delay, onTransitionComplete]);

  return (
    <>
      <TransitionOverlay
        isVisible={showOverlay}
        color="var(--bg-primary, #0a0a0f)"
      />
      <TransitionContainer
        transitionType={transitionType}
        duration={duration}
        isAnimating={isAnimating}
        style={{ animationDelay: `${delay}ms` }}
      >
        {children}
      </TransitionContainer>
    </>
  );
};

// Pre-built transition presets
export const TransitionPresets = {
  enterFromDoor: { transitionType: 'door' as TransitionType, duration: 600 },
  fadeIn: { transitionType: 'fade' as TransitionType, duration: 400 },
  slideUp: { transitionType: 'slide' as TransitionType, duration: 500 },
  curtainReveal: { transitionType: 'curtain' as TransitionType, duration: 700 },
  spiralEnter: { transitionType: 'spiral' as TransitionType, duration: 800 },
  mistAppear: { transitionType: 'mist' as TransitionType, duration: 600 },
};

export default RoomTransition;
