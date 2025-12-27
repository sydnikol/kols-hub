import React, { useState, useEffect, useMemo } from 'react';
import {
  Smile,
  Meh,
  Frown,
  Cloud,
  Sun,
  CloudRain,
  Sparkles,
  Calendar,
  TrendingUp,
  Edit3,
  Save,
  X,
  ChevronLeft,
  ChevronRight,
  Moon,
  Star,
  Zap,
  Heart,
  Coffee,
  Flame,
} from 'lucide-react';

// Types
interface MoodEntry {
  id: string;
  date: string; // ISO date string (YYYY-MM-DD)
  mood: number; // 1-5
  customMood?: string;
  notes: string;
  factors: string[];
  createdAt: string;
}

interface MoodLevel {
  value: number;
  label: string;
  icon: React.ReactNode;
  color: string;
  bgGradient: string;
}

interface MoodFactor {
  id: string;
  label: string;
  icon: React.ReactNode;
}

// Mood levels
const moodLevels: MoodLevel[] = [
  {
    value: 1,
    label: 'Very Low',
    icon: <CloudRain className="w-8 h-8" />,
    color: 'text-slate-400',
    bgGradient: 'from-slate-700 to-slate-800',
  },
  {
    value: 2,
    label: 'Low',
    icon: <Frown className="w-8 h-8" />,
    color: 'text-indigo-400',
    bgGradient: 'from-indigo-700 to-indigo-800',
  },
  {
    value: 3,
    label: 'Neutral',
    icon: <Meh className="w-8 h-8" />,
    color: 'text-violet-400',
    bgGradient: 'from-violet-700 to-violet-800',
  },
  {
    value: 4,
    label: 'Good',
    icon: <Smile className="w-8 h-8" />,
    color: 'text-purple-400',
    bgGradient: 'from-purple-700 to-purple-800',
  },
  {
    value: 5,
    label: 'Great',
    icon: <Sun className="w-8 h-8" />,
    color: 'text-amber-400',
    bgGradient: 'from-amber-600 to-orange-700',
  },
];

// Mood factors
const moodFactors: MoodFactor[] = [
  { id: 'sleep', label: 'Sleep', icon: <Moon className="w-4 h-4" /> },
  { id: 'exercise', label: 'Exercise', icon: <Zap className="w-4 h-4" /> },
  { id: 'social', label: 'Social', icon: <Heart className="w-4 h-4" /> },
  { id: 'work', label: 'Work', icon: <Coffee className="w-4 h-4" /> },
  { id: 'health', label: 'Health', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'stress', label: 'Stress', icon: <Flame className="w-4 h-4" /> },
  { id: 'weather', label: 'Weather', icon: <Cloud className="w-4 h-4" /> },
  { id: 'creativity', label: 'Creativity', icon: <Star className="w-4 h-4" /> },
];

const MoodTracker: React.FC = () => {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [customMood, setCustomMood] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'checkin' | 'history' | 'patterns'>('checkin');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [editingEntry, setEditingEntry] = useState<MoodEntry | null>(null);

  // Load entries from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('mood-tracker-entries');
    if (saved) {
      setEntries(JSON.parse(saved));
    }
  }, []);

  // Save entries to localStorage
  useEffect(() => {
    localStorage.setItem('mood-tracker-entries', JSON.stringify(entries));
  }, [entries]);

  // Get today's date string
  const getTodayString = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Check if already logged today
  const todayEntry = useMemo(() => {
    const today = getTodayString();
    return entries.find((e) => e.date === today);
  }, [entries]);

  // Handle mood submission
  const handleSubmit = () => {
    if (selectedMood === null) return;

    const today = getTodayString();
    const existingIndex = entries.findIndex((e) => e.date === today);

    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      date: today,
      mood: selectedMood,
      customMood: customMood || undefined,
      notes,
      factors: selectedFactors,
      createdAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      // Update existing
      const updated = [...entries];
      updated[existingIndex] = { ...newEntry, id: entries[existingIndex].id };
      setEntries(updated);
    } else {
      // Add new
      setEntries([newEntry, ...entries]);
    }

    // Reset form
    setSelectedMood(null);
    setCustomMood('');
    setNotes('');
    setSelectedFactors([]);
  };

  // Toggle factor selection
  const toggleFactor = (factorId: string) => {
    setSelectedFactors((prev) =>
      prev.includes(factorId) ? prev.filter((f) => f !== factorId) : [...prev, factorId]
    );
  };

  // Get entries for current month
  const monthEntries = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    return entries.filter((e) => {
      const entryDate = new Date(e.date);
      return entryDate.getFullYear() === year && entryDate.getMonth() === month;
    });
  }, [entries, currentMonth]);

  // Get days in month
  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: { date: string; entry?: MoodEntry; isToday: boolean }[] = [];

    // Add padding for first day of week
    const startPadding = firstDay.getDay();
    for (let i = 0; i < startPadding; i++) {
      days.push({ date: '', isToday: false });
    }

    // Add actual days
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const entry = entries.find((e) => e.date === dateStr);
      days.push({
        date: dateStr,
        entry,
        isToday: dateStr === getTodayString(),
      });
    }

    return days;
  };

  // Calculate average mood
  const getAverageMood = (entryList: MoodEntry[]) => {
    if (entryList.length === 0) return 0;
    return entryList.reduce((acc, e) => acc + e.mood, 0) / entryList.length;
  };

  // Get mood patterns
  const getMoodPatterns = useMemo(() => {
    if (entries.length < 7) return null;

    const last30Days = entries.filter((e) => {
      const entryDate = new Date(e.date);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return entryDate >= thirtyDaysAgo;
    });

    // Factor correlation
    const factorMoods: Record<string, number[]> = {};
    last30Days.forEach((e) => {
      e.factors.forEach((f) => {
        if (!factorMoods[f]) factorMoods[f] = [];
        factorMoods[f].push(e.mood);
      });
    });

    const factorAverages = Object.entries(factorMoods).map(([factor, moods]) => ({
      factor,
      average: moods.reduce((a, b) => a + b, 0) / moods.length,
      count: moods.length,
    }));

    // Day of week patterns
    const dayMoods: number[][] = [[], [], [], [], [], [], []];
    last30Days.forEach((e) => {
      const day = new Date(e.date).getDay();
      dayMoods[day].push(e.mood);
    });

    const dayAverages = dayMoods.map((moods, i) => ({
      day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i],
      average: moods.length > 0 ? moods.reduce((a, b) => a + b, 0) / moods.length : 0,
      count: moods.length,
    }));

    // Trend (last 7 days vs previous 7 days)
    const last7 = entries.slice(0, 7);
    const prev7 = entries.slice(7, 14);
    const trend = getAverageMood(last7) - getAverageMood(prev7);

    return {
      factorAverages: factorAverages.sort((a, b) => b.average - a.average),
      dayAverages,
      trend,
      averageMood: getAverageMood(last30Days),
      totalEntries: last30Days.length,
    };
  }, [entries]);

  // Get week data for chart
  const getWeekData = () => {
    const weekData: { day: string; mood: number | null }[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const entry = entries.find((e) => e.date === dateStr);
      weekData.push({
        day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()],
        mood: entry?.mood || null,
      });
    }
    return weekData;
  };

  const weekData = getWeekData();
  const days = getDaysInMonth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-violet-950 to-slate-950 text-white p-4 md:p-8">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Moon className="w-8 h-8 text-violet-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Mood Tracker
            </h1>
            <Sparkles className="w-8 h-8 text-purple-400" />
          </div>
          <p className="text-gray-400 text-lg">Track the shadows and light within</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center gap-2 mb-8">
          {['checkin', 'history', 'patterns'].map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode as any)}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                viewMode === mode
                  ? 'bg-violet-600 text-white'
                  : 'bg-slate-800/50 text-gray-400 hover:bg-slate-700'
              }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>

        {/* Check-in View */}
        {viewMode === 'checkin' && (
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-violet-500/20 p-6 md:p-8 shadow-2xl">
            <h2 className="text-xl font-semibold text-violet-400 mb-6 text-center">
              {todayEntry ? 'Update Today\'s Mood' : 'How are you feeling today?'}
            </h2>

            {/* Mood Selection */}
            <div className="flex justify-center gap-3 md:gap-4 mb-8 flex-wrap">
              {moodLevels.map((level) => (
                <button
                  key={level.value}
                  onClick={() => setSelectedMood(level.value)}
                  className={`flex flex-col items-center p-4 rounded-xl transition-all ${
                    selectedMood === level.value
                      ? `bg-gradient-to-br ${level.bgGradient} scale-110 shadow-lg`
                      : 'bg-slate-800/50 hover:bg-slate-700/50'
                  }`}
                >
                  <div className={level.color}>{level.icon}</div>
                  <span className="text-sm mt-2 text-gray-300">{level.label}</span>
                </button>
              ))}
            </div>

            {/* Custom Mood Label */}
            <div className="mb-6">
              <label className="block text-sm text-gray-400 mb-2">
                Custom mood label (optional)
              </label>
              <input
                type="text"
                value={customMood}
                onChange={(e) => setCustomMood(e.target.value)}
                placeholder="e.g., anxious but hopeful, creative, melancholic..."
                className="w-full p-4 bg-slate-800/50 border border-violet-500/20 rounded-xl text-gray-300 placeholder-gray-600 focus:outline-none focus:border-violet-500/50"
              />
            </div>

            {/* Factors */}
            <div className="mb-6">
              <label className="block text-sm text-gray-400 mb-2">What influenced your mood?</label>
              <div className="flex flex-wrap gap-2">
                {moodFactors.map((factor) => (
                  <button
                    key={factor.id}
                    onClick={() => toggleFactor(factor.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      selectedFactors.includes(factor.id)
                        ? 'bg-violet-600 text-white'
                        : 'bg-slate-800/50 text-gray-400 hover:bg-slate-700'
                    }`}
                  >
                    {factor.icon}
                    <span className="text-sm">{factor.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="mb-8">
              <label className="block text-sm text-gray-400 mb-2">Journal your thoughts</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Write about what's on your mind, what happened today, or anything you want to remember..."
                className="w-full p-4 bg-slate-800/50 border border-violet-500/20 rounded-xl text-gray-300 placeholder-gray-600 resize-none focus:outline-none focus:border-violet-500/50"
                rows={4}
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={selectedMood === null}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                selectedMood !== null
                  ? 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-lg'
                  : 'bg-slate-800 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Save className="w-5 h-5 inline-block mr-2" />
              {todayEntry ? 'Update Entry' : 'Save Entry'}
            </button>

            {/* Weekly Preview */}
            <div className="mt-8 pt-8 border-t border-violet-500/20">
              <h3 className="text-sm text-gray-400 mb-4 text-center">This Week</h3>
              <div className="flex justify-between gap-2">
                {weekData.map((day, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        day.mood
                          ? `bg-gradient-to-br ${moodLevels[day.mood - 1].bgGradient}`
                          : 'bg-slate-800/50'
                      }`}
                    >
                      {day.mood ? (
                        <span className="text-lg">{moodLevels[day.mood - 1].icon}</span>
                      ) : (
                        <span className="text-gray-600">-</span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 mt-1">{day.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* History View */}
        {viewMode === 'history' && (
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-violet-500/20 p-6 md:p-8 shadow-2xl">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-semibold text-violet-400">
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-6">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-xs text-gray-500 py-2">
                  {day}
                </div>
              ))}
              {days.map((day, index) => (
                <div
                  key={index}
                  className={`aspect-square p-1 ${day.date ? 'cursor-pointer' : ''}`}
                >
                  {day.date && (
                    <div
                      className={`w-full h-full rounded-lg flex items-center justify-center transition-all ${
                        day.entry
                          ? `bg-gradient-to-br ${moodLevels[day.entry.mood - 1].bgGradient} hover:scale-105`
                          : 'bg-slate-800/30 hover:bg-slate-700/50'
                      } ${day.isToday ? 'ring-2 ring-violet-500' : ''}`}
                      onClick={() => day.entry && setEditingEntry(day.entry)}
                    >
                      <span className={`text-sm ${day.entry ? 'text-white' : 'text-gray-600'}`}>
                        {new Date(day.date).getDate()}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Month Stats */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-slate-800/30 rounded-xl">
              <div className="text-center">
                <div className="text-2xl font-bold text-violet-400">{monthEntries.length}</div>
                <div className="text-xs text-gray-500">Entries</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {monthEntries.length > 0 ? getAverageMood(monthEntries).toFixed(1) : '-'}
                </div>
                <div className="text-xs text-gray-500">Avg Mood</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-400">
                  {monthEntries.length > 0
                    ? moodLevels[Math.round(getAverageMood(monthEntries)) - 1]?.label || '-'
                    : '-'}
                </div>
                <div className="text-xs text-gray-500">Overall</div>
              </div>
            </div>

            {/* Recent Entries List */}
            <div className="mt-6 space-y-4">
              <h3 className="text-sm text-gray-400">Recent Entries</h3>
              {entries.slice(0, 5).map((entry) => {
                const level = moodLevels[entry.mood - 1];
                return (
                  <div
                    key={entry.id}
                    className="p-4 bg-slate-800/50 rounded-xl border border-violet-500/10 cursor-pointer hover:border-violet-500/30 transition-all"
                    onClick={() => setEditingEntry(entry)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${level.bgGradient}`}>
                        {level.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{entry.customMood || level.label}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(entry.date).toLocaleDateString()}
                          </span>
                        </div>
                        {entry.notes && (
                          <p className="text-sm text-gray-400 mt-1 line-clamp-2">{entry.notes}</p>
                        )}
                        {entry.factors.length > 0 && (
                          <div className="flex gap-1 mt-2">
                            {entry.factors.map((f) => (
                              <span key={f} className="text-xs px-2 py-1 bg-slate-700 rounded">
                                {moodFactors.find((mf) => mf.id === f)?.label || f}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Patterns View */}
        {viewMode === 'patterns' && (
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-violet-500/20 p-6 md:p-8 shadow-2xl">
            <h2 className="text-xl font-semibold text-violet-400 mb-6 text-center flex items-center justify-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Mood Patterns & Insights
            </h2>

            {getMoodPatterns ? (
              <div className="space-y-8">
                {/* Overview Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-slate-800/50 rounded-xl text-center">
                    <div className="text-2xl font-bold text-violet-400">
                      {getMoodPatterns.averageMood.toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-500">30-Day Average</div>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded-xl text-center">
                    <div className="text-2xl font-bold text-purple-400">
                      {getMoodPatterns.totalEntries}
                    </div>
                    <div className="text-xs text-gray-500">Entries</div>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded-xl text-center">
                    <div
                      className={`text-2xl font-bold ${
                        getMoodPatterns.trend > 0 ? 'text-green-400' : getMoodPatterns.trend < 0 ? 'text-red-400' : 'text-gray-400'
                      }`}
                    >
                      {getMoodPatterns.trend > 0 ? '+' : ''}
                      {getMoodPatterns.trend.toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-500">Week Trend</div>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded-xl text-center">
                    <div className="text-2xl font-bold text-pink-400">
                      {Math.round((getMoodPatterns.totalEntries / 30) * 100)}%
                    </div>
                    <div className="text-xs text-gray-500">Consistency</div>
                  </div>
                </div>

                {/* Day of Week Pattern */}
                <div>
                  <h3 className="text-sm text-gray-400 mb-4">Mood by Day of Week</h3>
                  <div className="flex justify-between gap-2">
                    {getMoodPatterns.dayAverages.map((day) => (
                      <div key={day.day} className="flex flex-col items-center flex-1">
                        <div
                          className="w-full bg-slate-800/50 rounded-t-lg"
                          style={{
                            height: `${Math.max((day.average / 5) * 100, 10)}px`,
                            background: `linear-gradient(to top, ${
                              day.average >= 4
                                ? 'rgb(168, 85, 247)'
                                : day.average >= 3
                                ? 'rgb(139, 92, 246)'
                                : 'rgb(100, 116, 139)'
                            }, transparent)`,
                          }}
                        />
                        <span className="text-xs text-gray-500 mt-2">{day.day}</span>
                        <span className="text-xs text-violet-400">{day.average.toFixed(1)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Factor Impact */}
                <div>
                  <h3 className="text-sm text-gray-400 mb-4">Factor Impact on Mood</h3>
                  <div className="space-y-3">
                    {getMoodPatterns.factorAverages.slice(0, 6).map((item) => {
                      const factor = moodFactors.find((f) => f.id === item.factor);
                      return (
                        <div key={item.factor} className="flex items-center gap-4">
                          <div className="w-24 flex items-center gap-2">
                            {factor?.icon}
                            <span className="text-sm">{factor?.label || item.factor}</span>
                          </div>
                          <div className="flex-1 h-4 bg-slate-800/50 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-violet-600 to-purple-500 rounded-full transition-all"
                              style={{ width: `${(item.average / 5) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-violet-400 w-12 text-right">
                            {item.average.toFixed(1)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Insights */}
                <div className="p-4 bg-violet-900/20 rounded-xl border border-violet-500/20">
                  <h3 className="text-violet-400 font-medium mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Insights
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-300">
                    {getMoodPatterns.trend > 0.3 && (
                      <li>Your mood has been improving over the past week. Keep up the good work!</li>
                    )}
                    {getMoodPatterns.trend < -0.3 && (
                      <li>Your mood has dipped recently. Consider what might be contributing to this.</li>
                    )}
                    {getMoodPatterns.factorAverages[0] && (
                      <li>
                        "{moodFactors.find((f) => f.id === getMoodPatterns.factorAverages[0].factor)?.label}"
                        correlates with your highest moods.
                      </li>
                    )}
                    {getMoodPatterns.dayAverages.sort((a, b) => b.average - a.average)[0].average > 0 && (
                      <li>
                        {getMoodPatterns.dayAverages.sort((a, b) => b.average - a.average)[0].day}s tend to be your best days.
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Track your mood for at least 7 days to see patterns.</p>
                <p className="text-sm mt-2">You have {entries.length} entries so far.</p>
              </div>
            )}
          </div>
        )}

        {/* Entry Detail Modal */}
        {editingEntry && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 rounded-2xl border border-violet-500/30 max-w-md w-full">
              <div className="flex items-center justify-between p-6 border-b border-violet-500/20">
                <h2 className="text-xl font-semibold text-violet-400">
                  {new Date(editingEntry.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })}
                </h2>
                <button
                  onClick={() => setEditingEntry(null)}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${moodLevels[editingEntry.mood - 1].bgGradient}`}>
                    {moodLevels[editingEntry.mood - 1].icon}
                  </div>
                  <div>
                    <div className="font-semibold text-lg">
                      {editingEntry.customMood || moodLevels[editingEntry.mood - 1].label}
                    </div>
                    <div className="text-sm text-gray-500">Mood Level {editingEntry.mood}/5</div>
                  </div>
                </div>

                {editingEntry.factors.length > 0 && (
                  <div className="mb-4">
                    <div className="text-sm text-gray-400 mb-2">Contributing Factors</div>
                    <div className="flex flex-wrap gap-2">
                      {editingEntry.factors.map((f) => (
                        <span key={f} className="flex items-center gap-1 px-3 py-1 bg-slate-800 rounded-lg text-sm">
                          {moodFactors.find((mf) => mf.id === f)?.icon}
                          {moodFactors.find((mf) => mf.id === f)?.label || f}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {editingEntry.notes && (
                  <div>
                    <div className="text-sm text-gray-400 mb-2">Notes</div>
                    <p className="text-gray-300 bg-slate-800/50 p-4 rounded-xl italic">
                      "{editingEntry.notes}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodTracker;
