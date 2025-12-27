import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Fade,
  Tooltip,
  Avatar,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Image,
  Calendar,
  Clock,
  Moon,
  Filter,
  X,
  Download,
  Share2,
  Eye,
  Zap,
  Tag,
  ChevronLeft,
  ChevronRight,
  Grid,
  LayoutList,
  Palette,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { DreamEntry, DREAM_STORAGE_KEY, moonPhases, dreamMoods } from './DreamJournal';
import { getSymbolById, dreamSymbolCategories } from '../../data/dream_symbols';

// ============ ANIMATIONS ============
const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(2deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.02); }
`;

const morphAnimation = keyframes`
  0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
  25% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
  50% { border-radius: 40% 60% 60% 40% / 30% 60% 40% 70%; }
  75% { border-radius: 60% 40% 30% 70% / 40% 40% 60% 50%; }
`;

// ============ STYLED COMPONENTS ============
const GalleryContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #0a0812 0%, #0d0a1a 50%, #1a0d1a 100%)',
  padding: '24px',
});

const GothicTitle = styled(Typography)({
  fontFamily: '"Cinzel Decorative", "Times New Roman", serif',
  background: 'linear-gradient(135deg, #c0c0c0 0%, #a78bfa 30%, #8b5cf6 60%, #c0c0c0 100%)',
  backgroundSize: '200% auto',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
  textShadow: '0 0 40px rgba(139, 92, 246, 0.5)',
  animation: `${shimmer} 4s linear infinite`,
});

const TimelineContainer = styled(Box)({
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
    width: 2,
    background: 'linear-gradient(180deg, transparent, #8b5cf6, #c0c0c0, #8b5cf6, transparent)',
    transform: 'translateX(-50%)',
  },
});

const TimelineItem = styled(Box)<{ side: 'left' | 'right' }>(({ side }) => ({
  display: 'flex',
  justifyContent: side === 'left' ? 'flex-end' : 'flex-start',
  paddingLeft: side === 'left' ? 0 : '52%',
  paddingRight: side === 'left' ? '52%' : 0,
  marginBottom: 32,
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: 16,
    height: 16,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #8b5cf6 0%, #c0c0c0 100%)',
    transform: 'translate(-50%, -50%)',
    boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)',
    zIndex: 1,
  },
}));

const DreamCard = styled(Card)<{ mood?: string }>(({ mood }) => ({
  background: mood === 'peaceful'
    ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)'
    : mood === 'nightmare'
    ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(185, 28, 28, 0.1) 100%)'
    : mood === 'prophetic'
    ? 'linear-gradient(135deg, rgba(192, 192, 192, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%)'
    : mood === 'lucid'
    ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.1) 100%)'
    : 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(99, 102, 241, 0.05) 100%)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(139, 92, 246, 0.3)',
  borderRadius: '16px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px) scale(1.02)',
    boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)',
    borderColor: 'rgba(192, 192, 192, 0.5)',
  },
}));

const ArtworkCanvas = styled(Box)<{ colors?: string[] }>(({ colors = ['#8b5cf6', '#c0c0c0'] }) => ({
  width: '100%',
  aspectRatio: '1',
  borderRadius: '16px',
  position: 'relative',
  overflow: 'hidden',
  background: `linear-gradient(135deg, ${colors[0]}20 0%, ${colors[1] || colors[0]}20 100%)`,
  border: '1px solid rgba(139, 92, 246, 0.3)',
}));

const FloatingShape = styled(Box)<{ color: string; delay?: number; size?: number }>(
  ({ color, delay = 0, size = 60 }) => ({
    position: 'absolute',
    width: size,
    height: size,
    background: `radial-gradient(ellipse at center, ${color}40 0%, ${color}10 70%, transparent 100%)`,
    animation: `${float} ${4 + delay}s ease-in-out infinite`,
    animationDelay: `${delay}s`,
  })
);

const MorphingShape = styled(Box)<{ color: string; delay?: number }>(({ color, delay = 0 }) => ({
  position: 'absolute',
  width: '40%',
  height: '40%',
  background: `radial-gradient(ellipse at center, ${color}30 0%, transparent 70%)`,
  animation: `${morphAnimation} ${8 + delay}s ease-in-out infinite`,
  animationDelay: `${delay}s`,
  filter: 'blur(2px)',
}));

// ============ TYPES ============
type ViewMode = 'timeline' | 'grid' | 'gallery';
type SortOrder = 'newest' | 'oldest' | 'clarity' | 'lucidity';

interface ArtworkColors {
  primary: string;
  secondary: string;
  accent: string;
  mood: string;
}

// ============ HELPER FUNCTIONS ============
const getArtworkColors = (dream: DreamEntry): ArtworkColors => {
  const moodInfo = dreamMoods.find(m => m.id === dream.mood);
  const moodColor = moodInfo?.color || '#8b5cf6';

  // Get colors from symbols
  const symbolColors = dream.symbols
    .map(id => getSymbolById(id))
    .filter(s => s)
    .map(s => {
      const cat = dreamSymbolCategories.find(c => c.id === s!.category);
      return cat?.color || '#8b5cf6';
    });

  return {
    primary: symbolColors[0] || '#8b5cf6',
    secondary: symbolColors[1] || '#c0c0c0',
    accent: symbolColors[2] || moodColor,
    mood: moodColor,
  };
};

const generateArtworkShapes = (dream: DreamEntry): React.ReactNode[] => {
  const colors = getArtworkColors(dream);
  const shapes: React.ReactNode[] = [];
  const symbolCount = dream.symbols.length;

  // Add floating shapes based on symbols
  for (let i = 0; i < Math.min(symbolCount, 5); i++) {
    const symbolColor = i === 0 ? colors.primary : i === 1 ? colors.secondary : colors.accent;
    shapes.push(
      <FloatingShape
        key={`float-${i}`}
        color={symbolColor}
        delay={i * 0.5}
        size={40 + i * 15}
        sx={{
          left: `${15 + i * 18}%`,
          top: `${20 + (i % 3) * 25}%`,
        }}
      />
    );
  }

  // Add morphing shapes based on mood
  shapes.push(
    <MorphingShape
      key="morph-1"
      color={colors.mood}
      delay={0}
      sx={{ left: '10%', top: '10%' }}
    />
  );
  shapes.push(
    <MorphingShape
      key="morph-2"
      color={colors.primary}
      delay={2}
      sx={{ right: '10%', bottom: '10%' }}
    />
  );

  // Add center circle based on lucidity
  const luciditySize = 30 + dream.lucidity * 10;
  shapes.push(
    <Box
      key="center"
      sx={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: luciditySize,
        height: luciditySize,
        borderRadius: '50%',
        background: `radial-gradient(ellipse at center, ${colors.mood}60 0%, transparent 70%)`,
        animation: `${pulse} 3s ease-in-out infinite`,
      }}
    />
  );

  // Add lines/connections based on clarity
  if (dream.clarity >= 3) {
    for (let i = 0; i < dream.clarity; i++) {
      shapes.push(
        <Box
          key={`line-${i}`}
          sx={{
            position: 'absolute',
            left: `${50 + Math.cos(i * (Math.PI * 2 / dream.clarity)) * 35}%`,
            top: `${50 + Math.sin(i * (Math.PI * 2 / dream.clarity)) * 35}%`,
            width: 2,
            height: 40,
            background: `linear-gradient(180deg, ${colors.secondary}40, transparent)`,
            transform: `rotate(${i * (360 / dream.clarity)}deg)`,
            transformOrigin: '0 0',
          }}
        />
      );
    }
  }

  return shapes;
};

const getCategoryColor = (category: string): string => {
  const cat = dreamSymbolCategories.find(c => c.id === category);
  return cat?.color || '#8b5cf6';
};

// ============ MAIN COMPONENT ============
export const DreamGallery: React.FC = () => {
  const [dreams, setDreams] = useState<DreamEntry[]>([]);
  const [selectedDream, setSelectedDream] = useState<DreamEntry | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [filterMood, setFilterMood] = useState<string>('all');
  const [filterSymbol, setFilterSymbol] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Load dreams
  useEffect(() => {
    const stored = localStorage.getItem(DREAM_STORAGE_KEY);
    if (stored) {
      try {
        setDreams(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load dreams:', e);
      }
    }
  }, []);

  // Get all unique symbols
  const allSymbols = useMemo(() => {
    const symbolSet = new Set<string>();
    dreams.forEach(dream => {
      dream.symbols.forEach(s => symbolSet.add(s));
    });
    return Array.from(symbolSet)
      .map(id => ({ id, symbol: getSymbolById(id) }))
      .filter(s => s.symbol);
  }, [dreams]);

  // Filter and sort dreams
  const filteredDreams = useMemo(() => {
    let result = dreams.filter(dream => {
      const matchesMood = filterMood === 'all' || dream.mood === filterMood;
      const matchesSymbol = filterSymbol === 'all' || dream.symbols.includes(filterSymbol);
      const matchesSearch = searchQuery === '' ||
        dream.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dream.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesMood && matchesSymbol && matchesSearch;
    });

    // Sort
    switch (sortOrder) {
      case 'oldest':
        result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case 'clarity':
        result.sort((a, b) => b.clarity - a.clarity);
        break;
      case 'lucidity':
        result.sort((a, b) => b.lucidity - a.lucidity);
        break;
      default:
        result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    return result;
  }, [dreams, filterMood, filterSymbol, searchQuery, sortOrder]);

  // Export dream as JSON
  const exportDream = (dream: DreamEntry) => {
    const data = JSON.stringify(dream, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dream-${dream.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Share dream (copy to clipboard)
  const shareDream = async (dream: DreamEntry) => {
    const text = `Dream: ${dream.title}\n\n${dream.description}\n\nDate: ${dream.date}\nMood: ${dreamMoods.find(m => m.id === dream.mood)?.name}`;
    try {
      await navigator.clipboard.writeText(text);
      alert('Dream copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getMoodColor = (moodId: string) => {
    return dreamMoods.find(m => m.id === moodId)?.color || '#8b5cf6';
  };

  const clearFilters = () => {
    setFilterMood('all');
    setFilterSymbol('all');
    setSearchQuery('');
  };

  return (
    <GalleryContainer>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <GothicTitle variant="h3">Dream Gallery</GothicTitle>
        <Typography sx={{ color: '#a78bfa', fontSize: '1.1rem', mt: 1 }}>
          A visual journey through your dreamscape
        </Typography>
      </Box>

      {/* Controls */}
      <Box sx={{
        maxWidth: 1200,
        mx: 'auto',
        mb: 4,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* View Mode Toggle */}
        <Box sx={{
          display: 'flex',
          background: 'rgba(139, 92, 246, 0.1)',
          borderRadius: '12px',
          p: 0.5,
        }}>
          <IconButton
            onClick={() => setViewMode('grid')}
            sx={{
              color: viewMode === 'grid' ? '#c0c0c0' : '#6366f1',
              background: viewMode === 'grid' ? 'rgba(139, 92, 246, 0.3)' : 'transparent',
              borderRadius: '8px',
            }}
          >
            <Grid size={20} />
          </IconButton>
          <IconButton
            onClick={() => setViewMode('timeline')}
            sx={{
              color: viewMode === 'timeline' ? '#c0c0c0' : '#6366f1',
              background: viewMode === 'timeline' ? 'rgba(139, 92, 246, 0.3)' : 'transparent',
              borderRadius: '8px',
            }}
          >
            <LayoutList size={20} />
          </IconButton>
          <IconButton
            onClick={() => setViewMode('gallery')}
            sx={{
              color: viewMode === 'gallery' ? '#c0c0c0' : '#6366f1',
              background: viewMode === 'gallery' ? 'rgba(139, 92, 246, 0.3)' : 'transparent',
              borderRadius: '8px',
            }}
          >
            <Image size={20} />
          </IconButton>
        </Box>

        {/* Sort Order */}
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel sx={{ color: '#a78bfa' }}>Sort By</InputLabel>
          <Select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as SortOrder)}
            label="Sort By"
            sx={{
              color: '#e9d5ff',
              background: 'rgba(139, 92, 246, 0.1)',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(139, 92, 246, 0.3)' },
            }}
          >
            <MenuItem value="newest">Newest First</MenuItem>
            <MenuItem value="oldest">Oldest First</MenuItem>
            <MenuItem value="clarity">Highest Clarity</MenuItem>
            <MenuItem value="lucidity">Highest Lucidity</MenuItem>
          </Select>
        </FormControl>

        {/* Filter Toggle */}
        <IconButton
          onClick={() => setShowFilters(!showFilters)}
          sx={{
            color: showFilters ? '#c0c0c0' : '#8b5cf6',
            background: showFilters ? 'rgba(192, 192, 192, 0.2)' : 'rgba(139, 92, 246, 0.1)',
            borderRadius: '12px',
          }}
        >
          <Filter size={20} />
        </IconButton>

        {(filterMood !== 'all' || filterSymbol !== 'all' || searchQuery !== '') && (
          <IconButton onClick={clearFilters} sx={{ color: '#ef4444' }}>
            <RefreshCw size={18} />
          </IconButton>
        )}
      </Box>

      {/* Filters */}
      {showFilters && (
        <Box sx={{
          maxWidth: 800,
          mx: 'auto',
          mb: 4,
          p: 3,
          background: 'rgba(139, 92, 246, 0.1)',
          borderRadius: '16px',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          justifyContent: 'center',
        }}>
          <TextField
            size="small"
            placeholder="Search dreams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              minWidth: 200,
              '& .MuiOutlinedInput-root': {
                color: '#e9d5ff',
                background: 'rgba(139, 92, 246, 0.1)',
                '& fieldset': { borderColor: 'rgba(139, 92, 246, 0.3)' },
              },
            }}
          />

          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel sx={{ color: '#a78bfa' }}>Mood</InputLabel>
            <Select
              value={filterMood}
              onChange={(e) => setFilterMood(e.target.value)}
              label="Mood"
              sx={{
                color: '#e9d5ff',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(139, 92, 246, 0.3)' },
              }}
            >
              <MenuItem value="all">All Moods</MenuItem>
              {dreamMoods.map(mood => (
                <MenuItem key={mood.id} value={mood.id}>{mood.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel sx={{ color: '#a78bfa' }}>Symbol</InputLabel>
            <Select
              value={filterSymbol}
              onChange={(e) => setFilterSymbol(e.target.value)}
              label="Symbol"
              sx={{
                color: '#e9d5ff',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(139, 92, 246, 0.3)' },
              }}
            >
              <MenuItem value="all">All Symbols</MenuItem>
              {allSymbols.map(({ id, symbol }) => symbol && (
                <MenuItem key={id} value={id}>{symbol.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}

      {/* Gallery Views */}
      <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
        {/* Grid View */}
        {viewMode === 'grid' && (
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 3,
          }}>
            {filteredDreams.map((dream) => (
              <Fade in key={dream.id}>
                <DreamCard
                  mood={dream.mood}
                  onClick={() => { setSelectedDream(dream); setDetailOpen(true); }}
                >
                  <CardContent>
                    {/* Mini Artwork */}
                    <ArtworkCanvas colors={[getArtworkColors(dream).primary, getArtworkColors(dream).secondary]}>
                      {generateArtworkShapes(dream)}
                    </ArtworkCanvas>

                    <Box sx={{ mt: 2 }}>
                      <Typography sx={{
                        color: '#e9d5ff',
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        fontFamily: '"Cinzel", serif',
                        mb: 1,
                      }}>
                        {dream.title}
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Calendar size={12} color="#a78bfa" />
                        <Typography sx={{ color: '#a78bfa', fontSize: '0.8rem' }}>
                          {new Date(dream.date).toLocaleDateString()}
                        </Typography>
                        <Chip
                          label={dreamMoods.find(m => m.id === dream.mood)?.name}
                          size="small"
                          sx={{
                            background: `${getMoodColor(dream.mood)}20`,
                            color: getMoodColor(dream.mood),
                            height: 20,
                            fontSize: '0.7rem',
                          }}
                        />
                      </Box>

                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {dream.symbols.slice(0, 3).map(symbolId => {
                          const symbol = getSymbolById(symbolId);
                          if (!symbol) return null;
                          return (
                            <Chip
                              key={symbolId}
                              label={symbol.name}
                              size="small"
                              sx={{
                                background: `${getCategoryColor(symbol.category)}15`,
                                color: getCategoryColor(symbol.category),
                                fontSize: '0.7rem',
                                height: 20,
                              }}
                            />
                          );
                        })}
                        {dream.symbols.length > 3 && (
                          <Chip
                            label={`+${dream.symbols.length - 3}`}
                            size="small"
                            sx={{
                              background: 'rgba(139, 92, 246, 0.2)',
                              color: '#a78bfa',
                              height: 20,
                            }}
                          />
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                </DreamCard>
              </Fade>
            ))}
          </Box>
        )}

        {/* Timeline View */}
        {viewMode === 'timeline' && (
          <TimelineContainer>
            {filteredDreams.map((dream, index) => (
              <TimelineItem key={dream.id} side={index % 2 === 0 ? 'left' : 'right'}>
                <DreamCard
                  mood={dream.mood}
                  onClick={() => { setSelectedDream(dream); setDetailOpen(true); }}
                  sx={{ width: '100%', maxWidth: 400 }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Box sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '12px',
                        background: `${getMoodColor(dream.mood)}30`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Moon size={24} color={getMoodColor(dream.mood)} />
                      </Box>
                      <Box>
                        <Typography sx={{ color: '#e9d5ff', fontWeight: 600, fontFamily: '"Cinzel", serif' }}>
                          {dream.title}
                        </Typography>
                        <Typography sx={{ color: '#a78bfa', fontSize: '0.8rem' }}>
                          {new Date(dream.date).toLocaleDateString()} at {dream.time}
                        </Typography>
                      </Box>
                    </Box>

                    <Typography sx={{
                      color: '#c4b5fd',
                      fontSize: '0.9rem',
                      fontStyle: 'italic',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      "{dream.description}"
                    </Typography>
                  </CardContent>
                </DreamCard>
              </TimelineItem>
            ))}
          </TimelineContainer>
        )}

        {/* Gallery (Artwork) View */}
        {viewMode === 'gallery' && (
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: 3,
          }}>
            {filteredDreams.map((dream) => (
              <Box
                key={dream.id}
                onClick={() => { setSelectedDream(dream); setDetailOpen(true); }}
                sx={{ cursor: 'pointer' }}
              >
                <ArtworkCanvas
                  colors={[getArtworkColors(dream).primary, getArtworkColors(dream).secondary]}
                  sx={{
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: `0 8px 32px ${getArtworkColors(dream).primary}40`,
                    },
                  }}
                >
                  {generateArtworkShapes(dream)}
                </ArtworkCanvas>
                <Typography sx={{
                  color: '#e9d5ff',
                  fontSize: '0.9rem',
                  fontFamily: '"Cinzel", serif',
                  textAlign: 'center',
                  mt: 1,
                }}>
                  {dream.title}
                </Typography>
                <Typography sx={{ color: '#6366f1', fontSize: '0.75rem', textAlign: 'center' }}>
                  {new Date(dream.date).toLocaleDateString()}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Empty State */}
      {filteredDreams.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Image size={64} color="#8b5cf6" style={{ marginBottom: 16, opacity: 0.5 }} />
          <Typography sx={{ color: '#a78bfa', fontSize: '1.2rem', mb: 2 }}>
            No dreams to display
          </Typography>
          <Typography sx={{ color: '#6366f1', fontSize: '0.9rem' }}>
            {searchQuery || filterMood !== 'all' || filterSymbol !== 'all'
              ? 'Try adjusting your filters'
              : 'Start recording dreams to see them here'}
          </Typography>
        </Box>
      )}

      {/* Dream Detail Dialog */}
      <Dialog
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, #0a0812 0%, #0d0a1a 100%)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '20px',
          },
        }}
      >
        {selectedDream && (
          <>
            <DialogTitle sx={{
              borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <Box>
                <Typography sx={{
                  color: '#e9d5ff',
                  fontWeight: 700,
                  fontSize: '1.4rem',
                  fontFamily: '"Cinzel", serif',
                }}>
                  {selectedDream.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                  <Chip
                    icon={<Calendar size={14} />}
                    label={new Date(selectedDream.date).toLocaleDateString()}
                    size="small"
                    sx={{ background: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa' }}
                  />
                  <Chip
                    icon={<Clock size={14} />}
                    label={selectedDream.time}
                    size="small"
                    sx={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8' }}
                  />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Export">
                  <IconButton onClick={() => exportDream(selectedDream)} sx={{ color: '#8b5cf6' }}>
                    <Download size={18} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Share">
                  <IconButton onClick={() => shareDream(selectedDream)} sx={{ color: '#8b5cf6' }}>
                    <Share2 size={18} />
                  </IconButton>
                </Tooltip>
                <IconButton onClick={() => setDetailOpen(false)} sx={{ color: '#8b5cf6' }}>
                  <X size={20} />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
                {/* Artwork */}
                <Box>
                  <Typography sx={{
                    color: '#a78bfa',
                    fontSize: '0.9rem',
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}>
                    <Palette size={16} /> Dream Artwork
                  </Typography>
                  <ArtworkCanvas
                    colors={[getArtworkColors(selectedDream).primary, getArtworkColors(selectedDream).secondary]}
                    sx={{ height: 300 }}
                  >
                    {generateArtworkShapes(selectedDream)}
                  </ArtworkCanvas>
                  <Typography sx={{
                    color: '#6366f1',
                    fontSize: '0.75rem',
                    textAlign: 'center',
                    mt: 1,
                    fontStyle: 'italic',
                  }}>
                    Abstract visualization based on dream symbols and emotions
                  </Typography>
                </Box>

                {/* Details */}
                <Box>
                  {/* Mood */}
                  <Box sx={{ mb: 3 }}>
                    <Chip
                      label={dreamMoods.find(m => m.id === selectedDream.mood)?.name}
                      sx={{
                        background: `${getMoodColor(selectedDream.mood)}30`,
                        color: getMoodColor(selectedDream.mood),
                        border: `1px solid ${getMoodColor(selectedDream.mood)}`,
                        fontWeight: 600,
                      }}
                    />
                  </Box>

                  {/* Description */}
                  <Typography sx={{
                    color: '#c4b5fd',
                    lineHeight: 1.8,
                    mb: 3,
                    fontStyle: 'italic',
                    borderLeft: '3px solid #8b5cf6',
                    pl: 2,
                  }}>
                    "{selectedDream.description}"
                  </Typography>

                  {/* Metrics */}
                  <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Eye size={20} color="#c0c0c0" />
                      <Typography sx={{ color: '#c0c0c0', fontWeight: 700 }}>
                        {selectedDream.clarity}/5
                      </Typography>
                      <Typography sx={{ color: '#6366f1', fontSize: '0.75rem' }}>Clarity</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Zap size={20} color="#3b82f6" />
                      <Typography sx={{ color: '#3b82f6', fontWeight: 700 }}>
                        {selectedDream.lucidity}/5
                      </Typography>
                      <Typography sx={{ color: '#6366f1', fontSize: '0.75rem' }}>Lucidity</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Moon size={20} color="#a78bfa" />
                      <Typography sx={{ color: '#a78bfa', fontWeight: 700, fontSize: '0.85rem' }}>
                        {moonPhases.find(p => p.id === selectedDream.moonPhase)?.name}
                      </Typography>
                      <Typography sx={{ color: '#6366f1', fontSize: '0.75rem' }}>Moon Phase</Typography>
                    </Box>
                  </Box>

                  {/* Symbols */}
                  {selectedDream.symbols.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                      <Typography sx={{ color: '#a78bfa', fontSize: '0.9rem', mb: 1 }}>
                        <Sparkles size={14} style={{ marginRight: 4 }} />
                        Symbols Present
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selectedDream.symbols.map(symbolId => {
                          const symbol = getSymbolById(symbolId);
                          if (!symbol) return null;
                          return (
                            <Chip
                              key={symbolId}
                              label={symbol.name}
                              size="small"
                              sx={{
                                background: `${getCategoryColor(symbol.category)}20`,
                                color: getCategoryColor(symbol.category),
                              }}
                            />
                          );
                        })}
                      </Box>
                    </Box>
                  )}

                  {/* Tags */}
                  {selectedDream.tags.length > 0 && (
                    <Box>
                      <Typography sx={{ color: '#a78bfa', fontSize: '0.9rem', mb: 1 }}>
                        <Tag size={14} style={{ marginRight: 4 }} />
                        Tags
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selectedDream.tags.map(tag => (
                          <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            sx={{
                              background: 'rgba(192, 192, 192, 0.2)',
                              color: '#c0c0c0',
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                </Box>
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>
    </GalleryContainer>
  );
};

export default DreamGallery;
