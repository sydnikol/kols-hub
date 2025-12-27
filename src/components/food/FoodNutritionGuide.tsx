import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
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
  Tooltip,
  Badge,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Utensils,
  ChefHat,
  Apple,
  Flame,
  Clock,
  Search,
  Bookmark,
  BookmarkCheck,
  Shuffle,
  X,
  Sparkles,
  Globe,
  Tag,
} from 'lucide-react';
import foodData from '../../data/food_ideas.json';

// Types
interface FoodIdea {
  id: string;
  name: string;
  category: string;
  origin: string;
  tags: string[];
  energy_level: 'low' | 'medium' | 'high';
  prep_time_min: number;
  notes: string;
}

// Keyframe animations
const steamRising = keyframes`
  0% {
    transform: translateY(0) scaleX(1);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-20px) scaleX(0.8);
    opacity: 0.3;
  }
  100% {
    transform: translateY(-40px) scaleX(0.6);
    opacity: 0;
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Styled components
const Container = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #0a0812 0%, #1a1028 100%)',
  padding: '24px',
  position: 'relative',
  overflow: 'hidden',
});

const Header = styled(Box)({
  background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
  borderRadius: '16px',
  padding: '32px',
  marginBottom: '32px',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: '0 8px 32px rgba(249, 115, 22, 0.3)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '10%',
    left: '10%',
    width: '30px',
    height: '60px',
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
    animation: `${steamRising} 3s ease-in-out infinite`,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '15%',
    left: '15%',
    width: '25px',
    height: '50px',
    background: 'rgba(255, 255, 255, 0.15)',
    borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
    animation: `${steamRising} 3s ease-in-out infinite 0.5s`,
  },
});

const HeaderTitle = styled(Typography)({
  color: '#ffffff',
  fontWeight: 800,
  fontSize: '2.5rem',
  marginBottom: '8px',
  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
});

const HeaderSubtitle = styled(Typography)({
  color: 'rgba(255, 255, 255, 0.9)',
  fontSize: '1.1rem',
  fontWeight: 500,
});

const FilterChipsContainer = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '12px',
  marginBottom: '24px',
  padding: '16px',
  background: 'rgba(26, 16, 40, 0.6)',
  borderRadius: '12px',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(249, 115, 22, 0.2)',
});

const StyledChip = styled(Chip)<{ active?: boolean }>(({ active }) => ({
  background: active
    ? 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)'
    : 'rgba(26, 16, 40, 0.8)',
  color: active ? '#ffffff' : 'rgba(249, 115, 22, 0.9)',
  border: `1px solid ${active ? '#fb923c' : 'rgba(249, 115, 22, 0.3)'}`,
  fontWeight: 600,
  fontSize: '0.9rem',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: active
      ? 'linear-gradient(135deg, #fb923c 0%, #f97316 100%)'
      : 'rgba(249, 115, 22, 0.2)',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)',
  },
}));

const FoodCard = styled(Card)({
  background: 'rgba(26, 16, 40, 0.8)',
  borderRadius: '16px',
  border: '1px solid rgba(249, 115, 22, 0.2)',
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s ease',
  animation: `${fadeIn} 0.5s ease-out`,
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 32px rgba(249, 115, 22, 0.4)',
    borderColor: '#f97316',
  },
});

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    color: '#ffffff',
    background: 'rgba(26, 16, 40, 0.8)',
    borderRadius: '12px',
    '& fieldset': {
      borderColor: 'rgba(249, 115, 22, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(249, 115, 22, 0.6)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#f97316',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(249, 115, 22, 0.7)',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#f97316',
  },
});

const EnergyBadge = styled(Chip)<{ energylevel: string }>(({ energylevel }) => {
  const colors = {
    low: '#22c55e',
    medium: '#eab308',
    high: '#ef4444',
  };
  return {
    background: colors[energylevel as keyof typeof colors],
    color: '#ffffff',
    fontWeight: 700,
    fontSize: '0.75rem',
    height: '24px',
  };
});

const PrepTimeBadge = styled(Chip)({
  background: 'rgba(59, 130, 246, 0.2)',
  color: '#60a5fa',
  border: '1px solid rgba(59, 130, 246, 0.4)',
  fontWeight: 600,
  fontSize: '0.75rem',
  height: '24px',
});

const IconButtonStyled = styled(IconButton)({
  color: '#f97316',
  transition: 'all 0.3s ease',
  '&:hover': {
    color: '#fb923c',
    transform: 'scale(1.1)',
    background: 'rgba(249, 115, 22, 0.1)',
  },
});

const RandomButton = styled(Button)({
  background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
  color: '#ffffff',
  fontWeight: 700,
  padding: '12px 24px',
  borderRadius: '12px',
  textTransform: 'none',
  fontSize: '1rem',
  transition: 'all 0.3s ease',
  animation: `${pulse} 2s ease-in-out infinite`,
  '&:hover': {
    background: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)',
    transform: 'scale(1.05)',
    boxShadow: '0 8px 24px rgba(139, 92, 246, 0.4)',
  },
});

const StyledDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    background: 'linear-gradient(135deg, #1a1028 0%, #0a0812 100%)',
    borderRadius: '16px',
    border: '1px solid rgba(249, 115, 22, 0.3)',
    color: '#ffffff',
    maxWidth: '600px',
  },
});

const FoodNutritionGuide: React.FC = React.memo(() => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedEnergyLevel, setSelectedEnergyLevel] = useState<string>('All');
  const [maxPrepTime, setMaxPrepTime] = useState<number>(60);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [selectedFood, setSelectedFood] = useState<FoodIdea | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const foodItems = foodData.items as FoodIdea[];

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set(foodItems.map((item) => item.category));
    return ['All', ...Array.from(cats).sort()];
  }, [foodItems]);

  // Filter food items
  const filteredItems = useMemo(() => {
    return foodItems.filter((item) => {
      const matchesSearch =
        searchQuery === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;

      const matchesEnergy =
        selectedEnergyLevel === 'All' || item.energy_level === selectedEnergyLevel;

      const matchesPrepTime = item.prep_time_min <= maxPrepTime;

      return matchesSearch && matchesCategory && matchesEnergy && matchesPrepTime;
    });
  }, [searchQuery, selectedCategory, selectedEnergyLevel, maxPrepTime, foodItems]);

  const handleCardClick = (food: FoodIdea) => {
    setSelectedFood(food);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setTimeout(() => setSelectedFood(null), 300);
  };

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleCompleted = (id: string) => {
    setCompletedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const getRandomFood = () => {
    if (filteredItems.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredItems.length);
      handleCardClick(filteredItems[randomIndex]);
    }
  };

  const getEnergyIcon = (level: string) => {
    switch (level) {
      case 'low':
        return <Apple size={16} />;
      case 'medium':
        return <Utensils size={16} />;
      case 'high':
        return <Flame size={16} />;
      default:
        return null;
    }
  };

  return (
    <Container>
      <Header>
        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
          <ChefHat size={48} color="#ffffff" />
          <Box>
            <HeaderTitle>Food Nutrition Guide</HeaderTitle>
            <HeaderSubtitle>
              Discover {foodItems.length} chronic-illness-friendly meal ideas
            </HeaderSubtitle>
          </Box>
        </Stack>
      </Header>

      {/* Search and Random Button */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        mb={3}
        alignItems="stretch"
      >
        <Box flex={1}>
          <StyledTextField
            fullWidth
            placeholder="Search by name, origin, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="#f97316" size={20} />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton onClick={() => setSearchQuery('')} size="small">
                    <X color="#f97316" size={20} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <RandomButton onClick={getRandomFood} startIcon={<Shuffle size={20} />}>
          Random Recipe
        </RandomButton>
      </Stack>

      {/* Category Filters */}
      <FilterChipsContainer>
        <Typography variant="body2" sx={{ color: '#f97316', fontWeight: 600, mr: 1 }}>
          Category:
        </Typography>
        {categories.map((category) => (
          <StyledChip
            key={category}
            label={category}
            active={selectedCategory === category ? 1 : 0}
            onClick={() => setSelectedCategory(category)}
          />
        ))}
      </FilterChipsContainer>

      {/* Energy Level Filters */}
      <FilterChipsContainer>
        <Typography variant="body2" sx={{ color: '#f97316', fontWeight: 600, mr: 1 }}>
          Energy Level:
        </Typography>
        {['All', 'low', 'medium', 'high'].map((level) => (
          <StyledChip
            key={level}
            label={level.charAt(0).toUpperCase() + level.slice(1)}
            icon={level !== 'All' ? getEnergyIcon(level) : undefined}
            active={selectedEnergyLevel === level ? 1 : 0}
            onClick={() => setSelectedEnergyLevel(level)}
          />
        ))}
      </FilterChipsContainer>

      {/* Prep Time Filter */}
      <FilterChipsContainer>
        <Typography variant="body2" sx={{ color: '#f97316', fontWeight: 600, mr: 1 }}>
          Max Prep Time: {maxPrepTime} min
        </Typography>
        <Stack direction="row" spacing={2} flex={1} alignItems="center">
          <Clock color="#f97316" size={20} />
          <StyledTextField
            type="number"
            size="small"
            value={maxPrepTime}
            onChange={(e) => setMaxPrepTime(Number(e.target.value))}
            InputProps={{
              inputProps: { min: 5, max: 60, step: 5 },
            }}
            sx={{ width: '120px' }}
          />
        </Stack>
      </FilterChipsContainer>

      {/* Stats */}
      <Box mb={3}>
        <Typography
          variant="h6"
          sx={{
            color: '#f97316',
            fontWeight: 700,
            mb: 1,
          }}
        >
          Showing {filteredItems.length} of {foodItems.length} recipes
          {bookmarkedIds.size > 0 && ` • ${bookmarkedIds.size} bookmarked`}
          {completedIds.size > 0 && ` • ${completedIds.size} completed`}
        </Typography>
      </Box>

      {/* Food Grid */}
      <Grid container spacing={3}>
        {filteredItems.map((food) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={food.id}>
            <FoodCard onClick={() => handleCardClick(food)}>
              <CardContent>
                <Stack spacing={2}>
                  {/* Header with bookmark */}
                  <Stack direction="row" justifyContent="space-between" alignItems="start">
                    <Typography
                      variant="h6"
                      sx={{
                        color: '#f97316',
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        flex: 1,
                      }}
                    >
                      {food.name}
                    </Typography>
                    <IconButtonStyled
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(food.id);
                      }}
                    >
                      {bookmarkedIds.has(food.id) ? (
                        <BookmarkCheck size={20} />
                      ) : (
                        <Bookmark size={20} />
                      )}
                    </IconButtonStyled>
                  </Stack>

                  {/* Category */}
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'rgba(249, 115, 22, 0.7)',
                      fontSize: '0.85rem',
                    }}
                  >
                    {food.category}
                  </Typography>

                  {/* Origin */}
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Globe size={16} color="#fb923c" />
                    <Typography variant="body2" sx={{ color: '#fb923c' }}>
                      {food.origin}
                    </Typography>
                  </Stack>

                  {/* Badges */}
                  <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                    <EnergyBadge
                      energylevel={food.energy_level}
                      label={food.energy_level}
                      size="small"
                      icon={getEnergyIcon(food.energy_level)}
                    />
                    <PrepTimeBadge
                      label={`${food.prep_time_min} min`}
                      size="small"
                      icon={<Clock size={14} />}
                    />
                  </Stack>

                  {/* Tags */}
                  <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
                    {food.tags.slice(0, 2).map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        icon={<Tag size={12} />}
                        sx={{
                          background: 'rgba(139, 92, 246, 0.2)',
                          color: '#a78bfa',
                          border: '1px solid rgba(139, 92, 246, 0.3)',
                          fontSize: '0.7rem',
                          height: '20px',
                        }}
                      />
                    ))}
                    {food.tags.length > 2 && (
                      <Chip
                        label={`+${food.tags.length - 2}`}
                        size="small"
                        sx={{
                          background: 'rgba(139, 92, 246, 0.2)',
                          color: '#a78bfa',
                          fontSize: '0.7rem',
                          height: '20px',
                        }}
                      />
                    )}
                  </Stack>

                  {/* Completed indicator */}
                  {completedIds.has(food.id) && (
                    <Badge
                      badgeContent={<Sparkles size={12} />}
                      sx={{
                        '& .MuiBadge-badge': {
                          background: '#22c55e',
                          color: '#ffffff',
                        },
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: '#22c55e',
                          fontWeight: 600,
                        }}
                      >
                        Completed
                      </Typography>
                    </Badge>
                  )}
                </Stack>
              </CardContent>
            </FoodCard>
          </Grid>
        ))}
      </Grid>

      {/* No Results */}
      {filteredItems.length === 0 && (
        <Box textAlign="center" py={8}>
          <ChefHat size={64} color="#f97316" style={{ opacity: 0.5 }} />
          <Typography
            variant="h5"
            sx={{
              color: 'rgba(249, 115, 22, 0.7)',
              mt: 2,
              fontWeight: 600,
            }}
          >
            No recipes found
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'rgba(249, 115, 22, 0.5)',
              mt: 1,
            }}
          >
            Try adjusting your filters or search query
          </Typography>
        </Box>
      )}

      {/* Detail Dialog */}
      <StyledDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedFood && (
          <>
            <DialogTitle>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <ChefHat size={32} color="#f97316" />
                  <Typography
                    variant="h5"
                    sx={{ color: '#f97316', fontWeight: 700 }}
                  >
                    {selectedFood.name}
                  </Typography>
                </Stack>
                <IconButton onClick={handleCloseDialog}>
                  <X color="#f97316" size={24} />
                </IconButton>
              </Stack>
            </DialogTitle>
            <DialogContent>
              <Stack spacing={3} mt={2}>
                {/* Category & Origin */}
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: 'rgba(249, 115, 22, 0.7)', mb: 1 }}
                  >
                    Category
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#ffffff' }}>
                    {selectedFood.category}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: 'rgba(249, 115, 22, 0.7)', mb: 1 }}
                  >
                    Origin
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Globe size={20} color="#fb923c" />
                    <Typography variant="h6" sx={{ color: '#ffffff' }}>
                      {selectedFood.origin}
                    </Typography>
                  </Stack>
                </Box>

                {/* Energy & Prep Time */}
                <Stack direction="row" spacing={2}>
                  <Box flex={1}>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: 'rgba(249, 115, 22, 0.7)', mb: 1 }}
                    >
                      Energy Level
                    </Typography>
                    <EnergyBadge
                      energylevel={selectedFood.energy_level}
                      label={selectedFood.energy_level.toUpperCase()}
                      icon={getEnergyIcon(selectedFood.energy_level)}
                    />
                  </Box>
                  <Box flex={1}>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: 'rgba(249, 115, 22, 0.7)', mb: 1 }}
                    >
                      Prep Time
                    </Typography>
                    <PrepTimeBadge
                      label={`${selectedFood.prep_time_min} minutes`}
                      icon={<Clock size={16} />}
                    />
                  </Box>
                </Stack>

                {/* Tags */}
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: 'rgba(249, 115, 22, 0.7)', mb: 1 }}
                  >
                    Tags
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                    {selectedFood.tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        icon={<Tag size={16} />}
                        sx={{
                          background: 'rgba(139, 92, 246, 0.3)',
                          color: '#a78bfa',
                          border: '1px solid rgba(139, 92, 246, 0.5)',
                          fontWeight: 600,
                        }}
                      />
                    ))}
                  </Stack>
                </Box>

                {/* Notes */}
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: 'rgba(249, 115, 22, 0.7)', mb: 1 }}
                  >
                    Notes
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#ffffff' }}>
                    {selectedFood.notes}
                  </Typography>
                </Box>
              </Stack>
            </DialogContent>
            <DialogActions sx={{ padding: '16px 24px' }}>
              <Button
                onClick={() => toggleCompleted(selectedFood.id)}
                variant={completedIds.has(selectedFood.id) ? 'outlined' : 'contained'}
                sx={{
                  background: completedIds.has(selectedFood.id)
                    ? 'transparent'
                    : 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                  color: '#ffffff',
                  borderColor: '#22c55e',
                  '&:hover': {
                    background: completedIds.has(selectedFood.id)
                      ? 'rgba(34, 197, 94, 0.1)'
                      : 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
                  },
                }}
                startIcon={<Sparkles size={20} />}
              >
                {completedIds.has(selectedFood.id)
                  ? 'Mark Incomplete'
                  : 'Mark Complete'}
              </Button>
              <Button
                onClick={() => toggleBookmark(selectedFood.id)}
                variant="outlined"
                sx={{
                  borderColor: '#f97316',
                  color: '#f97316',
                  '&:hover': {
                    borderColor: '#fb923c',
                    background: 'rgba(249, 115, 22, 0.1)',
                  },
                }}
                startIcon={
                  bookmarkedIds.has(selectedFood.id) ? (
                    <BookmarkCheck size={20} />
                  ) : (
                    <Bookmark size={20} />
                  )
                }
              >
                {bookmarkedIds.has(selectedFood.id) ? 'Bookmarked' : 'Bookmark'}
              </Button>
            </DialogActions>
          </>
        )}
      </StyledDialog>
    </Container>
  );
});

FoodNutritionGuide.displayName = 'FoodNutritionGuide';

export default FoodNutritionGuide;
