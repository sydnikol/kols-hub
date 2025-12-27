import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Grid,
  Stack,
  styled,
  keyframes,
  alpha,
} from '@mui/material';
import {
  Moon,
  Flame,
  Sparkles,
  BookOpen,
  Heart,
  Shield,
  Scale,
  Leaf,
  Search,
  Bookmark,
  CheckCircle2,
  Shuffle,
  X,
  Clock,
  Scroll,
} from 'lucide-react';
import hoodooData from '../../data/hoodoo_spiritual_ideas.json';

// Keyframe animations
const candleFlicker = keyframes`
  0%, 100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  25% {
    opacity: 0.95;
    transform: scale(1.02) translateY(-1px);
  }
  50% {
    opacity: 0.9;
    transform: scale(0.98) translateY(1px);
  }
  75% {
    opacity: 0.97;
    transform: scale(1.01) translateY(-0.5px);
  }
`;

const mysticalGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(139, 92, 246, 0.3), 0 0 40px rgba(109, 40, 217, 0.2);
  }
  50% {
    box-shadow: 0 0 30px rgba(139, 92, 246, 0.5), 0 0 60px rgba(109, 40, 217, 0.3);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

// Styled components
const Container = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #0a0812 0%, #1a1028 100%)',
  padding: '2rem',
});

const Header = styled(Box)({
  background: 'linear-gradient(135deg, #4c1d95 0%, #6d28d9 100%)',
  borderRadius: '16px',
  padding: '2rem',
  marginBottom: '2rem',
  border: '1px solid rgba(139, 92, 246, 0.3)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(229, 231, 235, 0.1), transparent)',
    animation: `${shimmer} 3s infinite`,
  },
});

const HeaderIcon = styled(Box)({
  animation: `${candleFlicker} 2s ease-in-out infinite`,
  color: '#e5e7eb',
});

const CategoryChipsContainer = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5rem',
  marginBottom: '1.5rem',
});

const StyledChip = styled(Chip)<{ selected?: boolean }>(({ selected }) => ({
  backgroundColor: selected ? '#4c1d95' : alpha('#1a1028', 0.7),
  color: selected ? '#e5e7eb' : '#a78bfa',
  borderColor: selected ? '#6d28d9' : alpha('#4c1d95', 0.5),
  border: '1px solid',
  '&:hover': {
    backgroundColor: selected ? '#6d28d9' : alpha('#1a1028', 0.9),
    borderColor: '#8b5cf6',
  },
  transition: 'all 0.3s ease',
}));

const PracticeCard = styled(Card)({
  backgroundColor: alpha('#1a1028', 0.9),
  borderRadius: '12px',
  border: '1px solid rgba(76, 29, 149, 0.3)',
  transition: 'all 0.3s ease',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    borderColor: '#6d28d9',
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(109, 40, 217, 0.3)',
  },
});

const SearchField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    backgroundColor: alpha('#1a1028', 0.7),
    color: '#e5e7eb',
    borderRadius: '12px',
    '& fieldset': {
      borderColor: alpha('#4c1d95', 0.5),
    },
    '&:hover fieldset': {
      borderColor: '#6d28d9',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#8b5cf6',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#9ca3af',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#8b5cf6',
  },
});

const CategoryBadge = styled(Chip)({
  backgroundColor: alpha('#6d28d9', 0.2),
  color: '#c4b5fd',
  fontSize: '0.75rem',
  height: '24px',
  borderRadius: '6px',
  textTransform: 'capitalize',
});

const TraditionTag = styled(Chip)({
  backgroundColor: alpha('#4c1d95', 0.3),
  color: '#e5e7eb',
  fontSize: '0.7rem',
  height: '22px',
  borderRadius: '4px',
});

const ActionButton = styled(IconButton)<{ active?: boolean }>(({ active }) => ({
  color: active ? '#8b5cf6' : '#a78bfa',
  '&:hover': {
    color: '#c4b5fd',
    backgroundColor: alpha('#6d28d9', 0.2),
  },
  transition: 'all 0.3s ease',
}));

const RandomButton = styled(Button)({
  background: 'linear-gradient(135deg, #4c1d95 0%, #6d28d9 100%)',
  color: '#e5e7eb',
  padding: '0.75rem 1.5rem',
  borderRadius: '12px',
  fontWeight: 600,
  animation: `${mysticalGlow} 3s ease-in-out infinite`,
  '&:hover': {
    background: 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%)',
    transform: 'translateY(-2px)',
  },
  transition: 'all 0.3s ease',
  marginBottom: '1.5rem',
});

const StyledDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    background: 'linear-gradient(135deg, #1a1028 0%, #0a0812 100%)',
    color: '#e5e7eb',
    borderRadius: '16px',
    border: '1px solid rgba(139, 92, 246, 0.3)',
    maxWidth: '800px',
  },
});

interface HoodooItem {
  id: string;
  title: string;
  category: string;
  description: string;
  tradition: string;
  ingredients: string[];
  best_timing: string;
  instructions: string[];
  intentions: string;
  notes: string;
}

// Category icons mapping
const categoryIcons: Record<string, React.ReactNode> = {
  road_opening: <BookOpen size={20} />,
  ancestor_work: <Flame size={20} />,
  money_stability: <Sparkles size={20} />,
  cleansing: <Sparkles size={20} />,
  love: <Heart size={20} />,
  protection: <Shield size={20} />,
  justice: <Scale size={20} />,
  healing: <Leaf size={20} />,
};

const HoodooSpiritualGuide: React.FC = React.memo(() => {
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [savedPractices, setSavedPractices] = useState<Set<string>>(new Set());
  const [practicedItems, setPracticedItems] = useState<Set<string>>(new Set());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<HoodooItem | null>(null);

  const items = hoodooData.items as HoodooItem[];
  const categories = hoodooData.categories as Record<string, string>;

  const handleCategoryToggle = useCallback((category: string) => {
    setSelectedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  }, []);

  const handleSavedToggle = useCallback((id: string) => {
    setSavedPractices((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const handlePracticedToggle = useCallback((id: string) => {
    setPracticedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const handleOpenDialog = useCallback((item: HoodooItem) => {
    setSelectedItem(item);
    setDialogOpen(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false);
    setSelectedItem(null);
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Filter by category
      if (selectedCategories.size > 0 && !selectedCategories.has(item.category)) {
        return false;
      }

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesDescription = item.description.toLowerCase().includes(query);
        const matchesTradition = item.tradition.toLowerCase().includes(query);
        const matchesCategory = item.category.toLowerCase().replace(/_/g, ' ').includes(query);
        const matchesIngredients = item.ingredients.some(ing =>
          ing.toLowerCase().includes(query)
        );

        if (!matchesTitle && !matchesDescription && !matchesTradition &&
            !matchesCategory && !matchesIngredients) {
          return false;
        }
      }

      return true;
    });
  }, [items, selectedCategories, searchQuery]);

  const handleRandomPractice = useCallback(() => {
    if (filteredItems.length === 0) return;
    const randomIndex = Math.floor(Math.random() * filteredItems.length);
    const item = filteredItems[randomIndex];
    handleOpenDialog(item);
  }, [filteredItems, handleOpenDialog]);

  const getCategoryIcon = (category: string) => {
    return categoryIcons[category] || <Moon size={20} />;
  };

  return (
    <Container>
      {/* Header */}
      <Header>
        <Box display="flex" alignItems="center" gap={2} mb={1}>
          <HeaderIcon>
            <Flame size={48} />
          </HeaderIcon>
          <Typography
            variant="h3"
            fontWeight={700}
            sx={{ color: '#e5e7eb' }}
          >
            Hoodoo & Spiritual Guide
          </Typography>
        </Box>
        <Typography
          variant="h6"
          sx={{ color: alpha('#e5e7eb', 0.9), mt: 1 }}
        >
          {items.length} traditional practices for spiritual empowerment and guidance
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: alpha('#e5e7eb', 0.7), mt: 1, fontStyle: 'italic' }}
        >
          {hoodooData.disclaimer}
        </Typography>
      </Header>

      {/* Random Practice Generator */}
      <Box display="flex" justifyContent="center" alignItems="center">
        <RandomButton
          startIcon={<Shuffle size={20} />}
          onClick={handleRandomPractice}
          disabled={filteredItems.length === 0}
        >
          Get Random Practice
        </RandomButton>
      </Box>

      {/* Search */}
      <Box mb={2}>
        <SearchField
          fullWidth
          placeholder="Search practices, ingredients, traditions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: <Search size={20} style={{ marginRight: '8px', color: '#9ca3af' }} />,
          }}
        />
      </Box>

      {/* Category Filters */}
      <Box mb={3}>
        <Typography variant="subtitle2" sx={{ color: '#c4b5fd', mb: 1, fontWeight: 600 }}>
          Filter by Category:
        </Typography>
        <CategoryChipsContainer>
          {Object.entries(categories).map(([key, description]) => (
            <StyledChip
              key={key}
              label={key.replace(/_/g, ' ')}
              icon={getCategoryIcon(key) as any}
              onClick={() => handleCategoryToggle(key)}
              selected={selectedCategories.has(key)}
              variant="outlined"
              title={description}
            />
          ))}
        </CategoryChipsContainer>
      </Box>

      {/* Results Count */}
      <Typography variant="body2" sx={{ color: '#9ca3af', mb: 2 }}>
        Showing {filteredItems.length} practice{filteredItems.length !== 1 ? 's' : ''}
      </Typography>

      {/* Practices Grid */}
      <Grid container spacing={3}>
        {filteredItems.map((item) => {
          const isSaved = savedPractices.has(item.id);
          const isPracticed = practicedItems.has(item.id);

          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
              <PracticeCard>
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Header with badges */}
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
                    <Stack spacing={0.5} flex={1}>
                      <CategoryBadge
                        label={item.category.replace(/_/g, ' ')}
                        icon={getCategoryIcon(item.category) as any}
                        size="small"
                      />
                      <TraditionTag
                        label={item.tradition}
                        size="small"
                      />
                    </Stack>
                    <Stack direction="row" spacing={0.5}>
                      <ActionButton
                        size="small"
                        active={isSaved}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSavedToggle(item.id);
                        }}
                      >
                        <Bookmark
                          size={18}
                          fill={isSaved ? '#8b5cf6' : 'none'}
                        />
                      </ActionButton>
                      <ActionButton
                        size="small"
                        active={isPracticed}
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePracticedToggle(item.id);
                        }}
                      >
                        <CheckCircle2
                          size={18}
                          fill={isPracticed ? '#6ee7b7' : 'none'}
                          color={isPracticed ? '#6ee7b7' : '#a78bfa'}
                        />
                      </ActionButton>
                    </Stack>
                  </Box>

                  {/* Title */}
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#e5e7eb',
                      fontSize: '1rem',
                      fontWeight: 600,
                      mb: 1.5,
                      lineHeight: 1.3,
                      textDecoration: isPracticed ? 'line-through' : 'none',
                      opacity: isPracticed ? 0.7 : 1,
                    }}
                  >
                    {item.title}
                  </Typography>

                  {/* Description */}
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#9ca3af',
                      fontSize: '0.875rem',
                      mb: 2,
                      flexGrow: 1,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      lineHeight: 1.6,
                    }}
                  >
                    {item.description}
                  </Typography>

                  {/* View Details Button */}
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => handleOpenDialog(item)}
                    sx={{
                      borderColor: alpha('#6d28d9', 0.5),
                      color: '#c4b5fd',
                      '&:hover': {
                        borderColor: '#8b5cf6',
                        backgroundColor: alpha('#6d28d9', 0.1),
                      },
                    }}
                  >
                    View Details
                  </Button>
                </CardContent>
              </PracticeCard>
            </Grid>
          );
        })}
      </Grid>

      {/* No Results */}
      {filteredItems.length === 0 && (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          py={8}
        >
          <Moon size={64} color={alpha('#4c1d95', 0.5)} />
          <Typography variant="h6" sx={{ color: '#9ca3af', mt: 2 }}>
            No practices found
          </Typography>
          <Typography variant="body2" sx={{ color: '#6b7280' }}>
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
        {selectedItem && (
          <>
            <DialogTitle sx={{ borderBottom: `1px solid ${alpha('#4c1d95', 0.3)}`, pb: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box flex={1}>
                  <Stack direction="row" spacing={1.5} alignItems="center" mb={1.5}>
                    <Box sx={{ color: '#8b5cf6' }}>
                      {getCategoryIcon(selectedItem.category)}
                    </Box>
                    <Typography variant="h5" sx={{ color: '#e5e7eb', fontWeight: 600 }}>
                      {selectedItem.title}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <CategoryBadge
                      label={selectedItem.category.replace(/_/g, ' ')}
                      size="small"
                    />
                    <TraditionTag
                      label={selectedItem.tradition}
                      size="small"
                    />
                  </Stack>
                </Box>
                <IconButton onClick={handleCloseDialog} sx={{ color: '#9ca3af' }}>
                  <X size={24} />
                </IconButton>
              </Box>
            </DialogTitle>

            <DialogContent sx={{ mt: 2 }}>
              {/* Description */}
              <Box mb={3}>
                <Typography variant="body1" sx={{ color: '#cbd5e1', lineHeight: 1.7 }}>
                  {selectedItem.description}
                </Typography>
              </Box>

              {/* Tradition */}
              <Box mb={3}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: '#8b5cf6',
                    mb: 1,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Scroll size={18} />
                  Tradition
                </Typography>
                <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                  {selectedItem.tradition}
                </Typography>
              </Box>

              {/* Ingredients */}
              <Box mb={3}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: '#8b5cf6',
                    mb: 1,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Leaf size={18} />
                  Ingredients
                </Typography>
                <Stack spacing={1}>
                  {selectedItem.ingredients.map((ingredient, idx) => (
                    <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <Box sx={{ color: '#8b5cf6', pt: 0.3 }}>•</Box>
                      <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                        {ingredient}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>

              {/* Best Timing */}
              <Box mb={3}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: '#8b5cf6',
                    mb: 1,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Clock size={18} />
                  Best Timing
                </Typography>
                <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                  {selectedItem.best_timing}
                </Typography>
              </Box>

              {/* Instructions */}
              <Box mb={3}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: '#8b5cf6',
                    mb: 1.5,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <BookOpen size={18} />
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
                        backgroundColor: alpha('#6d28d9', 0.1),
                        padding: 2,
                        borderRadius: 1,
                        borderLeft: `3px solid ${alpha('#8b5cf6', 0.5)}`,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#8b5cf6',
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

              {/* Intentions */}
              <Box mb={3}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: '#8b5cf6',
                    mb: 1,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Sparkles size={18} />
                  Intentions
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#c4b5fd',
                    fontStyle: 'italic',
                    backgroundColor: alpha('#4c1d95', 0.2),
                    padding: 2,
                    borderRadius: 1,
                    borderLeft: `3px solid #8b5cf6`,
                  }}
                >
                  "{selectedItem.intentions}"
                </Typography>
              </Box>

              {/* Notes */}
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: '#8b5cf6',
                    mb: 1,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Moon size={18} />
                  Notes
                </Typography>
                <Typography variant="body2" sx={{ color: '#9ca3af', fontStyle: 'italic' }}>
                  {selectedItem.notes}
                </Typography>
              </Box>
            </DialogContent>

            <DialogActions sx={{ borderTop: `1px solid ${alpha('#4c1d95', 0.3)}`, p: 2, gap: 1 }}>
              <Button
                startIcon={
                  <Bookmark
                    size={18}
                    fill={savedPractices.has(selectedItem.id) ? '#8b5cf6' : 'none'}
                  />
                }
                onClick={() => handleSavedToggle(selectedItem.id)}
                sx={{
                  color: savedPractices.has(selectedItem.id) ? '#8b5cf6' : '#9ca3af',
                  borderColor: savedPractices.has(selectedItem.id)
                    ? '#8b5cf6'
                    : alpha('#9ca3af', 0.3),
                  '&:hover': {
                    borderColor: '#8b5cf6',
                    backgroundColor: alpha('#6d28d9', 0.1),
                  },
                }}
                variant="outlined"
              >
                {savedPractices.has(selectedItem.id) ? 'Saved' : 'Save'}
              </Button>
              <Button
                startIcon={
                  <CheckCircle2
                    size={18}
                    fill={practicedItems.has(selectedItem.id) ? '#6ee7b7' : 'none'}
                  />
                }
                onClick={() => handlePracticedToggle(selectedItem.id)}
                sx={{
                  color: practicedItems.has(selectedItem.id) ? '#6ee7b7' : '#9ca3af',
                  borderColor: practicedItems.has(selectedItem.id)
                    ? '#6ee7b7'
                    : alpha('#9ca3af', 0.3),
                  '&:hover': {
                    borderColor: '#6ee7b7',
                    backgroundColor: alpha('#6ee7b7', 0.1),
                  },
                }}
                variant="outlined"
              >
                {practicedItems.has(selectedItem.id) ? 'Practiced' : 'Mark Practiced'}
              </Button>
              <Box sx={{ flex: 1 }} />
              <Button
                onClick={handleCloseDialog}
                sx={{
                  backgroundColor: alpha('#6d28d9', 0.3),
                  color: '#e5e7eb',
                  '&:hover': {
                    backgroundColor: alpha('#6d28d9', 0.4),
                  },
                }}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </StyledDialog>
    </Container>
  );
});

HoodooSpiritualGuide.displayName = 'HoodooSpiritualGuide';

export { HoodooSpiritualGuide };
export default HoodooSpiritualGuide;
