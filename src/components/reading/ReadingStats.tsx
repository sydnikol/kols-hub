import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  BarChart3,
  BookOpen,
  Clock,
  Star,
  TrendingUp,
  Calendar,
  Bookmark,
  CheckCircle2,
  Award,
  PieChart,
  Timer,
  Zap,
  Heart,
  Library,
} from 'lucide-react';

import type { TrackedBook } from './BookTracker';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const growIn = keyframes`
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
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
    background: 'radial-gradient(ellipse at center top, rgba(14, 165, 233, 0.15) 0%, transparent 70%)',
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
  background: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 50%, #7dd3fc 100%)',
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
  color: 'rgba(14, 165, 233, 0.8)',
  fontSize: '1rem',
});

const StatCard = styled(Card)<{ accentColor?: string }>(({ accentColor = '#0ea5e9' }) => ({
  background: 'linear-gradient(145deg, rgba(26, 16, 40, 0.9) 0%, rgba(13, 13, 26, 0.95) 100%)',
  borderRadius: '20px',
  border: `1px solid ${accentColor}30`,
  overflow: 'hidden',
  position: 'relative',
  transition: 'all 0.3s ease',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: `linear-gradient(90deg, ${accentColor}, ${accentColor}80)`,
  },
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: `0 12px 40px ${accentColor}20`,
  },
}));

const ChartContainer = styled(Box)({
  padding: '20px',
  background: 'linear-gradient(145deg, rgba(26, 16, 40, 0.6) 0%, rgba(13, 13, 26, 0.8) 100%)',
  borderRadius: '16px',
  border: '1px solid rgba(14, 165, 233, 0.2)',
});

const BarChartBar = styled(Box)<{ height: number; color: string }>(({ height, color }) => ({
  width: '100%',
  height: `${height}%`,
  background: `linear-gradient(to top, ${color}, ${color}80)`,
  borderRadius: '4px 4px 0 0',
  transition: 'height 0.5s ease-out',
  animation: `${growIn} 0.8s ease-out`,
  transformOrigin: 'bottom',
}));

const PieSlice = styled(Box)<{ percentage: number; color: string; rotation: number }>(
  ({ percentage, color, rotation }) => ({
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    background: `conic-gradient(
      ${color} 0deg,
      ${color} ${percentage * 3.6}deg,
      transparent ${percentage * 3.6}deg
    )`,
    transform: `rotate(${rotation}deg)`,
  })
);

const TimelineCard = styled(Box)<{ isRecent?: boolean }>(({ isRecent }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px 16px',
  background: isRecent
    ? 'linear-gradient(145deg, rgba(14, 165, 233, 0.15) 0%, rgba(56, 189, 248, 0.05) 100%)'
    : 'rgba(26, 16, 40, 0.5)',
  borderRadius: '12px',
  border: `1px solid ${isRecent ? 'rgba(14, 165, 233, 0.3)' : 'rgba(139, 92, 246, 0.2)'}`,
  marginBottom: '8px',
  animation: `${fadeIn} 0.5s ease-out`,
}));

const StyledSelect = styled(FormControl)({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(26, 16, 40, 0.8)',
    borderRadius: '12px',
    color: '#f0e6ff',
    '& fieldset': {
      borderColor: 'rgba(14, 165, 233, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(14, 165, 233, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#0ea5e9',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(14, 165, 233, 0.7)',
  },
  '& .MuiSelect-icon': {
    color: '#0ea5e9',
  },
});

// Types
interface ReadingSession {
  id: string;
  bookId: string;
  startTime: string;
  endTime: string;
  pagesRead: number;
}

interface TimeStats {
  totalMinutes: number;
  avgSessionMinutes: number;
  longestSessionMinutes: number;
  sessionsThisWeek: number;
}

const STORAGE_KEY_BOOKS = 'gothic-library-books';
const STORAGE_KEY_SESSIONS = 'gothic-reading-sessions';

const GENRE_COLORS: Record<string, string> = {
  'Gothic Literature': '#8b5cf6',
  'Black Authors': '#22c55e',
  'LGBTQ+ Authors': '#ec4899',
  'Fantasy/Sci-Fi': '#3b82f6',
  'Self-Help/Wellness': '#fbbf24',
  'Poetry': '#f472b6',
  'Historical Fiction': '#d97706',
  'Mystery/Thriller': '#ef4444',
  'Other': '#6b7280',
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const ReadingStats: React.FC = () => {
  const [books, setBooks] = useState<TrackedBook[]>([]);
  const [sessions, setSessions] = useState<ReadingSession[]>([]);
  const [timeRange, setTimeRange] = useState<'all' | 'year' | 'month' | 'week'>('year');
  const [isTrackingTime, setIsTrackingTime] = useState(false);
  const [currentSessionStart, setCurrentSessionStart] = useState<Date | null>(null);
  const [selectedBookForTracking, setSelectedBookForTracking] = useState<string>('');

  // Load from localStorage
  useEffect(() => {
    const savedBooks = localStorage.getItem(STORAGE_KEY_BOOKS);
    const savedSessions = localStorage.getItem(STORAGE_KEY_SESSIONS);

    if (savedBooks) {
      try {
        setBooks(JSON.parse(savedBooks));
      } catch (e) {
        console.error('Failed to load books:', e);
      }
    }

    if (savedSessions) {
      try {
        setSessions(JSON.parse(savedSessions));
      } catch (e) {
        console.error('Failed to load sessions:', e);
      }
    }
  }, []);

  // Save sessions to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
  }, [sessions]);

  // Filter books by time range
  const filteredBooks = useMemo(() => {
    if (timeRange === 'all') return books;

    const now = new Date();
    let cutoffDate: Date;

    switch (timeRange) {
      case 'week':
        cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        cutoffDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        cutoffDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        return books;
    }

    return books.filter(book => {
      const bookDate = book.finishDate ? new Date(book.finishDate) : new Date(book.updatedAt);
      return bookDate >= cutoffDate;
    });
  }, [books, timeRange]);

  // Core stats
  const stats = useMemo(() => {
    const finishedBooks = filteredBooks.filter(b => b.status === 'finished');
    const totalBooks = finishedBooks.length;
    const totalPages = finishedBooks.reduce((sum, b) => sum + b.pageCount, 0);
    const ratedBooks = finishedBooks.filter(b => b.rating && b.rating > 0);
    const avgRating = ratedBooks.length > 0
      ? ratedBooks.reduce((sum, b) => sum + (b.rating || 0), 0) / ratedBooks.length
      : 0;

    const currentlyReading = filteredBooks.filter(b => b.status === 'currently_reading').length;
    const wantToRead = filteredBooks.filter(b => b.status === 'want_to_read').length;

    // Calculate reading speed (pages per day for finished books)
    let avgPagesPerDay = 0;
    const booksWithDates = finishedBooks.filter(b => b.startDate && b.finishDate);
    if (booksWithDates.length > 0) {
      const speeds = booksWithDates.map(b => {
        const start = new Date(b.startDate!);
        const end = new Date(b.finishDate!);
        const days = Math.max(1, (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        return b.pageCount / days;
      });
      avgPagesPerDay = speeds.reduce((sum, s) => sum + s, 0) / speeds.length;
    }

    // Calculate avg days to finish a book
    let avgDaysToFinish = 0;
    if (booksWithDates.length > 0) {
      const days = booksWithDates.map(b => {
        const start = new Date(b.startDate!);
        const end = new Date(b.finishDate!);
        return (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
      });
      avgDaysToFinish = days.reduce((sum, d) => sum + d, 0) / days.length;
    }

    return {
      totalBooks,
      totalPages,
      avgRating,
      currentlyReading,
      wantToRead,
      avgPagesPerDay: Math.round(avgPagesPerDay),
      avgDaysToFinish: Math.round(avgDaysToFinish),
    };
  }, [filteredBooks]);

  // Genre breakdown
  const genreBreakdown = useMemo(() => {
    const genreCounts: Record<string, number> = {};
    const finishedBooks = filteredBooks.filter(b => b.status === 'finished');

    finishedBooks.forEach(book => {
      const genre = book.genre || 'Other';
      genreCounts[genre] = (genreCounts[genre] || 0) + 1;
    });

    return Object.entries(genreCounts)
      .map(([genre, count]) => ({
        genre,
        count,
        percentage: finishedBooks.length > 0 ? (count / finishedBooks.length) * 100 : 0,
        color: GENRE_COLORS[genre] || GENRE_COLORS['Other'],
      }))
      .sort((a, b) => b.count - a.count);
  }, [filteredBooks]);

  // Monthly breakdown
  const monthlyBreakdown = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const monthCounts = Array(12).fill(0);

    filteredBooks
      .filter(b => b.status === 'finished' && b.finishDate)
      .forEach(book => {
        const date = new Date(book.finishDate!);
        if (date.getFullYear() === currentYear) {
          monthCounts[date.getMonth()]++;
        }
      });

    const maxCount = Math.max(...monthCounts, 1);
    return monthCounts.map((count, idx) => ({
      month: MONTHS[idx],
      count,
      percentage: (count / maxCount) * 100,
    }));
  }, [filteredBooks]);

  // Time tracking stats
  const timeStats = useMemo((): TimeStats => {
    if (sessions.length === 0) {
      return { totalMinutes: 0, avgSessionMinutes: 0, longestSessionMinutes: 0, sessionsThisWeek: 0 };
    }

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const sessionDurations = sessions.map(s => {
      const start = new Date(s.startTime);
      const end = new Date(s.endTime);
      return (end.getTime() - start.getTime()) / (1000 * 60);
    });

    const totalMinutes = sessionDurations.reduce((sum, d) => sum + d, 0);
    const avgSessionMinutes = totalMinutes / sessions.length;
    const longestSessionMinutes = Math.max(...sessionDurations);
    const sessionsThisWeek = sessions.filter(s => new Date(s.startTime) >= weekAgo).length;

    return {
      totalMinutes: Math.round(totalMinutes),
      avgSessionMinutes: Math.round(avgSessionMinutes),
      longestSessionMinutes: Math.round(longestSessionMinutes),
      sessionsThisWeek,
    };
  }, [sessions]);

  // Recent books timeline
  const recentBooks = useMemo(() => {
    return filteredBooks
      .filter(b => b.status === 'finished')
      .sort((a, b) => new Date(b.finishDate || b.updatedAt).getTime() - new Date(a.finishDate || a.updatedAt).getTime())
      .slice(0, 10);
  }, [filteredBooks]);

  // Top rated books
  const topRatedBooks = useMemo(() => {
    return filteredBooks
      .filter(b => b.rating && b.rating >= 4)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 5);
  }, [filteredBooks]);

  const formatTime = (minutes: number): string => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const handleStartSession = () => {
    if (!selectedBookForTracking) return;
    setCurrentSessionStart(new Date());
    setIsTrackingTime(true);
  };

  const handleEndSession = (pagesRead: number) => {
    if (!currentSessionStart || !selectedBookForTracking) return;

    const newSession: ReadingSession = {
      id: `session-${Date.now()}`,
      bookId: selectedBookForTracking,
      startTime: currentSessionStart.toISOString(),
      endTime: new Date().toISOString(),
      pagesRead,
    };

    setSessions(prev => [...prev, newSession]);
    setIsTrackingTime(false);
    setCurrentSessionStart(null);
  };

  const currentlyReadingBooks = books.filter(b => b.status === 'currently_reading');

  return (
    <PageContainer>
      <Header>
        <Title variant="h1">
          <BarChart3 size={36} />
          Reading Statistics
        </Title>
        <Subtitle>Track your reading journey with detailed insights</Subtitle>
      </Header>

      {/* Time Range Filter */}
      <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
        <StyledSelect sx={{ minWidth: '200px' }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            label="Time Range"
            onChange={(e) => setTimeRange(e.target.value as typeof timeRange)}
          >
            <MenuItem value="week">This Week</MenuItem>
            <MenuItem value="month">This Month</MenuItem>
            <MenuItem value="year">This Year</MenuItem>
            <MenuItem value="all">All Time</MenuItem>
          </Select>
        </StyledSelect>
      </Box>

      {/* Main Stats Grid */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        maxWidth: '1200px',
        margin: '0 auto 48px',
      }}>
        {[
          { icon: <BookOpen size={28} />, value: stats.totalBooks, label: 'Books Finished', color: '#0ea5e9' },
          { icon: <Library size={28} />, value: stats.totalPages.toLocaleString(), label: 'Pages Read', color: '#8b5cf6' },
          { icon: <Star size={28} />, value: stats.avgRating.toFixed(1), label: 'Avg Rating', color: '#fbbf24' },
          { icon: <TrendingUp size={28} />, value: stats.avgPagesPerDay, label: 'Pages/Day', color: '#22c55e' },
          { icon: <Clock size={28} />, value: stats.avgDaysToFinish || '-', label: 'Avg Days/Book', color: '#ec4899' },
          { icon: <Bookmark size={28} />, value: stats.currentlyReading, label: 'Reading Now', color: '#f97316' },
        ].map((stat, idx) => (
          <StatCard key={idx} accentColor={stat.color}>
            <CardContent sx={{ padding: '24px', textAlign: 'center' }}>
              <Box sx={{ color: stat.color, marginBottom: '12px' }}>{stat.icon}</Box>
              <Typography sx={{ fontSize: '2.5rem', fontWeight: 700, color: stat.color }}>
                {stat.value}
              </Typography>
              <Typography sx={{ fontSize: '0.875rem', color: 'rgba(240, 230, 255, 0.7)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {stat.label}
              </Typography>
            </CardContent>
          </StatCard>
        ))}
      </Box>

      {/* Charts Section */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '24px',
        maxWidth: '1200px',
        margin: '0 auto 48px',
      }}>
        {/* Monthly Reading Chart */}
        <ChartContainer>
          <Typography sx={{ color: '#0ea5e9', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={20} />
            Books by Month ({new Date().getFullYear()})
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '200px', gap: '8px' }}>
            {monthlyBreakdown.map((month, idx) => (
              <Box key={idx} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                <Box sx={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end' }}>
                  <BarChartBar
                    height={month.percentage || 2}
                    color={idx === new Date().getMonth() ? '#fbbf24' : '#0ea5e9'}
                  />
                </Box>
                <Typography sx={{
                  fontSize: '0.7rem',
                  color: idx === new Date().getMonth() ? '#fbbf24' : 'rgba(240, 230, 255, 0.6)',
                  marginTop: '8px',
                }}>
                  {month.month}
                </Typography>
                <Typography sx={{
                  fontSize: '0.75rem',
                  color: idx === new Date().getMonth() ? '#fbbf24' : '#0ea5e9',
                  fontWeight: 600,
                }}>
                  {month.count}
                </Typography>
              </Box>
            ))}
          </Box>
        </ChartContainer>

        {/* Genre Breakdown */}
        <ChartContainer>
          <Typography sx={{ color: '#0ea5e9', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PieChart size={20} />
            Genre Breakdown
          </Typography>
          {genreBreakdown.length === 0 ? (
            <Box sx={{ textAlign: 'center', padding: '40px' }}>
              <PieChart size={48} color="rgba(14, 165, 233, 0.3)" />
              <Typography sx={{ color: 'rgba(14, 165, 233, 0.6)', marginTop: '12px' }}>
                Finish some books to see your genre breakdown!
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
              {/* Pie Chart Visual */}
              <Box sx={{ position: 'relative', width: '150px', height: '150px', flexShrink: 0 }}>
                {(() => {
                  let rotation = 0;
                  return genreBreakdown.map((genre, idx) => {
                    const slice = (
                      <PieSlice
                        key={idx}
                        percentage={genre.percentage}
                        color={genre.color}
                        rotation={rotation}
                      />
                    );
                    rotation += genre.percentage * 3.6;
                    return slice;
                  });
                })()}
                <Box sx={{
                  position: 'absolute',
                  inset: '20%',
                  borderRadius: '50%',
                  background: '#1a1028',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Typography sx={{ color: '#f0e6ff', fontWeight: 600, fontSize: '1.25rem' }}>
                    {stats.totalBooks}
                  </Typography>
                </Box>
              </Box>
              {/* Legend */}
              <Box sx={{ flex: 1 }}>
                {genreBreakdown.slice(0, 6).map((genre, idx) => (
                  <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Box sx={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: genre.color }} />
                    <Typography sx={{ flex: 1, color: '#f0e6ff', fontSize: '0.875rem' }}>
                      {genre.genre}
                    </Typography>
                    <Typography sx={{ color: genre.color, fontSize: '0.875rem', fontWeight: 600 }}>
                      {genre.count}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </ChartContainer>
      </Box>

      {/* Time Tracking Section */}
      <Box sx={{ maxWidth: '1200px', margin: '0 auto 48px' }}>
        <Typography sx={{ fontSize: '1.5rem', fontWeight: 600, color: '#f0e6ff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Timer size={24} color="#0ea5e9" />
          Reading Time Tracker
        </Typography>

        <Box sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}>
          {[
            { icon: <Clock size={20} />, value: formatTime(timeStats.totalMinutes), label: 'Total Time', color: '#0ea5e9' },
            { icon: <Timer size={20} />, value: formatTime(timeStats.avgSessionMinutes), label: 'Avg Session', color: '#8b5cf6' },
            { icon: <Zap size={20} />, value: formatTime(timeStats.longestSessionMinutes), label: 'Longest Session', color: '#fbbf24' },
            { icon: <Calendar size={20} />, value: timeStats.sessionsThisWeek, label: 'Sessions/Week', color: '#22c55e' },
          ].map((stat, idx) => (
            <Box
              key={idx}
              sx={{
                background: 'linear-gradient(145deg, rgba(26, 16, 40, 0.8) 0%, rgba(13, 13, 26, 0.9) 100%)',
                borderRadius: '12px',
                padding: '16px',
                border: `1px solid ${stat.color}30`,
                textAlign: 'center',
              }}
            >
              <Box sx={{ color: stat.color, marginBottom: '8px' }}>{stat.icon}</Box>
              <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: stat.color }}>
                {stat.value}
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', color: 'rgba(240, 230, 255, 0.6)', textTransform: 'uppercase' }}>
                {stat.label}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Session Tracker */}
        <ChartContainer>
          <Typography sx={{ color: '#0ea5e9', fontWeight: 600, marginBottom: '16px' }}>
            Track a Reading Session
          </Typography>
          {!isTrackingTime ? (
            <Box sx={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
              <StyledSelect sx={{ minWidth: '200px' }}>
                <InputLabel>Select Book</InputLabel>
                <Select
                  value={selectedBookForTracking}
                  label="Select Book"
                  onChange={(e) => setSelectedBookForTracking(e.target.value)}
                >
                  {currentlyReadingBooks.map(book => (
                    <MenuItem key={book.id} value={book.id}>{book.title}</MenuItem>
                  ))}
                </Select>
              </StyledSelect>
              <Box
                component="button"
                onClick={handleStartSession}
                disabled={!selectedBookForTracking}
                sx={{
                  background: selectedBookForTracking
                    ? 'linear-gradient(135deg, #22c55e 0%, #4ade80 100%)'
                    : 'rgba(107, 114, 128, 0.5)',
                  color: selectedBookForTracking ? '#0a0812' : '#6b7280',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px 24px',
                  fontWeight: 600,
                  cursor: selectedBookForTracking ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease',
                  '&:hover': selectedBookForTracking ? {
                    transform: 'scale(1.02)',
                  } : {},
                }}
              >
                <Timer size={18} />
                Start Session
              </Box>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center' }}>
              <Typography sx={{ color: '#22c55e', fontSize: '1.25rem', marginBottom: '16px' }}>
                Session in progress...
              </Typography>
              <Typography sx={{ color: 'rgba(240, 230, 255, 0.6)', marginBottom: '16px' }}>
                Started at {currentSessionStart?.toLocaleTimeString()}
              </Typography>
              <Box
                component="button"
                onClick={() => {
                  const pages = window.prompt('How many pages did you read?');
                  if (pages) handleEndSession(parseInt(pages) || 0);
                }}
                sx={{
                  background: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px 24px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                End Session
              </Box>
            </Box>
          )}
        </ChartContainer>
      </Box>

      {/* Recent Activity & Top Rated */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '24px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        {/* Recent Books Timeline */}
        <ChartContainer>
          <Typography sx={{ color: '#0ea5e9', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={20} />
            Recently Finished
          </Typography>
          {recentBooks.length === 0 ? (
            <Box sx={{ textAlign: 'center', padding: '40px' }}>
              <BookOpen size={48} color="rgba(14, 165, 233, 0.3)" />
              <Typography sx={{ color: 'rgba(14, 165, 233, 0.6)', marginTop: '12px' }}>
                No finished books yet
              </Typography>
            </Box>
          ) : (
            recentBooks.map((book, idx) => (
              <TimelineCard key={book.id} isRecent={idx === 0}>
                <CheckCircle2 size={20} color={idx === 0 ? '#0ea5e9' : 'rgba(139, 92, 246, 0.5)'} />
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ color: '#f0e6ff', fontWeight: 600, fontSize: '0.9rem' }}>
                    {book.title}
                  </Typography>
                  <Typography sx={{ color: 'rgba(240, 230, 255, 0.6)', fontSize: '0.75rem' }}>
                    {book.author}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  {book.rating && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                      <Star size={12} color="#fbbf24" fill="#fbbf24" />
                      <Typography sx={{ color: '#fbbf24', fontSize: '0.75rem' }}>{book.rating}</Typography>
                    </Box>
                  )}
                  <Typography sx={{ color: 'rgba(240, 230, 255, 0.5)', fontSize: '0.7rem' }}>
                    {book.finishDate ? new Date(book.finishDate).toLocaleDateString() : 'Recently'}
                  </Typography>
                </Box>
              </TimelineCard>
            ))
          )}
        </ChartContainer>

        {/* Top Rated Books */}
        <ChartContainer>
          <Typography sx={{ color: '#0ea5e9', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={20} />
            Your Top Rated
          </Typography>
          {topRatedBooks.length === 0 ? (
            <Box sx={{ textAlign: 'center', padding: '40px' }}>
              <Star size={48} color="rgba(251, 191, 36, 0.3)" />
              <Typography sx={{ color: 'rgba(251, 191, 36, 0.6)', marginTop: '12px' }}>
                Rate some books to see your favorites!
              </Typography>
            </Box>
          ) : (
            topRatedBooks.map((book, idx) => (
              <Box
                key={book.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  background: idx === 0
                    ? 'linear-gradient(145deg, rgba(251, 191, 36, 0.15) 0%, rgba(245, 158, 11, 0.05) 100%)'
                    : 'transparent',
                  borderRadius: '12px',
                  marginBottom: '8px',
                }}
              >
                <Typography sx={{
                  color: idx === 0 ? '#fbbf24' : 'rgba(240, 230, 255, 0.5)',
                  fontWeight: 600,
                  fontSize: '1.25rem',
                  width: '30px',
                }}>
                  #{idx + 1}
                </Typography>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ color: '#f0e6ff', fontWeight: 600, fontSize: '0.9rem' }}>
                    {book.title}
                  </Typography>
                  <Typography sx={{ color: 'rgba(240, 230, 255, 0.6)', fontSize: '0.75rem' }}>
                    {book.author}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      color="#fbbf24"
                      fill={i < (book.rating || 0) ? '#fbbf24' : 'transparent'}
                    />
                  ))}
                </Box>
              </Box>
            ))
          )}
        </ChartContainer>
      </Box>
    </PageContainer>
  );
};

export default ReadingStats;
