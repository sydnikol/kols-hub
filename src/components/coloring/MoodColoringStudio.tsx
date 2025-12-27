import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Chip,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Slider,
  IconButton,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Search,
  Palette,
  Heart,
  Sparkles,
  Sun,
  Moon,
  Cloud,
  Leaf,
  Star,
  Zap,
  Clock,
  X,
  Play,
  Bookmark,
  BookmarkCheck,
  Flame,
  Snowflake,
  Flower2,
  TreeDeciduous,
} from 'lucide-react';

// Animation keyframes
const colorShift = keyframes`
  0% { filter: hue-rotate(0deg); }
  50% { filter: hue-rotate(30deg); }
  100% { filter: hue-rotate(0deg); }
`;

const gentlePulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.02); opacity: 0.9; }
`;

// Styled Components
const PageContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #0a0812 0%, #1a1028 50%, #0d0d1a 100%)',
  padding: '24px',
  paddingBottom: '100px',
});

const Header = styled(Box)({
  textAlign: 'center',
  marginBottom: '32px',
});

const Title = styled(Typography)({
  fontSize: '2.5rem',
  fontWeight: 700,
  background: 'linear-gradient(135deg, #f97316 0%, #ec4899 33%, #8b5cf6 66%, #06b6d4 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginBottom: '8px',
  fontFamily: '"Cinzel", serif',
});

const Subtitle = styled(Typography)({
  color: '#a0a0a0',
  fontSize: '1rem',
});

const MoodSelector = styled(Box)({
  background: 'linear-gradient(145deg, rgba(26, 16, 40, 0.8) 0%, rgba(13, 13, 26, 0.9) 100%)',
  borderRadius: '20px',
  padding: '24px',
  marginBottom: '24px',
  border: '1px solid rgba(139, 92, 246, 0.2)',
});

const MoodSlider = styled(Slider)({
  color: '#8b5cf6',
  '& .MuiSlider-thumb': {
    backgroundColor: '#d4af37',
    '&:hover, &.Mui-focusVisible': {
      boxShadow: '0 0 0 8px rgba(212, 175, 55, 0.2)',
    },
  },
  '& .MuiSlider-track': {
    background: 'linear-gradient(90deg, #22c55e, #eab308, #ef4444)',
  },
  '& .MuiSlider-rail': {
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
  },
  '& .MuiSlider-mark': {
    backgroundColor: '#fff',
  },
});

const SearchContainer = styled(Box)({
  maxWidth: '600px',
  margin: '0 auto 24px',
});

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: '12px',
    '& fieldset': {
      borderColor: 'rgba(139, 92, 246, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: '#8b5cf6',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#ec4899',
    },
  },
  '& .MuiInputBase-input': {
    color: '#fff',
  },
});

const CategoryChipsContainer = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  justifyContent: 'center',
  marginBottom: '24px',
});

const CategoryChip = styled(Chip)<{ selected?: boolean; chipcolor?: string }>(({ selected, chipcolor }) => ({
  backgroundColor: selected ? chipcolor || '#8b5cf6' : 'rgba(139, 92, 246, 0.15)',
  color: selected ? '#fff' : '#d4af37',
  border: `1px solid ${selected ? chipcolor || '#8b5cf6' : 'rgba(212, 175, 55, 0.3)'}`,
  '&:hover': {
    backgroundColor: selected ? chipcolor || '#8b5cf6' : 'rgba(139, 92, 246, 0.25)',
  },
  transition: 'all 0.3s ease',
}));

const ColoringGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: '20px',
  maxWidth: '1400px',
  margin: '0 auto',
});

const ColoringCard = styled(Box)<{ energylevel?: string }>(({ energylevel }) => ({
  background: 'linear-gradient(145deg, rgba(26, 16, 40, 0.9) 0%, rgba(13, 13, 26, 0.95) 100%)',
  borderRadius: '16px',
  padding: '20px',
  border: `1px solid ${
    energylevel === 'low' ? 'rgba(34, 197, 94, 0.3)' :
    energylevel === 'medium' ? 'rgba(234, 179, 8, 0.3)' :
    'rgba(239, 68, 68, 0.3)'
  }`,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-5px)',
    animation: `${gentlePulse} 2s ease-in-out infinite`,
    boxShadow: `0 10px 40px ${
      energylevel === 'low' ? 'rgba(34, 197, 94, 0.2)' :
      energylevel === 'medium' ? 'rgba(234, 179, 8, 0.2)' :
      'rgba(239, 68, 68, 0.2)'
    }`,
  },
}));

const ColorPreview = styled(Box)<{ category?: string }>(({ category }) => ({
  width: '100%',
  height: '120px',
  borderRadius: '12px',
  marginBottom: '16px',
  background: getGradientForCategory(category || 'Relaxation'),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  animation: `${colorShift} 10s ease-in-out infinite`,
}));

function getGradientForCategory(category: string): string {
  const gradients: { [key: string]: string } = {
    'Relaxation': 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #6B8DD6 100%)',
    'Nature': 'linear-gradient(135deg, #11998e 0%, #38ef7d 50%, #56ab2f 100%)',
    'Fantasy': 'linear-gradient(135deg, #8e2de2 0%, #4a00e0 50%, #8b5cf6 100%)',
    'Geometric': 'linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #4facfe 100%)',
    'Animals': 'linear-gradient(135deg, #fa709a 0%, #fee140 50%, #f093fb 100%)',
    'Pattern': 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 50%, #a6c1ee 100%)',
    'Cultural': 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fad0c4 100%)',
    'Architecture': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 50%, #43e97b 100%)',
    'Art Style': 'linear-gradient(135deg, #fa709a 0%, #fee140 50%, #a18cd1 100%)',
    'Seasonal': 'linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #ffecd2 100%)',
    'Inspirational': 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 50%, #ff9a9e 100%)',
  };
  return gradients[category] || gradients['Relaxation'];
}

const CardTitle = styled(Typography)({
  fontSize: '1.1rem',
  fontWeight: 600,
  color: '#fff',
  marginBottom: '8px',
});

const CardDescription = styled(Typography)({
  fontSize: '0.85rem',
  color: '#a0a0a0',
  lineHeight: 1.5,
  marginBottom: '12px',
});

const EnergyBadge = styled(Box)<{ level?: string }>(({ level }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  padding: '4px 10px',
  borderRadius: '12px',
  fontSize: '0.75rem',
  fontWeight: 600,
  backgroundColor: level === 'low' ? 'rgba(34, 197, 94, 0.2)' :
                   level === 'medium' ? 'rgba(234, 179, 8, 0.2)' :
                   'rgba(239, 68, 68, 0.2)',
  color: level === 'low' ? '#4ade80' :
         level === 'medium' ? '#facc15' :
         '#f87171',
}));

const TagsContainer = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '6px',
  marginTop: '12px',
});

const Tag = styled(Box)({
  padding: '2px 8px',
  borderRadius: '8px',
  fontSize: '0.7rem',
  backgroundColor: 'rgba(236, 72, 153, 0.15)',
  color: '#f472b6',
  border: '1px solid rgba(236, 72, 153, 0.2)',
});

const StyledDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    background: 'linear-gradient(145deg, #1a1028 0%, #0d0d1a 100%)',
    border: '1px solid rgba(139, 92, 246, 0.3)',
    borderRadius: '20px',
    maxWidth: '600px',
    width: '100%',
  },
});

const StatsBar = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  gap: '32px',
  padding: '20px',
  background: 'linear-gradient(145deg, rgba(26, 16, 40, 0.8) 0%, rgba(13, 13, 26, 0.9) 100%)',
  borderRadius: '16px',
  marginBottom: '24px',
  flexWrap: 'wrap',
});

const StatItem = styled(Box)({
  textAlign: 'center',
});

const StatValue = styled(Typography)({
  fontSize: '1.8rem',
  fontWeight: 700,
  color: '#ec4899',
});

const StatLabel = styled(Typography)({
  fontSize: '0.8rem',
  color: '#888',
  textTransform: 'uppercase',
  letterSpacing: '1px',
});

// Data
const coloringIdeas = [
  { id: 'coloring_001', category: 'Relaxation', title: 'Mindful Mandala Session', description: 'Color a mandala pattern while focusing on breath. Moving meditation through color.', energy_level: 'low', tags: ['mandala', 'mindful', 'meditation'] },
  { id: 'coloring_002', category: 'Nature', title: 'Botanical Garden Page', description: 'Color intricate flowers and plants. Study color in nature through pages.', energy_level: 'low', tags: ['botanical', 'flowers', 'nature'] },
  { id: 'coloring_003', category: 'Fantasy', title: 'Dragon and Creatures', description: 'Color fantasy creatures. Create your own color mythology.', energy_level: 'medium', tags: ['fantasy', 'dragons', 'creatures'] },
  { id: 'coloring_004', category: 'Geometric', title: 'Sacred Geometry Patterns', description: 'Color complex geometric patterns. Explore symmetry through coloring.', energy_level: 'medium', tags: ['geometric', 'sacred', 'symmetry'] },
  { id: 'coloring_005', category: 'Relaxation', title: 'Ocean Waves Therapy', description: 'Color ocean and water scenes. Blue tones are naturally calming.', energy_level: 'low', tags: ['ocean', 'water', 'calming'] },
  { id: 'coloring_006', category: 'Architecture', title: 'Gothic Cathedral Detail', description: 'Color intricate cathedral architecture. Windows, arches, and details.', energy_level: 'medium', tags: ['gothic', 'architecture', 'detail'] },
  { id: 'coloring_007', category: 'Animals', title: 'Wildlife Portrait', description: 'Color detailed animal portraits. Study fur, feathers, and scales.', energy_level: 'medium', tags: ['animals', 'wildlife', 'portrait'] },
  { id: 'coloring_008', category: 'Pattern', title: 'Zentangle Inspired', description: 'Color zentangle-style patterns. Repetitive meditative designs.', energy_level: 'low', tags: ['zentangle', 'pattern', 'repetitive'] },
  { id: 'coloring_009', category: 'Fantasy', title: 'Enchanted Forest', description: 'Color magical forest scenes with hidden details to find.', energy_level: 'medium', tags: ['forest', 'magical', 'hidden'] },
  { id: 'coloring_010', category: 'Seasonal', title: 'Holiday Theme Page', description: 'Color seasonal holiday pages. Match your coloring to the time of year.', energy_level: 'low', tags: ['holiday', 'seasonal', 'festive'] },
  { id: 'coloring_011', category: 'Art Style', title: 'Art Nouveau Design', description: 'Color flowing Art Nouveau patterns. Organic curves and natural forms.', energy_level: 'medium', tags: ['art-nouveau', 'flowing', 'organic'] },
  { id: 'coloring_012', category: 'Relaxation', title: 'Simple Pattern Warmup', description: 'Start with simple patterns to warm up and relax into coloring.', energy_level: 'low', tags: ['simple', 'warmup', 'easy'] },
  { id: 'coloring_013', category: 'Cultural', title: 'Mehndi Henna Patterns', description: 'Color intricate henna-inspired designs. Cultural artistry.', energy_level: 'medium', tags: ['mehndi', 'henna', 'cultural'] },
  { id: 'coloring_014', category: 'Nature', title: 'Butterfly Collection', description: 'Color butterfly wings with creative color combinations.', energy_level: 'low', tags: ['butterflies', 'wings', 'colorful'] },
  { id: 'coloring_015', category: 'Geometric', title: 'Optical Illusion Page', description: 'Color pages that create optical illusions when completed.', energy_level: 'medium', tags: ['optical', 'illusion', 'trick'] },
  { id: 'coloring_016', category: 'Inspirational', title: 'Quote Coloring Page', description: 'Color pages with inspirational quotes. Words and art combined.', energy_level: 'low', tags: ['quotes', 'inspirational', 'words'] },
  { id: 'coloring_017', category: 'Animals', title: 'Underwater Creatures', description: 'Color fish, coral, and sea life. Explore ocean color palettes.', energy_level: 'medium', tags: ['underwater', 'fish', 'coral'] },
  { id: 'coloring_018', category: 'Fantasy', title: 'Fairy Tale Scenes', description: 'Color classic fairy tale illustrations. Storybook aesthetics.', energy_level: 'medium', tags: ['fairy-tale', 'storybook', 'classic'] },
  { id: 'coloring_019', category: 'Cultural', title: 'Japanese Art Style', description: 'Color pages in traditional Japanese art styles.', energy_level: 'medium', tags: ['japanese', 'traditional', 'art'] },
  { id: 'coloring_020', category: 'Relaxation', title: 'Gradient Challenge', description: 'Practice smooth color gradients across a single image.', energy_level: 'medium', tags: ['gradient', 'blending', 'challenge'] },
];

const categories = [
  { id: 'all', name: 'All Pages', icon: Sparkles, color: '#d4af37' },
  { id: 'Relaxation', name: 'Relaxation', icon: Moon, color: '#8b5cf6' },
  { id: 'Nature', name: 'Nature', icon: Leaf, color: '#22c55e' },
  { id: 'Fantasy', name: 'Fantasy', icon: Star, color: '#ec4899' },
  { id: 'Geometric', name: 'Geometric', icon: Sparkles, color: '#06b6d4' },
  { id: 'Animals', name: 'Animals', icon: Heart, color: '#f97316' },
  { id: 'Pattern', name: 'Pattern', icon: Palette, color: '#a855f7' },
  { id: 'Cultural', name: 'Cultural', icon: Sun, color: '#eab308' },
  { id: 'Seasonal', name: 'Seasonal', icon: Snowflake, color: '#3b82f6' },
];

const seasonalIcons: { [key: string]: React.ReactElement } = {
  spring: <Flower2 size={40} color="#ec4899" />,
  summer: <Sun size={40} color="#f97316" />,
  fall: <TreeDeciduous size={40} color="#eab308" />,
  winter: <Snowflake size={40} color="#06b6d4" />,
};

export const MoodColoringStudio: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [energyLevel, setEnergyLevel] = useState<number>(50);
  const [selectedPage, setSelectedPage] = useState<typeof coloringIdeas[0] | null>(null);
  const [savedPages, setSavedPages] = useState<Set<string>>(new Set());

  const getCurrentSeason = () => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'fall';
    return 'winter';
  };

  const getEnergyFilter = (level: number): string => {
    if (level <= 33) return 'low';
    if (level <= 66) return 'medium';
    return 'high';
  };

  const filteredPages = useMemo(() => {
    const energyFilter = getEnergyFilter(energyLevel);

    return coloringIdeas.filter(page => {
      const matchesSearch = page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           page.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           page.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || page.category === selectedCategory;
      const matchesEnergy = energyFilter === 'high' || page.energy_level === energyFilter || page.energy_level === 'low';
      return matchesSearch && matchesCategory && matchesEnergy;
    });
  }, [searchQuery, selectedCategory, energyLevel]);

  const stats = useMemo(() => {
    const total = coloringIdeas.length;
    const lowEnergy = coloringIdeas.filter(p => p.energy_level === 'low').length;
    const mediumEnergy = coloringIdeas.filter(p => p.energy_level === 'medium').length;
    const highEnergy = coloringIdeas.filter(p => p.energy_level === 'high').length;
    const saved = savedPages.size;
    return { total, lowEnergy, mediumEnergy, highEnergy, saved };
  }, [savedPages]);

  const handleToggleSaved = (pageId: string) => {
    setSavedPages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(pageId)) {
        newSet.delete(pageId);
      } else {
        newSet.add(pageId);
      }
      return newSet;
    });
  };

  const getCategoryIcon = (categoryName: string) => {
    const category = categories.find(c => c.id === categoryName || c.name === categoryName);
    return category?.icon || Sparkles;
  };

  return (
    <PageContainer>
      <Header>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 1 }}>
          <Palette size={40} color="#ec4899" />
        </Box>
        <Title>Mood-Based Coloring Studio</Title>
        <Subtitle>Find the perfect coloring page for your current energy and mood</Subtitle>
      </Header>

      {/* Mood Selector */}
      <MoodSelector>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
          {seasonalIcons[getCurrentSeason()]}
          <Typography sx={{ color: '#d4af37', fontWeight: 600, fontSize: '1.1rem' }}>
            Current Season: {getCurrentSeason().charAt(0).toUpperCase() + getCurrentSeason().slice(1)}
          </Typography>
        </Box>

        <Typography sx={{ color: '#fff', textAlign: 'center', mb: 2 }}>
          How much energy do you have right now?
        </Typography>

        <Box sx={{ px: 4 }}>
          <MoodSlider
            value={energyLevel}
            onChange={(_, value) => setEnergyLevel(value as number)}
            marks={[
              { value: 0, label: 'Low' },
              { value: 50, label: 'Medium' },
              { value: 100, label: 'High' },
            ]}
            sx={{
              '& .MuiSlider-markLabel': {
                color: '#888',
              },
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 2, mt: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#22c55e' }}>
            <Moon size={16} />
            <Typography variant="caption">Simple & Calming</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#ef4444' }}>
            <Zap size={16} />
            <Typography variant="caption">Detailed & Engaging</Typography>
          </Box>
        </Box>
      </MoodSelector>

      <StatsBar>
        <StatItem>
          <StatValue>{stats.total}</StatValue>
          <StatLabel>Total Pages</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{stats.lowEnergy}</StatValue>
          <StatLabel>Low Energy</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{stats.mediumEnergy}</StatValue>
          <StatLabel>Medium Energy</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{stats.saved}</StatValue>
          <StatLabel>Saved</StatLabel>
        </StatItem>
      </StatsBar>

      <SearchContainer>
        <StyledTextField
          fullWidth
          placeholder="Search coloring pages by theme or mood..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} color="#8b5cf6" />
              </InputAdornment>
            ),
          }}
        />
      </SearchContainer>

      <CategoryChipsContainer>
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <CategoryChip
              key={category.id}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
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
      </CategoryChipsContainer>

      <Typography sx={{ color: '#888', textAlign: 'center', mb: 3 }}>
        Showing {filteredPages.length} pages matching your mood
      </Typography>

      <ColoringGrid>
        {filteredPages.map((page) => {
          const CategoryIcon = getCategoryIcon(page.category);
          const isSaved = savedPages.has(page.id);

          return (
            <ColoringCard
              key={page.id}
              energylevel={page.energy_level}
              onClick={() => setSelectedPage(page)}
            >
              <Box sx={{ position: 'absolute', top: 12, right: 12, zIndex: 1 }}>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleSaved(page.id);
                  }}
                  sx={{
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' }
                  }}
                >
                  {isSaved ?
                    <BookmarkCheck size={18} color="#d4af37" /> :
                    <Bookmark size={18} color="#888" />
                  }
                </IconButton>
              </Box>

              <ColorPreview category={page.category}>
                <CategoryIcon size={40} color="rgba(255,255,255,0.8)" />
              </ColorPreview>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography sx={{ color: '#8b5cf6', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  {page.category}
                </Typography>
              </Box>

              <CardTitle>{page.title}</CardTitle>
              <CardDescription>{page.description}</CardDescription>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <EnergyBadge level={page.energy_level}>
                  {page.energy_level === 'low' ? <Moon size={12} /> :
                   page.energy_level === 'medium' ? <Sun size={12} /> :
                   <Zap size={12} />}
                  {page.energy_level} energy
                </EnergyBadge>
              </Box>

              <TagsContainer>
                {page.tags.map((tag, idx) => (
                  <Tag key={idx}>{tag}</Tag>
                ))}
              </TagsContainer>
            </ColoringCard>
          );
        })}
      </ColoringGrid>

      {/* Page Detail Dialog */}
      <StyledDialog open={!!selectedPage} onClose={() => setSelectedPage(null)}>
        {selectedPage && (
          <>
            <DialogTitle sx={{
              borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Box>
                <Typography variant="overline" sx={{ color: '#ec4899' }}>
                  {selectedPage.category}
                </Typography>
                <Typography variant="h5" sx={{ color: '#fff', fontWeight: 600 }}>
                  {selectedPage.title}
                </Typography>
              </Box>
              <IconButton onClick={() => setSelectedPage(null)} sx={{ color: '#888' }}>
                <X size={24} />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
              <ColorPreview category={selectedPage.category} sx={{ height: 200, mb: 3 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Palette size={60} color="rgba(255,255,255,0.8)" />
                  <Typography sx={{ color: 'rgba(255,255,255,0.8)', mt: 1 }}>
                    Preview Area
                  </Typography>
                </Box>
              </ColorPreview>

              <Typography sx={{ color: '#e0e0e0', mb: 3, lineHeight: 1.7 }}>
                {selectedPage.description}
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                <EnergyBadge level={selectedPage.energy_level}>
                  {selectedPage.energy_level === 'low' ? <Moon size={14} /> :
                   selectedPage.energy_level === 'medium' ? <Sun size={14} /> :
                   <Zap size={14} />}
                  {selectedPage.energy_level} energy required
                </EnergyBadge>
              </Box>

              <Typography variant="subtitle2" sx={{ color: '#8b5cf6', mb: 1 }}>
                Themes:
              </Typography>
              <TagsContainer sx={{ mb: 2 }}>
                {selectedPage.tags.map((tag, idx) => (
                  <Tag key={idx} sx={{ fontSize: '0.8rem', padding: '4px 12px' }}>{tag}</Tag>
                ))}
              </TagsContainer>

              <Box sx={{
                mt: 3,
                p: 2,
                background: 'rgba(236, 72, 153, 0.1)',
                borderRadius: '12px',
                border: '1px solid rgba(236, 72, 153, 0.2)'
              }}>
                <Typography sx={{ color: '#ec4899', fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Heart size={18} />
                  Coloring Tip
                </Typography>
                <Typography sx={{ color: '#a0a0a0', fontSize: '0.9rem' }}>
                  Take your time and enjoy the process. There's no right or wrong way to color - let your creativity flow and choose colors that feel good to you.
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(139, 92, 246, 0.2)' }}>
              <Button
                variant="outlined"
                onClick={() => handleToggleSaved(selectedPage.id)}
                startIcon={savedPages.has(selectedPage.id) ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                sx={{
                  borderColor: 'rgba(212, 175, 55, 0.5)',
                  color: '#d4af37',
                  '&:hover': {
                    borderColor: '#d4af37',
                    backgroundColor: 'rgba(212, 175, 55, 0.1)',
                  },
                }}
              >
                {savedPages.has(selectedPage.id) ? 'Saved' : 'Save Page'}
              </Button>
              <Button
                variant="contained"
                startIcon={<Play size={18} />}
                sx={{
                  backgroundColor: '#ec4899',
                  '&:hover': { backgroundColor: '#db2777' },
                }}
              >
                Start Coloring
              </Button>
            </DialogActions>
          </>
        )}
      </StyledDialog>
    </PageContainer>
  );
};

export default MoodColoringStudio;
