// Daily Activity Oracle
// Intelligent activity suggestions based on spoon levels and mood

import React, { useState, useMemo, useCallback } from 'react';
import { Box, Typography, Grid, Chip, Slider, IconButton, Tooltip } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Sparkles, Shuffle, Heart, Zap, Clock, Star, Filter,
  Coffee, Moon, Sun, Flame, Snowflake, Wind, Droplets,
  BookOpen, Palette, Music, Utensils, Pill, Dumbbell,
  Brain, Leaf, Scissors, DollarSign, Home, Users
} from 'lucide-react';
import { GothicCard } from '../gothic/GothicCard';
import { GothicButton } from '../gothic/GothicButton';

const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(-1deg); }
  50% { transform: translateY(-15px) rotate(1deg); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.3); }
  50% { box-shadow: 0 0 40px rgba(139, 92, 246, 0.6); }
`;

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const OracleContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #0a0812 0%, #1a1028 50%, #0a0812 100%)',
  padding: '32px',
});

const OracleOrb = styled(Box)({
  width: '200px',
  height: '200px',
  borderRadius: '50%',
  background: 'radial-gradient(circle at 30% 30%, #8b5cf6, #4c1d95, #1a1028)',
  margin: '0 auto 32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  animation: `${float} 4s ease-in-out infinite, ${glow} 2s ease-in-out infinite`,
  cursor: 'pointer',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: '-4px',
    borderRadius: '50%',
    border: '2px solid rgba(139, 92, 246, 0.3)',
    animation: `${glow} 2s ease-in-out infinite 0.5s`,
  },
});

const ActivityCard = styled(Box)<{ cardColor: string }>(({ cardColor }) => ({
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
    right: 0,
    height: '3px',
    background: cardColor,
  },
  '&:hover': {
    transform: 'translateY(-4px)',
    borderColor: `${cardColor}50`,
    boxShadow: `0 10px 30px ${cardColor}20`,
  },
}));

const SpoonMeter = styled(Box)({
  display: 'flex',
  gap: '8px',
  justifyContent: 'center',
  marginBottom: '24px',
});

const Spoon = styled(Box)<{ filled: boolean; spoonColor: string }>(({ filled, spoonColor }) => ({
  width: '30px',
  height: '30px',
  borderRadius: '50%',
  background: filled ? spoonColor : 'rgba(100, 100, 120, 0.3)',
  border: `2px solid ${filled ? spoonColor : 'rgba(100, 100, 120, 0.5)'}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.1)',
    borderColor: spoonColor,
  },
}));

const FilterChip = styled(Chip)<{ selected: boolean; chipColor: string }>(({ selected, chipColor }) => ({
  margin: '4px',
  background: selected ? `${chipColor}30` : 'rgba(30, 30, 40, 0.6)',
  border: selected ? `2px solid ${chipColor}` : '1px solid rgba(100, 100, 120, 0.3)',
  color: selected ? chipColor : '#888888',
  cursor: 'pointer',
  '&:hover': {
    background: `${chipColor}20`,
    borderColor: chipColor,
  },
}));

// Activity categories with icons and colors
const categories = [
  { id: 'health', name: 'Health', icon: Heart, color: '#ef4444' },
  { id: 'creative', name: 'Creative', icon: Palette, color: '#8b5cf6' },
  { id: 'food', name: 'Food', icon: Utensils, color: '#f59e0b' },
  { id: 'movement', name: 'Movement', icon: Dumbbell, color: '#10b981' },
  { id: 'rest', name: 'Rest', icon: Moon, color: '#6366f1' },
  { id: 'spiritual', name: 'Spiritual', icon: Sparkles, color: '#ec4899' },
  { id: 'learning', name: 'Learning', icon: BookOpen, color: '#3b82f6' },
  { id: 'income', name: 'Income', icon: DollarSign, color: '#22c55e' },
  { id: 'home', name: 'Home', icon: Home, color: '#f97316' },
  { id: 'social', name: 'Social', icon: Users, color: '#06b6d4' },
];

// Sample activities (would be loaded from JSON files)
const sampleActivities = [
  { id: 1, title: 'Drink a glass of water', category: 'health', spoons: 1, time: '1 min', description: 'Hydration is key for POTS management' },
  { id: 2, title: 'Gentle stretching in bed', category: 'movement', spoons: 1, time: '5 min', description: 'Easy morning movement for hEDS' },
  { id: 3, title: 'Write 3 gratitude notes', category: 'creative', spoons: 1, time: '5 min', description: 'Quick journaling for mental health' },
  { id: 4, title: 'Salt snack break', category: 'food', spoons: 1, time: '2 min', description: 'Salty snacks help with POTS' },
  { id: 5, title: 'Light ancestor altar candle', category: 'spiritual', spoons: 1, time: '2 min', description: 'Quick spiritual connection' },
  { id: 6, title: 'Listen to one song mindfully', category: 'rest', spoons: 1, time: '4 min', description: 'Music as meditation' },
  { id: 7, title: 'Read one article', category: 'learning', spoons: 2, time: '10 min', description: 'Learn something new' },
  { id: 8, title: 'Quick sketch session', category: 'creative', spoons: 2, time: '15 min', description: 'Express yourself visually' },
  { id: 9, title: 'Prepare a batch snack', category: 'food', spoons: 2, time: '20 min', description: 'Make energy balls or trail mix' },
  { id: 10, title: 'Gentle yoga flow', category: 'movement', spoons: 2, time: '15 min', description: 'Low-impact movement' },
  { id: 11, title: 'Protection spray ritual', category: 'spiritual', spoons: 2, time: '10 min', description: 'Cleanse your space' },
  { id: 12, title: 'Update passive income tracker', category: 'income', spoons: 2, time: '15 min', description: 'Track your streams' },
  { id: 13, title: 'Tidy one surface', category: 'home', spoons: 2, time: '10 min', description: 'Small wins count' },
  { id: 14, title: 'Text a friend', category: 'social', spoons: 1, time: '5 min', description: 'Stay connected' },
  { id: 15, title: 'Create a Canva design', category: 'income', spoons: 3, time: '30 min', description: 'Design for passive income' },
  { id: 16, title: 'Cook a full meal', category: 'food', spoons: 3, time: '45 min', description: 'Nourish yourself properly' },
  { id: 17, title: 'Deep cleaning session', category: 'home', spoons: 4, time: '1 hr', description: 'When you have the spoons' },
  { id: 18, title: 'Full ritual bath', category: 'spiritual', spoons: 3, time: '45 min', description: 'Cleansing and relaxation' },
];

const timeOfDayGreetings = () => {
  const hour = new Date().getHours();
  if (hour < 6) return { greeting: 'Night owl hours', icon: Moon, mood: 'restful' };
  if (hour < 12) return { greeting: 'Good morning', icon: Sun, mood: 'fresh' };
  if (hour < 17) return { greeting: 'Good afternoon', icon: Coffee, mood: 'active' };
  if (hour < 21) return { greeting: 'Good evening', icon: Flame, mood: 'winding down' };
  return { greeting: 'Night time', icon: Moon, mood: 'restful' };
};

export const DailyActivityOracle: React.FC = () => {
  const [spoonLevel, setSpoonLevel] = useState(3);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [currentSuggestion, setCurrentSuggestion] = useState<typeof sampleActivities[0] | null>(null);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  const timeGreeting = timeOfDayGreetings();
  const TimeIcon = timeGreeting.icon;

  const filteredActivities = useMemo(() => {
    return sampleActivities.filter(activity => {
      const matchesSpoons = activity.spoons <= spoonLevel;
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(activity.category);
      return matchesSpoons && matchesCategory;
    });
  }, [spoonLevel, selectedCategories]);

  const getRandomActivity = useCallback(() => {
    if (filteredActivities.length === 0) return;
    const randomIndex = Math.floor(Math.random() * filteredActivities.length);
    setCurrentSuggestion(filteredActivities[randomIndex]);
  }, [filteredActivities]);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(c => c !== categoryId)
        : [...prev, categoryId]
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

  const getCategoryConfig = (categoryId: string) => {
    return categories.find(c => c.id === categoryId) || categories[0];
  };

  return (
    <OracleContainer>
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
          Daily Activity Oracle
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, color: '#9080a0' }}>
          <TimeIcon size={20} />
          <Typography sx={{ fontStyle: 'italic' }}>
            {timeGreeting.greeting} — What shall we do today?
          </Typography>
        </Box>
      </Box>

      {/* Spoon Meter */}
      <GothicCard variant="glass" sx={{ mb: 4, textAlign: 'center' }}>
        <Typography sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif', fontSize: '1.2rem', mb: 2 }}>
          <Zap size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Current Spoon Level
        </Typography>
        <SpoonMeter>
          {[1, 2, 3, 4, 5].map(level => (
            <Tooltip key={level} title={`${level} spoon${level > 1 ? 's' : ''}`}>
              <Spoon
                filled={level <= spoonLevel}
                spoonColor={level <= 2 ? '#ef4444' : level <= 3 ? '#f59e0b' : '#10b981'}
                onClick={() => setSpoonLevel(level)}
              >
                <Zap size={14} color={level <= spoonLevel ? '#fff' : '#666'} />
              </Spoon>
            </Tooltip>
          ))}
        </SpoonMeter>
        <Typography sx={{ color: '#888888', fontSize: '0.9rem' }}>
          {spoonLevel === 1 && 'Very low energy — gentle activities only'}
          {spoonLevel === 2 && 'Low energy — light tasks'}
          {spoonLevel === 3 && 'Moderate energy — balanced activities'}
          {spoonLevel === 4 && 'Good energy — can tackle more'}
          {spoonLevel === 5 && 'High energy — bring it on!'}
        </Typography>
      </GothicCard>

      {/* Oracle Orb */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <OracleOrb onClick={getRandomActivity}>
          <Sparkles size={64} color="#fff" />
        </OracleOrb>
        <GothicButton variant="primary" startIcon={<Shuffle size={18} />} onClick={getRandomActivity}>
          Ask the Oracle
        </GothicButton>
      </Box>

      {/* Current Suggestion */}
      {currentSuggestion && (
        <GothicCard variant="elevated" ornate sx={{ mb: 4, maxWidth: '600px', mx: 'auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  background: `${getCategoryConfig(currentSuggestion.category).color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {React.createElement(getCategoryConfig(currentSuggestion.category).icon, {
                  size: 24,
                  color: getCategoryConfig(currentSuggestion.category).color,
                })}
              </Box>
              <Box>
                <Typography sx={{ color: '#e0e0e0', fontSize: '1.3rem', fontWeight: 600 }}>
                  {currentSuggestion.title}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip
                    size="small"
                    label={getCategoryConfig(currentSuggestion.category).name}
                    sx={{
                      background: `${getCategoryConfig(currentSuggestion.category).color}20`,
                      color: getCategoryConfig(currentSuggestion.category).color,
                    }}
                  />
                  <Chip
                    size="small"
                    icon={<Clock size={12} />}
                    label={currentSuggestion.time}
                    sx={{ background: 'rgba(100, 100, 120, 0.3)', color: '#888888' }}
                  />
                  <Chip
                    size="small"
                    icon={<Zap size={12} />}
                    label={`${currentSuggestion.spoons} spoon${currentSuggestion.spoons > 1 ? 's' : ''}`}
                    sx={{ background: 'rgba(100, 100, 120, 0.3)', color: '#888888' }}
                  />
                </Box>
              </Box>
            </Box>
            <IconButton onClick={() => toggleFavorite(currentSuggestion.id)}>
              <Star
                size={20}
                color={favorites.has(currentSuggestion.id) ? '#f59e0b' : '#666666'}
                fill={favorites.has(currentSuggestion.id) ? '#f59e0b' : 'none'}
              />
            </IconButton>
          </Box>
          <Typography sx={{ color: '#9080a0', fontStyle: 'italic' }}>
            {currentSuggestion.description}
          </Typography>
        </GothicCard>
      )}

      {/* Category Filters */}
      <GothicCard variant="glass" sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography sx={{ color: '#a78bfa', fontFamily: '"Cinzel", serif', fontSize: '1.1rem' }}>
            <Filter size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Filter Activities
          </Typography>
          <GothicButton variant="ghost" size="small" onClick={() => setSelectedCategories([])}>
            Clear All
          </GothicButton>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {categories.map(category => (
            <FilterChip
              key={category.id}
              icon={<category.icon size={14} />}
              label={category.name}
              selected={selectedCategories.includes(category.id)}
              chipColor={category.color}
              onClick={() => toggleCategory(category.id)}
            />
          ))}
        </Box>
      </GothicCard>

      {/* Activity Grid */}
      <Typography sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif', fontSize: '1.3rem', mb: 3, textAlign: 'center' }}>
        Available Activities ({filteredActivities.length})
      </Typography>
      <Grid container spacing={3}>
        {filteredActivities.slice(0, 12).map(activity => {
          const config = getCategoryConfig(activity.category);
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={activity.id}>
              <ActivityCard cardColor={config.color} onClick={() => setCurrentSuggestion(activity)}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box
                    sx={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: `${config.color}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <config.icon size={20} color={config.color} />
                  </Box>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(activity.id);
                    }}
                  >
                    <Star
                      size={16}
                      color={favorites.has(activity.id) ? '#f59e0b' : '#666666'}
                      fill={favorites.has(activity.id) ? '#f59e0b' : 'none'}
                    />
                  </IconButton>
                </Box>
                <Typography sx={{ color: '#e0e0e0', fontWeight: 600, mb: 1 }}>
                  {activity.title}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip
                    size="small"
                    icon={<Clock size={10} />}
                    label={activity.time}
                    sx={{ height: '22px', fontSize: '0.7rem', background: 'rgba(100, 100, 120, 0.3)', color: '#888888' }}
                  />
                  <Chip
                    size="small"
                    icon={<Zap size={10} />}
                    label={activity.spoons}
                    sx={{ height: '22px', fontSize: '0.7rem', background: 'rgba(100, 100, 120, 0.3)', color: '#888888' }}
                  />
                </Box>
              </ActivityCard>
            </Grid>
          );
        })}
      </Grid>
    </OracleContainer>
  );
};

export default DailyActivityOracle;
