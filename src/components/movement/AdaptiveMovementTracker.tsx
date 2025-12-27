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
  Slider,
  IconButton,
  LinearProgress,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Search,
  Activity,
  Heart,
  Sparkles,
  Timer,
  Zap,
  Clock,
  X,
  Play,
  CheckCircle2,
  Flame,
  Moon,
  Sun,
  Coffee,
  Bed,
  TreePine,
  Dumbbell,
  Wind,
  Footprints,
  Armchair,
  Waves,
  Target,
  TrendingUp,
  Calendar,
} from 'lucide-react';

// Animation keyframes
const breathe = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
`;

// Styled Components
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
  background: 'linear-gradient(135deg, #22c55e 0%, #06b6d4 50%, #8b5cf6 100%)',
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

const SpoonTracker = styled(Box)({
  background: 'linear-gradient(145deg, rgba(26, 16, 40, 0.8) 0%, rgba(13, 13, 26, 0.9) 100%)',
  borderRadius: '20px',
  padding: '24px',
  marginBottom: '24px',
  border: '1px solid rgba(34, 197, 94, 0.3)',
});

const SpoonBar = styled(Box)({
  display: 'flex',
  gap: '8px',
  justifyContent: 'center',
  flexWrap: 'wrap',
  marginBottom: '16px',
});

const Spoon = styled(Box)<{ filled?: boolean }>(({ filled }) => ({
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  backgroundColor: filled ? '#22c55e' : 'rgba(34, 197, 94, 0.2)',
  border: '2px solid #22c55e',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  animation: filled ? `${breathe} 2s ease-in-out infinite` : 'none',
  '&:hover': {
    transform: 'scale(1.1)',
    backgroundColor: filled ? '#16a34a' : 'rgba(34, 197, 94, 0.3)',
  },
}));

const EnergySlider = styled(Slider)({
  color: '#22c55e',
  '& .MuiSlider-thumb': {
    backgroundColor: '#d4af37',
    '&:hover, &.Mui-focusVisible': {
      boxShadow: '0 0 0 8px rgba(212, 175, 55, 0.2)',
    },
  },
  '& .MuiSlider-track': {
    background: 'linear-gradient(90deg, #ef4444, #eab308, #22c55e)',
  },
  '& .MuiSlider-rail': {
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
  },
});

const SearchContainer = styled(Box)({
  maxWidth: '600px',
  margin: '0 auto 24px',
});

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: '12px',
    '& fieldset': {
      borderColor: 'rgba(139, 92, 246, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: '#8b5cf6',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#22c55e',
    },
  },
  '& .MuiInputBase-input': {
    color: '#fff',
  },
});

const CategoryChipsContainer = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  justifyContent: 'center',
  marginBottom: '24px',
});

const CategoryChip = styled(Chip)<{ selected?: boolean; chipcolor?: string }>(({ selected, chipcolor }) => ({
  backgroundColor: selected ? chipcolor || '#22c55e' : 'rgba(139, 92, 246, 0.15)',
  color: selected ? '#fff' : '#d4af37',
  border: `1px solid ${selected ? chipcolor || '#22c55e' : 'rgba(212, 175, 55, 0.3)'}`,
  '&:hover': {
    backgroundColor: selected ? chipcolor || '#22c55e' : 'rgba(139, 92, 246, 0.25)',
  },
  transition: 'all 0.3s ease',
}));

const MovementGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: '20px',
  maxWidth: '1400px',
  margin: '0 auto',
});

const MovementCard = styled(Box)<{ energylevel?: string; completed?: boolean }>(({ energylevel, completed }) => ({
  background: 'linear-gradient(145deg, rgba(26, 16, 40, 0.9) 0%, rgba(13, 13, 26, 0.95) 100%)',
  borderRadius: '16px',
  padding: '20px',
  border: `1px solid ${
    completed ? 'rgba(34, 197, 94, 0.5)' :
    energylevel === 'low' ? 'rgba(34, 197, 94, 0.3)' :
    energylevel === 'medium' ? 'rgba(234, 179, 8, 0.3)' :
    'rgba(239, 68, 68, 0.3)'
  }`,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  opacity: completed ? 0.8 : 1,
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: `0 10px 40px ${
      energylevel === 'low' ? 'rgba(34, 197, 94, 0.2)' :
      energylevel === 'medium' ? 'rgba(234, 179, 8, 0.2)' :
      'rgba(239, 68, 68, 0.2)'
    }`,
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '3px',
    background: completed ? '#22c55e' :
                energylevel === 'low' ? 'linear-gradient(90deg, #22c55e, #4ade80)' :
                energylevel === 'medium' ? 'linear-gradient(90deg, #eab308, #facc15)' :
                'linear-gradient(90deg, #ef4444, #f87171)',
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
  color: level === 'low' ? '#4ade80' :
         level === 'medium' ? '#facc15' :
         '#f87171',
}));

const DifficultyBadge = styled(Box)<{ level?: string }>(({ level }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  padding: '4px 10px',
  borderRadius: '12px',
  fontSize: '0.75rem',
  fontWeight: 600,
  backgroundColor: level === 'easy' ? 'rgba(34, 197, 94, 0.2)' :
                   level === 'medium' ? 'rgba(234, 179, 8, 0.2)' :
                   'rgba(239, 68, 68, 0.2)',
  color: level === 'easy' ? '#4ade80' :
         level === 'medium' ? '#facc15' :
         '#f87171',
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
  backgroundColor: 'rgba(34, 197, 94, 0.15)',
  color: '#4ade80',
  border: '1px solid rgba(34, 197, 94, 0.2)',
});

const StyledDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    background: 'linear-gradient(145deg, #1a1028 0%, #0d0d1a 100%)',
    border: '1px solid rgba(139, 92, 246, 0.3)',
    borderRadius: '20px',
    maxWidth: '600px',
    width: '100%',
  },
});

const StatsBar = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  gap: '24px',
  padding: '20px',
  background: 'linear-gradient(145deg, rgba(26, 16, 40, 0.8) 0%, rgba(13, 13, 26, 0.9) 100%)',
  borderRadius: '16px',
  marginBottom: '24px',
  flexWrap: 'wrap',
});

const StatItem = styled(Box)({
  textAlign: 'center',
});

const StatValue = styled(Typography)({
  fontSize: '1.8rem',
  fontWeight: 700,
  color: '#22c55e',
});

const StatLabel = styled(Typography)({
  fontSize: '0.8rem',
  color: '#888',
  textTransform: 'uppercase',
  letterSpacing: '1px',
});

const ProgressCard = styled(Box)({
  background: 'rgba(34, 197, 94, 0.1)',
  borderRadius: '12px',
  padding: '16px',
  marginBottom: '16px',
  border: '1px solid rgba(34, 197, 94, 0.2)',
});

// Data
const movementIdeas = [
  { id: 'move_001', category: 'Low Energy', title: 'Seated Neck Rolls', description: 'Gently roll your head in slow circles, 5 times each direction. Releases tension from screen time.', energy_level: 'low', difficulty: 'easy', duration: '2 min', tags: ['seated', 'stretching', 'neck', 'tension'] },
  { id: 'move_002', category: 'Low Energy', title: 'Ankle Alphabet', description: 'Lift one foot and draw the alphabet with your toes. Great for circulation and ankle mobility.', energy_level: 'low', difficulty: 'easy', duration: '3 min', tags: ['seated', 'circulation', 'ankles'] },
  { id: 'move_003', category: 'Low Energy', title: 'Diaphragmatic Breathing', description: 'Hand on belly, breathe so belly rises. 10 deep breaths. Movement for your internal organs.', energy_level: 'low', difficulty: 'easy', duration: '3 min', tags: ['breathing', 'relaxing', 'restorative'] },
  { id: 'move_004', category: 'Medium Energy', title: 'Standing March', description: 'March in place for 2 minutes. Lift knees to comfortable height. Gets blood flowing.', energy_level: 'medium', difficulty: 'easy', duration: '2 min', tags: ['standing', 'cardio', 'circulation'] },
  { id: 'move_005', category: 'Medium Energy', title: 'Wall Push-Ups', description: 'Stand arm\'s length from wall, do push-ups against it. 10-15 reps. Upper body without floor work.', energy_level: 'medium', difficulty: 'easy', duration: '2 min', tags: ['standing', 'strength', 'arms'] },
  { id: 'move_006', category: 'Medium Energy', title: 'Hip Circles', description: 'Hands on hips, circle hips like hula hoop. 10 times each direction.', energy_level: 'medium', difficulty: 'easy', duration: '2 min', tags: ['standing', 'hips', 'mobility'] },
  { id: 'move_007', category: 'High Energy', title: 'Dance Break', description: 'Put on favorite upbeat song, dance freely for 3-5 minutes. Best cardio is fun cardio.', energy_level: 'high', difficulty: 'easy', duration: '5 min', tags: ['dance', 'cardio', 'fun', 'mood-boost'] },
  { id: 'move_008', category: 'Yoga', title: 'Child\'s Pose', description: 'Knees wide, sit back on heels, reach arms forward. Rest forehead. 1-3 minutes.', energy_level: 'low', difficulty: 'easy', duration: '3 min', tags: ['yoga', 'restorative', 'hips', 'relaxing'] },
  { id: 'move_009', category: 'Yoga', title: 'Cat-Cow Flow', description: 'On hands and knees, alternate arching and rounding spine with breath. 1-2 minutes.', energy_level: 'low', difficulty: 'easy', duration: '2 min', tags: ['yoga', 'spine', 'breathing', 'gentle'] },
  { id: 'move_010', category: 'Yoga', title: 'Legs Up the Wall', description: 'Lie with legs vertical against wall. 5-15 minutes. Deeply restorative.', energy_level: 'low', difficulty: 'easy', duration: '10 min', tags: ['yoga', 'restorative', 'circulation'] },
  { id: 'move_011', category: 'Strength', title: 'Glute Bridges', description: 'Lie on back, feet flat, squeeze glutes to lift hips. 15-20 reps.', energy_level: 'medium', difficulty: 'easy', duration: '3 min', tags: ['glutes', 'back', 'strength'] },
  { id: 'move_012', category: 'Strength', title: 'Plank Hold', description: 'Hold plank position on hands or forearms. Start with 20-30 seconds, build up.', energy_level: 'medium', difficulty: 'medium', duration: '2 min', tags: ['core', 'strength', 'foundational'] },
  { id: 'move_013', category: 'Walking', title: '10-Minute Walk', description: 'Just 10 minutes of walking. Around the block, in a mall, or even in place.', energy_level: 'medium', difficulty: 'easy', duration: '10 min', tags: ['walking', 'cardio', 'accessible'] },
  { id: 'move_014', category: 'Walking', title: 'Nature Walk', description: 'Walk in a park or green space. Nature exposure adds mental health benefits.', energy_level: 'medium', difficulty: 'easy', duration: '20 min', tags: ['walking', 'nature', 'mental-health'] },
  { id: 'move_015', category: 'Chair Exercises', title: 'Seated Leg Lifts', description: 'Sit tall, straighten and lift one leg. Hold 5 seconds. 10 each leg.', energy_level: 'low', difficulty: 'easy', duration: '3 min', tags: ['seated', 'legs', 'accessible'] },
  { id: 'move_016', category: 'Chair Exercises', title: 'Chair Yoga Flow', description: 'Seated sun salutation variation. Arms up, fold forward, twist each side.', energy_level: 'low', difficulty: 'easy', duration: '5 min', tags: ['seated', 'yoga', 'accessible'] },
  { id: 'move_017', category: 'Chronic Illness Friendly', title: 'Bed Stretches', description: 'Stretch while still in bed - point/flex feet, knee hugs, gentle twists.', energy_level: 'low', difficulty: 'easy', duration: '5 min', tags: ['bed', 'gentle', 'morning', 'accessible'] },
  { id: 'move_018', category: 'Chronic Illness Friendly', title: 'Pacing Practice', description: 'Do 50% of what you think you can, rest, repeat. Builds without crashing.', energy_level: 'low', difficulty: 'easy', duration: 'varies', tags: ['pacing', 'sustainable', 'chronic-illness'] },
  { id: 'move_019', category: 'Balance', title: 'Single Leg Stand', description: 'Stand on one leg near wall for safety. 30 seconds each leg.', energy_level: 'low', difficulty: 'medium', duration: '2 min', tags: ['balance', 'standing', 'falls-prevention'] },
  { id: 'move_020', category: 'Morning Routine', title: 'Morning Stretch Sequence', description: 'Cat-cow, child\'s pose, downward dog, forward fold, arms overhead. Wake up the body.', energy_level: 'low', difficulty: 'easy', duration: '5 min', tags: ['stretching', 'morning', 'routine'] },
];

const categories = [
  { id: 'all', name: 'All Movements', icon: Activity, color: '#d4af37' },
  { id: 'Low Energy', name: 'Low Energy', icon: Moon, color: '#22c55e' },
  { id: 'Medium Energy', name: 'Medium Energy', icon: Sun, color: '#eab308' },
  { id: 'High Energy', name: 'High Energy', icon: Flame, color: '#ef4444' },
  { id: 'Yoga', name: 'Yoga', icon: Wind, color: '#8b5cf6' },
  { id: 'Strength', name: 'Strength', icon: Dumbbell, color: '#f97316' },
  { id: 'Walking', name: 'Walking', icon: Footprints, color: '#06b6d4' },
  { id: 'Chair Exercises', name: 'Chair', icon: Armchair, color: '#ec4899' },
  { id: 'Chronic Illness Friendly', name: 'Gentle', icon: Heart, color: '#a855f7' },
];

export const AdaptiveMovementTracker: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [spoonCount, setSpoonCount] = useState(5);
  const [selectedMovement, setSelectedMovement] = useState<typeof movementIdeas[0] | null>(null);
  const [completedMovements, setCompletedMovements] = useState<Set<string>>(new Set());
  const [totalMinutes, setTotalMinutes] = useState(0);

  const maxSpoons = 12;

  const filteredMovements = useMemo(() => {
    const spoonFilter = spoonCount <= 4 ? 'low' : spoonCount <= 8 ? 'medium' : 'high';

    return movementIdeas.filter(movement => {
      const matchesSearch = movement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           movement.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           movement.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || movement.category === selectedCategory;

      // Show appropriate movements for spoon level
      if (spoonFilter === 'low') {
        return matchesSearch && matchesCategory && movement.energy_level === 'low';
      } else if (spoonFilter === 'medium') {
        return matchesSearch && matchesCategory && (movement.energy_level === 'low' || movement.energy_level === 'medium');
      }
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, spoonCount]);

  const stats = useMemo(() => {
    const total = movementIdeas.length;
    const completed = completedMovements.size;
    const streak = 3; // Placeholder - would track actual streak
    return { total, completed, streak, totalMinutes };
  }, [completedMovements, totalMinutes]);

  const handleCompleteMovement = (movementId: string, duration: string) => {
    setCompletedMovements(prev => {
      const newSet = new Set(prev);
      if (newSet.has(movementId)) {
        newSet.delete(movementId);
        // Subtract minutes
        const mins = parseInt(duration) || 0;
        setTotalMinutes(prev => Math.max(0, prev - mins));
      } else {
        newSet.add(movementId);
        // Add minutes
        const mins = parseInt(duration) || 0;
        setTotalMinutes(prev => prev + mins);
      }
      return newSet;
    });
  };

  const getCategoryIcon = (categoryName: string) => {
    const category = categories.find(c => c.id === categoryName || c.name === categoryName);
    return category?.icon || Activity;
  };

  return (
    <PageContainer>
      <Header>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 1 }}>
          <Activity size={40} color="#22c55e" />
        </Box>
        <Title>Adaptive Movement Tracker</Title>
        <Subtitle>Gentle movement suggestions based on your current energy level</Subtitle>
      </Header>

      {/* Spoon Tracker */}
      <SpoonTracker>
        <Typography sx={{ color: '#d4af37', textAlign: 'center', mb: 2, fontWeight: 600 }}>
          How many spoons do you have today?
        </Typography>

        <SpoonBar>
          {Array.from({ length: maxSpoons }, (_, i) => (
            <Spoon
              key={i}
              filled={i < spoonCount}
              onClick={() => setSpoonCount(i + 1)}
            >
              {i < spoonCount && <Zap size={14} color="#fff" />}
            </Spoon>
          ))}
        </SpoonBar>

        <Box sx={{ px: 4 }}>
          <EnergySlider
            value={spoonCount}
            onChange={(_, value) => setSpoonCount(value as number)}
            min={1}
            max={12}
            marks={[
              { value: 1, label: '1' },
              { value: 4, label: '4' },
              { value: 8, label: '8' },
              { value: 12, label: '12' },
            ]}
            sx={{
              '& .MuiSlider-markLabel': { color: '#888' },
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mt: 2 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{ color: '#22c55e', fontWeight: 600 }}>
              {spoonCount <= 4 ? 'Low Energy' : spoonCount <= 8 ? 'Medium Energy' : 'High Energy'}
            </Typography>
            <Typography sx={{ color: '#888', fontSize: '0.85rem' }}>
              {spoonCount <= 4 ? 'Showing gentle movements only' :
               spoonCount <= 8 ? 'Showing low & medium intensity' :
               'All movements available'}
            </Typography>
          </Box>
        </Box>
      </SpoonTracker>

      {/* Progress */}
      <ProgressCard>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography sx={{ color: '#22c55e', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingUp size={18} />
            Today's Progress
          </Typography>
          <Typography sx={{ color: '#d4af37' }}>
            {stats.totalMinutes} minutes
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={Math.min((stats.totalMinutes / 30) * 100, 100)}
          sx={{
            height: 10,
            borderRadius: 5,
            backgroundColor: 'rgba(34, 197, 94, 0.2)',
            '& .MuiLinearProgress-bar': {
              backgroundColor: '#22c55e',
              borderRadius: 5,
            },
          }}
        />
        <Typography sx={{ color: '#888', fontSize: '0.8rem', mt: 1, textAlign: 'center' }}>
          Goal: 30 minutes of movement
        </Typography>
      </ProgressCard>

      <StatsBar>
        <StatItem>
          <StatValue>{stats.completed}</StatValue>
          <StatLabel>Completed Today</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{stats.totalMinutes}</StatValue>
          <StatLabel>Minutes Moved</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{stats.streak}</StatValue>
          <StatLabel>Day Streak</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{spoonCount}</StatValue>
          <StatLabel>Spoons Left</StatLabel>
        </StatItem>
      </StatsBar>

      <SearchContainer>
        <StyledTextField
          fullWidth
          placeholder="Search movements by type, body part, or duration..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} color="#22c55e" />
              </InputAdornment>
            ),
          }}
        />
      </SearchContainer>

      <CategoryChipsContainer>
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <CategoryChip
              key={category.id}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
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
      </CategoryChipsContainer>

      <Typography sx={{ color: '#888', textAlign: 'center', mb: 3 }}>
        Showing {filteredMovements.length} movements for your energy level
      </Typography>

      <MovementGrid>
        {filteredMovements.map((movement) => {
          const CategoryIcon = getCategoryIcon(movement.category);
          const isCompleted = completedMovements.has(movement.id);

          return (
            <MovementCard
              key={movement.id}
              energylevel={movement.energy_level}
              completed={isCompleted}
              onClick={() => setSelectedMovement(movement)}
            >
              {isCompleted && (
                <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
                  <CheckCircle2 size={24} color="#22c55e" />
                </Box>
              )}

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '12px',
                  background: `linear-gradient(135deg, ${
                    movement.energy_level === 'low' ? 'rgba(34, 197, 94, 0.3)' :
                    movement.energy_level === 'medium' ? 'rgba(234, 179, 8, 0.3)' :
                    'rgba(239, 68, 68, 0.3)'
                  } 0%, rgba(139, 92, 246, 0.2) 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <CategoryIcon size={22} color={
                    movement.energy_level === 'low' ? '#22c55e' :
                    movement.energy_level === 'medium' ? '#eab308' :
                    '#ef4444'
                  } />
                </Box>
                <Box>
                  <Typography sx={{ color: '#8b5cf6', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                    {movement.category}
                  </Typography>
                  <CardTitle>{movement.title}</CardTitle>
                </Box>
              </Box>

              <CardDescription>{movement.description}</CardDescription>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <EnergyBadge level={movement.energy_level}>
                  {movement.energy_level === 'low' ? <Moon size={12} /> :
                   movement.energy_level === 'medium' ? <Sun size={12} /> :
                   <Flame size={12} />}
                  {movement.energy_level}
                </EnergyBadge>
                <DifficultyBadge level={movement.difficulty}>
                  <Target size={12} />
                  {movement.difficulty}
                </DifficultyBadge>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#888' }}>
                  <Timer size={14} />
                  <Typography sx={{ fontSize: '0.8rem' }}>{movement.duration}</Typography>
                </Box>
              </Box>

              <TagsContainer>
                {movement.tags.slice(0, 4).map((tag, idx) => (
                  <Tag key={idx}>{tag}</Tag>
                ))}
              </TagsContainer>
            </MovementCard>
          );
        })}
      </MovementGrid>

      {/* Movement Detail Dialog */}
      <StyledDialog open={!!selectedMovement} onClose={() => setSelectedMovement(null)}>
        {selectedMovement && (
          <>
            <DialogTitle sx={{
              borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Box>
                <Typography variant="overline" sx={{ color: '#22c55e' }}>
                  {selectedMovement.category}
                </Typography>
                <Typography variant="h5" sx={{ color: '#fff', fontWeight: 600 }}>
                  {selectedMovement.title}
                </Typography>
              </Box>
              <IconButton onClick={() => setSelectedMovement(null)} sx={{ color: '#888' }}>
                <X size={24} />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
              <Typography sx={{ color: '#e0e0e0', mb: 3, lineHeight: 1.7, fontSize: '1.05rem' }}>
                {selectedMovement.description}
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                <EnergyBadge level={selectedMovement.energy_level}>
                  {selectedMovement.energy_level === 'low' ? <Moon size={14} /> :
                   selectedMovement.energy_level === 'medium' ? <Sun size={14} /> :
                   <Flame size={14} />}
                  {selectedMovement.energy_level} energy
                </EnergyBadge>
                <DifficultyBadge level={selectedMovement.difficulty}>
                  <Target size={14} />
                  {selectedMovement.difficulty}
                </DifficultyBadge>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#d4af37' }}>
                  <Timer size={16} />
                  <Typography>{selectedMovement.duration}</Typography>
                </Box>
              </Box>

              <Typography variant="subtitle2" sx={{ color: '#8b5cf6', mb: 1 }}>
                Benefits:
              </Typography>
              <TagsContainer sx={{ mb: 3 }}>
                {selectedMovement.tags.map((tag, idx) => (
                  <Tag key={idx} sx={{ fontSize: '0.8rem', padding: '4px 12px' }}>{tag}</Tag>
                ))}
              </TagsContainer>

              <Box sx={{
                p: 2,
                background: 'rgba(34, 197, 94, 0.1)',
                borderRadius: '12px',
                border: '1px solid rgba(34, 197, 94, 0.2)'
              }}>
                <Typography sx={{ color: '#22c55e', fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Heart size={18} />
                  Spoon-Friendly Tip
                </Typography>
                <Typography sx={{ color: '#a0a0a0', fontSize: '0.9rem' }}>
                  Listen to your body. It's okay to modify, take breaks, or stop early. Any movement counts, and rest is productive too.
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(139, 92, 246, 0.2)' }}>
              <Button
                variant="outlined"
                onClick={() => setSelectedMovement(null)}
                sx={{
                  borderColor: 'rgba(139, 92, 246, 0.5)',
                  color: '#8b5cf6',
                  '&:hover': {
                    borderColor: '#8b5cf6',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                  },
                }}
              >
                Close
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  handleCompleteMovement(selectedMovement.id, selectedMovement.duration);
                  setSelectedMovement(null);
                }}
                startIcon={completedMovements.has(selectedMovement.id) ? <X size={18} /> : <CheckCircle2 size={18} />}
                sx={{
                  backgroundColor: completedMovements.has(selectedMovement.id) ? '#ef4444' : '#22c55e',
                  '&:hover': {
                    backgroundColor: completedMovements.has(selectedMovement.id) ? '#dc2626' : '#16a34a',
                  },
                }}
              >
                {completedMovements.has(selectedMovement.id) ? 'Mark Incomplete' : 'Mark Complete'}
              </Button>
            </DialogActions>
          </>
        )}
      </StyledDialog>
    </PageContainer>
  );
};

export default AdaptiveMovementTracker;
