import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Clock, Target, TrendingUp, Zap, Plus, Trash2, Star, Brain, Play, Pause, RotateCcw, Volume2, VolumeX, Edit2, Check, X, Calendar, Award, Flame } from 'lucide-react';
import toast from 'react-hot-toast';

interface StudySession {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  subject: string;
  topic: string;
  duration: number; // minutes
  focusLevel: number; // 1-5
  productivity: number; // 1-5
  technique: 'pomodoro' | 'deep-work' | 'spaced-repetition' | 'active-recall' | 'other';
  breaks: number;
  notes: string;
  completed: boolean;
}

interface StudyGoal {
  id: string;
  goal: string;
  subject: string;
  category: 'daily' | 'weekly' | 'short-term' | 'long-term';
  targetHours: number;
  currentHours: number;
  deadline: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  active: boolean;
  createdDate: string;
}

interface TimerSession {
  id: string;
  date: string;
  subject: string;
  duration: number;
  type: 'work' | 'break';
  completed: boolean;
}

interface TimerSettings {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  sessionsBeforeLongBreak: number;
  autoStartBreaks: boolean;
  autoStartWork: boolean;
  soundEnabled: boolean;
  focusMode: boolean;
}

const StudyTrackingHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sessions' | 'goals' | 'timer' | 'stats'>('sessions');
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [goals, setGoals] = useState<StudyGoal[]>([]);
  const [timerSessions, setTimerSessions] = useState<TimerSession[]>([]);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [showAddGoalForm, setShowAddGoalForm] = useState(false);

  // Timer state
  const [timeRemaining, setTimeRemaining] = useState(25 * 60); // 25 minutes in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState<'work' | 'shortBreak' | 'longBreak'>('work');
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [currentSubject, setCurrentSubject] = useState('');
  const [studyStreak, setStudyStreak] = useState(0);

  const [timerSettings, setTimerSettings] = useState<TimerSettings>({
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    sessionsBeforeLongBreak: 4,
    autoStartBreaks: false,
    autoStartWork: false,
    soundEnabled: true,
    focusMode: false,
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // New goal form state
  const [newGoal, setNewGoal] = useState({
    goal: '',
    subject: '',
    category: 'short-term' as const,
    targetHours: 10,
    deadline: '',
    priority: 'medium' as const,
  });

  useEffect(() => {
    const saved = localStorage.getItem('studySessions');
    if (saved) setSessions(JSON.parse(saved));

    const savedGoals = localStorage.getItem('studyGoals');
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    } else {
      // Initialize with sample goals
      const sampleGoals: StudyGoal[] = [
        {
          id: '1',
          goal: 'Complete Calculus Chapter 5',
          subject: 'Mathematics',
          category: 'short-term',
          targetHours: 12,
          currentHours: 7.5,
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          priority: 'high',
          active: true,
          createdDate: new Date().toISOString().split('T')[0],
        },
        {
          id: '2',
          goal: 'Master React Hooks',
          subject: 'Programming',
          category: 'long-term',
          targetHours: 40,
          currentHours: 18,
          deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          priority: 'critical',
          active: true,
          createdDate: new Date().toISOString().split('T')[0],
        },
        {
          id: '3',
          goal: 'Daily Practice Problems',
          subject: 'Mathematics',
          category: 'daily',
          targetHours: 2,
          currentHours: 1.5,
          deadline: new Date().toISOString().split('T')[0],
          priority: 'medium',
          active: true,
          createdDate: new Date().toISOString().split('T')[0],
        },
        {
          id: '4',
          goal: 'Read 5 Academic Papers',
          subject: 'Research',
          category: 'weekly',
          targetHours: 10,
          currentHours: 4,
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          priority: 'high',
          active: true,
          createdDate: new Date().toISOString().split('T')[0],
        },
        {
          id: '5',
          goal: 'Physics Exam Preparation',
          subject: 'Physics',
          category: 'short-term',
          targetHours: 25,
          currentHours: 12,
          deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          priority: 'critical',
          active: true,
          createdDate: new Date().toISOString().split('T')[0],
        },
        {
          id: '6',
          goal: 'Weekly Code Review',
          subject: 'Programming',
          category: 'weekly',
          targetHours: 5,
          currentHours: 2.5,
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          priority: 'medium',
          active: true,
          createdDate: new Date().toISOString().split('T')[0],
        },
        {
          id: '7',
          goal: 'Spanish Vocabulary Building',
          subject: 'Languages',
          category: 'long-term',
          targetHours: 50,
          currentHours: 22,
          deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          priority: 'medium',
          active: true,
          createdDate: new Date().toISOString().split('T')[0],
        },
        {
          id: '8',
          goal: 'Morning Reading Routine',
          subject: 'General',
          category: 'daily',
          targetHours: 1,
          currentHours: 0.8,
          deadline: new Date().toISOString().split('T')[0],
          priority: 'low',
          active: true,
          createdDate: new Date().toISOString().split('T')[0],
        },
        {
          id: '9',
          goal: 'Database Design Course',
          subject: 'Computer Science',
          category: 'short-term',
          targetHours: 20,
          currentHours: 8.5,
          deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          priority: 'high',
          active: true,
          createdDate: new Date().toISOString().split('T')[0],
        },
        {
          id: '10',
          goal: 'Algorithm Practice Sessions',
          subject: 'Computer Science',
          category: 'weekly',
          targetHours: 8,
          currentHours: 5,
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          priority: 'high',
          active: true,
          createdDate: new Date().toISOString().split('T')[0],
        },
      ];
      setGoals(sampleGoals);
    }

    const savedTimerSessions = localStorage.getItem('timerSessions');
    if (savedTimerSessions) setTimerSessions(JSON.parse(savedTimerSessions));

    const savedTimerSettings = localStorage.getItem('timerSettings');
    if (savedTimerSettings) setTimerSettings(JSON.parse(savedTimerSettings));

    const savedStreak = localStorage.getItem('studyStreak');
    if (savedStreak) setStudyStreak(parseInt(savedStreak));

    const savedPomodoros = localStorage.getItem('completedPomodoros');
    if (savedPomodoros) setCompletedPomodoros(parseInt(savedPomodoros));
  }, []);

  useEffect(() => { localStorage.setItem('studySessions', JSON.stringify(sessions)); }, [sessions]);
  useEffect(() => { localStorage.setItem('studyGoals', JSON.stringify(goals)); }, [goals]);
  useEffect(() => { localStorage.setItem('timerSessions', JSON.stringify(timerSessions)); }, [timerSessions]);
  useEffect(() => { localStorage.setItem('timerSettings', JSON.stringify(timerSettings)); }, [timerSettings]);
  useEffect(() => { localStorage.setItem('studyStreak', studyStreak.toString()); }, [studyStreak]);
  useEffect(() => { localStorage.setItem('completedPomodoros', completedPomodoros.toString()); }, [completedPomodoros]);

  // Timer effect
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isTimerRunning]);

  const handleTimerComplete = () => {
    setIsTimerRunning(false);
    if (timerSettings.soundEnabled) {
      playNotificationSound();
    }

    if (timerMode === 'work') {
      const newPomodoros = completedPomodoros + 1;
      setCompletedPomodoros(newPomodoros);

      // Save timer session
      const session: TimerSession = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        subject: currentSubject || 'Study Session',
        duration: timerSettings.workDuration,
        type: 'work',
        completed: true,
      };
      setTimerSessions([...timerSessions, session]);

      // Update streak
      updateStreak();

      toast.success('Pomodoro completed! Great work!');

      // Auto-start break if enabled
      const nextBreak = newPomodoros % timerSettings.sessionsBeforeLongBreak === 0 ? 'longBreak' : 'shortBreak';
      setTimerMode(nextBreak);
      setTimeRemaining(nextBreak === 'longBreak' ? timerSettings.longBreakDuration * 60 : timerSettings.shortBreakDuration * 60);

      if (timerSettings.autoStartBreaks) {
        setIsTimerRunning(true);
      }
    } else {
      toast.success('Break complete! Ready to focus?');
      setTimerMode('work');
      setTimeRemaining(timerSettings.workDuration * 60);

      if (timerSettings.autoStartWork) {
        setIsTimerRunning(true);
      }
    }
  };

  const playNotificationSound = () => {
    // Create a simple beep sound
    const context = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5);

    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.5);
  };

  const updateStreak = () => {
    const today = new Date().toISOString().split('T')[0];
    const todaySessions = timerSessions.filter(s => s.date === today && s.type === 'work');
    if (todaySessions.length === 0) {
      setStudyStreak(studyStreak + 1);
    }
  };

  const startTimer = () => setIsTimerRunning(true);
  const pauseTimer = () => setIsTimerRunning(false);
  const resetTimer = () => {
    setIsTimerRunning(false);
    const duration = timerMode === 'work'
      ? timerSettings.workDuration
      : timerMode === 'shortBreak'
        ? timerSettings.shortBreakDuration
        : timerSettings.longBreakDuration;
    setTimeRemaining(duration * 60);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const addSession = () => {
    const now = new Date();
    const newSession: StudySession = {
      id: Date.now().toString(),
      date: now.toISOString().split('T')[0],
      startTime: now.toTimeString().slice(0, 5),
      endTime: new Date(now.getTime() + 60 * 60000).toTimeString().slice(0, 5),
      subject: '',
      topic: '',
      duration: 60,
      focusLevel: 3,
      productivity: 3,
      technique: 'pomodoro',
      breaks: 0,
      notes: '',
      completed: false,
    };
    setSessions([...sessions, newSession]);
    toast.success('Study session added');
  };

  const updateSession = (id: string, updates: Partial<StudySession>) => {
    setSessions(sessions.map(s => s.id === id ? { ...s, ...updates } : s));
    toast.success('Session updated');
  };

  const deleteSession = (id: string) => {
    setSessions(sessions.filter(s => s.id !== id));
    toast.success('Session deleted');
  };

  const addGoal = () => {
    if (!newGoal.goal || !newGoal.subject || !newGoal.deadline) {
      toast.error('Please fill in all required fields');
      return;
    }

    const goal: StudyGoal = {
      id: Date.now().toString(),
      ...newGoal,
      currentHours: 0,
      active: true,
      createdDate: new Date().toISOString().split('T')[0],
    };

    setGoals([...goals, goal]);
    setNewGoal({
      goal: '',
      subject: '',
      category: 'short-term',
      targetHours: 10,
      deadline: '',
      priority: 'medium',
    });
    setShowAddGoalForm(false);
    toast.success('Goal added successfully');
  };

  const updateGoal = (id: string, updates: Partial<StudyGoal>) => {
    setGoals(goals.map(g => g.id === id ? { ...g, ...updates } : g));
    toast.success('Goal updated');
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
    toast.success('Goal deleted');
  };

  const getProgressColor = (progress: number): string => {
    if (progress >= 100) return 'bg-green-500';
    if (progress >= 75) return 'bg-blue-500';
    if (progress >= 50) return 'bg-indigo-500';
    if (progress >= 25) return 'bg-violet-500';
    return 'bg-purple-500';
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getCategoryBadge = (category: string): { color: string; icon: any } => {
    switch (category) {
      case 'daily': return { color: 'bg-green-100 text-green-800', icon: Calendar };
      case 'weekly': return { color: 'bg-blue-100 text-blue-800', icon: Calendar };
      case 'short-term': return { color: 'bg-indigo-100 text-indigo-800', icon: Target };
      case 'long-term': return { color: 'bg-purple-100 text-purple-800', icon: Award };
      default: return { color: 'bg-gray-100 text-gray-800', icon: Target };
    }
  };

  const totalHours = sessions.reduce((sum, s) => sum + s.duration, 0) / 60;
  const avgFocus = sessions.length ? (sessions.reduce((sum, s) => sum + s.focusLevel, 0) / sessions.length).toFixed(1) : '0';
  const completedSessions = sessions.filter(s => s.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 pb-20">
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <BookOpen className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Study Tracking Hub</h1>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Clock className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{totalHours.toFixed(1)}h</div>
            <div className="text-xs opacity-90">Total Hours</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Brain className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{avgFocus}/5</div>
            <div className="text-xs opacity-90">Avg Focus</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Target className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{completedSessions}</div>
            <div className="text-xs opacity-90">Completed</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Zap className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{goals.filter(g => g.active).length}</div>
            <div className="text-xs opacity-90">Goals</div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="flex overflow-x-auto">
          {[
            { id: 'sessions', label: 'Sessions', icon: BookOpen },
            { id: 'goals', label: 'Goals', icon: Target },
            { id: 'timer', label: 'Focus Timer', icon: Clock },
            { id: 'stats', label: 'Stats', icon: TrendingUp },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-1 min-w-fit px-4 py-3 font-medium text-sm transition-colors ${activeTab === tab.id ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50' : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'}`}>
              <tab.icon className="w-4 h-4 inline mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {activeTab === 'sessions' && (
          <div className="space-y-4">
            <button onClick={addSession} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Log Study Session</span>
            </button>
            {sessions.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No study sessions yet. Start tracking your learning!</p>
              </div>
            ) : (
              sessions.sort((a, b) => new Date(b.date + ' ' + b.startTime).getTime() - new Date(a.date + ' ' + a.startTime).getTime()).map(session => (
                <div key={session.id} className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${session.completed ? 'border-green-500' : 'border-indigo-500'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="grid grid-cols-2 gap-2 flex-1 mr-2">
                      <input type="date" value={session.date} onChange={(e) => updateSession(session.id, { date: e.target.value })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-indigo-500 outline-none" />
                      <input type="time" value={session.startTime} onChange={(e) => updateSession(session.id, { startTime: e.target.value })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-indigo-500 outline-none" />
                    </div>
                    <button onClick={() => deleteSession(session.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <input type="text" value={session.subject} onChange={(e) => updateSession(session.id, { subject: e.target.value })} placeholder="Subject..." className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-indigo-500 outline-none" />
                    <input type="text" value={session.topic} onChange={(e) => updateSession(session.id, { topic: e.target.value })} placeholder="Topic..." className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-indigo-500 outline-none" />
                    <input type="number" value={session.duration} onChange={(e) => updateSession(session.id, { duration: parseInt(e.target.value) })} placeholder="Duration (min)..." className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-indigo-500 outline-none" />
                    <select value={session.technique} onChange={(e) => updateSession(session.id, { technique: e.target.value as StudySession['technique'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-indigo-500 outline-none">
                      <option value="pomodoro">Pomodoro</option>
                      <option value="deep-work">Deep Work</option>
                      <option value="spaced-repetition">Spaced Repetition</option>
                      <option value="active-recall">Active Recall</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm text-gray-600 mb-2">Focus Level: {session.focusLevel}/5</label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map(level => (
                        <button key={level} onClick={() => updateSession(session.id, { focusLevel: level })} className={`w-10 h-10 rounded ${level <= session.focusLevel ? 'bg-indigo-500 text-white' : 'bg-gray-200'}`}>{level}</button>
                      ))}
                    </div>
                  </div>
                  <textarea value={session.notes} onChange={(e) => updateSession(session.id, { notes: e.target.value })} placeholder="Notes, key learnings..." className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-indigo-500 outline-none mb-2" rows={2} />
                  <label className="flex items-center space-x-2 cursor-pointer text-sm">
                    <input type="checkbox" checked={session.completed} onChange={(e) => updateSession(session.id, { completed: e.target.checked })} className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                    <span className="text-gray-700">Completed</span>
                  </label>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'goals' && (
          <div className="space-y-4">
            <button onClick={() => setShowAddGoalForm(!showAddGoalForm)} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add New Goal</span>
            </button>

            {showAddGoalForm && (
              <div className="bg-white rounded-lg shadow-lg p-5 border-2 border-indigo-200">
                <h3 className="text-lg font-semibold mb-4 text-indigo-600">Create New Goal</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Goal description..."
                    value={newGoal.goal}
                    onChange={(e) => setNewGoal({ ...newGoal, goal: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 outline-none"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Subject"
                      value={newGoal.subject}
                      onChange={(e) => setNewGoal({ ...newGoal, subject: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 outline-none"
                    />
                    <select
                      value={newGoal.category}
                      onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value as any })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 outline-none"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="short-term">Short-term</option>
                      <option value="long-term">Long-term</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Target Hours</label>
                      <input
                        type="number"
                        value={newGoal.targetHours}
                        onChange={(e) => setNewGoal({ ...newGoal, targetHours: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Deadline</label>
                      <input
                        type="date"
                        value={newGoal.deadline}
                        onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 outline-none"
                      />
                    </div>
                  </div>
                  <select
                    value={newGoal.priority}
                    onChange={(e) => setNewGoal({ ...newGoal, priority: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 outline-none"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                    <option value="critical">Critical Priority</option>
                  </select>
                  <div className="flex space-x-2">
                    <button onClick={addGoal} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                      Create Goal
                    </button>
                    <button onClick={() => setShowAddGoalForm(false)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4">
              {goals.filter(g => g.active).sort((a, b) => {
                const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
              }).map(goal => {
                const progress = Math.min((goal.currentHours / goal.targetHours) * 100, 100);
                const categoryInfo = getCategoryBadge(goal.category);
                const CategoryIcon = categoryInfo.icon;
                const daysUntilDeadline = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

                return (
                  <div key={goal.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-indigo-500">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-800 mb-2">{goal.goal}</h3>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${categoryInfo.color} flex items-center`}>
                            <CategoryIcon className="w-3 h-3 mr-1" />
                            {goal.category}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(goal.priority)}`}>
                            {goal.priority}
                          </span>
                          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                            {goal.subject}
                          </span>
                        </div>
                      </div>
                      <button onClick={() => deleteGoal(goal.id)} className="text-red-500 hover:text-red-700 ml-2">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Progress: {goal.currentHours.toFixed(1)}h / {goal.targetHours}h</span>
                        <span className="font-semibold">{progress.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div className={`h-full ${getProgressColor(progress)} transition-all duration-300 rounded-full`} style={{ width: `${progress}%` }}></div>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className={`text-gray-600 flex items-center ${daysUntilDeadline < 0 ? 'text-red-600 font-semibold' : daysUntilDeadline < 7 ? 'text-orange-600' : ''}`}>
                          <Calendar className="w-4 h-4 mr-1" />
                          {daysUntilDeadline < 0 ? `Overdue by ${Math.abs(daysUntilDeadline)} days` : `${daysUntilDeadline} days left`}
                        </span>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateGoal(goal.id, { currentHours: Math.max(0, goal.currentHours - 0.5) })}
                            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-gray-700"
                          >
                            -0.5h
                          </button>
                          <button
                            onClick={() => updateGoal(goal.id, { currentHours: goal.currentHours + 0.5 })}
                            className="px-2 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                          >
                            +0.5h
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {goals.filter(g => g.active).length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Target className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No active goals. Create your first study goal!</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'timer' && (
          <div className="space-y-4">
            {/* Timer Display */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl shadow-xl p-8 text-white">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  {timerMode === 'work' && <Zap className="w-6 h-6" />}
                  {timerMode !== 'work' && <Clock className="w-6 h-6" />}
                  <h2 className="text-2xl font-bold">
                    {timerMode === 'work' ? 'Focus Session' : timerMode === 'shortBreak' ? 'Short Break' : 'Long Break'}
                  </h2>
                </div>
                {currentSubject && <p className="text-lg opacity-90">{currentSubject}</p>}
              </div>

              <div className="text-center mb-8">
                <div className="text-7xl font-bold mb-4 font-mono">{formatTime(timeRemaining)}</div>
                <div className="flex items-center justify-center space-x-2 text-sm opacity-90">
                  <Star className="w-4 h-4" />
                  <span>{completedPomodoros} Pomodoros completed today</span>
                </div>
              </div>

              <div className="flex justify-center space-x-4 mb-6">
                {!isTimerRunning ? (
                  <button onClick={startTimer} className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors flex items-center space-x-2">
                    <Play className="w-5 h-5" />
                    <span>Start</span>
                  </button>
                ) : (
                  <button onClick={pauseTimer} className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors flex items-center space-x-2">
                    <Pause className="w-5 h-5" />
                    <span>Pause</span>
                  </button>
                )}
                <button onClick={resetTimer} className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors flex items-center space-x-2">
                  <RotateCcw className="w-5 h-5" />
                  <span>Reset</span>
                </button>
              </div>

              {timerMode === 'work' && (
                <input
                  type="text"
                  placeholder="What are you studying?"
                  value={currentSubject}
                  onChange={(e) => setCurrentSubject(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg text-gray-800 outline-none"
                  disabled={isTimerRunning}
                />
              )}
            </div>

            {/* Study Streak */}
            <div className="bg-white rounded-lg shadow-md p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Flame className="w-6 h-6 text-orange-500" />
                  <h3 className="text-lg font-semibold text-gray-800">Study Streak</h3>
                </div>
                <span className="text-2xl font-bold text-orange-500">{studyStreak} days</span>
              </div>
              <div className="text-sm text-gray-600">
                Keep your streak alive by completing at least one Pomodoro session each day!
              </div>
            </div>

            {/* Timer Settings */}
            <div className="bg-white rounded-lg shadow-md p-5">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Timer Settings</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Work (min)</label>
                    <input
                      type="number"
                      value={timerSettings.workDuration}
                      onChange={(e) => {
                        setTimerSettings({ ...timerSettings, workDuration: parseInt(e.target.value) });
                        if (timerMode === 'work' && !isTimerRunning) {
                          setTimeRemaining(parseInt(e.target.value) * 60);
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Short Break</label>
                    <input
                      type="number"
                      value={timerSettings.shortBreakDuration}
                      onChange={(e) => setTimerSettings({ ...timerSettings, shortBreakDuration: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Long Break</label>
                    <input
                      type="number"
                      value={timerSettings.longBreakDuration}
                      onChange={(e) => setTimerSettings({ ...timerSettings, longBreakDuration: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Pomodoros before long break</label>
                  <input
                    type="number"
                    value={timerSettings.sessionsBeforeLongBreak}
                    onChange={(e) => setTimerSettings({ ...timerSettings, sessionsBeforeLongBreak: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={timerSettings.autoStartBreaks}
                      onChange={(e) => setTimerSettings({ ...timerSettings, autoStartBreaks: e.target.checked })}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">Auto-start breaks</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={timerSettings.autoStartWork}
                      onChange={(e) => setTimerSettings({ ...timerSettings, autoStartWork: e.target.checked })}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">Auto-start work sessions</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={timerSettings.soundEnabled}
                      onChange={(e) => setTimerSettings({ ...timerSettings, soundEnabled: e.target.checked })}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700 flex items-center">
                      {timerSettings.soundEnabled ? <Volume2 className="w-4 h-4 mr-1" /> : <VolumeX className="w-4 h-4 mr-1" />}
                      Sound notifications
                    </span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={timerSettings.focusMode}
                      onChange={(e) => setTimerSettings({ ...timerSettings, focusMode: e.target.checked })}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">Focus mode (hide distractions)</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Session History */}
            <div className="bg-white rounded-lg shadow-md p-5">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-indigo-600" />
                Recent Sessions
              </h3>
              {timerSessions.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No timer sessions yet. Start a Pomodoro!</p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {timerSessions.slice().reverse().slice(0, 10).map(session => (
                    <div key={session.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${session.type === 'work' ? 'bg-indigo-500' : 'bg-green-500'}`}></div>
                        <div>
                          <div className="text-sm font-medium text-gray-800">{session.subject}</div>
                          <div className="text-xs text-gray-500">{session.date}</div>
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-gray-700">{session.duration} min</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-indigo-600">Study Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Sessions:</span>
                  <span className="font-semibold">{sessions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Hours:</span>
                  <span className="font-semibold">{totalHours.toFixed(1)}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Focus:</span>
                  <span className="font-semibold">{avgFocus}/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed Sessions:</span>
                  <span className="font-semibold">{completedSessions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Goals:</span>
                  <span className="font-semibold">{goals.filter(g => g.active).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pomodoros Completed:</span>
                  <span className="font-semibold">{completedPomodoros}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Study Streak:</span>
                  <span className="font-semibold flex items-center">
                    <Flame className="w-4 h-4 text-orange-500 mr-1" />
                    {studyStreak} days
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-indigo-600">Goal Progress Summary</h3>
              <div className="space-y-3">
                {goals.filter(g => g.active).map(goal => {
                  const progress = Math.min((goal.currentHours / goal.targetHours) * 100, 100);
                  return (
                    <div key={goal.id}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700 font-medium">{goal.goal}</span>
                        <span className="text-gray-600">{progress.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className={`h-full ${getProgressColor(progress)} transition-all duration-300 rounded-full`} style={{ width: `${progress}%` }}></div>
                      </div>
                    </div>
                  );
                })}
                {goals.filter(g => g.active).length === 0 && (
                  <p className="text-center text-gray-500 py-4">No active goals to display</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyTrackingHubPage;
