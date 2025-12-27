// Pet Sanctuary Room Component
// Virtual pets, companions, and emotional support animals with real persistence

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Chip, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Fade, Zoom } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Heart, Star, Sparkles, Gift, Moon, Sun,
  Utensils, Droplets, Gamepad2, Home, Plus, Award, ExternalLink, Scissors
} from 'lucide-react';
import { GothicCard } from '../gothic/GothicCard';
import { GothicButton } from '../gothic/GothicButton';
import {
  Pet,
  getPets,
  feedPet,
  playWithPet,
  restPet,
  groomPet,
  adoptPet,
  initializeDefaultPets,
  updateAllPetStats,
  getMoodEmoji,
  getStatColor,
  getTimeSince,
  AVAILABLE_SPECIES,
  PetActionResult,
} from '../../services/PetService';

interface RoomProps {
  onRoomChange?: (roomId: string) => void;
}

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const heartbeat = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
`;

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  25% { transform: translateY(-15px) rotate(-5deg); }
  50% { transform: translateY(0); }
  75% { transform: translateY(-10px) rotate(5deg); }
`;

const sparkle = keyframes`
  0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
  50% { opacity: 1; transform: scale(1.2) rotate(180deg); }
`;

const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(236, 72, 153, 0.4); }
  50% { box-shadow: 0 0 20px 10px rgba(236, 72, 153, 0.2); }
`;

const RoomContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #080a10 0%, #101520 50%, #080a10 100%)',
  padding: '32px',
  position: 'relative',
});

const HeaderSection = styled(Box)({
  textAlign: 'center',
  marginBottom: '48px',
});

const RoomTitle = styled(Typography)({
  fontFamily: '"Cinzel", serif',
  fontSize: '3rem',
  fontWeight: 700,
  color: '#ec4899',
  letterSpacing: '0.1em',
  textShadow: '0 0 40px rgba(236, 72, 153, 0.4)',
  marginBottom: '8px',
});

const PetCard = styled(GothicCard)<{ selected?: boolean }>(({ selected }) => ({
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  textAlign: 'center',
  border: selected ? '2px solid #ec4899' : undefined,
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 40px rgba(236, 72, 153, 0.3)',
  },
}));

const PetAvatar = styled(Box)<{ isAnimating?: boolean }>(({ isAnimating }) => ({
  width: '120px',
  height: '120px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(139, 92, 246, 0.2))',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 16px',
  fontSize: '4rem',
  animation: isAnimating ? `${bounce} 0.6s ease-in-out` : `${float} 3s ease-in-out infinite`,
  position: 'relative',
}));

const SparkleEffect = styled(Box)({
  position: 'absolute',
  fontSize: '1.5rem',
  animation: `${sparkle} 1s ease-in-out forwards`,
});

const StatBar = styled(Box)<{ value: number; color: string }>(({ value, color }) => ({
  height: '8px',
  borderRadius: '4px',
  background: `${color}20`,
  position: 'relative',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    width: `${value}%`,
    borderRadius: '4px',
    background: `linear-gradient(90deg, ${color}, ${color}cc)`,
    transition: 'width 0.5s ease',
  },
}));

const ActionButton = styled(Box)<{ disabled?: boolean }>(({ disabled }) => ({
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  background: disabled ? 'rgba(100, 100, 100, 0.2)' : 'rgba(236, 72, 153, 0.2)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: disabled ? 'not-allowed' : 'pointer',
  transition: 'all 0.2s ease',
  opacity: disabled ? 0.5 : 1,
  '&:hover': {
    transform: disabled ? 'none' : 'scale(1.1)',
    background: disabled ? 'rgba(100, 100, 100, 0.2)' : 'rgba(236, 72, 153, 0.4)',
    animation: disabled ? 'none' : `${pulse} 1s ease-in-out infinite`,
  },
}));

const StatChangeIndicator = styled(Typography)<{ positive: boolean }>(({ positive }) => ({
  color: positive ? '#10b981' : '#ef4444',
  fontSize: '0.85rem',
  fontWeight: 600,
  animation: 'fadeInUp 0.5s ease-out',
  '@keyframes fadeInUp': {
    from: {
      opacity: 0,
      transform: 'translateY(10px)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
}));

const activities = [
  { name: 'Feed', icon: <Utensils size={24} />, action: 'feed', effect: '+30 Hunger, -10 Energy' },
  { name: 'Play', icon: <Gamepad2 size={24} />, action: 'play', effect: '+20 Happy, +5 Bond, -15 Energy' },
  { name: 'Rest', icon: <Moon size={24} />, action: 'rest', effect: '+40 Energy' },
  { name: 'Groom', icon: <Scissors size={24} />, action: 'groom', effect: '+10 Bond, +5 Happy' },
];

const achievements = [
  { name: 'First Friend', description: 'Adopt your first pet', earned: true },
  { name: 'Best Friends', description: 'Reach 100% bond with a pet', earned: false },
  { name: 'Pet Whisperer', description: 'Adopt 5 different pets', earned: false },
  { name: 'Dedicated Carer', description: '30 days of pet care', earned: true },
];

export const PetSanctuary: React.FC<RoomProps> = ({ onRoomChange }) => {
  const navigate = useNavigate();
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);
  const [lastAction, setLastAction] = useState<PetActionResult | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [adoptDialogOpen, setAdoptDialogOpen] = useState(false);
  const [newPetName, setNewPetName] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState(AVAILABLE_SPECIES[0]);

  // Initialize pets on mount
  useEffect(() => {
    const loadedPets = initializeDefaultPets();
    setPets(loadedPets);
    if (loadedPets.length > 0) {
      setSelectedPet(loadedPets[0]);
    }
  }, []);

  // Update stats every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedPets = updateAllPetStats();
      setPets(updatedPets);
      if (selectedPet) {
        const updated = updatedPets.find(p => p.id === selectedPet.id);
        if (updated) setSelectedPet(updated);
      }
    }, 60000); // Every minute

    return () => clearInterval(interval);
  }, [selectedPet]);

  // Handle pet action
  const handleAction = useCallback((action: string) => {
    if (!selectedPet) return;

    let result: PetActionResult | null = null;

    switch (action) {
      case 'feed':
        result = feedPet(selectedPet.id);
        break;
      case 'play':
        result = playWithPet(selectedPet.id);
        break;
      case 'rest':
        result = restPet(selectedPet.id);
        break;
      case 'groom':
        result = groomPet(selectedPet.id);
        break;
    }

    if (result) {
      // Trigger animations
      setIsAnimating(true);
      setShowSparkles(true);
      setLastAction(result);
      setSnackbarOpen(true);

      // Update state
      const updatedPets = getPets();
      setPets(updatedPets);
      setSelectedPet(result.pet);

      // Reset animations
      setTimeout(() => {
        setIsAnimating(false);
        setShowSparkles(false);
      }, 600);
    }
  }, [selectedPet]);

  // Handle pet adoption
  const handleAdopt = useCallback(() => {
    if (!newPetName.trim()) return;

    const newPet = adoptPet(selectedSpecies.species, newPetName.trim(), selectedSpecies.emoji);
    const updatedPets = getPets();
    setPets(updatedPets);
    setSelectedPet(newPet);
    setAdoptDialogOpen(false);
    setNewPetName('');
    setSnackbarOpen(true);
    setLastAction({
      pet: newPet,
      message: `Welcome to the family, ${newPet.name}!`,
      statChanges: {},
    });
  }, [newPetName, selectedSpecies]);

  // Handle pet selection
  const handleSelectPet = useCallback((pet: Pet) => {
    // Refresh pet stats before selecting
    const updatedPets = updateAllPetStats();
    const freshPet = updatedPets.find(p => p.id === pet.id);
    if (freshPet) {
      setSelectedPet(freshPet);
      setPets(updatedPets);
    }
  }, []);

  return (
    <RoomContainer>
      <HeaderSection>
        <RoomTitle>
          <Heart size={40} style={{ marginRight: '16px', verticalAlign: 'middle' }} />
          Pet Sanctuary
        </RoomTitle>
        <Typography sx={{ color: '#a08090', fontStyle: 'italic', fontSize: '1.1rem' }}>
          Your mystical companions await
        </Typography>
      </HeaderSection>

      <Grid container spacing={4}>
        {/* Pet Selection */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif', fontSize: '1.3rem' }}>
              <Home size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Your Companions ({pets.length})
            </Typography>
            <GothicButton
              variant="primary"
              startIcon={<Plus size={18} />}
              onClick={() => setAdoptDialogOpen(true)}
            >
              Adopt New Pet
            </GothicButton>
          </Box>
          <Grid container spacing={2}>
            {pets.map((pet) => (
              <Grid item xs={12} sm={4} key={pet.id}>
                <PetCard
                  variant="glass"
                  selected={selectedPet?.id === pet.id}
                  onClick={() => handleSelectPet(pet)}
                >
                  <PetAvatar>{pet.emoji}</PetAvatar>
                  <Typography sx={{ color: '#e0e0e0', fontSize: '1.3rem', fontWeight: 600, mb: 0.5 }}>
                    {pet.name}
                  </Typography>
                  <Typography sx={{ color: '#a0a0a0', fontSize: '0.9rem', mb: 1 }}>
                    {pet.species}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Chip
                      label={`${pet.mood} ${getMoodEmoji(pet.mood)}`}
                      size="small"
                      sx={{ background: 'rgba(236, 72, 153, 0.2)', color: '#ec4899' }}
                    />
                  </Box>
                </PetCard>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Selected Pet Details */}
        {selectedPet && (
          <Grid item xs={12} md={8}>
            <GothicCard variant="elevated" ornate>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap', mb: 4 }}>
                <PetAvatar isAnimating={isAnimating} sx={{ width: '150px', height: '150px', fontSize: '5rem' }}>
                  {selectedPet.emoji}
                  {showSparkles && (
                    <>
                      <SparkleEffect sx={{ top: '-10px', left: '10px' }}>✨</SparkleEffect>
                      <SparkleEffect sx={{ top: '0', right: '-5px', animationDelay: '0.1s' }}>💫</SparkleEffect>
                      <SparkleEffect sx={{ bottom: '10px', left: '-10px', animationDelay: '0.2s' }}>⭐</SparkleEffect>
                      <SparkleEffect sx={{ bottom: '-5px', right: '20px', animationDelay: '0.3s' }}>✨</SparkleEffect>
                    </>
                  )}
                </PetAvatar>
                <Box>
                  <Typography sx={{ color: '#e0e0e0', fontSize: '2rem', fontWeight: 600 }}>
                    {selectedPet.name}
                  </Typography>
                  <Typography sx={{ color: '#a0a0a0', fontSize: '1.1rem', mb: 1 }}>
                    {selectedPet.species}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                      icon={<Heart size={14} />}
                      label={`Bond: ${selectedPet.stats.bond}%`}
                      sx={{ background: 'rgba(236, 72, 153, 0.2)', color: '#ec4899' }}
                    />
                    <Chip
                      label={`${selectedPet.mood} ${getMoodEmoji(selectedPet.mood)}`}
                      sx={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}
                    />
                  </Box>
                </Box>
              </Box>

              {/* Stats */}
              <Typography sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif', fontSize: '1.1rem', mb: 2 }}>
                Status
              </Typography>
              <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ mb: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography sx={{ color: '#e0e0e0', fontSize: '0.9rem' }}>
                        <Utensils size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                        Hunger
                      </Typography>
                      <Typography sx={{ color: getStatColor('hunger', selectedPet.stats.hunger), fontSize: '0.9rem', fontWeight: 600 }}>
                        {Math.round(selectedPet.stats.hunger)}%
                      </Typography>
                    </Box>
                    <Typography sx={{ color: '#666', fontSize: '0.7rem' }}>
                      Fed {getTimeSince(selectedPet.lastFed)}
                    </Typography>
                  </Box>
                  <StatBar value={selectedPet.stats.hunger} color={getStatColor('hunger', selectedPet.stats.hunger)} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ mb: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography sx={{ color: '#e0e0e0', fontSize: '0.9rem' }}>
                        <Moon size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                        Energy
                      </Typography>
                      <Typography sx={{ color: getStatColor('energy', selectedPet.stats.energy), fontSize: '0.9rem', fontWeight: 600 }}>
                        {Math.round(selectedPet.stats.energy)}%
                      </Typography>
                    </Box>
                    <Typography sx={{ color: '#666', fontSize: '0.7rem' }}>
                      Rested {getTimeSince(selectedPet.lastRested)}
                    </Typography>
                  </Box>
                  <StatBar value={selectedPet.stats.energy} color={getStatColor('energy', selectedPet.stats.energy)} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ mb: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography sx={{ color: '#e0e0e0', fontSize: '0.9rem' }}>
                        <Sparkles size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                        Happiness
                      </Typography>
                      <Typography sx={{ color: getStatColor('happiness', selectedPet.stats.happiness), fontSize: '0.9rem', fontWeight: 600 }}>
                        {Math.round(selectedPet.stats.happiness)}%
                      </Typography>
                    </Box>
                    <Typography sx={{ color: '#666', fontSize: '0.7rem' }}>
                      Played {getTimeSince(selectedPet.lastPlayed)}
                    </Typography>
                  </Box>
                  <StatBar value={selectedPet.stats.happiness} color={getStatColor('happiness', selectedPet.stats.happiness)} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ mb: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography sx={{ color: '#e0e0e0', fontSize: '0.9rem' }}>
                        <Heart size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                        Bond
                      </Typography>
                      <Typography sx={{ color: getStatColor('bond', selectedPet.stats.bond), fontSize: '0.9rem', fontWeight: 600 }}>
                        {Math.round(selectedPet.stats.bond)}%
                      </Typography>
                    </Box>
                    <Typography sx={{ color: '#666', fontSize: '0.7rem' }}>
                      Groomed {getTimeSince(selectedPet.lastGroomed)}
                    </Typography>
                  </Box>
                  <StatBar value={selectedPet.stats.bond} color={getStatColor('bond', selectedPet.stats.bond)} />
                </Grid>
              </Grid>

              {/* Actions */}
              <Typography sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif', fontSize: '1.1rem', mb: 2 }}>
                Care Actions
              </Typography>
              <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
                {activities.map((activity) => {
                  const isPlayDisabled = activity.action === 'play' && selectedPet.stats.energy < 15;
                  return (
                    <Box key={activity.name} sx={{ textAlign: 'center' }}>
                      <ActionButton
                        disabled={isPlayDisabled}
                        onClick={() => !isPlayDisabled && handleAction(activity.action)}
                      >
                        <Box sx={{ color: isPlayDisabled ? '#666' : '#ec4899' }}>{activity.icon}</Box>
                      </ActionButton>
                      <Typography sx={{ color: '#e0e0e0', fontSize: '0.9rem', mt: 1 }}>{activity.name}</Typography>
                      <Typography sx={{ color: '#888888', fontSize: '0.7rem', maxWidth: '80px' }}>{activity.effect}</Typography>
                    </Box>
                  );
                })}
              </Box>

              {/* Last Action Result */}
              {lastAction && lastAction.pet.id === selectedPet.id && Object.keys(lastAction.statChanges).length > 0 && (
                <Fade in>
                  <Box sx={{ mt: 3, p: 2, background: 'rgba(236, 72, 153, 0.1)', borderRadius: '12px', textAlign: 'center' }}>
                    <Typography sx={{ color: '#e0e0e0', fontSize: '0.9rem' }}>
                      {Object.entries(lastAction.statChanges).map(([stat, change]) => (
                        <StatChangeIndicator key={stat} positive={change > 0} component="span" sx={{ mx: 1 }}>
                          {stat.charAt(0).toUpperCase() + stat.slice(1)}: {change > 0 ? '+' : ''}{change}
                        </StatChangeIndicator>
                      ))}
                    </Typography>
                  </Box>
                </Fade>
              )}
            </GothicCard>
          </Grid>
        )}

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Quick Navigation */}
          <GothicCard variant="glass" sx={{ mb: 3 }}>
            <Typography sx={{ color: '#ec4899', fontFamily: '"Cinzel", serif', fontSize: '1.2rem', mb: 2 }}>
              <ExternalLink size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Pet Care Hub
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <GothicButton
                variant="primary"
                onClick={() => navigate('/pet-care')}
                startIcon={<Heart size={18} />}
                sx={{ justifyContent: 'flex-start' }}
              >
                Open Full Pet Care Hub
              </GothicButton>
              <GothicButton
                variant="ghost"
                onClick={() => navigate('/companions')}
                startIcon={<Sparkles size={18} />}
                sx={{ justifyContent: 'flex-start' }}
              >
                Pet Companion System
              </GothicButton>
            </Box>
          </GothicCard>

          {/* Achievements */}
          <GothicCard variant="glass" sx={{ mb: 3 }}>
            <Typography sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif', fontSize: '1.2rem', mb: 2 }}>
              <Award size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Achievements
            </Typography>
            {achievements.map((achievement) => (
              <Box
                key={achievement.name}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 1.5,
                  mb: 1,
                  borderRadius: '8px',
                  background: achievement.earned ? 'rgba(212, 175, 55, 0.1)' : 'rgba(20, 20, 30, 0.5)',
                  opacity: achievement.earned ? 1 : 0.6,
                }}
              >
                <Star size={18} color={achievement.earned ? '#d4af37' : '#888888'} />
                <Box>
                  <Typography sx={{ color: '#e0e0e0', fontSize: '0.9rem' }}>{achievement.name}</Typography>
                  <Typography sx={{ color: '#888888', fontSize: '0.75rem' }}>{achievement.description}</Typography>
                </Box>
              </Box>
            ))}
          </GothicCard>

          {/* Pet Stats Summary */}
          {selectedPet && (
            <GothicCard variant="glass">
              <Typography sx={{ color: '#8b5cf6', fontFamily: '"Cinzel", serif', fontSize: '1.2rem', mb: 2 }}>
                <Star size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                {selectedPet.name}'s Summary
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1, background: 'rgba(139, 92, 246, 0.1)', borderRadius: '8px' }}>
                  <Typography sx={{ color: '#a0a0a0', fontSize: '0.85rem' }}>Current Mood</Typography>
                  <Typography sx={{ color: '#e0e0e0', fontSize: '0.85rem' }}>{selectedPet.mood} {getMoodEmoji(selectedPet.mood)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1, background: 'rgba(139, 92, 246, 0.1)', borderRadius: '8px' }}>
                  <Typography sx={{ color: '#a0a0a0', fontSize: '0.85rem' }}>Bond Level</Typography>
                  <Typography sx={{ color: '#ec4899', fontSize: '0.85rem' }}>{Math.round(selectedPet.stats.bond)}%</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1, background: 'rgba(139, 92, 246, 0.1)', borderRadius: '8px' }}>
                  <Typography sx={{ color: '#a0a0a0', fontSize: '0.85rem' }}>Overall Health</Typography>
                  <Typography sx={{
                    color: (selectedPet.stats.hunger + selectedPet.stats.energy + selectedPet.stats.happiness) / 3 > 60 ? '#10b981' : '#f97316',
                    fontSize: '0.85rem'
                  }}>
                    {Math.round((selectedPet.stats.hunger + selectedPet.stats.energy + selectedPet.stats.happiness) / 3)}%
                  </Typography>
                </Box>
              </Box>
            </GothicCard>
          )}
        </Grid>
      </Grid>

      {/* Adopt Dialog */}
      <Dialog
        open={adoptDialogOpen}
        onClose={() => setAdoptDialogOpen(false)}
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
            border: '1px solid rgba(236, 72, 153, 0.3)',
            borderRadius: '16px',
            minWidth: '400px',
          },
        }}
      >
        <DialogTitle sx={{ color: '#ec4899', fontFamily: '"Cinzel", serif' }}>
          <Plus size={24} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Adopt a New Companion
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#a0a0a0', mb: 2 }}>
            Choose a species and give your new friend a name!
          </Typography>

          <Typography sx={{ color: '#d4af37', fontSize: '0.9rem', mb: 1 }}>Select Species</Typography>
          <Grid container spacing={1} sx={{ mb: 3 }}>
            {AVAILABLE_SPECIES.map((species) => (
              <Grid item xs={6} key={species.species}>
                <Box
                  onClick={() => setSelectedSpecies(species)}
                  sx={{
                    p: 1.5,
                    borderRadius: '8px',
                    background: selectedSpecies.species === species.species ? 'rgba(236, 72, 153, 0.2)' : 'rgba(30, 30, 50, 0.5)',
                    border: selectedSpecies.species === species.species ? '2px solid #ec4899' : '1px solid rgba(100, 100, 120, 0.3)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: '#ec4899',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography sx={{ fontSize: '1.5rem' }}>{species.emoji}</Typography>
                    <Box>
                      <Typography sx={{ color: '#e0e0e0', fontSize: '0.8rem', fontWeight: 600 }}>{species.species}</Typography>
                      <Typography sx={{ color: '#888', fontSize: '0.65rem' }}>{species.description}</Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>

          <TextField
            fullWidth
            label="Pet Name"
            value={newPetName}
            onChange={(e) => setNewPetName(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#e0e0e0',
                '& fieldset': { borderColor: 'rgba(236, 72, 153, 0.3)' },
                '&:hover fieldset': { borderColor: '#ec4899' },
                '&.Mui-focused fieldset': { borderColor: '#ec4899' },
              },
              '& .MuiInputLabel-root': { color: '#888' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#ec4899' },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <GothicButton variant="ghost" onClick={() => setAdoptDialogOpen(false)}>
            Cancel
          </GothicButton>
          <GothicButton
            variant="primary"
            onClick={handleAdopt}
            disabled={!newPetName.trim()}
            startIcon={<Heart size={18} />}
          >
            Adopt {selectedSpecies.emoji}
          </GothicButton>
        </DialogActions>
      </Dialog>

      {/* Action Feedback Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.9), rgba(6, 95, 70, 0.9))',
            color: '#fff',
            '& .MuiAlert-icon': { color: '#fff' },
          }}
        >
          {lastAction?.message || 'Action completed!'}
        </Alert>
      </Snackbar>
    </RoomContainer>
  );
};

export default PetSanctuary;
