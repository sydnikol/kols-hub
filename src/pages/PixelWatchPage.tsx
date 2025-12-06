import React, { useState, useEffect } from 'react';
import { PixelWatchDashboard } from '../components/wearos/PixelWatchDashboard';

// Types for health data
interface HealthMetric {
  label: string;
  value: number;
  unit: string;
  change: number;
  status: 'good' | 'warning' | 'critical';
}

interface WorkoutSession {
  id: string;
  type: string;
  duration: number;
  calories: number;
  heartRateAvg: number;
  heartRateMax: number;
  timestamp: Date;
  distance?: number;
}

interface SleepData {
  date: string;
  totalSleep: number;
  deepSleep: number;
  lightSleep: number;
  remSleep: number;
  awake: number;
  quality: number;
}

interface HeartRateZone {
  zone: string;
  min: number;
  max: number;
  duration: number;
  percentage: number;
  color: string;
}

type TabType = 'health' | 'sync' | 'workout' | 'sleep' | 'zones';

const PixelWatchPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('health');
  const [isConnected, setIsConnected] = useState(true);
  const [syncStatus, setSyncStatus] = useState<'syncing' | 'synced' | 'error'>('synced');
  const [lastSync, setLastSync] = useState(new Date());

  // Sample health metrics data
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([
    { label: 'Heart Rate', value: 72, unit: 'bpm', change: -3, status: 'good' },
    { label: 'Steps Today', value: 8234, unit: 'steps', change: 12, status: 'good' },
    { label: 'Calories Burned', value: 1847, unit: 'kcal', change: 8, status: 'good' },
    { label: 'Active Minutes', value: 45, unit: 'min', change: 15, status: 'good' },
    { label: 'Distance', value: 5.8, unit: 'km', change: 10, status: 'good' },
    { label: 'Blood Oxygen', value: 98, unit: '%', change: 0, status: 'good' },
  ]);

  // Sample workout data
  const [workouts, setWorkouts] = useState<WorkoutSession[]>([
    {
      id: '1',
      type: 'Running',
      duration: 35,
      calories: 342,
      heartRateAvg: 145,
      heartRateMax: 168,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      distance: 5.2,
    },
    {
      id: '2',
      type: 'Cycling',
      duration: 48,
      calories: 428,
      heartRateAvg: 132,
      heartRateMax: 155,
      timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000),
      distance: 12.4,
    },
    {
      id: '3',
      type: 'Strength Training',
      duration: 42,
      calories: 287,
      heartRateAvg: 118,
      heartRateMax: 142,
      timestamp: new Date(Date.now() - 50 * 60 * 60 * 1000),
    },
  ]);

  // Sample sleep data
  const [sleepData, setSleepData] = useState<SleepData[]>([
    { date: 'Last Night', totalSleep: 7.5, deepSleep: 1.8, lightSleep: 4.2, remSleep: 1.3, awake: 0.2, quality: 87 },
    { date: '2 Days Ago', totalSleep: 6.8, deepSleep: 1.5, lightSleep: 3.9, remSleep: 1.2, awake: 0.2, quality: 78 },
    { date: '3 Days Ago', totalSleep: 8.2, deepSleep: 2.1, lightSleep: 4.5, remSleep: 1.4, awake: 0.2, quality: 92 },
  ]);

  // Sample heart rate zones
  const [heartRateZones, setHeartRateZones] = useState<HeartRateZone[]>([
    { zone: 'Rest', min: 50, max: 100, duration: 1020, percentage: 71, color: 'from-blue-500 to-cyan-500' },
    { zone: 'Fat Burn', min: 100, max: 120, duration: 180, percentage: 12, color: 'from-green-500 to-emerald-500' },
    { zone: 'Cardio', min: 120, max: 140, duration: 120, percentage: 8, color: 'from-yellow-500 to-orange-500' },
    { zone: 'Peak', min: 140, max: 180, duration: 90, percentage: 6, color: 'from-red-500 to-pink-500' },
    { zone: 'Max', min: 180, max: 200, duration: 30, percentage: 2, color: 'from-purple-500 to-fuchsia-500' },
  ]);

  // Simulate live sync
  useEffect(() => {
    const interval = setInterval(() => {
      if (isConnected && Math.random() > 0.7) {
        setSyncStatus('syncing');
        setTimeout(() => {
          setSyncStatus('synced');
          setLastSync(new Date());
          // Simulate minor metric updates
          setHealthMetrics(prev => prev.map(metric => ({
            ...metric,
            value: metric.label === 'Heart Rate'
              ? Math.floor(70 + Math.random() * 10)
              : metric.value + Math.floor(Math.random() * 5),
          })));
        }, 1500);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [isConnected]);

  const handleManualSync = () => {
    setSyncStatus('syncing');
    setTimeout(() => {
      setSyncStatus('synced');
      setLastSync(new Date());
    }, 2000);
  };

  const renderHealthMetrics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {healthMetrics.map((metric, idx) => (
          <div key={idx} className="bg-purple-900/20 p-6 rounded-xl border border-purple-500/30 hover:border-purple-400/50 transition-all">
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-purple-300 font-medium">{metric.label}</h4>
              {metric.change !== 0 && (
                <span className={`text-xs ${metric.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {metric.change > 0 ? '+' : ''}{metric.change}%
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">{metric.value}</span>
              <span className="text-purple-400 text-sm">{metric.unit}</span>
            </div>
            <div className="mt-3 h-1 bg-purple-950 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                style={{ width: `${Math.min(metric.value / (metric.label === 'Steps Today' ? 100 : 1), 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 p-6 rounded-xl border border-purple-500/30">
        <h3 className="text-xl font-bold text-purple-300 mb-4">Today's Progress</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-purple-300">Daily Step Goal</span>
              <span className="text-white font-bold">{healthMetrics[1].value} / 10,000</span>
            </div>
            <div className="h-2 bg-purple-950 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all"
                style={{ width: `${(healthMetrics[1].value / 10000) * 100}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-purple-300">Active Minutes Goal</span>
              <span className="text-white font-bold">{healthMetrics[3].value} / 60</span>
            </div>
            <div className="h-2 bg-purple-950 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all"
                style={{ width: `${(healthMetrics[3].value / 60) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLiveSync = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 p-6 rounded-xl border border-indigo-500/30">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-indigo-300">Connection Status</h3>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
            <span className="text-white font-medium">{isConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-indigo-950/50 p-4 rounded-lg">
            <div className="text-indigo-400 text-sm mb-1">Last Sync</div>
            <div className="text-white font-bold">{lastSync.toLocaleTimeString()}</div>
          </div>
          <div className="bg-indigo-950/50 p-4 rounded-lg">
            <div className="text-indigo-400 text-sm mb-1">Sync Status</div>
            <div className="text-white font-bold capitalize">{syncStatus}</div>
          </div>
        </div>
        <button
          onClick={handleManualSync}
          disabled={syncStatus === 'syncing'}
          className="mt-4 w-full px-6 py-3 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 rounded-lg border border-indigo-500/30 transition-colors disabled:opacity-50"
        >
          {syncStatus === 'syncing' ? 'Syncing...' : 'Manual Sync'}
        </button>
      </div>

      <div className="bg-purple-900/20 p-6 rounded-xl border border-purple-500/30">
        <h3 className="text-xl font-bold text-purple-300 mb-4">Sync Settings</h3>
        <div className="space-y-3">
          {['Heart Rate', 'Steps', 'Calories', 'Sleep Data', 'Workouts', 'Blood Oxygen'].map((setting, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-purple-950/30 rounded-lg">
              <span className="text-purple-300">{setting}</span>
              <label className="relative inline-block w-12 h-6">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-full h-full bg-purple-950 peer-checked:bg-purple-500 rounded-full transition-colors cursor-pointer" />
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-6 transition-transform" />
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderWorkoutTracking = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 p-6 rounded-xl border border-orange-500/30">
        <h3 className="text-xl font-bold text-orange-300 mb-4">Recent Workouts</h3>
        <div className="space-y-4">
          {workouts.map((workout) => (
            <div key={workout.id} className="bg-orange-950/30 p-4 rounded-lg border border-orange-500/20 hover:border-orange-400/40 transition-all">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-white font-bold text-lg">{workout.type}</h4>
                  <p className="text-orange-400 text-sm">{workout.timestamp.toLocaleString()}</p>
                </div>
                <span className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-sm">
                  {workout.duration} min
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-orange-950/50 p-3 rounded">
                  <div className="text-orange-400 text-xs mb-1">Calories</div>
                  <div className="text-white font-bold">{workout.calories}</div>
                </div>
                <div className="bg-orange-950/50 p-3 rounded">
                  <div className="text-orange-400 text-xs mb-1">Avg HR</div>
                  <div className="text-white font-bold">{workout.heartRateAvg} bpm</div>
                </div>
                <div className="bg-orange-950/50 p-3 rounded">
                  <div className="text-orange-400 text-xs mb-1">Max HR</div>
                  <div className="text-white font-bold">{workout.heartRateMax} bpm</div>
                </div>
                {workout.distance && (
                  <div className="bg-orange-950/50 p-3 rounded">
                    <div className="text-orange-400 text-xs mb-1">Distance</div>
                    <div className="text-white font-bold">{workout.distance} km</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-red-900/20 p-4 rounded-xl border border-red-500/30">
          <div className="text-red-400 text-sm mb-1">Total Workouts</div>
          <div className="text-white text-2xl font-bold">{workouts.length}</div>
        </div>
        <div className="bg-orange-900/20 p-4 rounded-xl border border-orange-500/30">
          <div className="text-orange-400 text-sm mb-1">Total Duration</div>
          <div className="text-white text-2xl font-bold">{workouts.reduce((acc, w) => acc + w.duration, 0)} min</div>
        </div>
        <div className="bg-yellow-900/20 p-4 rounded-xl border border-yellow-500/30">
          <div className="text-yellow-400 text-sm mb-1">Total Calories</div>
          <div className="text-white text-2xl font-bold">{workouts.reduce((acc, w) => acc + w.calories, 0)} kcal</div>
        </div>
      </div>
    </div>
  );

  const renderSleepAnalysis = () => (
    <div className="space-y-6">
      {sleepData.map((sleep, idx) => (
        <div key={idx} className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 p-6 rounded-xl border border-blue-500/30">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-blue-300">{sleep.date}</h3>
            <div className="flex items-center gap-2">
              <span className="text-blue-400 text-sm">Quality Score:</span>
              <span className="text-2xl font-bold text-white">{sleep.quality}%</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
            <div className="bg-blue-950/50 p-3 rounded-lg">
              <div className="text-blue-400 text-xs mb-1">Total Sleep</div>
              <div className="text-white font-bold">{sleep.totalSleep}h</div>
            </div>
            <div className="bg-indigo-950/50 p-3 rounded-lg">
              <div className="text-indigo-400 text-xs mb-1">Deep Sleep</div>
              <div className="text-white font-bold">{sleep.deepSleep}h</div>
            </div>
            <div className="bg-purple-950/50 p-3 rounded-lg">
              <div className="text-purple-400 text-xs mb-1">Light Sleep</div>
              <div className="text-white font-bold">{sleep.lightSleep}h</div>
            </div>
            <div className="bg-pink-950/50 p-3 rounded-lg">
              <div className="text-pink-400 text-xs mb-1">REM Sleep</div>
              <div className="text-white font-bold">{sleep.remSleep}h</div>
            </div>
            <div className="bg-red-950/50 p-3 rounded-lg">
              <div className="text-red-400 text-xs mb-1">Awake</div>
              <div className="text-white font-bold">{sleep.awake}h</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex h-8 rounded-lg overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-indigo-600 flex items-center justify-center text-xs text-white font-medium"
                style={{ width: `${(sleep.deepSleep / sleep.totalSleep) * 100}%` }}
              >
                Deep
              </div>
              <div
                className="bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center text-xs text-white font-medium"
                style={{ width: `${(sleep.lightSleep / sleep.totalSleep) * 100}%` }}
              >
                Light
              </div>
              <div
                className="bg-gradient-to-r from-pink-500 to-pink-600 flex items-center justify-center text-xs text-white font-medium"
                style={{ width: `${(sleep.remSleep / sleep.totalSleep) * 100}%` }}
              >
                REM
              </div>
              <div
                className="bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center text-xs text-white font-medium"
                style={{ width: `${(sleep.awake / sleep.totalSleep) * 100}%` }}
              >
                Awake
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 p-6 rounded-xl border border-cyan-500/30">
        <h3 className="text-xl font-bold text-cyan-300 mb-4">Sleep Insights</h3>
        <ul className="space-y-2 text-cyan-300">
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">✓</span>
            <span>Your average sleep quality is above recommended levels</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">✓</span>
            <span>Deep sleep duration is optimal for recovery</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-400 mt-1">!</span>
            <span>Try maintaining a consistent sleep schedule</span>
          </li>
        </ul>
      </div>
    </div>
  );

  const renderHeartRateZones = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-red-900/30 to-pink-900/30 p-6 rounded-xl border border-red-500/30">
        <h3 className="text-xl font-bold text-red-300 mb-6">Heart Rate Zones (Last 24 Hours)</h3>
        <div className="space-y-4">
          {heartRateZones.map((zone, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="text-white font-bold w-32">{zone.zone}</span>
                  <span className="text-gray-400 text-sm">{zone.min} - {zone.max} bpm</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-white font-medium">{zone.duration} min</span>
                  <span className="text-gray-400">({zone.percentage}%)</span>
                </div>
              </div>
              <div className="h-4 bg-gray-900 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${zone.color} transition-all duration-500`}
                  style={{ width: `${zone.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-pink-900/30 to-purple-900/30 p-6 rounded-xl border border-pink-500/30">
          <h3 className="text-xl font-bold text-pink-300 mb-4">Zone Recommendations</h3>
          <div className="space-y-3 text-pink-300">
            <div className="p-3 bg-pink-950/30 rounded-lg">
              <div className="font-bold mb-1">Rest Zone</div>
              <div className="text-sm text-pink-400">Normal daily activities and recovery</div>
            </div>
            <div className="p-3 bg-green-950/30 rounded-lg">
              <div className="font-bold mb-1">Fat Burn Zone</div>
              <div className="text-sm text-green-400">Optimal for weight loss and endurance</div>
            </div>
            <div className="p-3 bg-yellow-950/30 rounded-lg">
              <div className="font-bold mb-1">Cardio Zone</div>
              <div className="text-sm text-yellow-400">Improves cardiovascular fitness</div>
            </div>
            <div className="p-3 bg-red-950/30 rounded-lg">
              <div className="font-bold mb-1">Peak Zone</div>
              <div className="text-sm text-red-400">High-intensity training benefits</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 p-6 rounded-xl border border-purple-500/30">
          <h3 className="text-xl font-bold text-purple-300 mb-4">Weekly Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-purple-950/30 rounded-lg">
              <span className="text-purple-300">Resting Heart Rate</span>
              <span className="text-white font-bold">62 bpm</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-950/30 rounded-lg">
              <span className="text-purple-300">Max Heart Rate</span>
              <span className="text-white font-bold">178 bpm</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-950/30 rounded-lg">
              <span className="text-purple-300">Avg Active HR</span>
              <span className="text-white font-bold">128 bpm</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-950/30 rounded-lg">
              <span className="text-purple-300">Time in Target Zone</span>
              <span className="text-white font-bold">210 min</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const tabs: { id: TabType; label: string }[] = [
    { id: 'health', label: 'Health Metrics' },
    { id: 'sync', label: 'Live Sync' },
    { id: 'workout', label: 'Workout Tracking' },
    { id: 'sleep', label: 'Sleep Analysis' },
    { id: 'zones', label: 'Heart Rate Zones' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-indigo-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Pixel Watch 2 Integration
          </h1>
          <p className="text-purple-400">
            Monitor your health data, sync notifications, and control your watch from KOL Hub
          </p>
        </div>

        <PixelWatchDashboard />

        {/* Tabs Navigation */}
        <div className="mt-8 bg-purple-900/20 p-2 rounded-xl border border-purple-500/30 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'text-purple-300 hover:bg-purple-800/30'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'health' && renderHealthMetrics()}
          {activeTab === 'sync' && renderLiveSync()}
          {activeTab === 'workout' && renderWorkoutTracking()}
          {activeTab === 'sleep' && renderSleepAnalysis()}
          {activeTab === 'zones' && renderHeartRateZones()}
        </div>
      </div>
    </div>
  );
};

export default PixelWatchPage;
