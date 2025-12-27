// Achievement System
// Gamification with badges, streaks, XP, and rewards

import React, { useState, useMemo } from 'react';
import { Box, Typography, Grid, Chip, LinearProgress, Tooltip, Badge } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Trophy, Star, Flame, Zap, Heart, Crown, Shield, Target,
  Award, Medal, Gem, Gift, Lock, Check, Sparkles, TrendingUp,
  Calendar, Clock, Sun, Moon, BookOpen, Music, Palette, Code,
  Dumbbell, Brain, Users, DollarSign, Home, Utensils
} from 'lucide-react';
import { GothicCard } from '../gothic/GothicCard';
import { GothicButton } from '../gothic/GothicButton';

const shine = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(212, 175, 55, 0.3); }
  50% { box-shadow: 0 0 40px rgba(212, 175, 55, 0.6); }
`;

const AchievementContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #0a0812 0%, #1a1028 50%, #0a0812 100%)',
  padding: '32px',
});

const LevelBadge = styled(Box)<{ level: number }>(({ level }) => ({
  width: '120px',
  height: '120px',
  borderRadius: '50%',
  background: `linear-gradient(135deg, ${level >= 50 ? '#d4af37' : level >= 25 ? '#8b5cf6' : level >= 10 ? '#22c55e' : '#60a5fa'}, ${level >= 50 ? '#f59e0b' : level >= 25 ? '#ec4899' : level >= 10 ? '#10b981' : '#3b82f6'})`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto',
  animation: `${glow} 2s ease-in-out infinite`,
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: '-4px',
    borderRadius: '50%',
    border: '2px solid rgba(212, 175, 55, 0.5)',
  },
}));

const AchievementBadge = styled(Box)<{ unlocked: boolean; rarity: string }>(({ unlocked, rarity }) => {
  const rarityColors: Record<string, string> = {
    common: '#9ca3af',
    rare: '#3b82f6',
    epic: '#8b5cf6',
    legendary: '#f59e0b',
    mythic: '#ec4899',
  };
  const color = rarityColors[rarity] || rarityColors.common;

  return {
    width: '80px',
    height: '80px',
    borderRadius: '12px',
    background: unlocked ? `linear-gradient(135deg, ${color}40, ${color}20)` : 'rgba(30, 30, 40, 0.6)',
    border: unlocked ? `2px solid ${color}` : '1px solid rgba(100, 100, 120, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative',
    opacity: unlocked ? 1 : 0.5,
    '&:hover': {
      transform: unlocked ? 'scale(1.1)' : 'none',
      boxShadow: unlocked ? `0 0 20px ${color}40` : 'none',
    },
  };
});

const StreakDisplay = styled(Box)({
  textAlign: 'center',
  padding: '24px',
  background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.2), rgba(239, 68, 68, 0.2))',
  borderRadius: '16px',
  border: '2px solid rgba(249, 115, 22, 0.3)',
});

const XPBar = styled(LinearProgress)({
  height: '12px',
  borderRadius: '6px',
  backgroundColor: 'rgba(139, 92, 246, 0.2)',
  '& .MuiLinearProgress-bar': {
    borderRadius: '6px',
    background: 'linear-gradient(90deg, #8b5cf6, #ec4899)',
  },
});

const RewardCard = styled(Box)<{ claimed: boolean }>(({ claimed }) => ({
  padding: '16px',
  borderRadius: '12px',
  background: claimed ? 'rgba(34, 197, 94, 0.1)' : 'rgba(212, 175, 55, 0.1)',
  border: `1px solid ${claimed ? 'rgba(34, 197, 94, 0.3)' : 'rgba(212, 175, 55, 0.3)'}`,
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  cursor: claimed ? 'default' : 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: claimed ? 'none' : 'translateX(4px)',
  },
}));

// Achievement definitions
const achievements = [
  // Getting Started
  { id: 'first-login', name: 'First Steps', description: 'Log in for the first time', icon: Star, rarity: 'common', xp: 50, category: 'general' },
  { id: 'profile-complete', name: 'Identity Forged', description: 'Complete your profile', icon: Users, rarity: 'common', xp: 100, category: 'general' },
  { id: 'first-theme', name: 'Dark Aesthetic', description: 'Apply your first theme', icon: Palette, rarity: 'common', xp: 75, category: 'general' },

  // Health & Wellness
  { id: 'health-tracker', name: 'Body Aware', description: 'Log health data 7 days in a row', icon: Heart, rarity: 'rare', xp: 200, category: 'health' },
  { id: 'medication-streak', name: 'Pill Perfect', description: 'Take medications on time for 30 days', icon: Shield, rarity: 'epic', xp: 500, category: 'health' },
  { id: 'spoon-master', name: 'Spoon Master', description: 'Manage spoons effectively for a week', icon: Zap, rarity: 'rare', xp: 250, category: 'health' },

  // Creative
  { id: 'first-art', name: 'Creative Spark', description: 'Complete your first art prompt', icon: Palette, rarity: 'common', xp: 75, category: 'creative' },
  { id: 'art-streak', name: 'Artist Soul', description: 'Create art 7 days in a row', icon: Sparkles, rarity: 'rare', xp: 300, category: 'creative' },
  { id: 'zine-creator', name: 'Zine Queen', description: 'Create 5 zine pages', icon: BookOpen, rarity: 'epic', xp: 400, category: 'creative' },

  // Spiritual
  { id: 'first-ritual', name: 'Spiritual Awakening', description: 'Complete your first ritual', icon: Moon, rarity: 'common', xp: 100, category: 'spiritual' },
  { id: 'altar-keeper', name: 'Altar Keeper', description: 'Tend your altar for 30 days', icon: Flame, rarity: 'epic', xp: 500, category: 'spiritual' },
  { id: 'moon-cycle', name: 'Lunar Devotee', description: 'Complete rituals in all moon phases', icon: Moon, rarity: 'legendary', xp: 750, category: 'spiritual' },

  // Financial
  { id: 'first-income', name: 'Money Flow', description: 'Track your first passive income', icon: DollarSign, rarity: 'common', xp: 100, category: 'financial' },
  { id: 'income-milestone', name: 'Prosperity Seed', description: 'Reach $100 passive income', icon: TrendingUp, rarity: 'rare', xp: 300, category: 'financial' },
  { id: 'income-master', name: 'Wealth Weaver', description: 'Build 5 income streams', icon: Crown, rarity: 'legendary', xp: 1000, category: 'financial' },

  // Streaks
  { id: 'streak-7', name: 'Week Warrior', description: '7-day login streak', icon: Flame, rarity: 'rare', xp: 200, category: 'streaks' },
  { id: 'streak-30', name: 'Month Master', description: '30-day login streak', icon: Flame, rarity: 'epic', xp: 500, category: 'streaks' },
  { id: 'streak-100', name: 'Century Club', description: '100-day login streak', icon: Flame, rarity: 'legendary', xp: 1500, category: 'streaks' },
  { id: 'streak-365', name: 'Year of Devotion', description: '365-day login streak', icon: Trophy, rarity: 'mythic', xp: 5000, category: 'streaks' },

  // Special
  { id: 'night-owl', name: 'Night Owl', description: 'Use the app after midnight 10 times', icon: Moon, rarity: 'rare', xp: 150, category: 'special' },
  { id: 'early-bird', name: 'Early Bird', description: 'Use the app before 6am 10 times', icon: Sun, rarity: 'rare', xp: 150, category: 'special' },
  { id: 'pet-lover', name: 'Pet Parent', description: 'Max out pet happiness', icon: Heart, rarity: 'epic', xp: 400, category: 'special' },
  { id: 'theme-collector', name: 'Theme Hoarder', description: 'Favorite 25 themes', icon: Palette, rarity: 'legendary', xp: 600, category: 'special' },
];

// Rewards by level
const rewards = [
  { level: 5, name: 'Purple Aura Theme', description: 'Exclusive purple theme unlock', icon: Palette, claimed: false },
  { level: 10, name: 'Shadow Cat Pet', description: 'Unlock the Shadow Cat companion', icon: Heart, claimed: false },
  { level: 15, name: 'Golden Crown Accessory', description: 'Crown for your pet', icon: Crown, claimed: false },
  { level: 20, name: 'Mystical Font Pack', description: '5 gothic fonts unlocked', icon: BookOpen, claimed: false },
  { level: 25, name: 'Spirit Wings', description: 'Wings accessory for pet', icon: Sparkles, claimed: false },
  { level: 30, name: 'Legendary Theme Pack', description: '10 exclusive themes', icon: Gem, claimed: false },
  { level: 50, name: 'Founder Badge', description: 'Show your dedication', icon: Trophy, claimed: false },
];

const categoryIcons: Record<string, React.ElementType> = {
  general: Star,
  health: Heart,
  creative: Palette,
  spiritual: Moon,
  financial: DollarSign,
  streaks: Flame,
  special: Sparkles,
};

export const AchievementSystem: React.FC = () => {
  const [userLevel, setUserLevel] = useState(12);
  const [userXP, setUserXP] = useState(2450);
  const [currentStreak, setCurrentStreak] = useState(23);
  const [longestStreak, setLongestStreak] = useState(47);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [unlockedAchievements, setUnlockedAchievements] = useState<Set<string>>(
    new Set(['first-login', 'profile-complete', 'first-theme', 'first-ritual', 'streak-7', 'first-art', 'night-owl'])
  );

  const xpToNextLevel = userLevel * 500;
  const currentLevelXP = userXP % xpToNextLevel;
  const xpProgress = (currentLevelXP / xpToNextLevel) * 100;

  const totalAchievements = achievements.length;
  const unlockedCount = unlockedAchievements.size;
  const totalXPEarned = achievements
    .filter(a => unlockedAchievements.has(a.id))
    .reduce((sum, a) => sum + a.xp, 0);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    achievements.forEach(a => cats.add(a.category));
    return Array.from(cats);
  }, []);

  const filteredAchievements = useMemo(() => {
    if (!selectedCategory) return achievements;
    return achievements.filter(a => a.category === selectedCategory);
  }, [selectedCategory]);

  const getRarityColor = (rarity: string) => {
    const colors: Record<string, string> = {
      common: '#9ca3af',
      rare: '#3b82f6',
      epic: '#8b5cf6',
      legendary: '#f59e0b',
      mythic: '#ec4899',
    };
    return colors[rarity] || colors.common;
  };

  return (
    <AchievementContainer>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
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
          }}
        >
          <Trophy size={36} style={{ marginRight: '12px', verticalAlign: 'middle', color: '#d4af37' }} />
          Achievement System
        </Typography>
        <Typography sx={{ color: '#9080a0', fontStyle: 'italic' }}>
          Your journey, your glory
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Level & XP */}
        <Grid item xs={12} md={4}>
          <GothicCard variant="elevated" ornate sx={{ textAlign: 'center' }}>
            <LevelBadge level={userLevel}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ color: '#fff', fontSize: '2rem', fontWeight: 700 }}>
                  {userLevel}
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.7rem' }}>
                  LEVEL
                </Typography>
              </Box>
            </LevelBadge>
            <Typography sx={{ color: '#e0e0e0', fontSize: '1.2rem', mt: 2, mb: 1 }}>
              {userLevel >= 50 ? 'Legendary' : userLevel >= 25 ? 'Epic' : userLevel >= 10 ? 'Rare' : 'Common'} Rank
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography sx={{ color: '#888888', fontSize: '0.85rem' }}>Experience</Typography>
                <Typography sx={{ color: '#8b5cf6', fontSize: '0.85rem' }}>
                  {currentLevelXP.toLocaleString()} / {xpToNextLevel.toLocaleString()} XP
                </Typography>
              </Box>
              <XPBar variant="determinate" value={xpProgress} />
            </Box>
            <Typography sx={{ color: '#888888', fontSize: '0.8rem' }}>
              Total XP Earned: {totalXPEarned.toLocaleString()}
            </Typography>
          </GothicCard>
        </Grid>

        {/* Streak */}
        <Grid item xs={12} md={4}>
          <StreakDisplay>
            <Flame size={48} color="#f97316" style={{ marginBottom: '12px', animation: `${pulse} 1s ease-in-out infinite` }} />
            <Typography sx={{ color: '#f97316', fontSize: '3rem', fontWeight: 700 }}>
              {currentStreak}
            </Typography>
            <Typography sx={{ color: '#fdba74', fontSize: '1.1rem', mb: 2 }}>
              Day Streak
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
              <Box>
                <Typography sx={{ color: '#888888', fontSize: '0.8rem' }}>Longest</Typography>
                <Typography sx={{ color: '#f59e0b' }}>{longestStreak} days</Typography>
              </Box>
              <Box>
                <Typography sx={{ color: '#888888', fontSize: '0.8rem' }}>Next Reward</Typography>
                <Typography sx={{ color: '#22c55e' }}>{30 - currentStreak} days</Typography>
              </Box>
            </Box>
          </StreakDisplay>
        </Grid>

        {/* Stats */}
        <Grid item xs={12} md={4}>
          <GothicCard variant="glass" sx={{ height: '100%' }}>
            <Typography sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif', fontSize: '1.2rem', mb: 3 }}>
              <Award size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Achievement Stats
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <Box sx={{ p: 2, background: 'rgba(139, 92, 246, 0.1)', borderRadius: '12px', textAlign: 'center' }}>
                <Medal size={24} color="#8b5cf6" />
                <Typography sx={{ color: '#8b5cf6', fontSize: '1.5rem', fontWeight: 700 }}>
                  {unlockedCount}
                </Typography>
                <Typography sx={{ color: '#888888', fontSize: '0.75rem' }}>Unlocked</Typography>
              </Box>
              <Box sx={{ p: 2, background: 'rgba(100, 100, 120, 0.1)', borderRadius: '12px', textAlign: 'center' }}>
                <Lock size={24} color="#888888" />
                <Typography sx={{ color: '#888888', fontSize: '1.5rem', fontWeight: 700 }}>
                  {totalAchievements - unlockedCount}
                </Typography>
                <Typography sx={{ color: '#888888', fontSize: '0.75rem' }}>Locked</Typography>
              </Box>
              <Box sx={{ p: 2, background: 'rgba(236, 72, 153, 0.1)', borderRadius: '12px', textAlign: 'center' }}>
                <Gem size={24} color="#ec4899" />
                <Typography sx={{ color: '#ec4899', fontSize: '1.5rem', fontWeight: 700 }}>
                  {achievements.filter(a => a.rarity === 'legendary' && unlockedAchievements.has(a.id)).length}
                </Typography>
                <Typography sx={{ color: '#888888', fontSize: '0.75rem' }}>Legendary</Typography>
              </Box>
              <Box sx={{ p: 2, background: 'rgba(34, 197, 94, 0.1)', borderRadius: '12px', textAlign: 'center' }}>
                <Target size={24} color="#22c55e" />
                <Typography sx={{ color: '#22c55e', fontSize: '1.5rem', fontWeight: 700 }}>
                  {Math.round((unlockedCount / totalAchievements) * 100)}%
                </Typography>
                <Typography sx={{ color: '#888888', fontSize: '0.75rem' }}>Complete</Typography>
              </Box>
            </Box>
          </GothicCard>
        </Grid>

        {/* Category Filters */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', mb: 2 }}>
            <Chip
              label="All"
              onClick={() => setSelectedCategory(null)}
              sx={{
                background: !selectedCategory ? 'rgba(212, 175, 55, 0.3)' : 'rgba(30, 30, 40, 0.6)',
                border: !selectedCategory ? '2px solid #d4af37' : '1px solid rgba(100, 100, 120, 0.3)',
                color: !selectedCategory ? '#d4af37' : '#888888',
                cursor: 'pointer',
              }}
            />
            {categories.map(category => {
              const Icon = categoryIcons[category] || Star;
              const count = achievements.filter(a => a.category === category && unlockedAchievements.has(a.id)).length;
              const total = achievements.filter(a => a.category === category).length;
              return (
                <Chip
                  key={category}
                  icon={<Icon size={14} />}
                  label={`${category} (${count}/${total})`}
                  onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                  sx={{
                    background: selectedCategory === category ? 'rgba(139, 92, 246, 0.3)' : 'rgba(30, 30, 40, 0.6)',
                    border: selectedCategory === category ? '2px solid #8b5cf6' : '1px solid rgba(100, 100, 120, 0.3)',
                    color: selectedCategory === category ? '#8b5cf6' : '#888888',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                  }}
                />
              );
            })}
          </Box>
        </Grid>

        {/* Achievements Grid */}
        <Grid item xs={12}>
          <Typography sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif', fontSize: '1.3rem', mb: 3 }}>
            <Medal size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Achievements
          </Typography>
          <Grid container spacing={2}>
            {filteredAchievements.map(achievement => {
              const isUnlocked = unlockedAchievements.has(achievement.id);
              const Icon = achievement.icon;
              return (
                <Grid item xs={6} sm={4} md={3} lg={2} key={achievement.id}>
                  <Tooltip
                    title={
                      <Box>
                        <Typography sx={{ fontWeight: 600 }}>{achievement.name}</Typography>
                        <Typography sx={{ fontSize: '0.85rem' }}>{achievement.description}</Typography>
                        <Typography sx={{ fontSize: '0.8rem', color: getRarityColor(achievement.rarity), mt: 1 }}>
                          {achievement.rarity.toUpperCase()} • {achievement.xp} XP
                        </Typography>
                      </Box>
                    }
                  >
                    <Box sx={{ textAlign: 'center' }}>
                      <AchievementBadge unlocked={isUnlocked} rarity={achievement.rarity}>
                        {isUnlocked ? (
                          <Icon size={32} color={getRarityColor(achievement.rarity)} />
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
                      </AchievementBadge>
                      <Typography
                        sx={{
                          color: isUnlocked ? '#e0e0e0' : '#666666',
                          fontSize: '0.75rem',
                          mt: 1,
                          fontWeight: isUnlocked ? 500 : 400,
                        }}
                      >
                        {achievement.name}
                      </Typography>
                    </Box>
                  </Tooltip>
                </Grid>
              );
            })}
          </Grid>
        </Grid>

        {/* Rewards */}
        <Grid item xs={12}>
          <GothicCard variant="elevated" ornate>
            <Typography sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif', fontSize: '1.3rem', mb: 3 }}>
              <Gift size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Level Rewards
            </Typography>
            <Grid container spacing={2}>
              {rewards.map(reward => {
                const isAvailable = userLevel >= reward.level;
                const Icon = reward.icon;
                return (
                  <Grid item xs={12} sm={6} md={4} key={reward.level}>
                    <RewardCard claimed={reward.claimed}>
                      <Box
                        sx={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '12px',
                          background: isAvailable ? 'rgba(212, 175, 55, 0.2)' : 'rgba(100, 100, 120, 0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {isAvailable ? (
                          <Icon size={24} color="#d4af37" />
                        ) : (
                          <Lock size={20} color="#666" />
                        )}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ color: isAvailable ? '#e0e0e0' : '#888888', fontWeight: 600 }}>
                          {reward.name}
                        </Typography>
                        <Typography sx={{ color: '#888888', fontSize: '0.8rem' }}>
                          {reward.description}
                        </Typography>
                        <Chip
                          size="small"
                          label={`Level ${reward.level}`}
                          sx={{
                            mt: 1,
                            height: '20px',
                            fontSize: '0.7rem',
                            background: isAvailable ? 'rgba(34, 197, 94, 0.2)' : 'rgba(100, 100, 120, 0.2)',
                            color: isAvailable ? '#22c55e' : '#888888',
                          }}
                        />
                      </Box>
                      {isAvailable && !reward.claimed && (
                        <GothicButton variant="primary" size="small">
                          Claim
                        </GothicButton>
                      )}
                      {reward.claimed && (
                        <Check size={20} color="#22c55e" />
                      )}
                    </RewardCard>
                  </Grid>
                );
              })}
            </Grid>
          </GothicCard>
        </Grid>
      </Grid>
    </AchievementContainer>
  );
};

export default AchievementSystem;
