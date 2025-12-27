import React, { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Avatar,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  LinearProgress,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  TrendingUp,
  Calendar,
  Moon,
  BarChart3,
  Eye,
  Zap,
  Repeat,
  Clock,
  Star,
  Brain,
  Activity,
  PieChart,
} from 'lucide-react';
import { DreamEntry, DREAM_STORAGE_KEY, moonPhases, dreamMoods } from './DreamJournal';
import { getSymbolById, dreamSymbolCategories } from '../../data/dream_symbols';

// ============ ANIMATIONS ============
const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
`;

// ============ STYLED COMPONENTS ============
const PatternsContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #0a0812 0%, #0d0a1a 50%, #1a0d1a 100%)',
  padding: '24px',
});

const GothicTitle = styled(Typography)({
  fontFamily: '"Cinzel Decorative", "Times New Roman", serif',
  background: 'linear-gradient(135deg, #c0c0c0 0%, #a78bfa 30%, #8b5cf6 60%, #c0c0c0 100%)',
  backgroundSize: '200% auto',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
  textShadow: '0 0 40px rgba(139, 92, 246, 0.5)',
  animation: `${shimmer} 4s linear infinite`,
});

const StatCard = styled(Card)<{ accentColor?: string }>(({ accentColor = '#8b5cf6' }) => ({
  background: `linear-gradient(135deg, ${accentColor}15 0%, ${accentColor}08 100%)`,
  backdropFilter: 'blur(10px)',
  border: `1px solid ${accentColor}40`,
  borderRadius: '16px',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: `0 8px 32px ${accentColor}30`,
  },
}));

const CalendarGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: '4px',
});

const CalendarDay = styled(Box)<{ intensity?: number; isToday?: boolean }>(({ intensity = 0, isToday }) => ({
  width: '100%',
  aspectRatio: '1',
  borderRadius: '4px',
  background: intensity > 0
    ? `rgba(139, 92, 246, ${0.2 + intensity * 0.2})`
    : 'rgba(139, 92, 246, 0.05)',
  border: isToday ? '2px solid #c0c0c0' : '1px solid rgba(139, 92, 246, 0.2)',
  cursor: intensity > 0 ? 'pointer' : 'default',
  transition: 'all 0.2s ease',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.7rem',
  color: intensity > 0 ? '#e9d5ff' : '#6366f1',
  '&:hover': {
    transform: intensity > 0 ? 'scale(1.1)' : 'none',
    boxShadow: intensity > 0 ? '0 4px 12px rgba(139, 92, 246, 0.3)' : 'none',
  },
}));

const ProgressBar = styled(LinearProgress)<{ barColor?: string }>(({ barColor = '#8b5cf6' }) => ({
  height: 8,
  borderRadius: 4,
  background: 'rgba(139, 92, 246, 0.1)',
  '& .MuiLinearProgress-bar': {
    background: `linear-gradient(90deg, ${barColor}, ${barColor}80)`,
    borderRadius: 4,
  },
}));

// ============ HELPER FUNCTIONS ============
const getLast12Months = (): { month: string; year: number }[] => {
  const months = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      month: d.toLocaleString('default', { month: 'short' }),
      year: d.getFullYear(),
    });
  }
  return months;
};

const getCalendarDays = (year: number, month: number): { date: Date; dayOfMonth: number }[] => {
  const days = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // Add empty days for the start of the week
  for (let i = 0; i < firstDay.getDay(); i++) {
    days.push({ date: new Date(year, month, -i), dayOfMonth: 0 });
  }
  days.reverse();

  // Add actual days
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push({ date: new Date(year, month, i), dayOfMonth: i });
  }

  return days;
};

const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// ============ MAIN COMPONENT ============
export const DreamPatterns: React.FC = () => {
  const [dreams, setDreams] = useState<DreamEntry[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [timeRange, setTimeRange] = useState<'month' | '3months' | 'year' | 'all'>('3months');

  // Load dreams from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(DREAM_STORAGE_KEY);
    if (stored) {
      try {
        setDreams(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load dreams:', e);
      }
    }
  }, []);

  // Filter dreams by time range
  const filteredDreams = useMemo(() => {
    const now = new Date();
    return dreams.filter(dream => {
      const dreamDate = new Date(dream.date);
      switch (timeRange) {
        case 'month':
          return dreamDate >= new Date(now.getFullYear(), now.getMonth(), 1);
        case '3months':
          return dreamDate >= new Date(now.getFullYear(), now.getMonth() - 3, 1);
        case 'year':
          return dreamDate >= new Date(now.getFullYear() - 1, now.getMonth(), 1);
        default:
          return true;
      }
    });
  }, [dreams, timeRange]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalDreams = filteredDreams.length;
    const lucidDreams = filteredDreams.filter(d => d.lucidity >= 4).length;
    const recurringDreams = filteredDreams.filter(d => d.recurring).length;
    const avgClarity = totalDreams > 0
      ? filteredDreams.reduce((sum, d) => sum + d.clarity, 0) / totalDreams
      : 0;
    const avgLucidity = totalDreams > 0
      ? filteredDreams.reduce((sum, d) => sum + d.lucidity, 0) / totalDreams
      : 0;
    const avgSleepQuality = totalDreams > 0
      ? filteredDreams.filter(d => d.sleepQuality).reduce((sum, d) => sum + (d.sleepQuality || 0), 0) / filteredDreams.filter(d => d.sleepQuality).length
      : 0;

    return { totalDreams, lucidDreams, recurringDreams, avgClarity, avgLucidity, avgSleepQuality };
  }, [filteredDreams]);

  // Symbol frequency analysis
  const symbolStats = useMemo(() => {
    const symbolCount: Record<string, number> = {};
    filteredDreams.forEach(dream => {
      dream.symbols.forEach(symbolId => {
        symbolCount[symbolId] = (symbolCount[symbolId] || 0) + 1;
      });
    });

    return Object.entries(symbolCount)
      .map(([id, count]) => ({ id, count, symbol: getSymbolById(id) }))
      .filter(item => item.symbol)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [filteredDreams]);

  // Mood distribution
  const moodStats = useMemo(() => {
    const moodCount: Record<string, number> = {};
    filteredDreams.forEach(dream => {
      moodCount[dream.mood] = (moodCount[dream.mood] || 0) + 1;
    });

    return Object.entries(moodCount)
      .map(([mood, count]) => ({
        mood,
        count,
        percentage: (count / filteredDreams.length) * 100,
        info: dreamMoods.find(m => m.id === mood),
      }))
      .sort((a, b) => b.count - a.count);
  }, [filteredDreams]);

  // Moon phase distribution
  const moonStats = useMemo(() => {
    const moonCount: Record<string, number> = {};
    filteredDreams.forEach(dream => {
      moonCount[dream.moonPhase] = (moonCount[dream.moonPhase] || 0) + 1;
    });

    return Object.entries(moonCount)
      .map(([phase, count]) => ({
        phase,
        count,
        percentage: (count / filteredDreams.length) * 100,
        info: moonPhases.find(m => m.id === phase),
      }))
      .sort((a, b) => b.count - a.count);
  }, [filteredDreams]);

  // Emotion frequency
  const emotionStats = useMemo(() => {
    const emotionCount: Record<string, number> = {};
    filteredDreams.forEach(dream => {
      dream.emotions.forEach(emotion => {
        emotionCount[emotion] = (emotionCount[emotion] || 0) + 1;
      });
    });

    return Object.entries(emotionCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 12);
  }, [filteredDreams]);

  // Lucidity trends over time
  const lucidityTrend = useMemo(() => {
    const months = getLast12Months();
    return months.map(({ month, year }) => {
      const monthDreams = dreams.filter(d => {
        const date = new Date(d.date);
        return date.getMonth() === new Date(`${month} 1, ${year}`).getMonth() &&
               date.getFullYear() === year;
      });
      return {
        month,
        year,
        avgLucidity: monthDreams.length > 0
          ? monthDreams.reduce((sum, d) => sum + d.lucidity, 0) / monthDreams.length
          : 0,
        count: monthDreams.length,
      };
    });
  }, [dreams]);

  // Calendar heatmap data
  const calendarData = useMemo(() => {
    const days = getCalendarDays(selectedYear, selectedMonth);
    const dreamDates = filteredDreams.reduce((acc, dream) => {
      const date = dream.date;
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return days.map(day => ({
      ...day,
      dreamCount: dreamDates[formatDate(day.date)] || 0,
    }));
  }, [filteredDreams, selectedMonth, selectedYear]);

  // Sleep quality correlation
  const sleepQualityCorrelation = useMemo(() => {
    const dreamsWithQuality = filteredDreams.filter(d => d.sleepQuality);
    if (dreamsWithQuality.length < 2) return null;

    const groups = [1, 2, 3, 4, 5].map(quality => {
      const qualityDreams = dreamsWithQuality.filter(d => d.sleepQuality === quality);
      return {
        quality,
        avgClarity: qualityDreams.length > 0
          ? qualityDreams.reduce((sum, d) => sum + d.clarity, 0) / qualityDreams.length
          : 0,
        avgLucidity: qualityDreams.length > 0
          ? qualityDreams.reduce((sum, d) => sum + d.lucidity, 0) / qualityDreams.length
          : 0,
        count: qualityDreams.length,
      };
    });

    return groups;
  }, [filteredDreams]);

  const getCategoryColor = (category: string): string => {
    const cat = dreamSymbolCategories.find(c => c.id === category);
    return cat?.color || '#8b5cf6';
  };

  return (
    <PatternsContainer>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <GothicTitle variant="h3">Dream Patterns</GothicTitle>
        <Typography sx={{ color: '#a78bfa', fontSize: '1.1rem', mt: 1 }}>
          Discover the hidden patterns within your nocturnal journeys
        </Typography>
      </Box>

      {/* Time Range Selector */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel sx={{ color: '#a78bfa' }}>Time Range</InputLabel>
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            label="Time Range"
            sx={{
              color: '#e9d5ff',
              background: 'rgba(139, 92, 246, 0.1)',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(139, 92, 246, 0.3)' },
            }}
          >
            <MenuItem value="month">This Month</MenuItem>
            <MenuItem value="3months">Last 3 Months</MenuItem>
            <MenuItem value="year">Last Year</MenuItem>
            <MenuItem value="all">All Time</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Quick Stats */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 3,
        mb: 4,
        maxWidth: 1200,
        mx: 'auto',
      }}>
        <StatCard accentColor="#8b5cf6">
          <CardContent sx={{ textAlign: 'center' }}>
            <Moon size={32} color="#8b5cf6" style={{ marginBottom: 8 }} />
            <Typography variant="h3" sx={{ color: '#e9d5ff', fontWeight: 700 }}>
              {stats.totalDreams}
            </Typography>
            <Typography sx={{ color: '#a78bfa' }}>Total Dreams</Typography>
          </CardContent>
        </StatCard>

        <StatCard accentColor="#3b82f6">
          <CardContent sx={{ textAlign: 'center' }}>
            <Zap size={32} color="#3b82f6" style={{ marginBottom: 8 }} />
            <Typography variant="h3" sx={{ color: '#e9d5ff', fontWeight: 700 }}>
              {stats.lucidDreams}
            </Typography>
            <Typography sx={{ color: '#60a5fa' }}>Lucid Dreams</Typography>
            <Typography sx={{ color: '#3b82f6', fontSize: '0.8rem' }}>
              {stats.totalDreams > 0 ? ((stats.lucidDreams / stats.totalDreams) * 100).toFixed(1) : 0}%
            </Typography>
          </CardContent>
        </StatCard>

        <StatCard accentColor="#ec4899">
          <CardContent sx={{ textAlign: 'center' }}>
            <Repeat size={32} color="#ec4899" style={{ marginBottom: 8 }} />
            <Typography variant="h3" sx={{ color: '#e9d5ff', fontWeight: 700 }}>
              {stats.recurringDreams}
            </Typography>
            <Typography sx={{ color: '#f472b6' }}>Recurring Dreams</Typography>
          </CardContent>
        </StatCard>

        <StatCard accentColor="#c0c0c0">
          <CardContent sx={{ textAlign: 'center' }}>
            <Eye size={32} color="#c0c0c0" style={{ marginBottom: 8 }} />
            <Typography variant="h3" sx={{ color: '#e9d5ff', fontWeight: 700 }}>
              {stats.avgClarity.toFixed(1)}
            </Typography>
            <Typography sx={{ color: '#c0c0c0' }}>Avg Clarity</Typography>
          </CardContent>
        </StatCard>

        <StatCard accentColor="#22c55e">
          <CardContent sx={{ textAlign: 'center' }}>
            <Activity size={32} color="#22c55e" style={{ marginBottom: 8 }} />
            <Typography variant="h3" sx={{ color: '#e9d5ff', fontWeight: 700 }}>
              {stats.avgLucidity.toFixed(1)}
            </Typography>
            <Typography sx={{ color: '#22c55e' }}>Avg Lucidity</Typography>
          </CardContent>
        </StatCard>

        {stats.avgSleepQuality > 0 && (
          <StatCard accentColor="#f59e0b">
            <CardContent sx={{ textAlign: 'center' }}>
              <Star size={32} color="#f59e0b" style={{ marginBottom: 8 }} />
              <Typography variant="h3" sx={{ color: '#e9d5ff', fontWeight: 700 }}>
                {stats.avgSleepQuality.toFixed(1)}
              </Typography>
              <Typography sx={{ color: '#f59e0b' }}>Avg Sleep Quality</Typography>
            </CardContent>
          </StatCard>
        )}
      </Box>

      <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
        {/* Two Column Layout */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 4, mb: 4 }}>
          {/* Calendar Heatmap */}
          <Card sx={{
            background: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '16px',
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Calendar size={24} color="#c0c0c0" />
                  <Typography sx={{ color: '#e9d5ff', fontSize: '1.2rem', fontFamily: '"Cinzel", serif' }}>
                    Dream Frequency
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <FormControl size="small" sx={{ minWidth: 80 }}>
                    <Select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value as number)}
                      sx={{
                        color: '#e9d5ff',
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(139, 92, 246, 0.3)' },
                      }}
                    >
                      {Array.from({ length: 12 }, (_, i) => (
                        <MenuItem key={i} value={i}>
                          {new Date(2000, i, 1).toLocaleString('default', { month: 'short' })}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl size="small" sx={{ minWidth: 80 }}>
                    <Select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value as number)}
                      sx={{
                        color: '#e9d5ff',
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(139, 92, 246, 0.3)' },
                      }}
                    >
                      {[2023, 2024, 2025].map(year => (
                        <MenuItem key={year} value={year}>{year}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              {/* Day labels */}
              <CalendarGrid sx={{ mb: 1 }}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <Typography
                    key={day}
                    sx={{ textAlign: 'center', color: '#6366f1', fontSize: '0.7rem' }}
                  >
                    {day}
                  </Typography>
                ))}
              </CalendarGrid>

              {/* Calendar days */}
              <CalendarGrid>
                {calendarData.map((day, i) => (
                  <Tooltip
                    key={i}
                    title={day.dayOfMonth > 0 ? `${day.dreamCount} dream${day.dreamCount !== 1 ? 's' : ''}` : ''}
                  >
                    <CalendarDay
                      intensity={day.dreamCount}
                      isToday={formatDate(day.date) === formatDate(new Date())}
                    >
                      {day.dayOfMonth > 0 ? day.dayOfMonth : ''}
                    </CalendarDay>
                  </Tooltip>
                ))}
              </CalendarGrid>

              {/* Legend */}
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: 2, background: 'rgba(139, 92, 246, 0.1)' }} />
                  <Typography sx={{ color: '#6366f1', fontSize: '0.7rem' }}>0</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: 2, background: 'rgba(139, 92, 246, 0.4)' }} />
                  <Typography sx={{ color: '#6366f1', fontSize: '0.7rem' }}>1</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: 2, background: 'rgba(139, 92, 246, 0.6)' }} />
                  <Typography sx={{ color: '#6366f1', fontSize: '0.7rem' }}>2</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: 2, background: 'rgba(139, 92, 246, 0.8)' }} />
                  <Typography sx={{ color: '#6366f1', fontSize: '0.7rem' }}>3+</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Most Common Symbols */}
          <Card sx={{
            background: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '16px',
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <TrendingUp size={24} color="#c0c0c0" />
                <Typography sx={{ color: '#e9d5ff', fontSize: '1.2rem', fontFamily: '"Cinzel", serif' }}>
                  Recurring Symbols
                </Typography>
              </Box>

              {symbolStats.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {symbolStats.map(({ id, count, symbol }) => symbol && (
                    <Box key={id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{
                            width: 28,
                            height: 28,
                            background: `${getCategoryColor(symbol.category)}30`,
                          }}>
                            <Eye size={14} color={getCategoryColor(symbol.category)} />
                          </Avatar>
                          <Typography sx={{ color: '#e9d5ff', fontSize: '0.9rem' }}>
                            {symbol.name}
                          </Typography>
                        </Box>
                        <Chip
                          label={count}
                          size="small"
                          sx={{
                            background: `${getCategoryColor(symbol.category)}20`,
                            color: getCategoryColor(symbol.category),
                            minWidth: 40,
                          }}
                        />
                      </Box>
                      <ProgressBar
                        variant="determinate"
                        value={(count / Math.max(...symbolStats.map(s => s.count))) * 100}
                        barColor={getCategoryColor(symbol.category)}
                      />
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography sx={{ color: '#6366f1', textAlign: 'center', py: 4 }}>
                  No symbols recorded yet
                </Typography>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* Mood Distribution & Moon Phase Analysis */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 4, mb: 4 }}>
          {/* Mood Distribution */}
          <Card sx={{
            background: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '16px',
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <PieChart size={24} color="#c0c0c0" />
                <Typography sx={{ color: '#e9d5ff', fontSize: '1.2rem', fontFamily: '"Cinzel", serif' }}>
                  Mood Distribution
                </Typography>
              </Box>

              {moodStats.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {moodStats.map(({ mood, count, percentage, info }) => info && (
                    <Box key={mood}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            background: info.color,
                          }} />
                          <Typography sx={{ color: '#e9d5ff', fontSize: '0.9rem' }}>
                            {info.name}
                          </Typography>
                        </Box>
                        <Typography sx={{ color: '#a78bfa', fontSize: '0.85rem' }}>
                          {count} ({percentage.toFixed(1)}%)
                        </Typography>
                      </Box>
                      <ProgressBar
                        variant="determinate"
                        value={percentage}
                        barColor={info.color}
                      />
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography sx={{ color: '#6366f1', textAlign: 'center', py: 4 }}>
                  No mood data yet
                </Typography>
              )}
            </CardContent>
          </Card>

          {/* Moon Phase Analysis */}
          <Card sx={{
            background: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '16px',
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Moon size={24} color="#c0c0c0" />
                <Typography sx={{ color: '#e9d5ff', fontSize: '1.2rem', fontFamily: '"Cinzel", serif' }}>
                  Moon Phase Analysis
                </Typography>
              </Box>

              {moonStats.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {moonStats.map(({ phase, count, percentage, info }) => info && (
                    <Box key={phase}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography sx={{ color: '#e9d5ff', fontSize: '0.9rem' }}>
                          {info.name}
                        </Typography>
                        <Typography sx={{ color: '#a78bfa', fontSize: '0.85rem' }}>
                          {count} ({percentage.toFixed(1)}%)
                        </Typography>
                      </Box>
                      <ProgressBar
                        variant="determinate"
                        value={percentage}
                        barColor="#c0c0c0"
                      />
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography sx={{ color: '#6366f1', textAlign: 'center', py: 4 }}>
                  No moon phase data yet
                </Typography>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* Lucidity Trend & Emotions */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 4, mb: 4 }}>
          {/* Lucidity Trend */}
          <Card sx={{
            background: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '16px',
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <BarChart3 size={24} color="#c0c0c0" />
                <Typography sx={{ color: '#e9d5ff', fontSize: '1.2rem', fontFamily: '"Cinzel", serif' }}>
                  Lucidity Trend (12 Months)
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'end', gap: 1, height: 150 }}>
                {lucidityTrend.map((data, i) => (
                  <Tooltip
                    key={i}
                    title={`${data.month} ${data.year}: ${data.avgLucidity.toFixed(1)} avg (${data.count} dreams)`}
                  >
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Box sx={{
                        width: '100%',
                        height: `${(data.avgLucidity / 5) * 100}%`,
                        minHeight: 4,
                        background: data.count > 0
                          ? `linear-gradient(180deg, #3b82f6 0%, #8b5cf6 100%)`
                          : 'rgba(139, 92, 246, 0.2)',
                        borderRadius: '4px 4px 0 0',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          opacity: 0.8,
                        },
                      }} />
                      <Typography sx={{
                        color: '#6366f1',
                        fontSize: '0.6rem',
                        mt: 0.5,
                        writingMode: 'vertical-lr',
                        transform: 'rotate(180deg)',
                      }}>
                        {data.month}
                      </Typography>
                    </Box>
                  </Tooltip>
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* Common Emotions */}
          <Card sx={{
            background: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '16px',
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Brain size={24} color="#c0c0c0" />
                <Typography sx={{ color: '#e9d5ff', fontSize: '1.2rem', fontFamily: '"Cinzel", serif' }}>
                  Common Emotions
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {emotionStats.map(([emotion, count]) => (
                  <Chip
                    key={emotion}
                    label={`${emotion} (${count})`}
                    sx={{
                      background: 'rgba(139, 92, 246, 0.2)',
                      color: '#c4b5fd',
                      fontSize: '0.8rem',
                    }}
                  />
                ))}
                {emotionStats.length === 0 && (
                  <Typography sx={{ color: '#6366f1' }}>
                    No emotions recorded yet
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Sleep Quality Correlation */}
        {sleepQualityCorrelation && (
          <Card sx={{
            background: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '16px',
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Activity size={24} color="#c0c0c0" />
                <Typography sx={{ color: '#e9d5ff', fontSize: '1.2rem', fontFamily: '"Cinzel", serif' }}>
                  Sleep Quality Correlation
                </Typography>
              </Box>

              <Box sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: 2,
              }}>
                {sleepQualityCorrelation.map((data) => (
                  <Box
                    key={data.quality}
                    sx={{
                      textAlign: 'center',
                      p: 2,
                      background: 'rgba(139, 92, 246, 0.1)',
                      borderRadius: '12px',
                    }}
                  >
                    <Typography sx={{ color: '#f59e0b', fontWeight: 700, mb: 1 }}>
                      {data.quality} Star{data.quality > 1 ? 's' : ''}
                    </Typography>
                    <Typography sx={{ color: '#c0c0c0', fontSize: '0.8rem' }}>
                      Clarity: {data.avgClarity.toFixed(1)}
                    </Typography>
                    <Typography sx={{ color: '#3b82f6', fontSize: '0.8rem' }}>
                      Lucidity: {data.avgLucidity.toFixed(1)}
                    </Typography>
                    <Typography sx={{ color: '#6366f1', fontSize: '0.7rem' }}>
                      ({data.count} dreams)
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>

      {/* Empty State */}
      {dreams.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <TrendingUp size={64} color="#8b5cf6" style={{ marginBottom: 16, opacity: 0.5 }} />
          <Typography sx={{ color: '#a78bfa', fontSize: '1.2rem', mb: 2 }}>
            No dream data yet
          </Typography>
          <Typography sx={{ color: '#6366f1', fontSize: '0.9rem' }}>
            Start recording dreams to see your patterns emerge
          </Typography>
        </Box>
      )}
    </PatternsContainer>
  );
};

export default DreamPatterns;
