import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Cloud, CloudRain, Zap, Wind, Snowflake, Calendar, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

type WeatherStatus = 'sunny' | 'partly-cloudy' | 'cloudy' | 'rainy' | 'stormy' | 'foggy';

interface WeatherEntry {
  timestamp: number;
  status: WeatherStatus;
  energy: number; // 1-10
  pain: number; // 1-10
  mood: number; // 1-10
  notes?: string;
}

const weatherOptions: Array<{
  status: WeatherStatus;
  icon: any;
  label: string;
  color: string;
  bgColor: string;
  description: string;
}> = [
  {
    status: 'sunny',
    icon: Sun,
    label: 'Sunny',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/20 border-yellow-500/50',
    description: 'Feeling great! High energy, low pain',
  },
  {
    status: 'partly-cloudy',
    icon: Cloud,
    label: 'Partly Cloudy',
    color: 'text-blue-300',
    bgColor: 'bg-blue-500/20 border-blue-500/50',
    description: 'Doing okay. Some fatigue or mild symptoms',
  },
  {
    status: 'cloudy',
    icon: Wind,
    label: 'Cloudy',
    color: 'text-gray-400',
    bgColor: 'bg-gray-500/20 border-gray-500/50',
    description: 'Not great. Low energy, moderate pain',
  },
  {
    status: 'rainy',
    icon: CloudRain,
    label: 'Rainy',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20 border-purple-500/50',
    description: 'Struggling. High pain or fatigue',
  },
  {
    status: 'stormy',
    icon: Zap,
    label: 'Stormy',
    color: 'text-red-400',
    bgColor: 'bg-red-500/20 border-red-500/50',
    description: 'Crisis mode. Severe symptoms or flare',
  },
  {
    status: 'foggy',
    icon: Snowflake,
    label: 'Foggy',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/20 border-cyan-500/50',
    description: 'Brain fog, dissociation, or sensory issues',
  },
];

const BodyWeatherDial: React.FC = () => {
  const [currentStatus, setCurrentStatus] = useState<WeatherStatus>('partly-cloudy');
  const [energy, setEnergy] = useState<number>(5);
  const [pain, setPain] = useState<number>(5);
  const [mood, setMood] = useState<number>(5);
  const [notes, setNotes] = useState<string>('');
  const [history, setHistory] = useState<WeatherEntry[]>([]);
  const [showDetails, setShowDetails] = useState<boolean>(false);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('body-weather-data');
    if (stored) {
      const data = JSON.parse(stored);
      setCurrentStatus(data.currentStatus || 'partly-cloudy');
      setEnergy(data.energy || 5);
      setPain(data.pain || 5);
      setMood(data.mood || 5);
      setHistory(data.history || []);
    }
  }, []);

  // Save to localStorage
  const saveData = (status: WeatherStatus, e: number, p: number, m: number, hist: WeatherEntry[]) => {
    localStorage.setItem('body-weather-data', JSON.stringify({
      currentStatus: status,
      energy: e,
      pain: p,
      mood: m,
      history: hist,
      lastUpdated: Date.now(),
    }));
  };

  const updateWeather = (status: WeatherStatus) => {
    const entry: WeatherEntry = {
      timestamp: Date.now(),
      status,
      energy,
      pain,
      mood,
      notes,
    };
    const newHistory = [...history, entry];
    setCurrentStatus(status);
    setHistory(newHistory);
    setNotes('');
    saveData(status, energy, pain, mood, newHistory);

    const option = weatherOptions.find(o => o.status === status);
    toast.success(`Body weather updated to ${option?.label}`);
  };

  const currentWeather = weatherOptions.find(o => o.status === currentStatus) || weatherOptions[1];
  const Icon = currentWeather.icon;

  // Get trend
  const recentEntries = history.slice(-5);
  const avgEnergy = recentEntries.length > 0 ? recentEntries.reduce((sum, e) => sum + e.energy, 0) / recentEntries.length : energy;
  const trend = energy > avgEnergy ? 'improving' : energy < avgEnergy ? 'declining' : 'stable';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 p-6 rounded-xl border border-indigo-500/30"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Body Weather</h2>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          {showDetails ? 'Hide' : 'Show'} Details
        </button>
      </div>

      {/* Current Status Display */}
      <div className={`relative overflow-hidden rounded-xl border-2 p-8 mb-6 ${currentWeather.bgColor}`}>
        <div className="relative z-10 flex flex-col items-center">
          <Icon className={`w-24 h-24 mb-4 ${currentWeather.color}`} strokeWidth={1.5} />
          <h3 className={`text-3xl font-bold mb-2 ${currentWeather.color}`}>
            {currentWeather.label}
          </h3>
          <p className="text-white/80 text-center max-w-xs">
            {currentWeather.description}
          </p>

          {/* Trend Indicator */}
          <div className={`mt-4 flex items-center gap-2 px-3 py-1 rounded-lg ${
            trend === 'improving' ? 'bg-green-500/20 text-green-300' :
            trend === 'declining' ? 'bg-red-500/20 text-red-300' :
            'bg-gray-500/20 text-gray-300'
          }`}>
            <TrendingUp className={`w-4 h-4 ${trend === 'declining' ? 'transform rotate-180' : ''}`} />
            <span className="text-xs font-bold capitalize">{trend}</span>
          </div>
        </div>

        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent animate-pulse" />
        </div>
      </div>

      {/* Weather Selection Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        {weatherOptions.map((option) => {
          const OptionIcon = option.icon;
          const isSelected = currentStatus === option.status;
          return (
            <motion.button
              key={option.status}
              onClick={() => updateWeather(option.status)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative overflow-hidden p-4 rounded-lg border-2 transition-all ${
                isSelected
                  ? `${option.bgColor} shadow-lg`
                  : 'bg-black/40 border-white/10 hover:border-white/30'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <OptionIcon className={`w-8 h-8 ${isSelected ? option.color : 'text-white/60'}`} />
                <span className={`text-sm font-bold ${isSelected ? option.color : 'text-white/60'}`}>
                  {option.label}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Detailed Metrics */}
      {showDetails && (
        <div className="space-y-4 mb-6">
          {/* Energy Level */}
          <div className="bg-black/40 p-4 rounded-lg border border-indigo-500/20">
            <label className="block text-indigo-300 text-sm font-semibold mb-2">
              Energy Level: <span className="text-white">{energy}/10</span>
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={energy}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setEnergy(val);
                saveData(currentStatus, val, pain, mood, history);
              }}
              className="w-full h-2 bg-black/40 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #10b981 0%, #10b981 ${energy * 10}%, #1f2937 ${energy * 10}%, #1f2937 100%)`,
              }}
            />
            <div className="flex justify-between text-xs text-indigo-400 mt-1">
              <span>Exhausted</span>
              <span>Energized</span>
            </div>
          </div>

          {/* Pain Level */}
          <div className="bg-black/40 p-4 rounded-lg border border-indigo-500/20">
            <label className="block text-indigo-300 text-sm font-semibold mb-2">
              Pain Level: <span className="text-white">{pain}/10</span>
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={pain}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setPain(val);
                saveData(currentStatus, energy, val, mood, history);
              }}
              className="w-full h-2 bg-black/40 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #ef4444 0%, #ef4444 ${pain * 10}%, #1f2937 ${pain * 10}%, #1f2937 100%)`,
              }}
            />
            <div className="flex justify-between text-xs text-indigo-400 mt-1">
              <span>No Pain</span>
              <span>Severe</span>
            </div>
          </div>

          {/* Mood */}
          <div className="bg-black/40 p-4 rounded-lg border border-indigo-500/20">
            <label className="block text-indigo-300 text-sm font-semibold mb-2">
              Mood: <span className="text-white">{mood}/10</span>
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={mood}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setMood(val);
                saveData(currentStatus, energy, pain, val, history);
              }}
              className="w-full h-2 bg-black/40 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #a78bfa 0%, #a78bfa ${mood * 10}%, #1f2937 ${mood * 10}%, #1f2937 100%)`,
              }}
            />
            <div className="flex justify-between text-xs text-indigo-400 mt-1">
              <span>Low</span>
              <span>Great</span>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-black/40 p-4 rounded-lg border border-indigo-500/20">
            <label className="block text-indigo-300 text-sm font-semibold mb-2">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-black/40 border border-indigo-500/30 rounded-lg px-4 py-2 text-white placeholder-indigo-400/50 focus:outline-none focus:border-indigo-500/60"
              placeholder="What's contributing to your current state?"
              rows={3}
            />
          </div>
        </div>
      )}

      {/* Recent History */}
      <div className="bg-black/40 p-4 rounded-lg border border-indigo-500/20">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-indigo-400" />
          <h3 className="text-indigo-300 text-sm font-semibold">Recent Check-Ins</h3>
        </div>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {history.length > 0 ? (
            history.slice().reverse().slice(0, 10).map((entry, idx) => {
              const weather = weatherOptions.find(o => o.status === entry.status);
              const WeatherIcon = weather?.icon || Cloud;
              return (
                <div
                  key={idx}
                  className="flex items-center gap-3 bg-indigo-900/20 p-3 rounded"
                >
                  <WeatherIcon className={`w-6 h-6 ${weather?.color || 'text-white'}`} />
                  <div className="flex-1">
                    <div className="text-white text-sm font-semibold">{weather?.label}</div>
                    <div className="text-indigo-400 text-xs">
                      {new Date(entry.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-xs text-right">
                    <div className="text-green-400">E: {entry.energy}/10</div>
                    <div className="text-red-400">P: {entry.pain}/10</div>
                    <div className="text-purple-400">M: {entry.mood}/10</div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-indigo-400 text-sm py-4">
              No check-ins yet. Select your body weather above!
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="mt-4 bg-purple-900/20 border border-purple-500/30 rounded-lg p-3">
        <p className="text-purple-300 text-xs">
          <span className="font-bold">Body Weather:</span> Track how you're feeling throughout the day. This helps identify patterns and communicate your needs to caregivers and healthcare providers.
        </p>
      </div>
    </motion.div>
  );
};

export default BodyWeatherDial;
