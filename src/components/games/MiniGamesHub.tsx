// Mini-Games Hub Component
// Collection of accessible mini-games for engagement and fun

import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Chip, LinearProgress } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Gamepad2, Star, Trophy, Clock, Puzzle, Heart,
  Sparkles, Zap, Target, Dice5, Brain, Award
} from 'lucide-react';
import { GothicCard } from '../gothic/GothicCard';
import { GothicButton } from '../gothic/GothicButton';
import { MemoryMatchGame } from './MemoryMatchGame';
import { WordSpellGame } from './WordSpellGame';
import { TarotSolitaireGame } from './TarotSolitaireGame';
import { CrystalMatchGame } from './CrystalMatchGame';

// Type for active game - only playable games are included
type ActiveGame = 'memory-match' | 'word-spell' | 'tarot-solitaire' | 'crystal-match' | null;

// Playable games that have actual game components
const PLAYABLE_GAMES = ['memory-match', 'word-spell', 'tarot-solitaire', 'crystal-match'];

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const GamesContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #0a0812 0%, #1a1028 50%, #0a0812 100%)',
  padding: '32px',
});

const HeaderSection = styled(Box)({
  textAlign: 'center',
  marginBottom: '48px',
});

const GameCard = styled(GothicCard)<{ color: string }>(({ color }) => ({
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: color,
  },
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: `0 20px 40px ${color}40`,
  },
}));

const GameIcon = styled(Box)({
  animation: `${bounce} 2s ease-in-out infinite`,
});

const AchievementBadge = styled(Box)<{ unlocked: boolean }>(({ unlocked }) => ({
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  background: unlocked ? 'linear-gradient(135deg, #d4af37, #b8860b)' : 'rgba(50, 50, 60, 0.8)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: unlocked ? 1 : 0.5,
  border: unlocked ? '2px solid #d4af37' : '2px solid #333',
}));

const games = [
  {
    id: 'word-spell',
    name: 'Word Spell',
    description: 'Create words from magical letters',
    icon: '✨',
    color: '#8b5cf6',
    difficulty: 'Easy',
    spoons: 1,
    highScore: 1250,
    timesPlayed: 45,
  },
  {
    id: 'memory-match',
    name: 'Memory Match',
    description: 'Match pairs of gothic symbols',
    icon: '🎭',
    color: '#ec4899',
    difficulty: 'Easy',
    spoons: 1,
    highScore: 890,
    timesPlayed: 62,
  },
  {
    id: 'tarot-solitaire',
    name: 'Tarot Solitaire',
    description: 'Classic solitaire with tarot cards',
    icon: '🃏',
    color: '#d4af37',
    difficulty: 'Medium',
    spoons: 2,
    highScore: 3400,
    timesPlayed: 28,
  },
  {
    id: 'crystal-match',
    name: 'Crystal Match',
    description: 'Match 3 crystals to clear the board',
    icon: '💎',
    color: '#60a5fa',
    difficulty: 'Easy',
    spoons: 1,
    highScore: 5600,
    timesPlayed: 89,
  },
  {
    id: 'ancestor-trivia',
    name: 'Ancestor Trivia',
    description: 'Test your knowledge of historical figures',
    icon: '📚',
    color: '#10b981',
    difficulty: 'Medium',
    spoons: 2,
    highScore: 2100,
    timesPlayed: 34,
  },
  {
    id: 'zen-garden',
    name: 'Zen Garden',
    description: 'Relaxing sandbox garden builder',
    icon: '🪨',
    color: '#84cc16',
    difficulty: 'Relaxing',
    spoons: 1,
    highScore: 0,
    timesPlayed: 56,
  },
  {
    id: 'constellation-draw',
    name: 'Constellation Draw',
    description: 'Connect stars to form constellations',
    icon: '⭐',
    color: '#f97316',
    difficulty: 'Easy',
    spoons: 1,
    highScore: 780,
    timesPlayed: 23,
  },
  {
    id: 'potion-puzzle',
    name: 'Potion Puzzle',
    description: 'Mix ingredients to create potions',
    icon: '🧪',
    color: '#a855f7',
    difficulty: 'Hard',
    spoons: 3,
    highScore: 4200,
    timesPlayed: 15,
  },
  {
    id: 'rune-reading',
    name: 'Rune Reading',
    description: 'Cast runes and interpret their meanings',
    icon: '᛭',
    color: '#6366f1',
    difficulty: 'Medium',
    spoons: 2,
    highScore: 1800,
    timesPlayed: 19,
  },
  {
    id: 'mood-monster',
    name: 'Mood Monster',
    description: 'Feed your monster based on emotions',
    icon: '👾',
    color: '#22c55e',
    difficulty: 'Easy',
    spoons: 1,
    highScore: 2400,
    timesPlayed: 72,
  },
  {
    id: 'shadow-puppet',
    name: 'Shadow Puppets',
    description: 'Create shadow art with your fingers',
    icon: '🖐️',
    color: '#334155',
    difficulty: 'Relaxing',
    spoons: 1,
    highScore: 0,
    timesPlayed: 31,
  },
  {
    id: 'candle-rhythm',
    name: 'Candle Rhythm',
    description: 'Tap to the beat of flickering candles',
    icon: '🕯️',
    color: '#f59e0b',
    difficulty: 'Medium',
    spoons: 2,
    highScore: 3100,
    timesPlayed: 44,
  },
  {
    id: 'spirit-board',
    name: 'Spirit Board',
    description: 'Receive messages from beyond',
    icon: '🔮',
    color: '#7c3aed',
    difficulty: 'Relaxing',
    spoons: 1,
    highScore: 0,
    timesPlayed: 67,
  },
  {
    id: 'herb-garden',
    name: 'Herb Garden',
    description: 'Grow magical herbs for potions',
    icon: '🌿',
    color: '#059669',
    difficulty: 'Easy',
    spoons: 1,
    highScore: 1560,
    timesPlayed: 53,
  },
  {
    id: 'moon-phases',
    name: 'Moon Phases',
    description: 'Track the moon through its cycle',
    icon: '🌙',
    color: '#c084fc',
    difficulty: 'Easy',
    spoons: 1,
    highScore: 920,
    timesPlayed: 38,
  },
  {
    id: 'ancestor-stories',
    name: 'Ancestor Stories',
    description: 'Interactive choose-your-own-adventure',
    icon: '📖',
    color: '#b45309',
    difficulty: 'Medium',
    spoons: 2,
    highScore: 2850,
    timesPlayed: 27,
  },
  {
    id: 'color-meditation',
    name: 'Color Meditation',
    description: 'Blend colors in calming patterns',
    icon: '🎨',
    color: '#db2777',
    difficulty: 'Relaxing',
    spoons: 1,
    highScore: 0,
    timesPlayed: 94,
  },
  {
    id: 'dice-oracle',
    name: 'Dice Oracle',
    description: 'Roll enchanted dice for guidance',
    icon: '🎲',
    color: '#dc2626',
    difficulty: 'Easy',
    spoons: 1,
    highScore: 1100,
    timesPlayed: 41,
  },
  {
    id: 'sigil-maker',
    name: 'Sigil Maker',
    description: 'Design personal magical symbols',
    icon: '✴️',
    color: '#0891b2',
    difficulty: 'Medium',
    spoons: 2,
    highScore: 1750,
    timesPlayed: 22,
  },
  {
    id: 'sound-bath',
    name: 'Sound Bath',
    description: 'Play crystal bowls for relaxation',
    icon: '🔔',
    color: '#0ea5e9',
    difficulty: 'Relaxing',
    spoons: 1,
    highScore: 0,
    timesPlayed: 88,
  },
];

const achievements = [
  { id: 'first-game', name: 'First Steps', description: 'Play your first game', unlocked: true, icon: '🎮' },
  { id: 'streak-7', name: 'Week Warrior', description: '7-day play streak', unlocked: true, icon: '🔥' },
  { id: 'high-scorer', name: 'High Scorer', description: 'Beat a high score', unlocked: true, icon: '🏆' },
  { id: 'completionist', name: 'Completionist', description: 'Play all games', unlocked: false, icon: '⭐' },
  { id: 'master', name: 'Game Master', description: '1000 total points', unlocked: false, icon: '👑' },
  { id: 'zen', name: 'Zen Master', description: '10 hours in Zen Garden', unlocked: false, icon: '🧘' },
];

const dailyChallenges = [
  { game: 'Word Spell', challenge: 'Score 500+ points', reward: '50 XP', completed: true },
  { game: 'Memory Match', challenge: 'Complete in under 2 min', reward: '75 XP', completed: false },
  { game: 'Crystal Match', challenge: 'Clear 100 crystals', reward: '100 XP', completed: false },
];

export const MiniGamesHub: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [activeGame, setActiveGame] = useState<ActiveGame>(null);
  const [highScores, setHighScores] = useState<{ [key: string]: number }>({});

  // Load high scores from localStorage
  useEffect(() => {
    const memoryScore = localStorage.getItem('memoryMatchHighScore');
    const wordScore = localStorage.getItem('wordSpellHighScore');
    const tarotScore = localStorage.getItem('tarotSolitaireHighScore');
    const crystalScore = localStorage.getItem('crystalMatchHighScore');
    setHighScores({
      'memory-match': memoryScore ? parseInt(memoryScore, 10) : 0,
      'word-spell': wordScore ? parseInt(wordScore, 10) : 0,
      'tarot-solitaire': tarotScore ? parseInt(tarotScore, 10) : 0,
      'crystal-match': crystalScore ? parseInt(crystalScore, 10) : 0,
    });
  }, [activeGame]); // Refresh when returning from game

  // Get display high score for a game (from localStorage or default)
  const getGameHighScore = (gameId: string, defaultScore: number) => {
    if (highScores[gameId] !== undefined && highScores[gameId] > 0) {
      return highScores[gameId];
    }
    return defaultScore;
  };

  const totalScore = games.reduce((sum, g) => sum + getGameHighScore(g.id, g.highScore), 0);
  const totalPlayed = games.reduce((sum, g) => sum + g.timesPlayed, 0);

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Easy': return '#10b981';
      case 'Medium': return '#f97316';
      case 'Hard': return '#ef4444';
      case 'Relaxing': return '#60a5fa';
      default: return '#888888';
    }
  };

  // Handle playing a game
  const handlePlayGame = () => {
    if (selectedGame && PLAYABLE_GAMES.includes(selectedGame)) {
      setActiveGame(selectedGame as ActiveGame);
    }
  };

  // Handle returning from a game
  const handleBackToHub = () => {
    setActiveGame(null);
    setSelectedGame(null);
  };

  // Render active game if one is selected
  if (activeGame === 'memory-match') {
    return <MemoryMatchGame onBack={handleBackToHub} />;
  }

  if (activeGame === 'word-spell') {
    return <WordSpellGame onBack={handleBackToHub} />;
  }

  if (activeGame === 'tarot-solitaire') {
    return <TarotSolitaireGame onBack={handleBackToHub} />;
  }

  if (activeGame === 'crystal-match') {
    return <CrystalMatchGame onBack={handleBackToHub} />;
  }

  return (
    <GamesContainer>
      <HeaderSection>
        <Typography
          sx={{
            fontFamily: '"Cinzel", serif',
            fontSize: '2.5rem',
            fontWeight: 700,
            color: '#a855f7',
            letterSpacing: '0.1em',
            textShadow: '0 0 30px rgba(168, 85, 247, 0.4)',
            mb: 1,
          }}
        >
          <Gamepad2 size={36} style={{ marginRight: '12px', verticalAlign: 'middle' }} />
          Mini-Games Hub
        </Typography>
        <Typography sx={{ color: '#9080a0', fontStyle: 'italic' }}>
          Accessible fun for every energy level
        </Typography>
      </HeaderSection>

      {/* Stats Bar */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={3}>
          <GothicCard variant="glass" sx={{ textAlign: 'center' }}>
            <Trophy size={24} color="#d4af37" style={{ marginBottom: '8px' }} />
            <Typography sx={{ color: '#d4af37', fontSize: '1.5rem', fontWeight: 700 }}>
              {totalScore.toLocaleString()}
            </Typography>
            <Typography sx={{ color: '#888888', fontSize: '0.85rem' }}>Total Score</Typography>
          </GothicCard>
        </Grid>
        <Grid item xs={6} sm={3}>
          <GothicCard variant="glass" sx={{ textAlign: 'center' }}>
            <Gamepad2 size={24} color="#a855f7" style={{ marginBottom: '8px' }} />
            <Typography sx={{ color: '#a855f7', fontSize: '1.5rem', fontWeight: 700 }}>
              {totalPlayed}
            </Typography>
            <Typography sx={{ color: '#888888', fontSize: '0.85rem' }}>Games Played</Typography>
          </GothicCard>
        </Grid>
        <Grid item xs={6} sm={3}>
          <GothicCard variant="glass" sx={{ textAlign: 'center' }}>
            <Star size={24} color="#f97316" style={{ marginBottom: '8px' }} />
            <Typography sx={{ color: '#f97316', fontSize: '1.5rem', fontWeight: 700 }}>
              {achievements.filter(a => a.unlocked).length}/{achievements.length}
            </Typography>
            <Typography sx={{ color: '#888888', fontSize: '0.85rem' }}>Achievements</Typography>
          </GothicCard>
        </Grid>
        <Grid item xs={6} sm={3}>
          <GothicCard variant="glass" sx={{ textAlign: 'center' }}>
            <Zap size={24} color="#10b981" style={{ marginBottom: '8px' }} />
            <Typography sx={{ color: '#10b981', fontSize: '1.5rem', fontWeight: 700 }}>
              12
            </Typography>
            <Typography sx={{ color: '#888888', fontSize: '0.85rem' }}>Day Streak</Typography>
          </GothicCard>
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        {/* Games Grid */}
        <Grid item xs={12} md={8}>
          <Typography sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif', fontSize: '1.3rem', mb: 3 }}>
            <Sparkles size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Available Games
          </Typography>
          <Grid container spacing={2}>
            {games.map((game) => (
              <Grid item xs={12} sm={6} key={game.id}>
                <GameCard
                  variant="glass"
                  color={game.color}
                  onClick={() => setSelectedGame(game.id)}
                  sx={{ border: selectedGame === game.id ? `2px solid ${game.color}` : undefined }}
                >
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    <GameIcon sx={{ fontSize: '3rem' }}>{game.icon}</GameIcon>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ color: '#e0e0e0', fontWeight: 600, fontSize: '1.1rem', mb: 0.5 }}>
                        {game.name}
                      </Typography>
                      <Typography sx={{ color: '#888888', fontSize: '0.85rem', mb: 1 }}>
                        {game.description}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip
                          label={game.difficulty}
                          size="small"
                          sx={{ background: `${getDifficultyColor(game.difficulty)}20`, color: getDifficultyColor(game.difficulty) }}
                        />
                        <Chip
                          label={`${game.spoons} spoon${game.spoons > 1 ? 's' : ''}`}
                          size="small"
                          sx={{ background: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa' }}
                        />
                        {getGameHighScore(game.id, game.highScore) > 0 && (
                          <Chip
                            icon={<Trophy size={12} />}
                            label={getGameHighScore(game.id, game.highScore).toLocaleString()}
                            size="small"
                            sx={{ background: 'rgba(212, 175, 55, 0.2)', color: '#d4af37' }}
                          />
                        )}
                        {PLAYABLE_GAMES.includes(game.id) && (
                          <Chip
                            label="Playable"
                            size="small"
                            sx={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', fontWeight: 600 }}
                          />
                        )}
                      </Box>
                    </Box>
                  </Box>
                </GameCard>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Daily Challenges */}
          <GothicCard variant="elevated" ornate sx={{ mb: 3 }}>
            <Typography sx={{ color: '#f97316', fontFamily: '"Cinzel", serif', fontSize: '1.2rem', mb: 2 }}>
              <Target size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Daily Challenges
            </Typography>
            {dailyChallenges.map((challenge, i) => (
              <Box
                key={i}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 1.5,
                  mb: 1,
                  borderRadius: '8px',
                  background: challenge.completed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(20, 20, 30, 0.6)',
                  borderLeft: `3px solid ${challenge.completed ? '#10b981' : '#888888'}`,
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ color: '#e0e0e0', fontSize: '0.9rem' }}>{challenge.game}</Typography>
                  <Typography sx={{ color: '#888888', fontSize: '0.8rem' }}>{challenge.challenge}</Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Chip
                    label={challenge.reward}
                    size="small"
                    sx={{ background: 'rgba(212, 175, 55, 0.2)', color: '#d4af37' }}
                  />
                </Box>
              </Box>
            ))}
          </GothicCard>

          {/* Achievements */}
          <GothicCard variant="glass">
            <Typography sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif', fontSize: '1.2rem', mb: 2 }}>
              <Award size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Achievements
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
              {achievements.map((achievement) => (
                <Box key={achievement.id} sx={{ textAlign: 'center' }}>
                  <AchievementBadge unlocked={achievement.unlocked}>
                    <Typography sx={{ fontSize: '1.5rem' }}>{achievement.icon}</Typography>
                  </AchievementBadge>
                  <Typography
                    sx={{
                      color: achievement.unlocked ? '#e0e0e0' : '#666666',
                      fontSize: '0.7rem',
                      mt: 0.5,
                      maxWidth: '60px',
                    }}
                  >
                    {achievement.name}
                  </Typography>
                </Box>
              ))}
            </Box>
          </GothicCard>
        </Grid>
      </Grid>

      {/* Play Button */}
      {selectedGame && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <GothicCard variant="elevated" ornate sx={{ maxWidth: '400px', mx: 'auto' }}>
            <Typography sx={{ color: '#e0e0e0', fontSize: '1.2rem', mb: 2 }}>
              Ready to play <span style={{ color: games.find(g => g.id === selectedGame)?.color }}>
                {games.find(g => g.id === selectedGame)?.name}
              </span>?
            </Typography>
            {PLAYABLE_GAMES.includes(selectedGame) ? (
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <GothicButton variant="primary" startIcon={<Gamepad2 size={18} />} onClick={handlePlayGame}>
                  Play Now
                </GothicButton>
                <GothicButton variant="ghost" startIcon={<Brain size={18} />}>
                  How to Play
                </GothicButton>
              </Box>
            ) : (
              <Box>
                <Typography sx={{ color: '#888', fontSize: '0.9rem', mb: 2 }}>
                  This game is coming soon!
                </Typography>
                <GothicButton variant="ghost" disabled startIcon={<Gamepad2 size={18} />}>
                  Coming Soon
                </GothicButton>
              </Box>
            )}
          </GothicCard>
        </Box>
      )}
    </GamesContainer>
  );
};

export default MiniGamesHub;
