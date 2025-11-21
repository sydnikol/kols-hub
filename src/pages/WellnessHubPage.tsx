import React, { useState, useEffect } from 'react';
import { Heart, Activity, Moon, Smile, Plus, Trash2, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

interface WellnessActivity {
  id: string;
  activity: string;
  type: 'meditation' | 'yoga' | 'exercise' | 'therapy' | 'journaling' | 'breathing' | 'spa' | 'massage' | 'other';
  date: string;
  duration: number; // minutes
  mood: number; // 1-5 before
  moodAfter: number; // 1-5 after
  energy: number; // 1-5
  quality: number; // 1-5
  notes: string;
}

interface SelfCareRoutine {
  id: string;
  name: string;
  category: 'morning' | 'evening' | 'daily' | 'weekly' | 'monthly';
  activities: string[];
  duration: number; // minutes
  lastCompleted?: string;
  streak: number;
  active: boolean;
  notes: string;
}

interface MentalHealthCheck {
  id: string;
  date: string;
  mood: number; // 1-5
  anxiety: number; // 1-5
  stress: number; // 1-5
  sleep: number; // 1-5
  energy: number; // 1-5
  socialConnection: number; // 1-5
  gratitude: string[];
  concerns: string;
  wins: string;
}

const WellnessHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'activities' | 'routines' | 'checkins' | 'stats'>('activities');
  const [activities, setActivities] = useState<WellnessActivity[]>([]);
  const [routines, setRoutines] = useState<SelfCareRoutine[]>([]);
  const [checkIns, setCheckIns] = useState<MentalHealthCheck[]>([]);

  useEffect(() => {
    const savedActivities = localStorage.getItem('wellnessActivities');
    if (savedActivities) setActivities(JSON.parse(savedActivities));
    const savedRoutines = localStorage.getItem('wellnessRoutines');
    if (savedRoutines) setRoutines(JSON.parse(savedRoutines));
    const savedCheckIns = localStorage.getItem('mentalHealthCheckIns');
    if (savedCheckIns) setCheckIns(JSON.parse(savedCheckIns));
  }, []);

  useEffect(() => { localStorage.setItem('wellnessActivities', JSON.stringify(activities)); }, [activities]);
  useEffect(() => { localStorage.setItem('wellnessRoutines', JSON.stringify(routines)); }, [routines]);
  useEffect(() => { localStorage.setItem('mentalHealthCheckIns', JSON.stringify(checkIns)); }, [checkIns]);

  const addActivity = () => {
    const newActivity: WellnessActivity = {
      id: Date.now().toString(),
      activity: '',
      type: 'meditation',
      date: new Date().toISOString().split('T')[0],
      duration: 30,
      mood: 3,
      moodAfter: 3,
      energy: 3,
      quality: 3,
      notes: '',
    };
    setActivities([...activities, newActivity]);
    toast.success('Activity added');
  };

  const updateActivity = (id: string, updates: Partial<WellnessActivity>) => {
    setActivities(activities.map(a => a.id === id ? { ...a, ...updates } : a));
    toast.success('Activity updated');
  };

  const deleteActivity = (id: string) => {
    setActivities(activities.filter(a => a.id !== id));
    toast.success('Activity deleted');
  };

  const addRoutine = () => {
    const newRoutine: SelfCareRoutine = {
      id: Date.now().toString(),
      name: '',
      category: 'daily',
      activities: [],
      duration: 30,
      streak: 0,
      active: true,
      notes: '',
    };
    setRoutines([...routines, newRoutine]);
    toast.success('Routine added');
  };

  const updateRoutine = (id: string, updates: Partial<SelfCareRoutine>) => {
    setRoutines(routines.map(r => r.id === id ? { ...r, ...updates } : r));
    toast.success('Routine updated');
  };

  const deleteRoutine = (id: string) => {
    setRoutines(routines.filter(r => r.id !== id));
    toast.success('Routine deleted');
  };

  const addCheckIn = () => {
    const newCheckIn: MentalHealthCheck = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      mood: 3,
      anxiety: 3,
      stress: 3,
      sleep: 3,
      energy: 3,
      socialConnection: 3,
      gratitude: [],
      concerns: '',
      wins: '',
    };
    setCheckIns([...checkIns, newCheckIn]);
    toast.success('Check-in added');
  };

  const updateCheckIn = (id: string, updates: Partial<MentalHealthCheck>) => {
    setCheckIns(checkIns.map(c => c.id === id ? { ...c, ...updates } : c));
    toast.success('Check-in updated');
  };

  const deleteCheckIn = (id: string) => {
    setCheckIns(checkIns.filter(c => c.id !== id));
    toast.success('Check-in deleted');
  };

  const totalActivities = activities.length;
  const activeRoutines = routines.filter(r => r.active).length;
  const avgMood = checkIns.length > 0 ? (checkIns.reduce((sum, c) => sum + c.mood, 0) / checkIns.length).toFixed(1) : '0';
  const totalMinutes = activities.reduce((sum, a) => sum + a.duration, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 pb-20">
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <Heart className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Wellness Hub</h1>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Activity className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{totalActivities}</div>
            <div className="text-xs opacity-90">Activities</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Moon className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{activeRoutines}</div>
            <div className="text-xs opacity-90">Routines</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Smile className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{avgMood}</div>
            <div className="text-xs opacity-90">Avg Mood</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <TrendingUp className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{totalMinutes}</div>
            <div className="text-xs opacity-90">Minutes</div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="flex overflow-x-auto">
          {[
            { id: 'activities', label: 'Activities', icon: Activity },
            { id: 'routines', label: 'Routines', icon: Moon },
            { id: 'checkins', label: 'Check-ins', icon: Smile },
            { id: 'stats', label: 'Stats', icon: TrendingUp },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-1 min-w-fit px-4 py-3 font-medium text-sm transition-colors ${activeTab === tab.id ? 'text-green-600 border-b-2 border-green-600 bg-green-50' : 'text-gray-600 hover:text-green-600 hover:bg-gray-50'}`}>
              <tab.icon className="w-4 h-4 inline mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {activeTab === 'activities' && (
          <div className="space-y-4">
            <button onClick={addActivity} className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Activity</span>
            </button>
            {activities.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Heart className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No activities yet. Prioritize your wellness!</p>
              </div>
            ) : (
              activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(activity => (
                <div key={activity.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 mr-2">
                      <input type="text" value={activity.activity} onChange={(e) => updateActivity(activity.id, { activity: e.target.value })} placeholder="Activity name..." className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-green-500 outline-none w-full mb-1" />
                      <input type="date" value={activity.date} onChange={(e) => updateActivity(activity.id, { date: e.target.value })} className="text-sm text-gray-600 bg-transparent border-b border-gray-200 focus:border-green-500 outline-none w-full" />
                    </div>
                    <button onClick={() => deleteActivity(activity.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <select value={activity.type} onChange={(e) => updateActivity(activity.id, { type: e.target.value as WellnessActivity['type'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none">
                      <option value="meditation">Meditation</option>
                      <option value="yoga">Yoga</option>
                      <option value="exercise">Exercise</option>
                      <option value="therapy">Therapy</option>
                      <option value="journaling">Journaling</option>
                      <option value="breathing">Breathing</option>
                      <option value="spa">Spa</option>
                      <option value="massage">Massage</option>
                      <option value="other">Other</option>
                    </select>
                    <input type="number" value={activity.duration} onChange={(e) => updateActivity(activity.id, { duration: parseInt(e.target.value) || 0 })} placeholder="Duration (min)..." className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none" />
                  </div>
                  <div className="space-y-2 mb-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Mood Before: {activity.mood}/5</label>
                      <input type="range" min="1" max="5" value={activity.mood} onChange={(e) => updateActivity(activity.id, { mood: parseInt(e.target.value) })} className="w-full" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Mood After: {activity.moodAfter}/5</label>
                      <input type="range" min="1" max="5" value={activity.moodAfter} onChange={(e) => updateActivity(activity.id, { moodAfter: parseInt(e.target.value) })} className="w-full" />
                    </div>
                  </div>
                  <textarea value={activity.notes} onChange={(e) => updateActivity(activity.id, { notes: e.target.value })} placeholder="Notes, reflections..." className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none" rows={2} />
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'routines' && (
          <div className="space-y-4">
            <button onClick={addRoutine} className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Routine</span>
            </button>
            {routines.map(routine => (
              <div key={routine.id} className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${routine.active ? 'border-green-500' : 'border-gray-300'}`}>
                <div className="flex justify-between items-start mb-3">
                  <input type="text" value={routine.name} onChange={(e) => updateRoutine(routine.id, { name: e.target.value })} placeholder="Routine name..." className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-green-500 outline-none flex-1 mr-2" />
                  <button onClick={() => deleteRoutine(routine.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <select value={routine.category} onChange={(e) => updateRoutine(routine.id, { category: e.target.value as SelfCareRoutine['category'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none">
                    <option value="morning">Morning</option>
                    <option value="evening">Evening</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                  <div className="flex items-center space-x-2">
                    <label className="text-sm text-gray-600">Active:</label>
                    <input type="checkbox" checked={routine.active} onChange={(e) => updateRoutine(routine.id, { active: e.target.checked })} className="w-5 h-5" />
                  </div>
                  <input type="number" value={routine.duration} onChange={(e) => updateRoutine(routine.id, { duration: parseInt(e.target.value) || 0 })} placeholder="Duration (min)..." className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none" />
                  <input type="number" value={routine.streak} onChange={(e) => updateRoutine(routine.id, { streak: parseInt(e.target.value) || 0 })} placeholder="Streak..." className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none" />
                </div>
                <textarea value={routine.notes} onChange={(e) => updateRoutine(routine.id, { notes: e.target.value })} placeholder="Notes, steps..." className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none" rows={2} />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'checkins' && (
          <div className="space-y-4">
            <button onClick={addCheckIn} className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Check-in</span>
            </button>
            {checkIns.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(checkIn => (
              <div key={checkIn.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
                <div className="flex justify-between items-start mb-3">
                  <input type="date" value={checkIn.date} onChange={(e) => updateCheckIn(checkIn.id, { date: e.target.value })} className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-green-500 outline-none flex-1 mr-2" />
                  <button onClick={() => deleteCheckIn(checkIn.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-2 mb-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Mood: {checkIn.mood}/5</label>
                    <input type="range" min="1" max="5" value={checkIn.mood} onChange={(e) => updateCheckIn(checkIn.id, { mood: parseInt(e.target.value) })} className="w-full" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Anxiety: {checkIn.anxiety}/5</label>
                    <input type="range" min="1" max="5" value={checkIn.anxiety} onChange={(e) => updateCheckIn(checkIn.id, { anxiety: parseInt(e.target.value) })} className="w-full" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Stress: {checkIn.stress}/5</label>
                    <input type="range" min="1" max="5" value={checkIn.stress} onChange={(e) => updateCheckIn(checkIn.id, { stress: parseInt(e.target.value) })} className="w-full" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Sleep Quality: {checkIn.sleep}/5</label>
                    <input type="range" min="1" max="5" value={checkIn.sleep} onChange={(e) => updateCheckIn(checkIn.id, { sleep: parseInt(e.target.value) })} className="w-full" />
                  </div>
                </div>
                <textarea value={checkIn.wins} onChange={(e) => updateCheckIn(checkIn.id, { wins: e.target.value })} placeholder="Wins today..." className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none mb-2" rows={2} />
                <textarea value={checkIn.concerns} onChange={(e) => updateCheckIn(checkIn.id, { concerns: e.target.value })} placeholder="Concerns..." className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none" rows={2} />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-green-600">Wellness Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Activities:</span>
                  <span className="font-semibold">{totalActivities}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Routines:</span>
                  <span className="font-semibold">{activeRoutines}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Check-ins:</span>
                  <span className="font-semibold">{checkIns.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Mood:</span>
                  <span className="font-semibold">{avgMood}/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Minutes:</span>
                  <span className="font-semibold">{totalMinutes} min</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WellnessHubPage;
