// Loading Screens Component
// Gothic-themed loading animations and transitions

import React, { useState, useEffect } from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { Moon, Sparkles, BookOpen, Ghost, Flame, Star, Key, Clock } from 'lucide-react';

// Keyframe Animations
const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

const fadeOut = keyframes`
  0% { opacity: 1; }
  100% { opacity: 0; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.1); opacity: 1; }
`;

const rotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const breathe = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const flicker = keyframes`
  0%, 100% { opacity: 1; }
  25% { opacity: 0.8; }
  50% { opacity: 1; }
  75% { opacity: 0.9; }
`;

const orbit = keyframes`
  0% { transform: rotate(0deg) translateX(80px) rotate(0deg); }
  100% { transform: rotate(360deg) translateX(80px) rotate(-360deg); }
`;

const typing = keyframes`
  0%, 100% { width: 0; }
  50% { width: 100%; }
`;

// Styled Components
const LoadingContainer = styled(Box)<{ variant?: string }>(({ variant }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: variant === 'light'
    ? 'linear-gradient(180deg, #f5f0ff 0%, #ede5ff 100%)'
    : 'linear-gradient(180deg, #0a0812 0%, #1a1028 50%, #0a0812 100%)',
  zIndex: 9999,
  animation: `${fadeIn} 0.3s ease-out`,
  '&.exiting': {
    animation: `${fadeOut} 0.5s ease-out forwards`,
  },
}));

const LogoContainer = styled(Box)({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '32px',
});

const MainIcon = styled(Box)<{ color: string }>(({ color }) => ({
  fontSize: '5rem',
  animation: `${float} 3s ease-in-out infinite`,
  filter: `drop-shadow(0 0 20px ${color})`,
}));

const OrbitingIcon = styled(Box)<{ delay: number; color: string }>(({ delay, color }) => ({
  position: 'absolute',
  animation: `${orbit} 4s linear infinite`,
  animationDelay: `${delay}s`,
  '& svg': {
    color: color,
    filter: `drop-shadow(0 0 10px ${color})`,
  },
}));

const GothicTitle = styled(Typography)({
  fontFamily: '"Cinzel", serif',
  fontSize: '2rem',
  letterSpacing: '0.2em',
  background: 'linear-gradient(90deg, #8b5cf6, #d4af37, #8b5cf6)',
  backgroundSize: '200% auto',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  animation: `${shimmer} 3s linear infinite`,
  marginBottom: '8px',
});

const Subtitle = styled(Typography)({
  color: '#9080a0',
  fontStyle: 'italic',
  marginBottom: '32px',
  animation: `${pulse} 2s ease-in-out infinite`,
});

const ProgressContainer = styled(Box)({
  width: '300px',
  marginBottom: '24px',
});

const GothicProgress = styled(LinearProgress)({
  height: '4px',
  borderRadius: '2px',
  backgroundColor: 'rgba(139, 92, 246, 0.2)',
  '& .MuiLinearProgress-bar': {
    borderRadius: '2px',
    background: 'linear-gradient(90deg, #8b5cf6 0%, #d4af37 50%, #8b5cf6 100%)',
    backgroundSize: '200% 100%',
    animation: `${shimmer} 2s linear infinite`,
  },
});

const LoadingTip = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '12px 24px',
  background: 'rgba(139, 92, 246, 0.1)',
  borderRadius: '8px',
  border: '1px solid rgba(139, 92, 246, 0.3)',
  maxWidth: '400px',
  textAlign: 'center',
});

const SpinnerContainer = styled(Box)({
  position: 'relative',
  width: '80px',
  height: '80px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const SpinnerRing = styled(Box)<{ size: number; duration: number; color: string }>(({ size, duration, color }) => ({
  position: 'absolute',
  width: `${size}px`,
  height: `${size}px`,
  borderRadius: '50%',
  border: `2px solid transparent`,
  borderTopColor: color,
  animation: `${rotate} ${duration}s linear infinite`,
}));

const CandleContainer = styled(Box)({
  display: 'flex',
  gap: '24px',
  marginBottom: '32px',
});

const Candle = styled(Box)<{ delay: number }>(({ delay }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  animation: `${flicker} 0.5s ease-in-out infinite`,
  animationDelay: `${delay}s`,
}));

const CandleFlame = styled(Box)({
  width: '12px',
  height: '20px',
  background: 'linear-gradient(180deg, #f59e0b 0%, #dc2626 50%, transparent 100%)',
  borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
  boxShadow: '0 0 20px #f59e0b, 0 0 40px #dc2626',
  marginBottom: '4px',
});

const CandleBody = styled(Box)({
  width: '8px',
  height: '40px',
  background: 'linear-gradient(180deg, #f5f5dc 0%, #d4af37 100%)',
  borderRadius: '2px',
});

// Loading tips
const loadingTips = [
  { icon: Star, text: "The ancestors are preparing your experience..." },
  { icon: BookOpen, text: "Gathering wisdom from the archives..." },
  { icon: Moon, text: "Aligning the celestial energies..." },
  { icon: Ghost, text: "Summoning your spirit guides..." },
  { icon: Key, text: "Unlocking the doors of perception..." },
  { icon: Clock, text: "Time flows differently in the dollhouse..." },
  { icon: Sparkles, text: "Weaving magic into every pixel..." },
  { icon: Flame, text: "Lighting the candles of illumination..." },
];

// Loading Screen Types
export type LoadingType = 'default' | 'room-transition' | 'initial' | 'minimal' | 'candles';

interface LoadingScreenProps {
  type?: LoadingType;
  progress?: number;
  message?: string;
  isVisible?: boolean;
  onComplete?: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  type = 'default',
  progress,
  message,
  isVisible = true,
  onComplete,
}) => {
  const [tipIndex, setTipIndex] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex(prev => (prev + 1) % loadingTips.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isVisible && !exiting) {
      setExiting(true);
      setTimeout(() => {
        onComplete?.();
      }, 500);
    }
  }, [isVisible, exiting, onComplete]);

  const currentTip = loadingTips[tipIndex];
  const TipIcon = currentTip.icon;

  if (type === 'minimal') {
    return (
      <LoadingContainer className={exiting ? 'exiting' : ''}>
        <SpinnerContainer>
          <SpinnerRing size={80} duration={2} color="#8b5cf6" />
          <SpinnerRing size={60} duration={1.5} color="#d4af37" sx={{ animationDirection: 'reverse' }} />
          <SpinnerRing size={40} duration={1} color="#ec4899" />
          <Moon size={20} color="#8b5cf6" />
        </SpinnerContainer>
      </LoadingContainer>
    );
  }

  if (type === 'candles') {
    return (
      <LoadingContainer className={exiting ? 'exiting' : ''}>
        <CandleContainer>
          {[0, 0.1, 0.2, 0.3, 0.4].map((delay, i) => (
            <Candle key={i} delay={delay}>
              <CandleFlame />
              <CandleBody />
            </Candle>
          ))}
        </CandleContainer>
        <GothicTitle>Illuminating</GothicTitle>
        <Subtitle>{message || 'Preparing your space...'}</Subtitle>
        {progress !== undefined && (
          <ProgressContainer>
            <GothicProgress variant="determinate" value={progress} />
          </ProgressContainer>
        )}
      </LoadingContainer>
    );
  }

  if (type === 'room-transition') {
    return (
      <LoadingContainer className={exiting ? 'exiting' : ''}>
        <Box sx={{ position: 'relative', mb: 3 }}>
          <Box
            sx={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'rgba(139, 92, 246, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: `${breathe} 2s ease-in-out infinite`,
            }}
          >
            <Key size={40} color="#d4af37" />
          </Box>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              border: '2px solid rgba(139, 92, 246, 0.3)',
              animation: `${rotate} 3s linear infinite`,
            }}
          />
        </Box>
        <Typography sx={{ color: '#a78bfa', fontFamily: '"Cinzel", serif', fontSize: '1.2rem' }}>
          {message || 'Opening the door...'}
        </Typography>
      </LoadingContainer>
    );
  }

  // Default / Initial loading screen
  return (
    <LoadingContainer className={exiting ? 'exiting' : ''}>
      <LogoContainer>
        <MainIcon color="#8b5cf6">
          <Moon size={80} color="#8b5cf6" />
        </MainIcon>
        <OrbitingIcon delay={0} color="#d4af37">
          <Star size={16} />
        </OrbitingIcon>
        <OrbitingIcon delay={1} color="#ec4899">
          <Sparkles size={16} />
        </OrbitingIcon>
        <OrbitingIcon delay={2} color="#10b981">
          <Ghost size={16} />
        </OrbitingIcon>
        <OrbitingIcon delay={3} color="#f97316">
          <Flame size={16} />
        </OrbitingIcon>
      </LogoContainer>

      <GothicTitle>Gothic Dollhouse</GothicTitle>
      <Subtitle>Your personal sanctuary awaits</Subtitle>

      {progress !== undefined && (
        <ProgressContainer>
          <GothicProgress variant="determinate" value={progress} />
          <Typography sx={{ color: '#888888', fontSize: '0.85rem', mt: 1, textAlign: 'center' }}>
            {Math.round(progress)}% complete
          </Typography>
        </ProgressContainer>
      )}

      <LoadingTip>
        <TipIcon size={18} color="#d4af37" />
        <Typography sx={{ color: '#a78bfa', fontSize: '0.9rem' }}>
          {message || currentTip.text}
        </Typography>
      </LoadingTip>
    </LoadingContainer>
  );
};

// Skeleton loader for content
const SkeletonPulse = keyframes`
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
`;

const SkeletonBox = styled(Box)<{ height?: string; width?: string }>(({ height = '20px', width = '100%' }) => ({
  height,
  width,
  borderRadius: '4px',
  background: 'linear-gradient(90deg, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.2) 50%, rgba(139, 92, 246, 0.1) 100%)',
  backgroundSize: '200% 100%',
  animation: `${shimmer} 1.5s ease-in-out infinite`,
}));

interface ContentSkeletonProps {
  lines?: number;
  showAvatar?: boolean;
  showImage?: boolean;
}

export const ContentSkeleton: React.FC<ContentSkeletonProps> = ({
  lines = 3,
  showAvatar = false,
  showImage = false,
}) => {
  return (
    <Box sx={{ p: 2 }}>
      {showAvatar && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <SkeletonBox width="48px" height="48px" sx={{ borderRadius: '50%' }} />
          <Box sx={{ flex: 1 }}>
            <SkeletonBox width="60%" height="16px" sx={{ mb: 1 }} />
            <SkeletonBox width="40%" height="12px" />
          </Box>
        </Box>
      )}
      {showImage && (
        <SkeletonBox width="100%" height="200px" sx={{ mb: 2, borderRadius: '8px' }} />
      )}
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonBox
          key={i}
          width={i === lines - 1 ? '70%' : '100%'}
          height="14px"
          sx={{ mb: 1 }}
        />
      ))}
    </Box>
  );
};

// Room loading placeholder
export const RoomLoadingSkeleton: React.FC = () => {
  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <SkeletonBox width="200px" height="40px" />
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3 }}>
        {[1, 2, 3, 4].map((i) => (
          <Box key={i} sx={{ p: 2, background: 'rgba(20, 20, 30, 0.5)', borderRadius: '12px' }}>
            <SkeletonBox height="150px" sx={{ mb: 2, borderRadius: '8px' }} />
            <SkeletonBox width="80%" height="20px" sx={{ mb: 1 }} />
            <SkeletonBox width="60%" height="14px" />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default LoadingScreen;
