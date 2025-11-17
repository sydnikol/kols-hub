import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart, Brain, BookOpen, Scissors, Lightbulb, Film,
  Dice3, Scale, Sparkles, TrendingUp, Calendar, Users
} from 'lucide-react';

const featureCards = [
  {
    title: 'Health Suite',
    icon: Heart,
    description: 'Meds, vitals, body weather tracking',
    path: '/health',
    color: 'from-rose-600 to-pink-600',
    stats: '22 meds tracked',
  },
  {
    title: 'Mental Health Toolkit',
    icon: Brain,
    description: '250 spoon-aware coping strategies',
    path: '/mental-health',
    color: 'from-purple-600 to-indigo-600',
    stats: '25 categories',
  },
  {
    title: 'Learning Hub',
    icon: BookOpen,
    description: '300 micro-lessons with code templates',
    path: '/learning',
    color: 'from-blue-600 to-cyan-600',
    stats: '25 skill areas',
  },
  {
    title: 'Sewing Studio',
    icon: Scissors,
    description: '200 sensory-safe sewing projects',
    path: '/sewing',
    color: 'from-emerald-600 to-teal-600',
    stats: 'All difficulties',
  },
  {
    title: 'Ideas Vault',
    icon: Lightbulb,
    description: '500 TV/Comic/Movie concepts',
    path: '/ideas-vault',
    color: 'from-amber-600 to-orange-600',
    stats: '36 curated + 464 generated',
  },
  {
    title: 'Entertainment Hub',
    icon: Film,
    description: 'Unified media browser & watch party',
    path: '/entertainment',
    color: 'from-violet-600 to-purple-600',
    stats: 'All your favorites',
  },
  {
    title: 'The Kollective',
    icon: Dice3,
    description: 'Cozy co-op boardgame lounge',
    path: '/kollective',
    color: 'from-fuchsia-600 to-pink-600',
    stats: 'Remote play enabled',
  },
  {
    title: 'Hearing Companion',
    icon: Scale,
    description: 'Disability advocacy suite',
    path: '/hearing-companion',
    color: 'from-red-600 to-rose-600',
    stats: 'Evidence + scripts',
  },
  {
    title: 'Kitchen Witch',
    icon: Sparkles,
    description: '200+ hoodoo rituals & practices',
    path: '/kitchen-witch',
    color: 'from-yellow-600 to-amber-600',
    stats: 'Quick & complex',
  },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-indigo-950 to-purple-950 pl-20 p-8">
      {/* Header */}
      <header className="mb-12">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
          Welcome Back, Kol
        </h1>
        <p className="text-indigo-300 text-lg">
          Your self-evolving personal OS • {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </header>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4 mb-12">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 rounded-2xl p-6 border border-indigo-700/30 backdrop-blur-sm"
        >
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <span className="text-sm text-indigo-300">Spoon Level</span>
          </div>
          <div className="text-3xl font-bold text-white">3/5</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 rounded-2xl p-6 border border-indigo-700/30 backdrop-blur-sm"
        >
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-indigo-300">Events Today</span>
          </div>
          <div className="text-3xl font-bold text-white">2</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 rounded-2xl p-6 border border-indigo-700/30 backdrop-blur-sm"
        >
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-5 h-5 text-rose-400" />
            <span className="text-sm text-indigo-300">Meds Taken</span>
          </div>
          <div className="text-3xl font-bold text-white">18/22</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 rounded-2xl p-6 border border-indigo-700/30 backdrop-blur-sm"
        >
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-purple-400" />
            <span className="text-sm text-indigo-300">Support Network</span>
          </div>
          <div className="text-3xl font-bold text-white">Active</div>
        </motion.div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-3 gap-6">
        {featureCards.map((feature, index) => {
          const Icon = feature.icon;

          return (
            <Link key={feature.path} to={feature.path}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.03 }}
                className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 rounded-2xl p-6 border border-indigo-700/30 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-indigo-300 text-sm mb-4">{feature.description}</p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-indigo-400 bg-indigo-900/50 px-3 py-1 rounded-full">
                    {feature.stats}
                  </span>
                  <span className="text-purple-400 text-sm font-medium">Explore →</span>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>

      {/* Footer Note */}
      <div className="mt-12 text-center text-indigo-400 text-sm">
        <p>✨ All features work offline • Trauma-informed design • Spoon theory integrated</p>
      </div>
    </div>
  );
}
