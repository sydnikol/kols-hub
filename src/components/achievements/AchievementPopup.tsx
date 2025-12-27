// Achievement Popup Component
// Toast notification when achievement unlocks with animations and sound effects

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Box, Typography, IconButton, Snackbar, Slide } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { TransitionProps } from '@mui/material/transitions';
import {
  Trophy,
  Star,
  X,
  Volume2,
  VolumeX,
  Gift,
  Sparkles,
} from 'lucide-react';
import {
  Achievement,
  rarityInfo,
  revealedSecrets,
} from '../../data/achievements';
import { achievementService, AchievementEvent } from '../../services/AchievementService';

// ==========================================
// Animations
// ==========================================

const slideIn = keyframes`
  0% {
    transform: translateX(100%) scale(0.8);
    opacity: 0;
  }
  50% {
    transform: translateX(-10%) scale(1.02);
  }
  100% {
    transform: translateX(0) scale(1);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  0% {
    transform: translateX(0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateX(100%) scale(0.8);
    opacity: 0;
  }
`;

const glow = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px var(--glow-color, rgba(212, 175, 55, 0.4));
  }
  50% {
    box-shadow: 0 0 40px var(--glow-color, rgba(212, 175, 55, 0.7));
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
`;

const confetti = keyframes`
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) rotate(720deg);
    opacity: 0;
  }
`;

const sparkle = keyframes`
  0%, 100% {
    opacity: 0;
    transform: scale(0);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
`;

// ==========================================
// Styled Components
// ==========================================

const PopupContainer = styled(Box)<{ rarity: string }>(({ rarity }) => {
  const color = rarityInfo[rarity as keyof typeof rarityInfo]?.color || '#d4af37';
  return {
    '--glow-color': `${color}80`,
    position: 'relative',
    minWidth: '320px',
    maxWidth: '400px',
    padding: '20px',
    borderRadius: '16px',
    background: `linear-gradient(135deg, #1a1028 0%, #0f0a18 100%)`,
    border: `2px solid ${color}`,
    animation: `${glow} 2s ease-in-out infinite`,
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '3px',
      background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
      backgroundSize: '200% 100%',
      animation: `${shimmer} 2s linear infinite`,
    },
  };
});

const IconBadge = styled(Box)<{ rarity: string }>(({ rarity }) => {
  const color = rarityInfo[rarity as keyof typeof rarityInfo]?.color || '#d4af37';
  return {
    width: '64px',
    height: '64px',
    borderRadius: '16px',
    background: `linear-gradient(135deg, ${color}40, ${color}20)`,
    border: `2px solid ${color}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    animation: `${pulse} 1s ease-in-out infinite`,
  };
});

const RarityBadge = styled(Box)<{ rarity: string }>(({ rarity }) => {
  const color = rarityInfo[rarity as keyof typeof rarityInfo]?.color || '#d4af37';
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 12px',
    borderRadius: '12px',
    background: `${color}20`,
    border: `1px solid ${color}50`,
    color: color,
    fontSize: '0.75rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };
});

const PointsBadge = styled(Box)({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  padding: '4px 12px',
  borderRadius: '12px',
  background: 'rgba(212, 175, 55, 0.2)',
  border: '1px solid rgba(212, 175, 55, 0.5)',
  color: '#d4af37',
  fontSize: '0.85rem',
  fontWeight: 700,
});

const CloseButton = styled(IconButton)({
  position: 'absolute',
  top: '8px',
  right: '8px',
  color: '#888',
  padding: '4px',
  '&:hover': {
    color: '#e0e0e0',
    background: 'rgba(255, 255, 255, 0.1)',
  },
});

const SoundButton = styled(IconButton)({
  color: '#888',
  padding: '4px',
  '&:hover': {
    color: '#e0e0e0',
    background: 'rgba(255, 255, 255, 0.1)',
  },
});

const SparkleElement = styled(Box)<{ delay: number; x: number; y: number }>(({ delay, x, y }) => ({
  position: 'absolute',
  left: `${x}%`,
  top: `${y}%`,
  width: '8px',
  height: '8px',
  background: '#d4af37',
  borderRadius: '50%',
  animation: `${sparkle} 1.5s ease-in-out infinite`,
  animationDelay: `${delay}s`,
  pointerEvents: 'none',
}));

const ConfettiPiece = styled(Box)<{ color: string; delay: number; x: number }>(({ color, delay, x }) => ({
  position: 'absolute',
  left: `${x}%`,
  bottom: '0',
  width: '8px',
  height: '12px',
  background: color,
  borderRadius: '2px',
  animation: `${confetti} 2s ease-out forwards`,
  animationDelay: `${delay}s`,
  pointerEvents: 'none',
}));

// ==========================================
// Transition Component
// ==========================================

function SlideTransition(props: TransitionProps & { children: React.ReactElement }) {
  return <Slide {...props} direction="left" />;
}

// ==========================================
// Component
// ==========================================

interface AchievementPopupProps {
  duration?: number;
  soundEnabled?: boolean;
  onSoundToggle?: (enabled: boolean) => void;
  position?: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
  maxVisible?: number;
}

interface PopupState {
  id: string;
  achievement: Achievement;
  visible: boolean;
  timestamp: number;
}

export const AchievementPopup: React.FC<AchievementPopupProps> = ({
  duration = 5000,
  soundEnabled: initialSoundEnabled = true,
  onSoundToggle,
  position = { vertical: 'top', horizontal: 'right' },
  maxVisible = 3,
}) => {
  const [popups, setPopups] = useState<PopupState[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(initialSoundEnabled);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const queueRef = useRef<Achievement[]>([]);
  const isProcessingRef = useRef(false);

  // Create audio element for sound effects
  useEffect(() => {
    // Create a simple unlock sound using Web Audio API
    const createUnlockSound = () => {
      try {
        const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();

        const playSound = () => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();

          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);

          oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
          oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
          oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5

          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.5);
        };

        return { playSound, audioContext };
      } catch {
        return null;
      }
    };

    const audio = createUnlockSound();
    if (audio) {
      (audioRef.current as unknown) = audio;
    }

    return () => {
      if ((audioRef.current as unknown as { audioContext: AudioContext })?.audioContext) {
        (audioRef.current as unknown as { audioContext: AudioContext }).audioContext.close();
      }
    };
  }, []);

  // Play sound effect
  const playUnlockSound = useCallback(() => {
    if (soundEnabled && audioRef.current) {
      try {
        (audioRef.current as unknown as { playSound: () => void }).playSound();
      } catch (error) {
        console.log('Sound playback failed:', error);
      }
    }
  }, [soundEnabled]);

  // Handle sound toggle
  const handleSoundToggle = () => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    onSoundToggle?.(newValue);
  };

  // Process queue
  const processQueue = useCallback(() => {
    if (isProcessingRef.current || queueRef.current.length === 0) return;
    if (popups.length >= maxVisible) return;

    isProcessingRef.current = true;
    const achievement = queueRef.current.shift();

    if (achievement) {
      const newPopup: PopupState = {
        id: `${achievement.id}-${Date.now()}`,
        achievement,
        visible: true,
        timestamp: Date.now(),
      };

      setPopups(prev => [...prev, newPopup]);
      playUnlockSound();

      // Auto-dismiss after duration
      setTimeout(() => {
        setPopups(prev => prev.map(p =>
          p.id === newPopup.id ? { ...p, visible: false } : p
        ));

        // Remove from list after animation
        setTimeout(() => {
          setPopups(prev => prev.filter(p => p.id !== newPopup.id));
          isProcessingRef.current = false;
          processQueue();
        }, 500);
      }, duration);
    }

    isProcessingRef.current = false;
  }, [popups.length, maxVisible, duration, playUnlockSound]);

  // Subscribe to achievement events
  useEffect(() => {
    const unsubscribe = achievementService.subscribe((event: AchievementEvent) => {
      if (event.type === 'unlock') {
        const details = achievementService.getAchievementDetails(event.achievementId);
        if (details) {
          queueRef.current.push(details.achievement);
          processQueue();
        }
      }
    });

    return () => unsubscribe();
  }, [processQueue]);

  // Process queue when space becomes available
  useEffect(() => {
    if (popups.length < maxVisible && queueRef.current.length > 0) {
      processQueue();
    }
  }, [popups.length, maxVisible, processQueue]);

  // Close popup manually
  const handleClose = (popupId: string) => {
    setPopups(prev => prev.map(p =>
      p.id === popupId ? { ...p, visible: false } : p
    ));

    setTimeout(() => {
      setPopups(prev => prev.filter(p => p.id !== popupId));
      processQueue();
    }, 300);
  };

  // Get display info for achievement
  const getDisplayInfo = (achievement: Achievement) => {
    const isSecret = achievement.secret;
    if (isSecret && revealedSecrets[achievement.id]) {
      const revealed = revealedSecrets[achievement.id];
      return {
        name: revealed.name,
        description: revealed.description,
        icon: revealed.icon,
      };
    }
    return {
      name: achievement.name,
      description: achievement.description,
      icon: achievement.icon,
    };
  };

  // Sparkle positions
  const sparkles = [
    { x: 10, y: 20, delay: 0 },
    { x: 85, y: 15, delay: 0.3 },
    { x: 50, y: 80, delay: 0.6 },
    { x: 20, y: 70, delay: 0.9 },
    { x: 90, y: 60, delay: 1.2 },
  ];

  // Confetti colors
  const confettiColors = ['#d4af37', '#8b5cf6', '#ec4899', '#22c55e', '#3b82f6'];

  return (
    <>
      {popups.map((popup, index) => {
        const { achievement, visible, id } = popup;
        const display = getDisplayInfo(achievement);
        const Icon = display.icon;
        const color = rarityInfo[achievement.rarity]?.color || '#d4af37';

        return (
          <Snackbar
            key={id}
            open={visible}
            TransitionComponent={SlideTransition}
            anchorOrigin={position}
            sx={{
              top: position.vertical === 'top' ? `${80 + index * 150}px !important` : 'auto',
              bottom: position.vertical === 'bottom' ? `${24 + index * 150}px !important` : 'auto',
            }}
          >
            <PopupContainer rarity={achievement.rarity}>
              {/* Sparkle effects */}
              {sparkles.map((s, i) => (
                <SparkleElement key={i} x={s.x} y={s.y} delay={s.delay} />
              ))}

              {/* Confetti for legendary/mythic */}
              {(achievement.rarity === 'legendary' || achievement.rarity === 'mythic') &&
                confettiColors.map((c, i) => (
                  <ConfettiPiece key={i} color={c} delay={i * 0.1} x={10 + i * 20} />
                ))
              }

              <CloseButton onClick={() => handleClose(id)} size="small">
                <X size={16} />
              </CloseButton>

              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <IconBadge rarity={achievement.rarity}>
                  <Icon size={32} color={color} />
                </IconBadge>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    sx={{
                      color: '#d4af37',
                      fontFamily: '"Cinzel", serif',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      mb: 0.5,
                    }}
                  >
                    <Trophy size={12} />
                    Achievement Unlocked!
                  </Typography>

                  <Typography
                    sx={{
                      color: '#e0e0e0',
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      mb: 0.5,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {display.name}
                  </Typography>

                  <Typography
                    sx={{
                      color: '#888',
                      fontSize: '0.85rem',
                      mb: 1.5,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {display.description}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                    <RarityBadge rarity={achievement.rarity}>
                      <Sparkles size={12} />
                      {achievement.rarity}
                    </RarityBadge>

                    <PointsBadge>
                      <Star size={12} />
                      +{achievement.points} pts
                    </PointsBadge>

                    {achievement.reward && (
                      <Box
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 0.5,
                          color: '#22c55e',
                          fontSize: '0.75rem',
                        }}
                      >
                        <Gift size={12} />
                        Reward!
                      </Box>
                    )}

                    <SoundButton onClick={handleSoundToggle} size="small">
                      {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                    </SoundButton>
                  </Box>
                </Box>
              </Box>
            </PopupContainer>
          </Snackbar>
        );
      })}
    </>
  );
};

export default AchievementPopup;
