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
  Heart,
  Search,
  Sparkles,
  Dog,
  Cat,
  Fish,
  Bird,
  Rabbit,
  Bug,
  CheckCircle2,
  Bookmark,
  Shuffle,
  X,
  Zap,
} from 'lucide-react';

// Import pet care data
import petCareData from '../../data/pet_care_ideas.json';

// Animations
const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
`;

const wag = keyframes`
  0%, 100% { transform: rotate(-5deg); }
  50% { transform: rotate(5deg); }
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
    background: 'radial-gradient(ellipse at center top, rgba(34, 197, 94, 0.15) 0%, transparent 70%)',
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
  background: 'linear-gradient(135deg, #22c55e 0%, #4ade80 50%, #22c55e 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginBottom: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '12px',
  '& svg': {
    animation: `${pulse} 2s ease-in-out infinite`,
  },
});

const Subtitle = styled(Typography)({
  color: 'rgba(34, 197, 94, 0.8)',
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
      borderColor: 'rgba(34, 197, 94, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(34, 197, 94, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#22c55e',
    },
  },
  '& .MuiInputAdornment-root svg': {
    color: '#22c55e',
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
  border: '1px solid rgba(34, 197, 94, 0.2)',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  minWidth: '140px',
});

const StatNumber = styled(Typography)({
  fontSize: '1.5rem',
  fontWeight: 700,
  color: '#22c55e',
});

const StatLabel = styled(Typography)({
  fontSize: '0.75rem',
  color: 'rgba(34, 197, 94, 0.7)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
});

const RandomButton = styled(Button)({
  background: 'linear-gradient(135deg, #22c55e 0%, #4ade80 100%)',
  color: '#0a0812',
  borderRadius: '20px',
  padding: '10px 24px',
  fontWeight: 600,
  marginBottom: '24px',
  '&:hover': {
    background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
    transform: 'scale(1.02)',
  },
});

const PetGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
  gap: '20px',
  maxWidth: '1400px',
  margin: '0 auto',
});

const PetCard = styled(Card)<{ difficulty?: string }>(({ difficulty }) => {
  const colors: Record<string, string> = {
    easy: '#22c55e',
    medium: '#fbbf24',
    hard: '#ef4444',
  };
  const color = colors[difficulty || 'easy'] || colors.easy;

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

const PetTitle = styled(Typography)({
  fontSize: '1.1rem',
  fontWeight: 600,
  color: '#f0e6ff',
  marginBottom: '8px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

const PetDescription = styled(Typography)({
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

const PetTag = styled(Chip)({
  backgroundColor: 'rgba(34, 197, 94, 0.15)',
  color: '#22c55e',
  fontSize: '0.7rem',
  height: '24px',
  border: '1px solid rgba(34, 197, 94, 0.3)',
});

const DifficultyBadge = styled(Box)<{ level?: string }>(({ level }) => {
  const colors: Record<string, { bg: string; text: string }> = {
    easy: { bg: 'rgba(34, 197, 94, 0.2)', text: '#22c55e' },
    medium: { bg: 'rgba(251, 191, 36, 0.2)', text: '#fbbf24' },
    hard: { bg: 'rgba(239, 68, 68, 0.2)', text: '#ef4444' },
  };
  const style = colors[level || 'easy'] || colors.easy;

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
    border: '1px solid rgba(34, 197, 94, 0.3)',
    maxWidth: '600px',
    width: '100%',
  },
});

// Types
interface PetCareIdea {
  id: string;
  category: string;
  title: string;
  description: string;
  pet_type: string;
  difficulty: string;
  frequency: string;
  tags: string[];
}

// Pet type configuration
const petTypes = [
  { id: 'all', name: 'All Pets', icon: Heart, color: '#d4af37' },
  { id: 'dog', name: 'Dog', icon: Dog, color: '#8b5cf6' },
  { id: 'cat', name: 'Cat', icon: Cat, color: '#ec4899' },
  { id: 'bird', name: 'Bird', icon: Bird, color: '#06b6d4' },
  { id: 'fish', name: 'Fish', icon: Fish, color: '#3b82f6' },
  { id: 'small-animal', name: 'Small Pets', icon: Rabbit, color: '#f59e0b' },
  { id: 'reptile', name: 'Reptiles', icon: Bug, color: '#22c55e' },
];

export const PetCareCompanion: React.FC = React.memo(() => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPetType, setSelectedPetType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [selectedIdea, setSelectedIdea] = useState<PetCareIdea | null>(null);
  const [completedIdeas, setCompletedIdeas] = useState<Set<string>>(new Set());
  const [bookmarkedIdeas, setBookmarkedIdeas] = useState<Set<string>>(new Set());

  const ideas: PetCareIdea[] = petCareData.items;

  // Get unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(ideas.map((idea) => idea.category)));
    return cats.sort();
  }, [ideas]);

  const filteredIdeas = useMemo(() => {
    return ideas.filter((idea) => {
      const matchesSearch =
        searchQuery === '' ||
        idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesPetType =
        selectedPetType === 'all' || idea.pet_type === selectedPetType;

      const matchesCategory = !selectedCategory || idea.category === selectedCategory;

      const matchesDifficulty = !selectedDifficulty || idea.difficulty === selectedDifficulty;

      return matchesSearch && matchesPetType && matchesCategory && matchesDifficulty;
    });
  }, [ideas, searchQuery, selectedPetType, selectedCategory, selectedDifficulty]);

  const stats = useMemo(() => {
    return {
      total: ideas.length,
      completed: completedIdeas.size,
      bookmarked: bookmarkedIdeas.size,
      dogs: ideas.filter((i) => i.pet_type === 'dog').length,
      cats: ideas.filter((i) => i.pet_type === 'cat').length,
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

  const getPetTypeIcon = (petType: string) => {
    const type = petTypes.find((t) => t.id === petType);
    return type ? type.icon : Heart;
  };

  const getPetTypeColor = (petType: string) => {
    const type = petTypes.find((t) => t.id === petType);
    return type ? type.color : '#22c55e';
  };

  return (
    <PageContainer>
      <Header>
        <Title variant="h1">
          <Heart size={36} />
          Pet Care Companion
        </Title>
        <Subtitle>100+ pet care ideas for dogs, cats, and all companion animals</Subtitle>
      </Header>

      <StatsPanel>
        <StatCard>
          <Heart size={24} color="#22c55e" />
          <Box>
            <StatNumber>{stats.total}</StatNumber>
            <StatLabel>Ideas</StatLabel>
          </Box>
        </StatCard>
        <StatCard>
          <CheckCircle2 size={24} color="#4ade80" />
          <Box>
            <StatNumber>{stats.completed}</StatNumber>
            <StatLabel>Completed</StatLabel>
          </Box>
        </StatCard>
        <StatCard>
          <Bookmark size={24} color="#8b5cf6" />
          <Box>
            <StatNumber>{stats.bookmarked}</StatNumber>
            <StatLabel>Saved</StatLabel>
          </Box>
        </StatCard>
        <StatCard>
          <Dog size={24} color="#d4af37" />
          <Box>
            <StatNumber>{stats.dogs}</StatNumber>
            <StatLabel>Dog Care</StatLabel>
          </Box>
        </StatCard>
      </StatsPanel>

      <Box sx={{ textAlign: 'center' }}>
        <RandomButton onClick={getRandomIdea} startIcon={<Shuffle size={18} />}>
          Random Care Tip
        </RandomButton>
      </Box>

      <SearchContainer>
        <StyledTextField
          fullWidth
          placeholder="Search pet care tips, activities, health..."
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
        {petTypes.map((type) => {
          const Icon = type.icon;
          return (
            <CategoryChip
              key={type.id}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Icon size={14} />
                  {type.name}
                </Box>
              }
              selected={selectedPetType === type.id}
              chipcolor={type.color}
              onClick={() => setSelectedPetType(type.id)}
            />
          );
        })}
      </CategoryContainer>

      {/* Category filters */}
      <Box sx={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
        <Chip
          label="All Categories"
          onClick={() => setSelectedCategory(null)}
          sx={{
            backgroundColor: !selectedCategory ? '#22c55e' : 'rgba(26, 16, 40, 0.6)',
            color: !selectedCategory ? '#0a0812' : '#22c55e',
            border: '1px solid #22c55e',
            fontWeight: !selectedCategory ? 600 : 400,
          }}
        />
        {categories.slice(0, 8).map((category) => (
          <Chip
            key={category}
            label={category}
            onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
            sx={{
              backgroundColor: selectedCategory === category ? '#8b5cf6' : 'rgba(26, 16, 40, 0.6)',
              color: selectedCategory === category ? '#0a0812' : '#8b5cf6',
              border: '1px solid #8b5cf6',
              fontWeight: selectedCategory === category ? 600 : 400,
            }}
          />
        ))}
      </Box>

      {/* Difficulty filter */}
      <Box sx={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '24px' }}>
        {['easy', 'medium', 'hard'].map((difficulty) => (
          <Chip
            key={difficulty}
            label={`${difficulty} difficulty`}
            icon={<Zap size={12} />}
            onClick={() => setSelectedDifficulty(selectedDifficulty === difficulty ? null : difficulty)}
            sx={{
              backgroundColor: selectedDifficulty === difficulty
                ? (difficulty === 'easy' ? '#22c55e' : difficulty === 'medium' ? '#fbbf24' : '#ef4444')
                : 'rgba(26, 16, 40, 0.6)',
              color: selectedDifficulty === difficulty ? '#0a0812' : (difficulty === 'easy' ? '#22c55e' : difficulty === 'medium' ? '#fbbf24' : '#ef4444'),
              border: `1px solid ${difficulty === 'easy' ? '#22c55e' : difficulty === 'medium' ? '#fbbf24' : '#ef4444'}`,
              '& .MuiChip-icon': {
                color: selectedDifficulty === difficulty ? '#0a0812' : (difficulty === 'easy' ? '#22c55e' : difficulty === 'medium' ? '#fbbf24' : '#ef4444'),
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
        Showing {filteredIdeas.length} of {ideas.length} pet care ideas
      </Typography>

      <PetGrid>
        {filteredIdeas.map((idea) => {
          const isCompleted = completedIdeas.has(idea.id);
          const isBookmarked = bookmarkedIdeas.has(idea.id);
          const PetIcon = getPetTypeIcon(idea.pet_type);

          return (
            <PetCard
              key={idea.id}
              difficulty={idea.difficulty}
              onClick={() => setSelectedIdea(idea)}
            >
              {isCompleted && (
                <CompletedBadge>
                  <CheckCircle2 size={12} />
                  Done
                </CompletedBadge>
              )}
              <CardContent sx={{ padding: '20px' }}>
                <PetTitle>
                  <PetIcon size={18} color={getPetTypeColor(idea.pet_type)} />
                  {idea.title}
                </PetTitle>

                <Box sx={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                  <DifficultyBadge level={idea.difficulty}>
                    <Zap size={10} />
                    {idea.difficulty}
                  </DifficultyBadge>
                  <Chip
                    size="small"
                    label={idea.frequency}
                    sx={{
                      backgroundColor: 'rgba(139, 92, 246, 0.2)',
                      color: '#8b5cf6',
                      fontSize: '0.7rem',
                      height: '24px',
                      border: '1px solid rgba(139, 92, 246, 0.4)',
                    }}
                  />
                  {isBookmarked && (
                    <Bookmark size={16} color="#d4af37" fill="#d4af37" />
                  )}
                </Box>

                <PetDescription>{idea.description}</PetDescription>

                <TagContainer>
                  {idea.tags.slice(0, 3).map((tag) => (
                    <PetTag key={tag} label={tag} size="small" />
                  ))}
                </TagContainer>
              </CardContent>
            </PetCard>
          );
        })}
      </PetGrid>

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
                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(74, 222, 128, 0.1) 100%)',
                color: '#f0e6ff',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Heart size={24} color="#22c55e" />
                {selectedIdea.title}
              </Box>
              <IconButton onClick={() => setSelectedIdea(null)} sx={{ color: '#f0e6ff' }}>
                <X size={20} />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ padding: '24px' }}>
              <Box sx={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <DifficultyBadge level={selectedIdea.difficulty}>
                  <Zap size={12} />
                  {selectedIdea.difficulty} difficulty
                </DifficultyBadge>
                <Chip
                  label={selectedIdea.category}
                  sx={{
                    backgroundColor: 'rgba(139, 92, 246, 0.2)',
                    color: '#8b5cf6',
                    border: '1px solid rgba(139, 92, 246, 0.4)',
                  }}
                />
                <Chip
                  label={selectedIdea.frequency}
                  sx={{
                    backgroundColor: 'rgba(212, 175, 55, 0.2)',
                    color: '#d4af37',
                    border: '1px solid rgba(212, 175, 55, 0.4)',
                  }}
                />
                <Chip
                  label={selectedIdea.pet_type.replace('-', ' ')}
                  icon={React.createElement(getPetTypeIcon(selectedIdea.pet_type), { size: 14 })}
                  sx={{
                    backgroundColor: `${getPetTypeColor(selectedIdea.pet_type)}20`,
                    color: getPetTypeColor(selectedIdea.pet_type),
                    border: `1px solid ${getPetTypeColor(selectedIdea.pet_type)}40`,
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
                <Typography sx={{ color: '#22c55e', fontWeight: 600, marginBottom: '12px' }}>
                  Tags
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {selectedIdea.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      sx={{
                        backgroundColor: 'rgba(34, 197, 94, 0.15)',
                        color: '#22c55e',
                        border: '1px solid rgba(34, 197, 94, 0.3)',
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </DialogContent>
            <DialogActions sx={{ padding: '16px 24px', borderTop: '1px solid rgba(34, 197, 94, 0.2)' }}>
              <Button
                variant="outlined"
                onClick={(e) => toggleBookmarked(selectedIdea.id, e)}
                startIcon={<Bookmark size={18} fill={bookmarkedIdeas.has(selectedIdea.id) ? '#d4af37' : 'none'} />}
                sx={{
                  borderColor: '#d4af37',
                  color: '#d4af37',
                  '&:hover': { borderColor: '#c4a030', backgroundColor: 'rgba(212, 175, 55, 0.1)' },
                }}
              >
                {bookmarkedIdeas.has(selectedIdea.id) ? 'Saved' : 'Save Tip'}
              </Button>
              <Button
                variant="contained"
                onClick={(e) => {
                  toggleCompleted(selectedIdea.id, e);
                  setSelectedIdea(null);
                }}
                startIcon={completedIdeas.has(selectedIdea.id) ? <X size={18} /> : <CheckCircle2 size={18} />}
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
});

PetCareCompanion.displayName = 'PetCareCompanion';

export default PetCareCompanion;
