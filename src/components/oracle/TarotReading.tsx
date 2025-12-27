// TarotReading.tsx
// Spread layouts, interpretation display, reading history, and sharing

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Box, Typography, TextField, Chip, IconButton, Tooltip, Dialog, DialogContent, DialogTitle, DialogActions } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Sparkles, Save, Share2, History, Trash2, X, Calendar, Moon,
  Sun, Clock, Star, BookOpen, Edit3, Download, ChevronDown, ChevronUp,
  Layout, Grid, Circle, Plus
} from 'lucide-react';
import {
  TarotCard,
  completeTarotDeck,
  shuffleDeck,
  suitInfo,
  Suit
} from '../../data/tarot_cards';
import { GothicCard } from '../gothic/GothicCard';
import { GothicButton } from '../gothic/GothicButton';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

// Styled components
const ReadingContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #0a0812 0%, #1a1028 50%, #0a0812 100%)',
  padding: '24px',
});

const ReadingTitle = styled(Typography)({
  fontFamily: '"Cinzel", serif',
  fontSize: '2.5rem',
  fontWeight: 700,
  background: 'linear-gradient(90deg, #8b5cf6, #d4af37, #8b5cf6)',
  backgroundSize: '200% auto',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  animation: `${shimmer} 4s linear infinite`,
  textAlign: 'center',
  marginBottom: '8px',
});

const SpreadSelector = styled(Box)({
  display: 'flex',
  gap: '12px',
  justifyContent: 'center',
  marginBottom: '32px',
  flexWrap: 'wrap',
});

const SpreadOption = styled(Box)<{ selected: boolean }>(({ selected }) => ({
  padding: '16px 24px',
  borderRadius: '12px',
  background: selected ? 'rgba(139, 92, 246, 0.2)' : 'rgba(20, 20, 30, 0.6)',
  border: selected ? '2px solid #8b5cf6' : '1px solid rgba(100, 100, 120, 0.3)',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  textAlign: 'center',
  minWidth: '120px',
  '&:hover': {
    background: 'rgba(139, 92, 246, 0.15)',
    borderColor: '#8b5cf6',
  },
}));

const SpreadLayout = styled(Box)({
  position: 'relative',
  minHeight: '500px',
  marginBottom: '32px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const CardPosition = styled(Box)<{
  gridX: number;
  gridY: number;
  suitColor: string;
  isReversed: boolean;
  isDealt: boolean;
  delay: number;
}>(({ gridX, gridY, suitColor, isReversed, isDealt, delay }) => ({
  position: 'absolute',
  width: '120px',
  height: '180px',
  left: `calc(50% + ${gridX * 140}px - 60px)`,
  top: `calc(50% + ${gridY * 200}px - 90px)`,
  borderRadius: '10px',
  background: isDealt
    ? 'linear-gradient(180deg, #1a1028 0%, #0a0812 100%)'
    : 'rgba(30, 30, 40, 0.5)',
  border: isDealt
    ? `2px solid ${suitColor}60`
    : '2px dashed rgba(100, 100, 120, 0.4)',
  boxShadow: isDealt
    ? `0 6px 24px rgba(0,0,0,0.5), 0 0 15px ${suitColor}20`
    : 'none',
  padding: '8px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  transform: `${isReversed ? 'rotate(180deg)' : 'rotate(0deg)'}`,
  animation: isDealt ? `${fadeIn} 0.5s ease-out ${delay}ms both` : 'none',
  '&:hover': {
    transform: `${isReversed ? 'rotate(180deg)' : 'rotate(0deg)'} scale(1.05)`,
    borderColor: suitColor,
  },
}));

const CardLabel = styled(Typography)({
  fontFamily: '"Cinzel", serif',
  fontSize: '0.75rem',
  color: '#888888',
  textAlign: 'center',
  position: 'absolute',
  bottom: '-25px',
  left: '50%',
  transform: 'translateX(-50%)',
  whiteSpace: 'nowrap',
});

const InterpretationPanel = styled(Box)({
  background: 'rgba(20, 20, 30, 0.8)',
  borderRadius: '16px',
  border: '1px solid rgba(100, 100, 120, 0.3)',
  padding: '24px',
  marginBottom: '24px',
});

const NotesField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    color: '#e0e0e0',
    background: 'rgba(10, 10, 20, 0.5)',
    '& fieldset': {
      borderColor: 'rgba(100, 100, 120, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(139, 92, 246, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#8b5cf6',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#888888',
  },
});

const HistoryItem = styled(Box)({
  padding: '16px',
  borderRadius: '12px',
  background: 'rgba(30, 30, 40, 0.6)',
  border: '1px solid rgba(100, 100, 120, 0.2)',
  marginBottom: '12px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'rgba(40, 40, 60, 0.6)',
    borderColor: 'rgba(139, 92, 246, 0.4)',
  },
});

// Types
interface DrawnCard extends TarotCard {
  isReversed: boolean;
  drawnAt: number;
}

interface SpreadPosition {
  label: string;
  gridX: number;
  gridY: number;
  description: string;
}

interface SpreadType {
  id: string;
  name: string;
  cardCount: number;
  positions: SpreadPosition[];
  description: string;
  icon: React.ReactNode;
}

interface SavedReading {
  id: string;
  spreadType: string;
  cards: DrawnCard[];
  question?: string;
  notes?: string;
  createdAt: number;
  interpretation?: string;
}

// Spread definitions
const spreads: SpreadType[] = [
  {
    id: 'single',
    name: 'Single Card',
    cardCount: 1,
    icon: <Circle size={18} />,
    description: 'A simple daily draw or quick answer',
    positions: [
      { label: 'The Message', gridX: 0, gridY: 0, description: 'The core message or answer' }
    ]
  },
  {
    id: 'three-card',
    name: 'Past-Present-Future',
    cardCount: 3,
    icon: <Layout size={18} />,
    description: 'Understanding the flow of time',
    positions: [
      { label: 'Past', gridX: -1, gridY: 0, description: 'What has shaped this situation' },
      { label: 'Present', gridX: 0, gridY: 0, description: 'The current state of affairs' },
      { label: 'Future', gridX: 1, gridY: 0, description: 'What is likely to come' }
    ]
  },
  {
    id: 'yes-no',
    name: 'Yes/No',
    cardCount: 3,
    icon: <Star size={18} />,
    description: 'Getting a direct answer to a question',
    positions: [
      { label: 'The Question', gridX: 0, gridY: -0.5, description: 'The heart of your inquiry' },
      { label: 'Supporting', gridX: -0.75, gridY: 0.3, description: 'Energy supporting the answer' },
      { label: 'Opposing', gridX: 0.75, gridY: 0.3, description: 'Energy opposing the answer' }
    ]
  },
  {
    id: 'daily',
    name: 'Daily Guidance',
    cardCount: 3,
    icon: <Sun size={18} />,
    description: 'Guidance for the day ahead',
    positions: [
      { label: 'Morning', gridX: -1, gridY: 0, description: 'Energy for starting your day' },
      { label: 'Afternoon', gridX: 0, gridY: 0, description: 'Energy for your active hours' },
      { label: 'Evening', gridX: 1, gridY: 0, description: 'Energy for reflection and rest' }
    ]
  },
  {
    id: 'celtic-cross',
    name: 'Celtic Cross',
    cardCount: 10,
    icon: <Grid size={18} />,
    description: 'A comprehensive look at any situation',
    positions: [
      { label: '1. Present', gridX: 0, gridY: 0, description: 'Current situation and self' },
      { label: '2. Challenge', gridX: 0.15, gridY: 0.1, description: 'Immediate challenge or obstacle' },
      { label: '3. Foundation', gridX: 0, gridY: 0.7, description: 'Basis of the situation' },
      { label: '4. Past', gridX: -1, gridY: 0, description: 'Recent past influencing now' },
      { label: '5. Crown', gridX: 0, gridY: -0.7, description: 'Best possible outcome' },
      { label: '6. Future', gridX: 1, gridY: 0, description: 'Near future development' },
      { label: '7. Self', gridX: 2, gridY: 0.9, description: 'Your attitude and approach' },
      { label: '8. Environment', gridX: 2, gridY: 0.3, description: 'External influences' },
      { label: '9. Hopes/Fears', gridX: 2, gridY: -0.3, description: 'Your hopes and fears' },
      { label: '10. Outcome', gridX: 2, gridY: -0.9, description: 'Final outcome' }
    ]
  }
];

// Helper functions
const getSuitColor = (suit: Suit): string => {
  return suitInfo[suit]?.color || '#d4af37';
};

const generateInterpretation = (cards: DrawnCard[], positions: SpreadPosition[]): string => {
  let interpretation = '';

  cards.forEach((card, index) => {
    const position = positions[index];
    const meaning = card.isReversed ? card.reversedMeaning : card.uprightMeaning;

    interpretation += `**${position.label}**: ${card.name}${card.isReversed ? ' (Reversed)' : ''}\n`;
    interpretation += `${meaning}\n\n`;
  });

  return interpretation;
};

interface TarotReadingProps {
  initialCards?: DrawnCard[];
  onClose?: () => void;
}

export const TarotReading: React.FC<TarotReadingProps> = ({
  initialCards,
  onClose
}) => {
  const [selectedSpread, setSelectedSpread] = useState<SpreadType>(spreads[1]);
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>(initialCards || []);
  const [question, setQuestion] = useState('');
  const [notes, setNotes] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [savedReadings, setSavedReadings] = useState<SavedReading[]>([]);
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
  const [showInterpretation, setShowInterpretation] = useState(true);
  const [isDealing, setIsDealing] = useState(false);

  // Load saved readings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('tarot_readings');
    if (saved) {
      try {
        setSavedReadings(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading saved readings:', e);
      }
    }
  }, []);

  // Handle initial cards
  useEffect(() => {
    if (initialCards && initialCards.length > 0) {
      setDrawnCards(initialCards);
      // Find matching spread
      const matchingSpread = spreads.find(s => s.cardCount === initialCards.length) || spreads[1];
      setSelectedSpread(matchingSpread);
    }
  }, [initialCards]);

  const handleDrawSpread = useCallback(() => {
    setIsDealing(true);
    const shuffled = shuffleDeck(completeTarotDeck);
    const drawn: DrawnCard[] = shuffled.slice(0, selectedSpread.cardCount).map((card, index) => ({
      ...card,
      isReversed: Math.random() > 0.5,
      drawnAt: Date.now() + index,
    }));
    setDrawnCards(drawn);
    setNotes('');

    setTimeout(() => setIsDealing(false), selectedSpread.cardCount * 200);
  }, [selectedSpread]);

  const handleSaveReading = useCallback(() => {
    if (drawnCards.length === 0) return;

    const newReading: SavedReading = {
      id: `reading-${Date.now()}`,
      spreadType: selectedSpread.id,
      cards: drawnCards,
      question: question || undefined,
      notes: notes || undefined,
      createdAt: Date.now(),
      interpretation: generateInterpretation(drawnCards, selectedSpread.positions)
    };

    const updated = [newReading, ...savedReadings];
    setSavedReadings(updated);
    localStorage.setItem('tarot_readings', JSON.stringify(updated));
  }, [drawnCards, selectedSpread, question, notes, savedReadings]);

  const handleLoadReading = useCallback((reading: SavedReading) => {
    setDrawnCards(reading.cards);
    setQuestion(reading.question || '');
    setNotes(reading.notes || '');
    const spread = spreads.find(s => s.id === reading.spreadType) || spreads[1];
    setSelectedSpread(spread);
    setShowHistory(false);
  }, []);

  const handleDeleteReading = useCallback((readingId: string) => {
    const updated = savedReadings.filter(r => r.id !== readingId);
    setSavedReadings(updated);
    localStorage.setItem('tarot_readings', JSON.stringify(updated));
  }, [savedReadings]);

  const handleShare = useCallback(() => {
    if (drawnCards.length === 0) return;

    const shareText = `Tarot Reading - ${selectedSpread.name}\n\n${
      question ? `Question: ${question}\n\n` : ''
    }${drawnCards.map((card, i) => {
      const pos = selectedSpread.positions[i];
      return `${pos.label}: ${card.name}${card.isReversed ? ' (Reversed)' : ''}`;
    }).join('\n')}\n\n${notes ? `Notes: ${notes}` : ''}`;

    if (navigator.share) {
      navigator.share({
        title: 'Tarot Reading',
        text: shareText
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Reading copied to clipboard!');
    }
  }, [drawnCards, selectedSpread, question, notes]);

  const interpretation = useMemo(() => {
    if (drawnCards.length === 0) return null;
    return generateInterpretation(drawnCards, selectedSpread.positions);
  }, [drawnCards, selectedSpread]);

  return (
    <ReadingContainer>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <ReadingTitle>
          <Sparkles size={36} style={{ marginRight: '12px', verticalAlign: 'middle', color: '#8b5cf6' }} />
          Tarot Reading
        </ReadingTitle>
        <Typography sx={{ color: '#9080a0', fontStyle: 'italic' }}>
          Seek wisdom in the ancient cards
        </Typography>
      </Box>

      {/* Spread Selector */}
      <SpreadSelector>
        {spreads.map(spread => (
          <SpreadOption
            key={spread.id}
            selected={selectedSpread.id === spread.id}
            onClick={() => setSelectedSpread(spread)}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1, color: '#a78bfa' }}>
              {spread.icon}
            </Box>
            <Typography sx={{ color: '#e0e0e0', fontWeight: 600, fontSize: '0.9rem' }}>
              {spread.name}
            </Typography>
            <Typography sx={{ color: '#888888', fontSize: '0.75rem' }}>
              {spread.cardCount} card{spread.cardCount > 1 ? 's' : ''}
            </Typography>
          </SpreadOption>
        ))}
      </SpreadSelector>

      {/* Question Input */}
      <GothicCard variant="glass" sx={{ mb: 3, maxWidth: '600px', mx: 'auto' }}>
        <NotesField
          fullWidth
          label="Your Question (Optional)"
          placeholder="Focus on what you seek guidance for..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          variant="outlined"
          size="small"
        />
      </GothicCard>

      {/* Controls */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 4, flexWrap: 'wrap' }}>
        <GothicButton
          variant="primary"
          startIcon={<Sparkles size={18} />}
          onClick={handleDrawSpread}
        >
          Draw {selectedSpread.name}
        </GothicButton>

        <GothicButton
          variant="secondary"
          startIcon={<Save size={18} />}
          onClick={handleSaveReading}
          disabled={drawnCards.length === 0}
        >
          Save Reading
        </GothicButton>

        <GothicButton
          variant="secondary"
          startIcon={<Share2 size={18} />}
          onClick={handleShare}
          disabled={drawnCards.length === 0}
        >
          Share
        </GothicButton>

        <GothicButton
          variant="ghost"
          startIcon={<History size={18} />}
          onClick={() => setShowHistory(!showHistory)}
        >
          History ({savedReadings.length})
        </GothicButton>
      </Box>

      {/* Spread Layout */}
      {drawnCards.length > 0 && (
        <GothicCard variant="elevated" sx={{ mb: 4, p: 4 }}>
          <Typography sx={{
            color: '#d4af37',
            fontFamily: '"Cinzel", serif',
            fontSize: '1.3rem',
            textAlign: 'center',
            mb: 2
          }}>
            {selectedSpread.name}
          </Typography>
          <Typography sx={{ color: '#888888', textAlign: 'center', mb: 4, fontSize: '0.9rem' }}>
            {selectedSpread.description}
          </Typography>

          <SpreadLayout>
            {selectedSpread.positions.map((position, index) => {
              const card = drawnCards[index];
              if (!card) return null;

              const suitColor = getSuitColor(card.suit);
              return (
                <CardPosition
                  key={index}
                  gridX={position.gridX}
                  gridY={position.gridY}
                  suitColor={suitColor}
                  isReversed={card.isReversed}
                  isDealt={true}
                  delay={index * 150}
                  onClick={() => setSelectedCardIndex(selectedCardIndex === index ? null : index)}
                >
                  <Typography sx={{
                    fontFamily: '"Cinzel", serif',
                    fontSize: '0.7rem',
                    color: suitColor,
                    textAlign: 'center',
                    transform: card.isReversed ? 'rotate(180deg)' : 'none'
                  }}>
                    {card.name}
                  </Typography>
                  <Typography sx={{
                    fontSize: '0.6rem',
                    color: '#888888',
                    mt: 0.5,
                    transform: card.isReversed ? 'rotate(180deg)' : 'none'
                  }}>
                    {card.isReversed ? '(Reversed)' : ''}
                  </Typography>
                  <CardLabel style={{ transform: card.isReversed ? 'translateX(-50%) rotate(180deg)' : 'translateX(-50%)' }}>
                    {position.label}
                  </CardLabel>
                </CardPosition>
              );
            })}
          </SpreadLayout>
        </GothicCard>
      )}

      {/* Selected Card Detail */}
      {selectedCardIndex !== null && drawnCards[selectedCardIndex] && (
        <GothicCard variant="glass" sx={{ mb: 4, maxWidth: '700px', mx: 'auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography sx={{
                color: getSuitColor(drawnCards[selectedCardIndex].suit),
                fontFamily: '"Cinzel", serif',
                fontSize: '1.5rem'
              }}>
                {drawnCards[selectedCardIndex].name}
              </Typography>
              <Typography sx={{ color: '#888888', fontSize: '0.9rem' }}>
                {selectedSpread.positions[selectedCardIndex].label} - {
                  drawnCards[selectedCardIndex].isReversed ? 'Reversed' : 'Upright'
                }
              </Typography>
            </Box>
            <IconButton onClick={() => setSelectedCardIndex(null)} sx={{ color: '#888888' }}>
              <X size={20} />
            </IconButton>
          </Box>

          <Typography sx={{ color: '#d0d0d0', mb: 2, lineHeight: 1.6 }}>
            {drawnCards[selectedCardIndex].isReversed
              ? drawnCards[selectedCardIndex].reversedMeaning
              : drawnCards[selectedCardIndex].uprightMeaning}
          </Typography>

          <Typography sx={{ color: '#9080a0', fontStyle: 'italic', mb: 2, lineHeight: 1.6 }}>
            {drawnCards[selectedCardIndex].gothicDescription}
          </Typography>

          <Typography sx={{ color: '#10b981', fontSize: '0.9rem' }}>
            <strong>Advice:</strong> {drawnCards[selectedCardIndex].advice}
          </Typography>

          <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {drawnCards[selectedCardIndex].keywords.map((keyword, i) => (
              <Chip
                key={i}
                label={keyword}
                size="small"
                sx={{
                  background: `${getSuitColor(drawnCards[selectedCardIndex].suit)}15`,
                  color: getSuitColor(drawnCards[selectedCardIndex].suit),
                  fontSize: '0.7rem'
                }}
              />
            ))}
          </Box>
        </GothicCard>
      )}

      {/* Full Interpretation */}
      {drawnCards.length > 0 && (
        <InterpretationPanel>
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, cursor: 'pointer' }}
            onClick={() => setShowInterpretation(!showInterpretation)}
          >
            <Typography sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif', fontSize: '1.2rem' }}>
              <BookOpen size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Full Reading
            </Typography>
            {showInterpretation ? <ChevronUp color="#888" /> : <ChevronDown color="#888" />}
          </Box>

          {showInterpretation && (
            <>
              {drawnCards.map((card, index) => {
                const position = selectedSpread.positions[index];
                const suitColor = getSuitColor(card.suit);
                return (
                  <Box key={index} sx={{ mb: 3, pl: 2, borderLeft: `3px solid ${suitColor}` }}>
                    <Typography sx={{ color: suitColor, fontWeight: 600, mb: 0.5 }}>
                      {position.label}: {card.name}{card.isReversed ? ' (Reversed)' : ''}
                    </Typography>
                    <Typography sx={{ color: '#888888', fontSize: '0.8rem', mb: 1 }}>
                      {position.description}
                    </Typography>
                    <Typography sx={{ color: '#d0d0d0', fontSize: '0.9rem', lineHeight: 1.5 }}>
                      {card.isReversed ? card.reversedMeaning : card.uprightMeaning}
                    </Typography>
                  </Box>
                );
              })}
            </>
          )}
        </InterpretationPanel>
      )}

      {/* Notes */}
      {drawnCards.length > 0 && (
        <GothicCard variant="glass" sx={{ mb: 4, maxWidth: '700px', mx: 'auto' }}>
          <Typography sx={{ color: '#a78bfa', fontFamily: '"Cinzel", serif', mb: 2 }}>
            <Edit3 size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Reading Notes
          </Typography>
          <NotesField
            fullWidth
            multiline
            rows={4}
            placeholder="Record your thoughts, insights, and personal interpretations..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            variant="outlined"
          />
        </GothicCard>
      )}

      {/* History Panel */}
      <Dialog
        open={showHistory}
        onClose={() => setShowHistory(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: 'linear-gradient(180deg, #1a1028 0%, #0a0812 100%)',
            border: '2px solid rgba(212, 175, 55, 0.3)',
            borderRadius: '16px',
          }
        }}
      >
        <DialogTitle sx={{
          color: '#d4af37',
          fontFamily: '"Cinzel", serif',
          borderBottom: '1px solid rgba(100, 100, 120, 0.3)'
        }}>
          <History size={24} style={{ marginRight: '12px', verticalAlign: 'middle' }} />
          Reading History
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {savedReadings.length === 0 ? (
            <Typography sx={{ color: '#888888', textAlign: 'center', py: 4 }}>
              No saved readings yet. Draw your first spread to begin.
            </Typography>
          ) : (
            savedReadings.map(reading => {
              const spread = spreads.find(s => s.id === reading.spreadType);
              return (
                <HistoryItem key={reading.id}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box onClick={() => handleLoadReading(reading)} sx={{ flex: 1 }}>
                      <Typography sx={{ color: '#e0e0e0', fontWeight: 600 }}>
                        {spread?.name || reading.spreadType}
                      </Typography>
                      <Typography sx={{ color: '#888888', fontSize: '0.8rem', mb: 1 }}>
                        <Calendar size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                        {new Date(reading.createdAt).toLocaleString()}
                      </Typography>
                      {reading.question && (
                        <Typography sx={{ color: '#9080a0', fontSize: '0.85rem', fontStyle: 'italic' }}>
                          "{reading.question}"
                        </Typography>
                      )}
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                        {reading.cards.map((card, i) => (
                          <Chip
                            key={i}
                            label={card.name}
                            size="small"
                            sx={{
                              fontSize: '0.65rem',
                              height: '20px',
                              background: `${getSuitColor(card.suit)}15`,
                              color: getSuitColor(card.suit)
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteReading(reading.id);
                      }}
                      sx={{ color: '#ef4444' }}
                    >
                      <Trash2 size={18} />
                    </IconButton>
                  </Box>
                </HistoryItem>
              );
            })
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(100, 100, 120, 0.3)' }}>
          <GothicButton variant="ghost" onClick={() => setShowHistory(false)}>
            Close
          </GothicButton>
        </DialogActions>
      </Dialog>
    </ReadingContainer>
  );
};

export default TarotReading;
