import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  IconButton,
  Stack,
  styled,
  keyframes,
  alpha,
} from '@mui/material';
import {
  Search,
  Heart,
  Activity,
  Moon,
  Droplets,
  Sparkles,
  Wind,
  Zap,
  Home,
  ClipboardList,
  Clock,
  Target,
  BookmarkPlus,
  BookmarkCheck,
  CheckCircle2,
  Circle,
  Shuffle,
  X,
} from 'lucide-react';
import healthWellnessData from '../../data/health_wellness_ideas.json';

// Interfaces
interface HealthWellnessItem {
  id: string;
  title: string;
  category: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  time_required: string;
  tools_needed: string[];
  benefits: string[];
  best_for: string[];
  instructions: string[];
}

// Keyframe animations
const pulseGlow = keyframes`
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.02);
  }
`;

const heartbeat = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.05);
  }
  50% {
    transform: scale(1);
  }
  75% {
    transform: scale(1.03);
  }
`;

// Styled components
const WellnessContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: `linear-gradient(135deg, #0a0812 0%, #1a1028 100%)`,
  padding: theme.spacing(3),
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha('#14b8a6', 0.15)} 0%, ${alpha('#2dd4bf', 0.1)} 100%)`,
  borderRadius: theme.spacing(2),
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  border: `1px solid ${alpha('#14b8a6', 0.2)}`,
  animation: `${pulseGlow} 3s ease-in-out infinite`,
}));

const HeaderTitle = styled(Typography)(({ theme }) => ({
  background: 'linear-gradient(135deg, #14b8a6 0%, #2dd4bf 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  '& svg': {
    animation: `${heartbeat} 2s ease-in-out infinite`,
  },
}));

const CategoryChip = styled(Chip)<{ selected?: boolean }>(({ theme, selected }) => ({
  backgroundColor: selected ? alpha('#14b8a6', 0.3) : alpha('#1a1028', 0.5),
  color: selected ? '#2dd4bf' : '#94a3b8',
  borderColor: selected ? '#14b8a6' : alpha('#94a3b8', 0.2),
  border: '1px solid',
  '&:hover': {
    backgroundColor: selected ? alpha('#14b8a6', 0.4) : alpha('#1a1028', 0.7),
    borderColor: '#14b8a6',
  },
  transition: 'all 0.3s ease',
}));

const WellnessCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha('#1a1028', 0.8)} 0%, ${alpha('#0a0812', 0.9)} 100%)`,
  borderRadius: theme.spacing(2),
  border: `1px solid ${alpha('#14b8a6', 0.1)}`,
  transition: 'all 0.3s ease',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    transform: 'translateY(-4px)',
    borderColor: alpha('#14b8a6', 0.4),
    boxShadow: `0 8px 24px ${alpha('#14b8a6', 0.15)}`,
  },
}));

const DifficultyBadge = styled(Chip)<{ difficulty: string }>(({ theme, difficulty }) => {
  const colors = {
    beginner: '#22c55e',
    intermediate: '#f59e0b',
    advanced: '#ef4444',
  };
  const color = colors[difficulty as keyof typeof colors] || '#94a3b8';

  return {
    backgroundColor: alpha(color, 0.2),
    color: color,
    borderColor: alpha(color, 0.4),
    border: '1px solid',
    fontSize: '0.75rem',
    height: '24px',
  };
});

const TimeBadge = styled(Chip)(({ theme }) => ({
  backgroundColor: alpha('#14b8a6', 0.2),
  color: '#2dd4bf',
  borderColor: alpha('#14b8a6', 0.3),
  border: '1px solid',
  fontSize: '0.75rem',
  height: '24px',
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    background: `linear-gradient(135deg, #1a1028 0%, #0a0812 100%)`,
    border: `1px solid ${alpha('#14b8a6', 0.2)}`,
    borderRadius: theme.spacing(2),
    maxWidth: '800px',
  },
}));

const ActionButton = styled(IconButton)<{ active?: boolean }>(({ theme, active }) => ({
  color: active ? '#14b8a6' : '#94a3b8',
  transition: 'all 0.3s ease',
  '&:hover': {
    color: '#2dd4bf',
    backgroundColor: alpha('#14b8a6', 0.1),
  },
}));

const RandomButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #14b8a6 0%, #2dd4bf 100%)',
  color: '#0a0812',
  fontWeight: 600,
  padding: theme.spacing(1.5, 3),
  borderRadius: theme.spacing(1),
  '&:hover': {
    background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
    transform: 'translateY(-2px)',
    boxShadow: `0 4px 12px ${alpha('#14b8a6', 0.3)}`,
  },
  transition: 'all 0.3s ease',
}));

// Category icons mapping
const categoryIcons: Record<string, React.ReactNode> = {
  nervous_system: <Wind size={20} />,
  sleep: <Moon size={20} />,
  pacing: <Activity size={20} />,
  movement: <Zap size={20} />,
  body_care: <Sparkles size={20} />,
  accessibility: <Home size={20} />,
  hydration: <Droplets size={20} />,
  medical_admin: <ClipboardList size={20} />,
};

const HealthWellnessCenter: React.FC = React.memo(() => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<HealthWellnessItem | null>(null);
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [randomItem, setRandomItem] = useState<HealthWellnessItem | null>(null);

  const items = healthWellnessData.items as HealthWellnessItem[];
  const categories = healthWellnessData.categories as Record<string, string>;

  // Filter and search logic
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'all' || item.difficulty === selectedDifficulty;
      const matchesSearch =
        searchQuery === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.benefits.some(b => b.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesDifficulty && matchesSearch;
    });
  }, [selectedCategory, selectedDifficulty, searchQuery, items]);

  // Random idea generator
  const handleRandomIdea = () => {
    const randomIndex = Math.floor(Math.random() * items.length);
    const item = items[randomIndex];
    setRandomItem(item);
    setSelectedItem(item);
  };

  // Bookmark toggle
  const toggleBookmark = (id: string) => {
    setBookmarked(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Completion toggle
  const toggleCompletion = (id: string) => {
    setCompleted(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <WellnessContainer>
      {/* Header */}
      <HeaderBox>
        <HeaderTitle variant="h3">
          <Heart size={48} fill="currentColor" />
          Health & Wellness Center
        </HeaderTitle>
        <Typography
          variant="body1"
          sx={{
            color: '#94a3b8',
            mt: 2,
            maxWidth: '800px'
          }}
        >
          Discover evidence-based techniques for nervous system regulation, sleep optimization,
          energy management, and holistic self-care. Your comprehensive wellness toolkit.
        </Typography>
      </HeaderBox>

      {/* Search and Random Generator */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search wellness practices..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} color="#14b8a6" />
              </InputAdornment>
            ),
            sx: {
              backgroundColor: alpha('#1a1028', 0.5),
              borderRadius: 2,
              '& fieldset': {
                borderColor: alpha('#14b8a6', 0.2),
              },
              '&:hover fieldset': {
                borderColor: alpha('#14b8a6', 0.4),
              },
              '&.Mui-focused fieldset': {
                borderColor: '#14b8a6',
              },
              color: '#e2e8f0',
            },
          }}
        />
        <RandomButton
          startIcon={<Shuffle size={20} />}
          onClick={handleRandomIdea}
          sx={{ minWidth: '200px' }}
        >
          Random Idea
        </RandomButton>
      </Stack>

      {/* Category Filters */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ color: '#14b8a6', mb: 1.5, fontWeight: 600 }}>
          Categories
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <CategoryChip
            label="All"
            selected={selectedCategory === 'all'}
            onClick={() => setSelectedCategory('all')}
          />
          {Object.entries(categories).map(([key, description]) => (
            <CategoryChip
              key={key}
              icon={categoryIcons[key] as React.ReactElement}
              label={key.replace(/_/g, ' ')}
              selected={selectedCategory === key}
              onClick={() => setSelectedCategory(key)}
              title={description}
            />
          ))}
        </Stack>
      </Box>

      {/* Difficulty Filters */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle2" sx={{ color: '#14b8a6', mb: 1.5, fontWeight: 600 }}>
          Difficulty Level
        </Typography>
        <Stack direction="row" spacing={1}>
          <CategoryChip
            label="All"
            selected={selectedDifficulty === 'all'}
            onClick={() => setSelectedDifficulty('all')}
          />
          <CategoryChip
            label="Beginner"
            selected={selectedDifficulty === 'beginner'}
            onClick={() => setSelectedDifficulty('beginner')}
          />
          <CategoryChip
            label="Intermediate"
            selected={selectedDifficulty === 'intermediate'}
            onClick={() => setSelectedDifficulty('intermediate')}
          />
          <CategoryChip
            label="Advanced"
            selected={selectedDifficulty === 'advanced'}
            onClick={() => setSelectedDifficulty('advanced')}
          />
        </Stack>
      </Box>

      {/* Results Count */}
      <Typography variant="body2" sx={{ color: '#94a3b8', mb: 2 }}>
        Showing {filteredItems.length} of {items.length} wellness practices
      </Typography>

      {/* Cards Grid */}
      <Grid container spacing={3}>
        {filteredItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <WellnessCard>
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Card Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <DifficultyBadge
                      label={item.difficulty}
                      difficulty={item.difficulty}
                      size="small"
                    />
                    <TimeBadge
                      icon={<Clock size={14} />}
                      label={item.time_required}
                      size="small"
                    />
                  </Box>
                  <Box>
                    <ActionButton
                      size="small"
                      active={bookmarked.has(item.id)}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(item.id);
                      }}
                    >
                      {bookmarked.has(item.id) ? <BookmarkCheck size={18} /> : <BookmarkPlus size={18} />}
                    </ActionButton>
                    <ActionButton
                      size="small"
                      active={completed.has(item.id)}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCompletion(item.id);
                      }}
                    >
                      {completed.has(item.id) ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                    </ActionButton>
                  </Box>
                </Box>

                {/* Category Icon & Title */}
                <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ mb: 1.5 }}>
                  <Box sx={{ color: '#14b8a6', pt: 0.5 }}>
                    {categoryIcons[item.category]}
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#e2e8f0',
                      fontWeight: 600,
                      fontSize: '1.1rem',
                      lineHeight: 1.3,
                    }}
                  >
                    {item.title}
                  </Typography>
                </Stack>

                {/* Description */}
                <Typography
                  variant="body2"
                  sx={{
                    color: '#94a3b8',
                    mb: 2,
                    flexGrow: 1,
                    lineHeight: 1.6,
                  }}
                >
                  {item.description}
                </Typography>

                {/* Benefits Preview */}
                <Box sx={{ mb: 2 }}>
                  <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                    {item.benefits.slice(0, 2).map((benefit, idx) => (
                      <Chip
                        key={idx}
                        label={benefit}
                        size="small"
                        sx={{
                          backgroundColor: alpha('#14b8a6', 0.1),
                          color: '#14b8a6',
                          fontSize: '0.7rem',
                          height: '22px',
                        }}
                      />
                    ))}
                    {item.benefits.length > 2 && (
                      <Chip
                        label={`+${item.benefits.length - 2} more`}
                        size="small"
                        sx={{
                          backgroundColor: alpha('#14b8a6', 0.1),
                          color: '#14b8a6',
                          fontSize: '0.7rem',
                          height: '22px',
                        }}
                      />
                    )}
                  </Stack>
                </Box>

                {/* View Details Button */}
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => setSelectedItem(item)}
                  sx={{
                    borderColor: alpha('#14b8a6', 0.3),
                    color: '#14b8a6',
                    '&:hover': {
                      borderColor: '#14b8a6',
                      backgroundColor: alpha('#14b8a6', 0.1),
                    },
                  }}
                >
                  View Details
                </Button>
              </CardContent>
            </WellnessCard>
          </Grid>
        ))}
      </Grid>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            color: '#94a3b8',
          }}
        >
          <Heart size={64} style={{ opacity: 0.3, marginBottom: '16px' }} />
          <Typography variant="h6" sx={{ mb: 1 }}>
            No wellness practices found
          </Typography>
          <Typography variant="body2">
            Try adjusting your filters or search query
          </Typography>
        </Box>
      )}

      {/* Detail Modal */}
      <StyledDialog
        open={selectedItem !== null}
        onClose={() => setSelectedItem(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedItem && (
          <>
            <DialogTitle sx={{ pb: 1 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box sx={{ flex: 1 }}>
                  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                    <Box sx={{ color: '#14b8a6' }}>
                      {categoryIcons[selectedItem.category]}
                    </Box>
                    <Typography
                      variant="h5"
                      sx={{
                        color: '#e2e8f0',
                        fontWeight: 600,
                      }}
                    >
                      {selectedItem.title}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                    <DifficultyBadge
                      label={selectedItem.difficulty}
                      difficulty={selectedItem.difficulty}
                    />
                    <TimeBadge
                      icon={<Clock size={14} />}
                      label={selectedItem.time_required}
                    />
                    <Chip
                      label={selectedItem.category.replace(/_/g, ' ')}
                      size="small"
                      sx={{
                        backgroundColor: alpha('#14b8a6', 0.2),
                        color: '#14b8a6',
                        textTransform: 'capitalize',
                      }}
                    />
                  </Stack>
                </Box>
                <IconButton
                  onClick={() => setSelectedItem(null)}
                  sx={{ color: '#94a3b8' }}
                >
                  <X size={24} />
                </IconButton>
              </Stack>
            </DialogTitle>

            <DialogContent dividers sx={{ borderColor: alpha('#14b8a6', 0.1) }}>
              {/* Description */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="body1"
                  sx={{
                    color: '#cbd5e1',
                    lineHeight: 1.7,
                  }}
                >
                  {selectedItem.description}
                </Typography>
              </Box>

              {/* Time Required */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: '#14b8a6',
                    mb: 1,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Clock size={18} />
                  Time Required
                </Typography>
                <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                  {selectedItem.time_required}
                </Typography>
              </Box>

              {/* Tools Needed */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: '#14b8a6',
                    mb: 1,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Target size={18} />
                  Tools Needed
                </Typography>
                <Stack spacing={1}>
                  {selectedItem.tools_needed.map((tool, idx) => (
                    <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <Box sx={{ color: '#14b8a6', pt: 0.3 }}>•</Box>
                      <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                        {tool}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>

              {/* Benefits */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: '#14b8a6',
                    mb: 1,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Sparkles size={18} />
                  Benefits
                </Typography>
                <Stack spacing={1}>
                  {selectedItem.benefits.map((benefit, idx) => (
                    <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <Box sx={{ color: '#14b8a6', pt: 0.3 }}>✓</Box>
                      <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                        {benefit}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>

              {/* Best For */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: '#14b8a6',
                    mb: 1,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Heart size={18} />
                  Best For
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {selectedItem.best_for.map((item, idx) => (
                    <Chip
                      key={idx}
                      label={item}
                      size="small"
                      sx={{
                        backgroundColor: alpha('#14b8a6', 0.15),
                        color: '#2dd4bf',
                        borderColor: alpha('#14b8a6', 0.3),
                        border: '1px solid',
                      }}
                    />
                  ))}
                </Stack>
              </Box>

              {/* Instructions */}
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: '#14b8a6',
                    mb: 1.5,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <ClipboardList size={18} />
                  Instructions
                </Typography>
                <Stack spacing={2}>
                  {selectedItem.instructions.map((instruction, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 2,
                        backgroundColor: alpha('#14b8a6', 0.05),
                        padding: 2,
                        borderRadius: 1,
                        borderLeft: `3px solid ${alpha('#14b8a6', 0.5)}`,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#14b8a6',
                          fontWeight: 600,
                          minWidth: '24px',
                        }}
                      >
                        {idx + 1}.
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#cbd5e1', lineHeight: 1.6 }}>
                        {instruction}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2, gap: 1 }}>
              <Button
                startIcon={bookmarked.has(selectedItem.id) ? <BookmarkCheck size={18} /> : <BookmarkPlus size={18} />}
                onClick={() => toggleBookmark(selectedItem.id)}
                sx={{
                  color: bookmarked.has(selectedItem.id) ? '#14b8a6' : '#94a3b8',
                  borderColor: bookmarked.has(selectedItem.id) ? '#14b8a6' : alpha('#94a3b8', 0.3),
                  '&:hover': {
                    borderColor: '#14b8a6',
                    backgroundColor: alpha('#14b8a6', 0.1),
                  },
                }}
                variant="outlined"
              >
                {bookmarked.has(selectedItem.id) ? 'Bookmarked' : 'Bookmark'}
              </Button>
              <Button
                startIcon={completed.has(selectedItem.id) ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                onClick={() => toggleCompletion(selectedItem.id)}
                sx={{
                  color: completed.has(selectedItem.id) ? '#22c55e' : '#94a3b8',
                  borderColor: completed.has(selectedItem.id) ? '#22c55e' : alpha('#94a3b8', 0.3),
                  '&:hover': {
                    borderColor: '#22c55e',
                    backgroundColor: alpha('#22c55e', 0.1),
                  },
                }}
                variant="outlined"
              >
                {completed.has(selectedItem.id) ? 'Completed' : 'Mark Complete'}
              </Button>
              <Box sx={{ flex: 1 }} />
              <Button
                onClick={() => setSelectedItem(null)}
                sx={{
                  backgroundColor: alpha('#14b8a6', 0.2),
                  color: '#14b8a6',
                  '&:hover': {
                    backgroundColor: alpha('#14b8a6', 0.3),
                  },
                }}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </StyledDialog>
    </WellnessContainer>
  );
});

HealthWellnessCenter.displayName = 'HealthWellnessCenter';

export default HealthWellnessCenter;
