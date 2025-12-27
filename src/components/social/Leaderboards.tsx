// Leaderboards Component
// Display game rankings with filters and personal bests

import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Chip, ToggleButton, ToggleButtonGroup, LinearProgress } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Trophy, Medal, Crown, Star, TrendingUp, Clock, Share2,
  ChevronRight, Gamepad2, Target, Zap, Award, User
} from 'lucide-react';
import { GothicCard } from '../gothic/GothicCard';
import { GothicButton } from '../gothic/GothicButton';
import { socialService, LeaderboardEntry, GameScore } from '../../services/SocialService';

const shine = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const LeaderboardContainer = styled(Box)({
  width: '100%',
});

const GameTab = styled(Box)<{ active: boolean; color: string }>(({ active, color }) => ({
  padding: '16px 24px',
  borderRadius: '12px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  background: active ? `${color}20` : 'rgba(20, 20, 30, 0.6)',
  border: active ? `2px solid ${color}` : '2px solid transparent',
  textAlign: 'center',
  '&:hover': {
    background: `${color}15`,
    transform: 'translateY(-2px)',
  },
}));

const RankCard = styled(Box)<{ rank: number; isCurrentUser: boolean }>(({ rank, isCurrentUser }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  padding: '16px 20px',
  borderRadius: '12px',
  background: isCurrentUser
    ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(212, 175, 55, 0.1))'
    : 'rgba(20, 20, 30, 0.6)',
  border: isCurrentUser ? '2px solid rgba(212, 175, 55, 0.5)' : '1px solid rgba(139, 92, 246, 0.2)',
  marginBottom: '8px',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  ...(rank <= 3 && {
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '3px',
      background: rank === 1 ? '#d4af37' : rank === 2 ? '#c0c0c0' : '#cd7f32',
    },
  }),
  '&:hover': {
    transform: 'translateX(4px)',
    background: isCurrentUser
      ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(212, 175, 55, 0.2))'
      : 'rgba(139, 92, 246, 0.1)',
  },
}));

const RankBadge = styled(Box)<{ rank: number }>(({ rank }) => {
  const colors = {
    1: { bg: 'linear-gradient(135deg, #d4af37, #f4d03f)', color: '#0a0a0f' },
    2: { bg: 'linear-gradient(135deg, #c0c0c0, #e0e0e0)', color: '#0a0a0f' },
    3: { bg: 'linear-gradient(135deg, #cd7f32, #e9a066)', color: '#0a0a0f' },
  };
  const style = colors[rank as keyof typeof colors] || { bg: 'rgba(50, 50, 60, 0.8)', color: '#888888' };

  return {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    background: style.bg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: rank <= 3 ? '1.2rem' : '1rem',
    color: style.color,
    animation: rank === 1 ? `${pulse} 2s ease-in-out infinite` : 'none',
    boxShadow: rank <= 3 ? '0 4px 15px rgba(0, 0, 0, 0.3)' : 'none',
  };
});

const PersonalBestCard = styled(GothicCard)({
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #d4af37, #8b5cf6, #d4af37)',
    backgroundSize: '200% 100%',
    animation: `${shine} 3s linear infinite`,
  },
});

const FilterToggle = styled(ToggleButtonGroup)({
  background: 'rgba(20, 15, 30, 0.8)',
  borderRadius: '8px',
  border: '1px solid rgba(139, 92, 246, 0.3)',

  '& .MuiToggleButton-root': {
    color: '#888888',
    border: 'none',
    padding: '8px 16px',
    fontFamily: '"Cinzel", serif',
    textTransform: 'none',

    '&.Mui-selected': {
      background: 'rgba(139, 92, 246, 0.2)',
      color: '#d4af37',
    },
  },
});

const games = [
  { id: 'memory-match', name: 'Memory Match', icon: '🎭', color: '#ec4899' },
  { id: 'word-spell', name: 'Word Spell', icon: '✨', color: '#8b5cf6' },
  { id: 'tarot-solitaire', name: 'Tarot Solitaire', icon: '🃏', color: '#d4af37' },
  { id: 'crystal-match', name: 'Crystal Match', icon: '💎', color: '#60a5fa' },
];

export const Leaderboards: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState(games[0]);
  const [timeFilter, setTimeFilter] = useState<'weekly' | 'allTime'>('allTime');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [personalBest, setPersonalBest] = useState<number>(0);
  const [recentScores, setRecentScores] = useState<GameScore[]>([]);

  useEffect(() => {
    loadLeaderboardData();
  }, [selectedGame, timeFilter]);

  const loadLeaderboardData = () => {
    const entries = socialService.getLeaderboard(selectedGame.id, timeFilter);
    setLeaderboard(entries);
    setPersonalBest(socialService.getPersonalBest(selectedGame.id));

    const allScores = socialService.getGameScores();
    setRecentScores(allScores.filter(s => s.gameId === selectedGame.id).slice(-5).reverse());
  };

  const handleTimeFilterChange = (_: React.MouseEvent<HTMLElement>, newFilter: 'weekly' | 'allTime' | null) => {
    if (newFilter) {
      setTimeFilter(newFilter);
    }
  };

  const handleShareScore = () => {
    const shareText = `I scored ${personalBest.toLocaleString()} in ${selectedGame.name} on Gothic Dollhouse! Can you beat my score?`;

    if (navigator.share) {
      navigator.share({
        title: 'Gothic Dollhouse Score',
        text: shareText,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      // Could show a toast here
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown size={20} color="#d4af37" />;
      case 2: return <Medal size={20} color="#c0c0c0" />;
      case 3: return <Medal size={20} color="#cd7f32" />;
      default: return null;
    }
  };

  const getUserRank = () => {
    const userEntry = leaderboard.find(e => e.isCurrentUser);
    return userEntry?.rank || null;
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <LeaderboardContainer>
      {/* Game Selection */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {games.map((game) => (
          <Grid item xs={6} sm={3} key={game.id}>
            <GameTab
              active={selectedGame.id === game.id}
              color={game.color}
              onClick={() => setSelectedGame(game)}
            >
              <Box sx={{ fontSize: '2rem', mb: 1 }}>{game.icon}</Box>
              <Typography sx={{ color: selectedGame.id === game.id ? game.color : '#888', fontWeight: 600 }}>
                {game.name}
              </Typography>
            </GameTab>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4}>
        {/* Main Leaderboard */}
        <Grid item xs={12} md={8}>
          <GothicCard variant="elevated" ornate>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography sx={{ color: selectedGame.color, fontFamily: '"Cinzel", serif', fontSize: '1.3rem' }}>
                <Trophy size={24} style={{ marginRight: '12px', verticalAlign: 'middle' }} />
                {selectedGame.name} Leaderboard
              </Typography>
              <FilterToggle
                value={timeFilter}
                exclusive
                onChange={handleTimeFilterChange}
              >
                <ToggleButton value="weekly">
                  <Clock size={14} style={{ marginRight: '6px' }} />
                  Weekly
                </ToggleButton>
                <ToggleButton value="allTime">
                  <Star size={14} style={{ marginRight: '6px' }} />
                  All Time
                </ToggleButton>
              </FilterToggle>
            </Box>

            {leaderboard.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <Gamepad2 size={48} color="#444" />
                <Typography sx={{ color: '#666', mt: 2 }}>
                  No scores yet. Be the first to play!
                </Typography>
              </Box>
            ) : (
              <>
                {/* Top 3 Podium */}
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
                  {leaderboard.slice(0, 3).map((entry, index) => {
                    const order = [1, 0, 2]; // Display order: 2nd, 1st, 3rd
                    const displayEntry = leaderboard[order[index]];
                    if (!displayEntry) return null;

                    const heights = ['140px', '180px', '120px'];
                    const colors = ['#c0c0c0', '#d4af37', '#cd7f32'];

                    return (
                      <Box
                        key={displayEntry.rank}
                        sx={{
                          textAlign: 'center',
                          flex: 1,
                          maxWidth: '150px',
                        }}
                      >
                        <Box
                          sx={{
                            height: heights[index],
                            background: `linear-gradient(180deg, ${colors[index]}20, transparent)`,
                            borderRadius: '12px 12px 0 0',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            pb: 2,
                            border: `1px solid ${colors[index]}50`,
                            borderBottom: 'none',
                          }}
                        >
                          <Box sx={{ fontSize: '2rem', mb: 1 }}>{displayEntry.avatar}</Box>
                          <Typography sx={{ color: '#e0e0e0', fontWeight: 600, fontSize: '0.9rem' }}>
                            {displayEntry.username}
                          </Typography>
                          <Typography sx={{ color: colors[index], fontWeight: 700, fontSize: '1.2rem' }}>
                            {displayEntry.score.toLocaleString()}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            background: colors[index],
                            color: '#0a0a0f',
                            py: 1,
                            borderRadius: '0 0 12px 12px',
                            fontWeight: 700,
                          }}
                        >
                          #{displayEntry.rank}
                        </Box>
                      </Box>
                    );
                  })}
                </Box>

                {/* Full Ranking List */}
                <Box>
                  {leaderboard.map((entry) => (
                    <RankCard key={`${entry.rank}-${entry.username}`} rank={entry.rank} isCurrentUser={entry.isCurrentUser}>
                      <RankBadge rank={entry.rank}>
                        {entry.rank <= 3 ? getRankIcon(entry.rank) : `#${entry.rank}`}
                      </RankBadge>
                      <Box sx={{ fontSize: '1.8rem' }}>{entry.avatar}</Box>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography sx={{ color: entry.isCurrentUser ? '#d4af37' : '#e0e0e0', fontWeight: 600 }}>
                            {entry.username}
                          </Typography>
                          {entry.isCurrentUser && (
                            <Chip
                              label="You"
                              size="small"
                              sx={{
                                background: 'rgba(212, 175, 55, 0.2)',
                                color: '#d4af37',
                                fontSize: '0.7rem',
                                height: '20px',
                              }}
                            />
                          )}
                        </Box>
                        <Typography sx={{ color: '#666', fontSize: '0.85rem' }}>
                          {entry.gamesPlayed} games played
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography sx={{ color: selectedGame.color, fontWeight: 700, fontSize: '1.3rem' }}>
                          {entry.score.toLocaleString()}
                        </Typography>
                        <Typography sx={{ color: '#666', fontSize: '0.75rem' }}>
                          points
                        </Typography>
                      </Box>
                    </RankCard>
                  ))}
                </Box>
              </>
            )}
          </GothicCard>
        </Grid>

        {/* Sidebar: Personal Stats */}
        <Grid item xs={12} md={4}>
          {/* Personal Best */}
          <PersonalBestCard variant="elevated" sx={{ mb: 3 }}>
            <Typography sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif', fontSize: '1.1rem', mb: 2 }}>
              <Star size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Your Personal Best
            </Typography>
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Box sx={{ fontSize: '3rem' }}>{selectedGame.icon}</Box>
              <Typography sx={{ color: selectedGame.color, fontSize: '2.5rem', fontWeight: 700 }}>
                {personalBest.toLocaleString()}
              </Typography>
              <Typography sx={{ color: '#888' }}>points</Typography>

              {getUserRank() && (
                <Chip
                  icon={<TrendingUp size={14} />}
                  label={`Rank #${getUserRank()}`}
                  sx={{
                    mt: 2,
                    background: 'rgba(139, 92, 246, 0.2)',
                    color: '#a78bfa',
                  }}
                />
              )}
            </Box>

            <GothicButton
              variant="secondary"
              size="small"
              startIcon={<Share2 size={14} />}
              onClick={handleShareScore}
              sx={{ width: '100%', mt: 2 }}
            >
              Share Score
            </GothicButton>
          </PersonalBestCard>

          {/* Recent Scores */}
          <GothicCard variant="glass">
            <Typography sx={{ color: '#a855f7', fontFamily: '"Cinzel", serif', fontSize: '1.1rem', mb: 2 }}>
              <Clock size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Recent Games
            </Typography>

            {recentScores.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Gamepad2 size={32} color="#444" />
                <Typography sx={{ color: '#666', mt: 1, fontSize: '0.9rem' }}>
                  No recent games
                </Typography>
              </Box>
            ) : (
              recentScores.map((score, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 1.5,
                    borderRadius: '8px',
                    background: 'rgba(20, 20, 30, 0.6)',
                    mb: 1,
                  }}
                >
                  <Target size={16} color={selectedGame.color} />
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ color: '#e0e0e0', fontSize: '0.95rem', fontWeight: 600 }}>
                      {score.score.toLocaleString()} pts
                    </Typography>
                    <Typography sx={{ color: '#666', fontSize: '0.75rem' }}>
                      {formatDate(score.achievedAt)}
                    </Typography>
                  </Box>
                  {score.score === personalBest && (
                    <Award size={16} color="#d4af37" />
                  )}
                </Box>
              ))
            )}
          </GothicCard>

          {/* Game Stats Summary */}
          <GothicCard variant="glass" sx={{ mt: 3 }}>
            <Typography sx={{ color: '#10b981', fontFamily: '"Cinzel", serif', fontSize: '1.1rem', mb: 2 }}>
              <Zap size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              All Games Summary
            </Typography>
            {games.map((game) => {
              const gameBest = socialService.getPersonalBest(game.id);
              return (
                <Box
                  key={game.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 1.5,
                    borderRadius: '8px',
                    background: selectedGame.id === game.id ? `${game.color}15` : 'transparent',
                    mb: 1,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': { background: `${game.color}10` },
                  }}
                  onClick={() => setSelectedGame(game)}
                >
                  <Box sx={{ fontSize: '1.5rem' }}>{game.icon}</Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ color: '#e0e0e0', fontSize: '0.9rem' }}>
                      {game.name}
                    </Typography>
                  </Box>
                  <Typography sx={{ color: game.color, fontWeight: 600 }}>
                    {gameBest > 0 ? gameBest.toLocaleString() : '-'}
                  </Typography>
                  <ChevronRight size={16} color="#666" />
                </Box>
              );
            })}
          </GothicCard>
        </Grid>
      </Grid>
    </LeaderboardContainer>
  );
};

export default Leaderboards;
