/**
 * Daily Living Support - Comprehensive ADL Support System
 * =======================================================
 * Gentle, trauma-informed daily living assistance for chronic illness management.
 *
 * Features:
 * - Eating reminders with choice limitation (reduces decision fatigue)
 * - Hydration tracking (2-3L + electrolytes for POTS)
 * - Salt intake tracking (3-5g for POTS)
 * - Shower safety checks
 * - PT reminders with pacing rules
 * - Rest enforcement WITHOUT guilt language
 *
 * Language principles: "Would you like to" not "You should"
 * Rest is not earned. You've already done enough.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Utensils,
  Droplets,
  Flame,
  ShowerHead,
  Dumbbell,
  Heart,
  Moon,
  Sun,
  Clock,
  Plus,
  Minus,
  Check,
  AlertTriangle,
  Sparkles,
  ThermometerSun,
  Timer,
  Activity,
  Armchair,
  Coffee,
  Sandwich,
  Cookie,
  Apple,
  Soup,
  GlassWater,
  Zap,
  ChevronDown,
  ChevronUp,
  RefreshCcw,
  Bell,
  BellOff,
  Waves,
  Target,
  TrendingUp,
  Info,
  Leaf,
  Battery,
} from 'lucide-react';
import toast from 'react-hot-toast';

// Import from data
import { DAILY_LIVING_SUPPORT, HEALTH_CONDITIONS_REGISTRY } from '../../data/kol-master-feature-list';

// ===== INTERFACES =====
interface MealEntry {
  id: string;
  timestamp: number;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  choice: string;
  notes?: string;
}

interface HydrationEntry {
  id: string;
  timestamp: number;
  amount: number;
  type: 'water' | 'electrolyte';
}

interface SaltEntry {
  id: string;
  timestamp: number;
  amount: number;
  source: string;
}

interface ShowerSession {
  id: string;
  timestamp: number;
  duration: number;
  seated: boolean;
  preCheckDone: boolean;
  postCheckDone: boolean;
  notes?: string;
}

interface PTExercise {
  id: string;
  name: string;
  description: string;
  flareModification: string;
  completed: boolean;
  timestamp?: number;
}

interface RestEntry {
  id: string;
  timestamp: number;
  duration: number;
  type: 'scheduled' | 'needed' | 'crash';
  affirmation?: string;
}

interface DailyData {
  date: string;
  meals: MealEntry[];
  hydration: HydrationEntry[];
  saltIntake: SaltEntry[];
  showerSessions: ShowerSession[];
  ptExercises: PTExercise[];
  restPeriods: RestEntry[];
  currentHydrationGoal: number;
  currentSaltGoal: number;
  isFlareDay: boolean;
}

// ===== CONSTANTS =====
const MEAL_SUGGESTIONS = {
  breakfast: [
    { name: 'Toast with butter', salty: false },
    { name: 'Oatmeal with salt', salty: true },
    { name: 'Eggs (salted)', salty: true },
    { name: 'Smoothie', salty: false },
    { name: 'Crackers', salty: true },
    { name: 'Just some water for now', salty: false },
  ],
  lunch: [
    { name: 'Soup (high sodium)', salty: true },
    { name: 'Sandwich', salty: true },
    { name: 'Leftovers', salty: false },
    { name: 'Crackers & cheese', salty: true },
    { name: 'Salted nuts', salty: true },
    { name: 'Something small', salty: false },
  ],
  dinner: [
    { name: 'Whatever sounds okay', salty: false },
    { name: 'Soup or broth', salty: true },
    { name: 'Pasta with sauce', salty: true },
    { name: 'Rice & protein', salty: false },
    { name: 'Takeout (no shame)', salty: true },
    { name: 'Snacks as dinner', salty: false },
  ],
  snack: [
    { name: 'Salted pretzels', salty: true },
    { name: 'Pickles', salty: true },
    { name: 'Olives', salty: true },
    { name: 'Crackers', salty: true },
    { name: 'Fruit', salty: false },
    { name: 'Whatever you have', salty: false },
  ],
};

const HIGH_SALT_FOODS = [
  { name: 'Salt packet', amount: 0.5 },
  { name: 'Electrolyte drink', amount: 0.3 },
  { name: 'Pickle', amount: 0.4 },
  { name: 'Canned soup', amount: 1.0 },
  { name: 'Salted nuts', amount: 0.3 },
  { name: 'Chips/pretzels', amount: 0.4 },
  { name: 'Olives', amount: 0.3 },
  { name: 'Cheese', amount: 0.2 },
  { name: 'Broth/bouillon', amount: 0.8 },
  { name: 'Soy sauce (1 tbsp)', amount: 0.9 },
];

const PT_EXERCISES: PTExercise[] = [
  {
    id: 'pt-1',
    name: 'Ankle pumps',
    description: '20 reps each foot, lying down',
    flareModification: '10 reps each foot, very gently',
    completed: false,
  },
  {
    id: 'pt-2',
    name: 'Knee slides',
    description: '15 reps each leg, lying on back',
    flareModification: '5-10 reps, stop if pain increases',
    completed: false,
  },
  {
    id: 'pt-3',
    name: 'Seated marches',
    description: '30 seconds, sitting in chair',
    flareModification: 'Just lift feet slightly, 15 seconds',
    completed: false,
  },
  {
    id: 'pt-4',
    name: 'Wall slides',
    description: '10 reps, back against wall',
    flareModification: 'Skip or do 3-5 very shallow',
    completed: false,
  },
  {
    id: 'pt-5',
    name: 'Gentle stretches',
    description: 'Hold each stretch 30 seconds',
    flareModification: 'Only stretches that feel okay',
    completed: false,
  },
];

const REST_AFFIRMATIONS = [
  "Rest is not earned. It is a basic need.",
  "You've already done enough today.",
  "Your body knows what it needs. Trust it.",
  "Resting is doing something. It's keeping you alive.",
  "You don't owe anyone productivity.",
  "This is not laziness. This is survival.",
  "You are enough, even when you're resting.",
  "Rest is resistance against a system that demands your depletion.",
  "Your worth is not measured by your output.",
  "Resting now prevents crashing later.",
  "This is a valid use of your time.",
  "You deserve rest without justification.",
  "Being gentle with yourself is strength.",
  "Your body has been through a lot. Rest is healing.",
  "There is no 'lazy' in chronic illness management.",
];

// ===== HELPER FUNCTIONS =====
const getTodayString = () => new Date().toISOString().split('T')[0];
const getRandomAffirmation = () => REST_AFFIRMATIONS[Math.floor(Math.random() * REST_AFFIRMATIONS.length)];
const formatTime = (timestamp: number) => new Date(timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

// ===== MAIN COMPONENT =====
const DailyLivingSupport: React.FC = () => {
  // State
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [isFlareDay, setIsFlareDay] = useState(false);
  const [remindersEnabled, setRemindersEnabled] = useState(true);

  // Daily data state
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [hydration, setHydration] = useState<HydrationEntry[]>([]);
  const [saltIntake, setSaltIntake] = useState<SaltEntry[]>([]);
  const [showerSessions, setShowerSessions] = useState<ShowerSession[]>([]);
  const [ptExercises, setPtExercises] = useState<PTExercise[]>(PT_EXERCISES);
  const [restPeriods, setRestPeriods] = useState<RestEntry[]>([]);

  // Goals (from POTS requirements)
  const [hydrationGoal, setHydrationGoal] = useState(2.5); // 2-3L
  const [saltGoal, setSaltGoal] = useState(4.0); // 3-5g

  // Computed values
  const totalHydration = useMemo(() =>
    hydration.reduce((sum, h) => sum + h.amount, 0), [hydration]);

  const totalSalt = useMemo(() =>
    saltIntake.reduce((sum, s) => sum + s.amount, 0), [saltIntake]);

  const ptCompletedCount = useMemo(() =>
    ptExercises.filter(e => e.completed).length, [ptExercises]);

  const totalRestMinutes = useMemo(() =>
    restPeriods.reduce((sum, r) => sum + r.duration, 0), [restPeriods]);

  // Load data from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('daily-living-support');
    if (stored) {
      try {
        const data: DailyData = JSON.parse(stored);
        const today = getTodayString();

        if (data.date === today) {
          setMeals(data.meals || []);
          setHydration(data.hydration || []);
          setSaltIntake(data.saltIntake || []);
          setShowerSessions(data.showerSessions || []);
          setPtExercises(data.ptExercises || PT_EXERCISES);
          setRestPeriods(data.restPeriods || []);
          setHydrationGoal(data.currentHydrationGoal || 2.5);
          setSaltGoal(data.currentSaltGoal || 4.0);
          setIsFlareDay(data.isFlareDay || false);
        } else {
          // New day - reset but keep goals
          setPtExercises(PT_EXERCISES);
          setHydrationGoal(data.currentHydrationGoal || 2.5);
          setSaltGoal(data.currentSaltGoal || 4.0);
        }
      } catch (e) {
        console.error('Error loading daily living data:', e);
      }
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    const data: DailyData = {
      date: getTodayString(),
      meals,
      hydration,
      saltIntake,
      showerSessions,
      ptExercises,
      restPeriods,
      currentHydrationGoal: hydrationGoal,
      currentSaltGoal: saltGoal,
      isFlareDay,
    };
    localStorage.setItem('daily-living-support', JSON.stringify(data));
  }, [meals, hydration, saltIntake, showerSessions, ptExercises, restPeriods, hydrationGoal, saltGoal, isFlareDay]);

  // ===== SECTION COMPONENTS =====

  // Overview Dashboard
  const OverviewSection = () => (
    <div className="space-y-4">
      {/* Flare Day Toggle */}
      <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg border border-purple-500/30">
        <div className="flex items-center gap-3">
          <Flame className={`w-5 h-5 ${isFlareDay ? 'text-orange-400' : 'text-gray-500'}`} />
          <div>
            <span className="text-white font-medium">Flare Day Mode</span>
            <p className="text-purple-300 text-xs">
              {isFlareDay ? 'Gentler expectations today' : 'Regular day settings'}
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setIsFlareDay(!isFlareDay);
            toast(isFlareDay
              ? 'Regular mode. Still be gentle with yourself.'
              : 'Flare day mode. Extra gentleness today.',
              { icon: '💜' }
            );
          }}
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

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {/* Hydration */}
        <button
          onClick={() => setActiveSection('hydration')}
          className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg hover:bg-blue-900/30 transition-colors text-left"
        >
          <div className="flex items-center gap-2 mb-2">
            <Droplets className="w-5 h-5 text-blue-400" />
            <span className="text-blue-300 text-sm font-medium">Hydration</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {totalHydration.toFixed(1)}L
          </div>
          <div className="text-blue-400 text-xs">of {hydrationGoal}L goal</div>
          <div className="mt-2 h-2 bg-black/40 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-500"
              style={{ width: `${Math.min((totalHydration / hydrationGoal) * 100, 100)}%` }}
            />
          </div>
        </button>

        {/* Salt */}
        <button
          onClick={() => setActiveSection('salt')}
          className="p-4 bg-orange-900/20 border border-orange-500/30 rounded-lg hover:bg-orange-900/30 transition-colors text-left"
        >
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-orange-400" />
            <span className="text-orange-300 text-sm font-medium">Salt Intake</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {totalSalt.toFixed(1)}g
          </div>
          <div className="text-orange-400 text-xs">of {saltGoal}g goal (POTS)</div>
          <div className="mt-2 h-2 bg-black/40 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-500 transition-all duration-500"
              style={{ width: `${Math.min((totalSalt / saltGoal) * 100, 100)}%` }}
            />
          </div>
        </button>

        {/* Meals */}
        <button
          onClick={() => setActiveSection('eating')}
          className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg hover:bg-green-900/30 transition-colors text-left"
        >
          <div className="flex items-center gap-2 mb-2">
            <Utensils className="w-5 h-5 text-green-400" />
            <span className="text-green-300 text-sm font-medium">Eating</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {meals.length}
          </div>
          <div className="text-green-400 text-xs">meals/snacks today</div>
          <div className="mt-2 flex gap-1">
            {['breakfast', 'lunch', 'dinner'].map(type => {
              const hasType = meals.some(m => m.type === type);
              return (
                <div
                  key={type}
                  className={`h-2 flex-1 rounded ${hasType ? 'bg-green-500' : 'bg-black/40'}`}
                />
              );
            })}
          </div>
        </button>

        {/* PT Exercises */}
        <button
          onClick={() => setActiveSection('pt')}
          className="p-4 bg-pink-900/20 border border-pink-500/30 rounded-lg hover:bg-pink-900/30 transition-colors text-left"
        >
          <div className="flex items-center gap-2 mb-2">
            <Dumbbell className="w-5 h-5 text-pink-400" />
            <span className="text-pink-300 text-sm font-medium">PT Exercises</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {ptCompletedCount}/{ptExercises.length}
          </div>
          <div className="text-pink-400 text-xs">
            {isFlareDay ? 'flare modifications available' : 'exercises completed'}
          </div>
          <div className="mt-2 h-2 bg-black/40 rounded-full overflow-hidden">
            <div
              className="h-full bg-pink-500 transition-all duration-500"
              style={{ width: `${(ptCompletedCount / ptExercises.length) * 100}%` }}
            />
          </div>
        </button>

        {/* Rest */}
        <button
          onClick={() => setActiveSection('rest')}
          className="p-4 bg-purple-900/20 border border-purple-500/30 rounded-lg hover:bg-purple-900/30 transition-colors text-left"
        >
          <div className="flex items-center gap-2 mb-2">
            <Moon className="w-5 h-5 text-purple-400" />
            <span className="text-purple-300 text-sm font-medium">Rest</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {totalRestMinutes}m
          </div>
          <div className="text-purple-400 text-xs">rest time logged</div>
          <div className="mt-2 text-xs text-purple-300 italic truncate">
            "{getRandomAffirmation().substring(0, 30)}..."
          </div>
        </button>

        {/* Shower Safety */}
        <button
          onClick={() => setActiveSection('shower')}
          className="p-4 bg-cyan-900/20 border border-cyan-500/30 rounded-lg hover:bg-cyan-900/30 transition-colors text-left"
        >
          <div className="flex items-center gap-2 mb-2">
            <ShowerHead className="w-5 h-5 text-cyan-400" />
            <span className="text-cyan-300 text-sm font-medium">Shower Safety</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {showerSessions.length}
          </div>
          <div className="text-cyan-400 text-xs">sessions today</div>
          <div className="mt-2 flex items-center gap-2 text-xs text-cyan-300">
            <Armchair className="w-3 h-3" />
            <span>Seated reminder active</span>
          </div>
        </button>
      </div>

      {/* Gentle Reminders Card */}
      <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Heart className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-purple-300 font-medium mb-2">Gentle Reminder</h4>
            <p className="text-purple-200/80 text-sm">
              {isFlareDay
                ? "Flare days are hard. Whatever you manage today is enough. Rest is productive."
                : "You're doing a great job keeping track of your needs. Remember: there's no perfect way to do this."
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Eating Reminders Section
  const EatingSection = () => {
    const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('snack');
    const [customMeal, setCustomMeal] = useState('');

    const logMeal = (choice: string) => {
      const entry: MealEntry = {
        id: `meal-${Date.now()}`,
        timestamp: Date.now(),
        type: selectedMealType,
        choice,
      };
      setMeals([...meals, entry]);
      toast.success(`${selectedMealType.charAt(0).toUpperCase() + selectedMealType.slice(1)} logged`, { icon: '🍽️' });
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => setActiveSection('overview')} className="text-purple-400 hover:text-purple-300">
            <ChevronUp className="w-5 h-5" />
          </button>
          <Utensils className="w-6 h-6 text-green-400" />
          <h3 className="text-xl font-bold text-white">Eating Reminders</h3>
        </div>

        {/* Gentle intro */}
        <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
          <p className="text-green-200 text-sm">
            <span className="font-medium">What sounds okay right now?</span> There's no pressure to eat "perfectly."
            Just pick something that feels manageable. Any food is good food.
          </p>
        </div>

        {/* Meal Type Selector */}
        <div className="flex flex-wrap gap-2">
          {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map(type => (
            <button
              key={type}
              onClick={() => setSelectedMealType(type)}
              className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                selectedMealType === type
                  ? 'bg-green-500 text-white'
                  : 'bg-black/30 text-green-300 hover:bg-green-900/30 border border-green-500/30'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Limited Choice Options (reduces decision fatigue) */}
        <div className="bg-black/30 rounded-lg p-4 border border-green-500/20">
          <h4 className="text-green-300 font-medium mb-3">
            Quick options for {selectedMealType}:
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {MEAL_SUGGESTIONS[selectedMealType].map((option, idx) => (
              <motion.button
                key={idx}
                onClick={() => logMeal(option.name)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-3 bg-green-900/20 hover:bg-green-900/30 border border-green-500/30 rounded-lg text-left transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">{option.name}</span>
                  {option.salty && (
                    <span className="text-xs text-orange-400 bg-orange-500/20 px-2 py-0.5 rounded">
                      +salt
                    </span>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Custom Entry */}
        <div className="bg-black/30 rounded-lg p-4 border border-green-500/20">
          <h4 className="text-green-300 font-medium mb-3">Or describe what you had:</h4>
          <div className="flex gap-2">
            <input
              type="text"
              value={customMeal}
              onChange={(e) => setCustomMeal(e.target.value)}
              placeholder="Something else..."
              className="flex-1 bg-black/40 border border-green-500/30 rounded-lg px-4 py-2 text-white placeholder-green-400/50 focus:outline-none focus:border-green-500/60"
            />
            <button
              onClick={() => {
                if (customMeal.trim()) {
                  logMeal(customMeal.trim());
                  setCustomMeal('');
                }
              }}
              className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white font-medium rounded-lg transition-colors"
            >
              Log
            </button>
          </div>
        </div>

        {/* Today's Meals */}
        {meals.length > 0 && (
          <div className="bg-black/30 rounded-lg p-4 border border-green-500/20">
            <h4 className="text-green-300 font-medium mb-3">Today's meals:</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {meals.slice().reverse().map(meal => (
                <div key={meal.id} className="flex items-center justify-between p-2 bg-green-900/20 rounded">
                  <div>
                    <span className="text-white text-sm">{meal.choice}</span>
                    <span className="text-green-400 text-xs ml-2 capitalize">({meal.type})</span>
                  </div>
                  <span className="text-green-400 text-xs">{formatTime(meal.timestamp)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Hydration Section
  const HydrationSection = () => {
    const [quickAmount, setQuickAmount] = useState(0.25);

    const addHydration = (amount: number, type: 'water' | 'electrolyte' = 'water') => {
      const entry: HydrationEntry = {
        id: `hydration-${Date.now()}`,
        timestamp: Date.now(),
        amount,
        type,
      };
      setHydration([...hydration, entry]);

      const newTotal = totalHydration + amount;
      if (newTotal >= hydrationGoal && totalHydration < hydrationGoal) {
        toast.success('Hydration goal reached! Great job taking care of yourself.', { icon: '💧' });
      } else {
        toast.success(`Added ${amount}L ${type === 'electrolyte' ? '(with electrolytes)' : ''}`, { icon: '💧' });
      }
    };

    const percentage = Math.min((totalHydration / hydrationGoal) * 100, 100);
    const electrolytesToday = hydration.filter(h => h.type === 'electrolyte').length;

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => setActiveSection('overview')} className="text-purple-400 hover:text-purple-300">
            <ChevronUp className="w-5 h-5" />
          </button>
          <Droplets className="w-6 h-6 text-blue-400" />
          <h3 className="text-xl font-bold text-white">Hydration Tracking</h3>
        </div>

        {/* POTS Reminder */}
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-blue-200 text-sm">
              <span className="font-medium">POTS Management:</span> 2-3L of fluid daily helps with blood volume.
              Would you like to add some water when you're ready?
            </p>
          </div>
        </div>

        {/* Progress Display */}
        <div className="bg-black/30 rounded-lg p-6 border border-blue-500/20 text-center">
          <div className="text-5xl font-bold text-white mb-2">
            {totalHydration.toFixed(2)}L
          </div>
          <div className="text-blue-400 text-sm mb-4">of {hydrationGoal}L goal</div>

          {/* Visual Progress */}
          <div className="relative h-8 bg-black/40 rounded-full overflow-hidden mb-4">
            <motion.div
              className={`h-full ${percentage >= 100 ? 'bg-green-500' : 'bg-blue-500'}`}
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <div className="text-blue-300 text-sm">
            {percentage >= 100
              ? "Goal reached! You're doing great."
              : `${(hydrationGoal - totalHydration).toFixed(2)}L remaining`
            }
          </div>
        </div>

        {/* Quick Add Buttons - Glass/Bottle Icons */}
        <div className="grid grid-cols-4 gap-2">
          {[0.25, 0.5, 0.75, 1.0].map(amount => (
            <motion.button
              key={amount}
              onClick={() => addHydration(amount)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-4 bg-blue-900/30 hover:bg-blue-900/50 border border-blue-500/30 rounded-lg flex flex-col items-center gap-2 transition-colors"
            >
              <GlassWater className={`w-6 h-6 text-blue-400 ${amount >= 0.5 ? 'scale-110' : ''}`} />
              <span className="text-white font-medium">+{amount}L</span>
            </motion.button>
          ))}
        </div>

        {/* Electrolyte Button */}
        <button
          onClick={() => addHydration(0.5, 'electrolyte')}
          className="w-full p-4 bg-orange-900/20 hover:bg-orange-900/30 border border-orange-500/30 rounded-lg flex items-center justify-center gap-3 transition-colors"
        >
          <Zap className="w-5 h-5 text-orange-400" />
          <span className="text-orange-300 font-medium">Add Electrolyte Drink (+0.5L)</span>
          <span className="text-xs text-orange-400 bg-orange-500/20 px-2 py-1 rounded">
            {electrolytesToday} today
          </span>
        </button>

        {/* Goal Adjustment */}
        <div className="bg-black/30 rounded-lg p-4 border border-blue-500/20">
          <h4 className="text-blue-300 font-medium mb-3">Adjust daily goal:</h4>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setHydrationGoal(Math.max(1, hydrationGoal - 0.5))}
              className="p-2 bg-blue-900/50 hover:bg-blue-900/70 rounded-lg text-blue-300"
            >
              <Minus className="w-5 h-5" />
            </button>
            <span className="text-2xl font-bold text-white">{hydrationGoal}L</span>
            <button
              onClick={() => setHydrationGoal(Math.min(4, hydrationGoal + 0.5))}
              className="p-2 bg-blue-900/50 hover:bg-blue-900/70 rounded-lg text-blue-300"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* History */}
        {hydration.length > 0 && (
          <div className="bg-black/30 rounded-lg p-4 border border-blue-500/20">
            <h4 className="text-blue-300 font-medium mb-3">Today's intake:</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {hydration.slice().reverse().map(h => (
                <div key={h.id} className="flex items-center justify-between p-2 bg-blue-900/20 rounded">
                  <div className="flex items-center gap-2">
                    {h.type === 'electrolyte' ? (
                      <Zap className="w-4 h-4 text-orange-400" />
                    ) : (
                      <Droplets className="w-4 h-4 text-blue-400" />
                    )}
                    <span className="text-white text-sm">
                      {h.amount}L {h.type === 'electrolyte' && '(electrolytes)'}
                    </span>
                  </div>
                  <span className="text-blue-400 text-xs">{formatTime(h.timestamp)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Salt Intake Section
  const SaltSection = () => {
    const [customAmount, setCustomAmount] = useState(0.5);
    const [customSource, setCustomSource] = useState('');

    const addSalt = (amount: number, source: string) => {
      const entry: SaltEntry = {
        id: `salt-${Date.now()}`,
        timestamp: Date.now(),
        amount,
        source,
      };
      setSaltIntake([...saltIntake, entry]);

      const newTotal = totalSalt + amount;
      if (newTotal >= saltGoal && totalSalt < saltGoal) {
        toast.success('Salt goal reached! This helps with POTS management.', { icon: '🧂' });
      } else {
        toast.success(`Added ${amount}g from ${source}`, { icon: '🧂' });
      }
    };

    const percentage = Math.min((totalSalt / saltGoal) * 100, 100);
    const isLow = totalSalt < saltGoal * 0.5;

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => setActiveSection('overview')} className="text-purple-400 hover:text-purple-300">
            <ChevronUp className="w-5 h-5" />
          </button>
          <Flame className="w-6 h-6 text-orange-400" />
          <h3 className="text-xl font-bold text-white">Salt Intake Tracking</h3>
        </div>

        {/* POTS Info */}
        <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
            <p className="text-orange-200 text-sm">
              <span className="font-medium">POTS Requirement:</span> 3-5g of sodium daily helps increase blood volume
              and manage symptoms. Your current goal is {saltGoal}g.
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-black/30 rounded-lg p-6 border border-orange-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-orange-300 font-medium">{totalSalt.toFixed(1)}g / {saltGoal}g</span>
            <span className={`font-bold ${percentage >= 100 ? 'text-green-400' : isLow ? 'text-red-400' : 'text-orange-400'}`}>
              {percentage.toFixed(0)}%
            </span>
          </div>

          <div className="relative h-6 bg-black/40 rounded-full overflow-hidden">
            <motion.div
              className={`h-full ${
                percentage >= 100 ? 'bg-green-500' : isLow ? 'bg-red-500' : 'bg-orange-500'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {isLow && (
            <p className="text-red-300 text-sm mt-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Low salt intake. Would you like to add some salty food?
            </p>
          )}
        </div>

        {/* High Salt Food Quick Add */}
        <div className="bg-black/30 rounded-lg p-4 border border-orange-500/20">
          <h4 className="text-orange-300 font-medium mb-3">High-salt food suggestions:</h4>
          <div className="grid grid-cols-2 gap-2">
            {HIGH_SALT_FOODS.map((food, idx) => (
              <motion.button
                key={idx}
                onClick={() => addSalt(food.amount, food.name)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-3 bg-orange-900/20 hover:bg-orange-900/30 border border-orange-500/30 rounded-lg text-left transition-colors"
              >
                <div className="text-white text-sm">{food.name}</div>
                <div className="text-orange-400 text-xs font-medium">+{food.amount}g</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Custom Entry */}
        <div className="bg-black/30 rounded-lg p-4 border border-orange-500/20">
          <h4 className="text-orange-300 font-medium mb-3">Custom entry:</h4>
          <div className="space-y-2">
            <input
              type="text"
              value={customSource}
              onChange={(e) => setCustomSource(e.target.value)}
              placeholder="What did you eat?"
              className="w-full bg-black/40 border border-orange-500/30 rounded-lg px-4 py-2 text-white placeholder-orange-400/50 focus:outline-none focus:border-orange-500/60"
            />
            <div className="flex gap-2">
              <input
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(parseFloat(e.target.value) || 0)}
                step="0.1"
                min="0"
                max="5"
                className="flex-1 bg-black/40 border border-orange-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500/60"
              />
              <button
                onClick={() => {
                  if (customSource.trim()) {
                    addSalt(customAmount, customSource.trim());
                    setCustomSource('');
                  }
                }}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-medium rounded-lg transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Goal Adjustment */}
        <div className="bg-black/30 rounded-lg p-4 border border-orange-500/20">
          <h4 className="text-orange-300 font-medium mb-3">Adjust daily goal:</h4>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setSaltGoal(Math.max(2, saltGoal - 0.5))}
              className="p-2 bg-orange-900/50 hover:bg-orange-900/70 rounded-lg text-orange-300"
            >
              <Minus className="w-5 h-5" />
            </button>
            <span className="text-2xl font-bold text-white">{saltGoal}g</span>
            <button
              onClick={() => setSaltGoal(Math.min(6, saltGoal + 0.5))}
              className="p-2 bg-orange-900/50 hover:bg-orange-900/70 rounded-lg text-orange-300"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* History */}
        {saltIntake.length > 0 && (
          <div className="bg-black/30 rounded-lg p-4 border border-orange-500/20">
            <h4 className="text-orange-300 font-medium mb-3">Today's log:</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {saltIntake.slice().reverse().map(s => (
                <div key={s.id} className="flex items-center justify-between p-2 bg-orange-900/20 rounded">
                  <span className="text-white text-sm">{s.source}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-orange-300 font-medium">+{s.amount}g</span>
                    <span className="text-orange-400 text-xs">{formatTime(s.timestamp)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Shower Safety Section
  const ShowerSection = () => {
    const [isShowering, setIsShowering] = useState(false);
    const [showerStartTime, setShowerStartTime] = useState<number | null>(null);
    const [seated, setSeated] = useState(true);
    const [preCheckDone, setPreCheckDone] = useState(false);
    const [showTimer, setShowTimer] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);

    // Timer effect
    useEffect(() => {
      let interval: NodeJS.Timeout;
      if (isShowering && showerStartTime) {
        interval = setInterval(() => {
          const elapsed = Math.floor((Date.now() - showerStartTime) / 1000);
          setElapsedTime(elapsed);

          // Duration warnings (gentle)
          if (elapsed === 300) { // 5 minutes
            toast("5 minutes in the shower. How are you feeling?", { icon: '🚿' });
          } else if (elapsed === 600) { // 10 minutes
            toast("10 minutes. Would you like to wrap up soon?", { icon: '💜' });
          }
        }, 1000);
      }
      return () => clearInterval(interval);
    }, [isShowering, showerStartTime]);

    const startShower = () => {
      if (!preCheckDone) {
        toast.error("Please complete the safety checklist first");
        return;
      }
      setShowerStartTime(Date.now());
      setIsShowering(true);
      setShowTimer(true);
      toast("Shower started. Take your time, but listen to your body.", { icon: '🚿' });
    };

    const endShower = () => {
      if (showerStartTime) {
        const duration = Math.floor((Date.now() - showerStartTime) / 60000);
        const session: ShowerSession = {
          id: `shower-${Date.now()}`,
          timestamp: showerStartTime,
          duration,
          seated,
          preCheckDone: true,
          postCheckDone: false,
        };
        setShowerSessions([...showerSessions, session]);
        toast.success("Shower logged. Remember: rest after if you feel dizzy.", { icon: '💜' });
      }
      setIsShowering(false);
      setShowerStartTime(null);
      setPreCheckDone(false);
      setElapsedTime(0);
    };

    const formatDuration = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => setActiveSection('overview')} className="text-purple-400 hover:text-purple-300">
            <ChevronUp className="w-5 h-5" />
          </button>
          <ShowerHead className="w-6 h-6 text-cyan-400" />
          <h3 className="text-xl font-bold text-white">Shower Safety</h3>
        </div>

        {/* POTS Shower Safety Info */}
        <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div className="text-cyan-200 text-sm">
              <p className="font-medium mb-2">Shower Safety for POTS:</p>
              <ul className="list-disc list-inside space-y-1 text-cyan-300">
                <li>Use a shower chair when possible</li>
                <li>Keep water lukewarm (not hot)</li>
                <li>Take breaks if you feel dizzy</li>
                <li>Have water nearby to drink</li>
                <li>Rest afterward if needed</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Pre-Shower Checklist */}
        {!isShowering && (
          <div className="bg-black/30 rounded-lg p-4 border border-cyan-500/20">
            <h4 className="text-cyan-300 font-medium mb-4">Pre-shower checklist:</h4>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={seated}
                  onChange={(e) => setSeated(e.target.checked)}
                  className="w-5 h-5 rounded border-cyan-500/50 bg-black/40 text-cyan-500"
                />
                <div className="flex items-center gap-2 text-white">
                  <Armchair className="w-4 h-4 text-cyan-400" />
                  <span>Shower chair available</span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preCheckDone}
                  onChange={(e) => setPreCheckDone(e.target.checked)}
                  className="w-5 h-5 rounded border-cyan-500/50 bg-black/40 text-cyan-500"
                />
                <div className="flex items-center gap-2 text-white">
                  <ThermometerSun className="w-4 h-4 text-orange-400" />
                  <span>Water temperature checked (not too hot)</span>
                </div>
              </label>

              <div className="flex items-center gap-2 p-3 bg-cyan-900/20 rounded-lg text-cyan-300 text-sm">
                <GlassWater className="w-4 h-4" />
                <span>Consider having water to drink nearby</span>
              </div>
            </div>

            <button
              onClick={startShower}
              disabled={!preCheckDone}
              className={`w-full mt-4 p-4 rounded-lg font-medium transition-colors ${
                preCheckDone
                  ? 'bg-cyan-600 hover:bg-cyan-500 text-white'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              Start Shower Timer
            </button>
          </div>
        )}

        {/* Active Shower Timer */}
        {isShowering && (
          <div className="bg-cyan-900/30 border-2 border-cyan-500/50 rounded-lg p-6 text-center">
            <div className="text-6xl font-mono font-bold text-white mb-4">
              {formatDuration(elapsedTime)}
            </div>
            <p className="text-cyan-300 mb-4">
              {elapsedTime < 300
                ? "Taking it easy. You're doing great."
                : elapsedTime < 600
                ? "How are you feeling? Listen to your body."
                : "Would you like to wrap up when you're ready?"
              }
            </p>
            <button
              onClick={endShower}
              className="w-full p-4 bg-red-600 hover:bg-red-500 text-white font-medium rounded-lg transition-colors"
            >
              End Shower
            </button>
          </div>
        )}

        {/* Post-Shower Reminder */}
        {showerSessions.length > 0 && (
          <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Heart className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-purple-300 font-medium mb-2">Post-shower reminder:</p>
                <p className="text-purple-200 text-sm">
                  If you feel dizzy or tired, that's normal with POTS.
                  Rest for a few minutes before getting dressed. There's no rush.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* History */}
        {showerSessions.length > 0 && (
          <div className="bg-black/30 rounded-lg p-4 border border-cyan-500/20">
            <h4 className="text-cyan-300 font-medium mb-3">Today's sessions:</h4>
            <div className="space-y-2">
              {showerSessions.slice().reverse().map(session => (
                <div key={session.id} className="flex items-center justify-between p-2 bg-cyan-900/20 rounded">
                  <div className="flex items-center gap-2">
                    <ShowerHead className="w-4 h-4 text-cyan-400" />
                    <span className="text-white text-sm">{session.duration} minutes</span>
                    {session.seated && (
                      <span className="text-xs text-green-400 bg-green-500/20 px-2 py-0.5 rounded">
                        seated
                      </span>
                    )}
                  </div>
                  <span className="text-cyan-400 text-xs">{formatTime(session.timestamp)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // PT Reminders Section
  const PTSection = () => {
    const toggleExercise = (id: string) => {
      setPtExercises(prev => prev.map(ex => {
        if (ex.id === id) {
          const newCompleted = !ex.completed;
          if (newCompleted) {
            toast.success("Exercise logged. Great job moving your body!", { icon: '💪' });
          }
          return { ...ex, completed: newCompleted, timestamp: newCompleted ? Date.now() : undefined };
        }
        return ex;
      }));
    };

    const resetExercises = () => {
      setPtExercises(PT_EXERCISES);
      toast("PT exercises reset. Start fresh when you're ready.", { icon: '🔄' });
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setActiveSection('overview')} className="text-purple-400 hover:text-purple-300">
              <ChevronUp className="w-5 h-5" />
            </button>
            <Dumbbell className="w-6 h-6 text-pink-400" />
            <h3 className="text-xl font-bold text-white">PT Exercises</h3>
          </div>
          <button
            onClick={resetExercises}
            className="p-2 text-pink-400 hover:text-pink-300"
            title="Reset exercises"
          >
            <RefreshCcw className="w-5 h-5" />
          </button>
        </div>

        {/* Pacing Info */}
        <div className="bg-pink-900/20 border border-pink-500/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5" />
            <div className="text-pink-200 text-sm">
              <p className="font-medium mb-2">Pacing Guidelines:</p>
              <ul className="list-disc list-inside space-y-1 text-pink-300">
                <li>Take breaks between exercises</li>
                <li>Stop if pain increases</li>
                <li>It's okay to skip exercises on hard days</li>
                <li>Some movement is better than none</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Flare Modification Notice */}
        {isFlareDay && (
          <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Flame className="w-5 h-5 text-orange-400" />
              <p className="text-orange-200 text-sm">
                <span className="font-medium">Flare day mode:</span> Gentler modifications shown below.
                Do what feels okay, or rest instead.
              </p>
            </div>
          </div>
        )}

        {/* Progress */}
        <div className="bg-black/30 rounded-lg p-4 border border-pink-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-pink-300 font-medium">Progress</span>
            <span className="text-pink-300">{ptCompletedCount}/{ptExercises.length}</span>
          </div>
          <div className="h-3 bg-black/40 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-pink-500"
              initial={{ width: 0 }}
              animate={{ width: `${(ptCompletedCount / ptExercises.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          {ptCompletedCount === ptExercises.length && (
            <p className="text-green-400 text-sm mt-2">
              All exercises complete! You did amazing today.
            </p>
          )}
        </div>

        {/* Exercise List */}
        <div className="space-y-3">
          {ptExercises.map(exercise => (
            <motion.div
              key={exercise.id}
              className={`p-4 rounded-lg border transition-colors ${
                exercise.completed
                  ? 'bg-green-900/20 border-green-500/30'
                  : 'bg-black/30 border-pink-500/20 hover:border-pink-500/40'
              }`}
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={() => toggleExercise(exercise.id)}
                  className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                    exercise.completed
                      ? 'bg-green-500 border-green-500'
                      : 'border-pink-500/50 hover:border-pink-500'
                  }`}
                >
                  {exercise.completed && <Check className="w-4 h-4 text-white" />}
                </button>

                <div className="flex-1">
                  <h4 className={`font-medium ${exercise.completed ? 'text-green-300' : 'text-white'}`}>
                    {exercise.name}
                  </h4>
                  <p className="text-sm text-gray-400 mt-1">
                    {isFlareDay ? exercise.flareModification : exercise.description}
                  </p>
                  {exercise.completed && exercise.timestamp && (
                    <p className="text-xs text-green-400 mt-2">
                      Completed at {formatTime(exercise.timestamp)}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Supportive Message */}
        <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4 text-center">
          <p className="text-purple-200 text-sm italic">
            {ptCompletedCount === 0
              ? "No pressure to do these today. Any movement counts."
              : ptCompletedCount < ptExercises.length
              ? "You're doing great. Take breaks as needed."
              : "Amazing work! Rest well tonight."
            }
          </p>
        </div>
      </div>
    );
  };

  // Rest Enforcement Section (NO GUILT LANGUAGE)
  const RestSection = () => {
    const [restDuration, setRestDuration] = useState(15);
    const [currentAffirmation, setCurrentAffirmation] = useState(getRandomAffirmation());

    const logRest = (type: 'scheduled' | 'needed' | 'crash') => {
      const entry: RestEntry = {
        id: `rest-${Date.now()}`,
        timestamp: Date.now(),
        duration: restDuration,
        type,
        affirmation: currentAffirmation,
      };
      setRestPeriods([...restPeriods, entry]);
      setCurrentAffirmation(getRandomAffirmation());

      const messages = {
        scheduled: "Rest logged. You're taking care of yourself.",
        needed: "Rest is a valid response to how you feel.",
        crash: "Crash rest logged. Your body is healing. This is okay.",
      };
      toast(messages[type], { icon: '💜' });
    };

    const refreshAffirmation = () => {
      setCurrentAffirmation(getRandomAffirmation());
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => setActiveSection('overview')} className="text-purple-400 hover:text-purple-300">
            <ChevronUp className="w-5 h-5" />
          </button>
          <Moon className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-bold text-white">Rest Time</h3>
        </div>

        {/* Affirmation Card */}
        <motion.div
          key={currentAffirmation}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-500/30 rounded-xl p-6 text-center"
        >
          <Sparkles className="w-8 h-8 text-purple-400 mx-auto mb-4" />
          <p className="text-xl text-white font-medium italic mb-4">
            "{currentAffirmation}"
          </p>
          <button
            onClick={refreshAffirmation}
            className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-2 mx-auto"
          >
            <RefreshCcw className="w-4 h-4" />
            Another affirmation
          </button>
        </motion.div>

        {/* Core Message - NO GUILT */}
        <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
          <h4 className="text-purple-300 font-medium mb-2">Remember:</h4>
          <ul className="space-y-2 text-purple-200 text-sm">
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
              <span>Rest is not earned. It is a basic human need.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
              <span>You don't owe anyone productivity.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
              <span>Resting now prevents crashing later.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
              <span>Your worth is not measured by what you accomplish.</span>
            </li>
          </ul>
        </div>

        {/* Rest Duration */}
        <div className="bg-black/30 rounded-lg p-4 border border-purple-500/20">
          <h4 className="text-purple-300 font-medium mb-3">How long would you like to rest?</h4>
          <div className="flex items-center justify-center gap-4 mb-4">
            <button
              onClick={() => setRestDuration(Math.max(5, restDuration - 5))}
              className="p-2 bg-purple-900/50 hover:bg-purple-900/70 rounded-lg text-purple-300"
            >
              <Minus className="w-5 h-5" />
            </button>
            <span className="text-3xl font-bold text-white">{restDuration}m</span>
            <button
              onClick={() => setRestDuration(Math.min(120, restDuration + 5))}
              className="p-2 bg-purple-900/50 hover:bg-purple-900/70 rounded-lg text-purple-300"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {[15, 30, 45, 60].map(mins => (
              <button
                key={mins}
                onClick={() => setRestDuration(mins)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  restDuration === mins
                    ? 'bg-purple-500 text-white'
                    : 'bg-black/30 text-purple-300 hover:bg-purple-900/30'
                }`}
              >
                {mins}m
              </button>
            ))}
          </div>
        </div>

        {/* Log Rest Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => logRest('scheduled')}
            className="w-full p-4 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Clock className="w-5 h-5" />
            Log Scheduled Rest
          </button>

          <button
            onClick={() => logRest('needed')}
            className="w-full p-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Heart className="w-5 h-5" />
            Log Rest (Needed It)
          </button>

          <button
            onClick={() => logRest('crash')}
            className="w-full p-4 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Battery className="w-5 h-5" />
            Log Crash Rest (No Shame)
          </button>
        </div>

        {/* Today's Rest */}
        {restPeriods.length > 0 && (
          <div className="bg-black/30 rounded-lg p-4 border border-purple-500/20">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-purple-300 font-medium">Today's rest:</h4>
              <span className="text-purple-300 font-bold">{totalRestMinutes} minutes total</span>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {restPeriods.slice().reverse().map(rest => (
                <div key={rest.id} className="flex items-center justify-between p-2 bg-purple-900/20 rounded">
                  <div className="flex items-center gap-2">
                    <Moon className="w-4 h-4 text-purple-400" />
                    <span className="text-white text-sm">{rest.duration}m</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      rest.type === 'scheduled' ? 'bg-purple-500/20 text-purple-300' :
                      rest.type === 'needed' ? 'bg-indigo-500/20 text-indigo-300' :
                      'bg-gray-500/20 text-gray-300'
                    }`}>
                      {rest.type}
                    </span>
                  </div>
                  <span className="text-purple-400 text-xs">{formatTime(rest.timestamp)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* "You've done enough" message */}
        <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-lg p-4 text-center">
          <p className="text-purple-200 text-lg font-medium">
            You've done enough today.
          </p>
          <p className="text-purple-300 text-sm mt-1">
            Whatever you managed is valid. Rest is productive.
          </p>
        </div>
      </div>
    );
  };

  // ===== MAIN RENDER =====
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
          <Leaf className="w-8 h-8 text-purple-400" />
          <div>
            <h2 className="text-2xl font-bold text-white">Daily Living Support</h2>
            <p className="text-purple-300 text-sm">Gentle, trauma-informed self-care</p>
          </div>
        </div>
        <button
          onClick={() => setRemindersEnabled(!remindersEnabled)}
          className={`p-2 rounded-lg transition-colors ${
            remindersEnabled ? 'bg-purple-500/20 text-purple-300' : 'bg-black/30 text-gray-500'
          }`}
          title={remindersEnabled ? 'Reminders on' : 'Reminders off'}
        >
          {remindersEnabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
        </button>
      </div>

      {/* Section Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeSection === 'overview' && <OverviewSection />}
          {activeSection === 'eating' && <EatingSection />}
          {activeSection === 'hydration' && <HydrationSection />}
          {activeSection === 'salt' && <SaltSection />}
          {activeSection === 'shower' && <ShowerSection />}
          {activeSection === 'pt' && <PTSection />}
          {activeSection === 'rest' && <RestSection />}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default DailyLivingSupport;
