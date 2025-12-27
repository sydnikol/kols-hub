// Achievement Panel Component
// Grid view of all achievements with filters, progress bars, and recent unlocks

import React, { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Chip,
  LinearProgress,
  Tooltip,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Trophy,
  Star,
  Lock,
  Check,
  Search,
  Sparkles,
  Medal,
  Gem,
  Target,
  Clock,
  Filter,
} from 'lucide-react';
import { GothicCard } from '../gothic/GothicCard';
import {
  Achievement,
  AchievementCategory,
  AchievementRarity,
  achievementCategories,
  rarityInfo,
  revealedSecrets,
} from '../../data/achievements';
import { achievementService, AchievementProgress } from '../../services/AchievementService';

// ==========================================
// Animations
// ==========================================

const shine = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.9; }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 15px rgba(212, 175, 55, 0.3); }
  50% { box-shadow: 0 0 30px rgba(212, 175, 55, 0.6); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
`;

// ==========================================
// Styled Components
// ==========================================

const PanelContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #0a0812 0%, #1a1028 50%, #0a0812 100%)',
  padding: '32px',
});

const HeaderSection = styled(Box)({
  textAlign: 'center',
  marginBottom: '32px',
});

const StatsCard = styled(Box)<{ color?: string }>(({ color = '#8b5cf6' }) => ({
  padding: '20px',
  borderRadius: '16px',
  background: `linear-gradient(135deg, ${color}15, ${color}08)`,
  border: `1px solid ${color}40`,
  textAlign: 'center',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: `0 8px 24px ${color}30`,
  },
}));

const AchievementBadge = styled(Box)<{
  unlocked: boolean;
  rarity: AchievementRarity;
  recent?: boolean;
}>(({ unlocked, rarity, recent }) => {
  const color = rarityInfo[rarity].color;
  return {
    position: 'relative',
    width: '100%',
    aspectRatio: '1',
    maxWidth: '100px',
    margin: '0 auto',
    borderRadius: '16px',
    background: unlocked
      ? `linear-gradient(135deg, ${color}30, ${color}15)`
      : 'rgba(30, 30, 40, 0.6)',
    border: unlocked ? `2px solid ${color}` : '1px solid rgba(100, 100, 120, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    opacity: unlocked ? 1 : 0.6,
    animation: recent ? `${pulse} 2s ease-in-out infinite, ${glow} 2s ease-in-out infinite` : 'none',
    '&:hover': {
      transform: 'scale(1.08)',
      boxShadow: unlocked ? `0 0 25px ${color}50` : '0 4px 12px rgba(0,0,0,0.3)',
    },
  };
});

const RecentBadge = styled(Box)({
  position: 'absolute',
  top: '-8px',
  right: '-8px',
  background: 'linear-gradient(135deg, #22c55e, #16a34a)',
  borderRadius: '50%',
  width: '24px',
  height: '24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  animation: `${float} 2s ease-in-out infinite`,
});

const ProgressBar = styled(LinearProgress)<{ barColor?: string }>(({ barColor = '#8b5cf6' }) => ({
  height: '6px',
  borderRadius: '3px',
  backgroundColor: 'rgba(100, 100, 120, 0.2)',
  marginTop: '8px',
  '& .MuiLinearProgress-bar': {
    borderRadius: '3px',
    background: `linear-gradient(90deg, ${barColor}, ${barColor}dd)`,
  },
}));

const CategoryTab = styled(Tab)<{ catcolor?: string }>(({ catcolor = '#8b5cf6' }) => ({
  color: '#888888',
  fontFamily: '"Cinzel", serif',
  fontSize: '0.85rem',
  minHeight: '48px',
  '&.Mui-selected': {
    color: catcolor,
  },
}));

const SearchField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    color: '#e0e0e0',
    backgroundColor: 'rgba(30, 30, 40, 0.6)',
    borderRadius: '12px',
    '& fieldset': {
      borderColor: 'rgba(139, 92, 246, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(139, 92, 246, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#8b5cf6',
    },
  },
  '& .MuiInputAdornment-root': {
    color: '#888888',
  },
});

// ==========================================
// Component
// ==========================================

interface AchievementPanelProps {
  onAchievementClick?: (achievement: Achievement) => void;
}

export const AchievementPanel: React.FC<AchievementPanelProps> = ({
  onAchievementClick,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'all'>('all');
  const [selectedRarity, setSelectedRarity] = useState<AchievementRarity | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showLocked, setShowLocked] = useState(true);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [recentUnlockIds, setRecentUnlockIds] = useState<string[]>([]);

  // Load achievements data
  useEffect(() => {
    const allAchievements = achievementService.getAllAchievements();
    setAchievements(allAchievements);
    setRecentUnlockIds(achievementService.getRecentUnlocks().map(a => a.id));

    // Subscribe to updates
    const unsubscribe = achievementService.subscribe((event) => {
      if (event.type === 'unlock') {
        setRecentUnlockIds(achievementService.getRecentUnlocks().map(a => a.id));
      }
    });

    return () => unsubscribe();
  }, []);

  // Filter achievements
  const filteredAchievements = useMemo(() => {
    return achievements.filter(achievement => {
      // Category filter
      if (selectedCategory !== 'all' && achievement.category !== selectedCategory) {
        return false;
      }

      // Rarity filter
      if (selectedRarity !== 'all' && achievement.rarity !== selectedRarity) {
        return false;
      }

      // Locked filter
      const isUnlocked = achievementService.isUnlocked(achievement.id);
      if (!showLocked && !isUnlocked) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const name = achievement.secret && !isUnlocked ? '???' : achievement.name;
        const description = achievement.secret && !isUnlocked ? 'Secret achievement' : achievement.description;
        return (
          name.toLowerCase().includes(query) ||
          description.toLowerCase().includes(query) ||
          achievement.category.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [achievements, selectedCategory, selectedRarity, searchQuery, showLocked]);

  // Stats calculations
  const stats = useMemo(() => {
    const unlocked = achievementService.getUnlockedCount();
    const total = achievementService.getTotalCount();
    const points = achievementService.getTotalPoints();
    const level = achievementService.getLevel();
    const levelProgress = achievementService.getLevelProgress();

    return { unlocked, total, points, level, levelProgress };
  }, [achievements]);

  const getCategoryProgress = (category: AchievementCategory) => {
    return achievementService.getCategoryProgress(category);
  };

  const getAchievementDisplay = (achievement: Achievement) => {
    const isUnlocked = achievementService.isUnlocked(achievement.id);
    const progress = achievementService.getProgress(achievement.id);

    if (achievement.secret && !isUnlocked) {
      return {
        name: '???',
        description: 'Secret achievement - discover how to unlock it!',
        icon: Lock,
      };
    }

    if (achievement.secret && isUnlocked && revealedSecrets[achievement.id]) {
      const revealed = revealedSecrets[achievement.id];
      return {
        name: revealed.name,
        description: revealed.description,
        icon: revealed.icon,
      };
    }

    return {
      name: achievement.name,
      description: achievement.description,
      icon: achievement.icon,
    };
  };

  const categories = Object.entries(achievementCategories) as [AchievementCategory, typeof achievementCategories[AchievementCategory]][];
  const rarities = Object.entries(rarityInfo) as [AchievementRarity, typeof rarityInfo[AchievementRarity]][];

  return (
    <PanelContainer>
      {/* Header */}
      <HeaderSection>
        <Typography
          sx={{
            fontFamily: '"Cinzel", serif',
            fontSize: '2.5rem',
            fontWeight: 700,
            background: 'linear-gradient(90deg, #d4af37, #f59e0b, #d4af37)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: `${shine} 3s linear infinite`,
            mb: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          <Trophy size={36} color="#d4af37" />
          Achievements
        </Typography>
        <Typography sx={{ color: '#9080a0', fontStyle: 'italic' }}>
          Collect them all and prove your mastery
        </Typography>
      </HeaderSection>

      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={3}>
          <StatsCard color="#8b5cf6">
            <Medal size={28} color="#8b5cf6" />
            <Typography sx={{ color: '#8b5cf6', fontSize: '1.8rem', fontWeight: 700, mt: 1 }}>
              {stats.unlocked}
            </Typography>
            <Typography sx={{ color: '#888888', fontSize: '0.8rem' }}>
              / {stats.total} Unlocked
            </Typography>
          </StatsCard>
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatsCard color="#d4af37">
            <Star size={28} color="#d4af37" />
            <Typography sx={{ color: '#d4af37', fontSize: '1.8rem', fontWeight: 700, mt: 1 }}>
              {stats.points.toLocaleString()}
            </Typography>
            <Typography sx={{ color: '#888888', fontSize: '0.8rem' }}>
              Total Points
            </Typography>
          </StatsCard>
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatsCard color="#22c55e">
            <Target size={28} color="#22c55e" />
            <Typography sx={{ color: '#22c55e', fontSize: '1.8rem', fontWeight: 700, mt: 1 }}>
              {Math.round((stats.unlocked / stats.total) * 100)}%
            </Typography>
            <Typography sx={{ color: '#888888', fontSize: '0.8rem' }}>
              Complete
            </Typography>
          </StatsCard>
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatsCard color="#ec4899">
            <Gem size={28} color="#ec4899" />
            <Typography sx={{ color: '#ec4899', fontSize: '1.8rem', fontWeight: 700, mt: 1 }}>
              Level {stats.level}
            </Typography>
            <ProgressBar value={stats.levelProgress} barColor="#ec4899" />
          </StatsCard>
        </Grid>
      </Grid>

      {/* Filters */}
      <GothicCard variant="glass" sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, alignItems: 'center' }}>
          {/* Search */}
          <SearchField
            placeholder="Search achievements..."
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={18} />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 250 }}
          />

          {/* Rarity Filter */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              label="All Rarities"
              onClick={() => setSelectedRarity('all')}
              sx={{
                background: selectedRarity === 'all' ? 'rgba(212, 175, 55, 0.3)' : 'rgba(30, 30, 40, 0.6)',
                border: selectedRarity === 'all' ? '2px solid #d4af37' : '1px solid rgba(100, 100, 120, 0.3)',
                color: selectedRarity === 'all' ? '#d4af37' : '#888888',
                cursor: 'pointer',
              }}
            />
            {rarities.map(([rarity, info]) => (
              <Chip
                key={rarity}
                label={info.name}
                onClick={() => setSelectedRarity(selectedRarity === rarity ? 'all' : rarity)}
                sx={{
                  background: selectedRarity === rarity ? `${info.color}30` : 'rgba(30, 30, 40, 0.6)',
                  border: selectedRarity === rarity ? `2px solid ${info.color}` : '1px solid rgba(100, 100, 120, 0.3)',
                  color: selectedRarity === rarity ? info.color : '#888888',
                  cursor: 'pointer',
                }}
              />
            ))}
          </Box>

          {/* Toggle Locked */}
          <Chip
            icon={showLocked ? <Lock size={14} /> : <Check size={14} />}
            label={showLocked ? 'Show All' : 'Unlocked Only'}
            onClick={() => setShowLocked(!showLocked)}
            sx={{
              background: 'rgba(30, 30, 40, 0.6)',
              border: '1px solid rgba(100, 100, 120, 0.3)',
              color: '#888888',
              cursor: 'pointer',
            }}
          />
        </Box>

        {/* Category Tabs */}
        <Tabs
          value={selectedCategory}
          onChange={(_, value) => setSelectedCategory(value)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            mt: 2,
            '& .MuiTabs-indicator': {
              background: 'linear-gradient(90deg, #8b5cf6, #d4af37)',
            },
          }}
        >
          <CategoryTab value="all" label="All" catcolor="#d4af37" />
          {categories.map(([key, cat]) => {
            const progress = getCategoryProgress(key);
            return (
              <CategoryTab
                key={key}
                value={key}
                label={`${cat.name} (${progress.unlocked}/${progress.total})`}
                catcolor={cat.color}
              />
            );
          })}
        </Tabs>
      </GothicCard>

      {/* Recent Unlocks Section */}
      {recentUnlockIds.length > 0 && selectedCategory === 'all' && (
        <GothicCard variant="elevated" ornate sx={{ mb: 4 }}>
          <Typography
            sx={{
              color: '#d4af37',
              fontFamily: '"Cinzel", serif',
              fontSize: '1.2rem',
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Sparkles size={20} />
            Recent Unlocks
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1 }}>
            {achievementService.getRecentUnlocks().slice(0, 5).map((achievement) => {
              const display = getAchievementDisplay(achievement);
              const Icon = display.icon;
              const color = rarityInfo[achievement.rarity].color;
              return (
                <Box
                  key={achievement.id}
                  sx={{
                    minWidth: '120px',
                    textAlign: 'center',
                    p: 2,
                    borderRadius: '12px',
                    background: `linear-gradient(135deg, ${color}20, ${color}10)`,
                    border: `1px solid ${color}50`,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                  onClick={() => onAchievementClick?.(achievement)}
                >
                  <Box
                    sx={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: `${color}30`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 8px',
                    }}
                  >
                    <Icon size={24} color={color} />
                  </Box>
                  <Typography sx={{ color: '#e0e0e0', fontSize: '0.85rem', fontWeight: 600 }}>
                    {display.name}
                  </Typography>
                  <Typography sx={{ color, fontSize: '0.75rem', textTransform: 'capitalize' }}>
                    {achievement.rarity}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </GothicCard>
      )}

      {/* Achievements Grid */}
      <Grid container spacing={2}>
        {filteredAchievements.map((achievement) => {
          const isUnlocked = achievementService.isUnlocked(achievement.id);
          const progress = achievementService.getProgress(achievement.id);
          const maxProgress = achievement.maxProgress || 1;
          const progressPercent = Math.min((progress / maxProgress) * 100, 100);
          const isRecent = recentUnlockIds.includes(achievement.id);
          const display = getAchievementDisplay(achievement);
          const Icon = display.icon;
          const color = rarityInfo[achievement.rarity].color;

          return (
            <Grid item xs={6} sm={4} md={3} lg={2} key={achievement.id}>
              <Tooltip
                title={
                  <Box sx={{ p: 1 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: isUnlocked ? color : '#888' }}>
                      {display.name}
                    </Typography>
                    <Typography sx={{ fontSize: '0.85rem', mt: 0.5, color: '#ccc' }}>
                      {display.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Typography sx={{ fontSize: '0.75rem', color, textTransform: 'uppercase' }}>
                        {achievement.rarity}
                      </Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: '#d4af37' }}>
                        {achievement.points} pts
                      </Typography>
                    </Box>
                    {achievement.maxProgress && !isUnlocked && (
                      <Box sx={{ mt: 1 }}>
                        <Typography sx={{ fontSize: '0.75rem', color: '#888' }}>
                          Progress: {progress} / {maxProgress}
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={progressPercent}
                          sx={{
                            height: 4,
                            borderRadius: 2,
                            mt: 0.5,
                            backgroundColor: 'rgba(100,100,100,0.3)',
                            '& .MuiLinearProgress-bar': {
                              background: color,
                            },
                          }}
                        />
                      </Box>
                    )}
                    {achievement.reward && (
                      <Typography sx={{ fontSize: '0.75rem', color: '#22c55e', mt: 1 }}>
                        Reward: {achievement.reward.type} - {achievement.reward.value}
                      </Typography>
                    )}
                  </Box>
                }
                arrow
                placement="top"
              >
                <Box
                  sx={{ textAlign: 'center', cursor: 'pointer' }}
                  onClick={() => onAchievementClick?.(achievement)}
                >
                  <AchievementBadge
                    unlocked={isUnlocked}
                    rarity={achievement.rarity}
                    recent={isRecent}
                  >
                    {isUnlocked ? (
                      <Icon size={32} color={color} />
                    ) : (
                      <Lock size={24} color="#666" />
                    )}
                    {isUnlocked && (
                      <Check
                        size={14}
                        color="#22c55e"
                        style={{
                          position: 'absolute',
                          bottom: '-4px',
                          right: '-4px',
                          background: '#0a0812',
                          borderRadius: '50%',
                          padding: '2px',
                        }}
                      />
                    )}
                    {isRecent && (
                      <RecentBadge>
                        <Sparkles size={12} color="#fff" />
                      </RecentBadge>
                    )}
                  </AchievementBadge>
                  <Typography
                    sx={{
                      color: isUnlocked ? '#e0e0e0' : '#666',
                      fontSize: '0.75rem',
                      mt: 1,
                      fontWeight: isUnlocked ? 600 : 400,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {display.name}
                  </Typography>
                  {achievement.maxProgress && !isUnlocked && (
                    <ProgressBar value={progressPercent} barColor={color} sx={{ mx: 1 }} />
                  )}
                </Box>
              </Tooltip>
            </Grid>
          );
        })}
      </Grid>

      {/* Empty State */}
      {filteredAchievements.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Filter size={48} color="#666" />
          <Typography sx={{ color: '#888', mt: 2, fontSize: '1.1rem' }}>
            No achievements match your filters
          </Typography>
          <Typography sx={{ color: '#666', fontSize: '0.9rem' }}>
            Try adjusting your search or filter settings
          </Typography>
        </Box>
      )}

      {/* Category Summary */}
      {selectedCategory === 'all' && (
        <GothicCard variant="elevated" sx={{ mt: 4 }}>
          <Typography
            sx={{
              color: '#d4af37',
              fontFamily: '"Cinzel", serif',
              fontSize: '1.2rem',
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Target size={20} />
            Category Progress
          </Typography>
          <Grid container spacing={2}>
            {categories.map(([key, cat]) => {
              const progress = getCategoryProgress(key);
              const percent = (progress.unlocked / progress.total) * 100;
              const Icon = cat.icon;
              return (
                <Grid item xs={6} sm={4} md={3} key={key}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: '12px',
                      background: `linear-gradient(135deg, ${cat.color}15, ${cat.color}08)`,
                      border: `1px solid ${cat.color}30`,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        borderColor: `${cat.color}60`,
                      },
                    }}
                    onClick={() => setSelectedCategory(key)}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Icon size={18} color={cat.color} />
                      <Typography sx={{ color: cat.color, fontWeight: 600, fontSize: '0.9rem' }}>
                        {cat.name}
                      </Typography>
                    </Box>
                    <Typography sx={{ color: '#e0e0e0', fontSize: '1.2rem', fontWeight: 700 }}>
                      {progress.unlocked} / {progress.total}
                    </Typography>
                    <ProgressBar value={percent} barColor={cat.color} />
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </GothicCard>
      )}
    </PanelContainer>
  );
};

export default AchievementPanel;
