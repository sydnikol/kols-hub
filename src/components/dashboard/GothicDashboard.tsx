// Gothic Dashboard
// Central hub showing quick stats from all systems with gothic styling

import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Grid, LinearProgress, Chip, IconButton, Tooltip, Avatar } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Home, Moon, Sun, Cloud, CloudRain, Snowflake, Wind,
  Heart, Star, Trophy, Flame, Sparkles, MessageCircle,
  Book, Music, Palette, Gamepad2, Users, Calendar,
  TrendingUp, CheckCircle2, Clock, Zap, RefreshCw,
  ChevronRight, Bell, Settings, Dog, Cat, Bird,
  ArrowRight, Gift, Target, Award, Crown
} from 'lucide-react';
import { GothicCard } from '../gothic/GothicCard';
import { GothicButton } from '../gothic/GothicButton';
import { achievementService } from '../../services/AchievementService';

// ==========================================
// Animations
// ==========================================

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.02); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 10px rgba(212, 175, 55, 0.3); }
  50% { box-shadow: 0 0 25px rgba(212, 175, 55, 0.6); }
`;

// ==========================================
// Styled Components
// ==========================================

const DashboardContainer = styled(Box)({
  padding: '24px',
  minHeight: '100vh',
  background: 'linear-gradient(180deg, rgba(10, 8, 18, 0.95) 0%, rgba(26, 16, 40, 0.9) 100%)',
});

const WelcomeSection = styled(Box)({
  marginBottom: '32px',
  textAlign: 'center',
});

const WelcomeTitle = styled(Typography)({
  fontFamily: '"Cinzel Decorative", "Cinzel", serif',
  fontSize: '2.5rem',
  background: 'linear-gradient(135deg, #d4af37 0%, #f5e6a3 50%, #d4af37 100%)',
  backgroundSize: '200% auto',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  animation: `${shimmer} 3s ease-in-out infinite`,
  marginBottom: '8px',
});

const AffirmationText = styled(Typography)({
  fontFamily: '"Cormorant Garamond", serif',
  fontSize: '1.2rem',
  fontStyle: 'italic',
  color: '#a78bfa',
  opacity: 0.9,
});

const WidgetCard = styled(GothicCard)({
  height: '100%',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(139, 92, 246, 0.2)',
  },
});

const StatValue = styled(Typography)({
  fontFamily: '"Cinzel", serif',
  fontSize: '2rem',
  fontWeight: 700,
  color: '#d4af37',
});

const StatLabel = styled(Typography)({
  fontFamily: '"Cormorant Garamond", serif',
  fontSize: '0.9rem',
  color: '#888888',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
});

const QuickNavItem = styled(Box)<{ color: string }>(({ color }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '16px',
  borderRadius: '12px',
  background: `${color}10`,
  border: `1px solid ${color}30`,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: `${color}20`,
    transform: 'translateX(8px)',
    '& .nav-arrow': {
      opacity: 1,
      transform: 'translateX(0)',
    },
  },
}));

const StreakBadge = styled(Box)({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 16px',
  borderRadius: '20px',
  background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.2), rgba(234, 88, 12, 0.3))',
  border: '1px solid rgba(249, 115, 22, 0.5)',
  animation: `${glow} 2s ease-in-out infinite`,
});

const PetAvatar = styled(Box)<{ mood: string }>(({ mood }) => ({
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  background: mood === 'happy'
    ? 'linear-gradient(135deg, #10b981, #34d399)'
    : mood === 'hungry'
    ? 'linear-gradient(135deg, #f97316, #fb923c)'
    : 'linear-gradient(135deg, #6366f1, #818cf8)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  animation: `${float} 3s ease-in-out infinite`,
  boxShadow: '0 4px 20px rgba(139, 92, 246, 0.3)',
}));

const MoodButton = styled(Box)<{ selected: boolean; moodColor: string }>(({ selected, moodColor }) => ({
  width: '50px',
  height: '50px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  background: selected ? `${moodColor}30` : 'rgba(30, 30, 40, 0.5)',
  border: selected ? `2px solid ${moodColor}` : '2px solid transparent',
  fontSize: '1.5rem',
  '&:hover': {
    background: `${moodColor}20`,
    transform: 'scale(1.1)',
  },
}));

const AchievementBadge = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px 16px',
  borderRadius: '12px',
  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(212, 175, 55, 0.1))',
  border: '1px solid rgba(212, 175, 55, 0.3)',
  marginBottom: '8px',
});

// ==========================================
// Types
// ==========================================

interface DailyAffirmation {
  text: string;
  category: string;
}

interface PetStatus {
  name: string;
  type: 'cat' | 'dog' | 'bird' | 'dragon';
  mood: 'happy' | 'hungry' | 'sleepy' | 'playful';
  energy: number;
  hunger: number;
}

interface WeatherInfo {
  condition: 'clear' | 'cloudy' | 'rain' | 'snow' | 'windy';
  temperature: number;
  isNight: boolean;
}

type MoodLevel = 'great' | 'good' | 'okay' | 'low' | 'struggling';

interface GothicDashboardProps {
  onNavigate?: (destination: string) => void;
  userName?: string;
}

// ==========================================
// Affirmations Data
// ==========================================

const affirmations: DailyAffirmation[] = [
  { text: "Today, I embrace my unique magic and let it shine.", category: "self-love" },
  { text: "I am worthy of rest, peace, and gentle moments.", category: "wellness" },
  { text: "My creativity flows freely through all that I do.", category: "creativity" },
  { text: "I honor my needs and set boundaries with grace.", category: "self-care" },
  { text: "Each small step forward is a victory worth celebrating.", category: "progress" },
  { text: "I am surrounded by beauty, even in the shadows.", category: "perspective" },
  { text: "My strength lies not in perfection, but in perseverance.", category: "resilience" },
  { text: "Today I choose peace over perfection.", category: "mindfulness" },
  { text: "I am exactly where I need to be right now.", category: "acceptance" },
  { text: "My existence brings light to those around me.", category: "connection" },
];

const moodEmojis: { level: MoodLevel; emoji: string; color: string; label: string }[] = [
  { level: 'great', emoji: '🌟', color: '#10b981', label: 'Great' },
  { level: 'good', emoji: '😊', color: '#22c55e', label: 'Good' },
  { level: 'okay', emoji: '😐', color: '#eab308', label: 'Okay' },
  { level: 'low', emoji: '😔', color: '#f97316', label: 'Low' },
  { level: 'struggling', emoji: '🌧️', color: '#ef4444', label: 'Struggling' },
];

// ==========================================
// Component
// ==========================================

export const GothicDashboard: React.FC<GothicDashboardProps> = ({
  onNavigate,
  userName = "Traveler"
}) => {
  // State
  const [todayAffirmation, setTodayAffirmation] = useState<DailyAffirmation | null>(null);
  const [currentMood, setCurrentMood] = useState<MoodLevel | null>(null);
  const [streakDays, setStreakDays] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const [recentAchievements, setRecentAchievements] = useState<any[]>([]);
  const [moodCheckedIn, setMoodCheckedIn] = useState(false);

  const [petStatus, setPetStatus] = useState<PetStatus>({
    name: 'Shadow',
    type: 'cat',
    mood: 'happy',
    energy: 80,
    hunger: 30,
  });

  const [weather, setWeather] = useState<WeatherInfo>({
    condition: 'clear',
    temperature: 72,
    isNight: false,
  });

  // Initialize data
  useEffect(() => {
    // Get today's affirmation (based on date for consistency)
    const today = new Date();
    const dayIndex = today.getDate() % affirmations.length;
    setTodayAffirmation(affirmations[dayIndex]);

    // Check if night time
    const hour = today.getHours();
    setWeather(prev => ({
      ...prev,
      isNight: hour < 6 || hour >= 20,
    }));

    // Load achievement data
    const achievementState = achievementService.getState();
    setStreakDays(achievementState.streakDays);
    setTotalPoints(achievementState.totalPoints);
    setLevel(achievementState.level);

    const recent = achievementService.getRecentUnlocks().slice(0, 3);
    setRecentAchievements(recent);

    // Check if already checked in today
    const lastMoodCheck = localStorage.getItem('gothic_last_mood_check');
    const todayStr = today.toISOString().split('T')[0];
    if (lastMoodCheck === todayStr) {
      const savedMood = localStorage.getItem('gothic_current_mood') as MoodLevel;
      if (savedMood) {
        setCurrentMood(savedMood);
        setMoodCheckedIn(true);
      }
    }
  }, []);

  // Handle mood check-in
  const handleMoodCheckIn = useCallback((mood: MoodLevel) => {
    setCurrentMood(mood);
    setMoodCheckedIn(true);

    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('gothic_last_mood_check', today);
    localStorage.setItem('gothic_current_mood', mood);

    // Could trigger achievements or integrations here
  }, []);

  // Refresh affirmation
  const refreshAffirmation = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * affirmations.length);
    setTodayAffirmation(affirmations[randomIndex]);
  }, []);

  // Get pet icon
  const getPetIcon = (type: string) => {
    switch (type) {
      case 'cat': return <Cat size={28} color="#fff" />;
      case 'dog': return <Dog size={28} color="#fff" />;
      case 'bird': return <Bird size={28} color="#fff" />;
      default: return <Sparkles size={28} color="#fff" />;
    }
  };

  // Get weather icon
  const getWeatherIcon = () => {
    if (weather.isNight) return <Moon size={24} color="#a78bfa" />;
    switch (weather.condition) {
      case 'rain': return <CloudRain size={24} color="#60a5fa" />;
      case 'snow': return <Snowflake size={24} color="#e0e7ff" />;
      case 'cloudy': return <Cloud size={24} color="#94a3b8" />;
      case 'windy': return <Wind size={24} color="#67e8f9" />;
      default: return <Sun size={24} color="#fbbf24" />;
    }
  };

  // Navigation items
  const quickNavItems = [
    { id: 'rooms', label: 'Explore Rooms', icon: Home, color: '#8b5cf6', description: '16 unique spaces' },
    { id: 'library', label: 'Library Study', icon: Book, color: '#d4af37', description: 'Knowledge awaits' },
    { id: 'games', label: 'Gaming Den', icon: Gamepad2, color: '#ec4899', description: 'Play & unwind' },
    { id: 'music', label: 'Music Room', icon: Music, color: '#10b981', description: 'Melodies & sounds' },
    { id: 'creative', label: 'Creative Studio', icon: Palette, color: '#f97316', description: 'Express yourself' },
    { id: 'social', label: 'Social Hub', icon: Users, color: '#06b6d4', description: 'Connect with others' },
  ];

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 6) return 'Mystical midnight greetings';
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    if (hour < 22) return 'Good evening';
    return 'Mystical midnight greetings';
  };

  return (
    <DashboardContainer>
      {/* Welcome Section */}
      <WelcomeSection>
        <WelcomeTitle>
          {getTimeGreeting()}, {userName}
        </WelcomeTitle>
        {todayAffirmation && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <AffirmationText>"{todayAffirmation.text}"</AffirmationText>
            <Tooltip title="New affirmation">
              <IconButton onClick={refreshAffirmation} sx={{ color: '#a78bfa', p: 0.5 }}>
                <RefreshCw size={16} />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </WelcomeSection>

      <Grid container spacing={3}>
        {/* Daily Streak */}
        <Grid item xs={12} md={4}>
          <WidgetCard variant="glass" sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography sx={{ fontFamily: '"Cinzel", serif', color: '#d4af37', fontSize: '1.1rem' }}>
                Daily Streak
              </Typography>
              <StreakBadge>
                <Flame size={18} color="#f97316" />
                <Typography sx={{ color: '#f97316', fontWeight: 700 }}>{streakDays} days</Typography>
              </StreakBadge>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Box>
                <StatValue>{level}</StatValue>
                <StatLabel>Level</StatLabel>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography sx={{ color: '#888', fontSize: '0.8rem' }}>Progress</Typography>
                  <Typography sx={{ color: '#d4af37', fontSize: '0.8rem' }}>{totalPoints} pts</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={achievementService.getLevelProgress()}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    background: 'rgba(139, 92, 246, 0.2)',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(90deg, #8b5cf6, #d4af37)',
                      borderRadius: 4,
                    },
                  }}
                />
              </Box>
            </Box>
          </WidgetCard>
        </Grid>

        {/* Pet Status */}
        <Grid item xs={12} md={4}>
          <WidgetCard variant="glass" sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography sx={{ fontFamily: '"Cinzel", serif', color: '#d4af37', fontSize: '1.1rem' }}>
                Pet Companion
              </Typography>
              <Chip
                label={petStatus.mood}
                size="small"
                sx={{
                  background: petStatus.mood === 'happy' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(139, 92, 246, 0.2)',
                  color: petStatus.mood === 'happy' ? '#10b981' : '#a78bfa',
                  fontFamily: '"Cormorant Garamond", serif',
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <PetAvatar mood={petStatus.mood}>
                {getPetIcon(petStatus.type)}
              </PetAvatar>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ color: '#e0e0e0', fontWeight: 600, mb: 1 }}>{petStatus.name}</Typography>
                <Box sx={{ mb: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography sx={{ color: '#888', fontSize: '0.75rem' }}>Energy</Typography>
                    <Typography sx={{ color: '#10b981', fontSize: '0.75rem' }}>{petStatus.energy}%</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={petStatus.energy}
                    sx={{
                      height: 4,
                      borderRadius: 2,
                      background: 'rgba(16, 185, 129, 0.2)',
                      '& .MuiLinearProgress-bar': { background: '#10b981', borderRadius: 2 },
                    }}
                  />
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography sx={{ color: '#888', fontSize: '0.75rem' }}>Hunger</Typography>
                    <Typography sx={{ color: '#f97316', fontSize: '0.75rem' }}>{petStatus.hunger}%</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={petStatus.hunger}
                    sx={{
                      height: 4,
                      borderRadius: 2,
                      background: 'rgba(249, 115, 22, 0.2)',
                      '& .MuiLinearProgress-bar': { background: '#f97316', borderRadius: 2 },
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </WidgetCard>
        </Grid>

        {/* Weather/Time Widget */}
        <Grid item xs={12} md={4}>
          <WidgetCard variant="glass" sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography sx={{ fontFamily: '"Cinzel", serif', color: '#d4af37', fontSize: '1.1rem' }}>
                {weather.isNight ? 'Night Sky' : 'Current Weather'}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {getWeatherIcon()}
                <Typography sx={{ color: '#e0e0e0', fontWeight: 600 }}>{weather.temperature}°</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ color: '#888', fontSize: '0.9rem', mb: 1 }}>
                  {weather.isNight
                    ? 'The mansion sleeps under starlight'
                    : 'A perfect day for exploration'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Clock size={14} color="#888" />
                    <Typography sx={{ color: '#a78bfa', fontSize: '0.85rem' }}>
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Calendar size={14} color="#888" />
                    <Typography sx={{ color: '#a78bfa', fontSize: '0.85rem' }}>
                      {new Date().toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </WidgetCard>
        </Grid>

        {/* Mood Check-in */}
        <Grid item xs={12} md={6}>
          <WidgetCard variant="glass" sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography sx={{ fontFamily: '"Cinzel", serif', color: '#d4af37', fontSize: '1.1rem' }}>
                {moodCheckedIn ? 'Today\'s Mood' : 'How are you feeling?'}
              </Typography>
              {moodCheckedIn && (
                <Chip
                  label="Checked in"
                  size="small"
                  icon={<CheckCircle2 size={14} />}
                  sx={{
                    background: 'rgba(16, 185, 129, 0.2)',
                    color: '#10b981',
                    '& .MuiChip-icon': { color: '#10b981' },
                  }}
                />
              )}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', py: 1 }}>
              {moodEmojis.map((mood) => (
                <Tooltip key={mood.level} title={mood.label}>
                  <MoodButton
                    selected={currentMood === mood.level}
                    moodColor={mood.color}
                    onClick={() => handleMoodCheckIn(mood.level)}
                  >
                    {mood.emoji}
                  </MoodButton>
                </Tooltip>
              ))}
            </Box>
            {currentMood && (
              <Typography
                sx={{
                  textAlign: 'center',
                  mt: 2,
                  color: moodEmojis.find(m => m.level === currentMood)?.color,
                  fontFamily: '"Cormorant Garamond", serif',
                  fontStyle: 'italic',
                }}
              >
                {currentMood === 'great' && "You're radiating positive energy today!"}
                {currentMood === 'good' && "A lovely mood for a lovely day."}
                {currentMood === 'okay' && "Every moment is a new beginning."}
                {currentMood === 'low' && "It's okay to take things slow. Be gentle with yourself."}
                {currentMood === 'struggling' && "You're not alone. Consider visiting the Apothecary for some self-care."}
              </Typography>
            )}
          </WidgetCard>
        </Grid>

        {/* Recent Achievements */}
        <Grid item xs={12} md={6}>
          <WidgetCard variant="glass" sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography sx={{ fontFamily: '"Cinzel", serif', color: '#d4af37', fontSize: '1.1rem' }}>
                Recent Achievements
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Trophy size={16} color="#d4af37" />
                <Typography sx={{ color: '#888', fontSize: '0.85rem' }}>
                  {achievementService.getUnlockedCount()}/{achievementService.getTotalCount()}
                </Typography>
              </Box>
            </Box>
            {recentAchievements.length > 0 ? (
              recentAchievements.map((achievement) => (
                <AchievementBadge key={achievement.id}>
                  <Award size={24} color="#d4af37" />
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ color: '#e0e0e0', fontSize: '0.95rem' }}>{achievement.name}</Typography>
                    <Typography sx={{ color: '#888', fontSize: '0.75rem' }}>{achievement.description}</Typography>
                  </Box>
                  <Chip
                    label={`+${achievement.points}`}
                    size="small"
                    sx={{ background: 'rgba(212, 175, 55, 0.2)', color: '#d4af37' }}
                  />
                </AchievementBadge>
              ))
            ) : (
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Star size={32} color="#888" style={{ marginBottom: 8 }} />
                <Typography sx={{ color: '#888', fontStyle: 'italic' }}>
                  Start exploring to unlock achievements!
                </Typography>
              </Box>
            )}
          </WidgetCard>
        </Grid>

        {/* Quick Navigation */}
        <Grid item xs={12}>
          <WidgetCard variant="glass" sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Typography sx={{ fontFamily: '"Cinzel", serif', color: '#d4af37', fontSize: '1.1rem' }}>
                Quick Navigation
              </Typography>
              <Zap size={18} color="#d4af37" />
            </Box>
            <Grid container spacing={2}>
              {quickNavItems.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item.id}>
                  <QuickNavItem color={item.color} onClick={() => onNavigate?.(item.id)}>
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: '12px',
                        background: `${item.color}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <item.icon size={22} color={item.color} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ color: '#e0e0e0', fontWeight: 600 }}>{item.label}</Typography>
                      <Typography sx={{ color: '#888', fontSize: '0.8rem' }}>{item.description}</Typography>
                    </Box>
                    <ChevronRight
                      className="nav-arrow"
                      size={18}
                      color={item.color}
                      style={{ opacity: 0, transform: 'translateX(-10px)', transition: 'all 0.3s ease' }}
                    />
                  </QuickNavItem>
                </Grid>
              ))}
            </Grid>
          </WidgetCard>
        </Grid>
      </Grid>
    </DashboardContainer>
  );
};

export default GothicDashboard;
