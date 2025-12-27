// TarotDeck.tsx
// Beautiful card display with animations, shuffling, and card drawing

import React, { useState, useCallback, useMemo } from 'react';
import { Box, Typography, IconButton, Tooltip, Chip, Dialog, DialogContent } from '@mui/material';
import { styled, keyframes, css } from '@mui/material/styles';
import {
  Shuffle, RotateCcw, Eye, X, Star, BookOpen, Sparkles, Moon
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
const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
`;

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.3); }
  50% { box-shadow: 0 0 40px rgba(139, 92, 246, 0.6); }
`;

const flipCard = keyframes`
  0% { transform: rotateY(0deg); }
  50% { transform: rotateY(90deg); }
  100% { transform: rotateY(180deg); }
`;

const shuffleAnim = keyframes`
  0% { transform: translateX(0) rotate(0deg); }
  25% { transform: translateX(-20px) rotate(-5deg); }
  50% { transform: translateX(20px) rotate(5deg); }
  75% { transform: translateX(-10px) rotate(-2deg); }
  100% { transform: translateX(0) rotate(0deg); }
`;

const dealCard = keyframes`
  0% {
    transform: translateY(-100px) scale(0.5) rotate(-10deg);
    opacity: 0;
  }
  50% {
    transform: translateY(10px) scale(1.05) rotate(2deg);
    opacity: 1;
  }
  100% {
    transform: translateY(0) scale(1) rotate(0deg);
    opacity: 1;
  }
`;

const DeckContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #0a0812 0%, #1a1028 50%, #0a0812 100%)',
  padding: '24px',
});

const DeckTitle = styled(Typography)({
  fontFamily: '"Cinzel", serif',
  fontSize: '2.5rem',
  fontWeight: 700,
  background: 'linear-gradient(90deg, #d4af37, #f4d03f, #d4af37)',
  backgroundSize: '200% auto',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  textAlign: 'center',
  marginBottom: '8px',
});

const DeckStack = styled(Box)<{ isShuffling: boolean }>(({ isShuffling }) => ({
  width: '180px',
  height: '280px',
  position: 'relative',
  margin: '0 auto 32px',
  cursor: 'pointer',
  perspective: '1000px',
  animation: isShuffling ? `${shuffleAnim} 0.5s ease-in-out` : 'none',
  '&:hover': {
    '& > div': {
      transform: 'translateX(var(--hover-offset, 0))',
    }
  }
}));

const StackedCard = styled(Box)<{ index: number }>(({ index }) => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  borderRadius: '12px',
  background: 'linear-gradient(135deg, #1a1028 0%, #2d1f42 50%, #1a1028 100%)',
  border: '2px solid rgba(212, 175, 55, 0.3)',
  boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
  transition: 'transform 0.3s ease',
  '--hover-offset': `${index * 3}px`,
  top: `${index * 2}px`,
  left: `${index * 2}px`,
  zIndex: 10 - index,
}));

const CardBackDesign = styled(Box)({
  width: '100%',
  height: '100%',
  borderRadius: '10px',
  background: `
    linear-gradient(135deg, #2d1f42 0%, #1a1028 100%),
    repeating-linear-gradient(
      45deg,
      transparent,
      transparent 10px,
      rgba(212, 175, 55, 0.05) 10px,
      rgba(212, 175, 55, 0.05) 20px
    )
  `,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: '8px',
    border: '1px solid rgba(212, 175, 55, 0.4)',
    borderRadius: '8px',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: '16px',
    border: '1px solid rgba(212, 175, 55, 0.2)',
    borderRadius: '6px',
  },
});

const MysticSymbol = styled(Box)({
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  animation: `${glow} 3s ease-in-out infinite`,
});

// Card Front styled components
const CardFront = styled(Box)<{
  suitColor: string;
  isReversed: boolean;
  isFlipping: boolean;
  dealDelay: number;
}>(({ suitColor, isReversed, isFlipping, dealDelay }) => ({
  width: '200px',
  height: '320px',
  borderRadius: '12px',
  background: 'linear-gradient(180deg, #1a1028 0%, #0a0812 100%)',
  border: `2px solid ${suitColor}60`,
  boxShadow: `0 8px 32px rgba(0,0,0,0.6), 0 0 20px ${suitColor}30`,
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  overflow: 'hidden',
  transform: isReversed ? 'rotate(180deg)' : 'rotate(0deg)',
  animation: isFlipping
    ? css`${flipCard} 0.6s ease-in-out`
    : css`${dealCard} 0.6s ease-out ${dealDelay}ms both`,
  cursor: 'pointer',
  transition: 'box-shadow 0.3s ease',
  '&:hover': {
    boxShadow: `0 12px 40px rgba(0,0,0,0.7), 0 0 30px ${suitColor}50`,
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: suitColor,
  },
}));

const CardNumber = styled(Typography)<{ suitColor: string }>(({ suitColor }) => ({
  fontFamily: '"Cinzel", serif',
  fontSize: '1.5rem',
  fontWeight: 700,
  color: suitColor,
  position: 'absolute',
  top: '12px',
  left: '16px',
}));

const CardTitle = styled(Typography)({
  fontFamily: '"Cinzel", serif',
  fontSize: '1.1rem',
  fontWeight: 600,
  color: '#e0e0e0',
  textAlign: 'center',
  marginTop: '40px',
  marginBottom: '12px',
  lineHeight: 1.2,
});

const CardImagePlaceholder = styled(Box)<{ suitColor: string }>(({ suitColor }) => ({
  flex: 1,
  borderRadius: '8px',
  background: `linear-gradient(135deg, ${suitColor}10 0%, ${suitColor}20 100%)`,
  border: `1px solid ${suitColor}30`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '12px',
}));

const CardSuit = styled(Typography)<{ suitColor: string }>(({ suitColor }) => ({
  fontFamily: '"Cinzel", serif',
  fontSize: '0.8rem',
  color: suitColor,
  textAlign: 'center',
  textTransform: 'uppercase',
  letterSpacing: '2px',
}));

const KeywordChip = styled(Chip)<{ suitColor: string }>(({ suitColor }) => ({
  margin: '2px',
  height: '22px',
  fontSize: '0.65rem',
  background: `${suitColor}15`,
  color: suitColor,
  border: `1px solid ${suitColor}40`,
}));

const DrawnCardsArea = styled(Box)({
  display: 'flex',
  gap: '24px',
  justifyContent: 'center',
  flexWrap: 'wrap',
  minHeight: '350px',
  padding: '16px',
  marginBottom: '24px',
});

const ControlsBar = styled(Box)({
  display: 'flex',
  gap: '12px',
  justifyContent: 'center',
  marginBottom: '24px',
  flexWrap: 'wrap',
});

const DrawCountSelector = styled(Box)({
  display: 'flex',
  gap: '8px',
  alignItems: 'center',
  padding: '12px 20px',
  background: 'rgba(20, 20, 30, 0.8)',
  borderRadius: '24px',
  border: '1px solid rgba(100, 100, 120, 0.3)',
});

const CountButton = styled(Box)<{ active: boolean }>(({ active }) => ({
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  background: active ? 'rgba(139, 92, 246, 0.3)' : 'rgba(40, 40, 60, 0.5)',
  border: active ? '2px solid #8b5cf6' : '1px solid rgba(100, 100, 120, 0.3)',
  color: active ? '#a78bfa' : '#888888',
  fontWeight: 600,
  transition: 'all 0.2s ease',
  '&:hover': {
    background: 'rgba(139, 92, 246, 0.2)',
    borderColor: '#8b5cf6',
  }
}));

// Card Detail Modal
const CardDetailModal = styled(Dialog)({
  '& .MuiDialog-paper': {
    background: 'linear-gradient(180deg, #1a1028 0%, #0a0812 100%)',
    border: '2px solid rgba(212, 175, 55, 0.3)',
    borderRadius: '16px',
    maxWidth: '600px',
    width: '90%',
  }
});

const CardDetailContent = styled(DialogContent)({
  padding: '32px',
  color: '#e0e0e0',
});

interface DrawnCard extends TarotCard {
  isReversed: boolean;
  drawnAt: number;
}

interface TarotDeckProps {
  onCardDrawn?: (cards: DrawnCard[]) => void;
  onOpenReading?: (cards: DrawnCard[]) => void;
  onOpenLibrary?: () => void;
}

export const TarotDeck: React.FC<TarotDeckProps> = ({
  onCardDrawn,
  onOpenReading,
  onOpenLibrary
}) => {
  const [deck, setDeck] = useState<TarotCard[]>(completeTarotDeck);
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [selectedCard, setSelectedCard] = useState<DrawnCard | null>(null);
  const [drawCount, setDrawCount] = useState(1);
  const [isFlipping, setIsFlipping] = useState(false);

  const handleShuffle = useCallback(() => {
    setIsShuffling(true);
    setDrawnCards([]);

    setTimeout(() => {
      setDeck(shuffleDeck(completeTarotDeck));
      setIsShuffling(false);
    }, 500);
  }, []);

  const handleDraw = useCallback(() => {
    if (isShuffling) return;

    setIsFlipping(true);
    const shuffled = shuffleDeck(deck);
    const drawn: DrawnCard[] = shuffled.slice(0, drawCount).map((card, index) => ({
      ...card,
      isReversed: Math.random() > 0.5,
      drawnAt: Date.now() + index,
    }));

    setDrawnCards(drawn);
    setDeck(shuffled.slice(drawCount));

    if (onCardDrawn) {
      onCardDrawn(drawn);
    }

    setTimeout(() => setIsFlipping(false), 600);
  }, [deck, drawCount, isShuffling, onCardDrawn]);

  const handleReset = useCallback(() => {
    setDeck(shuffleDeck(completeTarotDeck));
    setDrawnCards([]);
  }, []);

  const getSuitColor = (suit: Suit): string => {
    return suitInfo[suit]?.color || '#d4af37';
  };

  const getSuitSymbol = (suit: Suit): React.ReactNode => {
    switch (suit) {
      case 'major': return <Star size={40} />;
      case 'wands': return <Sparkles size={40} />;
      case 'cups': return <Moon size={40} />;
      case 'swords': return <Eye size={40} />;
      case 'pentacles': return <Star size={40} />;
      default: return <Star size={40} />;
    }
  };

  const remainingCards = deck.length;

  return (
    <DeckContainer>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <DeckTitle>
          <Moon size={36} style={{ marginRight: '12px', verticalAlign: 'middle', color: '#d4af37' }} />
          Mystic Tarot
        </DeckTitle>
        <Typography sx={{ color: '#9080a0', fontStyle: 'italic' }}>
          Let the cards reveal what the shadows conceal
        </Typography>
      </Box>

      {/* Deck Stack */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <DeckStack isShuffling={isShuffling} onClick={handleDraw}>
          {[4, 3, 2, 1, 0].map((index) => (
            <StackedCard key={index} index={index}>
              <CardBackDesign>
                <MysticSymbol>
                  <Moon size={32} color="#d4af37" />
                </MysticSymbol>
              </CardBackDesign>
            </StackedCard>
          ))}
        </DeckStack>

        <Typography sx={{ color: '#888888', fontSize: '0.9rem', mb: 2 }}>
          {remainingCards} cards remaining in deck
        </Typography>

        <Typography sx={{ color: '#a78bfa', fontSize: '0.85rem', fontStyle: 'italic' }}>
          Click the deck or "Draw Cards" to reveal
        </Typography>
      </Box>

      {/* Controls */}
      <ControlsBar>
        <DrawCountSelector>
          <Typography sx={{ color: '#888888', mr: 1 }}>Draw:</Typography>
          {[1, 3, 5, 10].map(count => (
            <CountButton
              key={count}
              active={drawCount === count}
              onClick={() => setDrawCount(count)}
            >
              {count}
            </CountButton>
          ))}
        </DrawCountSelector>
      </ControlsBar>

      <ControlsBar>
        <GothicButton
          variant="primary"
          startIcon={<Eye size={18} />}
          onClick={handleDraw}
          disabled={isShuffling || remainingCards < drawCount}
        >
          Draw {drawCount} Card{drawCount > 1 ? 's' : ''}
        </GothicButton>

        <GothicButton
          variant="secondary"
          startIcon={<Shuffle size={18} />}
          onClick={handleShuffle}
          disabled={isShuffling}
        >
          Shuffle Deck
        </GothicButton>

        <GothicButton
          variant="ghost"
          startIcon={<RotateCcw size={18} />}
          onClick={handleReset}
        >
          Reset
        </GothicButton>

        {onOpenLibrary && (
          <GothicButton
            variant="ghost"
            startIcon={<BookOpen size={18} />}
            onClick={onOpenLibrary}
          >
            Card Library
          </GothicButton>
        )}
      </ControlsBar>

      {/* Drawn Cards Display */}
      {drawnCards.length > 0 && (
        <GothicCard variant="glass" sx={{ mb: 4 }}>
          <Typography sx={{
            color: '#d4af37',
            fontFamily: '"Cinzel", serif',
            fontSize: '1.3rem',
            textAlign: 'center',
            mb: 3
          }}>
            <Sparkles size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Cards Drawn
          </Typography>

          <DrawnCardsArea>
            {drawnCards.map((card, index) => {
              const suitColor = getSuitColor(card.suit);
              return (
                <CardFront
                  key={card.drawnAt}
                  suitColor={suitColor}
                  isReversed={card.isReversed}
                  isFlipping={isFlipping}
                  dealDelay={index * 100}
                  onClick={() => setSelectedCard(card)}
                >
                  <CardNumber suitColor={suitColor}>
                    {card.suit === 'major' ? card.number :
                     card.number <= 10 ? card.number :
                     card.number === 11 ? 'P' :
                     card.number === 12 ? 'Kn' :
                     card.number === 13 ? 'Q' : 'K'}
                  </CardNumber>

                  <CardTitle>{card.name}</CardTitle>

                  <CardImagePlaceholder suitColor={suitColor}>
                    {getSuitSymbol(card.suit)}
                  </CardImagePlaceholder>

                  <CardSuit suitColor={suitColor}>
                    {suitInfo[card.suit]?.name || card.suit}
                    {card.isReversed && ' (Reversed)'}
                  </CardSuit>
                </CardFront>
              );
            })}
          </DrawnCardsArea>

          {onOpenReading && drawnCards.length >= 3 && (
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <GothicButton
                variant="primary"
                startIcon={<BookOpen size={18} />}
                onClick={() => onOpenReading(drawnCards)}
              >
                Get Full Reading
              </GothicButton>
            </Box>
          )}
        </GothicCard>
      )}

      {/* Quick Reference */}
      <GothicCard variant="elevated" sx={{ maxWidth: '800px', mx: 'auto' }}>
        <Typography sx={{
          color: '#d4af37',
          fontFamily: '"Cinzel", serif',
          fontSize: '1.1rem',
          mb: 2
        }}>
          The Suits of the Tarot
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
          {Object.entries(suitInfo).map(([key, info]) => (
            <Box
              key={key}
              sx={{
                p: 2,
                borderRadius: '12px',
                background: `${info.color}10`,
                border: `1px solid ${info.color}30`,
                minWidth: '140px',
                textAlign: 'center'
              }}
            >
              <Typography sx={{ color: info.color, fontWeight: 600, mb: 0.5 }}>
                {info.name}
              </Typography>
              <Typography sx={{ color: '#888888', fontSize: '0.75rem', textTransform: 'capitalize' }}>
                {info.element}
              </Typography>
            </Box>
          ))}
        </Box>
      </GothicCard>

      {/* Card Detail Modal */}
      <CardDetailModal open={!!selectedCard} onClose={() => setSelectedCard(null)}>
        {selectedCard && (
          <CardDetailContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
              <Box>
                <Typography sx={{
                  fontFamily: '"Cinzel", serif',
                  fontSize: '1.8rem',
                  color: getSuitColor(selectedCard.suit),
                  mb: 0.5
                }}>
                  {selectedCard.name}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip
                    label={suitInfo[selectedCard.suit]?.name || selectedCard.suit}
                    size="small"
                    sx={{
                      background: `${getSuitColor(selectedCard.suit)}20`,
                      color: getSuitColor(selectedCard.suit),
                      border: `1px solid ${getSuitColor(selectedCard.suit)}40`
                    }}
                  />
                  {selectedCard.isReversed && (
                    <Chip
                      label="Reversed"
                      size="small"
                      sx={{
                        background: 'rgba(239, 68, 68, 0.2)',
                        color: '#ef4444',
                        border: '1px solid rgba(239, 68, 68, 0.4)'
                      }}
                    />
                  )}
                </Box>
              </Box>
              <IconButton onClick={() => setSelectedCard(null)} sx={{ color: '#888888' }}>
                <X size={24} />
              </IconButton>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography sx={{ color: '#a78bfa', fontWeight: 600, mb: 1 }}>
                {selectedCard.isReversed ? 'Reversed Meaning' : 'Upright Meaning'}
              </Typography>
              <Typography sx={{ color: '#d0d0d0', lineHeight: 1.6 }}>
                {selectedCard.isReversed ? selectedCard.reversedMeaning : selectedCard.uprightMeaning}
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography sx={{ color: '#d4af37', fontWeight: 600, mb: 1 }}>
                Gothic Description
              </Typography>
              <Typography sx={{ color: '#9080a0', fontStyle: 'italic', lineHeight: 1.6 }}>
                {selectedCard.gothicDescription}
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography sx={{ color: '#a78bfa', fontWeight: 600, mb: 1 }}>
                Symbolism
              </Typography>
              <Typography sx={{ color: '#d0d0d0', lineHeight: 1.6 }}>
                {selectedCard.symbolism}
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography sx={{ color: '#10b981', fontWeight: 600, mb: 1 }}>
                Advice
              </Typography>
              <Typography sx={{ color: '#d0d0d0', lineHeight: 1.6 }}>
                {selectedCard.advice}
              </Typography>
            </Box>

            <Box>
              <Typography sx={{ color: '#888888', fontWeight: 600, mb: 1 }}>
                Keywords
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selectedCard.keywords.map((keyword, i) => (
                  <KeywordChip
                    key={i}
                    label={keyword}
                    suitColor={getSuitColor(selectedCard.suit)}
                    size="small"
                  />
                ))}
              </Box>
            </Box>
          </CardDetailContent>
        )}
      </CardDetailModal>
    </DeckContainer>
  );
};

export default TarotDeck;
