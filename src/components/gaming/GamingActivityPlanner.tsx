import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  Chip,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Gamepad2,
  Search,
  Sparkles,
  User,
  Users,
  Dice5,
  Swords,
  Brain,
  Puzzle,
  Joystick,
  Trophy,
  Target,
  Zap,
  CheckCircle2,
  Bookmark,
  Shuffle,
  X,
  Clock,
  Star,
} from 'lucide-react';

// Import gaming data
import gamingData from '../../data/gaming_ideas.json';

// Animations
const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(236, 72, 153, 0.3); }
  50% { box-shadow: 0 0 40px rgba(236, 72, 153, 0.6); }
`;

// Styled components
const PageContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #0a0812 0%, #1a1028 50%, #0d0d1a 100%)',
  padding: '24px',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '300px',
    background: 'radial-gradient(ellipse at center top, rgba(236, 72, 153, 0.2) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
});

const Header = styled(Box)({
  textAlign: 'center',
  marginBottom: '32px',
  position: 'relative',
  zIndex: 1,
});

const Title = styled(Typography)({
  fontSize: '2.5rem',
  fontWeight: 700,
  background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 50%, #fb7185 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginBottom: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '12px',
  '& svg': {
    animation: `${bounce} 2s ease-in-out infinite`,
  },
});

const Subtitle = styled(Typography)({
  color: 'rgba(244, 114, 182, 0.8)',
  fontSize: '1rem',
});

const SearchContainer = styled(Box)({
  maxWidth: '600px',
  margin: '0 auto 24px',
});

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(26, 16, 40, 0.8)',
    borderRadius: '16px',
    color: '#f0e6ff',
    '& fieldset': {
      borderColor: 'rgba(236, 72, 153, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(236, 72, 153, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#ec4899',
    },
  },
  '& .MuiInputAdornment-root svg': {
    color: '#ec4899',
  },
});

const CategoryContainer = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  justifyContent: 'center',
  marginBottom: '24px',
});

const CategoryChip = styled(Chip)<{ selected?: boolean; chipcolor?: string }>(({ selected, chipcolor }) => ({
  backgroundColor: selected ? chipcolor : 'rgba(26, 16, 40, 0.6)',
  color: selected ? '#0a0812' : chipcolor,
  border: `1px solid ${chipcolor}`,
  fontWeight: selected ? 600 : 400,
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: selected ? chipcolor : `${chipcolor}20`,
    transform: 'translateY(-2px)',
  },
}));

const StatsPanel = styled(Box)({
  display: 'flex',
  gap: '16px',
  justifyContent: 'center',
  flexWrap: 'wrap',
  marginBottom: '32px',
});

const StatCard = styled(Box)({
  background: 'linear-gradient(145deg, rgba(26, 16, 40, 0.8) 0%, rgba(13, 13, 26, 0.9) 100%)',
  borderRadius: '16px',
  padding: '16px 24px',
  border: '1px solid rgba(236, 72, 153, 0.2)',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  minWidth: '140px',
});

const StatNumber = styled(Typography)({
  fontSize: '1.5rem',
  fontWeight: 700,
  color: '#f472b6',
});

const StatLabel = styled(Typography)({
  fontSize: '0.75rem',
  color: 'rgba(244, 114, 182, 0.7)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
});

const RandomButton = styled(Button)({
  background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
  color: '#fff',
  borderRadius: '20px',
  padding: '10px 24px',
  fontWeight: 600,
  marginBottom: '24px',
  '&:hover': {
    background: 'linear-gradient(135deg, #db2777 0%, #ec4899 100%)',
    transform: 'scale(1.02)',
  },
});

const GamingGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
  gap: '20px',
  maxWidth: '1400px',
  margin: '0 auto',
});

const GamingCard = styled(Card)<{ energylevel?: string }>(({ energylevel }) => {
  const colors: Record<string, string> = {
    low: '#22c55e',
    medium: '#fbbf24',
    high: '#ef4444',
  };
  const color = colors[energylevel || 'medium'] || colors.medium;

  return {
    background: 'linear-gradient(145deg, rgba(26, 16, 40, 0.9) 0%, rgba(13, 13, 26, 0.95) 100%)',
    borderRadius: '20px',
    border: `1px solid ${color}30`,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '3px',
      background: `linear-gradient(90deg, ${color}, ${color}80)`,
    },
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: `0 12px 40px ${color}20`,
      border: `1px solid ${color}50`,
    },
  };
});

const GamingTitle = styled(Typography)({
  fontSize: '1.1rem',
  fontWeight: 600,
  color: '#f0e6ff',
  marginBottom: '8px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

const GamingDescription = styled(Typography)({
  fontSize: '0.875rem',
  color: 'rgba(240, 230, 255, 0.7)',
  lineHeight: 1.5,
  marginBottom: '12px',
});

const TagContainer = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '6px',
  marginTop: '12px',
});

const GamingTag = styled(Chip)({
  backgroundColor: 'rgba(236, 72, 153, 0.15)',
  color: '#f472b6',
  fontSize: '0.7rem',
  height: '24px',
  border: '1px solid rgba(236, 72, 153, 0.3)',
});

const EnergyBadge = styled(Box)<{ level?: string }>(({ level }) => {
  const colors: Record<string, { bg: string; text: string }> = {
    low: { bg: 'rgba(34, 197, 94, 0.2)', text: '#22c55e' },
    medium: { bg: 'rgba(251, 191, 36, 0.2)', text: '#fbbf24' },
    high: { bg: 'rgba(239, 68, 68, 0.2)', text: '#ef4444' },
  };
  const style = colors[level || 'medium'] || colors.medium;

  return {
    backgroundColor: style.bg,
    color: style.text,
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '0.7rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    border: `1px solid ${style.text}40`,
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  };
});

const CompletedBadge = styled(Box)({
  position: 'absolute',
  top: '12px',
  right: '12px',
  backgroundColor: 'rgba(34, 197, 94, 0.2)',
  color: '#22c55e',
  padding: '4px 8px',
  borderRadius: '8px',
  fontSize: '0.7rem',
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  border: '1px solid rgba(34, 197, 94, 0.3)',
});

const DialogStyled = styled(Dialog)({
  '& .MuiDialog-paper': {
    backgroundColor: '#1a1028',
    borderRadius: '24px',
    border: '1px solid rgba(236, 72, 153, 0.3)',
    maxWidth: '600px',
    width: '100%',
  },
});

// Types
interface GamingIdea {
  id: string;
  category: string;
  title: string;
  description: string;
  energy_level: string;
  tags: string[];
}

// Category configuration
const categories = [
  { id: 'all', name: 'All Gaming', icon: Sparkles, color: '#d4af37' },
  { id: 'Single Player', name: 'Single Player', icon: User, color: '#8b5cf6' },
  { id: 'Multiplayer', name: 'Multiplayer', icon: Users, color: '#3b82f6' },
  { id: 'Board Games', name: 'Board Games', icon: Dice5, color: '#f59e0b' },
  { id: 'Role-Playing', name: 'RPG', icon: Swords, color: '#ef4444' },
  { id: 'Strategy', name: 'Strategy', icon: Brain, color: '#22c55e' },
  { id: 'Puzzle', name: 'Puzzle', icon: Puzzle, color: '#06b6d4' },
  { id: 'Casual', name: 'Casual', icon: Joystick, color: '#ec4899' },
  { id: 'Action', name: 'Action', icon: Target, color: '#f97316' },
  { id: 'Indie', name: 'Indie', icon: Star, color: '#a855f7' },
  { id: 'Retro', name: 'Retro', icon: Gamepad2, color: '#14b8a6' },
  { id: 'Simulation', name: 'Simulation', icon: Clock, color: '#84cc16' },
];

export const GamingActivityPlanner: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedEnergy, setSelectedEnergy] = useState<string | null>(null);
  const [selectedIdea, setSelectedIdea] = useState<GamingIdea | null>(null);
  const [completedIdeas, setCompletedIdeas] = useState<Set<string>>(new Set());
  const [bookmarkedIdeas, setBookmarkedIdeas] = useState<Set<string>>(new Set());

  const ideas: GamingIdea[] = gamingData.items;

  const filteredIdeas = useMemo(() => {
    return ideas.filter((idea) => {
      const matchesSearch =
        searchQuery === '' ||
        idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'all' || idea.category === selectedCategory;

      const matchesEnergy = !selectedEnergy || idea.energy_level === selectedEnergy;

      return matchesSearch && matchesCategory && matchesEnergy;
    });
  }, [ideas, searchQuery, selectedCategory, selectedEnergy]);

  const stats = useMemo(() => {
    return {
      total: ideas.length,
      completed: completedIdeas.size,
      bookmarked: bookmarkedIdeas.size,
      multiplayer: ideas.filter((i) => i.category === 'Multiplayer').length,
    };
  }, [ideas, completedIdeas, bookmarkedIdeas]);

  const getRandomIdea = useCallback(() => {
    const available = filteredIdeas.filter((i) => !completedIdeas.has(i.id));
    if (available.length > 0) {
      const random = available[Math.floor(Math.random() * available.length)];
      setSelectedIdea(random);
    }
  }, [filteredIdeas, completedIdeas]);

  const toggleCompleted = useCallback((ideaId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCompletedIdeas((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(ideaId)) {
        newSet.delete(ideaId);
      } else {
        newSet.add(ideaId);
      }
      return newSet;
    });
  }, []);

  const toggleBookmarked = useCallback((ideaId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setBookmarkedIdeas((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(ideaId)) {
        newSet.delete(ideaId);
      } else {
        newSet.add(ideaId);
      }
      return newSet;
    });
  }, []);

  const getCategoryIcon = (categoryName: string) => {
    const cat = categories.find((c) => c.id === categoryName);
    return cat ? cat.icon : Gamepad2;
  };

  const getCategoryColor = (categoryName: string) => {
    const cat = categories.find((c) => c.id === categoryName);
    return cat ? cat.color : '#ec4899';
  };

  return (
    <PageContainer>
      <Header>
        <Title variant="h1">
          <Gamepad2 size={36} />
          Gaming Activity Planner
        </Title>
        <Subtitle>100+ gaming activities from solo to social</Subtitle>
      </Header>

      <StatsPanel>
        <StatCard>
          <Gamepad2 size={24} color="#ec4899" />
          <Box>
            <StatNumber>{stats.total}</StatNumber>
            <StatLabel>Activities</StatLabel>
          </Box>
        </StatCard>
        <StatCard>
          <Trophy size={24} color="#22c55e" />
          <Box>
            <StatNumber>{stats.completed}</StatNumber>
            <StatLabel>Completed</StatLabel>
          </Box>
        </StatCard>
        <StatCard>
          <Bookmark size={24} color="#fbbf24" />
          <Box>
            <StatNumber>{stats.bookmarked}</StatNumber>
            <StatLabel>Queued</StatLabel>
          </Box>
        </StatCard>
        <StatCard>
          <Users size={24} color="#3b82f6" />
          <Box>
            <StatNumber>{stats.multiplayer}</StatNumber>
            <StatLabel>Multiplayer</StatLabel>
          </Box>
        </StatCard>
      </StatsPanel>

      <Box sx={{ textAlign: 'center' }}>
        <RandomButton onClick={getRandomIdea} startIcon={<Shuffle size={18} />}>
          Random Game Activity
        </RandomButton>
      </Box>

      <SearchContainer>
        <StyledTextField
          fullWidth
          placeholder="Search games, genres, or activities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} />
              </InputAdornment>
            ),
          }}
        />
      </SearchContainer>

      <CategoryContainer>
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <CategoryChip
              key={category.id}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Icon size={14} />
                  {category.name}
                </Box>
              }
              selected={selectedCategory === category.id}
              chipcolor={category.color}
              onClick={() => setSelectedCategory(category.id)}
            />
          );
        })}
      </CategoryContainer>

      <Box sx={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '24px' }}>
        {['low', 'medium', 'high'].map((energy) => (
          <Chip
            key={energy}
            label={`${energy} energy`}
            icon={<Zap size={12} />}
            onClick={() => setSelectedEnergy(selectedEnergy === energy ? null : energy)}
            sx={{
              backgroundColor: selectedEnergy === energy
                ? (energy === 'low' ? '#22c55e' : energy === 'medium' ? '#fbbf24' : '#ef4444')
                : 'rgba(26, 16, 40, 0.6)',
              color: selectedEnergy === energy ? '#0a0812' : (energy === 'low' ? '#22c55e' : energy === 'medium' ? '#fbbf24' : '#ef4444'),
              border: `1px solid ${energy === 'low' ? '#22c55e' : energy === 'medium' ? '#fbbf24' : '#ef4444'}`,
              '& .MuiChip-icon': {
                color: selectedEnergy === energy ? '#0a0812' : (energy === 'low' ? '#22c55e' : energy === 'medium' ? '#fbbf24' : '#ef4444'),
              },
            }}
          />
        ))}
      </Box>

      <Typography
        sx={{
          textAlign: 'center',
          color: 'rgba(240, 230, 255, 0.6)',
          marginBottom: '20px',
          fontSize: '0.9rem',
        }}
      >
        Showing {filteredIdeas.length} of {ideas.length} gaming activities
      </Typography>

      <GamingGrid>
        {filteredIdeas.map((idea) => {
          const isCompleted = completedIdeas.has(idea.id);
          const isBookmarked = bookmarkedIdeas.has(idea.id);
          const CategoryIcon = getCategoryIcon(idea.category);

          return (
            <GamingCard
              key={idea.id}
              energylevel={idea.energy_level}
              onClick={() => setSelectedIdea(idea)}
            >
              {isCompleted && (
                <CompletedBadge>
                  <Trophy size={12} />
                  Done
                </CompletedBadge>
              )}
              <CardContent sx={{ padding: '20px' }}>
                <GamingTitle>
                  <CategoryIcon size={18} color={getCategoryColor(idea.category)} />
                  {idea.title}
                </GamingTitle>

                <Box sx={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                  <EnergyBadge level={idea.energy_level}>
                    <Zap size={10} />
                    {idea.energy_level}
                  </EnergyBadge>
                  <Chip
                    size="small"
                    label={idea.category}
                    sx={{
                      backgroundColor: `${getCategoryColor(idea.category)}20`,
                      color: getCategoryColor(idea.category),
                      fontSize: '0.7rem',
                      height: '24px',
                      border: `1px solid ${getCategoryColor(idea.category)}40`,
                    }}
                  />
                  {isBookmarked && (
                    <Bookmark size={16} color="#fbbf24" fill="#fbbf24" />
                  )}
                </Box>

                <GamingDescription>{idea.description}</GamingDescription>

                <TagContainer>
                  {idea.tags.slice(0, 3).map((tag) => (
                    <GamingTag key={tag} label={tag} size="small" />
                  ))}
                </TagContainer>
              </CardContent>
            </GamingCard>
          );
        })}
      </GamingGrid>

      {/* Idea Detail Dialog */}
      <DialogStyled
        open={!!selectedIdea}
        onClose={() => setSelectedIdea(null)}
        maxWidth="md"
      >
        {selectedIdea && (
          <>
            <DialogTitle
              sx={{
                background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(244, 114, 182, 0.1) 100%)',
                color: '#f0e6ff',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Gamepad2 size={24} color="#ec4899" />
                {selectedIdea.title}
              </Box>
              <IconButton onClick={() => setSelectedIdea(null)} sx={{ color: '#f0e6ff' }}>
                <X size={20} />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ padding: '24px' }}>
              <Box sx={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <EnergyBadge level={selectedIdea.energy_level}>
                  <Zap size={12} />
                  {selectedIdea.energy_level} energy
                </EnergyBadge>
                <Chip
                  label={selectedIdea.category}
                  sx={{
                    backgroundColor: `${getCategoryColor(selectedIdea.category)}20`,
                    color: getCategoryColor(selectedIdea.category),
                    border: `1px solid ${getCategoryColor(selectedIdea.category)}40`,
                  }}
                />
              </Box>

              <Typography
                sx={{
                  color: 'rgba(240, 230, 255, 0.9)',
                  fontSize: '1rem',
                  lineHeight: 1.7,
                  marginBottom: '24px',
                }}
              >
                {selectedIdea.description}
              </Typography>

              <Box sx={{ marginBottom: '20px' }}>
                <Typography sx={{ color: '#f472b6', fontWeight: 600, marginBottom: '12px' }}>
                  Tags
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {selectedIdea.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      sx={{
                        backgroundColor: 'rgba(236, 72, 153, 0.15)',
                        color: '#f472b6',
                        border: '1px solid rgba(236, 72, 153, 0.3)',
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </DialogContent>
            <DialogActions sx={{ padding: '16px 24px', borderTop: '1px solid rgba(236, 72, 153, 0.2)' }}>
              <Button
                variant="outlined"
                onClick={(e) => toggleBookmarked(selectedIdea.id, e)}
                startIcon={<Bookmark size={18} fill={bookmarkedIdeas.has(selectedIdea.id) ? '#fbbf24' : 'none'} />}
                sx={{
                  borderColor: '#fbbf24',
                  color: '#fbbf24',
                  '&:hover': { borderColor: '#f59e0b', backgroundColor: 'rgba(251, 191, 36, 0.1)' },
                }}
              >
                {bookmarkedIdeas.has(selectedIdea.id) ? 'Queued' : 'Add to Queue'}
              </Button>
              <Button
                variant="contained"
                onClick={(e) => {
                  toggleCompleted(selectedIdea.id, e);
                  setSelectedIdea(null);
                }}
                startIcon={completedIdeas.has(selectedIdea.id) ? <X size={18} /> : <Trophy size={18} />}
                sx={{
                  backgroundColor: completedIdeas.has(selectedIdea.id) ? '#6b7280' : '#22c55e',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: completedIdeas.has(selectedIdea.id) ? '#4b5563' : '#16a34a',
                  },
                }}
              >
                {completedIdeas.has(selectedIdea.id) ? 'Mark Incomplete' : 'Mark Complete'}
              </Button>
            </DialogActions>
          </>
        )}
      </DialogStyled>
    </PageContainer>
  );
};

export default GamingActivityPlanner;
