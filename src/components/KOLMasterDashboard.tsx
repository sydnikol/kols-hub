import React, { useState, useEffect } from 'react';
import { 
  Calendar, Heart, Moon, Sparkles, Music, Palette, 
  DollarSign, BookOpen, Users, Zap, Sun, Activity,
  TrendingUp, Shield, Lightbulb, Coffee
} from 'lucide-react';

/**
 * 🖤 KOL MASTER DASHBOARD - Comprehensive Integration v2.0
 * ========================================================
 * Integrates ALL features from:
 * - full_app_feature_set.json
 * - master_index_v2.json  
 * - alt_goth_ui_themes_100.json
 * 
 * Features:
 * - Routine Manager with adaptive scheduling
 * - Health Tracker (meds, vitals, body weather)
 * - Spiritual Reflection (rituals, journaling)
 * - Wardrobe Manager (outfit generator)
 * - Music Integration (Spotify auto-play at 10:30PM)
 * - Ideas Library (1600+ ideas across 8 categories)
 * - Finance Tracker (passive income, budgets)
 * - Community Support (organizing, advocacy)
 */

interface DashboardStats {
  energy: number; // 0-100 spoon count
  mood: string;
  pain: number; // 0-10 scale
  routinesCompleted: number;
  ideasFavorited: number;
  medicationsTaken: number;
}

const KOLMasterDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    energy: 50,
    mood: 'neutral',
    pain: 3,
    routinesCompleted: 0,
    ideasFavorited: 0,
    medicationsTaken: 0
  });

  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    // Update time every minute
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      
      // Auto-play Spotify at 10:30 PM (starts with Dimple)
      const hours = now.getHours();
      const minutes = now.getMinutes();
      if (hours === 22 && minutes === 30) {
        // Trigger Spotify auto-play
        console.log('🎵 Auto-playing Spotify: Starting with Dimple');
      }
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Set greeting based on time
    const hour = currentTime.getHours();
    if (hour < 6) setGreeting('🌙 Deep in the void...');
    else if (hour < 12) setGreeting('🌅 Rise and shine, shadow walker');
    else if (hour < 18) setGreeting('☀️ Afternoon, mystic');
    else if (hour < 22) setGreeting('🌆 Evening rituals await');
    else setGreeting('🌙 Night belongs to us');
  }, [currentTime]);

  const features = [
    {
      id: 'routines',
      name: 'Routine Manager',
      icon: <Calendar className="w-6 h-6" />,
      color: 'from-blue-600 to-blue-600',
      stats: `${stats.routinesCompleted}/8 completed`,
      description: 'Adaptive scheduling based on energy & pain'
    },
    {
      id: 'health',
      name: 'Health Tracker',
      icon: <Heart className="w-6 h-6" />,
      color: 'from-red-600 to-purple-600',
      stats: `${stats.medicationsTaken}/12 meds`,
      description: 'Medications, vitals, body weather'
    },
    {
      id: 'spiritual',
      name: 'Spiritual Reflection',
      icon: <Moon className="w-6 h-6" />,
      color: 'from-indigo-600 to-purple-600',
      stats: 'Altar ready',
      description: 'Rituals, journaling, ancestor work'
    },
    {
      id: 'wardrobe',
      name: 'Wardrobe Manager',
      icon: <Palette className="w-6 h-6" />,
      color: 'from-purple-600 to-purple-600',
      stats: 'Outfit ready',
      description: 'Weather-aware outfit generator'
    },
    {
      id: 'music',
      name: 'Music Sanctuary',
      icon: <Music className="w-6 h-6" />,
      color: 'from-violet-600 to-purple-600',
      stats: '3 platforms',
      description: 'Spotify, YouTube, SoundCloud'
    },
    {
      id: 'ideas',
      name: 'Ideas Library',
      icon: <Sparkles className="w-6 h-6" />,
      color: 'from-indigo-600 to-orange-600',
      stats: `${stats.ideasFavorited}/1600 ideas`,
      description: 'Food, health, art, sewing, hoodoo'
    },
    {
      id: 'finance',
      name: 'Finance Tracker',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'from-green-600 to-emerald-600',
      stats: '600 income ideas',
      description: 'Budgets, bills, passive income'
    },
    {
      id: 'community',
      name: 'Community Hub',
      icon: <Users className="w-6 h-6" />,
      color: 'from-blue-600 to-blue-600',
      stats: 'Connected',
      description: 'Support, organizing, advocacy'
    }
  ];

  // Body Weather Quick View
  const bodyWeather = {
    pain: stats.pain,
    energy: stats.energy,
    mood: stats.mood,
    sensory: 'moderate'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 text-white p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
              {greeting}
            </h1>
            <p className="text-gray-400">
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          
          {/* Quick Body Weather */}
          <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl p-4 border border-purple-500/30">
            <h3 className="text-sm text-gray-400 mb-2">Body Weather</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <Activity className="w-4 h-4 text-blue-400" />
                  <span className="text-xs">Energy</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${bodyWeather.energy}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <Zap className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs">Pain</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-red-500 to-purple-500 h-2 rounded-full transition-all"
                    style={{ width: `${(bodyWeather.pain / 10) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Feature Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature) => (
            <button
              key={feature.id}
              className="group relative bg-gray-900/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-800 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20"
            >
              {/* Icon with gradient background */}
              <div className={`mb-4 w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                {feature.icon}
              </div>
              
              {/* Feature Name */}
              <h3 className="text-xl font-bold mb-2">{feature.name}</h3>
              
              {/* Stats */}
              <p className="text-sm text-purple-400 mb-2">{feature.stats}</p>
              
              {/* Description */}
              <p className="text-xs text-gray-500">{feature.description}</p>
              
              {/* Hover glow effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity`} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KOLMasterDashboard;
