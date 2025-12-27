import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  TextField,
  InputAdornment,
  Avatar,
  IconButton,
  Tooltip,
  Fade,
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Divider,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Search,
  Heart,
  MessageCircle,
  Sparkles,
  BookOpen,
  Crown,
  Star,
  X,
  Quote,
  Users,
  Feather,
  Shield,
  Flame,
  Music,
  Palette,
  Scale,
  Eye,
  Globe,
  Mic,
  Volume2,
} from 'lucide-react';
import { HistoricalFigureChat } from './HistoricalFigureChat';
import { FigureGroupDiscussion } from './FigureGroupDiscussion';
import historicalFiguresData from '../../data/historical_figures.json';

// Type definitions for figures loaded from JSON
interface VoiceSettings {
  pitch: string;
  pace: string;
  accent: string;
}

interface HistoricalFigureData {
  id: string;
  name: string;
  gothicTitle: string;
  category: string;
  years: string;
  traits: string[];
  speakingStyle: string;
  interests: string[];
  backstory: string;
  appearanceStyle?: string;
  avatarDescription?: string;
  conversationTopics: string[];
  quotes: string[];
  voiceSettings?: VoiceSettings;
}

// Load figures from JSON data
const figures: HistoricalFigureData[] = historicalFiguresData.figures as HistoricalFigureData[];

// Animations
const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
`;

const glowPulse = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(212, 175, 55, 0.3); }
  50% { box-shadow: 0 0 40px rgba(212, 175, 55, 0.6); }
`;

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

// Styled Components
const GalleryContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #0a0812 0%, #1a1018 50%, #0d0d1a 100%)',
  padding: '24px',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 5L35 25L55 30L35 35L30 55L25 35L5 30L25 25Z\' fill=\'%23d4af3708\' /%3E%3C/svg%3E")',
    opacity: 0.4,
    pointerEvents: 'none',
  },
});

const GothicTitle = styled(Typography)({
  fontFamily: '"Cinzel Decorative", "Times New Roman", serif',
  background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 50%, #c9a227 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
  textShadow: '0 0 40px rgba(212, 175, 55, 0.5)',
  marginBottom: '8px',
});

const FigureCard = styled(Card)<{ category?: string }>(({ category }) => ({
  background: category === 'Black Liberation'
    ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(124, 58, 237, 0.1) 100%)'
    : category === 'LGBTQ+ Pioneers'
    ? 'linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(219, 39, 119, 0.1) 100%)'
    : category === 'Latinx Legends'
    ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.1) 100%)'
    : category === 'Indigenous Ancestors'
    ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.1) 100%)'
    : category === 'Disability Rights'
    ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.1) 100%)'
    : category === 'Feminist Icons'
    ? 'linear-gradient(135deg, rgba(244, 63, 94, 0.15) 0%, rgba(225, 29, 72, 0.1) 100%)'
    : category === 'Artists & Writers'
    ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(147, 51, 234, 0.1) 100%)'
    : 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(180, 140, 40, 0.1) 100%)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(212, 175, 55, 0.3)',
  borderRadius: '16px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 32px rgba(212, 175, 55, 0.3)',
    borderColor: '#d4af37',
  },
}));

const CategoryChip = styled(Chip)<{ catcolor?: string }>(({ catcolor }) => ({
  background: `${catcolor}30`,
  color: catcolor,
  border: `1px solid ${catcolor}50`,
  fontWeight: 600,
}));

const FilterChip = styled(Chip)<{ selected?: boolean }>(({ selected }) => ({
  background: selected
    ? 'linear-gradient(135deg, #d4af37 0%, #f59e0b 100%)'
    : 'rgba(212, 175, 55, 0.15)',
  color: selected ? '#000' : '#d4af37',
  border: '1px solid rgba(212, 175, 55, 0.3)',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: selected
      ? 'linear-gradient(135deg, #d4af37 0%, #f59e0b 100%)'
      : 'rgba(212, 175, 55, 0.3)',
  },
}));

const FigureAvatar = styled(Avatar)<{ catcolor?: string }>(({ catcolor }) => ({
  width: 80,
  height: 80,
  border: `3px solid ${catcolor || '#d4af37'}`,
  boxShadow: `0 0 20px ${catcolor || '#d4af37'}40`,
  animation: `${floatAnimation} 4s ease-in-out infinite`,
  background: `linear-gradient(135deg, ${catcolor || '#d4af37'}30 0%, ${catcolor || '#d4af37'}10 100%)`,
}));

const QuoteBox = styled(Box)({
  background: 'rgba(212, 175, 55, 0.1)',
  border: '1px solid rgba(212, 175, 55, 0.3)',
  borderRadius: '12px',
  padding: '16px',
  position: 'relative',
  '&::before': {
    content: '"""',
    position: 'absolute',
    top: '-10px',
    left: '16px',
    fontSize: '3rem',
    color: '#d4af37',
    fontFamily: 'serif',
    lineHeight: 1,
  },
});

const TraitBadge = styled(Box)<{ color?: string }>(({ color }) => ({
  background: `${color || '#d4af37'}20`,
  border: `1px solid ${color || '#d4af37'}40`,
  borderRadius: '20px',
  padding: '4px 12px',
  fontSize: '0.75rem',
  color: color || '#d4af37',
}));


const categories = [
  { id: 'all', name: 'All Figures', icon: Sparkles, color: '#d4af37' },
  { id: 'Black Liberation', name: 'Black Liberation', icon: Crown, color: '#8b5cf6' },
  { id: 'LGBTQ+ Pioneers', name: 'LGBTQ+ Pioneers', icon: Heart, color: '#ec4899' },
  { id: 'Latinx Legends', name: 'Latinx Legends', icon: Flame, color: '#f59e0b' },
  { id: 'Indigenous Ancestors', name: 'Indigenous Ancestors', icon: Globe, color: '#10b981' },
  { id: 'Disability Rights', name: 'Disability Rights', icon: Shield, color: '#3b82f6' },
  { id: 'Feminist Icons', name: 'Feminist Icons', icon: Scale, color: '#f43f5e' },
  { id: 'Artists & Writers', name: 'Artists & Writers', icon: Palette, color: '#a855f7' },
  { id: 'Asian Trailblazers', name: 'Asian Trailblazers', icon: Star, color: '#ef4444' },
];

const getCategoryColor = (category: string) => {
  return categories.find(c => c.id === category)?.color || '#d4af37';
};

export const HistoricalFiguresGallery: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFigure, setSelectedFigure] = useState<HistoricalFigureData | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [groupDiscussionOpen, setGroupDiscussionOpen] = useState(false);

  const filteredFigures = useMemo(() => {
    return figures.filter(fig => {
      const matchesSearch = fig.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fig.gothicTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fig.traits.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || fig.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const openDetail = (figure: HistoricalFigureData) => {
    setSelectedFigure(figure);
    setDetailOpen(true);
  };

  const handleOpenChat = () => {
    setChatOpen(true);
    setDetailOpen(false);
  };

  const handleCloseChat = () => {
    setChatOpen(false);
  };

  const handleOpenGroupDiscussion = () => {
    setGroupDiscussionOpen(true);
  };

  const handleCloseGroupDiscussion = () => {
    setGroupDiscussionOpen(false);
  };

  const getCategoryCount = (categoryId: string) => {
    if (categoryId === 'all') return figures.length;
    return figures.filter(f => f.category === categoryId).length;
  };

  return (
    <GalleryContainer>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4, position: 'relative', zIndex: 1 }}>
        <GothicTitle variant="h3">Ancestors & Icons</GothicTitle>
        <Typography sx={{ color: '#d4af37', fontSize: '1.1rem', mb: 2 }}>
          {figures.length} Historical Figures Who Changed the World
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Users size={18} />}
          onClick={handleOpenGroupDiscussion}
          sx={{
            borderColor: '#d4af37',
            color: '#d4af37',
            fontFamily: '"Cinzel", serif',
            '&:hover': {
              borderColor: '#f59e0b',
              background: 'rgba(212, 175, 55, 0.1)',
            },
          }}
        >
          Group Discussion
        </Button>
      </Box>

      {/* Search */}
      <Box sx={{ maxWidth: 600, mx: 'auto', mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search by name, title, or trait..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} color="#d4af37" />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              background: 'rgba(212, 175, 55, 0.1)',
              borderRadius: '12px',
              color: '#f4d03f',
              '& fieldset': { borderColor: 'rgba(212, 175, 55, 0.3)' },
              '&:hover fieldset': { borderColor: '#d4af37' },
              '&.Mui-focused fieldset': { borderColor: '#f59e0b' },
            },
          }}
        />
      </Box>

      {/* Categories */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', mb: 4 }}>
        {categories.map((cat) => {
          const CatIcon = cat.icon;
          return (
            <FilterChip
              key={cat.id}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CatIcon size={14} />
                  {cat.name} ({getCategoryCount(cat.id)})
                </Box>
              }
              selected={selectedCategory === cat.id}
              onClick={() => setSelectedCategory(cat.id)}
            />
          );
        })}
      </Box>

      {/* Figures Grid */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: 3,
        position: 'relative',
        zIndex: 1,
      }}>
        {filteredFigures.map((figure) => {
          const catColor = getCategoryColor(figure.category);
          const isFavorite = favorites.includes(figure.id);

          return (
            <Fade in key={figure.id}>
              <FigureCard category={figure.category} onClick={() => openDetail(figure)}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <FigureAvatar catcolor={catColor}>
                      <Crown size={36} color={catColor} />
                    </FigureAvatar>

                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography
                          sx={{
                            color: '#f4d03f',
                            fontWeight: 700,
                            fontSize: '1.1rem',
                            fontFamily: '"Cinzel", serif',
                          }}
                        >
                          {figure.name}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={(e) => { e.stopPropagation(); toggleFavorite(figure.id); }}
                        >
                          <Star
                            size={18}
                            fill={isFavorite ? '#d4af37' : 'none'}
                            color={isFavorite ? '#d4af37' : '#8b5cf6'}
                          />
                        </IconButton>
                      </Box>

                      <Typography
                        sx={{
                          color: catColor,
                          fontStyle: 'italic',
                          fontSize: '0.9rem',
                          mb: 0.5,
                        }}
                      >
                        "{figure.gothicTitle}"
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <CategoryChip
                          catcolor={catColor}
                          label={figure.category}
                          size="small"
                        />
                        <Typography sx={{ color: '#9ca3af', fontSize: '0.8rem' }}>
                          {figure.years}
                        </Typography>
                      </Box>

                      <Typography
                        sx={{
                          color: '#d1d5db',
                          fontSize: '0.85rem',
                          lineHeight: 1.5,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          mb: 1.5,
                        }}
                      >
                        {figure.backstory}
                      </Typography>

                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {figure.traits.map((trait) => (
                          <TraitBadge key={trait} color={catColor}>{trait}</TraitBadge>
                        ))}
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </FigureCard>
            </Fade>
          );
        })}
      </Box>

      {/* Stats */}
      <Box sx={{
        mt: 4,
        p: 3,
        background: 'rgba(212, 175, 55, 0.1)',
        borderRadius: '16px',
        border: '1px solid rgba(212, 175, 55, 0.2)',
        textAlign: 'center',
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 6, flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="h4" sx={{ color: '#d4af37', fontWeight: 700 }}>
              {figures.length}
            </Typography>
            <Typography sx={{ color: '#f4d03f', fontSize: '0.9rem' }}>
              Historical Figures
            </Typography>
          </Box>
          <Box>
            <Typography variant="h4" sx={{ color: '#ec4899', fontWeight: 700 }}>
              {categories.length - 1}
            </Typography>
            <Typography sx={{ color: '#f4d03f', fontSize: '0.9rem' }}>
              Categories
            </Typography>
          </Box>
          <Box>
            <Typography variant="h4" sx={{ color: '#8b5cf6', fontWeight: 700 }}>
              {favorites.length}
            </Typography>
            <Typography sx={{ color: '#f4d03f', fontSize: '0.9rem' }}>
              Favorites
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Detail Dialog */}
      <Dialog
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, #0a0812 0%, #1a1018 100%)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            borderRadius: '20px',
          },
        }}
      >
        {selectedFigure && (() => {
          const catColor = getCategoryColor(selectedFigure.category);
          return (
            <>
              <DialogTitle sx={{
                background: `linear-gradient(135deg, ${catColor}20 0%, ${catColor}10 100%)`,
                borderBottom: `1px solid ${catColor}40`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <FigureAvatar catcolor={catColor}>
                    <Crown size={32} color={catColor} />
                  </FigureAvatar>
                  <Box>
                    <Typography sx={{
                      color: '#f4d03f',
                      fontWeight: 700,
                      fontSize: '1.4rem',
                      fontFamily: '"Cinzel", serif',
                    }}>
                      {selectedFigure.name}
                    </Typography>
                    <Typography sx={{ color: catColor, fontStyle: 'italic' }}>
                      "{selectedFigure.gothicTitle}"
                    </Typography>
                    <Typography sx={{ color: '#9ca3af', fontSize: '0.9rem' }}>
                      {selectedFigure.years}
                    </Typography>
                  </Box>
                </Box>
                <IconButton onClick={() => setDetailOpen(false)}>
                  <X size={20} color="#d4af37" />
                </IconButton>
              </DialogTitle>

              <DialogContent sx={{ p: 3 }}>
                <CategoryChip catcolor={catColor} label={selectedFigure.category} sx={{ mb: 2 }} />

                <Typography sx={{ color: '#d1d5db', lineHeight: 1.7, mb: 3 }}>
                  {selectedFigure.backstory}
                </Typography>

                <Divider sx={{ borderColor: 'rgba(212, 175, 55, 0.2)', my: 2 }} />

                {/* Traits */}
                <Box sx={{ mb: 3 }}>
                  <Typography sx={{ color: '#d4af37', fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Sparkles size={16} />
                    Character Traits
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedFigure.traits.map((trait) => (
                      <TraitBadge key={trait} color={catColor}>{trait}</TraitBadge>
                    ))}
                  </Box>
                </Box>

                {/* Interests */}
                <Box sx={{ mb: 3 }}>
                  <Typography sx={{ color: '#d4af37', fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Heart size={16} />
                    Interests & Passions
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedFigure.interests.map((interest) => (
                      <Chip
                        key={interest}
                        label={interest}
                        size="small"
                        sx={{
                          background: 'rgba(212, 175, 55, 0.1)',
                          color: '#f4d03f',
                          border: '1px solid rgba(212, 175, 55, 0.3)',
                        }}
                      />
                    ))}
                  </Box>
                </Box>

                {/* Speaking Style */}
                <Box sx={{ mb: 3 }}>
                  <Typography sx={{ color: '#d4af37', fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Mic size={16} />
                    Speaking Style
                  </Typography>
                  <Typography sx={{ color: '#d1d5db', fontStyle: 'italic' }}>
                    {selectedFigure.speakingStyle}
                  </Typography>
                </Box>

                {/* Quotes */}
                <Box>
                  <Typography sx={{ color: '#d4af37', fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Quote size={16} />
                    Famous Quotes
                  </Typography>
                  {selectedFigure.quotes.map((quote, idx) => (
                    <QuoteBox key={idx} sx={{ mb: 2 }}>
                      <Typography sx={{ color: '#f4d03f', fontStyle: 'italic', pl: 3, pt: 1 }}>
                        {quote}
                      </Typography>
                    </QuoteBox>
                  ))}
                </Box>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                  <Button
                    variant="contained"
                    startIcon={<MessageCircle size={18} />}
                    onClick={handleOpenChat}
                    sx={{
                      background: `linear-gradient(135deg, ${catColor} 0%, ${catColor}cc 100%)`,
                      color: '#000',
                      fontWeight: 600,
                      '&:hover': { background: catColor },
                    }}
                  >
                    Chat with {selectedFigure.name.split(' ')[0]}
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<BookOpen size={18} />}
                    sx={{
                      borderColor: catColor,
                      color: catColor,
                      '&:hover': { borderColor: catColor, background: `${catColor}20` },
                    }}
                  >
                    Learn More
                  </Button>
                </Box>
              </DialogContent>
            </>
          );
        })()}
      </Dialog>

      {/* Historical Figure Chat Dialog */}
      <Dialog
        open={chatOpen}
        onClose={handleCloseChat}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: 'transparent',
            boxShadow: 'none',
            overflow: 'visible',
          },
        }}
      >
        {selectedFigure && (
          <HistoricalFigureChat
            figureId={selectedFigure.id}
            figureName={selectedFigure.name}
            category={selectedFigure.category}
            speakingStyle={selectedFigure.speakingStyle}
            conversationTopics={selectedFigure.conversationTopics}
            quotes={selectedFigure.quotes}
            backstory={selectedFigure.backstory}
            traits={selectedFigure.traits}
            interests={selectedFigure.interests}
            gothicTitle={selectedFigure.gothicTitle}
            onClose={handleCloseChat}
          />
        )}
      </Dialog>

      {/* Group Discussion Dialog */}
      <Dialog
        open={groupDiscussionOpen}
        onClose={handleCloseGroupDiscussion}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            background: 'transparent',
            boxShadow: 'none',
            overflow: 'visible',
          },
        }}
      >
        <FigureGroupDiscussion
          figures={figures}
          onClose={handleCloseGroupDiscussion}
        />
      </Dialog>
    </GalleryContainer>
  );
};

export default HistoricalFiguresGallery;
