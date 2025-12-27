// Room Pet Companion Widget
// A floating pet companion that appears in all dollhouse rooms
// Shows the active pet with mood, quick actions, and room-specific behaviors

import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, IconButton, Tooltip, Collapse, Snackbar, Alert } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { Utensils, Gamepad2, Sparkles, Home, X, ChevronUp, ChevronDown } from 'lucide-react';
import {
  Pet,
  getPets,
  feedPet,
  playWithPet,
  groomPet,
  initializeDefaultPets,
  updateAllPetStats,
  getMoodEmoji,
  PetActionResult,
} from '../../services/PetService';

// Floating animation
const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
`;

// Gentle bounce for actions
const bounce = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
`;

// Pulse for mood indicator
const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
`;

// Sparkle effect
const sparkle = keyframes`
  0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
  50% { opacity: 1; transform: scale(1) rotate(180deg); }
`;

export interface RoomPetCompanionProps {
  position?: 'bottom-left' | 'bottom-right';
  currentRoom?: string;
  onNavigateToSanctuary?: () => void;
}

// Room-specific pet messages
const ROOM_MESSAGES: Record<string, string[]> = {
  'grand-foyer': [
    'Exploring the entrance!',
    'Greeting visitors warmly!',
    'Guarding the doorway...',
    'Watching the comings and goings!',
  ],
  'ancestor-hall': [
    'Admiring the portraits...',
    'Feeling the history here!',
    'Watching over ancestors!',
    'Sensing old spirits...',
  ],
  'pet-sanctuary': [
    'Home sweet home!',
    'This is my favorite spot!',
    'Playing with friends!',
    'Feeling right at home!',
  ],
  'guest-quarters': [
    'Making new friends!',
    'Being social today!',
    'Welcoming guests!',
    'Sniffing around curiously...',
  ],
  'office-hub': [
    'Helping with paperwork!',
    'Being a good assistant!',
    'Napping under the desk...',
    'Supervising the finances!',
  ],
  'wardrobe-palace': [
    'Trying on accessories!',
    'Looking fabulous!',
    'Fashion consultant mode!',
    'Admiring the outfits...',
  ],
  'kitchen-lab': [
    'Smells yummy!',
    'Waiting for treats...',
    'Taste-testing everything!',
    'Kitchen helper on duty!',
  ],
  'music-room': [
    'Listening to the melodies...',
    'Humming along!',
    'Dancing to the beat!',
    'Enjoying the tunes!',
  ],
  'apothecary': [
    'Sensing magical energies...',
    'Watching the potions bubble!',
    'Mystical vibes here!',
    'Helping with the herbs...',
  ],
  'gaming-den': [
    'Watching you play!',
    'Ready to roll dice!',
    'Gaming companion activated!',
    'Cheering you on!',
  ],
  'library-study': [
    'Napping on books...',
    'Such a cozy spot!',
    'Learning new things!',
    'Being very studious...',
  ],
  'creative-studio': [
    'Inspiring creativity!',
    'Art appreciation time!',
    'Watching you create...',
    'Your artistic muse!',
  ],
  'rooftop-observatory': [
    'Stargazing together!',
    'Looking at the sky...',
    'Feeling the cosmic energy!',
    'Night watch duty!',
  ],
  'dream-archives': [
    'Exploring dreamland...',
    'Getting sleepy here...',
    'Dream guardian mode!',
    'Chasing dream butterflies!',
  ],
  'fortune-teller-alcove': [
    'Sensing the future...',
    'Reading the cards!',
    'Mystical companion!',
    'Channeling the spirits...',
  ],
  'cloud-garden': [
    'Chasing butterflies!',
    'Enjoying the fresh air!',
    'Sniffing the flowers...',
    'Garden helper on duty!',
  ],
};

// Default messages for unknown rooms
const DEFAULT_MESSAGES = [
  'Exploring with you!',
  'Happy to be here!',
  'Adventure time!',
  'Staying by your side!',
];

// Get a random message for a room
const getRoomMessage = (roomId: string): string => {
  const messages = ROOM_MESSAGES[roomId] || DEFAULT_MESSAGES;
  return messages[Math.floor(Math.random() * messages.length)];
};

// Styled Components
const CompanionContainer = styled(Box)<{ $position: 'bottom-left' | 'bottom-right' }>(({ $position }) => ({
  position: 'fixed',
  bottom: '100px', // Above the AudioManager
  [$position === 'bottom-left' ? 'left' : 'right']: '20px',
  zIndex: 999,
  display: 'flex',
  flexDirection: 'column',
  alignItems: $position === 'bottom-left' ? 'flex-start' : 'flex-end',
}));

const PetBubble = styled(Box)<{ expanded: boolean }>(({ expanded }) => ({
  background: 'rgba(10, 8, 18, 0.95)',
  backdropFilter: 'blur(15px)',
  borderRadius: expanded ? '16px' : '50%',
  border: '1px solid rgba(139, 92, 246, 0.4)',
  boxShadow: '0 8px 32px rgba(139, 92, 246, 0.2)',
  transition: 'all 0.3s ease',
  overflow: 'hidden',
  cursor: 'pointer',
  minWidth: expanded ? '200px' : '60px',
  minHeight: expanded ? 'auto' : '60px',
}));

const PetAvatarWrapper = styled(Box)<{ isAnimating?: boolean }>(({ isAnimating }) => ({
  width: '50px',
  height: '50px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '2rem',
  animation: isAnimating ? `${bounce} 0.5s ease-in-out` : `${float} 3s ease-in-out infinite`,
  position: 'relative',
}));

const MoodBubble = styled(Box)({
  position: 'absolute',
  top: '-8px',
  right: '-8px',
  background: 'rgba(139, 92, 246, 0.9)',
  borderRadius: '50%',
  width: '20px',
  height: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.7rem',
  animation: `${pulse} 2s ease-in-out infinite`,
  boxShadow: '0 2px 8px rgba(139, 92, 246, 0.4)',
});

const CollapsedView = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '5px',
});

const ExpandedView = styled(Box)({
  padding: '12px',
});

const PetHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '8px',
});

const RoomMessage = styled(Typography)({
  color: '#a78bfa',
  fontSize: '0.75rem',
  fontStyle: 'italic',
  padding: '8px',
  background: 'rgba(139, 92, 246, 0.1)',
  borderRadius: '8px',
  marginBottom: '8px',
  textAlign: 'center',
});

const ActionButton = styled(IconButton)({
  width: '36px',
  height: '36px',
  background: 'rgba(139, 92, 246, 0.15)',
  border: '1px solid rgba(139, 92, 246, 0.3)',
  transition: 'all 0.2s ease',
  '&:hover': {
    background: 'rgba(139, 92, 246, 0.3)',
    transform: 'translateY(-2px)',
  },
  '&:disabled': {
    opacity: 0.4,
    cursor: 'not-allowed',
  },
});

const SanctuaryLink = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
  padding: '8px',
  marginTop: '8px',
  borderTop: '1px solid rgba(139, 92, 246, 0.2)',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    background: 'rgba(139, 92, 246, 0.1)',
  },
});

const SparkleEffect = styled(Box)<{ delay: number }>(({ delay }) => ({
  position: 'absolute',
  animation: `${sparkle} 1s ease-in-out`,
  animationDelay: `${delay}s`,
  fontSize: '0.8rem',
  '&::before': {
    content: '"*"',
  },
}));

export const RoomPetCompanion: React.FC<RoomPetCompanionProps> = ({
  position = 'bottom-left',
  currentRoom = 'grand-foyer',
  onNavigateToSanctuary,
}) => {
  const [pet, setPet] = useState<Pet | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);
  const [roomMessage, setRoomMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [lastAction, setLastAction] = useState<PetActionResult | null>(null);

  // Initialize pet on mount
  useEffect(() => {
    const loadedPets = initializeDefaultPets();
    if (loadedPets.length > 0) {
      setPet(loadedPets[0]); // Use the first pet as the active companion
    }
  }, []);

  // Update room message when room changes
  useEffect(() => {
    setRoomMessage(getRoomMessage(currentRoom));
    // Change message every 30 seconds while in the same room
    const interval = setInterval(() => {
      setRoomMessage(getRoomMessage(currentRoom));
    }, 30000);
    return () => clearInterval(interval);
  }, [currentRoom]);

  // Update pet stats periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedPets = updateAllPetStats();
      if (pet && updatedPets.length > 0) {
        const updated = updatedPets.find(p => p.id === pet.id);
        if (updated) setPet(updated);
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [pet]);

  const handleAction = useCallback((action: 'feed' | 'play' | 'groom') => {
    if (!pet) return;

    let result: PetActionResult | null = null;

    switch (action) {
      case 'feed':
        result = feedPet(pet.id);
        break;
      case 'play':
        result = playWithPet(pet.id);
        break;
      case 'groom':
        result = groomPet(pet.id);
        break;
    }

    if (result) {
      setIsAnimating(true);
      setShowSparkles(true);
      setLastAction(result);
      setSnackbarOpen(true);
      setPet(result.pet);

      setTimeout(() => {
        setIsAnimating(false);
        setShowSparkles(false);
      }, 500);
    }
  }, [pet]);

  const handleSanctuaryClick = useCallback(() => {
    if (onNavigateToSanctuary) {
      onNavigateToSanctuary();
    }
  }, [onNavigateToSanctuary]);

  // Don't render if no pet
  if (!pet) {
    return null;
  }

  const moodEmoji = getMoodEmoji(pet.mood);
  const canPlay = pet.stats.energy >= 15;

  return (
    <>
      <CompanionContainer $position={position}>
        <PetBubble expanded={expanded} onClick={() => setExpanded(!expanded)}>
          {!expanded ? (
            // Collapsed view - just the pet emoji
            <CollapsedView>
              <PetAvatarWrapper isAnimating={isAnimating}>
                {pet.emoji}
                <MoodBubble>{moodEmoji}</MoodBubble>
                {showSparkles && (
                  <>
                    <SparkleEffect delay={0} sx={{ top: '-5px', left: '0' }} />
                    <SparkleEffect delay={0.1} sx={{ bottom: '0', right: '-5px' }} />
                    <SparkleEffect delay={0.2} sx={{ top: '5px', right: '5px' }} />
                  </>
                )}
              </PetAvatarWrapper>
            </CollapsedView>
          ) : (
            // Expanded view - pet info and actions
            <ExpandedView onClick={(e) => e.stopPropagation()}>
              <PetHeader>
                <PetAvatarWrapper isAnimating={isAnimating}>
                  {pet.emoji}
                  {showSparkles && (
                    <>
                      <SparkleEffect delay={0} sx={{ top: '-5px', left: '0' }} />
                      <SparkleEffect delay={0.1} sx={{ bottom: '0', right: '-5px' }} />
                    </>
                  )}
                </PetAvatarWrapper>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ color: '#e0e0e0', fontWeight: 600, fontSize: '0.95rem' }}>
                    {pet.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Typography sx={{ fontSize: '0.9rem' }}>{moodEmoji}</Typography>
                    <Typography sx={{ color: '#888888', fontSize: '0.75rem', textTransform: 'capitalize' }}>
                      {pet.mood}
                    </Typography>
                  </Box>
                </Box>
                <IconButton
                  size="small"
                  onClick={() => setExpanded(false)}
                  sx={{ color: '#888888', p: 0.5 }}
                >
                  <X size={16} />
                </IconButton>
              </PetHeader>

              <RoomMessage>{roomMessage}</RoomMessage>

              {/* Quick Actions */}
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                <Tooltip title="Feed" placement="top">
                  <ActionButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAction('feed');
                    }}
                    sx={{ color: '#10b981' }}
                  >
                    <Utensils size={16} />
                  </ActionButton>
                </Tooltip>
                <Tooltip title={canPlay ? 'Play' : 'Too tired to play'} placement="top">
                  <span>
                    <ActionButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAction('play');
                      }}
                      disabled={!canPlay}
                      sx={{ color: '#a855f7' }}
                    >
                      <Gamepad2 size={16} />
                    </ActionButton>
                  </span>
                </Tooltip>
                <Tooltip title="Groom" placement="top">
                  <ActionButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAction('groom');
                    }}
                    sx={{ color: '#ec4899' }}
                  >
                    <Sparkles size={16} />
                  </ActionButton>
                </Tooltip>
              </Box>

              {/* Link to Pet Sanctuary */}
              {onNavigateToSanctuary && (
                <SanctuaryLink onClick={handleSanctuaryClick}>
                  <Home size={14} color="#d4af37" />
                  <Typography sx={{ color: '#d4af37', fontSize: '0.75rem' }}>
                    Visit Pet Sanctuary
                  </Typography>
                </SanctuaryLink>
              )}
            </ExpandedView>
          )}
        </PetBubble>

        {/* Expand/Collapse hint when collapsed */}
        {!expanded && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 0.5 }}>
            <ChevronUp size={14} color="#888888" />
          </Box>
        )}
      </CompanionContainer>

      {/* Action Feedback Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.9), rgba(168, 85, 247, 0.9))',
            color: '#fff',
            '& .MuiAlert-icon': { color: '#fff' },
          }}
        >
          {lastAction?.message || 'Action completed!'}
        </Alert>
      </Snackbar>
    </>
  );
};

export default RoomPetCompanion;
