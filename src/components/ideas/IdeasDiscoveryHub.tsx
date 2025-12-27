// Ideas Discovery Hub
// Unified browser for 4,500+ ideas across all libraries

import React, { useState, useMemo, useCallback } from 'react';
import { Box, Typography, Grid, Chip, TextField, InputAdornment, Slider, IconButton, Tooltip } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Search, Sparkles, Filter, Shuffle, Heart, Star, Bookmark,
  Clock, Zap, Moon, Sun, Utensils, Palette, Music, BookOpen,
  Dumbbell, Brain, Home, DollarSign, Scissors, Flame, Leaf,
  Users, Shield, Eye, Grid3X3, List, X
} from 'lucide-react';
import { GothicCard } from '../gothic/GothicCard';
import { GothicButton } from '../gothic/GothicButton';

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
`;

const HubContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #0a0812 0%, #1a1028 50%, #0a0812 100%)',
  padding: '32px',
});

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    color: '#e0e0e0',
    background: 'rgba(20, 20, 30, 0.8)',
    borderRadius: '16px',
    '& fieldset': {
      borderColor: 'rgba(139, 92, 246, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(139, 92, 246, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#8b5cf6',
    },
  },
  '& .MuiInputAdornment-root': {
    color: '#8b5cf6',
  },
});

const IdeaCard = styled(Box)<{ cardColor: string }>(({ cardColor }) => ({
  padding: '20px',
  borderRadius: '16px',
  background: 'rgba(20, 20, 30, 0.8)',
  border: '1px solid rgba(100, 100, 120, 0.2)',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '4px',
    height: '100%',
    background: cardColor,
  },
  '&:hover': {
    transform: 'translateY(-4px) translateX(4px)',
    borderColor: `${cardColor}50`,
    boxShadow: `0 10px 30px ${cardColor}20`,
  },
}));

const LibraryChip = styled(Chip)<{ selected: boolean; chipColor: string }>(({ selected, chipColor }) => ({
  margin: '4px',
  background: selected ? `${chipColor}30` : 'rgba(30, 30, 40, 0.6)',
  border: selected ? `2px solid ${chipColor}` : '1px solid rgba(100, 100, 120, 0.3)',
  color: selected ? chipColor : '#888888',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: `${chipColor}20`,
    borderColor: chipColor,
  },
}));

const EnergyIndicator = styled(Box)<{ level: string }>(({ level }) => {
  const colors = {
    low: '#22c55e',
    medium: '#f59e0b',
    high: '#ef4444',
    very_low: '#10b981',
  };
  const color = colors[level as keyof typeof colors] || colors.medium;
  return {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px',
    borderRadius: '8px',
    background: `${color}20`,
    color: color,
    fontSize: '0.75rem',
  };
});

const StatCard = styled(Box)<{ color: string }>(({ color }) => ({
  textAlign: 'center',
  padding: '16px',
  borderRadius: '12px',
  background: `${color}10`,
  border: `1px solid ${color}30`,
}));

// Library configurations
const libraries = [
  { id: 'food', name: 'Food & Meals', icon: Utensils, color: '#f59e0b', count: 200, description: 'Low-spoon meals and recipes' },
  { id: 'health', name: 'Health Actions', icon: Heart, color: '#ef4444', count: 200, description: 'Micro health actions' },
  { id: 'sewing', name: 'Sewing & Upcycling', icon: Scissors, color: '#ec4899', count: 200, description: 'Creative textile projects' },
  { id: 'art', name: 'Art & Creative', icon: Palette, color: '#8b5cf6', count: 200, description: 'Art prompts and projects' },
  { id: 'hoodoo', name: 'Hoodoo Practices', icon: Flame, color: '#a855f7', count: 200, description: 'Spiritual micro-practices' },
  { id: 'income', name: 'Passive Income', icon: DollarSign, color: '#22c55e', count: 600, description: 'Income stream ideas' },
  { id: 'mental', name: 'Mental Health', icon: Brain, color: '#6366f1', count: 150, description: 'CPTSD support activities' },
  { id: 'sleep', name: 'Sleep & Rest', icon: Moon, color: '#60a5fa', count: 100, description: 'Sleep hygiene tips' },
  { id: 'movement', name: 'Movement', icon: Dumbbell, color: '#10b981', count: 100, description: 'Gentle exercise ideas' },
  { id: 'learning', name: 'Learning', icon: BookOpen, color: '#3b82f6', count: 200, description: 'Educational activities' },
  { id: 'household', name: 'Household', icon: Home, color: '#f97316', count: 100, description: 'Home management' },
  { id: 'music', name: 'Music', icon: Music, color: '#14b8a6', count: 100, description: 'Music discovery' },
  { id: 'gaming', name: 'Gaming', icon: Sparkles, color: '#d946ef', count: 100, description: 'Gaming ideas' },
  { id: 'reading', name: 'Reading', icon: BookOpen, color: '#0ea5e9', count: 100, description: 'Reading recommendations' },
  { id: 'partner', name: 'Relationships', icon: Users, color: '#f43f5e', count: 100, description: 'Date and activity ideas' },
  { id: 'pet', name: 'Pet Care', icon: Heart, color: '#fb923c', count: 100, description: 'Pet enrichment' },
];

// Sample ideas (would be aggregated from JSON files)
const sampleIdeas = [
  { id: 1, library: 'food', title: 'Microwave mug cake', description: 'Quick chocolate cake in a mug', energy: 'low', time: '5 min', category: 'Quick Meals' },
  { id: 2, library: 'food', title: 'Cheese quesadilla', description: 'Simple comfort food', energy: 'low', time: '10 min', category: 'Quick Meals' },
  { id: 3, library: 'health', title: 'Drink electrolytes', description: 'Hydration for POTS', energy: 'very_low', time: '1 min', category: 'POTS Care' },
  { id: 4, library: 'health', title: 'Compression sock check', description: 'Ensure proper circulation', energy: 'low', time: '2 min', category: 'POTS Care' },
  { id: 5, library: 'art', title: 'Blind contour drawing', description: 'Draw without looking at paper', energy: 'low', time: '10 min', category: 'Drawing' },
  { id: 6, library: 'art', title: 'Color a mandala', description: 'Meditative coloring', energy: 'low', time: '20 min', category: 'Coloring' },
  { id: 7, library: 'hoodoo', title: 'Light protection candle', description: 'Daily protection ritual', energy: 'very_low', time: '2 min', category: 'Protection' },
  { id: 8, library: 'hoodoo', title: 'Salt the doorway', description: 'Cleanse entry points', energy: 'low', time: '5 min', category: 'Cleansing' },
  { id: 9, library: 'income', title: 'Design Canva template', description: 'Create sellable templates', energy: 'medium', time: '30 min', category: 'Digital Products' },
  { id: 10, library: 'income', title: 'Write product review', description: 'Affiliate content', energy: 'medium', time: '20 min', category: 'Affiliate' },
  { id: 11, library: 'sewing', title: 'Mend a button', description: 'Quick repair', energy: 'low', time: '10 min', category: 'Repairs' },
  { id: 12, library: 'sewing', title: 'Add patches to jeans', description: 'Upcycle old denim', energy: 'medium', time: '45 min', category: 'Upcycling' },
  { id: 13, library: 'mental', title: '5-4-3-2-1 grounding', description: 'Sensory grounding technique', energy: 'very_low', time: '5 min', category: 'Grounding' },
  { id: 14, library: 'mental', title: 'Write 3 gratitudes', description: 'Gratitude journaling', energy: 'low', time: '5 min', category: 'Journaling' },
  { id: 15, library: 'sleep', title: 'Lavender pillow spray', description: 'Calming scent for sleep', energy: 'very_low', time: '1 min', category: 'Environment' },
  { id: 16, library: 'movement', title: 'Gentle neck stretches', description: 'Release tension', energy: 'very_low', time: '5 min', category: 'Stretching' },
  { id: 17, library: 'learning', title: 'Watch TED talk', description: 'Learn something new', energy: 'low', time: '15 min', category: 'Videos' },
  { id: 18, library: 'household', title: 'Wipe one surface', description: 'Small cleaning win', energy: 'low', time: '5 min', category: 'Cleaning' },
  { id: 19, library: 'music', title: 'Listen to new album', description: 'Music discovery', energy: 'very_low', time: '45 min', category: 'Discovery' },
  { id: 20, library: 'partner', title: 'Cook together', description: 'Bonding activity', energy: 'medium', time: '1 hr', category: 'Date Ideas' },
];

const energyLabels: Record<string, string> = {
  very_low: '1 spoon',
  low: '2 spoons',
  medium: '3 spoons',
  high: '4+ spoons',
};

export const IdeasDiscoveryHub: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLibraries, setSelectedLibraries] = useState<string[]>([]);
  const [energyFilter, setEnergyFilter] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [saved, setSaved] = useState<Set<number>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(true);
  const [randomIdea, setRandomIdea] = useState<typeof sampleIdeas[0] | null>(null);

  const totalIdeas = libraries.reduce((sum, lib) => sum + lib.count, 0);

  const filteredIdeas = useMemo(() => {
    return sampleIdeas.filter(idea => {
      const matchesSearch = !searchQuery ||
        idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLibrary = selectedLibraries.length === 0 || selectedLibraries.includes(idea.library);
      const matchesEnergy = energyFilter.length === 0 || energyFilter.includes(idea.energy);

      return matchesSearch && matchesLibrary && matchesEnergy;
    });
  }, [searchQuery, selectedLibraries, energyFilter]);

  const toggleLibrary = (libraryId: string) => {
    setSelectedLibraries(prev =>
      prev.includes(libraryId)
        ? prev.filter(l => l !== libraryId)
        : [...prev, libraryId]
    );
  };

  const toggleEnergy = (level: string) => {
    setEnergyFilter(prev =>
      prev.includes(level)
        ? prev.filter(e => e !== level)
        : [...prev, level]
    );
  };

  const toggleFavorite = (id: number) => {
    setFavorites(prev => {
      const newFavs = new Set(prev);
      if (newFavs.has(id)) {
        newFavs.delete(id);
      } else {
        newFavs.add(id);
      }
      return newFavs;
    });
  };

  const toggleSaved = (id: number) => {
    setSaved(prev => {
      const newSaved = new Set(prev);
      if (newSaved.has(id)) {
        newSaved.delete(id);
      } else {
        newSaved.add(id);
      }
      return newSaved;
    });
  };

  const getRandomIdea = useCallback(() => {
    const ideas = filteredIdeas.length > 0 ? filteredIdeas : sampleIdeas;
    const randomIndex = Math.floor(Math.random() * ideas.length);
    setRandomIdea(ideas[randomIndex]);
  }, [filteredIdeas]);

  const getLibraryConfig = (libraryId: string) => {
    return libraries.find(l => l.id === libraryId) || libraries[0];
  };

  return (
    <HubContainer>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography
          sx={{
            fontFamily: '"Cinzel", serif',
            fontSize: '2.5rem',
            fontWeight: 700,
            background: 'linear-gradient(90deg, #8b5cf6, #ec4899, #8b5cf6)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: `${shimmer} 3s linear infinite`,
            mb: 1,
          }}
        >
          <Sparkles size={36} style={{ marginRight: '12px', verticalAlign: 'middle', color: '#8b5cf6' }} />
          Ideas Discovery Hub
        </Typography>
        <Typography sx={{ color: '#9080a0', fontStyle: 'italic' }}>
          {totalIdeas.toLocaleString()}+ ideas across {libraries.length} libraries
        </Typography>
      </Box>

      {/* Stats Row */}
      <Grid container spacing={2} sx={{ mb: 4, maxWidth: '1000px', mx: 'auto' }}>
        <Grid item xs={6} sm={3}>
          <StatCard color="#8b5cf6">
            <BookOpen size={24} color="#8b5cf6" style={{ marginBottom: '8px' }} />
            <Typography sx={{ color: '#8b5cf6', fontSize: '1.5rem', fontWeight: 700 }}>
              {totalIdeas.toLocaleString()}
            </Typography>
            <Typography sx={{ color: '#888888', fontSize: '0.85rem' }}>Total Ideas</Typography>
          </StatCard>
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard color="#ec4899">
            <Grid3X3 size={24} color="#ec4899" style={{ marginBottom: '8px' }} />
            <Typography sx={{ color: '#ec4899', fontSize: '1.5rem', fontWeight: 700 }}>
              {libraries.length}
            </Typography>
            <Typography sx={{ color: '#888888', fontSize: '0.85rem' }}>Libraries</Typography>
          </StatCard>
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard color="#f59e0b">
            <Heart size={24} color="#f59e0b" style={{ marginBottom: '8px' }} />
            <Typography sx={{ color: '#f59e0b', fontSize: '1.5rem', fontWeight: 700 }}>
              {favorites.size}
            </Typography>
            <Typography sx={{ color: '#888888', fontSize: '0.85rem' }}>Favorites</Typography>
          </StatCard>
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard color="#22c55e">
            <Bookmark size={24} color="#22c55e" style={{ marginBottom: '8px' }} />
            <Typography sx={{ color: '#22c55e', fontSize: '1.5rem', fontWeight: 700 }}>
              {saved.size}
            </Typography>
            <Typography sx={{ color: '#888888', fontSize: '0.85rem' }}>Saved</Typography>
          </StatCard>
        </Grid>
      </Grid>

      {/* Search & Random */}
      <Box sx={{ maxWidth: '800px', mx: 'auto', mb: 4 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <StyledTextField
            fullWidth
            placeholder="Search ideas by title, description, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={20} />
                </InputAdornment>
              ),
            }}
          />
          <GothicButton variant="primary" startIcon={<Shuffle size={18} />} onClick={getRandomIdea}>
            Random
          </GothicButton>
        </Box>
      </Box>

      {/* Random Idea Display */}
      {randomIdea && (
        <GothicCard variant="elevated" ornate sx={{ mb: 4, maxWidth: '600px', mx: 'auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Chip
                size="small"
                label="Random Pick"
                sx={{ background: 'rgba(212, 175, 55, 0.2)', color: '#d4af37', mb: 1 }}
              />
              <Typography sx={{ color: '#e0e0e0', fontSize: '1.3rem', fontWeight: 600, mb: 1 }}>
                {randomIdea.title}
              </Typography>
              <Typography sx={{ color: '#9080a0', mb: 2 }}>
                {randomIdea.description}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {(() => {
                  const lib = getLibraryConfig(randomIdea.library);
                  const LibIcon = lib.icon;
                  return (
                    <Chip
                      size="small"
                      icon={<LibIcon size={12} />}
                      label={lib.name}
                      sx={{
                        background: `${lib.color}20`,
                        color: lib.color,
                      }}
                    />
                  );
                })()}
                <EnergyIndicator level={randomIdea.energy}>
                  <Zap size={12} />
                  {energyLabels[randomIdea.energy]}
                </EnergyIndicator>
                <Chip
                  size="small"
                  icon={<Clock size={12} />}
                  label={randomIdea.time}
                  sx={{ background: 'rgba(100, 100, 120, 0.3)', color: '#888888' }}
                />
              </Box>
            </Box>
            <IconButton onClick={() => setRandomIdea(null)}>
              <X size={20} color="#888" />
            </IconButton>
          </Box>
        </GothicCard>
      )}

      {/* Filters */}
      <GothicCard variant="glass" sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography sx={{ color: '#a78bfa', fontFamily: '"Cinzel", serif', fontSize: '1.1rem' }}>
            <Filter size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Filter Ideas
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <GothicButton
              variant="ghost"
              size="small"
              onClick={() => {
                setSelectedLibraries([]);
                setEnergyFilter([]);
              }}
            >
              Clear All
            </GothicButton>
            <IconButton onClick={() => setViewMode('grid')} sx={{ color: viewMode === 'grid' ? '#8b5cf6' : '#666' }}>
              <Grid3X3 size={18} />
            </IconButton>
            <IconButton onClick={() => setViewMode('list')} sx={{ color: viewMode === 'list' ? '#8b5cf6' : '#666' }}>
              <List size={18} />
            </IconButton>
          </Box>
        </Box>

        {/* Library Filters */}
        <Typography sx={{ color: '#888888', fontSize: '0.85rem', mb: 1 }}>Libraries</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
          {libraries.map(library => (
            <LibraryChip
              key={library.id}
              icon={<library.icon size={14} />}
              label={`${library.name} (${library.count})`}
              selected={selectedLibraries.includes(library.id)}
              chipColor={library.color}
              onClick={() => toggleLibrary(library.id)}
            />
          ))}
        </Box>

        {/* Energy Filters */}
        <Typography sx={{ color: '#888888', fontSize: '0.85rem', mb: 1 }}>Energy Level</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {Object.entries(energyLabels).map(([level, label]) => (
            <Chip
              key={level}
              icon={<Zap size={12} />}
              label={label}
              onClick={() => toggleEnergy(level)}
              sx={{
                background: energyFilter.includes(level) ? 'rgba(139, 92, 246, 0.3)' : 'rgba(30, 30, 40, 0.6)',
                border: energyFilter.includes(level) ? '2px solid #8b5cf6' : '1px solid rgba(100, 100, 120, 0.3)',
                color: energyFilter.includes(level) ? '#8b5cf6' : '#888888',
                cursor: 'pointer',
              }}
            />
          ))}
        </Box>
      </GothicCard>

      {/* Results Count */}
      <Typography sx={{ color: '#888888', mb: 3, textAlign: 'center' }}>
        Showing {filteredIdeas.length} ideas
        {(selectedLibraries.length > 0 || energyFilter.length > 0) && ' (filtered)'}
      </Typography>

      {/* Ideas Grid */}
      <Grid container spacing={3}>
        {filteredIdeas.map(idea => {
          const library = getLibraryConfig(idea.library);
          return (
            <Grid
              item
              xs={12}
              sm={viewMode === 'grid' ? 6 : 12}
              md={viewMode === 'grid' ? 4 : 12}
              lg={viewMode === 'grid' ? 3 : 12}
              key={idea.id}
            >
              <IdeaCard cardColor={library.color}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box
                    sx={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: `${library.color}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <library.icon size={20} color={library.color} />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(idea.id);
                      }}
                    >
                      <Heart
                        size={16}
                        color={favorites.has(idea.id) ? '#f59e0b' : '#666'}
                        fill={favorites.has(idea.id) ? '#f59e0b' : 'none'}
                      />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSaved(idea.id);
                      }}
                    >
                      <Bookmark
                        size={16}
                        color={saved.has(idea.id) ? '#22c55e' : '#666'}
                        fill={saved.has(idea.id) ? '#22c55e' : 'none'}
                      />
                    </IconButton>
                  </Box>
                </Box>

                <Typography sx={{ color: '#e0e0e0', fontWeight: 600, mb: 1 }}>
                  {idea.title}
                </Typography>
                <Typography
                  sx={{
                    color: '#888888',
                    fontSize: '0.85rem',
                    mb: 2,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {idea.description}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <EnergyIndicator level={idea.energy}>
                    <Zap size={10} />
                    {energyLabels[idea.energy]}
                  </EnergyIndicator>
                  <Chip
                    size="small"
                    icon={<Clock size={10} />}
                    label={idea.time}
                    sx={{
                      height: '22px',
                      fontSize: '0.7rem',
                      background: 'rgba(100, 100, 120, 0.3)',
                      color: '#888888',
                    }}
                  />
                  <Chip
                    size="small"
                    label={idea.category}
                    sx={{
                      height: '22px',
                      fontSize: '0.7rem',
                      background: `${library.color}15`,
                      color: library.color,
                    }}
                  />
                </Box>
              </IdeaCard>
            </Grid>
          );
        })}
      </Grid>

      {/* Empty State */}
      {filteredIdeas.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Sparkles size={64} color="#666666" style={{ marginBottom: '16px' }} />
          <Typography sx={{ color: '#888888', fontSize: '1.2rem' }}>
            No ideas found matching your filters
          </Typography>
          <Typography sx={{ color: '#666666', fontSize: '0.9rem', mt: 1 }}>
            Try adjusting your search or filters
          </Typography>
        </Box>
      )}
    </HubContainer>
  );
};

export default IdeasDiscoveryHub;
