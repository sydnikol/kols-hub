// Tarot Solitaire Game Component
// Classic solitaire with tarot-themed Major Arcana cards

import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { ArrowLeft, RotateCcw, Trophy, Clock, MousePointer2, Sparkles, Shuffle } from 'lucide-react';
import { GothicCard } from '../gothic/GothicCard';
import { GothicButton } from '../gothic/GothicButton';

// Keyframes
const cardGlow = keyframes`
  0%, 100% { box-shadow: 0 4px 20px rgba(212, 175, 55, 0.3); }
  50% { box-shadow: 0 8px 40px rgba(212, 175, 55, 0.6); }
`;

const victoryGlow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(212, 175, 55, 0.4); }
  50% { box-shadow: 0 0 60px rgba(212, 175, 55, 0.8); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const sparkle = keyframes`
  0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
  50% { opacity: 1; transform: scale(1) rotate(180deg); }
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
  maxWidth: '900px',
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
  flexWrap: 'wrap',
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

const GameBoard = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  alignItems: 'center',
  width: '100%',
  maxWidth: '900px',
});

const ColumnsContainer = styled(Box)({
  display: 'flex',
  gap: '16px',
  justifyContent: 'center',
  width: '100%',
});

const Column = styled(Box)<{ isHighlighted: boolean }>(({ isHighlighted }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '-60px',
  minHeight: '400px',
  padding: '12px',
  background: isHighlighted ? 'rgba(212, 175, 55, 0.1)' : 'rgba(20, 20, 30, 0.4)',
  borderRadius: '12px',
  border: isHighlighted ? '2px solid rgba(212, 175, 55, 0.5)' : '2px dashed rgba(139, 92, 246, 0.3)',
  minWidth: '140px',
  transition: 'all 0.3s ease',
}));

const TarotCard = styled(Box)<{ isSelected: boolean; isCorrectPosition: boolean }>(
  ({ isSelected, isCorrectPosition }) => ({
    width: '120px',
    height: '180px',
    borderRadius: '12px',
    background: isCorrectPosition
      ? 'linear-gradient(135deg, #2d2a1a 0%, #3d3520 100%)'
      : 'linear-gradient(135deg, #1a1028 0%, #2d1f4a 100%)',
    border: `2px solid ${
      isSelected ? '#d4af37' : isCorrectPosition ? '#10b981' : 'rgba(139, 92, 246, 0.5)'
    }`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative',
    marginTop: '-60px',
    '&:first-of-type': {
      marginTop: 0,
    },
    boxShadow: isSelected
      ? '0 8px 30px rgba(212, 175, 55, 0.5)'
      : isCorrectPosition
      ? '0 4px 20px rgba(16, 185, 129, 0.3)'
      : '0 4px 15px rgba(0, 0, 0, 0.4)',
    animation: isCorrectPosition ? `${cardGlow} 2s ease-in-out infinite` : 'none',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 12px 40px rgba(212, 175, 55, 0.4)',
      zIndex: 10,
    },
  })
);

const CardNumber = styled(Typography)({
  position: 'absolute',
  top: '8px',
  left: '12px',
  fontFamily: '"Cinzel", serif',
  fontSize: '1rem',
  fontWeight: 700,
  color: '#d4af37',
});

const CardEmoji = styled(Typography)({
  fontSize: '2.5rem',
  marginBottom: '8px',
});

const CardName = styled(Typography)({
  fontFamily: '"Cinzel", serif',
  fontSize: '0.7rem',
  color: '#e0e0e0',
  textAlign: 'center',
  padding: '0 8px',
  maxWidth: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const FoundationArea = styled(Box)({
  display: 'flex',
  gap: '8px',
  justifyContent: 'center',
  flexWrap: 'wrap',
  padding: '16px',
  background: 'rgba(20, 20, 30, 0.6)',
  borderRadius: '12px',
  border: '1px solid rgba(16, 185, 129, 0.3)',
});

const FoundationCard = styled(Box)<{ filled: boolean }>(({ filled }) => ({
  width: '50px',
  height: '70px',
  borderRadius: '8px',
  background: filled
    ? 'linear-gradient(135deg, #2d2a1a 0%, #3d3520 100%)'
    : 'rgba(20, 20, 30, 0.4)',
  border: `1px solid ${filled ? '#d4af37' : 'rgba(139, 92, 246, 0.3)'}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.5rem',
  transition: 'all 0.3s ease',
}));

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

// Major Arcana cards data
const MAJOR_ARCANA = [
  { number: 0, name: 'The Fool', emoji: '🃏' },
  { number: 1, name: 'Magician', emoji: '🎩' },
  { number: 2, name: 'High Priestess', emoji: '🌙' },
  { number: 3, name: 'Empress', emoji: '👑' },
  { number: 4, name: 'Emperor', emoji: '⚔️' },
  { number: 5, name: 'Hierophant', emoji: '📿' },
  { number: 6, name: 'Lovers', emoji: '💕' },
  { number: 7, name: 'Chariot', emoji: '🏇' },
  { number: 8, name: 'Strength', emoji: '🦁' },
  { number: 9, name: 'Hermit', emoji: '🏮' },
  { number: 10, name: 'Wheel', emoji: '☸️' },
  { number: 11, name: 'Justice', emoji: '⚖️' },
  { number: 12, name: 'Hanged Man', emoji: '🙃' },
  { number: 13, name: 'Death', emoji: '💀' },
  { number: 14, name: 'Temperance', emoji: '🏺' },
  { number: 15, name: 'Devil', emoji: '😈' },
  { number: 16, name: 'Tower', emoji: '🗼' },
  { number: 17, name: 'Star', emoji: '⭐' },
  { number: 18, name: 'Moon', emoji: '🌕' },
  { number: 19, name: 'Sun', emoji: '☀️' },
  { number: 20, name: 'Judgement', emoji: '📯' },
  { number: 21, name: 'World', emoji: '🌍' },
];

interface TarotCardData {
  id: string;
  number: number;
  name: string;
  emoji: string;
}

interface TarotSolitaireGameProps {
  onBack: () => void;
}

const STORAGE_KEY = 'tarotSolitaireHighScore';

export const TarotSolitaireGame: React.FC<TarotSolitaireGameProps> = ({ onBack }) => {
  const [columns, setColumns] = useState<TarotCardData[][]>([[], [], []]);
  const [selectedCard, setSelectedCard] = useState<{ columnIndex: number; cardIndex: number } | null>(null);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVictory, setIsVictory] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [completedCards, setCompletedCards] = useState<number[]>([]);

  // Initialize game
  const initializeGame = useCallback(() => {
    // Create shuffled deck
    const deck: TarotCardData[] = MAJOR_ARCANA.map((card, index) => ({
      id: `card-${index}`,
      ...card,
    })).sort(() => Math.random() - 0.5);

    // Deal cards to 3 columns (7 cards each, 1 remaining)
    const newColumns: TarotCardData[][] = [
      deck.slice(0, 7),
      deck.slice(7, 14),
      deck.slice(14, 21),
    ];
    // Add the last card to the first column
    newColumns[0].push(deck[21]);

    setColumns(newColumns);
    setSelectedCard(null);
    setMoves(0);
    setSeconds(0);
    setIsPlaying(false);
    setIsVictory(false);
    setCompletedCards([]);
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

  // Check for victory
  useEffect(() => {
    // Victory when all cards are in correct sequential order
    // Check if all columns have cards in ascending order
    let allCorrect = true;
    let allCardsOrdered: number[] = [];

    columns.forEach((column) => {
      column.forEach((card) => {
        allCardsOrdered.push(card.number);
      });
    });

    // Check if sorted
    const sortedCards = [...allCardsOrdered].sort((a, b) => a - b);

    // Check if columns are in sequence
    let currentExpected = 0;
    for (const column of columns) {
      for (const card of column) {
        if (card.number !== currentExpected) {
          allCorrect = false;
          break;
        }
        currentExpected++;
      }
      if (!allCorrect) break;
    }

    if (allCorrect && allCardsOrdered.length === 22) {
      const finalScore = calculateScore();
      if (finalScore > highScore) {
        setHighScore(finalScore);
        localStorage.setItem(STORAGE_KEY, finalScore.toString());
      }
      setIsVictory(true);
      setIsPlaying(false);
    }
  }, [columns]);

  // Calculate score
  const calculateScore = () => {
    const baseScore = 5000;
    const movePenalty = moves * 20;
    const timePenalty = seconds * 5;
    return Math.max(0, baseScore - movePenalty - timePenalty);
  };

  // Check if a card is in correct position
  const isCardInCorrectPosition = (columnIndex: number, cardIndex: number): boolean => {
    let expectedNumber = 0;
    for (let c = 0; c < columnIndex; c++) {
      expectedNumber += columns[c].length;
    }
    expectedNumber += cardIndex;
    return columns[columnIndex][cardIndex]?.number === expectedNumber;
  };

  // Handle card click
  const handleCardClick = (columnIndex: number, cardIndex: number) => {
    if (!isPlaying) {
      setIsPlaying(true);
    }

    const clickedCard = columns[columnIndex][cardIndex];

    // Only allow selecting the top card of a column (last card in array)
    if (cardIndex !== columns[columnIndex].length - 1) {
      return;
    }

    if (selectedCard === null) {
      // Select this card
      setSelectedCard({ columnIndex, cardIndex });
    } else if (
      selectedCard.columnIndex === columnIndex &&
      selectedCard.cardIndex === cardIndex
    ) {
      // Deselect
      setSelectedCard(null);
    } else {
      // Try to move selected card to this column
      const sourceColumn = columns[selectedCard.columnIndex];
      const targetColumn = columns[columnIndex];
      const movingCard = sourceColumn[selectedCard.cardIndex];
      const targetCard = targetColumn[targetColumn.length - 1];

      // Move is valid if: moving card is one number away from target card
      // OR if target column is empty and we're moving any card
      const canMove =
        targetColumn.length === 0 ||
        Math.abs(movingCard.number - targetCard.number) === 1;

      if (canMove) {
        // Perform move
        const newColumns = [...columns];
        newColumns[selectedCard.columnIndex] = sourceColumn.slice(0, -1);
        newColumns[columnIndex] = [...targetColumn, movingCard];
        setColumns(newColumns);
        setMoves((m) => m + 1);
      }

      setSelectedCard(null);
    }
  };

  // Handle column click (for empty columns)
  const handleColumnClick = (columnIndex: number) => {
    if (columns[columnIndex].length > 0 || selectedCard === null) return;

    // Move card to empty column
    const sourceColumn = columns[selectedCard.columnIndex];
    const movingCard = sourceColumn[selectedCard.cardIndex];

    const newColumns = [...columns];
    newColumns[selectedCard.columnIndex] = sourceColumn.slice(0, -1);
    newColumns[columnIndex] = [movingCard];
    setColumns(newColumns);
    setMoves((m) => m + 1);
    setSelectedCard(null);
  };

  // Format time
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  // Count cards in correct position
  const correctCount = (): number => {
    let count = 0;
    let expected = 0;
    for (const column of columns) {
      for (const card of column) {
        if (card.number === expected) {
          count++;
        }
        expected++;
      }
    }
    return count;
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
            color: '#d4af37',
            textShadow: '0 0 20px rgba(212, 175, 55, 0.4)',
          }}
        >
          Tarot Solitaire
        </Typography>
        <GothicButton variant="secondary" onClick={initializeGame} startIcon={<RotateCcw size={18} />}>
          New Game
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
            <Typography sx={{ color: '#888', fontSize: '0.75rem' }}>In Position</Typography>
            <Typography sx={{ color: '#e0e0e0', fontWeight: 600 }}>{correctCount()}/22</Typography>
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

      {/* Instructions */}
      <Typography sx={{ color: '#888', fontSize: '0.85rem', mb: 3, textAlign: 'center' }}>
        Arrange cards 0-21 in order across columns. Move top cards to adjacent numbers.
      </Typography>

      <GameBoard>
        {/* Columns */}
        <ColumnsContainer>
          {columns.map((column, columnIndex) => (
            <Column
              key={columnIndex}
              isHighlighted={selectedCard !== null}
              onClick={() => handleColumnClick(columnIndex)}
            >
              {column.length === 0 ? (
                <Box
                  sx={{
                    width: '120px',
                    height: '180px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#555',
                    fontStyle: 'italic',
                  }}
                >
                  Empty
                </Box>
              ) : (
                column.map((card, cardIndex) => (
                  <TarotCard
                    key={card.id}
                    isSelected={
                      selectedCard?.columnIndex === columnIndex &&
                      selectedCard?.cardIndex === cardIndex
                    }
                    isCorrectPosition={isCardInCorrectPosition(columnIndex, cardIndex)}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick(columnIndex, cardIndex);
                    }}
                  >
                    <CardNumber>{card.number}</CardNumber>
                    <CardEmoji>{card.emoji}</CardEmoji>
                    <CardName>{card.name}</CardName>
                  </TarotCard>
                ))
              )}
            </Column>
          ))}
        </ColumnsContainer>

        {/* Foundation Progress */}
        <Box sx={{ mt: 3 }}>
          <Typography sx={{ color: '#888', fontSize: '0.85rem', mb: 2, textAlign: 'center' }}>
            Major Arcana Sequence (0-21)
          </Typography>
          <FoundationArea>
            {MAJOR_ARCANA.map((card) => {
              // Check if this card is in correct position
              let inCorrectPos = false;
              let expected = 0;
              for (const column of columns) {
                for (const c of column) {
                  if (c.number === expected && c.number === card.number) {
                    inCorrectPos = true;
                  }
                  expected++;
                }
              }
              // Actually check if this specific card number is at its expected position
              let pos = 0;
              outer: for (const column of columns) {
                for (const c of column) {
                  if (pos === card.number && c.number === card.number) {
                    inCorrectPos = true;
                    break outer;
                  }
                  pos++;
                }
              }
              return (
                <FoundationCard key={card.number} filled={inCorrectPos}>
                  {inCorrectPos ? card.emoji : card.number}
                </FoundationCard>
              );
            })}
          </FoundationArea>
        </Box>
      </GameBoard>

      {/* Current Score */}
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
              The World Awaits!
            </Typography>

            <Typography sx={{ color: '#888', mb: 1 }}>
              You've completed the Major Arcana!
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography sx={{ color: '#888', mb: 1 }}>Final Score</Typography>
              <Typography
                sx={{
                  fontSize: '3rem',
                  fontWeight: 700,
                  color: '#e0e0e0',
                  textShadow: '0 0 10px rgba(212, 175, 55, 0.5)',
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

export default TarotSolitaireGame;
