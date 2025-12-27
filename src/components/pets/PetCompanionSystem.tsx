// Pet Companion System
// Virtual pet companions with care, abilities, and customization
// Uses PetService for persistence and state management

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Box, Typography, Grid, Chip, LinearProgress, IconButton, Tooltip, Snackbar, Alert, Fade } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Heart, Star, Sparkles, Moon, Sun, Coffee, Utensils, Gamepad2,
  Music, Bed, Wand2, Shield, Bell, Gift, Crown, Zap,
  Cat, Bird, Ghost, Flame, Snowflake, Droplets, Wind, Scissors
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
  initializeDefaultPets,
  updateAllPetStats,
  getMoodEmoji,
  getStatColor,
  getTimeSince,
  PetActionResult,
} from '../../services/PetService';

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(-2deg); }
  50% { transform: translateY(-8px) rotate(2deg); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
`;

const sparkle = keyframes`
  0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
  50% { opacity: 1; transform: scale(1) rotate(180deg); }
`;

const celebrateBounce = keyframes`
  0%, 100% { transform: translateY(0); }
  25% { transform: translateY(-20px) rotate(-10deg); }
  50% { transform: translateY(0); }
  75% { transform: translateY(-15px) rotate(10deg); }
`;

const PetContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #0a0812 0%, #1a1028 50%, #0a0812 100%)',
  padding: '32px',
});

const HeaderSection = styled(Box)({
  textAlign: 'center',
  marginBottom: '32px',
});

const PetDisplay = styled(Box)({
  position: 'relative',
  width: '200px',
  height: '200px',
  margin: '0 auto 24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const PetAvatar = styled(Box)<{ petColor: string; isAnimating?: boolean }>(({ petColor, isAnimating }) => ({
  fontSize: '8rem',
  animation: isAnimating ? `${celebrateBounce} 0.6s ease-in-out` : `${float} 3s ease-in-out infinite`,
  filter: `drop-shadow(0 0 30px ${petColor})`,
  cursor: 'pointer',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.1)',
  },
}));

const StatusOrb = styled(Box)<{ orbColor: string }>(
  ({ orbColor }) => ({
    position: 'absolute',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: `${orbColor}30`,
    border: `2px solid ${orbColor}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    animation: `${pulse} 2s ease-in-out infinite`,
  })
);

const StatBar = styled(Box)({
  marginBottom: '16px',
});

const StatLabel = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '4px',
});

const StyledProgress = styled(LinearProgress)<{ barColor: string }>(({ barColor }) => ({
  height: '8px',
  borderRadius: '4px',
  backgroundColor: `${barColor}20`,
  '& .MuiLinearProgress-bar': {
    borderRadius: '4px',
    backgroundColor: barColor,
    transition: 'transform 0.5s ease',
  },
}));

const ActionButton = styled(GothicButton)<{ disabled?: boolean }>(({ disabled }) => ({
  flex: 1,
  minWidth: '80px',
  opacity: disabled ? 0.5 : 1,
  cursor: disabled ? 'not-allowed' : 'pointer',
}));

const AbilityCard = styled(Box)<{ active: boolean; abilityColor: string }>(({ active, abilityColor }) => ({
  padding: '16px',
  borderRadius: '12px',
  background: active ? `${abilityColor}20` : 'rgba(30, 30, 40, 0.6)',
  border: active ? `2px solid ${abilityColor}` : '1px solid rgba(100, 100, 120, 0.3)',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  textAlign: 'center',
  '&:hover': {
    transform: 'translateY(-2px)',
    borderColor: abilityColor,
  },
}));

const SparkleEffect = styled(Box)<{ delay: number }>(({ delay }) => ({
  position: 'absolute',
  width: '10px',
  height: '10px',
  animation: `${sparkle} 2s ease-in-out infinite`,
  animationDelay: `${delay}s`,
  '&::before': {
    content: '"✨"',
  },
}));

const StatChangeIndicator = styled(Typography)<{ positive: boolean }>(({ positive }) => ({
  color: positive ? '#10b981' : '#ef4444',
  fontSize: '0.85rem',
  fontWeight: 600,
  display: 'inline-block',
  marginLeft: '8px',
}));

// Pet types for visual customization
const petTypes = [
  {
    id: 'shadow-cat',
    name: 'Shadow Cat',
    emoji: '🐈‍⬛',
    element: 'shadow',
    color: '#8b5cf6',
    description: 'A mysterious feline that moves through shadows',
    abilities: ['Night Vision', 'Mood Boost', 'Stealth Mode'],
    personality: 'Independent, mysterious, protective',
  },
  {
    id: 'crystal-fox',
    name: 'Crystal Fox',
    emoji: '🦊',
    element: 'ice',
    color: '#60a5fa',
    description: 'A magical fox with crystalline fur',
    abilities: ['Clear Mind', 'Calm Aura', 'Frost Shield'],
    personality: 'Playful, loyal, curious',
  },
  {
    id: 'spirit-raven',
    name: 'Spirit Raven',
    emoji: '🐦‍⬛',
    element: 'spirit',
    color: '#a855f7',
    description: 'A wise raven from the spirit realm',
    abilities: ['Memory Keeper', 'Message Carrier', 'Prophecy'],
    personality: 'Wise, observant, communicative',
  },
  {
    id: 'ember-phoenix',
    name: 'Ember Phoenix',
    emoji: '🐦‍🔥',
    element: 'fire',
    color: '#f97316',
    description: 'A small phoenix born from eternal flames',
    abilities: ['Energy Boost', 'Rebirth', 'Flame Guard'],
    personality: 'Passionate, resilient, warm',
  },
  {
    id: 'moon-rabbit',
    name: 'Moon Rabbit',
    emoji: '🐰',
    element: 'lunar',
    color: '#c4b5fd',
    description: 'A celestial rabbit that follows the moon',
    abilities: ['Dream Guide', 'Sleep Aid', 'Lunar Blessing'],
    personality: 'Gentle, dreamy, nurturing',
  },
  {
    id: 'ghost-wolf',
    name: 'Ghost Wolf',
    emoji: '🐺',
    element: 'spirit',
    color: '#94a3b8',
    description: 'A spectral wolf that guards through the night',
    abilities: ['Protection', 'Pack Bond', 'Spirit Walk'],
    personality: 'Loyal, protective, fierce',
  },
  {
    id: 'storm-dragon',
    name: 'Storm Dragon',
    emoji: '🐉',
    element: 'storm',
    color: '#22d3ee',
    description: 'A tiny dragon that commands lightning',
    abilities: ['Storm Shield', 'Energy Surge', 'Thunder Call'],
    personality: 'Powerful, noble, ancient',
  },
  {
    id: 'garden-fairy',
    name: 'Garden Fairy',
    emoji: '🧚',
    element: 'nature',
    color: '#22c55e',
    description: 'A tiny fairy that tends to magical gardens',
    abilities: ['Healing Touch', 'Growth', 'Nature Bond'],
    personality: 'Cheerful, caring, whimsical',
  },
];

const accessories = [
  { id: 'crown', name: 'Royal Crown', emoji: '👑', color: '#d4af37' },
  { id: 'bow', name: 'Ribbon Bow', emoji: '🎀', color: '#ec4899' },
  { id: 'collar', name: 'Magic Collar', emoji: '📿', color: '#8b5cf6' },
  { id: 'wings', name: 'Spirit Wings', emoji: '🪽', color: '#60a5fa' },
  { id: 'scarf', name: 'Cozy Scarf', emoji: '🧣', color: '#f97316' },
  { id: 'hat', name: 'Witch Hat', emoji: '🎃', color: '#10b981' },
];

export interface PetState {
  id: string;
  name: string;
  type: string;
  level: number;
  experience: number;
  hunger: number;
  happiness: number;
  energy: number;
  health: number;
  mood: string;
  accessories: string[];
  abilities: { id: string; unlocked: boolean; active: boolean }[];
  lastFed: Date;
  lastPlayed: Date;
  lastSlept: Date;
  totalBondTime: number;
}

export const PetCompanionSystem: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [selectedPetType, setSelectedPetType] = useState(petTypes[0]);
  const [showSparkles, setShowSparkles] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [lastAction, setLastAction] = useState<PetActionResult | null>(null);
  const [equippedAccessories, setEquippedAccessories] = useState<string[]>(['collar']);
  const [abilities, setAbilities] = useState([
    { id: 'night-vision', unlocked: true, active: true },
    { id: 'mood-boost', unlocked: true, active: false },
    { id: 'stealth-mode', unlocked: false, active: false },
  ]);

  // Initialize pets on mount
  useEffect(() => {
    const loadedPets = initializeDefaultPets();
    setPets(loadedPets);
    if (loadedPets.length > 0) {
      setSelectedPet(loadedPets[0]);
      // Find matching pet type for visuals
      const matchingType = petTypes.find(pt =>
        pt.name.toLowerCase() === loadedPets[0].species.toLowerCase() ||
        pt.emoji === loadedPets[0].emoji
      );
      if (matchingType) {
        setSelectedPetType(matchingType);
      }
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
    }, 60000);

    return () => clearInterval(interval);
  }, [selectedPet]);

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
      case 'pet':
        // Petting is like a light groom
        result = groomPet(selectedPet.id);
        break;
    }

    if (result) {
      setShowSparkles(true);
      setIsAnimating(true);
      setLastAction(result);
      setSnackbarOpen(true);

      const updatedPets = getPets();
      setPets(updatedPets);
      setSelectedPet(result.pet);

      setTimeout(() => {
        setShowSparkles(false);
        setIsAnimating(false);
      }, 1000);
    }
  }, [selectedPet]);

  const handlePetTypeSelect = useCallback((petType: typeof petTypes[0]) => {
    setSelectedPetType(petType);
    // Find or create a pet of this type
    const matchingPet = pets.find(p =>
      p.species.toLowerCase() === petType.name.toLowerCase() ||
      p.emoji === petType.emoji
    );
    if (matchingPet) {
      const updatedPets = updateAllPetStats();
      const freshPet = updatedPets.find(p => p.id === matchingPet.id);
      if (freshPet) {
        setSelectedPet(freshPet);
        setPets(updatedPets);
      }
    }
  }, [pets]);

  const toggleAccessory = (accId: string) => {
    setEquippedAccessories(prev =>
      prev.includes(accId)
        ? prev.filter(id => id !== accId)
        : [...prev, accId]
    );
  };

  // Calculate experience and level from bond
  const level = selectedPet ? Math.floor(selectedPet.stats.bond / 10) + 1 : 1;
  const experience = selectedPet ? selectedPet.stats.bond * 50 : 0;
  const experienceToNextLevel = level * 500;
  const experienceProgress = (experience % experienceToNextLevel) / experienceToNextLevel * 100;

  const currentMood = selectedPet?.mood || 'Content';
  const moodEmoji = getMoodEmoji(currentMood);

  return (
    <PetContainer>
      <HeaderSection>
        <Typography
          sx={{
            fontFamily: '"Cinzel", serif',
            fontSize: '2.5rem',
            fontWeight: 700,
            color: selectedPetType.color,
            letterSpacing: '0.1em',
            textShadow: `0 0 30px ${selectedPetType.color}40`,
            mb: 1,
          }}
        >
          <Cat size={36} style={{ marginRight: '12px', verticalAlign: 'middle' }} />
          Pet Companions
        </Typography>
        <Typography sx={{ color: '#9080a0', fontStyle: 'italic' }}>
          Magical companions to journey with you
        </Typography>
      </HeaderSection>

      <Grid container spacing={4}>
        {/* Main Pet Display */}
        <Grid item xs={12} md={6}>
          <GothicCard variant="elevated" ornate sx={{ textAlign: 'center' }}>
            <PetDisplay>
              <PetAvatar
                petColor={selectedPetType.color}
                isAnimating={isAnimating}
                onClick={() => handleAction('pet')}
              >
                {selectedPet?.emoji || selectedPetType.emoji}
              </PetAvatar>

              {/* Status Orbs */}
              <StatusOrb orbColor="#ef4444" sx={{ top: '10px', left: '10px' }}>
                <Heart size={18} color="#ef4444" />
              </StatusOrb>
              <StatusOrb orbColor="#f59e0b" sx={{ top: '10px', right: '10px' }}>
                <Zap size={18} color="#f59e0b" />
              </StatusOrb>
              <StatusOrb orbColor="#10b981" sx={{ bottom: '10px', left: '10px' }}>
                <Utensils size={18} color="#10b981" />
              </StatusOrb>
              <StatusOrb orbColor="#ec4899" sx={{ bottom: '10px', right: '10px' }}>
                <Heart size={18} color="#ec4899" fill="#ec4899" />
              </StatusOrb>

              {/* Sparkle Effects */}
              {showSparkles && (
                <>
                  <SparkleEffect delay={0} sx={{ top: '20%', left: '20%' }} />
                  <SparkleEffect delay={0.2} sx={{ top: '30%', right: '25%' }} />
                  <SparkleEffect delay={0.4} sx={{ bottom: '25%', left: '30%' }} />
                  <SparkleEffect delay={0.6} sx={{ bottom: '35%', right: '20%' }} />
                </>
              )}
            </PetDisplay>

            {/* Pet Name & Level */}
            <Typography sx={{ color: '#e0e0e0', fontSize: '1.5rem', fontWeight: 600, mb: 0.5 }}>
              {selectedPet?.name || 'Your Pet'}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}>
              <Chip
                icon={<Star size={14} />}
                label={`Level ${level}`}
                sx={{ background: `${selectedPetType.color}30`, color: selectedPetType.color }}
              />
              <Chip
                label={selectedPet?.species || selectedPetType.name}
                sx={{ background: 'rgba(212, 175, 55, 0.2)', color: '#d4af37' }}
              />
            </Box>

            {/* Experience Bar */}
            <Box sx={{ mb: 3, px: 2 }}>
              <StatLabel>
                <Typography sx={{ color: '#888888', fontSize: '0.85rem' }}>Experience</Typography>
                <Typography sx={{ color: selectedPetType.color, fontSize: '0.85rem' }}>
                  {experience % experienceToNextLevel} / {experienceToNextLevel}
                </Typography>
              </StatLabel>
              <StyledProgress variant="determinate" value={experienceProgress} barColor={selectedPetType.color} />
            </Box>

            {/* Mood Display */}
            <Box sx={{ mb: 3, p: 2, background: 'rgba(139, 92, 246, 0.1)', borderRadius: '12px' }}>
              <Typography sx={{ color: '#a78bfa', fontSize: '0.9rem', mb: 1 }}>Current Mood</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ fontSize: '2rem' }}>{moodEmoji}</Typography>
                <Box>
                  <Typography sx={{ color: '#e0e0e0', textTransform: 'capitalize' }}>{currentMood}</Typography>
                  <Typography sx={{ color: '#888888', fontSize: '0.8rem' }}>
                    {currentMood === 'Happy' && '+10% Energy Regen'}
                    {currentMood === 'Tired' && 'Needs Rest'}
                    {currentMood === 'Hungry' && 'Needs Food'}
                    {currentMood === 'Loving' && 'Bond Strength +15%'}
                    {currentMood === 'Content' && 'Balanced Stats'}
                    {currentMood === 'Ecstatic' && 'Maximum Joy!'}
                    {currentMood === 'Sad' && 'Needs Attention'}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
              <ActionButton
                variant="ghost"
                startIcon={<Utensils size={16} />}
                onClick={() => handleAction('feed')}
              >
                Feed
              </ActionButton>
              <ActionButton
                variant="ghost"
                startIcon={<Gamepad2 size={16} />}
                onClick={() => handleAction('play')}
                disabled={selectedPet && selectedPet.stats.energy < 15}
              >
                Play
              </ActionButton>
              <ActionButton
                variant="ghost"
                startIcon={<Bed size={16} />}
                onClick={() => handleAction('rest')}
              >
                Rest
              </ActionButton>
              <ActionButton
                variant="ghost"
                startIcon={<Scissors size={16} />}
                onClick={() => handleAction('groom')}
              >
                Groom
              </ActionButton>
              <ActionButton
                variant="primary"
                startIcon={<Heart size={16} />}
                onClick={() => handleAction('pet')}
              >
                Pet
              </ActionButton>
            </Box>

            {/* Last Action Feedback */}
            {lastAction && Object.keys(lastAction.statChanges).length > 0 && (
              <Fade in>
                <Box sx={{ mt: 2, p: 1.5, background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px' }}>
                  <Typography sx={{ color: '#e0e0e0', fontSize: '0.85rem' }}>
                    {Object.entries(lastAction.statChanges).map(([stat, change]) => (
                      <StatChangeIndicator key={stat} positive={change > 0}>
                        {stat}: {change > 0 ? '+' : ''}{change}
                      </StatChangeIndicator>
                    ))}
                  </Typography>
                </Box>
              </Fade>
            )}
          </GothicCard>
        </Grid>

        {/* Stats & Abilities */}
        <Grid item xs={12} md={6}>
          {/* Stats Card */}
          <GothicCard variant="glass" sx={{ mb: 3 }}>
            <Typography sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif', fontSize: '1.2rem', mb: 3 }}>
              <Heart size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Pet Stats
            </Typography>

            {selectedPet && (
              <>
                <StatBar>
                  <StatLabel>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Utensils size={16} color={getStatColor('hunger', selectedPet.stats.hunger)} />
                      <Typography sx={{ color: '#e0e0e0', fontSize: '0.9rem' }}>Hunger</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography sx={{ color: getStatColor('hunger', selectedPet.stats.hunger) }}>
                        {Math.round(selectedPet.stats.hunger)}%
                      </Typography>
                      <Typography sx={{ color: '#666', fontSize: '0.7rem' }}>
                        ({getTimeSince(selectedPet.lastFed)})
                      </Typography>
                    </Box>
                  </StatLabel>
                  <StyledProgress
                    variant="determinate"
                    value={selectedPet.stats.hunger}
                    barColor={getStatColor('hunger', selectedPet.stats.hunger)}
                  />
                </StatBar>

                <StatBar>
                  <StatLabel>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Zap size={16} color={getStatColor('energy', selectedPet.stats.energy)} />
                      <Typography sx={{ color: '#e0e0e0', fontSize: '0.9rem' }}>Energy</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography sx={{ color: getStatColor('energy', selectedPet.stats.energy) }}>
                        {Math.round(selectedPet.stats.energy)}%
                      </Typography>
                      <Typography sx={{ color: '#666', fontSize: '0.7rem' }}>
                        ({getTimeSince(selectedPet.lastRested)})
                      </Typography>
                    </Box>
                  </StatLabel>
                  <StyledProgress
                    variant="determinate"
                    value={selectedPet.stats.energy}
                    barColor={getStatColor('energy', selectedPet.stats.energy)}
                  />
                </StatBar>

                <StatBar>
                  <StatLabel>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Sparkles size={16} color={getStatColor('happiness', selectedPet.stats.happiness)} />
                      <Typography sx={{ color: '#e0e0e0', fontSize: '0.9rem' }}>Happiness</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography sx={{ color: getStatColor('happiness', selectedPet.stats.happiness) }}>
                        {Math.round(selectedPet.stats.happiness)}%
                      </Typography>
                      <Typography sx={{ color: '#666', fontSize: '0.7rem' }}>
                        ({getTimeSince(selectedPet.lastPlayed)})
                      </Typography>
                    </Box>
                  </StatLabel>
                  <StyledProgress
                    variant="determinate"
                    value={selectedPet.stats.happiness}
                    barColor={getStatColor('happiness', selectedPet.stats.happiness)}
                  />
                </StatBar>

                <StatBar>
                  <StatLabel>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Heart size={16} color={getStatColor('bond', selectedPet.stats.bond)} fill={getStatColor('bond', selectedPet.stats.bond)} />
                      <Typography sx={{ color: '#e0e0e0', fontSize: '0.9rem' }}>Bond</Typography>
                    </Box>
                    <Typography sx={{ color: getStatColor('bond', selectedPet.stats.bond) }}>
                      {Math.round(selectedPet.stats.bond)}%
                    </Typography>
                  </StatLabel>
                  <StyledProgress
                    variant="determinate"
                    value={selectedPet.stats.bond}
                    barColor={getStatColor('bond', selectedPet.stats.bond)}
                  />
                </StatBar>
              </>
            )}
          </GothicCard>

          {/* Abilities Card */}
          <GothicCard variant="glass" sx={{ mb: 3 }}>
            <Typography sx={{ color: '#a855f7', fontFamily: '"Cinzel", serif', fontSize: '1.2rem', mb: 3 }}>
              <Wand2 size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Abilities
            </Typography>
            <Grid container spacing={2}>
              {selectedPetType.abilities.map((ability, index) => {
                const isUnlocked = abilities[index]?.unlocked || false;
                const isActive = abilities[index]?.active || false;
                return (
                  <Grid item xs={4} key={ability}>
                    <AbilityCard active={isActive} abilityColor={selectedPetType.color}>
                      <Typography sx={{ fontSize: '1.5rem', mb: 1, opacity: isUnlocked ? 1 : 0.3 }}>
                        {isUnlocked ? '✨' : '🔒'}
                      </Typography>
                      <Typography sx={{ color: isUnlocked ? '#e0e0e0' : '#666666', fontSize: '0.8rem' }}>
                        {ability}
                      </Typography>
                    </AbilityCard>
                  </Grid>
                );
              })}
            </Grid>
          </GothicCard>

          {/* Accessories */}
          <GothicCard variant="glass">
            <Typography sx={{ color: '#f97316', fontFamily: '"Cinzel", serif', fontSize: '1.2rem', mb: 3 }}>
              <Crown size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Accessories
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
              {accessories.map((acc) => {
                const isEquipped = equippedAccessories.includes(acc.id);
                return (
                  <Tooltip key={acc.id} title={acc.name}>
                    <Box
                      onClick={() => toggleAccessory(acc.id)}
                      sx={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '12px',
                        background: isEquipped ? `${acc.color}30` : 'rgba(30, 30, 40, 0.6)',
                        border: isEquipped ? `2px solid ${acc.color}` : '1px solid rgba(100, 100, 120, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.1)',
                          borderColor: acc.color,
                        },
                      }}
                    >
                      {acc.emoji}
                    </Box>
                  </Tooltip>
                );
              })}
            </Box>
          </GothicCard>
        </Grid>

        {/* Pet Selection */}
        <Grid item xs={12}>
          <GothicCard variant="elevated" ornate>
            <Typography sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif', fontSize: '1.3rem', mb: 3, textAlign: 'center' }}>
              <Sparkles size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Choose Your Companion
            </Typography>
            <Grid container spacing={2}>
              {petTypes.map((pet) => (
                <Grid item xs={6} sm={4} md={3} key={pet.id}>
                  <Box
                    onClick={() => handlePetTypeSelect(pet)}
                    sx={{
                      p: 2,
                      borderRadius: '12px',
                      background: selectedPetType.id === pet.id ? `${pet.color}20` : 'rgba(30, 30, 40, 0.6)',
                      border: selectedPetType.id === pet.id ? `2px solid ${pet.color}` : '1px solid rgba(100, 100, 120, 0.3)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      textAlign: 'center',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        borderColor: pet.color,
                      },
                    }}
                  >
                    <Typography sx={{ fontSize: '3rem', mb: 1 }}>{pet.emoji}</Typography>
                    <Typography sx={{ color: selectedPetType.id === pet.id ? pet.color : '#e0e0e0', fontWeight: 600 }}>
                      {pet.name}
                    </Typography>
                    <Typography sx={{ color: '#888888', fontSize: '0.75rem' }}>{pet.element}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </GothicCard>
        </Grid>
      </Grid>

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
    </PetContainer>
  );
};

export default PetCompanionSystem;
