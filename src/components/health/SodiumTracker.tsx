import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Plus, Minus, Target, AlertCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface SodiumEntry {
  timestamp: number;
  amount: number; // in grams
  source?: string;
}

const SodiumTracker: React.FC = () => {
  const [currentGrams, setCurrentGrams] = useState<number>(0);
  const [goalGrams] = useState<number>(4.0); // 4g goal for POTS
  const [history, setHistory] = useState<SodiumEntry[]>([]);
  const [quickAmount, setQuickAmount] = useState<number>(0.5);
  const [source, setSource] = useState<string>('');

  // Common sodium sources
  const commonSources = [
    { name: 'Salt packet', amount: 0.5 },
    { name: 'Electrolyte drink', amount: 0.3 },
    { name: 'Salty snack', amount: 0.4 },
    { name: 'Canned soup', amount: 1.0 },
    { name: 'Pickle', amount: 0.3 },
    { name: 'Salted nuts', amount: 0.2 },
  ];

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('sodium-data');
    if (stored) {
      const data = JSON.parse(stored);
      const today = new Date().toDateString();
      const lastUpdated = data.lastUpdated ? new Date(data.lastUpdated).toDateString() : null;

      // Reset if it's a new day
      if (lastUpdated !== today) {
        setCurrentGrams(0);
        setHistory([]);
      } else {
        setCurrentGrams(data.currentGrams || 0);
        setHistory(data.history || []);
      }
    }
  }, []);

  // Save to localStorage
  const saveData = (current: number, hist: SodiumEntry[]) => {
    localStorage.setItem('sodium-data', JSON.stringify({
      currentGrams: current,
      history: hist,
      lastUpdated: Date.now(),
    }));
  };

  const addSodium = (amount: number, sourceName?: string) => {
    const newTotal = Math.min(currentGrams + amount, 10); // Max 10g
    const entry: SodiumEntry = {
      timestamp: Date.now(),
      amount,
      source: sourceName || source,
    };
    const newHistory = [...history, entry];
    setCurrentGrams(newTotal);
    setHistory(newHistory);
    setSource('');
    saveData(newTotal, newHistory);

    if (sourceName) {
      toast.success(`Added ${amount}g from ${sourceName}`);
    } else {
      toast.success(`Added ${amount}g of sodium`);
    }

    if (newTotal >= goalGrams && currentGrams < goalGrams) {
      toast.success('🎯 Sodium goal reached!', { duration: 4000 });
    }
  };

  const removeSodium = (amount: number) => {
    const newTotal = Math.max(currentGrams - amount, 0);
    setCurrentGrams(newTotal);
    saveData(newTotal, history);
    toast.success(`Removed ${amount}g`);
  };

  const resetDay = () => {
    setCurrentGrams(0);
    setHistory([]);
    saveData(0, []);
    toast.success('Sodium tracking reset for new day!');
  };

  const percentage = Math.min((currentGrams / goalGrams) * 100, 100);
  const isGoalReached = currentGrams >= goalGrams;
  const isLow = currentGrams < goalGrams * 0.5;
  const remaining = Math.max(goalGrams - currentGrams, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-orange-900/30 to-red-900/30 p-6 rounded-xl border border-orange-500/30"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Flame className="w-6 h-6 text-orange-400" />
          <h2 className="text-2xl font-bold text-white">Sodium Tracker</h2>
        </div>
        <button
          onClick={resetDay}
          className="text-sm text-orange-400 hover:text-orange-300 transition-colors"
        >
          Reset Day
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-orange-300 text-sm font-semibold">
            {currentGrams.toFixed(1)}g / {goalGrams}g
          </span>
          <span className={`text-sm font-bold ${isGoalReached ? 'text-green-400' : 'text-orange-400'}`}>
            {percentage.toFixed(0)}%
          </span>
        </div>

        <div className="relative h-8 bg-black/40 rounded-lg overflow-hidden border border-orange-500/30">
          <div
            className={`absolute inset-y-0 left-0 transition-all duration-1000 ease-out ${
              isGoalReached ? 'bg-gradient-to-r from-green-600 to-green-400' :
              isLow ? 'bg-gradient-to-r from-red-600 to-orange-500' :
              'bg-gradient-to-r from-orange-600 to-orange-400'
            }`}
            style={{ width: `${percentage}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </div>

          {/* Goal Line */}
          <div className="absolute inset-y-0 left-0 border-l-2 border-white/50 border-dashed" style={{ left: '100%' }} />
        </div>

        {/* Status Message */}
        <div className="mt-3 flex items-start gap-2">
          {isGoalReached ? (
            <>
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-green-300 text-sm">
                <span className="font-bold">Goal reached!</span> You've met your daily sodium target for POTS management.
              </p>
            </>
          ) : isLow ? (
            <>
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-300 text-sm">
                <span className="font-bold">Low sodium!</span> You need <span className="font-bold">{remaining.toFixed(1)}g</span> more to reach your {goalGrams}g goal.
              </p>
            </>
          ) : (
            <>
              <Target className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
              <p className="text-orange-300 text-sm">
                You need <span className="font-bold">{remaining.toFixed(1)}g</span> more to reach your daily goal.
              </p>
            </>
          )}
        </div>
      </div>

      {/* Quick Add from Common Sources */}
      <div className="bg-black/40 p-4 rounded-lg border border-orange-500/20 mb-4">
        <h3 className="text-orange-300 text-sm font-semibold mb-3">Quick Add</h3>
        <div className="grid grid-cols-2 gap-2">
          {commonSources.map((item) => (
            <motion.button
              key={item.name}
              onClick={() => addSodium(item.amount, item.name)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 text-orange-300 font-semibold py-2 px-3 rounded-lg transition-all text-left"
            >
              <div className="text-xs">{item.name}</div>
              <div className="text-lg font-bold">{item.amount}g</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Custom Amount */}
      <div className="bg-black/40 p-4 rounded-lg border border-orange-500/20 mb-4">
        <label className="block text-orange-300 text-sm font-semibold mb-2">
          Custom Entry
        </label>
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="bg-black/40 border border-orange-500/30 rounded-lg px-4 py-2 text-white placeholder-orange-400/50 focus:outline-none focus:border-orange-500/60"
            placeholder="Food source (optional)"
          />
          <div className="flex gap-2">
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={quickAmount}
              onChange={(e) => setQuickAmount(parseFloat(e.target.value) || 0)}
              className="flex-1 bg-black/40 border border-orange-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500/60"
              placeholder="0.5"
            />
            <button
              onClick={() => addSodium(quickAmount)}
              className="bg-orange-600 hover:bg-orange-500 text-white font-bold px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
            <button
              onClick={() => removeSodium(quickAmount)}
              className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <Minus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Today's History */}
      <div className="bg-black/40 p-4 rounded-lg border border-orange-500/20">
        <h3 className="text-orange-300 text-sm font-semibold mb-3">Today's Log</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {history.length > 0 ? (
            history.slice().reverse().map((entry, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-sm bg-orange-900/20 p-3 rounded"
              >
                <div className="flex-1">
                  <div className="text-white font-semibold">
                    {entry.source || 'Sodium intake'}
                  </div>
                  <div className="text-orange-400 text-xs">
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </div>
                </div>
                <div className="text-orange-300 font-bold text-lg">
                  +{entry.amount}g
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-orange-400 text-sm py-4">
              No sodium logged yet today. Start tracking!
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        <div className="bg-black/40 p-3 rounded-lg border border-orange-500/20 text-center">
          <div className="text-orange-400 text-xs mb-1">Entries</div>
          <div className="text-xl font-bold text-white">{history.length}</div>
        </div>
        <div className="bg-black/40 p-3 rounded-lg border border-orange-500/20 text-center">
          <div className="text-orange-400 text-xs mb-1">Remaining</div>
          <div className="text-xl font-bold text-white">{remaining.toFixed(1)}g</div>
        </div>
        <div className="bg-black/40 p-3 rounded-lg border border-orange-500/20 text-center">
          <div className="text-orange-400 text-xs mb-1">Goal</div>
          <div className="text-xl font-bold text-white">{goalGrams}g</div>
        </div>
      </div>

      {/* POTS Info */}
      <div className="mt-4 bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
        <p className="text-blue-300 text-xs">
          <span className="font-bold">POTS Management:</span> A daily sodium intake of 4-6g helps increase blood volume and manage symptoms. Combine with adequate hydration for best results.
        </p>
      </div>
    </motion.div>
  );
};

export default SodiumTracker;
