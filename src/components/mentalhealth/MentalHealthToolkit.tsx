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
  Badge,
  Grid,
  styled,
  keyframes,
} from '@mui/material';
import {
  Brain,
  Heart,
  Shield,
  Sparkles,
  Search,
  Bookmark,
  CheckCircle2,
  Shuffle,
  X,
} from 'lucide-react';
import mentalHealthData from '../../data/mentalHealthIdeas.json';

// Keyframe animations
const breathe = keyframes`
  0%, 100% { opacity: 0.9; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.02); }
`;

const gentlePulse = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(167, 139, 250, 0.3); }
  50% { box-shadow: 0 0 30px rgba(196, 181, 253, 0.5); }
`;

// Styled components
const Container = styled(Box)({
  minHeight: '100vh',
  backgroundColor: '#0a0812',
  padding: '2rem',
});

const Header = styled(Box)({
  background: 'linear-gradient(135deg, #a78bfa 0%, #c4b5fd 100%)',
  borderRadius: '16px',
  padding: '2rem',
  marginBottom: '2rem',
  animation: `${breathe} 4s ease-in-out infinite, ${gentlePulse} 3s ease-in-out infinite`,
  color: '#0a0812',
});

const CategoryChipsContainer = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5rem',
  marginBottom: '1.5rem',
});

const StyledChip = styled(Chip)<{ selected?: boolean }>(({ selected }) => ({
  backgroundColor: selected ? '#a78bfa' : '#1a1028',
  color: selected ? '#0a0812' : '#c4b5fd',
  borderColor: '#a78bfa',
  border: `1px solid ${selected ? '#a78bfa' : '#3f3356'}`,
  '&:hover': {
    backgroundColor: selected ? '#c4b5fd' : '#2a1838',
  },
  transition: 'all 0.3s ease',
}));

const IdeaCard = styled(Card)({
  backgroundColor: '#1a1028',
  borderRadius: '12px',
  border: '1px solid #3f3356',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: '#a78bfa',
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 16px rgba(167, 139, 250, 0.2)',
  },
});

const SearchField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#1a1028',
    color: '#c4b5fd',
    borderRadius: '12px',
    '& fieldset': {
      borderColor: '#3f3356',
    },
    '&:hover fieldset': {
      borderColor: '#a78bfa',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#a78bfa',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#9ca3af',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#a78bfa',
  },
});

const EffortBadge = styled(Chip)<{ effortlevel: number }>(({ effortlevel }) => {
  const colors = {
    1: { bg: '#065f46', color: '#6ee7b7' }, // easy - green
    2: { bg: '#92400e', color: '#fcd34d' }, // medium - yellow
    3: { bg: '#7c2d12', color: '#fca5a5' }, // high - red
  };
  const colorScheme = colors[effortlevel as keyof typeof colors] || colors[1];
  return {
    backgroundColor: colorScheme.bg,
    color: colorScheme.color,
    fontSize: '0.75rem',
    height: '20px',
  };
});

const ActionButton = styled(IconButton)({
  color: '#c4b5fd',
  '&:hover': {
    color: '#a78bfa',
    backgroundColor: 'rgba(167, 139, 250, 0.1)',
  },
});

const RandomButton = styled(Button)({
  backgroundColor: '#a78bfa',
  color: '#0a0812',
  padding: '0.75rem 1.5rem',
  borderRadius: '12px',
  fontWeight: 600,
  '&:hover': {
    backgroundColor: '#c4b5fd',
  },
  marginBottom: '1.5rem',
});

const StyledDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    backgroundColor: '#1a1028',
    color: '#c4b5fd',
    borderRadius: '16px',
    border: '1px solid #a78bfa',
  },
});

interface Idea {
  text: string;
  effort: number;
  description: string;
}

interface Category {
  id: string;
  title: string;
  color: string;
  items: Idea[];
}

const effortLabels = {
  1: 'Easy',
  2: 'Medium',
  3: 'High',
};

const MentalHealthToolkit: React.FC = React.memo(() => {
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [selectedEfforts, setSelectedEfforts] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarkedIdeas, setBookmarkedIdeas] = useState<Set<string>>(new Set());
  const [completedIdeas, setCompletedIdeas] = useState<Set<string>>(new Set());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<{ idea: Idea; category: Category } | null>(null);

  const categories = mentalHealthData.categories as Category[];

  const handleCategoryToggle = useCallback((categoryId: string) => {
    setSelectedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  }, []);

  const handleEffortToggle = useCallback((effort: number) => {
    setSelectedEfforts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(effort)) {
        newSet.delete(effort);
      } else {
        newSet.add(effort);
      }
      return newSet;
    });
  }, []);

  const handleBookmarkToggle = useCallback((ideaText: string) => {
    setBookmarkedIdeas((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(ideaText)) {
        newSet.delete(ideaText);
      } else {
        newSet.add(ideaText);
      }
      return newSet;
    });
  }, []);

  const handleCompletedToggle = useCallback((ideaText: string) => {
    setCompletedIdeas((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(ideaText)) {
        newSet.delete(ideaText);
      } else {
        newSet.add(ideaText);
      }
      return newSet;
    });
  }, []);

  const handleOpenDialog = useCallback((idea: Idea, category: Category) => {
    setSelectedIdea({ idea, category });
    setDialogOpen(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false);
    setSelectedIdea(null);
  }, []);

  const filteredIdeas = useMemo(() => {
    const results: Array<{ idea: Idea; category: Category }> = [];

    categories.forEach((category) => {
      // Filter by category
      if (selectedCategories.size > 0 && !selectedCategories.has(category.id)) {
        return;
      }

      category.items.forEach((idea) => {
        // Filter by effort level
        if (selectedEfforts.size > 0 && !selectedEfforts.has(idea.effort)) {
          return;
        }

        // Filter by search query
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          const matchesText = idea.text.toLowerCase().includes(query);
          const matchesDescription = idea.description.toLowerCase().includes(query);
          const matchesCategory = category.title.toLowerCase().includes(query);

          if (!matchesText && !matchesDescription && !matchesCategory) {
            return;
          }
        }

        results.push({ idea, category });
      });
    });

    return results;
  }, [categories, selectedCategories, selectedEfforts, searchQuery]);

  const handleRandomIdea = useCallback(() => {
    if (filteredIdeas.length === 0) return;
    const randomIndex = Math.floor(Math.random() * filteredIdeas.length);
    const { idea, category } = filteredIdeas[randomIndex];
    handleOpenDialog(idea, category);
  }, [filteredIdeas, handleOpenDialog]);

  const getCategoryIcon = (categoryId: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      crisis: <Shield size={20} />,
      grounding: <Heart size={20} />,
      breath: <Sparkles size={20} />,
      body: <Brain size={20} />,
      sensory: <Sparkles size={20} />,
      comfort: <Heart size={20} />,
      cognitive: <Brain size={20} />,
      social: <Heart size={20} />,
      distraction: <Sparkles size={20} />,
      selfcare: <Heart size={20} />,
    };
    return iconMap[categoryId] || <Brain size={20} />;
  };

  return (
    <Container>
      <Header>
        <Box display="flex" alignItems="center" gap={2} mb={1}>
          <Brain size={40} />
          <Typography variant="h3" fontWeight={700}>
            Mental Health Toolkit
          </Typography>
        </Box>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          {mentalHealthData.total_ideas} evidence-based techniques for your wellbeing
        </Typography>
      </Header>

      {/* Random Idea Generator */}
      <Box display="flex" justifyContent="center" alignItems="center">
        <RandomButton
          startIcon={<Shuffle size={20} />}
          onClick={handleRandomIdea}
          disabled={filteredIdeas.length === 0}
        >
          Get Random Idea
        </RandomButton>
      </Box>

      {/* Search */}
      <Box mb={2}>
        <SearchField
          fullWidth
          placeholder="Search techniques, descriptions, or categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: <Search size={20} style={{ marginRight: '8px', color: '#9ca3af' }} />,
          }}
        />
      </Box>

      {/* Category Filters */}
      <Box mb={2}>
        <Typography variant="subtitle2" sx={{ color: '#c4b5fd', mb: 1 }}>
          Filter by Category:
        </Typography>
        <CategoryChipsContainer>
          {categories.map((category) => (
            <StyledChip
              key={category.id}
              label={category.title}
              icon={getCategoryIcon(category.id) as any}
              onClick={() => handleCategoryToggle(category.id)}
              selected={selectedCategories.has(category.id)}
              variant="outlined"
            />
          ))}
        </CategoryChipsContainer>
      </Box>

      {/* Effort Level Filters */}
      <Box mb={3}>
        <Typography variant="subtitle2" sx={{ color: '#c4b5fd', mb: 1 }}>
          Filter by Effort Level:
        </Typography>
        <CategoryChipsContainer>
          {[1, 2, 3].map((effort) => (
            <StyledChip
              key={effort}
              label={effortLabels[effort as keyof typeof effortLabels]}
              onClick={() => handleEffortToggle(effort)}
              selected={selectedEfforts.has(effort)}
              variant="outlined"
            />
          ))}
        </CategoryChipsContainer>
      </Box>

      {/* Results Count */}
      <Typography variant="body2" sx={{ color: '#9ca3af', mb: 2 }}>
        Showing {filteredIdeas.length} technique{filteredIdeas.length !== 1 ? 's' : ''}
      </Typography>

      {/* Ideas Grid */}
      <Grid container spacing={2}>
        {filteredIdeas.map(({ idea, category }, index) => {
          const ideaKey = `${category.id}-${idea.text}`;
          const isBookmarked = bookmarkedIdeas.has(ideaKey);
          const isCompleted = completedIdeas.has(ideaKey);

          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <IdeaCard>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                    <Box flex={1}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: '#6b7280',
                          fontSize: '0.75rem',
                          mb: 0.5,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                        }}
                      >
                        {getCategoryIcon(category.id)}
                        {category.title}
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          color: '#c4b5fd',
                          fontSize: '1rem',
                          fontWeight: 600,
                          mb: 1,
                          textDecoration: isCompleted ? 'line-through' : 'none',
                          opacity: isCompleted ? 0.6 : 1,
                        }}
                      >
                        {idea.text}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography
                    variant="body2"
                    sx={{
                      color: '#9ca3af',
                      fontSize: '0.875rem',
                      mb: 1.5,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {idea.description}
                  </Typography>

                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <EffortBadge
                      label={effortLabels[idea.effort as keyof typeof effortLabels]}
                      size="small"
                      effortlevel={idea.effort}
                    />

                    <Box display="flex" gap={0.5}>
                      <ActionButton
                        size="small"
                        onClick={() => handleBookmarkToggle(ideaKey)}
                      >
                        <Badge
                          color="secondary"
                          variant="dot"
                          invisible={!isBookmarked}
                        >
                          <Bookmark
                            size={18}
                            fill={isBookmarked ? '#a78bfa' : 'none'}
                          />
                        </Badge>
                      </ActionButton>

                      <ActionButton
                        size="small"
                        onClick={() => handleCompletedToggle(ideaKey)}
                      >
                        <CheckCircle2
                          size={18}
                          fill={isCompleted ? '#6ee7b7' : 'none'}
                          color={isCompleted ? '#6ee7b7' : '#c4b5fd'}
                        />
                      </ActionButton>

                      <ActionButton
                        size="small"
                        onClick={() => handleOpenDialog(idea, category)}
                      >
                        <Sparkles size={18} />
                      </ActionButton>
                    </Box>
                  </Box>
                </CardContent>
              </IdeaCard>
            </Grid>
          );
        })}
      </Grid>

      {/* No Results */}
      {filteredIdeas.length === 0 && (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          py={8}
        >
          <Brain size={64} color="#3f3356" />
          <Typography variant="h6" sx={{ color: '#9ca3af', mt: 2 }}>
            No techniques found
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
        maxWidth="sm"
        fullWidth
      >
        {selectedIdea && (
          <>
            <DialogTitle sx={{ borderBottom: '1px solid #3f3356' }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center" gap={1}>
                  {getCategoryIcon(selectedIdea.category.id)}
                  <Typography variant="h6" sx={{ color: '#c4b5fd' }}>
                    {selectedIdea.idea.text}
                  </Typography>
                </Box>
                <IconButton onClick={handleCloseDialog} sx={{ color: '#c4b5fd' }}>
                  <X size={20} />
                </IconButton>
              </Box>
            </DialogTitle>

            <DialogContent sx={{ mt: 2 }}>
              <Typography variant="subtitle2" sx={{ color: '#a78bfa', mb: 1 }}>
                Category
              </Typography>
              <Typography variant="body1" sx={{ color: '#c4b5fd', mb: 2 }}>
                {selectedIdea.category.title}
              </Typography>

              <Typography variant="subtitle2" sx={{ color: '#a78bfa', mb: 1 }}>
                Description
              </Typography>
              <Typography variant="body1" sx={{ color: '#c4b5fd', mb: 2 }}>
                {selectedIdea.idea.description}
              </Typography>

              <Typography variant="subtitle2" sx={{ color: '#a78bfa', mb: 1 }}>
                Effort Level
              </Typography>
              <EffortBadge
                label={effortLabels[selectedIdea.idea.effort as keyof typeof effortLabels]}
                size="small"
                effortlevel={selectedIdea.idea.effort}
              />
            </DialogContent>

            <DialogActions sx={{ borderTop: '1px solid #3f3356', p: 2 }}>
              <Button
                onClick={() => {
                  const ideaKey = `${selectedIdea.category.id}-${selectedIdea.idea.text}`;
                  handleBookmarkToggle(ideaKey);
                }}
                sx={{ color: '#a78bfa' }}
                startIcon={
                  <Bookmark
                    size={18}
                    fill={
                      bookmarkedIdeas.has(
                        `${selectedIdea.category.id}-${selectedIdea.idea.text}`
                      )
                        ? '#a78bfa'
                        : 'none'
                    }
                  />
                }
              >
                {bookmarkedIdeas.has(
                  `${selectedIdea.category.id}-${selectedIdea.idea.text}`
                )
                  ? 'Unbookmark'
                  : 'Bookmark'}
              </Button>
              <Button
                onClick={() => {
                  const ideaKey = `${selectedIdea.category.id}-${selectedIdea.idea.text}`;
                  handleCompletedToggle(ideaKey);
                }}
                sx={{ color: '#6ee7b7' }}
                startIcon={<CheckCircle2 size={18} />}
              >
                {completedIdeas.has(
                  `${selectedIdea.category.id}-${selectedIdea.idea.text}`
                )
                  ? 'Mark Incomplete'
                  : 'Mark Complete'}
              </Button>
            </DialogActions>
          </>
        )}
      </StyledDialog>
    </Container>
  );
});

MentalHealthToolkit.displayName = 'MentalHealthToolkit';

export default MentalHealthToolkit;
