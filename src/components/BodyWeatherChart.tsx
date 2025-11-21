import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, CloudRain, Sun, Wind, Zap } from 'lucide-react';

interface BodyWeatherEntry {
  id: string;
  date: string;
  painLevel: number;
  energyLevel: number;
  moodLevel: number;
  sensoryTolerance: number;
  notes?: string;
  tags?: string[];
  weatherIcon?: string;
}

export const BodyWeatherChart: React.FC = () => {
  const [entries, setEntries] = useState<BodyWeatherEntry[]>([]);
  const [viewMode, setViewMode] = useState<'calendar' | 'graph' | 'patterns'>('calendar');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const db = await openDB();
      const tx = db.transaction('bodyWeather', 'readonly');
      const store = tx.objectStore('bodyWeather');
      const getAllRequest = store.getAll();
      const allEntries = await new Promise<BodyWeatherEntry[]>((resolve, reject) => {
        getAllRequest.onsuccess = () => resolve(getAllRequest.result);
        getAllRequest.onerror = () => reject(getAllRequest.error);
      });
      setEntries(allEntries);
    } catch (error) {
      console.log('No body weather data yet');
    }
  };

  const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('KolHubDB', 1);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('bodyWeather')) {
          db.createObjectStore('bodyWeather', { keyPath: 'id' });
        }
      };
    });
  };

  const getWeatherIcon = (entry: BodyWeatherEntry) => {
    if (entry.painLevel >= 7) return '🌩️'; // Stormy
    if (entry.energyLevel <= 3) return '🌫️'; // Foggy
    if (entry.energyLevel >= 7 && entry.painLevel <= 3) return '☀️'; // Sunny
    if (entry.moodLevel <= 3) return '🌧️'; // Rainy
    if (entry.sensoryTolerance <= 3) return '⚡'; // Electric storm
    return '☁️'; // Cloudy
  };

  const getColorByLevel = (level: number, type: 'pain' | 'energy' | 'mood' | 'sensory') => {
    if (type === 'pain') {
      if (level >= 8) return 'bg-red-700';
      if (level >= 5) return 'bg-orange-600';
      if (level >= 3) return 'bg-indigo-600';
      return 'bg-green-600';
    } else {
      if (level >= 7) return 'bg-green-600';
      if (level >= 5) return 'bg-indigo-600';
      if (level >= 3) return 'bg-orange-600';
      return 'bg-red-700';
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const getEntryForDate = (date: string) => {
    return entries.find(e => e.date === date);
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);
    const days = [];
    
    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="aspect-square"></div>);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const entry = getEntryForDate(dateStr);
      const weatherIcon = entry ? getWeatherIcon(entry) : '';
      const isToday = dateStr === new Date().toISOString().split('T')[0];
      
      days.push(
        <div
          key={day}
          className={`aspect-square border border-purple-500/20 rounded-lg p-2 ${
            isToday ? 'ring-2 ring-purple-400' : ''
          } ${entry ? 'bg-purple-900/40' : 'bg-purple-950/20'} hover:bg-purple-900/60 transition-colors cursor-pointer`}
        >
          <div className="text-purple-200 text-xs mb-1">{day}</div>
          {entry && (
            <>
              <div className="text-2xl mb-1">{weatherIcon}</div>
              <div className="flex gap-1">
                <div className={`w-1 h-4 rounded ${getColorByLevel(entry.painLevel, 'pain')}`} title="Pain"></div>
                <div className={`w-1 h-4 rounded ${getColorByLevel(entry.energyLevel, 'energy')}`} title="Energy"></div>
                <div className={`w-1 h-4 rounded ${getColorByLevel(entry.moodLevel, 'mood')}`} title="Mood"></div>
                <div className={`w-1 h-4 rounded ${getColorByLevel(entry.sensoryTolerance, 'sensory')}`} title="Sensory"></div>
              </div>
            </>
          )}
        </div>
      );
    }
    
    return days;
  };

  const get30DayTrend = () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentEntries = entries
      .filter(e => new Date(e.date) >= thirtyDaysAgo)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    return recentEntries;
  };

  const findPatterns = () => {
    const patterns = [];
    const thirtyDayEntries = get30DayTrend();
    
    // Check for high pain days
    const highPainDays = thirtyDayEntries.filter(e => e.painLevel >= 7);
    if (highPainDays.length > 5) {
      patterns.push({
        type: 'pain',
        icon: '🩹',
        title: 'Frequent High Pain',
        description: `${highPainDays.length} high pain days in the last 30 days`,
        severity: 'high'
      });
    }
    
    // Check for low energy pattern
    const lowEnergyDays = thirtyDayEntries.filter(e => e.energyLevel <= 3);
    if (lowEnergyDays.length > 10) {
      patterns.push({
        type: 'energy',
        icon: '⚡',
        title: 'Low Energy Pattern',
        description: `${lowEnergyDays.length} low energy days detected`,
        severity: 'medium'
      });
    }
    
    // Check for mood dips
    const lowMoodDays = thirtyDayEntries.filter(e => e.moodLevel <= 4);
    if (lowMoodDays.length > 7) {
      patterns.push({
        type: 'mood',
        icon: '💙',
        title: 'Mood Pattern',
        description: `${lowMoodDays.length} low mood days - consider reaching out for support`,
        severity: 'medium'
      });
    }
    
    // Check for sensory overload pattern
    const sensoryIssues = thirtyDayEntries.filter(e => e.sensoryTolerance <= 4);
    if (sensoryIssues.length > 5) {
      patterns.push({
        type: 'sensory',
        icon: '🎧',
        title: 'Sensory Sensitivity',
        description: `${sensoryIssues.length} days with low sensory tolerance`,
        severity: 'low'
      });
    }
    
    return patterns;
  };

  const patterns = findPatterns();
  const trendData = get30DayTrend();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-indigo-950 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-400 mb-2">
            🌤️ Body Weather Chart
          </h1>
          <p className="text-purple-200">Visualize your daily health patterns and body weather</p>
        </div>

        {/* View Toggle */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              viewMode === 'calendar' ? 'bg-purple-600 text-white' : 'bg-purple-950/50 text-purple-300 hover:bg-purple-900/50'
            }`}
          >
            📅 Calendar View
          </button>
          <button
            onClick={() => setViewMode('graph')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              viewMode === 'graph' ? 'bg-purple-600 text-white' : 'bg-purple-950/50 text-purple-300 hover:bg-purple-900/50'
            }`}
          >
            📊 Graph View
          </button>
          <button
            onClick={() => setViewMode('patterns')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              viewMode === 'patterns' ? 'bg-purple-600 text-white' : 'bg-purple-950/50 text-purple-300 hover:bg-purple-900/50'
            }`}
          >
            🔍 Pattern Analysis
          </button>
        </div>

        {/* Calendar View */}
        {viewMode === 'calendar' && (
          <div className="bg-purple-950/30 backdrop-blur-sm rounded-xl p-8 border border-purple-500/30">
            {/* Month Navigation */}
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={() => {
                  const newDate = new Date(currentMonth);
                  newDate.setMonth(newDate.getMonth() - 1);
                  setCurrentMonth(newDate);
                }}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors"
              >
                ← Previous
              </button>
              <h2 className="text-2xl font-bold text-purple-100">
                {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h2>
              <button
                onClick={() => {
                  const newDate = new Date(currentMonth);
                  newDate.setMonth(newDate.getMonth() + 1);
                  setCurrentMonth(newDate);
                }}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors"
              >
                Next →
              </button>
            </div>

            {/* Day Labels */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-purple-300 font-medium py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {renderCalendar()}
            </div>

            {/* Legend */}
            <div className="mt-6 bg-purple-900/30 rounded-lg p-4 border border-purple-500/20">
              <h3 className="text-purple-100 font-bold mb-3">Weather Legend</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                <div className="text-purple-200">☀️ Good day (high energy, low pain)</div>
                <div className="text-purple-200">☁️ Moderate day</div>
                <div className="text-purple-200">🌧️ Low mood day</div>
                <div className="text-purple-200">🌫️ Low energy (foggy)</div>
                <div className="text-purple-200">🌩️ High pain (stormy)</div>
                <div className="text-purple-200">⚡ Sensory overload</div>
              </div>
              <div className="mt-3 pt-3 border-t border-purple-500/20">
                <div className="text-purple-200 text-sm mb-2">Color Bars Legend:</div>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div><div className="w-4 h-4 bg-red-700 rounded inline-block mr-1"></div>Pain</div>
                  <div><div className="w-4 h-4 bg-green-600 rounded inline-block mr-1"></div>Energy</div>
                  <div><div className="w-4 h-4 bg-indigo-600 rounded inline-block mr-1"></div>Mood</div>
                  <div><div className="w-4 h-4 bg-blue-600 rounded inline-block mr-1"></div>Sensory</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Graph View */}
        {viewMode === 'graph' && (
          <div className="bg-purple-950/30 backdrop-blur-sm rounded-xl p-8 border border-purple-500/30">
            <h2 className="text-2xl font-bold text-purple-100 mb-6">30-Day Trend Lines</h2>
            
            {trendData.length > 0 ? (
              <div className="space-y-6">
                {/* Pain Trend */}
                <div>
                  <div className="text-red-300 font-medium mb-2">🩹 Pain Level</div>
                  <div className="h-24 bg-purple-900/30 rounded-lg relative overflow-hidden">
                    {trendData.map((entry, index) => {
                      const height = (entry.painLevel / 10) * 100;
                      const position = (index / trendData.length) * 100;
                      return (
                        <div
                          key={entry.id}
                          className="absolute bottom-0 bg-gradient-to-t from-red-600 to-red-400"
                          style={{
                            left: `${position}%`,
                            width: `${100 / trendData.length}%`,
                            height: `${height}%`
                          }}
                          title={`${entry.date}: ${entry.painLevel}/10`}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Energy Trend */}
                <div>
                  <div className="text-purple-300 font-medium mb-2">⚡ Energy Level</div>
                  <div className="h-24 bg-purple-900/30 rounded-lg relative overflow-hidden">
                    {trendData.map((entry, index) => {
                      const height = (entry.energyLevel / 10) * 100;
                      const position = (index / trendData.length) * 100;
                      return (
                        <div
                          key={entry.id}
                          className="absolute bottom-0 bg-gradient-to-t from-purple-600 to-purple-400"
                          style={{
                            left: `${position}%`,
                            width: `${100 / trendData.length}%`,
                            height: `${height}%`
                          }}
                          title={`${entry.date}: ${entry.energyLevel}/10`}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Mood Trend */}
                <div>
                  <div className="text-purple-300 font-medium mb-2">😊 Mood Level</div>
                  <div className="h-24 bg-purple-900/30 rounded-lg relative overflow-hidden">
                    {trendData.map((entry, index) => {
                      const height = (entry.moodLevel / 10) * 100;
                      const position = (index / trendData.length) * 100;
                      return (
                        <div
                          key={entry.id}
                          className="absolute bottom-0 bg-gradient-to-t from-purple-600 to-purple-400"
                          style={{
                            left: `${position}%`,
                            width: `${100 / trendData.length}%`,
                            height: `${height}%`
                          }}
                          title={`${entry.date}: ${entry.moodLevel}/10`}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Sensory Trend */}
                <div>
                  <div className="text-blue-300 font-medium mb-2">🎧 Sensory Tolerance</div>
                  <div className="h-24 bg-purple-900/30 rounded-lg relative overflow-hidden">
                    {trendData.map((entry, index) => {
                      const height = (entry.sensoryTolerance / 10) * 100;
                      const position = (index / trendData.length) * 100;
                      return (
                        <div
                          key={entry.id}
                          className="absolute bottom-0 bg-gradient-to-t from-blue-600 to-blue-400"
                          style={{
                            left: `${position}%`,
                            width: `${100 / trendData.length}%`,
                            height: `${height}%`
                          }}
                          title={`${entry.date}: ${entry.sensoryTolerance}/10`}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-purple-300 py-12">
                No data yet. Start tracking your body weather in Vitals Tracker!
              </div>
            )}
          </div>
        )}

        {/* Pattern Analysis */}
        {viewMode === 'patterns' && (
          <div className="bg-purple-950/30 backdrop-blur-sm rounded-xl p-8 border border-purple-500/30">
            <h2 className="text-2xl font-bold text-purple-100 mb-6">
              <TrendingUp className="inline mr-2" />
              Pattern Analysis (Last 30 Days)
            </h2>
            
            {patterns.length > 0 ? (
              <div className="space-y-4">
                {patterns.map((pattern, index) => (
                  <div
                    key={index}
                    className={`p-6 rounded-lg border ${
                      pattern.severity === 'high' ? 'bg-red-900/20 border-red-500/30' :
                      pattern.severity === 'medium' ? 'bg-orange-900/20 border-orange-500/30' :
                      'bg-blue-900/20 border-blue-500/30'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{pattern.icon}</div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-purple-100 mb-2">{pattern.title}</h3>
                        <p className="text-purple-200 mb-3">{pattern.description}</p>
                        <div className={`text-sm ${
                          pattern.severity === 'high' ? 'text-red-300' :
                          pattern.severity === 'medium' ? 'text-orange-300' :
                          'text-blue-300'
                        }`}>
                          {pattern.severity === 'high' && '⚠️ High priority - consider medical consultation'}
                          {pattern.severity === 'medium' && '📋 Moderate concern - monitor and adjust routines'}
                          {pattern.severity === 'low' && 'ℹ️ Awareness - note triggers and accommodations'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">✨</div>
                <div className="text-purple-200 text-xl">No significant patterns detected</div>
                <div className="text-purple-300 mt-2">Your metrics look stable!</div>
              </div>
            )}

            {/* Recommendations */}
            <div className="mt-8 bg-purple-900/30 rounded-lg p-6 border border-purple-500/20">
              <h3 className="text-xl font-bold text-purple-100 mb-4">💡 Insights & Tips</h3>
              <ul className="space-y-2 text-purple-200">
                <li>✓ Track daily to identify personal patterns and triggers</li>
                <li>✓ Use weather icons to quickly scan your month at a glance</li>
                <li>✓ Share your body weather chart with healthcare providers</li>
                <li>✓ Notice correlations between activities, weather, and symptoms</li>
                <li>✓ Plan activities around predicted low-energy or high-pain days</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};