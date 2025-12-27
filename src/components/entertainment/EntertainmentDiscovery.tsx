import React, { useState, useMemo } from 'react';
import {
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Typography,
  styled,
  keyframes,
} from '@mui/material';
import {
  Film,
  Tv,
  Mic2,
  Youtube,
  Popcorn,
  Sparkles,
  Radio,
  Star,
  Bookmark,
  Eye,
  Shuffle,
  Search,
} from 'lucide-react';
import entertainmentData from '../../data/entertainment_ideas.json';

interface EntertainmentIdea {
  id: string;
  category: string;
  title: string;
  description: string;
  energy_level: string;
  tags: string[];
}

const sparkle = keyframes`
  0%, 100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.2) rotate(180deg);
  }
`;

const starTwinkle = keyframes`
  0%, 100% {
    opacity: 0.3;
    transform: translateY(0);
  }
  50% {
    opacity: 1;
    transform: translateY(-5px);
  }
`;

const Container = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #0a0812 0%, #1a1028 100%)',
  padding: '2rem',
  color: '#fff',
});

const Header = styled(Box)({
  textAlign: 'center',
  marginBottom: '3rem',
  position: 'relative',
});

const Title = styled(Typography)({
  fontSize: '3rem',
  fontWeight: 'bold',
  background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginBottom: '0.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '1rem',
});

const SparkleIcon = styled(Sparkles)({
  animation: `${sparkle} 2s ease-in-out infinite`,
  color: '#ec4899',
});

const StarIcon = styled(Star)({
  animation: `${starTwinkle} 3s ease-in-out infinite`,
  color: '#f472b6',
  position: 'absolute',
  '&.star-1': { top: '10px', left: '20%', animationDelay: '0s' },
  '&.star-2': { top: '20px', right: '20%', animationDelay: '1s' },
  '&.star-3': { top: '40px', left: '30%', animationDelay: '2s' },
  '&.star-4': { top: '30px', right: '30%', animationDelay: '1.5s' },
});

const ControlsContainer = styled(Box)({
  marginBottom: '2rem',
});

const SearchBox = styled(TextField)({
  marginBottom: '1.5rem',
  '& .MuiOutlinedInput-root': {
    color: '#fff',
    backgroundColor: 'rgba(236, 72, 153, 0.1)',
    '& fieldset': {
      borderColor: '#ec4899',
    },
    '&:hover fieldset': {
      borderColor: '#f472b6',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#ec4899',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#f472b6',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#ec4899',
  },
});

const FilterChipsContainer = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.75rem',
  marginBottom: '1.5rem',
  justifyContent: 'center',
});

const CategoryChip = styled(Chip)<{ selected?: boolean }>(({ selected }) => ({
  backgroundColor: selected ? '#ec4899' : 'rgba(236, 72, 153, 0.2)',
  color: '#fff',
  border: `1px solid ${selected ? '#f472b6' : '#ec4899'}`,
  fontWeight: selected ? 'bold' : 'normal',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: selected ? '#f472b6' : 'rgba(236, 72, 153, 0.3)',
    transform: 'translateY(-2px)',
  },
}));

const EnergyChip = styled(Chip)<{ selected?: boolean }>(({ selected }) => ({
  backgroundColor: selected ? '#ec4899' : 'rgba(244, 114, 182, 0.2)',
  color: '#fff',
  border: `1px solid ${selected ? '#f472b6' : '#ec4899'}`,
  fontWeight: selected ? 'bold' : 'normal',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: selected ? '#f472b6' : 'rgba(244, 114, 182, 0.3)',
    transform: 'translateY(-2px)',
  },
}));

const ActionButtonsContainer = styled(Box)({
  display: 'flex',
  gap: '1rem',
  justifyContent: 'center',
  marginBottom: '1.5rem',
  flexWrap: 'wrap',
});

const ActionButton = styled(Button)({
  backgroundColor: 'rgba(236, 72, 153, 0.2)',
  color: '#f472b6',
  border: '1px solid #ec4899',
  padding: '0.75rem 1.5rem',
  fontWeight: 'bold',
  '&:hover': {
    backgroundColor: '#ec4899',
    color: '#fff',
  },
});

const CardsGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
  gap: '1.5rem',
  maxWidth: '1400px',
  margin: '0 auto',
});

const Card = styled(Box)({
  backgroundColor: 'rgba(26, 16, 40, 0.8)',
  border: '1px solid rgba(236, 72, 153, 0.3)',
  borderRadius: '12px',
  padding: '1.5rem',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-5px)',
    borderColor: '#ec4899',
    boxShadow: '0 8px 24px rgba(236, 72, 153, 0.3)',
  },
});

const CardHeader = styled(Box)({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  marginBottom: '0.75rem',
});

const CardTitle = styled(Typography)({
  fontSize: '1.25rem',
  fontWeight: 'bold',
  color: '#f472b6',
  marginBottom: '0.5rem',
});

const CardDescription = styled(Typography)({
  fontSize: '0.95rem',
  color: '#e0d0f0',
  marginBottom: '1rem',
  lineHeight: '1.5',
});

const TagsContainer = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5rem',
  marginBottom: '0.75rem',
});

const Tag = styled(Chip)({
  backgroundColor: 'rgba(236, 72, 153, 0.2)',
  color: '#f472b6',
  fontSize: '0.75rem',
  height: '24px',
  border: '1px solid rgba(236, 72, 153, 0.4)',
});

const EnergyBadge = styled(Chip)<{ level: string }>(({ level }) => {
  const colors = {
    low: '#10b981',
    medium: '#f59e0b',
    high: '#ef4444',
  };
  return {
    backgroundColor: `${colors[level as keyof typeof colors]}33`,
    color: colors[level as keyof typeof colors],
    fontWeight: 'bold',
    fontSize: '0.75rem',
    height: '24px',
    border: `1px solid ${colors[level as keyof typeof colors]}`,
  };
});

const IconButton = styled(Box)({
  cursor: 'pointer',
  color: '#f472b6',
  transition: 'all 0.2s ease',
  '&:hover': {
    color: '#ec4899',
    transform: 'scale(1.1)',
  },
  '&.active': {
    color: '#ec4899',
  },
});

const StatsContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  gap: '2rem',
  marginBottom: '2rem',
  flexWrap: 'wrap',
});

const StatBox = styled(Box)({
  backgroundColor: 'rgba(236, 72, 153, 0.1)',
  border: '1px solid #ec4899',
  borderRadius: '8px',
  padding: '1rem 2rem',
  textAlign: 'center',
});

const StatValue = styled(Typography)({
  fontSize: '2rem',
  fontWeight: 'bold',
  color: '#ec4899',
});

const StatLabel = styled(Typography)({
  fontSize: '0.9rem',
  color: '#f472b6',
  marginTop: '0.25rem',
});

const categoryIcons: Record<string, React.ReactElement> = {
  Movies: <Film size={20} />,
  TV: <Tv size={20} />,
  'Live Events': <Radio size={20} />,
  Podcasts: <Mic2 size={20} />,
  YouTube: <Youtube size={20} />,
  Comedy: <Popcorn size={20} />,
};

const EntertainmentDiscovery: React.FC = React.memo(() => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedEnergyLevel, setSelectedEnergyLevel] = useState<string>('');
  const [selectedIdea, setSelectedIdea] = useState<EntertainmentIdea | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [watchedIds, setWatchedIds] = useState<Set<string>>(new Set());
  const [randomIdea, setRandomIdea] = useState<EntertainmentIdea | null>(null);

  const ideas = entertainmentData.items as EntertainmentIdea[];
  const categories = ['Movies', 'TV', 'Live Events', 'Podcasts', 'YouTube', 'Comedy'];
  const energyLevels = ['low', 'medium', 'high'];

  const filteredIdeas = useMemo(() => {
    return ideas.filter((idea) => {
      const matchesSearch =
        searchQuery === '' ||
        idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === '' || idea.category === selectedCategory;
      const matchesEnergy = selectedEnergyLevel === '' || idea.energy_level === selectedEnergyLevel;

      return matchesSearch && matchesCategory && matchesEnergy;
    });
  }, [ideas, searchQuery, selectedCategory, selectedEnergyLevel]);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(selectedCategory === category ? '' : category);
  };

  const handleEnergyClick = (level: string) => {
    setSelectedEnergyLevel(selectedEnergyLevel === level ? '' : level);
  };

  const handleCardClick = (idea: EntertainmentIdea) => {
    setSelectedIdea(idea);
  };

  const handleCloseDialog = () => {
    setSelectedIdea(null);
  };

  const toggleBookmark = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
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

  const toggleWatched = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setWatchedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const generateRandomIdea = () => {
    const availableIdeas = filteredIdeas.length > 0 ? filteredIdeas : ideas;
    const randomIndex = Math.floor(Math.random() * availableIdeas.length);
    const idea = availableIdeas[randomIndex];
    setRandomIdea(idea);
    setSelectedIdea(idea);
  };

  return (
    <Container>
      <Header>
        <StarIcon className="star-1" size={24} />
        <StarIcon className="star-2" size={20} />
        <StarIcon className="star-3" size={28} />
        <StarIcon className="star-4" size={22} />
        <Title>
          <SparkleIcon size={40} />
          Entertainment Discovery
          <SparkleIcon size={40} />
        </Title>
        <Typography variant="h6" sx={{ color: '#f472b6', opacity: 0.9 }}>
          Discover your next favorite movie, show, or entertainment experience
        </Typography>
      </Header>

      <StatsContainer>
        <StatBox>
          <StatValue>{filteredIdeas.length}</StatValue>
          <StatLabel>Available Ideas</StatLabel>
        </StatBox>
        <StatBox>
          <StatValue>{bookmarkedIds.size}</StatValue>
          <StatLabel>Bookmarked</StatLabel>
        </StatBox>
        <StatBox>
          <StatValue>{watchedIds.size}</StatValue>
          <StatLabel>Watched</StatLabel>
        </StatBox>
      </StatsContainer>

      <ControlsContainer>
        <SearchBox
          fullWidth
          variant="outlined"
          label="Search entertainment ideas..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: <Search size={20} style={{ marginRight: '0.5rem', color: '#f472b6' }} />,
          }}
        />

        <Typography variant="subtitle1" sx={{ color: '#f472b6', mb: 1, fontWeight: 'bold' }}>
          Filter by Category:
        </Typography>
        <FilterChipsContainer>
          {categories.map((category) => (
            <CategoryChip
              key={category}
              label={category}
              icon={categoryIcons[category]}
              selected={selectedCategory === category}
              onClick={() => handleCategoryClick(category)}
            />
          ))}
        </FilterChipsContainer>

        <Typography variant="subtitle1" sx={{ color: '#f472b6', mb: 1, fontWeight: 'bold' }}>
          Filter by Energy Level:
        </Typography>
        <FilterChipsContainer>
          {energyLevels.map((level) => (
            <EnergyChip
              key={level}
              label={level.toUpperCase()}
              selected={selectedEnergyLevel === level}
              onClick={() => handleEnergyClick(level)}
            />
          ))}
        </FilterChipsContainer>

        <ActionButtonsContainer>
          <ActionButton startIcon={<Shuffle size={20} />} onClick={generateRandomIdea}>
            Random Entertainment
          </ActionButton>
          <ActionButton
            startIcon={<Bookmark size={20} />}
            onClick={() => {
              if (bookmarkedIds.size === 0) return;
              const bookmarked = ideas.filter((idea) => bookmarkedIds.has(idea.id));
              setSelectedCategory('');
              setSelectedEnergyLevel('');
              setSearchQuery('');
            }}
          >
            View Bookmarked ({bookmarkedIds.size})
          </ActionButton>
        </ActionButtonsContainer>
      </ControlsContainer>

      <CardsGrid>
        {filteredIdeas.map((idea) => (
          <Card key={idea.id} onClick={() => handleCardClick(idea)}>
            <CardHeader>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem', mb: 0.5 }}>
                  {categoryIcons[idea.category]}
                  <Typography variant="caption" sx={{ color: '#f472b6' }}>
                    {idea.category}
                  </Typography>
                </Box>
                <CardTitle>{idea.title}</CardTitle>
              </Box>
              <Box sx={{ display: 'flex', gap: '0.5rem' }}>
                <IconButton
                  className={bookmarkedIds.has(idea.id) ? 'active' : ''}
                  onClick={(e) => toggleBookmark(idea.id, e)}
                >
                  <Bookmark size={20} fill={bookmarkedIds.has(idea.id) ? '#ec4899' : 'none'} />
                </IconButton>
                <IconButton
                  className={watchedIds.has(idea.id) ? 'active' : ''}
                  onClick={(e) => toggleWatched(idea.id, e)}
                >
                  <Eye size={20} fill={watchedIds.has(idea.id) ? '#ec4899' : 'none'} />
                </IconButton>
              </Box>
            </CardHeader>

            <CardDescription>{idea.description}</CardDescription>

            <TagsContainer>
              {idea.tags.map((tag) => (
                <Tag key={tag} label={tag} size="small" />
              ))}
            </TagsContainer>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <EnergyBadge level={idea.energy_level} label={`${idea.energy_level} energy`} size="small" />
            </Box>
          </Card>
        ))}
      </CardsGrid>

      <Dialog
        open={selectedIdea !== null}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: '#1a1028',
            border: '2px solid #ec4899',
            borderRadius: '16px',
            color: '#fff',
          },
        }}
      >
        {selectedIdea && (
          <>
            <DialogTitle
              sx={{
                background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
                color: '#fff',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              {categoryIcons[selectedIdea.category]}
              {selectedIdea.title}
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: '#f472b6', mb: 0.5, fontWeight: 'bold' }}>
                  Category:
                </Typography>
                <Typography sx={{ color: '#e0d0f0' }}>{selectedIdea.category}</Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: '#f472b6', mb: 0.5, fontWeight: 'bold' }}>
                  Description:
                </Typography>
                <Typography sx={{ color: '#e0d0f0', lineHeight: 1.6 }}>{selectedIdea.description}</Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: '#f472b6', mb: 0.5, fontWeight: 'bold' }}>
                  Energy Level:
                </Typography>
                <EnergyBadge level={selectedIdea.energy_level} label={`${selectedIdea.energy_level} energy`} />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: '#f472b6', mb: 1, fontWeight: 'bold' }}>
                  Tags:
                </Typography>
                <TagsContainer>
                  {selectedIdea.tags.map((tag) => (
                    <Tag key={tag} label={tag} />
                  ))}
                </TagsContainer>
              </Box>

              <Box sx={{ display: 'flex', gap: '1rem', mt: 3 }}>
                <Button
                  fullWidth
                  variant={bookmarkedIds.has(selectedIdea.id) ? 'contained' : 'outlined'}
                  startIcon={<Bookmark size={20} />}
                  onClick={() => toggleBookmark(selectedIdea.id)}
                  sx={{
                    borderColor: '#ec4899',
                    color: bookmarkedIds.has(selectedIdea.id) ? '#fff' : '#ec4899',
                    backgroundColor: bookmarkedIds.has(selectedIdea.id) ? '#ec4899' : 'transparent',
                    '&:hover': {
                      backgroundColor: '#f472b6',
                      borderColor: '#f472b6',
                      color: '#fff',
                    },
                  }}
                >
                  {bookmarkedIds.has(selectedIdea.id) ? 'Bookmarked' : 'Bookmark'}
                </Button>
                <Button
                  fullWidth
                  variant={watchedIds.has(selectedIdea.id) ? 'contained' : 'outlined'}
                  startIcon={<Eye size={20} />}
                  onClick={() => toggleWatched(selectedIdea.id)}
                  sx={{
                    borderColor: '#ec4899',
                    color: watchedIds.has(selectedIdea.id) ? '#fff' : '#ec4899',
                    backgroundColor: watchedIds.has(selectedIdea.id) ? '#ec4899' : 'transparent',
                    '&:hover': {
                      backgroundColor: '#f472b6',
                      borderColor: '#f472b6',
                      color: '#fff',
                    },
                  }}
                >
                  {watchedIds.has(selectedIdea.id) ? 'Watched' : 'Mark Watched'}
                </Button>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button
                onClick={handleCloseDialog}
                sx={{
                  color: '#f472b6',
                  '&:hover': {
                    backgroundColor: 'rgba(236, 72, 153, 0.1)',
                  },
                }}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
});

EntertainmentDiscovery.displayName = 'EntertainmentDiscovery';

export default EntertainmentDiscovery;
