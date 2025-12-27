import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  Chip,
  Card,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  IconButton,
  styled,
  keyframes,
} from '@mui/material';
import {
  TrendingUp,
  DollarSign,
  Laptop,
  Users,
  Sparkles,
  Zap,
  Clock,
  BookMarked,
  CheckCircle2,
  Shuffle,
  X,
  Target,
  Rocket,
  GraduationCap,
  PenTool,
  Package,
  FileText,
  TrendingDown,
} from 'lucide-react';
import passiveIncomeData from '../../data/passive_income_ideas.json';

// Keyframe animations for header
const growAnimation = keyframes`
  0% {
    transform: scale(1) translateY(0);
  }
  50% {
    transform: scale(1.05) translateY(-5px);
  }
  100% {
    transform: scale(1) translateY(0);
  }
`;

const risingAnimation = keyframes`
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const shimmerAnimation = keyframes`
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
`;

// Styled components with gothic dark theme
const StyledContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #0a0812 0%, #1a1028 100%)',
  padding: '2rem',
});

const StyledHeader = styled(Box)({
  background: 'linear-gradient(90deg, #10b981 0%, #34d399 50%, #10b981 100%)',
  backgroundSize: '200% auto',
  padding: '2rem',
  borderRadius: '16px',
  marginBottom: '2rem',
  animation: `${risingAnimation} 1s ease-out, ${shimmerAnimation} 3s linear infinite`,
  boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)',
});

const HeaderTitle = styled(Typography)({
  color: '#0a0812',
  fontWeight: 800,
  fontSize: '2.5rem',
  textAlign: 'center',
  marginBottom: '0.5rem',
  animation: `${growAnimation} 2s ease-in-out infinite`,
});

const HeaderSubtitle = styled(Typography)({
  color: '#1a1028',
  fontSize: '1.1rem',
  textAlign: 'center',
  fontWeight: 600,
});

const StyledCard = styled(Card)({
  background: 'linear-gradient(145deg, #1a1028 0%, #2a1838 100%)',
  borderRadius: '12px',
  border: '1px solid rgba(16, 185, 129, 0.2)',
  transition: 'all 0.3s ease',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 40px rgba(16, 185, 129, 0.4)',
    borderColor: 'rgba(52, 211, 153, 0.5)',
  },
});

const CategoryChip = styled(Chip)<{ selected?: boolean }>(({ selected }) => ({
  background: selected
    ? 'linear-gradient(135deg, #10b981 0%, #34d399 100%)'
    : 'rgba(16, 185, 129, 0.1)',
  color: selected ? '#0a0812' : '#10b981',
  border: `1px solid ${selected ? '#34d399' : 'rgba(16, 185, 129, 0.3)'}`,
  fontWeight: 600,
  transition: 'all 0.3s ease',
  '&:hover': {
    background: selected
      ? 'linear-gradient(135deg, #10b981 0%, #34d399 100%)'
      : 'rgba(16, 185, 129, 0.2)',
    transform: 'scale(1.05)',
  },
}));

const DifficultyBadge = styled(Chip)<{ difficulty: string }>(({ difficulty }) => {
  const colors = {
    beginner: { bg: 'rgba(52, 211, 153, 0.2)', border: '#34d399', text: '#34d399' },
    intermediate: { bg: 'rgba(251, 191, 36, 0.2)', border: '#fbbf24', text: '#fbbf24' },
    advanced: { bg: 'rgba(239, 68, 68, 0.2)', border: '#ef4444', text: '#ef4444' },
  };
  const color = colors[difficulty as keyof typeof colors] || colors.beginner;

  return {
    background: color.bg,
    color: color.text,
    border: `1px solid ${color.border}`,
    fontWeight: 600,
    fontSize: '0.75rem',
  };
});

const IncomePotentialBox = styled(Box)({
  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(52, 211, 153, 0.1) 100%)',
  padding: '1rem',
  borderRadius: '8px',
  border: '1px solid rgba(52, 211, 153, 0.3)',
  textAlign: 'center',
  marginTop: '0.5rem',
  marginBottom: '1rem',
});

const StyledDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    background: 'linear-gradient(145deg, #1a1028 0%, #2a1838 100%)',
    borderRadius: '16px',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    maxWidth: '700px',
  },
});

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    background: 'rgba(16, 185, 129, 0.05)',
    color: '#10b981',
    borderRadius: '8px',
    '& fieldset': {
      borderColor: 'rgba(16, 185, 129, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(52, 211, 153, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#10b981',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#10b981',
  },
});

interface PassiveIncomeIdea {
  id: string;
  title: string;
  category: string;
  description: string;
  startup_cost: string;
  time_investment: string;
  income_potential: string;
  difficulty: string;
  energy_level: string;
  skills_needed: string[];
  platforms: string[];
  steps: string[];
}

const categoryIcons: Record<string, React.ReactNode> = {
  digital_products: <Package size={20} />,
  education: <GraduationCap size={20} />,
  content: <FileText size={20} />,
  community_based: <Users size={20} />,
  creative_assets: <PenTool size={20} />,
  service_lite: <Zap size={20} />,
  licensing: <BookMarked size={20} />,
  investing: <TrendingUp size={20} />,
};

const PassiveIncomeExplorer: React.FC = React.memo(() => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedEnergyLevel, setSelectedEnergyLevel] = useState<string>('all');
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [selectedIdea, setSelectedIdea] = useState<PassiveIncomeIdea | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const ideas: PassiveIncomeIdea[] = passiveIncomeData.items;
  const categories = Object.keys(passiveIncomeData.categories);

  // Filter ideas based on all criteria
  const filteredIdeas = useMemo(() => {
    return ideas.filter((idea) => {
      const matchesSearch =
        idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        idea.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        idea.skills_needed.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = selectedCategory === 'all' || idea.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'all' || idea.difficulty === selectedDifficulty;
      const matchesEnergy = selectedEnergyLevel === 'all' || idea.energy_level === selectedEnergyLevel;

      return matchesSearch && matchesCategory && matchesDifficulty && matchesEnergy;
    });
  }, [ideas, searchTerm, selectedCategory, selectedDifficulty, selectedEnergyLevel]);

  const handleBookmark = (id: string) => {
    setBookmarked((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleComplete = (id: string) => {
    setCompleted((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleRandomIdea = () => {
    const randomIndex = Math.floor(Math.random() * filteredIdeas.length);
    const randomIdea = filteredIdeas[randomIndex];
    if (randomIdea) {
      setSelectedIdea(randomIdea);
      setDialogOpen(true);
    }
  };

  const handleCardClick = (idea: PassiveIncomeIdea) => {
    setSelectedIdea(idea);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setTimeout(() => setSelectedIdea(null), 300);
  };

  return (
    <StyledContainer>
      {/* Header with animations */}
      <StyledHeader>
        <HeaderTitle>
          <DollarSign style={{ display: 'inline', marginRight: '8px' }} size={40} />
          Passive Income Explorer
        </HeaderTitle>
        <HeaderSubtitle>
          Discover 40+ ways to build wealth while you sleep
        </HeaderSubtitle>
      </StyledHeader>

      {/* Search and Controls */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <StyledTextField
              fullWidth
              placeholder="Search by title, description, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Sparkles size={20} style={{ marginRight: '8px', color: '#10b981' }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleRandomIdea}
              disabled={filteredIdeas.length === 0}
              sx={{
                background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                color: '#0a0812',
                fontWeight: 700,
                height: '56px',
                '&:hover': {
                  background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                },
              }}
              startIcon={<Shuffle size={20} />}
            >
              Random Idea
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Category Filters */}
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ color: '#10b981', fontWeight: 600, mb: 1 }}>Category:</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <CategoryChip
            label="All Categories"
            selected={selectedCategory === 'all'}
            onClick={() => setSelectedCategory('all')}
          />
          {categories.map((category) => (
            <CategoryChip
              key={category}
              icon={categoryIcons[category] as any}
              label={category.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
              selected={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
            />
          ))}
        </Box>
      </Box>

      {/* Difficulty Filter */}
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ color: '#10b981', fontWeight: 600, mb: 1 }}>Difficulty:</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <CategoryChip
            label="All Levels"
            selected={selectedDifficulty === 'all'}
            onClick={() => setSelectedDifficulty('all')}
          />
          {['beginner', 'intermediate', 'advanced'].map((level) => (
            <CategoryChip
              key={level}
              label={level.charAt(0).toUpperCase() + level.slice(1)}
              selected={selectedDifficulty === level}
              onClick={() => setSelectedDifficulty(level)}
            />
          ))}
        </Box>
      </Box>

      {/* Energy Level Filter */}
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ color: '#10b981', fontWeight: 600, mb: 1 }}>Energy Level:</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <CategoryChip
            label="All Energy Levels"
            selected={selectedEnergyLevel === 'all'}
            onClick={() => setSelectedEnergyLevel('all')}
          />
          {['low', 'medium', 'high'].map((level) => (
            <CategoryChip
              key={level}
              label={level.charAt(0).toUpperCase() + level.slice(1)}
              selected={selectedEnergyLevel === level}
              onClick={() => setSelectedEnergyLevel(level)}
            />
          ))}
        </Box>
      </Box>

      {/* Results Count */}
      <Typography sx={{ color: '#34d399', mb: 2, fontWeight: 600 }}>
        <Target size={18} style={{ display: 'inline', marginRight: '8px' }} />
        Found {filteredIdeas.length} passive income {filteredIdeas.length === 1 ? 'idea' : 'ideas'}
      </Typography>

      {/* Card Grid */}
      <Grid container spacing={3}>
        {filteredIdeas.map((idea) => (
          <Grid item xs={12} sm={6} md={4} key={idea.id}>
            <StyledCard>
              <CardContent sx={{ flexGrow: 1, pb: 0 }}>
                {/* Category Icon and Title */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                  <Box sx={{
                    color: '#10b981',
                    mr: 1,
                    mt: 0.5,
                  }}>
                    {categoryIcons[idea.category]}
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#34d399',
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      lineHeight: 1.3,
                    }}
                  >
                    {idea.title}
                  </Typography>
                </Box>

                {/* Category Badge */}
                <Chip
                  label={idea.category.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                  size="small"
                  sx={{
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: '#10b981',
                    fontSize: '0.7rem',
                    mb: 1,
                  }}
                />

                {/* Description */}
                <Typography
                  sx={{
                    color: '#a0a0a0',
                    fontSize: '0.9rem',
                    mb: 2,
                    lineHeight: 1.5,
                  }}
                >
                  {idea.description.slice(0, 120)}...
                </Typography>

                {/* Income Potential - Prominently Displayed */}
                <IncomePotentialBox>
                  <Typography sx={{ color: '#10b981', fontSize: '0.75rem', fontWeight: 600 }}>
                    Income Potential
                  </Typography>
                  <Typography sx={{ color: '#34d399', fontSize: '1.3rem', fontWeight: 800 }}>
                    {idea.income_potential}
                  </Typography>
                </IncomePotentialBox>

                {/* Badges Row */}
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                  <DifficultyBadge
                    label={idea.difficulty}
                    difficulty={idea.difficulty}
                    size="small"
                  />
                  <Chip
                    label={`Startup: ${idea.startup_cost}`}
                    size="small"
                    sx={{
                      background: 'rgba(59, 130, 246, 0.2)',
                      color: '#60a5fa',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      fontSize: '0.75rem',
                    }}
                  />
                </Box>

                {/* Time Investment */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                  <Clock size={14} style={{ color: '#10b981' }} />
                  <Typography sx={{ color: '#a0a0a0', fontSize: '0.8rem' }}>
                    {idea.time_investment}
                  </Typography>
                </Box>

                {/* Energy Level */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Zap size={14} style={{ color: '#10b981' }} />
                  <Typography sx={{ color: '#a0a0a0', fontSize: '0.8rem' }}>
                    Energy: {idea.energy_level}
                  </Typography>
                </Box>
              </CardContent>

              <CardActions sx={{ px: 2, pb: 2 }}>
                <Button
                  size="small"
                  fullWidth
                  onClick={() => handleCardClick(idea)}
                  sx={{
                    color: '#10b981',
                    borderColor: 'rgba(16, 185, 129, 0.3)',
                    fontWeight: 600,
                    '&:hover': {
                      borderColor: '#10b981',
                      background: 'rgba(16, 185, 129, 0.1)',
                    },
                  }}
                  variant="outlined"
                >
                  View Details
                </Button>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBookmark(idea.id);
                  }}
                  sx={{
                    color: bookmarked.has(idea.id) ? '#fbbf24' : '#6b7280',
                    '&:hover': { color: '#fbbf24' },
                  }}
                >
                  <BookMarked size={20} fill={bookmarked.has(idea.id) ? '#fbbf24' : 'none'} />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleComplete(idea.id);
                  }}
                  sx={{
                    color: completed.has(idea.id) ? '#10b981' : '#6b7280',
                    '&:hover': { color: '#10b981' },
                  }}
                >
                  <CheckCircle2 size={20} fill={completed.has(idea.id) ? '#10b981' : 'none'} />
                </IconButton>
              </CardActions>
            </StyledCard>
          </Grid>
        ))}
      </Grid>

      {/* Empty State */}
      {filteredIdeas.length === 0 && (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            color: '#6b7280',
          }}
        >
          <TrendingDown size={64} style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <Typography variant="h6" sx={{ mb: 1 }}>
            No ideas found
          </Typography>
          <Typography>
            Try adjusting your filters or search term
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
        {selectedIdea && (
          <>
            <DialogTitle
              sx={{
                background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                color: '#0a0812',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Rocket size={24} />
                {selectedIdea.title}
              </Box>
              <IconButton
                onClick={handleCloseDialog}
                sx={{
                  color: '#0a0812',
                  '&:hover': { background: 'rgba(10, 8, 18, 0.1)' },
                }}
              >
                <X size={24} />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
              {/* Description */}
              <Typography sx={{ color: '#e0e0e0', mb: 3, fontSize: '1rem', lineHeight: 1.6 }}>
                {selectedIdea.description}
              </Typography>

              {/* Key Metrics Grid */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Box
                    sx={{
                      background: 'rgba(16, 185, 129, 0.1)',
                      p: 2,
                      borderRadius: '8px',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                    }}
                  >
                    <Typography sx={{ color: '#10b981', fontSize: '0.8rem', mb: 0.5 }}>
                      Income Potential
                    </Typography>
                    <Typography sx={{ color: '#34d399', fontWeight: 700, fontSize: '1.2rem' }}>
                      {selectedIdea.income_potential}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box
                    sx={{
                      background: 'rgba(59, 130, 246, 0.1)',
                      p: 2,
                      borderRadius: '8px',
                      border: '1px solid rgba(59, 130, 246, 0.2)',
                    }}
                  >
                    <Typography sx={{ color: '#60a5fa', fontSize: '0.8rem', mb: 0.5 }}>
                      Startup Cost
                    </Typography>
                    <Typography sx={{ color: '#93c5fd', fontWeight: 700, fontSize: '1.2rem' }}>
                      {selectedIdea.startup_cost}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box
                    sx={{
                      background: 'rgba(168, 85, 247, 0.1)',
                      p: 2,
                      borderRadius: '8px',
                      border: '1px solid rgba(168, 85, 247, 0.2)',
                    }}
                  >
                    <Typography sx={{ color: '#a78bfa', fontSize: '0.8rem', mb: 0.5 }}>
                      Time Investment
                    </Typography>
                    <Typography sx={{ color: '#c4b5fd', fontWeight: 700, fontSize: '1.2rem' }}>
                      {selectedIdea.time_investment}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box
                    sx={{
                      background: 'rgba(251, 191, 36, 0.1)',
                      p: 2,
                      borderRadius: '8px',
                      border: '1px solid rgba(251, 191, 36, 0.2)',
                    }}
                  >
                    <Typography sx={{ color: '#fbbf24', fontSize: '0.8rem', mb: 0.5 }}>
                      Difficulty / Energy
                    </Typography>
                    <Typography sx={{ color: '#fcd34d', fontWeight: 700, fontSize: '1.2rem' }}>
                      {selectedIdea.difficulty} / {selectedIdea.energy_level}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Skills Needed */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  sx={{
                    color: '#10b981',
                    fontWeight: 700,
                    mb: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <GraduationCap size={20} />
                  Skills Needed
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {selectedIdea.skills_needed.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      size="small"
                      sx={{
                        background: 'rgba(52, 211, 153, 0.15)',
                        color: '#34d399',
                        border: '1px solid rgba(52, 211, 153, 0.3)',
                      }}
                    />
                  ))}
                </Box>
              </Box>

              {/* Platforms */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  sx={{
                    color: '#10b981',
                    fontWeight: 700,
                    mb: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Laptop size={20} />
                  Platforms
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {selectedIdea.platforms.map((platform, index) => (
                    <Chip
                      key={index}
                      label={platform}
                      size="small"
                      sx={{
                        background: 'rgba(59, 130, 246, 0.15)',
                        color: '#60a5fa',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                      }}
                    />
                  ))}
                </Box>
              </Box>

              {/* Steps */}
              <Box>
                <Typography
                  sx={{
                    color: '#10b981',
                    fontWeight: 700,
                    mb: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Target size={20} />
                  Getting Started Steps
                </Typography>
                <Box sx={{ pl: 2 }}>
                  {selectedIdea.steps.map((step, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        mb: 1.5,
                        pb: 1.5,
                        borderBottom:
                          index < selectedIdea.steps.length - 1
                            ? '1px solid rgba(16, 185, 129, 0.1)'
                            : 'none',
                      }}
                    >
                      <Box
                        sx={{
                          minWidth: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                          color: '#0a0812',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          mr: 2,
                          flexShrink: 0,
                        }}
                      >
                        {index + 1}
                      </Box>
                      <Typography sx={{ color: '#e0e0e0', fontSize: '0.95rem', lineHeight: 1.6 }}>
                        {step}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
              <Button
                onClick={() => handleBookmark(selectedIdea.id)}
                startIcon={<BookMarked size={18} />}
                sx={{
                  color: bookmarked.has(selectedIdea.id) ? '#fbbf24' : '#6b7280',
                  borderColor: bookmarked.has(selectedIdea.id) ? '#fbbf24' : '#6b7280',
                  '&:hover': {
                    borderColor: '#fbbf24',
                    background: 'rgba(251, 191, 36, 0.1)',
                  },
                }}
                variant="outlined"
              >
                {bookmarked.has(selectedIdea.id) ? 'Bookmarked' : 'Bookmark'}
              </Button>
              <Button
                onClick={() => handleComplete(selectedIdea.id)}
                startIcon={<CheckCircle2 size={18} />}
                sx={{
                  color: completed.has(selectedIdea.id) ? '#10b981' : '#6b7280',
                  borderColor: completed.has(selectedIdea.id) ? '#10b981' : '#6b7280',
                  '&:hover': {
                    borderColor: '#10b981',
                    background: 'rgba(16, 185, 129, 0.1)',
                  },
                }}
                variant="outlined"
              >
                {completed.has(selectedIdea.id) ? 'Completed' : 'Mark Complete'}
              </Button>
              <Button
                onClick={handleCloseDialog}
                variant="contained"
                sx={{
                  background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                  color: '#0a0812',
                  fontWeight: 700,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                  },
                }}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </StyledDialog>
    </StyledContainer>
  );
});

PassiveIncomeExplorer.displayName = 'PassiveIncomeExplorer';

export default PassiveIncomeExplorer;
