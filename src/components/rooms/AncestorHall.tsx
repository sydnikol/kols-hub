// Ancestor Hall Room Component
// Sacred space for connecting with historical figures and ancestral wisdom

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Chip, TextField, InputAdornment } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { Ghost, Search, Sparkles, MessageCircle, Star, Filter, Clock, TreeDeciduous } from 'lucide-react';
import { GothicCard } from '../gothic/GothicCard';
import { GothicButton } from '../gothic/GothicButton';
import { GothicModal } from '../gothic/GothicModal';
import historicalFigures from '../../data/historical_figures.json';

interface RoomProps {
  onRoomChange?: (roomId: string) => void;
}

const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const glowPulse = keyframes`
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
`;

const spiritAppear = keyframes`
  0% { opacity: 0; transform: scale(0.8); }
  100% { opacity: 1; transform: scale(1); }
`;

interface HistoricalFigure {
  id: string;
  name: string;
  gothicTitle: string;
  category: string;
  years: string;
  traits: string[];
  speakingStyle: string;
  interests: string[];
  backstory: string;
  appearanceStyle: string;
  avatarDescription: string;
  conversationTopics: string[];
  quotes: string[];
}

type AppearanceStyle = 'spirit' | 'hologram' | 'avatar';

const getAppearanceStyle = (style: string): AppearanceStyle => {
  if (style === 'spirit' || style === 'hologram' || style === 'avatar') {
    return style;
  }
  return 'spirit';
};

const RoomContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #0a0608 0%, #150a10 50%, #0a0608 100%)',
  padding: '32px',
  position: 'relative',
  overflow: 'hidden',

  // Floating spirit particles
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(circle at 20% 30%, rgba(124, 45, 18, 0.15) 0%, transparent 40%)',
    pointerEvents: 'none',
  },
});

const HeaderSection = styled(Box)({
  textAlign: 'center',
  marginBottom: '48px',
});

const RoomTitle = styled(Typography)({
  fontFamily: '"Cinzel", serif',
  fontSize: '3rem',
  fontWeight: 700,
  color: '#d4af37',
  letterSpacing: '0.15em',
  textShadow: '0 0 40px rgba(212, 175, 55, 0.4)',
  marginBottom: '8px',
});

const RoomSubtitle = styled(Typography)({
  fontSize: '1.1rem',
  color: '#a08060',
  fontStyle: 'italic',
  marginBottom: '24px',
});

const SearchBar = styled(TextField)({
  maxWidth: '500px',
  width: '100%',
  '& .MuiOutlinedInput-root': {
    background: 'rgba(20, 20, 30, 0.8)',
    borderRadius: '12px',
    color: '#e0e0e0',
    '& fieldset': {
      borderColor: 'rgba(212, 175, 55, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(212, 175, 55, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#d4af37',
    },
  },
  '& .MuiInputAdornment-root': {
    color: '#d4af37',
  },
});

const CategoryChip = styled(Chip)<{ selected?: boolean }>(({ selected }) => ({
  background: selected ? 'rgba(212, 175, 55, 0.3)' : 'rgba(255, 255, 255, 0.05)',
  color: selected ? '#d4af37' : '#a0a0a0',
  border: `1px solid ${selected ? '#d4af37' : 'rgba(255, 255, 255, 0.1)'}`,
  fontFamily: '"Cinzel", serif',
  fontSize: '0.75rem',
  letterSpacing: '0.05em',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    background: 'rgba(212, 175, 55, 0.2)',
    borderColor: '#d4af37',
  },
}));

const FigureCard = styled(GothicCard)<{ figureStyle: string }>(({ figureStyle }) => ({
  cursor: 'pointer',
  animation: `${spiritAppear} 0.5s ease-out`,
  position: 'relative',

  // Appearance style glow
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    height: '80%',
    borderRadius: '50%',
    background: figureStyle === 'spirit'
      ? 'radial-gradient(ellipse, rgba(124, 45, 18, 0.2) 0%, transparent 70%)'
      : figureStyle === 'hologram'
      ? 'radial-gradient(ellipse, rgba(139, 92, 246, 0.15) 0%, transparent 70%)'
      : 'radial-gradient(ellipse, rgba(212, 175, 55, 0.1) 0%, transparent 70%)',
    pointerEvents: 'none',
    animation: `${glowPulse} 3s ease-in-out infinite`,
  },
}));

const FigureIcon = styled(Box)<{ figureStyle: string }>(({ figureStyle }) => ({
  width: '64px',
  height: '64px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: figureStyle === 'spirit'
    ? 'linear-gradient(135deg, rgba(124, 45, 18, 0.3), rgba(200, 100, 50, 0.2))'
    : figureStyle === 'hologram'
    ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(100, 100, 255, 0.2))'
    : 'linear-gradient(135deg, rgba(212, 175, 55, 0.3), rgba(255, 200, 100, 0.2))',
  marginBottom: '16px',
  animation: `${floatAnimation} 4s ease-in-out infinite`,
  boxShadow: figureStyle === 'spirit'
    ? '0 0 20px rgba(124, 45, 18, 0.4)'
    : figureStyle === 'hologram'
    ? '0 0 20px rgba(139, 92, 246, 0.4)'
    : '0 0 20px rgba(212, 175, 55, 0.4)',
}));

const FigureName = styled(Typography)({
  fontFamily: '"Playfair Display", serif',
  fontSize: '1.25rem',
  fontWeight: 600,
  color: '#e0e0e0',
  marginBottom: '4px',
});

const FigureTitle = styled(Typography)({
  fontFamily: '"Cinzel", serif',
  fontSize: '0.8rem',
  color: '#d4af37',
  letterSpacing: '0.1em',
  marginBottom: '8px',
});

const FigureYears = styled(Typography)({
  fontSize: '0.75rem',
  color: '#666666',
  marginBottom: '12px',
});

const TraitChip = styled(Chip)({
  background: 'rgba(139, 92, 246, 0.15)',
  color: '#a78bfa',
  fontSize: '0.7rem',
  height: '24px',
  margin: '2px',
});

const ModalContent = styled(Box)({
  color: '#e0e0e0',
});

const BackstoryText = styled(Typography)({
  fontStyle: 'italic',
  color: '#a08060',
  lineHeight: 1.8,
  marginBottom: '24px',
  fontSize: '1.05rem',
  borderLeft: '3px solid #d4af37',
  paddingLeft: '16px',
});

const QuoteBox = styled(Box)({
  background: 'rgba(212, 175, 55, 0.1)',
  border: '1px solid rgba(212, 175, 55, 0.3)',
  borderRadius: '12px',
  padding: '16px',
  marginBottom: '16px',
});

const Quote = styled(Typography)({
  fontFamily: '"Playfair Display", serif',
  fontSize: '1.1rem',
  fontStyle: 'italic',
  color: '#d4af37',
  lineHeight: 1.6,
});

export const AncestorHall: React.FC<RoomProps> = ({ onRoomChange }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedFigure, setSelectedFigure] = useState<HistoricalFigure | null>(null);

  const categories = useMemo(() => {
    return Array.from(new Set(historicalFigures.figures.map((f: HistoricalFigure) => f.category)));
  }, []);

  const filteredFigures = useMemo(() => {
    return historicalFigures.figures.filter((figure: HistoricalFigure) => {
      const matchesSearch = searchQuery === '' ||
        figure.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        figure.gothicTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        figure.traits.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === null || figure.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <RoomContainer>
      <HeaderSection>
        <RoomTitle>
          <Ghost size={40} style={{ marginRight: '16px', verticalAlign: 'middle' }} />
          Ancestor Hall
        </RoomTitle>
        <RoomSubtitle>
          Where the spirits of history gather to share their wisdom
        </RoomSubtitle>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <SearchBar
            placeholder="Search ancestors by name, title, or trait..."
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

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
            <CategoryChip
              label="All Ancestors"
              selected={selectedCategory === null}
              onClick={() => setSelectedCategory(null)}
              icon={<Sparkles size={14} />}
            />
            {categories.map((category) => (
              <CategoryChip
                key={category}
                label={category}
                selected={selectedCategory === category}
                onClick={() => setSelectedCategory(category)}
              />
            ))}
          </Box>

          {/* Quick Links */}
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <GothicButton variant="secondary" startIcon={<Clock size={18} />} onClick={() => navigate('/chrono-muse')}>
              ChronoMuse Time Travel
            </GothicButton>
            <GothicButton variant="ghost" startIcon={<TreeDeciduous size={18} />} onClick={() => navigate('/ancestry')}>
              Family Tree
            </GothicButton>
          </Box>
        </Box>
      </HeaderSection>

      <Grid container spacing={3}>
        {filteredFigures.map((figure: HistoricalFigure) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={figure.id}>
            <FigureCard
              variant="glass"
              ornate
              figureStyle={getAppearanceStyle(figure.appearanceStyle)}
              onClick={() => setSelectedFigure(figure)}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <FigureIcon figureStyle={getAppearanceStyle(figure.appearanceStyle)}>
                  <Ghost size={28} color={
                    figure.appearanceStyle === 'spirit' ? '#c86432' :
                    figure.appearanceStyle === 'hologram' ? '#8b5cf6' : '#d4af37'
                  } />
                </FigureIcon>
                <FigureName>{figure.name}</FigureName>
                <FigureTitle>{figure.gothicTitle}</FigureTitle>
                <FigureYears>{figure.years}</FigureYears>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {figure.traits.slice(0, 3).map((trait) => (
                    <TraitChip key={trait} label={trait} size="small" />
                  ))}
                </Box>
              </Box>
            </FigureCard>
          </Grid>
        ))}
      </Grid>

      {filteredFigures.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Ghost size={64} color="#666666" style={{ marginBottom: '16px' }} />
          <Typography sx={{ color: '#666666', fontSize: '1.2rem' }}>
            No ancestors found matching your search
          </Typography>
        </Box>
      )}

      <GothicModal
        open={selectedFigure !== null}
        onClose={() => setSelectedFigure(null)}
        title={selectedFigure?.name || ''}
        size="large"
        animation="unfurl"
        ornate
      >
        {selectedFigure && (
          <ModalContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <FigureIcon figureStyle={getAppearanceStyle(selectedFigure.appearanceStyle)} sx={{ animation: 'none' }}>
                <Ghost size={32} color={
                  selectedFigure.appearanceStyle === 'spirit' ? '#c86432' :
                  selectedFigure.appearanceStyle === 'hologram' ? '#8b5cf6' : '#d4af37'
                } />
              </FigureIcon>
              <Box>
                <FigureTitle sx={{ fontSize: '1rem' }}>{selectedFigure.gothicTitle}</FigureTitle>
                <FigureYears sx={{ mb: 0 }}>{selectedFigure.years}</FigureYears>
                <Chip
                  label={selectedFigure.category}
                  size="small"
                  sx={{ mt: 1, background: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa' }}
                />
              </Box>
            </Box>

            <BackstoryText>{selectedFigure.backstory}</BackstoryText>

            <Typography sx={{ fontWeight: 600, color: '#d4af37', mb: 2 }}>
              <Star size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Notable Quotes
            </Typography>
            {selectedFigure.quotes.map((quote, i) => (
              <QuoteBox key={i}>
                <Quote>"{quote}"</Quote>
              </QuoteBox>
            ))}

            <Box sx={{ mb: 3 }}>
              <Typography sx={{ fontWeight: 600, color: '#e0e0e0', mb: 1 }}>Traits</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {selectedFigure.traits.map((trait) => (
                  <TraitChip key={trait} label={trait} />
                ))}
              </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography sx={{ fontWeight: 600, color: '#e0e0e0', mb: 1 }}>Conversation Topics</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {selectedFigure.conversationTopics.map((topic) => (
                  <Chip key={topic} label={topic} size="small" sx={{ background: 'rgba(212, 175, 55, 0.15)', color: '#d4af37' }} />
                ))}
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
              <GothicButton variant="accent" startIcon={<MessageCircle size={18} />}>
                Summon for Conversation
              </GothicButton>
              <GothicButton variant="secondary">
                Learn More
              </GothicButton>
            </Box>
          </ModalContent>
        )}
      </GothicModal>
    </RoomContainer>
  );
};

export default AncestorHall;
