import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Chip,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  LinearProgress,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Search,
  Heart,
  MessageCircle,
  Calendar,
  Sparkles,
  Clock,
  X,
  Star,
  Coffee,
  Utensils,
  Map,
  Music,
  BookOpen,
  Camera,
  Zap,
  CheckCircle2,
  Shuffle,
} from 'lucide-react';

const heartbeat = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
`;

const PageContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #0a0812 0%, #1a1028 50%, #0d0d1a 100%)',
  padding: '24px',
  paddingBottom: '100px',
});

const Header = styled(Box)({
  textAlign: 'center',
  marginBottom: '32px',
});

const Title = styled(Typography)({
  fontSize: '2.5rem',
  fontWeight: 700,
  background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 50%, #d4af37 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginBottom: '8px',
  fontFamily: '"Cinzel", serif',
});

const Subtitle = styled(Typography)({
  color: '#a0a0a0',
  fontSize: '1rem',
});

const SearchContainer = styled(Box)({
  maxWidth: '600px',
  margin: '0 auto 24px',
});

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(236, 72, 153, 0.1)',
    borderRadius: '12px',
    '& fieldset': { borderColor: 'rgba(236, 72, 153, 0.3)' },
    '&:hover fieldset': { borderColor: '#ec4899' },
    '&.Mui-focused fieldset': { borderColor: '#f43f5e' },
  },
  '& .MuiInputBase-input': { color: '#fff' },
});

const CategoryChipsContainer = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  justifyContent: 'center',
  marginBottom: '24px',
});

const CategoryChip = styled(Chip)<{ selected?: boolean; chipcolor?: string }>(({ selected, chipcolor }) => ({
  backgroundColor: selected ? chipcolor || '#ec4899' : 'rgba(236, 72, 153, 0.15)',
  color: selected ? '#fff' : '#f9a8d4',
  border: `1px solid ${selected ? chipcolor || '#ec4899' : 'rgba(236, 72, 153, 0.3)'}`,
  '&:hover': { backgroundColor: selected ? chipcolor : 'rgba(236, 72, 153, 0.25)' },
  transition: 'all 0.3s ease',
}));

const ActivitiesGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: '20px',
  maxWidth: '1400px',
  margin: '0 auto',
});

const ActivityCard = styled(Box)<{ completed?: boolean }>(({ completed }) => ({
  background: 'linear-gradient(145deg, rgba(26, 16, 40, 0.9) 0%, rgba(13, 13, 26, 0.95) 100%)',
  borderRadius: '16px',
  padding: '20px',
  border: `1px solid ${completed ? 'rgba(34, 197, 94, 0.4)' : 'rgba(236, 72, 153, 0.3)'}`,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  opacity: completed ? 0.8 : 1,
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 40px rgba(236, 72, 153, 0.2)',
    border: '1px solid rgba(236, 72, 153, 0.5)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '3px',
    background: 'linear-gradient(90deg, #ec4899, #f43f5e, #d4af37)',
  },
}));

const CardTitle = styled(Typography)({
  fontSize: '1.1rem',
  fontWeight: 600,
  color: '#fff',
  marginBottom: '8px',
});

const CardDescription = styled(Typography)({
  fontSize: '0.85rem',
  color: '#a0a0a0',
  lineHeight: 1.5,
  marginBottom: '12px',
});

const EnergyBadge = styled(Box)<{ level?: string }>(({ level }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  padding: '4px 10px',
  borderRadius: '12px',
  fontSize: '0.75rem',
  fontWeight: 600,
  backgroundColor: level === 'low' ? 'rgba(34, 197, 94, 0.2)' :
                   level === 'medium' ? 'rgba(234, 179, 8, 0.2)' :
                   'rgba(239, 68, 68, 0.2)',
  color: level === 'low' ? '#4ade80' : level === 'medium' ? '#facc15' : '#f87171',
}));

const TagsContainer = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '6px',
  marginTop: '12px',
});

const Tag = styled(Box)({
  padding: '2px 8px',
  borderRadius: '8px',
  fontSize: '0.7rem',
  backgroundColor: 'rgba(236, 72, 153, 0.15)',
  color: '#f9a8d4',
  border: '1px solid rgba(236, 72, 153, 0.2)',
});

const StyledDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    background: 'linear-gradient(145deg, #1a1028 0%, #0d0d1a 100%)',
    border: '1px solid rgba(236, 72, 153, 0.3)',
    borderRadius: '20px',
    maxWidth: '600px',
    width: '100%',
  },
});

const StatsBar = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  gap: '32px',
  padding: '20px',
  background: 'linear-gradient(145deg, rgba(26, 16, 40, 0.8) 0%, rgba(13, 13, 26, 0.9) 100%)',
  borderRadius: '16px',
  marginBottom: '24px',
  flexWrap: 'wrap',
});

const StatItem = styled(Box)({ textAlign: 'center' });
const StatValue = styled(Typography)({ fontSize: '1.8rem', fontWeight: 700, color: '#ec4899' });
const StatLabel = styled(Typography)({ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' });

const RandomButton = styled(Button)({
  background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
  color: '#fff',
  borderRadius: '12px',
  padding: '12px 24px',
  fontWeight: 600,
  '&:hover': { background: 'linear-gradient(135deg, #db2777 0%, #e11d48 100%)' },
});

const partnerActivities = [
  { id: 'partner_001', category: 'Quality Time', title: 'Screen-Free Dinner', description: 'Have dinner together without phones or screens. Focus on conversation.', energy_level: 'low', tags: ['dinner', 'conversation', 'connection'] },
  { id: 'partner_002', category: 'Activities', title: 'Puzzle Night Together', description: 'Work on a jigsaw puzzle together. Collaborative low-key activity.', energy_level: 'low', tags: ['puzzle', 'collaborative', 'relaxing'] },
  { id: 'partner_003', category: 'Communication', title: 'Appreciation Sharing', description: 'Share three things you appreciate about each other daily.', energy_level: 'low', tags: ['appreciation', 'gratitude', 'positive'] },
  { id: 'partner_004', category: 'Adventure', title: 'Local Exploration Day', description: 'Explore a local area you\'ve never visited together.', energy_level: 'high', tags: ['exploration', 'local', 'adventure'] },
  { id: 'partner_005', category: 'Quality Time', title: 'Morning Coffee Ritual', description: 'Share morning coffee or tea time before the day begins.', energy_level: 'low', tags: ['morning', 'ritual', 'connection'] },
  { id: 'partner_006', category: 'Activities', title: 'Cook Together', description: 'Prepare a meal together. Share kitchen duties and enjoy the process.', energy_level: 'medium', tags: ['cooking', 'teamwork', 'food'] },
  { id: 'partner_007', category: 'Communication', title: 'Dream Sharing Session', description: 'Share dreams, goals, and hopes for the future with each other.', energy_level: 'low', tags: ['dreams', 'goals', 'future'] },
  { id: 'partner_008', category: 'Romance', title: 'Love Letter Exchange', description: 'Write each other love letters. Express feelings in writing.', energy_level: 'low', tags: ['letters', 'writing', 'romance'] },
  { id: 'partner_009', category: 'Quality Time', title: 'Movie Night at Home', description: 'Create a cozy movie night with snacks and comfortable setup.', energy_level: 'low', tags: ['movie', 'cozy', 'home'] },
  { id: 'partner_010', category: 'Activities', title: 'Board Game Evening', description: 'Play board games together. Competitive or cooperative.', energy_level: 'medium', tags: ['games', 'fun', 'play'] },
  { id: 'partner_011', category: 'Communication', title: 'Weekly Check-In', description: 'Schedule weekly relationship check-in conversations.', energy_level: 'medium', tags: ['check-in', 'communication', 'maintenance'] },
  { id: 'partner_012', category: 'Adventure', title: 'Day Trip Spontaneity', description: 'Take a spontaneous day trip somewhere nearby.', energy_level: 'high', tags: ['spontaneous', 'trip', 'adventure'] },
  { id: 'partner_013', category: 'Quality Time', title: 'Walk Together', description: 'Take daily or evening walks together. Simple connection time.', energy_level: 'medium', tags: ['walking', 'exercise', 'conversation'] },
  { id: 'partner_014', category: 'Activities', title: 'Learn Something New Together', description: 'Take a class or learn a skill together as partners.', energy_level: 'high', tags: ['learning', 'growth', 'together'] },
  { id: 'partner_015', category: 'Romance', title: 'Surprise Note Hiding', description: 'Hide love notes for your partner to find throughout the day.', energy_level: 'low', tags: ['notes', 'surprise', 'thoughtful'] },
  { id: 'partner_016', category: 'Quality Time', title: 'Reading Side by Side', description: 'Read in the same room together. Parallel activity, shared space.', energy_level: 'low', tags: ['reading', 'parallel', 'presence'] },
  { id: 'partner_017', category: 'Communication', title: 'Memory Sharing Night', description: 'Share favorite memories of your relationship journey.', energy_level: 'low', tags: ['memories', 'nostalgia', 'bonding'] },
  { id: 'partner_018', category: 'Adventure', title: 'Try New Restaurant', description: 'Explore a new restaurant or cuisine together.', energy_level: 'medium', tags: ['food', 'new', 'experience'] },
  { id: 'partner_019', category: 'Romance', title: 'Stargazing Date', description: 'Go stargazing together on a clear night.', energy_level: 'low', tags: ['stargazing', 'romantic', 'outdoors'] },
  { id: 'partner_020', category: 'Activities', title: 'Dance at Home', description: 'Dance together in your living room to favorite music.', energy_level: 'medium', tags: ['dancing', 'fun', 'music'] },
];

const categories = [
  { id: 'all', name: 'All Activities', icon: Sparkles, color: '#d4af37' },
  { id: 'Quality Time', name: 'Quality Time', icon: Coffee, color: '#ec4899' },
  { id: 'Activities', name: 'Activities', icon: Calendar, color: '#8b5cf6' },
  { id: 'Communication', name: 'Communication', icon: MessageCircle, color: '#06b6d4' },
  { id: 'Romance', name: 'Romance', icon: Heart, color: '#f43f5e' },
  { id: 'Adventure', name: 'Adventure', icon: Map, color: '#f97316' },
];

export const PartnerRelationshipHub: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedActivity, setSelectedActivity] = useState<typeof partnerActivities[0] | null>(null);
  const [completedActivities, setCompletedActivities] = useState<Set<string>>(new Set());

  const filteredActivities = useMemo(() => {
    return partnerActivities.filter(activity => {
      const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           activity.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || activity.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const stats = useMemo(() => ({
    total: partnerActivities.length,
    completed: completedActivities.size,
    streak: 5,
  }), [completedActivities]);

  const handleComplete = (id: string) => {
    setCompletedActivities(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const getRandomActivity = () => {
    const uncompleted = partnerActivities.filter(a => !completedActivities.has(a.id));
    if (uncompleted.length > 0) {
      const random = uncompleted[Math.floor(Math.random() * uncompleted.length)];
      setSelectedActivity(random);
    }
  };

  const getCategoryIcon = (cat: string) => {
    const found = categories.find(c => c.id === cat || c.name === cat);
    return found?.icon || Sparkles;
  };

  return (
    <PageContainer>
      <Header>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 1 }}>
          <Heart size={40} color="#ec4899" style={{ animation: `${heartbeat} 1.5s ease-in-out infinite` }} />
        </Box>
        <Title>Partner Relationship Hub</Title>
        <Subtitle>Nurture your connection with intentional activities and quality time</Subtitle>
      </Header>

      <StatsBar>
        <StatItem>
          <StatValue>{stats.total}</StatValue>
          <StatLabel>Total Activities</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{stats.completed}</StatValue>
          <StatLabel>Completed</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{stats.streak}</StatValue>
          <StatLabel>Week Streak</StatLabel>
        </StatItem>
      </StatsBar>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <RandomButton onClick={getRandomActivity} startIcon={<Shuffle size={20} />}>
          Random Date Idea
        </RandomButton>
      </Box>

      <SearchContainer>
        <StyledTextField
          fullWidth
          placeholder="Search activities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start"><Search size={20} color="#ec4899" /></InputAdornment>,
          }}
        />
      </SearchContainer>

      <CategoryChipsContainer>
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <CategoryChip
              key={cat.id}
              label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><Icon size={14} />{cat.name}</Box>}
              selected={selectedCategory === cat.id}
              chipcolor={cat.color}
              onClick={() => setSelectedCategory(cat.id)}
            />
          );
        })}
      </CategoryChipsContainer>

      <Typography sx={{ color: '#888', textAlign: 'center', mb: 3 }}>
        Showing {filteredActivities.length} activities
      </Typography>

      <ActivitiesGrid>
        {filteredActivities.map((activity) => {
          const Icon = getCategoryIcon(activity.category);
          const isCompleted = completedActivities.has(activity.id);

          return (
            <ActivityCard key={activity.id} completed={isCompleted} onClick={() => setSelectedActivity(activity)}>
              {isCompleted && (
                <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
                  <CheckCircle2 size={24} color="#22c55e" />
                </Box>
              )}

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box sx={{
                  width: 44, height: 44, borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.3) 0%, rgba(244, 63, 94, 0.2) 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={22} color="#ec4899" />
                </Box>
                <Box>
                  <Typography sx={{ color: '#ec4899', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                    {activity.category}
                  </Typography>
                  <CardTitle>{activity.title}</CardTitle>
                </Box>
              </Box>

              <CardDescription>{activity.description}</CardDescription>

              <EnergyBadge level={activity.energy_level}>
                <Zap size={12} />
                {activity.energy_level} energy
              </EnergyBadge>

              <TagsContainer>
                {activity.tags.map((tag, idx) => <Tag key={idx}>{tag}</Tag>)}
              </TagsContainer>
            </ActivityCard>
          );
        })}
      </ActivitiesGrid>

      <StyledDialog open={!!selectedActivity} onClose={() => setSelectedActivity(null)}>
        {selectedActivity && (
          <>
            <DialogTitle sx={{ borderBottom: '1px solid rgba(236, 72, 153, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="overline" sx={{ color: '#ec4899' }}>{selectedActivity.category}</Typography>
                <Typography variant="h5" sx={{ color: '#fff', fontWeight: 600 }}>{selectedActivity.title}</Typography>
              </Box>
              <IconButton onClick={() => setSelectedActivity(null)} sx={{ color: '#888' }}><X size={24} /></IconButton>
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
              <Typography sx={{ color: '#e0e0e0', mb: 3, lineHeight: 1.7, fontSize: '1.05rem' }}>
                {selectedActivity.description}
              </Typography>

              <EnergyBadge level={selectedActivity.energy_level} sx={{ mb: 3 }}>
                <Zap size={14} />
                {selectedActivity.energy_level} energy required
              </EnergyBadge>

              <Typography variant="subtitle2" sx={{ color: '#ec4899', mb: 1 }}>Tags:</Typography>
              <TagsContainer sx={{ mb: 3 }}>
                {selectedActivity.tags.map((tag, idx) => <Tag key={idx} sx={{ fontSize: '0.8rem', padding: '4px 12px' }}>{tag}</Tag>)}
              </TagsContainer>

              <Box sx={{ p: 2, background: 'rgba(236, 72, 153, 0.1)', borderRadius: '12px', border: '1px solid rgba(236, 72, 153, 0.2)' }}>
                <Typography sx={{ color: '#ec4899', fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Heart size={18} />Relationship Tip
                </Typography>
                <Typography sx={{ color: '#a0a0a0', fontSize: '0.9rem' }}>
                  The goal isn't perfection - it's presence. Being fully there for each other matters more than elaborate plans.
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(236, 72, 153, 0.2)' }}>
              <Button variant="outlined" onClick={() => setSelectedActivity(null)}
                sx={{ borderColor: 'rgba(139, 92, 246, 0.5)', color: '#8b5cf6', '&:hover': { borderColor: '#8b5cf6', backgroundColor: 'rgba(139, 92, 246, 0.1)' } }}>
                Close
              </Button>
              <Button variant="contained" onClick={() => { handleComplete(selectedActivity.id); setSelectedActivity(null); }}
                startIcon={completedActivities.has(selectedActivity.id) ? <X size={18} /> : <CheckCircle2 size={18} />}
                sx={{ backgroundColor: completedActivities.has(selectedActivity.id) ? '#ef4444' : '#22c55e', '&:hover': { backgroundColor: completedActivities.has(selectedActivity.id) ? '#dc2626' : '#16a34a' } }}>
                {completedActivities.has(selectedActivity.id) ? 'Mark Incomplete' : 'Mark Complete'}
              </Button>
            </DialogActions>
          </>
        )}
      </StyledDialog>
    </PageContainer>
  );
};

export default PartnerRelationshipHub;
