import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  TextField,
  InputAdornment,
  Avatar,
  IconButton,
  Tooltip,
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Grid,
  Fade,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Search,
  Heart,
  User,
  Brain,
  Palette,
  Users,
  Sparkles,
  Settings,
  MessageCircle,
  X,
  Shuffle,
  Star,
  Zap,
} from 'lucide-react';
import charactersData from '../../data/ai_characters.json';

// Types
interface AICharacter {
  id: string;
  name: string;
  avatar: string;
  category: 'companion' | 'romantic' | 'mentor' | 'creative' | 'friend' | 'spiritual' | 'assistant' | 'therapeutic' | 'ancestor' | 'historical' | 'custom';
  traits: string[];
  backstory: string;
  speakingStyle: string;
  interests: string[];
  relationship: string;
  scenarioContexts: string[];
  defaultModel: string;
  voiceId: string;
  mood: 'calm' | 'playful' | 'focus' | 'curiosity' | 'victory' | 'grief';
  familyConnection?: string;
}

// Animations
const digitalPulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(8, 145, 178, 0.4), 0 0 40px rgba(6, 182, 212, 0.2);
    text-shadow: 0 0 10px rgba(8, 145, 178, 0.5);
  }
  50% {
    box-shadow: 0 0 40px rgba(6, 182, 212, 0.6), 0 0 80px rgba(59, 130, 246, 0.4);
    text-shadow: 0 0 20px rgba(6, 182, 212, 0.8), 0 0 30px rgba(59, 130, 246, 0.5);
  }
`;

const glowPulse = keyframes`
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
`;

const holographicShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
`;

const scanline = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
`;

// Styled Components
const GalleryContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #0a0812 0%, #1a1028 50%, #0a0812 100%)',
  padding: '24px',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'repeating-linear-gradient(0deg, rgba(8, 145, 178, 0.03) 0px, transparent 1px, transparent 2px, rgba(8, 145, 178, 0.03) 3px)',
    pointerEvents: 'none',
    animation: `${scanline} 8s linear infinite`,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)',
    pointerEvents: 'none',
  },
});

const HeaderBox = styled(Box)({
  textAlign: 'center',
  marginBottom: '32px',
  position: 'relative',
  zIndex: 1,
  animation: `${digitalPulse} 3s ease-in-out infinite`,
});

const CyberTitle = styled(Typography)({
  fontFamily: '"Orbitron", "Rajdhani", "Exo 2", monospace',
  fontSize: '3rem',
  fontWeight: 900,
  background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 50%, #3b82f6 100%)',
  backgroundSize: '200% 200%',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
  animation: `${holographicShift} 5s ease infinite`,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  marginBottom: '8px',
});

const SubtitleText = styled(Typography)({
  color: '#06b6d4',
  fontSize: '1.1rem',
  fontFamily: '"Rajdhani", sans-serif',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
});

const SearchField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    background: 'rgba(8, 145, 178, 0.1)',
    borderRadius: '12px',
    color: '#06b6d4',
    fontFamily: '"Rajdhani", sans-serif',
    border: '1px solid rgba(6, 182, 212, 0.3)',
    transition: 'all 0.3s ease',
    '& fieldset': {
      borderColor: 'rgba(6, 182, 212, 0.3)',
    },
    '&:hover': {
      borderColor: '#06b6d4',
      boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: '#06b6d4',
    },
    '&.Mui-focused': {
      borderColor: '#3b82f6',
      boxShadow: '0 0 30px rgba(59, 130, 246, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#3b82f6',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#06b6d4',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#3b82f6',
  },
});

const FilterChip = styled(Chip)<{ selected?: boolean }>(({ selected }) => ({
  background: selected
    ? 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)'
    : 'rgba(8, 145, 178, 0.2)',
  color: selected ? '#fff' : '#06b6d4',
  border: `1px solid ${selected ? '#3b82f6' : 'rgba(6, 182, 212, 0.3)'}`,
  cursor: 'pointer',
  fontFamily: '"Rajdhani", sans-serif',
  fontWeight: 600,
  fontSize: '0.9rem',
  transition: 'all 0.3s ease',
  boxShadow: selected ? '0 0 20px rgba(6, 182, 212, 0.5)' : 'none',
  '&:hover': {
    background: selected
      ? 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)'
      : 'rgba(6, 182, 212, 0.3)',
    borderColor: '#06b6d4',
    boxShadow: '0 0 15px rgba(6, 182, 212, 0.4)',
  },
}));

const CharacterCard = styled(Card)<{ active?: boolean }>(({ active }) => ({
  background: active
    ? 'linear-gradient(135deg, rgba(8, 145, 178, 0.3) 0%, rgba(59, 130, 246, 0.2) 100%)'
    : 'linear-gradient(135deg, rgba(10, 8, 18, 0.9) 0%, rgba(26, 16, 40, 0.8) 100%)',
  backdropFilter: 'blur(10px)',
  border: active ? '2px solid #3b82f6' : '1px solid rgba(6, 182, 212, 0.3)',
  borderRadius: '16px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.2), transparent)',
    transition: 'left 0.5s ease',
  },
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    borderColor: '#06b6d4',
    boxShadow: '0 12px 40px rgba(6, 182, 212, 0.4), 0 0 30px rgba(59, 130, 246, 0.3)',
    '&::before': {
      left: '100%',
    },
  },
  animation: active ? `${digitalPulse} 2s infinite` : 'none',
}));

const CharacterAvatar = styled(Avatar)<{ mood?: string }>(({ mood }) => {
  const moodColors: Record<string, string> = {
    calm: '#22c55e',
    playful: '#f59e0b',
    focus: '#3b82f6',
    curiosity: '#ec4899',
    victory: '#eab308',
    grief: '#6366f1',
  };

  const color = moodColors[mood || 'calm'] || '#06b6d4';

  return {
    width: 80,
    height: 80,
    border: `3px solid ${color}`,
    boxShadow: `0 0 25px ${color}80, inset 0 0 20px ${color}40`,
    animation: `${floatAnimation} 3s ease-in-out infinite`,
    background: `linear-gradient(135deg, rgba(8, 145, 178, 0.2) 0%, rgba(6, 182, 212, 0.1) 100%)`,
  };
});

const CategoryBadge = styled(Chip)({
  background: 'linear-gradient(135deg, rgba(8, 145, 178, 0.3) 0%, rgba(6, 182, 212, 0.2) 100%)',
  border: '1px solid rgba(6, 182, 212, 0.4)',
  color: '#06b6d4',
  fontSize: '0.75rem',
  fontWeight: 700,
  fontFamily: '"Rajdhani", sans-serif',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
});

const TraitChip = styled(Chip)({
  background: 'rgba(59, 130, 246, 0.2)',
  border: '1px solid rgba(59, 130, 246, 0.3)',
  color: '#3b82f6',
  fontSize: '0.7rem',
  height: '24px',
  fontFamily: '"Rajdhani", sans-serif',
  '&:hover': {
    background: 'rgba(59, 130, 246, 0.3)',
  },
});

const MoodIndicator = styled(Box)<{ mood?: string }>(({ mood }) => {
  const moodColors: Record<string, string> = {
    calm: '#22c55e',
    playful: '#f59e0b',
    focus: '#3b82f6',
    curiosity: '#ec4899',
    victory: '#eab308',
    grief: '#6366f1',
  };

  const color = moodColors[mood || 'calm'] || '#06b6d4';

  return {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: color,
    boxShadow: `0 0 10px ${color}`,
    animation: `${glowPulse} 2s ease-in-out infinite`,
  };
});

const DetailDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    background: 'linear-gradient(135deg, #0a0812 0%, #1a1028 100%)',
    border: '2px solid rgba(6, 182, 212, 0.4)',
    borderRadius: '20px',
    minWidth: '600px',
    maxWidth: '800px',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '2px',
      background: 'linear-gradient(90deg, transparent, #06b6d4, #3b82f6, transparent)',
      animation: `${holographicShift} 3s ease infinite`,
    },
  },
});

const HolographicButton = styled(Button)({
  background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 50%, #3b82f6 100%)',
  backgroundSize: '200% 200%',
  color: '#fff',
  fontFamily: '"Rajdhani", sans-serif',
  fontWeight: 700,
  fontSize: '1rem',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  padding: '12px 32px',
  borderRadius: '8px',
  border: '1px solid rgba(59, 130, 246, 0.5)',
  boxShadow: '0 0 20px rgba(6, 182, 212, 0.5)',
  animation: `${holographicShift} 3s ease infinite`,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 0 40px rgba(6, 182, 212, 0.8), 0 0 20px rgba(59, 130, 246, 0.6)',
  },
});

// Category Icons Map
const categoryIcons: Record<string, React.ElementType> = {
  companion: User,
  romantic: Heart,
  mentor: Brain,
  creative: Palette,
  friend: Users,
  spiritual: Sparkles,
  assistant: Settings,
  therapeutic: MessageCircle,
  historical: Star,
  ancestor: Star,
  custom: Settings,
};

// Categories with colors
const categories = [
  { id: 'all', name: 'All', color: '#06b6d4' },
  { id: 'companion', name: 'Companion', color: '#0891b2' },
  { id: 'romantic', name: 'Romantic', color: '#ec4899' },
  { id: 'mentor', name: 'Mentor', color: '#3b82f6' },
  { id: 'creative', name: 'Creative', color: '#a855f7' },
  { id: 'friend', name: 'Friend', color: '#22c55e' },
  { id: 'spiritual', name: 'Spiritual', color: '#8b5cf6' },
  { id: 'assistant', name: 'Assistant', color: '#06b6d4' },
  { id: 'therapeutic', name: 'Therapeutic', color: '#6366f1' },
];

// Main Component
const AICharacterGallery: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCharacter, setSelectedCharacter] = useState<AICharacter | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [activeCharacters, setActiveCharacters] = useState<Set<string>>(new Set());

  const characters: AICharacter[] = charactersData.characters;

  // Filtered characters with useMemo
  const filteredCharacters = useMemo(() => {
    return characters.filter(char => {
      const matchesSearch =
        char.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        char.traits.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        char.backstory.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || char.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [characters, searchQuery, selectedCategory]);

  // Toggle favorite with useCallback
  const toggleFavorite = useCallback((id: string) => {
    setFavorites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  // Toggle active with useCallback
  const toggleActive = useCallback((id: string) => {
    setActiveCharacters(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  // Open character details
  const openCharacterDetails = useCallback((character: AICharacter) => {
    setSelectedCharacter(character);
    setDialogOpen(true);
  }, []);

  // Get random character
  const getRandomCharacter = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * filteredCharacters.length);
    const randomChar = filteredCharacters[randomIndex];
    if (randomChar) {
      openCharacterDetails(randomChar);
    }
  }, [filteredCharacters, openCharacterDetails]);

  // Get category icon
  const getCategoryIcon = (category: string) => {
    const IconComponent = categoryIcons[category] || User;
    return <IconComponent size={16} />;
  };

  return (
    <GalleryContainer>
      {/* Header */}
      <HeaderBox>
        <CyberTitle variant="h2">
          AI CHARACTER GALLERY
        </CyberTitle>
        <SubtitleText>
          Neural Network Persona Database
        </SubtitleText>
      </HeaderBox>

      {/* Search & Random */}
      <Box sx={{ maxWidth: '800px', margin: '0 auto 32px', position: 'relative', zIndex: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={9}>
            <SearchField
              fullWidth
              placeholder="Search characters, traits, backstory..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={20} style={{ color: '#06b6d4' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <HolographicButton
              fullWidth
              onClick={getRandomCharacter}
              startIcon={<Shuffle size={20} />}
              sx={{ height: '100%' }}
            >
              Random
            </HolographicButton>
          </Grid>
        </Grid>
      </Box>

      {/* Category Filters */}
      <Box sx={{
        display: 'flex',
        gap: 1.5,
        flexWrap: 'wrap',
        justifyContent: 'center',
        mb: 4,
        position: 'relative',
        zIndex: 1,
      }}>
        {categories.map(cat => (
          <FilterChip
            key={cat.id}
            label={cat.name}
            selected={selectedCategory === cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            icon={getCategoryIcon(cat.id)}
          />
        ))}
      </Box>

      {/* Characters Grid */}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={3}>
          {filteredCharacters.map(character => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={character.id}>
              <Fade in timeout={500}>
                <CharacterCard
                  active={activeCharacters.has(character.id)}
                  onClick={() => openCharacterDetails(character)}
                >
                  <CardContent>
                    {/* Avatar & Actions */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <CharacterAvatar mood={character.mood}>
                        {character.name.charAt(0)}
                      </CharacterAvatar>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title={favorites.has(character.id) ? 'Unfavorite' : 'Favorite'}>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(character.id);
                            }}
                            sx={{
                              color: favorites.has(character.id) ? '#ec4899' : '#06b6d4',
                              '&:hover': {
                                background: 'rgba(236, 72, 153, 0.2)',
                              },
                            }}
                          >
                            <Heart size={18} fill={favorites.has(character.id) ? '#ec4899' : 'none'} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={activeCharacters.has(character.id) ? 'Deactivate' : 'Activate'}>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleActive(character.id);
                            }}
                            sx={{
                              color: activeCharacters.has(character.id) ? '#3b82f6' : '#06b6d4',
                              '&:hover': {
                                background: 'rgba(59, 130, 246, 0.2)',
                              },
                            }}
                          >
                            <Zap size={18} fill={activeCharacters.has(character.id) ? '#3b82f6' : 'none'} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>

                    {/* Name & Category */}
                    <Typography
                      variant="h6"
                      sx={{
                        color: '#06b6d4',
                        fontFamily: '"Rajdhani", sans-serif',
                        fontWeight: 700,
                        mb: 1,
                        fontSize: '1.1rem',
                      }}
                    >
                      {character.name}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <CategoryBadge
                        label={character.category}
                        icon={getCategoryIcon(character.category)}
                        size="small"
                      />
                      <MoodIndicator mood={character.mood} />
                    </Box>

                    {/* Traits */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                      {character.traits.slice(0, 3).map((trait, idx) => (
                        <TraitChip key={idx} label={trait} size="small" />
                      ))}
                      {character.traits.length > 3 && (
                        <TraitChip label={`+${character.traits.length - 3}`} size="small" />
                      )}
                    </Box>

                    {/* Backstory Preview */}
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#94a3b8',
                        fontSize: '0.85rem',
                        lineHeight: 1.4,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {character.backstory}
                    </Typography>
                  </CardContent>
                </CharacterCard>
              </Fade>
            </Grid>
          ))}
        </Grid>

        {/* Empty State */}
        {filteredCharacters.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography sx={{ color: '#06b6d4', fontSize: '1.2rem', fontFamily: '"Rajdhani", sans-serif' }}>
              No characters found matching your criteria
            </Typography>
          </Box>
        )}
      </Box>

      {/* Character Detail Dialog */}
      <DetailDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedCharacter && (
          <>
            <DialogTitle sx={{ position: 'relative' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CharacterAvatar mood={selectedCharacter.mood}>
                    {selectedCharacter.name.charAt(0)}
                  </CharacterAvatar>
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{
                        color: '#06b6d4',
                        fontFamily: '"Rajdhani", sans-serif',
                        fontWeight: 700,
                      }}
                    >
                      {selectedCharacter.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      <CategoryBadge
                        label={selectedCharacter.category}
                        icon={getCategoryIcon(selectedCharacter.category)}
                        size="small"
                      />
                      <MoodIndicator mood={selectedCharacter.mood} />
                      <Typography sx={{ color: '#64748b', fontSize: '0.85rem', ml: 0.5 }}>
                        {selectedCharacter.mood}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <IconButton onClick={() => setDialogOpen(false)} sx={{ color: '#06b6d4' }}>
                  <X size={24} />
                </IconButton>
              </Box>
            </DialogTitle>

            <DialogContent sx={{ pt: 3 }}>
              {/* Traits */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: '#3b82f6',
                    fontFamily: '"Rajdhani", sans-serif',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    mb: 1,
                  }}
                >
                  Traits
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                  {selectedCharacter.traits.map((trait, idx) => (
                    <TraitChip key={idx} label={trait} />
                  ))}
                </Box>
              </Box>

              {/* Backstory */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: '#3b82f6',
                    fontFamily: '"Rajdhani", sans-serif',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    mb: 1,
                  }}
                >
                  Backstory
                </Typography>
                <Typography sx={{ color: '#cbd5e1', lineHeight: 1.6 }}>
                  {selectedCharacter.backstory}
                </Typography>
              </Box>

              {/* Speaking Style */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: '#3b82f6',
                    fontFamily: '"Rajdhani", sans-serif',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    mb: 1,
                  }}
                >
                  Speaking Style
                </Typography>
                <Typography sx={{ color: '#cbd5e1', fontStyle: 'italic' }}>
                  {selectedCharacter.speakingStyle}
                </Typography>
              </Box>

              {/* Interests */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: '#3b82f6',
                    fontFamily: '"Rajdhani", sans-serif',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    mb: 1,
                  }}
                >
                  Interests
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                  {selectedCharacter.interests.map((interest, idx) => (
                    <Chip
                      key={idx}
                      label={interest}
                      size="small"
                      sx={{
                        background: 'rgba(8, 145, 178, 0.2)',
                        border: '1px solid rgba(6, 182, 212, 0.3)',
                        color: '#06b6d4',
                        fontSize: '0.75rem',
                      }}
                    />
                  ))}
                </Box>
              </Box>

              {/* Relationship */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: '#3b82f6',
                    fontFamily: '"Rajdhani", sans-serif',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    mb: 1,
                  }}
                >
                  Relationship
                </Typography>
                <Typography sx={{ color: '#cbd5e1' }}>
                  {selectedCharacter.relationship}
                </Typography>
              </Box>

              {/* Scenario Contexts */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: '#3b82f6',
                    fontFamily: '"Rajdhani", sans-serif',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    mb: 1,
                  }}
                >
                  Scenario Contexts
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  {selectedCharacter.scenarioContexts.map((context, idx) => (
                    <Typography
                      key={idx}
                      sx={{
                        color: '#94a3b8',
                        fontSize: '0.9rem',
                        '&::before': {
                          content: '"▸ "',
                          color: '#06b6d4',
                          marginRight: '8px',
                        },
                      }}
                    >
                      {context}
                    </Typography>
                  ))}
                </Box>
              </Box>

              {/* Technical Details */}
              <Box sx={{
                background: 'rgba(8, 145, 178, 0.1)',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                borderRadius: '12px',
                p: 2,
              }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: '#3b82f6',
                    fontFamily: '"Rajdhani", sans-serif',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    mb: 1.5,
                  }}
                >
                  Technical Specifications
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography sx={{ color: '#64748b', fontSize: '0.85rem' }}>
                      Default Model
                    </Typography>
                    <Typography sx={{ color: '#06b6d4', fontWeight: 600 }}>
                      {selectedCharacter.defaultModel}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography sx={{ color: '#64748b', fontSize: '0.85rem' }}>
                      Voice ID
                    </Typography>
                    <Typography sx={{ color: '#06b6d4', fontWeight: 600 }}>
                      {selectedCharacter.voiceId}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                <HolographicButton
                  fullWidth
                  onClick={() => toggleActive(selectedCharacter.id)}
                  startIcon={<Zap size={20} />}
                >
                  {activeCharacters.has(selectedCharacter.id) ? 'Deactivate' : 'Activate'}
                </HolographicButton>
                <HolographicButton
                  fullWidth
                  onClick={() => toggleFavorite(selectedCharacter.id)}
                  startIcon={<Heart size={20} />}
                  sx={{
                    background: favorites.has(selectedCharacter.id)
                      ? 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)'
                      : 'linear-gradient(135deg, #0891b2 0%, #06b6d4 50%, #3b82f6 100%)',
                  }}
                >
                  {favorites.has(selectedCharacter.id) ? 'Unfavorite' : 'Favorite'}
                </HolographicButton>
              </Box>
            </DialogContent>
          </>
        )}
      </DetailDialog>
    </GalleryContainer>
  );
};

// Memoized export
export default React.memo(AICharacterGallery);

// Named export
export { AICharacterGallery };
