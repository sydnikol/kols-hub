import React, { useState, useMemo, useCallback } from 'react';
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
  Divider,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Flame,
  Moon,
  Sun,
  BookOpen,
  Heart,
  Shield,
  Scale,
  Sparkles,
  Star,
  Search,
  Bookmark,
  BookmarkCheck,
  Shuffle,
  X,
  Calendar,
  Leaf,
  Wind,
  Target,
  Users,
  Zap,
} from 'lucide-react';
import ritualData from '../../data/kols_hoodoo_library_200.json';

// Types
interface HoodooRitual {
  id: string;
  title: string;
  category: 'protection' | 'money' | 'health' | 'court' | 'love' | 'peace' | 'road_opener' | 'ancestors' | 'cleansing' | 'focus';
  ingredients: string[];
  psalms: string[];
  steps: string[];
  safety_notes: string;
  schedule_hint: 'new_moon' | 'full_moon' | 'friday' | 'monday' | 'daily' | 'as_needed';
  tags: string[];
  status: string;
}

// Keyframe animations
const incenseRising = keyframes`
  0% {
    transform: translateY(0) scaleX(1) rotate(0deg);
    opacity: 0.7;
  }
  33% {
    transform: translateY(-25px) scaleX(0.9) rotate(5deg);
    opacity: 0.5;
  }
  66% {
    transform: translateY(-50px) scaleX(0.7) rotate(-5deg);
    opacity: 0.3;
  }
  100% {
    transform: translateY(-80px) scaleX(0.5) rotate(0deg);
    opacity: 0;
  }
`;

const goldenShimmer = keyframes`
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
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

const candleFlicker = keyframes`
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  25% {
    opacity: 0.9;
    transform: scale(0.98);
  }
  50% {
    opacity: 0.95;
    transform: scale(1.02);
  }
  75% {
    opacity: 0.92;
    transform: scale(0.99);
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
  background: 'linear-gradient(135deg, #92400e 0%, #b45309 100%)',
  borderRadius: '16px',
  padding: '32px',
  marginBottom: '32px',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: '0 8px 32px rgba(180, 83, 9, 0.4)',
  border: '1px solid rgba(254, 243, 199, 0.2)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '15%',
    left: '8%',
    width: '20px',
    height: '70px',
    background: 'linear-gradient(180deg, rgba(254, 243, 199, 0.4) 0%, rgba(254, 243, 199, 0.1) 50%, transparent 100%)',
    borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
    filter: 'blur(3px)',
    animation: `${incenseRising} 4s ease-in-out infinite`,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '20%',
    left: '12%',
    width: '18px',
    height: '65px',
    background: 'linear-gradient(180deg, rgba(254, 243, 199, 0.3) 0%, rgba(254, 243, 199, 0.08) 50%, transparent 100%)',
    borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
    filter: 'blur(4px)',
    animation: `${incenseRising} 4s ease-in-out infinite 0.7s`,
  },
});

const HeaderTitle = styled(Typography)({
  color: '#fef3c7',
  fontWeight: 800,
  fontSize: '2.5rem',
  marginBottom: '8px',
  textShadow: '2px 2px 8px rgba(0, 0, 0, 0.5), 0 0 20px rgba(180, 83, 9, 0.5)',
  animation: `${candleFlicker} 3s ease-in-out infinite`,
});

const HeaderSubtitle = styled(Typography)({
  color: 'rgba(254, 243, 199, 0.9)',
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
  border: '1px solid rgba(180, 83, 9, 0.2)',
});

const StyledChip = styled(Chip)<{ active?: boolean }>(({ active }) => ({
  background: active
    ? 'linear-gradient(135deg, #92400e 0%, #b45309 100%)'
    : 'rgba(26, 16, 40, 0.8)',
  color: active ? '#fef3c7' : 'rgba(180, 83, 9, 0.9)',
  border: `1px solid ${active ? '#b45309' : 'rgba(180, 83, 9, 0.3)'}`,
  fontWeight: 600,
  fontSize: '0.9rem',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: active
      ? 'linear-gradient(135deg, #b45309 0%, #92400e 100%)'
      : 'rgba(180, 83, 9, 0.2)',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(180, 83, 9, 0.3)',
  },
}));

const RitualCard = styled(Card)({
  background: 'rgba(26, 16, 40, 0.8)',
  borderRadius: '16px',
  border: '1px solid rgba(180, 83, 9, 0.2)',
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s ease',
  animation: `${fadeIn} 0.5s ease-out`,
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(180, 83, 9, 0.05) 0%, transparent 100%)',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 32px rgba(180, 83, 9, 0.4), 0 0 20px rgba(254, 243, 199, 0.2)',
    borderColor: '#b45309',
    '&::before': {
      opacity: 1,
    },
  },
});

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    color: '#fef3c7',
    background: 'rgba(26, 16, 40, 0.8)',
    borderRadius: '12px',
    '& fieldset': {
      borderColor: 'rgba(180, 83, 9, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(180, 83, 9, 0.6)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#b45309',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(254, 243, 199, 0.7)',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#b45309',
  },
});

const CategoryBadge = styled(Chip)<{ ritualcategory: string }>(({ ritualcategory }) => {
  const colors = {
    protection: { bg: '#7c3aed', text: '#e9d5ff' },
    money: { bg: '#059669', text: '#d1fae5' },
    health: { bg: '#dc2626', text: '#fecaca' },
    court: { bg: '#1d4ed8', text: '#dbeafe' },
    love: { bg: '#db2777', text: '#fce7f3' },
    peace: { bg: '#0891b2', text: '#cffafe' },
    road_opener: { bg: '#ea580c', text: '#fed7aa' },
    ancestors: { bg: '#6366f1', text: '#e0e7ff' },
    cleansing: { bg: '#22c55e', text: '#dcfce7' },
    focus: { bg: '#8b5cf6', text: '#ede9fe' },
  };
  const color = colors[ritualcategory as keyof typeof colors] || { bg: '#6b7280', text: '#f3f4f6' };
  return {
    background: color.bg,
    color: color.text,
    fontWeight: 700,
    fontSize: '0.75rem',
    height: '24px',
    textTransform: 'capitalize',
  };
});

const TimingBadge = styled(Chip)({
  background: 'rgba(254, 243, 199, 0.2)',
  color: '#fef3c7',
  border: '1px solid rgba(254, 243, 199, 0.4)',
  fontWeight: 600,
  fontSize: '0.75rem',
  height: '24px',
});

const IconButtonStyled = styled(IconButton)({
  color: '#b45309',
  transition: 'all 0.3s ease',
  '&:hover': {
    color: '#fef3c7',
    transform: 'scale(1.1)',
    background: 'rgba(180, 83, 9, 0.2)',
  },
});

const RandomButton = styled(Button)({
  background: 'linear-gradient(135deg, #b45309 0%, #fef3c7 100%)',
  backgroundSize: '200% auto',
  color: '#0a0812',
  fontWeight: 700,
  padding: '12px 24px',
  borderRadius: '12px',
  textTransform: 'none',
  fontSize: '1rem',
  transition: 'all 0.3s ease',
  animation: `${goldenShimmer} 3s linear infinite, ${pulse} 2s ease-in-out infinite`,
  '&:hover': {
    background: 'linear-gradient(135deg, #fef3c7 0%, #b45309 100%)',
    backgroundSize: '200% auto',
    transform: 'scale(1.05)',
    boxShadow: '0 8px 24px rgba(180, 83, 9, 0.5), 0 0 20px rgba(254, 243, 199, 0.6)',
  },
});

const StyledDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    background: 'linear-gradient(135deg, #1a1028 0%, #0a0812 100%)',
    borderRadius: '16px',
    border: '1px solid rgba(180, 83, 9, 0.3)',
    color: '#fef3c7',
    maxWidth: '700px',
  },
});

const HoodooRitualLibrary: React.FC = React.memo(() => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTiming, setSelectedTiming] = useState<string>('All');
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [selectedRitual, setSelectedRitual] = useState<HoodooRitual | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const rituals = ritualData.seed as HoodooRitual[];

  // Extract unique categories and timings
  const categories = useMemo(() => {
    return ['All', 'protection', 'money', 'health', 'court', 'love', 'peace', 'road_opener', 'ancestors', 'cleansing', 'focus'];
  }, []);

  const timings = useMemo(() => {
    const timingSet = new Set(rituals.map((r) => r.schedule_hint));
    return ['All', ...Array.from(timingSet).sort()];
  }, [rituals]);

  // Filter rituals
  const filteredRituals = useMemo(() => {
    return rituals.filter((ritual) => {
      const matchesSearch =
        searchQuery === '' ||
        ritual.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ritual.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ritual.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        ritual.ingredients.some((ing) => ing.toLowerCase().includes(searchQuery.toLowerCase())) ||
        ritual.psalms.some((psalm) => psalm.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'All' || ritual.category === selectedCategory;

      const matchesTiming =
        selectedTiming === 'All' || ritual.schedule_hint === selectedTiming;

      return matchesSearch && matchesCategory && matchesTiming;
    });
  }, [searchQuery, selectedCategory, selectedTiming, rituals]);

  const handleCardClick = useCallback((ritual: HoodooRitual) => {
    setSelectedRitual(ritual);
    setDialogOpen(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false);
    setTimeout(() => setSelectedRitual(null), 300);
  }, []);

  const toggleBookmark = useCallback((id: string) => {
    setBookmarkedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const toggleCompleted = useCallback((id: string) => {
    setCompletedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const getRandomRitual = useCallback(() => {
    if (filteredRituals.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredRituals.length);
      handleCardClick(filteredRituals[randomIndex]);
    }
  }, [filteredRituals, handleCardClick]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'protection':
        return <Shield size={16} />;
      case 'money':
        return <Sparkles size={16} />;
      case 'health':
        return <Heart size={16} />;
      case 'court':
        return <Scale size={16} />;
      case 'love':
        return <Heart size={16} />;
      case 'peace':
        return <Wind size={16} />;
      case 'road_opener':
        return <Target size={16} />;
      case 'ancestors':
        return <Users size={16} />;
      case 'cleansing':
        return <Leaf size={16} />;
      case 'focus':
        return <Zap size={16} />;
      default:
        return <Star size={16} />;
    }
  };

  const getTimingIcon = (timing: string) => {
    switch (timing) {
      case 'new_moon':
        return <Moon size={14} />;
      case 'full_moon':
        return <Moon size={14} />;
      case 'friday':
      case 'monday':
        return <Calendar size={14} />;
      case 'daily':
        return <Sun size={14} />;
      case 'as_needed':
        return <Star size={14} />;
      default:
        return <Calendar size={14} />;
    }
  };

  const formatTiming = (timing: string) => {
    return timing.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <Container>
      <Header>
        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
          <Flame size={48} color="#fef3c7" style={{ animation: `${candleFlicker} 2s ease-in-out infinite` }} />
          <Box>
            <HeaderTitle>Hoodoo Ritual Library</HeaderTitle>
            <HeaderSubtitle>
              Explore {rituals.length} traditional rootwork practices and spiritual rituals
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
            placeholder="Search by title, category, ingredients, or psalms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="#b45309" size={20} />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton onClick={() => setSearchQuery('')} size="small">
                    <X color="#b45309" size={20} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <RandomButton onClick={getRandomRitual} startIcon={<Shuffle size={20} />}>
          Random Ritual
        </RandomButton>
      </Stack>

      {/* Category Filters */}
      <FilterChipsContainer>
        <Typography variant="body2" sx={{ color: '#b45309', fontWeight: 600, mr: 1 }}>
          Category:
        </Typography>
        {categories.map((category) => (
          <StyledChip
            key={category}
            label={category === 'All' ? 'All' : category.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            icon={category !== 'All' ? getCategoryIcon(category) : undefined}
            active={selectedCategory === category ? 1 : 0}
            onClick={() => setSelectedCategory(category)}
          />
        ))}
      </FilterChipsContainer>

      {/* Timing Filters */}
      <FilterChipsContainer>
        <Typography variant="body2" sx={{ color: '#b45309', fontWeight: 600, mr: 1 }}>
          Timing:
        </Typography>
        {timings.map((timing) => (
          <StyledChip
            key={timing}
            label={timing === 'All' ? 'All' : formatTiming(timing)}
            icon={timing !== 'All' ? getTimingIcon(timing) : undefined}
            active={selectedTiming === timing ? 1 : 0}
            onClick={() => setSelectedTiming(timing)}
          />
        ))}
      </FilterChipsContainer>

      {/* Stats */}
      <Box mb={3}>
        <Typography
          variant="h6"
          sx={{
            color: '#b45309',
            fontWeight: 700,
            mb: 1,
          }}
        >
          Showing {filteredRituals.length} of {rituals.length} rituals
          {bookmarkedIds.size > 0 && ` • ${bookmarkedIds.size} saved`}
          {completedIds.size > 0 && ` • ${completedIds.size} completed`}
        </Typography>
      </Box>

      {/* Ritual Grid */}
      <Grid container spacing={3}>
        {filteredRituals.map((ritual) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={ritual.id}>
            <RitualCard onClick={() => handleCardClick(ritual)}>
              <CardContent>
                <Stack spacing={2}>
                  {/* Header with bookmark */}
                  <Stack direction="row" justifyContent="space-between" alignItems="start">
                    <Typography
                      variant="h6"
                      sx={{
                        color: '#fef3c7',
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        flex: 1,
                        lineHeight: 1.3,
                      }}
                    >
                      {ritual.title}
                    </Typography>
                    <IconButtonStyled
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(ritual.id);
                      }}
                    >
                      {bookmarkedIds.has(ritual.id) ? (
                        <BookmarkCheck size={20} />
                      ) : (
                        <Bookmark size={20} />
                      )}
                    </IconButtonStyled>
                  </Stack>

                  {/* Category & Timing Badges */}
                  <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                    <CategoryBadge
                      ritualcategory={ritual.category}
                      label={ritual.category.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      size="small"
                      icon={getCategoryIcon(ritual.category)}
                    />
                    <TimingBadge
                      label={formatTiming(ritual.schedule_hint)}
                      size="small"
                      icon={getTimingIcon(ritual.schedule_hint)}
                    />
                  </Stack>

                  {/* Psalm References */}
                  {ritual.psalms.length > 0 && (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <BookOpen size={16} color="#b45309" />
                      <Typography variant="body2" sx={{ color: 'rgba(254, 243, 199, 0.8)', fontSize: '0.85rem' }}>
                        Psalms: {ritual.psalms.join(', ')}
                      </Typography>
                    </Stack>
                  )}

                  {/* Ingredients count */}
                  <Typography variant="body2" sx={{ color: 'rgba(180, 83, 9, 0.9)', fontSize: '0.85rem' }}>
                    {ritual.ingredients.length} ingredient{ritual.ingredients.length !== 1 ? 's' : ''} • {ritual.steps.length} step{ritual.steps.length !== 1 ? 's' : ''}
                  </Typography>

                  {/* Completed indicator */}
                  {completedIds.has(ritual.id) && (
                    <Badge
                      badgeContent={<Sparkles size={12} />}
                      sx={{
                        '& .MuiBadge-badge': {
                          background: '#b45309',
                          color: '#fef3c7',
                        },
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: '#b45309',
                          fontWeight: 600,
                        }}
                      >
                        Completed
                      </Typography>
                    </Badge>
                  )}
                </Stack>
              </CardContent>
            </RitualCard>
          </Grid>
        ))}
      </Grid>

      {/* No Results */}
      {filteredRituals.length === 0 && (
        <Box textAlign="center" py={8}>
          <Flame size={64} color="#b45309" style={{ opacity: 0.5 }} />
          <Typography
            variant="h5"
            sx={{
              color: 'rgba(180, 83, 9, 0.7)',
              mt: 2,
              fontWeight: 600,
            }}
          >
            No rituals found
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'rgba(180, 83, 9, 0.5)',
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
        {selectedRitual && (
          <>
            <DialogTitle>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Flame size={32} color="#b45309" style={{ animation: `${candleFlicker} 2s ease-in-out infinite` }} />
                  <Typography
                    variant="h5"
                    sx={{ color: '#fef3c7', fontWeight: 700 }}
                  >
                    {selectedRitual.title}
                  </Typography>
                </Stack>
                <IconButton onClick={handleCloseDialog}>
                  <X color="#b45309" size={24} />
                </IconButton>
              </Stack>
            </DialogTitle>
            <DialogContent>
              <Stack spacing={3} mt={2}>
                {/* Category & Timing */}
                <Stack direction="row" spacing={2}>
                  <CategoryBadge
                    ritualcategory={selectedRitual.category}
                    label={selectedRitual.category.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    icon={getCategoryIcon(selectedRitual.category)}
                  />
                  <TimingBadge
                    label={formatTiming(selectedRitual.schedule_hint)}
                    icon={getTimingIcon(selectedRitual.schedule_hint)}
                  />
                </Stack>

                <Divider sx={{ borderColor: 'rgba(180, 83, 9, 0.3)' }} />

                {/* Psalms */}
                {selectedRitual.psalms.length > 0 && (
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: 'rgba(254, 243, 199, 0.7)', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                      <BookOpen size={18} color="#b45309" />
                      Psalms
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                      {selectedRitual.psalms.map((psalm) => (
                        <Chip
                          key={psalm}
                          label={`Psalm ${psalm}`}
                          sx={{
                            background: 'rgba(180, 83, 9, 0.3)',
                            color: '#fef3c7',
                            border: '1px solid rgba(180, 83, 9, 0.5)',
                            fontWeight: 600,
                          }}
                        />
                      ))}
                    </Stack>
                  </Box>
                )}

                {/* Ingredients */}
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: 'rgba(254, 243, 199, 0.7)', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <Leaf size={18} color="#b45309" />
                    Ingredients
                  </Typography>
                  <Stack spacing={1}>
                    {selectedRitual.ingredients.map((ingredient, index) => (
                      <Typography
                        key={index}
                        variant="body2"
                        sx={{
                          color: '#ffffff',
                          pl: 2,
                          '&::before': {
                            content: '"• "',
                            color: '#b45309',
                            fontWeight: 700,
                          },
                        }}
                      >
                        {ingredient}
                      </Typography>
                    ))}
                  </Stack>
                </Box>

                {/* Steps */}
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: 'rgba(254, 243, 199, 0.7)', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <Star size={18} color="#b45309" />
                    Steps
                  </Typography>
                  <Stack spacing={1.5}>
                    {selectedRitual.steps.map((step, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          gap: 2,
                          alignItems: 'start',
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#b45309',
                            fontWeight: 700,
                            minWidth: '24px',
                          }}
                        >
                          {index + 1}.
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#ffffff', flex: 1 }}>
                          {step}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>

                {/* Safety Notes */}
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: 'rgba(254, 243, 199, 0.7)', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <Shield size={18} color="#b45309" />
                    Safety Notes
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#ffffff' }}>
                    {selectedRitual.safety_notes}
                  </Typography>
                </Box>

                {/* Tags */}
                {selectedRitual.tags.length > 0 && (
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: 'rgba(254, 243, 199, 0.7)', mb: 1 }}
                    >
                      Tags
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                      {selectedRitual.tags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          sx={{
                            background: 'rgba(139, 92, 246, 0.3)',
                            color: '#e9d5ff',
                            border: '1px solid rgba(139, 92, 246, 0.5)',
                            fontSize: '0.75rem',
                          }}
                        />
                      ))}
                    </Stack>
                  </Box>
                )}
              </Stack>
            </DialogContent>
            <DialogActions sx={{ padding: '16px 24px' }}>
              <Button
                onClick={() => toggleCompleted(selectedRitual.id)}
                variant={completedIds.has(selectedRitual.id) ? 'outlined' : 'contained'}
                sx={{
                  background: completedIds.has(selectedRitual.id)
                    ? 'transparent'
                    : 'linear-gradient(135deg, #b45309 0%, #92400e 100%)',
                  color: '#fef3c7',
                  borderColor: '#b45309',
                  '&:hover': {
                    background: completedIds.has(selectedRitual.id)
                      ? 'rgba(180, 83, 9, 0.1)'
                      : 'linear-gradient(135deg, #92400e 0%, #b45309 100%)',
                  },
                }}
                startIcon={<Sparkles size={20} />}
              >
                {completedIds.has(selectedRitual.id)
                  ? 'Mark Incomplete'
                  : 'Mark Complete'}
              </Button>
              <Button
                onClick={() => toggleBookmark(selectedRitual.id)}
                variant="outlined"
                sx={{
                  borderColor: '#b45309',
                  color: '#fef3c7',
                  '&:hover': {
                    borderColor: '#fef3c7',
                    background: 'rgba(180, 83, 9, 0.1)',
                  },
                }}
                startIcon={
                  bookmarkedIds.has(selectedRitual.id) ? (
                    <BookmarkCheck size={20} />
                  ) : (
                    <Bookmark size={20} />
                  )
                }
              >
                {bookmarkedIds.has(selectedRitual.id) ? 'Saved' : 'Save'}
              </Button>
            </DialogActions>
          </>
        )}
      </StyledDialog>
    </Container>
  );
});

HoodooRitualLibrary.displayName = 'HoodooRitualLibrary';

export { HoodooRitualLibrary };
export default HoodooRitualLibrary;
