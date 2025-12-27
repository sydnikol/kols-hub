import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  Chip,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  InputAdornment,
  LinearProgress,
  IconButton,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Music,
  Search,
  Sparkles,
  Headphones,
  Mic2,
  BookOpen,
  Heart,
  Users,
  Play,
  Radio,
  Volume2,
  Zap,
  CheckCircle2,
  Bookmark,
  Shuffle,
  X,
} from 'lucide-react';

// Import music data
import musicData from '../../data/music_ideas.json';

// Animations
const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const wave = keyframes`
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(1.5); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.3); }
  50% { box-shadow: 0 0 40px rgba(139, 92, 246, 0.6); }
`;

// Styled components
const PageContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #0a0812 0%, #1a1028 50%, #0d0d1a 100%)',
  padding: '24px',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '300px',
    background: 'radial-gradient(ellipse at center top, rgba(139, 92, 246, 0.2) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
});

const Header = styled(Box)({
  textAlign: 'center',
  marginBottom: '32px',
  position: 'relative',
  zIndex: 1,
});

const Title = styled(Typography)({
  fontSize: '2.5rem',
  fontWeight: 700,
  background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 50%, #c4b5fd 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginBottom: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '12px',
  '& svg': {
    animation: `${pulse} 2s ease-in-out infinite`,
  },
});

const Subtitle = styled(Typography)({
  color: 'rgba(167, 139, 250, 0.8)',
  fontSize: '1rem',
});

const SoundWaves = styled(Box)({
  display: 'flex',
  gap: '4px',
  justifyContent: 'center',
  marginTop: '16px',
  '& > div': {
    width: '4px',
    height: '20px',
    backgroundColor: '#8b5cf6',
    borderRadius: '2px',
    animation: `${wave} 1s ease-in-out infinite`,
  },
  '& > div:nth-of-type(2)': { animationDelay: '0.1s' },
  '& > div:nth-of-type(3)': { animationDelay: '0.2s' },
  '& > div:nth-of-type(4)': { animationDelay: '0.3s' },
  '& > div:nth-of-type(5)': { animationDelay: '0.4s' },
});

const SearchContainer = styled(Box)({
  maxWidth: '600px',
  margin: '0 auto 24px',
});

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(26, 16, 40, 0.8)',
    borderRadius: '16px',
    color: '#f0e6ff',
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
  '& .MuiInputAdornment-root svg': {
    color: '#8b5cf6',
  },
});

const CategoryContainer = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  justifyContent: 'center',
  marginBottom: '24px',
});

const CategoryChip = styled(Chip)<{ selected?: boolean; chipcolor?: string }>(({ selected, chipcolor }) => ({
  backgroundColor: selected ? chipcolor : 'rgba(26, 16, 40, 0.6)',
  color: selected ? '#0a0812' : chipcolor,
  border: `1px solid ${chipcolor}`,
  fontWeight: selected ? 600 : 400,
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: selected ? chipcolor : `${chipcolor}20`,
    transform: 'translateY(-2px)',
  },
}));

const StatsPanel = styled(Box)({
  display: 'flex',
  gap: '16px',
  justifyContent: 'center',
  flexWrap: 'wrap',
  marginBottom: '32px',
});

const StatCard = styled(Box)({
  background: 'linear-gradient(145deg, rgba(26, 16, 40, 0.8) 0%, rgba(13, 13, 26, 0.9) 100%)',
  borderRadius: '16px',
  padding: '16px 24px',
  border: '1px solid rgba(139, 92, 246, 0.2)',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  minWidth: '140px',
});

const StatNumber = styled(Typography)({
  fontSize: '1.5rem',
  fontWeight: 700,
  color: '#a78bfa',
});

const StatLabel = styled(Typography)({
  fontSize: '0.75rem',
  color: 'rgba(167, 139, 250, 0.7)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
});

const RandomButton = styled(Button)({
  background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
  color: '#fff',
  borderRadius: '20px',
  padding: '10px 24px',
  fontWeight: 600,
  marginBottom: '24px',
  '&:hover': {
    background: 'linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)',
    transform: 'scale(1.02)',
  },
});

const ActivityGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
  gap: '20px',
  maxWidth: '1400px',
  margin: '0 auto',
});

const ActivityCard = styled(Card)<{ energylevel?: string }>(({ energylevel }) => {
  const colors: Record<string, string> = {
    low: '#22c55e',
    medium: '#fbbf24',
    high: '#ef4444',
  };
  const color = colors[energylevel || 'low'] || colors.low;

  return {
    background: 'linear-gradient(145deg, rgba(26, 16, 40, 0.9) 0%, rgba(13, 13, 26, 0.95) 100%)',
    borderRadius: '20px',
    border: `1px solid ${color}30`,
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
      height: '3px',
      background: `linear-gradient(90deg, ${color}, ${color}80)`,
    },
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: `0 12px 40px ${color}20`,
      border: `1px solid ${color}50`,
    },
  };
});

const ActivityTitle = styled(Typography)({
  fontSize: '1.1rem',
  fontWeight: 600,
  color: '#f0e6ff',
  marginBottom: '8px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

const ActivityDescription = styled(Typography)({
  fontSize: '0.875rem',
  color: 'rgba(240, 230, 255, 0.7)',
  lineHeight: 1.5,
  marginBottom: '12px',
});

const TagContainer = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '6px',
  marginTop: '12px',
});

const ActivityTag = styled(Chip)({
  backgroundColor: 'rgba(139, 92, 246, 0.15)',
  color: '#a78bfa',
  fontSize: '0.7rem',
  height: '24px',
  border: '1px solid rgba(139, 92, 246, 0.3)',
});

const EnergyBadge = styled(Box)<{ level?: string }>(({ level }) => {
  const colors: Record<string, { bg: string; text: string }> = {
    low: { bg: 'rgba(34, 197, 94, 0.2)', text: '#22c55e' },
    medium: { bg: 'rgba(251, 191, 36, 0.2)', text: '#fbbf24' },
    high: { bg: 'rgba(239, 68, 68, 0.2)', text: '#ef4444' },
  };
  const style = colors[level || 'low'] || colors.low;

  return {
    backgroundColor: style.bg,
    color: style.text,
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '0.7rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    border: `1px solid ${style.text}40`,
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  };
});

const CompletedBadge = styled(Box)({
  position: 'absolute',
  top: '12px',
  right: '12px',
  backgroundColor: 'rgba(34, 197, 94, 0.2)',
  color: '#22c55e',
  padding: '4px 8px',
  borderRadius: '8px',
  fontSize: '0.7rem',
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  border: '1px solid rgba(34, 197, 94, 0.3)',
});

const DialogStyled = styled(Dialog)({
  '& .MuiDialog-paper': {
    backgroundColor: '#1a1028',
    borderRadius: '24px',
    border: '1px solid rgba(139, 92, 246, 0.3)',
    maxWidth: '600px',
    width: '100%',
  },
});

// Types
interface MusicActivity {
  id: string;
  category: string;
  title: string;
  description: string;
  energy_level: string;
  tags: string[];
}

// Category configuration
const categories = [
  { id: 'all', name: 'All Activities', icon: Sparkles, color: '#d4af37' },
  { id: 'Listening', name: 'Listening', icon: Headphones, color: '#8b5cf6' },
  { id: 'Creation', name: 'Creation', icon: Mic2, color: '#ec4899' },
  { id: 'Learning', name: 'Learning', icon: BookOpen, color: '#3b82f6' },
  { id: 'Practice', name: 'Practice', icon: Play, color: '#22c55e' },
  { id: 'Discovery', name: 'Discovery', icon: Radio, color: '#f59e0b' },
  { id: 'Social', name: 'Social', icon: Users, color: '#06b6d4' },
  { id: 'Wellness', name: 'Wellness', icon: Heart, color: '#ef4444' },
];

export const MusicActivityHub: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedEnergy, setSelectedEnergy] = useState<string | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<MusicActivity | null>(null);
  const [completedActivities, setCompletedActivities] = useState<Set<string>>(new Set());
  const [bookmarkedActivities, setBookmarkedActivities] = useState<Set<string>>(new Set());

  const activities: MusicActivity[] = musicData.items;

  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      const matchesSearch =
        searchQuery === '' ||
        activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'all' || activity.category === selectedCategory;

      const matchesEnergy = !selectedEnergy || activity.energy_level === selectedEnergy;

      return matchesSearch && matchesCategory && matchesEnergy;
    });
  }, [activities, searchQuery, selectedCategory, selectedEnergy]);

  const stats = useMemo(() => {
    return {
      total: activities.length,
      completed: completedActivities.size,
      bookmarked: bookmarkedActivities.size,
      lowEnergy: activities.filter((a) => a.energy_level === 'low').length,
    };
  }, [activities, completedActivities, bookmarkedActivities]);

  const getRandomActivity = useCallback(() => {
    const available = filteredActivities.filter((a) => !completedActivities.has(a.id));
    if (available.length > 0) {
      const random = available[Math.floor(Math.random() * available.length)];
      setSelectedActivity(random);
    }
  }, [filteredActivities, completedActivities]);

  const toggleCompleted = useCallback((activityId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCompletedActivities((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(activityId)) {
        newSet.delete(activityId);
      } else {
        newSet.add(activityId);
      }
      return newSet;
    });
  }, []);

  const toggleBookmarked = useCallback((activityId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setBookmarkedActivities((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(activityId)) {
        newSet.delete(activityId);
      } else {
        newSet.add(activityId);
      }
      return newSet;
    });
  }, []);

  const getCategoryIcon = (categoryName: string) => {
    const cat = categories.find((c) => c.id === categoryName);
    return cat ? cat.icon : Music;
  };

  const getCategoryColor = (categoryName: string) => {
    const cat = categories.find((c) => c.id === categoryName);
    return cat ? cat.color : '#8b5cf6';
  };

  return (
    <PageContainer>
      <Header>
        <Title variant="h1">
          <Music size={36} />
          Music Activity Hub
        </Title>
        <Subtitle>100+ ways to enjoy, create, and discover music</Subtitle>
        <SoundWaves>
          <div /><div /><div /><div /><div />
        </SoundWaves>
      </Header>

      <StatsPanel>
        <StatCard>
          <Music size={24} color="#8b5cf6" />
          <Box>
            <StatNumber>{stats.total}</StatNumber>
            <StatLabel>Activities</StatLabel>
          </Box>
        </StatCard>
        <StatCard>
          <CheckCircle2 size={24} color="#22c55e" />
          <Box>
            <StatNumber>{stats.completed}</StatNumber>
            <StatLabel>Completed</StatLabel>
          </Box>
        </StatCard>
        <StatCard>
          <Bookmark size={24} color="#fbbf24" />
          <Box>
            <StatNumber>{stats.bookmarked}</StatNumber>
            <StatLabel>Saved</StatLabel>
          </Box>
        </StatCard>
        <StatCard>
          <Zap size={24} color="#22c55e" />
          <Box>
            <StatNumber>{stats.lowEnergy}</StatNumber>
            <StatLabel>Low Energy</StatLabel>
          </Box>
        </StatCard>
      </StatsPanel>

      <Box sx={{ textAlign: 'center' }}>
        <RandomButton onClick={getRandomActivity} startIcon={<Shuffle size={18} />}>
          Random Activity
        </RandomButton>
      </Box>

      <SearchContainer>
        <StyledTextField
          fullWidth
          placeholder="Search activities, genres, or techniques..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} />
              </InputAdornment>
            ),
          }}
        />
      </SearchContainer>

      <CategoryContainer>
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <CategoryChip
              key={category.id}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Icon size={14} />
                  {category.name}
                </Box>
              }
              selected={selectedCategory === category.id}
              chipcolor={category.color}
              onClick={() => setSelectedCategory(category.id)}
            />
          );
        })}
      </CategoryContainer>

      <Box sx={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '24px' }}>
        {['low', 'medium', 'high'].map((energy) => (
          <Chip
            key={energy}
            label={`${energy} energy`}
            icon={<Zap size={12} />}
            onClick={() => setSelectedEnergy(selectedEnergy === energy ? null : energy)}
            sx={{
              backgroundColor: selectedEnergy === energy
                ? (energy === 'low' ? '#22c55e' : energy === 'medium' ? '#fbbf24' : '#ef4444')
                : 'rgba(26, 16, 40, 0.6)',
              color: selectedEnergy === energy ? '#0a0812' : (energy === 'low' ? '#22c55e' : energy === 'medium' ? '#fbbf24' : '#ef4444'),
              border: `1px solid ${energy === 'low' ? '#22c55e' : energy === 'medium' ? '#fbbf24' : '#ef4444'}`,
              '& .MuiChip-icon': {
                color: selectedEnergy === energy ? '#0a0812' : (energy === 'low' ? '#22c55e' : energy === 'medium' ? '#fbbf24' : '#ef4444'),
              },
            }}
          />
        ))}
      </Box>

      <Typography
        sx={{
          textAlign: 'center',
          color: 'rgba(240, 230, 255, 0.6)',
          marginBottom: '20px',
          fontSize: '0.9rem',
        }}
      >
        Showing {filteredActivities.length} of {activities.length} activities
      </Typography>

      <ActivityGrid>
        {filteredActivities.map((activity) => {
          const isCompleted = completedActivities.has(activity.id);
          const isBookmarked = bookmarkedActivities.has(activity.id);
          const CategoryIcon = getCategoryIcon(activity.category);

          return (
            <ActivityCard
              key={activity.id}
              energylevel={activity.energy_level}
              onClick={() => setSelectedActivity(activity)}
            >
              {isCompleted && (
                <CompletedBadge>
                  <CheckCircle2 size={12} />
                  Done
                </CompletedBadge>
              )}
              <CardContent sx={{ padding: '20px' }}>
                <ActivityTitle>
                  <CategoryIcon size={18} color={getCategoryColor(activity.category)} />
                  {activity.title}
                </ActivityTitle>

                <Box sx={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                  <EnergyBadge level={activity.energy_level}>
                    <Zap size={10} />
                    {activity.energy_level}
                  </EnergyBadge>
                  <Chip
                    size="small"
                    label={activity.category}
                    sx={{
                      backgroundColor: `${getCategoryColor(activity.category)}20`,
                      color: getCategoryColor(activity.category),
                      fontSize: '0.7rem',
                      height: '24px',
                      border: `1px solid ${getCategoryColor(activity.category)}40`,
                    }}
                  />
                  {isBookmarked && (
                    <Bookmark size={16} color="#fbbf24" fill="#fbbf24" />
                  )}
                </Box>

                <ActivityDescription>{activity.description}</ActivityDescription>

                <TagContainer>
                  {activity.tags.slice(0, 3).map((tag) => (
                    <ActivityTag key={tag} label={tag} size="small" />
                  ))}
                </TagContainer>
              </CardContent>
            </ActivityCard>
          );
        })}
      </ActivityGrid>

      {/* Activity Detail Dialog */}
      <DialogStyled
        open={!!selectedActivity}
        onClose={() => setSelectedActivity(null)}
        maxWidth="md"
      >
        {selectedActivity && (
          <>
            <DialogTitle
              sx={{
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(168, 85, 247, 0.1) 100%)',
                color: '#f0e6ff',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Music size={24} color="#8b5cf6" />
                {selectedActivity.title}
              </Box>
              <IconButton onClick={() => setSelectedActivity(null)} sx={{ color: '#f0e6ff' }}>
                <X size={20} />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ padding: '24px' }}>
              <Box sx={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <EnergyBadge level={selectedActivity.energy_level}>
                  <Zap size={12} />
                  {selectedActivity.energy_level} energy
                </EnergyBadge>
                <Chip
                  label={selectedActivity.category}
                  sx={{
                    backgroundColor: `${getCategoryColor(selectedActivity.category)}20`,
                    color: getCategoryColor(selectedActivity.category),
                    border: `1px solid ${getCategoryColor(selectedActivity.category)}40`,
                  }}
                />
              </Box>

              <Typography
                sx={{
                  color: 'rgba(240, 230, 255, 0.9)',
                  fontSize: '1rem',
                  lineHeight: 1.7,
                  marginBottom: '24px',
                }}
              >
                {selectedActivity.description}
              </Typography>

              <Box sx={{ marginBottom: '20px' }}>
                <Typography sx={{ color: '#a78bfa', fontWeight: 600, marginBottom: '12px' }}>
                  Tags
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {selectedActivity.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      sx={{
                        backgroundColor: 'rgba(139, 92, 246, 0.15)',
                        color: '#a78bfa',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </DialogContent>
            <DialogActions sx={{ padding: '16px 24px', borderTop: '1px solid rgba(139, 92, 246, 0.2)' }}>
              <Button
                variant="outlined"
                onClick={(e) => toggleBookmarked(selectedActivity.id, e)}
                startIcon={<Bookmark size={18} fill={bookmarkedActivities.has(selectedActivity.id) ? '#fbbf24' : 'none'} />}
                sx={{
                  borderColor: '#fbbf24',
                  color: '#fbbf24',
                  '&:hover': { borderColor: '#f59e0b', backgroundColor: 'rgba(251, 191, 36, 0.1)' },
                }}
              >
                {bookmarkedActivities.has(selectedActivity.id) ? 'Saved' : 'Save'}
              </Button>
              <Button
                variant="contained"
                onClick={(e) => {
                  toggleCompleted(selectedActivity.id, e);
                  setSelectedActivity(null);
                }}
                startIcon={completedActivities.has(selectedActivity.id) ? <X size={18} /> : <CheckCircle2 size={18} />}
                sx={{
                  backgroundColor: completedActivities.has(selectedActivity.id) ? '#6b7280' : '#22c55e',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: completedActivities.has(selectedActivity.id) ? '#4b5563' : '#16a34a',
                  },
                }}
              >
                {completedActivities.has(selectedActivity.id) ? 'Mark Incomplete' : 'Mark Complete'}
              </Button>
            </DialogActions>
          </>
        )}
      </DialogStyled>
    </PageContainer>
  );
};

export default MusicActivityHub;
