import React, { useState, useEffect } from 'react';
import { Activity, Dumbbell, Heart, TrendingUp, Calendar, Plus, Trash2, Star } from 'lucide-react';
import toast from 'react-hot-toast';

interface Workout {
  id: string;
  date: string;
  type: 'cardio' | 'strength' | 'flexibility' | 'sports' | 'walking' | 'other';
  duration: number; // minutes
  intensity: 'light' | 'moderate' | 'vigorous';
  caloriesBurned?: number;
  heartRateAvg?: number;
  exercises: string[];
  mood: 'terrible' | 'poor' | 'okay' | 'good' | 'excellent';
  energyBefore: number; // 1-5
  energyAfter: number; // 1-5
  notes: string;
}

interface FitnessGoal {
  id: string;
  goal: string;
  type: 'frequency' | 'duration' | 'distance' | 'strength' | 'weight' | 'other';
  target: string;
  currentProgress: number;
  targetValue: number;
  deadline?: string;
  active: boolean;
}

interface BodyMetric {
  id: string;
  date: string;
  weight?: number;
  bodyFat?: number;
  muscleMass?: number;
  waist?: number;
  chest?: number;
  arms?: number;
  legs?: number;
  notes: string;
}

const FitnessHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'workouts' | 'goals' | 'metrics' | 'stats'>('workouts');
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [goals, setGoals] = useState<FitnessGoal[]>([]);
  const [metrics, setMetrics] = useState<BodyMetric[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('workouts');
    if (saved) setWorkouts(JSON.parse(saved));
    const savedGoals = localStorage.getItem('fitnessGoals');
    if (savedGoals) setGoals(JSON.parse(savedGoals));
    const savedMetrics = localStorage.getItem('bodyMetrics');
    if (savedMetrics) setMetrics(JSON.parse(savedMetrics));
  }, []);

  useEffect(() => { localStorage.setItem('workouts', JSON.stringify(workouts)); }, [workouts]);
  useEffect(() => { localStorage.setItem('fitnessGoals', JSON.stringify(goals)); }, [goals]);
  useEffect(() => { localStorage.setItem('bodyMetrics', JSON.stringify(metrics)); }, [metrics]);

  const addWorkout = () => {
    const newWorkout: Workout = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      type: 'walking',
      duration: 30,
      intensity: 'moderate',
      exercises: [],
      mood: 'good',
      energyBefore: 3,
      energyAfter: 4,
      notes: '',
    };
    setWorkouts([...workouts, newWorkout]);
    toast.success('Workout logged');
  };

  const updateWorkout = (id: string, updates: Partial<Workout>) => {
    setWorkouts(workouts.map(w => w.id === id ? { ...w, ...updates } : w));
    toast.success('Workout updated');
  };

  const deleteWorkout = (id: string) => {
    setWorkouts(workouts.filter(w => w.id !== id));
    toast.success('Workout deleted');
  };

  const totalWorkouts = workouts.length;
  const totalMinutes = workouts.reduce((sum, w) => sum + w.duration, 0);
  const avgDuration = totalWorkouts ? (totalMinutes / totalWorkouts).toFixed(0) : '0';

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 pb-20">
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <Dumbbell className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Fitness Hub</h1>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Activity className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{totalWorkouts}</div>
            <div className="text-xs opacity-90">Workouts</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <TrendingUp className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{totalMinutes}</div>
            <div className="text-xs opacity-90">Total Min</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Calendar className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{avgDuration}</div>
            <div className="text-xs opacity-90">Avg Min</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Star className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{goals.filter(g => g.active).length}</div>
            <div className="text-xs opacity-90">Goals</div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="flex overflow-x-auto">
          {[
            { id: 'workouts', label: 'Workouts', icon: Dumbbell },
            { id: 'goals', label: 'Goals', icon: Star },
            { id: 'metrics', label: 'Metrics', icon: Heart },
            { id: 'stats', label: 'Stats', icon: TrendingUp },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-1 min-w-fit px-4 py-3 font-medium text-sm transition-colors ${activeTab === tab.id ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50' : 'text-gray-600 hover:text-orange-600 hover:bg-gray-50'}`}>
              <tab.icon className="w-4 h-4 inline mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {activeTab === 'workouts' && (
          <div className="space-y-4">
            <button onClick={addWorkout} className="w-full bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Log Workout</span>
            </button>
            {workouts.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Dumbbell className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No workouts yet. Start tracking your fitness!</p>
              </div>
            ) : (
              workouts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(workout => (
                <div key={workout.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-orange-500">
                  <div className="flex justify-between items-start mb-3">
                    <input type="date" value={workout.date} onChange={(e) => updateWorkout(workout.id, { date: e.target.value })} className="text-lg font-semibold bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-orange-500 outline-none" />
                    <button onClick={() => deleteWorkout(workout.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <select value={workout.type} onChange={(e) => updateWorkout(workout.id, { type: e.target.value as Workout['type'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-orange-500 outline-none">
                      <option value="cardio">Cardio</option>
                      <option value="strength">Strength</option>
                      <option value="flexibility">Flexibility</option>
                      <option value="sports">Sports</option>
                      <option value="walking">Walking</option>
                      <option value="other">Other</option>
                    </select>
                    <select value={workout.intensity} onChange={(e) => updateWorkout(workout.id, { intensity: e.target.value as Workout['intensity'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-orange-500 outline-none">
                      <option value="light">Light</option>
                      <option value="moderate">Moderate</option>
                      <option value="vigorous">Vigorous</option>
                    </select>
                    <input type="number" value={workout.duration} onChange={(e) => updateWorkout(workout.id, { duration: parseInt(e.target.value) })} placeholder="Duration (min)..." className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-orange-500 outline-none" />
                    <select value={workout.mood} onChange={(e) => updateWorkout(workout.id, { mood: e.target.value as Workout['mood'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-orange-500 outline-none">
                      <option value="terrible">Terrible</option>
                      <option value="poor">Poor</option>
                      <option value="okay">Okay</option>
                      <option value="good">Good</option>
                      <option value="excellent">Excellent</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm text-gray-600 mb-2">Energy Before: {workout.energyBefore}/5</label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map(level => (
                        <button key={level} onClick={() => updateWorkout(workout.id, { energyBefore: level })} className={`w-10 h-10 rounded ${level <= workout.energyBefore ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}>{level}</button>
                      ))}
                    </div>
                  </div>
                  <textarea value={workout.notes} onChange={(e) => updateWorkout(workout.id, { notes: e.target.value })} placeholder="Exercises, notes..." className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-orange-500 outline-none" rows={2} />
                </div>
              ))
            )}
          </div>
        )}
        {activeTab === 'stats' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-orange-600">Fitness Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Workouts:</span>
                  <span className="font-semibold">{totalWorkouts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Minutes:</span>
                  <span className="font-semibold">{totalMinutes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Duration:</span>
                  <span className="font-semibold">{avgDuration} min</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FitnessHubPage;
