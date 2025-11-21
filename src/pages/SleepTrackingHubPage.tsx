import React, { useState, useEffect } from 'react';
import { Moon, Sun, TrendingUp, Zap, Clock, Plus, Trash2, Star } from 'lucide-react';
import toast from 'react-hot-toast';

interface SleepLog {
  id: string;
  date: string;
  bedtime: string;
  wakeTime: string;
  totalHours: number;
  quality: number; // 1-5
  restfulness: number; // 1-5
  dreamRecall: boolean;
  interrupted: boolean;
  interruptionsCount?: number;
  mood: 'terrible' | 'poor' | 'okay' | 'good' | 'excellent';
  notes: string;
}

interface SleepGoal {
  id: string;
  goal: string;
  targetHours: number;
  targetBedtime: string;
  targetWakeTime: string;
  active: boolean;
}

interface SleepEnvironment {
  id: string;
  date: string;
  roomTemp: number;
  noise: 'silent' | 'quiet' | 'moderate' | 'loud';
  light: 'dark' | 'dim' | 'some-light' | 'bright';
  comfort: number; // 1-5
  notes: string;
}

const SleepTrackingHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'logs' | 'goals' | 'environment' | 'stats'>('logs');
  const [logs, setLogs] = useState<SleepLog[]>([]);
  const [goals, setGoals] = useState<SleepGoal[]>([]);
  const [environments, setEnvironments] = useState<SleepEnvironment[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('sleepLogs');
    if (saved) setLogs(JSON.parse(saved));
    const savedGoals = localStorage.getItem('sleepGoals');
    if (savedGoals) setGoals(JSON.parse(savedGoals));
    const savedEnv = localStorage.getItem('sleepEnvironments');
    if (savedEnv) setEnvironments(JSON.parse(savedEnv));
  }, []);

  useEffect(() => { localStorage.setItem('sleepLogs', JSON.stringify(logs)); }, [logs]);
  useEffect(() => { localStorage.setItem('sleepGoals', JSON.stringify(goals)); }, [goals]);
  useEffect(() => { localStorage.setItem('sleepEnvironments', JSON.stringify(environments)); }, [environments]);

  const addLog = () => {
    const newLog: SleepLog = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      bedtime: '22:00',
      wakeTime: '07:00',
      totalHours: 9,
      quality: 3,
      restfulness: 3,
      dreamRecall: false,
      interrupted: false,
      mood: 'okay',
      notes: '',
    };
    setLogs([...logs, newLog]);
    toast.success('Sleep log added');
  };

  const updateLog = (id: string, updates: Partial<SleepLog>) => {
    setLogs(logs.map(l => l.id === id ? { ...l, ...updates } : l));
    toast.success('Log updated');
  };

  const deleteLog = (id: string) => {
    setLogs(logs.filter(l => l.id !== id));
    toast.success('Log deleted');
  };

  const avgHours = logs.length ? (logs.reduce((sum, l) => sum + l.totalHours, 0) / logs.length).toFixed(1) : '0';
  const avgQuality = logs.length ? (logs.reduce((sum, l) => sum + l.quality, 0) / logs.length).toFixed(1) : '0';

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 pb-20">
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <Moon className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Sleep Tracking Hub</h1>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Clock className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{avgHours}h</div>
            <div className="text-xs opacity-90">Avg Sleep</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Star className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{avgQuality}/5</div>
            <div className="text-xs opacity-90">Avg Quality</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <TrendingUp className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{logs.length}</div>
            <div className="text-xs opacity-90">Logs</div>
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
            { id: 'logs', label: 'Sleep Logs', icon: Moon },
            { id: 'goals', label: 'Goals', icon: Zap },
            { id: 'environment', label: 'Environment', icon: Sun },
            { id: 'stats', label: 'Stats', icon: TrendingUp },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 min-w-fit px-4 py-3 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                  : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-4 h-4 inline mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {activeTab === 'logs' && (
          <div className="space-y-4">
            <button onClick={addLog} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Log Sleep</span>
            </button>
            {logs.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Moon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No sleep logs yet. Start tracking your sleep!</p>
              </div>
            ) : (
              logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(log => (
                <div key={log.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-indigo-500">
                  <div className="flex justify-between items-start mb-3">
                    <input
                      type="date"
                      value={log.date}
                      onChange={(e) => updateLog(log.id, { date: e.target.value })}
                      className="text-lg font-semibold bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-indigo-500 outline-none"
                    />
                    <button onClick={() => deleteLog(log.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <input
                      type="time"
                      value={log.bedtime}
                      onChange={(e) => updateLog(log.id, { bedtime: e.target.value })}
                      placeholder="Bedtime..."
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-indigo-500 outline-none"
                    />
                    <input
                      type="time"
                      value={log.wakeTime}
                      onChange={(e) => updateLog(log.id, { wakeTime: e.target.value })}
                      placeholder="Wake time..."
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-indigo-500 outline-none"
                    />
                    <input
                      type="number"
                      value={log.totalHours}
                      onChange={(e) => updateLog(log.id, { totalHours: parseFloat(e.target.value) })}
                      placeholder="Total hours..."
                      step="0.5"
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-indigo-500 outline-none"
                    />
                    <select
                      value={log.mood}
                      onChange={(e) => updateLog(log.id, { mood: e.target.value as SleepLog['mood'] })}
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-indigo-500 outline-none"
                    >
                      <option value="terrible">Terrible</option>
                      <option value="poor">Poor</option>
                      <option value="okay">Okay</option>
                      <option value="good">Good</option>
                      <option value="excellent">Excellent</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm text-gray-600 mb-2">Quality: {log.quality}/5</label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map(level => (
                        <button key={level} onClick={() => updateLog(log.id, { quality: level })} className={`w-10 h-10 rounded ${level <= log.quality ? 'bg-indigo-500 text-white' : 'bg-gray-200'}`}>{level}</button>
                      ))}
                    </div>
                  </div>
                  <textarea
                    value={log.notes}
                    onChange={(e) => updateLog(log.id, { notes: e.target.value })}
                    placeholder="Notes..."
                    className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-indigo-500 outline-none mb-2"
                    rows={2}
                  />
                  <div className="flex items-center space-x-4 text-sm">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" checked={log.interrupted} onChange={(e) => updateLog(log.id, { interrupted: e.target.checked })} className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                      <span className="text-gray-700">Interrupted</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" checked={log.dreamRecall} onChange={(e) => updateLog(log.id, { dreamRecall: e.target.checked })} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="text-gray-700">Dream Recall</span>
                    </label>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        {activeTab === 'stats' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-indigo-600">Sleep Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Logs:</span>
                  <span className="font-semibold">{logs.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Hours:</span>
                  <span className="font-semibold">{avgHours}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Quality:</span>
                  <span className="font-semibold">{avgQuality}/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Logs with Interruptions:</span>
                  <span className="font-semibold">{logs.filter(l => l.interrupted).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Logs with Dream Recall:</span>
                  <span className="font-semibold">{logs.filter(l => l.dreamRecall).length}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SleepTrackingHubPage;
