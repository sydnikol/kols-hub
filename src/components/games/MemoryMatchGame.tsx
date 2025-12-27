// Memory Match Game Component
// A gothic-themed memory matching game with 8 pairs of cards

import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { ArrowLeft, RotateCcw, Trophy, Clock, MousePointer2, Sparkles } from 'lucide-react';
import { GothicCard } from '../gothic/GothicCard';
import { GothicButton } from '../gothic/GothicButton';

// Keyframes
const flipIn = keyframes`
  0% { transform: rotateY(0deg); }
  100% { transform: rotateY(180deg); }
`;

const flipOut = keyframes`
  0% { transform: rotateY(180deg); }
  100% { transform: rotateY(0deg); }
`;

const sparkle = keyframes`
  0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
  50% { opacity: 1; transform: scale(1) rotate(180deg); }
`;

const victoryGlow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(212, 175, 55, 0.4); }
  50% { box-shadow: 0 0 60px rgba(212, 175, 55, 0.8); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

// Styled components
const GameContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #0a0812 0%, #1a1028 50%, #0a0812 100%)',
  padding: '32px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const Header = styled(Box)({
  width: '100%',
  maxWidth: '600px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '24px',
});

const StatsBar = styled(Box)({
  display: 'flex',
  gap: '24px',
  justifyContent: 'center',
  marginBottom: '32px',
});

const StatItem = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '12px 20px',
  background: 'rgba(20, 20, 30, 0.8)',
  borderRadius: '12px',
  border: '1px solid rgba(139, 92, 246, 0.3)',
});

const CardGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '16px',
  maxWidth: '500px',
  width: '100%',
});

const MemoryCard = styled(Box)<{ isFlipped: boolean; isMatched: boolean }>(
  ({ isFlipped, isMatched }) => ({
    width: '100%',
    aspectRatio: '1',
    perspective: '1000px',
    cursor: isMatched ? 'default' : 'pointer',
    '& .card-inner': {
      position: 'relative',
      width: '100%',
      height: '100%',
      transformStyle: 'preserve-3d',
      transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
      transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
    },
    '& .card-face': {
      position: 'absolute',
      width: '100%',
      height: '100%',
      backfaceVisibility: 'hidden',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '3rem',
      border: '2px solid',
      transition: 'all 0.3s ease',
    },
    '& .card-front': {
      background: 'linear-gradient(135deg, #1a1028 0%, #2d1f4a 100%)',
      borderColor: isMatched ? '#d4af37' : 'rgba(139, 92, 246, 0.5)',
      boxShadow: isMatched
        ? '0 0 20px rgba(212, 175, 55, 0.5)'
        : '0 4px 20px rgba(0, 0, 0, 0.4)',
      '&::before': {
        content: '"?"',
        fontSize: '2.5rem',
        color: 'rgba(139, 92, 246, 0.6)',
        fontFamily: '"Cinzel", serif',
        fontWeight: 700,
      },
    },
    '& .card-back': {
      background: isMatched
        ? 'linear-gradient(135deg, #2d2a1a 0%, #3d3520 100%)'
        : 'linear-gradient(135deg, #1a1028 0%, #2d1f4a 100%)',
      borderColor: isMatched ? '#d4af37' : '#8b5cf6',
      transform: 'rotateY(180deg)',
      boxShadow: isMatched
        ? '0 0 30px rgba(212, 175, 55, 0.6)'
        : '0 8px 30px rgba(139, 92, 246, 0.3)',
    },
    '&:hover .card-front': {
      borderColor: isMatched ? '#d4af37' : '#a78bfa',
      transform: isMatched ? 'none' : 'scale(1.02)',
    },
  })
);

const VictoryOverlay = styled(Box)({
  position: 'fixed',
  inset: 0,
  background: 'rgba(10, 8, 18, 0.95)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
});

const VictoryCard = styled(GothicCard)({
  maxWidth: '400px',
  textAlign: 'center',
  animation: `${victoryGlow} 2s ease-in-out infinite`,
});

const SparkleEffect = styled(Box)({
  position: 'absolute',
  width: '20px',
  height: '20px',
  animation: `${sparkle} 1.5s ease-in-out infinite`,
  '&::before': {
    content: '"*"',
    fontSize: '24px',
    color: '#d4af37',
  },
});

const TrophyIcon = styled(Box)({
  animation: `${float} 2s ease-in-out infinite`,
  marginBottom: '16px',
});

// Card symbols
const SYMBOLS = ['🌙', '🔮', '🕯️', '🦇', '🕸️', '⚰️', '🗝️', '💀'];

interface Card {
  id: number;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface MemoryMatchGameProps {
  onBack: () => void;
}

const STORAGE_KEY = 'memoryMatchHighScore';

export const MemoryMatchGame: React.FC<MemoryMatchGameProps> = ({ onBack }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVictory, setIsVictory] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  // Initialize game
  const initializeGame = useCallback(() => {
    const shuffledSymbols = [...SYMBOLS, ...SYMBOLS]
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({
        id: index,
        symbol,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffledSymbols);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setSeconds(0);
    setIsPlaying(false);
    setIsVictory(false);
    setIsLocked(false);
  }, []);

  // Load high score
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setHighScore(parseInt(saved, 10));
    }
    initializeGame();
  }, [initializeGame]);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !isVictory) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isVictory]);

  // Calculate score
  const calculateScore = () => {
    const score = Math.max(0, 1000 - moves * 10 - seconds * 2);
    return score;
  };

  // Handle card click
  const handleCardClick = (cardId: number) => {
    if (isLocked) return;

    const card = cards.find((c) => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;
    if (flippedCards.length >= 2) return;

    // Start game on first click
    if (!isPlaying) {
      setIsPlaying(true);
    }

    // Flip the card
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c))
    );

    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);

    // Check for match when two cards are flipped
    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      setIsLocked(true);

      const [first, second] = newFlipped;
      const firstCard = cards.find((c) => c.id === first);
      const secondCard = cards.find((c) => c.id === second);

      if (firstCard && secondCard && firstCard.symbol === secondCard.symbol) {
        // Match found
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === first || c.id === second
                ? { ...c, isMatched: true }
                : c
            )
          );
          setMatches((m) => {
            const newMatches = m + 1;
            if (newMatches === 8) {
              // Victory!
              const finalScore = Math.max(0, 1000 - (moves + 1) * 10 - seconds * 2);
              if (finalScore > highScore) {
                setHighScore(finalScore);
                localStorage.setItem(STORAGE_KEY, finalScore.toString());
              }
              setIsVictory(true);
            }
            return newMatches;
          });
          setFlippedCards([]);
          setIsLocked(false);
        }, 500);
      } else {
        // No match - flip back
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === first || c.id === second
                ? { ...c, isFlipped: false }
                : c
            )
          );
          setFlippedCards([]);
          setIsLocked(false);
        }, 1000);
      }
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  return (
    <GameContainer>
      {/* Header */}
      <Header>
        <GothicButton variant="ghost" onClick={onBack} startIcon={<ArrowLeft size={18} />}>
          Back
        </GothicButton>
        <Typography
          sx={{
            fontFamily: '"Cinzel", serif',
            fontSize: '1.8rem',
            color: '#a855f7',
            textShadow: '0 0 20px rgba(168, 85, 247, 0.4)',
          }}
        >
          Memory Match
        </Typography>
        <GothicButton variant="secondary" onClick={initializeGame} startIcon={<RotateCcw size={18} />}>
          Reset
        </GothicButton>
      </Header>

      {/* Stats */}
      <StatsBar>
        <StatItem>
          <MousePointer2 size={20} color="#8b5cf6" />
          <Box>
            <Typography sx={{ color: '#888', fontSize: '0.75rem' }}>Moves</Typography>
            <Typography sx={{ color: '#e0e0e0', fontWeight: 600 }}>{moves}</Typography>
          </Box>
        </StatItem>
        <StatItem>
          <Clock size={20} color="#10b981" />
          <Box>
            <Typography sx={{ color: '#888', fontSize: '0.75rem' }}>Time</Typography>
            <Typography sx={{ color: '#e0e0e0', fontWeight: 600 }}>{formatTime(seconds)}</Typography>
          </Box>
        </StatItem>
        <StatItem>
          <Sparkles size={20} color="#d4af37" />
          <Box>
            <Typography sx={{ color: '#888', fontSize: '0.75rem' }}>Matches</Typography>
            <Typography sx={{ color: '#e0e0e0', fontWeight: 600 }}>{matches}/8</Typography>
          </Box>
        </StatItem>
        <StatItem>
          <Trophy size={20} color="#f97316" />
          <Box>
            <Typography sx={{ color: '#888', fontSize: '0.75rem' }}>High Score</Typography>
            <Typography sx={{ color: '#e0e0e0', fontWeight: 600 }}>{highScore}</Typography>
          </Box>
        </StatItem>
      </StatsBar>

      {/* Card Grid */}
      <CardGrid>
        {cards.map((card) => (
          <MemoryCard
            key={card.id}
            isFlipped={card.isFlipped || card.isMatched}
            isMatched={card.isMatched}
            onClick={() => handleCardClick(card.id)}
          >
            <div className="card-inner">
              <div className="card-face card-front" />
              <div className="card-face card-back">{card.symbol}</div>
            </div>
          </MemoryCard>
        ))}
      </CardGrid>

      {/* Current Score Display */}
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography sx={{ color: '#888', fontSize: '0.9rem' }}>
          Current Score: <span style={{ color: '#d4af37', fontWeight: 600 }}>{calculateScore()}</span>
        </Typography>
      </Box>

      {/* Victory Overlay */}
      {isVictory && (
        <VictoryOverlay>
          <VictoryCard variant="elevated" ornate>
            {/* Sparkle effects */}
            <SparkleEffect sx={{ top: '10%', left: '10%', animationDelay: '0s' }} />
            <SparkleEffect sx={{ top: '20%', right: '15%', animationDelay: '0.3s' }} />
            <SparkleEffect sx={{ bottom: '30%', left: '20%', animationDelay: '0.6s' }} />
            <SparkleEffect sx={{ bottom: '15%', right: '10%', animationDelay: '0.9s' }} />

            <TrophyIcon>
              <Trophy size={64} color="#d4af37" />
            </TrophyIcon>

            <Typography
              sx={{
                fontFamily: '"Cinzel", serif',
                fontSize: '2rem',
                color: '#d4af37',
                mb: 2,
                textShadow: '0 0 20px rgba(212, 175, 55, 0.5)',
              }}
            >
              Victory!
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography sx={{ color: '#888', mb: 1 }}>Final Score</Typography>
              <Typography
                sx={{
                  fontSize: '3rem',
                  fontWeight: 700,
                  color: '#e0e0e0',
                  textShadow: '0 0 10px rgba(139, 92, 246, 0.5)',
                }}
              >
                {calculateScore()}
              </Typography>
            </Box>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6}>
                <Typography sx={{ color: '#888', fontSize: '0.85rem' }}>Moves</Typography>
                <Typography sx={{ color: '#8b5cf6', fontSize: '1.2rem', fontWeight: 600 }}>{moves}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography sx={{ color: '#888', fontSize: '0.85rem' }}>Time</Typography>
                <Typography sx={{ color: '#10b981', fontSize: '1.2rem', fontWeight: 600 }}>{formatTime(seconds)}</Typography>
              </Grid>
            </Grid>

            {calculateScore() >= highScore && (
              <Typography
                sx={{
                  color: '#d4af37',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  mb: 2,
                }}
              >
                New High Score!
              </Typography>
            )}

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <GothicButton variant="primary" onClick={initializeGame} startIcon={<RotateCcw size={18} />}>
                Play Again
              </GothicButton>
              <GothicButton variant="ghost" onClick={onBack} startIcon={<ArrowLeft size={18} />}>
                Back to Hub
              </GothicButton>
            </Box>
          </VictoryCard>
        </VictoryOverlay>
      )}
    </GameContainer>
  );
};

export default MemoryMatchGame;
