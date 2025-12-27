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
  Slider,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Search,
  Moon,
  Sun,
  Cloud,
  Sparkles,
  Clock,
  X,
  Star,
  Coffee,
  Wind,
  Zap,
  CheckCircle2,
  BedDouble,
  Lamp,
  ThermometerSnowflake,
  Volume2,
} from 'lucide-react';

const twinkle = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const PageContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #0a0812 0%, #0d1033 50%, #1a0a2e 100%)',
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
  background: 'linear-gradient(135deg, #818cf8 0%, #a78bfa 50%, #c4b5fd 100%)',
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

const SleepMeter = styled(Box)({
  background: 'linear-gradient(145deg, rgba(26, 16, 64, 0.8) 0%, rgba(13, 16, 51, 0.9) 100%)',
  borderRadius: '20px',
  padding: '24px',
  marginBottom: '24px',
  border: '1px solid rgba(129, 140, 248, 0.3)',
});

const StyledSlider = styled(Slider)({
  color: '#818cf8',
  '& .MuiSlider-thumb': {
    backgroundColor: '#c4b5fd',
    '&:hover, &.Mui-focusVisible': { boxShadow: '0 0 0 8px rgba(196, 181, 253, 0.2)' },
  },
  '& .MuiSlider-track': { background: 'linear-gradient(90deg, #312e81, #6366f1, #a78bfa)' },
  '& .MuiSlider-rail': { backgroundColor: 'rgba(129, 140, 248, 0.3)' },
});

const SearchContainer = styled(Box)({
  maxWidth: '600px',
  margin: '0 auto 24px',
});

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(129, 140, 248, 0.1)',
    borderRadius: '12px',
    '& fieldset': { borderColor: 'rgba(129, 140, 248, 0.3)' },
    '&:hover fieldset': { borderColor: '#818cf8' },
    '&.Mui-focused fieldset': { borderColor: '#a78bfa' },
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
  backgroundColor: selected ? chipcolor || '#818cf8' : 'rgba(129, 140, 248, 0.15)',
  color: selected ? '#fff' : '#c4b5fd',
  border: `1px solid ${selected ? chipcolor || '#818cf8' : 'rgba(129, 140, 248, 0.3)'}`,
  '&:hover': { backgroundColor: selected ? chipcolor : 'rgba(129, 140, 248, 0.25)' },
  transition: 'all 0.3s ease',
}));

const IdeasGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: '20px',
  maxWidth: '1400px',
  margin: '0 auto',
});

const IdeaCard = styled(Box)<{ completed?: boolean }>(({ completed }) => ({
  background: 'linear-gradient(145deg, rgba(26, 16, 64, 0.9) 0%, rgba(13, 16, 51, 0.95) 100%)',
  borderRadius: '16px',
  padding: '20px',
  border: `1px solid ${completed ? 'rgba(34, 197, 94, 0.4)' : 'rgba(129, 140, 248, 0.3)'}`,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  opacity: completed ? 0.8 : 1,
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 40px rgba(129, 140, 248, 0.2)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '3px',
    background: 'linear-gradient(90deg, #312e81, #6366f1, #a78bfa)',
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
  color: level === 'easy' ? '#4ade80' : level === 'medium' ? '#facc15' : '#f87171',
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
  backgroundColor: 'rgba(129, 140, 248, 0.15)',
  color: '#c4b5fd',
  border: '1px solid rgba(129, 140, 248, 0.2)',
});

const StyledDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    background: 'linear-gradient(145deg, #1a1040 0%, #0d1033 100%)',
    border: '1px solid rgba(129, 140, 248, 0.3)',
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
  background: 'linear-gradient(145deg, rgba(26, 16, 64, 0.8) 0%, rgba(13, 16, 51, 0.9) 100%)',
  borderRadius: '16px',
  marginBottom: '24px',
  flexWrap: 'wrap',
});

const StatItem = styled(Box)({ textAlign: 'center' });
const StatValue = styled(Typography)({ fontSize: '1.8rem', fontWeight: 700, color: '#a78bfa' });
const StatLabel = styled(Typography)({ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' });

const StarField = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  overflow: 'hidden',
  pointerEvents: 'none',
  '& .star': {
    position: 'absolute',
    width: '2px',
    height: '2px',
    backgroundColor: '#fff',
    borderRadius: '50%',
    animation: `${twinkle} 2s ease-in-out infinite`,
  },
});

const sleepIdeas = [
  { id: 'sleep_001', category: 'Wind Down Routine', title: '90-Minute Screen-Free Zone', description: 'Turn off all screens 90 minutes before bed. Blue light suppresses melatonin production.', difficulty: 'medium', tags: ['screen-free', 'routine', 'melatonin'] },
  { id: 'sleep_002', category: 'Wind Down Routine', title: 'Warm Bath or Shower', description: 'Take a warm bath 1-2 hours before bed. The drop in body temperature signals sleep time.', difficulty: 'easy', tags: ['bath', 'temperature', 'relaxation'] },
  { id: 'sleep_003', category: 'Wind Down Routine', title: 'Dim Lights Gradually', description: 'Start dimming household lights 2 hours before bed. Use warm-toned bulbs or candles.', difficulty: 'easy', tags: ['lighting', 'circadian', 'routine'] },
  { id: 'sleep_004', category: 'Wind Down Routine', title: 'Sleepy Time Tea Ritual', description: 'Brew chamomile, valerian root, or lavender tea 1 hour before bed.', difficulty: 'easy', tags: ['tea', 'herbal', 'ritual'] },
  { id: 'sleep_005', category: 'Wind Down Routine', title: 'Worry Journal Dump', description: 'Spend 10 minutes writing down worries and tomorrow\'s to-dos before bed.', difficulty: 'easy', tags: ['journaling', 'anxiety', 'mental-clearing'] },
  { id: 'sleep_006', category: 'Environment', title: 'Cool Room Temperature', description: 'Keep bedroom between 60-67°F (15-19°C). Cool temperatures promote deeper sleep.', difficulty: 'easy', tags: ['temperature', 'environment', 'comfort'] },
  { id: 'sleep_007', category: 'Environment', title: 'Blackout Curtains', description: 'Install blackout curtains or use a sleep mask. Complete darkness optimizes melatonin.', difficulty: 'easy', tags: ['darkness', 'curtains', 'melatonin'] },
  { id: 'sleep_008', category: 'Environment', title: 'White Noise Machine', description: 'Use white noise or nature sounds to mask disruptive noises.', difficulty: 'easy', tags: ['sound', 'white-noise', 'peaceful'] },
  { id: 'sleep_009', category: 'Environment', title: 'Lavender Aromatherapy', description: 'Use lavender essential oil in a diffuser or on pillow for calming effect.', difficulty: 'easy', tags: ['aromatherapy', 'lavender', 'calming'] },
  { id: 'sleep_010', category: 'Environment', title: 'Comfortable Bedding', description: 'Invest in quality mattress and pillows suited to your sleep position.', difficulty: 'medium', tags: ['bedding', 'comfort', 'investment'] },
  { id: 'sleep_011', category: 'Sleep Schedule', title: 'Consistent Wake Time', description: 'Wake at the same time daily, even weekends. Anchors your circadian rhythm.', difficulty: 'medium', tags: ['schedule', 'consistency', 'circadian'] },
  { id: 'sleep_012', category: 'Sleep Schedule', title: 'No Naps After 3 PM', description: 'Limit naps to 20 minutes and before 3 PM to avoid nighttime sleep disruption.', difficulty: 'medium', tags: ['naps', 'timing', 'energy'] },
  { id: 'sleep_013', category: 'Relaxation', title: '4-7-8 Breathing Technique', description: 'Inhale for 4 counts, hold for 7, exhale for 8. Natural tranquilizer for the nervous system.', difficulty: 'easy', tags: ['breathing', 'relaxation', 'technique'] },
  { id: 'sleep_014', category: 'Relaxation', title: 'Progressive Muscle Relaxation', description: 'Tense and release each muscle group from toes to head before sleep.', difficulty: 'easy', tags: ['muscles', 'relaxation', 'body'] },
  { id: 'sleep_015', category: 'Relaxation', title: 'Body Scan Meditation', description: 'Mentally scan your body for tension, consciously releasing each area.', difficulty: 'easy', tags: ['meditation', 'body-scan', 'awareness'] },
  { id: 'sleep_016', category: 'Habits', title: 'No Caffeine After 2 PM', description: 'Caffeine has a 6-hour half-life. Avoid coffee, tea, and soda after 2 PM.', difficulty: 'medium', tags: ['caffeine', 'timing', 'stimulants'] },
  { id: 'sleep_017', category: 'Habits', title: 'Light Dinner', description: 'Eat a light dinner 3-4 hours before bed. Heavy meals disrupt sleep quality.', difficulty: 'medium', tags: ['food', 'dinner', 'digestion'] },
  { id: 'sleep_018', category: 'Habits', title: 'Morning Sunlight Exposure', description: 'Get 10-30 minutes of sunlight within an hour of waking to set circadian rhythm.', difficulty: 'easy', tags: ['sunlight', 'morning', 'circadian'] },
  { id: 'sleep_019', category: 'Relaxation', title: 'Gentle Yoga Before Bed', description: 'Practice gentle, restorative yoga poses to prepare body for sleep.', difficulty: 'easy', tags: ['yoga', 'gentle', 'stretching'] },
  { id: 'sleep_020', category: 'Environment', title: 'Reserve Bed for Sleep Only', description: 'Only use bed for sleep and intimacy. Train your brain to associate bed with rest.', difficulty: 'medium', tags: ['association', 'habits', 'training'] },
];

const categories = [
  { id: 'all', name: 'All Tips', icon: Sparkles, color: '#d4af37' },
  { id: 'Wind Down Routine', name: 'Wind Down', icon: Moon, color: '#818cf8' },
  { id: 'Environment', name: 'Environment', icon: BedDouble, color: '#a78bfa' },
  { id: 'Sleep Schedule', name: 'Schedule', icon: Clock, color: '#6366f1' },
  { id: 'Relaxation', name: 'Relaxation', icon: Wind, color: '#c4b5fd' },
  { id: 'Habits', name: 'Habits', icon: Coffee, color: '#8b5cf6' },
];

export const SleepSanctuaryTracker: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedIdea, setSelectedIdea] = useState<typeof sleepIdeas[0] | null>(null);
  const [completedIdeas, setCompletedIdeas] = useState<Set<string>>(new Set());
  const [sleepQuality, setSleepQuality] = useState(7);

  const filteredIdeas = useMemo(() => {
    return sleepIdeas.filter(idea => {
      const matchesSearch = idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           idea.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || idea.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const stats = useMemo(() => ({
    total: sleepIdeas.length,
    completed: completedIdeas.size,
    avgQuality: sleepQuality,
  }), [completedIdeas, sleepQuality]);

  const handleComplete = (id: string) => {
    setCompletedIdeas(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const getCategoryIcon = (cat: string) => {
    const found = categories.find(c => c.id === cat || c.name === cat);
    return found?.icon || Sparkles;
  };

  return (
    <PageContainer>
      <Header>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 1 }}>
          <Moon size={40} color="#a78bfa" />
        </Box>
        <Title>Sleep Sanctuary Tracker</Title>
        <Subtitle>Create the perfect environment for restful, restorative sleep</Subtitle>
      </Header>

      <SleepMeter>
        <Typography sx={{ color: '#c4b5fd', textAlign: 'center', mb: 2, fontWeight: 600 }}>
          Last Night's Sleep Quality
        </Typography>
        <Box sx={{ px: 4 }}>
          <StyledSlider
            value={sleepQuality}
            onChange={(_, val) => setSleepQuality(val as number)}
            min={1}
            max={10}
            marks={[{ value: 1, label: '1' }, { value: 5, label: '5' }, { value: 10, label: '10' }]}
            sx={{ '& .MuiSlider-markLabel': { color: '#888' } }}
          />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 2, mt: 1 }}>
          <Typography sx={{ color: '#f87171', fontSize: '0.85rem' }}>Poor Sleep</Typography>
          <Typography sx={{ color: '#4ade80', fontSize: '0.85rem' }}>Excellent Sleep</Typography>
        </Box>
      </SleepMeter>

      <StatsBar>
        <StatItem>
          <StatValue>{stats.total}</StatValue>
          <StatLabel>Sleep Tips</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{stats.completed}</StatValue>
          <StatLabel>Habits Built</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{stats.avgQuality}/10</StatValue>
          <StatLabel>Sleep Quality</StatLabel>
        </StatItem>
      </StatsBar>

      <SearchContainer>
        <StyledTextField
          fullWidth
          placeholder="Search sleep tips..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start"><Search size={20} color="#818cf8" /></InputAdornment>,
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
        Showing {filteredIdeas.length} sleep tips
      </Typography>

      <IdeasGrid>
        {filteredIdeas.map((idea) => {
          const Icon = getCategoryIcon(idea.category);
          const isCompleted = completedIdeas.has(idea.id);

          return (
            <IdeaCard key={idea.id} completed={isCompleted} onClick={() => setSelectedIdea(idea)}>
              {isCompleted && (
                <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
                  <CheckCircle2 size={24} color="#22c55e" />
                </Box>
              )}

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box sx={{
                  width: 44, height: 44, borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(129, 140, 248, 0.3) 0%, rgba(167, 139, 250, 0.2) 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={22} color="#a78bfa" />
                </Box>
                <Box>
                  <Typography sx={{ color: '#818cf8', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                    {idea.category}
                  </Typography>
                  <CardTitle>{idea.title}</CardTitle>
                </Box>
              </Box>

              <CardDescription>{idea.description}</CardDescription>

              <DifficultyBadge level={idea.difficulty}>
                <Star size={12} />
                {idea.difficulty}
              </DifficultyBadge>

              <TagsContainer>
                {idea.tags.map((tag, idx) => <Tag key={idx}>{tag}</Tag>)}
              </TagsContainer>
            </IdeaCard>
          );
        })}
      </IdeasGrid>

      <StyledDialog open={!!selectedIdea} onClose={() => setSelectedIdea(null)}>
        {selectedIdea && (
          <>
            <DialogTitle sx={{ borderBottom: '1px solid rgba(129, 140, 248, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="overline" sx={{ color: '#818cf8' }}>{selectedIdea.category}</Typography>
                <Typography variant="h5" sx={{ color: '#fff', fontWeight: 600 }}>{selectedIdea.title}</Typography>
              </Box>
              <IconButton onClick={() => setSelectedIdea(null)} sx={{ color: '#888' }}><X size={24} /></IconButton>
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
              <Typography sx={{ color: '#e0e0e0', mb: 3, lineHeight: 1.7, fontSize: '1.05rem' }}>
                {selectedIdea.description}
              </Typography>

              <DifficultyBadge level={selectedIdea.difficulty} sx={{ mb: 3 }}>
                <Star size={14} />
                {selectedIdea.difficulty} to implement
              </DifficultyBadge>

              <Typography variant="subtitle2" sx={{ color: '#818cf8', mb: 1 }}>Related Topics:</Typography>
              <TagsContainer sx={{ mb: 3 }}>
                {selectedIdea.tags.map((tag, idx) => <Tag key={idx} sx={{ fontSize: '0.8rem', padding: '4px 12px' }}>{tag}</Tag>)}
              </TagsContainer>

              <Box sx={{ p: 2, background: 'rgba(129, 140, 248, 0.1)', borderRadius: '12px', border: '1px solid rgba(129, 140, 248, 0.2)' }}>
                <Typography sx={{ color: '#a78bfa', fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Moon size={18} />Sweet Dreams Tip
                </Typography>
                <Typography sx={{ color: '#a0a0a0', fontSize: '0.9rem' }}>
                  Consistency is key. Try this tip for at least 2 weeks before deciding if it works for you.
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(129, 140, 248, 0.2)' }}>
              <Button variant="outlined" onClick={() => setSelectedIdea(null)}
                sx={{ borderColor: 'rgba(129, 140, 248, 0.5)', color: '#818cf8', '&:hover': { borderColor: '#818cf8', backgroundColor: 'rgba(129, 140, 248, 0.1)' } }}>
                Close
              </Button>
              <Button variant="contained" onClick={() => { handleComplete(selectedIdea.id); setSelectedIdea(null); }}
                startIcon={completedIdeas.has(selectedIdea.id) ? <X size={18} /> : <CheckCircle2 size={18} />}
                sx={{ backgroundColor: completedIdeas.has(selectedIdea.id) ? '#ef4444' : '#22c55e', '&:hover': { backgroundColor: completedIdeas.has(selectedIdea.id) ? '#dc2626' : '#16a34a' } }}>
                {completedIdeas.has(selectedIdea.id) ? 'Remove Habit' : 'Add to Routine'}
              </Button>
            </DialogActions>
          </>
        )}
      </StyledDialog>
    </PageContainer>
  );
};

export default SleepSanctuaryTracker;
