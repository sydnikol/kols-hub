/**
 * LazyImage Component
 * Lazy-loading image with blur-up effect, placeholder, and error fallback
 * Gothic-themed for the Dollhouse application
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, styled, keyframes } from '@mui/material';
import { ImageOff, Image as ImageIcon } from 'lucide-react';
import { createPlaceholder, preloadImage } from '../../utils/performance';

// Keyframe Animations
const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 10px rgba(139, 92, 246, 0.3); }
  50% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.5); }
`;

// Styled Components
const ImageContainer = styled(Box)<{ aspectRatio?: string }>(({ aspectRatio }) => ({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: '8px',
  backgroundColor: 'rgba(20, 20, 30, 0.5)',
  aspectRatio: aspectRatio || 'auto',
  width: '100%',
}));

const PlaceholderContainer = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(90deg, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.2) 50%, rgba(139, 92, 246, 0.1) 100%)',
  backgroundSize: '200% 100%',
  animation: `${shimmer} 1.5s ease-in-out infinite`,
});

const StyledImage = styled('img')<{ loaded: boolean; blur: boolean }>(({ loaded, blur }) => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'opacity 0.3s ease-out, filter 0.3s ease-out',
  opacity: loaded ? 1 : 0,
  filter: blur ? 'blur(20px)' : 'blur(0)',
}));

const BlurredPlaceholder = styled('img')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  filter: 'blur(20px)',
  transform: 'scale(1.1)',
  opacity: 0.8,
});

const ErrorContainer = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '12px',
  background: 'rgba(20, 20, 30, 0.8)',
  color: '#9080a0',
  animation: `${fadeIn} 0.3s ease-out`,
});

const LoadingIcon = styled(Box)({
  animation: `${pulseGlow} 2s ease-in-out infinite`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '48px',
  height: '48px',
  borderRadius: '50%',
  backgroundColor: 'rgba(139, 92, 246, 0.2)',
});

export interface LazyImageProps {
  src: string;
  alt: string;
  placeholder?: string;
  lowQualitySrc?: string;
  aspectRatio?: string;
  width?: string | number;
  height?: string | number;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
  rootMargin?: string;
  threshold?: number;
  errorFallback?: React.ReactNode;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  placeholder,
  lowQualitySrc,
  aspectRatio,
  width,
  height,
  className,
  onLoad,
  onError,
  rootMargin = '100px',
  threshold = 0.1,
  errorFallback,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showBlur, setShowBlur] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Generate placeholder if not provided
  const placeholderSrc = placeholder || createPlaceholder('rgba(139, 92, 246, 0.2)');

  // Set up intersection observer
  useEffect(() => {
    if (!containerRef.current || typeof IntersectionObserver === 'undefined') {
      // Fallback for browsers without IntersectionObserver
      setIsInView(true);
      return;
    }

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observerRef.current?.disconnect();
        }
      },
      {
        rootMargin,
        threshold,
      }
    );

    observerRef.current.observe(containerRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [rootMargin, threshold]);

  // Load image when in view
  useEffect(() => {
    if (!isInView || !src || hasError) return;

    // If we have a low quality source, show it first with blur
    if (lowQualitySrc) {
      setShowBlur(true);
    }

    preloadImage(src)
      .then(() => {
        setIsLoaded(true);
        // Delay removing blur for smooth transition
        setTimeout(() => setShowBlur(false), 100);
        onLoad?.();
      })
      .catch(() => {
        setHasError(true);
        onError?.();
      });
  }, [isInView, src, lowQualitySrc, hasError, onLoad, onError]);

  const handleRetry = useCallback(() => {
    setHasError(false);
    setIsLoaded(false);
    setShowBlur(true);
  }, []);

  return (
    <ImageContainer
      ref={containerRef}
      aspectRatio={aspectRatio}
      className={className}
      sx={{
        width: width || '100%',
        height: height || 'auto',
      }}
    >
      {/* Show placeholder while not in view or loading */}
      {!isLoaded && !hasError && (
        <PlaceholderContainer>
          <LoadingIcon>
            <ImageIcon size={24} color="#8b5cf6" />
          </LoadingIcon>
        </PlaceholderContainer>
      )}

      {/* Low quality blur placeholder */}
      {isInView && lowQualitySrc && !hasError && (
        <BlurredPlaceholder
          src={lowQualitySrc}
          alt=""
          aria-hidden="true"
          style={{ opacity: showBlur ? 0.8 : 0 }}
        />
      )}

      {/* Main image */}
      {isInView && !hasError && (
        <StyledImage
          src={src}
          alt={alt}
          loaded={isLoaded}
          blur={showBlur && !!lowQualitySrc}
          onLoad={() => {
            if (!isLoaded) {
              setIsLoaded(true);
              setTimeout(() => setShowBlur(false), 100);
              onLoad?.();
            }
          }}
          onError={() => {
            setHasError(true);
            onError?.();
          }}
        />
      )}

      {/* Error state */}
      {hasError && (
        <ErrorContainer>
          {errorFallback || (
            <>
              <ImageOff size={32} color="#8b5cf6" />
              <Box sx={{ fontSize: '0.85rem', textAlign: 'center' }}>
                Failed to load image
              </Box>
              <Box
                component="button"
                onClick={handleRetry}
                sx={{
                  padding: '6px 16px',
                  background: 'rgba(139, 92, 246, 0.2)',
                  border: '1px solid rgba(139, 92, 246, 0.4)',
                  borderRadius: '4px',
                  color: '#a78bfa',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  '&:hover': {
                    background: 'rgba(139, 92, 246, 0.3)',
                  },
                }}
              >
                Retry
              </Box>
            </>
          )}
        </ErrorContainer>
      )}
    </ImageContainer>
  );
};

// Image Gallery with lazy loading
export interface LazyImageGalleryProps {
  images: Array<{
    src: string;
    alt: string;
    lowQualitySrc?: string;
  }>;
  columns?: number;
  gap?: number;
}

export const LazyImageGallery: React.FC<LazyImageGalleryProps> = ({
  images,
  columns = 3,
  gap = 16,
}) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `${gap}px`,
      }}
    >
      {images.map((image, index) => (
        <LazyImage
          key={`${image.src}-${index}`}
          src={image.src}
          alt={image.alt}
          lowQualitySrc={image.lowQualitySrc}
          aspectRatio="1/1"
        />
      ))}
    </Box>
  );
};

export default LazyImage;
