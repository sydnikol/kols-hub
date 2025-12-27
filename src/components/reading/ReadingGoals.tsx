import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  Card,
  CardContent,
  Button,
  IconButton,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slider,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Target,
  Trophy,
  Flame,
  Calendar,
  TrendingUp,
  Star,
  Award,
  X,
  Edit3,
  Sparkles,
  PartyPopper,
  Crown,
  Medal,
  Zap,
  BookOpen,
} from 'lucide-react';

// Animations
const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const celebrationBurst = keyframes`
  0% { transform: scale(0); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.8; }
  100% { transform: scale(1.5); opacity: 0; }
`;

// Styled Components
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
    background: 'radial-gradient(ellipse at center top, rgba(34, 197, 94, 0.15) 0%, transparent 70%)',
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
  background: 'linear-gradient(135deg, #22c55e 0%, #4ade80 50%, #86efac 100%)',
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
  color: 'rgba(34, 197, 94, 0.8)',
  fontSize: '1rem',
});

const GoalCard = styled(Card)({
  background: 'linear-gradient(145deg, rgba(26, 16, 40, 0.9) 0%, rgba(13, 13, 26, 0.95) 100%)',
  borderRadius: '24px',
  border: '1px solid rgba(34, 197, 94, 0.3)',
  overflow: 'hidden',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #22c55e, #4ade80)',
  },
});

const ProgressRing = styled(Box)<{ progress: number }>(({ progress }) => ({
  width: '200px',
  height: '200px',
  borderRadius: '50%',
  background: `conic-gradient(
    #22c55e 0deg,
    #4ade80 ${progress * 3.6}deg,
    rgba(34, 197, 94, 0.1) ${progress * 3.6}deg,
    rgba(34, 197, 94, 0.1) 360deg
  )`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: '12px',
    borderRadius: '50%',
    background: 'linear-gradient(145deg, #1a1028 0%, #0d0d1a 100%)',
  },
}));

const MonthCard = styled(Box)<{ isComplete?: boolean; isCurrent?: boolean }>(({ isComplete, isCurrent }) => ({
  background: isComplete
    ? 'linear-gradient(145deg, rgba(34, 197, 94, 0.2) 0%, rgba(74, 222, 128, 0.1) 100%)'
    : 'linear-gradient(145deg, rgba(26, 16, 40, 0.6) 0%, rgba(13, 13, 26, 0.8) 100%)',
  borderRadius: '12px',
  padding: '16px',
  border: `1px solid ${isComplete ? 'rgba(34, 197, 94, 0.4)' : isCurrent ? 'rgba(251, 191, 36, 0.4)' : 'rgba(139, 92, 246, 0.2)'}`,
  textAlign: 'center',
  position: 'relative',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: isComplete
      ? '0 8px 24px rgba(34, 197, 94, 0.2)'
      : '0 8px 24px rgba(139, 92, 246, 0.1)',
  },
}));

const StreakBadge = styled(Box)<{ isActive?: boolean }>(({ isActive }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 16px',
  borderRadius: '20px',
  background: isActive
    ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(245, 158, 11, 0.1) 100%)'
    : 'rgba(107, 114, 128, 0.2)',
  border: `1px solid ${isActive ? 'rgba(251, 191, 36, 0.4)' : 'rgba(107, 114, 128, 0.3)'}`,
  color: isActive ? '#fbbf24' : '#6b7280',
  animation: isActive ? `${pulse} 2s ease-in-out infinite` : 'none',
}));

const MilestoneCard = styled(Box)<{ achieved?: boolean }>(({ achieved }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  padding: '16px',
  borderRadius: '12px',
  background: achieved
    ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(245, 158, 11, 0.05) 100%)'
    : 'rgba(26, 16, 40, 0.6)',
  border: `1px solid ${achieved ? 'rgba(251, 191, 36, 0.3)' : 'rgba(139, 92, 246, 0.2)'}`,
  transition: 'all 0.3s ease',
}));

const CelebrationOverlay = styled(Box)({
  position: 'fixed',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(10, 8, 18, 0.9)',
  zIndex: 9999,
});

const ActionButton = styled(Button)({
  background: 'linear-gradient(135deg, #22c55e 0%, #4ade80 100%)',
  color: '#0a0812',
  borderRadius: '12px',
  padding: '10px 24px',
  fontWeight: 600,
  '&:hover': {
    background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
    transform: 'scale(1.02)',
  },
});

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(26, 16, 40, 0.8)',
    borderRadius: '12px',
    color: '#f0e6ff',
    '& fieldset': {
      borderColor: 'rgba(34, 197, 94, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(34, 197, 94, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#22c55e',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(34, 197, 94, 0.7)',
  },
});

const DialogStyled = styled(Dialog)({
  '& .MuiDialog-paper': {
    backgroundColor: '#1a1028',
    borderRadius: '24px',
    border: '1px solid rgba(34, 197, 94, 0.3)',
    maxWidth: '500px',
    width: '100%',
  },
});

// Types
interface ReadingGoal {
  year: number;
  targetBooks: number;
  booksRead: number;
  monthlyBreakdown: number[];
  currentStreak: number;
  longestStreak: number;
  lastReadDate: string | null;
}

interface Milestone {
  id: string;
  name: string;
  description: string;
  target: number;
  icon: React.ReactNode;
  achieved: boolean;
}

const STORAGE_KEY = 'gothic-reading-goals';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const DEFAULT_GOAL: ReadingGoal = {
  year: new Date().getFullYear(),
  targetBooks: 12,
  booksRead: 0,
  monthlyBreakdown: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  currentStreak: 0,
  longestStreak: 0,
  lastReadDate: null,
};

export const ReadingGoals: React.FC = () => {
  const [goal, setGoal] = useState<ReadingGoal>(DEFAULT_GOAL);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(12);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState('');

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsedGoal = JSON.parse(saved);
        // Check if it's a new year
        if (parsedGoal.year !== new Date().getFullYear()) {
          setGoal({ ...DEFAULT_GOAL, longestStreak: parsedGoal.longestStreak });
        } else {
          setGoal(parsedGoal);
        }
      } catch (e) {
        console.error('Failed to load goals:', e);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goal));
  }, [goal]);

  // Check for streaks
  useEffect(() => {
    if (goal.lastReadDate) {
      const lastRead = new Date(goal.lastReadDate);
      const today = new Date();
      const diffDays = Math.floor((today.getTime() - lastRead.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays > 7) {
        // Streak broken after 7 days of no reading
        setGoal(prev => ({ ...prev, currentStreak: 0 }));
      }
    }
  }, [goal.lastReadDate]);

  const progress = useMemo(() => {
    return goal.targetBooks > 0 ? Math.min((goal.booksRead / goal.targetBooks) * 100, 100) : 0;
  }, [goal.booksRead, goal.targetBooks]);

  const currentMonth = new Date().getMonth();

  const milestones: Milestone[] = useMemo(() => [
    {
      id: 'first-book',
      name: 'First Steps',
      description: 'Finish your first book of the year',
      target: 1,
      icon: <BookOpen size={24} />,
      achieved: goal.booksRead >= 1,
    },
    {
      id: 'five-books',
      name: 'Page Turner',
      description: 'Read 5 books',
      target: 5,
      icon: <Star size={24} />,
      achieved: goal.booksRead >= 5,
    },
    {
      id: 'ten-books',
      name: 'Bookworm',
      description: 'Read 10 books',
      target: 10,
      icon: <Award size={24} />,
      achieved: goal.booksRead >= 10,
    },
    {
      id: 'half-goal',
      name: 'Halfway There',
      description: 'Reach 50% of your goal',
      target: Math.ceil(goal.targetBooks / 2),
      icon: <TrendingUp size={24} />,
      achieved: goal.booksRead >= Math.ceil(goal.targetBooks / 2),
    },
    {
      id: 'goal-complete',
      name: 'Goal Crusher',
      description: 'Complete your yearly reading goal',
      target: goal.targetBooks,
      icon: <Trophy size={24} />,
      achieved: goal.booksRead >= goal.targetBooks,
    },
    {
      id: 'overachiever',
      name: 'Overachiever',
      description: 'Surpass your goal by 25%',
      target: Math.ceil(goal.targetBooks * 1.25),
      icon: <Crown size={24} />,
      achieved: goal.booksRead >= Math.ceil(goal.targetBooks * 1.25),
    },
    {
      id: 'streak-4',
      name: 'Consistent Reader',
      description: 'Maintain a 4-week reading streak',
      target: 4,
      icon: <Flame size={24} />,
      achieved: goal.longestStreak >= 4,
    },
    {
      id: 'streak-12',
      name: 'Dedicated Bibliophile',
      description: 'Maintain a 12-week reading streak',
      target: 12,
      icon: <Zap size={24} />,
      achieved: goal.longestStreak >= 12,
    },
  ], [goal]);

  const handleUpdateGoal = () => {
    setGoal(prev => ({ ...prev, targetBooks: editTarget }));
    setIsEditDialogOpen(false);
  };

  const handleAddBook = () => {
    const today = new Date();
    const month = today.getMonth();
    const newMonthlyBreakdown = [...goal.monthlyBreakdown];
    newMonthlyBreakdown[month] += 1;

    // Update streak
    let newStreak = goal.currentStreak;
    if (goal.lastReadDate) {
      const lastRead = new Date(goal.lastReadDate);
      const lastReadWeek = Math.floor(lastRead.getTime() / (7 * 24 * 60 * 60 * 1000));
      const currentWeek = Math.floor(today.getTime() / (7 * 24 * 60 * 60 * 1000));

      if (currentWeek - lastReadWeek <= 1) {
        newStreak += 1;
      } else {
        newStreak = 1;
      }
    } else {
      newStreak = 1;
    }

    const newBooksRead = goal.booksRead + 1;
    const newLongestStreak = Math.max(goal.longestStreak, newStreak);

    // Check for milestone celebrations
    const newMilestones = milestones.filter(m => !m.achieved && newBooksRead >= m.target);
    if (newMilestones.length > 0) {
      setCelebrationMessage(`You've achieved: ${newMilestones[0].name}!`);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }

    setGoal({
      ...goal,
      booksRead: newBooksRead,
      monthlyBreakdown: newMonthlyBreakdown,
      currentStreak: newStreak,
      longestStreak: newLongestStreak,
      lastReadDate: today.toISOString(),
    });
  };

  const handleRemoveBook = () => {
    if (goal.booksRead <= 0) return;

    const month = new Date().getMonth();
    const newMonthlyBreakdown = [...goal.monthlyBreakdown];
    if (newMonthlyBreakdown[month] > 0) {
      newMonthlyBreakdown[month] -= 1;
    }

    setGoal({
      ...goal,
      booksRead: goal.booksRead - 1,
      monthlyBreakdown: newMonthlyBreakdown,
    });
  };

  const getMonthlyTarget = () => {
    const remainingMonths = 12 - currentMonth;
    const remainingBooks = goal.targetBooks - goal.booksRead;
    return Math.ceil(remainingBooks / remainingMonths);
  };

  const getTimeToComplete = () => {
    const avgPerMonth = goal.booksRead / (currentMonth + 1);
    if (avgPerMonth === 0) return 'Start reading to see estimate';
    const remaining = goal.targetBooks - goal.booksRead;
    const monthsNeeded = Math.ceil(remaining / avgPerMonth);
    if (monthsNeeded <= 0) return 'Goal complete!';
    if (monthsNeeded <= 12 - currentMonth) return `On track to finish by December`;
    return `${monthsNeeded} months needed at current pace`;
  };

  return (
    <PageContainer>
      <Header>
        <Title variant="h1">
          <Target size={36} />
          Reading Goals
        </Title>
        <Subtitle>Set your yearly reading goals and track your progress</Subtitle>
      </Header>

      {/* Main Goal Card */}
      <GoalCard sx={{ maxWidth: '800px', margin: '0 auto 32px' }}>
        <CardContent sx={{ padding: '32px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <Typography sx={{ fontSize: '1.5rem', fontWeight: 600, color: '#f0e6ff' }}>
              {goal.year} Reading Goal
            </Typography>
            <IconButton onClick={() => { setEditTarget(goal.targetBooks); setIsEditDialogOpen(true); }} sx={{ color: '#22c55e' }}>
              <Edit3 size={20} />
            </IconButton>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '48px', flexWrap: 'wrap' }}>
            {/* Progress Ring */}
            <ProgressRing progress={progress}>
              <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                <Typography sx={{ fontSize: '3rem', fontWeight: 700, color: '#22c55e' }}>
                  {goal.booksRead}
                </Typography>
                <Typography sx={{ fontSize: '1rem', color: 'rgba(34, 197, 94, 0.7)' }}>
                  of {goal.targetBooks}
                </Typography>
              </Box>
            </ProgressRing>

            {/* Stats */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Box>
                <Typography sx={{ fontSize: '0.875rem', color: 'rgba(240, 230, 255, 0.6)', marginBottom: '4px' }}>
                  Progress
                </Typography>
                <Typography sx={{ fontSize: '1.5rem', fontWeight: 600, color: '#22c55e' }}>
                  {Math.round(progress)}%
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.875rem', color: 'rgba(240, 230, 255, 0.6)', marginBottom: '4px' }}>
                  Books Remaining
                </Typography>
                <Typography sx={{ fontSize: '1.5rem', fontWeight: 600, color: '#f0e6ff' }}>
                  {Math.max(0, goal.targetBooks - goal.booksRead)}
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.875rem', color: 'rgba(240, 230, 255, 0.6)', marginBottom: '4px' }}>
                  Monthly Target
                </Typography>
                <Typography sx={{ fontSize: '1.5rem', fontWeight: 600, color: '#fbbf24' }}>
                  {getMonthlyTarget()} books/month
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '24px' }}>
            <ActionButton onClick={handleAddBook}>
              + Log Finished Book
            </ActionButton>
            <Button
              onClick={handleRemoveBook}
              disabled={goal.booksRead <= 0}
              sx={{
                color: 'rgba(239, 68, 68, 0.7)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '12px',
                '&:hover': {
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                },
                '&:disabled': {
                  color: 'rgba(107, 114, 128, 0.5)',
                  border: '1px solid rgba(107, 114, 128, 0.2)',
                },
              }}
            >
              - Remove Book
            </Button>
          </Box>

          <Typography sx={{
            textAlign: 'center',
            marginTop: '16px',
            color: 'rgba(240, 230, 255, 0.6)',
            fontSize: '0.875rem',
          }}>
            {getTimeToComplete()}
          </Typography>
        </CardContent>
      </GoalCard>

      {/* Streak Section */}
      <Box sx={{ maxWidth: '800px', margin: '0 auto 32px', textAlign: 'center' }}>
        <Typography sx={{ fontSize: '1.25rem', fontWeight: 600, color: '#f0e6ff', marginBottom: '16px' }}>
          Reading Streak
        </Typography>
        <Box sx={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <StreakBadge isActive={goal.currentStreak > 0}>
            <Flame size={20} />
            <Box>
              <Typography sx={{ fontSize: '1.25rem', fontWeight: 700 }}>
                {goal.currentStreak}
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', textTransform: 'uppercase' }}>
                Current Streak
              </Typography>
            </Box>
          </StreakBadge>
          <StreakBadge isActive={goal.longestStreak > 0}>
            <Trophy size={20} />
            <Box>
              <Typography sx={{ fontSize: '1.25rem', fontWeight: 700 }}>
                {goal.longestStreak}
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', textTransform: 'uppercase' }}>
                Best Streak
              </Typography>
            </Box>
          </StreakBadge>
        </Box>
        <Typography sx={{ marginTop: '8px', color: 'rgba(240, 230, 255, 0.5)', fontSize: '0.75rem' }}>
          Finish at least one book per week to maintain your streak!
        </Typography>
      </Box>

      {/* Monthly Breakdown */}
      <Box sx={{ maxWidth: '1000px', margin: '0 auto 32px' }}>
        <Typography sx={{ fontSize: '1.25rem', fontWeight: 600, color: '#f0e6ff', marginBottom: '16px', textAlign: 'center' }}>
          Monthly Breakdown
        </Typography>
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
          gap: '12px',
        }}>
          {MONTHS.map((month, idx) => {
            const isComplete = goal.monthlyBreakdown[idx] >= Math.ceil(goal.targetBooks / 12);
            const isCurrent = idx === currentMonth;

            return (
              <MonthCard key={month} isComplete={isComplete} isCurrent={isCurrent}>
                {isCurrent && (
                  <Box sx={{
                    position: 'absolute',
                    top: '-8px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: '#fbbf24',
                    color: '#0a0812',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.6rem',
                    fontWeight: 600,
                  }}>
                    NOW
                  </Box>
                )}
                <Typography sx={{ color: 'rgba(240, 230, 255, 0.7)', fontSize: '0.75rem', marginBottom: '4px' }}>
                  {month}
                </Typography>
                <Typography sx={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: isComplete ? '#22c55e' : isCurrent ? '#fbbf24' : '#f0e6ff',
                }}>
                  {goal.monthlyBreakdown[idx]}
                </Typography>
                {isComplete && (
                  <Star size={16} color="#22c55e" fill="#22c55e" style={{ marginTop: '4px' }} />
                )}
              </MonthCard>
            );
          })}
        </Box>
      </Box>

      {/* Milestones */}
      <Box sx={{ maxWidth: '800px', margin: '0 auto' }}>
        <Typography sx={{ fontSize: '1.25rem', fontWeight: 600, color: '#f0e6ff', marginBottom: '16px', textAlign: 'center' }}>
          Milestones & Achievements
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {milestones.map(milestone => (
            <MilestoneCard key={milestone.id} achieved={milestone.achieved}>
              <Box sx={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: milestone.achieved ? 'rgba(251, 191, 36, 0.2)' : 'rgba(139, 92, 246, 0.1)',
                color: milestone.achieved ? '#fbbf24' : 'rgba(139, 92, 246, 0.5)',
              }}>
                {milestone.icon}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{
                  fontWeight: 600,
                  color: milestone.achieved ? '#fbbf24' : '#f0e6ff',
                }}>
                  {milestone.name}
                </Typography>
                <Typography sx={{ fontSize: '0.875rem', color: 'rgba(240, 230, 255, 0.6)' }}>
                  {milestone.description}
                </Typography>
              </Box>
              {milestone.achieved ? (
                <Box sx={{
                  backgroundColor: 'rgba(34, 197, 94, 0.2)',
                  color: '#22c55e',
                  padding: '4px 12px',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}>
                  Achieved!
                </Box>
              ) : (
                <Typography sx={{ color: 'rgba(240, 230, 255, 0.5)', fontSize: '0.875rem' }}>
                  {goal.booksRead}/{milestone.target}
                </Typography>
              )}
            </MilestoneCard>
          ))}
        </Box>
      </Box>

      {/* Edit Goal Dialog */}
      <DialogStyled open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)}>
        <DialogTitle sx={{
          background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(74, 222, 128, 0.1) 100%)',
          color: '#f0e6ff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Edit3 size={24} color="#22c55e" />
            Set Reading Goal
          </Box>
          <IconButton onClick={() => setIsEditDialogOpen(false)} sx={{ color: '#f0e6ff' }}>
            <X size={20} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ padding: '24px' }}>
          <Typography sx={{ color: 'rgba(240, 230, 255, 0.7)', marginBottom: '24px' }}>
            How many books do you want to read in {goal.year}?
          </Typography>
          <Box sx={{ padding: '0 16px' }}>
            <Typography sx={{ fontSize: '3rem', fontWeight: 700, color: '#22c55e', textAlign: 'center', marginBottom: '16px' }}>
              {editTarget} books
            </Typography>
            <Slider
              value={editTarget}
              onChange={(_, value) => setEditTarget(value as number)}
              min={1}
              max={100}
              sx={{
                color: '#22c55e',
                '& .MuiSlider-thumb': {
                  backgroundColor: '#22c55e',
                },
                '& .MuiSlider-track': {
                  backgroundColor: '#22c55e',
                },
                '& .MuiSlider-rail': {
                  backgroundColor: 'rgba(34, 197, 94, 0.2)',
                },
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(240, 230, 255, 0.5)', fontSize: '0.75rem' }}>
              <span>1</span>
              <span>Monthly: ~{Math.ceil(editTarget / 12)}</span>
              <span>100</span>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ padding: '16px 24px', borderTop: '1px solid rgba(34, 197, 94, 0.2)' }}>
          <Button onClick={() => setIsEditDialogOpen(false)} sx={{ color: 'rgba(240, 230, 255, 0.7)' }}>
            Cancel
          </Button>
          <ActionButton onClick={handleUpdateGoal}>
            Save Goal
          </ActionButton>
        </DialogActions>
      </DialogStyled>

      {/* Celebration Overlay */}
      {showCelebration && (
        <CelebrationOverlay onClick={() => setShowCelebration(false)}>
          <Box sx={{ textAlign: 'center' }}>
            <PartyPopper size={80} color="#fbbf24" style={{ animation: `${pulse} 0.5s ease-in-out infinite` }} />
            <Typography sx={{
              fontSize: '2rem',
              fontWeight: 700,
              color: '#fbbf24',
              marginTop: '24px',
              marginBottom: '8px',
            }}>
              Congratulations!
            </Typography>
            <Typography sx={{ fontSize: '1.25rem', color: '#f0e6ff' }}>
              {celebrationMessage}
            </Typography>
          </Box>
        </CelebrationOverlay>
      )}
    </PageContainer>
  );
};

export default ReadingGoals;
