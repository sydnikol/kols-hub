/**
 * Cognitive Support (AuDHD) Toolkit
 * ==================================
 * A comprehensive, ADHD-friendly cognitive support system
 * Based on COGNITIVE_SUPPORT from kol-master-feature-list.ts
 *
 * Features:
 * 1. Task Chunking - Break tasks into small, visual steps
 * 2. Body Doubling Mode - Virtual presence and focus support
 * 3. Visual Schedules - Picture-based routines with drag-drop
 * 4. Memory Aids - Quick notes, item tracking, reminders
 * 5. Reduced Decision Trees - Pre-made choices, "pick for me"
 * 6. Hyperfocus Protection - Break/hydration/food reminders
 * 7. Burnout Detection - Warning signs and recovery
 *
 * Design: Dark purple theme, visual/engaging, minimal text
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Brain,
  ListChecks,
  Users,
  Calendar,
  Lightbulb,
  TreeDeciduous,
  Shield,
  AlertTriangle,
  Plus,
  Check,
  ChevronRight,
  ChevronDown,
  Play,
  Pause,
  RotateCcw,
  Droplets,
  UtensilsCrossed,
  Timer,
  Sparkles,
  MapPin,
  StickyNote,
  Volume2,
  VolumeX,
  Shuffle,
  Trash2,
  GripVertical,
  Clock,
  Zap,
  Heart,
  Coffee,
  Moon,
  Sun,
  Target,
  Award,
  TrendingDown,
  Battery,
  BatteryLow,
  BatteryWarning,
  Home,
  Star,
  Music,
  CloudRain,
  Waves,
  Wind,
  Eye,
  EyeOff,
  X,
  Save,
  Edit3,
  ArrowRight,
} from 'lucide-react';

// ===== TYPES =====
interface Task {
  id: string;
  title: string;
  steps: TaskStep[];
  createdAt: Date;
  completedAt?: Date;
}

interface TaskStep {
  id: string;
  text: string;
  completed: boolean;
  timeEstimate?: number; // minutes
}

interface ScheduleItem {
  id: string;
  title: string;
  icon: string;
  timeEstimate: number;
  order: number;
  completed: boolean;
}

interface MemoryNote {
  id: string;
  text: string;
  type: 'note' | 'location' | 'reminder' | 'important';
  createdAt: Date;
  location?: string;
}

interface BurnoutIndicator {
  id: string;
  text: string;
  category: 'physical' | 'emotional' | 'cognitive' | 'social';
  checked: boolean;
}

type ViewMode = 'home' | 'chunking' | 'bodyDoubling' | 'schedule' | 'memory' | 'decisions' | 'hyperfocus' | 'burnout';

// ===== DATA =====
const AMBIENT_SOUNDS = [
  { id: 'rain', name: 'Gentle Rain', icon: <CloudRain className="w-5 h-5" /> },
  { id: 'waves', name: 'Ocean Waves', icon: <Waves className="w-5 h-5" /> },
  { id: 'forest', name: 'Forest', icon: <TreeDeciduous className="w-5 h-5" /> },
  { id: 'cafe', name: 'Cafe Murmur', icon: <Coffee className="w-5 h-5" /> },
  { id: 'wind', name: 'Soft Wind', icon: <Wind className="w-5 h-5" /> },
];

const DEFAULT_SCHEDULE: ScheduleItem[] = [
  { id: 's1', title: 'Wake up & stretch', icon: 'sun', timeEstimate: 10, order: 0, completed: false },
  { id: 's2', title: 'Take medications', icon: 'pill', timeEstimate: 5, order: 1, completed: false },
  { id: 's3', title: 'Breakfast', icon: 'food', timeEstimate: 20, order: 2, completed: false },
  { id: 's4', title: 'Hygiene routine', icon: 'sparkle', timeEstimate: 15, order: 3, completed: false },
  { id: 's5', title: 'Check messages', icon: 'message', timeEstimate: 10, order: 4, completed: false },
];

const BURNOUT_SIGNS: BurnoutIndicator[] = [
  // Physical
  { id: 'b1', text: 'Exhausted even after rest', category: 'physical', checked: false },
  { id: 'b2', text: 'Increased pain or tension', category: 'physical', checked: false },
  { id: 'b3', text: 'Sleep is off (too much or too little)', category: 'physical', checked: false },
  { id: 'b4', text: 'Appetite changes', category: 'physical', checked: false },
  // Emotional
  { id: 'b5', text: 'Feeling numb or detached', category: 'emotional', checked: false },
  { id: 'b6', text: 'Irritability at small things', category: 'emotional', checked: false },
  { id: 'b7', text: 'Crying more than usual', category: 'emotional', checked: false },
  { id: 'b8', text: 'Feeling hopeless about tasks', category: 'emotional', checked: false },
  // Cognitive
  { id: 'b9', text: 'Brain fog is worse', category: 'cognitive', checked: false },
  { id: 'b10', text: 'Forgetting basic things', category: 'cognitive', checked: false },
  { id: 'b11', text: 'Cannot make simple decisions', category: 'cognitive', checked: false },
  { id: 'b12', text: 'Words are hard to find', category: 'cognitive', checked: false },
  // Social
  { id: 'b13', text: 'Avoiding people', category: 'social', checked: false },
  { id: 'b14', text: 'Masking feels impossible', category: 'social', checked: false },
  { id: 'b15', text: 'Social battery at zero', category: 'social', checked: false },
  { id: 'b16', text: 'Everything feels like too much', category: 'social', checked: false },
];

const QUICK_DECISIONS = [
  {
    category: 'What to eat',
    options: ['Toast with peanut butter', 'Yogurt with fruit', 'Cheese and crackers', 'Smoothie', 'Leftovers'],
  },
  {
    category: 'What to wear',
    options: ['Comfy clothes', 'Yesterday outfit (if clean)', 'All black', 'Favorite soft shirt', 'Whatever is on top'],
  },
  {
    category: 'What to do',
    options: ['Rest and stim', 'Easy creative task', 'Watch comfort show', 'Listen to music', 'Do nothing (valid!)'],
  },
  {
    category: 'What to watch',
    options: ['Comfort rewatch', 'Short videos', 'Nature documentary', 'Animation', 'Music videos'],
  },
];

const RECOVERY_RECOMMENDATIONS = [
  { level: 'mild', suggestions: ['Take extra breaks today', 'Reduce social obligations', 'Do only essential tasks', 'Allow extra rest time'] },
  { level: 'moderate', suggestions: ['Cancel non-essential plans', 'Ask for help with tasks', 'Minimal masking today', 'Extra sensory accommodations', 'Comfort foods and activities'] },
  { level: 'severe', suggestions: ['Complete rest if possible', 'Reach out to support person', 'No demands on yourself', 'Dark, quiet space', 'Recovery may take days - be patient'] },
];

// ===== COMPONENT =====
const CognitiveSupport: React.FC = () => {
  // State
  const [viewMode, setViewMode] = useState<ViewMode>('home');
  const [hapticEnabled, setHapticEnabled] = useState(true);

  // Task Chunking State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);

  // Body Doubling State
  const [bodyDoublingActive, setBodyDoublingActive] = useState(false);
  const [sessionMinutes, setSessionMinutes] = useState(25);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [selectedSound, setSelectedSound] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Visual Schedule State
  const [schedule, setSchedule] = useState<ScheduleItem[]>(DEFAULT_SCHEDULE);
  const [currentStep, setCurrentStep] = useState(0);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  // Memory Aids State
  const [memoryNotes, setMemoryNotes] = useState<MemoryNote[]>([]);
  const [newNote, setNewNote] = useState('');
  const [newNoteType, setNewNoteType] = useState<'note' | 'location' | 'reminder' | 'important'>('note');
  const [newNoteLocation, setNewNoteLocation] = useState('');

  // Hyperfocus State
  const [hyperfocusActive, setHyperfocusActive] = useState(false);
  const [lastBreakTime, setLastBreakTime] = useState<Date | null>(null);
  const [lastWaterTime, setLastWaterTime] = useState<Date | null>(null);
  const [lastFoodTime, setLastFoodTime] = useState<Date | null>(null);
  const [hyperfocusMinutes, setHyperfocusMinutes] = useState(0);

  // Burnout State
  const [burnoutSigns, setBurnoutSigns] = useState<BurnoutIndicator[]>(BURNOUT_SIGNS);

  // Refs
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const hyperfocusRef = useRef<NodeJS.Timeout | null>(null);

  // Load data from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem('cognitive-tasks');
    const savedNotes = localStorage.getItem('cognitive-notes');
    const savedSchedule = localStorage.getItem('cognitive-schedule');
    const savedSessions = localStorage.getItem('cognitive-sessions');

    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedNotes) setMemoryNotes(JSON.parse(savedNotes));
    if (savedSchedule) setSchedule(JSON.parse(savedSchedule));
    if (savedSessions) setSessionsCompleted(parseInt(savedSessions));
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('cognitive-tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('cognitive-notes', JSON.stringify(memoryNotes));
  }, [memoryNotes]);

  useEffect(() => {
    localStorage.setItem('cognitive-schedule', JSON.stringify(schedule));
  }, [schedule]);

  useEffect(() => {
    localStorage.setItem('cognitive-sessions', sessionsCompleted.toString());
  }, [sessionsCompleted]);

  // Haptic feedback
  const triggerHaptic = useCallback((intensity: 'light' | 'medium' | 'heavy' = 'medium') => {
    if (!hapticEnabled || !navigator.vibrate) return;
    const patterns = { light: [30], medium: [60], heavy: [120] };
    navigator.vibrate(patterns[intensity]);
  }, [hapticEnabled]);

  // Body Doubling Timer Logic
  useEffect(() => {
    if (bodyDoublingActive && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setBodyDoublingActive(false);
            setSessionsCompleted((s) => s + 1);
            triggerHaptic('heavy');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [bodyDoublingActive, triggerHaptic]);

  // Hyperfocus tracking
  useEffect(() => {
    if (hyperfocusActive) {
      hyperfocusRef.current = setInterval(() => {
        setHyperfocusMinutes((prev) => prev + 1);
      }, 60000); // Every minute
    }
    return () => {
      if (hyperfocusRef.current) clearInterval(hyperfocusRef.current);
    };
  }, [hyperfocusActive]);

  const startBodyDoubling = () => {
    setTimeRemaining(sessionMinutes * 60);
    setBodyDoublingActive(true);
    triggerHaptic('medium');
  };

  const pauseBodyDoubling = () => {
    setBodyDoublingActive(false);
    triggerHaptic('light');
  };

  const resetBodyDoubling = () => {
    setBodyDoublingActive(false);
    setTimeRemaining(0);
    triggerHaptic('light');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Task functions
  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: newTaskTitle,
      steps: [],
      createdAt: new Date(),
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
    setShowAddTask(false);
    setActiveTaskId(newTask.id);
    triggerHaptic('medium');
  };

  const addStep = (taskId: string, stepText: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          steps: [...task.steps, {
            id: `step-${Date.now()}`,
            text: stepText,
            completed: false,
          }],
        };
      }
      return task;
    }));
    triggerHaptic('light');
  };

  const toggleStep = (taskId: string, stepId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          steps: task.steps.map(step =>
            step.id === stepId ? { ...step, completed: !step.completed } : step
          ),
        };
      }
      return task;
    }));
    triggerHaptic('light');
  };

  // Memory functions
  const addMemoryNote = () => {
    if (!newNote.trim()) return;
    const note: MemoryNote = {
      id: `note-${Date.now()}`,
      text: newNote,
      type: newNoteType,
      createdAt: new Date(),
      location: newNoteType === 'location' ? newNoteLocation : undefined,
    };
    setMemoryNotes([note, ...memoryNotes]);
    setNewNote('');
    setNewNoteLocation('');
    triggerHaptic('medium');
  };

  const deleteNote = (id: string) => {
    setMemoryNotes(memoryNotes.filter(n => n.id !== id));
    triggerHaptic('light');
  };

  // Schedule functions
  const toggleScheduleItem = (id: string) => {
    const index = schedule.findIndex(s => s.id === id);
    setSchedule(schedule.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
    if (!schedule[index].completed) {
      setCurrentStep(Math.min(index + 1, schedule.length - 1));
    }
    triggerHaptic('medium');
  };

  const handleDragStart = (id: string) => {
    setDraggedItem(id);
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedItem || draggedItem === targetId) return;

    const newSchedule = [...schedule];
    const draggedIndex = newSchedule.findIndex(s => s.id === draggedItem);
    const targetIndex = newSchedule.findIndex(s => s.id === targetId);

    const [removed] = newSchedule.splice(draggedIndex, 1);
    newSchedule.splice(targetIndex, 0, removed);

    setSchedule(newSchedule.map((item, index) => ({ ...item, order: index })));
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    triggerHaptic('light');
  };

  // Decision functions
  const pickRandom = (category: string) => {
    const cat = QUICK_DECISIONS.find(c => c.category === category);
    if (!cat) return '';
    const random = cat.options[Math.floor(Math.random() * cat.options.length)];
    triggerHaptic('medium');
    return random;
  };

  // Burnout calculation
  const getBurnoutLevel = () => {
    const checked = burnoutSigns.filter(s => s.checked).length;
    if (checked <= 3) return { level: 'mild', color: 'from-yellow-500', percentage: (checked / 16) * 100 };
    if (checked <= 8) return { level: 'moderate', color: 'from-orange-500', percentage: (checked / 16) * 100 };
    return { level: 'severe', color: 'from-red-500', percentage: (checked / 16) * 100 };
  };

  const toggleBurnoutSign = (id: string) => {
    setBurnoutSigns(burnoutSigns.map(sign =>
      sign.id === id ? { ...sign, checked: !sign.checked } : sign
    ));
    triggerHaptic('light');
  };

  const getScheduleIcon = (iconName: string) => {
    switch (iconName) {
      case 'sun': return <Sun className="w-5 h-5" />;
      case 'pill': return <Heart className="w-5 h-5" />;
      case 'food': return <UtensilsCrossed className="w-5 h-5" />;
      case 'sparkle': return <Sparkles className="w-5 h-5" />;
      case 'message': return <StickyNote className="w-5 h-5" />;
      default: return <Star className="w-5 h-5" />;
    }
  };

  // ===== RENDER HELPERS =====
  const renderHome = () => (
    <div className="space-y-4">
      <div className="text-center mb-8">
        <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-violet-600/30 to-purple-700/30 border border-violet-500/30 mb-4 animate-pulse" style={{ animationDuration: '3s' }}>
          <Brain className="w-8 h-8 text-violet-400" />
        </div>
        <h2 className="text-2xl font-light text-violet-100 mb-2">Cognitive Support</h2>
        <p className="text-violet-400/80 text-sm">Tools designed for your beautiful brain</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { mode: 'chunking' as ViewMode, icon: <ListChecks className="w-6 h-6" />, label: 'Task Chunks', sublabel: 'Break it down', color: 'from-fuchsia-500/20 to-pink-500/20' },
          { mode: 'bodyDoubling' as ViewMode, icon: <Users className="w-6 h-6" />, label: 'Body Double', sublabel: 'Focus together', color: 'from-cyan-500/20 to-blue-500/20' },
          { mode: 'schedule' as ViewMode, icon: <Calendar className="w-6 h-6" />, label: 'Visual Schedule', sublabel: 'See your day', color: 'from-amber-500/20 to-orange-500/20' },
          { mode: 'memory' as ViewMode, icon: <Lightbulb className="w-6 h-6" />, label: 'Memory Aids', sublabel: 'Capture thoughts', color: 'from-emerald-500/20 to-teal-500/20' },
          { mode: 'decisions' as ViewMode, icon: <Shuffle className="w-6 h-6" />, label: 'Decisions', sublabel: 'Let me choose', color: 'from-rose-500/20 to-red-500/20' },
          { mode: 'hyperfocus' as ViewMode, icon: <Target className="w-6 h-6" />, label: 'Hyperfocus', sublabel: 'Stay safe', color: 'from-indigo-500/20 to-violet-500/20' },
        ].map(({ mode, icon, label, sublabel, color }) => (
          <button
            key={mode}
            onClick={() => { setViewMode(mode); triggerHaptic('light'); }}
            className={`p-5 rounded-2xl bg-gradient-to-br ${color} border border-violet-700/30 hover:border-violet-500/50 transition-all duration-500 text-left group hover:scale-[1.02] active:scale-[0.98]`}
          >
            <div className="text-violet-300 group-hover:text-violet-200 transition-colors mb-2 group-hover:animate-bounce" style={{ animationDuration: '1s', animationIterationCount: '1' }}>{icon}</div>
            <div className="text-violet-100 font-medium">{label}</div>
            <div className="text-violet-400/70 text-xs">{sublabel}</div>
          </button>
        ))}
      </div>

      {/* Burnout Check Button */}
      <button
        onClick={() => { setViewMode('burnout'); triggerHaptic('medium'); }}
        className="w-full mt-6 p-4 rounded-2xl bg-gradient-to-r from-violet-900/40 to-purple-900/40 border border-violet-600/30 hover:border-violet-500/50 transition-all duration-500 group"
      >
        <div className="flex items-center justify-center gap-3">
          <Battery className="w-5 h-5 text-violet-400 group-hover:text-violet-300" />
          <span className="text-violet-200 font-medium">Burnout Check</span>
        </div>
        <p className="text-violet-400/60 text-xs mt-1 text-center">How are you really doing?</p>
      </button>

      {/* Quick Stats */}
      {sessionsCompleted > 0 && (
        <div className="mt-6 p-4 rounded-xl bg-violet-900/30 border border-violet-700/30">
          <div className="flex items-center justify-center gap-2 text-violet-300">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="text-sm">{sessionsCompleted} focus sessions completed!</span>
          </div>
        </div>
      )}
    </div>
  );

  const renderTaskChunking = () => {
    const activeTask = tasks.find(t => t.id === activeTaskId);
    const completedSteps = activeTask?.steps.filter(s => s.completed).length || 0;
    const totalSteps = activeTask?.steps.length || 0;
    const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

    return (
      <div className="space-y-4">
        {!activeTask ? (
          <>
            <div className="text-center mb-6">
              <h2 className="text-xl font-light text-violet-100 mb-2">Task Chunking</h2>
              <p className="text-violet-400/80 text-sm">Big task? Break it into tiny wins!</p>
            </div>

            {/* Existing Tasks */}
            {tasks.length > 0 && (
              <div className="space-y-2 mb-4">
                {tasks.filter(t => !t.completedAt).map(task => (
                  <button
                    key={task.id}
                    onClick={() => { setActiveTaskId(task.id); triggerHaptic('light'); }}
                    className="w-full p-4 rounded-xl bg-violet-900/40 border border-violet-700/30 hover:border-violet-500/50 transition-all text-left flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-violet-200 font-medium">{task.title}</div>
                      <div className="text-violet-400/60 text-xs">{task.steps.length} steps</div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-violet-500 group-hover:text-violet-300 transition-colors" />
                  </button>
                ))}
              </div>
            )}

            {/* Add New Task */}
            {showAddTask ? (
              <div className="p-4 rounded-xl bg-violet-900/40 border border-violet-600/40 space-y-3">
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="What big task feels overwhelming?"
                  className="w-full px-4 py-3 bg-violet-950/50 rounded-xl border border-violet-700/40 text-violet-100 placeholder-violet-500/50 focus:outline-none focus:border-violet-500/60"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={addTask}
                    className="flex-1 py-2 rounded-xl bg-violet-600/60 text-violet-100 font-medium hover:bg-violet-500/60 transition-colors"
                  >
                    Create Task
                  </button>
                  <button
                    onClick={() => { setShowAddTask(false); setNewTaskTitle(''); }}
                    className="px-4 py-2 rounded-xl bg-violet-800/40 text-violet-400 hover:text-violet-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAddTask(true)}
                className="w-full p-4 rounded-xl border-2 border-dashed border-violet-700/40 hover:border-violet-500/50 text-violet-400 hover:text-violet-300 transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add a task to chunk
              </button>
            )}
          </>
        ) : (
          <div className="space-y-4">
            {/* Task Header */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setActiveTaskId(null)}
                className="p-2 rounded-xl bg-violet-900/50 text-violet-400 hover:text-violet-300 transition-colors"
              >
                <ChevronRight className="w-5 h-5 rotate-180" />
              </button>
              <h2 className="text-lg font-medium text-violet-200 flex-1 text-center px-4 truncate">
                {activeTask.title}
              </h2>
              <div className="w-9" /> {/* Spacer */}
            </div>

            {/* Progress Bar */}
            <div className="relative">
              <div className="h-3 bg-violet-950/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-fuchsia-500 to-violet-500 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-2 text-center text-violet-400 text-sm">
                {completedSteps}/{totalSteps} steps done
              </div>
            </div>

            {/* Current Step Focus - Show only uncompleted step */}
            {activeTask.steps.length > 0 && (
              <div className="space-y-2">
                {activeTask.steps.filter(s => !s.completed).slice(0, 1).map((step) => (
                  <div
                    key={step.id}
                    className="p-6 rounded-2xl bg-gradient-to-br from-violet-600/30 to-fuchsia-600/30 border-2 border-violet-500/50 animate-pulse"
                    style={{ animationDuration: '2s' }}
                  >
                    <div className="text-center mb-4">
                      <Target className="w-8 h-8 text-violet-300 mx-auto mb-2" />
                      <p className="text-violet-100 text-lg font-medium">Focus on this:</p>
                    </div>
                    <p className="text-xl text-white text-center font-light mb-4">{step.text}</p>
                    <button
                      onClick={() => toggleStep(activeTask.id, step.id)}
                      className="w-full py-4 rounded-xl bg-violet-500/60 text-white font-medium hover:bg-violet-400/60 transition-all flex items-center justify-center gap-2 text-lg"
                    >
                      <Check className="w-6 h-6" />
                      Done with this step!
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* All Steps Toggle */}
            <details className="bg-violet-900/30 rounded-xl border border-violet-700/30 overflow-hidden">
              <summary className="p-4 cursor-pointer list-none flex items-center justify-between text-violet-300 hover:text-violet-200">
                <span>View all steps</span>
                <ChevronDown className="w-5 h-5" />
              </summary>
              <div className="p-4 pt-0 space-y-2">
                {activeTask.steps.map((step, index) => (
                  <div
                    key={step.id}
                    onClick={() => toggleStep(activeTask.id, step.id)}
                    className={`p-3 rounded-xl flex items-center gap-3 cursor-pointer transition-all ${
                      step.completed
                        ? 'bg-violet-700/20 text-violet-400 line-through'
                        : 'bg-violet-800/40 text-violet-200 hover:bg-violet-700/40'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      step.completed
                        ? 'bg-violet-500 border-violet-500'
                        : 'border-violet-500/50'
                    }`}>
                      {step.completed && <Check className="w-4 h-4 text-white" />}
                    </div>
                    <span className="text-sm">{index + 1}. {step.text}</span>
                  </div>
                ))}
              </div>
            </details>

            {/* Add Step */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add a tiny step..."
                className="flex-1 px-4 py-3 bg-violet-950/50 rounded-xl border border-violet-700/40 text-violet-100 placeholder-violet-500/50 focus:outline-none focus:border-violet-500/60 text-sm"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    addStep(activeTask.id, e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
              <button
                onClick={(e) => {
                  const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                  if (input.value.trim()) {
                    addStep(activeTask.id, input.value);
                    input.value = '';
                  }
                }}
                className="px-4 py-2 rounded-xl bg-violet-600/60 text-violet-100 hover:bg-violet-500/60 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* Completion Celebration */}
            {totalSteps > 0 && completedSteps === totalSteps && (
              <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-center">
                <Sparkles className="w-12 h-12 text-amber-400 mx-auto mb-3 animate-bounce" />
                <p className="text-2xl text-amber-200 font-medium mb-2">Amazing work!</p>
                <p className="text-amber-300/70 text-sm">You completed all the steps!</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderBodyDoubling = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-light text-violet-100 mb-2">Body Doubling Mode</h2>
        <p className="text-violet-400/80 text-sm">You are not alone. Someone is here with you.</p>
      </div>

      {/* Presence Indicator */}
      <div className="relative p-8 rounded-3xl bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border border-cyan-500/30 text-center">
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${bodyDoublingActive ? 'bg-green-400 animate-pulse' : 'bg-violet-500/50'}`} />
          <span className="text-xs text-violet-400">{bodyDoublingActive ? 'Active' : 'Ready'}</span>
        </div>

        <div className={`inline-flex p-6 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 mb-4 ${bodyDoublingActive ? 'animate-pulse' : ''}`} style={{ animationDuration: '2s' }}>
          <Users className="w-12 h-12 text-cyan-400" />
        </div>

        <p className="text-cyan-200 text-lg font-light mb-2">
          {bodyDoublingActive ? 'Working together...' : 'Ready when you are'}
        </p>

        {/* Timer Display */}
        <div className="text-5xl font-light text-white my-6 font-mono tracking-wider">
          {timeRemaining > 0 ? formatTime(timeRemaining) : formatTime(sessionMinutes * 60)}
        </div>

        {/* Session Length Selector */}
        {!bodyDoublingActive && timeRemaining === 0 && (
          <div className="flex justify-center gap-2 mb-6 flex-wrap">
            {[15, 25, 45, 60].map((mins) => (
              <button
                key={mins}
                onClick={() => { setSessionMinutes(mins); triggerHaptic('light'); }}
                className={`px-4 py-2 rounded-xl text-sm transition-all ${
                  sessionMinutes === mins
                    ? 'bg-cyan-500/40 text-cyan-200 border border-cyan-400/50'
                    : 'bg-violet-900/40 text-violet-400 border border-violet-700/30 hover:border-violet-500/50'
                }`}
              >
                {mins} min
              </button>
            ))}
          </div>
        )}

        {/* Controls */}
        <div className="flex justify-center gap-4">
          {!bodyDoublingActive ? (
            <button
              onClick={startBodyDoubling}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500/60 to-blue-500/60 text-white font-medium hover:from-cyan-400/60 hover:to-blue-400/60 transition-all text-lg"
            >
              <Play className="w-6 h-6" />
              Start Session
            </button>
          ) : (
            <>
              <button
                onClick={pauseBodyDoubling}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-800/50 text-violet-200 font-medium hover:bg-violet-700/50 transition-all"
              >
                <Pause className="w-5 h-5" />
                Pause
              </button>
              <button
                onClick={resetBodyDoubling}
                className="p-3 rounded-xl bg-violet-900/50 text-violet-400 hover:text-violet-300 transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Ambient Sounds */}
      <div className="p-4 rounded-xl bg-violet-900/30 border border-violet-700/30">
        <div className="flex items-center justify-between mb-4">
          <span className="text-violet-200 font-medium">Ambient Sounds</span>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-lg transition-colors ${soundEnabled ? 'bg-violet-600/40 text-violet-200' : 'bg-violet-900/50 text-violet-500'}`}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {AMBIENT_SOUNDS.map((sound) => (
            <button
              key={sound.id}
              onClick={() => { setSelectedSound(sound.id === selectedSound ? null : sound.id); triggerHaptic('light'); }}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all ${
                selectedSound === sound.id
                  ? 'bg-violet-600/40 text-violet-200 border border-violet-500/50'
                  : 'bg-violet-800/30 text-violet-400 border border-violet-700/30 hover:border-violet-600/40'
              }`}
            >
              {sound.icon}
              {sound.name}
            </button>
          ))}
        </div>
      </div>

      {/* Session Stats */}
      <div className="p-4 rounded-xl bg-violet-900/30 border border-violet-700/30 text-center">
        <div className="flex items-center justify-center gap-2 text-violet-300">
          <Award className="w-5 h-5 text-amber-400" />
          <span>{sessionsCompleted} sessions completed today</span>
        </div>
      </div>
    </div>
  );

  const renderVisualSchedule = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-light text-violet-100 mb-2">Visual Schedule</h2>
        <p className="text-violet-400/80 text-sm">Drag to reorder. Tap to complete.</p>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-violet-400 mb-2">
          <span>Progress</span>
          <span>{schedule.filter(s => s.completed).length}/{schedule.length}</span>
        </div>
        <div className="h-2 bg-violet-950/60 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
            style={{ width: `${(schedule.filter(s => s.completed).length / schedule.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Schedule Items */}
      <div className="space-y-2">
        {schedule.sort((a, b) => a.order - b.order).map((item, index) => (
          <div
            key={item.id}
            draggable
            onDragStart={() => handleDragStart(item.id)}
            onDragOver={(e) => handleDragOver(e, item.id)}
            onDragEnd={handleDragEnd}
            onClick={() => toggleScheduleItem(item.id)}
            className={`p-4 rounded-xl flex items-center gap-4 cursor-pointer transition-all ${
              item.completed
                ? 'bg-violet-800/20 border border-violet-700/20'
                : index === currentStep
                ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-2 border-amber-500/50 scale-[1.02]'
                : 'bg-violet-900/40 border border-violet-700/30 hover:border-violet-600/40'
            } ${draggedItem === item.id ? 'opacity-50' : ''}`}
          >
            <div className="cursor-grab active:cursor-grabbing text-violet-500/50">
              <GripVertical className="w-5 h-5" />
            </div>
            <div className={`p-3 rounded-xl ${item.completed ? 'bg-violet-700/20 text-violet-500' : 'bg-violet-800/50 text-violet-300'}`}>
              {getScheduleIcon(item.icon)}
            </div>
            <div className="flex-1">
              <div className={`font-medium ${item.completed ? 'text-violet-500 line-through' : 'text-violet-200'}`}>
                {item.title}
              </div>
              <div className="text-violet-500/60 text-xs flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {item.timeEstimate} min
              </div>
            </div>
            <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors ${
              item.completed
                ? 'bg-violet-500 border-violet-500'
                : 'border-violet-500/50'
            }`}>
              {item.completed && <Check className="w-4 h-4 text-white" />}
            </div>
          </div>
        ))}
      </div>

      {/* Total Time */}
      <div className="text-center text-violet-400/70 text-sm">
        Total: {schedule.reduce((sum, item) => sum + item.timeEstimate, 0)} min
        {' | '}
        Remaining: {schedule.filter(s => !s.completed).reduce((sum, item) => sum + item.timeEstimate, 0)} min
      </div>
    </div>
  );

  const renderMemoryAids = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-light text-violet-100 mb-2">Memory Aids</h2>
        <p className="text-violet-400/80 text-sm">Capture it before it floats away</p>
      </div>

      {/* Quick Add */}
      <div className="p-4 rounded-xl bg-violet-900/40 border border-violet-600/40 space-y-3">
        <div className="flex gap-2 flex-wrap">
          {[
            { type: 'note' as const, icon: <StickyNote className="w-4 h-4" />, label: 'Note' },
            { type: 'location' as const, icon: <MapPin className="w-4 h-4" />, label: 'Where?' },
            { type: 'reminder' as const, icon: <Timer className="w-4 h-4" />, label: 'Reminder' },
            { type: 'important' as const, icon: <Star className="w-4 h-4" />, label: 'Important' },
          ].map(({ type, icon, label }) => (
            <button
              key={type}
              onClick={() => { setNewNoteType(type); triggerHaptic('light'); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
                newNoteType === type
                  ? 'bg-violet-600/50 text-violet-200'
                  : 'bg-violet-800/40 text-violet-400 hover:text-violet-300'
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder={newNoteType === 'location' ? "What did you put somewhere?" : "Quick thought..."}
          className="w-full px-4 py-3 bg-violet-950/50 rounded-xl border border-violet-700/40 text-violet-100 placeholder-violet-500/50 focus:outline-none focus:border-violet-500/60"
        />

        {newNoteType === 'location' && (
          <input
            type="text"
            value={newNoteLocation}
            onChange={(e) => setNewNoteLocation(e.target.value)}
            placeholder="Where did you put it?"
            className="w-full px-4 py-3 bg-violet-950/50 rounded-xl border border-violet-700/40 text-violet-100 placeholder-violet-500/50 focus:outline-none focus:border-violet-500/60"
          />
        )}

        <button
          onClick={addMemoryNote}
          disabled={!newNote.trim()}
          className="w-full py-3 rounded-xl bg-violet-600/60 text-violet-100 font-medium hover:bg-violet-500/60 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Save
        </button>
      </div>

      {/* Notes List */}
      <div className="space-y-2">
        {memoryNotes.length === 0 ? (
          <div className="text-center py-8 text-violet-400/60">
            <Lightbulb className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p>No notes yet</p>
            <p className="text-xs">Capture thoughts before they disappear!</p>
          </div>
        ) : (
          memoryNotes.map((note) => (
            <div
              key={note.id}
              className={`p-4 rounded-xl border flex gap-3 ${
                note.type === 'important'
                  ? 'bg-amber-900/20 border-amber-500/30'
                  : note.type === 'location'
                  ? 'bg-emerald-900/20 border-emerald-500/30'
                  : note.type === 'reminder'
                  ? 'bg-rose-900/20 border-rose-500/30'
                  : 'bg-violet-900/30 border-violet-700/30'
              }`}
            >
              <div className={`p-2 rounded-lg ${
                note.type === 'important' ? 'bg-amber-500/20 text-amber-400' :
                note.type === 'location' ? 'bg-emerald-500/20 text-emerald-400' :
                note.type === 'reminder' ? 'bg-rose-500/20 text-rose-400' :
                'bg-violet-500/20 text-violet-400'
              }`}>
                {note.type === 'important' ? <Star className="w-5 h-5" /> :
                 note.type === 'location' ? <MapPin className="w-5 h-5" /> :
                 note.type === 'reminder' ? <Timer className="w-5 h-5" /> :
                 <StickyNote className="w-5 h-5" />}
              </div>
              <div className="flex-1">
                <p className="text-violet-200">{note.text}</p>
                {note.location && (
                  <p className="text-emerald-400/80 text-sm mt-1 flex items-center gap-1">
                    <ArrowRight className="w-3 h-3" />
                    {note.location}
                  </p>
                )}
                <p className="text-violet-500/50 text-xs mt-1">
                  {new Date(note.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => deleteNote(note.id)}
                className="p-1 text-violet-500/50 hover:text-violet-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderDecisions = () => {
    const [decisions, setDecisions] = useState<Record<string, string>>({});

    return (
      <div className="space-y-4">
        <div className="text-center mb-6">
          <h2 className="text-xl font-light text-violet-100 mb-2">Decision Helper</h2>
          <p className="text-violet-400/80 text-sm">Too many choices? Let me help.</p>
        </div>

        {/* Pick For Me - All Categories */}
        <button
          onClick={() => {
            const newDecisions: Record<string, string> = {};
            QUICK_DECISIONS.forEach(cat => {
              newDecisions[cat.category] = cat.options[Math.floor(Math.random() * cat.options.length)];
            });
            setDecisions(newDecisions);
            triggerHaptic('heavy');
          }}
          className="w-full p-5 rounded-2xl bg-gradient-to-r from-rose-500/30 to-pink-500/30 border border-rose-500/40 hover:border-rose-400/50 transition-all text-center"
        >
          <Shuffle className="w-8 h-8 text-rose-300 mx-auto mb-2 animate-bounce" style={{ animationDuration: '1.5s' }} />
          <span className="text-rose-100 font-medium text-lg">Just Pick Everything For Me</span>
          <p className="text-rose-300/60 text-xs mt-1">I cannot decide anything right now</p>
        </button>

        {/* Category Decisions */}
        <div className="space-y-3">
          {QUICK_DECISIONS.map((category) => (
            <div key={category.category} className="p-4 rounded-xl bg-violet-900/40 border border-violet-700/30">
              <div className="flex items-center justify-between mb-3">
                <span className="text-violet-200 font-medium">{category.category}</span>
                <button
                  onClick={() => {
                    setDecisions(prev => ({
                      ...prev,
                      [category.category]: pickRandom(category.category),
                    }));
                  }}
                  className="px-3 py-1.5 rounded-lg bg-violet-600/40 text-violet-200 text-sm hover:bg-violet-500/40 transition-colors flex items-center gap-1"
                >
                  <Shuffle className="w-4 h-4" />
                  Pick
                </button>
              </div>

              {decisions[category.category] ? (
                <div className="p-4 rounded-xl bg-gradient-to-r from-violet-600/30 to-fuchsia-600/30 border border-violet-500/40 text-center">
                  <p className="text-white text-lg font-light">{decisions[category.category]}</p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {category.options.map((option, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setDecisions(prev => ({ ...prev, [category.category]: option }));
                        triggerHaptic('light');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-violet-800/40 text-violet-300 text-sm hover:bg-violet-700/40 transition-colors"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Clear All */}
        {Object.keys(decisions).length > 0 && (
          <button
            onClick={() => { setDecisions({}); triggerHaptic('light'); }}
            className="w-full py-3 text-violet-500 hover:text-violet-400 transition-colors text-sm"
          >
            Clear all decisions
          </button>
        )}
      </div>
    );
  };

  const renderHyperfocus = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-light text-violet-100 mb-2">Hyperfocus Protection</h2>
        <p className="text-violet-400/80 text-sm">Stay in flow, stay alive</p>
      </div>

      {/* Status Card */}
      <div className={`p-6 rounded-2xl border text-center ${
        hyperfocusActive
          ? 'bg-gradient-to-br from-indigo-900/40 to-violet-900/40 border-indigo-500/40'
          : 'bg-violet-900/30 border-violet-700/30'
      }`}>
        <div className={`inline-flex p-4 rounded-full mb-4 ${
          hyperfocusActive
            ? 'bg-indigo-500/20 text-indigo-300 animate-pulse'
            : 'bg-violet-800/40 text-violet-400'
        }`} style={{ animationDuration: '2s' }}>
          <Target className="w-10 h-10" />
        </div>

        <div className="mb-4">
          <p className="text-violet-200 text-lg">
            {hyperfocusActive ? 'Hyperfocus Mode Active' : 'Not tracking hyperfocus'}
          </p>
          {hyperfocusActive && (
            <p className="text-indigo-300 text-2xl font-light mt-2">
              {hyperfocusMinutes} minutes deep
            </p>
          )}
        </div>

        <button
          onClick={() => {
            setHyperfocusActive(!hyperfocusActive);
            if (!hyperfocusActive) {
              setHyperfocusMinutes(0);
              setLastBreakTime(new Date());
              setLastWaterTime(new Date());
              setLastFoodTime(new Date());
            }
            triggerHaptic('medium');
          }}
          className={`px-6 py-3 rounded-xl font-medium transition-all ${
            hyperfocusActive
              ? 'bg-violet-700/50 text-violet-200 hover:bg-violet-600/50'
              : 'bg-indigo-500/60 text-white hover:bg-indigo-400/60'
          }`}
        >
          {hyperfocusActive ? 'End Hyperfocus' : 'Start Tracking'}
        </button>
      </div>

      {/* Reminders */}
      <div className="space-y-3">
        <h3 className="text-violet-300 font-medium">Quick Check-Ins</h3>

        {[
          {
            id: 'break',
            icon: <Coffee className="w-5 h-5" />,
            label: 'Take a break',
            question: 'When did you last move?',
            lastTime: lastBreakTime,
            setTime: setLastBreakTime,
            color: 'from-amber-500/20 to-orange-500/20',
            borderColor: 'border-amber-500/40',
          },
          {
            id: 'water',
            icon: <Droplets className="w-5 h-5" />,
            label: 'Drink water',
            question: 'Have you had water?',
            lastTime: lastWaterTime,
            setTime: setLastWaterTime,
            color: 'from-cyan-500/20 to-blue-500/20',
            borderColor: 'border-cyan-500/40',
          },
          {
            id: 'food',
            icon: <UtensilsCrossed className="w-5 h-5" />,
            label: 'Eat something',
            question: 'Have you eaten?',
            lastTime: lastFoodTime,
            setTime: setLastFoodTime,
            color: 'from-emerald-500/20 to-teal-500/20',
            borderColor: 'border-emerald-500/40',
          },
        ].map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-xl bg-gradient-to-r ${item.color} border ${item.borderColor} flex items-center gap-4`}
          >
            <div className="p-3 rounded-xl bg-violet-900/50">{item.icon}</div>
            <div className="flex-1">
              <p className="text-violet-200 font-medium">{item.question}</p>
              {item.lastTime && (
                <p className="text-violet-400/70 text-xs">
                  Last: {Math.round((Date.now() - item.lastTime.getTime()) / 60000)} min ago
                </p>
              )}
            </div>
            <button
              onClick={() => { item.setTime(new Date()); triggerHaptic('light'); }}
              className="px-4 py-2 rounded-xl bg-violet-700/50 text-violet-200 text-sm hover:bg-violet-600/50 transition-colors"
            >
              Done!
            </button>
          </div>
        ))}
      </div>

      {/* Gentle Message */}
      <div className="p-4 rounded-xl bg-violet-900/30 border border-violet-700/30 text-center">
        <p className="text-violet-300/80 text-sm italic">
          "Your work will still be there after you take care of yourself."
        </p>
      </div>
    </div>
  );

  const renderBurnout = () => {
    const burnoutLevel = getBurnoutLevel();
    const checkedCount = burnoutSigns.filter(s => s.checked).length;
    const recommendations = RECOVERY_RECOMMENDATIONS.find(r => r.level === burnoutLevel.level)?.suggestions || [];

    return (
      <div className="space-y-4">
        <div className="text-center mb-6">
          <h2 className="text-xl font-light text-violet-100 mb-2">Burnout Check</h2>
          <p className="text-violet-400/80 text-sm">No judgment. Just awareness.</p>
        </div>

        {/* Burnout Meter */}
        <div className="p-6 rounded-2xl bg-violet-900/40 border border-violet-700/30">
          <div className="flex items-center justify-between mb-4">
            <span className="text-violet-300">Burnout Level</span>
            <span className={`px-3 py-1 rounded-full text-sm ${
              burnoutLevel.level === 'mild' ? 'bg-yellow-500/20 text-yellow-300' :
              burnoutLevel.level === 'moderate' ? 'bg-orange-500/20 text-orange-300' :
              'bg-red-500/20 text-red-300'
            }`}>
              {burnoutLevel.level.charAt(0).toUpperCase() + burnoutLevel.level.slice(1)}
            </span>
          </div>

          <div className="h-4 bg-violet-950/60 rounded-full overflow-hidden mb-2">
            <div
              className={`h-full bg-gradient-to-r ${burnoutLevel.color} to-transparent rounded-full transition-all duration-700`}
              style={{ width: `${burnoutLevel.percentage}%` }}
            />
          </div>
          <p className="text-violet-400/60 text-xs text-center">{checkedCount}/16 warning signs</p>
        </div>

        {/* Warning Signs */}
        <div className="space-y-4">
          {(['physical', 'emotional', 'cognitive', 'social'] as const).map((category) => (
            <div key={category} className="p-4 rounded-xl bg-violet-900/30 border border-violet-700/30">
              <h3 className="text-violet-300 font-medium mb-3 capitalize flex items-center gap-2">
                {category === 'physical' && <Heart className="w-4 h-4" />}
                {category === 'emotional' && <Moon className="w-4 h-4" />}
                {category === 'cognitive' && <Brain className="w-4 h-4" />}
                {category === 'social' && <Users className="w-4 h-4" />}
                {category}
              </h3>
              <div className="space-y-2">
                {burnoutSigns.filter(s => s.category === category).map((sign) => (
                  <button
                    key={sign.id}
                    onClick={() => toggleBurnoutSign(sign.id)}
                    className={`w-full p-3 rounded-xl flex items-center gap-3 text-left transition-all ${
                      sign.checked
                        ? 'bg-violet-600/30 border border-violet-500/40'
                        : 'bg-violet-800/30 border border-violet-700/30 hover:border-violet-600/40'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      sign.checked ? 'bg-violet-500 border-violet-500' : 'border-violet-500/50'
                    }`}>
                      {sign.checked && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className={`text-sm ${sign.checked ? 'text-violet-200' : 'text-violet-400'}`}>
                      {sign.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Recommendations */}
        {checkedCount > 0 && (
          <div className={`p-4 rounded-xl border ${
            burnoutLevel.level === 'mild' ? 'bg-yellow-900/20 border-yellow-500/30' :
            burnoutLevel.level === 'moderate' ? 'bg-orange-900/20 border-orange-500/30' :
            'bg-red-900/20 border-red-500/30'
          }`}>
            <h3 className="text-violet-200 font-medium mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Recovery Suggestions
            </h3>
            <ul className="space-y-2">
              {recommendations.map((rec, i) => (
                <li key={i} className="text-violet-300/90 text-sm flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Reset */}
        <button
          onClick={() => {
            setBurnoutSigns(BURNOUT_SIGNS);
            triggerHaptic('light');
          }}
          className="w-full py-3 text-violet-500 hover:text-violet-400 transition-colors text-sm"
        >
          Reset check
        </button>
      </div>
    );
  };

  // ===== MAIN RENDER =====
  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-950 via-purple-950 to-violet-950 text-white">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-fuchsia-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }} />
      </div>

      <div className="relative max-w-lg mx-auto p-6">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            {viewMode !== 'home' && (
              <button
                onClick={() => setViewMode('home')}
                className="p-2 rounded-xl bg-violet-900/50 text-violet-400 hover:text-violet-300 hover:bg-violet-800/50 transition-all"
              >
                <Home className="w-5 h-5" />
              </button>
            )}
            <h1 className="text-xl font-light text-violet-200 flex-1 text-center">
              {viewMode === 'home' && 'Cognitive Support'}
              {viewMode === 'chunking' && 'Task Chunking'}
              {viewMode === 'bodyDoubling' && 'Body Doubling'}
              {viewMode === 'schedule' && 'Visual Schedule'}
              {viewMode === 'memory' && 'Memory Aids'}
              {viewMode === 'decisions' && 'Decision Helper'}
              {viewMode === 'hyperfocus' && 'Hyperfocus Protection'}
              {viewMode === 'burnout' && 'Burnout Check'}
            </h1>
            {viewMode !== 'home' && <div className="w-9" />}
          </div>
        </header>

        {/* Content */}
        <main className="transition-all duration-500">
          {viewMode === 'home' && renderHome()}
          {viewMode === 'chunking' && renderTaskChunking()}
          {viewMode === 'bodyDoubling' && renderBodyDoubling()}
          {viewMode === 'schedule' && renderVisualSchedule()}
          {viewMode === 'memory' && renderMemoryAids()}
          {viewMode === 'decisions' && renderDecisions()}
          {viewMode === 'hyperfocus' && renderHyperfocus()}
          {viewMode === 'burnout' && renderBurnout()}
        </main>
      </div>
    </div>
  );
};

export default CognitiveSupport;
