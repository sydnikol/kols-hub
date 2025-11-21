import React, { useState, useEffect } from 'react';
import { Brain, Calendar, FileText, Heart, TrendingUp, Plus, Trash2, Star, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface TherapySession {
  id: string;
  date: string;
  time: string;
  therapist: string;
  type: 'individual' | 'group' | 'couples' | 'family' | 'online';
  duration: number;
  mood: 'terrible' | 'poor' | 'okay' | 'good' | 'excellent';
  topics: string[];
  insights: string;
  homework?: string;
  nextSession?: string;
  notes: string;
  helpful: boolean;
}

interface CopingTechnique {
  id: string;
  name: string;
  category: 'grounding' | 'breathing' | 'mindfulness' | 'physical' | 'social' | 'creative' | 'other';
  effectiveness: number; // 1-5
  whenToUse: string;
  steps: string[];
  practiced: boolean;
  notes: string;
}

interface TherapyGoal {
  id: string;
  goal: string;
  category: 'emotional' | 'behavioral' | 'relational' | 'trauma' | 'identity' | 'other';
  startDate: string;
  targetDate?: string;
  progress: number; // 0-100
  active: boolean;
  notes: string;
}

interface TherapyResource {
  id: string;
  name: string;
  type: 'book' | 'article' | 'video' | 'app' | 'worksheet' | 'hotline' | 'other';
  url?: string;
  phone?: string;
  helpful: boolean;
  notes: string;
}

const TherapyHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sessions' | 'coping' | 'goals' | 'resources' | 'stats'>('sessions');
  const [sessions, setSessions] = useState<TherapySession[]>([]);
  const [techniques, setTechniques] = useState<CopingTechnique[]>([]);
  const [goals, setGoals] = useState<TherapyGoal[]>([]);
  const [resources, setResources] = useState<TherapyResource[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('therapySessions');
    if (saved) setSessions(JSON.parse(saved));
    const savedTech = localStorage.getItem('copingTechniques');
    if (savedTech) setTechniques(JSON.parse(savedTech));
    const savedGoals = localStorage.getItem('therapyGoals');
    if (savedGoals) setGoals(JSON.parse(savedGoals));
    const savedRes = localStorage.getItem('therapyResources');
    if (savedRes) setResources(JSON.parse(savedRes));
  }, []);

  useEffect(() => { localStorage.setItem('therapySessions', JSON.stringify(sessions)); }, [sessions]);
  useEffect(() => { localStorage.setItem('copingTechniques', JSON.stringify(techniques)); }, [techniques]);
  useEffect(() => { localStorage.setItem('therapyGoals', JSON.stringify(goals)); }, [goals]);
  useEffect(() => { localStorage.setItem('therapyResources', JSON.stringify(resources)); }, [resources]);

  const addSession = () => {
    const newSession: TherapySession = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      therapist: '',
      type: 'individual',
      duration: 50,
      mood: 'okay',
      topics: [],
      insights: '',
      notes: '',
      helpful: true,
    };
    setSessions([...sessions, newSession]);
    toast.success('Session logged');
  };

  const updateSession = (id: string, updates: Partial<TherapySession>) => {
    setSessions(sessions.map(s => s.id === id ? { ...s, ...updates } : s));
    toast.success('Session updated');
  };

  const deleteSession = (id: string) => {
    setSessions(sessions.filter(s => s.id !== id));
    toast.success('Session deleted');
  };

  const totalSessions = sessions.length;
  const helpfulSessions = sessions.filter(s => s.helpful).length;
  const activeGoals = goals.filter(g => g.active).length;
  const practicedTechniques = techniques.filter(t => t.practiced).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 pb-20">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Therapy Hub</h1>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Calendar className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{totalSessions}</div>
            <div className="text-xs opacity-90">Sessions</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <CheckCircle className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{helpfulSessions}</div>
            <div className="text-xs opacity-90">Helpful</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Star className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{activeGoals}</div>
            <div className="text-xs opacity-90">Goals</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Heart className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{practicedTechniques}</div>
            <div className="text-xs opacity-90">Practiced</div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="flex overflow-x-auto">
          {[
            { id: 'sessions', label: 'Sessions', icon: Calendar },
            { id: 'coping', label: 'Coping Tools', icon: Heart },
            { id: 'goals', label: 'Goals', icon: Star },
            { id: 'resources', label: 'Resources', icon: FileText },
            { id: 'stats', label: 'Stats', icon: TrendingUp },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-1 min-w-fit px-4 py-3 font-medium text-sm transition-colors ${activeTab === tab.id ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50' : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'}`}>
              <tab.icon className="w-4 h-4 inline mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {activeTab === 'sessions' && (
          <div className="space-y-4">
            <button onClick={addSession} className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Log Session</span>
            </button>
            {sessions.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No sessions yet. Track your therapy journey!</p>
              </div>
            ) : (
              sessions.sort((a, b) => new Date(b.date + ' ' + b.time).getTime() - new Date(a.date + ' ' + a.time).getTime()).map(session => (
                <div key={session.id} className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${session.helpful ? 'border-purple-500' : 'border-gray-300'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="grid grid-cols-2 gap-2 flex-1 mr-2">
                      <input type="date" value={session.date} onChange={(e) => updateSession(session.id, { date: e.target.value })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-purple-500 outline-none" />
                      <input type="time" value={session.time} onChange={(e) => updateSession(session.id, { time: e.target.value })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-purple-500 outline-none" />
                    </div>
                    <button onClick={() => deleteSession(session.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <input type="text" value={session.therapist} onChange={(e) => updateSession(session.id, { therapist: e.target.value })} placeholder="Therapist name..." className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-purple-500 outline-none" />
                    <select value={session.type} onChange={(e) => updateSession(session.id, { type: e.target.value as TherapySession['type'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-purple-500 outline-none">
                      <option value="individual">Individual</option>
                      <option value="group">Group</option>
                      <option value="couples">Couples</option>
                      <option value="family">Family</option>
                      <option value="online">Online</option>
                    </select>
                    <input type="number" value={session.duration} onChange={(e) => updateSession(session.id, { duration: parseInt(e.target.value) })} placeholder="Duration (min)..." className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-purple-500 outline-none" />
                    <select value={session.mood} onChange={(e) => updateSession(session.id, { mood: e.target.value as TherapySession['mood'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-purple-500 outline-none">
                      <option value="terrible">Terrible</option>
                      <option value="poor">Poor</option>
                      <option value="okay">Okay</option>
                      <option value="good">Good</option>
                      <option value="excellent">Excellent</option>
                    </select>
                  </div>
                  <textarea value={session.insights} onChange={(e) => updateSession(session.id, { insights: e.target.value })} placeholder="Key insights, breakthroughs..." className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-purple-500 outline-none mb-2" rows={2} />
                  <textarea value={session.homework || ''} onChange={(e) => updateSession(session.id, { homework: e.target.value })} placeholder="Homework (optional)..." className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-purple-500 outline-none mb-2" rows={1} />
                  <label className="flex items-center space-x-2 cursor-pointer text-sm">
                    <input type="checkbox" checked={session.helpful} onChange={(e) => updateSession(session.id, { helpful: e.target.checked })} className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                    <span className="text-gray-700">This session was helpful</span>
                  </label>
                </div>
              ))
            )}
          </div>
        )}
        {activeTab === 'stats' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-purple-600">Therapy Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Sessions:</span>
                  <span className="font-semibold">{totalSessions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Helpful Sessions:</span>
                  <span className="font-semibold">{helpfulSessions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Goals:</span>
                  <span className="font-semibold">{activeGoals}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Coping Techniques:</span>
                  <span className="font-semibold">{techniques.length}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TherapyHubPage;
