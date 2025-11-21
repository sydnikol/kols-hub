import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplets, Plus, Minus, Target, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

interface HydrationEntry {
  timestamp: number;
  amount: number; // in liters
  note?: string;
}

const HydrationDial: React.FC = () => {
  const [currentLiters, setCurrentLiters] = useState<number>(0);
  const [goalLiters, setGoalLiters] = useState<number>(2.5);
  const [history, setHistory] = useState<HydrationEntry[]>([]);
  const [quickAmount, setQuickAmount] = useState<number>(0.25);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('hydration-data');
    if (stored) {
      const data = JSON.parse(stored);
      setCurrentLiters(data.currentLiters || 0);
      setGoalLiters(data.goalLiters || 2.5);
      setHistory(data.history || []);
    }
  }, []);

  // Save to localStorage
  const saveData = (current: number, goal: number, hist: HydrationEntry[]) => {
    localStorage.setItem('hydration-data', JSON.stringify({
      currentLiters: current,
      goalLiters: goal,
      history: hist,
      lastUpdated: Date.now(),
    }));
  };

  const addWater = (amount: number) => {
    const newTotal = Math.min(currentLiters + amount, goalLiters + 2); // Max 2L over goal
    const entry: HydrationEntry = {
      timestamp: Date.now(),
      amount,
    };
    const newHistory = [...history, entry];
    setCurrentLiters(newTotal);
    setHistory(newHistory);
    saveData(newTotal, goalLiters, newHistory);
    toast.success(`Added ${amount}L of water!`);

    if (newTotal >= goalLiters) {
      toast.success('🎉 Hydration goal reached!', { duration: 4000 });
    }
  };

  const removeWater = (amount: number) => {
    const newTotal = Math.max(currentLiters - amount, 0);
    setCurrentLiters(newTotal);
    saveData(newTotal, goalLiters, history);
    toast.success(`Removed ${amount}L`);
  };

  const resetDay = () => {
    setCurrentLiters(0);
    setHistory([]);
    saveData(0, goalLiters, []);
    toast.success('Hydration reset for new day!');
  };

  const percentage = Math.min((currentLiters / goalLiters) * 100, 100);
  const isGoalReached = currentLiters >= goalLiters;

  // Calculate stroke dashoffset for animated circle
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 p-6 rounded-xl border border-blue-500/30"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Droplets className="w-6 h-6 text-blue-400" />
          <h2 className="text-2xl font-bold text-white">Hydration Tracker</h2>
        </div>
        <button
          onClick={resetDay}
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          Reset Day
        </button>
      </div>

      {/* Animated Dial */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative w-64 h-64 mb-4">
          {/* Background Circle */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="128"
              cy="128"
              r={radius}
              stroke="rgba(59, 130, 246, 0.2)"
              strokeWidth="16"
              fill="none"
            />
            {/* Animated Progress Circle */}
            <circle
              cx="128"
              cy="128"
              r={radius}
              stroke={isGoalReached ? '#10b981' : '#3b82f6'}
              strokeWidth="16"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
              style={{
                filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.6))',
              }}
            />
          </svg>

          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-5xl font-bold text-white mb-1">
              {currentLiters.toFixed(2)}
            </div>
            <div className="text-blue-400 text-sm mb-2">liters</div>
            <div className="flex items-center gap-2 text-blue-300 text-xs">
              <Target className="w-3 h-3" />
              <span>Goal: {goalLiters}L</span>
            </div>
            <div className={`text-lg font-bold mt-2 ${isGoalReached ? 'text-green-400' : 'text-blue-400'}`}>
              {percentage.toFixed(0)}%
            </div>
          </div>
        </div>

        {/* Status Badge */}
        {isGoalReached && (
          <div className="flex items-center gap-2 bg-green-500/20 text-green-300 px-4 py-2 rounded-lg border border-green-500/30 mb-4">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-bold">Goal Reached!</span>
          </div>
        )}
      </div>

      {/* Quick Add Buttons */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {[0.25, 0.5, 0.75, 1.0].map((amount) => (
          <motion.button
            key={amount}
            onClick={() => addWater(amount)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 font-bold py-3 px-4 rounded-lg transition-all"
          >
            +{amount}L
          </motion.button>
        ))}
      </div>

      {/* Custom Amount */}
      <div className="bg-black/40 p-4 rounded-lg border border-blue-500/20 mb-4">
        <label className="block text-blue-300 text-sm font-semibold mb-2">
          Custom Amount
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            step="0.1"
            min="0"
            max="2"
            value={quickAmount}
            onChange={(e) => setQuickAmount(parseFloat(e.target.value) || 0)}
            className="flex-1 bg-black/40 border border-blue-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500/60"
            placeholder="0.25"
          />
          <button
            onClick={() => addWater(quickAmount)}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
          <button
            onClick={() => removeWater(quickAmount)}
            className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Goal Adjustment */}
      <div className="bg-black/40 p-4 rounded-lg border border-blue-500/20 mb-4">
        <label className="block text-blue-300 text-sm font-semibold mb-2">
          Daily Goal
        </label>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const newGoal = Math.max(goalLiters - 0.5, 0.5);
              setGoalLiters(newGoal);
              saveData(currentLiters, newGoal, history);
            }}
            className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 font-bold px-4 py-2 rounded-lg transition-colors"
          >
            -0.5L
          </button>
          <div className="flex-1 text-center">
            <span className="text-2xl font-bold text-white">{goalLiters}L</span>
          </div>
          <button
            onClick={() => {
              const newGoal = Math.min(goalLiters + 0.5, 5);
              setGoalLiters(newGoal);
              saveData(currentLiters, newGoal, history);
            }}
            className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 font-bold px-4 py-2 rounded-lg transition-colors"
          >
            +0.5L
          </button>
        </div>
      </div>

      {/* Today's History */}
      <div className="bg-black/40 p-4 rounded-lg border border-blue-500/20">
        <h3 className="text-blue-300 text-sm font-semibold mb-3">Today's History</h3>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {history.length > 0 ? (
            history.slice().reverse().slice(0, 10).map((entry, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-sm bg-blue-900/20 p-2 rounded"
              >
                <span className="text-blue-400">
                  {new Date(entry.timestamp).toLocaleTimeString()}
                </span>
                <span className="text-white font-bold">+{entry.amount}L</span>
              </div>
            ))
          ) : (
            <div className="text-center text-blue-400 text-sm py-4">
              No water logged yet today. Start hydrating!
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="bg-black/40 p-3 rounded-lg border border-blue-500/20 text-center">
          <div className="text-blue-400 text-xs mb-1">Today's Drinks</div>
          <div className="text-xl font-bold text-white">{history.length}</div>
        </div>
        <div className="bg-black/40 p-3 rounded-lg border border-blue-500/20 text-center">
          <div className="text-blue-400 text-xs mb-1">Remaining</div>
          <div className="text-xl font-bold text-white">
            {Math.max(goalLiters - currentLiters, 0).toFixed(2)}L
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HydrationDial;
