import React, { useState, useEffect } from 'react';
import { Music, Plus, Edit2, Trash2, Clock, Target, TrendingUp, Calendar, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface PracticeSession {
  id: string;
  instrumentId: string;
  date: string;
  duration: number; // minutes
  focus: string[];
  accomplishments: string;
  challenges: string;
  mood: string;
  quality: 1 | 2 | 3 | 4 | 5;
  notes: string;
  createdAt: number;
}

interface Instrument {
  id: string;
  name: string;
  type: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'professional';
  weeklyGoalMinutes: number;
  currentWeekMinutes: number;
  totalMinutes: number;
  sessions: PracticeSession[];
  focusAreas: string[];
  createdAt: number;
}

const instrumentTypes = [
  'Piano/Keyboard',
  'Guitar',
  'Bass',
  'Drums/Percussion',
  'Violin',
  'Cello',
  'Viola',
  'Flute',
  'Clarinet',
  'Saxophone',
  'Trumpet',
  'Trombone',
  'Voice/Vocals',
  'Ukulele',
  'Banjo',
  'Synthesizer',
  'Other',
];

const practiceAreas = [
  'Scales',
  'Technique',
  'Sight Reading',
  'Ear Training',
  'Improvisation',
  'Theory',
  'Repertoire',
  'Rhythm',
  'Dynamics',
  'Expression',
  'Performance Prep',
  'Recording',
];

const moods = ['Focused', 'Inspired', 'Frustrated', 'Relaxed', 'Energized', 'Tired', 'Flow State'];

export default function MusicPractice() {
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [selectedInstrument, setSelectedInstrument] = useState<string | null>(null);
  const [isAddingInstrument, setIsAddingInstrument] = useState(false);
  const [isLoggingSession, setIsLoggingSession] = useState(false);
  const [viewMode, setViewMode] = useState<'instruments' | 'sessions' | 'stats'>('instruments');
  const [instrumentForm, setInstrumentForm] = useState({
    name: '',
    type: instrumentTypes[0],
    level: 'beginner' as Instrument['level'],
    weeklyGoalMinutes: 180,
  });
  const [sessionForm, setSessionForm] = useState({
    duration: 30,
    focus: [] as string[],
    accomplishments: '',
    challenges: '',
    mood: moods[0],
    quality: 3 as PracticeSession['quality'],
    notes: '',
  });
  const [focusInput, setFocusInput] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('musicInstruments');
    if (saved) {
      setInstruments(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('musicInstruments', JSON.stringify(instruments));
  }, [instruments]);

  const getWeekStart = () => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day;
    return new Date(now.setDate(diff)).toISOString().split('T')[0];
  };

  const handleCreateInstrument = (e: React.FormEvent) => {
    e.preventDefault();

    if (!instrumentForm.name.trim()) {
      toast.error('Please enter an instrument name');
      return;
    }

    const newInstrument: Instrument = {
      id: Date.now().toString(),
      ...instrumentForm,
      currentWeekMinutes: 0,
      totalMinutes: 0,
      sessions: [],
      focusAreas: [],
      createdAt: Date.now(),
    };

    setInstruments([...instruments, newInstrument]);
    setInstrumentForm({
      name: '',
      type: instrumentTypes[0],
      level: 'beginner',
      weeklyGoalMinutes: 180,
    });
    setIsAddingInstrument(false);
    toast.success('Instrument added!');
  };

  const handleLogSession = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedInstrument) return;

    const newSession: PracticeSession = {
      id: Date.now().toString(),
      instrumentId: selectedInstrument,
      date: new Date().toISOString().split('T')[0],
      ...sessionForm,
      createdAt: Date.now(),
    };

    setInstruments(instruments.map(inst => {
      if (inst.id === selectedInstrument) {
        // Check if session is from current week
        const sessionDate = new Date(newSession.date);
        const weekStart = new Date(getWeekStart());
        const isCurrentWeek = sessionDate >= weekStart;

        // Add unique focus areas to instrument's focus areas
        const newFocusAreas = [...new Set([...inst.focusAreas, ...sessionForm.focus])];

        return {
          ...inst,
          sessions: [...inst.sessions, newSession],
          totalMinutes: inst.totalMinutes + sessionForm.duration,
          currentWeekMinutes: isCurrentWeek ? inst.currentWeekMinutes + sessionForm.duration : inst.currentWeekMinutes,
          focusAreas: newFocusAreas,
        };
      }
      return inst;
    }));

    setSessionForm({
      duration: 30,
      focus: [],
      accomplishments: '',
      challenges: '',
      mood: moods[0],
      quality: 3,
      notes: '',
    });
    setFocusInput('');
    setIsLoggingSession(false);
    toast.success('Session logged!');
  };

  const handleDeleteInstrument = (id: string) => {
    if (confirm('Delete this instrument and all its practice sessions?')) {
      setInstruments(instruments.filter(i => i.id !== id));
      if (selectedInstrument === id) {
        setSelectedInstrument(null);
      }
      toast.success('Instrument deleted');
    }
  };

  const handleDeleteSession = (instrumentId: string, sessionId: string) => {
    if (confirm('Delete this practice session?')) {
      setInstruments(instruments.map(inst => {
        if (inst.id === instrumentId) {
          const session = inst.sessions.find(s => s.id === sessionId);
          if (!session) return inst;

          const sessionDate = new Date(session.date);
          const weekStart = new Date(getWeekStart());
          const isCurrentWeek = sessionDate >= weekStart;

          return {
            ...inst,
            sessions: inst.sessions.filter(s => s.id !== sessionId),
            totalMinutes: Math.max(0, inst.totalMinutes - session.duration),
            currentWeekMinutes: isCurrentWeek ? Math.max(0, inst.currentWeekMinutes - session.duration) : inst.currentWeekMinutes,
          };
        }
        return inst;
      }));
      toast.success('Session deleted');
    }
  };

  const addFocusArea = () => {
    if (!focusInput.trim()) return;
    if (!sessionForm.focus.includes(focusInput.trim())) {
      setSessionForm({ ...sessionForm, focus: [...sessionForm.focus, focusInput.trim()] });
    }
    setFocusInput('');
  };

  const removeFocusArea = (area: string) => {
    setSessionForm({ ...sessionForm, focus: sessionForm.focus.filter(f => f !== area) });
  };

  const getInstrumentStats = (instrument: Instrument) => {
    const totalSessions = instrument.sessions.length;
    const avgSessionLength = totalSessions > 0 ? Math.round(instrument.totalMinutes / totalSessions) : 0;
    const weekProgress = instrument.weeklyGoalMinutes > 0
      ? (instrument.currentWeekMinutes / instrument.weeklyGoalMinutes) * 100
      : 0;
    const last7Days = instrument.sessions.filter(s => {
      const sessionDate = new Date(s.date);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return sessionDate >= sevenDaysAgo;
    });
    const streak = calculateStreak(instrument.sessions);

    return { totalSessions, avgSessionLength, weekProgress, last7DaysCount: last7Days.length, streak };
  };

  const calculateStreak = (sessions: PracticeSession[]) => {
    if (sessions.length === 0) return 0;

    const sortedSessions = [...sessions].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const lastSession = new Date(sortedSessions[0].date);
    lastSession.setHours(0, 0, 0, 0);

    if (lastSession < yesterday) return 0;

    let streak = 0;
    let currentDate = new Date(today);

    for (let i = 0; i < sortedSessions.length; i++) {
      const sessionDate = new Date(sortedSessions[i].date);
      sessionDate.setHours(0, 0, 0, 0);

      if (sessionDate.getTime() === currentDate.getTime()) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (sessionDate < currentDate) {
        break;
      }
    }

    return streak;
  };

  const getAllSessions = () => {
    return instruments.flatMap(inst =>
      inst.sessions.map(session => ({
        ...session,
        instrumentName: inst.name,
      }))
    ).sort((a, b) => b.createdAt - a.createdAt);
  };

  const getTotalStats = () => {
    const totalMinutes = instruments.reduce((sum, i) => sum + i.totalMinutes, 0);
    const totalSessions = instruments.reduce((sum, i) => sum + i.sessions.length, 0);
    const currentWeekMinutes = instruments.reduce((sum, i) => sum + i.currentWeekMinutes, 0);
    const totalGoal = instruments.reduce((sum, i) => sum + i.weeklyGoalMinutes, 0);

    return { totalMinutes, totalSessions, currentWeekMinutes, totalGoal };
  };

  const selectedInstrumentData = instruments.find(i => i.id === selectedInstrument);
  const allSessions = getAllSessions();
  const totalStats = getTotalStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Music className="w-7 h-7 text-purple-400" />
            Music Practice
          </h2>
          <p className="text-purple-200/70 mt-1">
            {Math.round(totalStats.totalMinutes / 60)}h total • {totalStats.currentWeekMinutes} min this week
          </p>
        </div>
        <button
          onClick={() => setIsAddingInstrument(!isAddingInstrument)}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-lg hover:from-purple-500 hover:to-violet-500 transition-all flex items-center gap-2"
        >
          {isAddingInstrument ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {isAddingInstrument ? 'Cancel' : 'Add Instrument'}
        </button>
      </div>

      {/* View Mode Tabs */}
      <div className="flex gap-2 bg-black/30 p-1 rounded-lg">
        {(['instruments', 'sessions', 'stats'] as const).map(mode => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
              viewMode === mode
                ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white'
                : 'text-purple-200/70 hover:text-white hover:bg-white/5'
            }`}
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </button>
        ))}
      </div>

      {/* Add Instrument Form */}
      {isAddingInstrument && (
        <form onSubmit={handleCreateInstrument} className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 rounded-xl p-6 border border-purple-500/20">
          <h3 className="text-xl font-semibold text-white mb-4">Add Instrument</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-purple-100 mb-2">Instrument Name *</label>
              <input
                type="text"
                value={instrumentForm.name}
                onChange={(e) => setInstrumentForm({ ...instrumentForm, name: e.target.value })}
                className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400"
                placeholder="My Piano, Acoustic Guitar, etc."
                required
              />
            </div>

            <div>
              <label className="block text-purple-100 mb-2">Type</label>
              <select
                value={instrumentForm.type}
                onChange={(e) => setInstrumentForm({ ...instrumentForm, type: e.target.value })}
                className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400"
              >
                {instrumentTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-purple-100 mb-2">Skill Level</label>
              <select
                value={instrumentForm.level}
                onChange={(e) => setInstrumentForm({ ...instrumentForm, level: e.target.value as Instrument['level'] })}
                className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="professional">Professional</option>
              </select>
            </div>

            <div>
              <label className="block text-purple-100 mb-2">Weekly Goal (minutes)</label>
              <input
                type="number"
                value={instrumentForm.weeklyGoalMinutes}
                onChange={(e) => setInstrumentForm({ ...instrumentForm, weeklyGoalMinutes: parseInt(e.target.value) || 0 })}
                className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400"
                min="0"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-6 py-2 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-lg hover:from-purple-500 hover:to-violet-500 transition-all font-medium"
          >
            Add Instrument
          </button>
        </form>
      )}

      {/* Log Session Form */}
      {isLoggingSession && selectedInstrument && (
        <form onSubmit={handleLogSession} className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 rounded-xl p-6 border border-purple-500/20">
          <h3 className="text-xl font-semibold text-white mb-4">Log Practice Session</h3>
          <p className="text-purple-200 mb-4">{selectedInstrumentData?.name}</p>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-purple-100 mb-2">Duration (minutes) *</label>
                <input
                  type="number"
                  value={sessionForm.duration}
                  onChange={(e) => setSessionForm({ ...sessionForm, duration: parseInt(e.target.value) || 0 })}
                  className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-purple-100 mb-2">Mood</label>
                <select
                  value={sessionForm.mood}
                  onChange={(e) => setSessionForm({ ...sessionForm, mood: e.target.value })}
                  className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400"
                >
                  {moods.map(mood => (
                    <option key={mood} value={mood}>{mood}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-purple-100 mb-2">Quality (1-5)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(rating => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setSessionForm({ ...sessionForm, quality: rating as PracticeSession['quality'] })}
                      className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                        sessionForm.quality === rating
                          ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white'
                          : 'bg-white/5 text-purple-300 hover:bg-white/10'
                      }`}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-purple-100 mb-2">Focus Areas</label>
              <div className="flex gap-2 mb-2">
                <select
                  value={focusInput}
                  onChange={(e) => setFocusInput(e.target.value)}
                  className="flex-1 bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400"
                >
                  <option value="">Select or type custom...</option>
                  {practiceAreas.map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={focusInput}
                  onChange={(e) => setFocusInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFocusArea())}
                  className="flex-1 bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400"
                  placeholder="Custom focus area..."
                />
                <button
                  type="button"
                  onClick={addFocusArea}
                  className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-all"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              {sessionForm.focus.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {sessionForm.focus.map(area => (
                    <span
                      key={area}
                      className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm flex items-center gap-2"
                    >
                      {area}
                      <button
                        type="button"
                        onClick={() => removeFocusArea(area)}
                        className="hover:text-red-300 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-purple-100 mb-2">Accomplishments</label>
              <textarea
                value={sessionForm.accomplishments}
                onChange={(e) => setSessionForm({ ...sessionForm, accomplishments: e.target.value })}
                className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400 min-h-[80px]"
                placeholder="What did you accomplish in this session?"
              />
            </div>

            <div>
              <label className="block text-purple-100 mb-2">Challenges</label>
              <textarea
                value={sessionForm.challenges}
                onChange={(e) => setSessionForm({ ...sessionForm, challenges: e.target.value })}
                className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400 min-h-[60px]"
                placeholder="What was difficult?"
              />
            </div>

            <div>
              <label className="block text-purple-100 mb-2">Notes</label>
              <textarea
                value={sessionForm.notes}
                onChange={(e) => setSessionForm({ ...sessionForm, notes: e.target.value })}
                className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400 min-h-[60px]"
                placeholder="Additional notes..."
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className="flex-1 py-2 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-lg hover:from-purple-500 hover:to-violet-500 transition-all font-medium"
            >
              Log Session
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLoggingSession(false);
                setSessionForm({
                  duration: 30,
                  focus: [],
                  accomplishments: '',
                  challenges: '',
                  mood: moods[0],
                  quality: 3,
                  notes: '',
                });
                setFocusInput('');
              }}
              className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Instruments View */}
      {viewMode === 'instruments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {instruments.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-gradient-to-br from-purple-900/20 to-violet-900/20 rounded-xl border border-purple-500/20">
              <Music className="w-16 h-16 text-purple-400/50 mx-auto mb-4" />
              <p className="text-purple-200/70 text-lg">No instruments yet</p>
              <p className="text-purple-200/50 text-sm mt-2">Add your first instrument to start tracking practice!</p>
            </div>
          ) : (
            instruments.map(instrument => {
              const stats = getInstrumentStats(instrument);

              return (
                <div
                  key={instrument.id}
                  className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 rounded-xl p-5 border border-purple-500/20 hover:border-purple-400/40 transition-all"
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-1">{instrument.name}</h3>
                      <p className="text-purple-200/70 text-sm">{instrument.type} • {instrument.level}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedInstrument(instrument.id);
                          setIsLoggingSession(true);
                        }}
                        className="p-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-all"
                        title="Log practice"
                      >
                        <Clock className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteInstrument(instrument.id)}
                        className="p-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all"
                        title="Delete instrument"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Weekly Goal Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-purple-200 flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        Weekly Goal
                      </span>
                      <span className="text-purple-300 font-semibold">
                        {instrument.currentWeekMinutes} / {instrument.weeklyGoalMinutes} min
                      </span>
                    </div>
                    <div className="bg-black/40 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-violet-500 h-2 rounded-full transition-all"
                        style={{ width: `${Math.min(stats.weekProgress, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-black/30 rounded-lg p-3 border border-purple-500/20">
                      <p className="text-purple-300 text-xs mb-1">Total Time</p>
                      <p className="text-white font-semibold">{Math.round(instrument.totalMinutes / 60)}h</p>
                    </div>
                    <div className="bg-black/30 rounded-lg p-3 border border-purple-500/20">
                      <p className="text-purple-300 text-xs mb-1">Sessions</p>
                      <p className="text-white font-semibold">{stats.totalSessions}</p>
                    </div>
                    <div className="bg-black/30 rounded-lg p-3 border border-purple-500/20">
                      <p className="text-purple-300 text-xs mb-1">Streak</p>
                      <p className="text-white font-semibold">{stats.streak}d</p>
                    </div>
                  </div>

                  {/* Recent Sessions */}
                  {instrument.sessions.length > 0 && (
                    <div>
                      <p className="text-purple-300 text-xs mb-2">Recent Sessions:</p>
                      <div className="space-y-2">
                        {instrument.sessions.slice(-2).reverse().map(session => (
                          <div key={session.id} className="bg-black/30 rounded-lg p-2 border border-purple-500/20">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-purple-200">{new Date(session.date).toLocaleDateString()}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-purple-300">{session.duration} min</span>
                                <span className="text-purple-300">★ {session.quality}/5</span>
                              </div>
                            </div>
                            {session.focus.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {session.focus.map(f => (
                                  <span key={f} className="px-1.5 py-0.5 bg-purple-500/20 text-purple-300 rounded text-xs">
                                    {f}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Sessions View */}
      {viewMode === 'sessions' && (
        <div className="space-y-3">
          {allSessions.length === 0 ? (
            <div className="text-center py-12 bg-gradient-to-br from-purple-900/20 to-violet-900/20 rounded-xl border border-purple-500/20">
              <Calendar className="w-16 h-16 text-purple-400/50 mx-auto mb-4" />
              <p className="text-purple-200/70 text-lg">No practice sessions logged yet</p>
            </div>
          ) : (
            allSessions.map(session => (
              <div
                key={session.id}
                className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 rounded-xl p-5 border border-purple-500/20"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{session.instrumentName}</h3>
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
                        ★ {session.quality}/5
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-purple-200 mb-3">
                      <span>{new Date(session.date).toLocaleDateString()}</span>
                      <span>{session.duration} minutes</span>
                      <span>{session.mood}</span>
                    </div>

                    {session.focus.length > 0 && (
                      <div className="mb-2">
                        <p className="text-purple-300 text-xs mb-1">Focus Areas:</p>
                        <div className="flex flex-wrap gap-1">
                          {session.focus.map(f => (
                            <span key={f} className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {session.accomplishments && (
                      <div className="mt-2 p-2 bg-black/30 rounded border border-purple-500/20">
                        <p className="text-purple-300 text-xs mb-1">Accomplishments:</p>
                        <p className="text-purple-100 text-sm">{session.accomplishments}</p>
                      </div>
                    )}

                    {session.challenges && (
                      <div className="mt-2 p-2 bg-black/30 rounded border border-purple-500/20">
                        <p className="text-purple-300 text-xs mb-1">Challenges:</p>
                        <p className="text-purple-100 text-sm">{session.challenges}</p>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteSession(session.instrumentId, session.id)}
                    className="p-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Stats View */}
      {viewMode === 'stats' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 rounded-xl p-6 border border-purple-500/20">
            <h3 className="text-xl font-semibold text-white mb-4">Overall Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-black/30 rounded-lg p-4 border border-purple-500/20">
                <p className="text-purple-300 text-sm mb-1">Total Hours</p>
                <p className="text-white font-bold text-2xl">{Math.round(totalStats.totalMinutes / 60)}</p>
              </div>
              <div className="bg-black/30 rounded-lg p-4 border border-purple-500/20">
                <p className="text-purple-300 text-sm mb-1">Sessions</p>
                <p className="text-white font-bold text-2xl">{totalStats.totalSessions}</p>
              </div>
              <div className="bg-black/30 rounded-lg p-4 border border-purple-500/20">
                <p className="text-purple-300 text-sm mb-1">This Week</p>
                <p className="text-white font-bold text-2xl">{totalStats.currentWeekMinutes}m</p>
              </div>
              <div className="bg-black/30 rounded-lg p-4 border border-purple-500/20">
                <p className="text-purple-300 text-sm mb-1">Instruments</p>
                <p className="text-white font-bold text-2xl">{instruments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 rounded-xl p-6 border border-purple-500/20">
            <h3 className="text-xl font-semibold text-white mb-4">Instruments Breakdown</h3>
            <div className="space-y-3">
              {instruments.map(inst => {
                const stats = getInstrumentStats(inst);
                return (
                  <div key={inst.id} className="bg-black/30 rounded-lg p-4 border border-purple-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-semibold">{inst.name}</h4>
                      <span className="text-purple-300 text-sm">{inst.type}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-3 text-sm">
                      <div>
                        <p className="text-purple-300">Hours</p>
                        <p className="text-white font-semibold">{Math.round(inst.totalMinutes / 60)}</p>
                      </div>
                      <div>
                        <p className="text-purple-300">Sessions</p>
                        <p className="text-white font-semibold">{stats.totalSessions}</p>
                      </div>
                      <div>
                        <p className="text-purple-300">Avg</p>
                        <p className="text-white font-semibold">{stats.avgSessionLength}m</p>
                      </div>
                      <div>
                        <p className="text-purple-300">Streak</p>
                        <p className="text-white font-semibold">{stats.streak} days</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
