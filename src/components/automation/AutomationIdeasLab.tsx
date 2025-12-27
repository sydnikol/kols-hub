import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  IconButton,
  Badge,
  Button,
  Grid,
  styled,
  keyframes,
} from '@mui/material';
import {
  Zap,
  Cog,
  Bot,
  Settings,
  Sparkles,
  Bookmark,
  CheckCircle2,
  X,
  Search,
  Shuffle,
} from 'lucide-react';
import automationData from '../../data/automation_ideas.json';

// Types
interface AutomationIdea {
  id: string;
  category: string;
  title: string;
  description: string;
  energy_level: 'low' | 'medium' | 'high';
}

// Keyframe animations
const circuitPulse = keyframes`
  0%, 100% {
    opacity: 1;
    text-shadow:
      0 0 10px #3b82f6,
      0 0 20px #3b82f6,
      0 0 30px #60a5fa;
  }
  50% {
    opacity: 0.8;
    text-shadow:
      0 0 5px #3b82f6,
      0 0 10px #3b82f6,
      0 0 15px #60a5fa;
  }
`;

const glowPulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 15px rgba(59, 130, 246, 0.3);
  }
  50% {
    box-shadow: 0 0 25px rgba(96, 165, 250, 0.5);
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

// Styled Components
const Container = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #0a0812 0%, #1a1028 100%)',
  padding: '24px',
  color: '#e5e7eb',
});

const Header = styled(Box)({
  textAlign: 'center',
  marginBottom: '32px',
  position: 'relative',
  overflow: 'hidden',
});

const Title = styled(Typography)({
  fontSize: '3rem',
  fontWeight: 'bold',
  background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  animation: `${circuitPulse} 3s ease-in-out infinite`,
  marginBottom: '8px',
});

const Subtitle = styled(Typography)({
  color: '#9ca3af',
  fontSize: '1.1rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
});

const FilterSection = styled(Box)({
  marginBottom: '24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

const FilterChipsContainer = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  justifyContent: 'center',
});

const StyledChip = styled(Chip)<{ selected?: boolean }>(({ selected }) => ({
  backgroundColor: selected ? '#3b82f6' : '#1a1028',
  color: selected ? '#ffffff' : '#9ca3af',
  border: `1px solid ${selected ? '#60a5fa' : '#374151'}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: selected ? '#60a5fa' : '#252035',
    borderColor: '#60a5fa',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
  },
}));

const SearchBox = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#1a1028',
    color: '#e5e7eb',
    borderRadius: '12px',
    '& fieldset': {
      borderColor: '#374151',
    },
    '&:hover fieldset': {
      borderColor: '#60a5fa',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#3b82f6',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#9ca3af',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#60a5fa',
  },
});

const StyledCard = styled(Card)({
  backgroundColor: '#1a1028',
  borderRadius: '16px',
  border: '1px solid #374151',
  transition: 'all 0.3s ease',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  animation: `${glowPulse} 4s ease-in-out infinite`,
  '&:hover': {
    transform: 'translateY(-8px)',
    borderColor: '#60a5fa',
    boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)',
  },
});

const CardHeader = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: '12px',
});

const EnergyBadge = styled(Badge)<{ energyLevel: string }>(({ energyLevel }) => {
  const colors = {
    low: { bg: '#10b981', text: '#d1fae5' },
    medium: { bg: '#f59e0b', text: '#fef3c7' },
    high: { bg: '#ef4444', text: '#fee2e2' },
  };
  const color = colors[energyLevel as keyof typeof colors] || colors.medium;

  return {
    '& .MuiBadge-badge': {
      backgroundColor: color.bg,
      color: color.text,
      fontSize: '0.7rem',
      padding: '4px 8px',
      borderRadius: '8px',
      fontWeight: 'bold',
      textTransform: 'uppercase',
    },
  };
});

const ActionButtons = styled(Box)({
  display: 'flex',
  gap: '8px',
});

const StyledIconButton = styled(IconButton)<{ active?: boolean }>(({ active }) => ({
  color: active ? '#3b82f6' : '#9ca3af',
  transition: 'all 0.3s ease',
  '&:hover': {
    color: '#60a5fa',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    transform: 'scale(1.1)',
  },
}));

const StyledDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    backgroundColor: '#1a1028',
    borderRadius: '16px',
    border: '1px solid #60a5fa',
    boxShadow: '0 0 40px rgba(59, 130, 246, 0.3)',
    maxWidth: '600px',
  },
});

const DialogTitleStyled = styled(DialogTitle)({
  background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
  color: '#ffffff',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px 24px',
});

const DialogContentStyled = styled(DialogContent)({
  backgroundColor: '#0a0812',
  color: '#e5e7eb',
  padding: '24px',
});

const RandomButton = styled(Button)({
  background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
  color: '#ffffff',
  borderRadius: '12px',
  padding: '12px 24px',
  fontWeight: 'bold',
  textTransform: 'none',
  fontSize: '1rem',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
    animation: `${shimmer} 3s infinite`,
  },
  '&:hover': {
    background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 20px rgba(59, 130, 246, 0.4)',
  },
});

const StatsBox = styled(Box)({
  display: 'flex',
  justifyContent: 'space-around',
  marginTop: '24px',
  padding: '16px',
  backgroundColor: '#1a1028',
  borderRadius: '12px',
  border: '1px solid #374151',
});

const StatItem = styled(Box)({
  textAlign: 'center',
});

const StatValue = styled(Typography)({
  fontSize: '2rem',
  fontWeight: 'bold',
  color: '#3b82f6',
});

const StatLabel = styled(Typography)({
  fontSize: '0.9rem',
  color: '#9ca3af',
  textTransform: 'uppercase',
});

// Category icons mapping
const categoryIcons: Record<string, React.ReactNode> = {
  Social: <Bot size={20} />,
  Money: <Zap size={20} />,
  Health: <Sparkles size={20} />,
  'Energy Tracking': <Cog size={20} />,
  Food: <Settings size={20} />,
  Creative: <Sparkles size={20} />,
  Spiritual: <Sparkles size={20} />,
  Home: <Settings size={20} />,
};

// Main Component
const AutomationIdeasLab: React.FC = React.memo(() => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedEnergyLevel, setSelectedEnergyLevel] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [selectedIdea, setSelectedIdea] = useState<AutomationIdea | null>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const ideas = automationData.items as AutomationIdea[];
  const categories = ['All', 'Social', 'Money', 'Health', 'Energy Tracking', 'Food', 'Creative', 'Spiritual', 'Home'];
  const energyLevels = ['All', 'low', 'medium', 'high'];

  // Filtered ideas
  const filteredIdeas = useMemo(() => {
    return ideas.filter((idea) => {
      const matchesCategory = selectedCategory === 'All' || idea.category === selectedCategory;
      const matchesEnergy = selectedEnergyLevel === 'All' || idea.energy_level === selectedEnergyLevel;
      const matchesSearch =
        idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.category.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesEnergy && matchesSearch;
    });
  }, [ideas, selectedCategory, selectedEnergyLevel, searchQuery]);

  // Random idea generator
  const handleRandomIdea = () => {
    if (filteredIdeas.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredIdeas.length);
      const randomIdea = filteredIdeas[randomIndex];
      setSelectedIdea(randomIdea);
      setDialogOpen(true);
    }
  };

  // Bookmark toggle
  const toggleBookmark = (id: string) => {
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

  // Completion toggle
  const toggleComplete = (id: string) => {
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

  // Open dialog
  const openDialog = (idea: AutomationIdea) => {
    setSelectedIdea(idea);
    setDialogOpen(true);
  };

  // Close dialog
  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedIdea(null);
  };

  return (
    <Container>
      {/* Header */}
      <Header>
        <Title>
          <Bot style={{ display: 'inline', marginRight: '12px' }} />
          Automation Ideas Lab
        </Title>
        <Subtitle>
          <Zap size={20} />
          Streamline Your Life with Smart Automation
          <Cog size={20} />
        </Subtitle>
      </Header>

      {/* Stats */}
      <StatsBox>
        <StatItem>
          <StatValue>{filteredIdeas.length}</StatValue>
          <StatLabel>Ideas</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{bookmarked.size}</StatValue>
          <StatLabel>Bookmarked</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{completed.size}</StatValue>
          <StatLabel>Completed</StatLabel>
        </StatItem>
      </StatsBox>

      {/* Filters */}
      <FilterSection>
        {/* Search */}
        <Box display="flex" justifyContent="center" gap={2}>
          <SearchBox
            placeholder="Search automation ideas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            variant="outlined"
            fullWidth
            InputProps={{
              startAdornment: <Search size={20} style={{ marginRight: '8px', color: '#9ca3af' }} />,
            }}
            style={{ maxWidth: '600px' }}
          />
          <RandomButton onClick={handleRandomIdea} startIcon={<Shuffle size={20} />}>
            Random Idea
          </RandomButton>
        </Box>

        {/* Category Filter */}
        <Box>
          <Typography variant="subtitle2" sx={{ color: '#9ca3af', mb: 1, textAlign: 'center' }}>
            Categories
          </Typography>
          <FilterChipsContainer>
            {categories.map((category) => (
              <StyledChip
                key={category}
                label={category}
                selected={selectedCategory === category}
                onClick={() => setSelectedCategory(category)}
                icon={categoryIcons[category] as any}
              />
            ))}
          </FilterChipsContainer>
        </Box>

        {/* Energy Level Filter */}
        <Box>
          <Typography variant="subtitle2" sx={{ color: '#9ca3af', mb: 1, textAlign: 'center' }}>
            Energy Level
          </Typography>
          <FilterChipsContainer>
            {energyLevels.map((level) => (
              <StyledChip
                key={level}
                label={level === 'All' ? 'All Levels' : level.charAt(0).toUpperCase() + level.slice(1)}
                selected={selectedEnergyLevel === level}
                onClick={() => setSelectedEnergyLevel(level)}
                icon={<Zap size={16} />}
              />
            ))}
          </FilterChipsContainer>
        </Box>
      </FilterSection>

      {/* Ideas Grid */}
      <Grid container spacing={3}>
        {filteredIdeas.map((idea) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={idea.id}>
            <StyledCard onClick={() => openDialog(idea)} style={{ cursor: 'pointer' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <CardHeader>
                  <EnergyBadge
                    badgeContent={idea.energy_level}
                    energyLevel={idea.energy_level}
                  >
                    <Box sx={{ width: 24, height: 24 }} />
                  </EnergyBadge>
                  <ActionButtons onClick={(e) => e.stopPropagation()}>
                    <StyledIconButton
                      active={bookmarked.has(idea.id)}
                      onClick={() => toggleBookmark(idea.id)}
                      size="small"
                    >
                      <Bookmark size={18} fill={bookmarked.has(idea.id) ? 'currentColor' : 'none'} />
                    </StyledIconButton>
                    <StyledIconButton
                      active={completed.has(idea.id)}
                      onClick={() => toggleComplete(idea.id)}
                      size="small"
                    >
                      <CheckCircle2 size={18} fill={completed.has(idea.id) ? 'currentColor' : 'none'} />
                    </StyledIconButton>
                  </ActionButtons>
                </CardHeader>

                <Typography variant="h6" sx={{ color: '#60a5fa', mb: 1, fontWeight: 'bold' }}>
                  {idea.title}
                </Typography>

                <Chip
                  label={idea.category}
                  size="small"
                  icon={categoryIcons[idea.category] as any}
                  sx={{
                    backgroundColor: '#3b82f6',
                    color: '#ffffff',
                    mb: 1,
                    fontSize: '0.75rem',
                  }}
                />

                <Typography variant="body2" sx={{ color: '#9ca3af', mt: 1 }}>
                  {idea.description}
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>

      {/* No Results */}
      {filteredIdeas.length === 0 && (
        <Box textAlign="center" mt={8}>
          <Typography variant="h5" sx={{ color: '#9ca3af' }}>
            No automation ideas found
          </Typography>
          <Typography variant="body2" sx={{ color: '#6b7280', mt: 1 }}>
            Try adjusting your filters or search query
          </Typography>
        </Box>
      )}

      {/* Detail Dialog */}
      <StyledDialog open={dialogOpen} onClose={closeDialog} maxWidth="sm" fullWidth>
        {selectedIdea && (
          <>
            <DialogTitleStyled>
              <Box display="flex" alignItems="center" gap={2}>
                {categoryIcons[selectedIdea.category]}
                {selectedIdea.title}
              </Box>
              <IconButton onClick={closeDialog} sx={{ color: '#ffffff' }}>
                <X size={24} />
              </IconButton>
            </DialogTitleStyled>
            <DialogContentStyled>
              <Box mb={2}>
                <Chip
                  label={selectedIdea.category}
                  icon={categoryIcons[selectedIdea.category] as any}
                  sx={{
                    backgroundColor: '#3b82f6',
                    color: '#ffffff',
                    mr: 1,
                  }}
                />
                <EnergyBadge badgeContent={selectedIdea.energy_level} energyLevel={selectedIdea.energy_level}>
                  <Box sx={{ width: 24, height: 24 }} />
                </EnergyBadge>
              </Box>

              <Typography variant="h6" sx={{ color: '#60a5fa', mb: 2 }}>
                Description
              </Typography>
              <Typography variant="body1" sx={{ color: '#e5e7eb', mb: 3 }}>
                {selectedIdea.description}
              </Typography>

              <Box display="flex" gap={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  startIcon={<Bookmark size={18} fill={bookmarked.has(selectedIdea.id) ? 'currentColor' : 'none'} />}
                  onClick={() => toggleBookmark(selectedIdea.id)}
                  sx={{
                    borderColor: bookmarked.has(selectedIdea.id) ? '#3b82f6' : '#374151',
                    color: bookmarked.has(selectedIdea.id) ? '#3b82f6' : '#9ca3af',
                    '&:hover': {
                      borderColor: '#60a5fa',
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    },
                  }}
                >
                  {bookmarked.has(selectedIdea.id) ? 'Bookmarked' : 'Bookmark'}
                </Button>
                <Button
                  variant="contained"
                  startIcon={<CheckCircle2 size={18} />}
                  onClick={() => toggleComplete(selectedIdea.id)}
                  sx={{
                    backgroundColor: completed.has(selectedIdea.id) ? '#10b981' : '#3b82f6',
                    '&:hover': {
                      backgroundColor: completed.has(selectedIdea.id) ? '#059669' : '#60a5fa',
                    },
                  }}
                >
                  {completed.has(selectedIdea.id) ? 'Completed' : 'Mark Complete'}
                </Button>
              </Box>
            </DialogContentStyled>
          </>
        )}
      </StyledDialog>
    </Container>
  );
});

AutomationIdeasLab.displayName = 'AutomationIdeasLab';

export default AutomationIdeasLab;
