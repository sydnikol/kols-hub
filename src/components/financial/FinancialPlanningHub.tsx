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
  Tooltip,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Wallet,
  DollarSign,
  PiggyBank,
  TrendingUp,
  Search,
  Bookmark,
  BookmarkCheck,
  Shuffle,
  X,
  CreditCard,
  Target,
  AlertTriangle,
  LineChart,
} from 'lucide-react';
import financialData from '../../data/financial_ideas.json';

// Interfaces
interface FinancialIdea {
  id: string;
  category: string;
  title: string;
  description: string;
  energy_level: 'low' | 'medium' | 'high';
}

// Keyframe Animations
const coinShimmer = keyframes`
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
`;

const pulseGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(251, 191, 36, 0.3);
  }
  50% {
    box-shadow: 0 0 30px rgba(251, 191, 36, 0.6);
  }
`;

// Styled Components
const Container = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #0a0812 0%, #1a1028 100%)',
  padding: '24px',
});

const Header = styled(Box)({
  background: 'linear-gradient(90deg, #fbbf24 0%, #f59e0b 50%, #fbbf24 100%)',
  backgroundSize: '200% auto',
  animation: `${coinShimmer} 3s linear infinite`,
  padding: '32px',
  borderRadius: '16px',
  marginBottom: '32px',
  boxShadow: '0 8px 32px rgba(251, 191, 36, 0.3)',
  '&:hover': {
    animation: `${coinShimmer} 1.5s linear infinite, ${pulseGlow} 2s ease-in-out infinite`,
  },
});

const HeaderContent = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  color: '#0a0812',
});

const SearchBox = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    color: '#fbbf24',
    '& fieldset': {
      borderColor: '#fbbf24',
    },
    '&:hover fieldset': {
      borderColor: '#f59e0b',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#f59e0b',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#fbbf24',
  },
  '& .MuiInputAdornment-root': {
    color: '#fbbf24',
  },
});

const FilterChip = styled(Chip)<{ active?: boolean }>(({ active }) => ({
  backgroundColor: active ? '#fbbf24' : 'rgba(251, 191, 36, 0.1)',
  color: active ? '#0a0812' : '#fbbf24',
  border: `1px solid ${active ? '#f59e0b' : '#fbbf24'}`,
  fontWeight: active ? 700 : 500,
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: active ? '#f59e0b' : 'rgba(251, 191, 36, 0.2)',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(251, 191, 36, 0.3)',
  },
}));

const IdeaCard = styled(Card)({
  backgroundColor: 'rgba(26, 16, 40, 0.8)',
  backdropFilter: 'blur(10px)',
  borderRadius: '12px',
  border: '1px solid rgba(251, 191, 36, 0.2)',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-4px)',
    borderColor: '#fbbf24',
    boxShadow: '0 8px 24px rgba(251, 191, 36, 0.2)',
  },
});

const EnergyBadge = styled(Chip)<{ energyLevel: string }>(({ energyLevel }) => {
  const colors = {
    low: { bg: 'rgba(34, 197, 94, 0.2)', border: '#22c55e', text: '#22c55e' },
    medium: { bg: 'rgba(251, 191, 36, 0.2)', border: '#fbbf24', text: '#fbbf24' },
    high: { bg: 'rgba(239, 68, 68, 0.2)', border: '#ef4444', text: '#ef4444' },
  };

  const color = colors[energyLevel as keyof typeof colors] || colors.medium;

  return {
    backgroundColor: color.bg,
    borderColor: color.border,
    color: color.text,
    border: `1px solid ${color.border}`,
    fontWeight: 600,
    fontSize: '0.75rem',
  };
});

const RandomButton = styled(Button)({
  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
  color: '#0a0812',
  fontWeight: 700,
  padding: '12px 24px',
  borderRadius: '8px',
  textTransform: 'none',
  fontSize: '1rem',
  '&:hover': {
    background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
    transform: 'scale(1.05)',
    boxShadow: '0 6px 20px rgba(251, 191, 36, 0.4)',
  },
  transition: 'all 0.3s ease',
});

const StyledDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    backgroundColor: '#1a1028',
    border: '1px solid #fbbf24',
    borderRadius: '16px',
    maxWidth: '600px',
  },
});

const DialogTitleStyled = styled(DialogTitle)({
  background: 'linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%)',
  color: '#0a0812',
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const DialogContentStyled = styled(DialogContent)({
  backgroundColor: '#1a1028',
  color: '#fbbf24',
  padding: '24px',
});

// Category Icons Mapping
const categoryIcons: Record<string, React.ReactNode> = {
  'Debt Strategies': <CreditCard size={24} />,
  'Income Planning': <TrendingUp size={24} />,
  'Saving Systems': <PiggyBank size={24} />,
  'Spending Rules': <DollarSign size={24} />,
  'Emergency Planning': <AlertTriangle size={24} />,
  'Budget Structures': <LineChart size={24} />,
};

// Main Component
const FinancialPlanningHub: React.FC = React.memo(() => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedEnergyLevel, setSelectedEnergyLevel] = useState<string>('All');
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<FinancialIdea | null>(null);

  const ideas = financialData.items as FinancialIdea[];

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(ideas.map(idea => idea.category)));
    return ['All', ...cats.sort()];
  }, [ideas]);

  const energyLevels = ['All', 'low', 'medium', 'high'];

  // Filter ideas
  const filteredIdeas = useMemo(() => {
    return ideas.filter(idea => {
      const matchesSearch = idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          idea.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          idea.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || idea.category === selectedCategory;
      const matchesEnergy = selectedEnergyLevel === 'All' || idea.energy_level === selectedEnergyLevel;

      return matchesSearch && matchesCategory && matchesEnergy;
    });
  }, [ideas, searchTerm, selectedCategory, selectedEnergyLevel]);

  // Random idea generator
  const handleRandomIdea = () => {
    if (filteredIdeas.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredIdeas.length);
      const randomIdea = filteredIdeas[randomIndex];
      setSelectedIdea(randomIdea);
      setDialogOpen(true);
    }
  };

  // Toggle bookmark
  const toggleBookmark = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setBookmarkedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Toggle completion
  const toggleCompletion = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setCompletedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Open dialog with idea details
  const handleCardClick = (idea: FinancialIdea) => {
    setSelectedIdea(idea);
    setDialogOpen(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedIdea(null);
  };

  return (
    <Container>
      {/* Header */}
      <Header>
        <HeaderContent>
          <Wallet size={48} />
          <Box flex={1}>
            <Typography variant="h3" fontWeight={800}>
              Financial Planning Hub
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, mt: 1 }}>
              Master your money with {ideas.length} financial ideas and strategies
            </Typography>
          </Box>
          <RandomButton
            startIcon={<Shuffle size={20} />}
            onClick={handleRandomIdea}
          >
            Random Idea
          </RandomButton>
        </HeaderContent>
      </Header>

      {/* Search */}
      <SearchBox
        fullWidth
        variant="outlined"
        placeholder="Search financial ideas..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search size={20} />
            </InputAdornment>
          ),
        }}
      />

      {/* Category Filters */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ color: '#fbbf24', mb: 2, fontWeight: 600 }}>
          Categories
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {categories.map(category => (
            <FilterChip
              key={category}
              label={category}
              active={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
              icon={categoryIcons[category] || <Target size={16} />}
            />
          ))}
        </Box>
      </Box>

      {/* Energy Level Filters */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ color: '#fbbf24', mb: 2, fontWeight: 600 }}>
          Energy Level
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {energyLevels.map(level => (
            <FilterChip
              key={level}
              label={level.charAt(0).toUpperCase() + level.slice(1)}
              active={selectedEnergyLevel === level}
              onClick={() => setSelectedEnergyLevel(level)}
            />
          ))}
        </Box>
      </Box>

      {/* Stats */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Chip
          icon={<Bookmark size={16} />}
          label={`${bookmarkedIds.size} Bookmarked`}
          sx={{
            backgroundColor: 'rgba(251, 191, 36, 0.15)',
            color: '#fbbf24',
            borderColor: '#fbbf24',
            border: '1px solid',
          }}
        />
        <Chip
          icon={<BookmarkCheck size={16} />}
          label={`${completedIds.size} Completed`}
          sx={{
            backgroundColor: 'rgba(34, 197, 94, 0.15)',
            color: '#22c55e',
            borderColor: '#22c55e',
            border: '1px solid',
          }}
        />
        <Chip
          label={`${filteredIdeas.length} Ideas Shown`}
          sx={{
            backgroundColor: 'rgba(251, 191, 36, 0.15)',
            color: '#fbbf24',
            borderColor: '#fbbf24',
            border: '1px solid',
          }}
        />
      </Box>

      {/* Ideas Grid */}
      <Grid container spacing={3}>
        {filteredIdeas.map(idea => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={idea.id}>
            <IdeaCard onClick={() => handleCardClick(idea)}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ color: '#fbbf24' }}>
                    {categoryIcons[idea.category] || <Wallet size={24} />}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title={bookmarkedIds.has(idea.id) ? 'Remove Bookmark' : 'Bookmark'}>
                      <IconButton
                        size="small"
                        onClick={(e) => toggleBookmark(idea.id, e)}
                        sx={{ color: bookmarkedIds.has(idea.id) ? '#fbbf24' : 'rgba(251, 191, 36, 0.3)' }}
                      >
                        {bookmarkedIds.has(idea.id) ? <Bookmark size={18} fill="#fbbf24" /> : <Bookmark size={18} />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={completedIds.has(idea.id) ? 'Mark Incomplete' : 'Mark Complete'}>
                      <IconButton
                        size="small"
                        onClick={(e) => toggleCompletion(idea.id, e)}
                        sx={{ color: completedIds.has(idea.id) ? '#22c55e' : 'rgba(34, 197, 94, 0.3)' }}
                      >
                        <BookmarkCheck size={18} fill={completedIds.has(idea.id) ? '#22c55e' : 'none'} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                <Typography
                  variant="h6"
                  sx={{
                    color: '#fbbf24',
                    fontWeight: 700,
                    mb: 1,
                    fontSize: '1rem',
                  }}
                >
                  {idea.title}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(251, 191, 36, 0.7)',
                    mb: 2,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {idea.description}
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip
                    label={idea.category}
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(251, 191, 36, 0.1)',
                      color: '#fbbf24',
                      fontSize: '0.7rem',
                      border: '1px solid rgba(251, 191, 36, 0.3)',
                    }}
                  />
                  <EnergyBadge
                    label={idea.energy_level.toUpperCase()}
                    size="small"
                    energyLevel={idea.energy_level}
                  />
                </Box>
              </CardContent>
            </IdeaCard>
          </Grid>
        ))}
      </Grid>

      {/* No Results */}
      {filteredIdeas.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5" sx={{ color: '#fbbf24', mb: 2 }}>
            No financial ideas found
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(251, 191, 36, 0.6)' }}>
            Try adjusting your filters or search terms
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
            <DialogTitleStyled>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {categoryIcons[selectedIdea.category] || <Wallet size={24} />}
                <Typography variant="h6" fontWeight={700}>
                  {selectedIdea.title}
                </Typography>
              </Box>
              <IconButton
                onClick={handleCloseDialog}
                sx={{ color: '#0a0812' }}
              >
                <X size={24} />
              </IconButton>
            </DialogTitleStyled>
            <DialogContentStyled>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ color: 'rgba(251, 191, 36, 0.8)', mb: 1 }}>
                  Category
                </Typography>
                <Chip
                  label={selectedIdea.category}
                  icon={categoryIcons[selectedIdea.category] as React.ReactElement}
                  sx={{
                    backgroundColor: 'rgba(251, 191, 36, 0.2)',
                    color: '#fbbf24',
                    border: '1px solid #fbbf24',
                  }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ color: 'rgba(251, 191, 36, 0.8)', mb: 1 }}>
                  Energy Level
                </Typography>
                <EnergyBadge
                  label={selectedIdea.energy_level.toUpperCase()}
                  energyLevel={selectedIdea.energy_level}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ color: 'rgba(251, 191, 36, 0.8)', mb: 1 }}>
                  Description
                </Typography>
                <Typography variant="body1" sx={{ color: '#fbbf24' }}>
                  {selectedIdea.description}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={bookmarkedIds.has(selectedIdea.id) ? <Bookmark fill="#fbbf24" /> : <Bookmark />}
                  onClick={(e) => toggleBookmark(selectedIdea.id, e)}
                  sx={{
                    borderColor: '#fbbf24',
                    color: '#fbbf24',
                    '&:hover': {
                      borderColor: '#f59e0b',
                      backgroundColor: 'rgba(251, 191, 36, 0.1)',
                    },
                  }}
                >
                  {bookmarkedIds.has(selectedIdea.id) ? 'Bookmarked' : 'Bookmark'}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<BookmarkCheck />}
                  onClick={(e) => toggleCompletion(selectedIdea.id, e)}
                  sx={{
                    borderColor: completedIds.has(selectedIdea.id) ? '#22c55e' : '#fbbf24',
                    color: completedIds.has(selectedIdea.id) ? '#22c55e' : '#fbbf24',
                    '&:hover': {
                      borderColor: completedIds.has(selectedIdea.id) ? '#16a34a' : '#f59e0b',
                      backgroundColor: completedIds.has(selectedIdea.id)
                        ? 'rgba(34, 197, 94, 0.1)'
                        : 'rgba(251, 191, 36, 0.1)',
                    },
                  }}
                >
                  {completedIds.has(selectedIdea.id) ? 'Completed' : 'Mark Complete'}
                </Button>
              </Box>
            </DialogContentStyled>
            <DialogActions sx={{ backgroundColor: '#1a1028', px: 3, pb: 2 }}>
              <Button
                onClick={handleCloseDialog}
                sx={{
                  color: '#fbbf24',
                  '&:hover': {
                    backgroundColor: 'rgba(251, 191, 36, 0.1)',
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

FinancialPlanningHub.displayName = 'FinancialPlanningHub';

export default FinancialPlanningHub;
