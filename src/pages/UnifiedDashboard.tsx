import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  // Health & Wellness
  Heart, Activity, Pill, Droplet, Brain, TrendingUp,
  // Education & Growth
  BookOpen, GraduationCap, Target, Lightbulb,
  // Finance & Income
  DollarSign, TrendingUp as TrendingUpAlt, Wallet, PiggyBank, Coins,
  // Productivity & Tasks
  CheckSquare, Calendar, Clock, Zap, List,
  // Entertainment & Media
  Music, Gamepad2, Film, Headphones, Book,
  // Social & Connections
  Users, MessageCircle, UserPlus, Heart as HeartIcon,
  // Home & Life
  Home, Utensils, Wrench, ShoppingCart,
  // Tech & Automation
  Settings, Cloud, Database, Link2, Bot,
  // Analytics & Insights
  BarChart3, PieChart, LineChart, TrendingDown,
  // Personal
  User, Smile, Sparkles, Star, Award
} from 'lucide-react';
import { db } from '../utils/database';

interface QuickStat {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  link: string;
}

interface FeatureCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  color: string;
  category: string;
  stats?: { label: string; value: string | number }[];
}

export default function UnifiedDashboard() {
  const [greeting, setGreeting] = useState('');
  const [stats, setStats] = useState<any>({});
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    loadGreeting();
    loadAllStats();
  }, []);

  const loadGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  };

  const loadAllStats = async () => {
    try {
      const [
        medications,
        vitals,
        tasks,
        education,
        incomeStreams,
        bodyWeather,
        pain,
        mood,
        hydration
      ] = await Promise.all([
        db.medications.count(),
        db.vitals.count(),
        db.tasks.count(),
        db.education.count(),
        db.table('incomeStreams').count(),
        db.bodyWeatherLogs.count(),
        db.pain.count(),
        db.mood.count(),
        db.hydration.count()
      ]);

      const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
      const games = JSON.parse(localStorage.getItem('games') || '[]');
      const books = JSON.parse(localStorage.getItem('books') || '[]');
      const connections = JSON.parse(localStorage.getItem('connections') || '[]');
      const meals = JSON.parse(localStorage.getItem('meals') || '[]');

      setStats({
        medications,
        vitals,
        tasks,
        education,
        incomeStreams,
        bodyWeather,
        pain,
        mood,
        hydration,
        expenses: expenses.length,
        games: games.length,
        books: books.length,
        connections: connections.length,
        meals: meals.length
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const categories = [
    { id: 'all', label: 'All Features', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'health', label: 'Health', icon: <Heart className="w-4 h-4" /> },
    { id: 'productivity', label: 'Productivity', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'finance', label: 'Finance', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'learning', label: 'Learning', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'entertainment', label: 'Entertainment', icon: <Gamepad2 className="w-4 h-4" /> },
    { id: 'social', label: 'Social', icon: <Users className="w-4 h-4" /> },
    { id: 'automation', label: 'Automation', icon: <Bot className="w-4 h-4" /> }
  ];

  const features: FeatureCard[] = [
    // === HEALTH & WELLNESS ===
    {
      title: 'Vital Signs Tracker',
      description: 'Monitor heart rate, blood pressure, temperature, oxygen levels',
      icon: <Heart className="w-6 h-6" />,
      link: '/vitals',
      color: 'from-red-600 to-pink-600',
      category: 'health',
      stats: [{ label: 'Readings', value: stats.vitals || 0 }]
    },
    {
      title: 'Body Weather System',
      description: 'Track daily symptoms, POTS monitoring, pattern analysis',
      icon: <Activity className="w-6 h-6" />,
      link: '/body-weather',
      color: 'from-cyan-600 to-blue-600',
      category: 'health',
      stats: [{ label: 'Logs', value: stats.bodyWeather || 0 }]
    },
    {
      title: 'Medication Manager',
      description: 'Track meds, refills, interactions, reminders',
      icon: <Pill className="w-6 h-6" />,
      link: '/medications',
      color: 'from-purple-600 to-indigo-600',
      category: 'health',
      stats: [{ label: 'Medications', value: stats.medications || 0 }]
    },
    {
      title: 'Hydration Tracker',
      description: 'Water intake, goals, reminders for POTS management',
      icon: <Droplet className="w-6 h-6" />,
      link: '/hydration',
      color: 'from-blue-500 to-cyan-500',
      category: 'health',
      stats: [{ label: 'Entries', value: stats.hydration || 0 }]
    },
    {
      title: 'Pain Tracker',
      description: 'Log pain levels, locations, triggers, patterns',
      icon: <TrendingDown className="w-6 h-6" />,
      link: '/pain',
      color: 'from-orange-600 to-red-600',
      category: 'health',
      stats: [{ label: 'Logs', value: stats.pain || 0 }]
    },
    {
      title: 'Mood Tracker',
      description: 'Emotional wellness, patterns, mental health insights',
      icon: <Smile className="w-6 h-6" />,
      link: '/mood',
      color: 'from-yellow-500 to-orange-500',
      category: 'health',
      stats: [{ label: 'Entries', value: stats.mood || 0 }]
    },

    // === PRODUCTIVITY & TASKS ===
    {
      title: 'Smart Task Manager',
      description: 'AI-powered task organization, priorities, deadlines',
      icon: <CheckSquare className="w-6 h-6" />,
      link: '/tasks',
      color: 'from-emerald-600 to-green-600',
      category: 'productivity',
      stats: [{ label: 'Tasks', value: stats.tasks || 0 }]
    },
    {
      title: 'Automation Engine',
      description: 'Create workflows, triggers, actions, schedules',
      icon: <Zap className="w-6 h-6" />,
      link: '/automation',
      color: 'from-yellow-600 to-amber-600',
      category: 'automation'
    },
    {
      title: 'Ideas Vault',
      description: 'Capture, organize, and develop your ideas',
      icon: <Lightbulb className="w-6 h-6" />,
      link: '/ideas',
      color: 'from-amber-600 to-yellow-600',
      category: 'productivity'
    },

    // === FINANCE & INCOME ===
    {
      title: 'Passive Income Hub',
      description: 'Track multiple income streams, analytics, growth',
      icon: <Coins className="w-6 h-6" />,
      link: '/passive-income',
      color: 'from-green-600 to-emerald-600',
      category: 'finance',
      stats: [{ label: 'Streams', value: stats.incomeStreams || 0 }]
    },
    {
      title: 'Expense Tracker',
      description: 'Monitor spending, budgets, financial health',
      icon: <Wallet className="w-6 h-6" />,
      link: '/expenses',
      color: 'from-rose-600 to-pink-600',
      category: 'finance',
      stats: [{ label: 'Expenses', value: stats.expenses || 0 }]
    },
    {
      title: 'Savings Goals',
      description: 'Set and track financial goals, progress monitoring',
      icon: <PiggyBank className="w-6 h-6" />,
      link: '/savings',
      color: 'from-teal-600 to-cyan-600',
      category: 'finance'
    },

    // === LEARNING & EDUCATION ===
    {
      title: 'Education Center',
      description: 'Courses, progress tracking, auto-resume, achievements',
      icon: <GraduationCap className="w-6 h-6" />,
      link: '/education',
      color: 'from-indigo-600 to-purple-600',
      category: 'learning',
      stats: [{ label: 'Courses', value: stats.education || 0 }]
    },
    {
      title: 'Book Library',
      description: 'Reading list, progress, notes, recommendations',
      icon: <Book className="w-6 h-6" />,
      link: '/books',
      color: 'from-purple-600 to-pink-600',
      category: 'learning',
      stats: [{ label: 'Books', value: stats.books || 0 }]
    },

    // === ENTERTAINMENT ===
    {
      title: 'Game Library',
      description: 'Track games, progress, achievements, playtime',
      icon: <Gamepad2 className="w-6 h-6" />,
      link: '/games',
      color: 'from-violet-600 to-purple-600',
      category: 'entertainment',
      stats: [{ label: 'Games', value: stats.games || 0 }]
    },
    {
      title: 'Media Center',
      description: 'Movies, TV shows, music, podcasts - all in one place',
      icon: <Film className="w-6 h-6" />,
      link: '/media',
      color: 'from-pink-600 to-rose-600',
      category: 'entertainment'
    },
    {
      title: 'Music Hub',
      description: 'Playlists, mood-based music, listening stats',
      icon: <Music className="w-6 h-6" />,
      link: '/music',
      color: 'from-fuchsia-600 to-pink-600',
      category: 'entertainment'
    },
    {
      title: 'Podcast Manager',
      description: 'Subscribe, track episodes, notes, recommendations',
      icon: <Headphones className="w-6 h-6" />,
      link: '/podcasts',
      color: 'from-orange-600 to-amber-600',
      category: 'entertainment'
    },

    // === SOCIAL & CONNECTIONS ===
    {
      title: 'Social Hub',
      description: 'Manage relationships, contacts, interactions',
      icon: <Users className="w-6 h-6" />,
      link: '/social',
      color: 'from-blue-600 to-indigo-600',
      category: 'social',
      stats: [{ label: 'Connections', value: stats.connections || 0 }]
    },
    {
      title: 'AI Conversations',
      description: 'Chat history, insights, emotional support',
      icon: <MessageCircle className="w-6 h-6" />,
      link: '/conversations',
      color: 'from-cyan-600 to-teal-600',
      category: 'social'
    },

    // === HOME & LIFE ===
    {
      title: 'Meal Planner',
      description: 'Plan meals, recipes, nutrition tracking',
      icon: <Utensils className="w-6 h-6" />,
      link: '/meals',
      color: 'from-lime-600 to-green-600',
      category: 'productivity',
      stats: [{ label: 'Meals', value: stats.meals || 0 }]
    },
    {
      title: 'Home Maintenance',
      description: 'Track repairs, schedules, warranties, tasks',
      icon: <Wrench className="w-6 h-6" />,
      link: '/home',
      color: 'from-gray-600 to-slate-600',
      category: 'productivity'
    },

    // === TECH & SYNC ===
    {
      title: 'Sync & Backup',
      description: '50+ integrations, auto-sync, cloud backup',
      icon: <Cloud className="w-6 h-6" />,
      link: '/sync',
      color: 'from-sky-600 to-blue-600',
      category: 'automation'
    },
    {
      title: 'Data Analytics',
      description: 'Comprehensive insights across all features',
      icon: <BarChart3 className="w-6 h-6" />,
      link: '/analytics',
      color: 'from-indigo-600 to-blue-600',
      category: 'automation'
    },

    // === PERSONAL ===
    {
      title: 'Avatar & Style',
      description: 'Customize your appearance, outfits, accessories',
      icon: <User className="w-6 h-6" />,
      link: '/avatar',
      color: 'from-pink-600 to-purple-600',
      category: 'productivity'
    },
    {
      title: 'Achievements',
      description: 'Track milestones, rewards, progress across all areas',
      icon: <Award className="w-6 h-6" />,
      link: '/achievements',
      color: 'from-yellow-600 to-orange-600',
      category: 'productivity'
    }
  ];

  const filteredFeatures = activeCategory === 'all'
    ? features
    : features.filter(f => f.category === activeCategory);

  const quickStats: QuickStat[] = [
    {
      label: 'Health Logs',
      value: (stats.vitals || 0) + (stats.bodyWeather || 0) + (stats.pain || 0),
      icon: <Heart className="w-5 h-5" />,
      color: 'from-red-500 to-pink-500',
      link: '/vitals'
    },
    {
      label: 'Active Tasks',
      value: stats.tasks || 0,
      icon: <CheckSquare className="w-5 h-5" />,
      color: 'from-emerald-500 to-green-500',
      link: '/tasks'
    },
    {
      label: 'Income Streams',
      value: stats.incomeStreams || 0,
      icon: <Coins className="w-5 h-5" />,
      color: 'from-green-500 to-emerald-500',
      link: '/passive-income'
    },
    {
      label: 'Learning',
      value: stats.education || 0,
      icon: <GraduationCap className="w-5 h-5" />,
      color: 'from-indigo-500 to-purple-500',
      link: '/education'
    },
    {
      label: 'Entertainment',
      value: (stats.games || 0) + (stats.books || 0),
      icon: <Gamepad2 className="w-5 h-5" />,
      color: 'from-violet-500 to-purple-500',
      link: '/games'
    },
    {
      label: 'Connections',
      value: stats.connections || 0,
      icon: <Users className="w-5 h-5" />,
      color: 'from-blue-500 to-indigo-500',
      link: '/social'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-indigo-950 to-purple-950 pl-20 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-6xl font-bold mb-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
              {greeting}
            </span>
          </h1>
          <p className="text-2xl text-indigo-300">
            Your Unified Life Management System
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8"
        >
          {quickStats.map((stat, i) => (
            <Link key={i} to={stat.link}>
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className={`bg-gradient-to-br ${stat.color} rounded-xl p-4 cursor-pointer`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {stat.icon}
                  <span className="text-sm text-white/80">{stat.label}</span>
                </div>
                <div className="text-3xl font-bold text-white">{stat.value}</div>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                activeCategory === cat.id
                  ? 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white shadow-lg shadow-purple-500/50'
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
              }`}
            >
              {cat.icon}
              <span className="font-medium">{cat.label}</span>
            </button>
          ))}
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {filteredFeatures.map((feature, i) => (
            <Link key={i} to={feature.link}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.02 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/50 rounded-xl p-5 cursor-pointer hover:border-purple-500/50 transition-all"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center mb-3`}>
                  {feature.icon}
                </div>

                <h3 className="text-lg font-bold text-white mb-2">
                  {feature.title}
                </h3>

                <p className="text-sm text-gray-400 mb-3">
                  {feature.description}
                </p>

                {feature.stats && (
                  <div className="flex gap-4">
                    {feature.stats.map((stat, j) => (
                      <div key={j} className="text-xs">
                        <div className="text-gray-500">{stat.label}</div>
                        <div className="text-white font-semibold">{stat.value}</div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </Link>
          ))}
        </motion.div>

        {/* Assistant Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-700/30 rounded-xl p-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">
                Your AI Assistant is Always Here
              </h3>
              <p className="text-purple-200">
                I'm tracking everything for you - your health, finances, learning, entertainment, and life management.
                All features are synced, backed up, and working together to make your life easier.
                Click any card above to dive into that area, or ask me anything!
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
