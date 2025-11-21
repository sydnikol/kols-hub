import React, { useState, useEffect } from 'react';
import { CheckCircle, Calendar, TrendingUp, Flame, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Habit {
  id: string;
  name: string;
  category: 'health' | 'productivity' | 'mindfulness' | 'social' | 'learning' | 'creative' | 'other';
  frequency: 'daily' | 'weekly' | 'monthly';
  targetDays: number;
  currentStreak: number;
  longestStreak: number;
  completedDates: string[];
  active: boolean;
  notes: string;
}

const HabitsHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'habits' | 'stats'>('habits');
  const [habits, setHabits] = useState<Habit[]>([]);
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const savedHabits = localStorage.getItem('habits');
    if (savedHabits) setHabits(JSON.parse(savedHabits));
  }, []);

  useEffect(() => { localStorage.setItem('habits', JSON.stringify(habits)); }, [habits]);

  const addHabit = () => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      name: '',
      category: 'health',
      frequency: 'daily',
      targetDays: 30,
      currentStreak: 0,
      longestStreak: 0,
      completedDates: [],
      active: true,
      notes: '',
    };
    setHabits([...habits, newHabit]);
    toast.success('Habit added');
  };

  const updateHabit = (id: string, updates: Partial<Habit>) => {
    setHabits(habits.map(h => h.id === id ? { ...h, ...updates } : h));
    toast.success('Habit updated');
  };

  const deleteHabit = (id: string) => {
    setHabits(habits.filter(h => h.id !== id));
    toast.success('Habit deleted');
  };

  const toggleHabitToday = (id: string) => {
    const habit = habits.find(h => h.id === id);
    if (!habit) return;

    const isCompletedToday = habit.completedDates.includes(today);
    const newCompletedDates = isCompletedToday
      ? habit.completedDates.filter(d => d !== today)
      : [...habit.completedDates, today].sort();

    const newStreak = calculateStreak(newCompletedDates);
    const newLongestStreak = Math.max(habit.longestStreak, newStreak);

    updateHabit(id, {
      completedDates: newCompletedDates,
      currentStreak: newStreak,
      longestStreak: newLongestStreak,
    });

    toast.success(isCompletedToday ? 'Unmarked for today' : 'Completed for today!');
  };

  const calculateStreak = (dates: string[]): number => {
    if (dates.length === 0) return 0;
    const sortedDates = [...dates].sort().reverse();
    let streak = 1;
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < sortedDates.length - 1; i++) {
      const current = new Date(sortedDates[i]);
      const next = new Date(sortedDates[i + 1]);
      const diffDays = Math.floor((current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const activeHabits = habits.filter(h => h.active).length;
  const totalCompletions = habits.reduce((sum, h) => sum + h.completedDates.length, 0);
  const avgStreak = habits.length > 0 ? (habits.reduce((sum, h) => sum + h.currentStreak, 0) / habits.length).toFixed(1) : '0';
  const longestStreak = Math.max(...habits.map(h => h.longestStreak), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 pb-20">
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <CheckCircle className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Habits Hub</h1>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <CheckCircle className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{activeHabits}</div>
            <div className="text-xs opacity-90">Active</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Calendar className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{totalCompletions}</div>
            <div className="text-xs opacity-90">Total</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <TrendingUp className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{avgStreak}</div>
            <div className="text-xs opacity-90">Avg Streak</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Flame className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{longestStreak}</div>
            <div className="text-xs opacity-90">Longest</div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="flex overflow-x-auto">
          {[
            { id: 'habits', label: 'Habits', icon: CheckCircle },
            { id: 'stats', label: 'Stats', icon: TrendingUp },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-1 min-w-fit px-4 py-3 font-medium text-sm transition-colors ${activeTab === tab.id ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50' : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'}`}>
              <tab.icon className="w-4 h-4 inline mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {activeTab === 'habits' && (
          <div className="space-y-4">
            <button onClick={addHabit} className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Habit</span>
            </button>
            {habits.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <CheckCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No habits yet. Start building better habits!</p>
              </div>
            ) : (
              habits.filter(h => h.active).map(habit => {
                const isCompletedToday = habit.completedDates.includes(today);
                return (
                  <div key={habit.id} className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${isCompletedToday ? 'border-emerald-500' : 'border-gray-300'}`}>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1 mr-2">
                        <input type="text" value={habit.name} onChange={(e) => updateHabit(habit.id, { name: e.target.value })} placeholder="Habit name..." className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-emerald-500 outline-none w-full mb-2" />
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Flame className="w-4 h-4 text-orange-500" />
                            <span>{habit.currentStreak} day streak</span>
                          </div>
                          <div>Best: {habit.longestStreak} days</div>
                        </div>
                      </div>
                      <button onClick={() => deleteHabit(habit.id)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <select value={habit.category} onChange={(e) => updateHabit(habit.id, { category: e.target.value as Habit['category'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-emerald-500 outline-none">
                        <option value="health">Health</option>
                        <option value="productivity">Productivity</option>
                        <option value="mindfulness">Mindfulness</option>
                        <option value="social">Social</option>
                        <option value="learning">Learning</option>
                        <option value="creative">Creative</option>
                        <option value="other">Other</option>
                      </select>
                      <select value={habit.frequency} onChange={(e) => updateHabit(habit.id, { frequency: e.target.value as Habit['frequency'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-emerald-500 outline-none">
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                    <button onClick={() => toggleHabitToday(habit.id)} className={`w-full py-2 rounded-lg font-medium transition-colors ${isCompletedToday ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                      {isCompletedToday ? '✓ Completed Today' : 'Mark as Complete'}
                    </button>
                    <textarea value={habit.notes} onChange={(e) => updateHabit(habit.id, { notes: e.target.value })} placeholder="Notes..." className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-emerald-500 outline-none mt-3" rows={2} />
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-emerald-600">Habit Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Habits:</span>
                  <span className="font-semibold">{habits.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Habits:</span>
                  <span className="font-semibold">{activeHabits}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Completions:</span>
                  <span className="font-semibold">{totalCompletions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Streak:</span>
                  <span className="font-semibold">{avgStreak} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Longest Streak:</span>
                  <span className="font-semibold">{longestStreak} days</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HabitsHubPage;
