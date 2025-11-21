import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, Target, TrendingUp, Zap, Plus, Trash2, Star, Brain } from 'lucide-react';
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
  targetHours: number;
  currentHours: number;
  deadline?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  active: boolean;
}

interface FocusTimer {
  id: string;
  name: string;
  workDuration: number; // minutes
  breakDuration: number;
  longBreakDuration: number;
  sessions: number;
  active: boolean;
}

const StudyTrackingHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sessions' | 'goals' | 'timer' | 'stats'>('sessions');
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [goals, setGoals] = useState<StudyGoal[]>([]);
  const [timers, setTimers] = useState<FocusTimer[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('studySessions');
    if (saved) setSessions(JSON.parse(saved));
    const savedGoals = localStorage.getItem('studyGoals');
    if (savedGoals) setGoals(JSON.parse(savedGoals));
    const savedTimers = localStorage.getItem('focusTimers');
    if (savedTimers) setTimers(JSON.parse(savedTimers));
  }, []);

  useEffect(() => { localStorage.setItem('studySessions', JSON.stringify(sessions)); }, [sessions]);
  useEffect(() => { localStorage.setItem('studyGoals', JSON.stringify(goals)); }, [goals]);
  useEffect(() => { localStorage.setItem('focusTimers', JSON.stringify(timers)); }, [timers]);

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
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyTrackingHubPage;
