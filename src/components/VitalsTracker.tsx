import React, { useState, useEffect } from 'react';
import { Activity, Heart, Droplets, Zap, Calendar, TrendingUp, AlertCircle } from 'lucide-react';

interface Vital {
  id: string;
  timestamp: Date;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number;
  energyLevel: number; // 1-10 spoons
  hydrationOz: number;
  sodiumMg: number;
  painLevel: number; // 1-10
  moodLevel: number; // 1-10
  sensoryTolerance: number; // 1-10
  notes?: string;
}

export const VitalsTracker: React.FC = () => {
  const [vitals, setVitals] = useState<Vital[]>([]);
  const [currentVital, setCurrentVital] = useState<Partial<Vital>>({
    energyLevel: 5,
    hydrationOz: 0,
    sodiumMg: 0,
    painLevel: 1,
    moodLevel: 5,
    sensoryTolerance: 5
  });
  const [viewMode, setViewMode] = useState<'log' | 'chart' | 'insights'>('log');

  // Load vitals from IndexedDB
  useEffect(() => {
    const loadVitals = async () => {
      const db = await openDB();
      const tx = db.transaction('vitals', 'readonly');
      const store = tx.objectStore('vitals');
      const allVitals = await store.getAll();
      setVitals(allVitals.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ));
    };
    loadVitals();
  }, []);

  const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('KolHubDB', 1);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('vitals')) {
          db.createObjectStore('vitals', { keyPath: 'id' });
        }
      };
    });
  };

  const saveVital = async () => {
    const newVital: Vital = {
      ...currentVital as Vital,
      id: `vital_${Date.now()}`,
      timestamp: new Date()
    };

    const db = await openDB();
    const tx = db.transaction('vitals', 'readwrite');
    await tx.objectStore('vitals').add(newVital);
    
    setVitals([newVital, ...vitals]);
    
    // Reset form
    setCurrentVital({
      energyLevel: 5,
      hydrationOz: 0,
      sodiumMg: 0,
      painLevel: 1,
      moodLevel: 5,
      sensoryTolerance: 5
    });

    // Check for alerts
    checkAlerts(newVital);
  };

  const checkAlerts = (vital: Vital) => {
    const alerts = [];
    
    if (vital.hydrationOz < 32) {
      alerts.push('💧 Hydration low - drink water!');
    }
    if (vital.sodiumMg < 2000) {
      alerts.push('🧂 Sodium intake low (target: 4000mg/day)');
    }
    if (vital.energyLevel <= 2) {
      alerts.push('⚡ Very low energy - consider resting');
    }
    if (vital.painLevel >= 7) {
      alerts.push('⚠️ High pain level - check medications');
    }
    
    if (alerts.length > 0) {
      alert(alerts.join('\n'));
    }
  };

  const getTodayStats = () => {
    const today = new Date().toDateString();
    const todayVitals = vitals.filter(v => 
      new Date(v.timestamp).toDateString() === today
    );

    return {
      totalHydration: todayVitals.reduce((sum, v) => sum + v.hydrationOz, 0),
      totalSodium: todayVitals.reduce((sum, v) => sum + v.sodiumMg, 0),
      avgEnergy: todayVitals.length > 0 
        ? todayVitals.reduce((sum, v) => sum + v.energyLevel, 0) / todayVitals.length 
        : 0,
      avgPain: todayVitals.length > 0
        ? todayVitals.reduce((sum, v) => sum + v.painLevel, 0) / todayVitals.length
        : 0
    };
  };

  const stats = getTodayStats();

  const getWeekTrends = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const weekVitals = vitals.filter(v => 
      new Date(v.timestamp) >= weekAgo
    );

    const avgEnergy = weekVitals.reduce((sum, v) => sum + v.energyLevel, 0) / weekVitals.length || 0;
    const avgPain = weekVitals.reduce((sum, v) => sum + v.painLevel, 0) / weekVitals.length || 0;
    const avgMood = weekVitals.reduce((sum, v) => sum + v.moodLevel, 0) / weekVitals.length || 0;

    return { avgEnergy, avgPain, avgMood };
  };

  const trends = getWeekTrends();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-indigo-950 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-400 mb-2">
            💜 Vitals Tracker
          </h1>
          <p className="text-purple-200">Track your body weather, energy, and daily health metrics</p>
        </div>

        {/* View Mode Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setViewMode('log')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              viewMode === 'log'
                ? 'bg-purple-600 text-white'
                : 'bg-purple-950/50 text-purple-300 hover:bg-purple-900/50'
            }`}
          >
            📝 Log Entry
          </button>
          <button
            onClick={() => setViewMode('chart')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              viewMode === 'chart'
                ? 'bg-purple-600 text-white'
                : 'bg-purple-950/50 text-purple-300 hover:bg-purple-900/50'
            }`}
          >
            📊 History
          </button>
          <button
            onClick={() => setViewMode('insights')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              viewMode === 'insights'
                ? 'bg-purple-600 text-white'
                : 'bg-purple-950/50 text-purple-300 hover:bg-purple-900/50'
            }`}
          >
            💡 Insights
          </button>
        </div>

        {/* Today's Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 backdrop-blur-sm p-4 rounded-lg border border-blue-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Droplets className="text-blue-400" size={20} />
              <span className="text-blue-300 text-sm">Hydration</span>
            </div>
            <div className="text-2xl font-bold text-blue-100">{stats.totalHydration} oz</div>
            <div className="text-xs text-blue-300 mt-1">Target: 64 oz</div>
          </div>

          <div className="bg-gradient-to-br from-orange-600/20 to-orange-800/20 backdrop-blur-sm p-4 rounded-lg border border-orange-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="text-orange-400" size={20} />
              <span className="text-orange-300 text-sm">Sodium</span>
            </div>
            <div className="text-2xl font-bold text-orange-100">{stats.totalSodium} mg</div>
            <div className="text-xs text-orange-300 mt-1">Target: 4000 mg</div>
          </div>

          <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 backdrop-blur-sm p-4 rounded-lg border border-purple-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="text-purple-400" size={20} />
              <span className="text-purple-300 text-sm">Avg Energy</span>
            </div>
            <div className="text-2xl font-bold text-purple-100">{stats.avgEnergy.toFixed(1)} 🥄</div>
            <div className="text-xs text-purple-300 mt-1">Spoons today</div>
          </div>

          <div className="bg-gradient-to-br from-red-600/20 to-red-800/20 backdrop-blur-sm p-4 rounded-lg border border-red-500/30">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="text-red-400" size={20} />
              <span className="text-red-300 text-sm">Avg Pain</span>
            </div>
            <div className="text-2xl font-bold text-red-100">{stats.avgPain.toFixed(1)}/10</div>
            <div className="text-xs text-red-300 mt-1">Pain level</div>
          </div>
        </div>

        {/* Log Entry View */}
        {viewMode === 'log' && (
          <div className="bg-purple-950/30 backdrop-blur-sm rounded-xl p-8 border border-purple-500/30">
            <h2 className="text-2xl font-bold text-purple-100 mb-6">Log Current Vitals</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Blood Pressure */}
              <div>
                <label className="block text-purple-200 mb-2">
                  <Heart className="inline mr-2" size={18} />
                  Blood Pressure
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Systolic"
                    value={currentVital.bloodPressureSystolic || ''}
                    onChange={(e) => setCurrentVital({...currentVital, bloodPressureSystolic: Number(e.target.value)})}
                    className="flex-1 bg-purple-900/50 border border-purple-500/30 rounded-lg px-4 py-2 text-purple-100"
                  />
                  <span className="text-purple-300 self-center">/</span>
                  <input
                    type="number"
                    placeholder="Diastolic"
                    value={currentVital.bloodPressureDiastolic || ''}
                    onChange={(e) => setCurrentVital({...currentVital, bloodPressureDiastolic: Number(e.target.value)})}
                    className="flex-1 bg-purple-900/50 border border-purple-500/30 rounded-lg px-4 py-2 text-purple-100"
                  />
                </div>
              </div>

              {/* Heart Rate */}
              <div>
                <label className="block text-purple-200 mb-2">
                  <Activity className="inline mr-2" size={18} />
                  Heart Rate (bpm)
                </label>
                <input
                  type="number"
                  value={currentVital.heartRate || ''}
                  onChange={(e) => setCurrentVital({...currentVital, heartRate: Number(e.target.value)})}
                  className="w-full bg-purple-900/50 border border-purple-500/30 rounded-lg px-4 py-2 text-purple-100"
                />
              </div>

              {/* Energy Level (Spoons) */}
              <div>
                <label className="block text-purple-200 mb-2">
                  <Zap className="inline mr-2" size={18} />
                  Energy Level: {currentVital.energyLevel} 🥄
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={currentVital.energyLevel}
                  onChange={(e) => setCurrentVital({...currentVital, energyLevel: Number(e.target.value)})}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-purple-400 mt-1">
                  <span>No spoons</span>
                  <span>Full energy</span>
                </div>
              </div>

              {/* Hydration */}
              <div>
                <label className="block text-purple-200 mb-2">
                  <Droplets className="inline mr-2" size={18} />
                  Hydration (oz)
                </label>
                <input
                  type="number"
                  value={currentVital.hydrationOz}
                  onChange={(e) => setCurrentVital({...currentVital, hydrationOz: Number(e.target.value)})}
                  className="w-full bg-purple-900/50 border border-purple-500/30 rounded-lg px-4 py-2 text-purple-100"
                />
              </div>

              {/* Sodium */}
              <div>
                <label className="block text-purple-200 mb-2">
                  🧂 Sodium Intake (mg)
                </label>
                <input
                  type="number"
                  value={currentVital.sodiumMg}
                  onChange={(e) => setCurrentVital({...currentVital, sodiumMg: Number(e.target.value)})}
                  className="w-full bg-purple-900/50 border border-purple-500/30 rounded-lg px-4 py-2 text-purple-100"
                />
              </div>

              {/* Pain Level */}
              <div>
                <label className="block text-purple-200 mb-2">
                  🩹 Pain Level: {currentVital.painLevel}/10
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={currentVital.painLevel}
                  onChange={(e) => setCurrentVital({...currentVital, painLevel: Number(e.target.value)})}
                  className="w-full"
                />
              </div>

              {/* Mood */}
              <div>
                <label className="block text-purple-200 mb-2">
                  😊 Mood Level: {currentVital.moodLevel}/10
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={currentVital.moodLevel}
                  onChange={(e) => setCurrentVital({...currentVital, moodLevel: Number(e.target.value)})}
                  className="w-full"
                />
              </div>

              {/* Sensory Tolerance */}
              <div>
                <label className="block text-purple-200 mb-2">
                  🎧 Sensory Tolerance: {currentVital.sensoryTolerance}/10
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={currentVital.sensoryTolerance}
                  onChange={(e) => setCurrentVital({...currentVital, sensoryTolerance: Number(e.target.value)})}
                  className="w-full"
                />
              </div>

              {/* Notes */}
              <div className="md:col-span-2">
                <label className="block text-purple-200 mb-2">
                  📝 Notes
                </label>
                <textarea
                  value={currentVital.notes || ''}
                  onChange={(e) => setCurrentVital({...currentVital, notes: e.target.value})}
                  className="w-full bg-purple-900/50 border border-purple-500/30 rounded-lg px-4 py-2 text-purple-100 h-24"
                  placeholder="How are you feeling? Any symptoms or observations?"
                />
              </div>
            </div>

            <button
              onClick={saveVital}
              className="mt-6 w-full bg-gradient-to-r from-purple-600 to-purple-600 hover:from-purple-700 hover:to-purple-700 text-white font-bold py-4 rounded-lg transition-all transform hover:scale-105"
            >
              💾 Save Vitals Entry
            </button>
          </div>
        )}

        {/* History View */}
        {viewMode === 'chart' && (
          <div className="bg-purple-950/30 backdrop-blur-sm rounded-xl p-8 border border-purple-500/30">
            <h2 className="text-2xl font-bold text-purple-100 mb-6">Vitals History</h2>
            
            <div className="space-y-4">
              {vitals.slice(0, 20).map((vital) => (
                <div key={vital.id} className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/20">
                  <div className="flex justify-between items-start mb-3">
                    <div className="text-purple-200">
                      {new Date(vital.timestamp).toLocaleString()}
                    </div>
                    <div className="flex gap-2">
                      <span className="text-xs bg-purple-700/50 px-2 py-1 rounded">
                        ⚡ {vital.energyLevel} spoons
                      </span>
                      <span className="text-xs bg-red-700/50 px-2 py-1 rounded">
                        🩹 Pain: {vital.painLevel}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    {vital.bloodPressureSystolic && (
                      <div className="text-purple-300">
                        <Heart size={14} className="inline mr-1" />
                        {vital.bloodPressureSystolic}/{vital.bloodPressureDiastolic}
                      </div>
                    )}
                    {vital.heartRate && (
                      <div className="text-purple-300">
                        <Activity size={14} className="inline mr-1" />
                        {vital.heartRate} bpm
                      </div>
                    )}
                    <div className="text-blue-300">
                      <Droplets size={14} className="inline mr-1" />
                      {vital.hydrationOz} oz
                    </div>
                    <div className="text-orange-300">
                      🧂 {vital.sodiumMg} mg
                    </div>
                  </div>
                  
                  {vital.notes && (
                    <div className="mt-3 text-purple-200 text-sm italic">
                      "{vital.notes}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Insights View */}
        {viewMode === 'insights' && (
          <div className="bg-purple-950/30 backdrop-blur-sm rounded-xl p-8 border border-purple-500/30">
            <h2 className="text-2xl font-bold text-purple-100 mb-6">
              <TrendingUp className="inline mr-2" />
              7-Day Trends & Insights
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 p-6 rounded-lg border border-purple-500/30">
                <div className="text-purple-300 mb-2">Average Energy</div>
                <div className="text-4xl font-bold text-purple-100 mb-2">
                  {trends.avgEnergy.toFixed(1)} 🥄
                </div>
                <div className="text-sm text-purple-400">
                  {trends.avgEnergy > 6 ? '✨ Good energy week!' : 
                   trends.avgEnergy > 4 ? '📊 Moderate energy' : 
                   '🛏️ Low energy - rest needed'}
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-600/20 to-red-800/20 p-6 rounded-lg border border-red-500/30">
                <div className="text-red-300 mb-2">Average Pain</div>
                <div className="text-4xl font-bold text-red-100 mb-2">
                  {trends.avgPain.toFixed(1)}/10
                </div>
                <div className="text-sm text-red-400">
                  {trends.avgPain < 4 ? '✅ Low pain week' : 
                   trends.avgPain < 7 ? '⚠️ Moderate pain' : 
                   '🚨 High pain - check with doctor'}
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 p-6 rounded-lg border border-purple-500/30">
                <div className="text-purple-300 mb-2">Average Mood</div>
                <div className="text-4xl font-bold text-purple-100 mb-2">
                  {trends.avgMood.toFixed(1)}/10
                </div>
                <div className="text-sm text-purple-400">
                  {trends.avgMood > 7 ? '💖 Great mood!' : 
                   trends.avgMood > 5 ? '😊 Stable mood' : 
                   '💙 Low mood - reach out for support'}
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-500/20">
              <h3 className="text-xl font-bold text-purple-100 mb-4">💡 Personalized Recommendations</h3>
              
              <div className="space-y-3">
                {stats.totalHydration < 48 && (
                  <div className="flex items-start gap-3 p-3 bg-blue-900/30 rounded-lg">
                    <Droplets className="text-blue-400 mt-1" size={20} />
                    <div>
                      <div className="font-medium text-blue-200">Increase hydration</div>
                      <div className="text-sm text-blue-300">Try to drink at least 64 oz of water daily, especially with POTS</div>
                    </div>
                  </div>
                )}
                
                {stats.totalSodium < 3000 && (
                  <div className="flex items-start gap-3 p-3 bg-orange-900/30 rounded-lg">
                    <Activity className="text-orange-400 mt-1" size={20} />
                    <div>
                      <div className="font-medium text-orange-200">Boost sodium intake</div>
                      <div className="text-sm text-orange-300">Target 4000mg/day for POTS management. Try salty snacks or electrolyte drinks.</div>
                    </div>
                  </div>
                )}
                
                {trends.avgEnergy < 5 && (
                  <div className="flex items-start gap-3 p-3 bg-purple-900/30 rounded-lg">
                    <Zap className="text-purple-400 mt-1" size={20} />
                    <div>
                      <div className="font-medium text-purple-200">Low energy pattern detected</div>
                      <div className="text-sm text-purple-300">Consider adjusting routine, adding rest periods, or checking medications</div>
                    </div>
                  </div>
                )}
                
                {trends.avgPain > 6 && (
                  <div className="flex items-start gap-3 p-3 bg-red-900/30 rounded-lg">
                    <AlertCircle className="text-red-400 mt-1" size={20} />
                    <div>
                      <div className="font-medium text-red-200">Persistent high pain</div>
                      <div className="text-sm text-red-300">Talk to your doctor about pain management options</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};