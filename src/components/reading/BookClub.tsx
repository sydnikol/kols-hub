import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  Card,
  CardContent,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  LinearProgress,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Users,
  Calendar,
  MessageSquare,
  Award,
  BookOpen,
  Plus,
  X,
  Edit3,
  Trash2,
  Check,
  Trophy,
  Star,
  Sparkles,
  Target,
  Clock,
  CheckCircle2,
  Crown,
  Flame,
  Heart,
  Ghost,
  Feather,
  Globe,
  Lightbulb,
} from 'lucide-react';

// Animations
const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(236, 72, 153, 0.3); }
  50% { box-shadow: 0 0 40px rgba(236, 72, 153, 0.5); }
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
    background: 'radial-gradient(ellipse at center top, rgba(236, 72, 153, 0.15) 0%, transparent 70%)',
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
  background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 50%, #f9a8d4 100%)',
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
  color: 'rgba(236, 72, 153, 0.8)',
  fontSize: '1rem',
});

const SectionTitle = styled(Typography)({
  fontSize: '1.5rem',
  fontWeight: 600,
  color: '#f0e6ff',
  marginBottom: '20px',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
});

const MeetingCard = styled(Card)<{ isPast?: boolean }>(({ isPast }) => ({
  background: isPast
    ? 'linear-gradient(145deg, rgba(26, 16, 40, 0.5) 0%, rgba(13, 13, 26, 0.6) 100%)'
    : 'linear-gradient(145deg, rgba(26, 16, 40, 0.9) 0%, rgba(13, 13, 26, 0.95) 100%)',
  borderRadius: '16px',
  border: `1px solid ${isPast ? 'rgba(107, 114, 128, 0.3)' : 'rgba(236, 72, 153, 0.3)'}`,
  transition: 'all 0.3s ease',
  opacity: isPast ? 0.7 : 1,
  '&:hover': {
    transform: isPast ? 'none' : 'translateY(-4px)',
    boxShadow: isPast ? 'none' : '0 12px 40px rgba(236, 72, 153, 0.2)',
  },
}));

const QuestionCard = styled(Box)({
  background: 'linear-gradient(145deg, rgba(236, 72, 153, 0.1) 0%, rgba(244, 114, 182, 0.05) 100%)',
  borderRadius: '12px',
  padding: '16px',
  border: '1px solid rgba(236, 72, 153, 0.2)',
  marginBottom: '12px',
});

const ChallengeCard = styled(Card)<{ isComplete?: boolean; isActive?: boolean }>(({ isComplete, isActive }) => ({
  background: isComplete
    ? 'linear-gradient(145deg, rgba(34, 197, 94, 0.15) 0%, rgba(74, 222, 128, 0.05) 100%)'
    : isActive
    ? 'linear-gradient(145deg, rgba(251, 191, 36, 0.15) 0%, rgba(245, 158, 11, 0.05) 100%)'
    : 'linear-gradient(145deg, rgba(26, 16, 40, 0.9) 0%, rgba(13, 13, 26, 0.95) 100%)',
  borderRadius: '16px',
  border: `1px solid ${isComplete ? 'rgba(34, 197, 94, 0.4)' : isActive ? 'rgba(251, 191, 36, 0.4)' : 'rgba(139, 92, 246, 0.2)'}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: isComplete
      ? '0 12px 40px rgba(34, 197, 94, 0.2)'
      : isActive
      ? '0 12px 40px rgba(251, 191, 36, 0.2)'
      : '0 12px 40px rgba(139, 92, 246, 0.1)',
  },
}));

const BadgeDisplay = styled(Box)<{ earned?: boolean }>(({ earned }) => ({
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: earned
    ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.3) 0%, rgba(245, 158, 11, 0.2) 100%)'
    : 'rgba(26, 16, 40, 0.6)',
  border: `2px solid ${earned ? '#fbbf24' : 'rgba(139, 92, 246, 0.2)'}`,
  color: earned ? '#fbbf24' : 'rgba(139, 92, 246, 0.3)',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'scale(1.1)',
  },
}));

const ActionButton = styled(Button)({
  background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
  color: '#fff',
  borderRadius: '12px',
  padding: '10px 24px',
  fontWeight: 600,
  '&:hover': {
    background: 'linear-gradient(135deg, #db2777 0%, #ec4899 100%)',
    transform: 'scale(1.02)',
  },
});

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(26, 16, 40, 0.8)',
    borderRadius: '12px',
    color: '#f0e6ff',
    '& fieldset': {
      borderColor: 'rgba(236, 72, 153, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(236, 72, 153, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#ec4899',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(236, 72, 153, 0.7)',
  },
});

const StyledSelect = styled(FormControl)({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(26, 16, 40, 0.8)',
    borderRadius: '12px',
    color: '#f0e6ff',
    '& fieldset': {
      borderColor: 'rgba(236, 72, 153, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(236, 72, 153, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#ec4899',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(236, 72, 153, 0.7)',
  },
  '& .MuiSelect-icon': {
    color: '#ec4899',
  },
});

const DialogStyled = styled(Dialog)({
  '& .MuiDialog-paper': {
    backgroundColor: '#1a1028',
    borderRadius: '24px',
    border: '1px solid rgba(236, 72, 153, 0.3)',
    maxWidth: '600px',
    width: '100%',
  },
});

const ProgressBar = styled(LinearProgress)({
  height: '8px',
  borderRadius: '4px',
  backgroundColor: 'rgba(236, 72, 153, 0.2)',
  '& .MuiLinearProgress-bar': {
    background: 'linear-gradient(90deg, #ec4899, #f472b6)',
    borderRadius: '4px',
  },
});

// Types
interface Meeting {
  id: string;
  title: string;
  bookTitle: string;
  date: string;
  time: string;
  discussionQuestions: string[];
  notes: string;
  createdAt: string;
}

interface ReadingChallenge {
  id: string;
  name: string;
  description: string;
  type: 'genre' | 'author' | 'theme' | 'format';
  target: number;
  current: number;
  badgeIcon: string;
  isActive: boolean;
  isComplete: boolean;
  startDate: string;
  endDate?: string;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  earned: boolean;
  earnedDate?: string;
}

const STORAGE_KEY_MEETINGS = 'gothic-book-club-meetings';
const STORAGE_KEY_CHALLENGES = 'gothic-book-club-challenges';
const STORAGE_KEY_BADGES = 'gothic-book-club-badges';

const DEFAULT_DISCUSSION_QUESTIONS = [
  'What was your overall impression of the book?',
  'Which character did you relate to most and why?',
  'What themes resonated with you?',
  'Was there a particular scene that stood out to you?',
  'How did the setting influence the story?',
  'What did you think of the ending?',
  'Would you recommend this book to others?',
  'What would you ask the author if you could?',
];

const CHALLENGE_TEMPLATES: Omit<ReadingChallenge, 'id' | 'current' | 'isActive' | 'isComplete' | 'startDate' | 'endDate'>[] = [
  {
    name: 'Gothic Explorer',
    description: 'Read 5 Gothic literature classics',
    type: 'genre',
    target: 5,
    badgeIcon: 'ghost',
  },
  {
    name: 'Diverse Voices',
    description: 'Read 5 books by Black authors',
    type: 'author',
    target: 5,
    badgeIcon: 'heart',
  },
  {
    name: 'Pride Reader',
    description: 'Read 5 books by LGBTQ+ authors',
    type: 'author',
    target: 5,
    badgeIcon: 'sparkles',
  },
  {
    name: 'Fantasy Quest',
    description: 'Read 5 fantasy or sci-fi books',
    type: 'genre',
    target: 5,
    badgeIcon: 'star',
  },
  {
    name: 'Poetry Pilgrim',
    description: 'Read 3 poetry collections',
    type: 'genre',
    target: 3,
    badgeIcon: 'feather',
  },
  {
    name: 'Mystery Maven',
    description: 'Read 5 mystery or thriller books',
    type: 'genre',
    target: 5,
    badgeIcon: 'eye',
  },
  {
    name: 'Time Traveler',
    description: 'Read 5 historical fiction books',
    type: 'genre',
    target: 5,
    badgeIcon: 'clock',
  },
  {
    name: 'World Reader',
    description: 'Read books from 5 different countries',
    type: 'theme',
    target: 5,
    badgeIcon: 'globe',
  },
  {
    name: 'Self-Discovery',
    description: 'Read 3 self-help or wellness books',
    type: 'genre',
    target: 3,
    badgeIcon: 'lightbulb',
  },
  {
    name: 'Bookworm Elite',
    description: 'Complete 3 reading challenges',
    type: 'theme',
    target: 3,
    badgeIcon: 'crown',
  },
];

const getBadgeIcon = (iconName: string): React.ReactNode => {
  const icons: Record<string, React.ReactNode> = {
    ghost: <Ghost size={32} />,
    heart: <Heart size={32} />,
    sparkles: <Sparkles size={32} />,
    star: <Star size={32} />,
    feather: <Feather size={32} />,
    eye: <Target size={32} />,
    clock: <Clock size={32} />,
    globe: <Globe size={32} />,
    lightbulb: <Lightbulb size={32} />,
    crown: <Crown size={32} />,
    trophy: <Trophy size={32} />,
    flame: <Flame size={32} />,
  };
  return icons[iconName] || <Award size={32} />;
};

export const BookClub: React.FC = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [challenges, setChallenges] = useState<ReadingChallenge[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [isMeetingDialogOpen, setIsMeetingDialogOpen] = useState(false);
  const [isChallengeDialogOpen, setIsChallengeDialogOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<ReadingChallenge | null>(null);

  // Form states
  const [meetingForm, setMeetingForm] = useState({
    title: '',
    bookTitle: '',
    date: '',
    time: '',
    discussionQuestions: [] as string[],
    notes: '',
  });
  const [newQuestion, setNewQuestion] = useState('');

  // Load from localStorage
  useEffect(() => {
    const savedMeetings = localStorage.getItem(STORAGE_KEY_MEETINGS);
    const savedChallenges = localStorage.getItem(STORAGE_KEY_CHALLENGES);
    const savedBadges = localStorage.getItem(STORAGE_KEY_BADGES);

    if (savedMeetings) {
      try {
        setMeetings(JSON.parse(savedMeetings));
      } catch (e) {
        console.error('Failed to load meetings:', e);
      }
    }

    if (savedChallenges) {
      try {
        setChallenges(JSON.parse(savedChallenges));
      } catch (e) {
        console.error('Failed to load challenges:', e);
      }
    } else {
      // Initialize with default challenges
      const defaultChallenges: ReadingChallenge[] = CHALLENGE_TEMPLATES.map((template, idx) => ({
        ...template,
        id: `challenge-${idx}`,
        current: 0,
        isActive: false,
        isComplete: false,
        startDate: '',
      }));
      setChallenges(defaultChallenges);
    }

    if (savedBadges) {
      try {
        setBadges(JSON.parse(savedBadges));
      } catch (e) {
        console.error('Failed to load badges:', e);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_MEETINGS, JSON.stringify(meetings));
  }, [meetings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CHALLENGES, JSON.stringify(challenges));
  }, [challenges]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_BADGES, JSON.stringify(badges));
  }, [badges]);

  // Upcoming and past meetings
  const { upcomingMeetings, pastMeetings } = useMemo(() => {
    const now = new Date();
    const upcoming: Meeting[] = [];
    const past: Meeting[] = [];

    meetings.forEach(meeting => {
      const meetingDate = new Date(`${meeting.date}T${meeting.time}`);
      if (meetingDate >= now) {
        upcoming.push(meeting);
      } else {
        past.push(meeting);
      }
    });

    upcoming.sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());
    past.sort((a, b) => new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime());

    return { upcomingMeetings: upcoming, pastMeetings: past };
  }, [meetings]);

  // Active and completed challenges
  const { activeChallenges, completedChallenges, availableChallenges } = useMemo(() => {
    const active = challenges.filter(c => c.isActive && !c.isComplete);
    const completed = challenges.filter(c => c.isComplete);
    const available = challenges.filter(c => !c.isActive && !c.isComplete);
    return { activeChallenges: active, completedChallenges: completed, availableChallenges: available };
  }, [challenges]);

  const resetMeetingForm = () => {
    setMeetingForm({
      title: '',
      bookTitle: '',
      date: '',
      time: '',
      discussionQuestions: [],
      notes: '',
    });
    setNewQuestion('');
    setEditingMeeting(null);
  };

  const handleSaveMeeting = () => {
    if (!meetingForm.title || !meetingForm.bookTitle || !meetingForm.date) return;

    if (editingMeeting) {
      setMeetings(prev => prev.map(m =>
        m.id === editingMeeting.id
          ? { ...m, ...meetingForm }
          : m
      ));
    } else {
      const newMeeting: Meeting = {
        id: `meeting-${Date.now()}`,
        ...meetingForm,
        createdAt: new Date().toISOString(),
      };
      setMeetings(prev => [newMeeting, ...prev]);
    }

    setIsMeetingDialogOpen(false);
    resetMeetingForm();
  };

  const handleDeleteMeeting = (meetingId: string) => {
    setMeetings(prev => prev.filter(m => m.id !== meetingId));
  };

  const handleEditMeeting = (meeting: Meeting) => {
    setMeetingForm({
      title: meeting.title,
      bookTitle: meeting.bookTitle,
      date: meeting.date,
      time: meeting.time,
      discussionQuestions: meeting.discussionQuestions,
      notes: meeting.notes,
    });
    setEditingMeeting(meeting);
    setIsMeetingDialogOpen(true);
  };

  const handleAddQuestion = () => {
    if (!newQuestion.trim()) return;
    setMeetingForm(prev => ({
      ...prev,
      discussionQuestions: [...prev.discussionQuestions, newQuestion.trim()],
    }));
    setNewQuestion('');
  };

  const handleRemoveQuestion = (index: number) => {
    setMeetingForm(prev => ({
      ...prev,
      discussionQuestions: prev.discussionQuestions.filter((_, i) => i !== index),
    }));
  };

  const handleAddDefaultQuestions = () => {
    setMeetingForm(prev => ({
      ...prev,
      discussionQuestions: [...new Set([...prev.discussionQuestions, ...DEFAULT_DISCUSSION_QUESTIONS])],
    }));
  };

  const handleStartChallenge = (challengeId: string) => {
    setChallenges(prev => prev.map(c =>
      c.id === challengeId
        ? { ...c, isActive: true, startDate: new Date().toISOString() }
        : c
    ));
    setIsChallengeDialogOpen(false);
  };

  const handleUpdateChallengeProgress = (challengeId: string, increment: number) => {
    setChallenges(prev => prev.map(c => {
      if (c.id !== challengeId) return c;

      const newCurrent = Math.max(0, Math.min(c.current + increment, c.target));
      const isComplete = newCurrent >= c.target;

      if (isComplete && !c.isComplete) {
        // Award badge
        const newBadge: Badge = {
          id: `badge-${c.id}`,
          name: c.name,
          description: c.description,
          icon: getBadgeIcon(c.badgeIcon),
          earned: true,
          earnedDate: new Date().toISOString(),
        };
        setBadges(prev => [...prev, newBadge]);
      }

      return {
        ...c,
        current: newCurrent,
        isComplete,
        endDate: isComplete ? new Date().toISOString() : c.endDate,
      };
    }));
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <PageContainer>
      <Header>
        <Title variant="h1">
          <Users size={36} />
          Gothic Book Club
        </Title>
        <Subtitle>Schedule meetings, discuss books, and complete reading challenges</Subtitle>
      </Header>

      {/* Quick Stats */}
      <Box sx={{
        display: 'flex',
        gap: '16px',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginBottom: '32px',
      }}>
        {[
          { icon: <Calendar size={20} />, value: upcomingMeetings.length, label: 'Upcoming' },
          { icon: <Flame size={20} />, value: activeChallenges.length, label: 'Active Challenges' },
          { icon: <Trophy size={20} />, value: completedChallenges.length, label: 'Completed' },
          { icon: <Award size={20} />, value: badges.length, label: 'Badges Earned' },
        ].map((stat, idx) => (
          <Box
            key={idx}
            sx={{
              background: 'linear-gradient(145deg, rgba(26, 16, 40, 0.8) 0%, rgba(13, 13, 26, 0.9) 100%)',
              borderRadius: '16px',
              padding: '16px 24px',
              border: '1px solid rgba(236, 72, 153, 0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              minWidth: '120px',
            }}
          >
            <Box sx={{ color: '#ec4899' }}>{stat.icon}</Box>
            <Box>
              <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#ec4899' }}>
                {stat.value}
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', color: 'rgba(236, 72, 153, 0.7)', textTransform: 'uppercase' }}>
                {stat.label}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Meetings Section */}
      <Box sx={{ maxWidth: '1200px', margin: '0 auto 48px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <SectionTitle>
            <Calendar size={24} color="#ec4899" />
            Book Club Meetings
          </SectionTitle>
          <ActionButton onClick={() => setIsMeetingDialogOpen(true)} startIcon={<Plus size={18} />}>
            Schedule Meeting
          </ActionButton>
        </Box>

        {upcomingMeetings.length === 0 && pastMeetings.length === 0 ? (
          <Box sx={{
            textAlign: 'center',
            padding: '60px',
            background: 'rgba(26, 16, 40, 0.5)',
            borderRadius: '16px',
            border: '1px solid rgba(236, 72, 153, 0.2)',
          }}>
            <Calendar size={64} color="rgba(236, 72, 153, 0.3)" />
            <Typography sx={{ color: 'rgba(236, 72, 153, 0.6)', marginTop: '16px' }}>
              No meetings scheduled yet. Plan your first book club meeting!
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {upcomingMeetings.map(meeting => (
              <MeetingCard key={meeting.id}>
                <CardContent sx={{ padding: '24px' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography sx={{ fontSize: '1.25rem', fontWeight: 600, color: '#f0e6ff', marginBottom: '4px' }}>
                        {meeting.title}
                      </Typography>
                      <Typography sx={{ color: '#ec4899', marginBottom: '8px' }}>
                        <BookOpen size={14} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                        {meeting.bookTitle}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        <Chip
                          icon={<Calendar size={14} />}
                          label={formatDate(meeting.date)}
                          sx={{
                            backgroundColor: 'rgba(236, 72, 153, 0.15)',
                            color: '#f472b6',
                            border: '1px solid rgba(236, 72, 153, 0.3)',
                          }}
                        />
                        {meeting.time && (
                          <Chip
                            icon={<Clock size={14} />}
                            label={formatTime(meeting.time)}
                            sx={{
                              backgroundColor: 'rgba(139, 92, 246, 0.15)',
                              color: '#a855f7',
                              border: '1px solid rgba(139, 92, 246, 0.3)',
                            }}
                          />
                        )}
                        {meeting.discussionQuestions.length > 0 && (
                          <Chip
                            icon={<MessageSquare size={14} />}
                            label={`${meeting.discussionQuestions.length} questions`}
                            sx={{
                              backgroundColor: 'rgba(251, 191, 36, 0.15)',
                              color: '#fbbf24',
                              border: '1px solid rgba(251, 191, 36, 0.3)',
                            }}
                          />
                        )}
                      </Box>
                    </Box>
                    <Box>
                      <IconButton onClick={() => handleEditMeeting(meeting)} sx={{ color: '#ec4899' }}>
                        <Edit3 size={18} />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteMeeting(meeting.id)} sx={{ color: 'rgba(239, 68, 68, 0.7)' }}>
                        <Trash2 size={18} />
                      </IconButton>
                    </Box>
                  </Box>

                  {meeting.discussionQuestions.length > 0 && (
                    <Box sx={{ marginTop: '16px' }}>
                      <Typography sx={{ color: 'rgba(240, 230, 255, 0.7)', fontSize: '0.875rem', marginBottom: '8px' }}>
                        Discussion Questions:
                      </Typography>
                      {meeting.discussionQuestions.slice(0, 3).map((q, idx) => (
                        <QuestionCard key={idx}>
                          <Typography sx={{ color: '#f0e6ff', fontSize: '0.875rem' }}>
                            {idx + 1}. {q}
                          </Typography>
                        </QuestionCard>
                      ))}
                      {meeting.discussionQuestions.length > 3 && (
                        <Typography sx={{ color: 'rgba(236, 72, 153, 0.7)', fontSize: '0.75rem' }}>
                          +{meeting.discussionQuestions.length - 3} more questions
                        </Typography>
                      )}
                    </Box>
                  )}
                </CardContent>
              </MeetingCard>
            ))}

            {pastMeetings.length > 0 && (
              <>
                <Typography sx={{ color: 'rgba(240, 230, 255, 0.5)', marginTop: '24px', marginBottom: '8px' }}>
                  Past Meetings
                </Typography>
                {pastMeetings.slice(0, 3).map(meeting => (
                  <MeetingCard key={meeting.id} isPast>
                    <CardContent sx={{ padding: '16px 24px' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography sx={{ color: 'rgba(240, 230, 255, 0.7)', fontWeight: 600 }}>
                            {meeting.title}
                          </Typography>
                          <Typography sx={{ color: 'rgba(240, 230, 255, 0.5)', fontSize: '0.875rem' }}>
                            {meeting.bookTitle} - {formatDate(meeting.date)}
                          </Typography>
                        </Box>
                        <CheckCircle2 size={20} color="rgba(34, 197, 94, 0.5)" />
                      </Box>
                    </CardContent>
                  </MeetingCard>
                ))}
              </>
            )}
          </Box>
        )}
      </Box>

      {/* Reading Challenges Section */}
      <Box sx={{ maxWidth: '1200px', margin: '0 auto 48px' }}>
        <SectionTitle>
          <Target size={24} color="#ec4899" />
          Reading Challenges
        </SectionTitle>

        {/* Active Challenges */}
        {activeChallenges.length > 0 && (
          <Box sx={{ marginBottom: '32px' }}>
            <Typography sx={{ color: '#fbbf24', fontWeight: 600, marginBottom: '16px' }}>
              Active Challenges
            </Typography>
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '16px',
            }}>
              {activeChallenges.map(challenge => (
                <ChallengeCard key={challenge.id} isActive>
                  <CardContent sx={{ padding: '20px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <Box sx={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(251, 191, 36, 0.2)',
                        color: '#fbbf24',
                      }}>
                        {getBadgeIcon(challenge.badgeIcon)}
                      </Box>
                      <Box>
                        <Typography sx={{ fontWeight: 600, color: '#f0e6ff' }}>
                          {challenge.name}
                        </Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: 'rgba(240, 230, 255, 0.6)' }}>
                          {challenge.description}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ marginBottom: '12px' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <Typography sx={{ fontSize: '0.75rem', color: 'rgba(240, 230, 255, 0.6)' }}>
                          Progress
                        </Typography>
                        <Typography sx={{ fontSize: '0.875rem', color: '#fbbf24', fontWeight: 600 }}>
                          {challenge.current} / {challenge.target}
                        </Typography>
                      </Box>
                      <ProgressBar
                        variant="determinate"
                        value={(challenge.current / challenge.target) * 100}
                        sx={{
                          '& .MuiLinearProgress-bar': {
                            background: 'linear-gradient(90deg, #fbbf24, #f59e0b)',
                          },
                        }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', gap: '8px' }}>
                      <Button
                        size="small"
                        onClick={() => handleUpdateChallengeProgress(challenge.id, 1)}
                        sx={{
                          flex: 1,
                          backgroundColor: 'rgba(34, 197, 94, 0.2)',
                          color: '#22c55e',
                          '&:hover': { backgroundColor: 'rgba(34, 197, 94, 0.3)' },
                        }}
                      >
                        + Add Book
                      </Button>
                      <Button
                        size="small"
                        onClick={() => handleUpdateChallengeProgress(challenge.id, -1)}
                        disabled={challenge.current <= 0}
                        sx={{
                          backgroundColor: 'rgba(239, 68, 68, 0.2)',
                          color: '#ef4444',
                          '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.3)' },
                          '&:disabled': { opacity: 0.3 },
                        }}
                      >
                        -
                      </Button>
                    </Box>
                  </CardContent>
                </ChallengeCard>
              ))}
            </Box>
          </Box>
        )}

        {/* Available Challenges */}
        <Typography sx={{ color: 'rgba(240, 230, 255, 0.7)', fontWeight: 600, marginBottom: '16px' }}>
          Available Challenges
        </Typography>
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px',
        }}>
          {availableChallenges.map(challenge => (
            <ChallengeCard key={challenge.id} onClick={() => { setSelectedChallenge(challenge); setIsChallengeDialogOpen(true); }}>
              <CardContent sx={{ padding: '20px', cursor: 'pointer' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Box sx={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(139, 92, 246, 0.1)',
                    color: 'rgba(139, 92, 246, 0.5)',
                  }}>
                    {getBadgeIcon(challenge.badgeIcon)}
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 600, color: '#f0e6ff' }}>
                      {challenge.name}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: 'rgba(240, 230, 255, 0.6)' }}>
                      {challenge.description}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </ChallengeCard>
          ))}
        </Box>

        {/* Completed Challenges */}
        {completedChallenges.length > 0 && (
          <Box sx={{ marginTop: '32px' }}>
            <Typography sx={{ color: '#22c55e', fontWeight: 600, marginBottom: '16px' }}>
              Completed Challenges
            </Typography>
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '16px',
            }}>
              {completedChallenges.map(challenge => (
                <ChallengeCard key={challenge.id} isComplete>
                  <CardContent sx={{ padding: '20px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Box sx={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(34, 197, 94, 0.2)',
                        color: '#22c55e',
                      }}>
                        {getBadgeIcon(challenge.badgeIcon)}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontWeight: 600, color: '#22c55e' }}>
                          {challenge.name}
                        </Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: 'rgba(240, 230, 255, 0.6)' }}>
                          Completed!
                        </Typography>
                      </Box>
                      <CheckCircle2 size={24} color="#22c55e" />
                    </Box>
                  </CardContent>
                </ChallengeCard>
              ))}
            </Box>
          </Box>
        )}
      </Box>

      {/* Badges Section */}
      <Box sx={{ maxWidth: '1200px', margin: '0 auto' }}>
        <SectionTitle>
          <Award size={24} color="#ec4899" />
          Your Badges
        </SectionTitle>

        {badges.length === 0 ? (
          <Box sx={{
            textAlign: 'center',
            padding: '40px',
            background: 'rgba(26, 16, 40, 0.5)',
            borderRadius: '16px',
            border: '1px solid rgba(236, 72, 153, 0.2)',
          }}>
            <Trophy size={48} color="rgba(236, 72, 153, 0.3)" />
            <Typography sx={{ color: 'rgba(236, 72, 153, 0.6)', marginTop: '12px' }}>
              Complete challenges to earn badges!
            </Typography>
          </Box>
        ) : (
          <Box sx={{
            display: 'flex',
            gap: '24px',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
            {badges.map(badge => (
              <Box key={badge.id} sx={{ textAlign: 'center' }}>
                <BadgeDisplay earned={badge.earned}>
                  {badge.icon}
                </BadgeDisplay>
                <Typography sx={{ color: '#fbbf24', fontWeight: 600, marginTop: '8px', fontSize: '0.875rem' }}>
                  {badge.name}
                </Typography>
                {badge.earnedDate && (
                  <Typography sx={{ color: 'rgba(240, 230, 255, 0.5)', fontSize: '0.7rem' }}>
                    {new Date(badge.earnedDate).toLocaleDateString()}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Meeting Dialog */}
      <DialogStyled open={isMeetingDialogOpen} onClose={() => { setIsMeetingDialogOpen(false); resetMeetingForm(); }}>
        <DialogTitle sx={{
          background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(244, 114, 182, 0.1) 100%)',
          color: '#f0e6ff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Calendar size={24} color="#ec4899" />
            {editingMeeting ? 'Edit Meeting' : 'Schedule Meeting'}
          </Box>
          <IconButton onClick={() => { setIsMeetingDialogOpen(false); resetMeetingForm(); }} sx={{ color: '#f0e6ff' }}>
            <X size={20} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ padding: '24px' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
            <StyledTextField
              label="Meeting Title"
              value={meetingForm.title}
              onChange={(e) => setMeetingForm(prev => ({ ...prev, title: e.target.value }))}
              fullWidth
              required
            />
            <StyledTextField
              label="Book Title"
              value={meetingForm.bookTitle}
              onChange={(e) => setMeetingForm(prev => ({ ...prev, bookTitle: e.target.value }))}
              fullWidth
              required
            />
            <Box sx={{ display: 'flex', gap: '16px' }}>
              <StyledTextField
                label="Date"
                type="date"
                value={meetingForm.date}
                onChange={(e) => setMeetingForm(prev => ({ ...prev, date: e.target.value }))}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <StyledTextField
                label="Time"
                type="time"
                value={meetingForm.time}
                onChange={(e) => setMeetingForm(prev => ({ ...prev, time: e.target.value }))}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Box>

            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <Typography sx={{ color: 'rgba(236, 72, 153, 0.8)', fontWeight: 600 }}>
                  Discussion Questions
                </Typography>
                <Button
                  size="small"
                  onClick={handleAddDefaultQuestions}
                  sx={{ color: '#ec4899', fontSize: '0.75rem' }}
                >
                  + Add Defaults
                </Button>
              </Box>
              {meetingForm.discussionQuestions.map((q, idx) => (
                <Box key={idx} sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px',
                  background: 'rgba(236, 72, 153, 0.1)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                }}>
                  <Typography sx={{ flex: 1, color: '#f0e6ff', fontSize: '0.875rem' }}>
                    {idx + 1}. {q}
                  </Typography>
                  <IconButton size="small" onClick={() => handleRemoveQuestion(idx)} sx={{ color: 'rgba(239, 68, 68, 0.7)' }}>
                    <X size={16} />
                  </IconButton>
                </Box>
              ))}
              <Box sx={{ display: 'flex', gap: '8px' }}>
                <StyledTextField
                  label="Add a question"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  fullWidth
                  size="small"
                />
                <Button onClick={handleAddQuestion} sx={{ color: '#ec4899' }}>
                  <Plus size={20} />
                </Button>
              </Box>
            </Box>

            <StyledTextField
              label="Notes"
              value={meetingForm.notes}
              onChange={(e) => setMeetingForm(prev => ({ ...prev, notes: e.target.value }))}
              fullWidth
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ padding: '16px 24px', borderTop: '1px solid rgba(236, 72, 153, 0.2)' }}>
          <Button onClick={() => { setIsMeetingDialogOpen(false); resetMeetingForm(); }} sx={{ color: 'rgba(240, 230, 255, 0.7)' }}>
            Cancel
          </Button>
          <ActionButton onClick={handleSaveMeeting}>
            {editingMeeting ? 'Save Changes' : 'Schedule'}
          </ActionButton>
        </DialogActions>
      </DialogStyled>

      {/* Challenge Dialog */}
      <DialogStyled open={isChallengeDialogOpen} onClose={() => setIsChallengeDialogOpen(false)}>
        {selectedChallenge && (
          <>
            <DialogTitle sx={{
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(168, 85, 247, 0.1) 100%)',
              color: '#f0e6ff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Target size={24} color="#8b5cf6" />
                Start Challenge
              </Box>
              <IconButton onClick={() => setIsChallengeDialogOpen(false)} sx={{ color: '#f0e6ff' }}>
                <X size={20} />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ padding: '24px', textAlign: 'center' }}>
              <Box sx={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                margin: '0 auto 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(139, 92, 246, 0.2)',
                color: '#8b5cf6',
              }}>
                {getBadgeIcon(selectedChallenge.badgeIcon)}
              </Box>
              <Typography sx={{ fontSize: '1.5rem', fontWeight: 600, color: '#f0e6ff', marginBottom: '8px' }}>
                {selectedChallenge.name}
              </Typography>
              <Typography sx={{ color: 'rgba(240, 230, 255, 0.7)', marginBottom: '16px' }}>
                {selectedChallenge.description}
              </Typography>
              <Chip
                label={`${selectedChallenge.target} books to complete`}
                sx={{
                  backgroundColor: 'rgba(251, 191, 36, 0.2)',
                  color: '#fbbf24',
                  border: '1px solid rgba(251, 191, 36, 0.3)',
                }}
              />
            </DialogContent>
            <DialogActions sx={{ padding: '16px 24px', borderTop: '1px solid rgba(139, 92, 246, 0.2)' }}>
              <Button onClick={() => setIsChallengeDialogOpen(false)} sx={{ color: 'rgba(240, 230, 255, 0.7)' }}>
                Cancel
              </Button>
              <ActionButton onClick={() => handleStartChallenge(selectedChallenge.id)}>
                Start Challenge
              </ActionButton>
            </DialogActions>
          </>
        )}
      </DialogStyled>
    </PageContainer>
  );
};

export default BookClub;
