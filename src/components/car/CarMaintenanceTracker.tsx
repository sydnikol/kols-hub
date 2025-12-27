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
  Car,
  Search,
  Sparkles,
  Calendar,
  Clock,
  Wrench,
  Fuel,
  Thermometer,
  Shield,
  Eye,
  AlertTriangle,
  CheckCircle2,
  Timer,
  X,
  Gauge,
  Droplets,
} from 'lucide-react';

// Import car maintenance data
import carData from '../../data/car_maintenance_ideas.json';

// Animations
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
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
    background: 'radial-gradient(ellipse at center top, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
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
  background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 50%, #93c5fd 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginBottom: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '12px',
});

const Subtitle = styled(Typography)({
  color: 'rgba(96, 165, 250, 0.8)',
  fontSize: '1rem',
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
      borderColor: 'rgba(59, 130, 246, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(59, 130, 246, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#3b82f6',
    },
  },
  '& .MuiInputAdornment-root svg': {
    color: '#3b82f6',
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
  border: '1px solid rgba(59, 130, 246, 0.2)',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  minWidth: '140px',
});

const StatNumber = styled(Typography)({
  fontSize: '1.5rem',
  fontWeight: 700,
  color: '#60a5fa',
});

const StatLabel = styled(Typography)({
  fontSize: '0.75rem',
  color: 'rgba(96, 165, 250, 0.7)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
});

const ProgressSection = styled(Box)({
  background: 'linear-gradient(145deg, rgba(26, 16, 40, 0.8) 0%, rgba(13, 13, 26, 0.9) 100%)',
  borderRadius: '20px',
  padding: '24px',
  marginBottom: '32px',
  border: '1px solid rgba(59, 130, 246, 0.2)',
  maxWidth: '800px',
  margin: '0 auto 32px',
});

const ProgressBar = styled(LinearProgress)({
  height: '12px',
  borderRadius: '6px',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  marginTop: '12px',
  '& .MuiLinearProgress-bar': {
    backgroundColor: '#3b82f6',
    borderRadius: '6px',
  },
});

const TaskGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
  gap: '20px',
  maxWidth: '1400px',
  margin: '0 auto',
});

const TaskCard = styled(Card)<{ difficulty?: string }>(({ difficulty }) => {
  const colors: Record<string, string> = {
    easy: '#22c55e',
    medium: '#fbbf24',
    hard: '#ef4444',
  };
  const color = colors[difficulty || 'easy'] || colors.easy;

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

const TaskTitle = styled(Typography)({
  fontSize: '1.1rem',
  fontWeight: 600,
  color: '#f0e6ff',
  marginBottom: '8px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

const TaskDescription = styled(Typography)({
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

const TaskTag = styled(Chip)({
  backgroundColor: 'rgba(59, 130, 246, 0.15)',
  color: '#60a5fa',
  fontSize: '0.7rem',
  height: '24px',
  border: '1px solid rgba(59, 130, 246, 0.3)',
});

const DifficultyBadge = styled(Box)<{ level?: string }>(({ level }) => {
  const colors: Record<string, { bg: string; text: string }> = {
    easy: { bg: 'rgba(34, 197, 94, 0.2)', text: '#22c55e' },
    medium: { bg: 'rgba(251, 191, 36, 0.2)', text: '#fbbf24' },
    hard: { bg: 'rgba(239, 68, 68, 0.2)', text: '#ef4444' },
  };
  const style = colors[level || 'easy'] || colors.easy;

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
  };
});

const FrequencyBadge = styled(Box)({
  backgroundColor: 'rgba(139, 92, 246, 0.2)',
  color: '#a78bfa',
  padding: '4px 10px',
  borderRadius: '12px',
  fontSize: '0.7rem',
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  border: '1px solid rgba(139, 92, 246, 0.3)',
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
    border: '1px solid rgba(59, 130, 246, 0.3)',
    maxWidth: '600px',
    width: '100%',
  },
});

// Types
interface CarTask {
  id: string;
  category: string;
  title: string;
  description: string;
  difficulty: string;
  frequency: string;
  tags: string[];
}

// Category configuration
const categories = [
  { id: 'all', name: 'All Tasks', icon: Sparkles, color: '#d4af37' },
  { id: 'Weekly Checks', name: 'Weekly', icon: Calendar, color: '#22c55e' },
  { id: 'Monthly Checks', name: 'Monthly', icon: Clock, color: '#3b82f6' },
  { id: 'Quarterly Maintenance', name: 'Quarterly', icon: Wrench, color: '#8b5cf6' },
  { id: 'Seasonal Tasks', name: 'Seasonal', icon: Thermometer, color: '#f59e0b' },
  { id: 'Annual Inspections', name: 'Annual', icon: Shield, color: '#ef4444' },
  { id: 'Safety Checks', name: 'Safety', icon: AlertTriangle, color: '#ec4899' },
  { id: 'Fluid Checks', name: 'Fluids', icon: Droplets, color: '#06b6d4' },
  { id: 'Visual Inspections', name: 'Visual', icon: Eye, color: '#84cc16' },
];

export const CarMaintenanceTracker: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<CarTask | null>(null);
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());

  const tasks: CarTask[] = carData.items;

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        searchQuery === '' ||
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'all' || task.category === selectedCategory;

      const matchesDifficulty =
        !selectedDifficulty || task.difficulty === selectedDifficulty;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [tasks, searchQuery, selectedCategory, selectedDifficulty]);

  const stats = useMemo(() => {
    const completedCount = completedTasks.size;
    const progressPercent = Math.round((completedCount / tasks.length) * 100);

    return {
      total: tasks.length,
      completed: completedCount,
      weekly: tasks.filter((t) => t.category === 'Weekly Checks').length,
      progress: progressPercent,
    };
  }, [tasks, completedTasks]);

  const toggleCompleted = useCallback((taskId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCompletedTasks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  }, []);

  const getCategoryIcon = (categoryName: string) => {
    const cat = categories.find((c) => c.id === categoryName);
    return cat ? cat.icon : Car;
  };

  const getCategoryColor = (categoryName: string) => {
    const cat = categories.find((c) => c.id === categoryName);
    return cat ? cat.color : '#3b82f6';
  };

  return (
    <PageContainer>
      <Header>
        <Title variant="h1">
          <Car size={36} />
          Car Maintenance Tracker
        </Title>
        <Subtitle>50 essential tasks for vehicle care and safety</Subtitle>
      </Header>

      <ProgressSection>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography sx={{ color: '#f0e6ff', fontWeight: 600, fontSize: '1.1rem' }}>
              Maintenance Progress
            </Typography>
            <Typography sx={{ color: 'rgba(240, 230, 255, 0.6)', fontSize: '0.85rem' }}>
              {stats.completed} of {stats.total} tasks completed
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography sx={{ color: '#3b82f6', fontWeight: 700, fontSize: '1.5rem' }}>
              {stats.progress}%
            </Typography>
          </Box>
        </Box>
        <ProgressBar variant="determinate" value={stats.progress} />
      </ProgressSection>

      <StatsPanel>
        <StatCard>
          <Car size={24} color="#3b82f6" />
          <Box>
            <StatNumber>{stats.total}</StatNumber>
            <StatLabel>Tasks</StatLabel>
          </Box>
        </StatCard>
        <StatCard>
          <CheckCircle2 size={24} color="#22c55e" />
          <Box>
            <StatNumber>{stats.completed}</StatNumber>
            <StatLabel>Done</StatLabel>
          </Box>
        </StatCard>
        <StatCard>
          <Calendar size={24} color="#22c55e" />
          <Box>
            <StatNumber>{stats.weekly}</StatNumber>
            <StatLabel>Weekly</StatLabel>
          </Box>
        </StatCard>
        <StatCard>
          <Gauge size={24} color="#f59e0b" />
          <Box>
            <StatNumber>{stats.progress}%</StatNumber>
            <StatLabel>Complete</StatLabel>
          </Box>
        </StatCard>
      </StatsPanel>

      <SearchContainer>
        <StyledTextField
          fullWidth
          placeholder="Search tasks, parts, or systems..."
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
        {['easy', 'medium', 'hard'].map((diff) => (
          <Chip
            key={diff}
            label={diff}
            onClick={() => setSelectedDifficulty(selectedDifficulty === diff ? null : diff)}
            sx={{
              backgroundColor: selectedDifficulty === diff
                ? (diff === 'easy' ? '#22c55e' : diff === 'medium' ? '#fbbf24' : '#ef4444')
                : 'rgba(26, 16, 40, 0.6)',
              color: selectedDifficulty === diff ? '#0a0812' : (diff === 'easy' ? '#22c55e' : diff === 'medium' ? '#fbbf24' : '#ef4444'),
              border: `1px solid ${diff === 'easy' ? '#22c55e' : diff === 'medium' ? '#fbbf24' : '#ef4444'}`,
              textTransform: 'capitalize',
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
        Showing {filteredTasks.length} of {tasks.length} tasks
      </Typography>

      <TaskGrid>
        {filteredTasks.map((task) => {
          const isCompleted = completedTasks.has(task.id);
          const CategoryIcon = getCategoryIcon(task.category);

          return (
            <TaskCard
              key={task.id}
              difficulty={task.difficulty}
              onClick={() => setSelectedTask(task)}
            >
              {isCompleted && (
                <CompletedBadge>
                  <CheckCircle2 size={12} />
                  Done
                </CompletedBadge>
              )}
              <CardContent sx={{ padding: '20px' }}>
                <TaskTitle>
                  <CategoryIcon size={18} color={getCategoryColor(task.category)} />
                  {task.title}
                </TaskTitle>

                <Box sx={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                  <DifficultyBadge level={task.difficulty}>
                    {task.difficulty}
                  </DifficultyBadge>
                  <FrequencyBadge>
                    <Timer size={10} />
                    {task.frequency}
                  </FrequencyBadge>
                  <Chip
                    size="small"
                    label={task.category}
                    sx={{
                      backgroundColor: `${getCategoryColor(task.category)}20`,
                      color: getCategoryColor(task.category),
                      fontSize: '0.7rem',
                      height: '24px',
                      border: `1px solid ${getCategoryColor(task.category)}40`,
                    }}
                  />
                </Box>

                <TaskDescription>{task.description}</TaskDescription>

                <TagContainer>
                  {task.tags.slice(0, 4).map((tag) => (
                    <TaskTag key={tag} label={tag} size="small" />
                  ))}
                </TagContainer>
              </CardContent>
            </TaskCard>
          );
        })}
      </TaskGrid>

      {/* Task Detail Dialog */}
      <DialogStyled
        open={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        maxWidth="md"
      >
        {selectedTask && (
          <>
            <DialogTitle
              sx={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(96, 165, 250, 0.1) 100%)',
                color: '#f0e6ff',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Car size={24} color="#3b82f6" />
                {selectedTask.title}
              </Box>
              <IconButton onClick={() => setSelectedTask(null)} sx={{ color: '#f0e6ff' }}>
                <X size={20} />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ padding: '24px' }}>
              <Box sx={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <DifficultyBadge level={selectedTask.difficulty}>
                  {selectedTask.difficulty}
                </DifficultyBadge>
                <FrequencyBadge>
                  <Timer size={12} />
                  {selectedTask.frequency}
                </FrequencyBadge>
                <Chip
                  label={selectedTask.category}
                  sx={{
                    backgroundColor: `${getCategoryColor(selectedTask.category)}20`,
                    color: getCategoryColor(selectedTask.category),
                    border: `1px solid ${getCategoryColor(selectedTask.category)}40`,
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
                {selectedTask.description}
              </Typography>

              <Box sx={{ marginBottom: '20px' }}>
                <Typography sx={{ color: '#60a5fa', fontWeight: 600, marginBottom: '12px' }}>
                  Related Tags
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {selectedTask.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      sx={{
                        backgroundColor: 'rgba(59, 130, 246, 0.15)',
                        color: '#60a5fa',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                      }}
                    />
                  ))}
                </Box>
              </Box>

              <Box
                sx={{
                  background: 'rgba(251, 191, 36, 0.1)',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid rgba(251, 191, 36, 0.2)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <AlertTriangle size={18} color="#fbbf24" />
                  <Typography sx={{ color: '#fbbf24', fontWeight: 600 }}>
                    Pro Tip
                  </Typography>
                </Box>
                <Typography sx={{ color: 'rgba(240, 230, 255, 0.8)', fontSize: '0.9rem' }}>
                  Schedule this task in your calendar to maintain regular vehicle care.
                  Consistent maintenance prevents costly repairs!
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions sx={{ padding: '16px 24px', borderTop: '1px solid rgba(59, 130, 246, 0.2)' }}>
              <Button
                variant="outlined"
                onClick={() => setSelectedTask(null)}
                sx={{
                  borderColor: 'rgba(240, 230, 255, 0.3)',
                  color: '#f0e6ff',
                  '&:hover': { borderColor: 'rgba(240, 230, 255, 0.5)', backgroundColor: 'rgba(240, 230, 255, 0.1)' },
                }}
              >
                Close
              </Button>
              <Button
                variant="contained"
                onClick={(e) => {
                  toggleCompleted(selectedTask.id, e);
                  setSelectedTask(null);
                }}
                startIcon={completedTasks.has(selectedTask.id) ? <X size={18} /> : <CheckCircle2 size={18} />}
                sx={{
                  backgroundColor: completedTasks.has(selectedTask.id) ? '#6b7280' : '#22c55e',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: completedTasks.has(selectedTask.id) ? '#4b5563' : '#16a34a',
                  },
                }}
              >
                {completedTasks.has(selectedTask.id) ? 'Mark Incomplete' : 'Mark Complete'}
              </Button>
            </DialogActions>
          </>
        )}
      </DialogStyled>
    </PageContainer>
  );
};

export default CarMaintenanceTracker;
