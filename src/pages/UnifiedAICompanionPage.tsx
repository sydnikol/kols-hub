import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Heart, Users, DollarSign, Zap, Calendar, Shield, MessageCircle,
  Target, Home, Stethoscope, GraduationCap, Activity, TrendingUp, BarChart3,
  Settings, Eye, BookOpen, Palette, Sparkles, Moon, Sun, Coffee, Music,
  Star, Flame, Leaf, Waves, Wind, Mountain
} from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { Stars, Environment } from '@react-three/drei';
import { useChronoMuseStore } from '../store/chronoMuseStore';
import { useAIRoles, useDailyReport, useHealthCorrelations } from '../hooks/useAIManager';
import ChronoMuse3DAvatar from '../components/chronomuse/ChronoMuse3DAvatar';
import ChronoMuseChat from '../components/chronomuse/ChronoMuseChat';
import toast from 'react-hot-toast';

type ViewMode = 'sanctum' | 'roles' | 'analytics' | 'chat' | 'settings';
type MoodType = 'overwhelm' | 'curiosity' | 'grief' | 'focus' | 'victory' | 'calm';

interface AIRole {
  id: string;
  name: string;
  category: 'health' | 'productivity' | 'lifestyle' | 'support' | 'creative';
  description: string;
  active: boolean;
  lastActivity: string;
  tasksCompleted: number;
  icon: any;
}

/**
 * 🤖✨ UNIFIED AI COMPANION
 * Combines ChronoMuse's gothic futurist personality with AI Life Manager's practical functionality
 *
 * Features:
 * - ChronoMuse AI personality & 3D avatar
 * - Multiple AI roles (health, productivity, lifestyle, support, creative)
 * - Life management dashboard
 * - Health correlations & analytics
 * - Daily reports & insights
 * - Mood-based lighting & atmosphere
 * - 6 Sanctum rooms (Observatory, Library, Studio, Sanctuary, Bedroom, Living Room)
 */
const UnifiedAICompanionPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('sanctum');
  const [selectedRole, setSelectedRole] = useState<AIRole | null>(null);
  const [aiMessage, setAiMessage] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const {
    currentMood,
    setCurrentMood,
    currentToneMode,
    setCurrentToneMode,
    currentEra,
    energyLevel,
    lightingMode,
    musicPlaying,
  } = useChronoMuseStore();

  const { activeRoles } = useAIRoles();
  const { report } = useDailyReport();
  const { correlations } = useHealthCorrelations();

  // AI Roles with ChronoMuse personality
  const aiRoles: AIRole[] = [
    {
      id: 'health-advocate',
      name: 'Velvet Guardian',
      category: 'health',
      description: 'Your chronic illness advocate - tracks symptoms, medications, and doctor appointments',
      active: true,
      lastActivity: '2 hours ago',
      tasksCompleted: 156,
      icon: Heart
    },
    {
      id: 'creative-muse',
      name: 'Shadow Artisan',
      category: 'creative',
      description: 'Inspires creativity, manages projects, and channels gothic aesthetics',
      active: true,
      lastActivity: '30 minutes ago',
      tasksCompleted: 89,
      icon: Palette
    },
    {
      id: 'time-keeper',
      name: 'Chronos Keeper',
      category: 'productivity',
      description: 'Manages time, schedules, and productivity across eras',
      active: true,
      lastActivity: '1 hour ago',
      tasksCompleted: 234,
      icon: Calendar
    },
    {
      id: 'money-oracle',
      name: 'Gold Seer',
      category: 'lifestyle',
      description: 'Tracks income, expenses, and passive revenue streams',
      active: true,
      lastActivity: '4 hours ago',
      tasksCompleted: 67,
      icon: DollarSign
    },
    {
      id: 'soul-therapist',
      name: 'Moonlit Confidant',
      category: 'support',
      description: 'Provides emotional support, tracks mental health, and offers gentle guidance',
      active: true,
      lastActivity: '15 minutes ago',
      tasksCompleted: 423,
      icon: MessageCircle
    },
    {
      id: 'sanctuary-keeper',
      name: 'Velvet Architect',
      category: 'lifestyle',
      description: 'Manages home, creates comfort zones, and maintains sanctuary spaces',
      active: true,
      lastActivity: '3 hours ago',
      tasksCompleted: 112,
      icon: Home
    },
    {
      id: 'knowledge-curator',
      name: 'Archive Keeper',
      category: 'productivity',
      description: 'Organizes learning, tracks skills, and curates knowledge',
      active: true,
      lastActivity: '1 hour ago',
      tasksCompleted: 178,
      icon: GraduationCap
    },
    {
      id: 'shadow-fighter',
      name: 'Obsidian Guardian',
      category: 'support',
      description: 'Protects boundaries, advocates for needs, and fights battles',
      active: true,
      lastActivity: '6 hours ago',
      tasksCompleted: 45,
      icon: Shield
    }
  ];

  // Mood presets with ChronoMuse personality
  const moodPresets = [
    { mood: 'overwhelm', icon: Waves, label: 'Overwhelmed', color: '#4a7f7f', description: 'Dim silver-blue, low-stim mode' },
    { mood: 'curiosity', icon: Sparkles, label: 'Curious', color: '#7f7f4a', description: 'Warm candlelight, exploration' },
    { mood: 'grief', icon: Moon, label: 'Grieving', color: '#4a4a7f', description: 'Rain-lit blues, gentle support' },
    { mood: 'focus', icon: Target, label: 'Focused', color: '#6f6f6f', description: 'Monochrome clarity' },
    { mood: 'victory', icon: Star, label: 'Victorious', color: '#7f6f4a', description: 'Soft gold celebration' },
    { mood: 'calm', icon: Leaf, label: 'Calm', color: '#5f7f5f', description: 'Velvet shadows, peace' }
  ];

  // Handle AI message
  const handleAISpeak = (message: string) => {
    setAiMessage(message);
    setIsSpeaking(true);
    setTimeout(() => setIsSpeaking(false), 5000);
  };

  // Simulate AI greeting on mount
  useEffect(() => {
    setTimeout(() => {
      handleAISpeak("Welcome to the Sanctum. I'm ChronoMuse, your AI life companion. How may I assist you today?");
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0F] via-[#1A1A24] to-[#1A1A24] overflow-hidden">
      {/* Ambient 3D Background */}
      <div className="fixed inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={0.5} />
          <Environment preset="night" />
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={0.5} color="#7c3aed" />
        </Canvas>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Header */}
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="bg-black/40 backdrop-blur-xl border-b border-purple-500/30 p-6"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="p-4 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-lg shadow-purple-500/50"
              >
                <Brain className="w-10 h-10 text-white" />
              </motion.div>

              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                  ChronoMuse AI Companion
                </h1>
                <p className="text-purple-400 mt-1">
                  Gothic Futurist Life Manager • {aiRoles.filter(r => r.active).length} Active Roles • Energy: {energyLevel}%
                </p>
              </div>
            </div>

            {/* Current Mood Indicator */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm text-gray-400">Current Mood</p>
                <p className="text-lg font-semibold text-white capitalize">{currentMood}</p>
              </div>
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${moodPresets.find(m => m.mood === currentMood)?.color || '#6633cc'} 0%, #000 100%)`,
                  boxShadow: `0 0 30px ${moodPresets.find(m => m.mood === currentMood)?.color || '#6633cc'}`
                }}
              >
                {React.createElement(moodPresets.find(m => m.mood === currentMood)?.icon || Sparkles, {
                  size: 24,
                  className: 'text-white'
                })}
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="max-w-7xl mx-auto mt-6 flex gap-2 overflow-x-auto pb-2">
            {[
              { id: 'sanctum', label: 'Sanctum', icon: Eye },
              { id: 'roles', label: 'AI Roles', icon: Users },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 },
              { id: 'chat', label: 'Chat', icon: MessageCircle },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setViewMode(tab.id as ViewMode)}
                className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all ${
                  viewMode === tab.id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50'
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content Area */}
        <div className="max-w-7xl mx-auto p-6">
          <AnimatePresence mode="wait">
            {/* SANCTUM VIEW - 3D Avatar + Chat */}
            {viewMode === 'sanctum' && (
              <motion.div
                key="sanctum"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                {/* 3D Avatar */}
                <div className="bg-black/40 backdrop-blur-xl rounded-3xl border border-purple-500/30 overflow-hidden" style={{ height: '600px' }}>
                  <ChronoMuse3DAvatar
                    aiMessage={aiMessage}
                    isSpeaking={isSpeaking}
                    isListening={isListening}
                  />
                </div>

                {/* Mood Controls & Quick Actions */}
                <div className="space-y-6">
                  {/* Mood Selector */}
                  <div className="bg-black/40 backdrop-blur-xl rounded-3xl border border-purple-500/30 p-6">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <Palette className="text-purple-400" size={24} />
                      Sanctuary Mood
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {moodPresets.map(preset => (
                        <motion.button
                          key={preset.mood}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setCurrentMood(preset.mood as MoodType);
                            toast(`Mood set to ${preset.label}`, { icon: React.createElement(preset.icon, { size: 20 }) });
                          }}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            currentMood === preset.mood
                              ? 'bg-gradient-to-br from-purple-600/50 to-pink-600/50 border-purple-400'
                              : 'bg-gray-800/50 border-gray-700 hover:border-purple-500/50'
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            {React.createElement(preset.icon, {
                              size: 24,
                              className: currentMood === preset.mood ? 'text-purple-300' : 'text-gray-400'
                            })}
                            <span className={`font-semibold ${currentMood === preset.mood ? 'text-white' : 'text-gray-400'}`}>
                              {preset.label}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">{preset.description}</p>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Daily Report */}
                  <div className="bg-black/40 backdrop-blur-xl rounded-3xl border border-purple-500/30 p-6">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <Activity className="text-pink-400" size={24} />
                      Today's Report
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                        <span className="text-gray-400">Tasks Completed</span>
                        <span className="text-white font-bold">23/30</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                        <span className="text-gray-400">Energy Level</span>
                        <span className="text-purple-400 font-bold">{energyLevel}%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                        <span className="text-gray-400">Active Roles</span>
                        <span className="text-pink-400 font-bold">{aiRoles.filter(r => r.active).length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* AI ROLES VIEW */}
            {viewMode === 'roles' && (
              <motion.div
                key="roles"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {aiRoles.map(role => (
                    <motion.div
                      key={role.id}
                      whileHover={{ scale: 1.05, y: -5 }}
                      onClick={() => setSelectedRole(role)}
                      className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 cursor-pointer hover:border-purple-500 transition-all"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl">
                          {React.createElement(role.icon, { size: 24, className: 'text-white' })}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-white">{role.name}</h3>
                          <p className="text-xs text-gray-400 capitalize">{role.category}</p>
                        </div>
                        {role.active && (
                          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                        )}
                      </div>

                      <p className="text-sm text-gray-400 mb-4">{role.description}</p>

                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Last active</span>
                        <span className="text-purple-400">{role.lastActivity}</span>
                      </div>

                      <div className="flex justify-between text-xs mt-2">
                        <span className="text-gray-500">Tasks completed</span>
                        <span className="text-pink-400 font-bold">{role.tasksCompleted}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ANALYTICS VIEW */}
            {viewMode === 'analytics' && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-black/40 backdrop-blur-xl rounded-3xl border border-purple-500/30 p-8"
              >
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <TrendingUp className="text-purple-400" size={28} />
                  Life Analytics
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-2xl p-6 border border-purple-500/30">
                    <div className="text-4xl font-bold text-white mb-2">89%</div>
                    <div className="text-gray-400">Health Tracking</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 rounded-2xl p-6 border border-blue-500/30">
                    <div className="text-4xl font-bold text-white mb-2">156</div>
                    <div className="text-gray-400">Tasks This Week</div>
                  </div>
                  <div className="bg-gradient-to-br from-pink-900/40 to-purple-900/40 rounded-2xl p-6 border border-pink-500/30">
                    <div className="text-4xl font-bold text-white mb-2">$2,340</div>
                    <div className="text-gray-400">Passive Income</div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* CHAT VIEW */}
            {viewMode === 'chat' && (
              <motion.div
                key="chat"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                style={{ height: '70vh' }}
              >
                <ChronoMuseChat />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default UnifiedAICompanionPage;
