import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Utensils,
  Bed,
  ShowerHead,
  Shirt,
  ChefHat,
  UtensilsCrossed,
  Home,
  Hammer,
  Building2,
  Users,
  Briefcase,
  Dumbbell,
  Car,
  ShoppingBag,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Calendar,
  Heart,
  Moon,
  Sparkles,
  Zap,
  RefreshCcw,
  History,
  Gift,
  Battery,
  BatteryWarning,
  BatteryLow,
  Clock,
  Plus,
  Minus,
  ChevronDown,
  ChevronUp,
  Info,
  Flame,
} from 'lucide-react';
import toast from 'react-hot-toast';

// Import spoon theory config
import { SPOON_THEORY_CONFIG } from '../../data/sydney-complete-health-profile';

// Activity definitions with icons and categories
const ACTIVITIES = [
  { id: 'bed', name: 'Getting out of bed', spoons: 1, icon: Bed, category: 'basics' },
  { id: 'shower', name: 'Showering', spoons: 2, icon: ShowerHead, category: 'basics' },
  { id: 'dressed', name: 'Getting dressed', spoons: 1, icon: Shirt, category: 'basics' },
  { id: 'prep-meal', name: 'Preparing meal', spoons: 2, icon: ChefHat, category: 'food' },
  { id: 'eat-meal', name: 'Eating meal', spoons: 1, icon: UtensilsCrossed, category: 'food' },
  { id: 'light-housework', name: 'Light housework', spoons: 2, icon: Home, category: 'home' },
  { id: 'heavy-housework', name: 'Heavy housework', spoons: 3, icon: Hammer, category: 'home' },
  { id: 'appointment', name: 'Going to appointment', spoons: 3, icon: Building2, category: 'external' },
  { id: 'social-light', name: 'Social activity (light)', spoons: 2, icon: Users, category: 'social' },
  { id: 'social-moderate', name: 'Social activity (moderate)', spoons: 3, icon: Users, category: 'social' },
  { id: 'social-intense', name: 'Social activity (intense)', spoons: 4, icon: Users, category: 'social' },
  { id: 'work', name: 'Work/Study (per hour)', spoons: 1, icon: Briefcase, category: 'work' },
  { id: 'exercise-light', name: 'Exercise (light)', spoons: 2, icon: Dumbbell, category: 'physical' },
  { id: 'exercise-moderate', name: 'Exercise (moderate)', spoons: 4, icon: Dumbbell, category: 'physical' },
  { id: 'driving', name: 'Driving', spoons: 2, icon: Car, category: 'external' },
  { id: 'errands', name: 'Running errands', spoons: 3, icon: ShoppingBag, category: 'external' },
];

const CATEGORY_COLORS: Record<string, string> = {
  basics: 'text-blue-400 border-blue-500/50 bg-blue-500/10',
  food: 'text-green-400 border-green-500/50 bg-green-500/10',
  home: 'text-yellow-400 border-yellow-500/50 bg-yellow-500/10',
  external: 'text-orange-400 border-orange-500/50 bg-orange-500/10',
  social: 'text-pink-400 border-pink-500/50 bg-pink-500/10',
  work: 'text-cyan-400 border-cyan-500/50 bg-cyan-500/10',
  physical: 'text-red-400 border-red-500/50 bg-red-500/10',
};

interface SpoonEntry {
  id: string;
  timestamp: number;
  activity: string;
  spoons: number;
  notes?: string;
}

interface BorrowedSpoon {
  id: string;
  timestamp: number;
  source: string;
  spoons: number;
  notes?: string;
}

interface DayData {
  date: string;
  maxSpoons: number;
  usedSpoons: number;
  isFlareDay: boolean;
  entries: SpoonEntry[];
  borrowedSpoons: BorrowedSpoon[];
  postExertionalNotes?: string;
  crashPredicted?: boolean;
}

interface SpoonHistoryDay {
  date: string;
  maxSpoons: number;
  usedSpoons: number;
  isFlareDay: boolean;
  borrowedCount: number;
  didCrash: boolean;
}

const SpoonTracker: React.FC = () => {
  const [maxSpoons, setMaxSpoons] = useState(SPOON_THEORY_CONFIG.maxSpoons || 12);
  const [baseMaxSpoons, setBaseMaxSpoons] = useState(SPOON_THEORY_CONFIG.maxSpoons || 12);
  const [isFlareDay, setIsFlareDay] = useState(false);
  const [entries, setEntries] = useState<SpoonEntry[]>([]);
  const [borrowedSpoons, setBorrowedSpoons] = useState<BorrowedSpoon[]>([]);
  const [postExertionalNotes, setPostExertionalNotes] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<SpoonHistoryDay[]>([]);
  const [showActivities, setShowActivities] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [borrowSource, setBorrowSource] = useState('');
  const [borrowAmount, setBorrowAmount] = useState(1);
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [customActivityName, setCustomActivityName] = useState('');
  const [customActivitySpoons, setCustomActivitySpoons] = useState(1);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [lastResetDate, setLastResetDate] = useState<string>('');

  // Calculate used spoons
  const usedSpoons = useMemo(() => {
    return entries.reduce((sum, entry) => sum + entry.spoons, 0);
  }, [entries]);

  // Calculate borrowed spoons total
  const borrowedTotal = useMemo(() => {
    return borrowedSpoons.reduce((sum, b) => sum + b.spoons, 0);
  }, [borrowedSpoons]);

  // Calculate remaining spoons
  const remainingSpoons = useMemo(() => {
    return maxSpoons + borrowedTotal - usedSpoons;
  }, [maxSpoons, borrowedTotal, usedSpoons]);

  // Crash prediction
  const crashRisk = useMemo(() => {
    const percentUsed = (usedSpoons / (maxSpoons + borrowedTotal)) * 100;
    if (remainingSpoons <= 0) return 'critical';
    if (remainingSpoons <= 2 || percentUsed >= 80) return 'high';
    if (remainingSpoons <= 4 || percentUsed >= 60) return 'moderate';
    return 'low';
  }, [remainingSpoons, usedSpoons, maxSpoons, borrowedTotal]);

  // Get today's date string
  const getTodayString = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Check for midnight reset
  useEffect(() => {
    const checkMidnightReset = () => {
      const today = getTodayString();
      if (lastResetDate && lastResetDate !== today) {
        // Save yesterday's data to history
        const yesterdayData: SpoonHistoryDay = {
          date: lastResetDate,
          maxSpoons,
          usedSpoons,
          isFlareDay,
          borrowedCount: borrowedTotal,
          didCrash: crashRisk === 'critical',
        };
        const newHistory = [...history, yesterdayData].slice(-30); // Keep 30 days
        setHistory(newHistory);
        localStorage.setItem('spoon-tracker-history', JSON.stringify(newHistory));

        // Reset for new day
        setEntries([]);
        setBorrowedSpoons([]);
        setIsFlareDay(false);
        setMaxSpoons(baseMaxSpoons);
        setPostExertionalNotes('');
        toast.success('New day, new spoons! Your energy has been reset.');
      }
      setLastResetDate(today);
    };

    checkMidnightReset();
    const interval = setInterval(checkMidnightReset, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [lastResetDate, maxSpoons, usedSpoons, isFlareDay, borrowedTotal, crashRisk, history, baseMaxSpoons]);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('spoon-tracker-data');
    const storedHistory = localStorage.getItem('spoon-tracker-history');

    if (stored) {
      try {
        const data = JSON.parse(stored);
        const today = getTodayString();

        if (data.date === today) {
          setMaxSpoons(data.maxSpoons ?? SPOON_THEORY_CONFIG.maxSpoons);
          setBaseMaxSpoons(data.baseMaxSpoons ?? SPOON_THEORY_CONFIG.maxSpoons);
          setIsFlareDay(data.isFlareDay ?? false);
          setEntries(data.entries ?? []);
          setBorrowedSpoons(data.borrowedSpoons ?? []);
          setPostExertionalNotes(data.postExertionalNotes ?? '');
          setLastResetDate(data.date);
        } else {
          setLastResetDate(today);
          setBaseMaxSpoons(data.baseMaxSpoons ?? SPOON_THEORY_CONFIG.maxSpoons);
        }
      } catch (e) {
        console.error('Error loading spoon data:', e);
      }
    }

    if (storedHistory) {
      try {
        setHistory(JSON.parse(storedHistory));
      } catch (e) {
        console.error('Error loading spoon history:', e);
      }
    }
  }, []);

  // Save to localStorage
  const saveData = () => {
    const data: DayData = {
      date: getTodayString(),
      maxSpoons,
      usedSpoons,
      isFlareDay,
      entries,
      borrowedSpoons,
      postExertionalNotes,
      crashPredicted: crashRisk === 'high' || crashRisk === 'critical',
    };
    localStorage.setItem('spoon-tracker-data', JSON.stringify({
      ...data,
      baseMaxSpoons,
    }));
  };

  useEffect(() => {
    saveData();
  }, [entries, borrowedSpoons, isFlareDay, maxSpoons, postExertionalNotes, baseMaxSpoons]);

  // Toggle flare day
  const toggleFlareDay = () => {
    const newFlareState = !isFlareDay;
    setIsFlareDay(newFlareState);
    if (newFlareState) {
      setMaxSpoons(Math.max(1, baseMaxSpoons + SPOON_THEORY_CONFIG.flareAdjustment));
      toast('Flare day mode activated. Take it easy today.', { icon: '💜' });
    } else {
      setMaxSpoons(baseMaxSpoons);
      toast.success('Flare day mode deactivated.');
    }
  };

  // Use spoons for activity
  const useSpoons = (activity: typeof ACTIVITIES[0]) => {
    if (remainingSpoons < activity.spoons) {
      toast.error(`Not enough spoons! You need ${activity.spoons} but only have ${remainingSpoons}.`);
      return;
    }

    const entry: SpoonEntry = {
      id: `entry-${Date.now()}`,
      timestamp: Date.now(),
      activity: activity.name,
      spoons: activity.spoons,
    };

    setEntries([...entries, entry]);

    // Supportive messages based on remaining
    const newRemaining = remainingSpoons - activity.spoons;
    if (newRemaining <= 2 && newRemaining > 0) {
      toast('Running low on spoons. Consider resting soon.', { icon: '💜' });
    } else if (newRemaining <= 0) {
      toast('You\'ve used all your spoons. Rest is important and valid.', { icon: '🌙' });
    } else {
      toast.success(`${activity.name} logged (${activity.spoons} spoons)`);
    }
  };

  // Add custom activity
  const addCustomActivity = () => {
    if (!customActivityName.trim()) {
      toast.error('Please enter an activity name.');
      return;
    }
    if (remainingSpoons < customActivitySpoons) {
      toast.error(`Not enough spoons!`);
      return;
    }

    const entry: SpoonEntry = {
      id: `entry-${Date.now()}`,
      timestamp: Date.now(),
      activity: customActivityName,
      spoons: customActivitySpoons,
    };

    setEntries([...entries, entry]);
    setCustomActivityName('');
    setCustomActivitySpoons(1);
    setShowCustomModal(false);
    toast.success(`${customActivityName} logged (${customActivitySpoons} spoons)`);
  };

  // Borrow spoons
  const borrowSpoon = () => {
    if (!borrowSource.trim()) {
      toast.error('Please enter who/what is lending you energy.');
      return;
    }

    const borrowed: BorrowedSpoon = {
      id: `borrow-${Date.now()}`,
      timestamp: Date.now(),
      source: borrowSource,
      spoons: borrowAmount,
    };

    setBorrowedSpoons([...borrowedSpoons, borrowed]);
    setBorrowSource('');
    setBorrowAmount(1);
    setShowBorrowModal(false);
    toast('Borrowed spoons received! Remember: borrowed energy comes with interest.', { icon: '🥄' });
  };

  // Undo last entry
  const undoLastEntry = () => {
    if (entries.length === 0) return;
    const newEntries = [...entries];
    const removed = newEntries.pop();
    setEntries(newEntries);
    if (removed) {
      toast.success(`Removed "${removed.activity}" (+${removed.spoons} spoons back)`);
    }
  };

  // Update base max spoons
  const updateBaseMaxSpoons = (delta: number) => {
    const newBase = Math.max(1, Math.min(20, baseMaxSpoons + delta));
    setBaseMaxSpoons(newBase);
    if (!isFlareDay) {
      setMaxSpoons(newBase);
    } else {
      setMaxSpoons(Math.max(1, newBase + SPOON_THEORY_CONFIG.flareAdjustment));
    }
  };

  // Render spoon icons
  const renderSpoons = () => {
    const spoons = [];
    const total = maxSpoons + borrowedTotal;

    for (let i = 0; i < total; i++) {
      const isUsed = i < usedSpoons;
      const isBorrowed = i >= maxSpoons;

      spoons.push(
        <motion.div
          key={i}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: i * 0.03 }}
          className={`relative ${isUsed ? 'opacity-30' : ''}`}
        >
          <Utensils
            className={`w-6 h-6 ${
              isBorrowed
                ? 'text-amber-400'
                : isUsed
                ? 'text-gray-500'
                : 'text-purple-400'
            } ${isUsed ? 'line-through' : ''}`}
          />
          {isUsed && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-0.5 bg-gray-500 rotate-45" />
            </div>
          )}
        </motion.div>
      );
    }

    return spoons;
  };

  // Get battery icon based on remaining
  const getBatteryIcon = () => {
    const percent = (remainingSpoons / (maxSpoons + borrowedTotal)) * 100;
    if (percent <= 20) return <BatteryLow className="w-8 h-8 text-red-400" />;
    if (percent <= 50) return <BatteryWarning className="w-8 h-8 text-yellow-400" />;
    return <Battery className="w-8 h-8 text-green-400" />;
  };

  // Filter activities by category
  const filteredActivities = selectedCategory
    ? ACTIVITIES.filter(a => a.category === selectedCategory)
    : ACTIVITIES;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 p-6 rounded-xl border border-purple-500/30"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Utensils className="w-8 h-8 text-purple-400" />
          <div>
            <h2 className="text-2xl font-bold text-white">Spoon Tracker</h2>
            <p className="text-purple-300 text-sm">Energy accounting for chronic illness</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="p-2 rounded-lg bg-purple-900/50 border border-purple-500/30 text-purple-300 hover:text-white transition-colors"
            title="View history"
          >
            <History className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Display */}
      <div className={`relative overflow-hidden rounded-xl border-2 p-6 mb-6 ${
        crashRisk === 'critical'
          ? 'bg-red-900/20 border-red-500/50'
          : crashRisk === 'high'
          ? 'bg-orange-900/20 border-orange-500/50'
          : crashRisk === 'moderate'
          ? 'bg-yellow-900/20 border-yellow-500/50'
          : 'bg-purple-900/20 border-purple-500/50'
      }`}>
        {/* Spoon Count Display */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-4 mb-3">
            {getBatteryIcon()}
            <div className="text-5xl font-bold text-white">
              {remainingSpoons}
              <span className="text-2xl text-purple-300">/{maxSpoons + borrowedTotal}</span>
            </div>
          </div>
          <p className="text-purple-200">
            spoons remaining
            {borrowedTotal > 0 && (
              <span className="text-amber-400 ml-2">
                (including {borrowedTotal} borrowed)
              </span>
            )}
          </p>
        </div>

        {/* Spoon Visual Display */}
        <div className="flex flex-wrap justify-center gap-2 mb-6 p-4 bg-black/20 rounded-lg">
          {renderSpoons()}
        </div>

        {/* Flare Day Toggle */}
        <div className="flex items-center justify-between mb-4 p-3 bg-black/30 rounded-lg">
          <div className="flex items-center gap-2">
            <Flame className={`w-5 h-5 ${isFlareDay ? 'text-orange-400' : 'text-gray-500'}`} />
            <span className="text-white font-medium">Flare Day Mode</span>
            <span className="text-purple-300 text-sm">
              ({SPOON_THEORY_CONFIG.flareAdjustment} spoons)
            </span>
          </div>
          <button
            onClick={toggleFlareDay}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              isFlareDay ? 'bg-orange-500' : 'bg-gray-600'
            }`}
          >
            <motion.div
              className="absolute top-1 w-4 h-4 bg-white rounded-full"
              animate={{ left: isFlareDay ? '1.5rem' : '0.25rem' }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </button>
        </div>

        {/* Base Spoons Adjuster */}
        <div className="flex items-center justify-between mb-4 p-3 bg-black/30 rounded-lg">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span className="text-white font-medium">Daily Budget</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateBaseMaxSpoons(-1)}
              className="p-1 rounded bg-purple-700/50 text-white hover:bg-purple-600/50 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-white font-bold w-8 text-center">{baseMaxSpoons}</span>
            <button
              onClick={() => updateBaseMaxSpoons(1)}
              className="p-1 rounded bg-purple-700/50 text-white hover:bg-purple-600/50 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Crash Warning */}
        <AnimatePresence>
          {(crashRisk === 'high' || crashRisk === 'critical') && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`p-4 rounded-lg mb-4 ${
                crashRisk === 'critical'
                  ? 'bg-red-900/30 border border-red-500/50'
                  : 'bg-orange-900/30 border border-orange-500/50'
              }`}
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className={`w-6 h-6 flex-shrink-0 ${
                  crashRisk === 'critical' ? 'text-red-400' : 'text-orange-400'
                }`} />
                <div>
                  <h4 className={`font-bold ${
                    crashRisk === 'critical' ? 'text-red-300' : 'text-orange-300'
                  }`}>
                    {crashRisk === 'critical' ? 'Crash Warning' : 'Low Energy Alert'}
                  </h4>
                  <p className="text-white/80 text-sm mt-1">
                    {crashRisk === 'critical'
                      ? 'You\'ve used all your energy. Rest is essential now. A crash may follow over the next 24-48 hours. This is normal with chronic illness - please be gentle with yourself.'
                      : 'You\'re running low on spoons. Consider prioritizing rest and essential tasks only. It\'s okay to say no to non-essentials.'}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowBorrowModal(true)}
            className="flex-1 flex items-center justify-center gap-2 p-3 rounded-lg bg-amber-900/30 border border-amber-500/30 text-amber-300 hover:bg-amber-900/50 transition-colors"
          >
            <Gift className="w-4 h-4" />
            Borrow Spoons
          </button>
          <button
            onClick={undoLastEntry}
            disabled={entries.length === 0}
            className="flex-1 flex items-center justify-center gap-2 p-3 rounded-lg bg-purple-900/30 border border-purple-500/30 text-purple-300 hover:bg-purple-900/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCcw className="w-4 h-4" />
            Undo Last
          </button>
        </div>
      </div>

      {/* Activity Buttons Section */}
      <div className="mb-6">
        <div
          className="flex items-center justify-between cursor-pointer p-3 bg-black/30 rounded-t-lg border-b border-purple-500/30"
          onClick={() => setShowActivities(!showActivities)}
        >
          <h3 className="text-lg font-bold text-white">Log Activity</h3>
          {showActivities ? (
            <ChevronUp className="w-5 h-5 text-purple-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-purple-400" />
          )}
        </div>

        <AnimatePresence>
          {showActivities && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-black/20 p-4 rounded-b-lg"
            >
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === null
                      ? 'bg-purple-500 text-white'
                      : 'bg-black/30 text-purple-300 hover:bg-purple-900/30'
                  }`}
                >
                  All
                </button>
                {Object.keys(CATEGORY_COLORS).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-full text-sm font-medium capitalize transition-colors ${
                      selectedCategory === cat
                        ? 'bg-purple-500 text-white'
                        : 'bg-black/30 text-purple-300 hover:bg-purple-900/30'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Activity Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
                {filteredActivities.map((activity) => {
                  const Icon = activity.icon;
                  const colorClass = CATEGORY_COLORS[activity.category] || CATEGORY_COLORS.basics;
                  const canAfford = remainingSpoons >= activity.spoons;

                  return (
                    <motion.button
                      key={activity.id}
                      onClick={() => useSpoons(activity)}
                      disabled={!canAfford}
                      whileHover={canAfford ? { scale: 1.02 } : {}}
                      whileTap={canAfford ? { scale: 0.98 } : {}}
                      className={`relative p-3 rounded-lg border-2 transition-all ${colorClass} ${
                        !canAfford ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Icon className="w-6 h-6" />
                        <span className="text-xs font-medium text-center leading-tight">
                          {activity.name}
                        </span>
                        <span className="text-sm font-bold">
                          {activity.spoons} {activity.spoons === 1 ? 'spoon' : 'spoons'}
                        </span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Custom Activity Button */}
              <button
                onClick={() => setShowCustomModal(true)}
                className="w-full p-3 rounded-lg border-2 border-dashed border-purple-500/50 text-purple-300 hover:bg-purple-900/20 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Custom Activity
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Today's Log */}
      {entries.length > 0 && (
        <div className="mb-6 bg-black/30 rounded-lg p-4">
          <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-400" />
            Today's Activities
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {entries.slice().reverse().map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-2 bg-purple-900/20 rounded"
              >
                <div className="flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-purple-400" />
                  <span className="text-white text-sm">{entry.activity}</span>
                </div>
                <span className="text-purple-300 text-sm font-medium">
                  -{entry.spoons} {entry.spoons === 1 ? 'spoon' : 'spoons'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Borrowed Spoons Log */}
      {borrowedSpoons.length > 0 && (
        <div className="mb-6 bg-amber-900/20 rounded-lg p-4 border border-amber-500/30">
          <h3 className="text-lg font-bold text-amber-300 mb-3 flex items-center gap-2">
            <Gift className="w-5 h-5" />
            Borrowed Energy
          </h3>
          <div className="space-y-2">
            {borrowedSpoons.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between p-2 bg-black/20 rounded"
              >
                <span className="text-white text-sm">From: {b.source}</span>
                <span className="text-amber-300 text-sm font-medium">
                  +{b.spoons} {b.spoons === 1 ? 'spoon' : 'spoons'}
                </span>
              </div>
            ))}
          </div>
          <p className="text-amber-200/60 text-xs mt-3 italic">
            Remember: Borrowed spoons often mean paying extra back later. Be gentle with tomorrow-you.
          </p>
        </div>
      )}

      {/* Post-Exertional Notes */}
      <div className="mb-6 bg-black/30 rounded-lg p-4">
        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <Moon className="w-5 h-5 text-purple-400" />
          Post-Exertional Notes
        </h3>
        <textarea
          value={postExertionalNotes}
          onChange={(e) => setPostExertionalNotes(e.target.value)}
          placeholder="How are you feeling after today's activities? Any delayed symptoms to track?"
          className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-purple-400/50 focus:outline-none focus:border-purple-500/60 resize-none"
          rows={3}
        />
      </div>

      {/* History View */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 bg-black/30 rounded-lg p-4"
          >
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-400" />
              Recent History
            </h3>

            {history.length > 0 ? (
              <>
                {/* Trends */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  <div className="bg-purple-900/30 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-300">
                      {Math.round(history.reduce((sum, d) => sum + d.usedSpoons, 0) / history.length)}
                    </div>
                    <div className="text-xs text-purple-400">Avg Daily Use</div>
                  </div>
                  <div className="bg-orange-900/30 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-orange-300">
                      {history.filter(d => d.isFlareDay).length}
                    </div>
                    <div className="text-xs text-orange-400">Flare Days</div>
                  </div>
                  <div className="bg-red-900/30 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-red-300">
                      {history.filter(d => d.didCrash).length}
                    </div>
                    <div className="text-xs text-red-400">Crash Days</div>
                  </div>
                  <div className="bg-amber-900/30 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-amber-300">
                      {Math.round(history.reduce((sum, d) => sum + d.borrowedCount, 0) / Math.max(1, history.length))}
                    </div>
                    <div className="text-xs text-amber-400">Avg Borrowed</div>
                  </div>
                </div>

                {/* Daily List */}
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {history.slice().reverse().map((day, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-3 rounded ${
                        day.didCrash
                          ? 'bg-red-900/20 border border-red-500/30'
                          : day.isFlareDay
                          ? 'bg-orange-900/20 border border-orange-500/30'
                          : 'bg-purple-900/20'
                      }`}
                    >
                      <div>
                        <div className="text-white font-medium">
                          {new Date(day.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                        <div className="text-xs text-purple-300">
                          {day.usedSpoons}/{day.maxSpoons} spoons used
                          {day.borrowedCount > 0 && (
                            <span className="text-amber-400 ml-2">
                              +{day.borrowedCount} borrowed
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {day.isFlareDay && (
                          <Flame className="w-4 h-4 text-orange-400" title="Flare day" />
                        )}
                        {day.didCrash && (
                          <Zap className="w-4 h-4 text-red-400" title="Crashed" />
                        )}
                        {day.usedSpoons <= day.maxSpoons * 0.6 && (
                          <Heart className="w-4 h-4 text-green-400" title="Paced well" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-center text-purple-300 py-8">
                No history yet. Your data will appear here after your first full day of tracking.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Borrow Modal */}
      <AnimatePresence>
        {showBorrowModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setShowBorrowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-purple-900 border border-purple-500/50 rounded-xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Gift className="w-6 h-6 text-amber-400" />
                Borrow Spoons
              </h3>
              <p className="text-purple-200 text-sm mb-4">
                Sometimes we get support from others or push through with borrowed energy.
                Remember: this often means extra rest needed later.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-purple-300 text-sm mb-2">
                    Source of energy
                  </label>
                  <input
                    type="text"
                    value={borrowSource}
                    onChange={(e) => setBorrowSource(e.target.value)}
                    placeholder="e.g., Partner helped with tasks, Coffee boost, Adrenaline"
                    className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white placeholder-purple-400/50 focus:outline-none focus:border-purple-500/60"
                  />
                </div>
                <div>
                  <label className="block text-purple-300 text-sm mb-2">
                    How many spoons?
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setBorrowAmount(Math.max(1, borrowAmount - 1))}
                      className="p-2 rounded bg-purple-700/50 text-white hover:bg-purple-600/50"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-2xl font-bold text-white w-12 text-center">
                      {borrowAmount}
                    </span>
                    <button
                      onClick={() => setBorrowAmount(Math.min(5, borrowAmount + 1))}
                      className="p-2 rounded bg-purple-700/50 text-white hover:bg-purple-600/50"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowBorrowModal(false)}
                  className="flex-1 p-3 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={borrowSpoon}
                  className="flex-1 p-3 rounded-lg bg-amber-600 text-white hover:bg-amber-500 transition-colors"
                >
                  Borrow
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Activity Modal */}
      <AnimatePresence>
        {showCustomModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCustomModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-purple-900 border border-purple-500/50 rounded-xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Plus className="w-6 h-6 text-purple-400" />
                Custom Activity
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-purple-300 text-sm mb-2">
                    Activity name
                  </label>
                  <input
                    type="text"
                    value={customActivityName}
                    onChange={(e) => setCustomActivityName(e.target.value)}
                    placeholder="What did you do?"
                    className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white placeholder-purple-400/50 focus:outline-none focus:border-purple-500/60"
                  />
                </div>
                <div>
                  <label className="block text-purple-300 text-sm mb-2">
                    How many spoons?
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setCustomActivitySpoons(Math.max(1, customActivitySpoons - 1))}
                      className="p-2 rounded bg-purple-700/50 text-white hover:bg-purple-600/50"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-2xl font-bold text-white w-12 text-center">
                      {customActivitySpoons}
                    </span>
                    <button
                      onClick={() => setCustomActivitySpoons(Math.min(10, customActivitySpoons + 1))}
                      className="p-2 rounded bg-purple-700/50 text-white hover:bg-purple-600/50"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCustomModal(false)}
                  className="flex-1 p-3 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addCustomActivity}
                  disabled={remainingSpoons < customActivitySpoons}
                  className="flex-1 p-3 rounded-lg bg-purple-600 text-white hover:bg-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Log Activity
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Supportive Info Box */}
      <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-purple-300 font-bold text-sm mb-1">About Spoon Theory</h4>
            <p className="text-purple-200/80 text-xs leading-relaxed">
              Spoon theory is a way of explaining the limited energy available to people with chronic illness.
              Each "spoon" represents a unit of energy. Running low is normal and valid - it's not a failure.
              Rest is productive. Pacing is a skill. Your worth isn't measured by your productivity.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SpoonTracker;
