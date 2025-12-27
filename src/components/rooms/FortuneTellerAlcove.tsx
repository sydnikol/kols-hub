// Fortune Teller's Alcove Room Component
// Tarot, oracle, and divination tools

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Chip } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Sparkles, Moon, Star, Eye, Sun, Heart,
  Shuffle, RotateCcw, Book, Clock, Zap, History
} from 'lucide-react';
import { GothicCard } from '../gothic/GothicCard';
import { GothicButton } from '../gothic/GothicButton';

interface RoomProps {
  onRoomChange?: (roomId: string) => void;
}

const mysticalGlow = keyframes`
  0%, 100% { box-shadow: 0 0 30px rgba(212, 175, 55, 0.3); }
  50% { box-shadow: 0 0 60px rgba(212, 175, 55, 0.6); }
`;

const cardFlip = keyframes`
  0% { transform: rotateY(0deg); }
  50% { transform: rotateY(90deg); }
  100% { transform: rotateY(0deg); }
`;

const RoomContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #0a0808 0%, #1a1010 50%, #0a0808 100%)',
  padding: '32px',
  position: 'relative',
  overflow: 'hidden',
});

const MysticalOrb = styled(Box)({
  position: 'absolute',
  width: '300px',
  height: '300px',
  borderRadius: '50%',
  background: 'radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%)',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  animation: `${mysticalGlow} 4s ease-in-out infinite`,
  pointerEvents: 'none',
});

const HeaderSection = styled(Box)({
  textAlign: 'center',
  marginBottom: '48px',
  position: 'relative',
  zIndex: 1,
});

const RoomTitle = styled(Typography)({
  fontFamily: '"Cinzel", serif',
  fontSize: '3rem',
  fontWeight: 700,
  color: '#d4af37',
  letterSpacing: '0.1em',
  textShadow: '0 0 40px rgba(212, 175, 55, 0.4)',
  marginBottom: '8px',
});

const TarotCard = styled(Box)<{ isRevealed?: boolean }>(({ isRevealed }) => ({
  width: '120px',
  height: '200px',
  borderRadius: '12px',
  background: isRevealed
    ? 'linear-gradient(135deg, #2a2040 0%, #1a1030 100%)'
    : 'linear-gradient(135deg, #3a2860 0%, #2a1850 100%)',
  border: '2px solid #d4af37',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-10px) scale(1.05)',
    boxShadow: '0 20px 40px rgba(212, 175, 55, 0.4)',
  },
}));

const DeckCard = styled(GothicCard)({
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  textAlign: 'center',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 40px rgba(212, 175, 55, 0.3)',
  },
});

const spreads = [
  { id: 'single', name: 'Single Card', cards: 1, description: 'Quick daily guidance', time: '2 min' },
  { id: 'three', name: 'Past-Present-Future', cards: 3, description: 'Timeline insight', time: '10 min' },
  { id: 'celtic', name: 'Celtic Cross', cards: 10, description: 'Deep comprehensive reading', time: '30 min' },
  { id: 'relationship', name: 'Relationship Spread', cards: 7, description: 'Partnership dynamics', time: '20 min' },
];

const decks = [
  { id: 'rider-waite', name: 'Rider-Waite-Smith', cards: 78, style: 'Traditional' },
  { id: 'thoth', name: 'Thoth Tarot', cards: 78, style: 'Esoteric' },
  { id: 'marseille', name: 'Tarot de Marseille', cards: 78, style: 'Classic' },
  { id: 'oracle', name: 'Moon Oracle', cards: 44, style: 'Modern' },
];

const majorArcana = [
  { number: 0, name: 'The Fool', meaning: 'New beginnings, innocence' },
  { number: 1, name: 'The Magician', meaning: 'Manifestation, willpower' },
  { number: 2, name: 'High Priestess', meaning: 'Intuition, mystery' },
  { number: 3, name: 'The Empress', meaning: 'Abundance, nurturing' },
  { number: 4, name: 'The Emperor', meaning: 'Authority, structure' },
  { number: 5, name: 'Hierophant', meaning: 'Tradition, guidance' },
];

const recentReadings = [
  { date: 'Today', spread: 'Single Card', card: 'The Star', insight: 'Hope and renewal' },
  { date: 'Yesterday', spread: 'Three Card', card: 'Multiple', insight: 'Transition period' },
  { date: 'Dec 22', spread: 'Celtic Cross', card: 'Multiple', insight: 'Major decision ahead' },
];

export const FortuneTellerAlcove: React.FC<RoomProps> = ({ onRoomChange }) => {
  const navigate = useNavigate();
  const [selectedSpread, setSelectedSpread] = useState<string | null>(null);
  const [drawnCards, setDrawnCards] = useState<number[]>([]);

  const drawCard = () => {
    const newCard = Math.floor(Math.random() * 22);
    if (!drawnCards.includes(newCard)) {
      setDrawnCards([...drawnCards, newCard]);
    }
  };

  const resetReading = () => {
    setDrawnCards([]);
    setSelectedSpread(null);
  };

  return (
    <RoomContainer>
      <MysticalOrb />

      <HeaderSection>
        <RoomTitle>
          <Eye size={40} style={{ marginRight: '16px', verticalAlign: 'middle' }} />
          Fortune Teller's Alcove
        </RoomTitle>
        <Typography sx={{ color: '#a08060', fontStyle: 'italic', fontSize: '1.1rem' }}>
          Seek wisdom from the cards and the cosmos
        </Typography>
      </HeaderSection>

      <Grid container spacing={4} sx={{ position: 'relative', zIndex: 1 }}>
        {/* Reading Area */}
        <Grid item xs={12} md={8}>
          <GothicCard variant="elevated" ornate sx={{ minHeight: '400px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif', fontSize: '1.5rem' }}>
                <Sparkles size={24} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                {selectedSpread ? `${spreads.find(s => s.id === selectedSpread)?.name} Reading` : 'Choose a Spread'}
              </Typography>
              {drawnCards.length > 0 && (
                <GothicButton variant="ghost" startIcon={<RotateCcw size={18} />} onClick={resetReading}>
                  Reset
                </GothicButton>
              )}
            </Box>

            {!selectedSpread ? (
              <Grid container spacing={2}>
                {spreads.map((spread) => (
                  <Grid item xs={6} sm={3} key={spread.id}>
                    <DeckCard variant="glass" onClick={() => setSelectedSpread(spread.id)}>
                      <Sparkles size={32} color="#d4af37" style={{ marginBottom: '12px' }} />
                      <Typography sx={{ color: '#e0e0e0', fontWeight: 600, mb: 1 }}>{spread.name}</Typography>
                      <Typography sx={{ color: '#888888', fontSize: '0.8rem', mb: 1 }}>{spread.description}</Typography>
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Chip label={`${spread.cards} cards`} size="small" sx={{ background: 'rgba(212, 175, 55, 0.2)', color: '#d4af37' }} />
                        <Chip label={spread.time} size="small" sx={{ background: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa' }} />
                      </Box>
                    </DeckCard>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap', mb: 4 }}>
                  {drawnCards.map((cardIndex, i) => (
                    <TarotCard key={i} isRevealed>
                      <Typography sx={{ color: '#d4af37', fontSize: '0.8rem', mb: 1 }}>
                        {majorArcana[cardIndex]?.number}
                      </Typography>
                      <Typography sx={{ color: '#e0e0e0', fontWeight: 600, textAlign: 'center', fontSize: '0.9rem' }}>
                        {majorArcana[cardIndex]?.name}
                      </Typography>
                      <Typography sx={{ color: '#888888', fontSize: '0.7rem', textAlign: 'center', mt: 1, px: 1 }}>
                        {majorArcana[cardIndex]?.meaning}
                      </Typography>
                    </TarotCard>
                  ))}
                  {drawnCards.length < (spreads.find(s => s.id === selectedSpread)?.cards || 1) && (
                    <TarotCard onClick={drawCard}>
                      <Shuffle size={32} color="#d4af37" />
                      <Typography sx={{ color: '#888888', fontSize: '0.8rem', mt: 1 }}>Draw</Typography>
                    </TarotCard>
                  )}
                </Box>
                {drawnCards.length > 0 && (
                  <Box sx={{ textAlign: 'center' }}>
                    <GothicButton variant="accent" startIcon={<Book size={18} />}>
                      Get AI Interpretation
                    </GothicButton>
                  </Box>
                )}
              </Box>
            )}
          </GothicCard>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Deck Selection */}
          <GothicCard variant="glass" sx={{ mb: 3 }}>
            <Typography sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif', fontSize: '1.2rem', mb: 2 }}>
              Your Decks
            </Typography>
            {decks.slice(0, 3).map((deck) => (
              <Box
                key={deck.id}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 1.5,
                  mb: 1,
                  borderRadius: '8px',
                  background: 'rgba(212, 175, 55, 0.05)',
                  cursor: 'pointer',
                  '&:hover': { background: 'rgba(212, 175, 55, 0.1)' },
                }}
              >
                <Box>
                  <Typography sx={{ color: '#e0e0e0', fontSize: '0.9rem' }}>{deck.name}</Typography>
                  <Typography sx={{ color: '#888888', fontSize: '0.75rem' }}>{deck.style}</Typography>
                </Box>
                <Chip label={`${deck.cards}`} size="small" sx={{ background: 'rgba(212, 175, 55, 0.2)', color: '#d4af37' }} />
              </Box>
            ))}
          </GothicCard>

          {/* Recent Readings */}
          <GothicCard variant="glass">
            <Typography sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif', fontSize: '1.2rem', mb: 2 }}>
              <Clock size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Recent Readings
            </Typography>
            {recentReadings.map((reading, i) => (
              <Box
                key={i}
                sx={{
                  p: 1.5,
                  mb: 1,
                  borderRadius: '8px',
                  background: 'rgba(20, 20, 30, 0.6)',
                  borderLeft: '3px solid #d4af37',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography sx={{ color: '#e0e0e0', fontSize: '0.9rem' }}>{reading.spread}</Typography>
                  <Typography sx={{ color: '#888888', fontSize: '0.8rem' }}>{reading.date}</Typography>
                </Box>
                <Typography sx={{ color: '#a78bfa', fontSize: '0.85rem' }}>{reading.insight}</Typography>
              </Box>
            ))}
          </GothicCard>
        </Grid>
      </Grid>

      {/* Daily Card */}
      <Box sx={{ mt: 4, textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <GothicCard variant="elevated" ornate sx={{ maxWidth: '500px', mx: 'auto' }}>
          <Typography sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif', fontSize: '1.3rem', mb: 2 }}>
            <Sun size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Today's Card
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <TarotCard isRevealed>
              <Typography sx={{ color: '#d4af37', fontSize: '1rem', mb: 1 }}>XVII</Typography>
              <Star size={40} color="#d4af37" />
              <Typography sx={{ color: '#e0e0e0', fontWeight: 600, mt: 1 }}>The Star</Typography>
            </TarotCard>
          </Box>
          <Typography sx={{ color: '#a0a0a0', mb: 2 }}>
            Hope, inspiration, and renewal guide your path today. Trust in the universe's plan.
          </Typography>
          <GothicButton variant="secondary" startIcon={<Zap size={18} />}>
            Deeper Interpretation
          </GothicButton>
        </GothicCard>
      </Box>

      {/* Navigation Links */}
      <Box sx={{ mt: 4, position: 'relative', zIndex: 1 }}>
        <Typography sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif', fontSize: '1.3rem', mb: 3, textAlign: 'center' }}>
          <Sparkles size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Explore Related Features
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <GothicButton variant="primary" startIcon={<History size={18} />} onClick={() => navigate('/chrono-muse')}>
            ChronoMuse
          </GothicButton>
        </Box>
      </Box>
    </RoomContainer>
  );
};

export default FortuneTellerAlcove;
