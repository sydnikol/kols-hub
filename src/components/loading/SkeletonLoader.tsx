/**
 * SkeletonLoader Component
 * Animated skeleton placeholders with gothic theming
 * For the Dollhouse application
 */

import React from 'react';
import { Box, styled, keyframes } from '@mui/material';

// ============================================================================
// KEYFRAME ANIMATIONS
// ============================================================================

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
`;

const glow = keyframes`
  0%, 100% {
    box-shadow: 0 0 5px rgba(139, 92, 246, 0.2);
    opacity: 0.5;
  }
  50% {
    box-shadow: 0 0 15px rgba(139, 92, 246, 0.4);
    opacity: 0.8;
  }
`;

const flicker = keyframes`
  0% { opacity: 0.4; }
  25% { opacity: 0.6; }
  50% { opacity: 0.5; }
  75% { opacity: 0.7; }
  100% { opacity: 0.4; }
`;

const candleFlicker = keyframes`
  0%, 100% {
    transform: scaleY(1);
    opacity: 0.6;
  }
  25% {
    transform: scaleY(1.1);
    opacity: 0.8;
  }
  50% {
    transform: scaleY(0.9);
    opacity: 0.5;
  }
  75% {
    transform: scaleY(1.05);
    opacity: 0.7;
  }
`;

// ============================================================================
// SKELETON VARIANTS
// ============================================================================

export type SkeletonVariant = 'text' | 'circle' | 'rectangle' | 'rounded';
export type SkeletonAnimation = 'shimmer' | 'pulse' | 'glow' | 'flicker' | 'candle' | 'none';

// ============================================================================
// BASE SKELETON STYLED COMPONENT
// ============================================================================

interface SkeletonBaseProps {
  variant?: SkeletonVariant;
  animation?: SkeletonAnimation;
  width?: string | number;
  height?: string | number;
}

const getAnimation = (animation: SkeletonAnimation) => {
  switch (animation) {
    case 'shimmer':
      return `${shimmer} 1.5s ease-in-out infinite`;
    case 'pulse':
      return `${pulse} 1.5s ease-in-out infinite`;
    case 'glow':
      return `${glow} 2s ease-in-out infinite`;
    case 'flicker':
      return `${flicker} 0.5s ease-in-out infinite`;
    case 'candle':
      return `${candleFlicker} 1s ease-in-out infinite`;
    case 'none':
    default:
      return 'none';
  }
};

const getBackground = (animation: SkeletonAnimation) => {
  if (animation === 'shimmer') {
    return 'linear-gradient(90deg, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.25) 50%, rgba(139, 92, 246, 0.1) 100%)';
  }
  return 'rgba(139, 92, 246, 0.15)';
};

const SkeletonBase = styled(Box)<SkeletonBaseProps>(
  ({ variant = 'rectangle', animation = 'shimmer', width = '100%', height = '20px' }) => ({
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    background: getBackground(animation),
    backgroundSize: animation === 'shimmer' ? '200% 100%' : 'auto',
    animation: getAnimation(animation),
    borderRadius:
      variant === 'circle'
        ? '50%'
        : variant === 'rounded'
        ? '12px'
        : variant === 'text'
        ? '4px'
        : '8px',
  })
);

// ============================================================================
// SKELETON COMPONENT
// ============================================================================

export interface SkeletonProps {
  variant?: SkeletonVariant;
  animation?: SkeletonAnimation;
  width?: string | number;
  height?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'rectangle',
  animation = 'shimmer',
  width,
  height,
  className,
  style,
}) => {
  // Default heights based on variant
  const defaultHeight = variant === 'text' ? '16px' : variant === 'circle' ? width || '40px' : '20px';

  return (
    <SkeletonBase
      variant={variant}
      animation={animation}
      width={width}
      height={height || defaultHeight}
      className={className}
      style={style}
    />
  );
};

// ============================================================================
// SKELETON TEXT
// ============================================================================

export interface SkeletonTextProps {
  lines?: number;
  animation?: SkeletonAnimation;
  lastLineWidth?: string | number;
  spacing?: number;
  className?: string;
}

export const SkeletonText: React.FC<SkeletonTextProps> = ({
  lines = 3,
  animation = 'shimmer',
  lastLineWidth = '70%',
  spacing = 8,
  className,
}) => {
  return (
    <Box className={className} sx={{ display: 'flex', flexDirection: 'column', gap: `${spacing}px` }}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          variant="text"
          animation={animation}
          width={index === lines - 1 ? lastLineWidth : '100%'}
          height="14px"
        />
      ))}
    </Box>
  );
};

// ============================================================================
// SKELETON AVATAR
// ============================================================================

export interface SkeletonAvatarProps {
  size?: number;
  animation?: SkeletonAnimation;
  className?: string;
}

export const SkeletonAvatar: React.FC<SkeletonAvatarProps> = ({
  size = 48,
  animation = 'glow',
  className,
}) => {
  return (
    <Skeleton
      variant="circle"
      animation={animation}
      width={size}
      height={size}
      className={className}
    />
  );
};

// ============================================================================
// SKELETON CARD
// ============================================================================

export interface SkeletonCardProps {
  showImage?: boolean;
  showAvatar?: boolean;
  imageHeight?: number;
  lines?: number;
  animation?: SkeletonAnimation;
  className?: string;
}

const CardContainer = styled(Box)({
  background: 'rgba(20, 20, 30, 0.6)',
  borderRadius: '12px',
  padding: '16px',
  border: '1px solid rgba(139, 92, 246, 0.2)',
});

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  showImage = true,
  showAvatar = false,
  imageHeight = 150,
  lines = 3,
  animation = 'shimmer',
  className,
}) => {
  return (
    <CardContainer className={className}>
      {showImage && (
        <Skeleton
          variant="rounded"
          animation={animation}
          height={imageHeight}
          style={{ marginBottom: 16 }}
        />
      )}
      {showAvatar && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <SkeletonAvatar size={40} animation={animation} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" animation={animation} width="60%" height="16px" style={{ marginBottom: 6 }} />
            <Skeleton variant="text" animation={animation} width="40%" height="12px" />
          </Box>
        </Box>
      )}
      <SkeletonText lines={lines} animation={animation} />
    </CardContainer>
  );
};

// ============================================================================
// SKELETON LIST ITEM
// ============================================================================

export interface SkeletonListItemProps {
  showAvatar?: boolean;
  avatarSize?: number;
  lines?: number;
  animation?: SkeletonAnimation;
  className?: string;
}

const ListItemContainer = styled(Box)({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '12px',
  padding: '12px',
  background: 'rgba(20, 20, 30, 0.4)',
  borderRadius: '8px',
  marginBottom: '8px',
});

export const SkeletonListItem: React.FC<SkeletonListItemProps> = ({
  showAvatar = true,
  avatarSize = 40,
  lines = 2,
  animation = 'shimmer',
  className,
}) => {
  return (
    <ListItemContainer className={className}>
      {showAvatar && <SkeletonAvatar size={avatarSize} animation={animation} />}
      <Box sx={{ flex: 1 }}>
        <SkeletonText lines={lines} animation={animation} lastLineWidth="50%" />
      </Box>
    </ListItemContainer>
  );
};

// ============================================================================
// SKELETON GRID
// ============================================================================

export interface SkeletonGridProps {
  columns?: number;
  rows?: number;
  gap?: number;
  itemHeight?: number;
  animation?: SkeletonAnimation;
  className?: string;
}

export const SkeletonGrid: React.FC<SkeletonGridProps> = ({
  columns = 3,
  rows = 2,
  gap = 16,
  itemHeight = 150,
  animation = 'shimmer',
  className,
}) => {
  return (
    <Box
      className={className}
      sx={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `${gap}px`,
      }}
    >
      {Array.from({ length: columns * rows }).map((_, index) => (
        <Skeleton
          key={index}
          variant="rounded"
          animation={animation}
          height={itemHeight}
        />
      ))}
    </Box>
  );
};

// ============================================================================
// GOTHIC-THEMED SKELETON LOADERS
// ============================================================================

// Candle skeleton with flickering effect
const CandleContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '4px',
});

const CandleFlame = styled(Box)({
  width: '10px',
  height: '16px',
  background: 'linear-gradient(180deg, rgba(251, 191, 36, 0.8) 0%, rgba(239, 68, 68, 0.6) 50%, rgba(139, 92, 246, 0.3) 100%)',
  borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
  animation: `${candleFlicker} 0.8s ease-in-out infinite`,
  boxShadow: '0 0 10px rgba(251, 191, 36, 0.5)',
});

const CandleBody = styled(Box)<{ height: number }>(({ height }) => ({
  width: '8px',
  height: `${height}px`,
  background: 'linear-gradient(180deg, rgba(245, 245, 220, 0.4) 0%, rgba(212, 175, 55, 0.3) 100%)',
  borderRadius: '2px',
}));

export interface GothicCandleSkeletonProps {
  count?: number;
  height?: number;
  className?: string;
}

export const GothicCandleSkeleton: React.FC<GothicCandleSkeletonProps> = ({
  count = 5,
  height = 30,
  className,
}) => {
  return (
    <Box
      className={className}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        padding: '20px',
      }}
    >
      {Array.from({ length: count }).map((_, index) => (
        <CandleContainer
          key={index}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <CandleFlame style={{ animationDelay: `${index * 0.15}s` }} />
          <CandleBody height={height + Math.random() * 10} />
        </CandleContainer>
      ))}
    </Box>
  );
};

// Moon phase skeleton
const MoonContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
});

const MoonOrb = styled(Box)<{ size: number }>(({ size }) => ({
  width: `${size}px`,
  height: `${size}px`,
  borderRadius: '50%',
  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(139, 92, 246, 0.1) 50%, transparent 50%)',
  boxShadow: '0 0 20px rgba(139, 92, 246, 0.4), inset -5px -5px 15px rgba(0, 0, 0, 0.5)',
  animation: `${glow} 3s ease-in-out infinite`,
}));

const OrbitRing = styled(Box)<{ size: number; duration: number }>(({ size, duration }) => ({
  position: 'absolute',
  width: `${size}px`,
  height: `${size}px`,
  borderRadius: '50%',
  border: '1px solid rgba(139, 92, 246, 0.2)',
  animation: `${keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  `} ${duration}s linear infinite`,
}));

export interface GothicMoonSkeletonProps {
  size?: number;
  showOrbit?: boolean;
  className?: string;
}

export const GothicMoonSkeleton: React.FC<GothicMoonSkeletonProps> = ({
  size = 60,
  showOrbit = true,
  className,
}) => {
  return (
    <MoonContainer className={className}>
      <MoonOrb size={size} />
      {showOrbit && (
        <>
          <OrbitRing size={size * 1.5} duration={4} />
          <OrbitRing size={size * 2} duration={6} />
        </>
      )}
    </MoonContainer>
  );
};

// Room skeleton for dollhouse
export interface GothicRoomSkeletonProps {
  className?: string;
}

export const GothicRoomSkeleton: React.FC<GothicRoomSkeletonProps> = ({
  className,
}) => {
  return (
    <Box className={className} sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <GothicMoonSkeleton size={80} />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <Skeleton variant="text" animation="shimmer" width="200px" height="32px" />
      </Box>
      <GothicCandleSkeleton count={5} height={25} />
      <Box sx={{ mt: 4 }}>
        <SkeletonGrid columns={3} rows={2} itemHeight={120} animation="pulse" />
      </Box>
    </Box>
  );
};

// ============================================================================
// SKELETON LOADER WRAPPER
// ============================================================================

export interface SkeletonLoaderProps {
  isLoading: boolean;
  skeleton: React.ReactNode;
  children: React.ReactNode;
  fadeIn?: boolean;
}

const FadeInContainer = styled(Box)<{ visible: boolean }>(({ visible }) => ({
  opacity: visible ? 1 : 0,
  transition: 'opacity 0.3s ease-out',
}));

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  isLoading,
  skeleton,
  children,
  fadeIn = true,
}) => {
  if (isLoading) {
    return <>{skeleton}</>;
  }

  if (fadeIn) {
    return <FadeInContainer visible={!isLoading}>{children}</FadeInContainer>;
  }

  return <>{children}</>;
};

// ============================================================================
// EXPORTS
// ============================================================================

export default Skeleton;
