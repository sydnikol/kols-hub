// RecipeBook.tsx - Gothic-themed Recipe Display and Cook Mode
// Part of the Gothic Dollhouse Kitchen Lab

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Chip,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Stack,
  InputAdornment,
  Tabs,
  Tab,
  LinearProgress,
  Paper,
  Divider,
  Badge,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Search,
  X,
  Clock,
  Users,
  Flame,
  Heart,
  HeartOff,
  ChefHat,
  Shuffle,
  BookOpen,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  CheckCircle2,
  Timer,
  Utensils,
  Leaf,
  Globe,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';
import {
  gothicRecipes,
  GothicRecipe,
  RecipeCategory,
  DietaryTag,
  categoryLabels,
  categoryIcons,
  searchRecipes,
  getRecipesByCategory,
  getRecipesByDiet,
  getRecipesBySpoonLevel,
  formatTime,
  getTotalTime,
  getRandomRecipe,
  SpoonLevel,
} from '../../data/gothicRecipes';

// Keyframe animations
const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const cookingFlame = keyframes`
  0%, 100% { transform: scaleY(1) translateY(0); }
  50% { transform: scaleY(1.1) translateY(-2px); }
`;

// Styled components
const Container = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #0a0812 0%, #1a1028 50%, #0f0a18 100%)',
  padding: '24px',
  position: 'relative',
});

const Header = styled(Box)({
  background: 'linear-gradient(135deg, #6b21a8 0%, #9333ea 50%, #7c3aed 100%)',
  borderRadius: '16px',
  padding: '32px',
  marginBottom: '24px',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: '0 8px 32px rgba(139, 92, 246, 0.4)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.1), transparent)',
    backgroundSize: '200% 100%',
    animation: `${shimmer} 3s infinite`,
  },
});

const SearchField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    color: '#ffffff',
    background: 'rgba(26, 16, 40, 0.8)',
    borderRadius: '12px',
    '& fieldset': { borderColor: 'rgba(139, 92, 246, 0.3)' },
    '&:hover fieldset': { borderColor: 'rgba(139, 92, 246, 0.6)' },
    '&.Mui-focused fieldset': { borderColor: '#8b5cf6' },
  },
});

const CategoryChip = styled(Chip)<{ selected?: boolean }>(({ selected }) => ({
  background: selected
    ? 'linear-gradient(135deg, #8b5cf6 0%, #d4af37 100%)'
    : 'rgba(26, 16, 40, 0.8)',
  color: selected ? '#ffffff' : 'rgba(212, 175, 55, 0.9)',
  border: `1px solid ${selected ? '#d4af37' : 'rgba(139, 92, 246, 0.3)'}`,
  fontWeight: 600,
  transition: 'all 0.3s ease',
  '&:hover': {
    background: selected
      ? 'linear-gradient(135deg, #9333ea 0%, #d4af37 100%)'
      : 'rgba(139, 92, 246, 0.2)',
    transform: 'translateY(-2px)',
  },
}));

const RecipeCard = styled(Paper)({
  background: 'rgba(26, 16, 40, 0.8)',
  borderRadius: '16px',
  border: '1px solid rgba(139, 92, 246, 0.2)',
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  overflow: 'hidden',
  animation: `${fadeIn} 0.5s ease-out`,
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 16px 40px rgba(139, 92, 246, 0.3)',
    borderColor: '#8b5cf6',
  },
});

const RecipeImage = styled(Box)({
  height: '120px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '4rem',
  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(212, 175, 55, 0.1) 100%)',
});

const SpoonMeter = styled(Box)<{ level: number }>(({ level }) => ({
  display: 'flex',
  gap: '4px',
  '& .spoon': {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    transition: 'all 0.2s ease',
  },
}));

const FavoriteButton = styled(IconButton)<{ favorited?: boolean }>(({ favorited }) => ({
  color: favorited ? '#ec4899' : 'rgba(236, 72, 153, 0.5)',
  transition: 'all 0.3s ease',
  '&:hover': {
    color: '#ec4899',
    transform: 'scale(1.2)',
  },
}));

const CookModeDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    background: 'linear-gradient(135deg, #1a1028 0%, #0a0812 100%)',
    borderRadius: '20px',
    border: '2px solid rgba(139, 92, 246, 0.4)',
    color: '#ffffff',
    maxWidth: '800px',
    width: '100%',
  },
});

const StepCard = styled(Box)<{ active?: boolean; completed?: boolean }>(({ active, completed }) => ({
  padding: '16px',
  borderRadius: '12px',
  background: active
    ? 'rgba(139, 92, 246, 0.2)'
    : completed
    ? 'rgba(34, 197, 94, 0.1)'
    : 'rgba(26, 16, 40, 0.6)',
  border: `2px solid ${
    active ? '#8b5cf6' : completed ? '#22c55e' : 'rgba(139, 92, 246, 0.2)'
  }`,
  transition: 'all 0.3s ease',
  marginBottom: '12px',
}));

const TimerDisplay = styled(Box)({
  background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
  borderRadius: '16px',
  padding: '24px',
  textAlign: 'center',
  boxShadow: '0 8px 32px rgba(249, 115, 22, 0.4)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '60px',
    height: '20px',
    background: 'linear-gradient(to top, rgba(234, 88, 12, 0.8), transparent)',
    borderRadius: '50% 50% 0 0',
    animation: `${cookingFlame} 0.5s ease-in-out infinite`,
  },
});

interface RecipeBookProps {
  onClose?: () => void;
}

export const RecipeBook: React.FC<RecipeBookProps> = ({ onClose }) => {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<RecipeCategory | 'all'>('all');
  const [selectedDiet, setSelectedDiet] = useState<DietaryTag | 'all'>('all');
  const [maxSpoons, setMaxSpoons] = useState<SpoonLevel>(5);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<GothicRecipe | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [cookModeOpen, setCookModeOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [cookTimer, setCookTimer] = useState<number>(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSound, setTimerSound] = useState(true);

  // Load favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('gothic-recipe-favorites');
    if (saved) {
      setFavorites(new Set(JSON.parse(saved)));
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('gothic-recipe-favorites', JSON.stringify([...favorites]));
  }, [favorites]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning && cookTimer > 0) {
      interval = setInterval(() => {
        setCookTimer(prev => {
          if (prev <= 1) {
            setTimerRunning(false);
            if (timerSound) {
              // Play sound alert
              const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdH2Onp6YjHtwXVhhcIGPl5aQh31uXlZbZ3aFkZeWkYZ7bV1WWGRygpGYl5GFem1dVllld4OSmJeQhHpsXVZZZXeDkpiYkIR6bF1WWmZ4hJOYl4+DeWtdVltneIWTmJeOgnhrXVZbZ3mGlJiWjYF3al1WW2h6hpSYloyAdmldVlxoe4aUmJWMf3VoXVZcaXuHlZiVi352aF1WXGl8h5WYlYp+dWhdVl1qfIiVmJSJfXRnXVZdanmIlpiUiHxzZ11WXWt9iZaYk4d7cmZdVl5rfomWmJKGeXFmXVZea36Jl5iRhXhwZV1WXmx/iZeYkIR3b2VdVl9sgIqXl5CDdm5kXVZfbICKl5ePgnVtZF1WX21/ipeXjoFzbGRdVl9tf4qXlo2AcmtjXVZgbn+Kl5aLfnFqY11WYG5/ipeViX1wamNdVmBvgIqXlYh8b2ljXVZgb4CKl5WHe21oY11WYW+Bi5eVhnpsaGNdVmFwgYuXlIV5a2djXVZhcIGLl5SDd2pmY11WYXGBi5eTgnZpZWNdVmJxgouXkoF1aGVjXVZicoKLl5GAdGdkY11WYnKCi5aQfnNmZGNdVmJzg4yWj31yZWRjXVZjc4OMlo58cWRjY11WY3OEjJaNe3BjY2NdVmN0hIyVjHpvYmNjXVZkdISMlYt5bmJjY11WZHWF');
              audio.play().catch(() => {});
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, cookTimer, timerSound]);

  // Filter recipes
  const filteredRecipes = useMemo(() => {
    let result = [...gothicRecipes];

    // Search filter
    if (searchQuery) {
      result = searchRecipes(searchQuery);
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(r => r.category === selectedCategory);
    }

    // Diet filter
    if (selectedDiet !== 'all') {
      result = result.filter(r => r.dietaryTags.includes(selectedDiet));
    }

    // Spoon level filter
    result = result.filter(r => r.spoonLevel <= maxSpoons);

    // Favorites filter
    if (showFavoritesOnly) {
      result = result.filter(r => favorites.has(r.id));
    }

    return result;
  }, [searchQuery, selectedCategory, selectedDiet, maxSpoons, showFavoritesOnly, favorites]);

  // Handlers
  const toggleFavorite = useCallback((id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
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

  const openRecipeDetail = (recipe: GothicRecipe) => {
    setSelectedRecipe(recipe);
    setDetailOpen(true);
  };

  const startCookMode = () => {
    setDetailOpen(false);
    setCookModeOpen(true);
    setCurrentStep(0);
    setCompletedSteps(new Set());
    setCookTimer(0);
    setTimerRunning(false);
  };

  const nextStep = () => {
    if (selectedRecipe && currentStep < selectedRecipe.instructions.length - 1) {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const toggleStepComplete = (step: number) => {
    setCompletedSteps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(step)) {
        newSet.delete(step);
      } else {
        newSet.add(step);
      }
      return newSet;
    });
  };

  const setQuickTimer = (minutes: number) => {
    setCookTimer(minutes * 60);
    setTimerRunning(true);
  };

  const formatTimerDisplay = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const pickRandomRecipe = () => {
    const recipe = getRandomRecipe();
    openRecipeDetail(recipe);
  };

  const categories: (RecipeCategory | 'all')[] = ['all', 'comfort', 'healthy', 'quick', 'desserts', 'drinks', 'cultural'];
  const diets: (DietaryTag | 'all')[] = ['all', 'vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'low-carb', 'high-protein'];

  return (
    <Container>
      {/* Header */}
      <Header>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={2} alignItems="center">
            <BookOpen size={48} color="#d4af37" />
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontFamily: '"Cinzel", serif',
                  color: '#ffffff',
                  fontWeight: 700,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                }}
              >
                Gothic Recipe Book
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                {gothicRecipes.length} enchanted recipes await
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              startIcon={<Shuffle size={20} />}
              onClick={pickRandomRecipe}
              sx={{
                background: 'linear-gradient(135deg, #d4af37 0%, #b8860b 100%)',
                color: '#0a0812',
                fontWeight: 600,
                '&:hover': { background: 'linear-gradient(135deg, #ffd700 0%, #d4af37 100%)' },
              }}
            >
              Random Recipe
            </Button>
            <Button
              variant={showFavoritesOnly ? 'contained' : 'outlined'}
              startIcon={<Heart size={20} />}
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              sx={{
                borderColor: '#ec4899',
                color: showFavoritesOnly ? '#ffffff' : '#ec4899',
                background: showFavoritesOnly ? 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)' : 'transparent',
                '&:hover': { borderColor: '#ec4899', background: 'rgba(236, 72, 153, 0.1)' },
              }}
            >
              Favorites ({favorites.size})
            </Button>
          </Stack>
        </Stack>
      </Header>

      {/* Search and Filters */}
      <Box sx={{ mb: 3 }}>
        <SearchField
          fullWidth
          placeholder="Search recipes by name, ingredient, or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="#8b5cf6" size={20} />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton onClick={() => setSearchQuery('')} size="small">
                  <X color="#8b5cf6" size={20} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        {/* Category Tabs */}
        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
          {categories.map(cat => (
            <CategoryChip
              key={cat}
              label={cat === 'all' ? 'All Recipes' : `${categoryIcons[cat as RecipeCategory]} ${categoryLabels[cat as RecipeCategory]}`}
              selected={selectedCategory === cat}
              onClick={() => setSelectedCategory(cat)}
            />
          ))}
        </Stack>

        {/* Diet Filter */}
        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
          <Typography sx={{ color: '#d4af37', mr: 1, alignSelf: 'center' }}>
            <Leaf size={16} style={{ marginRight: 4, verticalAlign: 'middle' }} />
            Diet:
          </Typography>
          {diets.map(diet => (
            <Chip
              key={diet}
              label={diet === 'all' ? 'Any' : diet}
              size="small"
              onClick={() => setSelectedDiet(diet)}
              sx={{
                background: selectedDiet === diet ? 'rgba(34, 197, 94, 0.3)' : 'rgba(26, 16, 40, 0.6)',
                color: selectedDiet === diet ? '#22c55e' : 'rgba(255,255,255,0.7)',
                border: `1px solid ${selectedDiet === diet ? '#22c55e' : 'rgba(139, 92, 246, 0.2)'}`,
                cursor: 'pointer',
                '&:hover': { background: 'rgba(34, 197, 94, 0.2)' },
              }}
            />
          ))}
        </Stack>

        {/* Spoon Level Filter */}
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography sx={{ color: '#f97316' }}>
            <Flame size={16} style={{ marginRight: 4, verticalAlign: 'middle' }} />
            Max Energy Level:
          </Typography>
          {[1, 2, 3, 4, 5].map(level => (
            <Box
              key={level}
              onClick={() => setMaxSpoons(level as SpoonLevel)}
              sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: level <= maxSpoons ? '#f97316' : 'rgba(249, 115, 22, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: level === maxSpoons ? '2px solid #fbbf24' : 'none',
                '&:hover': { transform: 'scale(1.1)' },
              }}
            >
              <Typography sx={{ color: level <= maxSpoons ? '#0a0812' : '#f97316', fontWeight: 700 }}>
                {level}
              </Typography>
            </Box>
          ))}
          <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', ml: 2 }}>
            (1 = easy, 5 = complex)
          </Typography>
        </Stack>
      </Box>

      {/* Results Count */}
      <Typography sx={{ color: '#d4af37', mb: 2, fontWeight: 600 }}>
        Showing {filteredRecipes.length} of {gothicRecipes.length} recipes
      </Typography>

      {/* Recipe Grid */}
      <Grid container spacing={3}>
        {filteredRecipes.map(recipe => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={recipe.id}>
            <RecipeCard onClick={() => openRecipeDetail(recipe)}>
              <RecipeImage>{recipe.image}</RecipeImage>
              <Box sx={{ p: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="start">
                  <Typography
                    sx={{
                      color: '#d4af37',
                      fontFamily: '"Cinzel", serif',
                      fontWeight: 600,
                      fontSize: '1rem',
                      mb: 0.5,
                    }}
                  >
                    {recipe.gothicName}
                  </Typography>
                  <FavoriteButton
                    size="small"
                    favorited={favorites.has(recipe.id)}
                    onClick={(e) => toggleFavorite(recipe.id, e)}
                  >
                    {favorites.has(recipe.id) ? <Heart size={18} fill="#ec4899" /> : <Heart size={18} />}
                  </FavoriteButton>
                </Stack>
                <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', mb: 1 }}>
                  {recipe.name}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                  <Chip
                    icon={<Clock size={12} />}
                    label={formatTime(getTotalTime(recipe))}
                    size="small"
                    sx={{ background: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa', fontSize: '0.75rem' }}
                  />
                  <Chip
                    icon={<Users size={12} />}
                    label={`${recipe.servings}`}
                    size="small"
                    sx={{ background: 'rgba(34, 197, 94, 0.2)', color: '#22c55e', fontSize: '0.75rem' }}
                  />
                </Stack>
                <SpoonMeter level={recipe.spoonLevel}>
                  {[1, 2, 3, 4, 5].map(s => (
                    <Box
                      key={s}
                      className="spoon"
                      sx={{ background: s <= recipe.spoonLevel ? '#f97316' : 'rgba(249, 115, 22, 0.2)' }}
                    />
                  ))}
                </SpoonMeter>
              </Box>
            </RecipeCard>
          </Grid>
        ))}
      </Grid>

      {/* No Results */}
      {filteredRecipes.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <ChefHat size={64} color="#8b5cf6" style={{ opacity: 0.5 }} />
          <Typography sx={{ color: 'rgba(139, 92, 246, 0.7)', mt: 2, fontSize: '1.2rem' }}>
            No recipes found matching your criteria
          </Typography>
          <Button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedDiet('all');
              setMaxSpoons(5);
              setShowFavoritesOnly(false);
            }}
            sx={{ mt: 2, color: '#d4af37' }}
          >
            Clear all filters
          </Button>
        </Box>
      )}

      {/* Recipe Detail Dialog */}
      <Dialog
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, #1a1028 0%, #0a0812 100%)',
            borderRadius: '20px',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            color: '#ffffff',
          },
        }}
      >
        {selectedRecipe && (
          <>
            <DialogTitle>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{ fontSize: '3rem' }}>{selectedRecipe.image}</Box>
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif', fontWeight: 700 }}
                    >
                      {selectedRecipe.gothicName}
                    </Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      {selectedRecipe.name}
                    </Typography>
                  </Box>
                </Stack>
                <IconButton onClick={() => setDetailOpen(false)}>
                  <X color="#8b5cf6" />
                </IconButton>
              </Stack>
            </DialogTitle>
            <DialogContent>
              <Typography sx={{ color: 'rgba(255,255,255,0.8)', mb: 3 }}>
                {selectedRecipe.description}
              </Typography>

              {/* Quick Info */}
              <Stack direction="row" spacing={2} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
                <Chip icon={<Clock size={16} />} label={`Prep: ${formatTime(selectedRecipe.prepTime)}`} sx={{ background: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa' }} />
                <Chip icon={<Flame size={16} />} label={`Cook: ${formatTime(selectedRecipe.cookTime)}`} sx={{ background: 'rgba(249, 115, 22, 0.2)', color: '#f97316' }} />
                <Chip icon={<Users size={16} />} label={`Serves ${selectedRecipe.servings}`} sx={{ background: 'rgba(34, 197, 94, 0.2)', color: '#22c55e' }} />
                {selectedRecipe.culturalOrigin && (
                  <Chip icon={<Globe size={16} />} label={selectedRecipe.culturalOrigin} sx={{ background: 'rgba(212, 175, 55, 0.2)', color: '#d4af37' }} />
                )}
              </Stack>

              {/* Dietary Tags */}
              <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', gap: 0.5 }}>
                {selectedRecipe.dietaryTags.map(tag => (
                  <Chip key={tag} label={tag} size="small" sx={{ background: 'rgba(34, 197, 94, 0.15)', color: '#22c55e', fontSize: '0.75rem' }} />
                ))}
              </Stack>

              <Divider sx={{ borderColor: 'rgba(139, 92, 246, 0.2)', mb: 3 }} />

              {/* Ingredients */}
              <Typography variant="h6" sx={{ color: '#d4af37', mb: 2, fontFamily: '"Cinzel", serif' }}>
                <Utensils size={20} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                Ingredients
              </Typography>
              <Grid container spacing={1} sx={{ mb: 3 }}>
                {selectedRecipe.ingredients.map((ing, idx) => (
                  <Grid item xs={12} sm={6} key={idx}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: '8px',
                        background: 'rgba(26, 16, 40, 0.6)',
                        border: '1px solid rgba(139, 92, 246, 0.1)',
                      }}
                    >
                      <Typography sx={{ color: '#ffffff' }}>
                        <strong style={{ color: '#d4af37' }}>{ing.amount} {ing.unit}</strong> {ing.name}
                        {ing.optional && <Chip label="optional" size="small" sx={{ ml: 1, height: '18px', fontSize: '0.65rem', background: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa' }} />}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>

              {/* Instructions */}
              <Typography variant="h6" sx={{ color: '#d4af37', mb: 2, fontFamily: '"Cinzel", serif' }}>
                <ChefHat size={20} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                Instructions
              </Typography>
              {selectedRecipe.instructions.map((step, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: 'flex',
                    gap: 2,
                    mb: 2,
                    p: 2,
                    borderRadius: '12px',
                    background: 'rgba(26, 16, 40, 0.6)',
                  }}
                >
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #8b5cf6, #d4af37)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Typography sx={{ color: '#ffffff', fontWeight: 700 }}>{idx + 1}</Typography>
                  </Box>
                  <Typography sx={{ color: 'rgba(255,255,255,0.9)' }}>{step}</Typography>
                </Box>
              ))}

              {/* Tips */}
              {selectedRecipe.tips.length > 0 && (
                <>
                  <Typography variant="h6" sx={{ color: '#d4af37', mb: 2, mt: 3, fontFamily: '"Cinzel", serif' }}>
                    <Sparkles size={20} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                    Pro Tips
                  </Typography>
                  {selectedRecipe.tips.map((tip, idx) => (
                    <Typography key={idx} sx={{ color: 'rgba(255,255,255,0.7)', mb: 1, pl: 2, borderLeft: '2px solid #d4af37' }}>
                      {tip}
                    </Typography>
                  ))}
                </>
              )}

              {/* Nutrition */}
              <Typography variant="h6" sx={{ color: '#d4af37', mb: 2, mt: 3, fontFamily: '"Cinzel", serif' }}>
                Nutrition (per serving)
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap" gap={1}>
                <Chip label={`${selectedRecipe.nutrition.calories} cal`} sx={{ background: 'rgba(249, 115, 22, 0.2)', color: '#f97316' }} />
                <Chip label={`${selectedRecipe.nutrition.protein}g protein`} sx={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }} />
                <Chip label={`${selectedRecipe.nutrition.carbs}g carbs`} sx={{ background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6' }} />
                <Chip label={`${selectedRecipe.nutrition.fat}g fat`} sx={{ background: 'rgba(234, 179, 8, 0.2)', color: '#eab308' }} />
                <Chip label={`${selectedRecipe.nutrition.fiber}g fiber`} sx={{ background: 'rgba(34, 197, 94, 0.2)', color: '#22c55e' }} />
              </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button
                onClick={() => toggleFavorite(selectedRecipe.id)}
                startIcon={favorites.has(selectedRecipe.id) ? <HeartOff size={20} /> : <Heart size={20} />}
                sx={{ color: '#ec4899' }}
              >
                {favorites.has(selectedRecipe.id) ? 'Remove from Favorites' : 'Add to Favorites'}
              </Button>
              <Button
                variant="contained"
                startIcon={<ChefHat size={20} />}
                onClick={startCookMode}
                sx={{
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #d4af37 100%)',
                  fontWeight: 600,
                  '&:hover': { background: 'linear-gradient(135deg, #9333ea 0%, #ffd700 100%)' },
                }}
              >
                Start Cook Mode
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Cook Mode Dialog */}
      <CookModeDialog open={cookModeOpen} onClose={() => setCookModeOpen(false)} maxWidth="lg" fullWidth>
        {selectedRecipe && (
          <>
            <DialogTitle>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row" spacing={2} alignItems="center">
                  <ChefHat size={32} color="#d4af37" />
                  <Box>
                    <Typography variant="h5" sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif' }}>
                      Cook Mode
                    </Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      {selectedRecipe.gothicName}
                    </Typography>
                  </Box>
                </Stack>
                <IconButton onClick={() => setCookModeOpen(false)}>
                  <X color="#8b5cf6" />
                </IconButton>
              </Stack>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                {/* Steps */}
                <Grid item xs={12} md={7}>
                  <Typography sx={{ color: '#d4af37', mb: 2, fontWeight: 600 }}>
                    Step {currentStep + 1} of {selectedRecipe.instructions.length}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={((currentStep + 1) / selectedRecipe.instructions.length) * 100}
                    sx={{
                      mb: 3,
                      height: 8,
                      borderRadius: 4,
                      background: 'rgba(139, 92, 246, 0.2)',
                      '& .MuiLinearProgress-bar': {
                        background: 'linear-gradient(90deg, #8b5cf6, #d4af37)',
                        borderRadius: 4,
                      },
                    }}
                  />

                  {selectedRecipe.instructions.map((step, idx) => (
                    <StepCard
                      key={idx}
                      active={idx === currentStep}
                      completed={completedSteps.has(idx)}
                      onClick={() => toggleStepComplete(idx)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <Stack direction="row" spacing={2} alignItems="flex-start">
                        <Box
                          sx={{
                            width: 28,
                            height: 28,
                            borderRadius: '50%',
                            background: completedSteps.has(idx)
                              ? '#22c55e'
                              : idx === currentStep
                              ? 'linear-gradient(135deg, #8b5cf6, #d4af37)'
                              : 'rgba(139, 92, 246, 0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          {completedSteps.has(idx) ? (
                            <CheckCircle2 size={16} color="#ffffff" />
                          ) : (
                            <Typography sx={{ color: '#ffffff', fontSize: '0.85rem', fontWeight: 600 }}>
                              {idx + 1}
                            </Typography>
                          )}
                        </Box>
                        <Typography
                          sx={{
                            color: completedSteps.has(idx) ? 'rgba(255,255,255,0.5)' : '#ffffff',
                            textDecoration: completedSteps.has(idx) ? 'line-through' : 'none',
                            fontSize: idx === currentStep ? '1.1rem' : '0.95rem',
                          }}
                        >
                          {step}
                        </Typography>
                      </Stack>
                    </StepCard>
                  ))}

                  {/* Navigation */}
                  <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
                    <Button
                      startIcon={<SkipBack size={20} />}
                      onClick={prevStep}
                      disabled={currentStep === 0}
                      sx={{ color: '#a78bfa' }}
                    >
                      Previous
                    </Button>
                    <Button
                      endIcon={<SkipForward size={20} />}
                      onClick={nextStep}
                      disabled={currentStep === selectedRecipe.instructions.length - 1}
                      variant="contained"
                      sx={{
                        background: 'linear-gradient(135deg, #8b5cf6, #d4af37)',
                        '&:hover': { background: 'linear-gradient(135deg, #9333ea, #ffd700)' },
                      }}
                    >
                      Next Step
                    </Button>
                  </Stack>
                </Grid>

                {/* Timer & Ingredients */}
                <Grid item xs={12} md={5}>
                  {/* Timer */}
                  <TimerDisplay sx={{ mb: 3 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                      <Typography sx={{ color: '#ffffff', fontWeight: 600 }}>
                        <Timer size={20} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                        Cooking Timer
                      </Typography>
                      <IconButton onClick={() => setTimerSound(!timerSound)} sx={{ color: '#ffffff' }}>
                        {timerSound ? <Volume2 size={20} /> : <VolumeX size={20} />}
                      </IconButton>
                    </Stack>
                    <Typography
                      sx={{
                        fontSize: '3rem',
                        fontWeight: 700,
                        color: '#ffffff',
                        fontFamily: 'monospace',
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                      }}
                    >
                      {formatTimerDisplay(cookTimer)}
                    </Typography>
                    <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 2 }}>
                      <IconButton
                        onClick={() => setTimerRunning(!timerRunning)}
                        disabled={cookTimer === 0}
                        sx={{
                          background: 'rgba(255,255,255,0.2)',
                          color: '#ffffff',
                          '&:hover': { background: 'rgba(255,255,255,0.3)' },
                        }}
                      >
                        {timerRunning ? <Pause size={24} /> : <Play size={24} />}
                      </IconButton>
                      <IconButton
                        onClick={() => { setCookTimer(0); setTimerRunning(false); }}
                        sx={{
                          background: 'rgba(255,255,255,0.2)',
                          color: '#ffffff',
                          '&:hover': { background: 'rgba(255,255,255,0.3)' },
                        }}
                      >
                        <X size={24} />
                      </IconButton>
                    </Stack>
                    <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 2, flexWrap: 'wrap', gap: 1 }}>
                      {[1, 3, 5, 10, 15, 30].map(mins => (
                        <Chip
                          key={mins}
                          label={`${mins}m`}
                          onClick={() => setQuickTimer(mins)}
                          sx={{
                            background: 'rgba(255,255,255,0.2)',
                            color: '#ffffff',
                            cursor: 'pointer',
                            '&:hover': { background: 'rgba(255,255,255,0.3)' },
                          }}
                        />
                      ))}
                    </Stack>
                  </TimerDisplay>

                  {/* Ingredients Checklist */}
                  <Box
                    sx={{
                      background: 'rgba(26, 16, 40, 0.6)',
                      borderRadius: '16px',
                      p: 2,
                      border: '1px solid rgba(139, 92, 246, 0.2)',
                    }}
                  >
                    <Typography sx={{ color: '#d4af37', mb: 2, fontWeight: 600 }}>
                      <Utensils size={20} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                      Ingredients
                    </Typography>
                    {selectedRecipe.ingredients.map((ing, idx) => (
                      <Typography
                        key={idx}
                        sx={{
                          color: 'rgba(255,255,255,0.8)',
                          fontSize: '0.9rem',
                          py: 0.5,
                          borderBottom: '1px solid rgba(139, 92, 246, 0.1)',
                        }}
                      >
                        <strong style={{ color: '#d4af37' }}>{ing.amount} {ing.unit}</strong> {ing.name}
                      </Typography>
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
          </>
        )}
      </CookModeDialog>
    </Container>
  );
};

export default RecipeBook;
