// Crystal Match Game Component
// Match-3 puzzle game with crystal gems

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Box, Typography, Grid, LinearProgress } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { ArrowLeft, RotateCcw, Trophy, Clock, Sparkles, Zap } from 'lucide-react';
import { GothicCard } from '../gothic/GothicCard';
import { GothicButton } from '../gothic/GothicButton';

// Keyframes
const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const pop = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.3); opacity: 0.5; }
  100% { transform: scale(0); opacity: 0; }
`;

const drop = keyframes`
  0% { transform: translateY(-100px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
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

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
`;

const cascade = keyframes`
  0% { transform: scale(1) rotate(0deg); }
  25% { transform: scale(1.1) rotate(5deg); }
  50% { transform: scale(1.2) rotate(-5deg); }
  75% { transform: scale(1.1) rotate(5deg); }
  100% { transform: scale(1) rotate(0deg); }
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

const TimerDisplay = styled(Box)<{ urgent: boolean }>(({ urgent }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '12px 24px',
  background: urgent ? 'rgba(239, 68, 68, 0.2)' : 'rgba(20, 20, 30, 0.8)',
  borderRadius: '12px',
  border: `1px solid ${urgent ? 'rgba(239, 68, 68, 0.5)' : 'rgba(139, 92, 246, 0.3)'}`,
  animation: urgent ? `${pulse} 0.5s ease-in-out infinite` : 'none',
}));

const GameBoard = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(6, 1fr)',
  gap: '8px',
  padding: '16px',
  background: 'rgba(20, 20, 30, 0.6)',
  borderRadius: '16px',
  border: '2px solid rgba(139, 92, 246, 0.3)',
  boxShadow: '0 0 40px rgba(139, 92, 246, 0.2)',
});

const GemCell = styled(Box)<{
  isSelected: boolean;
  isMatched: boolean;
  isNew: boolean;
  cascadeBonus: boolean;
}>(({ isSelected, isMatched, isNew, cascadeBonus }) => ({
  width: '60px',
  height: '60px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '2.2rem',
  borderRadius: '12px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  background: isSelected
    ? 'rgba(212, 175, 55, 0.3)'
    : 'rgba(30, 30, 40, 0.6)',
  border: isSelected
    ? '3px solid #d4af37'
    : '2px solid rgba(139, 92, 246, 0.3)',
  boxShadow: isSelected
    ? '0 0 20px rgba(212, 175, 55, 0.5)'
    : '0 4px 15px rgba(0, 0, 0, 0.3)',
  animation: isMatched
    ? `${pop} 0.3s ease forwards`
    : isNew
    ? `${drop} 0.3s ease`
    : cascadeBonus
    ? `${cascade} 0.5s ease`
    : 'none',
  '&:hover': {
    transform: 'scale(1.1)',
    boxShadow: '0 0 15px rgba(139, 92, 246, 0.4)',
    borderColor: '#a78bfa',
  },
}));

const CascadeIndicator = styled(Box)({
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  padding: '16px 32px',
  background: 'rgba(212, 175, 55, 0.9)',
  borderRadius: '12px',
  animation: `${cascade} 0.5s ease`,
  zIndex: 100,
});

const ScorePopup = styled(Box)<{ x: number; y: number }>(({ x, y }) => ({
  position: 'absolute',
  left: x,
  top: y,
  color: '#d4af37',
  fontFamily: '"Cinzel", serif',
  fontWeight: 700,
  fontSize: '1.2rem',
  pointerEvents: 'none',
  animation: `${float} 1s ease forwards`,
  textShadow: '0 0 10px rgba(212, 175, 55, 0.5)',
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

// Gem types
const GEM_TYPES = ['💎', '🔮', '💠', '🌙', '⭐', '🔷'];

const GRID_SIZE = 6;
const GAME_DURATION = 60;

interface Gem {
  id: string;
  type: string;
  isMatched: boolean;
  isNew: boolean;
}

interface CrystalMatchGameProps {
  onBack: () => void;
}

const STORAGE_KEY = 'crystalMatchHighScore';

export const CrystalMatchGame: React.FC<CrystalMatchGameProps> = ({ onBack }) => {
  const [grid, setGrid] = useState<Gem[][]>([]);
  const [selectedGem, setSelectedGem] = useState<{ row: number; col: number } | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [cascadeCount, setCascadeCount] = useState(0);
  const [showCascade, setShowCascade] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [gemsCleared, setGemsCleared] = useState(0);

  // Generate random gem type
  const randomGem = (): Gem => ({
    id: `gem-${Date.now()}-${Math.random()}`,
    type: GEM_TYPES[Math.floor(Math.random() * GEM_TYPES.length)],
    isMatched: false,
    isNew: false,
  });

  // Initialize grid without matches
  const initializeGrid = useCallback((): Gem[][] => {
    const newGrid: Gem[][] = [];

    for (let row = 0; row < GRID_SIZE; row++) {
      newGrid[row] = [];
      for (let col = 0; col < GRID_SIZE; col++) {
        let gem = randomGem();

        // Avoid initial matches
        while (
          (col >= 2 &&
            newGrid[row][col - 1]?.type === gem.type &&
            newGrid[row][col - 2]?.type === gem.type) ||
          (row >= 2 &&
            newGrid[row - 1]?.[col]?.type === gem.type &&
            newGrid[row - 2]?.[col]?.type === gem.type)
        ) {
          gem = randomGem();
        }

        newGrid[row][col] = gem;
      }
    }

    return newGrid;
  }, []);

  // Initialize game
  const initializeGame = useCallback(() => {
    setGrid(initializeGrid());
    setSelectedGem(null);
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setIsPlaying(false);
    setIsGameOver(false);
    setCascadeCount(0);
    setIsProcessing(false);
    setGemsCleared(0);
  }, [initializeGrid]);

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
    if (isPlaying && timeLeft > 0 && !isGameOver) {
      interval = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            setIsPlaying(false);
            setIsGameOver(true);
            // Save high score
            if (score > highScore) {
              setHighScore(score);
              localStorage.setItem(STORAGE_KEY, score.toString());
            }
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, timeLeft, isGameOver, score, highScore]);

  // Check for matches in grid
  const findMatches = (currentGrid: Gem[][]): { row: number; col: number }[] => {
    const matches: { row: number; col: number }[] = [];

    // Check horizontal matches
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE - 2; col++) {
        const type = currentGrid[row][col]?.type;
        if (
          type &&
          currentGrid[row][col + 1]?.type === type &&
          currentGrid[row][col + 2]?.type === type
        ) {
          matches.push({ row, col });
          matches.push({ row, col: col + 1 });
          matches.push({ row, col: col + 2 });

          // Check for 4 or 5 match
          if (col + 3 < GRID_SIZE && currentGrid[row][col + 3]?.type === type) {
            matches.push({ row, col: col + 3 });
            if (col + 4 < GRID_SIZE && currentGrid[row][col + 4]?.type === type) {
              matches.push({ row, col: col + 4 });
            }
          }
        }
      }
    }

    // Check vertical matches
    for (let col = 0; col < GRID_SIZE; col++) {
      for (let row = 0; row < GRID_SIZE - 2; row++) {
        const type = currentGrid[row][col]?.type;
        if (
          type &&
          currentGrid[row + 1]?.[col]?.type === type &&
          currentGrid[row + 2]?.[col]?.type === type
        ) {
          matches.push({ row, col });
          matches.push({ row: row + 1, col });
          matches.push({ row: row + 2, col });

          // Check for 4 or 5 match
          if (row + 3 < GRID_SIZE && currentGrid[row + 3]?.[col]?.type === type) {
            matches.push({ row: row + 3, col });
            if (row + 4 < GRID_SIZE && currentGrid[row + 4]?.[col]?.type === type) {
              matches.push({ row: row + 4, col });
            }
          }
        }
      }
    }

    // Remove duplicates
    const uniqueMatches = matches.filter(
      (match, index, self) =>
        index === self.findIndex((m) => m.row === match.row && m.col === match.col)
    );

    return uniqueMatches;
  };

  // Calculate score for matches
  const calculateMatchScore = (matchCount: number, cascade: number): number => {
    let baseScore = 0;

    if (matchCount === 3) baseScore = 50;
    else if (matchCount === 4) baseScore = 100;
    else if (matchCount >= 5) baseScore = 200;
    else baseScore = matchCount * 20;

    // Cascade bonus
    const cascadeMultiplier = 1 + cascade * 0.5;

    return Math.floor(baseScore * cascadeMultiplier);
  };

  // Process matches and drop gems
  const processMatches = useCallback(async (currentGrid: Gem[][], currentCascade: number = 0) => {
    const matches = findMatches(currentGrid);

    if (matches.length === 0) {
      setIsProcessing(false);
      setCascadeCount(0);
      return currentGrid;
    }

    setIsProcessing(true);

    // Calculate and add score
    const matchScore = calculateMatchScore(matches.length, currentCascade);
    setScore((s) => s + matchScore);
    setGemsCleared((g) => g + matches.length);

    // Show cascade bonus
    if (currentCascade > 0) {
      setCascadeCount(currentCascade);
      setShowCascade(true);
      setTimeout(() => setShowCascade(false), 500);
    }

    // Mark matched gems
    const newGrid = currentGrid.map((row, rowIndex) =>
      row.map((gem, colIndex) => {
        const isMatched = matches.some((m) => m.row === rowIndex && m.col === colIndex);
        return isMatched ? { ...gem, isMatched: true } : gem;
      })
    );

    setGrid(newGrid);

    // Wait for animation
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Drop gems and fill
    const droppedGrid = dropGems(newGrid);
    setGrid(droppedGrid);

    // Wait for drop animation
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Clear isNew flags
    const clearedGrid = droppedGrid.map((row) =>
      row.map((gem) => ({ ...gem, isNew: false }))
    );

    // Check for chain reactions
    return processMatches(clearedGrid, currentCascade + 1);
  }, []);

  // Drop gems down and fill empty spaces
  const dropGems = (currentGrid: Gem[][]): Gem[][] => {
    const newGrid = currentGrid.map((row) => [...row]);

    for (let col = 0; col < GRID_SIZE; col++) {
      // Collect non-matched gems
      const column: (Gem | null)[] = [];
      for (let row = GRID_SIZE - 1; row >= 0; row--) {
        if (!newGrid[row][col].isMatched) {
          column.push(newGrid[row][col]);
        }
      }

      // Fill from bottom
      for (let row = GRID_SIZE - 1; row >= 0; row--) {
        const gemIndex = GRID_SIZE - 1 - row;
        if (gemIndex < column.length && column[gemIndex]) {
          newGrid[row][col] = column[gemIndex]!;
        } else {
          // Add new gem
          newGrid[row][col] = { ...randomGem(), isNew: true };
        }
      }
    }

    return newGrid;
  };

  // Check if two positions are adjacent
  const areAdjacent = (
    pos1: { row: number; col: number },
    pos2: { row: number; col: number }
  ): boolean => {
    const rowDiff = Math.abs(pos1.row - pos2.row);
    const colDiff = Math.abs(pos1.col - pos2.col);
    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
  };

  // Swap gems
  const swapGems = async (
    pos1: { row: number; col: number },
    pos2: { row: number; col: number }
  ) => {
    const newGrid = grid.map((row) => [...row]);
    const temp = newGrid[pos1.row][pos1.col];
    newGrid[pos1.row][pos1.col] = newGrid[pos2.row][pos2.col];
    newGrid[pos2.row][pos2.col] = temp;

    // Check if swap creates a match
    const matches = findMatches(newGrid);

    if (matches.length > 0) {
      setGrid(newGrid);
      await processMatches(newGrid);
    } else {
      // Invalid swap - swap back (with brief visual)
      setGrid(newGrid);
      await new Promise((resolve) => setTimeout(resolve, 200));
      setGrid(grid);
    }
  };

  // Handle gem click
  const handleGemClick = async (row: number, col: number) => {
    if (isProcessing || isGameOver) return;

    if (!isPlaying) {
      setIsPlaying(true);
    }

    if (selectedGem === null) {
      setSelectedGem({ row, col });
    } else if (selectedGem.row === row && selectedGem.col === col) {
      setSelectedGem(null);
    } else if (areAdjacent(selectedGem, { row, col })) {
      await swapGems(selectedGem, { row, col });
      setSelectedGem(null);
    } else {
      setSelectedGem({ row, col });
    }
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
            color: '#60a5fa',
            textShadow: '0 0 20px rgba(96, 165, 250, 0.4)',
          }}
        >
          Crystal Match
        </Typography>
        <GothicButton variant="secondary" onClick={initializeGame} startIcon={<RotateCcw size={18} />}>
          New Game
        </GothicButton>
      </Header>

      {/* Stats */}
      <StatsBar>
        <TimerDisplay urgent={timeLeft <= 10 && isPlaying}>
          <Clock size={20} color={timeLeft <= 10 ? '#ef4444' : '#10b981'} />
          <Box>
            <Typography sx={{ color: '#888', fontSize: '0.75rem' }}>Time</Typography>
            <Typography
              sx={{
                color: timeLeft <= 10 ? '#ef4444' : '#e0e0e0',
                fontWeight: 600,
                fontSize: '1.2rem',
              }}
            >
              {timeLeft}s
            </Typography>
          </Box>
        </TimerDisplay>
        <StatItem>
          <Sparkles size={20} color="#d4af37" />
          <Box>
            <Typography sx={{ color: '#888', fontSize: '0.75rem' }}>Score</Typography>
            <Typography sx={{ color: '#d4af37', fontWeight: 600, fontSize: '1.2rem' }}>{score}</Typography>
          </Box>
        </StatItem>
        <StatItem>
          <Zap size={20} color="#f97316" />
          <Box>
            <Typography sx={{ color: '#888', fontSize: '0.75rem' }}>Cleared</Typography>
            <Typography sx={{ color: '#e0e0e0', fontWeight: 600 }}>{gemsCleared}</Typography>
          </Box>
        </StatItem>
        <StatItem>
          <Trophy size={20} color="#a855f7" />
          <Box>
            <Typography sx={{ color: '#888', fontSize: '0.75rem' }}>High Score</Typography>
            <Typography sx={{ color: '#e0e0e0', fontWeight: 600 }}>{highScore}</Typography>
          </Box>
        </StatItem>
      </StatsBar>

      {/* Timer Progress Bar */}
      <Box sx={{ width: '100%', maxWidth: '400px', mb: 3 }}>
        <LinearProgress
          variant="determinate"
          value={(timeLeft / GAME_DURATION) * 100}
          sx={{
            height: 8,
            borderRadius: 4,
            background: 'rgba(20, 20, 30, 0.8)',
            '& .MuiLinearProgress-bar': {
              background:
                timeLeft <= 10
                  ? 'linear-gradient(90deg, #ef4444, #dc2626)'
                  : 'linear-gradient(90deg, #60a5fa, #3b82f6)',
              borderRadius: 4,
            },
          }}
        />
      </Box>

      {/* Game Board */}
      <GameBoard>
        {grid.map((row, rowIndex) =>
          row.map((gem, colIndex) => (
            <GemCell
              key={`${rowIndex}-${colIndex}-${gem.id}`}
              isSelected={selectedGem?.row === rowIndex && selectedGem?.col === colIndex}
              isMatched={gem.isMatched}
              isNew={gem.isNew}
              cascadeBonus={cascadeCount > 0 && !gem.isMatched}
              onClick={() => handleGemClick(rowIndex, colIndex)}
            >
              {gem.type}
            </GemCell>
          ))
        )}
      </GameBoard>

      {/* Cascade Indicator */}
      {showCascade && cascadeCount > 0 && (
        <CascadeIndicator>
          <Typography
            sx={{
              fontFamily: '"Cinzel", serif',
              fontSize: '1.5rem',
              color: '#1a1028',
              fontWeight: 700,
            }}
          >
            Cascade x{cascadeCount}!
          </Typography>
        </CascadeIndicator>
      )}

      {/* Instructions */}
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography sx={{ color: '#888', fontSize: '0.85rem' }}>
          Swap adjacent crystals to match 3 or more in a row/column
        </Typography>
        <Typography sx={{ color: '#666', fontSize: '0.75rem', mt: 1 }}>
          3-match = 50pts | 4-match = 100pts | 5-match = 200pts | Cascades give bonus!
        </Typography>
      </Box>

      {/* Game Over Overlay */}
      {isGameOver && (
        <VictoryOverlay>
          <VictoryCard variant="elevated" ornate>
            {/* Sparkle effects */}
            <SparkleEffect sx={{ top: '10%', left: '10%', animationDelay: '0s' }} />
            <SparkleEffect sx={{ top: '20%', right: '15%', animationDelay: '0.3s' }} />
            <SparkleEffect sx={{ bottom: '30%', left: '20%', animationDelay: '0.6s' }} />
            <SparkleEffect sx={{ bottom: '15%', right: '10%', animationDelay: '0.9s' }} />

            <TrophyIcon>
              <Trophy size={64} color="#60a5fa" />
            </TrophyIcon>

            <Typography
              sx={{
                fontFamily: '"Cinzel", serif',
                fontSize: '2rem',
                color: '#60a5fa',
                mb: 2,
                textShadow: '0 0 20px rgba(96, 165, 250, 0.5)',
              }}
            >
              Time's Up!
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography sx={{ color: '#888', mb: 1 }}>Final Score</Typography>
              <Typography
                sx={{
                  fontSize: '3rem',
                  fontWeight: 700,
                  color: '#e0e0e0',
                  textShadow: '0 0 10px rgba(96, 165, 250, 0.5)',
                }}
              >
                {score}
              </Typography>
            </Box>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6}>
                <Typography sx={{ color: '#888', fontSize: '0.85rem' }}>Gems Cleared</Typography>
                <Typography sx={{ color: '#d4af37', fontSize: '1.2rem', fontWeight: 600 }}>
                  {gemsCleared}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography sx={{ color: '#888', fontSize: '0.85rem' }}>Best Cascade</Typography>
                <Typography sx={{ color: '#f97316', fontSize: '1.2rem', fontWeight: 600 }}>
                  x{cascadeCount || 0}
                </Typography>
              </Grid>
            </Grid>

            {score >= highScore && score > 0 && (
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

export default CrystalMatchGame;
