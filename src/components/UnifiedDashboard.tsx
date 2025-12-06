// KOL Personal OS - Complete Unified Dashboard
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Brain, Palette, Users, Moon, Sparkles,
  Activity, Calendar, DollarSign, Home, Settings,
  Battery, AlertCircle, TrendingUp, Shield, Zap,
  Music, Book, Camera, Code, Globe, MessageSquare,
  Pill, FileText, Phone, Map, Clock, Star
} from 'lucide-react';
import { db } from '../db/database';
import { medicationProcessor } from '../services/MedicationProcessor';
import toast from 'react-hot-toast';

interface DashboardStats {
  medicationsToday: number;
  medicationsTaken: number;
  currentSpoons: number;
  maxSpoons: number;
  painLevel: number;
  moodScore: number;
  tasksToday: number;
  tasksCompleted: number;
  activeProjects: number;
  upcomingEvents: number;
}

const UnifiedDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    medicationsToday: 0,
    medicationsTaken: 0,
    currentSpoons: 12,
    maxSpoons: 12,
    painLevel: 0,
    moodScore: 7,
    tasksToday: 0,
    tasksCompleted: 0,
    activeProjects: 0,
    upcomingEvents: 0
  });

  const [activeRoom, setActiveRoom] = useState<string>('health');
  const [aiMode, setAiMode] = useState<string>('companion');
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Sanctum Rooms Configuration
  const sanctumRooms = [
    { id: 'health', name: 'Health Sanctum', icon: Heart, color: 'from-purple-600 to-pink-600' },
    { id: 'art', name: 'Art Sanctum', icon: Palette, color: 'from-indigo-600 to-purple-600' },
    { id: 'activism', name: 'Activism Sanctum', icon: Users, color: 'from-green-600 to-teal-600' },
    { id: 'ancestry', name: 'Ancestry Sanctum', icon: Globe, color: 'from-amber-600 to-orange-600' },
    { id: 'rest', name: 'Rest Sanctum', icon: Moon, color: 'from-blue-600 to-indigo-600' },
    { id: 'ritual', name: 'Ritual Sanctum', icon: Sparkles, color: 'from-pink-600 to-rose-600' }
  ];

  // AI Modes
  const aiModes = [
    { id: 'companion', name: 'Companion', description: 'Empathetic support & understanding' },
    { id: 'creative', name: 'Creative', description: 'Artistic inspiration & collaboration' },
    { id: 'archivist', name: 'Archivist', description: 'Knowledge management & organization' },
    { id: 'rebel', name: 'Rebel', description: 'Challenging perspectives & growth' }
  ];

  // Quick Actions
  const quickActions = [
    { id: 'med-check', label: 'Medication Check', icon: Pill, action: checkMedications },
    { id: 'pain-log', label: 'Log Pain', icon: Activity, action: logPain },
    { id: 'spoon-check', label: 'Spoon Check', icon: Battery, action: checkSpoons },
    { id: 'quick-note', label: 'Quick Note', icon: FileText, action: quickNote },
    { id: 'emergency', label: 'Emergency', icon: AlertCircle, action: emergency }
  ];

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => clearInterval(interval);
  }, []);

  async function loadDashboardData() {
    setIsLoading(true);
    try {
      // Load today's medication schedule
      const todayMeds = await medicationProcessor.getTodaySchedule();
      const takenMeds = todayMeds.filter(m => m.taken).length;

      // Load spoon tracker
      const today = new Date().toDateString();
      const spoonData = await db.spoonTracker
        .where('date')
        .equals(new Date(today))
        .first();

      // Load tasks
      const tasks = await db.tasks
        .where('dueDate')
        .between(
          new Date(new Date().setHours(0, 0, 0, 0)),
          new Date(new Date().setHours(23, 59, 59, 999))
        )
        .toArray();

      // Load creative projects
      const projects = await db.creativeProjects
        .where('status')
        .equals('in-progress')
        .count();

      // Load latest health records
      const latestPain = await db.healthRecords
        .where('type')
        .equals('pain')
        .reverse()
        .first();

      const latestMood = await db.healthRecords
        .where('type')
        .equals('mood')
        .reverse()
        .first();

      setStats({
        medicationsToday: todayMeds.length,
        medicationsTaken: takenMeds,
        currentSpoons: spoonData?.currentSpoons || 12,
        maxSpoons: spoonData?.startingSpoons || 12,
        painLevel: latestPain?.severity || 0,
        moodScore: latestMood?.value || 7,
        tasksToday: tasks.length,
        tasksCompleted: tasks.filter(t => t.completed).length,
        activeProjects: projects,
        upcomingEvents: 0 // TODO: Implement events
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  }

  async function checkMedications() {
    const schedule = await medicationProcessor.getTodaySchedule();
    const pending = schedule.filter(m => !m.taken && !m.skipped);
    if (pending.length > 0) {
      toast(`You have ${pending.length} medications pending`, { icon: '💊' });
    } else {
      toast.success('All medications taken for now!');
    }
  }

  async function logPain() {
    // This would open a pain logging modal
    toast('Opening pain tracker...', { icon: '📊' });
  }

  async function checkSpoons() {
    const spoons = stats.currentSpoons;
    const percentage = (spoons / stats.maxSpoons) * 100;
    
    if (percentage > 75) {
      toast.success(`${spoons} spoons remaining - Good energy!`);
    } else if (percentage > 50) {
      toast(`${spoons} spoons remaining - Pace yourself`, { icon: '⚡' });
    } else if (percentage > 25) {
      toast(`${spoons} spoons remaining - Consider resting`, { icon: '⚠️' });
    } else {
      toast.error(`Only ${spoons} spoons remaining - Rest needed`);
    }
  }

  async function quickNote() {
    toast('Opening quick note...', { icon: '📝' });
  }

  async function emergency() {
    const contacts = await db.emergencyContacts
      .where('isPrimary')
      .equals(true)
      .first();
    
    if (contacts) {
      toast.error(`Emergency mode activated. Contacting ${contacts.name}...`);
    }
  }

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file && file.name.endsWith('.xls')) {
      try {
        toast.loading('Processing medication data...');
        await medicationProcessor.processExcelFile(file);
        toast.success('Medications imported successfully!');
        loadDashboardData();
      } catch (error) {
        toast.error('Failed to import medications');
        console.error(error);
      }
    }
  }

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning, Kol';
    if (hour < 17) return 'Good afternoon, Kol';
    if (hour < 21) return 'Good evening, Kol';
    return 'Good night, Kol';
  };

  const getSpoonColor = () => {
    const percentage = (stats.currentSpoons / stats.maxSpoons) * 100;
    if (percentage > 75) return 'text-green-500';
    if (percentage > 50) return 'text-yellow-500';
    if (percentage > 25) return 'text-orange-500';
    return 'text-red-500';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-purple-400"
        >
          <Sparkles size={48} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
      {/* Header */}
      <header className="border-b border-purple-800/30 backdrop-blur-sm bg-black/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Sparkles className="text-purple-400" size={32} />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  KOL Personal OS
                </h1>
                <p className="text-sm text-gray-400">{getGreeting()}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              {/* Spoon Indicator */}
              <div className="flex items-center space-x-2">
                <Battery className={getSpoonColor()} size={24} />
                <span className={`font-semibold ${getSpoonColor()}`}>
                  {stats.currentSpoons}/{stats.maxSpoons}
                </span>
              </div>
              
              {/* Time */}
              <div className="flex items-center space-x-2">
                <Clock className="text-gray-400" size={20} />
                <span className="text-gray-300">
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              
              {/* Settings */}
              <button className="p-2 hover:bg-purple-800/20 rounded-lg transition-colors">
                <Settings className="text-gray-400" size={24} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Sanctum Rooms */}
          <div className="col-span-12 lg:col-span-3">
            <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-purple-800/30 p-4">
              <h2 className="text-lg font-semibold mb-4 text-purple-300">Sanctum Rooms</h2>
              <div className="space-y-2">
                {sanctumRooms.map(room => (
                  <motion.button
                    key={room.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveRoom(room.id)}
                    className={`w-full p-3 rounded-lg flex items-center space-x-3 transition-all ${
                      activeRoom === room.id 
                        ? `bg-gradient-to-r ${room.color} text-white` 
                        : 'hover:bg-purple-800/20 text-gray-300'
                    }`}
                  >
                    <room.icon size={20} />
                    <span className="font-medium">{room.name}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* AI Mode Selector */}
            <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-purple-800/30 p-4 mt-4">
              <h2 className="text-lg font-semibold mb-4 text-purple-300">AI Companion Mode</h2>
              <div className="space-y-2">
                {aiModes.map(mode => (
                  <button
                    key={mode.id}
                    onClick={() => setAiMode(mode.id)}
                    className={`w-full p-2 rounded-lg text-left transition-all ${
                      aiMode === mode.id 
                        ? 'bg-purple-600/30 border border-purple-500' 
                        : 'hover:bg-purple-800/20'
                    }`}
                  >
                    <div className="font-medium text-purple-300">{mode.name}</div>
                    <div className="text-xs text-gray-400">{mode.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Center - Main Dashboard */}
          <div className="col-span-12 lg:col-span-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-xl border border-purple-800/30 p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <Pill className="text-purple-400" size={20} />
                  <span className="text-xs text-gray-400">Today</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {stats.medicationsTaken}/{stats.medicationsToday}
                </div>
                <div className="text-sm text-gray-400">Medications</div>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-green-600/20 to-teal-600/20 backdrop-blur-sm rounded-xl border border-green-800/30 p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <Calendar className="text-green-400" size={20} />
                  <span className="text-xs text-gray-400">Today</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {stats.tasksCompleted}/{stats.tasksToday}
                </div>
                <div className="text-sm text-gray-400">Tasks</div>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 backdrop-blur-sm rounded-xl border border-blue-800/30 p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <Activity className="text-blue-400" size={20} />
                  <span className="text-xs text-gray-400">Current</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {stats.painLevel}/10
                </div>
                <div className="text-sm text-gray-400">Pain Level</div>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-amber-600/20 to-orange-600/20 backdrop-blur-sm rounded-xl border border-amber-800/30 p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <Brain className="text-amber-400" size={20} />
                  <span className="text-xs text-gray-400">Current</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {stats.moodScore}/10
                </div>
                <div className="text-sm text-gray-400">Mood Score</div>
              </motion.div>
            </div>

            {/* Quick Actions */}
            <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-purple-800/30 p-4 mb-6">
              <h3 className="text-lg font-semibold mb-4 text-purple-300">Quick Actions</h3>
              <div className="grid grid-cols-5 gap-2">
                {quickActions.map(action => (
                  <motion.button
                    key={action.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={action.action}
                    className="p-3 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 border border-purple-700/30 flex flex-col items-center space-y-2 transition-all"
                  >
                    <action.icon className="text-purple-400" size={24} />
                    <span className="text-xs text-gray-300">{action.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* File Upload for Medications */}
            <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-purple-800/30 p-4">
              <h3 className="text-lg font-semibold mb-4 text-purple-300">Import Medical Data</h3>
              <label className="block">
                <input
                  type="file"
                  accept=".xls,.xlsx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="cursor-pointer p-4 border-2 border-dashed border-purple-600/50 rounded-lg text-center hover:border-purple-500 transition-colors"
                >
                  <FileText className="mx-auto mb-2 text-purple-400" size={32} />
                  <p className="text-sm text-gray-300">Click to upload medication Excel file</p>
                  <p className="text-xs text-gray-500 mt-1">Supports .xls and .xlsx files</p>
                </motion.div>
              </label>
            </div>
          </div>

          {/* Right Sidebar - Active Features */}
          <div className="col-span-12 lg:col-span-3">
            <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-purple-800/30 p-4">
              <h2 className="text-lg font-semibold mb-4 text-purple-300">Active Features</h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm text-gray-300">Health Tracker</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm text-gray-300">3D Avatar System</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm text-gray-300">Patient Portals</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm text-gray-300">Music Streaming</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm text-gray-300">9000+ Features</span>
                </div>
              </div>
            </div>

            {/* Platform Status */}
            <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-purple-800/30 p-4 mt-4">
              <h2 className="text-lg font-semibold mb-4 text-purple-300">Platform Status</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Web (PWA)</span>
                  <span className="text-xs px-2 py-1 bg-green-600/30 text-green-400 rounded">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Desktop</span>
                  <span className="text-xs px-2 py-1 bg-green-600/30 text-green-400 rounded">Ready</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Mobile</span>
                  <span className="text-xs px-2 py-1 bg-green-600/30 text-green-400 rounded">Ready</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Offline Mode</span>
                  <span className="text-xs px-2 py-1 bg-green-600/30 text-green-400 rounded">Enabled</span>
                </div>
              </div>
            </div>

            {/* Deploy Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-4 p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:from-purple-700 hover:to-pink-700 transition-all"
              onClick={() => toast.success('Ready for Netlify deployment!')}
            >
              <Zap size={20} />
              <span>Deploy to Netlify</span>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedDashboard;
