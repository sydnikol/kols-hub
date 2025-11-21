import React, { useState, useEffect } from 'react';
import { Clock, Timer, Calendar, TrendingUp, Plus, Trash2, Play, Pause, Square } from 'lucide-react';
import toast from 'react-hot-toast';

interface TimeBlock {
  id: string;
  title: string;
  category: 'work' | 'study' | 'exercise' | 'personal' | 'family' | 'social' | 'rest' | 'other';
  startTime: string;
  endTime: string;
  duration: number; // minutes
  date: string;
  completed: boolean;
  productive: boolean;
  notes: string;
}

interface ProductivitySession {
  id: string;
  activity: string;
  category: 'deep-work' | 'meetings' | 'admin' | 'creative' | 'learning' | 'planning' | 'other';
  startTime: string;
  endTime?: string;
  duration: number; // minutes
  date: string;
  focusLevel: number; // 1-5
  distractions: number;
  accomplishments: string;
  active: boolean;
}

interface TimeGoal {
  id: string;
  goal: string;
  category: 'work' | 'study' | 'exercise' | 'personal' | 'family' | 'social' | 'rest' | 'other';
  targetHoursPerWeek: number;
  currentHoursThisWeek: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  startDate: string;
  active: boolean;
  notes: string;
}

const TimeManagementHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'blocks' | 'sessions' | 'goals' | 'stats'>('blocks');
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([]);
  const [sessions, setSessions] = useState<ProductivitySession[]>([]);
  const [timeGoals, setTimeGoals] = useState<TimeGoal[]>([]);
  const [activeSession, setActiveSession] = useState<ProductivitySession | null>(null);
  const [sessionTimer, setSessionTimer] = useState<number>(0);

  useEffect(() => {
    const savedBlocks = localStorage.getItem('timeBlocks');
    if (savedBlocks) setTimeBlocks(JSON.parse(savedBlocks));
    const savedSessions = localStorage.getItem('productivitySessions');
    if (savedSessions) setSessions(JSON.parse(savedSessions));
    const savedGoals = localStorage.getItem('timeGoals');
    if (savedGoals) setTimeGoals(JSON.parse(savedGoals));
  }, []);

  useEffect(() => { localStorage.setItem('timeBlocks', JSON.stringify(timeBlocks)); }, [timeBlocks]);
  useEffect(() => { localStorage.setItem('productivitySessions', JSON.stringify(sessions)); }, [sessions]);
  useEffect(() => { localStorage.setItem('timeGoals', JSON.stringify(timeGoals)); }, [timeGoals]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (activeSession) {
      interval = setInterval(() => {
        setSessionTimer(prev => prev + 1);
      }, 60000); // Update every minute
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeSession]);

  const addTimeBlock = () => {
    const newBlock: TimeBlock = {
      id: Date.now().toString(),
      title: '',
      category: 'work',
      startTime: '',
      endTime: '',
      duration: 0,
      date: new Date().toISOString().split('T')[0],
      completed: false,
      productive: true,
      notes: '',
    };
    setTimeBlocks([...timeBlocks, newBlock]);
    toast.success('Time block added');
  };

  const updateTimeBlock = (id: string, updates: Partial<TimeBlock>) => {
    setTimeBlocks(timeBlocks.map(b => {
      if (b.id === id) {
        const updated = { ...b, ...updates };
        if (updated.startTime && updated.endTime) {
          const start = new Date(`2000-01-01T${updated.startTime}`);
          const end = new Date(`2000-01-01T${updated.endTime}`);
          updated.duration = Math.max(0, (end.getTime() - start.getTime()) / 60000);
        }
        return updated;
      }
      return b;
    }));
    toast.success('Time block updated');
  };

  const deleteTimeBlock = (id: string) => {
    setTimeBlocks(timeBlocks.filter(b => b.id !== id));
    toast.success('Time block deleted');
  };

  const startSession = () => {
    const newSession: ProductivitySession = {
      id: Date.now().toString(),
      activity: '',
      category: 'deep-work',
      startTime: new Date().toISOString(),
      duration: 0,
      date: new Date().toISOString().split('T')[0],
      focusLevel: 3,
      distractions: 0,
      accomplishments: '',
      active: true,
    };
    setSessions([...sessions, newSession]);
    setActiveSession(newSession);
    setSessionTimer(0);
    toast.success('Session started');
  };

  const pauseSession = () => {
    if (activeSession) {
      updateSession(activeSession.id, { duration: activeSession.duration + sessionTimer });
      setActiveSession(null);
      setSessionTimer(0);
      toast.success('Session paused');
    }
  };

  const endSession = () => {
    if (activeSession) {
      updateSession(activeSession.id, {
        endTime: new Date().toISOString(),
        duration: activeSession.duration + sessionTimer,
        active: false,
      });
      setActiveSession(null);
      setSessionTimer(0);
      toast.success('Session ended');
    }
  };

  const updateSession = (id: string, updates: Partial<ProductivitySession>) => {
    setSessions(sessions.map(s => s.id === id ? { ...s, ...updates } : s));
    if (activeSession && activeSession.id === id) {
      setActiveSession({ ...activeSession, ...updates });
    }
    toast.success('Session updated');
  };

  const deleteSession = (id: string) => {
    setSessions(sessions.filter(s => s.id !== id));
    if (activeSession && activeSession.id === id) {
      setActiveSession(null);
      setSessionTimer(0);
    }
    toast.success('Session deleted');
  };

  const addTimeGoal = () => {
    const newGoal: TimeGoal = {
      id: Date.now().toString(),
      goal: '',
      category: 'work',
      targetHoursPerWeek: 10,
      currentHoursThisWeek: 0,
      priority: 'medium',
      startDate: new Date().toISOString().split('T')[0],
      active: true,
      notes: '',
    };
    setTimeGoals([...timeGoals, newGoal]);
    toast.success('Time goal added');
  };

  const updateTimeGoal = (id: string, updates: Partial<TimeGoal>) => {
    setTimeGoals(timeGoals.map(g => g.id === id ? { ...g, ...updates } : g));
    toast.success('Time goal updated');
  };

  const deleteTimeGoal = (id: string) => {
    setTimeGoals(timeGoals.filter(g => g.id !== id));
    toast.success('Time goal deleted');
  };

  const totalBlocks = timeBlocks.length;
  const completedBlocks = timeBlocks.filter(b => b.completed).length;
  const totalHoursLogged = (sessions.reduce((sum, s) => sum + s.duration, 0) / 60).toFixed(1);
  const avgFocusLevel = sessions.length > 0 ? (sessions.reduce((sum, s) => sum + s.focusLevel, 0) / sessions.length).toFixed(1) : '0';

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 pb-20">
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <Clock className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Time Management Hub</h1>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Calendar className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{totalBlocks}</div>
            <div className="text-xs opacity-90">Blocks</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Timer className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{completedBlocks}</div>
            <div className="text-xs opacity-90">Done</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Clock className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{totalHoursLogged}</div>
            <div className="text-xs opacity-90">Hours</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <TrendingUp className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{avgFocusLevel}</div>
            <div className="text-xs opacity-90">Focus</div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="flex overflow-x-auto">
          {[
            { id: 'blocks', label: 'Time Blocks', icon: Calendar },
            { id: 'sessions', label: 'Sessions', icon: Timer },
            { id: 'goals', label: 'Goals', icon: TrendingUp },
            { id: 'stats', label: 'Stats', icon: Clock },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-1 min-w-fit px-4 py-3 font-medium text-sm transition-colors ${activeTab === tab.id ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50' : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'}`}>
              <tab.icon className="w-4 h-4 inline mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {activeTab === 'blocks' && (
          <div className="space-y-4">
            <button onClick={addTimeBlock} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Time Block</span>
            </button>
            {timeBlocks.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No time blocks yet. Start planning your day!</p>
              </div>
            ) : (
              timeBlocks.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(block => (
                <div key={block.id} className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${block.completed ? 'border-green-500' : 'border-indigo-500'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 mr-2">
                      <input type="date" value={block.date} onChange={(e) => updateTimeBlock(block.id, { date: e.target.value })} className="text-sm text-gray-600 bg-transparent border-b border-gray-200 focus:border-indigo-500 outline-none w-full mb-1" />
                      <input type="text" value={block.title} onChange={(e) => updateTimeBlock(block.id, { title: e.target.value })} placeholder="Time block title..." className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-indigo-500 outline-none w-full" />
                    </div>
                    <button onClick={() => deleteTimeBlock(block.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <select value={block.category} onChange={(e) => updateTimeBlock(block.id, { category: e.target.value as TimeBlock['category'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-indigo-500 outline-none">
                      <option value="work">Work</option>
                      <option value="study">Study</option>
                      <option value="exercise">Exercise</option>
                      <option value="personal">Personal</option>
                      <option value="family">Family</option>
                      <option value="social">Social</option>
                      <option value="rest">Rest</option>
                      <option value="other">Other</option>
                    </select>
                    <div className="text-sm text-gray-600 flex items-center justify-center bg-gray-50 px-3 py-2 rounded border border-gray-300">
                      {block.duration > 0 ? `${Math.floor(block.duration / 60)}h ${block.duration % 60}m` : 'Set times'}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Start Time</label>
                      <input type="time" value={block.startTime} onChange={(e) => updateTimeBlock(block.id, { startTime: e.target.value })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-indigo-500 outline-none w-full" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">End Time</label>
                      <input type="time" value={block.endTime} onChange={(e) => updateTimeBlock(block.id, { endTime: e.target.value })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-indigo-500 outline-none w-full" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" checked={block.completed} onChange={(e) => updateTimeBlock(block.id, { completed: e.target.checked })} className="w-4 h-4" />
                      <label className="text-sm text-gray-600">Completed</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" checked={block.productive} onChange={(e) => updateTimeBlock(block.id, { productive: e.target.checked })} className="w-4 h-4" />
                      <label className="text-sm text-gray-600">Productive</label>
                    </div>
                  </div>
                  <textarea value={block.notes} onChange={(e) => updateTimeBlock(block.id, { notes: e.target.value })} placeholder="Notes..." className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-indigo-500 outline-none mt-3" rows={2} />
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'sessions' && (
          <div className="space-y-4">
            {!activeSession ? (
              <button onClick={startSession} className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
                <Play className="w-5 h-5" />
                <span>Start Session</span>
              </button>
            ) : (
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 rounded-lg shadow-lg">
                <div className="text-center mb-4">
                  <Timer className="w-12 h-12 mx-auto mb-2" />
                  <div className="text-4xl font-bold">{Math.floor((activeSession.duration + sessionTimer) / 60)}h {(activeSession.duration + sessionTimer) % 60}m</div>
                  <div className="text-sm opacity-90">Active Session</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={pauseSession} className="bg-white/20 backdrop-blur-sm py-2 rounded-lg font-medium hover:bg-white/30 transition-colors flex items-center justify-center space-x-2">
                    <Pause className="w-5 h-5" />
                    <span>Pause</span>
                  </button>
                  <button onClick={endSession} className="bg-white/20 backdrop-blur-sm py-2 rounded-lg font-medium hover:bg-white/30 transition-colors flex items-center justify-center space-x-2">
                    <Square className="w-5 h-5" />
                    <span>End</span>
                  </button>
                </div>
              </div>
            )}
            {sessions.filter(s => !s.active).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(session => (
              <div key={session.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 mr-2">
                    <input type="text" value={session.activity} onChange={(e) => updateSession(session.id, { activity: e.target.value })} placeholder="Session activity..." className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none w-full mb-2" />
                    <div className="text-sm text-gray-600">
                      {session.date} • {Math.floor(session.duration / 60)}h {session.duration % 60}m
                    </div>
                  </div>
                  <button onClick={() => deleteSession(session.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <select value={session.category} onChange={(e) => updateSession(session.id, { category: e.target.value as ProductivitySession['category'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none w-full mb-3">
                  <option value="deep-work">Deep Work</option>
                  <option value="meetings">Meetings</option>
                  <option value="admin">Admin</option>
                  <option value="creative">Creative</option>
                  <option value="learning">Learning</option>
                  <option value="planning">Planning</option>
                  <option value="other">Other</option>
                </select>
                <div className="space-y-2 mb-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Focus Level: {session.focusLevel}/5</label>
                    <input type="range" min="1" max="5" value={session.focusLevel} onChange={(e) => updateSession(session.id, { focusLevel: parseInt(e.target.value) })} className="w-full" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Distractions</label>
                    <input type="number" min="0" value={session.distractions} onChange={(e) => updateSession(session.id, { distractions: parseInt(e.target.value) || 0 })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none w-full" />
                  </div>
                </div>
                <textarea value={session.accomplishments} onChange={(e) => updateSession(session.id, { accomplishments: e.target.value })} placeholder="What did you accomplish?" className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none" rows={2} />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'goals' && (
          <div className="space-y-4">
            <button onClick={addTimeGoal} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Time Goal</span>
            </button>
            {timeGoals.filter(g => g.active).map(goal => (
              <div key={goal.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-indigo-500">
                <div className="flex justify-between items-start mb-3">
                  <input type="text" value={goal.goal} onChange={(e) => updateTimeGoal(goal.id, { goal: e.target.value })} placeholder="Time goal..." className="flex-1 mr-2 text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-indigo-500 outline-none" />
                  <button onClick={() => deleteTimeGoal(goal.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <select value={goal.category} onChange={(e) => updateTimeGoal(goal.id, { category: e.target.value as TimeGoal['category'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-indigo-500 outline-none">
                    <option value="work">Work</option>
                    <option value="study">Study</option>
                    <option value="exercise">Exercise</option>
                    <option value="personal">Personal</option>
                    <option value="family">Family</option>
                    <option value="social">Social</option>
                    <option value="rest">Rest</option>
                    <option value="other">Other</option>
                  </select>
                  <select value={goal.priority} onChange={(e) => updateTimeGoal(goal.id, { priority: e.target.value as TimeGoal['priority'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-indigo-500 outline-none">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="block text-xs text-gray-600 mb-1">Target Hours per Week</label>
                  <input type="number" min="0" step="0.5" value={goal.targetHoursPerWeek} onChange={(e) => updateTimeGoal(goal.id, { targetHoursPerWeek: parseFloat(e.target.value) || 0 })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-indigo-500 outline-none w-full" />
                </div>
                <div className="mb-3">
                  <label className="block text-xs text-gray-600 mb-1">Current Hours This Week</label>
                  <input type="number" min="0" step="0.5" value={goal.currentHoursThisWeek} onChange={(e) => updateTimeGoal(goal.id, { currentHoursThisWeek: parseFloat(e.target.value) || 0 })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-indigo-500 outline-none w-full" />
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
                    <div className="h-full bg-gradient-to-r from-indigo-600 to-blue-600 transition-all" style={{ width: `${Math.min(100, (goal.currentHoursThisWeek / goal.targetHoursPerWeek) * 100)}%` }} />
                  </div>
                </div>
                <textarea value={goal.notes} onChange={(e) => updateTimeGoal(goal.id, { notes: e.target.value })} placeholder="Notes..." className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-indigo-500 outline-none" rows={2} />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-indigo-600">Time Management Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Time Blocks:</span>
                  <span className="font-semibold">{totalBlocks}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed Blocks:</span>
                  <span className="font-semibold">{completedBlocks}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Sessions:</span>
                  <span className="font-semibold">{sessions.filter(s => !s.active).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Hours Logged:</span>
                  <span className="font-semibold">{totalHoursLogged} hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Focus Level:</span>
                  <span className="font-semibold">{avgFocusLevel}/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Time Goals:</span>
                  <span className="font-semibold">{timeGoals.filter(g => g.active).length}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeManagementHubPage;
